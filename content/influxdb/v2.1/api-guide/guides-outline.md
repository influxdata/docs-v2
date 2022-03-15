## Build a starter IoT app with the InfluxDB API and client libraries

## Introduction

This guide is for developers who want to build Internet-of-Things (IoT) applications using the InfluxDB API and client libraries.
InfluxDB API client libraries are maintained by InfluxData and the user community. As a developer, client libraries enable you to take advantage of:
- idioms for InfluxDB requests, responses, and errors
- common patterns in a familiar programming language

In this guide, you'll walk through the basics of using the InfluxDB API and
client libraries in the context of building a real application as we
deconstruct the flow of events and data between the app, devices, and InfluxDB.
You'll see code samples that use InfluxDB API client libraries to
manage IoT devices, write data to InfluxDB, query data from InfluxDB, create visualizations, and monitor the health of devices and the application itself.

You'll learn:
- InfluxDB core concepts
- how to authenticate apps and devices to the API
- how to install a client library
- how to install the IoT Center app
- how to write data to InfluxDB
- how to query data in InfluxDB
- how to generate visualizations from query results

## Contents
1. [Setup InfluxDB](#setup-influxdb)
1. [InfluxDB API basics](#influxdb-api-basics)
1. [Authorization and authentication in InfluxDB](#authorization-and-authentication-in-influxdb)
1. Start with an API client library
1. Create a bucket
  1. Measurements, time series
  2. Measurement schemas (aka bucket schemas)
1. [Write data to InfluxDB](#write-data-to-influxdb)
  1. Write line protocol
1. [Query InfluxDB](#query-influxdb)
  1. Send a Flux query
  1. Aggregate and downsample your data
1. Create data visualizations

## InfluxDB API basics

- [InfluxDB URL](#influxdb-url)
- [Data formats](#data-formats)
- [Responses](#responses)
- [Resources in InfluxDB](#resources-in-influxdb)

### InfluxDB URL

Throughout this guide, your application will send API requests to [your InfluxDB URL]().

```sh
http://localhost:8086
```

Most InfluxDB API operations you'll use in this guide are in the `/api/v2` URL path,
e.g.

```sh
http://localhost:8086/api/v2/query
http://localhost:8086/api/v2/write
```

### Data formats

#### Line protocol

You use the line protocol format to write data to InfluxDB.

#### CSV

The InfluxDB API returns query results in CSV format.

#### JSON

The InfluxDB API returns resources and errors in JSON format.

### Responses

The InfluxDB API is a REST API that accepts standard HTTP request verbs
and returns standard HTTP response codes. If InfluxDB sends a response body, the body
may have one of the following formats, depending on the endpoint and response status:

- JSON: responses with resources or error messages
- CSV: responses with query results.
- Plain text: some error responses, responses with system information

### Resources in InfluxDB

**Resources** are InfluxDB objects that store data (.e.g. buckets) or configuration (.e.g. tasks) in InfluxDB.
Your application uses the InfluxDB API to create, retrieve, update, and delete resources.
In this guide, you'll encounter the following commonly used InfluxDB resources:

- [Organization](#organization)
- [User](#user)
- [Authorization](#authorization)
- [Bucket](#bucket)

#### Organization

An **organization** in InfluxDB is a logical workspace for a group of users.
Members, buckets, tasks, and dashboards (along with a number of other resources), belong to an organization.

See how to find your organization.

#### User

Users in InfluxDB are granted permission to access the database.
Users are members of an **organization** and use **API tokens** to access resources.

#### Bucket

Buckets in InfluxDB are named locations where time series data is stored.
All buckets have a **retention policy***, a duration of time that each data point persists.
All buckets belong to an **organization**.

#### Authorization

An authorization in InfluxDB consists of a **token** and a set of **permissions**
that specify _read_ or _write_ access to InfluxDB **resources**.
Given that each authorization has one unique token, we use the term "API token" to refer to a token string and the authorization it belongs to.
InfluxDB uses API tokens to authenticate and authorize API requests.

#### Example: InfluxDB authorization

In the following example, API token `Qjnu6uskk8ibmaytsgAEH4swgVa72rA_dEqzJMstHYLYJcDPlfDCLmwcGZbyYP1DajQnnj==`
is a _Read-Write_ token with _read_ and _write_ access to all buckets
in organization `48c88459ee424a04`.

```json
{
   "id": "08e64ffe9b764000",
   "token": "Qjnu6uskk8ibmaytsgAEH4swgVa72rA_dEqzJMstHYLYJcDPlfDCLmwcGZbyYP1DajQnnj==",
   "status": "active",
   "description": "IoT Center: vdevice3",
   "orgID": "48c88459ee424a04",
   "org": "iot-org",
   "userID": "0772396d1f411000",
   "user": "iot-app-owner",
   "permissions": [
     {
       "action": "read",
       "resource": {
         "type": "buckets",
         "orgID": "48c88459ee424a04",
         "org": "iot-org"
       }
     },
     {
       "action": "write",
       "resource": {
         "type": "buckets",
         "orgID": "48c88459ee424a04",
         "org": "iot-org"
       }
     }
   ]
 }
```

{{% caption %}}Response body from the GET `/api/v2/authorizations/AUTHORIZATION_ID` InfluxDB API endpoint{{% /caption %}}

{{% note %}}

To learn more about InfluxDB data elements, schemas, and design principles, see the
[Key concepts reference topics](influxdb/v2.1/reference/key-concepts/).

{{% /note %}}

### Introducing IoT Center

The IoT Center architecture has four layers:

- **InfluxDB API**: InfluxDB v2 API.
- **IoT device**: Virtual or physical devices write IoT data to the InfluxDB API.
- **IoT Center UI**: User interface sends requests to IoT Center server and renders views for the browser.
- **IoT Center server**: Server and API receives requests from the UI, sends requests to InfluxDB,
  and processes responses from InfluxDB.

## Install IoT Center



## Install InfluxDB

If you don't already have an InfluxDB instance, [create an InfluxDB Cloud account or install InfluxDB OSS]().

## Setup InfluxDB

### Add an InfluxDB All-Access token

For convenience in development, use an _All-Access_ token to read and write from your application.
To create an All-Access token, use one of the following:
- [InfluxDB UI](influxdb/v2.1/security/tokens/create-token/#create-an-all-access-token)
- [InfluxDB CLI](/influxdb/v2.1/security/tokens/create-token/#create-an-all-access-token-1)

{{% note %}}

For a production application, we recommend you create a token with minimal permissions and only use it in that application.

{{% /note %}}

## Configure IoT Center

env.js

### Add your InfluxDB URL

### Add your InfluxDB organization

### Add your InfluxDB API token

IoT Center server needs an [API token](#authorization) with permission to query (_read_) buckets
and create (_write_) authorizations for IoT devices.
Use the All-Access token you created in [Add an InfluxDB All-Access token](#add-an-influxdb-all-access-token).

## Make an API request

Now that you have an InfluxDB environment setup and a client library installed,
send an API to InfluxDB.

#### Example: make a request with an API token

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js

/** Set InfluxDB variables **/

/** Make a request **/

```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% note %}}

To learn more, see how to [use an authorization](/influxdb/v2.1/security/tokens/use-tokens/).

{{% /note %}}


### IoT Center: register and list IoT devices

In IoT Center, a **registered device** is a virtual or physical IoT device with a matching InfluxDB authorization.
The **Device Registrations** page lists registered IoT devices
and lets you register new devices.
For each registered device, you can view the dashboard and configuration or remove the device.

### IoT Center: register a device

When you register a new device, IoT Center creates an InfluxDB **authorization** with the device ID and write permission to your configured bucket.
IoT Center uses the constant `DESC_PREFIX` (`= "IoT Center: "`) to identify and retrieve registered devices.

1. When you click the "Register" button, IoT Center UI calls the `/api/devices/DEVICE_ID` IoT Center API endpoint.
2. IoT Center server app calls the `/api/v2/authorizations` InfluxDB API endpoint to find an authorization with the description **IoT Center: `DEVICE_ID`**.
3. If no authorization exists (i.e., the device is not registered), IoT Center server app sends a `POST` request to the
  `/api/v2/authorizations` InfluxDB API endpoint to create an authorization with the description **IoT Center: `DEVICE_ID`** and write permission to the configured bucket (`INFLUX_BUCKET`).
4. You configure your device to use the authorization's API token to authenticate to InfluxDB.

{{% note %}}

In InfluxDB Cloud, use the `/api/v2/authorizations` InfluxDB API endpoint to view the API token for your device.

{{% api-endpoint method="GET" endpoint="/api/v2/authorizations" %}}

You can't view API tokens in InfluxDB Cloud UI.

{{% /note %}}

#### Example: create a device authorization

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

IoT Center server uses [`@influxdata/influxdb-client-apis`]() to create an authorization for an IoT device.

```js
const {AuthorizationsAPI} = require('@influxdata/influxdb-client-apis')
const influxdb = require('./influxdb')
const {getOrganization} = require('./organizations')
const {getBucket} = require('./buckets')
const {INFLUX_BUCKET} = require('../env')

const authorizationsAPI = new AuthorizationsAPI(influxdb)
const DESC_PREFIX = 'IoTCenterDevice: '

/** Other authorization functions **/

/**
 * Creates authorization for a supplied deviceId
 * @param {string} deviceId client identifier
 * @returns {import('@influxdata/influxdb-client-apis').Authorization} promise with authorization or an error
 */
async function createIoTAuthorization(deviceId) {
  const {id: orgID} = await getOrganization()
  const bucketID = await getBucket(INFLUX_BUCKET).id
  return await authorizationsAPI.postAuthorizations({
    body: {
      orgID,
      description: DESC_PREFIX + deviceId,
      permissions: [
        {
          action: 'read',
          resource: {type: 'buckets', id: bucketID, orgID},
        },
        {
          action: 'write',
          resource: {type: 'buckets', id: bucketID, orgID},
        },
      ],
    },
  })
}
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% caption %}} IoT Center [/app/server/influxdb/authorizations.js](https://github.com/bonitoo-io/iot-center-v2/blob/b3bfce7ee9f5f045cfc8d881a9819f5dd9ad7a35/app/server/influxdb/authorizations.js#L61){{% /caption %}}

### IoT Center: list registered devices

To list registered devices, the [DevicesPage](https://github.com/bonitoo-io/iot-center-v2/blob/3118c6576ad7bccf0b84b63f95350bdaa159324e/app/ui/src/pages/DevicesPage.tsx) UI component sends a request to the IoT Center API `/api/devices` endpoint.
{{/* Source: https://github.com/bonitoo-io/iot-center-v2/blob/3118c6576ad7bccf0b84b63f95350bdaa159324e/app/ui/src/pages/DevicesPage.tsx */}}

The IoT Center server app, in turn, sends a request to the `/api/v2/authorizations` InfluxDB API endpoint to retrieve authorizations.

The `getIoTAuthorizations()` IoT Center server function returns authorizations with the prefix "IoT Center: " and read-write access to the configured bucket.

#### Example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

IoT Center server retrieves authorizations from InfluxDB.

```js
// Source: github/iot-center-v2/app/server/influxdb/authorizations.js

/**
 * Gets all authorizations.
 * @return promise with an array of authorizations
 * @see https://influxdata.github.io/influxdb-client-js/influxdb-client-apis.authorization.html
 * @return {Array<import('@influxdata/influxdb-client-apis').Authorization>}
 */
async function getAuthorizations() {
  const {id: orgID} = await getOrganization()
  const authorizations = await authorizationsAPI.getAuthorizations({orgID})
  return authorizations.authorizations || []
}

/**
 * Gets all IoT Center device authorizations.
 * @return promise with an authorization or undefined
 * @see https://influxdata.github.io/influxdb-client-js/influxdb-client-apis.authorization.html
 * @return {Array<import('@influxdata/influxdb-client-apis').Authorization>}
 */
async function getIoTAuthorizations() {
  const authorizations = await getAuthorizations()
  const {id: bucketId} = await getBucket()
  return authorizations.filter(
    (val) =>
      val.description.startsWith(DESC_PREFIX) &&
      isBucketRWAuthorized(val, bucketId)
  )
}
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### IoT Center: device details

IoT Center displays configuration details for a registered IoT device.
IoT Center API composes device configuration from the device's authorization and your InfluxDB configuration properties.

#### Example

https://github.com/bonitoo-io/iot-center-v2/blob/10fd78e67ccf093dedbed9eed88439423203c8a2/app/server/apis/index.js#L58

### IoT Center: unregister a device

To _unregister_ a device, IoT Center deletes the device authorization from your InfluxDB organization with the following steps:

1. When you click the "Delete" button, IoT Center UI sends a `DELETE` request to the `/api/devices/DEVICE_ID` IoT Center API endpoint.
2. IoT Center server retrieves the list of IoT Center authorizations and finds the authorization that matches the device ID.
3. IoT Center sends a `DELETE` request to the `/api/v2/authorizations/AUTHORIZATION_ID` InfluxDB API endpoint.

## Write data to InfluxDB

{{% note %}}

To learn more, see [Write data with the API](/influxdb/v2.1/write-data/developer-tools/api/)

{{% /note %}}

### Batch writes with client libraries

#### Batch writes with the Javascript client library

[influxdb-client-js](https://github.com/influxdata/influxdb-client-js/) provides features like batch writes, retries, and error handling necessary for production-ready applications.
Batch writes reduce network use to make your application more efficient.
1. to instantiate a point writer from the
2. The [`writeApi.writePoint(point)`](https://github.com/influxdata/influxdb-client-js/blob/d76b1fe8c4000d7614f44d696c964cc4492826c6/packages/core/src/impl/WriteApiImpl.ts#L256) function converts each new point to [line protocol]() and adds the line to an array in a `WriteBuffer` object.

3. [`writeApi.flush()`]() invokes the WriteBuffer's [`writeApi.sendBatch()`](https://github.com/influxdata/influxdb-client-js/blob/d76b1fe8c4000d7614f44d696c964cc4492826c6/packages/core/src/impl/WriteApiImpl.ts#L147)
function to batch the points and send each batch to the
InfluxDB `/api/v2/write` endpoint.

{{% api-endpoint method="POST" endpoint="/api/v2/write" %}}

### IoT Center: write device data to InfluxDB

The IoT Center **virtual device** emulates a real IoT device by generating measurement data and writing the data to InfluxDB.
Use the virtual device to demonstrate the IoT Center dashboard and test the InfluxDB API before you advance to adding physical devices or other clients.

IoT Center provides a "Write Missing Data" button that generates `environment`
(temperature, humidity, pressure, CO2, TVOC, latitude, and longitude) [measurement]() data for the virtual device.
The button generates measurements for every minute over the last seven days and
writes the generated measurement data to the InfluxDB bucket you configured.

To write the measurements to the bucket, IoT Center uses the `writeEmulatedData(...)` function
in **DevicePage.tsx**. `writeEmulatedData(...)` takes the following steps to write data to InfluxDB:
1. Configures a new instance of the InfluxDB client
   ```js
   const influxDB = new InfluxDB({url, token})
   ```
2. To configure the client for writing, calls `getWriteApi()` with organization, bucket, timestamp precision, batch size, and default tags
   ```js
   const writeApi = influxDB.getWriteApi(org, bucket, 'ns', {
     batchSize: batchSize + 1,
     defaultTags: {clientId: id},
   })
   ```
3. To write a data point, calls the [`writeApi.writePoint(point)`](https://github.com/influxdata/influxdb-client-js/blob/d76b1fe8c4000d7614f44d696c964cc4492826c6/packages/core/src/impl/WriteApiImpl.ts#L256)
   client library function
4. Internally, `writeApi.writePoint(point)` converts each new point to
   [line protocol]() and adds the line to an array in a `WriteBuffer` object.
5. Calls the [`writeApi.flush()`]() client library function.
6. Internally, `writeApi.flush()` calls the `writeApi.sendBatch()`](https://github.com/influxdata/influxdb-client-js/blob/d76b1fe8c4000d7614f44d696c964cc4492826c6/packages/core/src/impl/WriteApiImpl.ts#L147)
   client library function to write the points in batches to the `/api/v2/write` InfluxDB API endpoint.


#### Example: batch and write points

```js
// Source: https://github.com/bonitoo-io/iot-center-v2/blob/3118c6576ad7bccf0b84b63f95350bdaa159324e/app/ui/src/pages/DevicePage.tsx#L188

if (totalPoints > 0) {
const batchSize = 2000
const url =
  write_endpoint && write_endpoint !== '/mqtt' ? write_endpoint : '/influx'
const influxDB = new InfluxDB({url, token})
const writeApi = influxDB.getWriteApi(org, bucket, 'ns', {
  batchSize: batchSize + 1,
  defaultTags: {clientId: id},
})
try {
  // write random temperatures
  const point = new Point('environment') // reuse the same point to spare memory
  onProgress(0, 0, totalPoints)

  const writePoint = async (time: number) => {
    const gpx = getGPX(time)
    point
      .floatField('Temperature', generateTemperature(time))
      .floatField('Humidity', generateHumidity(time))
      .floatField('Pressure', generatePressure(time))
      .intField('CO2', generateCO2(time))
      .intField('TVOC', generateTVOC(time))
      .floatField('Lat', gpx[0] || state.config.default_lat || 50.0873254)
      .floatField('Lon', gpx[1] || state.config.default_lon || 14.4071543)
      .tag('TemperatureSensor', 'virtual_TemperatureSensor')
      .tag('HumiditySensor', 'virtual_HumiditySensor')
      .tag('PressureSensor', 'virtual_PressureSensor')
      .tag('CO2Sensor', 'virtual_CO2Sensor')
      .tag('TVOCSensor', 'virtual_TVOCSensor')
      .tag('GPSSensor', 'virtual_GPSSensor')
      .timestamp(String(time) + '000000')
    writeApi.writePoint(point)

    pointsWritten++
    if (pointsWritten % batchSize === 0) {
      await writeApi.flush()
      onProgress(
        (pointsWritten / totalPoints) * 100,
        pointsWritten,
        totalPoints
      )
    }
  }

  if (missingDataTimeStamps && missingDataTimeStamps.length)
    for (const timestamp of missingDataTimeStamps)
      await writePoint(timestamp)
  else
    while (lastTime < toTime) {
      lastTime += 60_000 // emulate next minute
      await writePoint(lastTime)
    }
  await writeApi.flush()
} finally {
  await writeApi.close()
}
onProgress(100, pointsWritten, totalPoints)
}
```

## Query InfluxDB

See [Query with the API](/influxdb/v2.1/query-data/execute-queries/influx-api/)

## Query data for visualizations

[@influxdata/giraffe](https://github.com/influxdata/giraffe), the React-based
visualization library for InfluxDB v2, provides an extensive range of data visualization components and support for Flux query results.

Flux queries return data in CSV format.
When generating the table through a Flux result:

call the `fromFlux()` utility function on the CSV generated by Flux
get the table in the returned object from calling fromFlux

{{% note %}}
Use '@influxdata/giraffe' to render gauges, plots, tables, and other visualizations in your own dashboard UI.
To learn more about Giraffe visualizations, options, and the columnar interface see the [Giraffe Quick Start](https://github.com/influxdata/giraffe/blob/master/giraffe/README.md#quick-start).
{{% /note %}}

### Query and transform data with the Javascript client library

Although you can use the `fromFlux()` '@influxdata/giraffe' utility directly,
the `influxdb-client-js` Javascript client library provides a `giraffe` package
with a convenient `queryToTable(queryApi, query)` function.
`queryToTable` returns a single `Promise` for the query and transformation of
your data to a Giraffe [columnar](https://observablehq.com/@mbostock/manipulating-flat-arrays) table.

  ```ts
  // Source: https://github.com/influxdata/influxdb-client-js/blob/7fc386c59e718dfb452fad915ff3cd561b697536/packages/giraffe/src/queryTable.ts

  export function queryToTable(
    queryApi: QueryApi,
    query: string | ParameterizedQuery,
    tableFactory: GiraffeTableFactory,
    tableOptions?: TableOptions
  ): Promise<Table> {
    return new Promise<FromFluxResult>((resolve, reject) => {
      queryApi.queryRows(
        query,
        createCollector(resolve, reject, tableFactory, tableOptions)
      )
    }).then(result => result.table)
  }
  ```

 {{% api-endpoint method="POST" endpoint="/api/v2/query" %}} [API spec]()

### IoT Center: device dashboard

#### Example: query virtual device data with Flux

IoT Center uses the following Flux query to retrieve `environment` measurements:

```js
import "influxdata/influxdb/v1"    
from(bucket: "iot_center")
 |> range(start: ${fluxDuration(timeStart)})
 |> filter(fn: (r) => r._measurement == "environment")
 |> filter(fn: (r) => r["_field"] == "Temperature" or r["_field"] == "TVOC" or r["_field"] == "Pressure" or r["_field"] == "Humidity" or r["_field"] == "CO2")
 |> filter(fn: (r) => r.clientId == "virtual_device")
 |> v1.fieldsAsCols()
```

#### Query result sample

The query returns virtual device `environment` measurements that contain
any of the fields **Temperature**, **TVOC**, **Pressure**, **Humidity**, or **CO2**.

_measurement  |  _start  |  _stop  |  _time  |  clientId  |  CO2  |  CO2Sensor  |  GPSSensor  |  Humidity  |  HumiditySensor  |  Pressure  |  PressureSensor  |  Temperature  |  TemperatureSensor  |  TVOC  |  TVOCSensor |
| environment | 2022-02-08T22:38:31.329Z | 2022-02-15T22:38:31.329Z | 2022-02-08T22:39:00.000Z | virtual_device | 865 | virtual_CO2Sensor | virtual_GPSSensor | 32 | virtual_HumiditySensor | 980.1 | virtual_PressureSensor | 16.8 | virtual_TemperatureSensor | 564 | virtual_TVOCSensor |
| environment | 2022-02-08T22:38:31.329Z | 2022-02-15T22:38:31.329Z | 2022-02-08T22:40:00.000Z | virtual_device | 867 | virtual_CO2Sensor | virtual_GPSSensor | 31.8 | virtual_HumiditySensor | 980.3 | virtual_PressureSensor | 17.2 | virtual_TemperatureSensor | 565 | virtual_TVOCSensor |
| environment | 2022-02-08T22:38:31.329Z | 2022-02-15T22:38:31.329Z | 2022-02-08T22:41:00.000Z | virtual_device | 869 | virtual_CO2Sensor | virtual_GPSSensor | 31.4 | virtual_HumiditySensor | 980.3 | virtual_PressureSensor | 17 | virtual_TemperatureSensor | 565 | virtual_TVOCSensor |

### IoT device dashboard

IoT Center provides a dashboard of data visualizations for each registered device.
To view the device dashboard, on the "Virtual Device" page, click the
"Device Dashboard" button.
IoT Center UI `DashboardPage` executes the following steps to generate a dashboard visualization:
1. Calls the
[`getQueryApi(org)`]() client library function to configure the client for querying.
2. Calls the `queryTable(queryApi, query, options)` IoT Center function with the query configuration and the [Flux]() query
3. Returns a Promise that resolves with query result data as a [Giraffe Table interface](https://github.com/influxdata/giraffe/).

  ```ts
  // Source: https://github.com/bonitoo-io/iot-center-v2/blob/master/app/ui/src/util/queryTable.ts

  export function queryTable(
    queryApi: QueryApi,
    query: string | ParameterizedQuery,
    tableOptions?: TableOptions
  ): Promise<Table> {
    return queryToTable(queryApi, query, newTable, tableOptions)
  }
  ```

4. Renders `Gauge` and `Plot` components with the data

#### Example: query data with Flux and the Javascript client library
```ts
// Source: iot-center-v2/app/ui/src/pages/DashboardPage.tsx

const fetchDeviceMeasurements = async (
 config: DeviceConfig,
 timeStart = '-30d'
): Promise<GiraffeTable> => {
 const {
   // influx_url: url, // use '/influx' proxy to avoid problem with InfluxDB v2 Beta (Docker)
   influx_token: token,
   influx_org: org,
   influx_bucket: bucket,
   id,
 } = config
 const queryApi = new InfluxDB({url: '/influx', token}).getQueryApi(org)
 const result = await queryTable(
   queryApi,
   flux`
 import "influxdata/influxdb/v1"    
 from(bucket: ${bucket})
   |> range(start: ${fluxDuration(timeStart)})
   |> filter(fn: (r) => r._measurement == "environment")
   |> filter(fn: (r) => r["_field"] == "Temperature" or r["_field"] == "TVOC" or r["_field"] == "Pressure" or r["_field"] == "Humidity" or r["_field"] == "CO2")
   |> filter(fn: (r) => r.clientId == ${id})
   |> v1.fieldsAsCols()`
 )
 return result
}
```


#### Example: model query results in Typescript

IoT Center defines the following `GiraffeTable` (alias `Table`) interface for the Flux query result:

```ts
// Source: iot-center-v2/app/node_modules/@influxdata/giraffe/src/types/index.ts

export interface Table {
  getColumn: GetColumn
  getColumnName: (columnKey: string) => string | null // null if the column is not available
  getColumnType: (columnKey: string) => ColumnType | null // null if the column is not available
  getOriginalColumnType: (columnKey: string) => FluxDataType | null // null if the column is not available
  columnKeys: string[]
  length: number
  addColumn: (
    columnKey: string,
    fluxDataType: FluxDataType,
    type: ColumnType,
    data: ColumnData,
    name?: string
  ) => Table
}
```

## Advanced topics

1. Segment your data
1. Optimize your queries
1. Manage and secure tokens
   1. InfluxDB Cloud (token access restrictions)
2. Monitor the IoT app
2. Tasks
2. Dashboards
