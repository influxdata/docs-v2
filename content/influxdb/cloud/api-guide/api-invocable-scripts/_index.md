---
title: Use API-invocable scripts to perform custom REST operations
description: >
  Use API-invocable scripts to create your own InfluxDB API endpoints that execute your custom scripts. 
weight: 101
menu:
  influxdb_cloud:
    name: Invoke custom scripts 
    parent: Develop with the API 
influxdb/cloud/tags: [api guides]
---

Use API-invocable scripts to create InfluxDB API endpoints that query, process, and shape data. Execute your script endpoint as a standard REST operation.

- [Create a script](#create-an-invocable-script)
- [Invoke a script](#invoke-a-script)
- [Update a script](#update-an-invocable-script)
- [List scripts](#list-invocable-scripts)
- [Find a script](#find-an-invocable-script)

## Create an invocable script
- [Create a Flux script](#create-an-invocable-flux-script)

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

## Create an invocable Flux script

The following example adds a new Flux script that, when invoked with a `params.mybucket` parameter, returns the last point from that [bucket](/influxdb/v2.0/reference/glossary/#bucket).

```sh
{{% get-shared-text "api/v2.0/api-invocable-scripts/create-flux-script.sh" %}}
```
Replace the following:
- *`INFLUX_API_TOKEN`*: your [InfluxDB API token](/influxdb/cloud/reference/glossary/#token)
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

## Invoke a script
To invoke your script, send a request using the `POST` method to the `/api/v2/functions/SCRIPT_ID/invoke` endpoint. 

Replace *`SCRIPT_ID`* with the ID of the script you want to execute. To find the script ID, see how to [list scripts](#list-scripts).

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

## List invocable scripts
To list scripts for an organization, send a request using the `GET` method to the `/api/v2/functions` endpoint.

Provide the following in your request:

### Request headers
- **Content-Type**: application/json
- **Authorization**: Token *`INFLUX_API_TOKEN`*

### Request query parameters
- **org**: your organization name (mutually exclusive with **orgID**)
- **orgID**: your organization ID (mutually exclusive with **org**)
- **limit**: (Optional) number of scripts to return 
- **offset**: (Optional) number to offset the pagination 

```sh
{{% get-shared-text "api/v2.0/api-invocable-scripts/find.sh" %}}
```

## Find an invocable script
To find a specific script for an organization, send a request using the `GET` method to the `/api/v2/functions/SCRIPT_ID` endpoint.

Replace *`SCRIPT_ID`* with the ID of the script you want to find. 

Provide the following in your request:

### Request headers
- **Content-Type**: application/json
- **Authorization**: Token *`INFLUX_API_TOKEN`*

### Request query parameters
- **org**: your organization name (mutually exclusive with **orgID**)
- **orgID**: your organization ID (mutually exclusive with **org**)
- **limit**: (Optional) number of scripts to return 
- **offset**: (Optional) number to offset the pagination 

```sh
{{% get-shared-text "api/v2.0/api-invocable-scripts/find.sh" %}}
```
