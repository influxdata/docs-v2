---
title: Back up and restore data
seotitle: Back up and restore data in InfluxDB v1.8
description: >
  To prevent unexpected data loss, back up and restore InfluxDB OSS instances.
aliases:
  - /influxdb/v1.8/administration/backup-and-restore/
menu:
  influxdb_1_8:
    name: Back up and restore
    weight: 60
    parent: Administration
v2: /influxdb/v2.0/backup-restore/
---

Use the InfluxDB {{< current-version >}} `backup` and `restore` utilities
to prevent unexpected data loss and preserve the ability to restore data if it
ever is lost.
These utilities let you:

- Back up and restore multiple databases at a time.
- Back up specific time ranges.
- Import data from [InfluxDB Enterprise](/{{< latest "enterprise_influxdb" >}}/) clusters.
- Create backup files compatible with InfluxDB Enterprise.

{{% note %}}
#### InfluxDB Enterprise users
See [Back up and restore in InfluxDB Enterprise](/{{< latest "enterprise_influxdb" >}}/administration/backup-and-restore/).
{{% /note %}}

- [Backup formats](#backup-formats)
  - [Specify your backup format](#specify-your-backup-format)
- [Backup and restore requirements](#backup-and-restore-requirements)
- [Configure backup and restore services](#configure-backup-and-restore-services)
- [Back up data](#back-up-data)
  - [Backup examples](#backup-examples)

## Backup formats
The InfluxDB `backup` utility outputs data backups in one of two formats: **legacy** or **portable**.
Each format provides different functionality and support for other versions of InfluxDB.
The major difference between the formats is that the legacy format can only
be used with InfluxDB OSS 1.x. The portable format is "portable" between
InfluxDB 1.5–{{< current-version >}} and InfluxDB Enterprise.

| Backup functionality                                    |    Legacy format     |   Portable format    |
| :------------------------------------------------------ | :------------------: | :------------------: |
| Back up single databases                                | {{< icon "check" >}} | {{< icon "check" >}} |
| Back up multiple databases                              |                      | {{< icon "check" >}} |
| Back up single retention polices                        | {{< icon "check" >}} | {{< icon "check" >}} |
| Back up multiple retention policies                     | {{< icon "check" >}} | {{< icon "check" >}} |
| Back up specific time ranges                            | {{< icon "check" >}} | {{< icon "check" >}} |
| Back up remote databases                                | {{< icon "check" >}} | {{< icon "check" >}} |
| Restore to **InfluxDB OSS 1.0–1.4**                     | {{< icon "check" >}} |                      |
| Restore to **InfluxDB OSS 1.5–{{< current-version >}}** | {{< icon "check" >}} | {{< icon "check" >}} |
| Restore to **InfluxDB Enterprise**                      |                      | {{< icon "check" >}} |

### Specify your backup format
By default, the `backup` and `restore` utilities create and restore backups in
the legacy format.
To create or restore from a backup or in the portable format, include the
`-portable` flag with your backup command.

{{< code-callout "-portable" >}}
```sh
# Create a backup in the portable format
influxd backup -portable /path/to/backup-destination

# Restore from a portable backup
influxd restore -portable /path/to/backup-destination
```
{{< /code-callout >}}

{{% note %}}
#### We recommend the portable format
We recommend using the portable format unless you need to be able to restore
the backup to InfluxDB 1.4 or earlier.
{{% /note %}}

## Backup and restore requirements
- The InfluxDB service (`influxd`) must be running.
- Both the source and target InfluxDB instances must be the same InfluxDB version
  or differ by only a minor version.
  For example, you can back up data from InfluxDB {{< latest-patch minorVersionOffset=-1 >}}
  and restore it to an InfluxDB {{< latest-patch >}} instance.

## Configure backup and restore services

InfluxDB OSS {{< current-version >}}  `backup` and `restore` utilities execute
over a TCP connection.
The default IP and port used for backup and restore remote procedure calls (RPCs)
are `127.0.0.1:8088`.

**To customize the TCP IP and port the backup and restore services use**,
uncomment and update the
[`bind-address` configuration setting](/influxdb/v1.8/administration/config#bind-address-127-0-0-1-8088) 
at the root level of your InfluxDB configuration file (`influxdb.conf`).

```toml
# Bind address to use for the RPC service for backup and restore.
bind-address = "127.0.0.1:8088"
```

## Back up data

Use the [`influxd backup` utility](/influxdb/v1.8/tools/influxd/backup/) to create
a backup of time series data and metadata stored in InfluxDB.

{{% note %}}
`backup` ignores WAL files and in-memory cache data.
{{% /note %}}

Provide the following for each [backup format](#backup-formats):

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Portable format](#)
[Legacy format](#)
{{% /tabs %}}
{{% tab-content %}}

- ({{< req >}}) **`-portable` flag**
- **InfluxDB bind address** _(Only required if creating a backup from a remote InfluxDB host)_
- **Database name** _(If no database name is specified, the command backs up all databases)_
- **Retention policy name**
  _(If no retention policy is specified, the command backs up all retention policies)_
- **Shard ID** _(If no shard ID is specified, the command backs up all shards. Requires a retention policy.)_
- **Start time** _(If no start time is specified, the command backs up data from all time.)_
- **Stop time** _(If no stop time is specified, the command backs up data to now.)_
- ({{< req >}}) **Backup destination directory path**

### Backup examples

- [Back up all databases](#back-up-all-databases)
- [Back up all data from a remote InfluxDB instance](#back-up-all-data-from-a-remote-influxdb-instance)
- [Back up a specific time range](#back-up-a-specific-time-range)
- [Back up data from a specific time to now](#back-up-data-from-a-specific-time-to-now)
- [Back up a specific database](#back-up-a-specific-database)
- [Back up a specific retention policy](#back-up-a-specific-retention-policy)
- [Back up a specific shard](#back-up-a-specific-shard)

#### Back up all databases
```sh
influxd backup -portable /path/to/backup-directory
```

#### Back up all data from a remote InfluxDB instance
```sh
influxd backup -portable \
  -host 203.0.113.0:8088 \
  /path/to/backup-directory
```

#### Back up a specific time range
```sh
influxd backup -portable \
  -start 2022-01-01T00:00:00Z \
  -stop 2022-02-01T00:00:00Z \
  /path/to/backup-directory
```

#### Back up data from a specific time to now
```sh
influxd backup -portable \
  -start 2022-01-01T00:00:00Z \
  /path/to/backup-directory
```

#### Back up a specific database
```sh
influxd backup -portable \
  -db example-db \
  /path/to/backup-directory
```

#### Back up a specific retention policy
```sh
influxd backup -portable \
  -db example-db \
  -rp example-retention-policy \
  /path/to/backup-directory
```

#### Back up a specific shard
{{% note %}}
To view shard IDs, use the [`SHOW SHARDS` InfluxQL statement](/influxdb/v1.8/query_language/spec/#show-shards).
{{% /note %}}

```sh
influxd backup -portable \
  -rp example-retention-policy \
  -shard 123 \
  /path/to/backup-directory
```

{{% /tab-content %}}
{{% tab-content %}}

- **InfluxDB bind address** _(Only required if creating a backup from a remote InfluxDB host)_
- ({{< req >}}) **Database name**
- **Retention policy name**
  _(If no retention policy is specified, the command backs up all retention policies)_
- **Shard ID** _(If no shard ID is specified, the command backs up all shards. Requires a retention policy.)_
- **Start time** _(If no start time is specified, the command backs up data from all time.)_
- **Stop time** _(If no stop time is specified, the command backs up data to now.)_
- ({{< req >}}) **Backup destination directory path**

### Legacy backup examples

- [Back up a database](#back-up-a-database)
- [Back up a database from a remote InfluxDB instance](#back-up-a-database-from-a-remote-influxdb-instance)
- [Back up a specific time range](#back-up-a-specific-time-range-legacy)
- [Back up data from a specific time to now](#back-up-data-from-a-specific-time-to-now-legacy)
- [Back up a specific retention policy](#back-up-a-specific-retention-policy-legacy)
- [Back up a specific shard](#back-up-a-specific-shard-legacy)

#### Back up a database
```sh
influxd backup \
  -db example-db \
  /path/to/backup-directory
```

#### Back up a database from a remote InfluxDB instance
```sh
influxd backup \
  -db example-db \
  -host 203.0.113.0:8088 \
  /path/to/backup-directory
```

#### Back up a specific time range {#back-up-a-specific-time-range-legacy}
```sh
influxd backup \
  -db example-db \
  -start 2022-01-01T00:00:00Z \
  -stop 2022-02-01T00:00:00Z \
  /path/to/backup-directory
```

#### Back up data from a specific time to now {#back-up-data-from-a-specific-time-to-now-legacy}
```sh
influxd backup \
  -db example-db \
  -start 2022-01-01T00:00:00Z \
  /path/to/backup-directory
```

#### Back up a specific retention policy {#back-up-a-specific-retention-policy-legacy}
```sh
influxd backup \
  -db example-db \
  -rp example-retention-policy \
  /path/to/backup-directory
```

#### Back up a specific shard {#back-up-a-specific-shard-legacy}
{{% note %}}
To view shard IDs, use the [`SHOW SHARDS` InfluxQL statement](/influxdb/v1.8/query_language/spec/#show-shards).
{{% /note %}}

```sh
influxd backup -portable \
  -db example-db \
  -rp example-retention-policy \
  -shard 123 \
  /path/to/backup-directory
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}


---

## Restore data

Use the [`influxd restore` utility](/influxdb/v1.8/tools/influxd/restore/) to
restore time series data and metadata to InfluxDB from an InfluxDB backup.

{{% note %}}
#### Cannot restore to an existing database
The InfluxDB OSS {{< current-version >}} `restore` utility does **not** support incremental backups.
When restoring data, the `restore` utility performs a full restore.
To preserve existing data, the `restore` utility does not allow restoring data
to a database that already exists.

If the target database already exists, the `restore` utility returns an error
similar to the following:

```
error updating meta: DB metadata not changed. database may already exist
```
{{% /note %}}

Provide the following based on the [backup format](#backup-formats) of the
backup you want to restore from:

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Portable format](#)
[Legacy format](#)
{{% /tabs %}}
{{% tab-content %}}

influxd restore [ -db <db_name> ]
    -portable | -online
    [ -host <host:port> ]
    [ -newdb <newdb_name> ]
    [ -rp <rp_name> ]
    [ -newrp <newrp_name> ]
    [ -shard <shard_ID> ]
    <path-to-backup-files>

- ({{< req >}}) **`-portable` flag**
- **InfluxDB bind address** _(Only required if restore a backup to a remote InfluxDB host)_
- **Database name** _(If no database name is specified, the command restores all databases)_
- **New database name** _(Required when restoring a database that already exists)_
- **Retention policy name**
  _(If no retention policy is specified, the command restores all retention policies)_
- **New retention policy name** _(Required when restoring a retention policy that already exists)_
- **Shard ID** _(If no shard ID is specified, the command backs up all shards. Requires a retention policy.)_
- ({{< req >}}) **Backup directory path**

### Backup examples

- [Restore up all databases](#restore-up-all-databases)
- [Restore all data to a remote InfluxDB instance](#restore-all-data-to-a-remote-influxdb-instance)
- [Restore a specific database](#restore-a-specific-database)
- [Restore data from a database that already exists](#restore-data-from-a-database-that-already-exists)
- [Restore a specific retention policy](#restore-a-specific-retention-policy)
- [Restore data from a retention policy that already exists](#restore-data-from-a-retention-policy-that-already-exists)
- [Restore a specific shard](#restore-a-specific-shard)

#### Restore up all databases
```sh
influxd restore -portable /path/to/backup-directory
```

#### Restore all data to a remote InfluxDB instance
```sh
influxd restore -portable \
  -host 203.0.113.0:8088 \
  /path/to/backup-directory
```

#### Restore a specific database
```sh
influxd restore -portable \
  -db example-db \
  /path/to/backup-directory
```

#### Restore data from a database that already exists
```sh
influxd restore -portable \
  -db example-db \
  -newdb example-new-db \
  /path/to/backup-directory
```

#### Restore a specific retention policy
```sh
influxd backup -portable \
  -db example-db \
  -rp example-retention-policy \
  /path/to/backup-directory
```

#### Restore data from a retention policy that already exists
```sh
influxd restore -portable \
  -db example-db \
  -rp example-rp \
  -newrp example-new-rp \
  /path/to/backup-directory
```

#### Restore a specific shard
To restore a specific shard, you must specify a database and retention policy.
To view shard IDs, use the [`SHOW SHARDS` InfluxQL statement](/influxdb/v1.8/query_language/spec/#show-shards).

```sh
influxd backup -portable \
  -db example-db
  -rp example-rp \
  -shard 123 \
  /path/to/backup-directory
```

{{% /tab-content %}}
{{% tab-content %}}

- **InfluxDB bind address** _(Only required if creating a backup from a remote InfluxDB host)_
- ({{< req >}}) **Database name**
- **Retention policy name**
  _(If no retention policy is specified, the command backs up all retention policies)_
- **Shard ID** _(If no shard ID is specified, the command backs up all shards. Requires a retention policy.)_
- **Start time** _(If no start time is specified, the command backs up data from all time.)_
- **Stop time** _(If no stop time is specified, the command backs up data to now.)_
- ({{< req >}}) **Backup destination directory path**

### Legacy backup examples

- [Back up a database](#back-up-a-database)
- [Back up a database from a remote InfluxDB instance](#back-up-a-database-from-a-remote-influxdb-instance)
- [Back up a specific time range](#back-up-a-specific-time-range-legacy)
- [Back up data from a specific time to now](#back-up-data-from-a-specific-time-to-now-legacy)
- [Back up a specific retention policy](#back-up-a-specific-retention-policy-legacy)
- [Back up a specific shard](#back-up-a-specific-shard-legacy)

#### Back up a database
```sh
influxd backup \
  -db example-db \
  /path/to/backup-directory
```

#### Back up a database from a remote InfluxDB instance
```sh
influxd backup \
  -db example-db \
  -host 203.0.113.0:8088 \
  /path/to/backup-directory
```

#### Back up a specific time range {#back-up-a-specific-time-range-legacy}
```sh
influxd backup \
  -db example-db \
  -start 2022-01-01T00:00:00Z \
  -stop 2022-02-01T00:00:00Z \
  /path/to/backup-directory
```

#### Back up data from a specific time to now {#back-up-data-from-a-specific-time-to-now-legacy}
```sh
influxd backup \
  -db example-db \
  -start 2022-01-01T00:00:00Z \
  /path/to/backup-directory
```

#### Back up a specific retention policy {#back-up-a-specific-retention-policy-legacy}
```sh
influxd backup \
  -db example-db \
  -rp example-retention-policy \
  /path/to/backup-directory
```

#### Back up a specific shard {#back-up-a-specific-shard-legacy}
{{% note %}}
To view shard IDs, use the [`SHOW SHARDS` InfluxQL statement](/influxdb/v1.8/query_language/spec/#show-shards).
{{% /note %}}

```sh
influxd backup -portable \
  -db example-db \
  -rp example-retention-policy \
  -shard 123 \
  /path/to/backup-directory
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

---


### `restore`

An online `restore` process is initiated by using the `restore` command with either the `-portable` argument (indicating the new Enterprise-compatible backup format) or `-online` flag (indicating the legacy backup format).

```
influxd restore [ -db <db_name> ]
    -portable | -online
    [ -host <host:port> ]
    [ -newdb <newdb_name> ]
    [ -rp <rp_name> ]
    [ -newrp <newrp_name> ]
    [ -shard <shard_ID> ]
    <path-to-backup-files>
```
{{% warn %}}
Restoring backups that specified time periods (using `-start` and `-end`)

Backups that specified time intervals using the `-start` or `-end` arguments are performed on blocks of data and not on a point-by-point basis. Since most blocks are highly compacted, extracting each block to inspect each point creates both a computational and disk-space burden on the running system.
Each data block is annotated with starting and ending timestamps for the time interval included in the block. When you specify `-start` or `-end` timestamps, all of the specified data is backed up, but other data points that are in the same blocks will also be backed up.

**Expected behavior**

- When restoring data, you are likely to see data that is outside of the specified time periods.
- If  duplicate data points are included in the backup files, the points will be written again, overwriting any existing data.
{{% /warn %}}

#### Arguments

Optional arguments are enclosed in brackets.

- `-portable`: Use the new Enterprise-compatible backup format for InfluxDB OSS. Recommended instead of `-online`.  A backup created on InfluxDB Enterprise can be restored to an InfluxDB OSS instance.

- `-online`: Use the legacy backup format. Only use if the newer `-portable` option cannot be used.

- `[ -host <host:port> ]`: Host and port for InfluxDB OSS instance . Default value is `'127.0.0.1:8088'`. Required for remote connections. Example: `-host 127.0.0.1:8088`

- `[ -db <db_name> | -database <db_name> ]`: Name of the database to be restored from the backup. If not specified, all databases will be restored.

- `[ -newdb <newdb_name> ]`: Name of the database into which the archived data will be imported on the target system. If not specified, then the value for `-db` is used.  The new database name must be unique to the target system.

- `[ -rp <rp_name> ]`: Name of the retention policy from the backup that will be restored.  Requires that `-db` is set. If not specified, all retention policies will be used.

- `[ -newrp <newrp_name> ]`: Name of the retention policy to be created on the target system. Requires that `-rp` is set. If not specified, then the `-rp` value is used.

- `[ -shard <shard_ID> ]`: Shard ID of the shard to be restored. If specified, then `-db` and `-rp` are required.

> **Note:** If you have automated backups based on the legacy format, consider using the new online feature for your legacy backups.  The new backup utility lets you restore a single database to a live (online) instance, while leaving all existing data on the server in place.  The [offline restore method (described below)](#restore-legacy) may result in data loss, since it clears all existing databases on the server.

#### Restore examples

**To restore all databases found within the backup directory:**

```
influxd restore -portable path-to-backup
```

**To restore only the `telegraf` database (telegraf database must not exist):**

```
influxd restore -portable -db telegraf path-to-backup
```

**To restore data to a database that already exists:**

You cannot restore directly into a database that already exists. If you attempt to run the `restore` command into an existing database, you will get a message like this:

```
influxd restore -portable -db existingdb path-to-backup

2018/08/30 13:42:46 error updating meta: DB metadata not changed. database may already exist
restore: DB metadata not changed. database may already exist
```

1. Restore the existing database backup to a temporary database.

    ```
    influxd restore -portable -db telegraf -newdb telegraf_bak path-to-backup
    ```
2. Sideload the data (using a `SELECT ... INTO` statement) into the existing target database and drop the temporary database.

    ```
    > USE telegraf_bak
    > SELECT * INTO telegraf..:MEASUREMENT FROM /.*/ GROUP BY *
    > DROP DATABASE telegraf_bak
    ```

**To restore to a retention policy that already exists:**

1. Restore the retention policy to a temporary database.

    ```
    influxd restore -portable -db telegraf -newdb telegraf_bak -rp autogen -newrp autogen_bak path-to-backup
    ```
2. Sideload into the target database and drop the temporary database.

    ```
    > USE telegraf_bak
    > SELECT * INTO telegraf.autogen.:MEASUREMENT FROM /telegraf_bak.autogen_bak.*/ GROUP BY *
    > DROP DATABASE telegraf_bak
    ```

### Backward compatible offline backup and restore (legacy format)

> ***Note:*** The backward compatible backup and restore for InfluxDB OSS documented below are deprecated. InfluxData recommends using the newer Enterprise-compatible backup and restore utilities with your InfluxDB OSS servers.

InfluxDB OSS has the ability to snapshot an instance at a point-in-time and restore it.
All backups are full backups; incremental backups are not supported.
Two types of data can be backed up, the metastore and the metrics themselves.
The [metastore](/influxdb/v1.8/concepts/glossary/#metastore) is backed up in its entirety.
The metrics are backed up on a per-database basis in an operation separate from the metastore backup.

#### Backup (legacy)

Each database must be backed up individually.

To backup a database, add the `-database` flag:

```bash
influxd backup -database <mydatabase> <path-to-backup>
```

Where `<mydatabase>` is the name of the database you would like to
backup, and `<path-to-backup>` is where the backup data should be
stored.

Optional flags also include:

- `-retention <retention-policy-name>`
  - This flag can be used to backup a specific retention policy. For more information on retention policies, see
  [Retention policy management](/influxdb/v1.8/query_language/manage-database/#retention-policy-management). If unspecified, all retention policies will be backed up.

- `-shard <shard ID>` - This flag can be used to backup a specific
  shard ID. To see which shards are available, you can run the command
  `SHOW SHARDS` using the InfluxDB query language. If not specified,
  all shards will be backed up.

- `-since <date>` - This flag can be used to create a backup _since_ a
  specific date, where the date must be in
  [RFC3339](https://www.ietf.org/rfc/rfc3339.txt) format (for example,
  `2015-12-24T08:12:23Z`). This flag is important if you would like to
  take incremental backups of your database. If not specified, all
  timeranges within the database will be backed up.

> **Note:** Metastore backups are also included in per-database backups

As a real-world example, you can take a backup of the `autogen`
retention policy for the `telegraf` database since midnight UTC on
February 1st, 2016 by using the command:

```
$ influxd backup -database telegraf -retention autogen -since 2016-02-01T00:00:00Z /tmp/backup
2016/02/01 18:02:36 backing up rp=default since 2016-02-01 00:00:00 +0000 UTC
2016/02/01 18:02:36 backing up metastore to /tmp/backup/meta.01
2016/02/01 18:02:36 backing up db=telegraf rp=default shard=2 to /tmp/backup/telegraf.default.00002.01 since 2016-02-01 00:00:00 +0000 UTC
2016/02/01 18:02:36 backup complete
```

Which will send the resulting backup to `/tmp/backup`, where it can
then be compressed and sent to long-term storage.

#### Remote backups (legacy)

The legacy backup mode also supports live, remote backup functionality.
Follow the directions in [Configuring remote connections](#configuring-remote-connections) above to configure this feature.

## Restore (legacy)

{{% warn %}} This offline restore method described here may result in data loss -- it clears all existing databases on the server. Consider using the `-online` flag with the newer [`restore` method (described above)](#restore) to import legacy data without any data loss.
{{% /warn %}}

To restore a backup, you will need to use the `influxd restore` command.

> **Note:** Restoring from backup is only supported while the InfluxDB daemon is stopped.

To restore from a backup you will need to specify the type of backup,
the path to where the backup should be restored, and the path to the backup.
The command:

```
influxd restore [ -metadir | -datadir ] <path-to-meta-or-data-directory> <path-to-backup>
```

The required flags for restoring a backup are:

- `-metadir <path-to-meta-directory>` - This is the path to the meta
  directory where you would like the metastore backup recovered
  to. For packaged installations, this should be specified as
  `/var/lib/influxdb/meta`.

- `-datadir <path-to-data-directory>` - This is the path to the data
  directory where you would like the database backup recovered to. For
  packaged installations, this should be specified as
  `/var/lib/influxdb/data`.

The optional flags for restoring a backup are:

- `-database <database>` - This is the database that you would like to
  restore the data to. This option is required if no `-metadir` option
  is provided.

- `-retention <retention policy>` - This is the target retention policy
  for the stored data to be restored to.

- `-shard <shard id>` - This is the shard data that should be
  restored. If specified, `-database` and `-retention` must also be
  set.

Following the backup example above, the backup can be restored in two
steps.

1. The metastore needs to be restored so that InfluxDB
knows which databases exist:

```
$ influxd restore -metadir /var/lib/influxdb/meta /tmp/backup
Using metastore snapshot: /tmp/backup/meta.00
```

2. Once the metastore has been restored, we can now recover the backed up
data. In the real-world example above, we backed up the `telegraf`
database to `/tmp/backup`, so let's restore that same dataset. To
restore the `telegraf` database:

```
$ influxd restore -database telegraf -datadir /var/lib/influxdb/data /tmp/backup
Restoring from backup /tmp/backup/telegraf.*
unpacking /var/lib/influxdb/data/telegraf/default/2/000000004-000000003.tsm
unpacking /var/lib/influxdb/data/telegraf/default/2/000000005-000000001.tsm
```

> **Note:** Once the backed up data has been recovered, the permissions on the shards may no longer be accurate. To ensure the file permissions are correct, please run this command: `$ sudo chown -R influxdb:influxdb /var/lib/influxdb`

Once the data and metastore are recovered, start the database:

```bash
$ service influxdb start
```

As a quick check, you can verify that the database is known to the metastore
by running a `SHOW DATABASES` command:

```
influx -execute 'show databases'
name: databases
---------------
name
_internal
telegraf
```

The database has now been successfully restored!

## Portable backup structure
creates and stores the following in a specified directory (filenames include UTC timestamp when created):

 - copy of metastore **on disk**: 20060102T150405Z.meta (includes usernames and passwords)
 - copy of shard data **on disk**: 20060102T150405Z.<shard_id>.tar.gz
 - manifest (JSON file) describes collected backup data: 20060102T150405Z.manifest