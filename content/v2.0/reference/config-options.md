---
title: InfluxDB configuration options
description:
menu:
  v2_0_ref:
    name: Configuration options
    weight: 2
---

Configure InfluxDB using configuration flags available with the [`influxd` daemon](/v2.0/reference/cli/influxd).
The following configuration options are available:

- [assets-path](#assets-path)
- [bolt-path](#bolt-path)
- [e2e-testing](#e2e-testing)
- [engine-path](#engine-path)
- [http-bind-address](#http-bind-address)
- [log-level](#log-level)
- [reporting-disabled](#reporting-disabled)
- [secret-store](#secret-store)
- [store](#store)
- [tracing-type](#tracing-type)

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

---

## --assets-path
Overrides the default InfluxDB user interface (UI) assets by serving assets from a specific directory.
_This is typically only used internally at InfluxData when working on the InfluxDB UI._

```sh
influxd --assets-path=/path/to/custom/assets-dir
```

---

## --bolt-path
Defines the path to the [BoltDB](https://github.com/boltdb/bolt) database.
BoltDB is a key value store written in Go.
InfluxDB uses BoltDB to store non-time-series data such as organization and
user information, UI data, REST resources, etc.

**Default:** `~/.influxdbv2/influxd.bolt`  

```sh
influxd --bolt-path=~/.influxdbv2/influxd.bolt
```

---

## --e2e-testing
Adds a `/debug/flush` endpoint to the InfluxDB HTTP API to clear stores.
InfluxData uses this for end-to-end testing.

```sh
influxd --e2e-testing
```

---

## --engine-path
Defines the path to persistent storage engine files where InfluxDB stores all
Time-Structure Merge Tree (TSM) data on disk.

**Default:** `~/.influxdbv2/engine`  

```sh
influxd --engine-path=~/.influxdbv2/engine
```

---

## --http-bind-address
Defines the bind address for the InfluxDB HTTP API.
Customize the URL and port of the InfluxDB API and UI.

**Default:** `:9999`  

```sh
influxd --http-bind-address=:9999
```

---

## --log-level
Defines the log output level.
InfluxDB emits log entries with severity levels greater than or equal to the level specified.

**Options:** `debug`, `info`, `error`  
**Default:** `info`  

```sh
influxd --log-level=info
```

---

## --reporting-disabled
Disables sending telemetry data to InfluxData.
The [InfluxData telemetry](https://www.influxdata.com/telemetry) page provides
information about what data is collected and how InfluxData uses it.

```sh
influxd --reporting-disabled
```

---

## --secret-store
Specifies the data store for secrets such as passwords and tokens.
Store secrets in either the InfluxDB [internal BoltDB](#bolt-path)
or in [Vault](https://www.vaultproject.io/).

**Options:** `bolt`, `vault`  
**Default:** `bolt`  

```sh
influxd --secret-store=bolt
```

---

## --store
Specifies the data store for REST resources.

{{% note %}}
Do not use `memory` in production environments.
It is meant only for transient environments, such as testing environments, where
data persistence does not matter.
{{% /note %}}

**Options:** `bolt`, `memory`  
**Default:** `bolt`  

```sh
influxd --store=bolt
```

---

## --tracing-type
Enables tracing in InfluxDB and specifies the tracing type.
Tracing is disabled by default.

**Options:** `log`, `jaeger`

```sh
influxd --tracing-type=log
```
