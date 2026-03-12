---
title: Upgrade from InfluxDB 2.0 beta to InfluxDB 2.0
description: >
  To upgrade from InfluxDB 2.0 beta 16 or earlier to {{< current-version >}}, first
  follow these steps to upgrade your InfluxDB beta instance, data, and resources
  to InfluxDB 2.0.
menu:
  influxdb_v2:
    parent: Upgrade InfluxDB
    name: InfluxDB 2.0 beta to 2.8
aliases:
  - /influxdb/v2.0/reference/rc0-upgrade-guide/
  - /influxdb/v2.0/reference/rc1-upgrade-guide/
  - /influxdb/v2.0/reference/upgrading/rc-upgrade-guide/
  - /influxdb/v2.0/upgrade/v2-beta-to-v2/
weight: 11
related:
  - /influxdb/v2/install/upgrade/v2-to-v2/
---

To upgrade from InfluxDB 2.0 beta 16 or earlier to InfluxDB 2.x, first
follow these steps to upgrade your InfluxDB beta instance, data, and resources to
[InfluxDB 2.0](https://github.com/influxdata/influxdb/releases/tag/v2.0.9).

Depending on how you have set up your InfluxDB beta instance and the importance
of your existing resources and data, you can determine which steps apply to
you--for example, if you don't want to migrate your data and resources,
then you can skip those sections.

1. [Disable existing integrations](#1-disable-existing-integrations)
2. [Stop existing InfluxDB beta instance](#2-stop-existing-influxdb-beta-instance)
3. [(Optional) Rename existing InfluxDB binaries](#3-optional-rename-existing-influxdb-binaries)
4. [Move existing data and start the latest InfluxDB](#4-move-existing-data-and-start-the-latest-influxdb)
5. [Start old InfluxDB beta instance](#5-start-old-influxdb-beta-instance)
6. [Create configuration profiles for the InfluxDB CLI](#6-create-configuration-profiles-for-the-influxdb-cli)
7. [Copy all resources from old instance to the new one](#7-copy-all-resources-from-old-instance-to-the-new-one)
8. [Set up integrations to point to new instance](#8-set-up-integrations-to-point-to-new-instance)
9. [Load historical data into new instance](#9-load-historical-data-into-new-instance)
10. [Verify InfluxDB resources, data, and integrations](#verify-influxdb-resources-data-and-integrations)
11. [Upgrade to the latest InfluxDB v2 version](#upgrade-to-the-latest-influxdb-v2-version)

### Why is this manual process required?

To ensure that existing InfluxQL integrations work with the latest release,
we had to make breaking changes to the underlying storage engine for InfluxDB 2.0.

{{% note %}}
If you have questions while upgrading,
[open an issue](https://github.com/influxdata/influxdb/issues)
or join the [Community Slack workspace](https://influxcommunity.slack.com/) to
get immediate help.
{{% /note %}}

## 1. Disable existing integrations

To begin, shut off all integrations that are reading from, writing to, or monitoring your InfluxDB instance.
This includes Telegraf, client libraries, and any custom applications.

## 2. Stop existing InfluxDB beta instance

Next, shut down your existing InfluxDB beta instance.
You can manually stop the individual process using **Control+c**
(or by finding the process ID with `ps aux | grep -i influxd` and using `sudo kill -9 <PID>`).
If you've set `influxd` to run as a system process, follow the same steps you would use to disable any system process.

## 3. (Optional) Rename existing InfluxDB binaries

To easily identify your existing InfluxDB binaries, rename them `influx_old` and `influxd_old`.
This is helpful if you've installed the binaries in your `$PATH`.
We use the names `influxd_old` for this guide, but you can use whatever you like.

## 4. Move existing data and start the latest InfluxDB

If you haven't already,
[download and install InfluxDB 2.0](https://github.com/influxdata/influxdb/releases/tag/v2.0.9)
for your system, but don't run the setup process yet.
Be careful not to overwrite the existing binaries.

To move data between the two instances, first configure both the old and new instances of InfluxDB to run at the same time.
If you download the latest InfluxDB beta and try to start it with existing data,
most likely it won't start and the following error message appears:

```
Incompatible InfluxDB 2.0 version found.
Move all files outside of engine_path before influxd will start.
```

To avoid this error, run the following command to move your existing data to a another location (anywhere you like):

<!--pytest.mark.skip-->

```sh
mv ~/.influxdbv2 ~/.influxdbv2_old
```

Start the latest InfluxDB version by running:

<!--pytest.mark.skip-->

```sh
influxd
```

{{% note %}}
If you were using specific [command line flags](/influxdb/v2/reference/cli/influxd/#flags) for InfluxDB beta, you can use those same command line flags.
{{% /note %}}

Because the data folder path has changed for InfluxDB v2, everything will be empty.
You can visit http://localhost:8086 in your browser and see a setup page, but don't go through the setup process yet.

## 5. Start old InfluxDB beta instance

You can now start your old InfluxDB instance and point it to your old data directory:

<!--pytest.mark.skip-->

```sh
./influxd_old \
    --bolt-path ~/.influxdbv2_old/influxd.bolt \
    --engine-path ~/.influxdbv2_old/engine
```

Double-check that InfluxDB is working by visiting your InfluxDB beta instance URL (probably http://localhost:9999) and logging in.
Your data and resources should still be there.

{{% note %}}
If you see a "missing migration" error, manually edit your bolt file to remove
the migration--for example:

1. _Recommended_: **Backup your old `influxd.bolt` file**--manually editing this
   file could cause you to lose all your data.
2. Use [BoltBrowser](https://github.com/br0xen/boltbrowser) to open and edit
   your old `influxd.bolt` file
3. To remove the migration, highlight the record under the `migrationsv1` path
   and press **D**.
{{% /note %}}

Now, the new instance and old instance of InfluxDB are running simultaneously.

## 6. Create configuration profiles for the InfluxDB CLI

Next, set up your InfluxDB CLI to connect to your old and new instances.

### a. Configure old profile

If you've used the CLI before, copy your existing `configs` file to your new data directory:

<!--pytest.mark.skip-->

```sh
cp ~/.influxdbv2_old/configs ~/.influxdbv2/configs
```

_Recommended_: rename the old configuration file to something like `influx_old`.

{{< keep-url >}}
```toml
[influx_old]
  url = "http://localhost:9999"
  token = "<YOUR TOKEN>"
  org = "influxdata"
  active = true
```

If you've never used the CLI before, create a new configuration profile to
connect to your old instance using the `influx config` command.

<!--pytest.mark.skip-->

{{< keep-url >}}
```sh
influx config create \
    --config-name influx_old \
    --host-url http://localhost:9999 \
    --org influxdata \
    --token <OLD_TOKEN>
```

To list configurations, enter the following command:

<!--pytest.mark.skip-->

{{< keep-url >}}
```sh
influx config ls
```

The output lists the configuration profile for your old instance:

```
Active  Name        URL                    Org
*       influx_old  http://localhost:9999  InfluxData
```

### b. Configure new profile

Next set up your new instance, which automatically creates a configuration profile for you.

The `influx setup` command automatically creates a config profile named `default`.
Make sure you don't already have a profile with that name before you run the command.

Run the `influx setup` command and answer the prompts.

**Don't use the same bucket name** as a bucket in your existing instance.
Otherwise, a name collision and file conflict occurs when you try to copy your
resources.
You'll delete this dummy bucket later, after you migrate your resources.

<!--pytest.mark.skip-->

```sh
influx setup
```

The command prompts you to configure credentials:

```
Welcome to InfluxDB 2.0!
Please type your primary username: admin

Please type your password:

Please type your password again:

Please type your primary organization name: InfluxData

Please type your primary bucket name: dummy_bucket

Please type your retention period in hours.
Or press ENTER for infinite.:

You have entered:
  Username:          admin
  Organization:      InfluxData
  Bucket:            dummy_bucket
  Retention Period:  infinite
Confirm? (y/n): y

Config default has been stored in /Users/rsavage/.influxdbv2/configs.
User	Organization	Bucket
admin	InfluxData	dummy_bucket
```

You now have two config profiles:
one named `default` that points to your new instance, and one named `influx_old` that points to your old instance.

<!--pytest.mark.skip-->

{{< keep-url >}}
```sh
$ influx config ls
Active  Name        URL                    Org
        default     http://localhost:8086  InfluxData
*       influx_old  http://localhost:9999  InfluxData
```

You can now send commands to each of them as needed using the [`-c, --active-config`](/influxdb/v2/reference/cli/influx/#commands) option in the CLI.

## 7. Copy all resources from old instance to the new one

Use config profiles to export all resources from the old instance and apply them to your new instance.
(The only things that will not be copied over are [scraper configurations](/influxdb/v2/write-data/no-code/scrape-data/manage-scrapers/).
You will need to manually reconfigure those.)

Copy all your existing InfluxDB resources, such as dashboards, tasks, and alerts, to your new instance by running the following command:

<!--pytest.mark.skip-->

```sh
influx export all -c influx_old | influx apply -c default
```

(To learn more about this command, see
[`influx export`](/influxdb/v2/reference/cli/influx/export/) and
[`influx apply`](/influxdb/v2/reference/cli/influx/apply/).)

The output is a list of the resources created in your new instance.
If successful, you can delete the bucket created during the setup.

<!--pytest.mark.skip-->

```sh
LABELS    +add | -remove | unchanged
+-----+------------------------+----+---------------+---------+-------------+
| +/- |     METADATA NAME      | ID | RESOURCE NAME |  COLOR  | DESCRIPTION |
+-----+------------------------+----+---------------+---------+-------------+
| +   | tasty-northcutt-c9c001 |    | something     | #326BBA |             |
+-----+------------------------+----+---------------+---------+-------------+
|                                                      TOTAL  |      1      |
+-----+------------------------+----+---------------+---------+-------------+
​
BUCKETS    +add | -remove | unchanged
+-----+------------------------+----+---------------+------------------+-------------+
| +/- |     METADATA NAME      | ID | RESOURCE NAME | RETENTION PERIOD | DESCRIPTION |
+-----+------------------------+----+---------------+------------------+-------------+
| +   | fasting-taussig-c9c007 |    | apps          | 0s               |             |
+-----+------------------------+----+---------------+------------------+-------------+
+-----+------------------------+----+---------------+------------------+-------------+
| +   | great-davinci-c9c005   |    | new_telegraf  | 0s               |             |
+-----+------------------------+----+---------------+------------------+-------------+
+-----+------------------------+----+---------------+------------------+-------------+
| +   | stubborn-hugle-c9c003  |    | telegraf      | 719h59m59s       |             |
+-----+------------------------+----+---------------+------------------+-------------+
|                                                          TOTAL       |      3      |
+-----+------------------------+----+---------------+------------------+-------------+
```

Now, you have all the resources from your old instance stored in your new instance.
Sign in to your new instance (by default http://localhost:8086) and take a look.
You will see dashboards, but you haven't yet migrated your old data.

## 8. Set up integrations to point to new instance

Re-enable any integrations you disabled in step 2.
You will need to re-enable Telegraf, client libraries, custom applications,
or third-party data sinks using new tokens and credentials.

## 9. Load historical data into new instance

Use the CLI to export and then re-import your data using the command below.
(For the range, pick a time before your bucket's retention period, or something a really long time ago if you have an unlimited retention period.)

<!--pytest.mark.skip-->

```sh
influx query -c influx_old \
  'from(bucket: "my-bucket") |> range(start: -3y)' --raw > my-bucket.csv
```

Then write to the new bucket:

<!--pytest.mark.skip-->

```sh
influx write -c default --format csv -b my-bucket -f my-bucket.csv
```

Repeat that process for each bucket.

## Verify InfluxDB resources, data, and integrations

Verify that the latest version of InfluxDB {{< current-version >}} is running with all your resources, data, and integrations configured.
Double-check that everything is there and it is working as expected.
Once you're set up with the latest InfluxDB, you can safely turn off your old instance and archive the previous data directory.

## Upgrade to the latest InfluxDB v2 version

Follow steps to [upgrade from InfluxDB 2.0 to the latest InfluxDB 2.x version](/influxdb/v2/install/upgrade/v2-to-v2/).
