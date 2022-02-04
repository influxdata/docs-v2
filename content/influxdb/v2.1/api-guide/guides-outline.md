1. Introduction
    This guide is for developers who want to build Internet-of-Things (IoT) applications using the InfluxDB API.
    The InfluxDB API provides programmatic access to the InfluxDB platform for writing, querying, and managing time series data.
    API client libraries maintained by InfluxDB and the user community enable developers to take
    advantage of common patterns in their language of choice and avoid writing boilerplate code.
    In this guide, you'll walk through the process of building a real application that manages IoT devices, writes data to InfluxDB, queries data from InfluxDB to create data visualizations, and monitors the health of devices and the application itself.
    You'll learn:
    - the basics of InfluxDB and the REST API
    - how to install a client library
    - how to write data to influxDB
    - how to query data
1. Setup InfluxDB
   1. InfluxDB URL, Org, Bucket, All-Access Token
1. Start with an API client (InfluxDB basics)
   1. API basics
   2. Create an API token
   3. Create a bucket
      1. Measurements, time series
      2. Measurement schemas (aka bucket schemas)
   1. Install a client library
   4. Write data
      1. Line protocol
   5. Query InfluxDB
      1. Flux
   6. Aggregate and downsample your data
1. IoT Dev Center
   1. Architecture
      - IoT Dev Center serves a modern React UI and a server-side API (/api/env/<deviceID>).


## Authorization and authentication in InfluxDB

To write to InfluxDB, your application or device must authenticate and have the required permissions.
An InfluxDB **authorization** consists of a set of permissions and an API token.

Learn how to [create an authorization](/influxdb/v2.1/security/tokens/create-token/).

#### Example: view an authorization

Authorization from [GET `/api/v2/authorizations`]()

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

To authenticate InfluxDB API requests, your device passes the API token in the `Authorization` request header.

Learn how to [use an authorization](/influxdb/v2.1/security/tokens/use-tokens/).

### IoT Center: device registrations

The **Device Registrations** page lists registered IoT devices
and lets you register new devices.
In IoT Center, a **registered device** has a matching InfluxDB authorization.
For each registered device, you can view the dashboard, view the configuration, or remove the device.

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

#### Example: create an authorization

The following sample from IoT Center uses [`@influxdata/influxdb-client-apis`]() to create an authorization for an IoT device.

```js
const {AuthorizationsAPI} = require('@influxdata/influxdb-client-apis')
const {getOrganization} = require('./organizations')
const {getBucket} = require('./buckets')
const authorizationsAPI = new AuthorizationsAPI(influxdb)
const DESC_PREFIX = 'IoT Center: '
const CREATE_BUCKET_SPECIFIC_AUTHORIZATIONS = false

/**
 * Creates authorization for a supplied deviceId
 * @param {string} deviceId client identifier
 * @return {import('@influxdata/influxdb-client-apis').Authorization} promise with authorization or an error
 */
async function createIoTAuthorization(deviceId) {
  const {id: orgID} = await getOrganization()
  let bucketID = undefined
  if (CREATE_BUCKET_SPECIFIC_AUTHORIZATIONS) {
    bucketID = await getBucket(INFLUX_BUCKET).id
  }
  console.log(
    `createIoTAuthorization: deviceId=${deviceId} orgID=${orgID} bucketID=${bucketID}`
  )
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

### IoT Center: list registered devices

To list registered devices, the [DevicesPage](https://github.com/bonitoo-io/iot-center-v2/blob/3118c6576ad7bccf0b84b63f95350bdaa159324e/app/ui/src/pages/DevicesPage.tsx) UI component sends a request to the IoT Center API `/api/devices` endpoint.
{{/* Source: https://github.com/bonitoo-io/iot-center-v2/blob/3118c6576ad7bccf0b84b63f95350bdaa159324e/app/ui/src/pages/DevicesPage.tsx */}}

The IoT Center server app, in turn, sends a request to the `/api/v2/authorizations` InfluxDB API endpoint to retrieve authorizations.

The `getIoTAuthorizations()` IoT Center server function returns authorizations with the prefix "IoT Center: " and read-write access to the configured bucket.

#### Example: list authorizations

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
### IoT Center: device details

Device configuration details are composed of your InfluxDB configuration and authorization details for the device ID.

### IoT Center: unregister a device

To unregister a device, IoT Center deletes the device's authorization from your InfluxDB organization.

1. When you click the "Delete" button, IoT Center UI sends a `DELETE` request to the `/api/devices/DEVICE_ID` IoT Center API endpoint.
2. IoT Center server retrieves the list of IoT Center authorizations and finds the authorization matching the device ID.
3. IoT Center sends a `DELETE` request to the `/api/v2/authorizations/AUTHORIZATION_ID` InfluxDB API endpoint.

## Write data to InfluxDB

See [Write data with the API](/influxdb/v2.1/write-data/developer-tools/api/)

### Batch writes with the Javascript client library

[influxdb-client-js](https://github.com/influxdata/influxdb-client-js/) provides features like batch writes, retries, and error handling necessary for production-ready applications.
Batch writes reduce network use to make your application more efficient.
1. to instantiate a point writer from the
2. The [`writeApi.writePoint(point)`](https://github.com/influxdata/influxdb-client-js/blob/d76b1fe8c4000d7614f44d696c964cc4492826c6/packages/core/src/impl/WriteApiImpl.ts#L256) function converts each new point to [line protocol]() and adds the line to an array in a `WriteBuffer` object.

3. [`writeApi.flush()`]() invokes the WriteBuffer's [`writeApi.sendBatch()`](https://github.com/influxdata/influxdb-client-js/blob/d76b1fe8c4000d7614f44d696c964cc4492826c6/packages/core/src/impl/WriteApiImpl.ts#L147)
function to batch the points and send each batch to the
InfluxDB `/api/v2/write` endpoint.

{{% api-endpoint method="POST" endpoint="/api/v2/write" %}}

### IoT Center: batch writes for the virtual device

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
3. For each data point, calls the [`writeApi.writePoint(point)`](https://github.com/influxdata/influxdb-client-js/blob/d76b1fe8c4000d7614f44d696c964cc4492826c6/packages/core/src/impl/WriteApiImpl.ts#L256)
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

### Query with Flux

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
To view the device dashboard, from the "Virtual Device" page, click the
"Device Dashboard" button.
To generate the dashboard, the IoT Center UI queries device measurements in
the InfluxDB bucket.

IoT Center uses the `queryTable` data structure to create visualizations.
To instantiate a query API configuration, the IoT Center `DashboardPage` calls the
[`getQueryApi(org)`]() client library function.

`queryTable(queryApi, query, options)` sends a [Flux]() query in a `POST`
request to the `api/v2/query` InfluxDB API endpoint and returns query results.

{{% api-endpoint method="POST" endpoint="/api/v2/query" %}} [API spec]()

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

The `GiraffeTable` (alias `Table`) interface:

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
