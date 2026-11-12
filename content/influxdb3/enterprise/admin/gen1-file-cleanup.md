---
title: Gen1 file cleanup
seotitle: Clean up Gen1 files on the legacy Parquet storage engine in InfluxDB 3 Enterprise
description: >
  Delete Gen1 Parquet files that compaction has already merged into later
  generations in InfluxDB 3 Enterprise clusters that use the legacy Parquet
  storage engine.
menu:
  influxdb3_enterprise:
    name: Gen1 file cleanup
    parent: Administer InfluxDB
weight: 109
related:
  - /influxdb3/enterprise/admin/file-index/
  - /influxdb3/enterprise/reference/config-options/#compaction-cleanup-wait
  - /influxdb3/enterprise/reference/internals/storage-engine/
influxdb3/enterprise/tags: [compaction, storage, maintenance]
---

In {{% product-name %}} clusters that use the legacy Parquet storage engine,
compaction doesn't delete Gen1 Parquet files after it merges their data into
later generations.
The Gen1 files remain in object storage until you delete them with the Gen1
cleanup endpoint.
[`--compaction-cleanup-wait`](/influxdb3/enterprise/reference/config-options/#compaction-cleanup-wait)
doesn't apply to Gen1 files, and restarting a node doesn't delete them.

Queries read the compacted generations, so cleanup reclaims storage without
changing query results.

The Gen1 cleanup endpoint is available in {{< product-name >}} 3.9.0 and later.
Clusters that use the
[upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)
don't need it.

- [Run Gen1 cleanup](#run-gen1-cleanup)
- [Which files cleanup deletes](#which-files-cleanup-deletes)
- [Inspect Gen1 and compacted files](#inspect-gen1-and-compacted-files)

## Run Gen1 cleanup

Send a `POST` request to the `/api/v3/configure/gen1_cleanup` endpoint of each
ingest node.
Each request cleans up the files that node persisted, across all databases and
tables.
A node that only runs the compactor doesn't perform cleanup.

```bash { placeholders="INGEST_NODE_URL|AUTH_TOKEN" }
curl --request POST \
  "INGEST_NODE_URL/api/v3/configure/gen1_cleanup?min_age=24h" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

Replace the following:

- {{% code-placeholder-key %}}`INGEST_NODE_URL`{{% /code-placeholder-key %}}: the URL of an ingest node--for example, `http://localhost:8181`
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

The endpoint accepts the following optional query parameters:

| Parameter | Default | Description |
| :-------- | :------ | :---------- |
| `min_age` | `24h` | Skip snapshots persisted more recently than this duration. This isn't a retention period for your data. |
| `batch_size` | `500` | Maximum number of snapshots to process in one request. |
| `concurrency` | `10` | Maximum number of concurrent file deletions. |

The endpoint responds with `202 Accepted` and either `Gen1 cleanup started` or
`Gen1 cleanup already running`.
The response confirms that cleanup started, not that it finished.
Cleanup runs in the background, one run at a time per node.
When it finishes, it logs `Gen1 cleanup finished` with the number of files and
snapshots it deleted, or `Gen1 cleanup: no eligible files found`.

To work through a large backlog, send the request again after each run
finishes.
To keep Gen1 storage from growing, send the request on a schedule.

## Which files cleanup deletes

Cleanup deletes only Gen1 files whose data the compactor has already merged into
later generations.
It reads the node's snapshots to find these files and deletes a snapshot after
it deletes all of the snapshot's files.

Cleanup keeps the following:

- Gen1 files the compactor hasn't compacted yet.
- Files from the most recent snapshot the compactor has processed, and from
  any newer snapshots.
  In a cluster that has taken only one snapshot, cleanup deletes nothing until
  the node takes a second snapshot and the compactor compacts it.
- Snapshots persisted more recently than `min_age`.

> [!Warning]
> Don't delete Gen1 files or snapshots from object storage yourself.
> Cleanup uses the snapshots to find the files it can safely delete.

## Inspect Gen1 and compacted files

The `system.parquet_files` table lists the Gen1 files a node tracks, including
compacted Gen1 files that cleanup hasn't deleted yet.
It doesn't list compacted generations.

To list the compacted files for a table, query the `system.compacted_data`
table.
Queries to this table must filter on `table_name`.

```bash { placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN" }
influxdb3 query \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  "SELECT generation_level, count(*) AS files,
     sum(parquet_size_bytes) AS bytes, sum(parquet_row_count) AS rows
   FROM system.compacted_data
   WHERE table_name = 'TABLE_NAME'
   GROUP BY generation_level
   ORDER BY generation_level"
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database that contains the table
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}
