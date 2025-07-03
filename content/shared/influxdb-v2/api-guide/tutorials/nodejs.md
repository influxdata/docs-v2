<!-- Shortcode -->

{{% api/iot-starter-intro %}}

## Contents

- [Contents](#contents)
- [Set up InfluxDB](#set-up-influxdb)
- [Introducing IoT Starter](#introducing-iot-starter)
- [Install Yarn](#install-yarn)
- [Create the application](#create-the-application)
- [Install InfluxDB client library](#install-influxdb-client-library)
- [Configure the client library](#configure-the-client-library)
- [Build the API](#build-the-api)
- [Create the API to list devices](#create-the-api-to-list-devices)
  - [Handle requests for device information](#handle-requests-for-device-information)
  - [Retrieve and list devices](#retrieve-and-list-devices)
- [Create the API to register devices](#create-the-api-to-register-devices)
  - [Create an authorization for the device](#create-an-authorization-for-the-device)
  - [Write the device authorization to a bucket](#write-the-device-authorization-to-a-bucket)
- [Install and run the UI](#install-and-run-the-ui)

## Set up InfluxDB

If you haven't already, [create an InfluxDB Cloud account](https://www.influxdata.com/products/influxdb-cloud/) or [install InfluxDB OSS](https://www.influxdata.com/products/influxdb/).

The IoT Starter example app assumes the following prerequisites:

- An InfluxDB [org ID](/influxdb/version/admin/organizations/view-orgs/)
- An [API token](/influxdb/version/admin/tokens/create-token/) (for example, an **All Access token**) that has read and write permissions for the buckets
- A [bucket](/influxdb/version/admin/buckets/create-bucket/#create-a-bucket-using-the-influxdb-api) named `iot_center` for storing time series data from devices
- A [bucket](/influxdb/version/admin/buckets/create-bucket/#create-a-bucket-using-the-influxdb-api) named `iot_center_devices` for storing device metadata and API token IDs

{{% note %}}

#### Use restricted tokens for production apps

For a production application, create and use a
{{% show-in "cloud,cloud-serverless" %}}custom{{% /show-in %}}{{% show-in "v2" %}}read-write{{% /show-in %}}
token with minimal permissions and only use it with a single client or application.

{{% /note %}}

## Introducing IoT Starter

The application architecture has four layers:

- **InfluxDB API**: InfluxDB v2 API.
- **IoT device**: Virtual or physical devices write IoT data to the InfluxDB API.
- **UI**: Sends requests to the server and renders views in the browser.
- **API**: Receives requests from the UI, sends requests to InfluxDB, and processes responses from InfluxDB.

{{% note %}}
For the complete code referenced in this tutorial, see the [influxdata/iot-api-js repository](https://github.com/influxdata/iot-api-js).
{{% /note %}}

## Install Yarn

If you haven't already installed `yarn`, follow the [Yarn package manager installation instructions](https://yarnpkg.com/getting-started/install#nodejs-1610-1) for your version of Node.js.

- To check the installed `yarn` version, enter the following code into your terminal:

   ```bash
   yarn --version
   ```

## Create the application

Create a directory that will contain your `iot-api` projects.
The following example code creates an `iot-api` directory in your home directory
and changes to the new directory:

```bash
mkdir ~/iot-api-apps
cd ~/iot-api-apps
```

Follow these steps to create a JavaScript application with [Next.js](https://nextjs.org/):

1. In your `~/iot-api-apps` directory, open a terminal and enter the following commands to create the `iot-api-js` app from the NextJS [learn-starter template](https://github.com/vercel/next-learn/tree/master/basics/learn-starter):

   ```bash
   yarn create-next-app iot-api-js --example "https://github.com/vercel/next-learn/tree/master/basics/learn-starter"
   ```

2. After the installation completes, enter the following commands in your terminal to go into your `./iot-api-js` directory and start the development server:

   ```bash
   cd iot-api-js
   yarn dev -p 3001
   ```

To view the application, visit <http://localhost:3001> in your browser.

## Install InfluxDB client library

The InfluxDB client library provides the following InfluxDB API interactions:

- Query data with the Flux language.
- Write data to InfluxDB.
- Batch data in the background.
- Retry requests automatically on failure.

1. Enter the following command into your terminal to install the client library:

   ```bash
   yarn add @influxdata/influxdb-client
   ```

2. Enter the following command into your terminal to install `@influxdata/influxdb-client-apis`, the _management APIs_ that create, modify, and delete authorizations, buckets, tasks, and other InfluxDB resources:

   ```bash
   yarn add @influxdata/influxdb-client-apis
   ```

For more information about the client library, see the [influxdata/influxdb-client-js repo](https://github.com/influxdata/influxdb-client-js).

## Configure the client library

InfluxDB client libraries require configuration properties from your InfluxDB environment.
Typically, you'll provide the following properties as environment variables for your application:

- `INFLUX_URL`
- `INFLUX_TOKEN`
- `INFLUX_ORG`
- `INFLUX_BUCKET`
- `INFLUX_BUCKET_AUTH`

Next.js uses the `env` module to provide environment variables to your application.

The `./.env.development` file is versioned and contains non-secret default settings for your _development_ environment.

```bash
# .env.development

INFLUX_URL=http://localhost:8086
INFLUX_BUCKET=iot_center
INFLUX_BUCKET_AUTH=iot_center_devices
```

To configure secrets and settings that aren't added to version control,
create a `./.env.local` file and set the variables--for example, set your InfluxDB token and organization:

```sh
# .env.local

# INFLUX_TOKEN
# InfluxDB API token used by the application server to send requests to InfluxDB.
# For convenience in development, use an **All Access** token.

INFLUX_TOKEN=29Xx1KH9VkASPR2DSfRfFd82OwGD...

# INFLUX_ORG
# InfluxDB organization ID you want to use in development.

INFLUX_ORG=48c88459ee424a04
```

Enter the following commands into your terminal to restart and load the `.env` files:

  1. `CONTROL+C` to stop the application.
  2. `yarn dev` to start the application.

Next.js sets variables that you can access in the `process.env` object--for example:

```ts
console.log(process.env.INFLUX_ORG)
```

## Build the API

Your application API provides server-side HTTP endpoints that process requests from the UI.
Each API endpoint is responsible for the following:

1. Listen for HTTP requests (from the UI).
2. Translate requests into InfluxDB API requests.
3. Process InfluxDB API responses and handle errors.
4. Respond with status and data (for the UI).

## Create the API to list devices

Add the `/api/devices` API endpoint that retrieves, processes, and lists devices.
`/api/devices` uses the `/api/v2/query` InfluxDB API endpoint to query `INFLUX_BUCKET_AUTH` for a registered device.

### Handle requests for device information

1. Create a `./pages/api/devices/[[...deviceParams]].js` file to handle requests for `/api/devices` and `/api/devices/<deviceId>/measurements/`.

2. In the file, export a Next.js request `handler` function.
[See the example](https://github.com/influxdata/iot-api-js/blob/18d34bcd59b93ad545c5cd9311164c77f6d1995a/pages/api/devices/%5B%5B...deviceParams%5D%5D.js).

  {{% note %}}
In Next.js, the filename pattern `[[...param]].js` creates a _catch-all_ API route.
To learn more, see [Next.js dynamic API routes](https://nextjs.org/docs/api-routes/dynamic-api-routes).
  {{% /note %}}

### Retrieve and list devices

Retrieve registered devices in `INFLUX_BUCKET_AUTH` and process the query results.

1. Create a Flux query that gets the last row of each [series](/influxdb/version/reference/glossary#series) that contains a `deviceauth` measurement.
   The example query below returns rows that contain the `key` field (authorization ID) and excludes rows that contain a `token` field (to avoid exposing tokens to the UI).

   ```js
   // Flux query finds devices
    from(bucket:`${INFLUX_BUCKET_AUTH}`)
         |> range(start: 0)
         |> filter(fn: (r) => r._measurement == "deviceauth" and r._field != "token")
         |> last()
   ```

2. Use the `QueryApi` client to send the Flux query to the `POST /api/v2/query` InfluxDB API endpoint.

Create a `./pages/api/devices/_devices.js` file that contains the following:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% truncate %}}

```ts
import { InfluxDB } from '@influxdata/influxdb-client'
import { flux } from '@influxdata/influxdb-client'

const INFLUX_ORG = process.env.INFLUX_ORG
const INFLUX_BUCKET_AUTH = process.env.INFLUX_BUCKET_AUTH
const influxdb = new InfluxDB({url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN})

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
        resolve(devices)
      },
    })
  })
}
```

{{% /truncate %}}

{{% caption %}}[iot-api-js/pages/api/devices/_devices.js getDevices(deviceId)](https://github.com/influxdata/iot-api-js/blob/18d34bcd59b93ad545c5cd9311164c77f6d1995a/pages/api/devices/_devices.js){{% /caption %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

The `_devices` module exports a `getDevices(deviceId)` function that queries
for registered devices, processes the data, and returns a Promise with the result.
If you invoke the function as `getDevices()` (without a _`deviceId`_),
it retrieves all `deviceauth` points and returns a Promise with `{ DEVICE_ID: ROW_DATA }`.

To send the query and process results, the `getDevices(deviceId)` function uses the `QueryAPI queryRows(query, consumer)` method.
`queryRows` executes the `query` and provides the Annotated CSV result as an Observable to the `consumer`.
`queryRows` has the following TypeScript signature:

```ts
queryRows(
  query: string | ParameterizedQuery,
  consumer: FluxResultObserver<string[]>
): void
```

{{% caption %}}[@influxdata/influxdb-client-js QueryAPI](https://github.com/influxdata/influxdb-client-js/blob/3db2942432b993048d152e0d0e8ec8499eedfa60/packages/core/src/QueryApi.ts){{% /caption %}}

The `consumer` that you provide must implement the [`FluxResultObserver` interface](https://github.com/influxdata/influxdb-client-js/blob/3db2942432b993048d152e0d0e8ec8499eedfa60/packages/core/src/results/FluxResultObserver.ts) and provide the following callback functions:

- `next(row, tableMeta)`: processes the next row and table metadata--for example, to prepare the response.
- `error(error)`: receives and handles errors--for example, by rejecting the Promise.
- `complete()`: signals when all rows have been consumed--for example, by resolving the Promise.

To learn more about Observers, see the [RxJS Guide](https://rxjs.dev/guide/observer).

## Create the API to register devices

In this application, a _registered device_ is a point that contains your device ID, authorization ID, and API token.
The API token and authorization permissions allow the device to query and write to `INFLUX_BUCKET`.
In this section, you add the API endpoint that handles requests from the UI, creates an authorization in InfluxDB,
and writes the registered device to the `INFLUX_BUCKET_AUTH` bucket.
To learn more about API tokens and authorizations, see [Manage API tokens](/influxdb/version/admin/tokens/)

The application API uses the following `/api/v2` InfluxDB API endpoints:

- `POST /api/v2/query`: to query `INFLUX_BUCKET_AUTH` for a registered device.
- `GET /api/v2/buckets`: to get the bucket ID for `INFLUX_BUCKET`.
- `POST /api/v2/authorizations`: to create an authorization for the device.
- `POST /api/v2/write`: to write the device authorization to `INFLUX_BUCKET_AUTH`.

1. Add a `./pages/api/devices/create.js` file to handle requests for `/api/devices/create`.
2. In the file, export a Next.js request `handler` function that does the following:

   1. Accept a device ID in the request body.
   2. Query `INFLUX_BUCKET_AUTH` and respond with an error if an authorization exists for the device.
   3. [Create an authorization for the device](#create-an-authorization-for-the-device).
   4. [Write the device ID and authorization to `INFLUX_BUCKET_AUTH`](#write-the-device-authorization-to-a-bucket).
   5. Respond with `HTTP 200` when the write request completes.

[See the example](https://github.com/influxdata/iot-api-js/blob/25b38c94a1f04ea71f2ef4b9fcba5350d691cb9d/pages/api/devices/create.js).

### Create an authorization for the device

In this section, you create an authorization with _read_-_write_ permission to `INFLUX_BUCKET` and receive an API token for the device.
The example below uses the following steps to create the authorization:

1. Instantiate the `AuthorizationsAPI` client and `BucketsAPI` client with the configuration.
2. Retrieve the bucket ID.
3. Use the client library to send a `POST` request to the `/api/v2/authorizations` InfluxDB API endpoint.

In `./api/devices/create.js`, add the following `createAuthorization(deviceId)` function:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% truncate %}}

```js
import { InfluxDB } from '@influxdata/influxdb-client'
import { getDevices } from './_devices'
import { AuthorizationsAPI, BucketsAPI } from '@influxdata/influxdb-client-apis'
import { Point } from '@influxdata/influxdb-client'

const INFLUX_ORG = process.env.INFLUX_ORG
const INFLUX_BUCKET_AUTH = process.env.INFLUX_BUCKET_AUTH
const INFLUX_BUCKET = process.env.INFLUX_BUCKET

const influxdb = new InfluxDB({url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN})

/**
 * Creates an authorization for a supplied deviceId
 * @param {string} deviceId client identifier
 * @returns {import('@influxdata/influxdb-client-apis').Authorization} promise with authorization or an error
 */
async function createAuthorization(deviceId) {
  const authorizationsAPI = new AuthorizationsAPI(influxdb)
  const bucketsAPI = new BucketsAPI(influxdb)
  const DESC_PREFIX = 'IoTCenterDevice: '

  const buckets = await bucketsAPI.getBuckets({name: INFLUX_BUCKET, orgID: INFLUX_ORG})
  const bucketId = buckets.buckets[0]?.id
  
  return await authorizationsAPI.postAuthorizations(
    {
      body: {
              orgID: INFLUX_ORG,
              description: DESC_PREFIX + deviceId,
              permissions: [
                {
                  action: 'read',
                  resource: {type: 'buckets', id: bucketId, orgID: INFLUX_ORG},
                },
                {
                  action: 'write',
                  resource: {type: 'buckets', id: bucketId, orgID: INFLUX_ORG},
                },
              ],
            },
    }
  )

}
```

{{% /truncate %}}
{{% caption %}}[iot-api-js/pages/api/devices/create.js](https://github.com/influxdata/iot-api-js/blob/42a37d683b5e4df601422f85d2c22f5e9d592e68/pages/api/devices/create.js){{% /caption %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

To create an authorization that has _read_-_write_ permission to `INFLUX_BUCKET`, you need the bucket ID.
To retrieve the bucket ID,
`createAuthorization(deviceId)` calls the `BucketsAPI getBuckets` function that sends a `GET` request to
the `/api/v2/buckets` InfluxDB API endpoint.
`createAuthorization(deviceId)` then passes a new authorization in the request body with the following:

- Bucket ID.
- Organization ID.
- Description: `IoTCenterDevice: DEVICE_ID`.
- List of permissions to the bucket.

To learn more about API tokens and authorizations, see [Manage API tokens](/influxdb/version/admin/tokens/).

Next, [write the device authorization to a bucket](#write-the-device-authorization-to-a-bucket).

### Write the device authorization to a bucket

With a device authorization in InfluxDB, write a point for the device and authorization details to `INFLUX_BUCKET_AUTH`.
Storing the device authorization in a bucket allows you to do the following:

- Report device authorization history.
- Manage devices with and without tokens.
- Assign the same token to multiple devices.
- Refresh tokens.

To write a point to InfluxDB, use the InfluxDB client library to send a `POST` request to the `/api/v2/write` InfluxDB API endpoint.
In `./pages/api/devices/create.js`, add the following `createDevice(deviceId)` function:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

```ts
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

`createDevice(device_id)` takes a _`device_id`_ and writes data to `INFLUX_BUCKET_AUTH` in the following steps:

1. Initialize `InfluxDBClient()` with `url`, `token`, and `org` values from the configuration.
2. Initialize a `WriteAPI` client for writing data to an InfluxDB bucket.
3. Create a `Point`.
4. Use `writeApi.writePoint(point)` to write the `Point` to the bucket.

The function writes a point with the following elements:

| Element     | Name       | Value                     |
|:------------|:-----------|:--------------------------|
| measurement |            | `deviceauth`              |
| tag         | `deviceId` | device ID                 |
| field       | `key`      | authorization ID          |
| field       | `token`    | authorization (API) token |

## Install and run the UI

`influxdata/iot-api-ui` is a standalone [Next.js React](https://nextjs.org/docs/basic-features/pages) UI that uses your application API to write and query data in InfluxDB.
`iot-api-ui` uses Next.js _[rewrites](https://nextjs.org/docs/api-reference/next.config.js/rewrites)_ to route all requests in the `/api/` path to your API.

To install and run the UI, do the following:

1. In your `~/iot-api-apps` directory, clone the [`influxdata/iot-api-ui` repo](https://github.com/influxdata/iot-api-ui) and go into the `iot-api-ui` directory--for example:

   ```bash
   cd ~/iot-api-apps
   git clone git@github.com:influxdata/iot-api-ui.git
   cd ./iot-app-ui
   ```

2. The `./.env.development` file contains default configuration settings that you can
   edit or override (with a `./.env.local` file).
3. To start the UI, enter the following command into your terminal:

   ```bash
   yarn dev
   ```

   To view the list and register devices, visit <http://localhost:3000/devices> in your browser.

To learn more about the UI components, see [`influxdata/iot-api-ui`](https://github.com/influxdata/iot-api-ui).
