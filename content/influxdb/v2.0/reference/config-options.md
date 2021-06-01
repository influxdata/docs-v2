---
title: InfluxDB configuration options
description: >
  Customize your InfluxDB configuration by using [`influxd`](/influxdb/v2.0/reference/cli/influxd/)
  configuration flags, setting environment variables, or defining configuration
  options in a configuration file.
menu:
  influxdb_2_0_ref:
    name: Configuration options
weight: 3
products: [oss]
related:
  - /influxdb/v2.0/reference/cli/influxd
---

Customize your InfluxDB configuration by using [`influxd`](/influxdb/v2.0/reference/cli/influxd/)
configuration flags, setting environment variables, or defining configuration
options in a configuration file.

### Configuration precedence
InfluxDB honors configuration settings using the following precedence:

1. `influxd` flags
2. Environment variables
3. Configuration file settings

### InfluxDB configuration file
When `influxd` starts, it checks for a file named `config.*` **in the current working directory**.
The file extension depends on the syntax of the configuration file.
InfluxDB configuration files support the following syntaxes:

- **YAML** (`.yaml`, `.yml`)
- **TOML** (`.toml`)
- **JSON** (`.json`)

To customize the directory path of the configuration file, set the `INFLUXD_CONFIG_PATH`
environment variable to your custom path.

```sh
export INFLUXD_CONFIG_PATH=/path/to/custom/config/directory
```

On startup, `influxd` will check for a `config.*` in the `INFLUXD_CONFIG_PATH` directory.

##### Example configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yaml
query-concurrency: 20
query-queue-size: 15
secret-store: vault
session-length: 120
tls-cert: /path/to/influxdb.crt
tls-key: /path/to/influxdb.key
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
query-concurrency = 20
query-queue-size = 15
secret-store = "vault"
session-length = 120
tls-cert = "/path/to/influxdb.crt"
tls-key = "/path/to/influxdb.key"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "query-concurrency": 20,
  "query-queue-size": 15,
  "secret-store": "vault",
  "session-length": 120,
  "tls-cert": "/path/to/influxdb.crt",
  "tls-key": "/path/to/influxdb.key"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% note %}}
Only non-default settings need to be defined in the configuration file.
{{% /note %}}


## Configuration options

To configure InfluxDB, use the following configuration options when starting the
[`influxd` service](/influxdb/v2.0/reference/cli/influxd):

- [assets-path](#assets-path)
- [bolt-path](#bolt-path)
- [e2e-testing](#e2e-testing)
- [engine-path](#engine-path)
- [http-bind-address](#http-bind-address)
- [http-idle-timeout](#http-idle-timeout)
- [http-read-header-timeout](#http-read-header-timeout)
- [http-read-timeout](#http-read-timeout)
- [http-write-timeout](#http-write-timeout)
- [influxql-max-select-buckets](#influxql-max-select-buckets)
- [influxql-max-select-point](#influxql-max-select-point)
- [influxql-max-select-series](#influxql-max-select-series)
- [log-level](#log-level)
- [metrics-disabled](#metrics-disabled)
- [nats-max-payload-bytes](#nats-max-payload-bytes)
- [nats-port](#nats-port)
- [no-tasks](#no-tasks)
- [pprof-disabled](#pprof-disabled)
- [query-concurrency](#query-concurrency)
- [query-initial-memory-bytes](#query-initial-memory-bytes)
- [query-max-memory-bytes](#query-max-memory-bytes)
- [query-memory-bytes](#query-memory-bytes)
- [query-queue-size](#query-queue-size)
- [reporting-disabled](#reporting-disabled)
- [secret-store](#secret-store)
- [session-length](#session-length)
- [session-renew-disabled](#session-renew-disabled)
- [storage-cache-max-memory-size](#storage-cache-max-memory-size)
- [storage-cache-snapshot-memory-size](#storage-cache-snapshot-memory-size)
- [storage-cache-snapshot-write-cold-duration](#storage-cache-snapshot-write-cold-duration)
- [storage-compact-full-write-cold-duration](#storage-compact-full-write-cold-duration)
- [storage-compact-throughput-burst](#storage-compact-throughput-burst)
- [storage-max-concurrent-compactions](#storage-max-concurrent-compactions)
- [storage-max-index-log-file-size](#storage-max-index-log-file-size)
- [storage-retention-check-interval](#storage-retention-check-interval)
- [storage-series-file-max-concurrent-snapshot-compactions](#storage-series-file-max-concurrent-snapshot-compactions)
- [storage-series-id-set-cache-size](#storage-series-id-set-cache-size)
- [storage-shard-precreator-advance-period](#storage-shard-precreator-advance-period)
- [storage-shard-precreator-check-interval](#storage-shard-precreator-check-interval)
- [storage-tsm-use-madv-willneed](#storage-tsm-use-madv-willneed)
- [storage-validate-keys](#storage-validate-keys)
- [storage-wal-fsync-delay](#storage-wal-fsync-delay)
- [store](#store)
- [testing-always-allow-setup](#testing-always-allow-setup)
- [tls-cert](#tls-cert)
- [tls-key](#tls-key)
- [tls-min-version](#tls-min-version)
- [tls-strict-ciphers](#tls-strict-ciphers)
- [tracing-type](#tracing-type)
- [vault-addr](#vault-addr)
- [vault-cacert](#vault-cacert)
- [vault-capath](#vault-capath)
- [vault-client-cert](#vault-client-cert)
- [vault-client-key](#vault-client-key)
- [vault-client-timeout](#vault-client-timeout)
- [vault-max-retries](#vault-max-retries)
- [vault-skip-verify](#vault-skip-verify)
- [vault-tls-server-name](#vault-tls-server-name)
- [vault-token](#vault-token)

---

### assets-path
Override the default InfluxDB user interface (UI) assets by serving assets from the specified directory.
_Typically, InfluxData internal use only._

| influxd flag    | Environment variable  | Configuration key |
|:------------    |:--------------------  |:----------------- |
| `--assets-path` | `INFLUXD_ASSETS_PATH` | `assets-path`     |

###### influxd flag
```sh
influxd --assets-path=/path/to/custom/assets-dir
```

###### Environment variable
```sh
export INFLUXD_ASSETS_PATH=/path/to/custom/assets-dir
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
assets-path: /path/to/custom/assets-dir
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
assets-path = "/path/to/custom/assets-dir"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "assets-path": "/path/to/custom/assets-dir"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### bolt-path
Path to the [BoltDB](https://github.com/boltdb/bolt) database.
BoltDB is a key value store written in Go.
InfluxDB uses BoltDB to store data including organization and
user information, UI data, REST resources, and other key value data.

**Default:** `~/.influxdbv2/influxd.bolt`  

| influxd flag  | Environment variable | Configuration key |
|:------------  |:-------------------- |:----------------- |
| `--bolt-path` | `INFLUXD_BOLT_PATH`  | `bolt-path`       |

###### influxd flag
```sh
influxd --bolt-path=~/.influxdbv2/influxd.bolt
```

###### Environment variable
```sh
export INFLUXD_BOLT_PATH=~/.influxdbv2/influxd.bolt
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
bolt-path: /users/user/.influxdbv2/influxd.bolt
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
bolt-path = "/users/user/.influxdbv2/influxd.bolt"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "bolt-path": "/users/user/.influxdbv2/influxd.bolt"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### e2e-testing
Add a `/debug/flush` endpoint to the InfluxDB HTTP API to clear stores.
InfluxData uses this endpoint in end-to-end testing.

| influxd flag    | Environment variable  | Configuration key |
|:------------    |:--------------------  |:----------------- |
| `--e2e-testing` | `INFLUXD_E2E_TESTING` | `e2e-testing`     |

###### influxd flag
```sh
influxd --e2e-testing
```

###### Environment variable
```sh
export INFLUXD_E2E_TESTING=true
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
e2e-testing: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
e2e-testing = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "e2e-testing": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### engine-path
Path to persistent storage engine files where InfluxDB stores all
Time-Structure Merge Tree (TSM) data on disk.

**Default:** `~/.influxdbv2/engine`  

| influxd flag    | Environment variable  | Configuration key |
|:------------    |:--------------------  |:----------------- |
| `--engine-path` | `INFLUXD_ENGINE_PATH` | `engine-path`     |

###### influxd flag
```sh
influxd --engine-path=~/.influxdbv2/engine
```

###### Environment variable
```sh
export INFLUXD_ENGINE_PATH=~/.influxdbv2/engine
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
engine-path: /users/user/.influxdbv2/engine
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
engine-path = "/users/user/.influxdbv2/engine"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "engine-path": "/users/user/.influxdbv2/engine"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### http-bind-address
Bind address for the InfluxDB HTTP API.
Customize the URL and port for the InfluxDB API and UI.

**Default:** `:8086`  

| influxd flag          | Environment variable        | Configuration key   |
|:------------          |:--------------------        |:-----------------   |
| `--http-bind-address` | `INFLUXD_HTTP_BIND_ADDRESS` | `http-bind-address` |

###### influxd flag
```sh
influxd --http-bind-address=:8086
```

###### Environment variable
```sh
export INFLUXD_HTTP_BIND_ADDRESS=:8086
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
http-bind-address: ":8086"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
http-bind-address = ":8086"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "http-bind-address": ":8086"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### http-idle-timeout
Maximum duration the server should keep established connections alive while waiting for new requests.
Set to `0` for no timeout.

**Default:** `3m0s`

| influxd flag          | Environment variable        | Configuration key   |
|:------------          |:--------------------        |:-----------------   |
| `--http-idle-timeout` | `INFLUXD_HTTP_IDLE_TIMEOUT` | `http-idle-timeout` |

###### influxd flag
```sh
influxd --http-idle-timeout=3m0s
```

###### Environment variable
```sh
export INFLUXD_HTTP_IDLE_TIMEOUT=3m0s
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
http-idle-timeout: 3m0s
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
http-idle-timeout = "3m0s"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "http-idle-timeout": "3m0s"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### http-read-header-timeout
Maximum duration the server should try to read HTTP headers for new requests.
Set to `0` for no timeout.

**Default:** `10s`

| influxd flag                 | Environment variable               | Configuration key          |
|:------------                 |:--------------------               |:-----------------          |
| `--http-read-header-timeout` | `INFLUXD_HTTP_READ_HEADER_TIMEOUT` | `http-read-header-timeout` |

###### influxd flag
```sh
influxd --http-read-header-timeout=10s
```

###### Environment variable
```sh
export INFLUXD_HTTP_READ_HEADER_TIMEOUT=10s
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
http-read-header-timeout: 10s
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
http-read-header-timeout = "10s"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "http-read-header-timeout": "10s"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### http-read-timeout
Maximum duration the server should try to read the entirety of new requests.
Set to `0` for no timeout.

**Default:** `0`

{{% note %}}
#### Set timeouts specific to your workload
Although no `http-read-timeout` is set by default, we **strongly recommend**
setting a timeout specific to your workload.
HTTP timeouts protect against large amounts of open connections that could
potentially hurt performance.
{{% /note %}}

| influxd flag          | Environment variable        | Configuration key   |
|:------------          |:--------------------        |:-----------------   |
| `--http-read-timeout` | `INFLUXD_HTTP_READ_TIMEOUT` | `http-read-timeout` |

###### influxd flag
```sh
influxd --http-read-timeout=10s
```

###### Environment variable
```sh
export INFLUXD_HTTP_READ_TIMEOUT=10s
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
http-read-timeout: 10s
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
http-read-timeout = "10s"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "http-read-timeout": "10s"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### http-write-timeout
Maximum duration the server should spend processing and responding to write requests.
Set to `0` for no timeout.

**Default:** `0`

{{% note %}}
#### Set timeouts specific to your workload
Although no `http-write-timeout` is set by default, we **strongly recommend**
setting a timeout specific to your workload.
HTTP timeouts protect against large amounts of open connections that could
potentially hurt performance.
{{% /note %}}

| influxd flag           | Environment variable         | Configuration key    |
|:------------           |:--------------------         |:-----------------    |
| `--http-write-timeout` | `INFLUXD_HTTP_WRITE_TIMEOUT` | `http-write-timeout` |

###### influxd flag
```sh
influxd --http-write-timeout=10s
```

###### Environment variable
```sh
export INFLUXD_HTTP_WRITE_TIMEOUT=10s
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
http-write-timeout: 10s
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
http-write-timeout = "10s"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "http-write-timeout": "10s"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### influxql-max-select-buckets
Maximum number of group by time buckets a `SELECT` statement can create.
`0` allows an unlimited number of buckets.

**Default:** `0`

| influxd flag                    | Environment variable                  | Configuration key             |
|:------------                    |:--------------------                  |:-----------------             |
| `--influxql-max-select-buckets` | `INFLUXD_INFLUXQL_MAX_SELECT_BUCKETS` | `influxql-max-select-buckets` |

###### influxd flag
```sh
influxd --influxql-max-select-buckets=0
```

###### Environment variable
```sh
export INFLUXD_INFLUXQL_MAX_SELECT_BUCKETS=0
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
influxql-max-select-buckets: 0
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
influxql-max-select-buckets = 0
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "influxql-max-select-buckets": 0
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### influxql-max-select-point
Maximum number of points a `SELECT` statement can process.
`0` allows an unlimited number of points.
InfluxDB checks the point count every second (so queries exceeding the maximum aren’t immediately aborted).

**Default:** `0`

| influxd flag                  | Environment variable                | Configuration key           |
|:------------                  |:--------------------                |:-----------------           |
| `--influxql-max-select-point` | `INFLUXD_INFLUXQL_MAX_SELECT_POINT` | `influxql-max-select-point` |

###### influxd flag
```sh
influxd --influxql-max-select-point=0
```

###### Environment variable
```sh
export INFLUXD_INFLUXQL_MAX_SELECT_POINT=0
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
influxql-max-select-point: 0
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
influxql-max-select-point = 0
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "influxql-max-select-point": 0
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### influxql-max-select-series
Maximum number of series a `SELECT` statement can return.
`0` allows an unlimited number of series.

**Default:** `0`

| influxd flag                   | Environment variable                 | Configuration key            |
|:------------                   |:--------------------                 |:-----------------            |
| `--influxql-max-select-series` | `INFLUXD_INFLUXQL_MAX_SELECT_SERIES` | `influxql-max-select-series` |

###### influxd flag
```sh
influxd --influxql-max-select-series=0
```

###### Environment variable
```sh
export INFLUXD_INFLUXQL_MAX_SELECT_SERIES=0
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
influxql-max-select-series: 0
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
influxql-max-select-series = 0
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "influxql-max-select-series": 0
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### log-level
Log output level.
InfluxDB outputs log entries with severity levels greater than or equal to the level specified.

**Options:** `debug`, `info`, `error`  
**Default:** `info`  

| influxd flag  | Environment variable | Configuration key |
|:------------  |:-------------------- |:----------------- |
| `--log-level` | `INFLUXD_LOG_LEVEL`  | `log-level`       |

###### influxd flag
```sh
influxd --log-level=info
```

###### Environment variable
```sh
export INFLUXD_LOG_LEVEL=info
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
log-level: info
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
log-level = "info"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "log-level": "info"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### metrics-disabled
Disable the HTTP `/metrics` endpoint which exposes internal InfluxDB metrics.

**Default:** `false`  

| influxd flag         | Environment variable       | Configuration key  |
|:------------         |:--------------------       |:-----------------  |
| `--metrics-disabled` | `INFLUXD_METRICS_DISABLED` | `metrics-disabled` |

###### influxd flag
```sh
influxd --metrics-disabled
```

###### Environment variable
```sh
export INFLUXD_METRICS_DISABLED=true
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
metrics-disabled: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
metrics-disabled = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "metrics-disabled": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### nats-max-payload-bytes
Maximum number of bytes allowed in a NATS message payload.

**Default:** `1048576`

| influxd flag               | Environment variable             | Configuration key        |
|:------------               |:--------------------             |:-----------------        |
| `--nats-max-payload-bytes` | `INFLUXD_NATS_MAX_PAYLOAD_BYTES` | `nats-max-payload-bytes` |

###### influxd flag
```sh
influxd --nats-max-payload-bytes=1048576
```

###### Environment variable
```sh
export INFLUXD_NATS_MAX_PAYLOAD_BYTES=1048576
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
nats-max-payload-bytes: 1048576
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
nats-max-payload-bytes = 1048576
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "nats-max-payload-bytes": 1048576
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### nats-port
Port for the NATS streaming server. `-1` selects a random port.

**Default:** `-1`

| influxd flag  | Environment variable | Configuration key |
|:------------  |:-------------------- |:----------------- |
| `--nats-port` | `INFLUXD_NATS_PORT`  | `nats-port`       |

###### influxd flag
```sh
influxd --nats-port=-1
```

###### Environment variable
```sh
export INFLUXD_NATS_PORT=-1
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
nats-port: -1
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
nats-port = -1
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "nats-port": -1
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### no-tasks
Disable the task scheduler.
If problematic tasks prevent InfluxDB from starting, use this option to start
InfluxDB without scheduling or executing tasks.

**Default:** `false`

| influxd flag | Environment variable | Configuration key |
|:------------ |:-------------------- |:----------------- |
| `--no-tasks` | `INFLUXD_NO_TASKS`   | `no-tasks`        |

###### influxd flag
```sh
influxd --no-tasks
```

###### Environment variable
```sh
export INFLUXD_NO_TASKS=true
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
no-tasks: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
no-tasks = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "no-tasks": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### pprof-disabled
Disable the `/debug/pprof` HTTP endpoint.
This endpoint provides runtime profiling data and can be helpful when debugging.

**Default:** `false`

| influxd flag       | Environment variable     | Configuration key |
|:-------------------|:-------------------------|:------------------|
| `--pprof-disabled` | `INFLUXD_PPROF_DISABLED` | `pprof-disabled`  |

###### influxd flag
```sh
influxd --pprof-disabled
```

###### Environment variable
```sh
export INFLUXD_PPROF_DISABLED=true
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
pprof-disabled: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
pprof-disabled = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "pprof-disabled": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### query-concurrency
Number of queries allowed to execute concurrently.

**Default:** `10`

| influxd flag          | Environment variable        | Configuration key   |
|:------------          |:--------------------        |:-----------------   |
| `--query-concurrency` | `INFLUXD_QUERY_CONCURRENCY` | `query-concurrency` |

###### influxd flag
```sh
influxd --query-concurrency=10
```

###### Environment variable
```sh
export INFLUXD_QUERY_CONCURRENCY=10
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
query-concurrency: 10
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
query-concurrency = 10
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "query-concurrency": 10
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### query-initial-memory-bytes
Initial bytes of memory allocated for a query.

**Default:** _equal to_ [query-memory-bytes](#query-memory-bytes)

| influxd flag                   | Environment variable                 | Configuration key            |
|:------------                   |:--------------------                 |:-----------------            |
| `--query-initial-memory-bytes` | `INFLUXD_QUERY_INITIAL_MEMORY_BYTES` | `query-initial-memory-bytes` |

###### influxd flag
```sh
influxd --query-initial-memory-bytes=10485760
```

###### Environment variable
```sh
export INFLUXD_QUERY_INITIAL_MEMORY_BYTES=10485760
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
query-initial-memory-bytes: 10485760
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
query-initial-memory-bytes = 10485760
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "query-initial-memory-bytes": 10485760
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### query-max-memory-bytes
Maximum total bytes of memory allowed for queries.

**Default:** _equal to_ [query-concurrency](#query-concurrency) × [query-memory-bytes](#query-memory-bytes)

| influxd flag               | Environment variable             | Configuration key        |
|:------------               |:--------------------             |:-----------------        |
| `--query-max-memory-bytes` | `INFLUXD_QUERY_MAX_MEMORY_BYTES` | `query-max-memory-bytes` |

###### influxd flag
```sh
influxd --query-max-memory-bytes=104857600
```

###### Environment variable
```sh
export INFLUXD_QUERY_MAX_MEMORY_BYTES=104857600
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
query-max-memory-bytes: 104857600
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
query-max-memory-bytes = 104857600
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "query-max-memory-bytes": 104857600
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### query-memory-bytes
Maximum bytes of memory allowed for a single query.

**Default:** _unlimited_

{{% note %}}
Must be greater than or equal to [query-initial-memory-bytes](#query-initial-memory-bytes).
{{% /note %}}

| influxd flag           | Environment variable         | Configuration key    |
|:------------           |:--------------------         |:-----------------    |
| `--query-memory-bytes` | `INFLUXD_QUERY_MEMORY_BYTES` | `query-memory-bytes` |

###### influxd flag
```sh
influxd --query-memory-bytes=10485760
```

###### Environment variable
```sh
export INFLUXD_QUERY_MEMORY_BYTES=10485760
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
query-memory-bytes: 10485760
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
query-memory-bytes = 10485760
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "query-memory-bytes": 10485760
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### query-queue-size
Maximum number of queries allowed in execution queue.
When queue limit is reached, new queries are rejected.

**Default:** `10`

| influxd flag         | Environment variable       | Configuration key  |
|:------------         |:--------------------       |:-----------------  |
| `--query-queue-size` | `INFLUXD_QUERY_QUEUE_SIZE` | `query-queue-size` |

###### influxd flag
```sh
influxd --query-queue-size=10
```

###### Environment variable
```sh
export INFLUXD_QUERY_QUEUE_SIZE=10
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
query-queue-size: 10
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
query-queue-size = 10
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "query-queue-size": 10
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### reporting-disabled
Disables sending telemetry data to InfluxData.
The [InfluxData telemetry](https://www.influxdata.com/telemetry) page provides
information about what data is collected and how InfluxData uses it.

**Default:** `false`

| influxd flag           | Environment variable         | Configuration key    |
|:------------           |:--------------------         |:-----------------    |
| `--reporting-disabled` | `INFLUXD_REPORTING_DISABLED` | `reporting-disabled` |

###### influxd flag
```sh
influxd --reporting-disabled
```

###### Environment variable
```sh
export INFLUXD_REPORTING_DISABLED=true
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
reporting-disabled: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
reporting-disabled = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "reporting-disabled": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### secret-store
Specifies the data store for secrets such as passwords and tokens.
Store secrets in either the InfluxDB [internal BoltDB](#bolt-path)
or in [Vault](https://www.vaultproject.io/).

**Options:** `bolt`, `vault`  
**Default:** `bolt`  

| influxd flag     | Environment variable   | Configuration key |
|:------------     |:--------------------   |:----------------- |
| `--secret-store` | `INFLUXD_SECRET_STORE` | `secret-store`    |

###### influxd flag
```sh
influxd --secret-store=bolt
```

###### Environment variable
```sh
export INFLUXD_SECRET_STORE=bolt
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
secret-store: bolt
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
secret-store = "bolt"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "secret-store": "bolt"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### session-length
Specifies the Time to Live (TTL) **in minutes** for newly created user sessions.

**Default:** `60`

| influxd flag       | Environment variable     | Configuration key |
|:------------       |:--------------------     |:----------------- |
| `--session-length` | `INFLUXD_SESSION_LENGTH` | `session-length`  |

###### influxd flag
```sh
influxd --session-length=60
```

###### Environment variable
```sh
export INFLUXD_SESSION_LENGTH=60
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
session-length: 60
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
session-length = 60
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "session-length": 60
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### session-renew-disabled
Disables automatically extending a user's session TTL on each request.
By default, every request sets the session's expiration time to five minutes from now.
When disabled, sessions expire after the specified [session length](#session-length)
and the user is redirected to the login page, even if recently active.

**Default:** `false`

| influxd flag               | Environment variable             | Configuration key        |
|:------------               |:--------------------             |:-----------------        |
| `--session-renew-disabled` | `INFLUXD_SESSION_RENEW_DISABLED` | `session-renew-disabled` |

###### influxd flag
```sh
influxd --session-renew-disabled
```

###### Environment variable
```sh
export INFLUXD_SESSION_RENEW_DISABLED=true
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
session-renew-disabled: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
session-renew-disabled = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "session-renew-disabled": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-cache-max-memory-size
Maximum size (in bytes) a shard's cache can reach before it starts rejecting writes.

**Default:** `1073741824`

| influxd flag                      | Environment variable                    | Configuration key               |
|:------------                      |:--------------------                    |:-----------------               |
| `--storage-cache-max-memory-size` | `INFLUXD_STORAGE_CACHE_MAX_MEMORY_SIZE` | `storage-cache-max-memory-size` |

###### influxd flag
```sh
influxd --storage-cache-max-memory-size=1073741824
```

###### Environment variable
```sh
export INFLUXD_STORAGE_CACHE_MAX_MEMORY_SIZE=1073741824
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-cache-max-memory-size: 1073741824
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-cache-max-memory-size = 1073741824
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-cache-max-memory-size": 1073741824
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-cache-snapshot-memory-size
Size (in bytes) at which the storage engine will snapshot the cache
and write it to a TSM file to make more memory available.

**Default:** `26214400`)

| influxd flag                           | Environment variable                         | Configuration key                    |
|:------------                           |:--------------------                         |:-----------------                    |
| `--storage-cache-snapshot-memory-size` | `INFLUXD_STORAGE_CACHE_SNAPSHOT_MEMORY_SIZE` | `storage-cache-snapshot-memory-size` |

###### influxd flag
```sh
influxd --storage-cache-snapshot-memory-size=26214400
```

###### Environment variable
```sh
export INFLUXD_STORAGE_CACHE_SNAPSHOT_MEMORY_SIZE=26214400
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-cache-snapshot-memory-size: 26214400
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-cache-snapshot-memory-size = 26214400
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-cache-snapshot-memory-size": 26214400
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-cache-snapshot-write-cold-duration
Duration at which the storage engine will snapshot the cache and
write it to a new TSM file if the shard hasn't received writes or deletes.

**Default:** `10m0s`

| influxd flag                                   | Environment variable                                 | Configuration key                            |
|:------------                                   |:--------------------                                 |:-----------------                            |
| `--storage-cache-snapshot-write-cold-duration` | `INFLUXD_STORAGE_CACHE_SNAPSHOT_WRITE_COLD_DURATION` | `storage-cache-snapshot-write-cold-duration` |

###### influxd flag
```sh
influxd --storage-cache-snapshot-write-cold-duration=10m0s
```

###### Environment variable
```sh
export INFLUXD_STORAGE_CACHE_SNAPSHOT_WRITE_COLD_DURATION=10m0s
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-cache-snapshot-write-cold-duration: 10m0s
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-cache-snapshot-write-cold-duration = "10m0s"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-cache-snapshot-write-cold-duration": "10m0s"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-compact-full-write-cold-duration
Duration at which the storage engine will compact all TSM files in a
shard if it hasn't received writes or deletes.

**Default:** `4h0m0s`

| influxd flag                                 | Environment variable                               | Configuration key                          |
|:------------                                 |:--------------------                               |:-----------------                          |
| `--storage-compact-full-write-cold-duration` | `INFLUXD_STORAGE_COMPACT_FULL_WRITE_COLD_DURATION` | `storage-compact-full-write-cold-duration` |

###### influxd flag
```sh
influxd --storage-compact-full-write-cold-duration=4h0m0s
```

###### Environment variable
```sh
export INFLUXD_STORAGE_COMPACT_FULL_WRITE_COLD_DURATION=4h0m0s
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-compact-full-write-cold-duration: 4h0m0s
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-compact-full-write-cold-duration = "4h0m0s"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-compact-full-write-cold-duration": "4h0m0s"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-compact-throughput-burst
Rate limit (in bytes per second) that TSM compactions can write to disk.

**Default:** `50331648`

| influxd flag                         | Environment variable                       | Configuration key                  |
|:------------                         |:--------------------                       |:-----------------                  |
| `--storage-compact-throughput-burst` | `INFLUXD_STORAGE_COMPACT_THROUGHPUT_BURST` | `storage-compact-throughput-burst` |

###### influxd flag
```sh
influxd --storage-compact-throughput-burst=50331648
```

###### Environment variable
```sh
export INFLUXD_STORAGE_COMPACT_THROUGHPUT_BURST=50331648
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-compact-throughput-burst: 50331648
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-compact-throughput-burst = 50331648
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-compact-throughput-burst": 50331648
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-max-concurrent-compactions
Maximum number of full and level compactions that can run concurrently.
A value of `0` results in 50% of `runtime.GOMAXPROCS(0)` used at runtime.
Any number greater than zero limits compactions to that value.
_This setting does not apply to cache snapshotting._

**Default:** `0`

| influxd flag                           | Environment variable                         | Configuration key                    |
|:------------                           |:--------------------                         |:-----------------                    |
| `--storage-max-concurrent-compactions` | `INFLUXD_STORAGE_MAX_CONCURRENT_COMPACTIONS` | `storage-max-concurrent-compactions` |

###### influxd flag
```sh
influxd --storage-max-concurrent-compactions=0
```

###### Environment variable
```sh
export INFLUXD_STORAGE_MAX_CONCURRENT_COMPACTIONS=0
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-max-concurrent-compactions: 0
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-max-concurrent-compactions = 0
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-max-concurrent-compactions": 0
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-max-index-log-file-size
Size (in bytes) at which an index write-ahead log (WAL) file will compact into an index file.
Lower sizes will cause log files to be compacted more quickly and result in lower
heap usage at the expense of write throughput.

**Default:** `1048576`

| influxd flag                        | Environment variable                      | Configuration key                 |
|:------------                        |:--------------------                      |:-----------------                 |
| `--storage-max-index-log-file-size` | `INFLUXD_STORAGE_MAX_INDEX_LOG_FILE_SIZE` | `storage-max-index-log-file-size` |

###### influxd flag
```sh
influxd --storage-max-index-log-file-size=1048576
```

###### Environment variable
```sh
export INFLUXD_STORAGE_MAX_INDEX_LOG_FILE_SIZE=1048576
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-max-index-log-file-size: 1048576
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-max-index-log-file-size = 1048576
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-max-index-log-file-size": 1048576
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-retention-check-interval
Interval of retention policy enforcement checks.

**Default:** `30m0s`

| influxd flag                         | Environment variable                       | Configuration key                  |
|:------------                         |:--------------------                       |:-----------------                  |
| `--storage-retention-check-interval` | `INFLUXD_STORAGE_RETENTION_CHECK_INTERVAL` | `storage-retention-check-interval` |

###### influxd flag
```sh
influxd --storage-retention-check-interval=30m0s
```

###### Environment variable
```sh
export INFLUXD_STORAGE_MAX_INDEX_LOG_FILE_SIZE=30m0s
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-retention-check-interval: 30m0s
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-retention-check-interval = "30m0s"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-retention-check-interval": "30m0s"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-series-file-max-concurrent-snapshot-compactions
Maximum number of snapshot compactions that can run concurrently across
all series partitions in a database.

**Default:** `0`

| influxd flag                                                | Environment variable                                              | Configuration key                                         |
|:------------                                                |:--------------------                                              |:-----------------                                         |
| `--storage-series-file-max-concurrent-snapshot-compactions` | `INFLUXD_STORAGE_SERIES_FILE_MAX_CONCURRENT_SNAPSHOT_COMPACTIONS` | `storage-series-file-max-concurrent-snapshot-compactions` |

###### influxd flag
```sh
influxd --storage-series-file-max-concurrent-snapshot-compactions=0
```

###### Environment variable
```sh
export INFLUXD_STORAGE_SERIES_FILE_MAX_CONCURRENT_SNAPSHOT_COMPACTIONS=0
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-series-file-max-concurrent-snapshot-compactions: 0
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-series-file-max-concurrent-snapshot-compactions = 0
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-series-file-max-concurrent-snapshot-compactions": 0
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-series-id-set-cache-size
Size of the internal cache used in the TSI index to store
previously calculated series results.
Cached results are returned quickly rather than needing to be recalculated when
a subsequent query with the same tag key/value predicate is executed.
Setting this value to `0` will disable the cache and may decrease query performance.

**Default:** `100`

{{% note %}}
This value should only be increased if the set of regularly used tag key/value
predicates across all measurements for a database is larger than 100.
An increase in cache size may lead to an increase in heap usage.
{{% /note %}}

| influxd flag                                                | Environment variable                                              | Configuration key                                         |
|:------------                                                |:--------------------                                              |:-----------------                                         |
| `--storage-series-id-set-cache-size` | `INFLUXD_STORAGE_SERIES_ID_SET_CACHE_SIZE` | `storage-series-id-set-cache-size` |

###### influxd flag
```sh
influxd --storage-series-id-set-cache-size=100
```

###### Environment variable
```sh
export INFLUXD_STORAGE_SERIES_ID_SET_CACHE_SIZE=100
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-series-id-set-cache-size: 100
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-series-id-set-cache-size = 100
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-series-id-set-cache-size": 100
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-shard-precreator-advance-period
The time before a shard group's end-time that the successor shard group is created.

**Default:** `30m0s`

| influxd flag                                | Environment variable                              | Configuration key                         |
|:------------                                |:--------------------                              |:-----------------                         |
| `--storage-shard-precreator-advance-period` | `INFLUXD_STORAGE_SHARD_PRECREATOR_ADVANCE_PERIOD` | `storage-shard-precreator-advance-period` |

###### influxd flag
```sh
influxd --storage-shard-precreator-advance-period=30m0s
```

###### Environment variable
```sh
export INFLUXD_STORAGE_SHARD_PRECREATOR_ADVANCE_PERIOD=30m0s
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-shard-precreator-advance-period: 30m0s
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-shard-precreator-advance-period = "30m0s"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-shard-precreator-advance-period": "30m0s"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-shard-precreator-check-interval
Interval of pre-create new shards check.

**Default:** `10m0s`

| influxd flag                                | Environment variable                              | Configuration key                         |
|:------------                                |:--------------------                              |:-----------------                         |
| `--storage-shard-precreator-check-interval` | `INFLUXD_STORAGE_SHARD_PRECREATOR_CHECK_INTERVAL` | `storage-shard-precreator-check-interval` |

###### influxd flag
```sh
influxd --storage-shard-precreator-check-interval=10m0s
```

###### Environment variable
```sh
export INFLUXD_STORAGE_SHARD_PRECREATOR_CHECK_INTERVAL=10m0s
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-shard-precreator-check-interval: 10m0s
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-shard-precreator-check-interval = "10m0s"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-shard-precreator-check-interval": "10m0s"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-tsm-use-madv-willneed
Inform the kernel that InfluxDB intends to page in mmap'd sections of TSM files.

**Default:** `false`

| influxd flag                      | Environment variable                    | Configuration key               |
|:------------                      |:--------------------                    |:-----------------               |
| `--storage-tsm-use-madv-willneed` | `INFLUXD_STORAGE_TSM_USE_MADV_WILLNEED` | `storage-tsm-use-madv-willneed` |

###### influxd flag
```sh
influxd --storage-tsm-use-madv-willneed
```

###### Environment variable
```sh
export INFLUXD_STORAGE_TSM_USE_MADV_WILLNEED=true
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-tsm-use-madv-willneed: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-tsm-use-madv-willneed = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-tsm-use-madv-willneed": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-validate-keys
Validate incoming writes to ensure keys have only valid unicode characters.

**Default:** `false`

| influxd flag              | Environment variable            | Configuration key       |
|:------------              |:--------------------            |:-----------------       |
| `--storage-validate-keys` | `INFLUXD_STORAGE_VALIDATE_KEYS` | `storage-validate-keys` |

###### influxd flag
```sh
influxd --storage-validate-keys
```

###### Environment variable
```sh
export INFLUXD_STORAGE_VALIDATE_KEYS=true
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-validate-keys: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-validate-keys = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-validate-keys": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### storage-wal-fsync-delay
Duration a write will wait before fsyncing.
A duration greater than `0` batches multiple fsync calls.
This is useful for slower disks or when WAL write contention is present.

**Default:** `0s`

| influxd flag                | Environment variable              | Configuration key         |
|:------------                |:--------------------              |:-----------------         |
| `--storage-wal-fsync-delay` | `INFLUXD_STORAGE_WAL_FSYNC_DELAY` | `storage-wal-fsync-delay` |

###### influxd flag
```sh
influxd --storage-wal-fsync-delay=0s
```

###### Environment variable
```sh
export INFLUXD_STORAGE_WAL_FSYNC_DELAY=0s
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
storage-wal-fsync-delay: 0s
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
storage-wal-fsync-delay = "0s"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "storage-wal-fsync-delay": "0s"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### store
Specifies the data store for REST resources.

**Options:** `bolt`, `memory`  
**Default:** `bolt`  

{{% note %}}
`memory` is meant for transient environments, such as testing environments, where
data persistence does not matter.
InfluxData does not recommend using `memory` in production.
{{% /note %}}

| influxd flag | Environment variable | Configuration key |
|:------------ |:-------------------- |:----------------- |
| `--store`    | `INFLUXD_STORE`      | `store`           |

###### influxd flag
```sh
influxd --store=bolt
```

###### Environment variable
```sh
export INFLUXD_STORE=bolt
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
store: bolt
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
store = "bolt"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "store": "bolt"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### testing-always-allow-setup
Ensures the `/api/v2/setup` endpoint always returns `true` to allow onboarding.
This configuration option is primary used in continuous integration tests.

**Default:** `false`

| influxd flag                   | Environment variable                 | Configuration key            |
|:------------                   |:--------------------                 |:-----------------            |
| `--testing-always-allow-setup` | `INFLUXD_TESTING_ALWAYS_ALLOW_SETUP` | `testing-always-allow-setup` |

###### influxd flag
```sh
influxd --testing-always-allow-setup
```

###### Environment variable
```sh
export INFLUXD_TESTING_ALWAYS_ALLOW_SETUP=true
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
testing-always-allow-setup: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
testing-always-allow-setup = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "testing-always-allow-setup": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### tls-cert
Path to TLS certificate file.
Requires the [`tls-key`](#tls-key) to be set.

_For more information, see [Enable TLS encryption](/influxdb/v2.0/security/enable-tls/)._

| influxd flag | Environment variable | Configuration key |
|:------------ |:-------------------- |:----------------- |
| `--tls-cert` | `INFLUXD_TLS_CERT`   | `tls-cert`        |

###### influxd flag
```sh
influxd --tls-cert=/path/to/influxdb.crt
```

###### Environment variable
```sh
export INFLUXD_TLS_CERT=/path/to/influxdb.crt
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
tls-cert: /path/to/influxdb.crt
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
tls-cert = "/path/to/influxdb.crt"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "tls-cert": "/path/to/influxdb.crt"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### tls-key
Path to TLS key file.
Requires the [`tls-cert`](#tls-cert) to be set.

_For more information, see [Enable TLS encryption](/influxdb/v2.0/security/enable-tls/)._

| influxd flag | Environment variable | Configuration key |
|:------------ |:-------------------- |:----------------- |
| `--tls-key` | `INFLUXD_TLS_KEY`   | `tls-key`        |

###### influxd flag
```sh
influxd --tls-key=/path/to/influxdb.key
```

###### Environment variable
```sh
export INFLUXD_TLS_KEY=/path/to/influxdb.key
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
tls-key: /path/to/influxdb.key
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
tls-key = "/path/to/influxdb.key"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "tls-key": "/path/to/influxdb.key"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### tls-min-version
Minimum accepted TLS version.

**Default:** `1.2`

| influxd flag        | Environment variable      | Configuration key |
|:------------        |:--------------------      |:----------------- |
| `--tls-min-version` | `INFLUXD_TLS_MIN_VERSION` | `tls-min-version` |

###### influxd flag
```sh
influxd --tls-min-version=1.2
```

###### Environment variable
```sh
export INFLUXD_TLS_MIN_VERSION=1.2
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
tls-min-version: "1.2"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
tls-min-version = "1.2"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "tls-min-version": "1.2"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### tls-strict-ciphers
Restrict accepted TLS ciphers to:

- ECDHE_RSA_WITH_AES_256_GCM_SHA384
- ECDHE_RSA_WITH_AES_256_CBC_SHA
- RSA_WITH_AES_256_GCM_SHA384
- RSA_WITH_AES_256_CBC_SHA

**Default:** `false`

| influxd flag           | Environment variable         | Configuration key    |
|:------------           |:--------------------         |:-----------------    |
| `--tls-strict-ciphers` | `INFLUXD_TLS_STRICT_CIPHERS` | `tls-strict-ciphers` |

###### influxd flag
```sh
influxd --tls-strict-ciphers
```

###### Environment variable
```sh
export INFLUXD_TLS_STRICT_CIPHERS=true
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
tls-strict-ciphers: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
tls-strict-ciphers = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "tls-strict-ciphers": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### tracing-type
Enable tracing in InfluxDB and specifies the tracing type.
Tracing is disabled by default.

**Options:** `log`, `jaeger`

| influxd flag     | Environment variable   | Configuration key |
|:------------     |:--------------------   |:----------------- |
| `--tracing-type` | `INFLUXD_TRACING_TYPE` | `tracing-type`    |

###### influxd flag
```sh
influxd --tracing-type=log
```

###### Environment variable
```sh
export INFLUXD_TRACING_TYPE=log
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
tracing-type: log
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
tracing-type = "log"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "tracing-type": "log"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### vault-addr
Specifies the address of the Vault server expressed as a URL and port.
For example: `https://127.0.0.1:8200/`.

| influxd flag   | Environment variable | Configuration key |
|:------------   |:-------------------- |:----------------- |
| `--vault-addr` | `VAULT_ADDR`         | `vault-addr`      |

###### influxd flag
```sh
influxd --vault-addr=https://127.0.0.1:8200/
```

###### Environment variable
```sh
export VAULT_ADDR=https://127.0.0.1:8200/
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
vault-addr: https://127.0.0.1:8200/
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
vault-addr = "https://127.0.0.1:8200/"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "vault-addr": "https://127.0.0.1:8200/"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### vault-cacert
Specifies the path to a PEM-encoded CA certificate file on the local disk.
This file is used to verify the Vault server's SSL certificate.
**This setting takes precedence over the [`--vault-capath`](#vault-capath) setting.**

| influxd flag     | Environment variable | Configuration key |
|:------------     |:-------------------- |:----------------- |
| `--vault-cacert` | `VAULT_CACERT`       | `vault-cacert`    |

###### influxd flag
```sh
influxd  --vault-cacert=/path/to/ca.pem
```

###### Environment variable
```sh
export VAULT_CACERT=/path/to/ca.pem
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
vault-cacert: /path/to/ca.pem
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
vault-cacert = "/path/to/ca.pem"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "vault-cacert": "/path/to/ca.pem"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### vault-capath
Specifies the path to a directory of PEM-encoded CA certificate files on the local disk.
These certificates are used to verify the Vault server's SSL certificate.

| influxd flag     | Environment variable | Configuration key |
|:------------     |:-------------------- |:----------------- |
| `--vault-capath` | `VAULT_CAPATH`       | `vault-capath`    |

###### influxd flag
```sh
influxd --vault-capath=/path/to/certs/
```

###### Environment variable
```sh
export VAULT_CAPATH=/path/to/certs/
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
vault-capath: /path/to/certs/
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
vault-capath = "/path/to/certs/"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "vault-capath": "/path/to/certs/"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### vault-client-cert
Specifies the path to a PEM-encoded client certificate on the local disk.
This file is used for TLS communication with the Vault server.

| influxd flag          | Environment variable | Configuration key   |
|:------------          |:-------------------- |:-----------------   |
| `--vault-client-cert` | `VAULT_CLIENT_CERT`  | `vault-client-cert` |

###### influxd flag
```sh
influxd --vault-client-cert=/path/to/client_cert.pem
```

###### Environment variable
```sh
export VAULT_CLIENT_CERT=/path/to/client_cert.pem
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
vault-client-cert: /path/to/client_cert.pem
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
vault-client-cert = "/path/to/client_cert.pem"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "vault-client-cert": "/path/to/client_cert.pem"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### vault-client-key
Specifies the path to an unencrypted, PEM-encoded private key on disk which
corresponds to the matching client certificate.

| influxd flag          | Environment variable | Configuration key   |
|:------------          |:-------------------- |:-----------------   |
| `--vault-client-key` | `VAULT_CLIENT_KEY`  | `vault-client-key` |

###### influxd flag
```sh
influxd --vault-client-key=/path/to/private_key.pem
```

###### Environment variable
```sh
export VAULT_CLIENT_KEY=/path/to/private_key.pem
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
vault-client-key: /path/to/private_key.pem
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
vault-client-key = "/path/to/private_key.pem"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "vault-client-key": "/path/to/private_key.pem"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### vault-max-retries
Specifies the maximum number of retries when encountering a 5xx error code.
The default is 2 (for three attempts in total). Set this to 0 or less to disable retrying.

**Default:** `2`  

| influxd flag          | Environment variable | Configuration key   |
|:------------          |:-------------------- |:-----------------   |
| `--vault-max-retries` | `VAULT_MAX_RETRIES`  | `vault-max-retries` |

###### influxd flag
```sh
influxd --vault-max-retries=2
```

###### Environment variable
```sh
export VAULT_MAX_RETRIES=2
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
vault-max-retries: 2
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
vault-max-retries = 2
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "vault-max-retries": 2
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### vault-client-timeout
Specifies the Vault client timeout.

**Default:** `60s`  

| influxd flag             | Environment variable   | Configuration key      |
|:------------             |:--------------------   |:-----------------      |
| `--vault-client-timeout` | `VAULT_CLIENT_TIMEOUT` | `vault-client-timeout` |

###### influxd flag
```sh
influxd --vault-client-timeout=60s
```

###### Environment variable
```sh
export VAULT_CLIENT_TIMEOUT=60s
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
vault-client-timeout: 60s
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
vault-client-timeout = "60s"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "vault-client-timeout": "60s"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### vault-skip-verify
Skip certificate verification when communicating with Vault.
_Setting this variable voids [Vault's security model](https://www.vaultproject.io/docs/internals/security.html)
and is **not recommended**._

**Default:** `false`

| influxd flag          | Environment variable | Configuration key   |
|:------------          |:-------------------- |:-----------------   |
| `--vault-skip-verify` | `VAULT_SKIP_VERIFY`  | `vault-skip-verify` |

###### influxd flag
```sh
influxd --vault-skip-verify
```

###### Environment variable
```sh
export VAULT_SKIP_VERIFY=true
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
vault-skip-verify: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
vault-skip-verify = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "vault-skip-verify": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### vault-tls-server-name
Specifies the name to use as the Server Name Indication (SNI) host when connecting via TLS.

| influxd flag              | Environment variable    | Configuration key       |
|:------------              |:--------------------    |:-----------------       |
| `--vault-tls-server-name` | `VAULT_TLS_SERVER_NAME` | `vault-tls-server-name` |

###### influxd flag
```sh
influxd --vault-tls-server-name=secure.example.com
```

###### Environment variable
```sh
export VAULT_TLS_SERVER_NAME=secure.example.com
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
vault-tls-server-name: secure.example.com
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
vault-tls-server-name = "secure.example.com"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "vault-tls-server-name": "secure.example.com"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### vault-token
Specifies the Vault authentication token use when authenticating with Vault.

| influxd flag    | Environment variable | Configuration key |
|:------------    |:-------------------- |:----------------- |
| `--vault-token` | `VAULT_TOKEN`        | `vault-token`     |

###### influxd flag
```sh
influxd --vault-token=exAmple-t0ken-958a-f490-c7fd0eda5e9e
```

###### Environment variable
```sh
export VAULT_TOKEN=exAmple-t0ken-958a-f490-c7fd0eda5e9e
```

###### Configuration file
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
vault-token: exAmple-t0ken-958a-f490-c7fd0eda5e9e
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
vault-token = "exAmple-t0ken-958a-f490-c7fd0eda5e9e"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "vault-token": "exAmple-t0ken-958a-f490-c7fd0eda5e9e"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
