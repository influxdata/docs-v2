
Use the InfluxDB v1 HTTP query API to query data in {{< product-name >}}
with InfluxQL.

The examples below use **cURL** to send HTTP requests to the InfluxDB v1 HTTP API,
but you can use any HTTP client.

> [!Warning]
> #### InfluxQL feature support
> 
> InfluxQL is being rearchitected to work with the InfluxDB 3 storage engine.
> This process is ongoing and some InfluxQL features are still being implemented.
> For information about the current implementation status of InfluxQL features,
> see [InfluxQL feature support](/influxdb3/version/reference/influxql/feature-support/).

Use the v1 `/query` endpoint and the `GET` request method to query data with InfluxQL:

{{< api-endpoint endpoint="http://{{< influxdb/host >}}/query" method="get" api-ref="/influxdb3/version/api/#tag/Query" >}}

Provide the following with your request:

- **Headers:**
  - **Authorization:** `Bearer AUTH_TOKEN`
- **Query parameters:**
  - **db**: the database to query
  - **rp**: Optional: the retention policy to query
  - **q**: URL-encoded InfluxQL query

{{% code-placeholders "(DATABASE|AUTH)_(NAME|TOKEN)" %}}
```sh
curl --get https://{{< influxdb/host >}}/query \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}

Replace the following configuration values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the [database](/influxdb3/version/admin/databases/) to query
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}{{% show-in "enterprise" %}} with read access to the database{{% /show-in %}}

## Return results as JSON or CSV

By default, the `/query` endpoint returns results in **JSON**, but it can also
return results in **CSV**. To return results as CSV, include the `Accept` header
with the `application/csv` or `text/csv` MIME type:

{{% code-placeholders "(DATABASE|AUTH)_(NAME|TOKEN)" %}}
```sh
curl --get https://{{< influxdb/host >}}/query \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Accept: application/csv" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM home"
```
{{% /code-placeholders %}}
