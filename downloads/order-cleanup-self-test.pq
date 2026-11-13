// Run after creating a query named OrderCleanup.
// Self-contained fictional inputs: no network or external file connection.
let
    FirstCSV = """order_id"",""line_id"",""order_date"",""customer_code"",""phone"",""sku"",""quantity"",""unit_price_rm"",""discount_rm"",""status"",""note""#(lf)""000101"",""1"",""26/10/2026"",""C001"",""0123456789"",""NOTE-A5"",""2"",""RM12.50"",""RM0.00"",""Shipped"",""Front desk""#(lf)""000101"",""2"",""26/10/2026"",""C001"",""0123456789"",""PEN-BLK"",""3"",""RM3.20"",""RM0.00"",""Shipped"",""Same order, different line""#(lf)""000102"",""1"",""27/10/2026"",""C002"",""01123456789"",""MUG-WHT"",""1"",""RM25.00"",""RM5.00"",""Shipped"",""Gift, no price tag""#(lf)""000103"",""1"",""28/10/2026"",""C003"",""0134567890"",""NOTE-A5"",""4"",""RM12.50"",""RM2.00"",""Shipped"",""Leave with reception""#(lf)""000103"",""1"",""28/10/2026"",""C003"",""0134567890"",""NOTE-A5"",""4"",""RM12.50"",""RM2.00"",""Shipped"",""Leave with reception""#(lf)""000104"",""1"",""29/10/2026"",""C004"",""0145678901"",""BAG-CNV"",""2"",""RM35.00"",""RM0.00"",""Cancelled"",""Order cancelled""#(lf)""000105"",""1"",""30/10/2026"",""C005"",""0156789012"",""MUG-WHT"",""2"",""RM25.00"",""RM0.00"",""Shipped"",""Line one#(lf)Line two""#(lf)""000106"",""1"",""31/10/2026"",""C006"",""0167890123"",""BAG-CNV"",""1"",""RM35.00"",""RM5.00"",""Shipped"",""Call before delivery""#(lf)""000107"",""1"",""01/11/2026"",""C007"",""0178901234"",""PEN-BLK"",""10"",""RM3.20"",""RM2.00"",""Shipped"",""Public sample only""#(lf)""000108"",""1"",""01/11/2026"",""C008"",""0189012345"",""NOTE-A5"",""1"",""RM12.50"",""RM0.00"",""Pending"",""Awaiting payment""#(lf)""000109"",""1"",""25/10/2026"",""C009"",""0190123456"",""BAG-CNV"",""1"",""RM35.00"",""RM0.00"",""Shipped"",""Before reporting week""#(lf)""000110"",""1"",""02/11/2026"",""C010"",""0101234567"",""MUG-WHT"",""1"",""RM25.00"",""RM0.00"",""Shipped"",""After reporting week""#(lf)""000111"",""1"",""28/10/2026"",""C011"",""0122222222"",""NOTE-A5"",""2"",""RM12.50"",""RM5.00"",""Shipped"",""Fictional record""#(lf)""000112"",""1"",""30/10/2026"",""C012"",""0133333333"",""BAG-CNV"",""1"",""RM35.00"",""RM0.00"",""Shipped"",""Fictional record""#(lf)",
    SecondCSV = """order_id"",""line_id"",""order_date"",""customer_code"",""phone"",""sku"",""quantity"",""unit_price_rm"",""discount_rm"",""status"",""note""#(lf)""000201"",""1"",""02/11/2026"",""C020"",""0120000001"",""NOTE-A5"",""3"",""RM12.50"",""RM2.50"",""Shipped"",""Next-week refresh sample""#(lf)""000202"",""1"",""03/11/2026"",""C021"",""0120000002"",""MUG-WHT"",""2"",""RM25.00"",""RM0.00"",""Shipped"",""Next-week refresh sample""#(lf)",
    Summarize = (label as text, csv as text, remove as logical, start as date, finish as date) as record =>
        let
            Prepared = OrderCleanup(csv, remove),
            Included = Table.SelectRows(Prepared, each [order_date] >= start and [order_date] < finish and [status] = "Shipped"),
            Rows = Table.ToRecords(Included)
        in [test=label, prepared_rows=Table.RowCount(Prepared), included_lines=Table.RowCount(Included), orders=List.Count(List.Distinct(Included[order_id])), units=List.Sum(Included[quantity]), net_rm=List.Sum(Included[net_rm]), first_id=Prepared{0}[order_id]],
    Result = Table.FromRecords({
        Summarize("Known repeat removed", FirstCSV, true, #date(2026,10,26), #date(2026,11,2)),
        Summarize("Repeat retained", FirstCSV, false, #date(2026,10,26), #date(2026,11,2)),
        Summarize("Second source", SecondCSV, false, #date(2026,11,2), #date(2026,11,9))
    })
in
    Result
