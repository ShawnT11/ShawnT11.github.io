// Name this blank query OrderCleanup. It returns a function.
// Scope: this site's 11-column, day-first, non-negative RM sample.
(csvText as text, optional removeConfirmedExactRepeats as nullable logical) as table =>
let
    Expected = {"order_id", "line_id", "order_date", "customer_code", "phone", "sku", "quantity", "unit_price_rm", "discount_rm", "status", "note"},
    Parsed = Csv.Document(Text.ToBinary(csvText, TextEncoding.Utf8), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Header = if Table.IsEmpty(Parsed) then error "Empty source" else Record.FieldValues(Parsed{0}),
    SchemaOK = List.Count(Header) = List.Count(Expected) and List.Count(List.Distinct(Header)) = List.Count(Header) and List.IsEmpty(List.Difference(Expected, Header)),
    Promoted = if SchemaOK then Table.PromoteHeaders(Parsed, [PromoteAllScalars=true]) else error "Expected the 11 unique sample column names; review changed or extra columns",
    // Compare the original strings before converting dates or money.
    Prepared = if removeConfirmedExactRepeats = true then Table.Distinct(Promoted, Expected) else Promoted,
    WithSourceDate = Table.DuplicateColumn(Prepared, "order_date", "source_order_date"),
    WithSourcePrice = Table.DuplicateColumn(WithSourceDate, "unit_price_rm", "source_unit_price_rm"),
    WithSourceDiscount = Table.DuplicateColumn(WithSourcePrice, "discount_rm", "source_discount_rm"),
    ParseMoney = (value as text) as number =>
        let
            Trimmed = Text.Trim(value),
            Amount = if Text.StartsWith(Trimmed, "RM") then Text.Trim(Text.Range(Trimmed, 2)) else Trimmed,
            Pieces = Text.Split(Amount, "."),
            Whole = Pieces{0},
            Fraction = if List.Count(Pieces) = 2 then Pieces{1} else "",
            Digits = (s as text) as logical => Text.Length(s) > 0 and Text.Select(s, {"0".."9"}) = s,
            // This teaching query deliberately rejects thousands separators.
            Valid = List.Count(Pieces) <= 2 and Digits(Whole) and (List.Count(Pieces) = 1 or (Digits(Fraction) and Text.Length(Fraction) <= 2))
        in if Valid then Currency.From(Number.FromText(Amount, "en-US")) else error "Invalid non-negative decimal RM amount (no thousands separators supported)",
    Typed = Table.TransformColumns(WithSourceDiscount, {
        {"order_date", each Date.FromText(_, [Format="dd/MM/yyyy", Culture="en-GB"]), type date},
        {"quantity", each let q = Number.FromText(_, "en-US") in if q > 0 and Number.RoundDown(q) = q then Int64.From(q) else error "Quantity must be a positive integer", Int64.Type},
        {"unit_price_rm", ParseMoney, Currency.Type},
        {"discount_rm", ParseMoney, Currency.Type}
    }),
    WithGross = Table.AddColumn(Typed, "gross_rm", each [quantity] * [unit_price_rm], Currency.Type),
    WithNet = Table.AddColumn(WithGross, "net_rm", each if [discount_rm] <= [gross_rm] then [gross_rm] - [discount_rm] else error "Discount exceeds line gross", Currency.Type),
    // IDs remain the original CSV strings. Do not change them to numbers.
    Result = Table.TransformColumnTypes(WithNet, {{"order_id", type text}, {"line_id", type text}, {"customer_code", type text}, {"phone", type text}, {"sku", type text}, {"status", type text}, {"note", type text}})
in
    Result
