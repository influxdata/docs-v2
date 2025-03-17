## How Data Flows Through InfluxDB 3

When data is written to {{% product-name %}}, it progresses through multiple stages to ensure durability, optimize performance, and enable efficient querying. Configuration options at each stage affect system behavior, balancing reliability and resource usage.

### Write Path Overview

{{% product-name %}} processes data through the following stages to ensure durability, query performance, and efficient storage:

1. [Write validation](#write-validation)

2. [Memory buffer](#memory-buffer) 

3. [Write-Ahead Log (WAL) persistence](#wal-persistence)

4. [Queryable buffer](#query-availability) 

5. [Parquet storage](#parquet-storage) 

6. [In-memory cache](#in-memory-cache) 


##### Write Validation

- Process: The Ingest Router receives the write request and validates incoming data before accepting it into the system.
     
- Impact: Prevents malformed or unsupported data from entering the database.

##### Memory Buffer

- Process: Incoming writes are stored in an in-memory buffer before persistence.

- Impact: Increases ingestion efficiency by allowing batch processing.

- Tradeoff: Larger batches improve throughput but require more memory.

##### WAL Persistence

- Process: The write buffer is flushed to the WAL every second (default).

- Impact: Ensures durability by persisting data to object storage.

- Tradeoff: More frequent flushing improves durability but increases I/O overhead.

##### Query Availability

- Process: After WAL persistence, data moves to the queryable buffer.

- Impact: Enables fast queries on recent data.

- Tradeoff: A larger buffer speeds up queries but increases memory usage.

##### Parquet Storage

- Process: Every ten minutes (default), data is persisted to Parquet files in object storage.

- Impact: Provides durable, long-term storage.

- Tradeoff: More frequent persistence reduces reliance on the WAL but increases I/O costs.

##### In-Memory Cache

- Process: Recently persisted Parquet files are cached in memory.

- Impact: Reduces query latency by minimizing object storage access.

## Data flow

As data moves through InfluxDB 3, it follows a structured path to ensure durability, efficient querying, and optimized storage. 

The figure below shows how written data flows through the database.

{{< img-hd src="/img/influxdb/influxdb-3-write-path.png" alt="Write Path for InfluxDB 3 Core & Enterprise" />}}

1. **Incoming writes**: The system validates incoming data and stores it in the write buffer (in memory). If [`no_sync=true`](#no-sync-write-option), the server sends a response to acknowledge the write.
2. **WAL flush**: Every second (default), the system flushes the write buffer to the Write-Ahead Log (WAL) for persistence in the Object store. If [`no_sync=false`](#no-sync-write-option) (default), the server sends a response to acknowledge the write.
3. **Query availability**: After WAL persistence completes, data moves to the queryable buffer where it becomes available for queries. By default, the server keeps up to 900 WAL files (15 minutes of data) buffered.
4. **Long-term storage in Parquet**: Every ten minutes (default), the system persists the oldest data from the queryable buffer to the Object store in Parquet format. InfluxDB keeps the remaining data (the most recent 5 minutes) in memory.
5. **In-memory cache**: InfluxDB puts Parquet files into an in-memory cache so that queries against the most recently persisted data don't have to go to object storage.