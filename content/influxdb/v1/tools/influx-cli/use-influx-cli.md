---
title: Using influx - InfluxDB command line interface
description: InfluxDB's command line interface (`influx`) is an interactive shell for the HTTP API.
menu:
  influxdb_v1:
    name: Use influx CLI
    weight: 10
    parent: influx
aliases:
  - /influxdb/v1/tools/shell/
related:
  - /influxdb/v1/administration/backup_and_restore/
---

The `influx` command line interface (CLI) provides an interactive shell for the HTTP API associated with `influxd`. 
Use `influx` to write data (manually or from a file), query data interactively, view query output in different formats, and manage resources in InfluxDB.

* [Launch `influx`](#launch-influx)
* [`influx` Arguments](#influx-arguments)
* [`influx` Commands](#influx-commands)

## Launch `influx`

The `influx` CLI is included when you [install InfluxDB OSS {{< current-version >}}](/influxdb/v1/introduction/install/).

The `influx` CLI is installed at the following path, depending on your
system and package manager:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Linux](#linux)
[macOS](#macos)
[Homebrew](#homebrew)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
/usr/bin/influx
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
/usr/local/bin/influx
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
/opt/homebrew/opt/influxdb@1/bin/influx
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

To access the CLI, first launch the `influxd` database process and then launch `influx` in your terminal.

```bash
influx
```

If successfully connected to an InfluxDB node, the output is the following:

```bash
Connected to http://localhost:8086 version {{< latest-patch >}}
InfluxDB shell version: {{< latest-patch >}}
>
```

_The versions of InfluxDB and the CLI should be identical. If not, parsing issues can occur with queries._

In the prompt, you can enter InfluxQL queries as well as CLI-specific commands.
Enter `help` to get a list of available commands.
Use `Ctrl+C` to cancel if you want to cancel a long-running InfluxQL query.

## Environment Variables

The following environment variables can be used to configure settings used by the `influx` client. They can be specified in lower or upper case, however the upper case version takes precedence.

#### `HTTP_PROXY`
Defines the proxy server to use for HTTP.

**Value format:**`[protocol://]<host>[:port]`

```
HTTP_PROXY=http://localhost:1234
```

#### `HTTPS_PROXY`
Defines the proxy server to use for HTTPS. Takes precedence over HTTP_PROXY for HTTPS.

**Value format:**`[protocol://]<host>[:port]`

```
HTTPS_PROXY=https://localhost:1443
```

#### `NO_PROXY`
List of host names that should **not** go through any proxy. If set to an asterisk '\*' only, it matches all hosts.

**Value format:** comma-separated list of hosts

```
NO_PROXY=123.45.67.89,123.45.67.90
```

## `influx` Arguments

Arguments specify connection, write, import, and output options for the CLI session.

`influx` provides the following arguments:

`-h`, `-help`
List `influx` arguments

`-compressed`
Set to true if the import file is compressed.
Use with `-import`.

`-consistency 'any|one|quorum|all'`
Set the write consistency level.

`-database 'database name'`
The database to which `influx` connects.

`-execute 'command'`
Execute an [InfluxQL](/influxdb/v1/query_language/explore-data/) command and quit.
See [-execute](/influxdb/v1/tools/shell/#execute-an-influxql-command-and-quit-with-execute).

`-format 'json|csv|column'`
Specifies the format of the server responses.
See [-format](/influxdb/v1/tools/shell/#specify-the-format-of-the-server-responses-with-format).

`-host 'host name'`
The host to which `influx` connects.
By default, InfluxDB runs on localhost.

`-import`
Import new data or [exported data](/enterprise_influxdb/v1/administration/backup-and-restore/#exporting-data) from a file.
See [-import](#import-data-from-a-file).

`-password 'password'`
The password `influx` uses to connect to the server.
`influx` will prompt for a password if you leave it blank (`-password ''`).
Alternatively, set the password for the CLI with the `INFLUX_PASSWORD` environment
variable.

`-path`
The path to the file to import.
Use with[-import](#import-data-from-a-file).

`-port 'port #'`
The port to which `influx` connects.
By default, InfluxDB runs on port `8086`.

`-pps`
How many points per second the import will allow.
By default, pps is zero and influx will not throttle importing.
Use with `-import`.

`-precision 'rfc3339|h|m|s|ms|u|ns'`
Specifies the format/precision of the timestamp: `rfc3339` (`YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ`), `h` (hours), `m` (minutes), `s` (seconds), `ms` (milliseconds), `u` (microseconds), `ns` (nanoseconds).
Precision defaults to nanoseconds.

> **Note:** Setting the precision to `rfc3339` (`-precision rfc3339`) works with the `-execute` option, but it does not work with the `-import option`. All other precision formats (e.g., `h`,`m`,`s`,`ms`,`u`, and `ns`) work with the `-execute` and `-import` options.

`-pretty`
Turns on pretty print for the `json` format.

`-ssl`
Use HTTPS for requests.

`-unsafeSsl`
Disables SSL certificate verification.
Use when connecting over HTTPS with a self-signed certificate.

`-username 'username'`
The username that `influx` uses to connect to the server.
Alternatively, set the username for the CLI with the `INFLUX_USERNAME` environment variable.

`-version`
Display the InfluxDB version and exit.

The following sections provide detailed examples for some arguments, including `-execute`, `-format`, and `-import`. 

- [Execute an InfluxQL command and quit with `-execute`](#execute-an-influxql-command-and-quit-with--execute)
- [Specify the format of the server responses with `-format`](#specify-the-format-of-the-server-responses-with--format)
- [Import data from a file](#import-data-from-a-file)

### Execute an InfluxQL command and quit with `-execute`

Execute queries that don't require a database specification:

```bash
$ influx -execute 'SHOW DATABASES'
name: databases
---------------
name
NOAA_water_database
_internal
telegraf
pirates
```

Execute queries that do require a database specification, and change the timestamp precision:

```bash
$ influx -execute 'SELECT * FROM "h2o_feet" LIMIT 3' -database="NOAA_water_database" -precision=rfc3339
name: h2o_feet
--------------
time			               level description	    location	     water_level
2015-08-18T00:00:00Z	 below 3 feet		        santa_monica	 2.064
2015-08-18T00:00:00Z	 between 6 and 9 feet  coyote_creek  8.12
2015-08-18T00:06:00Z	 between 6 and 9 feet  coyote_creek  8.005
```

### Specify the format of the server responses with `-format`

The default format is `column`:

```bash
$ influx -format=column
[...]
> SHOW DATABASES
name: databases
---------------
name
NOAA_water_database
_internal
telegraf
pirates
```

Change the format to `csv`:

```bash
$ influx -format=csv
[...]
> SHOW DATABASES
name,name
databases,NOAA_water_database
databases,_internal
databases,telegraf
databases,pirates
```

Change the format to `json`:

```bash
$ influx -format=json
[...]
> SHOW DATABASES
{"results":[{"series":[{"name":"databases","columns":["name"],"values":[["NOAA_water_database"],["_internal"],["telegraf"],["pirates"]]}]}]}
```

Change the format to `json` and turn on pretty print:

```bash
$ influx -format=json -pretty
[...]
> SHOW DATABASES
{
    "results": [
        {
            "series": [
                {
                    "name": "databases",
                    "columns": [
                        "name"
                    ],
                    "values": [
                        [
                            "NOAA_water_database"
                        ],
                        [
                            "_internal"
                        ],
                        [
                            "telegraf"
                        ],
                        [
                            "pirates"
                        ]
                    ]
                }
            ]
        }
    ]
}
```

### Import data from a file

The import file has two sections:

* **DDL (Data Definition Language)**: Contains the [InfluxQL commands](/influxdb/v1/query_language/manage-database/) for creating the relevant [database](/influxdb/v1/concepts/glossary/) and managing the [retention policy](/influxdb/v1/concepts/glossary/#retention-policy-rp).
If your database and retention policy already exist, your file can skip this section.
* **DML (Data Manipulation Language)**: Context metadata that specifies the database and (if desired) retention policy for the import and contains the data in [line protocol](/influxdb/v1/concepts/glossary/#influxdb-line-protocol).

Example:

File (`datarrr.txt`):
```
# DDL
CREATE DATABASE pirates
CREATE RETENTION POLICY oneday ON pirates DURATION 1d REPLICATION 1

# DML
# CONTEXT-DATABASE: pirates
# CONTEXT-RETENTION-POLICY: oneday

treasures,captain_id=dread_pirate_roberts value=801 1439856000
treasures,captain_id=flint value=29 1439856000
treasures,captain_id=sparrow value=38 1439856000
treasures,captain_id=tetra value=47 1439856000
treasures,captain_id=crunch value=109 1439858880
```

Command:
```
$influx -import -path=datarrr.txt -precision=s
```

Results:
```
2015/12/22 12:25:06 Processed 2 commands
2015/12/22 12:25:06 Processed 5 inserts
2015/12/22 12:25:06 Failed 0 inserts
```
> [!Note]
> For large datasets, `influx` writes out a status message every 100,000 points.
> 
> For example:
>
> ```sh
> 2015/08/21 14:48:01 Processed 3100000 lines.
> Time elapsed: 56.740578415s.
> Points per second (PPS): 54634
> ```

Things to note about `-import`:

- To throttle the import, use `-pps` to set the number of points per second to ingest. By default, pps is zero and `influx` does not throttle importing.
- To import a file compressed with `gzip` (GNU zip), include the -compressed flag.
- Include timestamps in the data file.
  If points don’t include a timestamp, InfluxDB assigns the same timestamp to those points, which can result in unintended [duplicate points or overwrites](/influxdb/v1/troubleshooting/frequently-asked-questions/#how-does-influxdb-handle-duplicate-points).
- If your data file contains more than 5,000 points, consider splitting it into smaller files to write data to InfluxDB in batches.
  We recommend writing points in batches of 5,000 to 10,000 for optimal performance.
  Writing smaller batches increases the number of HTTP requests, which can negatively impact performance.
  By default, the HTTP request times out after five seconds. Although InfluxDB continues attempting to write the points after a timeout, you won’t receive confirmation of a successful write.

> **Note:** To export data from InfluxDB version 0.8.9, see [Exporting from 0.8.9](https://github.com/influxdb/influxdb/blob/1.8/importer/README.md).

For more information, see [exporting and importing data](/influxdb/v1/administration/backup_and_restore/#exporting-and-importing-data).

## `influx` commands

Enter `help` in the CLI for a partial list of the available commands.

### Commands

The list below offers a brief discussion of each command.
We provide detailed information on `insert` at the end of this section.

`auth`
Prompts you for your username and password.
`influx` uses those credentials when querying a database.
Alternatively, set the username and password for the CLI with the
`INFLUX_USERNAME` and `INFLUX_PASSWORD` environment variables.

`chunked`
Turns on chunked responses from the server when issuing queries.
This setting is enabled by default.

`chunk size <size>`
Sets the size of the chunked responses.
The default size is `10,000`.
Setting it to `0` resets `chunk size` to its default value.

`clear [ database | db | retention policy | rp ]`
Clears the current context for the [database](/influxdb/v1/concepts/glossary/#database) or [retention policy](/influxdb/v1/concepts/glossary/#retention-policy-rp).

`connect <host:port>`
Connect to a different server without exiting the shell.
By default, `influx` connects to `localhost:8086`.
If you do not specify either the host or the port, `influx` assumes the default setting for the missing attribute.

`consistency <level>`
Sets the write consistency level: `any`, `one`, `quorum`, or `all`.

`Ctrl+C`
Terminates the currently running query. Useful when an interactive query is taking too long to respond
because it is trying to return too much data.

`exit` `quit` `Ctrl+D`
Quits the `influx` shell.

`format <format>`
Specifies the format of the server responses: `json`, `csv`, or `column`.
See the description of [-format](/influxdb/v1/tools/shell/#specify-the-format-of-the-server-responses-with-format) for examples of each format.

`history`
Displays your command history.
To use the history while in the shell, simply use the "up" arrow.
`influx` stores your last 1,000 commands in your home directory in `.influx_history`.

`insert`
Write data using line protocol.
See [insert](/influxdb/v1/tools/shell/#write-data-to-influxdb-with-insert).

`precision <format>`
Specifies the format/precision of the timestamp: `rfc3339` (`YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ`), `h` (hours), `m` (minutes), `s` (seconds), `ms` (milliseconds), `u` (microseconds), `ns` (nanoseconds).
Precision defaults to nanoseconds.

`pretty`
Turns on pretty print for the `json` format.

`settings`
Outputs the current settings for the shell including the `Host`, `Username`, `Database`, `Retention Policy`, `Pretty` status, `Chunked` status, `Chunk Size`, `Format`, and `Write Consistency`.

`use [ "<database_name>" | "<database_name>"."<retention policy_name>" ]`
Sets the current [database](/influxdb/v1/concepts/glossary/#database) and/or [retention policy](/influxdb/v1/concepts/glossary/#retention-policy-rp).
Once `influx` sets the current database and/or retention policy, there is no need to specify that database and/or retention policy in queries.
If you do not specify the retention policy, `influx` automatically queries the `use`d database's `DEFAULT` retention policy.

#### Write data to InfluxDB with `insert`

Enter `insert` followed by the data in [line protocol](/influxdb/v1/concepts/glossary/#influxdb-line-protocol) to write data to InfluxDB.
Use `insert into <retention policy> <line protocol>` to write data to a specific [retention policy](/influxdb/v1/concepts/glossary/#retention-policy-rp).

Write data to a single field in the measurement `treasures` with the tag `captain_id = pirate_king`.
`influx` automatically writes the point to the database's `DEFAULT` retention policy.
```
> INSERT treasures,captain_id=pirate_king value=2
>
```

Write the same point to the already-existing retention policy `oneday`:
```
> INSERT INTO oneday treasures,captain_id=pirate_king value=2
Using retention policy oneday
>
```

### Queries

Execute all InfluxQL queries in `influx`.

See [Data exploration](/influxdb/v1/query_language/explore-data/), [Schema exploration](/influxdb/v1/query_language/explore-schema/), [Database management](/influxdb/v1/query_language/manage-database/), [Authentication and authorization](/influxdb/v1/administration/authentication_and_authorization/) for InfluxQL documentation.
