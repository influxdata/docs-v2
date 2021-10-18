---
title: Use API-invocable scripts to perform custom REST operations
description: >
  Use API-invocable scripts to create your own InfluxDB API endpoints that execute your custom scripts. 
weight: 101
menu:
  influxdb_cloud:
    name: API-invocable scripts (Managed functions) 
    parent: Guides 
influxdb/cloud/tags: [api guides]
---

Use API-invocable scripts to create custom InfluxDB API endpoints that execute your own scripts to query, process, and shape data. Invoke your custom script as a REST operation in InfluxDB. 

## Create an API-invocable script

Send a request using the **POST** method to the `/api/v2/functions` InfluxDB API endpoint.
Provide the following in your API request:

### Request headers
- **Content-Type**: application/json
- **Authorization**: Token *`INFLUX_API_TOKEN`*

### Request body
JSON object with the following fields:

- **script** : raw Flux or Python script as a string
- **language** : language of your script ("flux" or "python")
- **name** : script name that will be used to invoke the script
- **description** : script description
- **orgID**: your [InfluxDB organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id)

## Use Flux in scripts

The following example adds a new Flux script that, when invoked with a `params.mybucket` parameter, returns the last point from the bucket.

```sh
{{% get-shared-text "api/v2.0/api-invocable-scripts/create-script.sh" %}}
```
Replace the following:
- *`INFLUX_API_TOKEN`*: your [InfluxDB API token](/influxdb/v2.0/security/tokens/)
- *`INFLUX_ORG_ID`*: your [InfluxDB organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id)

InfluxDB returns the newly created script.

```json
{
  "id": "084d693d93048000",
  "orgID": "INFLUX_ORG",
  "name": "getLastPoint",
  "script": "from(bucket:params.mybucket)      |> range(start: -7d)      |> limit(n:2)",
  "description": "getLastPoint finds the last point in a bucket",
  "language": "flux",
  "createdAt": "2021-10-15T20:32:04.172938Z",
  "updatedAt": "2021-10-15T20:32:04.172938Z"
}
```

## Use Python scripts

## Execute an API-invocable script

To invoke your script, send a request using the `POST` method to the `/api/v2/functions/invoke` endpoint. 
Provide the following in your request:

### Request headers
- **Content-Type**: application/json
- **Accept**: application/csv
- **Authorization**: Token *`INFLUX_API_TOKEN`*

### Request body
JSON object that contains a `params` object. In `params`, provide key/value pairs for parameters used in your script.

The following example invokes the script and passes "air_sensor" as the value for `params.mybucket`.

```sh
{{% get-shared-text "api/v2.0/api-invocable-scripts/invoke-post.sh" %}}
```

InfluxDB returns query results for the `air_sensor` bucket.

