---
title: Use the InfluxDB v1 HTTP API
description: >
  Use InfluxDB v1 API authentication, endpoints, and tools when bringing existing 1.x workloads to InfluxDB Cloud Serverless.
weight: 3
menu:
  influxdb3_cloud_serverless:
    parent: API compatibility
    name: v1 API
influxdb3/cloud-serverless/tags: [write, line protocol]
aliases:
  - /influxdb3/cloud-serverless/primers/api/v1/
  - /influxdb3/cloud-serverless/api-compatibility/v1/
  - /influxdb3/cloud-serverless/query-data/influxql/dbrp/
related:
  - /influxdb3/cloud-serverless/query-data/execute-queries/v1-http/
  - /influxdb3/cloud-serverless/write-data/api/v1-http/
  - /influxdb3/cloud-serverless/reference/api/
list_code_example: |
  <!-- pytest.mark.skip -->
  ```sh
  curl "https://{{< influxdb/host >}}/query" \
  --user "":"API_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "rp=RETENTION_POLICY" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
  ```
---

Use the InfluxDB v1 API `/write` and `/query` endpoints with v1 workloads that you bring to {{% product-name %}}.
The v1 endpoints work with username/password authentication and existing InfluxDB 1.x tools and code.

Learn how to authenticate requests, map databases and retention policies to buckets, adjust request parameters for existing v1 workloads, and find compatible tools for writing and querying data stored in an {{% product-name %}} database.

- [Authenticate API requests](#authenticate-api-requests)
  - [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)
  - [Authenticate with a token scheme](#authenticate-with-a-token-scheme)
- [Responses](#responses)
  - [Error examples](#error-examples)
- [Map v1 databases and retention policies to buckets](#map-v1-databases-and-retention-policies-to-buckets)
  - [Required permissions](#required-permissions)
  - [Default DBRP](#default-dbrp)
  - [Automatic DBRP mapping](#automatic-dbrp-mapping)
  - [Manage DBRPs](#manage-dbrps)
- [Write data](#write-data)
- [Query data](#query-data)
- [Bucket management with InfluxQL (not supported)](#bucket-management-with-influxql-not-supported)


## Authenticate API requests

{{% product-name %}} requires each API request to be authenticated with an
[API token](/influxdb3/cloud-serverless/admin/tokens/).
With InfluxDB v1-compatible endpoints in InfluxDB 3, you can use API tokens in InfluxDB 1.x username and password
schemes or in the InfluxDB v2 `Authorization: Token` scheme.

- [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)
- [Authenticate with a token scheme](#authenticate-with-a-token-scheme)

### Authenticate with a username and password scheme

With InfluxDB v1-compatible endpoints, you can use the InfluxDB 1.x convention of
username and password to authenticate bucket reads and writes by passing an [API token](/influxdb3/cloud-serverless/admin/tokens/) as the `password` credential.
When authenticating requests to the v1 API `/write` and `/query` endpoints, {{% product-name %}} checks that the `password` (`p`) value is an authorized [API token](/influxdb3/cloud-serverless/admin/tokens/).
{{% product-name %}} ignores the `username` (`u`) parameter in the request.

Use one of the following authentication schemes with clients that support Basic authentication or query parameters (that don't support [token authentication](#authenticate-with-a-token)):

- [Basic authentication](#basic-authentication)
- [Query string authentication](#query-string-authentication)

#### Basic authentication

Use the `Authorization` header with the `Basic` scheme to authenticate v1 API `/write` and `/query` requests.
When authenticating requests, {{% product-name %}} checks that the `password` part of the decoded credential is an authorized [API token](/influxdb3/cloud-serverless/admin/tokens/).
{{% product-name %}} ignores the `username` part of the decoded credential.

##### Syntax

```http
Authorization: Basic <base64-encoded [USERNAME]:API_TOKEN>
```

Encode the `[USERNAME]:DATABASE_TOKEN` credential using base64 encoding, and then append the encoded string to the `Authorization: Basic` header.

{{% api/v1-compat/basic-auth-syntax %}}

##### Example

The following example shows how to use cURL with the `Basic` authentication scheme and a [token](/influxdb3/cloud-serverless/admin/tokens/):

{{% code-placeholders "DATABASE_NAME|API_TOKEN|RETENTION_POLICY" %}}
```sh
#######################################
# Use Basic authentication with a database token
# to query the InfluxDB v1 API
#######################################

curl "https://{{< influxdb/host >}}/query" \
  --user "":"API_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "rp=RETENTION_POLICY" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} [bucket](/influxdb3/cloud-serverless/admin/buckets/)
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: your {{% product-name %}} retention policy
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb3/cloud-serverless/admin/tokens/) with sufficient permissions to the mapped bucket

#### Query string authentication

In the URL, pass the `p` query parameter to authenticate `/write` and `/query` requests.
When authenticating requests, {{% product-name %}} checks that the `p` (_password_) value is an authorized API token and ignores the `u` (_username_) parameter.

##### Syntax

```http
https://{{< influxdb/host >}}/query/?u=any&p=API_TOKEN
https://{{< influxdb/host >}}/write/?u=any&p=API_TOKEN
```

##### Example

The following example shows how to use cURL with query string authentication and a [token](/influxdb3/cloud-serverless/admin/tokens/).

{{% code-placeholders "BUCKET_NAME|API_TOKEN|RETENTION_POLICY" %}}
```sh
#######################################
# Use an InfluxDB 1.x compatible username and password
# to query the InfluxDB v1 API
#######################################

curl --get "https://{{< influxdb/host >}}/query" \
  --data-urlencode "p=API_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "rp=RETENTION_POLICY" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the [database](#map-databases-and-retention-policies-to-buckets)
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: the [retention policy](#map-databases-and-retention-policies-to-buckets)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb3/cloud-serverless/admin/tokens/) with sufficient permissions to the mapped bucket

### Authenticate with a token scheme

Use the `Authorization: Token` scheme to pass a [token](/influxdb3/cloud-serverless/admin/tokens/) for authenticating
v1 API `/write` and `/query` requests.

Include the word `Token`, a space, and your **token** value (all case-sensitive).

#### Syntax

```http
Authorization: Token API_TOKEN
```

#### Examples

Use `Token` to authenticate a write request:

{{% code-placeholders "BUCKET_NAME|API_TOKEN|RETENTION_POLICY" %}}
```sh
########################################################
# Use the Token authorization scheme with v1 /write
# to write data.
########################################################

curl -i "https://{{< influxdb/host >}}/write?db=DATABASE_NAME&rp=RETENTION_POLICY&precision=ms" \
    --header "Authorization: Token API_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1682358973500'
```

<!-- after-test
```sh
influx bucket delete -n DATABASE_NAME/RETENTION_POLICY_NAME
```
-->
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the [database](#map-databases-and-retention-policies-to-buckets)
- {{% code-placeholder-key %}}`RETENTION_POLICY`{{% /code-placeholder-key %}}: the [retention policy](#map-databases-and-retention-policies-to-buckets)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb3/cloud-serverless/admin/tokens/) with sufficient permissions to the mapped bucket

## Responses

InfluxDB HTTP API responses use standard [HTTP status codes](/influxdb3/cloud-serverless/api/#tag/Response-codes).
The response body for [partial writes](/influxdb3/cloud-serverless/write-data/troubleshoot/#troubleshoot-rejected-points) and errors contains a JSON object with `code` and `message` properties that describe the error.
Response body messages may differ across {{% product-name %}} v1 API, v2 API, InfluxDB Cloud, and InfluxDB OSS.

### Error examples

- **Invalid namespace name**:

  ```http
  400 Bad Request
  ```

  ```json
  { "code":"invalid",
    "message":"namespace name length must be between 1 and 64 characters"
  }
  ```

  The `?db=` parameter value is missing in the request.
  Provide the [DBRP database name](#map-v1-databases-and-retention-policies-to-buckets).


- **Failed to deserialize db/rp/precision**

    ```http
  400 Bad Request
  ```

  ```json
  { "code": "invalid",
    "message": "failed to deserialize db/rp/precision in request: unknown variant `u`, expected one of `s`, `ms`, `us`, `ns`"
  }
  ```

  The `?precision=` parameter contains an unknown value.
  Provide a [timestamp precision](#timestamp-precision).

## Map v1 databases and retention policies to buckets

Before you can write data using the InfluxDB v1 `/write` endpoint or query data using the v1 `/query` endpoint, the bucket must be mapped to a [database retention policy (DBRP)](/influxdb3/cloud-serverless/admin/dbrps/) combination.

> [!Note]
> To query using Flight with InfluxQL or SQL, you don't need to map DBRPs to buckets.

In InfluxDB 1.x, data is stored in [databases](/influxdb3/cloud-serverless/reference/glossary/#database)
and [retention policies](/influxdb3/cloud-serverless/reference/glossary/#retention-period).
In {{% product-name %}}, the concepts of database and retention policy have been merged into
_buckets_, where buckets have a [retention period](/influxdb3/cloud-serverless/reference/glossary/#retention-period), but retention policies are no longer part of the data model.

InfluxDB can [automatically map buckets to DBRPs](#automatic-dbrp-mapping) for you or you can [manage DBRP mappings](#manage-dbrps) yourself using the `influx v1 dbrp` CLI commands or the InfluxDB v2 API `/api/v2/dbrps` endpoints.

- [Authenticate API requests](#authenticate-api-requests)
  - [Authenticate with a username and password scheme](#authenticate-with-a-username-and-password-scheme)
  - [Authenticate with a token scheme](#authenticate-with-a-token-scheme)
- [Responses](#responses)
  - [Error examples](#error-examples)
- [Map v1 databases and retention policies to buckets](#map-v1-databases-and-retention-policies-to-buckets)
  - [Required permissions](#required-permissions)
  - [Default DBRP](#default-dbrp)
  - [Automatic DBRP mapping](#automatic-dbrp-mapping)
  - [Manage DBRPs](#manage-dbrps)
- [Write data](#write-data)
- [Query data](#query-data)
- [Bucket management with InfluxQL (not supported)](#bucket-management-with-influxql-not-supported)

### Required permissions

Managing DBRP mappings requires a [token](/influxdb3/cloud-serverless/admin/tokens/) with the necessary permissions.

- **write dbrp**: to create (automatically or manually), update, or delete DBRP mappings.
- **read dbrp**: to list DBRP mappings
- **write bucket**: to automatically create a bucket for a DBRP mapping when using the v1 write API

> [!Note]
> #### Permission required to create mapped buckets
> If you use the v1 write API to write to a database (`db`) and retention policy (`rp`) combination that doesn't exist, InfluxDB tries to create a new bucket using the specified parameter values.
> If the token doesn't have permission to create a bucket, then the write request fails with an authorization error.

### Default DBRP

Each unique database name in DBRP mappings has a **default** mapping (the `default` property is equal to `true`).
If you send a request to the v1 `/write` or v1 `/query` endpoint and don't specify a retention policy name (`rp=`),
then InfluxDB uses the database's default DBRP mapping to determine the bucket.

### Automatic DBRP mapping

{{< product-name >}} automatically creates DBRP mappings for you during the
following operations:

- [Writing to the v1 `/write` endpoint](/influxdb3/cloud-serverless/write-data/api/v1-http/)
- [Migrating from InfluxDB 1.x to {{% product-name %}}](/influxdb3/cloud-serverless/guides/migrate-data/migrate-1x-to-v3/)

For InfluxDB to automatically create DBRP mappings and buckets, you must use a [token](/influxdb3/cloud-serverless/admin/tokens/) that has write permissions for DBRPs and buckets.

Auto-generated buckets use the [name syntax for mapped buckets](/influxdb3/cloud-serverless/guides/api-compatibility/v1/#name-syntax-for-mapped-buckets) and a default retention period equal to the bucket's created date minus 3 days.
To set a bucket's retention period, see how to [update a bucket](/influxdb3/cloud-serverless/admin/buckets/update-bucket/).

#### Name syntax for mapped buckets

InfluxDB uses the following naming convention to map database and retention policy names to bucket names:

```text
DATABASE_NAME/RETENTION_POLICY_NAME
```

#### Bucket naming examples

| v1 Database name | v1 Retention Policy name | Bucket name         |
| :--------------- | :----------------------- | :------------------------ |
| db               | rp                       | db/rp                     |
| telegraf         | autogen                  | telegraf/autogen          |
| webmetrics       | 1w-downsampled           | webmetrics/1w-downsampled |

> [!Note]
> To avoid having to add configuration parameters to each CLI command, [set up an active InfluxDB configuration](/influxdb3/cloud-serverless/reference/cli/influx/config/set/).

### Manage DBRPs

#### Create DBRP mappings

To create DBRP mappings, use the `influx` CLI or the
InfluxDB HTTP API.

> [!Note]
> #### A DBRP combination can only be mapped to a single bucket
> 
> Each unique DBRP combination can only be mapped to a single bucket.
> If you map a DBRP combination that is already mapped to another bucket,
> it overwrites the existing DBRP mapping.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp create` command](/influxdb3/cloud-serverless/reference/cli/influx/v1/dbrp/create/)
to map a database and retention policy to a bucket.
Include the following:

{{< req type="key" >}}

- {{< req "\*" >}} a [token](/influxdb3/cloud-serverless/admin/tokens/) that has the [necessary permissions](#authorization).
- {{< req "\*" >}} the **database name** to map
- {{< req "\*" >}} the **retention policy** name to map
- {{< req "\*" >}} the [bucket ID](/influxdb3/cloud-serverless/admin/buckets/view-buckets/#view-buckets-in-the-influxdb-ui) to map to
- **Default flag** to set the provided retention policy as the [default DBRP mapping](#default-dbrp) for the database.

<!-- before-test
```sh
influx bucket create -n DATABASE_NAME -r 24h
INFLUX_BUCKET_ID=$(influx bucket list -n DATABASE_NAME | grep 24h0m0s | cut -b 1-16)
```
-->

<!--pytest-codeblocks:cont-->

{{% code-placeholders "(DATABASE|RETENTION_POLICY|BUCKET|API)_(NAME|TOKEN|ID)" %}}
```sh
influx v1 dbrp create \
  --token API_TOKEN \
  --org ORG_ID \
  --db DATABASE_NAME \
  --rp RETENTION_POLICY_NAME \
  --bucket-id BUCKET_ID \
  --default
```

<!--pytest-codeblocks:cont-->

<!-- after-test
```sh
test_dbrp=$(influx v1 dbrp list --db DATABASE_NAME --rp RETENTION_POLICY_NAME | grep DATABASE_NAME | cut -b 1-16)
influx v1 dbrp delete --id $test_dbrp
```
-->


{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb3/cloud-serverless/admin/tokens/) that has the [necessary permissions](#authorization)
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the database name to map to the bucket
- {{% code-placeholder-key %}}`RETENTION_POLICY_NAME`{{% /code-placeholder-key %}}: the retention policy name to map to the bucket
- {{% code-placeholder-key %}}`BUCKET_ID`{{% /code-placeholder-key %}}: the [bucket ID](/influxdb3/cloud-serverless/admin/buckets/view-buckets/) to map to

The output is the DBRP.

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps` API endpoint](/influxdb3/cloud-serverless/api/#operation/PostDBRP)
to create a new DBRP mapping.

{{< api-endpoint endpoint="https://{{< influxdb/host >}}/api/v2/dbrps" method="POST" api-ref="/influxdb3/cloud-serverless/api/#operation/PostDBRP" >}}

Include the following:

- **Request method:** `POST`
- **Headers:**
  - **Authorization:** `Token` scheme with a [token](/influxdb3/cloud-serverless/admin/tokens/) that has the [necessary permissions](#authorization)
  - **Content-type:** `application/json`
- **Request body:** JSON object with the following fields:

  - **bucketID:** the [bucket ID](/influxdb3/cloud-serverless/admin/buckets/view-buckets/) to map to
  - **database:** the database name to map to the bucket
  - **org** or **orgID:** your organization name or [organization ID](/influxdb3/cloud-serverless/admin/organizations/view-orgs/#view-your-organization-id)
  - **retention_policy:** the retention policy name to map to the bucket
  - Optional: **default:** `true` sets the database name's [default DBRP mapping](#default-dbrp).

{{% code-placeholders "(DATABASE|RETENTION_POLICY|BUCKET|API|ORG)_(NAME|TOKEN|ID)" %}}
```sh
curl --request POST https://{{< influxdb/host >}}/api/v2/dbrps \
  --header "Authorization: Token API_TOKEN" \
  --header 'Content-type: application/json' \
  --data '{
        "bucketID": "BUCKET_ID",
        "database": "DATABASE_NAME",
        "default": true,
        "orgID": "ORG_ID",
        "retention_policy": "RETENTION_POLICY_NAME"
      }'
```
{{% /code-placeholders %}}

If successful, the response status code is `201: Created` and the response body contains the DBRP.

{{% /tab-content %}}
{{< /tabs-wrapper >}}

#### List DBRP mappings

Use the [`influx` CLI](/influxdb3/cloud-serverless/reference/cli/influx/) or the
[InfluxDB HTTP API](/influxdb3/cloud-serverless/reference/api/) to list all DBRP
mappings and verify that the buckets you want to query are mapped to a database and
retention policy.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB HTTP API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp list` command](/influxdb3/cloud-serverless/reference/cli/influx/v1/dbrp/list/)
to list DBRP mappings.

##### View all DBRP mappings
{{% code-placeholders "(DATABASE|RETENTION_POLICY|BUCKET|API|ORG)_(NAME|TOKEN|ID)" %}}
```sh
influx v1 dbrp list --token API_TOKEN --org ORG_ID \
```

##### Filter DBRP mappings by database
```sh
influx v1 dbrp list \
  --token API_TOKEN \
  --org ORG_ID \
  --db DATABASE_NAME
```

##### Filter DBRP mappings by bucket ID

<!-- before-test
```sh
INFLUX_BUCKET_ID=$(influx bucket list -n DATABASE_NAME | grep 24h | cut -b 1-16)
```
-->

<!--pytest-codeblocks:cont-->

```sh
influx v1 dbrp list \
  --token API_TOKEN \
  --org ORG_ID \
  --bucket-id BUCKET_ID
```
{{% /code-placeholders %}}

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps` API endpoint](/influxdb3/cloud-serverless/api/#operation/GetDBRPs) to list DBRP mappings.

{{< api-endpoint endpoint="https://{{< influxdb/host >}}/api/v2/dbrps" method="GET" api-ref="/influxdb3/cloud-serverless/api/#operation/GetDBRPs" >}}

Include the following:

- **Request method:** `GET`
- **Headers:**
  - **Authorization:** `Token` scheme with your [token](/influxdb3/cloud-serverless/admin/tokens/) that has the [necessary permissions](#authorization)
- **Query parameters:**
  {{< req type="key" >}}
  - {{< req "\*" >}} **orgID:** your [organization ID](/influxdb3/cloud-serverless/admin/organizations/view-orgs/#view-your-organization-id)
  - **bucketID:** a [bucket ID](/influxdb3/cloud-serverless/admin/buckets/view-buckets/) _(to list DBRP mappings for a specific bucket)_
  - **database:** a database name _(to list DBRP mappings with a specific database name)_
  - **rp:** a retention policy name _(to list DBRP mappings with a specific retention policy name)_
  - **id:** a DBRP mapping ID _(to list a specific DBRP mapping)_

{{% code-placeholders "(DATABASE|RETENTION_POLICY|BUCKET|API|ORG)_(NAME|TOKEN|ID)" %}}

##### View all DBRP mappings

```sh
curl --request GET \
  https://{{< influxdb/host >}}/api/v2/dbrps \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "orgID=ORG_ID"
```

##### Filter DBRP mappings by database

```sh
curl --request GET \
  https://{{< influxdb/host >}}/api/v2/dbrps \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "orgID=ORG_ID" \
  --data-urlencode  "db=DATABASE_NAME"
```

##### Filter DBRP mappings by bucket ID

```sh
curl --request GET \
  https://{{< influxdb/host >}}/api/v2/dbrps \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "orgID=ORG_ID" \
  --data-urlencode  "bucketID=BUCKET_ID"
```
{{% /code-placeholders %}}

{{% /tab-content %}}
{{% /tabs-wrapper %}}

#### Update a DBRP mapping

Use the [`influx` CLI](/influxdb3/cloud-serverless/reference/cli/influx/) or the
[InfluxDB HTTP API](/influxdb3/cloud-serverless/reference/api/) to update a DBRP mapping--for example, to change the retention policy name or set the mapping as the [default](#default-dbrp) for the database name.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB HTTP API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp update` command](/influxdb3/cloud-serverless/reference/cli/influx/v1/dbrp/update/)
to update a DBRP mapping.
Include the following:

- a [token](/influxdb3/cloud-serverless/admin/tokens/) that has the [necessary permissions](#authorization)
- **DBRP mapping ID** to update
- Optional: **Retention policy** name to update to
- Optional: **Default flag** to set the retention policy as the [default DBRP mapping](#default-dbrp) for the database name.

<!-- before-test
```sh
INFLUX_BUCKET_ID=$(influx bucket list -n DATABASE_NAME | grep 24h | cut -b 1-16)
influx v1 dbrp create --bucket-id $INFLUX_BUCKET_ID --db DATABASE_NAME --rp RETENTION_POLICY
dbrp_id=$(influx v1 dbrp list --bucket-id $INFLUX_BUCKET_ID --db DATABASE_NAME --rp RETENTION_POLICY \
 | grep RETENTION_POLICY | cut -b 1-16)
INFLUX_DBRP_ID="$dbrp_id"
```
-->

<!--pytest-codeblocks:cont-->

##### Update the default retention policy

{{% code-placeholders "(DBRP|RETENTION_POLICY|API|ORG)_(NAME|TOKEN|ID)" %}}
```sh
influx v1 dbrp update \
  --token API_TOKEN \
  --org ORG_ID \
  --id DBRP_ID \
  --rp RETENTION_POLICY_NAME \
  --default
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb3/cloud-serverless/admin/tokens/) that has the [necessary permissions](#authorization)
- {{% code-placeholder-key %}}`DBRP_ID`{{% /code-placeholder-key %}}: the DBRP ID to update
- {{% code-placeholder-key %}}`RETENTION_POLICY_NAME`{{% /code-placeholder-key %}}: a retention policy name to map to the bucket

The output is the DBRP.

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps/{dbrpID}` API endpoint](/influxdb3/cloud-serverless/api/#operation/GetDBRPs) to update DBRP mappings.

{{< api-endpoint endpoint="https://{{< influxdb/host >}}/api/v2/dbrps/{dbrpID}" method="PATCH" api-ref="/influxdb3/cloud-serverless/api/#operation/PatchDBRPID" >}}

Include the following:

{{< req type="key" >}}

- **Request method:** `PATCH`
- **Headers:**
  - {{< req "\*" >}} the **Authorization:** `Token` scheme with a [token](/influxdb3/cloud-serverless/admin/tokens/) that has the [necessary permissions](#authorization)
- **Path parameters:**
  - {{< req "\*" >}} **id:** the DBRP mapping ID to update
- **Query parameters:**
  - {{< req "\*" >}} **orgID:** your [organization ID](/influxdb3/cloud-serverless/admin/organizations/view-orgs/#view-your-organization-id)
- **Request body (JSON):**
  - **rp:** retention policy name to update to
  - **default:** set the retention policy as the [default DBRP mapping](#default-dbrp) for the database name

##### Update the default retention policy

{{% code-placeholders "(DBRP|RETENTION_POLICY|API|ORG)_(NAME|TOKEN|ID)" %}}
```sh
curl --request PATCH \
  https://{{< influxdb/host >}}/api/v2/dbrps/DBRP_ID \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "orgID=ORG_ID" \
  --data '{
      "rp": "RETENTION_POLICY_NAME",
      "default": true
    }'
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb3/cloud-serverless/admin/tokens/) that has the [necessary permissions](#authorization)
- {{% code-placeholder-key %}}`DBRP_ID`{{% /code-placeholder-key %}}: the DBRP ID to update
- {{% code-placeholder-key %}}`RETENTION_POLICY_NAME`{{% /code-placeholder-key %}}: a retention policy name to map to the bucket

The output is the DBRP.
{{% /tab-content %}}
{{% /tabs-wrapper %}}

#### Delete a DBRP mapping

Use the [`influx` CLI](/influxdb3/cloud-serverless/reference/cli/influx/) or the
[InfluxDB API](/influxdb3/cloud-serverless/reference/api/) to delete a DBRP mapping.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp delete` command](/influxdb3/cloud-serverless/reference/cli/influx/v1/dbrp/delete/)
to delete a DBRP mapping.
Include the following:

{{< req type="key" >}}

- {{< req "\*" >}} a [token](/influxdb3/cloud-serverless/admin/tokens/) that has the [necessary permissions](#authorization)
- {{< req "\*" >}} **DBRP mapping ID** to delete


<!-- before-test
```sh
INFLUX_BUCKET_ID=$(influx bucket list -n DATABASE_NAME | grep 24h | cut -b 1-16)
influx v1 dbrp create --bucket-id $INFLUX_BUCKET_ID --db DATABASE_NAME --rp RETENTION_POLICY
dbrp_id=$(influx v1 dbrp list --bucket-id $INFLUX_BUCKET_ID --db DATABASE_NAME --rp RETENTION_POLICY \
 | grep RETENTION_POLICY | cut -b 1-16)
INFLUX_DBRP_ID="$dbrp_id"
```
-->

<!--pytest-codeblocks:cont-->

{{% code-placeholders "(DBRP|API)_(TOKEN|ID)" %}}
```sh
influx v1 dbrp delete \
  --token API_TOKEN \
  --org ORG_ID \
  --id DBRP_ID
```
{{% /code-placeholders %}}

The output is the DBRP.

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps/{dbrpID}` API endpoint](/influxdb3/cloud-serverless/api/#operation/DeleteDBRPID)
to delete a DBRP mapping.

{{< api-endpoint endpoint="https://{{< influxdb/host >}}/api/v2/dbrps/{dbrpID}" method="DELETE" api-ref="/influxdb3/cloud-serverless/api/#operation/DeleteDBRPID" >}}

Include the following:

{{< req type="key" >}}

- **Request method:** `DELETE`
- **Headers:**
  - {{< req "\*" >}} the **Authorization:** `Token` scheme with a [token](/influxdb3/cloud-serverless/admin/tokens/) that has the [necessary permissions](#authorization)
- **Path parameters:**
  - {{< req "\*" >}} **id:** DBRP mapping ID to update
- **Query parameters:**
  - {{< req "\*" >}} **orgID:** [organization ID](/influxdb3/cloud-serverless/admin/organizations/view-orgs/#view-your-organization-id)

{{% code-placeholders "(DBRP|API|ORG)_(TOKEN|ID)" %}}
```sh
curl --request DELETE \
  https://{{< influxdb/host >}}/api/v2/dbrps/DBRP_ID \
  --header "Authorization: Token API_TOKEN" \
  --data-urlencode "orgID=ORG_ID"
```
{{% /code-placeholders %}}
{{% /tab-content %}}
{{% /tabs-wrapper %}}

Replace the following:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a [token](/influxdb3/cloud-serverless/admin/tokens/) that has the [necessary permissions](#authorization)
- {{% code-placeholder-key %}}`DBRP_ID`{{% /code-placeholder-key %}}: the DBRP ID to update
- {{% code-placeholder-key %}}`ORG_ID`{{% /code-placeholder-key %}}: the [organization ID](/influxdb3/cloud-serverless/admin/organizations/view-orgs/#view-your-organization-id)

## Write data

See how to [use the {{% product-name %}} HTTP write API](/influxdb3/cloud-serverless/write-data/api/v1-http/) for InfluxDB v1 or v1.x-compatibility workloads.

## Query data

See how to [use the {{% product-name %}} HTTP query API](/influxdb3/cloud-serverless/query-data/execute-queries/v1-http/) for InfluxDB v1 or v1.x-compatibility workloads.

## Bucket management with InfluxQL (not supported)

{{% product-name %}} doesn't allow InfluxQL commands for managing or modifying buckets.
You can't use the following InfluxQL commands:

```sql
SELECT INTO
CREATE
DELETE
DROP
GRANT
EXPLAIN
REVOKE
ALTER
SET
KILL
```

<!-- after-test
```sh
influx bucket delete -n DATABASE_NAME
influx bucket delete -n DATABASE_NAME/RETENTION_POLICY_NAME; exit 0
```
-->