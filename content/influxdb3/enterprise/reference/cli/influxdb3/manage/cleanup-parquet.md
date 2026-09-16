---
title: influxdb3 manage cleanup-parquet
introduced: v3.11.1
description: >
  The `influxdb3 manage cleanup-parquet` command permanently removes
  pre-upgrade Parquet data left behind by a completed Parquet-to-PachaTree
  storage engine upgrade in InfluxDB 3 Enterprise.
menu:
  influxdb3_enterprise:
    parent: influxdb3 manage
    name: cleanup-parquet
weight: 301
related:
  - /influxdb3/enterprise/reference/internals/storage-engine/
---

Use `influxdb3 manage cleanup-parquet` to permanently remove Parquet-era data that a completed [storage engine upgrade](/influxdb3/enterprise/reference/internals/storage-engine/) (Parquet-to-PachaTree) left behind.
Any node in the cluster accepts the request, but the compactor node executes the cleanup.

> [!Important]
> #### This deletes data permanently
>
> - Parquet files superseded by the PachaTree migration are deleted.
> - The operation is irreversible.
> - After cleanup, `influxdb3 manage downgrade-to-parquet` is no longer possible.
>
> Run with `--dry-run` first to see what a real cleanup would delete.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 manage cleanup-parquet [OPTIONS]
```

## Options

| Option | | Description | Default | Environment variable |
| :----- | :-- | :---------- | :------ | :------------------- |
| | `--dry-run` | Report what would be deleted without deleting anything | | |
| | `--yes` | Skip the confirmation prompt. Conflicts with `--dry-run` | | |
| | `--wait` | Poll every 5 seconds until the cleanup completes or fails. Exits non-zero on failure | | |
| | `--status-only` | Print the status of the current or last cleanup, then exit. Conflicts with `--dry-run`, `--yes`, and `--wait` | | |
| `-H` | `--host <HOST_URL>` | InfluxDB 3 Enterprise server URL | `http://127.0.0.1:8181` | `INFLUXDB3_HOST_URL` |
| | `--token <AUTH_TOKEN>` | Authentication token | | `INFLUXDB3_AUTH_TOKEN` |
| | `--tls-ca <CA_CERT>` | Path to a custom TLS certificate authority | | `INFLUXDB3_TLS_CA` |
| | `--tls-no-verify` | Disable TLS certificate verification | | `INFLUXDB3_TLS_NO_VERIFY` |
| `-h` | `--help` | Print help information | | |

## Examples

### Preview what a cleanup would delete

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN" }
influxdb3 manage cleanup-parquet \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  --dry-run
```

### Run a cleanup and wait for it to finish

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN" }
influxdb3 manage cleanup-parquet \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  --yes \
  --wait
```

### Check the status of the current or last cleanup

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN" }
influxdb3 manage cleanup-parquet \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  --status-only
```
