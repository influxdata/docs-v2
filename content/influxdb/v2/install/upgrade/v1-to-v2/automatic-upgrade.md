---
title: Automatically upgrade from InfluxDB 1.x to 2.7
list_title: Automatically upgrade from 1.x to 2.7
description: >
  Use the `influx upgrade` tool to automatically upgrade from InfluxDB 1.x to InfluxDB 2.7.
menu:
  influxdb_v2:
    parent: InfluxDB 1.x to 2.7
    name: Automatically upgrade
weight: 10
aliases:
  - /influxdb/v2/reference/upgrading/influxd-upgrade-guide/
  - /influxdb/v2/upgrade/v1-to-v2/automatic-upgrade/
related:
  - /influxdb/v2/reference/cli/influxd/upgrade/
  - /influxdb/v2/install/upgrade/v1-to-v2/manual-upgrade/
  - /influxdb/v2/install/upgrade/v1-to-v2/docker/
---

Use the `influxd upgrade` command to upgrade InfluxDB 1.x to InfluxDB {{< current-version >}}.
The `upgrade` command provides an in-place upgrade from InfluxDB 1.x to InfluxDB {{< current-version >}}.

Specifically, the upgrade process does the following:

1. Reads the existing InfluxDB 1.x configuration file and generates an equivalent InfluxDB {{< current-version >}} configuration file at `~/.influxdbv2/config.toml` or at a custom path specified with the `--v2-config-path` flag.
2. Upgrades metadata and storage engine paths to `~/.influxdbv2/meta` and `~/.influxdbv2/engine`, respectively (unless otherwise specified).
3. Writes existing data and write ahead log (WAL) files into InfluxDB {{< current-version >}} [buckets](/influxdb/v2/reference/glossary/#bucket).
4. Creates [database and retention policy (DBRP) mappings](/influxdb/v2/reference/api/influxdb-1x/dbrp/) required to query data with InfluxQL.
5. Reads existing metadata and migrates non-admin users, passwords, and permissions into a 1.x authorization–compatible store within `~/influxdbv2/influxdb.bolt`.

When starting InfluxDB {{< current-version >}} after running `influxdb upgrade`, InfluxDB must build a new time series index (TSI).
Depending on the volume of data present, this may take some time.

## Important considerations before you begin

Before upgrading to InfluxDB {{< current-version >}}, consider the following guidelines.
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
- [`inmem` indexing option](#in-memory-indexing-option)
- [Interactive shell](#interactive-shell)

### Available operating system, container, and platform support

InfluxDB {{< current-version >}} is currently available for macOS, Linux, and Windows.

{{% note %}}
InfluxDB {{< current-version >}} requires 64-bit operating systems.
{{% /note %}}

### Continuous queries

Continuous queries are replaced by **tasks** in InfluxDB {{< current-version >}}.
By default, `influxd upgrade` writes all continuous queries to `~/continuous_queries.txt`.
To convert continuous queries to InfluxDB tasks, see
[Migrate continuous queries to tasks](/influxdb/v2/upgrade/v1-to-v2/migrate-cqs/).

### Supported protocols

InfluxDB {{< current-version >}} doesn't directly support the alternate write protocols
[supported in InfluxDB 1.x](/influxdb/v1/supported_protocols/)
(CollectD, Graphite, OpenTSDB, Prometheus, UDP).
Use [Telegraf](/telegraf/v1/) to translate these protocols to line protocol.

### Kapacitor

You can continue to use Kapacitor with InfluxDB OSS {{< current-version >}} under the following scenarios:

- Kapacitor Batch-style TICKscripts work with the 1.x read compatible API.
  Existing Kapacitor user credentials should continue to work using the [1.x compatibility API](/influxdb/v2/reference/api/influxdb-1x/).
- InfluxDB {{< current-version >}} has no subscriptions API and does not support Kapacitor stream tasks.
  To continue using stream tasks, write data directly to both InfluxDB and Kapacitor.
  Use **Telegraf** and its [InfluxDB output plugin](/telegraf/v1/plugins/#output-influxdb)
  to write to Kapacitor and the [InfluxDB v2 output plugin](/telegraf/v1/plugins/#output-influxdb_v2) to write to InfluxDB v2.

##### Example Telegraf configuration
```toml
# Write to Kapacitor
[[outputs.influxdb]]
  urls = ["http://localhost:9092"]
  database = "example-db"
  retention_policy = "example-rp"

# Write to InfluxDB {{< current-version >}}
[[outputs.influxdb]]
  urls = ["http://localhost:8086"]
  database = "example-db"
  retention_policy = "example-rp"
  username = "v1-auth-username"
  password = "v1-auth-password"
```

### User migration

`influxd upgrade` migrates existing 1.x users and their permissions **except** the following users:

- [1.x admin users](/influxdb/v1/administration/authentication_and_authorization/#admin-users)
- [1.x non-admin users](/influxdb/v1/administration/authentication_and_authorization/#non-admin-users)
  that have not been granted any privileges

{{< expand-wrapper >}}
{{% expand "Review 1.x user privileges" %}}
**To review 1.x users with admin privileges**, run the following against your InfluxDB 1.x instance:

```sql
SHOW USERS
```

Users with `admin` set to `true` will **not** be migrated.

**To review the specific privileges granted to each 1.x user**, run the following for each user in your InfluxDB 1.x instance:

```sql
SHOW GRANTS FOR "<username>"
```

If no grants appear, the user will **not** be migrated.
{{% /expand %}}
{{< /expand-wrapper >}}

If using an admin user for visualization or Chronograf administrative functions,
**create a new read-only user before upgrading**:

##### Create a read-only 1.x user
```sh
> CREATE USER <username> WITH PASSWORD '<password>'
> GRANT READ ON <database> TO "<username>"
```

InfluxDB {{< current-version >}} only grants admin privileges to the primary user set up during the InfluxDB {{< current-version >}} upgrade.
This provides you with the opportunity to reassess who to grant admin permissions when setting up InfluxDB {{< current-version >}}.

### Dashboards

You can continue to use your existing dashboards and visualization tools with InfluxDB {{< current-version >}} via the [1.x read compatibility API](/influxdb/v2/reference/api/influxdb-1x/).
The upgrade process creates [DBRP mappings](/influxdb/v2/reference/api/influxdb-1x/dbrp/) to ensure existing users can execute InfluxQL queries with the appropriate permissions.

However, if your dashboard tool is configured using a user with admin permissions,
you will need to create a new read-only user with the appropriate database permissions *before* upgrading.
This new username and password combination should be used within the data source configurations to continue to provide read-only access to the underlying data.

Ensure your dashboards are all functioning before upgrading.

### Other data

The 1.x `_internal` database is not migrated with the `influxd upgrade` command.
To collect, store, and monitor similar internal InfluxDB metrics,
[create an InfluxDB {{< current-version >}} scraper](/influxdb/v2/write-data/no-code/scrape-data/manage-scrapers/create-a-scraper/)
to scrape data from the `/metrics` endpoint and store them in a bucket.

### Secure by default

InfluxDB {{< current-version >}} requires authentication and does not support the InfluxDB 1.x `auth-enabled = false` configuration option.

Before upgrading to {{< current-version >}}, [enable authentication in your InfluxDB 1.x instance](/influxdb/v1/administration/authentication_and_authorization/#set-up-authentication)
and test your credentials to ensure your applications, agents, and visualization tools can connect to InfluxDB.

If you upgrade with `auth-enabled = false`, the upgrade may appear complete,
but client requests to InfluxDB {{< current-version >}} may be silently ignored (you won't see a notification the request was denied).

### In-memory indexing option

InfluxDB {{< current-version >}} doesn't support [in-memory (`inmem`) indexing](/influxdb/v1/administration/config/#in-memory-inmem-index-settings). The following InfluxDB 1.x configuration options associated with `inmem` indexing are ignored in the upgrade process:

- `max-series-per-database`
- `max-values-per-tag`

### Interactive shell

The InfluxDB {{< current-version >}} `influx` CLI includes an interactive **InfluxQL shell** for executing InfluxQL queries.
To start an InfluxQL shell:

1. Download and install in the [`influx` CLI](/influxdb/v2/tools/influx-cli/).
2. Set up your [`influx` CLI authentication credentials](/influxdb/v2/tools/influx-cli/#set-up-the-influx-cli).
3. Run the `influx v1 shell` command.

For more information see:

- [Use the InfluxQL shell](/influxdb/v2/tools/influxql-shell/)
- [Query data with InfluxQL](/influxdb/v2/query-data/influxql/)

To build an interactive shell to execute **Flux** queries,
[compile and build a command line Flux REPL from source](https://github.com/influxdata/flux/blob/master/README.md#getting-started). 

## Perform the upgrade

If you've considered the [guidance above](#important-considerations-before-you-begin)
and are ready to proceed, follow these steps to upgrade your InfluxDB 1.x to InfluxDB {{< current-version >}}.

1. [Download InfluxDB OSS {{< current-version >}}](https://www.influxdata.com/downloads/).
   Unpackage the InfluxDB binaries and place them in your `$PATH`.
2. Stop your running InfluxDB 1.x instance.
   Make a backup copy of all 1.x data before upgrading:

   ```sh
   cp -R .influxdb/ .influxdb_bak/
   ```
3. Use `influxd version` to ensure you are running InfluxDB {{< current-version >}} from the command line.
   The `influxd upgrade` command is only available in InfluxDB {{< current-version >}}.
4. If your 1.x configuration file is at the [default location](/influxdb/v1/administration/config/#using-the-configuration-file), run:
    ```sh
    influxd upgrade
    ```
    {{% note %}}
#### Upgrade `.deb` packages
When installed from a `.deb` package, InfluxDB 1.x and 2.x run under the `influxdb` user.
If you've installed both versions from `.deb` packages, run the upgrade command
as the `influxdb` user:

```sh
sudo -u influxdb influxd upgrade
```
    {{% /note %}}
    If your 1.x configuration file is not at the default location, run:

    ```sh
    influxd upgrade --config-file <path to v1 config file>
    ```

    To store the upgraded {{< current-version >}} configuration file in a custom location, include the `--v2-config-path` flag:

    ```sh
    influxd upgrade --v2-config-path <destination path for v2 config file>
    ```
    
    
5. Follow the prompts to set up a new InfluxDB {{< current-version >}} instance.

   ```
   Welcome to InfluxDB {{< current-version >}} upgrade!
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

## Post-upgrade

### Verify 1.x users were migrated to {{< current-version >}}

To verify 1.x users were successfully migrated to {{< current-version >}}, run
[`influx v1 auth list`](/influxdb/v2/reference/cli/influx/v1/auth/list/).

#### Add authorizations for external clients

If your InfluxDB 1.x instance **did not have authentication enabled** and the
`influx v1 auth list` doesn't return any users, external clients connected to
your 1.x instance will not be able to access InfluxDB {{< current-version >}}, which requires authentication.

**For these external clients to work with InfluxDB {{< current-version >}}:**

1. [Manually create a 1.x-compatible authorization](/influxdb/v2/upgrade/v1-to-v2/manual-upgrade/#create-a-1x-compatible-authorization).
2. Update the client configuration to use the username and password associated
   with your 1.x-compatible authorization.
