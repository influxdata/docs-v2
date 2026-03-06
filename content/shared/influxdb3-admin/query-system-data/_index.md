<!--Shortcode-->
{{% product-name %}} stores data related to the database server, queries, and tables in _system tables_.
You can query the system tables for information about your running server, databases, and and table schemas.

## Query system tables

- [Use the HTTP query API](#use-the-http-query-api)
  - [Examples](#examples)
    - [Show tables](#show-tables)
    - [View column information for a table](#view-column-information-for-a-table)
    - [Recently executed queries](#recently-executed-queries)
    - [Query plugin files](#query-plugin-files)
    - [Query trigger logs](#query-trigger-logs)

### Use the HTTP query API 

Use the HTTP API `/api/v3/query_sql` endpoint to retrieve system information about your database server and table schemas in {{% product-name %}}.


To execute a query, send a `GET` or `POST` request to the endpoint:

- `GET`: Pass parameters in the URL query string (for simple queries)
- `POST`: Pass parameters in a JSON object (for complex queries and readability in your code)

Include the following parameters:

- `q`: _({{< req >}})_ The SQL query to execute.
- `db`: _({{< req >}})_ The database to execute the query against.
- `params`: A JSON object containing parameters to be used in a _parameterized query_.
- `format`: The format of the response (`json`, `jsonl`, `csv`, `pretty`, or `parquet`).
  JSONL (`jsonl`) is preferred because it streams results back to the client.
  `pretty` is for human-readable output. Default is `json`.

#### Examples

> [!Note]
> #### system\_ sample data
>
> In examples, tables with `"table_name":"system_` are user-created tables for CPU, memory, disk,
> network, and other resource statistics collected and written
> by the user--for example, using the `psutil` Python library or
> [Telegraf](/telegraf/v1/get-started/) to collect
> and write system metrics to an InfluxDB 3 database.

##### Show tables

The following example sends a `GET` request that executes a `show tables` query
to retrieve all user-created
tables (`"table_schema":"iox"`), system tables, and information schema tables
for a database:

```bash
curl "http://{{< influxdb/host >}}/api/v3/query_sql?db=mydb&format=jsonl&q=show%20tables"
```

The response body contains the following JSONL:

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

A table has one of the following `table_schema` values:

- `iox`: tables created by the user of the database.
- `system`: tables used by the system to show information about the running database server.
  Some of these tables show stored information such as configurations,
  while others, such as the `queries` table, hold ephemeral state in memory.
- `information_schema`: views that show schema information for tables in the database.

#### View column information for a table

The following query sends a `POST` request that executes an SQL query to
retrieve information about columns in the sample `system_swap` table schema:

_Note: when you send a query in JSON, you must escape single quotes
that surround field names._

```bash
curl "http://localhost:8181/api/v3/query_sql" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --json '{
    "db": "mydb",
    "q": "SELECT * FROM information_schema.columns WHERE table_schema = '"'iox'"' AND table_name = '"'system_swap'"'",
    "format": "jsonl"
  }'
```

The output is the following:

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

#### Recently executed queries

To view recently executed queries, query the `queries` system table:

```bash
curl "http://localhost:8181/api/v3/query_sql" \
  --header "Authorization: Bearer AUTH_TOKEN"
  --json '{
    "db": "mydb",
    "q": "SELECT * FROM system.queries LIMIT 2",
    "format": "jsonl"
  }'
```

The output is similar to the following:

```jsonl
{"id":"cdd63409-1822-4e65-8e3a-d274d553dbb3","phase":"success","issue_time":"2025-01-20T17:01:40.690067","query_type":"sql","query_text":"show tables","partitions":0,"parquet_files":0,"plan_duration":"PT0.032689S","permit_duration":"PT0.000202S","execute_duration":"PT0.000223S","end2end_duration":"PT0.033115S","compute_duration":"P0D","max_memory":0,"success":true,"running":false,"cancelled":false}
{"id":"47f8d312-5e75-4db2-837a-6fcf94c09927","phase":"success","issue_time":"2025-01-20T17:02:32.627782","query_type":"sql","query_text":"show tables","partitions":0,"parquet_files":0,"plan_duration":"PT0.000583S","permit_duration":"PT0.000015S","execute_duration":"PT0.000063S","end2end_duration":"PT0.000662S","compute_duration":"P0D","max_memory":0,"success":true,"running":false,"cancelled":false}
```

#### Query plugin files

To view loaded Processing Engine plugins, query the `plugin_files` system table in the `_internal` database.

The `system.plugin_files` table provides information about plugin files loaded by the Processing Engine:

**Columns:**
- `plugin_name` (String): Name of a trigger using this plugin
- `file_name` (String): Plugin filename
- `file_path` (String): Full server path to the plugin file
- `size_bytes` (Int64): File size in bytes
- `last_modified` (Int64): Last modification timestamp (milliseconds since epoch)

```bash
curl "http://localhost:8181/api/v3/query_sql" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --json '{
    "db": "_internal",
    "q": "SELECT * FROM system.plugin_files",
    "format": "jsonl"
  }'
```

The output is similar to the following:

```jsonl
{"plugin_name":"my_trigger","file_name":"my_plugin.py","file_path":"/path/to/plugins/my_plugin.py","size_bytes":2048,"last_modified":1704067200000}
{"plugin_name":"scheduled_trigger","file_name":"scheduler.py","file_path":"/path/to/plugins/scheduler.py","size_bytes":4096,"last_modified":1704153600000}
```

**Filter plugins by trigger name:**

```bash
curl "http://localhost:8181/api/v3/query_sql" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --json '{
    "db": "_internal",
    "q": "SELECT * FROM system.plugin_files WHERE plugin_name = '"'my_trigger'"'",
    "format": "jsonl"
  }'
```

**Find plugins by file pattern:**

```bash
curl "http://localhost:8181/api/v3/query_sql" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --json '{
    "db": "_internal",
    "q": "SELECT * FROM system.plugin_files WHERE file_name LIKE '"'%scheduler%'"'",
    "format": "jsonl"
  }'
```

#### Query trigger logs

The `system.processing_engine_logs` table stores log entries from Processing Engine triggers.

Logs are stored in **two locations**:

- The trigger's database (primary)--query here for trigger-specific debugging
- The `_internal` database--contains logs from all triggers across all databases

**Columns:**

- `event_time` (Timestamp): When the log entry was recorded
- `trigger_name` (String): Name of the trigger that generated the log
- `log_level` (String): Log level (INFO, WARN, ERROR)
- `log_text` (String): Log message content

**Query logs for a specific trigger:**

```bash { placeholders="DATABASE|TRIGGER" }
influxdb3 query \
  --database DATABASE \
  "SELECT event_time, log_level, log_text
   FROM system.processing_engine_logs
   WHERE trigger_name = 'TRIGGER'
   ORDER BY event_time DESC
   LIMIT 20"
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE`{{% /code-placeholder-key %}}: The database where you created the trigger
- {{% code-placeholder-key %}}`TRIGGER`{{% /code-placeholder-key %}}: The name of your trigger

**Query all trigger logs (from _internal):**

```bash
influxdb3 query \
  --database _internal \
  "SELECT event_time, trigger_name, log_level, log_text
   FROM system.processing_engine_logs
   ORDER BY event_time DESC
   LIMIT 50"
```
