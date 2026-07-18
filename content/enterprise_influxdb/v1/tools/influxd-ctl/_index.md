---
title: influxd-ctl CLI
description: >
  Use the `influxd-ctl` CLI to manage your InfluxDB Enterprise v1 cluster.
menu:
  enterprise_influxdb_v1:
    weight: 11
    parent: Tools
    name: influxd-ctl
aliases:
    - /enterprise_influxdb/v1/tools/influxd/restore/
    - /enterprise_influxdb/v1/tools/influxd/backup/
---

The `influxd-ctl` CLI provides commands for managing your InfluxDB Enterprise cluster.
The `influxd-ctl` utility is available on all InfluxDB Enterprise
[meta nodes](/enterprise_influxdb/v1/concepts/glossary/#meta-node).

## Usage

```
influxd-ctl [global-flags] <command> [command-flags] [arguments]
```

## Commands

| Command                                                                           | Description                      |
| :-------------------------------------------------------------------------------- | :------------------------------- |
| [add-data](/enterprise_influxdb/v1/tools/influxd-ctl/add-data/)                   | Add a data node                  |
| [add-meta](/enterprise_influxdb/v1/tools/influxd-ctl/add-meta/)                   | Add a meta node                  |
| [backup](/enterprise_influxdb/v1/tools/influxd-ctl/backup/)                       | Back up a cluster                |
| [copy-shard](/enterprise_influxdb/v1/tools/influxd-ctl/copy-shard/)               | Copy a shard between data nodes  |
| [copy-shard-status](/enterprise_influxdb/v1/tools/influxd-ctl/copy-shard-status/) | Show all active copy shard tasks |
| [entropy](/enterprise_influxdb/v1/tools/influxd-ctl/entropy/)                     | Manage entropy in a cluster      |
| [join](/enterprise_influxdb/v1/tools/influxd-ctl/join/)                           | Join a meta or data node         |
| [kill-copy-shard](/enterprise_influxdb/v1/tools/influxd-ctl/kill-copy-shard/)     | Abort an in-progress shard copy  |
| [ldap](/enterprise_influxdb/v1/tools/influxd-ctl/ldap/)                           | Manage LDAP in a cluster         |
| [leave](/enterprise_influxdb/v1/tools/influxd-ctl/leave/)                         | Remove a meta or data node       |
| [remove-data](/enterprise_influxdb/v1/tools/influxd-ctl/remove-data/)             | Remove a data node               |
| [remove-meta](/enterprise_influxdb/v1/tools/influxd-ctl/remove-meta/)             | Remove a meta node               |
| [remove-shard](/enterprise_influxdb/v1/tools/influxd-ctl/remove-shard/)           | Remove a shard from a data node  |
| [restore](/enterprise_influxdb/v1/tools/influxd-ctl/restore/)                     | Restore a backup of a cluster    |
| [show](/enterprise_influxdb/v1/tools/influxd-ctl/show/)                           | Show cluster members             |
| [show-shards](/enterprise_influxdb/v1/tools/influxd-ctl/show-shards/)             | Shows shards in a cluster        |
| [node-labels](/enterprise_influxdb/v1/tools/influxd-ctl/node-labels/)             | Manage node labels               |
| [token](/enterprise_influxdb/v1/tools/influxd-ctl/token/)                         | Generates a signed JWT token     |
| [truncate-shards](/enterprise_influxdb/v1/tools/influxd-ctl/truncate-shards/)     | Truncate current shards          |
| [update-data](/enterprise_influxdb/v1/tools/influxd-ctl/update-data/)             | Update a data node               |

## Global flags {#influxd-ctl-global-flags}

| Flag                         | Description                                                                                                           |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| `-auth-type`                 | Authentication type to use (`none` _default_, `basic`, `jwt`)                                                        |
| `-bind`                      | Meta node HTTP bind address _(default is `localhost:8091`)_                                                          |
| `-bind-tls`                  | Use TLS                                                                                                              |
| `-ca-cert`                   | CA certificate used to verify the meta node's server certificate _(ignored without `-bind-tls`)_. _v1.13.0+_        |
| `-cert`                      | Client certificate for mutual TLS (mTLS), used unless `-client-cert` is given _(ignored without `-bind-tls`)_. _v1.13.0+_ |
| `-client-cert`               | Client certificate for mutual TLS (mTLS), overriding `-cert` _(ignored without `-bind-tls`)_. _v1.13.0+_           |
| `-client-key`                | Client private key for `-client-cert` _(ignored without `-bind-tls`)_. _v1.13.0+_                                   |
| `-config`                    | Configuration file path                                                                                             |
| `-ignore-cert-sanity-checks` | Present the client certificate even if it fails the checks for whether a client can use it. _v1.13.0+_             |
| `-insecure-certificate`      | Skip file-permission checks on the certificate and private key. _v1.13.0+_                                          |
| `-k`                         | Skip certificate verification _(ignored without `-bind-tls`)_                                                       |
| `-key`                       | Client private key for `-cert` _(ignored without `-bind-tls`)_. _v1.13.0+_                                          |
| `-pwd`                       | Password for basic authentication _(ignored without `-auth-type basic`)_                                            |
| `-secret`                    | JWT shared secret _(ignored without `-auth-type jwt`)_                                                              |
| `-timeout`                   | Override the default timeout of 10s for operations _(for example, `30s`, `1m`)_. _v1.12.3+_                         |
| `-user`                      | Username _(ignored without `-auth-type basic` or `jwt`)_                                                            |

## Examples

- [Bind to a remote meta node](#bind-to-a-remote-meta-node)
- [Authenticate with JWT](#authenticate-with-jwt)
- [Authenticate with basic authentication](#authenticate-with-basic-authentication)
- [Override the default timeout](#override-the-default-timeout)
- [Connect with mutual TLS (mTLS)](#connect-with-mutual-tls-mtls)

### Bind to a remote meta node

```sh
influxd-ctl -bind meta-node-02:8091
```

### Authenticate with JWT

```sh
influxd-ctl -auth-type jwt -secret oatclusters
```

### Authenticate with basic authentication

```sh
influxd-ctl -auth-type basic -user admin -pwd passw0rd
```

### Override the default timeout {metadata="v1.12.3+"}

```sh
influxd-ctl -timeout 30s show-shards
```

### Connect with mutual TLS (mTLS) {metadata="v1.13.0+"}

When the cluster's meta nodes require a client certificate
([`https-client-auth-type`](/enterprise_influxdb/v1/administration/configure/config-meta-nodes/#https-client-auth-type)),
use `-cert` and `-key` to present a client certificate and private key, and use
`-ca-cert` to verify the meta node's server certificate:

```sh
influxd-ctl -bind-tls \
  -cert /etc/ssl/influxd-ctl-client.crt \
  -key /etc/ssl/influxd-ctl-client.key \
  -ca-cert /etc/ssl/cluster-ca.crt \
  show
```

To present a dedicated client certificate that overrides `-cert`, use
`-client-cert` and `-client-key`:

```sh
influxd-ctl -bind-tls \
  -client-cert /etc/ssl/influxd-ctl-client.crt \
  -client-key /etc/ssl/influxd-ctl-client.key \
  -ca-cert /etc/ssl/cluster-ca.crt \
  show
```

For more information about configuring mTLS in a cluster, see
[Enable mutual TLS (mTLS)](/enterprise_influxdb/v1/administration/configure/security/enable_tls/#enable-mutual-tls-mtls).

{{< expand-wrapper >}}
{{% expand "Troubleshoot `influxd-ctl` authentication" %}}

If authentication is enabled in the cluster's
[meta node configuration files](/enterprise_influxdb/v1/administration/configure/config-meta-nodes/#auth-enabled)
and [data node configuration files](/enterprise_influxdb/v1/administration/configure/config-data-nodes/#meta-auth-enabled)
and the `influxd-ctl` command does not include authentication details, the system returns:

```bash
Error: unable to parse authentication credentials.
```

If authentication is enabled and the `influxd-ctl` command provides the incorrect
username or password, the system returns:

```bash
Error: authorization failed.
```

{{% /expand %}}
{{< /expand-wrapper >}}
