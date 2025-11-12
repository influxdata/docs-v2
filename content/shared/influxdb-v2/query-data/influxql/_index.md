Use InfluxQL (an SQL-like query language) to interact with InfluxDB, and API features analyze your times series data.

In InfluxDB 1.x, data is stored in [databases](/influxdb/v1/concepts/glossary/#database)
and [retention policies](/influxdb/v1/concepts/glossary/#retention-policy-rp).
In InfluxDB OSS {{< current-version >}}, data is stored in [buckets](/influxdb/version/reference/glossary/#bucket).
Because InfluxQL uses the 1.x data model, a bucket must be mapped to a database and retention policy (DBRP) before it can be queried using InfluxQL.

**To query data with InfluxQL, complete the following steps:**

1. [Verify buckets have a mapping](#verify-buckets-have-a-mapping).
2. [Create DBRP mappings for unmapped buckets](#create-dbrp-mappings-for-unmapped-buckets).
3. [Query a mapped bucket with InfluxQL](#query-a-mapped-bucket-with-influxql).

{{% note %}}

#### InfluxQL reference documentation

For complete InfluxQL reference documentation, see the
[InfluxQL specification for InfluxDB 2.x](/influxdb/version/reference/syntax/influxql/spec/).
{{% /note %}}

## Verify buckets have a mapping

1. To verify the buckets you want to query are mapped to a database and retention policy, use the [`influx` CLI](/influxdb/version/reference/cli/influx/) or the [InfluxDB API](/influxdb/version/reference/api/).
   *For examples, see [List DBRP mappings](/influxdb/version/query-data/influxql/dbrp/#list-dbrp-mappings).*

2. If you **do not find a DBRP mapping for a bucket**, [create a new DBRP mapping](/influxdb/version/query-data/influxql/dbrp/#create-dbrp-mappings) to
   map the unmapped bucket.

## Create DBRP mappings for unmapped buckets

- Use the [`influx` CLI](/influxdb/version/reference/cli/influx/) or the [InfluxDB API](/influxdb/version/reference/api/)
  to manually create DBRP mappings for unmapped buckets.
  *For examples, see [Create DBRP mappings](/influxdb/version/query-data/influxql/dbrp/#create-dbrp-mappings).*

## Query a mapped bucket with InfluxQL

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxQL shell](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

<!---------------------------- BEGIN InfluxQL shell --------------------------->

The [`influx` CLI](/influxdb/version/reference/cli/influx/) provides an [InfluxQL shell](/influxdb/version/tools/influxql-shell/) where you can execute InfluxQL queries in an interactive Read-Eval-Print-Loop (REPL).

1. If you haven't already, do the following:

   - [Download and install the `influx` CLI](/influxdb/version/tools/influx-cli/#install-the-influx-cli)
   - [Configure your authentication credentials](/influxdb/version/tools/influx-cli/#provide-required-authentication-credentials)

2. Use the following command to start an InfluxQL shell:

   ```sh
   influx v1 shell
   ```

3. Execute an InfluxQL query inside the InfluxQL shell.

   ```sql
   SELECT used_percent FROM "example-db"."example-rp"."example-measurement" WHERE host=host1
   ```

   For more information, see how to [use the InfluxQL shell](/influxdb/version/tools/influxql-shell/). For more information about DBRP mappings, see [Manage DBRP mappings](/influxdb/version/query-data/influxql/dbrp/).

<!----------------------------- END InfluxQL shell ---------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!----------------------------- BEGIN InfluxDB API ---------------------------->

The [InfluxDB 1.x compatibility API](/influxdb/version/reference/api/influxdb-1x/) supports
all InfluxDB 1.x client libraries and integrations in InfluxDB {{< current-version >}}.

1. To query a mapped bucket with InfluxQL, use the [`/query` 1.x compatibility endpoint](/influxdb/version/reference/api/influxdb-1x/query/), and include the following in your request:

   - **Request method:** `GET`
   - **Headers:**
     - **Authorization:** *See [compatibility API authentication](/influxdb/version/reference/api/influxdb-1x/#authentication)*
   - **Query parameters:**
     - **db**: 1.x database to query
     - **rp**: 1.x retention policy to query *(if no retention policy is specified, InfluxDB uses the default retention policy for the specified database)*
     - **q**: URL-encoded InfluxQL query

       {{% api/url-encode-note %}}

   ```sh
   curl --get http://localhost:8086/query?db=example-db \
     --header "Authorization: Token YourAuthToken" \
     --data-urlencode "q=SELECT used_percent FROM \"example-db\".\"example-rp\".\"example-measurement\" WHERE host=host1"
   ```

   By default, the `/query` compatibility endpoint returns results in **JSON**.

2. (Optional) To return results as **CSV**, include the `Accept: application/csv` header.

For more information about DBRP mappings, see [Manage DBRP mappings](/influxdb/version/query-data/influxql/dbrp/).

<!------------------------------ END InfluxDB API ----------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## InfluxQL support

InfluxDB OSS 2.x supports the following InfluxQL statements and clauses. See supported and unsupported queries below.

{{< flex >}}
{{< flex-content >}}
{{% note %}}

##### Supported InfluxQL queries

- `DELETE`\*
- `DROP MEASUREMENT`\*
- `EXPLAIN ANALYZE`
- `SELECT` *(read-only)*
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
- `DROP` *(limited support)*
- `GRANT`
- `KILL`
- `REVOKE`
- `SHOW SERIES CARDINALITY`
  {{% /warn %}}
  {{< /flex-content >}}
  {{< /flex >}}
