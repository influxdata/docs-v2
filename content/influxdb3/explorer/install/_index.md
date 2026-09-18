---
title: Install InfluxDB 3 Explorer
description: >
  Install and run InfluxDB 3 Explorer. Instructions depend on your InfluxDB 3
  server--integrated WASM for InfluxDB 3 Enterprise v3.11 and later, or
  Docker for earlier releases and InfluxDB 3 Core.
menu:
  influxdb3_explorer:
    name: Install Explorer
weight: 2
alt_links:
  enterprise: /influxdb3/enterprise/visualize-data/explorer/
related:
  - /influxdb3/enterprise/visualize-data/explorer/, Use the integrated InfluxDB 3 Explorer UI
---

How you install {{% product-name %}} depends on the InfluxDB 3 server you're
connecting it to:

- **InfluxDB 3 Enterprise v3.11 and later** includes Explorer as an
  integrated WebAssembly (WASM) component--there's no separate container to
  install. For setup instructions, see
  [Use the integrated InfluxDB 3 Explorer UI](/influxdb3/enterprise/visualize-data/explorer/).
- **InfluxDB 3 Core, or InfluxDB 3 Enterprise earlier than v3.11**, runs
  Explorer as a standalone Docker container. For installation and
  configuration instructions, see
  [Install and run InfluxDB 3 Explorer with Docker](/influxdb3/explorer/install/docker/).

## Check which version applies to you

If you already have an InfluxDB 3 server running, check its version and
edition with `GET /ping`:

```sh
curl --get "http://localhost:8181/ping" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

The response includes the following version details:

- `x-influxdb-version` reports the InfluxDB 3 server version.
- `x-influxdb-build` reports whether the server is Core or Enterprise.
- The response body includes the version in its `version` field.

Use `GET`; a `HEAD` request to `/ping` returns `404`.

If `x-influxdb-build` reports `Enterprise` and `x-influxdb-version` is `3.11`
or later, use the
[integrated Explorer UI](/influxdb3/enterprise/visualize-data/explorer/).
Otherwise, use [Docker](/influxdb3/explorer/install/docker/).
