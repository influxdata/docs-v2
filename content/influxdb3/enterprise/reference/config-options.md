---
title: InfluxDB 3 Enterprise configuration options
description: >
  Use InfluxDB 3 configuration options to configure your InfluxDB 3 Enterprise server.
menu:
  influxdb3_enterprise:
    parent: Reference
    name: Configuration options
weight: 100
draft: true
---

<!-- This is just a draft to contain notes for future work -->

## Global configuration options

## Server configuration options

Options:
      --object-store <object-store>
          Which object storage to use. If not specified, defaults to memory. [env: INFLUXDB3_OBJECT_STORE=] [possible values: memory, memory-throttled, file, s3, google, azure]
      --bucket <bucket>
          Name of the bucket to use for the object store. Must also set `--object-store` to a cloud object storage to have any effect [env: INFLUXDB3_BUCKET=]
      --data-dir <data-dir>
          The location InfluxDB 3 Enterprise will use to store files locally [env: INFLUXDB3_DB_DIR=]
      --aws-access-key-id <aws-access-key-id>
          When using Amazon S3 as the object store, set this to an access key that has permission to read from and write to the specified S3 bucket [env: AWS_ACCESS_KEY_ID=] [default: ]
      --aws-secret-access-key <aws-secret-access-key>
          When using Amazon S3 as the object store, set this to the secret access key that goes with the specified access key ID [env: AWS_SECRET_ACCESS_KEY=] [default: ]
      --aws-default-region <aws-default-region>
          When using Amazon S3 as the object store, set this to the region that goes with the specified bucket if different from the fallback value [env: AWS_DEFAULT_REGION=] [default: us-east-1]
      --aws-endpoint <aws-endpoint>
          When using Amazon S3 compatibility storage service, set this to the endpoint [env: AWS_ENDPOINT=]
      --aws-session-token <aws-session-token>
          When using Amazon S3 as an object store, set this to the session token. This is handy when using a federated login / SSO and you fetch credentials via the UI [env: AWS_SESSION_TOKEN=]
      --aws-allow-http
          Allow unencrypted HTTP connection to AWS [env: AWS_ALLOW_HTTP=]
      --aws-skip-signature
          If enabled, S3 stores will not fetch credentials and will not sign requests [env: AWS_SKIP_SIGNATURE=]
      --google-service-account <google-service-account>
          When using Google Cloud Storage as the object store, set this to the path to the JSON file that contains the Google credentials [env: GOOGLE_SERVICE_ACCOUNT=]
      --azure-storage-account <azure-storage-account>
          When using Microsoft Azure as the object store, set this to the name you see when going to All Services > Storage accounts > `[name]` [env: AZURE_STORAGE_ACCOUNT=]
      --azure-storage-access-key <azure-storage-access-key>
          When using Microsoft Azure as the object store, set this to one of the Key values in the Storage account's Settings > Access keys [env: AZURE_STORAGE_ACCESS_KEY=]
      --object-store-connection-limit <object-store-connection-limit>
          When using a network-based object store, limit the number of connection to this value [env: OBJECT_STORE_CONNECTION_LIMIT=] [default: 16]
      --object-store-http2-only
          Force HTTP/2 connection to network-based object stores [env: OBJECT_STORE_HTTP2_ONLY=]
      --object-store-http2-max-frame-size <object-store-http2-max-frame-size>
          Set max frame size (in bytes/octets) for HTTP/2 connection [env: OBJECT_STORE_HTTP2_MAX_FRAME_SIZE=]
      --object-store-max-retries <object-store-max-retries>
          The maximum number of times to retry a request [env: OBJECT_STORE_MAX_RETRIES=]
      --object-store-retry-timeout <object-store-retry-timeout>
          The maximum length of time from the initial request after which no further retries will be attempted [env: OBJECT_STORE_RETRY_TIMEOUT=]
  -h, --help
          Print help information
      --object-store-cache-endpoint <object-store-cache-endpoint>
          Endpoint of an S3 compatible, HTTP/2 enabled object store cache [env: OBJECT_STORE_CACHE_ENDPOINT=]
      --log-filter <LOG_FILTER>
          Logs: filter directive [env: LOG_FILTER=]
  -v, --verbose...
          Logs: filter short-hand
      --log-destination <LOG_DESTINATION>
          Logs: destination [env: LOG_DESTINATION=] [default: stdout]
      --log-format <LOG_FORMAT>
          Logs: message format [env: LOG_FORMAT=] [default: full]
      --traces-exporter <TRACES_EXPORTER>
          Tracing: exporter type [env: TRACES_EXPORTER=] [default: none]
      --traces-exporter-jaeger-agent-host <TRACES_EXPORTER_JAEGER_AGENT_HOST>
          Tracing: Jaeger agent network hostname [env: TRACES_EXPORTER_JAEGER_AGENT_HOST=] [default: 0.0.0.0]
      --traces-exporter-jaeger-agent-port <TRACES_EXPORTER_JAEGER_AGENT_PORT>
          Tracing: Jaeger agent network port [env: TRACES_EXPORTER_JAEGER_AGENT_PORT=] [default: 6831]
      --traces-exporter-jaeger-service-name <TRACES_EXPORTER_JAEGER_SERVICE_NAME>
          Tracing: Jaeger service name [env: TRACES_EXPORTER_JAEGER_SERVICE_NAME=] [default: iox-conductor]
      --traces-exporter-jaeger-trace-context-header-name <TRACES_JAEGER_TRACE_CONTEXT_HEADER_NAME>
          Tracing: specifies the header name used for passing trace context [env: TRACES_EXPORTER_JAEGER_TRACE_CONTEXT_HEADER_NAME=] [default: uber-trace-id]
      --traces-jaeger-debug-name <TRACES_JAEGER_DEBUG_NAME>
          Tracing: specifies the header name used for force sampling [env: TRACES_EXPORTER_JAEGER_DEBUG_NAME=] [default: jaeger-debug-id]
      --traces-jaeger-tags <TRACES_JAEGER_TAGS>
          Tracing: set of key=value pairs to annotate tracing spans with [env: TRACES_EXPORTER_JAEGER_TAGS=]
      --traces-jaeger-max-msgs-per-second <TRACES_JAEGER_MAX_MSGS_PER_SECOND>
          Tracing: Maximum number of message sent to a Jaeger service, per second [env: TRACES_JAEGER_MAX_MSGS_PER_SECOND=] [default: 1000]
      --datafusion-num-threads <datafusion_runtime_num_threads>
          Set the maximum number of Datafusion runtime threads to use [env: INFLUXDB3_DATAFUSION_NUM_THREADS=]
      --datafusion-runtime-type <datafusion_runtime_type>
          Datafusion tokio runtime type [env: INFLUXDB3_DATAFUSION_RUNTIME_TYPE=] [default: multi-thread] [possible values: current-thread, multi-thread, multi-thread-alt]
      --datafusion-runtime-disable-lifo-slot <datafusion_runtime_disable_lifo>
          Disable LIFO slot of Datafusion runtime [env: INFLUXDB3_DATAFUSION_RUNTIME_DISABLE_LIFO_SLOT=] [possible values: true, false]
      --datafusion-runtime-event-interval <datafusion_runtime_event_interval>
          Sets the number of scheduler ticks after which the scheduler of the Datafusiontokio runtime will poll for external events (timers, I/O, and so on) [env: INFLUXDB3_DATAFUSION_RUNTIME_EVENT_INTERVAL=]
      --datafusion-runtime-global-queue-interval <datafusion_runtime_global_queue_interval>
          Sets the number of scheduler ticks after which the scheduler of the Datafusion runtime will poll the global task queue [env: INFLUXDB3_DATAFUSION_RUNTIME_GLOBAL_QUEUE_INTERVAL=]
      --datafusion-runtime-max-blocking-threads <datafusion_runtime_max_blocking_threads>
          Specifies the limit for additional threads spawned by the Datafusion runtime [env: INFLUXDB3_DATAFUSION_RUNTIME_MAX_BLOCKING_THREADS=]
      --datafusion-runtime-max-io-events-per-tick <datafusion_runtime_max_io_events_per_tick>
          Configures the max number of events to be processed per tick by the tokio Datafusion runtime [env: INFLUXDB3_DATAFUSION_RUNTIME_MAX_IO_EVENTS_PER_TICK=]
      --datafusion-runtime-thread-keep-alive <datafusion_runtime_thread_keep_alive>
          Sets a custom timeout for a thread in the blocking pool of the tokio Datafusion runtime [env: INFLUXDB3_DATAFUSION_RUNTIME_THREAD_KEEP_ALIVE=]
      --datafusion-runtime-thread-priority <datafusion_runtime_thread_priority>
          Set thread priority tokio Datafusion runtime workers [env: INFLUXDB3_DATAFUSION_RUNTIME_THREAD_PRIORITY=] [default: 10]
      --datafusion-max-parquet-fanout <MAX_PARQUET_FANOUT>
          When multiple parquet files are required in a sorted way (e.g. for de-duplication), we have two options: [env: INFLUXDB3_DATAFUSION_MAX_PARQUET_FANOUT=] [default: 1000]
      --datafusion-use-cached-parquet-loader
          Use a cached parquet loader when reading parquet files from object store [env: INFLUXDB3_DATAFUSION_USE_CACHED_PARQUET_LOADER=]
      --datafusion-config <DATAFUSION_CONFIG>
          Provide custom configuration to DataFusion as a comma-separated list of key:value pairs [env: INFLUXDB3_DATAFUSION_CONFIG=] [default: ]
      --max-http-request-size <MAX_HTTP_REQUEST_SIZE>
          Maximum size of HTTP requests [env: INFLUXDB3_MAX_HTTP_REQUEST_SIZE=] [default: 10485760]
      --http-bind <HTTP_BIND_ADDRESS>
          The address on which InfluxDB will serve HTTP API requests [env: INFLUXDB3_HTTP_BIND_ADDR=] [default: 0.0.0.0:8181]
      --ram-pool-data-bytes <RAM_POOL_DATA_BYTES>
          Size of the RAM cache used to store data in bytes [env: INFLUXDB3_RAM_POOL_DATA_BYTES=] [default: 1073741824]
      --exec-mem-pool-bytes <EXEC_MEM_POOL_BYTES>
          Size of memory pool used during query exec, in bytes [env: INFLUXDB3_EXEC_MEM_POOL_BYTES=] [default: 8589934592]
      --bearer-token <BEARER_TOKEN>
          bearer token to be set for requests [env: INFLUXDB3_BEARER_TOKEN=]
      --gen1-duration <GEN1_DURATION>
          Duration that the Parquet files get arranged into. The data timestamps will land each row into a file of this duration. 1m, 5m, and 10m are supported. These are known as "generation 1" files. The compactor in Pro can compact these into larger and longer generations [env: INFLUXDB3_GEN1_DURATION=] [default: 10m]
      --wal-flush-interval <WAL_FLUSH_INTERVAL>
          Interval to flush buffered data to a wal file. Writes that wait for wal confirmation will take as long as this interval to complete [env: INFLUXDB3_WAL_FLUSH_INTERVAL=] [default: 1s]
      --wal-snapshot-size <WAL_SNAPSHOT_SIZE>
          The number of WAL files to attempt to remove in a snapshot. This times the interval will determine how often snapshot is taken [env: INFLUXDB3_WAL_SNAPSHOT_SIZE=] [default: 600]
      --wal-max-write-buffer-size <WAL_MAX_WRITE_BUFFER_SIZE>
          The maximum number of writes requests that can be buffered before a flush must be run and succeed [env: INFLUXDB3_WAL_MAX_WRITE_BUFFER_SIZE=] [default: 100000]
      --query-log-size <QUERY_LOG_SIZE>
          The size of the query log. Up to this many queries will remain in the log before old queries are evicted to make room for new ones [env: INFLUXDB3_QUERY_LOG_SIZE=] [default: 1000]
      --buffer-mem-limit-mb <BUFFER_MEM_LIMIT_MB>
          The size limit of the buffered data. If this limit is passed a snapshot will be forced [env: INFLUXDB3_BUFFER_MEM_LIMIT_MB=] [default: 5000]
      --host-id <HOST_IDENTIFIER_PREFIX>
          The host idendifier used as a prefix in all object store file paths. This should be unique for any hosts that share the same object store configuration, i.e., the same bucket [env: INFLUXDB3_HOST_IDENTIFIER_PREFIX=]
      --mode <MODE>
          The mode to start the server in [env: INFLUXDB3_ENTERPRISE_MODE=] [default: read_write] [possible values: read, read_write, compactor]
      --replicas <REPLICAS>
          Comma-separated list of host identifier prefixes to replicate [env: INFLUXDB3_ENTERPRISE_REPLICAS=]
      --replication-interval <REPLICATION_INTERVAL>
          The interval at which each replica specified in the `replicas` option will be replicated [env: INFLUXDB3_ENTERPRISE_REPLICATION_INTERVAL=] [default: 250ms]
      --compactor-id <COMPACTOR_ID>
          The prefix in object store where all compacted data will be written to. Only provide this option if this server should be running compaction for its own write buffer and any replicas it is managing [env: INFLUXDB3_ENTERPRISE_COMPACTOR_ID=]
      --compaction-hosts <COMPACTION_HOSTS>
          Comma-separated list of host identifier prefixes to compact data from [env: INFLUXDB3_ENTERPRISE_COMPACTION_HOSTS=]
      --run-compactions
          This tells the server to run compactions. Only a single server should ever be running compactions for a given compactor_id. All other servers can read from that compactor id to pick up compacted files. This option is only applicable if a compactor-id is set. Set this flag if this server should be running compactions [env: INFLUXDB3_ENTERPRISE_RUN_COMPACTIONS=]
      --compaction-row-limit <COMPACTION_ROW_LIMIT>
          The limit to the number of rows per file that the compactor will write. This is a soft limit and the compactor may write more rows than this limit [env: INFLUXDB3_ENTERPRISE_COMPACTION_ROW_LIMIT=] [default: 1000000]
      --compaction-max-num-files-per-plan <COMPACTION_MAX_NUM_FILES_PER_PLAN>
          Set the maximum number of files that will be included in any compaction plan [env: INFLUXDB3_ENTERPRISE_COMPACTION_MAX_NUM_FILES_PER_PLAN=] [default: 500]
      --compaction-gen2-duration <COMPACTION_GEN2_DURATION>
          This is the duration of the first level of compaction (gen2). Later levels of compaction will be multiples of this duration. This number should be equal to or greater than the gen1 duration. The default is 20m, which is 2x the default gen1 duration of 10m [env: INFLUXDB3_ENTERPRISE_COMPACTION_GEN2_DURATION=] [default: 20m]
      --compaction-multipliers <COMPACTION_MULTIPLIERS>
          This comma-separated list of multiples specifies the duration of each level of compaction. The number of elements in this list will also determine the number of levels of compaction. The first element in the list will be the duration of the first level of compaction (gen3). Each subsequent level will be a multiple of the previous level [env: INFLUXDB3_ENTERPRISE_COMPACTION_MULTIPLIERS=] [default: 3,4,6,5]
      --preemptive-cache-age <PREEMPTIVE_CACHE_AGE>
          The interval to prefetch into parquet cache when compacting [env: INFLUXDB3_PREEMPTIVE_CACHE_AGE=] [default: 3d]
      --parquet-mem-cache-size-mb <PARQUET_MEM_CACHE_SIZE>
          The size of the in-memory Parquet cache in megabytes (MB) [env: INFLUXDB3_PARQUET_MEM_CACHE_SIZE_MB=] [default: 1000]
      --parquet-mem-cache-prune-percentage <PARQUET_MEM_CACHE_PRUNE_PERCENTAGE>
          The percentage of entries to prune during a prune operation on the in-memory Parquet cache [env: INFLUXDB3_PARQUET_MEM_CACHE_PRUNE_PERCENTAGE=] [default: 0.1]
      --parquet-mem-cache-prune-interval <PARQUET_MEM_CACHE_PRUNE_INTERVAL>
          The interval on which to check if the in-memory Parquet cache needs to be pruned [env: INFLUXDB3_PARQUET_MEM_CACHE_PRUNE_INTERVAL=] [default: 1s]
      --disable-parquet-mem-cache
          Disable the in-memory Parquet cache. By default, the cache is enabled [env: INFLUXDB3_DISABLE_PARQUET_MEM_CACHE=]
      --last-cache-eviction-interval <LAST_CACHE_EVICTION_INTERVAL>
          The interval on which to evict expired entries from the Last-N-Value cache, expressed as a human-readable time, e.g., "20s", "1m", "1h" [env: INFLUXDB3_LAST_CACHE_EVICTION_INTERVAL=] [default: 10s]
      --meta-cache-eviction-interval <META_CACHE_EVICTION_INTERVAL>
          The interval on which to evict expired entries from the Last-N-Value cache, expressed as a human-readable time, e.g., "20s", "1m", "1h" [env: INFLUXDB3_META_CACHE_EVICTION_INTERVAL=] [default: 10s]
      --plugin-dir <PLUGIN_DIR>
          The local directory that has python plugins and their test files [env: INFLUXDB3_PLUGIN_DIR=]