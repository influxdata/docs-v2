---
title: Upgrade from InfluxDB 1.x to InfluxDB 2.0
description: >
  Upgrade from InfluxDB 1.x to InfluxDB 2.0.
menu:
  influxdb_2_0:
    parent: Upgrade InfluxDB
    name: InfluxDB 1.x to 2.0
weight: 10
aliases:
  - /influxdb/v2.0/reference/upgrading/influxd-upgrade-guide/
---

Use the `influxd upgrade` command to upgrade InfluxDB 1.x to InfluxDB 2.0.
The `upgrade` command provides an in-place upgrade from InfluxDB 1.x to InfluxDB 2.0.

{{% note %}}
#### Docker users

To upgrade from InfluxDB 1.x to InfluxDB 2.0 on Docker, see  "Upgrading from InfluxDB 1.x" in the [Docker Hub documentation](https://hub.docker.com/_/influxdb) for instructions and examples.
{{% /note %}}

Specifically, the upgrade process does the following:

1. Reads the existing InfluxDB 1.x configuration file and generates an equivalent InfluxDB 2.0 configuration file at `~/.influxdbv2/config.toml` or at a custom path specified with the `--v2-config-path` flag.
2. Upgrades metadata and storage engine paths to `~/.influxdbv2/meta` and `~/.influxdbv2/engine`, respectively (unless otherwise specified).
3. Writes existing data and write ahead log (WAL) files into InfluxDB 2.0 [buckets](/influxdb/v2.0/reference/glossary/#bucket).
4. Creates [database and retention policy (DBRP) mappings](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/) required to query data with InfluxQL.
5. Reads existing metadata and migrates non-admin users, passwords, and permissions into a 1.x authorization–compatible store within `~/influxdbv2/influxdb.bolt`.

When starting InfluxDB 2.0 after running `influxdb upgrade`, InfluxDB must build a new time series index (TSI).
Depending on the volume of data present, this may take some time.

## Before you begin: important considerations

Before upgrading to InfluxDB 2.0, consider the following guidelines.
Some or all might apply to your specific installation and use case.
The sections below contain our recommendations for addressing possible gaps in the upgrade process.
Consider whether you need to address any of the following before upgrading.

- [Available operating system, container, and platform support](#available-operating-system-container-and-platform-support)
- [Continuous queries](#continuous-queries)
- [Supported protocols](#supported-protocols)
- [Kapacitor](#kapacitor)
- [User migration](#user-migration)
- [Dashboards](#dashboards)
- [Other data](#other-data)
- [Secure by default](#secure-by-default)
- [`inmem` indexing option](#inmem-indexing-option)

### Available operating system, container, and platform support

{{% warn %}}
InfluxDB 2.0 requires 64-bit operating systems.
{{% /warn %}}

InfluxDB 2.0 is currently available for macOS and Linux.
(Windows builds are not currently available, but are planned for subsequent releases.)

### Continuous queries
Continuous queries are replaced by **tasks** in InfluxDB 2.0.
By default, `influxd upgrade` writes all continuous queries to `~/continuous_queries.txt`.
To convert continuous queries to InfluxDB tasks, see
[Migrate continuous queries to tasks](/influxdb/v2.0/upgrade/v1-to-v2/migrate-cqs/).

### Supported protocols

InfluxDB 2.0 doesn't directly support the alternate write protocols
[supported in InfluxDB 1.x](/influxdb/v1.8/supported_protocols/)
(CollectD, Graphite, OpenTSDB, Prometheus, UDP).
Use [Telegraf](/{{< latest "telegraf" >}}/) to translate these protocols to line protocol.

### Kapacitor

You can continue to use Kapacitor with InfluxDB OSS 2.0 under the following scenarios:

- Kapacitor Batch-style TICKscripts work with the 1.x read compatible API.
  Existing Kapacitor user credentials should continue to work using the [1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).
- InfluxDB 2.0 has no subsriptions API and does not support Kapacitor stream tasks.
  To continue using stream tasks, write data directly to both InfluxDB and Kapacitor.
  Use **Telegraf** and its [InfluxDB output plugin](/{{< latest "telegraf" >}}/plugins/#influxdb)
  to write to Kapacitor and the [InfluxDB v2 output plugin](/{{< latest "telegraf" >}}/plugins/#influxdb_v2) to write to InfluxDB v2.

##### Example Telegraf configuration
```toml
# Write to Kapacitor
[[outputs.influxdb]]
  urls = ["http://localhost:9092"]
  database = "example-db"
  retention_policy = "example-rp"

# Write to InfluxDB 2.0
[[outputs.influxdb]]
  urls = ["http://localhost:8086"]
  database = "example-db"
  retention_policy = "example-rp"
  username = "v1-auth-username"
  password = "v1-auth-password"
```

### User migration

`influxd upgrade` migrates existing 1.x users and their permissions.
However, it *does not migrate administrative users*.

To review users with admin permissions, in the InfluxDB 1.x CLI, run `show users`.
Any users labeled "admin" *will not* be migrated.

If using an admin user for visualization or Chronograf's administrative functions, create a new read-only user before upgrading.
Admin rights are granted to the primary user created in the InfluxDB 2.0 setup process which runs at the end of the upgrade process.
This provides you with the opportunity to re-assess who should be granted admin-level access in your InfluxDB 2.0 setup.

### Dashboards

You can continue to use your existing dashboards and visualization tools with InfluxDB 2.0 via the [1.x read compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).
The upgrade process creates [DBRP mappings](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/) to ensure existing users can execute InfluxQL queries with the appropriate permissions.

However, if your dashboard tool is configured using a user with admin permissions,
you will need to create a new read-only user with the appropriate database permissions *before* upgrading.
This new username and password combination should be used within the data source configurations to continue to provide read-only access to the underlying data.

Ensure your dashboards are all functioning before upgrading.

### Other data

The 1.x `_internal` database is not migrated with the `influxd upgrade` command.
To collect, store, and monitor similar internal InfluxDB metrics,
[create an InfluxDB 2.0 scraper](/influxdb/v2.0/write-data/no-code/scrape-data/manage-scrapers/create-a-scraper/)
to scrape data from the `/metrics` endpoint and store them in a bucket.

### Secure by default

InfluxDB 2.0 requires authentication and does not support the InfluxDB 1.x `auth-enabled = false` configuration option.

Before upgrading to 2.0, [enable authentication in your InfluxDB 1.x instance](/influxdb/v1.8/administration/authentication_and_authorization/#set-up-authentication)
and test your credentials to ensure your applications, agents, and visualization tools can connect to InfluxDB.

If you upgrade with `auth-enabled = false`, the upgrade may appear complete,
but client requests to InfluxDB 2.0 may be silently ignored (you won't see a notification the request was denied).

### In-memory indexing option

InfluxDB 2.0 doesn't support [in-memory (`inmem`) indexing](/influxdb/v1.8/administration/config/#in-memory-inmem-index-settings). The following InfluxDB 1.x configuration options associated with `inmem` indexing are ignored in the upgrade process:

- `max-series-per-database`
- `max-values-per-tag`


## Perform the upgrade

If you've considered the [guidance above](#before-you-begin-important-considerations)
and are ready to proceed, follow these steps to upgrade your InfluxDB 1.x to InfluxDB 2.0.

1. [Download InfluxDB OSS 2.0](https://portal.influxdata.com/downloads/).
   Unpackage the InfluxDB binaries and place them in your `$PATH`.
2. Stop your running InfluxDB 1.x instance.
   Make a backup copy of all 1.x data before upgrading:

   ```sh
   cp -R .influxdb/ .influxdb_bak/
   ```
3. Use `influxd version` to ensure you are running InfluxDB 2.0 from the command line.
   The `influxd upgrade` command is only available in InfluxDB 2.0.
4. If your 1.x configuration file is at the [default location](/influxdb/v1.8/administration/config/#using-the-configuration-file), run:

    ```sh
    influxd upgrade
    ```

    If your 1.x configuration file is not at the default location, run:

    ```sh
    influxd upgrade --config-file <path to v1 config file>
    ```

    To store the upgraded 2.0 configuration file in a custom location, include the `--v2-config-path` flag:

    ```sh
    influxd upgrade --v2-config-path <destination path for v2 config file>
    ```

5. Follow the prompts to set up a new InfluxDB 2.0 instance.

   ```
   Welcome to InfluxDB 2.0 upgrade!
   Please type your primary username: <your-username>

   Please type your password:

   Please type your password again:

   Please type your primary organization name: <your-org>

   Please type your primary bucket name: <your-bucket>

   Please type your retention period in hours.
   Or press ENTER for infinite:

   You have entered:
     Username:          <your-username>
     Organization:      <your-org>
     Bucket:            <your-bucket>
     Retention Period:  infinite
   Confirm? (y/n): y
   ```

The output of the upgrade prints to standard output.
It is also saved (for troubleshooting and debugging) in the current directory to a file called `upgrade.log` located in the home directory of the user running `influxdb upgrade`.

### Post-upgrade

To verify 1.x users were successfully migrated to 2.0, run [`influx v1 auth list`](/influxdb/v2.0/reference/cli/influx/v1/auth/list/).

## Further reading

For more information on upgrading, see the [`influxd upgrade` reference documentation](/influxdb/v2.0/reference/cli/influxd/upgrade/).
