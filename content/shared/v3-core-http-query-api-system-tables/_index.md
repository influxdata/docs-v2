This guide shows some of the capabilities of the HTTP API API for querying and accessing useful information from system tables.

The HTTP API for querying is reached via either a `GET` or `POST` to the endpoint `/api/v3/query_sql`. There is also an endpoint for InfluxQL at `/api/v3/query_influxql` but this guide will focus on just the SQL endpoint.

The `POST` endpoint is there for when the query is too large to fit in a URL. The `GET` endpoint is useful for quick queries that can be easily encoded in a URL.

The HTTP Query API takes the following parameters:
- `q` - The SQL query to execute
- `db` - The database to execute the query against
- `params` - A JSON object containing parameters to be used in the query (for parameterize SQL)
- `format` - The format of the response. Can be `json`, `jsonl`, `csv`, `pretty`, or `parquet`. JSONL is the preferred format as it will stream the results back to the client. Pretty is for human-readable output.

For example, running the `show tables` query, which will show all user created tables (listed as `table_schema` of `iox`), system tables, and information schema tables. Here's the command:

```shell
curl "http://localhost:8181/api/v3/query_sql?db=mydb&format=jsonl&q=show%20tables"
```

Returns the following JSONL output

```jsonl
{"table_catalog":"public","table_schema":"iox","table_name":"system_cpu","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_cpu_cores","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_memory","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_swap","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_memory_faults","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_disk_usage","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_disk_io","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_disk_performance","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_network","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"system","table_name":"distinct_caches","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"system","table_name":"last_caches","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"system","table_name":"parquet_files","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"system","table_name":"processing_engine_plugins","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"system","table_name":"processing_engine_triggers","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"system","table_name":"queries","table_type":"BASE TABLE"}
{"table_catalog":"public","table_schema":"information_schema","table_name":"tables","table_type":"VIEW"}
{"table_catalog":"public","table_schema":"information_schema","table_name":"views","table_type":"VIEW"}
{"table_catalog":"public","table_schema":"information_schema","table_name":"columns","table_type":"VIEW"}
{"table_catalog":"public","table_schema":"information_schema","table_name":"df_settings","table_type":"VIEW"}
{"table_catalog":"public","table_schema":"information_schema","table_name":"schemata","table_type":"VIEW"}
```

The `iox` tables are all those created by the user of the database. The `system` tables 
are all the system tables that are used by the system to show information about 
the running of the database server. Some of these tables show stored information like 
configurations, while others keep ephemeral state in memory like the `queries` table.

The `information_schema` tables are views that show information about the schema of the 
tables in the database. Here's the output of querying the information schema of the `system_swap` 
table

```SQL
SELECT * FROM information_schema.columns where table_schema = 'iox' AND table_name = 'system_cpu'
```

And the response shows the schema of our example `system_cpu` table:

```jsonl
{"table_catalog":"public","table_schema":"iox","table_name":"system_swap","column_name":"free","ordinal_position":0,"is_nullable":"YES","data_type":"UInt64"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_swap","column_name":"host","ordinal_position":1,"is_nullable":"NO","data_type":"Dictionary(Int32, Utf8)"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_swap","column_name":"percent","ordinal_position":2,"is_nullable":"YES","data_type":"Float64","numeric_precision":24,"numeric_precision_radix":2}
{"table_catalog":"public","table_schema":"iox","table_name":"system_swap","column_name":"sin","ordinal_position":3,"is_nullable":"YES","data_type":"UInt64"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_swap","column_name":"sout","ordinal_position":4,"is_nullable":"YES","data_type":"UInt64"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_swap","column_name":"time","ordinal_position":5,"is_nullable":"NO","data_type":"Timestamp(Nanosecond, None)"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_swap","column_name":"total","ordinal_position":6,"is_nullable":"YES","data_type":"UInt64"}
{"table_catalog":"public","table_schema":"iox","table_name":"system_swap","column_name":"used","ordinal_position":7,"is_nullable":"YES","data_type":"UInt64"}
```

And here's query against the `queries` system table to see what queries we've recently executed:

```SQL
SELECT * FROM system.queries LIMIT 2
```

```jsonl
{"id":"cdd63409-1822-4e65-8e3a-d274d553dbb3","phase":"success","issue_time":"2025-01-20T17:01:40.690067","query_type":"sql","query_text":"show tables","partitions":0,"parquet_files":0,"plan_duration":"PT0.032689S","permit_duration":"PT0.000202S","execute_duration":"PT0.000223S","end2end_duration":"PT0.033115S","compute_duration":"P0D","max_memory":0,"success":true,"running":false,"cancelled":false}
{"id":"47f8d312-5e75-4db2-837a-6fcf94c09927","phase":"success","issue_time":"2025-01-20T17:02:32.627782","query_type":"sql","query_text":"show tables","partitions":0,"parquet_files":0,"plan_duration":"PT0.000583S","permit_duration":"PT0.000015S","execute_duration":"PT0.000063S","end2end_duration":"PT0.000662S","compute_duration":"P0D","max_memory":0,"success":true,"running":false,"cancelled":false}
```