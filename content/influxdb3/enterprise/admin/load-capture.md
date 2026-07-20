---
title: Capture workload data
seotitle: Capture anonymized workload data with InfluxDB 3 Enterprise load capture
description: >
  Use load capture to record an anonymized profile of write and query traffic
  on an {{% product-name %}} query node, inspect it, and share it with
  InfluxData to troubleshoot performance.
weight: 207
menu:
  influxdb3_enterprise:
    parent: Administer InfluxDB
    name: Capture workload data
related:
  - /influxdb3/enterprise/api/load-capture/
  - /influxdb3/enterprise/admin/performance-tuning/
  - /influxdb3/enterprise/reference/config-options/#mode
  - /influxdb3/enterprise/admin/clustering/
---

Load capture records an anonymized profile of write requests, query requests,
or both from a running {{% product-name %}} cluster.
InfluxData uses the profile to reproduce your workload and troubleshoot write
or query performance without receiving your raw data.

A capture anonymizes database names, table names, tag keys, tag values, field
names, string and binary field values, and non-time query literals before
writing them to object storage.
You can preview, download, and inspect a capture locally, then share it with
InfluxData support through your support channel.

> [!Important]
> #### Load capture requires a query-mode node
>
> Load capture initializes only on a node started with `--mode query`.
> A node running `--mode all` returns `404 loadcap not available`, even though
> it includes query mode.
> Load capture is also unavailable on ingest-, compact-, or process-only nodes
> and on InfluxDB 3 Core.
>
> Send all `loadcap` requests to a node running `--mode query`.
> For more information about node modes, see
> [Configure specialized cluster nodes](/influxdb3/enterprise/admin/clustering/)
> and the [`--mode` option](/influxdb3/enterprise/reference/config-options/#mode).

## Capture types

When you start a capture, choose one of three types:

- **`query`**: records SQL, InfluxQL, and Flight SQL query text sent to the
  query node.
- **`write`**: records anonymized write-ahead log (WAL) files and a snapshot of
  the catalog.
- **`both`**: records query and write artifacts in one profile.

A `write` or `both` capture requires write traffic reaching an ingest node in
the same cluster so the query node observes replicated WAL data.
A `query` capture records queries sent to the query node and does not require
an ingest node.

Constraints:

- Only one capture can run on a node at a time.
  Starting another while one is active returns `409 Conflict`.
- Capture durations use `s`, `m`, or `h` units---for example, `30s`, `5m`, or
  `1h`.
  The maximum duration is one hour.
- The catalog snapshot in a `write` or `both` capture is taken when the capture
  _starts_.
  Create and populate the schema you want to capture before you start the
  capture.

## Before you begin

- Identify a node in your cluster running `--mode query`.
- Set up authentication for the query node.
  The examples below use an admin token.

Set connection environment variables to target the query node:

```bash
export INFLUXDB3_HOST_URL="https://query-node.example.com:8181"
export INFLUXDB3_AUTH_TOKEN="YOUR_TOKEN"
```

## Capture a workload profile

### Start a capture

Start a capture and specify the type and duration:

```bash
influxdb3 loadcap start --type both --duration 5m
```

The command returns the profile ID:

```json
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

Store the profile ID to reference the capture in later commands:

```bash
export PROFILE_ID="550e8400-e29b-41d4-a716-446655440000"
```

To capture `write` or `both` data, send write requests to an ingest node in the
cluster while the capture runs.

### List profiles

List capture profiles and their status:

```bash
influxdb3 loadcap list
```

A profile reports `running`, `complete`, or `aborted` status, along with its
type, requested duration, and creation time.

### Preview a capture

Preview a profile without downloading it:

```bash
influxdb3 loadcap preview --profile-id "$PROFILE_ID"
```

The preview reports the file count, total size, WAL file count, query count,
and---for `write` and `both` captures---an anonymized catalog summary.

## Inspect before you share

A capture preserves the shape and timing of your workload.
It does not hide every operational characteristic.
Timestamps, numeric and boolean values, schema shape, file counts, query
cadence, query time ranges, and regular expression selectivity are preserved by
design.
Inspect a capture before you share it.

### Download and list the archive

Download the profile as a gzipped tar archive:

```bash
influxdb3 loadcap download \
  --profile-id "$PROFILE_ID" \
  --output "$PROFILE_ID.tar.gz"
```

If you omit `--output`, the CLI writes `{profile_id}.tar.gz`.

List the archive contents:

```bash
tar -tzf "$PROFILE_ID.tar.gz"
```

A `both` profile archive typically contains an anonymized `catalog.json`, a
zstd-compressed `queries.json.zst`, and one or more anonymized `.pt` WAL files:

```text
catalog.json
queries.json.zst
0-00000029.pt
0-00000030.pt
...
```

A `query`-only profile omits `catalog.json` and `.pt` files.
A `write`-only profile omits `queries.json.zst`.

### Extract and inspect

Extract the archive into a temporary directory:

```bash
mkdir -p loadcap-inspect
tar -xzf "$PROFILE_ID.tar.gz" -C loadcap-inspect
```

Inspect the anonymized catalog:

```bash
jq . loadcap-inspect/catalog.json
```

Inspect the anonymized queries:

```bash
zstd -dc loadcap-inspect/queries.json.zst | jq .
```

Each query entry contains anonymized query text, the query language, an
anonymized database identifier, and the original timestamp:

```json
{
  "sql": "SELECT \"0-14\", \"0-T\" FROM \"0-gwKPhKqqB5\" WHERE \"0-14\" = 'MHLLIfxq48Mt0'",
  "query_language": "sql",
  "database": "0-RdYkt0Bktle",
  "timestamp": "2026-04-27T12:34:56.789Z"
}
```

The `.pt` files are binary WAL files for InfluxData tooling.
Verify their names and sizes:

```bash
ls -lh loadcap-inspect/*.pt
```

## What load capture anonymizes

Each capture uses a random key that is unique to that capture.
The same original name or value maps to the same anonymized value within one
capture, but a different capture produces different values.
The key is not included in the downloaded profile.

Load capture anonymizes the following:

- Database, table, tag, field family, and field names, replaced with
  deterministic identifiers such as `1-0Dcc2PQ9o7zG`.
- Tag values, string field values, and binary field values in WAL files.
- Identifiers and non-time literals in SQL, InfluxQL, and Flight SQL queries.

Load capture preserves the following:

- Timestamps, numeric field values, and boolean field values.
- Query structure, operators, function names, and time-range literals.
- The InfluxQL `time` identifier and regular expression structure (anchors,
  character classes, and repetition), so query selectivity stays close to
  production.
- Node IDs, modes, core counts, and node state in the catalog snapshot.

Queries that the anonymizer cannot fully parse are replaced with a placeholder
such as `<unsupported:...>` or `<unparseable:...>`.
Statement types without full coverage---including `INSERT`, `UPDATE`, and
`DELETE`---are replaced wholesale.
A query capture therefore does not represent write-shaped statement traffic.

## Delete a capture

Delete a profile when you no longer need it:

```bash
influxdb3 loadcap delete --profile-id "$PROFILE_ID"
```

## Share with InfluxData

After you inspect a capture and confirm its contents, provide the archive to
InfluxData support through your existing support channel.
InfluxData uses the profile to reproduce and analyze your workload.

For the load capture HTTP API, see the
[Load capture API reference](/influxdb3/enterprise/api/load-capture/).
