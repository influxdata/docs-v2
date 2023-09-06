---
title: Map databases and retention policies to buckets
description: >
  To query an an InfluxDB Cloud Serverless bucket with InfluxQL, first map each
  database and retention policy (DBRP) combination to a bucket.
menu:
  influxdb_cloud_serverless:
    name: DBRP mappings
    parent: Query with InfluxQL
weight: 101
---

InfluxQL requires a database and retention policy (DBRP) combination in order to query data.
In {{< product-name >}}, databases and retention policies are
combined and replaced by InfluxDB [buckets](/influxdb/cloud-serverless/reference/glossary/#bucket).
To query an {{< product-name >}} bucket with InfluxQL, first map each DBRP
combination to a bucket.

- [Automatic DBRP mapping](#automatic-dbrp-mapping)
- [Create DBRP mappings](#create-dbrp-mappings)
- [List DBRP mappings](#list-dbrp-mappings)
- [Update a DBRP mapping](#update-a-dbrp-mapping)
- [Delete a DBRP mapping](#delete-a-dbrp-mapping)

## Automatic DBRP mapping

{{< product-name >}} automatically creates DBRP mappings for you during the
following operations:

- Writing to the [`/write` v1 compatibility endpoint](/influxdb/cloud-serverless/guides/api-compatibility/v1/#write-data)
- [Upgrading from InfluxDB 1.x to InfluxDB Cloud](/influxdb/v2.7/upgrade/v1-to-cloud/)

For more information, see [Database and retention policy mapping](/influxdb/cloud-serverless/api/#tag/DBRPs).

## Create DBRP mappings

Use the [`influx` CLI](/influxdb/cloud-serverless/reference/cli/influx/) or the
[InfluxDB API](/influxdb/cloud-serverless/reference/api/) to create DBRP mappings.

{{% note %}}
#### A DBRP combination can only be mapped to a single bucket
Each unique DBRP combination can only be mapped to a single bucket.
If you map a DBRP combination that is already mapped to another bucket,
it will overwrite the existing DBRP mapping.
{{% /note %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp create` command](/influxdb/cloud-serverless/reference/cli/influx/v1/dbrp/create/)
to map a database and retention policy to a bucket.
Include the following:

{{< req type="key" >}}

- {{< req "\*" >}} **API token** to authenticate. We recommend setting your token to
  your active InfluxDB connection configuration in the `influx` CLI, so you don't
  have to add these parameters to each command.
  To set up your active InfluxDB configuration, see
  [`influx config set`](/influxdb/cloud-serverless/reference/cli/influx/config/set/).
- {{< req "\*" >}} **database name** to map
- {{< req "\*" >}} **retention policy** name to map
- {{< req "\*" >}} [Bucket ID](/influxdb/cloud-serverless/admin/buckets/view-buckets/#view-buckets-in-the-influxdb-ui) to map to
- **Default flag** to set the provided retention policy as the default retention policy for the database

{{% code-placeholders "(DATABASE|RETENTION_POLICY|BUCKET|API)_(NAME|TOKEN|ID)" %}}
```sh
influx v1 dbrp create \
  --token API_TOKEN \
  --db DATABASE_NAME \
  --rp RETENTION_POLICY_NAME \
  --bucket-id BUCKET_ID \
  --default
```
{{% /code-placeholders %}}

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps` API endpoint](/influxdb/cloud-serverless/api/#operation/PostDBRP)
to create a new DBRP mapping.

{{< api-endpoint endpoint="https://{{< influxdb/host >}}/api/v2/dbrps" method="POST" api-ref="/influxdb/cloud-serverless/api/#operation/PostDBRP" >}}

Include the following:

- **Request method:** `POST`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB [API token](/influxdb/cloud-serverless/admin/tokens/)
  - **Content-type:** `application/json`
- **Request body:** JSON object with the following fields:  
  {{< req type="key" >}}
  - {{< req "\*" >}} **bucketID:** [bucket ID](/influxdb/cloud-serverless/admin/buckets/view-buckets/)
  - {{< req "\*" >}} **database:** database name
  - **default:** set the provided retention policy as the default retention policy for the database
  - {{< req "\*" >}} **org** or **orgID:** organization name or [organization ID](/influxdb/cloud-serverless/admin/organizations/view-orgs/#view-your-organization-id)
  - {{< req "\*" >}} **retention_policy:** retention policy name

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

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## List DBRP mappings

Use the [`influx` CLI](/influxdb/cloud-serverless/reference/cli/influx/) or the
[InfluxDB HTTP API](/influxdb/cloud-serverless/reference/api/) to list all DBRP
mappings and verify the buckets you want to query are mapped to a database and
retention policy.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB HTTP API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp list` command](/influxdb/cloud-serverless/reference/cli/influx/v1/dbrp/list/)
to list DBRP mappings.

##### View all DBRP mappings
{{% code-placeholders "(DATABASE|RETENTION_POLICY|BUCKET|API|ORG)_(NAME|TOKEN|ID)" %}}
```sh
influx v1 dbrp list --token API_TOKEN
```

##### Filter DBRP mappings by database
```sh
influx v1 dbrp list \
  --token API_TOKEN \
  --db DATABASE_NAME
```

##### Filter DBRP mappings by bucket ID
```sh
influx v1 dbrp list \
  --token API_TOKEN \
  --bucket-id BUCKET_ID
```
{{% /code-placeholders %}}

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps` API endpoint](/influxdb/cloud-serverless/api/#operation/GetDBRPs) to list DBRP mappings.

{{< api-endpoint endpoint="https://{{< influxdb/host >}}/api/v2/dbrps" method="GET" api-ref="/influxdb/cloud-serverless/api/#operation/GetDBRPs" >}}

Include the following:

- **Request method:** `GET`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB [API token](/influxdb/cloud-serverless/admin/tokens/)
- **Query parameters:**  
  {{< req type="key" >}}
  - {{< req "\*" >}} **orgID:** [organization ID](/influxdb/cloud-serverless/admin/organizations/view-orgs/#view-your-organization-id)
  - **bucketID:** [bucket ID](/influxdb/cloud-serverless/admin/buckets/view-buckets/) _(to list DBRP mappings for a specific bucket)_
  - **database:** database name _(to list DBRP mappings with a specific database name)_
  - **rp:** retention policy name _(to list DBRP mappings with a specific retention policy name)_
  - **id:** DBRP mapping ID _(to list a specific DBRP mapping)_

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

## Update a DBRP mapping

Use the [`influx` CLI](/influxdb/cloud-serverless/reference/cli/influx/) or the
[InfluxDB HTTP API](/influxdb/cloud-serverless/reference/api/) to update a DBRP mapping.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB HTTP API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp update` command](/influxdb/cloud-serverless/reference/cli/influx/v1/dbrp/update/)
to update a DBRP mapping.
Include the following:

{{< req type="key" >}}

- {{< req "\*" >}} **API token** to authenticate. We recommend setting your token to
  your active InfluxDB connection configuration in the influx CLI, so you don't
  have to add these parameters to each command.
  To set up your active InfluxDB configuration, see
  [`influx config set`](/influxdb/cloud-serverless/reference/cli/influx/config/set/).
- {{< req "\*" >}} **DBRP mapping ID** to update
- **Retention policy** name to update to
- **Default flag** to set the retention policy as the default retention policy for the database

##### Update the default retention policy

{{% code-placeholders "(DBRP|RETENTION_POLICY|API)_(NAME|TOKEN|ID)" %}}
```sh
influx v1 dbrp update \
  --token API_TOKEN \
  --id DBRP_ID \
  --rp RETENTION_POLICY_NAME \
  --default
```
{{% /code-placeholders %}}

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps/{dbrpID}` API endpoint](/influxdb/cloud-serverless/api/#operation/GetDBRPs) to update DBRP mappings.

{{< api-endpoint endpoint="https://{{< influxdb/host >}}/api/v2/dbrps/{dbrpID}" method="PATCH" api-ref="/influxdb/cloud-serverless/api/#operation/PatchDBRPID" >}}

Include the following:

{{< req type="key" >}}

- **Request method:** `PATCH`
- **Headers:**
  - {{< req "\*" >}} **Authorization:** `Token` schema with your InfluxDB [API token](/influxdb/cloud-serverless/admin/tokens/)
- **Path parameters:**
  - {{< req "\*" >}} **id:** DBRP mapping ID to update
- **Query parameters:**  
  - {{< req "\*" >}} **orgID:** [organization ID](/influxdb/cloud-serverless/admin/organizations/view-orgs/#view-your-organization-id)
- **Request body (JSON):**
  - **rp:** retention policy name to update to
  - **default:** set the retention policy as the default retention policy for the database

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
{{% /tab-content %}}
{{% /tabs-wrapper %}}

## Delete a DBRP mapping

Use the [`influx` CLI](/influxdb/cloud-serverless/reference/cli/influx/) or the
[InfluxDB API](/influxdb/cloud-serverless/reference/api/) to delete a DBRP mapping.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp delete` command](/influxdb/cloud-serverless/reference/cli/influx/v1/dbrp/delete/)
to delete a DBRP mapping.
Include the following:

{{< req type="key" >}}

- {{< req "\*" >}} **API token** to authenticate. We recommend setting your token to
  your active InfluxDB connection configuration in the influx CLI, so you don't
  have to add these parameters to each command.
  To set up your active InfluxDB configuration, see
  [`influx config set`](/influxdb/cloud-serverless/reference/cli/influx/config/set/).
- {{< req "\*" >}} **DBRP mapping ID** to delete

{{% code-placeholders "(DBRP|API)_(TOKEN|ID)" %}}
```sh
influx v1 dbrp delete \
  --token API_TOKEN \
  --id DBRP_ID
```
{{% /code-placeholders %}}

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps/{dbrpID}` API endpoint](/influxdb/cloud-serverless/api/#operation/DeleteDBRPID)
to delete a DBRP mapping.

{{< api-endpoint endpoint="https://{{< influxdb/host >}}/api/v2/dbrps/{dbrpID}" method="DELETE" api-ref="/influxdb/cloud-serverless/api/#operation/DeleteDBRPID" >}}

Include the following:

{{< req type="key" >}}

- **Request method:** `PATCH`
- **Headers:**
  - {{< req "\*" >}} **Authorization:** `Token` schema with your InfluxDB
    [API token](/influxdb/cloud-serverless/admin/tokens/)
- **Path parameters:**
  - {{< req "\*" >}} **id:** DBRP mapping ID to update
- **Query parameters:**  
  - {{< req "\*" >}} **orgID:** [organization ID](/influxdb/cloud-serverless/admin/organizations/view-orgs/#view-your-organization-id)

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