---
title: Invoke custom scripts as API endpoints
seotitle: Use InfluxDB API-invocable scripts
description: >
  Use API-invocable scripts to create your own InfluxDB API endpoints that execute custom scripts. 
weight: 101
menu:
  influxdb_cloud:
    name: Invoke custom scripts 
    parent: Develop with the API 
influxdb/cloud/tags: [api guides]
---

Use API invocable scripts to create custom InfluxDB API endpoints that query, process, and shape data. API invocable scripts let you assign scripts to API endpoints and then execute them as standard REST operations in InfluxDB Cloud. Learn how to manage API invocable scripts and invoke them with runtime parameters.

Use the `/api/v2/scripts` InfluxDB API endpoint to:
- [Create a script](#create-an-invocable-script)
- [Invoke a script](#invoke-a-script)
- [List scripts](#list-invocable-scripts)
- [Update a script](#update-an-invocable-script)
- [Delete a script](#delete-an-invocable-script)

## Create an invocable script
To create an API-invocable script
for your [organization](/influxdb/v2.0/reference/glossary/#organization),
send a request using the `POST` method to the `/api/v2/scripts` InfluxDB API endpoint.


[{{< api-endpoint method="post" endpoint="https://cloud2.influxdata.com/api/v2/scripts" >}}](/influxdb/cloud/api/#operation/PostScripts)

Provide the following in your API request:

#### Request headers
- **Content-Type**: application/json
- **Authorization**: Token *`INFLUX_API_TOKEN`*

#### Request body
JSON object with the following fields:

- **script** : [Flux](/{{% latest "flux" %}}) script as a string.
- **language** : language of your script ("flux")
- **name** : script name, unique within your organization
- **description** : script description
- **orgID**: your [InfluxDB organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id)

### Use parameters in a script
To create an invocable script that accepts parameters (variables),
reference the parameters as properties of the `params` object, e.g. `params.firstparam`.
`params` is an InfluxDB object that defines runtime variables.
You provide values for `params` when you [invoke a script](#invoke-a-script).

## Examples

### Create an invocable Flux script
The following example creates a new Flux script that references the `params.mybucket` parameter and returns the last point from the [bucket](/influxdb/v2.0/reference/glossary/#bucket).

```sh
{{% get-shared-text "api/v2.0/api-invocable-scripts/create-flux-script.sh" %}}
```
Replace the following:
- *`INFLUX_API_TOKEN`*: your [InfluxDB API token](/influxdb/cloud/reference/glossary/#token)
- *`INFLUX_ORG_ID`*: your [InfluxDB organization ID](/influxdb/v2.0/organizations/view-orgs/#view-your-organization-id)

InfluxDB returns the newly created script. Next, see how to [invoke a script](#invoke-a-script).

```json
{
  "id": "084d693d93048000",
  "orgID": "INFLUX_ORG_ID",
  "name": "getLastPoint",
  "script": "from(bucket: params.mybucket)      |> range(start: -7d)      |> limit(n:1)",
  "description": "getLastPoint finds the last point in a bucket",
  "language": "flux",
  "createdAt": "2021-10-15T20:32:04.172938Z",
  "updatedAt": "2021-10-15T20:32:04.172938Z"
}
```

## Invoke a script
To invoke a script, send a request using the `POST` method to the `/api/v2/scripts/SCRIPT_ID/invoke` InfluxDB API endpoint. 

[{{< api-endpoint method="post" endpoint="https://cloud2.influxdata.com/api/v2/scripts/SCRIPT_ID" >}}](/influxdb/cloud/api/#operation/PostScriptsIDInvoke)

Replace *`SCRIPT_ID`* with the ID of the script you want to execute. To find the script ID, see how to [list scripts](#list-scripts).

Provide the following in your request:

### Request headers
- **Content-Type**: application/json
- **Accept**: application/csv
- **Authorization**: Token *`INFLUX_API_TOKEN`*

### Request body
JSON object that contains a `params` object. In `params`, provide key-value pairs for parameters referenced in your script.
The [create](#create-an-invocable-script) example, references the parameter `params.mybucket`.
```json
  "from(bucket: params.mybucket) \
   |> range(start: -7d) \
   |> limit(n:1)"
```

The following example invokes the created script and passes "air_sensor" as the value for `params.mybucket`.

```sh
{{% get-shared-text "api/v2.0/api-invocable-scripts/invoke-post.sh" %}}
```

InfluxDB returns query results in [annotated CSV](/influxdb/cloud/reference/syntax/annotated-csv/) from the `air_sensor` bucket.

## List invocable scripts
To list scripts for an organization, send a request using the `GET` method to the `/api/v2/scripts` InfluxDB API endpoint.

Provide the following in your request:

#### Request headers
- **Content-Type**: application/json
- **Authorization**: Token *`INFLUX_API_TOKEN`*

#### Request query parameters
- **org**: your organization name (mutually exclusive with **orgID**)
- **orgID**: your organization ID (mutually exclusive with **org**)
- **limit**: (Optional) number of scripts to return 
- **offset**: (Optional) number to offset the pagination 

```sh
{{% get-shared-text "api/v2.0/api-invocable-scripts/list.sh" %}}
```

To find a specific script for an organization, send a request using the `GET` method to the `/api/v2/scripts/SCRIPT_ID` InfluxDB API endpoint.

[{{< api-endpoint method="get" endpoint="https://cloud2.influxdata.com/api/v2/scripts/SCRIPT_ID" >}}](/influxdb/cloud/api/#operation/GetScriptsID)

Replace *`SCRIPT_ID`* with the ID of the script you want to find. 

Provide the following in your request:

#### Request headers
- **Authorization**: Token *`INFLUX_API_TOKEN`*
- **Accept**: application/json

```sh
{{% get-shared-text "api/v2.0/api-invocable-scripts/find.sh" %}}
```
## Update an invocable script
Use the API to replace the following properties of an invocable script:
- name
- description
- script

To update an existing script for an organization, send a request using the `PATCH` method to the `/api/v2/scripts/SCRIPT_ID` InfluxDB API endpoint.
Replace *`SCRIPT_ID`* with the ID of the script you want to update. 

[{{< api-endpoint method="patch" endpoint="https://cloud2.influxdata.com/api/v2/scripts/SCRIPT_ID" >}}](/influxdb/cloud/api/#operation/PatchScriptsID)

Provide the following in your request:

#### Request headers
- **Authorization**: Token *`INFLUX_API_TOKEN`*
- **Content-Type**: application/json
- **Accept**: application/json'

#### Request body
- A modified **invocable script** as a JSON object. 

The following example finds an invocable script containing a numeric date range,
replaces the date with a new parameter, and updates the invocable script.

```sh
{{% get-shared-text "api/v2.0/api-invocable-scripts/update-flux-script.sh" %}}
```
1. Use `GET /api/v2/scripts` to retrieve an object that contains a list of scripts.
2. With the scripts array, use [`jq`](https://stedolan.github.io/jq/) to find the first **invocable script** object that has a `script` property that contains a hard-coded numeric date range.
3. Replace the hard-coded date range in the `script` property with a new `params.myrangestart` dynamic parameter and assign the object to a `new_script` variable.
4. Assign the script ID to a `script_id` variable.
5. Update the script by sending a request to `PATCH /api/v2/scripts/` with `$script_id` in the URL path and `$new_script` as data (in the request body).

InfluxDB returns the updated invocable script.

## Delete an invocable script
To delete a script, send a request using the `DELETE` method to the `/api/v2/scripts/SCRIPT_ID` InfluxDB API endpoint.
Replace *`SCRIPT_ID`* with the ID of the script you want to update. 

[{{< api-endpoint method="delete" endpoint="https://cloud2.influxdata.com/api/v2/scripts/SCRIPT_ID" >}}](/influxdb/cloud/api/#operation/DeleteScriptsID)

Provide the following in your request:

#### Request headers
- **Authorization**: Token *`INFLUX_API_TOKEN`*
- **Accept**: application/json'
