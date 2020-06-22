---
title: InfluxDB configuration options
description: >
  Customize your InfluxDB configuration by using [`influxd`](/v2.0/reference/cli/influxd/)
  configuration flags, setting environment variables, or defining configuration
  options in a configuration file.
menu:
  v2_0_ref:
    name: Configuration options
    weight: 3
products: [oss]
related:
  - /v2.0/reference/cli/influxd
---

Customize your InfluxDB configuration by using [`influxd`](/v2.0/reference/cli/influxd/)
configuration flags, setting environment variables, or defining configuration
options in a configuration file.

### Configuration precedence
InfluxDB honors configuration settings using the following precedence:

1. `influxd` flags
2. Environment variables
3. Settings defined in a configuration file

### InfluxDB configuration file
When `influxd` starts, it checks for a file named `config.*` (the file extension
depends on the syntax) **in the current working directory**.
To customize the directory path of the configuration file, set the `INFLUXD_CONFIG_PATH`
environment variable to your custom path.
On startup, `influxd` will check for a `config.*` in the `INFLUXD_CONFIG_PATH` directory.

InfluxDB supports **YAML** (`.yaml`, `.yml`), **TOML** (`.toml`), and **JSON** (`.json`) configuration files.

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
query-concurrency = 20.0
query-queue-size = 15.0
secret-store = "vault"
session-length = 120.0
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
[`influxd` service](/v2.0/reference/cli/influxd):

- [assets-path](#assets-path)
- [bolt-path](#bolt-path)
- [e2e-testing](#e2e-testing)
- [engine-path](#engine-path)
- [http-bind-address](#http-bind-address)
- [log-level](#log-level)
- [new-meta-store](#new-meta-store)
- [new-meta-store-read-only](#new-meta-store-read-only)
- [no-tasks](#no-tasks)
- [query-concurrency](#query-concurrency)
- [query-initial-memory-bytes](#query-initial-memory-bytes)
- [query-max-memory-bytes](#query-max-memory-bytes)
- [query-memory-bytes](#query-memory-bytes)
- [query-queue-size](#query-queue-size)
- [reporting-disabled](#reporting-disabled)
- [secret-store](#secret-store)
- [session-length](#session-length)
- [session-renew-disabled](#session-renew-disabled)
- [store](#store)
- [tls-cert](#tls-cert)
- [tls-key](#tls-key)
- [tracing-type](#tracing-type)
- [vault-addr](#vault-addr)
- [vault-cacert](#vault-cacert)
- [vault-capath](#vault-capath)
- [vault-client-cert](#vault-client-cert)
- [vault-client-key](#vault-client-key)
- [vault-max-retries](#vault-max-retries)
- [vault-client-timeout](#vault-client-timeout)
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
Define the path to the [BoltDB](https://github.com/boltdb/bolt) database.
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
Define the path to persistent storage engine files where InfluxDB stores all
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
Define the bind address for the InfluxDB HTTP API.
Customize the URL and port for the InfluxDB API and UI.

**Default:** `:9999`  

| influxd flag          | Environment variable        | Configuration key   |
|:------------          |:--------------------        |:-----------------   |
| `--http-bind-address` | `INFLUXD_HTTP_BIND_ADDRESS` | `http-bind-address` |

###### influxd flag
```sh
influxd --http-bind-address=:9999
```

###### Environment variable
```sh
export INFLUXD_HTTP_BIND_ADDRESS=:9999
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
http-bind-address: ":9999"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
http-bind-address = ":9999"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "http-bind-address": ":9999"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### log-level
Define the log output level.
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

### new-meta-store
Enable the new meta store.

**Default:** `false`

| influxd flag       | Environment variable     | Configuration key |
|:------------       |:--------------------     |:----------------- |
| `--new-meta-store` | `INFLUXD_NEW_META_STORE` | `new-meta-store`  |

###### influxd flag
```sh
influxd --new-meta-store
```

###### Environment variable
```sh
export INFLUXD_NEW_META_STORE=true
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
new-meta-store: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
new-meta-store = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "new-meta-store": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

### new-meta-store-read-only
Toggle read-only mode for the new meta store.
If `true`, reads are duplicated between old and new meta stores
(if [new meta store](#new-meta-store) is enabled).

**Default:** `true`

| influxd flag                 | Environment variable               | Configuration key          |
|:------------                 |:--------------------               |:-----------------          |
| `--new-meta-store-read-only` | `INFLUXD_NEW_META_STORE_READ_ONLY` | `new-meta-store-read-only` |

###### influxd flag
```sh
influxd --new-meta-store-read-only
```

###### Environment variable
```sh
export INFLUXD_NEW_META_STORE_READ_ONLY=true
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
new-meta-store-read-only: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
new-meta-store-read-only = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "new-meta-store-read-only": true
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

### tls-cert
Path to TLS certificate file.
Requires the [`tls-key`](#tls-key) to be set.

_For more information, see [Enable TLS encryption](https://v2.docs.influxdata.com/v2.0/security/enable-tls/)._

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

_For more information, see [Enable TLS encryption](https://v2.docs.influxdata.com/v2.0/security/enable-tls/)._

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

### tracing-type
Enables tracing in InfluxDB and specifies the tracing type.
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
