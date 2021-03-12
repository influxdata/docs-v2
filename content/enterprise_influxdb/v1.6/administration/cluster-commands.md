---
title: InfluxDB Enterprise cluster management utilities
description: Use the "influxd-ctl" and "influx" command line tools to interact with your InfluxDB Enterprise cluster and data.
aliases:
    - /enterprise/v1.6/features/cluster-commands/
menu:
  enterprise_influxdb_1_6:
    name: Cluster management utilities
    weight: 30
    parent: Administration
---

InfluxDB Enterprise includes two utilities for interacting with and managing your clusters.
The [`influxd-ctl`](#influxd-ctl-cluster-management-utility) utility provides commands
for managing your InfluxDB Enterprise clusters.
The [`influx` command line interface](#influx-command-line-interface-cli) is used
for interacting with and managing your data.

#### Content

* [`influxd-ctl` cluster management utility](#influxd-ctl-cluster-management-utility)
    * [Syntax](#syntax)
    * [Global options](#global-options)
        * [`-auth-type`](#auth-type-none-basic-jwt)
        * [`-bind-tls`](#bind-tls)
        * [`-config`](#config-path-to-configuration-file)
        * [`-pwd`](#pwd-password)
        * [`-k`](#k)
        * [`-secret`](#secret-jwt-shared-secret)
        * [`-user`](#user-username)
    * [Commands](#commands)
        * [`add-data`](#add-data)
        * [`add-meta`](#add-meta)
        * [`backup`](#backup)
        * [`copy-shard`](#copy-shard)
        * [`copy-shard-status`](#copy-shard-status)
        * [`entropy`](#entropy)
        * [`join`](#join)
        * [`kill-copy-shard`](#kill-copy-shard)
        * [`leave`](#leave)
        * [`remove-data`](#remove-data)
        * [`remove-meta`](#remove-meta)
        * [`remove-shard`](#remove-shard)
        * [`restore`](#restore)
        * [`show`](#show)
        * [`show-shards`](#show-shards)
        * [`update-data`](#update-data)
        * [`token`](#token)
        * [`truncate-shards`](#truncate-shards)
* [`influx` command line interface (CLI)](#influx-command-line-interface-cli)


## `influxd-ctl` cluster management utility

Use the `influxd-ctl` cluster management utility to manage your cluster nodes, back up and restore data, and rebalance clusters.
The `influxd-ctl` utility is available on all [meta nodes](/enterprise_influxdb/v1.6/concepts/glossary/#meta-node).

### Syntax

```
influxd-ctl [ global-options ] <command> [ arguments ]
```

### Global options

Optional arguments are in brackets.

#### `[ -auth-type [ none | basic | jwt ] ]`

Specify the type of authentication to use. Default value is `none`.

#### `[ -bind <hostname>:<port> ]`  

Specify the bind HTTP address of a meta node to connect to. Default value is `localhost:8091`.

#### `[ -bind-tls ]`  

Use TLS.  If you have enabled HTTPS, you MUST use this argument in order to connect to the meta node.

#### `[ -config '<path-to-configuration-file> ]'`  

Specify the path to the configuration file.

#### `[ -pwd <password> ]`  

Specify the user’s password. This argument is ignored if `-auth-type basic` isn’t specified.

#### `[ -k ]`  

Skip certificate verification; use this argument with a self-signed certificate. `-k` is ignored if `-bind-tls` isn't specified.

#### `[ -secret <JWT-shared-secret> ]`  

Specify the JSON Web Token (JWT) shared secret. This argument is ignored if `-auth-type jwt` isn't specified.

#### `[ -user <username> ]`  

Specify the user’s username. This argument is ignored if `-auth-type basic` isn’t specified.

### Examples

The following examples use the `influxd-ctl` utility's [`show` option](#show).

#### Binding to a remote meta node

```
$ influxd-ctl -bind meta-node-02:8091 show
```

The `influxd-ctl` utility binds to the meta node with the hostname `meta-node-02` at port `8091`.
By default, the tool binds to the meta node with the hostname `localhost` at port `8091`.

#### Authenticating with JWT

```
$ influxd-ctl -auth-type jwt -secret oatclusters show
```
The `influxd-ctl` utility uses JWT authentication with the shared secret `oatclusters`.

If authentication is enabled in the cluster's [meta node configuration files](/enterprise_influxdb/v1.6/administration/config-meta-nodes#auth-enabled-false) and [data node configuration files](/enterprise_influxdb/v1.6/administration/config-data-nodes#meta-auth-enabled-false) and the `influxd-ctl` command does not include authentication details, the system returns:

```
Error: unable to parse authentication credentials.
```

If authentication is enabled and the `influxd-ctl` command provides the incorrect shared secret, the system returns:

```
Error: signature is invalid.
```

#### Authenticating with basic authentication

To authenticate a user with basic authentication, use the `-auth-type basic` option on the `influxd-ctl` utility, with the `-user` and `-password` options.

In the following example, the `influxd-ctl` utility uses basic authentication for a cluster user.

```
$ influxd-ctl -auth-type basic -user admini -pwd mouse show
```

If authentication is enabled in the cluster's [meta node configuration files](/enterprise_influxdb/v1.6/administration/config-meta-nodes#auth-enabled-false) and [data node configuration files](/enterprise_influxdb/v1.6/administration/config-data-nodes#meta-auth-enabled-false) and the `influxd-ctl` command does not include authentication details, the system returns:

```
Error: unable to parse authentication credentials.
```

If authentication is enabled and the `influxd-ctl` command provides the incorrect username or password, the system returns:

```
Error: authorization failed.
```

## Commands

### `add-data`

Adds a data node to a cluster.
By default, `influxd-ctl` adds the specified data node to the local meta node's cluster.
Use `add-data` instead of the [`join` argument](#join) when performing a [production installation](/enterprise_influxdb/v1.6/install-and-deploy/production_installation/data_node_installation/) of an InfluxDB Enterprise cluster.

#### Syntax

```
add-data <data-node-TCP-bind-address>
```

Resources: [Production installation](/enterprise_influxdb/v1.6/install-and-deploy/production_installation/data_node_installation/)

#### Examples

##### Adding a data node to a cluster using the local meta node

In the following example, the `add-data` command contacts the local meta node running at `localhost:8091` and adds a data node to that meta node's cluster.
The data node has the hostname `cluster-data-node` and runs on port `8088`.

```
$ influxd-ctl add-data cluster-data-node:8088

Added data node 3 at cluster-data-node:8088
```

##### Adding a data node to a cluster using a remote meta node

In the following example, the command contacts the meta node running at `cluster-meta-node-01:8091` and adds a data node to that meta node's cluster.
The data node has the hostname `cluster-data-node` and runs on port `8088`.

```
$ influxd-ctl -bind cluster-meta-node-01:8091 add-data cluster-data-node:8088

Added data node 3 at cluster-data-node:8088
```

### `add-meta`

Adds a meta node to a cluster.
By default, `influxd-ctl` adds the specified meta node to the local meta node's cluster.
Use `add-meta` instead of the [`join` argument](#join) when performing a [Production Installation](/enterprise_influxdb/v1.6/install-and-deploy/production_installation/meta_node_installation/) of an InfluxDB Enterprise cluster.

Resources: [Production installation](/enterprise_influxdb/v1.6/install-and-deploy/production_installation/data_node_installation/)

#### Syntax

```
influxd-ctl add-meta <meta-node-HTTP-bind-address>
```

#### Examples

##### Adding a meta node to a cluster using the local meta node

In the following example, the `add-meta` command contacts the local meta node running at `localhost:8091` and adds a meta node to that local meta node's cluster.
The added meta node has the hostname `cluster-meta-node-03` and runs on port `8091`.

```
$ influxd-ctl add-meta cluster-meta-node-03:8091

Added meta node 3 at cluster-meta-node:8091
```

##### Adding a meta node to a cluster using a remote meta node**

In the following example, the `add-meta` command contacts the meta node running at `cluster-meta-node-01:8091` and adds a meta node to that meta node's cluster.
The added meta node has the hostname `cluster-meta-node-03` and runs on port `8091`.

```
$ influxd-ctl -bind cluster-meta-node-01:8091 add-meta cluster-meta-node-03:8091

Added meta node 3 at cluster-meta-node-03:8091
```

#### `backup`

Creates a backup of a cluster's [metastore](/influxdb/v1.6/concepts/glossary/#metastore) and [shard](/influxdb/v1.6/concepts/glossary/#shard) data at that point in time and stores the copy in the specified directory.
Backups are incremental by default; they create a copy of the metastore and shard data that have changed since the previous incremental backup.
If there are no existing incremental backups, the system automatically performs a complete backup.

#### Syntax

```
influxd-ctl backup [ -db <database> | -from <data-node-TCP-bind-address> | -full | -rp <retention-policy> | -shard <shard-id> ] <backup-directory>
```
##### Arguments

Optional arguments are in brackets.

#### [ `-db <db_name>` ]

Name of the single database to back up.

#### [ `-from <data-node-TCP-address>` ]

TCP address of the target data node.

#### [ `-full` ]

Perform a [full](/enterprise_influxdb/v1.6/administration/backup-and-restore/#backup) backup.

#### [ `-rp <rp_name>` ]

Name of the single [retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp) to back up (requires the `-db` flag).

#### [ `-shard <shard_ID>` ]

Identifier of the shard to back up.

> Restoring a `-full` backup and restoring an incremental backup require different syntax.
To prevent issues with [`restore`](#restore), keep `-full` backups and incremental backups in separate directories.

Resources: [Backing up and restoring in InfluxDB Enterprise ](/enterprise_influxdb/v1.6/administration/backup-and-restore/)

#### Examples

##### Performing an incremental backup

In the following example, the command performs an incremental backup and stores it in the current directory.
If there are any existing backups the current directory, the system performs an incremental backup.
If there aren’t any existing backups in the current directory, the system performs a complete backup of the cluster.

```
$ influxd-ctl backup .
```

Output:
```
Backing up meta data... Done. 421 bytes transferred
Backing up node cluster-data-node:8088, db telegraf, rp autogen, shard 4... Done. Backed up in 903.539567ms, 307712 bytes transferred
Backing up node cluster-data-node:8088, db _internal, rp monitor, shard 1... Done. Backed up in 138.694402ms, 53760 bytes transferred
Backing up node cluster-data-node:8088, db _internal, rp monitor, shard 2... Done. Backed up in 101.791148ms, 40448 bytes transferred
Backing up node cluster-data-node:8088, db _internal, rp monitor, shard 3... Done. Backed up in 144.477159ms, 39424 bytes transferred
Backed up to . in 1.293710883s, transferred 441765 bytes

$ ls
20160803T222310Z.manifest  20160803T222310Z.s1.tar.gz  20160803T222310Z.s3.tar.gz
20160803T222310Z.meta      20160803T222310Z.s2.tar.gz  20160803T222310Z.s4.tar.gz
```

#### Performing a full backup

In the following example, the `backup` command performs a full backup of the cluster and stores the backup in the existing directory `backup_dir`.

```
$ influxd-ctl backup -full backup_dir
```

Output:

```
Backing up meta data... Done. 481 bytes transferred
Backing up node cluster-data-node:8088, db _internal, rp monitor, shard 1... Done. Backed up in 33.207375ms, 238080 bytes transferred
Backing up node cluster-data-node:8088, db telegraf, rp autogen, shard 2... Done. Backed up in 15.184391ms, 95232 bytes transferred
Backed up to backup_dir in 51.388233ms, transferred 333793 bytes

~# ls backup_dir
20170130T184058Z.manifest
20170130T184058Z.meta
20170130T184058Z.s1.tar.gz
20170130T184058Z.s2.tar.gz
```

#### `copy-shard`

Copies a [shard](/influxdb/v1.6/concepts/glossary/#shard) from a source data node to a destination data node.

#### Syntax

```
influxd-ctl copy-shard <data-node-source-TCP-address> <data-node-destination-TCP-address> <shard-id>
```

Resources: [Rebalancing InfluxDB Enterprise clusters](/enterprise_influxdb/v1.6/guides/rebalance/)

#### Examples

###### Copying a shard from one data node to another data node

In the following example, the `copy-shard` command copies the shard with the id `22` from the data node running at `cluster-data-node-01:8088` to the data node running at `cluster-data-node-02:8088`.

```
$ influxd-ctl copy-shard cluster-data-node-01:8088 cluster-data-node-02:8088 22'

Copied shard 22 from cluster-data-node-01:8088 to cluster-data-node-02:8088
```

#### `copy-shard-status`

Shows all in-progress [copy shard](#copy-shard) operations, including the shard's source node, destination node, database, [retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp), shard ID, total size, current size, and the operation's start time.

#### Syntax

```
influxd-ctl copy-shard-status
```

#### Examples

###### Displaying all in-progress copy-shard operations

In this example, the `copy-shard-status` command returns one in-progress copy-shard operation.
The system is copying shard `34` from `cluster-data-node-02:8088` to `cluster-data-node-03:8088`.
Shard `34` is associated with the `telegraf` database and the `autogen` retention policy.
The `TotalSize` and `CurrentSize` columns are reported in bytes.

```
$ influxd-ctl copy-shard-status

Source                     Dest                       Database  Policy   ShardID  TotalSize  CurrentSize  StartedAt
cluster-data-node-02:8088  cluster-data-node-03:8088  telegraf  autogen  34       119624324  119624324    2017-06-22 23:45:09.470696179 +0000 UTC
```

#### `entropy`

Manage entropy and the [anti-entropy](/enterprise_influxdb/v1.6/administration/anti-entropy/) process among shards in a cluster.
It includes the following subcommands:

**`show`**  
Lists shards that are in an inconsistent state and in need of repair as well as
shards currently in the repair queue.

**`repair`**  
Queues a shard for repair.
It requires a Shard ID which is provided in the `influxd-ctl entropy show` output.

**`kill-repair`**  
Removes a shard from the repair queue.
It requires a Shard ID which is provided in the `influxd-ctl entropy show` output.

#### Syntax

```
influxd-ctl entropy <subcommand> [<arguments>]
```

#### Examples

###### Displaying all shards with entropy

In this example, the `entropy show` command returns all shards with detected entropy.

```
$ influxd-ctl entropy show

Entropy
==========
ID     Database  Retention Policy  Start                          End                            Expires                        Status
21179  statsdb   1hour             2017-10-09 00:00:00 +0000 UTC  2017-10-16 00:00:00 +0000 UTC  2018-10-22 00:00:00 +0000 UTC  diff
25165  statsdb   1hour             2017-11-20 00:00:00 +0000 UTC  2017-11-27 00:00:00 +0000 UTC  2018-12-03 00:00:00 +0000 UTC  diff
```

###### Adding a shard with entropy to the repair queue

In this example, the `entropy repair` command adds a shard with detected entropy to the repair queue.
The `repair` subcommand requires a Shard ID, which can be obtained from the `influxd-ctl entropy show` output.

```
$ influxd-ctl entropy repair 21179
Repair Shard 21179 queued
```

###### Remove a shard in the repair queue

In this example, the `entropy kill-repair` command removes a shard from the repair queue.
The `kill-repair` subcommand requires a Shard ID, which can be obtained from the `influxd-ctl entropy show` output.

```
$ influxd-ctl entropy kill-repair 21179
Shard 21179 removed from repair queue
```

> This only applies to shards in the repair queue.
> It does not cancel repairs on nodes that are in the process of being repaired.
> Once a repair has started, requests to cancel it are ignored.

#### `join`

Joins a meta node and/or data node to a cluster.
By default, `influxd-ctl` joins the local meta node and/or data node into a new cluster.

#### Syntax

```
influxd-ctl join [-v] <meta-node-HTTP-bind-address>
```

##### Arguments

Optional arguments are in brackets.

###### [ `-v` ]

Print verbose information about the join.

###### `<meta-node-HTTP-bind-address>`

Address of a meta node in an existing cluster.
Use this argument to add the un-joined meta node and/or data node to an existing cluster.

#### Examples

###### Joining a meta and data node into a cluster

In this example, the `join` command joins the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` into a new cluster.

```
$ influxd-ctl join

Joining meta node at localhost:8091
Searching for meta node on cluster-node-03:8091...
Searching for data node on cluster-node-03:8088...

Successfully created cluster

  * Added meta node 1 at cluster-node-03:8091
  * Added data node 2 at cluster-node-03:8088

  To join additional nodes to this cluster, run the following command:

  influxd-ctl join cluster-node-03:8091
```

###### Joining a meta and data node to an existing cluster

The command joins the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` to an existing cluster.
The existing cluster includes the meta node running at `cluster-meta-node-02:8091`.

```
$ influxd-ctl join cluster-meta-node-02:8091

Joining meta node at cluster-meta-node-02:8091
Searching for meta node on cluster-node-03:8091...
Searching for data node on cluster-node-03:8088...

Successfully joined cluster

  * Added meta node 3 at cluster-node-03:8091
  * Added data node 4 at cluster-node-03:8088
```

###### Joining a meta node to an existing cluster

The command joins the meta node running at `cluster-meta-node-03:8091` to an existing cluster.
The existing cluster includes the meta node running at `cluster-meta-node-02:8091`.
The system doesn't join a data node to the cluster because it doesn't find a data node at `cluster-meta-node-03:8088`.

```
$ influxd-ctl join cluster-meta-node-02:8091

Joining meta node at cluster-meta-node-02:8091
Searching for meta node on cluster-meta-node-03:8091...
Searching for data node on cluster-meta-node-03:8088...

Successfully joined cluster

  * Added meta node 18 at cluster-meta-node-03:8091
  * No data node added.  Run with -v to see more information
```

####### Joining a meta node to an existing cluster and show detailed information about the join

The command joins the meta node running at `cluster-meta-node-03:8091` to an existing cluster.
The existing cluster includes the meta node running at `cluster-meta-node-02:8091`.
The `-v` argument prints detailed information about the join.

```
$ influxd-ctl join -v meta-node-02:8091

Joining meta node at meta-node-02:8091
Searching for meta node on meta-node-03:8091...
Searching for data node on data-node-03:8088...

No data node found on data-node-03:8091!

  If a data node is running on this host,
  you may need to add it manually using the following command:

  influxd-ctl -bind meta-node-02:8091 add-data <dataAddr:port>

  Common problems:

    * The influxd process is using a non-standard port (default 8088).
    * The influxd process is not running.  Check the logs for startup errors.

Successfully joined cluster

  * Added meta node 18 at meta-node-03:8091
  * No data node added.  Run with -v to see more information
```

#### `kill-copy-shard`

Aborts an in-progress [`copy-shard`](#copy-shard) command.

#### Syntax

```
influxd-ctl kill-copy-shard <data-node-source-TCP-address> <data-node-destination-TCP-address> <shard-ID>
```

#### Examples

###### Stopping an in-progress `copy-shard` command

In this example, the `kill-copy-shard` command aborts the `copy-shard` command that was copying shard `39` from `cluster-data-node-02:8088` to `cluster-data-node-03:8088`.

```
$ influxd-ctl kill-copy-shard cluster-data-node-02:8088 cluster-data-node-03:8088 39

Killed shard copy 39 from cluster-data-node-02:8088 to cluster-data-node-03:8088
```

#### `leave`

Removes a meta node and/or data node from the cluster.

{{% warn %}}The `leave` argument is destructive; it erases all metastore information from meta nodes and all data from data nodes.
Use `leave` only if you want to *permanently* remove a node from a cluster.
{{% /warn %}}

#### Syntax

```
influxd-ctl leave [-y]
```

##### Arguments

Optional arguments are in brackets.

###### [ `-y` ]

Assume yes (`y`) to all prompts.

#### Examples

###### Removing a meta and data node from a cluster

In this example, the `leave` command removes the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` from an existing cluster.
Here, we respond yes (`y`) to the two prompts that ask if we'd like to remove the data node and if we'd like to remove the meta node from the cluster.

```
$ influxd-ctl leave

Searching for data node on cluster-node-03:8088...
Remove data node cluster-node-03:8088 from the cluster [y/N]: y
Removed cluster-node-03:8088 from the cluster
Searching for meta node on cluster-node-03:8091...
Remove meta node cluster-node-03:8091 from the cluster [y/N]: y

Successfully left cluster

  * Removed data node cluster-node-03:8088 from cluster
  * Removed meta node cluster-node-03:8091 from cluster
```

###### Removing a meta and data node from a cluster and assume yes to all prompts

In this example, the `leave` command removes the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` from an existing cluster.
Because we specify the `-y` flag, the system assumes that we'd like to remove both the data node and meta node from the cluster and does not prompt us for responses.

```
$ influxd-ctl leave -y

Searching for data node on cluster-node-03:8088...
Removed cluster-node-03:8088 from the cluster
Searching for meta node on cluster-node-03:8091...

Successfully left cluster

  * Removed data node cluster-node-03:8088 from cluster
  * Removed meta node cluster-node-03:8091 from cluster
```

###### Removing a meta node from a cluster

In this example, the `leave` command removes the meta node running at `cluster-meta-node-03:8091` from an existing cluster.
The system doesn't remove a data node from the cluster because it doesn't find a data node running at `cluster-meta-node-03:8088`.

```
$ influxd-ctl leave

Searching for data node on cluster-meta-node-03:8088...
  * No data node found.
Searching for meta node on cluster-meta-node-03:8091...
Remove meta node cluster-meta-node-03:8091 from the cluster [y/N]: y

Successfully left cluster

  * No data node removed from cluster
  * Removed meta node cluster-meta-node-03:8091 from cluster
```

#### `remove-data`

Removes a data node from a cluster.
Use `remove-data` instead of the [`leave`](#leave) argument if you set up your InfluxDB Enterprise cluster with the [Production Installation](/enterprise_influxdb/v1.6/install-and-deploy/production_installation/) process.

{{% warn %}}The `remove-data` argument is destructive; it erases all data from the specified data node.
Use `remove-data` only if you want to *permanently* remove a data node from a cluster.
{{% /warn %}}

#### Syntax

```
influxd-ctl remove-data [ -force ] <data-node-TCP-bind-address>
```

##### Arguments

Optional arguments are in brackets.

###### [ `-force` ]

Forces the removal of the data node.
Use `-force` if the data node process is not running.

#### Examples

###### Removing a data node from a cluster

In this example, the `remove-data` command removes a data node running at `cluster-data-node-03:8088` from an existing cluster.

```
~# influxd-ctl remove-data cluster-data-node-03:8088
Removed data node at cluster-data-node-03:8088
```

#### `remove-meta`

Removes a meta node from the cluster.
Use `remove-meta` instead of the [`leave`](#leave) command if you set up your InfluxDB Enterprise cluster with the [Production Installation](/enterprise_influxdb/v1.6/install-and-deploy/production_installation/) process.

{{% warn %}}The `remove-meta` argument is destructive; it erases all metastore information from the specified meta node.
Use `remove-meta` only if you want to *permanently* remove a meta node from a cluster.
{{% /warn %}}

#### Syntax

```
influxd-ctl remove-meta [ -force | -tcpAddr <meta-node-TCP-bind_address> | -y ] <meta-node-HTTP-bind-address>
```

##### Arguments

Optional arguments are in brackets.

###### [ `-force` ]

Forces the removal of the meta node.
Use `-force` if the meta node process if not running, and the node is not reachable and unrecoverable.
If a meta node restarts after being `-force` removed, it may interfere with the cluster.
This argument requires the `-tcpAddr` argument.

###### [ `-tcpAddr <meta-node-TCP-bind_address>` ]

The TCP address of the meta node to remove from the cluster.
Use this argument with the `-force` argument.

###### [ `-y` ]  

Assumes `Yes` to all prompts.

#### Examples

###### Removing a meta node from a cluster

In this example, the `remove-meta` command removes the meta node at `cluster-meta-node-02:8091` from an existing cluster.
In the example, we respond yes (`y`) to the prompt that asks if we'd like to remove the meta node from the cluster.

```
$ influxd-ctl remove-meta cluster-meta-node-02:8091

Remove cluster-meta-node-02:8091 from the cluster [y/N]: y

Removed meta node at cluster-meta-node-02:8091
```

###### Forcefully removing an unresponsive meta node from a cluster

In this example, the `remove-data` command forcefully removes the meta node running at the TCP address `cluster-meta-node-02:8089` and HTTP address `cluster-meta-node-02:8091` from the cluster.
In the example, we respond yes (`y`) to the prompt that asks if we'd like to force remove the meta node from the cluster.
Note that if the meta node at `cluster-meta-node-02:8091` restarts, it may interfere with the cluster.
Only perform a force removal of a meta node if the node is not reachable and unrecoverable.

```
$ influxd-ctl remove-meta -force -tcpAddr cluster-meta-node-02:8089 cluster-meta-node-02:8091

Force remove cluster-meta-node-02:8091 from the cluster [y/N]:y

Removed meta node at cluster-meta-node-02:8091
```

#### `remove-shard`

Removes a shard from a data node.
Removing a shard is an irrecoverable, destructive action; please be cautious with this command.

#### Syntax

```
influxd-ctl remove-shard <data-node-source-TCP-address> <shard-id>
```

Resources: [Cluster Rebalance](/enterprise_influxdb/v1.6/guides/rebalance/)

#### Examples

###### Removing a shard from a running data node

In this example, the `remove-shard` command removes shard `31` from the data node running at `cluster-data-node-02:8088`.

```
~# influxd-ctl remove-shard cluster-data-node-02:8088 31

Removed shard 31 from cluster-data-node-02:8088
```

#### `restore`

Restore a [backup](#backup) to an existing cluster or a new cluster.

> **Note:** The existing cluster must contain no data in the databases affected by the restore.

Restore supports both full backups and incremental backups; the syntax for a restore differs depending on the backup type.

#### Syntax

```
influxd-ctl restore [ -db <db_name> | -full | -list | -newdb <newdb_name> | -newrf <newrf_integer> | -newrp <newrp_name> | -rp <rp_name> | shard <shard_ID> ] ( <path-to-backup-manifest-file> | <path-to-backup-directory> )
```

The `restore` command must specify either the `path-to-backup-manifest-file` or the `path-to-backup-directory`.
If the restore uses the `-full` argument, specify the `path-to-backup-manifest-file`.
If the restore doesn't use the `-full` argument, specify the `<path-to-backup-directory>`.


##### Arguments

Optional arguments are in brackets.

###### [ `-db <db_name>` ]

Name of the single database to restore.

###### [ `-full` ]

Restore a backup that was created with the `-full` flag.
A restore command with the `-full` flag requires the `path-to-backup-manifest-file`.

###### [ `-list` ]

Show the contents of the backup.

###### [ `-newdb <newdb_name>` ]

Name of the new database to restore to (must specify with `-db`).

###### [ `-newrf <newrf_integer>` ]

Integer of the new [replication factor](/influxdb/v1.6/concepts/glossary/#replication-factor) to restore to (this is capped to the number of data nodes in the cluster).

###### [ `-newrp <newrp_name>` ]

Name of the new [retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp) to restore to (must specify with `-rp`).

###### [ `-rp <rp_name>` ]

Name of the single retention policy to restore.

###### [ `-shard <shard_ID>` ]

Identifier of the [shard](/influxdb/v1.6/concepts/glossary/#shard) to restore.

Resources: [Backing up and restoring in InfluxDB Enterprise](/enterprise_influxdb/v1.6/administration/backup-and-restore/#restore)


#### Examples

###### Restoring from an incremental backup

In this example, the `restore` command restores an incremental backup stored in the `my-incremental-backup/` directory.

```
$ influxd-ctl restore my-incremental-backup/

Using backup directory: my-incremental-backup/
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Done. Restored in 21.373019ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 61.046571ms, 588800 bytes transferred
Restored from my-incremental-backup/ in 83.892591ms, transferred 588800 bytes
```

###### Restoring from a full backup

In this example, the `restore` command is used to restore a full backup that includes the manifest file at `my-full-backup/20170131T020341Z.manifest`.

```
$ influxd-ctl restore -full my-full-backup/20170131T020341Z.manifest

Using manifest: my-full-backup/20170131T020341Z.manifest
Restoring meta data... Done. Restored in 9.585639ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 48.095082ms, 569344 bytes transferred
Restored from my-full-backup in 58.58301ms, transferred 569344 bytes
```

#### `show`

Shows all [meta nodes](/enterprise_influxdb/v1.6/concepts/glossary/#meta-node) and [data nodes](/enterprise_influxdb/v1.6/concepts/glossary/#data-node) that are part of the cluster.
The output includes the InfluxDB Enterprise version number.

#### Syntax

```
influxd-ctl show
```

#### Examples

###### Showing all meta and data nodes in a cluster

In this example, the `show` command output displays that the cluster includes three meta nodes and two data nodes.
Every node is using InfluxDB Enterprise `1.3.x-c1.3.x`.

```
$ influxd-ctl show

Data Nodes
==========
ID	 TCP Address		        Version
2   cluster-node-01:8088	1.3.x-c1.3.x
4   cluster-node-02:8088	1.3.x-c1.3.x

Meta Nodes
==========
TCP Address		        Version
cluster-node-01:8091	1.3.x-c1.3.x
cluster-node-02:8091	1.3.x-c1.3.x
cluster-node-03:8091	1.3.x-c1.3.x
```

#### `show-shards`

Outputs details about existing [shards](/influxdb/v1.6/concepts/glossary/#shard) of the cluster, including shard ID, database, [retention policy](/influxdb/v1.6/concepts/glossary/#retention-policy-rp), desired replicas, [shard group](/influxdb/v1.6/concepts/glossary/#shard-group), starting timestamp, ending timestamp, expiration timestamp, and [data node](/enterprise_influxdb/v1.6/concepts/glossary/#data-node) owners.

```
influxd-ctl show-shards
```

#### Examples

###### Showing the existing shards in a cluster

In this example, the `show-shards` output shows that there are two shards in the cluster.
The first shard has an id of `51` and it's in the `telegraf` database and the `autogen` retention policy.
The desired number of copies for shard `51` is `2` and it belongs to shard group `37`.
The data in shard `51` cover the time range between `2017-03-13T00:00:00Z` and `2017-03-20T00:00:00Z`, and the shard has no expiry time; `telegraf`'s `autogen` retention policy has an infinite duration so the system never removes shard `51`.
Finally, shard `51` appears on two data nodes: `cluster-data-node-01:8088` and `cluster-data-node-03:8088`.

```
$ influxd-ctl show-shards

Shards
==========
ID  Database             Retention Policy  Desired Replicas  Shard Group  Start                 End                              Expires               Owners
51  telegraf             autogen           2                 37           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
52  telegraf             autogen           2                 37           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{5 cluster-data-node-02:8088} {26 cluster-data-node-01:8088}]
```

#### `update-data`

Updates a data node's address in the [meta store](/enterprise_influxdb/v1.6/concepts/glossary/#meta-service).

#### Syntax

```
influxd-ctl update-data <data-node-old-TCP-bind-address> <data-node-new-TCP-bind-address>
```

#### Examples

###### Updating a data node hostname

In this example, the `update-data` command updates the address for data node `26` from `cluster-node-01:8088` to `cluster-data-node-01:8088`.

```
$ influxd-ctl update-data cluster-node-01:8088 cluster-data-node-01:8088

updated data node 26 to cluster-data-node-01:8088
```

#### `token`

Generates a signed JSON Web Token (JWT) token.
The token argument only works when using JWT authentication in the cluster and when using the [`-auth-type jwt`](#auth-type-none-basic-jwt) and [`-secret <shared-secret>`](#secret-jwt-shared-secret) arguments.

#### Syntax

```
influxd-ctl token [-exp <duration>]
```

##### Arguments

Optional arguments are in brackets.

###### [ `-exp <duration>` ]

Determines the time after which the token expires.
By default, the token expires after one minute.

#### Examples

###### Creating a signed JWT token

In this example, the `token` command returns a signed JWT token.

```
$ influxd-ctl -auth-type jwt -secret oatclusters token

hereistokenisitgoodandsoareyoufriend.timingisaficklefriendbutwherewouldwebewithoutit.timingthentimeseriesgood-wevemadetheleap-nowletsgetdownanddataandqueryallourheartsout
```

###### Attempting to create a signed JWT token with basic authentication

In this example, the `token` command returns an error because the command doesn't use JWT authentication.

```
$ influxd-ctl -auth-type basic -user admini -pwd mouse token

token: tokens can only be created when using bearer authentication
```

#### `truncate-shards`

Truncates hot [shards](/influxdb/v1.6/concepts/glossary/#shard), that is, shards that cover the time range that includes the current time ([`now()`](/influxdb/v1.6/concepts/glossary/#now)).
The `truncate-shards` command creates a new shard and the system writes all new points to that shard.

#### Syntax

```
influxd-ctl truncate-shards [-delay <duration>]
```

##### Arguments

Optional arguments are in brackets.

###### [ `-delay <duration>` ]

Determines when to truncate shards after [`now()`](/influxdb/v1.6/concepts/glossary/#now).
By default, the tool sets the delay to one minute.
The `duration` is an integer followed by a [duration unit](/influxdb/v1.6/query_language/spec/#durations).

Resources: [Cluster rebalancing](/enterprise_influxdb/v1.6/guides/rebalance/)

#### Examples

###### Truncating shards with the default delay time

In this example, after running the `truncate-shards` command and waiting one minute, the output of the [`show-shards` command](#show-shards) shows that the system truncated shard `51` (truncated shards have an asterisk (`*`) on the timestamp in the `End` column) and created the new shard with the id `54`.

```
$ influxd-ctl truncate-shards

Truncated shards.

$ influxd-ctl show-shards

Shards
==========
ID  Database             Retention Policy  Desired Replicas  Shard Group  Start                 End                              Expires               Owners
51  telegraf             autogen           2                 37           2017-03-13T00:00:00Z  2017-03-13T20:40:15.753443255Z*                        [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
54  telegraf             autogen           2                 38           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
```

###### Truncating shards with a user-provided delay timestamp

In this example, after running the `truncate-shards` command and waiting three minutes, the output of the [`show-shards` command](#show-shards) shows that the system truncated shard `54` (truncated shards have an asterix (`*`) on the timestamp in the `End` column) and created the new shard with the id `58`.

```
$ influxd-ctl truncate-shards -delay 3m

Truncated shards.

$ influxd-ctl show-shards

Shards
==========
ID  Database             Retention Policy  Desired Replicas  Shard Group  Start                 End                              Expires               Owners
54  telegraf             autogen           2                 38           2017-03-13T00:00:00Z  2017-03-13T20:59:14.665827038Z*                        [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
58  telegraf             autogen           2                 40           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
```

## `influx` command line interface (CLI)

Use the `influx` command line interface (CLI) to write data to your cluster, query data interactively, and view query output in different formats.
The `influx` CLI is available on all [data nodes](/enterprise_influxdb/v1.6/concepts/glossary/#data-node).

See [InfluxDB command line interface (CLI/shell)](/influxdb/v1.6/tools/shell/) in the InfluxDB OSS documentation for details on using the `influx` command line interface utility.
