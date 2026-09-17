---
title: Install InfluxDB 3 Explorer
description: >
  Install and run InfluxDB 3 Explorer. Instructions depend on your Explorer
  version--Docker for v1.9 and earlier, or WASM with InfluxDB 3 Enterprise
  for v1.10 and later.
menu:
  influxdb3_explorer:
    name: Install Explorer
weight: 2
---

How you install {{% product-name %}} depends on which version you're
installing:

- **Explorer v1.10 and later** is included with
  [InfluxDB 3 Enterprise](/influxdb3/enterprise/) and runs as WebAssembly
  (WASM)--there's no separate container to install. For deployment
  instructions, see the InfluxDB 3 Enterprise documentation.
- **Explorer v1.9 and earlier** is a standalone Docker container. For
  installation and configuration instructions, see
  [Install and run InfluxDB 3 Explorer with Docker](/influxdb3/explorer/install/docker/).

## Check which version applies to you

If you already have an InfluxDB 3 server running, check its version and
edition with `GET /ping`:

```sh
curl --get "http://localhost:8181/ping" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

The response includes the `x-influxdb-version` and `x-influxdb-build` headers
(`Core` or `Enterprise`), and `version` in the body. Use `GET`; a `HEAD`
request to `/ping` returns `404`.

If you're installing InfluxDB 3 Enterprise 1.10 or later, Explorer is already
included--go to the Enterprise deployment instructions. Otherwise, use
[Docker](/influxdb3/explorer/install/docker/).
