---
title: JavaScript client library starter
seotitle: Use JavaScript client library to build a sample application
list_title: JavaScript client library starter
description: >
  Build an application that writes, queries, and manages devices with the InfluxDB 
  client library for JavaScript.
menu:
  influxdb_2_2:
    identifier: client-library-starter-js
    name: JavaScript
    parent: Client library starter
influxdb/cloud/tags: [api]
---

{{% api/iot-starter-intro %}}

## Contents

- [Set up InfluxDB](#set-up-influxdb)
  - [Authenticate with an InfluxDB API token](#authenticate-with-an-influxdb-api-token)
- [Introducing IoT Starter](#introducing-iot-starter)
- [Create the application](#create-the-application)
- [Install InfluxDB client library](#install-influxdb-client-library)
- [Install InfluxDB client library for management APIs](#install-influxdb-client-library-for-management-apis)
- [Set InfluxDB environment variables](#set-influxdb-environment-variables)
- [Create the UI](#create-the-ui)
  - [Create devices UI components](#create-devices-ui-components)
- [Build the API](#build-the-api)
  - [Create the API endpoint to list devices](#create-the-api-endpoint-to-list-devices)
    - [Create the Flux query to find devices](#create-the-flux-query-to-find-devices)
    - [Execute the query and process rows](#execute-the-query-and-process-rows)
    - [Copy the list devices example](#copy-the-list-devices-example)
  - [Create the API endpoint to register devices](#create-the-api-endpoint-to-register-devices)
    - [Get the bucket ID](#get-the-bucket-id)
  - [Create an authorization for the device](#create-an-authorization-for-the-device)
  - [Write the device authorization to a bucket](#write-the-device-authorization-to-a-bucket)

## Set up InfluxDB

If you haven't already, 
{{% cloud-only %}}[create an InfluxDB Cloud account](https://www.influxdata.com/products/influxdb-cloud/){{% /cloud-only %}}
{{% oss-only %}}[install and set up InfluxDB OSS](https://www.influxdata.com/products/influxdb/){{% /oss-only %}}.

### Authenticate with an InfluxDB API token

For convenience in development, 
[create an _All-Access_ token](/influxdb/v2.2/security/tokens/create-token/) 
for your application. This grants your application full read and write 
permissions on all resources within your InfluxDB organization.

{{% note %}}

For a production application, create and use a 
{{% cloud-only %}}custom{{% /cloud-only %}}{{% oss-only %}}read-write{{% /oss-only %}} 
token with minimal permissions and only use it with your application.

{{% /note %}}

## Introducing IoT Starter

The application architecture has four layers:

- **InfluxDB API**: InfluxDB v2 API.
- **IoT device**: Virtual or physical devices write IoT data to the InfluxDB API.
- **UI**: Sends requests to the server and renders views in the browser.
- **Server**: Serves an API that receives requests from the UI, sends requests to InfluxDB,
  and processes responses from InfluxDB.

## Create the application

[Next.js](https://nextjs.org/) provides a framework and tools to help you quickly build a full-stack JavaScript application with production-level features and minimal setup.

To begin, use `npx` to create the `iot-starter-js` app from the NextJS [learn-starter template](https://github.com/vercel/next-learn/tree/master/basics/learn-starter).

```sh
npx create-next-app iot-starter-js --use-npm --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"
```

After the installation completes, go into your `iot-starter-js` directory and start the development server.

```sh
cd nextjs-iot-starter
npm run dev
```

In your browser, verify that you can access the app at [http://localhost:3000](http://localhost:3000).

## Install InfluxDB client library

If you haven't already, [create your app](#create-your-app).

From your app directory, install `@influxdata/influxdb-client` for the following write and query API features:

- Query data with the Flux language.
- Write data to InfluxDB.
- Batch data in the background.
- Retry requests automatically on failure.

```sh
npm i @influxdata/influxdb-client
```

## Install InfluxDB client library for management APIs

From your app directory, install `@influxdata/influxdb-client-apis` to create, modify, and delete authorizations, buckets, tasks, and other InfluxDB resources.

```sh
npm i @influxdata/influxdb-client-apis
```

## Set InfluxDB environment variables

InfluxDB client libraries require configuration properties from your InfluxDB environment.
Typically, you'll provide the following properties as environment variables for your application:

- `INFLUX_URL`
- `INFLUX_TOKEN`
- `INFLUX_ORG`
- `INFLUX_BUCKET`
- `INFLUX_BUCKET_AUTH`

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

Next.js provides an `env` module to provide environment variables to your application and prevents application secrets from being added to version control.
The `./.env.development` file is versioned and contains default non-secret variables for your _development_ environment.

```sh
# .env.development

INFLUX_URL=http://localhost:8086
INFLUX_BUCKET=iot_center
INFLUX_BUCKET_AUTH=iot_center_devices
```

Add a `./.env.local` to set environment variable secrets that aren't tracked by version control.
In `./.env.local`, set your InfluxDB token and organization--for example:

```sh
# .env.local

# INFLUX_TOKEN
# InfluxDB API token used by the application server to send requests to InfluxDB.
# For convenience in development, use an **All-Access** token.
INFLUX_TOKEN=29Xx1KH9VkASPR2DSfRfFd82OwGD...

# INFLUX_ORG
# InfluxDB organization ID you want to use in development.
INFLUX_ORG=48c88459ee424a04
```

At startup, Next.js loads the settings in your Node.JS environment variables.
To use the settings, access them in `process.env`, as in the following example:

```js
import { InfluxDB } from '@influxdata/influxdb-client'
import { BucketsAPI } from '@influxdata/influxdb-client-apis'

const influxdb = new InfluxDB({url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN})
const bucketsAPI = new BucketsAPI(influxdb)
bucketsAPI.getBuckets({name: process.env.INFLUX_BUCKET, orgID: process.env.INFLUX_ORG})
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Create the UI

First, create the UI layout and components to drive the design of the application.

### Create UI layout

In the `./pages` directory, create the following files:

- [`pages/_layout.js`](): shared layout that applies a header, footer, and CSS to all `pages`.
- [`pages/_app.js`](): root application component that imports `Layout` and wraps `/pages` routes.

### Create UI devices components

The application UI provides a Devices view that registers, queries, and displays devices.

Create a `./pages/devices` directory and add the following files:

- [`./pages/devices/index.js`](https://github.com/influxdata/iot-api-js/blob/main/pages/devices/index.js): provides the devices view.
- [`./pages/devices/deviceList.js`](https://github.com/influxdata/iot-api-js/blob/main/pages/devices/_deviceList.js): `DeviceList` displays devices and refreshes the list when `deviceId` input changes.
- [`./pages/devices/_deviceRegistrationButton.js`](https://github.com/influxdata/iot-api-js/blob/main/pages/devices/_deviceRegistrationButton.js): `DeviceRegistrationButton` allows the user to add a new device ID.
  
With the UI components in place, you're ready to [build the application API](#build-the-iot-starter-api) that
handles requests from the UI and responses from InfluxDB.

## Build the API

The application API provides URL endpoints and routes HTTP requests to server-side code and InfluxDB.

Each API endpoint is responsible for the following:

- Listen for requests from IoT Starter UI components.
- Translate requests into InfluxDB API requests.
- Process InfluxDB API responses and handles errors.
- Provide data to UI components.

Follow these steps to build the API:

1. [Create the API endpoint to list devices](#create-the-api-endpoint-to-list-devices)
2. [Create the API endpoint to register devices](#create-the-api-endpoint-to-register-devices)

### Create the API endpoint to list devices

The `/api/devices` API endpoint handles requests from the UI, queries InfluxDB, and returns
registered device data to the UI.

Follow these steps to build the `/api/devices` API endpoint:

1. [Create the Flux query](#create-the-flux-query-to-find-devices)
2. [Execute the query and process rows](#execute-the-query-and-process-rows)
3. [Copy the complete list devices example](#copy-the-list-devices-example)

#### Create the Flux query to find devices

To retrieve registered devices from your `INFLUX_BUCKET_AUTH` bucket, get the last row of each [series](/influxdb/v2.2/reference/glossary#series) that contains a `deviceauth` measurement.
The example below returns rows that contain the `key` field (authorization ID) and excludes rows that contain a `token` field (to avoid exposing sensitive token values).

```js
// Flux query finds devices
 from(bucket:`${INFLUX_BUCKET_AUTH}`)
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "deviceauth" and r._field != "token")
      |> last()
```

#### Execute the query and process rows

To retrieve registered devices, use the client library to send the Flux query to the `POST /api/v2/query` InfluxDB API endpoint.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

To send the query and process results, use the `QueryAPI queryRows(query, consumer)` method.
`queryRows` executes the `query` and provides the Annotated CSV result as an Observable to the `consumer`.
`queryRows` has the following signature (in TypeScript):

```ts
  queryRows(
    query: string | ParameterizedQuery,
    consumer: FluxResultObserver<string[]>
  ): void
```

{{% caption %}}[@influxdata/influxdb-client-js QueryAPI, line 92](https://github.com/influxdata/influxdb-client-js/blob/3db2942432b993048d152e0d0e8ec8499eedfa60/packages/core/src/QueryApi.ts#L92){{% /caption %}}

The `consumer` that you provide must implement the [`FluxResultObserver` interface](https://github.com/influxdata/influxdb-client-js/blob/3db2942432b993048d152e0d0e8ec8499eedfa60/packages/core/src/results/FluxResultObserver.ts#L7) that provides the following callback functions:

- `next(row, tableMeta)`: processes the next row and table metadata--for example, to prepare the response.
- `error(error)`: receives and handles errors--for example, by rejecting the Promise.
- `complete()`: signals when all rows have been consumed--for example, by resolving the Promise.

To learn more about Observers, see the [RxJS Guide](https://rxjs.dev/guide/observer).
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### See the getDevices example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

Create a `./pages/api/devices/_devices.js` file that contains the following:

{{% truncate %}}

```js
import { flux } from '@influxdata/influxdb-client'
import influxdb from '../_influxdb'

const INFLUX_ORG = process.env.INFLUX_ORG
const INFLUX_BUCKET_AUTH = process.env.INFLUX_BUCKET_AUTH

/**
 * Gets devices or a particular device when deviceId is specified. Tokens
 * are not returned unless deviceId is specified. It can also return devices
 * with empty/unknown key, such devices can be ignored (InfluxDB authorization is not associated).
 * @param deviceId optional deviceId
 * @returns promise with an Record<deviceId, {deviceId, createdAt, updatedAt, key, token}>.
 */
 export async function getDevices(deviceId) {
    const queryApi = influxdb.getQueryApi(INFLUX_ORG)
    const deviceFilter =
      deviceId !== undefined
        ? flux` and r.deviceId == "${deviceId}"`
        : flux` and r._field != "token"`
    const fluxQuery = flux`from(bucket:${INFLUX_BUCKET_AUTH})
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "deviceauth"${deviceFilter})
      |> last()`
    const devices = {}
    console.log(`*** QUERY *** \n ${fluxQuery}`)
    return await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row)
          const deviceId = o.deviceId
          if (!deviceId) {
            return
          }
          const device = devices[deviceId] || (devices[deviceId] = {deviceId})
          device[o._field] = o._value
          if (!device.updatedAt || device.updatedAt < o._time) {
            device.updatedAt = o._time
          }
        },
        error: reject,
        complete() {
          console.log(JSON.stringify(devices))
          resolve(devices)
        },
      })
    })
  }
```

{{% /truncate %}}

The `_devices` module exports a `getDevices(deviceId)` function that queries
for registered devices, processes the data, and returns a Promise with the result.
If you invoke the function as `getDevices()` (without a `deviceId`),
it retrieves all `deviceauth` points and returns a Promise with `{ DEVICE_ID: ROW_DATA }`.

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Next, create the API route.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

To create an API route that listens for requests to `/api/devices/` and an optional `deviceId` parameter, create a `./pages/api/devices/[[...deviceId]].js` file.
In Next.js, the peculiar filename syntax `[[...param]].js` creates a _catch-all_ API route.
To learn more, see [Next.js dynamic API routes](https://nextjs.org/docs/api-routes/dynamic-api-routes).

In `./pages/api/devices/[[...deviceId]].js`, export a server request `handler` that calls `getDevices(deviceId)` and returns valid devices--for example:

```js
import { getDevices } from './_devices'

export default async function handler(req, res) {
  try {
    const { deviceId } = req.query
    const devices = await getDevices(deviceId)
    res.status(200).json(
      Object.values(devices)
        .filter((x) => x.deviceId && x.key) // ignore deleted or unknown devices
        .sort((a, b) => a.deviceId.localeCompare(b.deviceId))
    )
  } catch(err) {
      res.status(500).json({ error: `failed to load data: ${err}` })
  }
}
```

{{% caption %}}[iot-api-js/pages/api/devices/[[...deviceId]].js](https://github.com/influxdata/iot-api-js/blob/25b38c94a1f04ea71f2ef4b9fcba5350d691cb9d/pages/api/devices/%5B%5B...deviceId%5D%5D.js){{% /caption %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Create the API endpoint to register devices

In **IoT Starter**, a _registered device_ is a point that contains your device ID, authorization ID, and API token.
The API token and authorization permissions allow the device to query and write to `INFLUX_BUCKET`.
In this section, you'll add the `/api/devices/create` route that handles requests from the UI, creates an authorization in InfluxDB,
and writes the registered device to the `INFLUX_BUCKET_AUTH` bucket.

`/api/devices/create` uses the following `/api/v2` InfluxDB API endpoints:

- `POST /api/v2/query`: to query `INFLUX_BUCKET_AUTH` for a registered device
- `GET /api/v2/buckets`: to get the bucket ID for `INFLUX_BUCKET`
- `POST /api/v2/authorizations`: to create an authorization for the device
- `POST /api/v2/write`: to write the device authorization to `INFLUX_BUCKET_AUTH`

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

Create a `./pages/api/devices/create.js` file to use the filename
convention for [Next.js dynamic routes](https://nextjs.org/docs/api-routes/dynamic-api-routes).
In the file, export a server request `handler` function that does the following:

1. Accepts a device ID in the request body.
2. Queries `INFLUX_BUCKET_AUTH` and responds with an error if a authorization already exists for the device.
3. [Retrieves the `INFLUX_BUCKET` bucket ID](#get-the-bucket-id).
4. [Creates a device authorization with _read_-_write_ permission to `INFLUX_BUCKET`](#create-an-authorization-for-the-device).
5. [Writes the device ID and authorization to `INFLUX_BUCKET_AUTH`](#write-the-device-authorization-to-a-bucket).
6. Responds with `HTTP 200` when the write request completes.

[View the complete example](https://github.com/influxdata/iot-api-js/blob/25b38c94a1f04ea71f2ef4b9fcba5350d691cb9d/pages/api/devices/create.js).

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### Get the bucket ID

To create an authorization with _read_-_write_ permission for `INFLUX_BUCKET`, you must pass the bucket ID.
To get the bucket ID, use the InfluxDB client library to send a `GET` request to the `/api/v2/buckets` InfluxDB API endpoint.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

The example below instantiates the `InfluxDB` client and `BucketsAPI` client, calls the `BucketsAPI getBuckets` function, and returns the bucket ID.

```js
import { InfluxDB } from '@influxdata/influxdb-client'
import { BucketsAPI } from '@influxdata/influxdb-client-apis'

const influxdb = new InfluxDB({url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN})
const bucketsAPI = new BucketsAPI(influxdb)

async function getBucketId() { 
  const buckets = await bucketsAPI.getBuckets({name: process.env.INFLUX_BUCKET, orgID: process.env.INFLUX_ORG})
  return buckets.buckets[0]?.id
}
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Create an authorization for the device

To create an authorization and receive an API token for the device, use the InfluxDB client library to send a `POST` request to the `/api/v2/authorizations` InfluxDB API endpoint.
In your request body, pass an authorization with the following:

- description `IoTCenterDevice: DEVICE_ID` 
- array of permissions for the [bucket ID](#get-the-bucket-id)

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

The example below uses the client library to create an authorization
in the following steps:

1. Instantiate the `InfluxDB` client as `influxdb`.
2. Instantiate the `AuthorizationsAPI` client and `BucketsAPI` client with the `influxdb` configuration.
3. Retrieve the bucket ID.
4. Call the AuthorizationsAPI `postAuthorization` function with a new authorization and return the result from InfluxDB.

```js
import { InfluxDB } from '@influxdata/influxdb-client'
import { AuthorizationsAPI, BucketsAPI } from '@influxdata/influxdb-client-apis'

const influxdb = new InfluxDB({url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN})
async function postAuthorization(deviceId) {
  const authorizationsAPI = new AuthorizationsAPI(influxdb)
  const bucketsAPI = new BucketsAPI(influxdb)
  const DESC_PREFIX = 'IoTCenterDevice: '

  const buckets = await bucketsAPI.getBuckets({name: process.env.INFLUX_BUCKET, orgID: process.env.INFLUX_ORG})
  const bucketId = buckets.buckets[0]?.id

  const auth = await authorizationsAPI.postAuthorizations({
    body: {
      orgID: process.env.INFLUX_ORG,
      description: DESC_PREFIX + deviceId,
      permissions: [
        {
          action: 'read',
          resource: {type: 'buckets', id: bucketId, orgID: process.env.INFLUX_ORG},
        },
        {
          action: 'write',
          resource: {type: 'buckets', id: bucketId, orgID: process.env.INFLUX_ORG},
        },
      ],
    },
  })

  return auth
}
```

{{% caption %}}[@influxdata/influxdb-client-js QueryAPI, line 92](https://github.com/influxdata/influxdb-client-js/blob/3db2942432b993048d152e0d0e8ec8499eedfa60/packages/core/src/QueryApi.ts#L92){{% /caption %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Next, [write the device authorization to a bucket](#write-the-device-authorization-to-a-bucket).

### Write the device authorization to a bucket

After you create the device authorization, write a point with the device and authorization details to `INFLUX_BUCKET_AUTH`.
Storing the device authorization in a bucket allows you to do the following:

- Report device authorization history.
- Manage devices with and without tokens.
- Assign the same token to multiple devices.
- Refresh tokens.

To write a point to InfluxDB, use the InfluxDB client library to send a `POST` request to the `/api/v2/write` InfluxDB API endpoint.

In `./pages/api/devices/create.js`, add a `createDevice(deviceId)` function that uses the client library `getWriteApi()`
method to write a point to `INFLUX_BUCKET_AUTH`--for example:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

```js
/** Creates an authorization for a deviceId and writes it to a bucket */
async function createDevice(deviceId) {
  let device = (await getDevices(deviceId)) || {}
  let authorizationValid = !!Object.values(device)[0]?.key
  if(authorizationValid) {
    console.log(JSON.stringify(device))
    return Promise.reject('This device ID is already registered and has an authorization.')
  } else {
    console.log(`createDeviceAuthorization: deviceId=${deviceId}`)
    const authorization = await createAuthorization(deviceId)
    const writeApi = influxdb.getWriteApi(INFLUX_ORG, INFLUX_BUCKET_AUTH, 'ms', {
      batchSize: 2,
    })
    const point = new Point('deviceauth')
      .tag('deviceId', deviceId)
      .stringField('key', authorization.id)
      .stringField('token', authorization.token)
    writeApi.writePoint(point)
    await writeApi.close()
    return
  }
}
```

{{% caption %}}[iot-api-js/pages/api/devices/create.js](https://github.com/influxdata/iot-api-js/blob/25b38c94a1f04ea71f2ef4b9fcba5350d691cb9d/pages/api/devices/create.js){{% /caption %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

In the previous example, the point contains the following elements:

| Element     | Name       | Value                     |
|:------------|:-----------|:--------------------------|
| measurement |            | `deviceauth`              |
| tag         | `deviceId` | device ID                 |
| field       | `key`      | authorization ID          |
| field       | `token`    | authorization (API) token |

In your browser, visit <http://localhost:3000/devices> to register and list your devices.
