---
title: Influx Inspect disk utility
description: >
  Use the `influx_inspect` commands to manage InfluxDB disks and shards.
menu:
  enterprise_influxdb_v1:
    weight: 50
    parent: Tools
---

Influx Inspect is an InfluxDB disk utility that can be used to:

- View detailed information about disk shards.
- Export data from a shard to [InfluxDB line protocol](/enterprise_influxdb/v1/concepts/glossary/#influxdb-line-protocol)
  that can be inserted back into the database.
- Convert TSM index shards to TSI index shards.

## `influx_inspect` utility

### Syntax

```
influx_inspect [ [ command ] [ options ] ]
```

`-help` is the default command and prints syntax and usage information for the tool.

### `influx_inspect` commands

The `influx_inspect` commands are summarized here, with links to detailed information on each of the commands.

- [`buildtsi`](#buildtsi): Converts in-memory (TSM-based) shards to TSI.
- [`check-schema`](#check-schema): Checks for type conflicts between shards.
- [`deletetsm`](#deletetsm): Bulk deletes a measurement from a raw TSM file.
- [`dumptsi`](#dumptsi): Dumps low-level details about TSI files.
- [`dumptsm`](#dumptsm): Dumps low-level details about TSM files.
- [`dumptsmwal`](#dumptsmwal): Dump all data from a WAL file.  
- [`export`](#export): Exports raw data from a shard in InfluxDB line protocol format.
- [`merge-schema`](#merge-schema): Merges a set of schema files from the `check-schema` command.
- [`report`](#report): Displays a shard level report.
- [`report-db`](#report-db): Estimates InfluxDB Cloud (TSM) cardinality for a database.
- [`report-disk`](#report-disk): Reports disk usage by shards and measurements.
- [`reporttsi`](#reporttsi): Reports on cardinality for shards and measurements.
- [`verify`](#verify): Verifies the integrity of TSM files.
- [`verify-seriesfile`](#verify-seriesfile): Verifies the integrity of series files.
- [`verify-tombstone`](#verify-tombstone): Verifies the integrity of tombstones.

### `buildtsi`

Builds TSI (Time Series Index) disk-based shard index files and associated series files.
The index is written to a temporary location until complete and then moved to a permanent location.
If an error occurs, then this operation will fall back to the original in-memory index.

> [!Note]
> #### For offline conversion only
> 
> When TSI is enabled, new shards use the TSI indexes.
> Existing shards continue as TSM-based shards until
> converted offline.

##### Syntax

```
influx_inspect buildtsi -datadir <data_dir> -waldir <wal_dir> [ options ]
```

> [!Note]
> Use the `buildtsi` command with the user account that you are going to run the database as,
> or ensure that the permissions match after running the command.

#### Options

Optional arguments are in brackets.

##### `[ -batch-size ]`

The size of the batches written to the index. Default value is `10000`.

> [!Warning]
> Setting this value can have adverse effects on performance and heap size.

##### `[ -compact-series-file ]`

**Does not rebuild the index.** Compacts the existing series file, including offline series. Iterates series in each segment and rewrites non-tombstoned series in the index to a new .tmp file next to the segment. Once all segments are converted, the temporary files overwrite the original segments.

##### `[ -concurrency ]`

The number of workers to dedicate to shard index building.
Defaults to [`GOMAXPROCS`](/enterprise_influxdb/v1/administration/configure/configuration/#gomaxprocs-environment-variable) value.

##### `[ -database <db_name> ]`

The name of the database.

##### `-datadir <data_dir>`

The path to the [`data` directory](/enterprise_influxdb/v1/concepts/file-system-layout/#data-directory).

Default value is `$HOME/.influxdb/data`.
See the [file system layout](/enterprise_influxdb/v1/concepts/file-system-layout/#file-system-layout)
for InfluxDB on your system.

##### `[ -max-cache-size ]`

The maximum size of the cache before it starts rejecting writes.
This value overrides the configuration setting for
`[data] cache-max-memory-size`.
Default value is `1073741824`.

##### `[ -max-log-file-size ]`

The maximum size of the log file. Default value is `1048576`.

##### `[ -retention <rp_name> ]`

The name of the retention policy.

##### `[ -shard <shard_ID> ]`

The identifier of the shard.

##### `[ -v ]`

Flag to enable output in verbose mode.

##### `-waldir <wal_dir>`

The directory for the [WAL (Write Ahead Log)](/enterprise_influxdb/v1/concepts/file-system-layout/#wal-directory) files.

Default value is `$HOME/.influxdb/wal`.
See the [file system layout](/enterprise_influxdb/v1/concepts/file-system-layout/)
for InfluxDB on your system.

#### Examples

##### Converting all shards on a node

```bash
influx_inspect buildtsi -datadir ~/.influxdb/data -waldir ~/.influxdb/wal
```

##### Converting all shards for a database

```bash
influx_inspect buildtsi -database mydb -datadir ~/.influxdb/data -waldir ~/.influxdb/wal
```

##### Converting a specific shard

```bash
influx_inspect buildtsi -database stress -shard 1 -datadir ~/.influxdb/data -waldir ~/.influxdb/wal
```

### `check-schema`

Check for type conflicts between shards.

#### Syntax

```
influx_inspect check-schema [ options ]
```

#### Options

##### [ `-conflicts-file <string>` ]

The filename where conflicts data should be written. Default is `conflicts.json`.

##### [ `-path <string>` ]

Directory path where `fields.idx` files are located. Default is the current
working directory `.`.

##### [ `-schema-file <string>` ]

The filename where schema data should be written. Default is `schema.json`.

### `deletetsm`

Use `deletetsm -measurement` to delete a measurement in a raw TSM file (from specified shards).
Use `deletetsm -sanitize` to remove all tag and field keys containing non-printable Unicode characters in a raw TSM file (from specified shards).

> [!Warning]
> Use the `deletetsm` command only when your InfluxDB instance is
> offline (`influxd` service is not running).

#### Syntax

````
influx_inspect deletetsm -measurement <measurement_name> [ arguments ] <path>
````

##### `<path>`

Path to the `.tsm` file, located by default in the `data` directory.

When specifying the path, wildcards (`*`) can replace one or more characters.

#### Options

Either the `-measurement` or `-sanitize` flag is required.

##### `-measurement`

The name of the measurement to delete from TSM files.

##### `-sanitize`

Flag to remove all keys containing non-printable Unicode characters from TSM files.

##### `-v`

Optional. Flag to enable verbose logging.

#### Examples

##### Delete a measurement from a single shard

Delete the measurement `h2o_feet` from a single shard.

```
./influx_inspect deletetsm -measurement h2o_feet /influxdb/data/location/autogen/1384/*.tsm
```

##### Delete a measurement from all shards in the database

Delete the measurement `h2o_feet` from all shards in the database.

```
./influx_inspect deletetsm -measurement h2o_feet /influxdb/data/location/autogen/*/*.tsm
```

### `dumptsi`

Dumps low-level details about TSI files, including `.tsl` log files and `.tsi` index files.

#### Syntax

```
influx_inspect dumptsi [ options ] <index_path>
```
If no options are specified, summary statistics are provided for each file.

#### Options

Optional arguments are in brackets.

##### `-series-file <series_path>`

The path to the `_series` directory under the database `data` directory. Required.

##### [ `-series` ]

Dump raw series data.

##### [ `-measurements` ]

Dump raw [measurement](/enterprise_influxdb/v1/concepts/glossary/#measurement) data.

##### [ `-tag-keys` ]

Dump raw [tag keys](/enterprise_influxdb/v1/concepts/glossary/#tag-key).

##### [ `-tag-values` ]

Dump raw [tag values](/enterprise_influxdb/v1/concepts/glossary/#tag-value).

##### [ `-tag-value-series` ]

Dump raw series for each tag value.

##### [ `-measurement-filter <regular_expression>` ]

Filter data by measurement regular expression.

##### [ `-tag-key-filter <regular_expression>` ]

Filter data by tag key regular expression.

##### [ `-tag-value-filter <regular_expression>` ]

Filter data by tag value regular expression.

#### Examples

##### Specifying paths to the `_series` and `index` directories

```bash
influx_inspect dumptsi -series-file /path/to/db/_series /path/to/index
```

##### Specifying paths to the `_series` directory and an `index` file

```bash
influx_inspect dumptsi -series-file /path/to/db/_series /path/to/index/file0
```

##### Specifying paths to the `_series` directory and multiple `index` files

```bash
influx_inspect dumptsi -series-file /path/to/db/_series /path/to/index/file0 /path/to/index/file1 ...
```

### `dumptsm`

Dumps low-level details about [TSM](/enterprise_influxdb/v1/concepts/glossary/#tsm-time-structured-merge-tree) files, including TSM (`.tsm`) files and WAL (`.wal`) files.

#### Syntax

```
influx_inspect dumptsm [ options ] <path>
```

##### `<path>`

The path to the `.tsm` file, located by default in the `data` directory.

#### Options

Optional arguments are in brackets.

##### [ `-index` ]

The flag to dump raw index data.
Default value is `false`.

##### [ `-blocks` ]

The flag to dump raw block data.
Default value is `false`.

##### [ `-all` ]

The flag to dump all data. Caution: This may print a lot of information.
Default value is `false`.

##### [ `-filter-key <key_name>` ]

Display only index data and block data that match this key substring.
Default value is `""`.

### `dumptsmwal`

Dumps all entries from one or more WAL (`.wal`) files only and excludes TSM (`.tsm`) files.

#### Syntax

```
influx_inspect dumptsmwal [ options ] <wal_dir>
```

#### Options

Optional arguments are in brackets.

##### [ `-show-duplicates` ]

The flag to show keys which have duplicate or out-of-order timestamps.
If a user writes points with timestamps set by the client, then multiple points
with the same timestamp (or with time-descending timestamps) can be written.

### `export`

Exports all TSM files or a single TSM file in InfluxDB line protocol data format.
The output file can be imported using the
[influx](/enterprise_influxdb/v1/tools/influx-cli/use-influx-cli) command.

#### Syntax

```
influx_inspect export [ options ]
```

#### Options

Optional arguments are in brackets.

##### [ `-compress` ]

The flag to compress the output using gzip compression.
Default value is `false`.

##### [ `-database <db_name>` ]

The name of the database to export.
Default value is `""`.

##### `-datadir <data_dir>`

The path to the [`data` directory](/enterprise_influxdb/v1/concepts/file-system-layout/#data-directory).

Default value is `$HOME/.influxdb/data`.
See the [file system layout](/enterprise_influxdb/v1/concepts/file-system-layout/)
for InfluxDB on your system.

##### [ `-end <timestamp>` ]

The timestamp for the end of the time range. Must be in [RFC3339 format](https://tools.ietf.org/html/rfc3339).

RFC3339 requires very specific formatting. For example, to indicate no time zone
offset (UTC+0), you must include Z or +00:00 after seconds.
Examples of valid RFC3339 formats include:

**No offset**

```
YYYY-MM-DDTHH:MM:SS+00:00
YYYY-MM-DDTHH:MM:SSZ
YYYY-MM-DDTHH:MM:SS.nnnnnnZ (fractional seconds (.nnnnnn) are optional)
```

**With offset**

```
YYYY-MM-DDTHH:MM:SS-08:00
YYYY-MM-DDTHH:MM:SS+07:00
```

> [!Note]
> With offsets, avoid replacing the + or - sign with a Z. It may cause an error
> or print Z (ISO 8601 behavior) instead of the time zone offset.

##### [ `-lponly` ]

Output data in line protocol format only.
Does not output data definition language (DDL) statements (such as `CREATE DATABASE`)
or DML context metadata (such as `# CONTEXT-DATABASE`).

##### [ `-out <export_dir>` or `-out -`]

Location to export shard data. Specify an export directory to export a file, or
add a hyphen after out (`-out -`) to export shard data to standard out (`stdout`)
and send status messages to standard error (`stderr`).

Default value is `$HOME/.influxdb/export`.

##### [ `-retention <rp_name> ` ]

The name of the [retention policy](/enterprise_influxdb/v1/concepts/glossary/#retention-policy-rp)
to export. Default value is `""`.

##### [ `-start <timestamp>` ]

The timestamp for the start of the time range.
The timestamp string must be in [RFC3339 format](https://tools.ietf.org/html/rfc3339).

##### [ `-waldir <wal_dir>` ]

Path to the [WAL](/enterprise_influxdb/v1/concepts/glossary/#wal-write-ahead-log) directory.

Default value is `$HOME/.influxdb/wal`.
See the [file system layout](/enterprise_influxdb/v1/concepts/file-system-layout/#file-system-layout)
for InfluxDB on your system.

##### [ `-tsmfile <tsm_file>` ]

Path to a single tsm file to export. This requires both `-database` and
`-retention` to be specified.

#### Examples

##### Export all databases and compress the output

```bash
influx_inspect export -compress
```

##### Export data from a specific database and retention policy

```bash
influx_inspect export -database DATABASE_NAME -retention RETENTION_POLICY 
```

##### Export data from a single TSM file

```bash
influx_inspect export \
  -database DATABASE_NAME \
  -retention RETENTION_POLICY \
  -tsmfile TSM_FILE_NAME
```

##### Output file

```bash
# DDL
CREATE DATABASE DATABASE_NAME 
CREATE RETENTION POLICY <RETENTION_POLICY> ON <DATABASE_NAME> DURATION inf REPLICATION 1

# DML
# CONTEXT-DATABASE:DATABASE_NAME
# CONTEXT-RETENTION-POLICY:RETENTION_POLICY
randset value=97.9296104805 1439856000000000000
randset value=25.3849066842 1439856100000000000
```

### `merge-schema`

Merge a set of schema files from the [`check-schema` command](#check-schema).

#### Syntax

```
influx_inspect merge-schema [ options ]
```

#### Options

##### [ `-conflicts-file <string>` ]

Filename conflicts data should be written to. Default is `conflicts.json`.

##### [ `-schema-file <string>` ]

Filename for the output file. Default is `schema.json`.

### `report`

Displays series metadata for all shards.
The default location is `$HOME/.influxdb`.

#### Syntax

```
influx_inspect report [ options ] <path>
```

#### Options

Optional arguments are in brackets.

##### `<path>`

The path to the InfluxDB [`data` directory](/enterprise_influxdb/v1/concepts/file-system-layout/#file-system-layout).

##### [ `-pattern "<regular expression/wildcard>"` ]

The regular expression or wildcard pattern to match included files.
Default value is `""`.

##### [ `-detailed` ]

The flag to report detailed cardinality estimates.
Default value is `false`.

##### [ `-exact` ]

The flag to report exact cardinality counts instead of estimates.
Default value is `false`.
Note: This can use a lot of memory.

### `report-db`

Use the `report-db` command to estimate the series cardinality of data in a
database when migrated to InfluxDB Cloud (TSM). InfluxDB Cloud (TSM) includes
field keys in the series key so unique field keys affect the total cardinality.
The total series cardinality of data in a InfluxDB 1.x database may differ from
from the series cardinality of that same data when migrated to InfluxDB Cloud (TSM).

#### Syntax

```
influx_inspect report-db [ options ]
```

#### Options

##### [ `-c <int>` ]

Set worker concurrency. Default is `1`.

##### `-db-path <string>`

{{< req >}}: The path to the database.

##### [ `-detailed` ]

Include counts for fields, tags in the command output.

##### [ `-exact` ]

Report exact cardinality counts instead of estimates.
This method of calculation can use a lot of memory.

##### [ `-rollup <string>` ]

Specify the cardinality "rollup" level--the granularity of the cardinality report:

- `t`: total
- `d`: database
- `r`: retention policy
- `m`: measurement <em class="op65">(Default)</em>

### `report-disk`

Use the `report-disk` command to review disk usage by shards and measurements
for TSM files in a specified directory. Useful for determining disk usage for
capacity planning and identifying which measurements or shards are using the
most space.

Calculates the total disk  size (`total_tsm_size`) in bytes, the number of
shards (`shards`), and the number of tsm files (`tsm_files`) for the specified
directory. Also calculates the disk size (`size`) and number of tsm files
(`tsm_files`) for each shard. Use the `-detailed` flag to report disk usage
(`size`) by database (`db`), retention policy (`rp`), and measurement (`measurement`).

#### Syntax

```
influx_inspect report-disk [ options ] <path>
```

##### `<path>`

Path to the directory with `.tsm` file(s) to report disk usage for.
Default location is `$HOME/.influxdb/data`.

When specifying the path, wildcards (`*`) can replace one or more characters.

#### Options

Optional arguments are in brackets.

##### [ `-detailed` ]

Include this flag to report disk usage by measurement.

#### Examples

##### Report on disk size by shard

```bash
influx_inspect report-disk ~/.influxdb/data/
```

##### Output

```json
{
  "Summary": {"shards": 2, "tsm_files": 8, "total_tsm_size": 149834637 },
  "Shard": [
    {"db": "stress", "rp": "autogen", "shard": "3", "tsm_files": 7, "size": 147022321},
    {"db": "telegraf", "rp": "autogen", "shard": "2", "tsm_files": 1, "size": 2812316}
  ]
}
```

##### Report on disk size by measurement

```bash
influx_inspect report-disk -detailed ~/.influxdb/data/
```

##### Output

```json
{
  "Summary": {"shards": 2, "tsm_files": 8, "total_tsm_size": 149834637 },
  "Shard": [
    {"db": "stress", "rp": "autogen", "shard": "3", "tsm_files": 7, "size": 147022321},
    {"db": "telegraf", "rp": "autogen", "shard": "2", "tsm_files": 1, "size": 2812316}
  ],
  "Measurement": [
    {"db": "stress", "rp": "autogen", "measurement": "ctr", "size": 107900000},
    {"db": "telegraf", "rp": "autogen", "measurement": "cpu", "size": 1784211},
    {"db": "telegraf", "rp": "autogen", "measurement": "disk", "size": 374121},
    {"db": "telegraf", "rp": "autogen", "measurement": "diskio", "size": 254453},
    {"db": "telegraf", "rp": "autogen", "measurement": "mem", "size": 171120},
    {"db": "telegraf", "rp": "autogen", "measurement": "processes", "size": 59691},
    {"db": "telegraf", "rp": "autogen", "measurement": "swap", "size": 42310},
    {"db": "telegraf", "rp": "autogen", "measurement": "system", "size": 59561}
  ]
}
```

### `reporttsi`

The report does the following:

- Calculates the total exact series cardinality in the database.
- Segments that cardinality by measurement, and emits those cardinality values.
- Emits total exact cardinality for each shard in the database.
- Segments for each shard the exact cardinality for each measurement in the shard.
- Optionally limits the results in each shard to the "top n".

The `reporttsi` command is primarily useful when there has been a change in cardinality
and it's not clear which measurement is responsible for this change, and further, _when_
that change happened. Estimating an accurate cardinality breakdown for each measurement
and for each shard will help answer those questions.

### Syntax

```
influx_inspect reporttsi -db-path <path-to-db> [ options ]
```

#### Options

Optional arguments are in brackets.

##### `-db-path <path-to-db>`

The path to the database.

##### [ `-top <n>` ]

Limits the results to the top specified number within each shard.

#### Performance

The `reporttsi` command uses simple slice/maps to store low cardinality measurements, which saves on the cost of initializing bitmaps.
For high cardinality measurements the tool uses [roaring bitmaps](https://roaringbitmap.org/), which means we don't need to store all series IDs on the heap while running the tool.
Conversion from low-cardinality to high-cardinality representations is done automatically while the tool runs.

### `verify`

Verifies the integrity of TSM files.

#### Syntax

```
influx_inspect verify [ options ]
```
#### Options

Optional arguments are in brackets.

##### `-dir <storage_root>`

The path to the storage root directory.
​Default value is `"/root/.influxdb"`.

### `verify-seriesfile`

Verifies the integrity of series files.

#### Syntax

```
influx_inspect verify-seriesfile [ options ]
```

#### Options

Optional arguments are in brackets.

##### [ `-c <number>` ]

Specifies the number of concurrent workers to run for this command. Default is equal to the value of GOMAXPROCS. If performance is adversely impacted, you can set a lower value.

##### [ `-dir <path>` ]

Specifies the root data path. Defaults to `~/.influxdb/data`.

##### [ `-db <db_name>` ]

Restricts verifying series files to the specified database in the data directory.

##### [ `-series-file <path>` ]

Path to a specific series file; overrides `-db` and `-dir`.

##### [ `-v` ]

Enables verbose logging.

### `verify-tombstone`

Verifies the integrity of tombstones.

#### Syntax

```
influx_inspect verify-tombstone [ options ]
```

Finds and verifies all tombstones under the specified directory path (by default, `~/.influxdb/data`). Files are verified serially.

#### Options

Optional arguments are in brackets.

##### [ `-dir <path>` ]

Specifies the root data path. Defaults to `~/.influxdb/data`. This path can be arbitrary, for example, it doesn't need to be an InfluxDB data directory.

##### [ `-v` ]

Enables verbose logging. Confirms a file is being verified and displays progress every 5 million tombstone entries.

##### [ `-vv` ]

Enables very verbose logging. Displays progress for every series key and time range in the tombstone files. Timestamps are displayed in nanoseconds since the Epoch (`1970-01-01T00:00:00Z`).

##### [ `-vvv` ]

Enables very very verbose logging. Displays progress for every series key and time range in the tombstone files. Timestamps are displayed in [RFC3339 format](https://tools.ietf.org/html/rfc3339) with nanosecond precision.

> [!Note]
> Higher verbosity levels override lower levels.

## Caveats

The system does not have access to the metastore when exporting TSM shards.
As such, it always creates the [retention policy](/enterprise_influxdb/v1/concepts/glossary/#retention-policy-rp) with infinite duration and replication factor of 1.  End users may want to change this prior to reimporting if they are importing to a cluster or want a different duration
for retention.
