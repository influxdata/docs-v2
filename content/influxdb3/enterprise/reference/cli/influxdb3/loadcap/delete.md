---
title: influxdb3 loadcap delete
introduced: v3.10.0
description: >
  The `influxdb3 loadcap delete` command deletes an InfluxDB 3 Enterprise
  workload capture profile.
menu:
  influxdb3_enterprise:
    parent: influxdb3 loadcap
    name: delete
weight: 306
related:
  - /influxdb3/enterprise/admin/load-capture/
---

Use `influxdb3 loadcap delete` to delete a workload capture profile.

> [!Note]
> Load capture requires the [PachaTree storage engine](/influxdb3/enterprise/performance-preview/)--the default for new clusters.
> On clusters that started on 3.10 or earlier, first run the [storage engine upgrade](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree) (`--upgrade-pacha-tree`).
> Send requests to a node with an explicit `--mode` setting that includes `query`, for example, `--mode query` or `--mode ingest --mode query --mode compact`.
> Load capture isn't available on a node that uses the default `--mode all` configuration.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 loadcap delete --profile-id <PROFILE_ID> [OPTIONS]
```

## Options

| Option | | Description | Default | Environment variable |
| :----- | :-- | :---------- | :------ | :------------------- |
| | `--profile-id <PROFILE_ID>` | Capture profile identifier | | |
| `-H` | `--host <HOST_URL>` | InfluxDB 3 Enterprise server URL | `http://127.0.0.1:8181` | `INFLUXDB3_HOST_URL` |
| | `--token <AUTH_TOKEN>` | Authentication token | | `INFLUXDB3_AUTH_TOKEN` |
| | `--tls-ca <CA_CERT>` | Path to a custom TLS certificate authority | | `INFLUXDB3_TLS_CA` |
| | `--tls-no-verify` | Disable TLS certificate verification | | `INFLUXDB3_TLS_NO_VERIFY` |
| `-h` | `--help` | Print help information | | |
