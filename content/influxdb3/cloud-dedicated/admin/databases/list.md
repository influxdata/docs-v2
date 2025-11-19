---
title: List databases
description: >
  Use the Admin UI, the [`influxctl database list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/list/), or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/)
  to list databases in your InfluxDB Cloud Dedicated cluster.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage databases
weight: 202
list_code_example: |
  ##### CLI
  ```sh
  influxctl database list
  ```

  ##### API
  ```sh
  curl \
    --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases" \
    --header "Accept: application/json" \
    --header "Authorization: Bearer MANAGEMENT_TOKEN"
  ```
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/database/list/
  - /influxdb3/cloud-dedicated/reference/api/
---

Use the Admin UI, the [`influxctl database list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/list/),
or the [Management HTTP API](/influxdb3/cloud-dedicated/api/management/) to list databases in your {{< product-name omit=" Clustered" >}} cluster.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#)
[influxctl](#)
[Management API](#)
{{% /tabs %}}
{{% tab-content %}}
Access the InfluxDB Cloud Dedicated Admin UI at [console.influxdata.com](https://console.influxdata.com).
If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).

The database list displays the following database details:

- Name
- Database ID
- Max tables
- Max columns per table
- Retention period

You can **Search** for databases by name or ID to filter the list and use the sort button and column headers to sort the list. 

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-databases.png" alt="InfluxDB Cloud Dedicated Admin UI databases list" />}} 

### Database management tools

The options button (3 vertical dots) to the right of any database provides additional tools:

- **Copy Database ID**: Copy the database ID to your clipboard
- **Set Retention Period**: Set the retention period for the database
- **Delete Database**: Delete the database

### Manage database tables 

To view database details and manage database tables, click the database row in the list.
{{% /tab-content %}}
{{% tab-content %}}

<!------------------------------- BEGIN INFLUXCTL ----------------------------->

Use the [`influxctl database list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/database/list/)
to list databases in your InfluxDB Cloud Dedicated cluster.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl), and then [configure an `influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles) for your cluster.
2. In your terminal, run the `influxctl database list` command and provide the following:

    - _Optional_: [Output format](#output-format)

```sh
influxctl database list --format table
```

<!-------------------------------- END INFLUXCTL ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN cURL ---------------------------------->
_This example uses [cURL](https://curl.se/) to send a Management HTTP API request, but you can use any HTTP client._

1. If you haven't already, follow the instructions to [install cURL](https://everything.curl.dev/install/index.html) for your system.
2. In your terminal, use cURL to send a request to the following {{% product-name %}} endpoint:

   {{% api-endpoint endpoint="https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases" method="get" api-ref="/influxdb3/cloud-dedicated/api/management/#operation/GetClusterDatabases" %}}

   In the URL, provide the following credentials:
   - `ACCOUNT_ID`: The ID of the [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that the cluster belongs to _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.
   - `CLUSTER_ID`: The ID of the [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) that you want to manage _(see how to [list cluster details](/influxdb3/cloud-dedicated/admin/clusters/list/#detailed-output-in-json))_.

   Provide the following request headers:

   - `Accept: application/json` to ensure the response body is JSON content
   - `Authorization: Bearer` and a [Management API token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your cluster _(see how to [create a management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for Management API requests)_.

 The following example shows how to use the Management API to list databases in a cluster:

{{% code-placeholders "ACCOUNT_ID|CLUSTER_ID|MANAGEMENT_TOKEN" %}}

```sh
curl \
   --location "https://console.influxdata.com/api/v0/accounts/ACCOUNT_ID/clusters/CLUSTER_ID/databases" \
   --header "Accept: application/json" \
   --header "Authorization: Bearer MANAGEMENT_TOKEN"
```

{{% /code-placeholders %}}

Replace the following in your request:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [account](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database for
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: the ID of the {{% product-name %}} [cluster](/influxdb3/cloud-dedicated/get-started/setup/#request-an-influxdb-cloud-dedicated-cluster) to create the database for
- {{% code-placeholder-key %}}`MANAGEMENT TOKEN`{{% /code-placeholder-key %}}: a [management token](/influxdb3/cloud-dedicated/admin/tokens/management/) for your {{% product-name %}} cluster
<!------------------------------- END cURL ------------------------------------>
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Output format

The `influxctl database list` command supports two output formats: `table` and `json`.
By default, the command outputs the list of databases formatted as a table.
For easier programmatic access to the command output, include `--format json`
with your command to format the output as JSON.

The Management API outputs JSON format in the response body.

#### Retention period syntax

In table format, a retention period is a time duration value made up of a numeric value
plus a duration unit--for example, `30d` means 30 days.
An `infinite` retention period means data won't expire.

In JSON format, a retention period value is an integer (`<int32>`) that represents the number of nanoseconds--for example, `2592000000000` means 30 days.
A zero (`0`) retention period means data won't expire.

#### Example output

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[table](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```sh
+---------------+------------------+------------+-----------------------+
| DATABASE NAME | RETENTION PERIOD | MAX TABLES | MAX COLUMNS PER TABLE |
+---------------+------------------+------------+-----------------------+
| mydb1         | infinite         |        500 |                   250 |
| mydb2         | infinite         |        500 |                   200 |
| mydb3         | 24h              |        100 |                   200 |
+---------------+------------------+------------+-----------------------+
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```json
[
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "database_name": "mydb1",
    "retention_period_ns": 0,
    "max_tables": 500,
    "max_columns_per_table": 250
  },
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "database_name": "mydb2",
    "retention_period_ns": 0,
    "max_tables": 500,
    "max_columns_per_table": 200
  },
  {
    "account_id": "0x0x0x00-0Xx0-00x0-x0X0-00x00XX0Xx0X",
    "cluster_id": "X0x0xxx0-0XXx-000x-00x0-0X000Xx00000",
    "database_name": "mydb3",
    "retention_period_ns": 86400000000000,
    "max_tables": 100,
    "max_columns_per_table": 200
  },
]
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
