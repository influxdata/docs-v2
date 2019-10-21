---
title: InfluxDB configuration options
description: >
  Configure InfluxDB when starting the `influxd` service.
  This article outlines the different configuration options available.
menu:
  v2_0_ref:
    name: Configuration options
    weight: 2
---

To configure InfluxDB, use the following configuration options when starting the
[`influxd` service](/v2.0/reference/cli/influxd):

- [--assets-path](#assets-path)
- [--bolt-path](#bolt-path)
- [--e2e-testing](#e2e-testing)
- [--engine-path](#engine-path)
- [--http-bind-address](#http-bind-address)
- [--log-level](#log-level)
- [--reporting-disabled](#reporting-disabled)
- [--secret-store](#secret-store)
- [--session-length](#session-length)
- [--session-renew-disabled](#session-renew-disabled)
- [--store](#store)
- [--tracing-type](#tracing-type)
- [--vault-addr](#vault-addr)
- [--vault-cacert](#vault-cacert)
- [--vault-capath](#vault-capath)
- [--vault-client-cert](#vault-client-cert)
- [--vault-client-key](#vault-client-key)
- [--vault-max-retries](#vault-max-retries)
- [--vault-client-timeout](#vault-client-timeout)
- [--vault-skip-verify](#vault-skip-verify)
- [--vault-tls-server-name](#vault-tls-server-name)
- [--vault-token](#vault-token)

---

## --assets-path
_Typically, InfluxData internal use only._
Overrides the default InfluxDB user interface (UI) assets by serving assets from the specified directory.

```sh
influxd --assets-path=/path/to/custom/assets-dir
```

---

## --bolt-path
Defines the path to the [BoltDB](https://github.com/boltdb/bolt) database.
BoltDB is a key value store written in Go.
InfluxDB uses BoltDB to store data including organization and
user information, UI data, REST resources, and other key value data.

**Default:** `~/.influxdbv2/influxd.bolt`  

```sh
influxd --bolt-path=~/.influxdbv2/influxd.bolt
```

---

## --e2e-testing
Adds a `/debug/flush` endpoint to the InfluxDB HTTP API to clear stores.
InfluxData uses this endpoint in end-to-end testing.

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
Customize the URL and port for the InfluxDB API and UI.

**Default:** `:9999`  

```sh
influxd --http-bind-address=:9999
```

---

## --log-level
Defines the log output level.
InfluxDB outputs log entries with severity levels greater than or equal to the level specified.

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

## --session-length
Specifies the Time to Live (TTL) **in minutes** for newly created user sessions.

**Default:** `60`

```sh
influxd --session-length=60
```

---

## --session-renew-disabled
Disables automatically extending a user's session TTL on each request.
By default, every request sets the session's expiration time to five minutes from now.
When disabled, sessions expire after the specified [session length](#session-length)
and the user is redirected to the login page, even if recently active.

```sh
influxd --session-renew-disabled
```

---

## --store
Specifies the data store for REST resources.

**Options:** `bolt`, `memory`  
**Default:** `bolt`  

{{% note %}}
`memory` is meant for transient environments, such as testing environments, where
data persistence does not matter.
InfluxData does not recommend using `memory` in production.
{{% /note %}}

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

---

## --vault-addr
Specifies the address of the Vault server expressed as a URL and port.
For example: `https://127.0.0.1:8200/`.

```sh
influxd --vault-addr=https://127.0.0.1:8200/
```

_You can also set this using the `VAULT_ADDR` environment variable, however
`influxd` flags take precedence over environment variables._

---

## --vault-cacert
Specifies the path to a PEM-encoded CA certificate file on the local disk.
This file is used to verify the Vault server's SSL certificate.
**This setting takes precedence over the [`--vault-capath`](#vault-capath) setting.**

```sh
influxd  --vault-cacert=/path/to/ca.pem
```

_You can also set this using the `VAULT_CACERT` environment variable, however
`influxd` flags take precedence over environment variables._

---

## --vault-capath
Specifies the path to a directory of PEM-encoded CA certificate files on the local disk.
These certificates are used to verify the Vault server's SSL certificate.

```sh
influxd --vault-capath=/path/to/certs/
```

_You can also set this using the `VAULT_CAPATH` environment variable, however
`influxd` flags take precedence over environment variables._

---

## --vault-client-cert
Specifies the path to a PEM-encoded client certificate on the local disk.
This file is used for TLS communication with the Vault server.

```sh
influxd --vault-client-cert=/path/to/client_cert.pem
```

_You can also set this using the `VAULT_CLIENT_CERT` environment variable, however
`influxd` flags take precedence over environment variables._

---

## --vault-client-key
Specifies the path to an unencrypted, PEM-encoded private key on disk which
corresponds to the matching client certificate.

```sh
influxd --vault-client-key=/path/to/private_key.pem
```

_You can also set this using the `VAULT_CLIENT_KEY` environment variable, however
`influxd` flags take precedence over environment variables._

---

## --vault-max-retries
Specifies the maximum number of retries when encountering a 5xx error code.
The default is 2 (for three attempts in total). Set this to 0 or less to disable retrying.

**Default:** `2`  

```sh
influxd --vault-max-retries=2
```

_You can also set this using the `VAULT_MAX_RETRIES` environment variable, however
`influxd` flags take precedence over environment variables._

---

## --vault-client-timeout
Specifies the Vault client timeout.

**Default:** `60s`  

```sh
influxd --vault-client-timeout=60s
```

_You can also set this using the `VAULT_CLIENT_TIMEOUT` environment variable, however
`influxd` flags take precedence over environment variables._

---

## --vault-skip-verify
Skip certificate verification when communicating with Vault.
_Setting this variable voids [Vault's security model](https://www.vaultproject.io/docs/internals/security.html)
and is **not recommended**._

```sh
influxd --vault-skip-verify
```

_You can also set this using the `VAULT_SKIP_VERIFY` environment variable, however
`influxd` flags take precedence over environment variables._

---

## --vault-tls-server-name
Specifies the name to use as the Server Name Indication (SNI) host when connecting via TLS.

```sh
influxd --vault-tls-server-name=secure.example.com
```

_You can also set this using the `VAULT_TLS_SERVER_NAME` environment variable, however
`influxd` flags take precedence over environment variables._

---

## --vault-token
Specifies the Vault authentication token use when authenticating with Vault.

```sh
influxd --vault-token=exAmple-t0ken-958a-f490-c7fd0eda5e9e
```

_You can also set this using the `VAULT_TOKEN` environment variable, however
`influxd` flags take precedence over environment variables._
