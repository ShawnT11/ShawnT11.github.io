// Create OrderCleanup from order-cleanup-function.pq first.
// Edit SourcePath to your local COPY of orders-messy.csv.
let
    SourcePath = "C:\your-folder\orders-messy.csv",
    RemoveConfirmedExactRepeats = false,
    CSV = Text.FromBinary(File.Contents(SourcePath), TextEncoding.Utf8),
    Result = OrderCleanup(CSV, RemoveConfirmedExactRepeats)
in
    Result
