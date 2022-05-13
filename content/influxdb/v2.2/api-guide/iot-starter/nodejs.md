---
title: IoT Starter Guide
seotitle: Use API client libraries to build an IoT Center
description: Write, query, and manage authorizations with InfluxDB client libraries.
weight: 3
menu:
  influxdb_2_2:
    name: IoT Starter - Part 1
    parent: IoT Starter
influxdb/cloud/tags: [api]
---

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

Next.js provides an `env` module to provide environment variables to your app and prevents them being added to version control.
Create an `.env.local` file that contains settings for your _development_ environment.

```sh
# .env.local

INFLUX_URL=http://192.168.1.2:8086
INFLUX_TOKEN=29Ye1KH9VkASPR2DSfRfFd82OwGD-5HWkBj0Ju_m-DTgT4PHakgweD3p87mp45Y633njDllKkD5wVc0zMCVhIw==
INFLUX_ORG=48c88459ee424a04

INFLUX_BUCKET=iot_center
INFLUX_BUCKET_AUTH=iot_center_devices
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

## Create UI layout

### Create a shared layout in a custom app

Create a shared UI layout that applies a header, footer, and CSS to all `pages` in your app.
To create the shared layout, do the following:

1. [Create a shared layout component](#create-a-shared-layout-component)
2. [Create a custom app component](#create-a-custom-app-component)

#### Create a shared layout component

Add a `Layout` component that renders a header, footer, and CSS.
To add the `Layout` component, create a `pages/_layout.js` file that contains the following:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

```js
import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <div className="container">
      <Head>
        <title>IoT Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{children}</main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className="logo" />
        </a>
      </footer>

      <style jsx global>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        form input {
          margin-left: 0.5rem;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .card .alert.alert-danger {
            color: #721c24;
            background-color: #f8d7da;
            border-color: #f5c6cb;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }

        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### Create a custom app component

Add a custom app that imports your `Layout` component to wrap `/pages` routes.
To add the custom app component, create a `pages/_app.js` file that contains the following:

```js
import Layout from './_layout'

export default function IotStarter({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

### Create devices UI components

#### Create the devices list component

Add a `DeviceList` UI component that retrieves and displays the list of devices from your `/api/devices` IoT Starter endpoint.
The example code below requests and renders devices from `/api/devices` whenever the `deviceId` property changes.

To add the component, create a `pages/_deviceList.js` file that contains the following:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

```js
import React, { useState, useEffect } from 'react';

export default function DeviceList({ deviceId, onError, isLoading}) {
 const [data, setData] = useState(null)

  useEffect(() => {
    isLoading(true)
    fetch(`api/devices/${deviceId || ''}`)
    .then((res) => res.json())
    .then((data) => {
      if(Array.isArray(data)) {
        setData(data)
      }
      if(data.error) {
        onError(data.error)
      }
      isLoading(false)
    })
  }, [deviceId])

  return (
      <dl>
      { Array.isArray(data) ?
        data.map(item => (
          <React.Fragment key={item.key}>
          <dt id={'deviceId_' + item.key}>{item.deviceId}</dt>
          <dd key={item.key + '_detail'}>Updated at: {item.updatedAt}</dd>
          </React.Fragment>
          )
        ) : <p>No device data</p>
      }
      </dl>
  )
}

```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### Create the register device form component

Create a `DeviceRegistrationButton` component that renders a button to submit a new device ID.
When the user enters a device ID and clicks the **Register** button, the component passes the device ID in a `POST` request to the `/api/devices/create` IoT Starter endpoint (you'll create in a [later step](#create-the-api-endpoint-to-register-devices).
To add the UI component, create a `pages/devices/_deviceRegistrationButton.js` file that contains the following:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

```js
import React, { useState, useEffect } from 'react'
import Devices from './_devices'

export default function DeviceRegistrationForm() {
  const [device, setDevice] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deviceId, setDeviceId] = useState('')

  function handleRegister(event) {
    setLoading(true)
    const body = JSON.stringify({ deviceId })

    fetch('/api/devices/create', { method: 'POST', body })
      .then((res) => res.json())
      .then((data) => {
        if(Array.isArray(data)) {
          setDevice(data)
        }
        if(data.error) {
          setError(data.error)
        }
        setLoading(false)
      })
  }

  function handleChange(event) {
    setError('')
    setDeviceId(event.target.value)
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <>
      { error &&
         <div className="alert alert-danger">{ error }</div>
      }
      <h2>Register a device</h2>
      <form onSubmit={ handleRegister }>
        <label>
          New device ID:
          <input type="text" name="register_deviceId" onChange={ handleChange } />
        </label>
        <input type="submit" value="Register" />
      </form>

      <div>
        <Devices />
      </div>
    </>
  )
}

```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

#### Create the devices page component

Add a `DevicesCard` component that renders a form to register a new device, list
all devices, or find a specific registered device.
Your component should manage the following _state_ properties:

- `deviceId`
- `error`
- `isLoading`
  
and contain a `form` with the following:

- device ID **text input** that sets the `deviceId` property
- [`DeviceRegistrationButton`](#create-the-device-registration-button-component) that takes `deviceId` and callback functions to handle _error_ and _loading_ statuses
- [`DeviceList`](#create-the-devices-list-ui-component) component that takes `deviceId` and a callback function to handle _loading_ status

To create a `DevicesCard` component that serves as the default devices page at `http://localhost:3000/devices/`, create a `<iot-starter-root>/pages/devices/index.js` file that contains the following:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Node.js](#nodejs)
{{% /code-tabs %}}
{{% code-tab-content %}}

```js
import React, { useState } from 'react'
import DeviceRegistrationButton from './_deviceRegistrationButton'
import DeviceList from './_deviceList'

export default function DevicesCard() {
  const [deviceId, setDeviceId] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(event) {
    setError('')
    setDeviceId(event.target.value)
  }

  function handleError(error) {
    console.log(error)
    setError(error)
  }

  return(
      <div className="card">
        <div className="alert">
        { isLoading && <span>Loading...</span>}
        { error &&
          <span className="alert-danger">{ error }</span>
        }
        </div>
        <form>
          <label>
            Device ID:
            <input type="text" name="register_deviceId" onChange={ handleChange } />
          </label>
          <DeviceRegistrationButton deviceId={ deviceId } onError={ handleError } isLoading={ setIsLoading } />
          <h2>Registered devices</h2>
          <DeviceList deviceId={ deviceId } isLoading={ setIsLoading }  />
        </form>
      </div>
  )
}
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

With the UI components in place, you're ready to [build the application API](#build-the-iot-starter-api) that
handles requests from the UI and responses from InfluxDB.

## Build the IoT Starter API

The IoT Starter API provides URL endpoints and routes HTTP requests to server-side code and InfluxDB.

Each API endpoint is responsible for the following:

- Listen for requests from IoT Starter UI components.
- Translate requests into InfluxDB API requests.
- Process InfluxDB API responses and handles errors.
- Provide data to UI components.

Follow these steps to build the IoT Starter API:

1. [Create the API endpoint to list devices](#create-the-api-endpoint-to-list-devices)
2. [Create the API endpoint to register devices](#create-the-api-endpoint-to-register-devices)

### Create the API endpoint to list devices

The IoT Starter `/api/devices` endpoint handles requests from the UI, queries InfluxDB, and returns
registered device data to the UI.

Follow these steps to build the `/api/devices` endpoint:

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

To send the query and process the results, use the QueryAPI `queryRows(query, consumer)` method.
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


