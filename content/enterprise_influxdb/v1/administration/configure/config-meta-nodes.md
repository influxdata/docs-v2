---
title: Configure InfluxDB Enterprise v1 meta nodes
description: >
  Configure InfluxDB Enterprise v1 data node settings and environmental variables.
menu:
  enterprise_influxdb_v1:
    name: Configure meta nodes
    parent: Configure
weight: 30
aliases:
  - /enterprise_influxdb/v1/administration/config-meta-nodes/
---

* [Meta node configuration settings](#meta-node-configuration-settings)
  * [Global options](#global-options)
  * [Enterprise license `[enterprise]`](#enterprise)
  * [Meta node `[meta]`](#meta)
  * [TLS `[tls]`](#tls-settings)

## Meta node configuration settings

### Global options

#### reporting-disabled

Default is `false`.

InfluxData, the company, relies on reported data from running nodes primarily to
track the adoption rates of different InfluxDB versions.
These data help InfluxData support the continuing development of InfluxDB.

The `reporting-disabled` option toggles the reporting of data every 24 hours to
`usage.influxdata.com`.
Each report includes a randomly-generated identifier, OS, architecture,
InfluxDB version, and the number of databases, measurements, and unique series.
To disable reporting, set this option to `true`.

> **Note:** No data from user databases are ever transmitted.

#### bind-address

Default is `""`.

This setting is not intended for use.
It will be removed in future versions.

#### hostname

Default is `""`.

The hostname of the [meta node](/enterprise_influxdb/v1/concepts/glossary/#meta-node).
This must be resolvable and reachable by all other members of the cluster.

If HTTPS is enabled with [`https-enabled`](#https-enabled), `hostname` must match a hostname or wildcard in the TLS certificate specified by [`https-certificate`](#https-certificate). If `hostname` does not match, then `http: TLS handshake error from 127.0.0.1` errors are output in the meta node logs and the cluster will not function properly.

Environment variable: `INFLUXDB_HOSTNAME`

-----

### Enterprise license settings
#### [enterprise]

The `[enterprise]` section contains the parameters for the meta node's
registration with the [InfluxData portal](https://portal.influxdata.com/).

#### license-key

Default is `""`.

The license key created for you on [InfluxData portal](https://portal.influxdata.com).
The meta node transmits the license key to
[portal.influxdata.com](https://portal.influxdata.com) over port 80 or port 443
and receives a temporary JSON license file in return.
The server caches the license file locally.
If your server cannot communicate with [https://portal.influxdata.com](https://portal.influxdata.com), you must use the [`license-path` setting](#license-path).

Use the same key for all nodes in the same cluster.
{{% warn %}}The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
{{% /warn %}}

> **Note:** You must restart meta nodes to update your configuration. For more information, see how to [renew or update your license key](/enterprise_influxdb/v1/administration/renew-license/).

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_KEY`

#### license-path

Default is `""`.

The local path to the permanent JSON license file that you received from InfluxData
for instances that do not have access to the internet.
To obtain a license file, contact [sales@influxdb.com](mailto:sales@influxdb.com).

The license file must be saved on every server in the cluster, including meta nodes
and data nodes.
The file contains the JSON-formatted license, and must be readable by the `influxdb` user.
Each server in the cluster independently verifies its license.

{{% warn %}}
The `license-key` and `license-path` settings are mutually exclusive and one must remain set to the empty string.
{{% /warn %}}

> **Note:** You must restart meta nodes to update your configuration. For more information, see how to [renew or update your license key](/enterprise_influxdb/v1/administration/renew-license/).

Environment variable: `INFLUXDB_ENTERPRISE_LICENSE_PATH`

-----
### Meta node settings

#### [meta]

#### dir

Default is `"/var/lib/influxdb/meta"`.

The directory where cluster meta data is stored.

Environment variable: `INFLUXDB_META_DIR`

#### bind-address

Default is `":8089"`.

The bind address(port) for meta node communication.
For simplicity, InfluxData recommends using the same port on all meta nodes,
but this is not necessary.

Environment variable: `INFLUXDB_META_BIND_ADDRESS`

#### http-bind-address

Default is `":8091"`.

The default address to bind the API to.

Environment variable: `INFLUXDB_META_HTTP_BIND_ADDRESS`

#### https-enabled

Default is `false`.

Determines whether meta nodes use HTTPS to communicate with each other. By default, HTTPS is disabled. We strongly recommend enabling HTTPS.

To enable HTTPS, set https-enabled to `true`, specify the path to the SSL certificate `https-certificate = " "`, and specify the path to the SSL private key `https-private-key = ""`.

Environment variable: `INFLUXDB_META_HTTPS_ENABLED`

#### https-certificate

Default is `""`.

If HTTPS is enabled, specify the path to the SSL certificate.  
Use either:

* PEM-encoded bundle with both the certificate and key (`[bundled-crt-and-key].pem`)
* Certificate only (`[certificate].crt`)

When HTTPS is enabled, [`hostname`](#hostname) must match a hostname or wildcard in the certificate.

Environment variable: `INFLUXDB_META_HTTPS_CERTIFICATE`

#### https-private-key

Default is `""`.

If HTTPS is enabled, specify the path to the SSL private key.
Use either:

* PEM-encoded bundle with both the certificate and key (`[bundled-crt-and-key].pem`)
* Private key only (`[private-key].key`)

Environment variable: `INFLUXDB_META_HTTPS_PRIVATE_KEY`

#### https-insecure-certificate

Default is `false`.

Skips file permission checking for `https-certificate` and `https-private-key` when true.

Environment variable: `INFLUXDB_META_HTTPS_INSECURE_CERTIFICATE`

#### https-insecure-tls

Default is `false`.

Whether meta nodes will skip certificate validation communicating with each other over HTTPS.
This is useful when testing with self-signed certificates.

Environment variable: `INFLUXDB_META_HTTPS_INSECURE_TLS`

#### data-use-tls

Default is `false`.

Whether to use TLS to communicate with data nodes.

Environment variable: `INFLUXDB_META_DATA_USE_TLS`

#### data-insecure-tls

Default is `false`.

Whether meta nodes will skip certificate validation communicating with data nodes over TLS.
This is useful when testing with self-signed certificates.

Environment variable: `INFLUXDB_META_DATA_INSECURE_TLS`

#### gossip-frequency

Default is `"5s"`.

The default frequency with which the node will gossip its known announcements.

#### announcement-expiration

Default is `"30s"`.

The default length of time an announcement is kept before it is considered too old.

#### retention-autocreate

Default is `true`.

Automatically create a default retention policy when creating a database.

#### election-timeout

Default is `"1s"`.

The amount of time in candidate state without a leader before we attempt an election.

#### heartbeat-timeout

Default is `"1s"`.

The amount of time in follower state without a leader before we attempt an election.

#### leader-lease-timeout

Default is `"500ms"`.

The leader lease timeout is the amount of time a Raft leader will remain leader
 if it does not hear from a majority of nodes.
After the timeout the leader steps down to the follower state.
Clusters with high latency between nodes may want to increase this parameter to
 avoid unnecessary Raft elections.

Environment variable: `INFLUXDB_META_LEADER_LEASE_TIMEOUT`

#### commit-timeout

Default is `"50ms"`.

The commit timeout is the interval that the leader waits between sending messages with
the leader's commit index to followerers.
The default setting should work for most systems.

Environment variable: `INFLUXDB_META_COMMIT_TIMEOUT`

#### consensus-timeout

Default is `"30s"`.

Timeout waiting for consensus before getting the latest Raft snapshot.

Environment variable: `INFLUXDB_META_CONSENSUS_TIMEOUT`

#### cluster-tracing

Default is `false`.

Log all HTTP requests made to meta nodes.
Prints sanitized POST request information to show actual commands.

**Sample log output:**

```
ts=2021-12-08T02:00:54.864731Z lvl=info msg=weblog log_id=0YHxBFZG001 service=meta-http host=172.18.0.1 user-id= username=admin method=POST uri=/user protocol=HTTP/1.1 command="{'{\"action\":\"create\",\"user\":{\"name\":\"fipple\",\"password\":[REDACTED]}}': ''}" status=307 size=0 referrer= user-agent=curl/7.68.0 request-id=ad87ce47-57ca-11ec-8026-0242ac120004 execution-time=63.571ms execution-time-readable=63.570738ms
ts=2021-12-08T02:01:00.070137Z lvl=info msg=weblog log_id=0YHxBEhl001 service=meta-http host=172.18.0.1 user-id= username=admin method=POST uri=/user protocol=HTTP/1.1 command="{'{\"action\":\"create\",\"user\":{\"name\":\"fipple\",\"password\":[REDACTED]}}': ''}" status=200 size=0 referrer= user-agent=curl/7.68.0 request-id=b09eb13a-57ca-11ec-800d-0242ac120003 execution-time=85.823ms execution-time-readable=85.823406ms
ts=2021-12-08T02:01:29.062313Z lvl=info msg=weblog log_id=0YHxBEhl001 service=meta-http host=172.18.0.1 user-id= username=admin method=POST uri=/user protocol=HTTP/1.1 command="{'{\"action\":\"create\",\"user\":{\"name\":\"gremch\",\"hash\":[REDACTED]}}': ''}" status=200 size=0 referrer= user-agent=curl/7.68.0 request-id=c1f3614a-57ca-11ec-8015-0242ac120003 execution-time=1.722ms execution-time-readable=1.722089ms
ts=2021-12-08T02:01:47.457607Z lvl=info msg=weblog log_id=0YHxBEhl001 service=meta-http host=172.18.0.1 user-id= username=admin method=POST uri=/user protocol=HTTP/1.1 command="{'{\"action\":\"create\",\"user\":{\"name\":\"gremchy\",\"hash\":[REDACTED]}}': ''}" status=400 size=37 referrer= user-agent=curl/7.68.0 request-id=ccea84b7-57ca-11ec-8019-0242ac120003 execution-time=0.154ms execution-time-readable=154.417µs
ts=2021-12-08T02:02:05.522571Z lvl=info msg=weblog log_id=0YHxBEhl001 service=meta-http host=172.18.0.1 user-id= username=admin method=POST uri=/user protocol=HTTP/1.1 command="{'{\"action\":\"create\",\"user\":{\"name\":\"thimble\",\"password\":[REDACTED]}}': ''}" status=400 size=37 referrer= user-agent=curl/7.68.0 request-id=d7af0082-57ca-11ec-801f-0242ac120003 execution-time=0.227ms execution-time-readable=227.853µs
```

Environment variable: `INFLUXDB_META_CLUSTER_TRACING`

#### logging-enabled

Default is `true`.

Meta logging toggles the logging of messages from the meta service.

Environment variable: `INFLUXDB_META_LOGGING_ENABLED`

#### pprof-enabled

Default is `true`.

Enables the `/debug/pprof` endpoint for troubleshooting.
To disable, set the value to `false`.

Environment variable: `INFLUXDB_META_PPROF_ENABLED`

#### lease-duration

Default is `"1m0s"`.

The default duration of the leases that data nodes acquire from the meta nodes.
Leases automatically expire after the `lease-duration` is met.

Leases ensure that only one data node is running something at a given time.
For example, [continuous queries](/enterprise_influxdb/v1/concepts/glossary/#continuous-query-cq)
(CQs) use a lease so that all data nodes aren't running the same CQs at once.

For more details about `lease-duration` and its impact on continuous queries, see
[Configuration and operational considerations on a cluster](/enterprise_influxdb/v1/features/clustering-features/#configuration-and-operational-considerations-on-a-cluster).

Environment variable: `INFLUXDB_META_LEASE_DURATION`

#### auth-enabled

Default is `false`.

If true, HTTP endpoints require authentication.
This setting must have the same value as the data nodes' meta.meta-auth-enabled configuration.

Environment variable: `INFLUXDB_META_AUTH_ENABLED`

#### ldap-allowed

Default is `false`.

Whether LDAP is allowed to be set.
If true, you will need to use `influxd ldap set-config` and set enabled=true to use LDAP authentication.

#### shared-secret

Default is `""`.

The shared secret to be used by the public API for creating custom JWT authentication.
If you use this setting, set [`auth-enabled`](#auth-enabled) to `true`.

Environment variable: `INFLUXDB_META_SHARED_SECRET`

#### internal-shared-secret

Default is `""`.

The shared secret used by the internal API for JWT authentication for
inter-node communication within the cluster.
Set this to a long pass phrase.
This value must be the same value as the
[`[meta] meta-internal-shared-secret`](/enterprise_influxdb/v1/administration/config-data-nodes#meta-internal-shared-secret) in the data node configuration file.
To use this option, set [`auth-enabled`](#auth-enabled) to `true`.

Environment variable: `INFLUXDB_META_INTERNAL_SHARED_SECRET`

#### password-hash

Default is `"bcrypt"`.

Specifies the password hashing scheme and its configuration.

FIPS-readiness is achieved by specifying an appropriate password hashing scheme, such as `pbkdf2-sha256` or `pbkdf2-sha512`.
The configured password hashing scheme and its FIPS readiness are logged on startup of `influxd` and `influxd-meta` for verification and auditing purposes.

The configuration is a semicolon delimited list.
The first section specifies the password hashing scheme.
Optional sections after this are `key=value` password hash configuration options.
Each scheme has its own set of options.
Any options not specified default to reasonable values as specified below.

This setting must have the same value as the data node option [`meta.password-hash`](/enterprise_influxdb/v1/administration/config-data-nodes/#password-hash).

Environment variable: `INFLUXDB_META_PASSWORD_HASH`

**Example hashing configurations:**

| String                                   | Description                                                                                                                     | FIPS ready |
|:-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|------------|
| `bcrypt`                                 | Specifies the [`bcrypt`](#bcrypt) hashing scheme with default options.                                                          | No         |
| `pbkdf2-sha256;salt_len=32;rounds=64000` | Specifies the [`pbkdf2-sha256`](#pbkdf2-sha256) hashing scheme with options `salt_len` set to `32` and `rounds` set to `64000`. | Yes        |

Supported password hashing schemes and options:

##### bcrypt

`bcrypt` is the default hashing scheme.
It is not a FIPS-ready password hashing scheme.

**Options:**

* `cost`
  * Specifies the cost of hashing.
    Number of rounds performed is `2^cost`.
    Higher cost gives greater security at the expense of execution time.
  * Default value: `10`
  * Valid range: [`4`, `31`]

##### pbkdf2-sha256

`pbkdf2-sha256` uses the PBKDF2 scheme with SHA-256 as the HMAC function.
It is FIPS-ready according to [NIST Special Publication 800-132] §5.3
when used with appropriate `rounds` and `salt_len` options.

**Options:**

* `rounds`
  * Specifies the number of rounds to perform.
    Higher cost gives greater security at the expense of execution time.
  * Default value: `29000`
  * Valid range: [`1`, `4294967295`]
  * Must be greater than or equal to `1000`
    for FIPS-readiness according to [NIST Special Publication 800-132] §5.2.
* `salt_len`
  * Specifies the salt length in bytes.
    The longer the salt, the more difficult it is for an attacker to generate a table of password hashes.
  * Default value: `16`
  * Valid range: [`1`, `1024`]
  * Must be greater than or equal to `16`
    for FIPS-readiness according to [NIST Special Publication 800-132] §5.1.

##### pbkdf2-sha512

`pbkdf2-sha512` uses the PBKDF2 scheme with SHA-256 as the HMAC function.
It is FIPS-ready according to [NIST Special Publication 800-132] §5.3
when used with appropriate `rounds` and `salt_len` options.

**Options:**

* `rounds`
  * Specifies the number of rounds to perform.
    Higher cost gives greater security at the expense of execution time.
  * Default value: `29000`
  * Valid range: [`1`, `4294967295`]
  * Must be greater than or equal to `1000`
    for FIPS-readiness according to [NIST Special Publication 800-132] § 5.2.
* `salt_len`
  * Specifies the salt length in bytes.
    The longer the salt, the more difficult it is for an attacker to generate a table of password hashes.
  * Default value: `16`
  * Valid range: [`1`, `1024`]
  * Must be greater than or equal to `16`
    for FIPS-readiness according to [NIST Special Publication 800-132] § 5.1.

#### ensure-fips

Default is `false`.

If `ensure-fips` is set to `true`, then `influxd` and `influxd-meta`
will refuse to start if they are not configured in a FIPS-ready manner.
For example, `password-hash = "bcrypt"` would not be allowed if `ensure-fips = true`.
`ensure-fips` gives the administrator extra confidence that their instances are configured in a FIPS-ready manner.

Environment variable: `INFLUXDB_META_ENSURE_FIPS`

[NIST Special Publication 800-132]: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf

#### raft-portal-auth-required {metadata="v1.12.0+"}

Default is `false`.

Require Raft clients to authenticate with server using the
[`meta-internal-shared-secret`](#meta-internal-shared-secret).
This requires that all meta nodes are running InfluxDB Enterprise v1.12.0+ and
are configured with the correct `meta-internal-shared-secret`.

For maximum security, `raft-dialer-auth-required` should be configured along with `raft-dialer-auth-required`.

Environment variable: `INFLUXDB_META_RAFT_PORTAL_AUTH_REQUIRED`

#### raft-dialer-auth-required {metadata="v1.12.0+"}

Default is `false`.

Require Raft servers to authenticate Raft clients using the
[`meta-internal-shared-secret`](#meta-internal-shared-secret).
This requires that all meta nodes are running InfluxDB Enterprise v1.12.0+, have
`raft-portal-auth-required=true`, and are configured with the correct
`meta-internal-shared-secret`. For existing clusters, it is recommended to enable `raft-portal-auth-required` and restart
meta nodes first, then enable `raft-dialer-auth-required` in another step. 
This will eliminate downtime from Raft authentication mismatches.

Environment variable: `INFLUXDB_META_RAFT_DIALER_AUTH_REQUIRED`


### TLS settings

For more information, see [TLS settings for data nodes](/enterprise_influxdb/v1/administration/config-data-nodes#tls-settings).

#### Recommended "modern compatibility" cipher settings

```toml
ciphers = [ "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
            "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
            "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
            "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
            "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"
]

min-version = "tls1.3"

max-version = "tls1.3"

```
