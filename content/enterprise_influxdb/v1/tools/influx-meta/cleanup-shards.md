---
title: influx-meta cleanup-shards
description: >
  The `influx-meta cleanup-shards` command removes orphaned shards and empty
  shard groups from the metadata of a live InfluxDB Enterprise cluster.
menu:
  enterprise_influxdb_v1:
    parent: influx-meta
weight: 201
metadata: v1.12.3+
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/show-shards/
---

<!-- DRAFT — DO NOT PUBLISH.
     influx-meta is an internal InfluxData engineering/support tool, not shipped
     in the InfluxDB Enterprise release. Keep draft: true on this page.
     See https://github.com/influxdata/docs-v2/issues/6842 for context. -->

The `influx-meta cleanup-shards` command removes orphaned shards and empty
shard groups from the metadata of a live InfluxDB Enterprise cluster.

The command performs the following operations:

1. Identifies shards with no owners (orphaned shards).
2. Removes orphaned shards from metadata.
3. Removes shard groups that contain no shards after cleanup.
4. Displays a summary of proposed changes for confirmation before committing.

If the cluster metadata changes while the command runs (for example, from
another operation), the command fails safely without modifying metadata.

## Prerequisites

Before running `cleanup-shards`:

- Disable [anti-entropy](/enterprise_influxdb/v1/administration/configure/anti-entropy/)
  to prevent concurrent metadata modifications.
- Stop any `influxd-ctl` operations that modify metadata.
- Run [`SHOW SHARDS`](/enterprise_influxdb/v1/query_language/spec/#show-shards)
  and verify no shards are within 30 minutes of their end time.

## Usage

```sh
influx-meta cleanup-shards [flags]
```

## Flags

| Flag | Description |
| :--- | :---------- |
| `--host` | Address and port of the meta node _(default: `localhost:8091`)_ |
| `--config` | Config file path _(default: `$HOME/.influx-meta.yaml`)_ |

## Output

The command displays a table of shards that will be removed:

```
ID    Database    RP       Shard Group    Start                  End
--    --------    --       -----------    -----                  ---
42    mydb        autogen  12             2023-01-01T00:00:00Z   2023-01-08T00:00:00Z
55    mydb        autogen  15             2023-02-01T00:00:00Z   2023-02-08T00:00:00Z
```

After displaying the summary, the command prompts for confirmation before
committing the changes.

## Examples

### Clean up shards on a local meta node

```sh
influx-meta cleanup-shards
```

### Clean up shards on a remote meta node

```sh
influx-meta cleanup-shards --host meta-node-01:8091
```
