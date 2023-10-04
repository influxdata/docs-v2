---
title: influxd-ctl CLI
description: >
  Use the `influxd-ctl` CLI to manage your InfluxDB Enterprise cluster.
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
influxd-ctl [global-options] <command> [command-options] [arguments]
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

<!----------------------------------------------------------------------------->
<!----------------------------------------------------------------------------->
<!----------------------------------------------------------------------------->


### `add-data`

### `add-meta`

### `backup`

### `copy-shard`


### `copy-shard-status`

### `entropy`

Manage entropy and the [anti-entropy](/enterprise_influxdb/v1/administration/anti-entropy/) process among shards in a cluster.
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

```bash
influxd-ctl entropy <subcommand> [<arguments>]
```

#### Examples

##### Display all shards with entropy

In this example, the `entropy show` command returns all shards with detected entropy.

```bash
$ influxd-ctl entropy show

Entropy
==========
ID     Database  Retention Policy  Start                          End                            Expires                        Status
21179  statsdb   1hour             2017-10-09 00:00:00 +0000 UTC  2017-10-16 00:00:00 +0000 UTC  2018-10-22 00:00:00 +0000 UTC  diff
25165  statsdb   1hour             2017-11-20 00:00:00 +0000 UTC  2017-11-27 00:00:00 +0000 UTC  2018-12-03 00:00:00 +0000 UTC  diff
```

##### Add a shard with entropy to the repair queue

In this example, the `entropy repair` command adds a shard with detected entropy to the repair queue.
The `repair` subcommand requires a Shard ID, which can be obtained from the `influxd-ctl entropy show` output.

```bash
influxd-ctl entropy repair 21179

Repair Shard 21179 queued
```

##### Remove a shard in the repair queue

In this example, the `entropy kill-repair` command removes a shard from the repair queue.
The `kill-repair` subcommand requires a Shard ID, which can be obtained from the `influxd-ctl entropy show` output.

```bash
influxd-ctl entropy kill-repair 21179

Shard 21179 removed from repair queue
```

> This only applies to shards in the repair queue.
> It does not cancel repairs on nodes that are in the process of being repaired.
> Once a repair has started, requests to cancel it are ignored.

### `join`

Joins a meta node and/or data node to a cluster.
By default, `influxd-ctl` joins the local meta node and/or data node into a new cluster.

#### Syntax

```bash
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

##### Join a meta and data node into a cluster

In this example, the `join` command joins the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` into a new cluster.

```bash
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

##### Join a meta and data node to an existing cluster

The command joins the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` to an existing cluster.
The existing cluster includes the meta node running at `cluster-meta-node-02:8091`.

```bash
$ influxd-ctl join cluster-meta-node-02:8091

Joining meta node at cluster-meta-node-02:8091
Searching for meta node on cluster-node-03:8091...
Searching for data node on cluster-node-03:8088...

Successfully joined cluster

  * Added meta node 3 at cluster-node-03:8091
  * Added data node 4 at cluster-node-03:8088
```

##### Join a meta node to an existing cluster

The command joins the meta node running at `cluster-meta-node-03:8091` to an existing cluster.
The existing cluster includes the meta node running at `cluster-meta-node-02:8091`.
The system doesn't join a data node to the cluster because it doesn't find a data node at `cluster-meta-node-03:8088`.

```bash
$ influxd-ctl join cluster-meta-node-02:8091

Joining meta node at cluster-meta-node-02:8091
Searching for meta node on cluster-meta-node-03:8091...
Searching for data node on cluster-meta-node-03:8088...

Successfully joined cluster

  * Added meta node 18 at cluster-meta-node-03:8091
  * No data node added.  Run with -v to see more information
```

##### Join a meta node to an existing cluster and show detailed information about the join

The command joins the meta node running at `cluster-meta-node-03:8091` to an existing cluster.
The existing cluster includes the meta node running at `cluster-meta-node-02:8091`.
The `-v` argument prints detailed information about the join.

```bash
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

### `kill-copy-shard`

Aborts an in-progress [`copy-shard`](#copy-shard) command.

#### Syntax

```
influxd-ctl kill-copy-shard <data-node-source-TCP-address> <data-node-destination-TCP-address> <shard-ID>
```

#### Examples

##### Stop an in-progress `copy-shard` command

In this example, the `kill-copy-shard` command aborts the `copy-shard` command that was copying shard `39` from `cluster-data-node-02:8088` to `cluster-data-node-03:8088`.

```bash
$ influxd-ctl kill-copy-shard cluster-data-node-02:8088 cluster-data-node-03:8088 39

Killed shard copy 39 from cluster-data-node-02:8088 to cluster-data-node-03:8088
```

### `leave`

Removes a meta node and/or data node from the cluster.

{{% warn %}}
The `leave` argument is destructive; it erases all metastore information from meta nodes and all data from data nodes.
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

##### Remove a meta and data node from a cluster

In this example, the `leave` command removes the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` from an existing cluster.
Here, we respond yes (`y`) to the two prompts that ask if we'd like to remove the data node and if we'd like to remove the meta node from the cluster.

```bash
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

##### Remove a meta and data node from a cluster and assume yes to all prompts

In this example, the `leave` command removes the meta node running at `cluster-node-03:8091` and the data node running at `cluster-node-03:8088` from an existing cluster.
Because we specify the `-y` flag, the system assumes that we'd like to remove both the data node and meta node from the cluster and does not prompt us for responses.

```bash
$ influxd-ctl leave -y

Searching for data node on cluster-node-03:8088...
Removed cluster-node-03:8088 from the cluster
Searching for meta node on cluster-node-03:8091...

Successfully left cluster

  * Removed data node cluster-node-03:8088 from cluster
  * Removed meta node cluster-node-03:8091 from cluster
```

##### Remove a meta node from a cluster

In this example, the `leave` command removes the meta node running at `cluster-meta-node-03:8091` from an existing cluster.
The system doesn't remove a data node from the cluster because it doesn't find a data node running at `cluster-meta-node-03:8088`.

```bash
$ influxd-ctl leave

Searching for data node on cluster-meta-node-03:8088...
  * No data node found.
Searching for meta node on cluster-meta-node-03:8091...
Remove meta node cluster-meta-node-03:8091 from the cluster [y/N]: y

Successfully left cluster

  * No data node removed from cluster
  * Removed meta node cluster-meta-node-03:8091 from cluster
```

### `node-labels`

Assign user-defined labels to meta and data nodes in a cluster.
Labels are JSON key-value pairs.

#### Syntax

```bash
influxd-ctl [options] node-labels <command> [options] [<args>]
```

Available commands are:

- `set`: set (add or update) one or more labels on a node
- `delete`: delete one or more labels from a node

Required options when operating on labels:

- `nodeid`: the node ID number to add/remove labels to (find `nodeid` using `influxd-ctl show`)
- `labels`: labels, given as JSON key-value pairs

#### Examples

##### Show a cluster with no node labels

```
$ ./influxd-ctl show
Data Nodes
==========
ID      TCP Address     Version       Labels
4       localhost:8188  1.10.x-c1.10.x  {}
5       localhost:8288  1.10.x-c1.10.x  {}

Meta Nodes
==========
ID      TCP Address     Version       Labels
1       localhost:8191  1.10.x-c1.10.x  {}
2       localhost:8291  1.10.x-c1.10.x  {}
3       localhost:8391  1.10.x-c1.10.x  {}
```

##### Add labels to two data nodes and show the cluster

```sh
$ ./influxd-ctl node-labels set -nodeid 4 -labels '{"az":"us-east","hello":"earth"}'
$ ./influxd-ctl node-labels set -nodeid 5 -labels '{"az":"us-west","hello":"mars"}'
$ ./influxd-ctl show
Data Nodes
==========
ID      TCP Address     Version       Labels
4       localhost:8188  1.10.x-c1.10.x  {"az":"us-east","hello":"earth"}
5       localhost:8288  unknown       {"az":"us-west","hello":"mars"}

Meta Nodes
==========
ID      TCP Address     Version       Labels
1       localhost:8191  1.10.x-c1.10.x  {}
2       localhost:8291  1.10.x-c1.10.x  {}
3       localhost:8391  1.10.x-c1.10.x  {}
```

##### Update, delete, and show labels

Update an existing label on one node, delete a label on the other node, and show the cluster:

```sh
$ ./influxd-ctl node-labels set -nodeid 4 -labels '{"hello":"world"}'
$ ./influxd-ctl node-labels delete -nodeid 5 -labels '["hello"]'
$ ./influxd-ctl show
Data Nodes
==========
ID      TCP Address     Version       Labels
4       localhost:8188  1.10.x-c1.10.x  {"az":"us-east","hello":"world"}
5       localhost:8288  1.10.x-c1.10.x  {"az":"us-west"}

Meta Nodes
==========
ID      TCP Address     Version       Labels
1       localhost:8191  1.10.x-c1.10.x  {}
2       localhost:8291  1.10.x-c1.10.x  {}
3       localhost:8391  1.10.x-c1.10.x  {}
```

##### Programmatic access to node labels

Use the meta node API in scripts or programs that need to parse node labels:

```sh
$ curl -s localhost:8191/show-cluster | jq . | head -14
{
  "data": [
    {
      "id": 4,
      "version": "unknown",
      "tcpAddr": "localhost:8188",
      "httpAddr": "localhost:8186",
      "httpScheme": "http",
      "status": "joined",
      "labels": {
        "az": "us-east",
        "hello": "world"
      }
    },
```

### `remove-data`

Removes a data node from a cluster.
Use `remove-data` to erase data in the selected data node and permanently remove the node from the cluster.
(To remove metadata about the node from other nodes in the cluster, see [`leave`](#leave).


{{% warn %}}The `remove-data` argument is destructive; it erases all data from the specified data node.
Use `remove-data` only if you want to *permanently* remove a data node from a cluster.
{{% /warn %}}

#### Syntax

```bash
influxd-ctl remove-data [ -force ] <data-node-TCP-bind-address>
```

##### Arguments

Optional arguments are in brackets.

###### [ `-force` ]

Forces the removal of the data node.
Use `-force` if the data node process is not running.

#### Examples

##### Remove a data node from a cluster

In this example, the `remove-data` command removes a data node running at `cluster-data-node-03:8088` from an existing cluster.

```bash
$ influxd-ctl remove-data cluster-data-node-03:8088
Removed data node at cluster-data-node-03:8088
```

### `remove-meta`

Removes a meta node from the cluster.
Use `remove-meta` to erase data in the selected meta node and permanently remove the node from the cluster.
(To remove metadata about the node from other nodes in the cluster, see [`leave`](#leave).

{{% warn %}}The `remove-meta` argument is destructive; it erases all metastore information from the specified meta node.
Use `remove-meta` only if you want to *permanently* remove a meta node from a cluster.
{{% /warn %}}

#### Syntax

```bash
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

##### Remove a meta node from a cluster

In this example, the `remove-meta` command removes the meta node at `cluster-meta-node-02:8091` from an existing cluster.
In the example, we respond yes (`y`) to the prompt that asks if we'd like to remove the meta node from the cluster.

```bash
$ influxd-ctl remove-meta cluster-meta-node-02:8091

Remove cluster-meta-node-02:8091 from the cluster [y/N]: y

Removed meta node at cluster-meta-node-02:8091
```

##### Forcefully remove an unresponsive meta node from a cluster

In this example, the `remove-data` command forcefully removes the meta node running at the TCP address `cluster-meta-node-02:8089` and HTTP address `cluster-meta-node-02:8091` from the cluster.
In the example, we respond yes (`y`) to the prompt that asks if we'd like to force remove the meta node from the cluster.
Note that if the meta node at `cluster-meta-node-02:8091` restarts, it may interfere with the cluster.
Only perform a force removal of a meta node if the node is not reachable and unrecoverable.

```bash
$ influxd-ctl remove-meta -force -tcpAddr cluster-meta-node-02:8089 cluster-meta-node-02:8091

Force remove cluster-meta-node-02:8091 from the cluster [y/N]:y

Removed meta node at cluster-meta-node-02:8091
```

### `remove-shard`

Removes a shard from a data node.
Removing a shard is an irrecoverable, destructive action; please be cautious with this command.

#### Syntax

```
influxd-ctl remove-shard <data-node-source-TCP-address> <shard-id>
```

Resources: [Rebalance cluster](/enterprise_influxdb/v1/guides/rebalance/)

#### Examples

##### Remove a shard from a running data node

In this example, the `remove-shard` command removes shard `31` from the data node running at `cluster-data-node-02:8088`.

```bash
$ influxd-ctl remove-shard cluster-data-node-02:8088 31

Removed shard 31 from cluster-data-node-02:8088
```

### `restore`

Restore a [backup](#backup) to an existing cluster or a new cluster.

> **Note:** The existing cluster must contain no data in the databases affected by the restore.

Restore supports both full, incremental, and metadata-only backups.
The syntax for restoring full backups differs from the syntax for restoring
incremental and metadata backups.

#### Syntax

```bash
influxd-ctl restore [ -db <db_name> | -full | -list | -newdb <newdb_name> | -newrf <newrf_integer> | -newrp <newrp_name> | -rp <rp_name> | shard <shard_ID> ] ( <path-to-backup-manifest-file> | <path-to-backup-directory> )
```

To restore from a [**full backup**](#backup), include the `-full` argument and provide
the path to the backup manifest (`/path/to/backups/backup.manifest`).
To restore from an **incremental or metadata** backup, provide the path to the directory
that contains the backup files (`/path/to/backups`).

##### Arguments

Optional arguments are in brackets.

###### [ `-db <db_name>` ]

Name of the single database to restore.

###### [ `-full` ]

Restore a backup that was created with the `-full` flag.
A restore command with the `-full` flag requires the `path-to-backup-manifest-file`.

{{% note %}}
Restoring from a full backup **does not** restore metadata.
To restore metadata, [restore a metadata backup](#restore-from-a-metadata-backup) separately.
{{% /note %}}

###### [ `-list` ]

Show the contents of the backup.

###### [ `-meta-only-overwrite-force` ]

Restore *metadata only* from a backup.

{{% warn %}}
Only use this flag to restore from backups of the target cluster.
If you use this flag with metadata from a different cluster, you will lose data
(since metadata includes shard assignments to data nodes).

See ["Back up and restore"](/enterprise_influxdb/v1/administration/backup-and-restore/#restore-overwrite-metadata-from-a-full-or-incremental-backup-to-fix-damaged-metadata)
for instructions on using this flag.
{{% /warn %}}

###### [ `-newdb <newdb_name>` ]

Name of the new database to restore to.
(Requires the `-db` argument.)

###### [ `-newrf <newrf_integer>` ]

Integer of the new [replication factor](/enterprise_influxdb/v1/concepts/glossary/#replication-factor) to restore to (this is capped to the number of data nodes in the cluster).

###### [ `-newrp <newrp_name>` ]

Name of the new [retention policy](/enterprise_influxdb/v1/concepts/glossary/#retention-policy-rp) to restore to.
(Requires the `-rp` argument)

###### [ `-newduration <new_duration>` ]
The shard duration when restoring.
(Requires the `-rp` argument.)

###### [ `-newshard <new_shard_name` ]

Name of a new destination shard ID, if the target shard differs from the shard ID in the backup.
(Requires the `-shard` argument.)

###### [ `-rp <rp_name>` ]

Name of the single retention policy to restore.
(Requires the `-db` argument.)

###### [ `-shard <shard_ID>` ]

Identifier of the [shard](/enterprise_influxdb/v1/concepts/glossary/#shard) to restore.

Resources: [Backing up and restoring in InfluxDB Enterprise](/enterprise_influxdb/v1/administration/backup-and-restore/)

#### Examples

##### Restore from an incremental backup

In this example, the `restore` command restores an incremental backup stored in the `my-incremental-backup/` directory.

```bash
$ influxd-ctl restore my-incremental-backup/

Using backup directory: my-incremental-backup/
Using meta backup: 20170130T231333Z.meta
Restoring meta data... Done. Restored in 21.373019ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 61.046571ms, 588800 bytes transferred
Restored from my-incremental-backup/ in 83.892591ms, transferred 588800 bytes
```

##### Restore from a metadata backup

In this example, the `restore` command restores an metadata backup stored
in the `metadata-backup/` directory.

```bash
$ influxd-ctl restore metadata-backup/

Using backup directory: metadata-backup/
Using meta backup: 20200101T000000Z.meta
Restoring meta data... Done. Restored in 21.373019ms, 1 shards mapped
Restored from my-incremental-backup/ in 19.2311ms, transferred 588 bytes
```

##### Restore from a full backup

In this example, the `restore` command is used to restore a full backup that includes the manifest file at `my-full-backup/20170131T020341Z.manifest`.

```bash
$ influxd-ctl restore -full my-full-backup/20170131T020341Z.manifest

Using manifest: my-full-backup/20170131T020341Z.manifest
Restoring meta data... Done. Restored in 9.585639ms, 1 shards mapped
Restoring db telegraf, rp autogen, shard 2 to shard 2...
Copying data to <hostname>:8088... Copying data to <hostname>:8088... Done. Restored shard 2 into shard 2 in 48.095082ms, 569344 bytes transferred
Restored from my-full-backup in 58.58301ms, transferred 569344 bytes
```

### `show`

Shows all [meta nodes](/enterprise_influxdb/v1/concepts/glossary/#meta-node) and [data nodes](/enterprise_influxdb/v1/concepts/glossary/#data-node) that are part of the cluster. The output includes the `RAFT status` of all meta nodes, the InfluxDB Enterprise version number and any [labels](#node-labels).

#### Syntax

```
influxd-ctl show
```

#### Examples

##### Show all meta and data nodes in a cluster

In this example, the `show` command output displays the cluster includes three meta nodes and two data nodes. Every node is InfluxDB Enterprise version `1.10.0`. The RAFT status shows `metatest_meta_0_1:8089` as the leader node, and the other two meta nodes as peers.

```bash
$ influxd-ctl show

Data Nodes
==========
ID      TCP Address             HTTP Address            Version      Labels
4       test_data_0_1:8088    test_data_0_1:8086        1.10.0         {}
5       test_data_0_2:8088    test_data_0_2:8086        1.10.0         {}
 
Meta Nodes
==========
ID      Raft Address            HTTP Address            Version      Labels
1       test_meta_0_1:8089    test_meta_0_1:8091        1.10.0         {}
2       test_meta_1_1:8089    test_meta_1_1:8091        1.10.0         {}
3       test_meta_1_2:8089    test_meta_1_2:8091        1.10.0         {}
 
Raft Status
==========
Leader  test_meta_0_1:8089
Peers   ["test_meta_1_1:8089", "test_meta_1_2:8089"]

```
##### Show active and passive data nodes in a cluster

In this example, the `show` command output displays that the cluster includes a passive data node.

```bash
Data Nodes
==========
ID	TCP Address               Version		    Labels	  Passive
4	 cluster-node_0_1:8088		  1.10.0          {}	      false
5	 cluster-node_1_1:8088		  1.10.0          {}	      true
6	 cluster-node_2_1:8088		  1.10.0          {}	      false
```

### `show-shards`

Outputs details about existing [shards](/enterprise_influxdb/v1/concepts/glossary/#shard) of the cluster, including shard ID, database, [retention policy](/enterprise_influxdb/v1/concepts/glossary/#retention-policy-rp), desired replicas, [shard group](/enterprise_influxdb/v1/concepts/glossary/#shard-group), starting timestamp, ending timestamp, expiration timestamp, and [data node](/enterprise_influxdb/v1/concepts/glossary/#data-node) owners.

#### Syntax

```
influxd-ctl show-shards
```

#### Examples

##### Show the existing shards in a cluster

In this example, the `show-shards` output shows that there are two shards in the cluster.
The first shard has an id of `51` and it's in the `telegraf` database and the `autogen` retention policy.
The desired number of copies for shard `51` is `2` and it belongs to shard group `37`.
The data in shard `51` cover the time range between `2017-03-13T00:00:00Z` and `2017-03-20T00:00:00Z`, and the shard has no expiry time; `telegraf`'s `autogen` retention policy has an infinite duration so the system never removes shard `51`.
Finally, shard `51` appears on two data nodes: `cluster-data-node-01:8088` and `cluster-data-node-03:8088`.

```bash
$ influxd-ctl show-shards

Shards
==========
ID  Database             Retention Policy  Desired Replicas  Shard Group  Start                 End                              Expires               Owners
51  telegraf             autogen           2                 37           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
52  telegraf             autogen           2                 37           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{5 cluster-data-node-02:8088} {26 cluster-data-node-01:8088}]
```

##### Use the verbose flag to view more shard owner detail

Use the verbose flag to show more detail about each shard owner, including the state (hot/cold), last modified date and time, and size on disk.

```bash
$ influxd-ctl  show-shards -v

Shards
==========
ID  Database             Retention Policy  Desired Replicas  Shard Group  Start                 End                              Expires                Owners
1   telegraf             autogen           2                 1            2020-04-27T00:00:00Z  2020-05-04T00:00:00Z                                   [{4 localhost:8188 hot 2020-04-28 13:59:50.022558549 -0400 EDT 1784222 <nil>} {5 localhost:8288 hot 2020-04-28 13:59:50.02605612 -0400 EDT 1785568 <nil>}]
2   stress               autogen           2                 2            2020-04-27T00:00:00Z  2020-05-04T00:00:00Z                                   [{4 localhost:8188 hot 2020-04-28 13:50:57.076073713 -0400 EDT 102637693 <nil>} {5 localhost:8288 hot 2020-04-28 13:50:57.136074013 -0400 EDT 102915477 <nil>}]
3   _internal            monitor           1                 3            2020-04-28T00:00:00Z  2020-04-29T00:00:00Z             2020-05-06T00:00:00Z  [{5 localhost:8288 hot 2020-04-28 13:59:50.017341511 -0400 EDT 627431 <nil>}]
4   _internal            monitor           1                 3            2020-04-28T00:00:00Z  2020-04-29T00:00:00Z             2020-05-06T00:00:00Z  [{4 localhost:8188 hot 2020-04-28 13:59:50.01737255 -0400 EDT 1014827 <nil>}]
```

##### Use the verbose flag in a curl request

```bash
curl -X GET 'localhost:8191/show-shards?verbose=true' | jq .

Sample output:

[
  {
    "id": "1",
    "database": "telegraf",
    "retention-policy": "autogen",
    "replica-n": 2,
    "shard-group-id": "1",
    "start-time": "2020-04-27T00:00:00Z",
    "end-time": "2020-05-04T00:00:00Z",
    "expire-time": "0001-01-01T00:00:00Z",
    "truncated-at": "0001-01-01T00:00:00Z",
    "owners": [
      {
        "id": "4",
        "tcpAddr": "localhost:8188",
        "state": "hot",
        "last-modified": "2020-04-28T14:01:50.026425382-04:00",
        "size": 1949209,
        "err": null
      },
      {
        "id": "5",
        "tcpAddr": "localhost:8288",
        "state": "hot",
        "last-modified": "2020-04-28T14:01:50.028726299-04:00",
        "size": 1950785,
        "err": null
      }
    ]
  },
  {
    "id": "2",
    "database": "stress",
    "retention-policy": "autogen",
    "replica-n": 2,
    "shard-group-id": "2",
    "start-time": "2020-04-27T00:00:00Z",
    "end-time": "2020-05-04T00:00:00Z",
    "expire-time": "0001-01-01T00:00:00Z",
    "truncated-at": "0001-01-01T00:00:00Z",
    "owners": [
      {
        "id": "4",
        "tcpAddr": "localhost:8188",
        "state": "hot",
        "last-modified": "2020-04-28T13:50:57.076073713-04:00",
        "size": 102637693,
        "err": null
      },
      {
        "id": "5",
        "tcpAddr": "localhost:8288",
        "state": "hot",
        "last-modified": "2020-04-28T13:50:57.136074013-04:00",
        "size": 102915477,
        "err": null
      }
    ]
  },
  {
    "id": "3",
    "database": "_internal",
    "retention-policy": "monitor",
    "replica-n": 1,
    "shard-group-id": "3",
    "start-time": "2020-04-28T00:00:00Z",
    "end-time": "2020-04-29T00:00:00Z",
    "expire-time": "2020-05-06T00:00:00Z",
    "truncated-at": "0001-01-01T00:00:00Z",
    "owners": [
      {
        "id": "5",
        "tcpAddr": "localhost:8288",
        "state": "hot",
        "last-modified": "2020-04-28T14:01:50.023569927-04:00",
        "size": 690633,
        "err": null
      }
    ]
  },
  {
    "id": "4",
    "database": "_internal",
    "retention-policy": "monitor",
    "replica-n": 1,
    "shard-group-id": "3",
    "start-time": "2020-04-28T00:00:00Z",
    "end-time": "2020-04-29T00:00:00Z",
    "expire-time": "2020-05-06T00:00:00Z",
    "truncated-at": "0001-01-01T00:00:00Z",
    "owners": [
      {
        "id": "4",
        "tcpAddr": "localhost:8188",
        "state": "hot",
        "last-modified": "2020-04-28T14:01:50.022177797-04:00",
        "size": 1117271,
        "err": null
      }
    ]
  }
]
```

### `update-data`

Updates a data node's address in the [meta store](/enterprise_influxdb/v1/concepts/glossary/#meta-service).

#### Syntax

```
influxd-ctl update-data <data-node-old-TCP-bind-address> <data-node-new-TCP-bind-address>
```

#### Examples

##### Update a data node hostname

In this example, the `update-data` command updates the address for data node `26` from `cluster-node-01:8088` to `cluster-data-node-01:8088`.

```bash
$ influxd-ctl update-data cluster-node-01:8088 cluster-data-node-01:8088

updated data node 26 to cluster-data-node-01:8088
```

### `token`

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

##### Create a signed JWT token

In this example, the `token` command returns a signed JWT token.

```bash
$ influxd-ctl -auth-type jwt -secret oatclusters token

hereistokenisitgoodandsoareyoufriend.timingisaficklefriendbutwherewouldwebewithoutit.timingthentimeseriesgood-wevemadetheleap-nowletsgetdownanddataandqueryallourheartsout
```

##### Attempt to create a signed JWT token with basic authentication

In this example, the `token` command returns an error because the command doesn't use JWT authentication.

```bash
$ influxd-ctl -auth-type basic -user admini -pwd mouse token

token: tokens can only be created when using bearer authentication
```

### `truncate-shards`

Truncates hot [shards](/enterprise_influxdb/v1/concepts/glossary/#shard), that is, shards that cover the time range that includes the current time ([`now()`](/enterprise_influxdb/v1/concepts/glossary/#now)).
The `truncate-shards` command creates a new shard and the system writes all new points to that shard.

#### Syntax

```
influxd-ctl truncate-shards [-delay <duration>]
```

##### Arguments

Optional arguments are in brackets.

###### [ `-delay <duration>` ]

Determines when to truncate shards after [`now()`](/enterprise_influxdb/v1/concepts/glossary/#now).
By default, the tool sets the delay to one minute.
The `duration` is an integer followed by a [duration unit](/enterprise_influxdb/v1/query_language/spec/#durations).

Resources: [Cluster rebalancing](/enterprise_influxdb/v1/guides/rebalance/)

#### Examples

##### Truncate shards with the default delay time

In this example, after running the `truncate-shards` command and waiting one minute, the output of the [`show-shards` command](#show-shards) shows that the system truncated shard `51` (truncated shards have an asterisk (`*`) on the timestamp in the `End` column) and created the new shard with the id `54`.

```bash
$ influxd-ctl truncate-shards

Truncated shards.

$ influxd-ctl show-shards

Shards
==========
ID  Database             Retention Policy  Desired Replicas  Shard Group  Start                 End                              Expires               Owners
51  telegraf             autogen           2                 37           2017-03-13T00:00:00Z  2017-03-13T20:40:15.753443255Z*                        [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
54  telegraf             autogen           2                 38           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
```

##### Truncate shards with a user-provided delay timestamp

In this example, after running the `truncate-shards` command and waiting three minutes, the output of the [`show-shards` command](#show-shards) shows that the system truncated shard `54` (truncated shards have an asterix (`*`) on the timestamp in the `End` column) and created the new shard with the id `58`.

```bash
$ influxd-ctl truncate-shards -delay 3m

Truncated shards.

$ influxd-ctl show-shards

Shards
==========
ID  Database             Retention Policy  Desired Replicas  Shard Group  Start                 End                              Expires               Owners
54  telegraf             autogen           2                 38           2017-03-13T00:00:00Z  2017-03-13T20:59:14.665827038Z*                        [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
58  telegraf             autogen           2                 40           2017-03-13T00:00:00Z  2017-03-20T00:00:00Z                                   [{26 cluster-data-node-01:8088} {33 cluster-data-node-03:8088}]
```
