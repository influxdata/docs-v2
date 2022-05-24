---
title: Client library starter tutorial for JavaScript (Node.js and React)
seotitle: Build an IoT dashboard with API client libraries
description: Learn to write, query, and manage authorizations with InfluxDB client libraries.
weight: 3
menu:
  influxdb_2_2:
    name: JS with Node.js and React
    parent: Client library starter
influxdb/cloud/tags: [api]
---

{{% api/iot-starter-intro %}}

## Create your app

[Next.js](https://nextjs.org/) provides a framework and tools to help you quickly build a full-stack JavaScript application with production-level features and minimal setup.

To begin, use `npx` to create the `nextjs-iot-starter` app from the from the NextJS [learn-starter template](https://github.com/vercel/next-learn/tree/master/basics/learn-starter).

```sh
npx create-next-app nextjs-iot-starter --use-npm --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"
```

After the installation completes, go into your `nextjs-iot-starter` directory and start the development server.

```sh
cd nextjs-iot-starter
npm run dev
```

To verify you can access the app, visit [http://localhost:3000](http://localhost:3000) in your browser.

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

In the `./pages` directory, create the following files:

- [`pages/_layout.js`](): shared layout that applies a header, footer, and CSS to all `pages`.
- [`pages/_app.js`](): root application component that imports `Layout` and wraps `/pages` routes.

### Create devices UI components

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

#### Copy the list devices example

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

Create a `./pages/api/devices/_devices.js` file that contains the following:

```js
{{< get-shared-text "api/v2.0/client-library-examples/nodejs/server/devices/_devices.js" >}}
```

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

Create a `./pages/api/devices/index.js` file that contains the following:

```js
{{< get-shared-text "api/v2.0/client-library-examples/nodejs/server/devices/_devices.js" >}}
```

The example exports a server request `handler` function that listens for
requests to `/api/devices` and responds with the result of `getDevices(deviceId)`.

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

[View the complete example](api/v2.0/client-library-examples/nodejs/server/devices/create.js).

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

The example below instantiates the InfluxDB client and BucketsAPI client, calls the BucketsAPI `getBuckets` function, and returns the bucket ID.

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

The example below uses the JavaScript client library to create an authorization
in the following steps:

1. Instantiates the `InfluxDB` client as `influxdb`
2. Instantiates the Authorizations client with the `influxdb` configuration
3. Instantiates the and Buckets client with the `influxdb` configuration
4. Retrieves the bucket ID.
5. Calls the AuthorizationsAPI `postAuthorization` function with a new authorization and returns the result from InfluxDB.

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

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}


Next, [write the device authorization to a bucket](#write-the-device-authorization-to-a-bucket).

### Write the device authorization to a bucket

After you create the device authorization, write a point with the device and authorization details to `INFLUX_BUCKET_AUTH`.
Storing the device authorization in a bucket enables the following:

- report device authorization history
- manage devices with and without tokens
- assign the same token to multiple devices
- refresh tokens

To write a point to InfluxDB, use the InfluxDB client library to send a `POST` request to the `/api/v2/write` InfluxDB API endpoint.
In your request body, pass a point that contains the following elements:

| Element     | Name       | Value                     |
|:-------     |:-------- --|:--------------------------|
| measurement |            | `deviceauth`              |
| tag         | `deviceId` | device ID                 |
| field       | `key`      | authorization ID          |
| field       | `token`    | authorization (API) token |g


