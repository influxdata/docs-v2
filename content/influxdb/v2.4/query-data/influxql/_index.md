---
title: Query data with InfluxQL
description: >
  Use the [InfluxDB 1.x `/query` compatibility endpoint](/influxdb/v2.4/reference/api/influxdb-1x/query)
  to query data in InfluxDB Cloud and InfluxDB OSS 2.4 with **InfluxQL**.
weight: 102
influxdb/v2.4/tags: [influxql, query]
menu:
  influxdb_2_4:
    name: Query with InfluxQL
    parent: Query data
related:
  - /influxdb/v2.4/reference/api/influxdb-1x/
  - /influxdb/v2.4/reference/api/influxdb-1x/query
  - /influxdb/v2.4/reference/api/influxdb-1x/dbrp
  - /influxdb/v2.4/tools/influxql-shell/
---

Use InfluxQL (an SQL-like query language) to interact with InfluxDB, and query and analyze your times series data.

In InfluxDB 1.x, data is stored in [databases](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#database)
and [retention policies](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#retention-policy-rp).
In InfluxDB OSS {{< current-version >}}, data is stored in [buckets](/influxdb/v2.4/reference/glossary/#bucket).
Because InfluxQL uses the 1.x data model, a bucket must be mapped to a database and retention policy (DBRP) before it can be queried using InfluxQL.

**To query data with InfluxQL, complete the following steps:**

1. [Verify buckets have a mapping](#verify-buckets-have-a-mapping).
2. [Create DBRP mappings for unmapped buckets](#create-dbrp-mappings-for-unmapped-buckets).
3. [Query a mapped bucket with InfluxQL](#query-a-mapped-bucket-with-influxql).

{{% note %}}

#### InfluxQL reference documentation

For complete InfluxQL reference documentation, see the
[InfluxQL specification for InfluxDB 2.x](/influxdb/v2.4/reference/syntax/influxql/spec/).
{{% /note %}}

## Verify buckets have a mapping

1. To verify the buckets you want to query are mapped to a database and retention policy, use the [`influx` CLI](/influxdb/v2.4/reference/cli/influx/) or the [InfluxDB API](/influxdb/v2.4/reference/api/).
_For examples, see [List DBRP mappings](/influxdb/v2.4/query-data/influxql/dbrp/#list-dbrp-mappings)._

2. If you **do not find a DBRP mapping for a bucket**, [create a new DBRP mapping](/influxdb/v2.4/query-data/influxql/dbrp/#create-dbrp-mappings) to
map the unmapped bucket.

## Create DBRP mappings for unmapped buckets

- Use the [`influx` CLI](/influxdb/v2.4/reference/cli/influx/) or the [InfluxDB API](/influxdb/v2.4/reference/api/)
to manually create DBRP mappings for unmapped buckets.
_For examples, see [Create DBRP mappings](/influxdb/v2.4/query-data/influxql/dbrp/#create-dbrp-mappings)._

## Query a mapped bucket with InfluxQL

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxQL shell](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}
<!---------------------------- BEGIN InfluxQL shell --------------------------->

The [`influx` CLI](/influxdb/v2.4/reference/cli/influx/) provides an [InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/) where you can execute InfluxQL queries in an interactive Read-Eval-Print-Loop (REPL).

1. If you haven't already, do the following:

   - [Download and install the `influx` CLI](/influxdb/v2.4/tools/influx-cli/#install-the-influx-cli)
   - [Configure your authentication credentials](/influxdb/v2.4/tools/influx-cli/#provide-required-authentication-credentials)

2. Use the following command to start an InfluxQL shell:

   ```sh
   influx v1 shell
   ```

3. Execute an InfluxQL query inside the InfluxQL shell.

   ```sql
   SELECT used_percent FROM example-db.example-rp.example-measurement WHERE host=host1
   ```

   For more information, see how to [use the InfluxQL shell](/influxdb/v2.4/tools/influxql-shell/). For more information about DBRP mappings, see [Manage DBRP mappings](/influxdb/v2.4/query-data/influxql/dbrp/).

<!----------------------------- END InfluxQL shell ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN InfluxDB API ---------------------------->

The [InfluxDB 1.x compatibility API](/influxdb/v2.4/reference/api/influxdb-1x/) supports
all InfluxDB 1.x client libraries and integrations in InfluxDB {{< current-version >}}.

1. To query a mapped bucket with InfluxQL, use the [`/query` 1.x compatibility endpoint](/influxdb/v2.4/reference/api/influxdb-1x/query/), and include the following in your request:

   - **Request method:** `GET`
   - **Headers:**
     - **Authorization:** _See [compatibility API authentication](/influxdb/v2.4/reference/api/influxdb-1x/#authentication)_
   - **Query parameters:**
     - **db**: 1.x database to query
     - **rp**: 1.x retention policy to query _(if no retention policy is specified, InfluxDB uses the default retention policy for the specified database)_
     - **q**: URL-encoded InfluxQL query

       {{% api/url-encode-note %}}

   ```sh
   curl --get http://localhost:8086/query?db=example-db \
     --header "Authorization: Token YourAuthToken" \
     --data-urlencode "q=SELECT used_percent FROM example-db.example-rp.example-measurement WHERE host=host1"
   ```

   By default, the `/query` compatibility endpoint returns results in **JSON**.

2. (Optional) To return results as **CSV**, include the `Accept: application/csv` header.

For more information about DBRP mappings, see [Manage DBRP mappings](/influxdb/v2.4/query-data/influxql/dbrp/).
<!------------------------------ END InfluxDB API ----------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## InfluxQL support

InfluxDB OSS 2.x supports the following InfluxQL statements and clauses. See supported and unsupported queries below.

{{< flex >}}
{{< flex-content >}}
{{% note %}}
##### Supported InfluxQL queries

- `DELETE`*
- `DROP MEASUREMENT`*
- `EXPLAIN ANALYZE`
- `SELECT` _(read-only)_
- `SHOW DATABASES`
- `SHOW SERIES`
- `SHOW MEASUREMENTS`
- `SHOW TAG KEYS`
- `SHOW FIELD KEYS`
- `SHOW SERIES EXACT CARDINALITY`
- `SHOW TAG KEY CARDINALITY`
- `SHOW FIELD KEY CARDINALITY`

\* These commands delete data.
{{% /note %}}
{{< /flex-content >}}
{{< flex-content >}}
{{% warn %}}

##### Unsupported InfluxQL queries

- `SELECT INTO`
- `ALTER`
- `CREATE`
- `DROP` _(limited support)_
- `GRANT`
- `KILL`
- `REVOKE`
- `SHOW SERIES CARDINALITY`
{{% /warn %}}
{{< /flex-content >}}
{{< /flex >}}
