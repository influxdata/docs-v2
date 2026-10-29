---
title: influxdb3 manage retry-upgrade-to-pacha-tree
introduced: v3.11.2
description: >
  The `influxdb3 manage retry-upgrade-to-pacha-tree` command resets a
  Parquet-to-PachaTree storage engine upgrade that latched to a failed state
  in InfluxDB 3 Enterprise, so it resumes on the next compactor restart.
menu:
  influxdb3_enterprise:
    parent: influxdb3 manage
    name: retry-upgrade-to-pacha-tree
weight: 302
related:
  - /influxdb3/enterprise/reference/internals/storage-engine/
  - /influxdb3/enterprise/reference/cli/influxdb3/manage/cleanup-parquet/
---

Use `influxdb3 manage retry-upgrade-to-pacha-tree` to reset a [storage engine upgrade](/influxdb3/enterprise/reference/internals/storage-engine/) (Parquet-to-PachaTree) that latched to a `failed` state.

The command re-checks every previously failed upgrade source against the catalog and object store:

- Sources that are still readable are requeued.
- Sources whose table or database was dropped are recorded as skipped.
- Sources that can't be read back are left unresolved for the next retry.

The reset itself only changes durable state.
The migration resumes the next time a compactor node starts with `--upgrade-pacha-tree`.

Starting in v3.11.8 and v3.12.2, the command refuses to run while any ingest node
in the upgrade lists Parquet files it couldn't convert.
Follow the [retry procedure](#retry-after-an-ingest-conversion-failure) to resolve
these failures before you run the command.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 manage retry-upgrade-to-pacha-tree [OPTIONS]
```

## Options

| Option | | Description | Default | Environment variable |
| :----- | :-- | :---------- | :------ | :------------------- |
| `-H` | `--host <HOST_URL>` | InfluxDB 3 Enterprise server URL | `http://127.0.0.1:8181` | `INFLUXDB3_HOST_URL` |
| | `--token <AUTH_TOKEN>` | Authentication token | | `INFLUXDB3_AUTH_TOKEN` |
| | `--tls-ca <CA_CERT>` | Path to a custom TLS certificate authority | | `INFLUXDB3_TLS_CA` |
| | `--tls-no-verify` | Disable TLS certificate verification | | `INFLUXDB3_TLS_NO_VERIFY` |
| `-h` | `--help` | Print help information | | |

## Example

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN" }
influxdb3 manage retry-upgrade-to-pacha-tree \
  --host http://localhost:8181 \
  --token AUTH_TOKEN
```

If any sources are left unresolved, run the command again to re-attempt them.

## Retry after an ingest conversion failure

Starting in v3.11.8 and v3.12.2, an ingest node reports exhausted conversion
attempts in `system.upgrade_parquet_node`.
The cluster upgrade remains `failed` until you reset it with this command.

To reset the failed upgrade and resume the migration:

1. [Query `system.upgrade_parquet_node`](/influxdb3/enterprise/admin/query-system-data/#query-storage-engine-tables)
   and check `last_message` for the file and error.
2. Fix the cause of the conversion failure.
3. Restart each affected ingest node to retry its files.
4. Run `influxdb3 manage retry-upgrade-to-pacha-tree` as shown in the [example](#example).
   If the command reports that an ingest node still lists unconverted files,
   resolve that node's failure and retry.
5. Restart a compactor node with
   [`--upgrade-pacha-tree`](/influxdb3/enterprise/reference/internals/storage-engine/#upgrade-from-parquet)
   to resume the migration.
