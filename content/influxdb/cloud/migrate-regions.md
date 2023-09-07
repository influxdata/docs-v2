---
title: Migrate to an account in a new region
description: >
  Learn how to migrate from one InfluxDB Cloud region to another.
---

The following guide provides instructions on migrating data and resources
from an existing InfluxDB Cloud account to a new InfluxDB account in another
InfluxDB Cloud region.

## Create a new account in a new region

InfluxDB organizations are bound to a specific cloud provider and region.
[Create a new InfluxDB Cloud account](/influxdb/cloud/sign-up/) in the region
you want to migrate to.

## Migrate Data

If you want to migrate data from your current InfluxDB Cloud account to your new
destination InfluxDB Cloud account, there is documentation available that
walks through the migration.
The specific process varies depending on whether your destination account is
powered by our current database engine,
[Time-Structured Merge Tree (TSM)](/influxdb/v2/reference/internals/storage-engine/#time-structured-merge-tree-tsm)
or [our new database engine, InfluxDB IOx](/blog/announcing-general-availability-new-database-engine/).

To benefit from IOx's unlimited cardinality and support for SQL, migrate your data to IOx.

- [Migrate data TSM to IOx](/influxdb/cloud-serverless/write-data/migrate-data/migrate-tsm-to-iox/)
- [Migrate data from TSM to TSM](/influxdb/cloud/migrate-data/migrate-cloud-to-cloud/). 

To see which storage engine your organization is using,
find the **InfluxDB Cloud powered by** link in your
[InfluxDB Cloud organization homepage](https://cloud2.influxdata.com) version information.
If your organization is using TSM, you'll see **TSM** followed by the version number.
If IOx, you'll see
**InfluxDB Cloud Serverless** followed by the version number.
{{% note %}}
#### Dual write into both organizations

Depending on the duration of your retention policy for storing data it may be
easier to temporarily dual write into both the source and destination accounts
for an overlapping period until the destination account holds all desired data.
{{% /note %}}

## Migrate Resources

Resources include, but are not limited to the following:

- buckets
- dashboards
- notification rules
- tasks
- labels
- variables

If you have resources that you want to migrate to your destination account
(rather than recreating these resources in the destination account) you can do
the following:

1.  [Download and install the 2.x `influx` CLI](/influxdb/cloud/tools/influx-cli/).

2.  [Set up InfluxDB connection configurations](/influxdb/cloud/tools/influx-cli/#provide-required-authentication-credentials)
    for both your **source** and **destination** InfluxDB Cloud accounts.
    Use the [`influx config create` command](/influxdb/cloud/reference/cli/influx/config/create/)
    and provide the following for each connection:

    - Connection configuration name
    - [InfluxDB Cloud region URL](/influxdb/cloud/reference/regions/)
    - [InfluxDB organization name](/influxdb/cloud/organizations/)
    - [InfluxDB API token](/influxdb/cloud/security/tokens/)

    ```sh
    # Create your source connection configuration and set it to active
    $ influx config create \
      --config-name source \
      --host-url https://cloud2.influxdata.com \
      --org <your-source-org> \
      --token <your-source-auth-token> \
      --active

    # Create your destination connection configuration
    $ influx config create \
      --config-name destination \
      --host-url https://cloud2.influxdata.com \
      --org <your-destination-org> \
      --token <your-destination-auth-token>
    ```

3.  Use the [`influx export all` command](/influxdb/cloud/reference/cli/influx/export/all/#export-all-resources-in-an-organization-as-a-template)
    to export all resources from your **source account** to an
    [InfluxDB template](/influxdb/cloud/influxdb-templates/use/).

    ```sh
    influx export all
    ```

4.  Use the [`influx config` command](/influxdb/cloud/reference/cli/influx/config/)
    to switch to your **destination** connection configuration.
    Provide the name of the configuration to switch to:

    ```sh
    influx config destination
    ```

5.  Use [`influx template apply` command](/influxdb/cloud/reference/cli/influx/apply/#apply-a-template-from-a-file)
    to apply the exported InfluxDB template created in the previous step to your
    destination account:

    ```sh
    influx apply --file path/to/template.json
    ```
