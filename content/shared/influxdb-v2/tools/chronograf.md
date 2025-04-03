
[Chronograf](/chronograf/v1/) is a data visualization and dashboarding
tool designed to visualize data in InfluxDB 1.x. It is part of the [TICKstack](/platform/)
that provides an InfluxQL data explorer, Kapacitor integrations, and more.
Continue to use Chronograf with **InfluxDB Cloud** and **InfluxDB OSS {{< current-version >}}** and the
[1.x compatibility API](/influxdb/version/reference/api/influxdb-1x/).


## Create an InfluxDB connection
1. In Chronograf, click **Configuration** in the left navigation bar,
   and then click **{{< icon "plus" >}} Add Connection**.
2. Toggle the **InfluxDB v2 Auth** option at the bottom of the form.
    {{< img-hd src="/img/influxdb/2-0-tools-chronograf-v2-auth.png" alt="InfluxDB v2 Auth toggle" />}}
3. Enter your InfluxDB connection credentials:
    - **Connection URL:** InfluxDB URL _(see [InfluxDB Cloud regions](/influxdb/cloud/reference/regions/)
      or [InfluxDB OSS URLs](/influxdb/version/reference/urls/))_

      ```
      http://localhost:8086
      ```

    - **Connection Name:** Name to uniquely identify this connection configuration
    - **Organization:** InfluxDB [organization](/influxdb/version/admin/organizations/)
    - **Token:** InfluxDB [API token](/influxdb/version/admin/tokens/)
    - **Telegraf Database Name:** InfluxDB [bucket](/influxdb/version/admin/buckets/)
      Chronograf uses to populate parts of the application, including the Host List page (default is `telegraf`)
    - **Default Retention Policy:** default [retention policy](/influxdb/v1/concepts/glossary/#retention-policy-rp)
      _**(leave blank)**_

        {{% note %}}
#### DBRPs map to InfluxDB buckets
In InfluxDB {{< current-version >}}, database/retention-policy (DBRP) combinations
are mapped to buckets using the `database-name/retention-policy` naming convention.
**DBRP mappings are required to query InfluxDB {{< current-version >}} using InfluxQL.**

For information, see [DBRP mapping](/influxdb/version/reference/api/influxdb-1x/dbrp/){{% show-in "v2" %}}.{{% /show-in %}}
{{% show-in "cloud,cloud-serverless" %}}and [Create DBRP mappings](/influxdb/version/query-data/influxql/dbrp/#create-dbrp-mappings).{{% /show-in %}}
      {{% /note %}}

3. Click **Add Connection**.
4. Select the dashboards you would like to create, and then click **Next**.
5. To configure a Kapacitor connection, provide the necessary credentials,
   and then click **Continue**. Otherwise, click **Skip**.
   _For information about using Kapacitor with InfluxDB Cloud or InfluxDB OSS {{< current-version >}},
   see [Use Kapacitor with InfluxDB](/influxdb/version/tools/kapacitor/)._
6. Click **Finish**.

## Important notes

- [Update upgraded InfluxDB connections](#update-upgraded-influxdb-connections)
- [No administrative functionality](#no-administrative-functionality)
- [Limited InfluxQL support](#limited-influxql-support)

### Update upgraded InfluxDB connections
If using Chronograf with an InfluxDB instance that was upgraded from 1.x
to 2.x, update your InfluxDB connection configuration in Chronograf to use the
**InfluxDB v2 Auth** option and provide an organization and a token.
**Without an organization, Chronograf cannot use Flux to query InfluxDB.**

### No administrative functionality
Chronograf cannot be used for administrative tasks in InfluxDB Cloud and InfluxDB OSS {{< current-version >}}.
For example, you **cannot** do the following:

- Define databases
- Modify retention policies
- Add users
- Kill queries

When connected to an InfluxDB Cloud or InfluxDB {{< current-version >}} database, functionality in the
**{{< icon "crown" >}} InfluxDB Admin** section of Chronograf is disabled.

To complete administrative tasks, use the following:

- **InfluxDB user interface (UI)**
- [InfluxDB CLI](/influxdb/version/reference/cli/influx/)
- [InfluxDB v2 API](/influxdb/version/reference/api/)

### Limited InfluxQL support
InfluxDB Cloud and InfluxDB OSS {{< current-version >}} support InfluxQL **read-only** queries.
For more information, see [InfluxQL support](/influxdb/version/query-data/influxql/#influxql-support).
