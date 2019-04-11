---
title: InfluxDB configuration options
description:
menu:
  v2_0_ref:
    name: Configuration options
    weight: 2
---

Set InfluxDB configuration options when starting `influxd` by passing specific flags.

```sh
influxd \
  --assets-path=/path/to/custom/assets-dir \
  --bolt-path=~/.influxdbv2/influxd.bolt \
  --e2e-testing \
  --engine-path=~/.influxdbv2/engine \
  --http-bind-address=:9999 \
  --log-level=info \
  --reporting-disabled \
  --secret-store=bolt \
  --store=bolt \
  --tracing-type=log
```

## assets-path
Override default user interface (UI) assets by serving assets from a specific directory.
_InfluxData use this when working on the InfluxDB UI._

**influxd flag:** `--assets-path`

## bolt-path
Path to BoltDB database.

**influxd flag:** `--bolt-path`  
**Default:** `~/.influxdbv2/influxd.bolt`

## e2e-testing
Add /debug/flush endpoint to clear stores; used for end-to-end tests.

**influxd flag:** `--e2e-testing`  
**Default:** false

## engine-path
Path to persistent storage engine files where InfluxDB stores all Time-Structure Merge Tree (TSM) data.

**influxd flag:** `--engine-path`  
**Default:** `~/.influxdbv2/engine`

## http-bind-address
Bind address for the REST HTTP API.

**influxd flag:** `--http-bind-address`  
**Default:** `:9999`

## log-level
Supported log levels are debug, info, and error.

**influxd flag:** `--log-level`  
**Default:** `info`

## reporting-disabled
Disable sending telemetry data to InfluxData.

**influxd flag:** `--reporting-disabled`  
**Default:** false

## secret-store
Data store for secrets (bolt or vault).

**influxd flag:** `--secret-store`  
**Default:** `bolt`

## store
Data store for REST resources (bolt or memory) (default `bolt`)

**influxd flag:** `--store`  
**Default:** `bolt`

## tracing-type
Supported tracing types (log or jaeger).

**influxd flag:** `--tracing-type`  
**Default:** none
