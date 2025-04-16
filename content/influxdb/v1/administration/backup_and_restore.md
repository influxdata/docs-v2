---
title: Back up and restore data
seotitle: Back up and restore data in InfluxDB v1.11
description: >
  To prevent unexpected data loss, back up and restore InfluxDB OSS instances.
aliases:
  - /influxdb/v1/administration/backup-and-restore/
menu:
  influxdb_v1:
    name: Back up and restore
    weight: 60
    parent: Administration
alt_links:
  v2: /influxdb/v2/backup-restore/
---

Use the InfluxDB OSS {{< current-version >}} `backup`, `restore`, `export`, and `import` utilities
to prevent unexpected data loss and preserve the ability to restore data if it
ever is lost.

You can use these tools in your back up and restore procedures to:

- Provide disaster recovery due to unexpected events
- Migrate data to new environments or servers
- Restore instances to a consistent state
- Export and import data for debugging

Depending on the volume of data to be protected and your application requirements, InfluxDB OSS {{< current-version >}} offers two methods, described below, for managing backups and restoring data:

- [Backup and restore utilities](#backup-and-restore-utilities): Use for most applications
- [Exporting and importing data](#exporting-and-importing-data): Use for very large datasets and to debug data

> [!Note]
> #### Back up and restore between InfluxDB Enterprise and OSS 
>
> Use the `backup` and `restore` utilities in
> [InfluxDB Enterprise](/enterprise_influxdb/v1/administration/backup-and-restore/) and
> [InfluxDB OSS (version 1.5 and later)](#backup-and-restore-utilities/) to:
>
> - Restore InfluxDB Enterprise backup files to InfluxDB OSS instances.
> - Back up InfluxDB OSS data that can be restored in InfluxDB Enterprise clusters.

## Backup and restore utilities

Use InfluxDB OSS {{< current-version >}} `backup` and `restore` utilities to:

- Back up and restore multiple databases at a time.
- Back up specific time ranges.
- Create backup files compatible with InfluxDB Enterprise.
  
Use the `backup` and `restore` utilities to back up and restore data for `influxd`
instances of InfluxDB OSS version 1.4 and earlier, version 1.5 and later, and [InfluxDB Enterprise](/enterprise_influxdb/v1/).


- [Backup formats](#backup-formats)
  - [Specify your backup format](#specify-your-backup-format)
  - [Determine your backup’s format](#determine-your-backups-format)
- [Backup and restore requirements](#backup-and-restore-requirements)
- [Important notes](#important-notes)
  - [Time-based backups](#time-based-backups)
- [Back up data](#back-up-data)
  - [Backup examples (portable format)](?t=Portable+format#backup-examples)
  - [Backup examples (legacy format)](?t=Legacy+format#legacy-backup-examples)
- [Restore data](#restore-data)
  - [Restore examples (portable format)](#restore-examples)
  - [Online restore examples (legacy format)](?t=Legacy+format#online-legacy-restore)
  - [Offline restore examples (legacy format)](?t=Legacy+format#offline-legacy-restore)
  - [Restore data to an existing database](#restore-data-to-an-existing-database)
- [Configure backup and restore services](#configure-backup-and-restore-services)

## Backup formats
The InfluxDB `backup` utility outputs data backups in one of two formats: **legacy** or **portable**.
Each format provides different functionality and support for other versions of InfluxDB.
The major difference between the formats is that the legacy format can only
be used with InfluxDB OSS 1.x. The portable format is "portable" between
InfluxDB 1.5–{{< current-version >}} and [InfluxDB Enterprise](/enterprise_influxdb/v1/).

{{% note %}}
#### Use the portable format for InfluxDB 1.5 and later

Use the portable format unless you need to be able to restore
the backup to InfluxDB 1.4 or earlier.
{{% /note %}}

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

### Determine your backup's format
Use the directory structure of the backup directory to determine the format of the backup.

#### Portable format directory structure

{{% filesystem-diagram %}}
- backup-directory/
  - 20060102T150405Z.meta
    <span style="opacity:.5">(InfluxDB metadata)</span>
  - 20060102T150405Z.s00.tar.gz
    <span style="opacity:.5">(InfluxDB time series data _(shard)_)</span>
  - 20060102T150405Z.s01.tar.gz
    <span style="opacity:.5">(InfluxDB time series data _(shard)_)</span>
  - 20060102T150405Z.manifest
    <span style="opacity:.5">(Backup manifest)</span>
{{% /filesystem-diagram %}}

#### Legacy format directory structure

{{% filesystem-diagram %}}
- backup-directory/
  - meta.00
    <span style="opacity:.5">(InfluxDB metadata)</span>
  - \<db-name\>.\<rp-name\>.00000.00
    <span style="opacity:.5">(InfluxDB time series data)</span>
  - \<db-name\>.\<rp-name\>.00001.00
    <span style="opacity:.5">(InfluxDB time series data)</span>
{{% /filesystem-diagram %}}

## Backup and restore requirements

- The InfluxDB service (`influxd`) must be running _except when performing an
  [offline legacy restore](?t=Legacy+format#offline-legacy-restore)_.
- Both the source and target InfluxDB instances must be the same InfluxDB version
  or differ by only a minor version.
  For example, you can back up data from InfluxDB 1.7 and restore it to an InfluxDB 1.8 instance.
  The only exception is restoring data from InfluxDB 1.8 into 1.11.

## Important notes

### Time-based backups
When executing a backup with `-start` or `-end` flags, InfluxDB backs up
shards, not individual points.
Each shard is annotated with starting and ending timestamps for the time
interval included in the shard.
If a shard contains any points in the specified time range, the entire shard
is included in the backup.

Since most shards are highly compacted, extracting shards to inspect each point
would be highly inefficient and add a significant burden to the underlying system.

When restoring data from a time-based backup, you are likely to see data outside
of the backed up time range.

---

## Back up data

Use the [`influxd backup` utility](/influxdb/v1/tools/influxd/backup/) to create
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

- `-portable`: ({{< req >}}) Specifies the portable backup format
- `-host`: InfluxDB bind address _(Only required if creating a backup from a remote InfluxDB host)_
- `-db`: Database name _(If no database name is specified, the command backs up all databases)_
- `-rp`: Retention policy name
  _(If no retention policy is specified, the command backs up all retention policies)_
- `-shard`: Shard ID _(If no shard ID is specified, the command backs up all shards. Requires a retention policy.)_
- `-start`: Start time _(If no start time is specified, the command backs up data from all time.)_
- `-stop`: Stop time _(If no stop time is specified, the command backs up data to now.)_
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

_For important information about how time-based backups work, see [Time-based backups](#time-based-backups)._

#### Back up data from a specific time to now
```sh
influxd backup -portable \
  -start 2022-01-01T00:00:00Z \
  /path/to/backup-directory
```

_For important information about how time-based backups work, see [Time-based backups](#time-based-backups)._

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
To view shard IDs, use the [`SHOW SHARDS` InfluxQL statement](/influxdb/v1/query_language/spec/#show-shards).
{{% /note %}}

```sh
influxd backup -portable \
  -rp example-retention-policy \
  -shard 123 \
  /path/to/backup-directory
```

{{% /tab-content %}}
{{% tab-content %}}

- `-host`: InfluxDB bind address _(Only required if creating a backup from a remote InfluxDB host)_
- `-db`: ({{< req >}}) Database name
- `-rp`: Retention policy name
  _(If no retention policy is specified, the command backs up all retention policies)_
- `-shard`: Shard ID _(If no shard ID is specified, the command backs up all shards. Requires a retention policy.)_
- `-start`: Start time _(If no start time is specified, the command backs up data from all time.)_
- `-stop`: Stop time _(If no stop time is specified, the command backs up data to now.)_
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

_For important information about how time-based backups work, see [Time-based backups](#time-based-backups)._

#### Back up data from a specific time to now {#back-up-data-from-a-specific-time-to-now-legacy}
```sh
influxd backup \
  -db example-db \
  -start 2022-01-01T00:00:00Z \
  /path/to/backup-directory
```

_For important information about how time-based backups work, see [Time-based backups](#time-based-backups)._

#### Back up a specific retention policy {#back-up-a-specific-retention-policy-legacy}
```sh
influxd backup \
  -db example-db \
  -rp example-retention-policy \
  /path/to/backup-directory
```

#### Back up a specific shard {#back-up-a-specific-shard-legacy}
{{% note %}}
To view shard IDs, use the [`SHOW SHARDS` InfluxQL statement](/influxdb/v1/query_language/spec/#show-shards).
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

Use the [`influxd restore` utility](/influxdb/v1/tools/influxd/restore/) to
restore time series data and metadata to InfluxDB from an InfluxDB backup.

{{% note %}}
#### Cannot restore to an existing database
The InfluxDB OSS {{< current-version >}} `restore` utility does **not** support incremental backups.
When restoring data to a running InfluxDB instance, the `restore` utility performs a full restore.
To preserve existing data, the `restore` utility does not allow restoring data
to a database that already exists.[{{< req " \*" >}}](#note-offline-restore)

If the target database already exists, the `restore` utility returns an error
similar to the following:

```
error updating meta: DB metadata not changed. database may already exist
```

There is a workaround for restoring data to an existing database.
For more information, see [Restore data to an existing database](#restore-data-to-an-existing-database).

<span id="note-offline-restore" style="display:inline-block;margin-top:-2rem;padding-top:2rem"></span>
{{< req "\*" >}} _Offline legacy restores can be used to restore data to an
existing database, but overwrite all data in the database._
{{% /note %}}

Requirements and commands necessary to restore a backup depend on the
[backup format](#backup-formats):

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[Portable format](#)
[Legacy format](#)
{{% /tabs %}}
{{% tab-content %}}

- `-portable`: ({{< req >}}) Specifies the portable backup format
- `-host`: InfluxDB bind address _(Only required if restore a backup to a remote InfluxDB host)_
- `-db`: Database name _(If no database name is specified, the command restores all databases)_
- `-newdb`: New database name _(Required when restoring a database that already exists)_
- `-rp`: Retention policy name
  _(If no retention policy is specified, the command restores all retention policies)_
- `-newrp`: New retention policy name _(Required when restoring a retention policy that already exists)_
- `-shard`: Shard ID _(If no shard ID is specified, the command backs up all shards. Requires a retention policy.)_
- ({{< req >}}) **Backup directory path**

### Restore examples

- [Restore all databases](#restore-all-databases)
- [Restore all data to a remote InfluxDB instance](#restore-all-data-to-a-remote-influxdb-instance)
- [Restore a specific database](#restore-a-specific-database)
- [Restore data from a database that already exists](#restore-data-from-a-database-that-already-exists)
- [Restore a specific retention policy](#restore-a-specific-retention-policy)
- [Restore data from a retention policy that already exists](#restore-data-from-a-retention-policy-that-already-exists)
- [Restore a specific shard](#restore-a-specific-shard)

#### Restore all databases
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

#### Restore data to a database that already exists
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

#### Restore data to a retention policy that already exists
```sh
influxd restore -portable \
  -db example-db \
  -rp example-rp \
  -newrp example-new-rp \
  /path/to/backup-directory
```

#### Restore a specific shard
To restore a specific shard, you must specify a database and retention policy.
To view shard IDs, use the [`SHOW SHARDS` InfluxQL statement](/influxdb/v1/query_language/spec/#show-shards).

```sh
influxd backup -portable \
  -db example-db \
  -rp example-rp \
  -shard 123 \
  /path/to/backup-directory
```

{{% /tab-content %}}
{{% tab-content %}}

Legacy backups can be restored to a running (online) or stopped (offline) InfluxDB instance.

- [Online legacy restore](#online-legacy-restore)
- [Offline legacy restore](#offline-legacy-restore)

### Online legacy restore

- `-online`: ({{< req >}}) Specifies that the target InfluxDB instance is running
- `-host`: InfluxDB bind address _(Only required if restoring a backup from a remote InfluxDB host)_
- `-db`: ({{< req >}}) Database name
- `-newdb`: New database name _(Required when restoring a database that already exists)_
- `-rp`: Retention policy name
  _(If no retention policy is specified, the command backs up all retention policies)_
- `-newrp`: New retention policy name _(Required when restoring a retention policy that already exists)_
- `-shard`: Shard ID _(If no shard ID is specified, the command restores all shards. Requires a retention policy.)_
- ({{< req >}}) **Backup destination directory path**

#### Online legacy restore examples

- [Restore a database](#restore-a-database)
- [Restore a database to a remote InfluxDB instance](#restore-a-database-to-a-remote-influxdb-instance)
- [Restore data to a database that already exists](#restore-data-to-a-database-that-already-exists-legacy)
- [Restore a specific retention policy](#restore-a-specific-retention-policy-legacy)
- [Restore data to a retention policy that already exists](#restore-data-to-a-retention-policy-that-already-exists-legacy)
- [Restore a specific shard](#restore-a-specific-shard-legacy)

##### Restore a database
```sh
influxd restore -online \
  -db example-db \
  /path/to/backup-directory
```

##### Restore a database to a remote InfluxDB instance
```sh
influxd restore -online \
  -db example-db \
  -host 203.0.113.0:8088 \
  /path/to/backup-directory
```

##### Restore data to a database that already exists {#restore-data-to-a-database-that-already-exists-legacy}
```sh
influxd restore -online \
  -db example-db \
  -newdb example-new-db \
  /path/to/backup-directory
```

##### Restore a specific retention policy {#restore-a-specific-retention-policy-legacy}
```sh
influxd backup -online \
  -db example-db \
  -rp example-retention-policy \
  /path/to/backup-directory
```

##### Restore data to a retention policy that already exists {#restore-data-to-a-retention-policy-that-already-exists-legacy}
```sh
influxd restore -online \
  -db example-db \
  -rp example-rp \
  -newrp example-new-rp \
  /path/to/backup-directory
```

##### Restore a specific shard {#restore-a-specific-shard-legacy}
To restore a specific shard, you must specify a database and retention policy.
To view shard IDs, use the [`SHOW SHARDS` InfluxQL statement](/influxdb/v1/query_language/spec/#show-shards).

```sh
influxd backup -online \
  -db example-db \
  -rp example-rp \
  -shard 123 \
  /path/to/backup-directory
```

### Offline legacy restore

{{% warn %}}
#### Offline restores overwrite data
Offline restores are destructive and will overwrite all data in the destination database.

#### Must be done on the same machine as InfluxDB 
Offline restores must be done from the machine where InfluxDB is running.
They cannot be done remotely unless you console into the machine InfluxDB is
running on and execute the restore process there. 
{{% /warn %}}

- `-db`: ({{< req >}}) Database name
- `-newdb`: New database name _(Required when restoring a database that already exists)_
- `-rp`: Retention policy name
  _(If no retention policy is specified, the command backs up all retention policies)_
- `-newrp`: New retention policy name _(Required when restoring a retention policy that already exists)_
- `-datadir`: ({{< req >}}) Location of destination data directory on disk _(See [InfluxDB file system layout](/influxdb/v1/concepts/file-system-layout/))_
- `-metadir`: ({{< req >}}) Location of destination meta directory on disk _(See [InfluxDB file system layout](/influxdb/v1/concepts/file-system-layout/))_
- `-shard`: Shard ID _(If no shard ID is specified, the command backs up all shards. Requires a retention policy.)_
- ({{< req >}}) **Backup destination directory path**


#### Offline legacy restore examples

- [Restore a database](#restore-a-database-offline)
- [Restore a specific retention policy](#restore-a-specific-retention-policy-offline)
- [Restore a specific shard](#restore-a-specific-shard-offline)

##### Restore a database {#restore-a-database-offline}
```sh
influxd restore \
  -db example-db \
  -datadir /path/to/data-directory \
  -metadir /path/to/meta-directory \
  /path/to/backup-directory
```

##### Restore a specific retention policy {#restore-a-specific-retention-policy-offline}
```sh
influxd backup \
  -db example-db \
  -rp example-retention-policy \
  -datadir /path/to/data-directory \
  -metadir /path/to/meta-directory \
  /path/to/backup-directory
```

##### Restore a specific shard {#restore-a-specific-shard-offline}
To restore a specific shard, you must specify a database and retention policy.
To view shard IDs, use the [`SHOW SHARDS` InfluxQL statement](/influxdb/v1/query_language/spec/#show-shards).

```sh
influxd backup \
  -db example-db \
  -rp example-rp \
  -shard 123 \
  -datadir /path/to/data-directory \
  -metadir /path/to/meta-directory \
  /path/to/backup-directory
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}


### Restore data to an existing database
While backups can't be restored directly to an existing database
(except for [offline legacy restores](?t=Legacy+format#offline-legacy-restore)),
you can do the following to restore data to an existing database:

1.  Restore a backup to a temporary database.

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Portable format](#)
[Legacy format](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influxd restore -portable \
  -db example-db \
  -newdb example-tmp-db \
  /path/to/backup-directory/
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influxd restore \
  -db example-db \
  -newdb example-tmp-db \
  /path/to/backup-directory/
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

2.  Use InfluxQL or Flux to query data from the temporary database and write it
    back to the existing database.

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[InfluxQL](#)
[Flux](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
-- Repeat for each retention policy in the temporary database
SELECT *
INTO "example-db".autogen.:MEASUREMENT
FROM "example-tmp-db".autogen./.*/ GROUP BY *
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
// Repeat for each retention policy in the temporary database
from(bucket: "example-tmp-db/autogen")
    |> range(start: 0)
    |> to(bucket: "example-db/autogen")
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    InfluxDB handles duplicate points added by this query as it normally does.
    For more information, see
    [How does InfluxDB handle duplicate points?](/influxdb/v1/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-duplicate-points)

3.  Use InfluxQL to delete the temporary database.

    ```sql
    DROP DATABASE "example-tmp-db"
    ```

---

## Configure backup and restore services

InfluxDB OSS {{< current-version >}}  `backup` and `restore` utilities execute
over a TCP connection.
The default IP and port used for backup and restore remote procedure calls (RPCs)
are `127.0.0.1:8088`.

**To customize the TCP IP and port the backup and restore services use**,
uncomment and update the
[`bind-address` configuration setting](/influxdb/v1/administration/config#bind-address) 
at the root level of your InfluxDB configuration file (`influxdb.conf`).

```toml
# Bind address to use for the RPC service for backup and restore.
bind-address = "127.0.0.1:8088"
```

## Exporting and importing data

For most applications, the [backup and restore utilities](#backup-and-restore-utilities) provide the tools you need for your backup and restore strategy.
However, in some cases, the standard backup and restore utilities might not adequately handle the volumes of data in your application.  

As an alternative to the standard backup and restore utilities, use the InfluxDB `influx_inspect export` and `influx -import` commands to create backup and restore procedures for your disaster recovery and backup strategy. These commands can be executed manually or included in shell scripts that run the export and import operations at scheduled intervals.
You can use the commands to export and import data between an
InfluxDB OSS {{< current-version >}} instance and an [InfluxDB Enterprise](/enterprise_influxdb/v1/) cluster.

- [Exporting data](#exporting-data)
- [Importing data](#importing-data)
- [Example: export and import for disaster recovery](#example-export-and-import-for-disaster-recovery)

### Exporting data

Use the [`influx_inspect export` command](/influxdb/v1/tools/influx_inspect#export) to export data in line protocol format from your InfluxDB OSS {{< current-version >}} instance.
Options include the following:

- `-database`: Export all or specific databases
- `-start` and `-end`: Filter with starting and ending timestamps
- `-compress`: Use GNU zip (gzip) compression for smaller files and faster exports

The following example shows how to export data filtered to one day and compressed
for optimal speed and file size:

```bash
influx_inspect export \
  -database DATABASE_NAME \
  -compress \
  -start 2019-05-19T00:00:00.000Z \
  -end 2019-05-19T23:59:59.999Z
```

The exported file contains the following:

```sh
# DDL
CREATE DATABASE <DATABASE_NAME> WITH NAME <RETENTION_POLICY>
# DML
# CONTEXT-DATABASE:<DATABASE_NAME>
# CONTEXT-RETENTION-POLICY:<RETENTION_POLICY>

<LINE_PROTOCOL_DATA>
```

- `DDL`: an InfluxQL `CREATE` statement to create the target database when [importing the data](#importing-data)
- `DML`: Context metadata that specifies the target database and retention policy
  for [importing the data](#importing-data)
- the line protocol data

For details on optional settings and usage, see [`influx_inspect export` command](/influxdb/v1/tools/influx_inspect#export).

### Importing data

To import line protocol data from a file, use the [`influx -import` CLI command](/influxdb/v1/tools/influx-cli/use-influx-cli/#influx-arguments).

In your import file, include the following sections:

- _Optional_: **DDL (Data Definition Language)**: Contains the [InfluxQL commands](/influxdb/v1/query_language/manage-database/) for creating the relevant [database](/influxdb/v1/concepts/glossary/#database) and managing the [retention policy](/influxdb/v1/concepts/glossary/#retention-policy-rp).
If your database and retention policy already exist, your file can skip this section.
- **DML (Data Manipulation Language)**: Context metadata that specifies the database and (if desired) retention policy for the import and contains the data in [line protocol](/influxdb/v1/concepts/glossary/#influxdb-line-protocol).

In the following example, the compressed data file (in GNU zip format) is imported into the database
specified in the file's `DML` metadata.

```bash
influx -import -path -compressed
```

For details on using the `influx -import` command, see [Import data from a file](/influxdb/v1/tools/influx-cli/use-influx-cli/#import-data-from-a-file).

### Example: export and import for disaster recovery

For an example of using the exporting and importing data approach for disaster recovery, see the presentation from Influxdays 2019 on ["Architecting for Disaster Recovery."](https://www.youtube.com/watch?v=LyQDhSdnm4A). In this presentation, Capital One discusses the following:

- Exporting data every 15 minutes from an active InfluxDB Enterprise cluster to an AWS S3 bucket.
- Replicating the export file in the S3 bucket using the AWS S3 copy command.
- Importing data every 15 minutes from the AWS S3 bucket to an InfluxDB Enterprise cluster available for disaster recovery.
- Advantages of the export-import approach over the standard backup and restore utilities for large volumes of data.
- Managing users and scheduled exports and imports with a custom administration tool.
