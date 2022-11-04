---
title: Manage DBRP mappings
seotitle: Manage database and retention policy mappings
description: >
  Create and manage database and retention policy (DBRP) mappings to use
  InfluxQL to query InfluxDB buckets.
menu:
  influxdb_2_4:
    parent: Query with InfluxQL
weight: 210
influxdb/v2.4/tags: [influxql, dbrp]
---

InfluxQL requires a database and retention policy (DBRP) combination in order to query data.
In InfluxDB {{< current-version >}}, databases and retention policies have been
combined and replaced by InfluxDB [buckets](/influxdb/v2.4/reference/glossary/#bucket).
To query InfluxDB {{< current-version >}} with InfluxQL, the specified DBRP
combination must be mapped to a bucket.

- [Automatic DBRP mapping](#automatic-dbrp-mapping)
- {{% oss-only %}}[Virtual DBRP mappings](#virtual-dbrp-mappings){{% /oss-only %}}
- [Create DBRP mappings](#create-dbrp-mappings)
- [List DBRP mappings](#list-dbrp-mappings)
- [Update a DBRP mapping](#update-a-dbrp-mapping)
- [Delete a DBRP mapping](#delete-a-dbrp-mapping)

## Automatic DBRP mapping

InfluxDB {{< current-version >}} will automatically create DBRP mappings for you
during the following operations:

- Writing to the [`/write` v1 compatibility endpoint](/influxdb/v2.4/reference/api/influxdb-1x/write/)
- {{% cloud-only %}}[Upgrading from InfluxDB 1.x to InfluxDB Cloud](/influxdb/v2.4/upgrade/v1-to-cloud/){{% /cloud-only %}}
- {{% oss-only %}}[Upgrading from InfluxDB 1.x to {{< current-version >}}](/influxdb/v2.4/upgrade/v1-to-v2/){{% /oss-only %}}
- {{% oss-only %}}Creating a bucket ([virtual DBRPs](#virtual-dbrp-mappings)){{% /oss-only %}}

For more information, see [Database and retention policy mapping](/influxdb/v2.4/reference/api/influxdb-1x/dbrp/).

{{% oss-only %}}

## Virtual DBRP mappings

InfluxDB {{< current-version >}} provides "virtual" DBRP mappings for any bucket
that does not have an explicit DBRP mapping associated with it.
Virtual DBRP mappings use the bucket name to provide a DBRP mapping that can be
used without having to explicitly define a mapping.

Virtual DBRP mappings are read-only.
To override a virtual DBRP mapping, [create an explicit mapping](#create-dbrp-mappings).

For information about how virtual DBRP mappings are created, see
[Database and retention policy mapping – When creating a bucket](/influxdb/v2.4/reference/api/influxdb-1x/dbrp/#when-creating-a-bucket).

{{% /oss-only %}}

## Create DBRP mappings

Use the [`influx` CLI](/influxdb/v2.4/reference/cli/influx/) or the
[InfluxDB API](/influxdb/v2.4/reference/api/) to create DBRP mappings.

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

Use the [`influx v1 dbrp create` command](/influxdb/v2.4/reference/cli/influx/v1/dbrp/create/)
to map an unmapped bucket to a database and retention policy.
Include the following:

{{< req type="key" >}}

- {{< req "\*" >}} **org** and **token** to authenticate. We recommend setting your organization and token to your active InfluxDB connection configuration in the influx CLI, so you don't have to add these parameters to each command. To set up your active InfluxDB configuration, see [`influx config set`](/influxdb/v2.4/reference/cli/influx/config/set/).
- {{< req "\*" >}} **database name** to map
- {{< req "\*" >}} **retention policy** name to map
- {{< req "\*" >}} [Bucket ID](/influxdb/v2.4/organizations/buckets/view-buckets/#view-buckets-in-the-influxdb-ui) to map to
- **Default flag** to set the provided retention policy as the default retention policy for the database

```sh
influx v1 dbrp create \
  --db example-db \
  --rp example-rp \
  --bucket-id 00oxo0oXx000x0Xo \
  --default
```

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps` API endpoint](/influxdb/v2.4/api/#operation/PostDBRP) to create a new DBRP mapping.

<a href="/influxdb/v2.4/api/#operation/PostDBRP">
{{< api-endpoint endpoint="http://localhost:8086/api/v2/dbrps" method="POST" >}}
</a>

Include the following:

- **Request method:** `POST`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB [API token](/influxdb/v2.4/security/tokens/)
  - **Content-type:** `application/json`
- **Request body:** JSON object with the following fields:  
  {{< req type="key" >}}
  - {{< req "\*" >}} **bucketID:** [bucket ID](/influxdb/v2.4/organizations/buckets/view-buckets/)
  - {{< req "\*" >}} **database:** database name
  - **default:** set the provided retention policy as the default retention policy for the database
  - {{< req "\*" >}} **org** or **orgID:** organization name or [organization ID](/influxdb/v2.4/organizations/view-orgs/#view-your-organization-id)
  - {{< req "\*" >}} **retention_policy:** retention policy name

<!--  -->
```sh
curl --request POST http://localhost:8086/api/v2/dbrps \
  --header "Authorization: Token YourAuthToken" \
  --header 'Content-type: application/json' \
  --data '{
        "bucketID": "00oxo0oXx000x0Xo",
        "database": "example-db",
        "default": true,
        "orgID": "00oxo0oXx000x0Xo",
        "retention_policy": "example-rp"
      }'
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## List DBRP mappings

Use the [`influx` CLI](/influxdb/v2.4/reference/cli/influx/) or the [InfluxDB API](/influxdb/v2.4/reference/api/)
to list all DBRP mappings and verify the buckets you want to query are mapped
to a database and retention policy.

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp list` command](/influxdb/v2.4/reference/cli/influx/v1/dbrp/list/) to list DBRP mappings.

{{% note %}}
The examples below assume that your organization and API token are
provided by the active [InfluxDB connection configuration](/influxdb/v2.4/reference/cli/influx/config/) in the `influx` CLI.
If not, include your organization (`--org`) and API token (`--token`) with each command.
{{% /note %}}

##### View all DBRP mappings
```sh
influx v1 dbrp list
```

##### Filter DBRP mappings by database
```sh
influx v1 dbrp list --db example-db
```

##### Filter DBRP mappings by bucket ID
```sh
influx v1 dbrp list --bucket-id 00oxo0oXx000x0Xo
```
{{% /tab-content %}}
{{% tab-content %}}
Use the [`/api/v2/dbrps` API endpoint](/influxdb/v2.4/api/#operation/GetDBRPs) to list DBRP mappings.

<a href="/influxdb/v2.4/api/#operation/GetDBRPs">
{{< api-endpoint endpoint="http://localhost:8086/api/v2/dbrps" method="GET" >}}
</a>

Include the following:

- **Request method:** `GET`
- **Headers:**
  - **Authorization:** `Token` schema with your InfluxDB [API token](/influxdb/v2.4/security/tokens/)
- **Query parameters:**  
  {{< req type="key" >}}
  - {{< req "\*" >}} **orgID:** [organization ID](/influxdb/v2.4/organizations/view-orgs/#view-your-organization-id)
  - **bucketID:** [bucket ID](/influxdb/v2.4/organizations/buckets/view-buckets/) _(to list DBRP mappings for a specific bucket)_
  - **database:** database name _(to list DBRP mappings with a specific database name)_
  - **rp:** retention policy name _(to list DBRP mappings with a specific retention policy name)_
  - **id:** DBRP mapping ID _(to list a specific DBRP mapping)_

##### View all DBRP mappings
```sh
curl --request GET \
  http://localhost:8086/api/v2/dbrps?orgID=00oxo0oXx000x0Xo \
  --header "Authorization: Token YourAuthToken"
```

##### Filter DBRP mappings by database
```sh
curl --request GET \
  http://localhost:8086/api/v2/dbrps?orgID=00oxo0oXx000x0Xo&db=example-db \
  --header "Authorization: Token YourAuthToken"
```

##### Filter DBRP mappings by bucket ID
```sh
curl --request GET \
  https://cloud2.influxdata.com/api/v2/dbrps?organization_id=00oxo0oXx000x0Xo&bucketID=00oxo0oXx000x0Xo \
  --header "Authorization: Token YourAuthToken"
```
{{% /tab-content %}}
{{% /tabs-wrapper %}}

## Update a DBRP mapping

Use the [`influx` CLI](/influxdb/v2.4/reference/cli/influx/) or the
[InfluxDB API](/influxdb/v2.4/reference/api/) to update a DBRP mapping.

{{% oss-only %}}

{{% note %}}
Virtual DBRP mappings cannot be updated.
To override a virtual DBRP mapping, [create an explicit mapping](#create-dbrp-mappings).
{{% /note %}}

{{% /oss-only %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp update` command](/influxdb/v2.4/reference/cli/influx/v1/dbrp/update/)
to update a DBRP mapping.
Include the following:

{{< req type="key" >}}

- {{< req "\*" >}} **org** and **token** to authenticate. We recommend setting your organization and token to your active InfluxDB connection configuration in the influx CLI, so you don't have to add these parameters to each command. To set up your active InfluxDB configuration, see [`influx config set`](/influxdb/v2.4/reference/cli/influx/config/set/).
- {{< req "\*" >}} **DBRP mapping ID** to update
- **Retention policy** name to update to
- **Default flag** to set the retention policy as the default retention policy for the database

##### Update the default retention policy
```sh
influx v1 dbrp update \
  --id 00oxo0X0xx0XXoX0
  --rp example-rp \
  --default
```

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps/{dbrpID}` API endpoint](/influxdb/v2.4/api/#operation/GetDBRPs) to update DBRP mappings.

<a href="/influxdb/v2.4/api/#operation/PatchDBRPID">
{{< api-endpoint endpoint="http://localhost:8086/api/v2/dbrps/{dbrpID}" method="PATCH" >}}
</a>

Include the following:

{{< req type="key" >}}

- **Request method:** `PATCH`
- **Headers:**
  - {{< req "\*" >}} **Authorization:** `Token` schema with your InfluxDB [API token](/influxdb/v2.4/security/tokens/)
- **Path parameters:**
  - {{< req "\*" >}} **id:** DBRP mapping ID to update
- **Query parameters:**  
  - {{< req "\*" >}} **orgID:** [organization ID](/influxdb/v2.4/organizations/view-orgs/#view-your-organization-id)
- **Request body (JSON):**
  - **rp:** retention policy name to update to
  - **default:** set the retention policy as the default retention policy for the database

##### Update the default retention policy
```sh
curl --request PATCH \
  http://localhost:8086/api/v2/dbrps/00oxo0X0xx0XXoX0?orgID=00oxo0oXx000x0Xo \
  --header "Authorization: Token YourAuthToken"
  --data '{
      "rp": "example-rp",
      "default": true
    }'
```
{{% /tab-content %}}
{{% /tabs-wrapper %}}

## Delete a DBRP mapping

Use the [`influx` CLI](/influxdb/v2.4/reference/cli/influx/) or the
[InfluxDB API](/influxdb/v2.4/reference/api/) to delete a DBRP mapping.

{{% oss-only %}}

{{% note %}}
Virtual DBRP mappings cannot be deleted.
{{% /note %}}

{{% /oss-only %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

Use the [`influx v1 dbrp delete` command](/influxdb/v2.4/reference/cli/influx/v1/dbrp/delete/)
to delete a DBRP mapping.
Include the following:

{{< req type="key" >}}

- {{< req "\*" >}} **org** and **token** to authenticate. We recommend setting your organization and token to your active InfluxDB connection configuration in the influx CLI, so you don't have to add these parameters to each command. To set up your active InfluxDB configuration, see [`influx config set`](/influxdb/v2.4/reference/cli/influx/config/set/).
- {{< req "\*" >}} **DBRP mapping ID** to delete

```sh
influx v1 dbrp delete --id 00oxo0X0xx0XXoX0
```

{{% /tab-content %}}
{{% tab-content %}}

Use the [`/api/v2/dbrps/{dbrpID}` API endpoint](/influxdb/v2.4/api/#operation/DeleteDBRPID) to delete a DBRP mapping.

<a href="/influxdb/v2.4/api/#operation/DeleteDBRPID">
{{< api-endpoint endpoint="http://localhost:8086/api/v2/dbrps/{dbrpID}" method="DELETE" >}}
</a>

Include the following:

{{< req type="key" >}}

- **Request method:** `PATCH`
- **Headers:**
  - {{< req "\*" >}} **Authorization:** `Token` schema with your InfluxDB [API token](/influxdb/v2.4/security/tokens/)
- **Path parameters:**
  - {{< req "\*" >}} **id:** DBRP mapping ID to update
- **Query parameters:**  
  - {{< req "\*" >}} **orgID:** [organization ID](/influxdb/v2.4/organizations/view-orgs/#view-your-organization-id)

```sh
curl --request DELETE \
  http://localhost:8086/api/v2/dbrps/00oxo0X0xx0XXoX0?orgID=00oxo0oXx000x0Xo \
  --header "Authorization: Token YourAuthToken"
```
{{% /tab-content %}}
{{% /tabs-wrapper %}}
