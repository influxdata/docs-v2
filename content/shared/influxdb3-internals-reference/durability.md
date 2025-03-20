## How data flows through {{% product-name %}}

When data is written to {{% product-name %}}, it progresses through multiple stages to ensure durability, optimize performance, and enable efficient querying. Configuration options at each stage affect system behavior, balancing reliability and resource usage.

## Data flow

As data moves through {{% product-name %}}, it follows a structured path to ensure durability, efficient querying, and optimized storage.

The figure below shows how written data flows through the database.

{{< img-hd src="/img/influxdb/influxdb-3-write-path.png" alt="Write Path for InfluxDB 3 Core & Enterprise" />}}

1. [Write validation and memory buffer](#1-write-validation-and-memory-buffer)
2. [Write-ahead log (WAL) persistence](#2-write-ahead-log-wal-persistence)
3. [Query availability](#3-query-availability)
4. [Parquet storage](#4-parquet-storage)
5. [In-memory cache](#5-in-memory-cache)

### Write validation and memory buffer

- **Process**: InfluxDB validates incoming data before accepting it into the system.
- **Impact**: Prevents malformed or unsupported data from entering the database.
- **Details**: The system validates incoming data and stores it in the write buffer (in memory). If [`no_sync=true`](#no-sync-write-option), the server sends a response to acknowledge the write.

### Write-ahead log (WAL) persistence

- **Process**: The system flushes the write buffer to the WAL every second (default).
- **Impact**: Ensures durability by persisting data to object storage.
- **Tradeoff**: More frequent flushing improves durability but increases I/O overhead.
- **Details**: Every second (default), the system flushes the write buffer to the Write-Ahead Log (WAL) for persistence in the Object store. If [`no_sync=false`](#no-sync-write-option) (default), the server sends a response to acknowledge the write.

### Query availability

- **Process**: The system moves data to the queryable buffer after WAL persistence.
- **Impact**: Enables fast queries on recent data.
- **Tradeoff**: A larger buffer speeds up queries but increases memory usage.
- **Details**: After WAL persistence completes, data moves to the queryable buffer where it becomes available for queries. By default, the server keeps up to 900 WAL files (15 minutes of data) buffered.

### Parquet storage

- **Process**: Every ten minutes (default), data is persisted to Parquet files in object storage.
- **Impact**: Provides durable, long-term storage.
- **Tradeoff**: More frequent persistence reduces reliance on the WAL but increases I/O costs.
- **Details**: Every ten minutes (default), the system persists the oldest data from the queryable buffer to the Object store in Parquet format. InfluxDB keeps the remaining data (the most recent 5 minutes) in memory.

### In-memory cache

- **Process**: Recently persisted Parquet files are cached in memory.
- **Impact**: Reduces query latency by minimizing object storage access.
- **Details**: InfluxDB puts Parquet files into an in-memory cache so that queries against the most recently persisted data don't have to go to object storage.
