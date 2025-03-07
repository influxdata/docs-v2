How Data Flows Through InfluxDB 3

When you write data to InfluxDB 3, it moves through several stages, balancing performance, durability, and query efficiency. Configuration options impact each stage, offering tradeoffs in reliability and system overhead.

1. Write Validation
Process: InfluxDB validates incoming data and rejects invalid points with an HTTP 400 error.
2. Memory Buffer
Process: Valid data is temporarily stored in an in-memory write buffer before persistence.
Impact: Larger ingestion batches improve throughput but increase memory usage.
3. WAL Persistence
Process: Every second (default), InfluxDB flushes the write buffer to Write-Ahead Log (WAL) files in object storage.
Impact: The WAL flush interval determines how often data is persisted. More frequent flushing improves durability but increases I/O.
Tradeoff: By default, write requests are acknowledged only after WAL persistence, ensuring durability. However, enabling the no_sync option acknowledges writes before WAL persistence, reducing latency but increasing the risk of data loss if a failure occurs.
4. Query Availability
Process: Once persisted to the WAL, data moves to the queryable buffer, making it available for queries.
Impact: The size of the queryable buffer determines how much recent data stays in memory.
Tradeoff: A larger buffer speeds up queries but increases memory usage. A smaller buffer reduces memory footprint but may slow queries as older data needs to be retrieved from storage.
5. Parquet Storage
Process: Every 10 minutes (default), InfluxDB writes data from the queryable buffer to object storage as Parquet files.
Impact: The persistence interval controls how often data is written to long-term storage.
Tradeoff: More frequent persistence improves durability and reduces reliance on the WAL but increases I/O costs. Less frequent persistence conserves resources but may delay access to historical data.
This architecture ensures efficient write handling, fast query performance, and reliable long-term storage. Adjust these options to optimize InfluxDB 3 for your workload.