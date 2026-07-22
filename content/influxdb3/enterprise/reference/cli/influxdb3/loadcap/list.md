---
title: influxdb3 loadcap list
introduced: v3.10.0
description: >
  The `influxdb3 loadcap list` command lists workload capture profiles in
  InfluxDB 3 Enterprise.
menu:
  influxdb3_enterprise:
    parent: influxdb3 loadcap
    identifier: influxdb3 loadcap list
    name: list
weight: 302
related:
  - /influxdb3/enterprise/admin/load-capture/
---

Use `influxdb3 loadcap list` to list capture profiles stored by a query-capable InfluxDB 3 Enterprise node.

> [!Note]
> Load capture requires the [PachaTree storage engine](/influxdb3/enterprise/performance-preview/)--the default for new clusters.
> On clusters that started on 3.10 or earlier, first run the [storage engine upgrade](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree) (`--upgrade-pacha-tree`).
> Send requests to a node with an explicit `--mode` setting that includes `query`, for example, `--mode query` or `--mode ingest --mode query --mode compact`.
> Load capture isn't available on a node that uses the default `--mode all` configuration.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 loadcap list [OPTIONS]
```

## Options

| Option | | Description | Default | Environment variable |
| :----- | :-- | :---------- | :------ | :------------------- |
| `-H` | `--host <HOST_URL>` | InfluxDB 3 Enterprise server URL | `http://127.0.0.1:8181` | `INFLUXDB3_HOST_URL` |
| | `--token <AUTH_TOKEN>` | Authentication token | | `INFLUXDB3_AUTH_TOKEN` |
| | `--tls-ca <CA_CERT>` | Path to a custom TLS certificate authority | | `INFLUXDB3_TLS_CA` |
| | `--tls-no-verify` | Disable TLS certificate verification | | `INFLUXDB3_TLS_NO_VERIFY` |
| `-h` | `--help` | Print help information | | |
