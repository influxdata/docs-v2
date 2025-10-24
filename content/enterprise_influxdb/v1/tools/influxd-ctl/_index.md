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

| Flag         | Description                                                              |
| :----------- | :----------------------------------------------------------------------- |
| `-auth-type` | Authentication type to use (`none` _default_, `basic`, `jwt`)            |
| `-bind`      | Meta node HTTP bind address _(default is `localhost:8091`)_              |
| `-bind-tls`  | Use TLS                                                                  |
| `-config`    | Configuration file path                                                  |
| `-k`         | Skip certificate verification _(ignored without `-bind-tls`)_            |
| `-pwd`       | Password for basic authentication _(ignored without `-auth-type basic`)_ |
| `-secret`    | JWT shared secret _(ignored without `-auth-type jwt`)_                   |
| `-user`      | Username _(ignored without `-auth-type basic` or `jwt`)_                 |

## Examples

- [Bind to a remote meta node](#bind-to-a-remote-meta-node)
- [Authenticate with JWT](#authenticate-with-jwt)
- [Authenticate with basic authentication](#authenticate-with-basic-authentication)

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

{{< expand-wrapper >}}
{{% expand "Troubleshoot `influxd-ctl` authentication" %}}

If authentication is enabled in the cluster's
[meta node configuration files](/enterprise_influxdb/v1/administration/config-meta-nodes/#auth-enabled-false)
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
