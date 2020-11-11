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
The `upgrade` command provides an in-place upgrade path from InfluxDB 1.x to InfluxDB 2.0.

<!--The upgrade process copies all data stored in 1.x [databases](/influxdb/v1.8/concepts/glossary/#database) and
[retention policies](/influxdb/v1.8/concepts/glossary/#retention-policy-rp)
to 2.0 [buckets](/influxdb/v2.0/reference/glossary/#bucket).-->
Specifically, the upgrade process does the following:

1. Reads existing the configuration file and generates a corresponding InfluxDB 2.0 configuration file with equivalent settings (where appropriate).
   This file path is `~/.influxdbv2/config.toml`.
2. Upgrades the paths for metadata and the storage engine from current locations to `~/.influxdbv2/meta` and `~/.influxdbv2/engine`, respectively (unless otherwise specified).
3. Copies existing data and WAL files into [buckets](/influxdb/v2.0/reference/glossary/#bucket) in the new 2.0 storage engine.
4. Creates required database and retention policy [(DBRP)](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/) mappings required to access existing data via InfluxQL.
5. Reads existing metadata and migrates non-admin users, passwords, and permissions into a 1.x authorization–compatible store within `~/influxdbv2/influxdb.bolt`.

When you first start InfluxDB 2.0 after running `influx upgrade`, the database generates time series index (TSI) files.
This might take some time depending upon the volume of data present.

## Before you begin: important considerations

Before upgrading to InfluxDB 2.0, consider the following guidelines.
Some or all might apply to your specific installation and use case.
The sections below contain our recommendations for addressing possible gaps in the upgrade process.
Consider whether you need to address any of the following before upgrading.

<!--
POSSIBLE ALT:
Before upgrading to InfluxDB 2.0, review this section to see if you use these features:

- Continuous queries
- ...

If you use one or more of these features, complete the instruction below to ensure a successful upgrade. We plan to address these items in the near future; as such, you may prefer to hold off on upgrading.
-->

### Available operating system, container, and platform support

InfluxDB 2.0 is currently available for MacOS and Linux.
Docker images, ARM builds, and Windows builds are not currently available.
These are planned for subsequent releases.

{{% note %}}
We are working on the upgrade process for users running Docker and 1.8.x.
Hold off on upgrading for now.
{{% /note %}}

There is no plan for a 32-bit build of InfluxDB 2.0.

### Continuous queries

If you use continuous queries, review them prior to upgrading by running the `show continuous queries` command:
Run the following:

{{< keep-url >}}
```sh
$ influx
Connected to http://localhost:8086 version 1.8.3
InfluxDB shell version: 1.8.3
> show continuous queries
```

Save your continuous queries output to use later.

Continuous queries are replaced by tasks in InfluxDB 2.0
To convert your continuous queries to Flux, see [Get started with InfluxDB tasks](/influxdb/v2.0/process-data/get-started/).

### Supported protocols

If you're using one of the [supported protocols](/influxdb/v1.8/supported_protocols/) in InfluxDB 1.x (CollectD, Graphite, OpenTSDB, Prometheus, UDP),
InfluxDB 2.0 doesn't support these protocols directly.
Use [Telegraf](/telegraf/v1.16/) to translate from the source protocol to InfluxDB 2.0.

### Kapacitor

You can continue to use Kapacitor with InfluxDB OSS 2.0 under the following scenarios:

- Kapacitor Batch-style TICKscripts work with the 1.x read compatible API
  Existing Kapacitor user credentials should continue to work using the [1.x compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).
- Kapacitor Stream-style TICKscripts will not work using the [subscription API](/influxdb/v1.8/administration/subscription-management/).
  (There is no subscriptions API in InfluxDB 2.0.)
  We recommend writing data directly to *both* Kapacitor and InfluxDB to allow stream tasks to continue to work.
  To do this, configure two [InfluxDB output plugins](/telegraf/v1.16/plugins/#influxdb): one for Kapacitor and one for InfluxDB 2.0.
  If you use other data sources to send data to InfluxDB, Telegraf can be used as an intermediate layer to write to both Kapacitor and InfluxDB.
  <!-- 
  Other architectures and mechanisms are possible, too.
  Need more help? Reach out in the [community forums](https://community.influxdata.com).
  -->

### User migration

`influxd upgrade` migrates existing 1.x users and their permissions.
However, it *does not migrate administrative users*.

To review users with admin permissions, in the InfluxDB 1.x CLI, run `show users`.
Any users labeled "admin" *will not* be migrated.

If you're using an admin user for visualization or Chronograf's administrative functions, you should create a new read-only user before upgrading.
Admin rights are granted to the primary user created in the InfluxDB 2.0 setup process which runs at the end of the upgrade process.
(This provides you with the opportunity to re-assess who should be granted admin-level access in your InfluxDB 2.0 setup.)

### Dashboards

You can continue to use your existing dashboards and visualization tools with InfluxDB 2.0 via the [1.x read compatibility API](/influxdb/v2.0/reference/api/influxdb-1x/).
The upgrade process creates [DBRP mappings](/influxdb/v2.0/reference/api/influxdb-1x/dbrp/) to ensure existing users can execute InfluxQL queries with the appropriate permissions.

However, if your dashboard tool is configured using a user with admin permissions,
you will need to create a new read-only user with the appropriate database permissions *before* upgrading.
This new username and password combination should be used within the data source configurations to continue to provide read-only access to the underlying data.

Ensure your dashboards are all functioning before upgrading.

### Other data

The 1.x `_internal` database is not migrated with the `influxd upgrade` command.

### Secure by default

InfluxDB 2.0 no longer supports running with `auth-enabled = false`.
Authentication is required by default.
After upgrading, authentication errors can occur if the username and password credentials within InfluxDB do not match what is currently being used by the various applications, agents, visualization tools, etc.
Consider enabling authentication *before* upgrading to ensure that you have the appropriate credentials in place.

## Perform the upgrade

If you've considered the guidance above in ["Before you begin"](#before-you-begin-important-considerations) and are ready to proceed, follow these steps to upgrade your InfluxDB 1.x to InfluxDB 2.0.

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

## Further reading

For more information on upgrading, see the [`influxd upgrade` reference documentation](/influxdb/v2.0/reference/cli/influxd/upgrade/).
