---
title: influxdb3 loadcap start
introduced: v3.10.0
description: >
  The `influxdb3 loadcap start` command starts a timed workload capture in
  InfluxDB 3 Enterprise.
menu:
  influxdb3_enterprise:
    parent: influxdb3 loadcap
    name: start
weight: 301
related:
  - /influxdb3/enterprise/admin/load-capture/
---

Use `influxdb3 loadcap start` to capture write requests, query requests, or both on a query-capable InfluxDB 3 Enterprise node.
Only one capture can run on a node at a time.

> [!Note]
> Load capture requires the [upgraded storage engine](/influxdb3/enterprise/performance-preview/)--the default for new clusters.
> On clusters that started on 3.10 or earlier, first run the [storage engine upgrade](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree) (`--upgrade-pacha-tree`).
> Send requests to a node with an explicit `--mode` setting that includes `query`, for example, `--mode query` or `--mode ingest --mode query --mode compact`.
> Load capture isn't available on a node that uses the default `--mode all` configuration.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 loadcap start --type <TYPE> --duration <DURATION> [OPTIONS]
```

## Options

| Option | | Description | Default | Environment variable |
| :----- | :-- | :---------- | :------ | :------------------- |
| | `--type <TYPE>` | Request types to capture: `write`, `query`, or `both` | | |
| | `--duration <DURATION>` | Capture duration, for example, `30s`, `5m`, or `1h`. The maximum is one hour. | | |
| `-H` | `--host <HOST_URL>` | InfluxDB 3 Enterprise server URL | `http://127.0.0.1:8181` | `INFLUXDB3_HOST_URL` |
| | `--token <AUTH_TOKEN>` | Authentication token | | `INFLUXDB3_AUTH_TOKEN` |
| | `--tls-ca <CA_CERT>` | Path to a custom TLS certificate authority | | `INFLUXDB3_TLS_CA` |
| | `--tls-no-verify` | Disable TLS certificate verification | | `INFLUXDB3_TLS_NO_VERIFY` |
| `-h` | `--help` | Print help information | | |

## Example

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN" }
influxdb3 loadcap start \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  --type both \
  --duration 5m
```
