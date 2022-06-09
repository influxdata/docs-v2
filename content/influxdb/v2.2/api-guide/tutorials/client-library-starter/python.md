---
title: Python client library starter
seotitle: Use Python client library to build a sample application
list_title: Python
description: >
  Build an application that writes, queries, and manages devices with the InfluxDB
  client library for Python.
weight: 3
menu:
  influxdb_2_2:
    identifier: client-library-starter-py
    name: Python
    parent: Client library starter
influxdb/cloud/tags: [api]
---

{{% api/iot-starter-intro %}}
- How to use the InfluxData UI libraries to format data and create visualizations.

## Contents

- [Contents](#contents)
- [Set up InfluxDB](#set-up-influxdb)
  - [Authenticate with an InfluxDB API token](#authenticate-with-an-influxdb-api-token)
- [Introducing IoT Starter](#introducing-iot-starter)
- [Create the application](#create-the-application)
- [Install InfluxDB client library](#install-influxdb-client-library)
- [Configure the client library](#configure-the-client-library)
- [Build the API](#build-the-api)
- [Create the API to register devices](#create-the-api-to-register-devices)
  - [Create an authorization for the device](#create-an-authorization-for-the-device)
  - [Write the device authorization to a bucket](#write-the-device-authorization-to-a-bucket)
- [Create the API to list devices](#create-the-api-to-list-devices)
  - [Retrieve and process devices](#retrieve-and-process-devices)
- [Create IoT virtual device](#create-iot-virtual-device)
- [Write telemetry data](#write-telemetry-data)
- [Query telemetry data](#query-telemetry-data)
- [Define API responses](#define-api-responses)
- [Install and run the UI](#install-and-run-the-ui)

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
- **API**: Receives requests from the UI, sends requests to InfluxDB,
  and processes responses from InfluxDB.

## Create the application

Create a directory that will store your `iot-api` projects.
The following example code creates an `iot-api` directory in your home directory
and changes to the new directory:

```sh
mkdir ~/iot-api-apps
cd ~/iot-api-apps
```

Use [Flask](https://flask.palletsprojects.com/), a lightweight Python web
framework,
to create your application.

1. In your `~/iot-api-apps` directory, open a terminal and enter the following commands to create and navigate into a new project directory:

    ```bash
    mkdir iot-api-python && cd $_
    ```

2. Enter the following commands in your terminal to create and activate a Python virtual environment for the project:

    ```bash
    # Create a new virtual environment named "virtualenv"
    # Python 3.8+
    python -m venv virtualenv

    # Activate the virtualenv (OS X & Linux)
    source virtualenv/bin/activate
    ```

3. After activation completes, enter the following commands in your terminal to install Flask with the `pip` package installer (included with Python):

    ```bash
    pip install Flask
    ```

4. In your project, create a `app.py` file that:

   1. Imports the Flask package.
   2. Instantiates a Flask application.
   3. Provides a route to execute the application.

   ```python
   from flask import Flask
   app = Flask(__name__)

   @app.route("/")
   def hello():
     return "Hello World!"
   ```

   {{% caption %}}[influxdata/iot-api-python app.py](https://github.com/influxdata/iot-api-python/blob/main/app.py){{% /caption %}}

   Start your application.
   The following example code starts the application
   on `http://localhost:5200` with debugging and hot-reloading enabled:

   ```bash
   export FLASK_ENV=development
   flask run -h localhost -p 5200
   ```
 
   In your browser, visit <http://localhost:5200> to view the “Hello World!” response.

## Install InfluxDB client library

The InfluxDB client library provides the following InfluxDB API interactions:

- Query data with the Flux language.
- Write data to InfluxDB.
- Batch data in the background.
- Retry requests automatically on failure.

Enter the following command into your terminal to install the client library:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash
pip install influxdb-client
```

For more information about the client library, see the [influxdata/influxdb-client-python repo](https://github.com/influxdata/influxdb-client-python).

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Configure the client library

InfluxDB client libraries require configuration properties from your InfluxDB environment.
Typically, you'll provide the following properties as environment variables for your application:

- `INFLUX_URL`
- `INFLUX_TOKEN`
- `INFLUX_ORG`
- `INFLUX_BUCKET`
- `INFLUX_BUCKET_AUTH`

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}

To set up the client configuration, create a `config.ini` in your project's top
level directory and paste the following to provide the necessary InfluxDB credentials:

```ini
[APP]
INFLUX_URL = <INFLUX_URL>
INFLUX_TOKEN = <INFLUX_TOKEN>
INFLUX_ORG = <INFLUX_ORG_ID>
INFLUX_BUCKET = iot_center
INFLUX_BUCKET_AUTH = iot_center_devices
```

{{% caption %}}[/iot-api-python/config.ini](https://github.com/influxdata/iot-api-python/blob/main/config.ini){{% /caption %}}

Replace the following:

- **`<INFLUX_URL>`**: your InfluxDB instance URL.
- **`<INFLUX_TOKEN>`**: your InfluxDB [API token](#authorization) with permission to query (_read_) buckets
and create (_write_) authorizations for devices.
- **`<INFLUX_ORG_ID>`**: your InfluxDB organization ID.

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Build the API

Your application API provides server-side HTTP endpoints that process requests from the UI.
Each API endpoint is responsible for the following:

- Listen for HTTP requests (from the UI).
- Translate requests into InfluxDB API requests.
- Process InfluxDB API responses and handle errors.
- Respond and serve data (to the UI).

Follow these steps to build the API:

1. [Create the API to register devices](#create-the-api-to-register-devices)
2. [Create the API to list devices](#create-the-api-to-list-devices)

## Create the API to register devices

In this section, you'll use the client library to store
virtual device information in InfluxDB.

For this application, a _registered device_ is a point that contains your device ID, authorization ID, and API token.
The API token and authorization permissions allow the device to query and write to `INFLUX_BUCKET`.
In this section, you'll add the API endpoint that handles requests from the UI, creates an authorization in InfluxDB,
and writes the registered device to the `INFLUX_BUCKET_AUTH` bucket.
To learn more about API tokens and authorizations, see [Manage API tokens](/influxdb/v2.2/security/tokens/)

The application API uses the following `/api/v2` InfluxDB API endpoints:

- `POST /api/v2/query`: to query `INFLUX_BUCKET_AUTH` for a registered device.
- `GET /api/v2/buckets`: to get the bucket ID for `INFLUX_BUCKET`.
- `POST /api/v2/authorizations`: to create an authorization for the device.
- `POST /api/v2/write`: to write the device authorization to `INFLUX_BUCKET_AUTH`.

### Create an authorization for the device

Create an authorization with _read_-_write_ permission to `INFLUX_BUCKET` and receive an API token for the device.
The example below uses the following steps to create an authorization:

1. Instantiate the `AuthorizationsAPI` client and `BucketsAPI` client with the configuration.
2. Retrieve the bucket ID.
3. Use the client library to send a `POST` request to the `/api/v2/authorizations` InfluxDB API endpoint.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}

Create a `./api/devices.py` file that contains the following:

{{% truncate %}}

```python
# Import the dependencies.
import configparser
from datetime import datetime
from uuid import uuid4

# Import client library classes.
from influxdb_client import Authorization, InfluxDBClient, Permission, PermissionResource, Point, WriteOptions
from influxdb_client.client.authorizations_api import AuthorizationsApi
from influxdb_client.client.bucket_api import BucketsApi
from influxdb_client.client.query_api import QueryApi
from influxdb_client.client.write_api import SYNCHRONOUS

from api.sensor import Sensor

# Get the configuration key-value pairs.

config = configparser.ConfigParser()
config.read('config.ini')

def create_authorization(device_id) -> Authorization:
    influxdb_client = InfluxDBClient(url=config.get('APP', 'INFLUX_URL'),
                                     token=config.get('APP', 'INFLUX_TOKEN'),
                                     org=config.get('APP', 'INFLUX_ORG'))

    authorization_api = AuthorizationsApi(influxdb_client)

    buckets_api = BucketsApi(influxdb_client)
    buckets = buckets_api.find_bucket_by_name(config.get('APP', 'INFLUX_BUCKET_AUTH'))  # function returns only 1 bucket
    bucket_id = buckets.id
    org_id = buckets.org_id
    desc_prefix = f'IoTCenterDevice: {device_id}'
    # get bucket_id from bucket
    org_resource = PermissionResource(org_id=config.get('APP', 'INFLUX_ORG'), type="buckets")
    read = Permission(action="read", resource=org_resource)
    write = Permission(action="write", resource=org_resource)
    permissions = [read, write]

    authorization = Authorization(org_id=config.get('APP', 'INFLUX_ORG'),
                                  permissions=permissions,
                                  description=desc_prefix)

    request = authorization_api.create_authorization(org_id=org_id, permissions=permissions)
    return request
```

{{% /truncate %}}
{{% caption %}}[iot-api-python/api/devices.py](https://github.com/influxdata/iot-api-python/blob/f354941c80b6bac643ca29efe408fde1deebdc96/api/devices.py){{% /caption %}}

Creating an authorization with _read_-_write_ permission for `INFLUX_BUCKET` requires the bucket ID.
To retrieve the bucket ID, `create_authorization(deviceId)` calls the
`BucketsAPI find_bucket_by_name` function to send a `GET` request to
the `/api/v2/buckets` InfluxDB API endpoint.
`create_authorization(deviceId)` then passes a new authorization in the request body with the following:

- A description: `IoTCenterDevice: DEVICE_ID`.
- A list of permissions to the bucket.

Next, [write the device authorization to a bucket](#write-the-device-authorization-to-a-bucket).

### Write the device authorization to a bucket

With a device authorization in InfluxDB, write a point for the device and authorization details to `INFLUX_BUCKET_AUTH`.
Storing the device authorization in a bucket allows you to do the following:

- Report device authorization history.
- Manage devices with and without tokens.
- Assign the same token to multiple devices.
- Refresh tokens.

To write a point to InfluxDB, use the InfluxDB client library to send a `POST` request to the `/api/v2/write` InfluxDB API endpoint.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}

In `./api/devices.py`, add the following `create_device(device_id)` function:

```python
def create_device(device_id=None):
    influxdb_client = InfluxDBClient(url=config.get('APP', 'INFLUX_URL'),
                                     token=config.get('APP', 'INFLUX_TOKEN'),
                                     org=config.get('APP', 'INFLUX_ORG'))
    if device_id is None:
        device_id = str(uuid4())
    write_api = influxdb_client.write_api(write_options=SYNCHRONOUS)
    point = Point('deviceauth') \
        .tag("deviceId", device_id) \
        .field('key', f'fake_auth_id_{device_id}') \
        .field('token', f'fake_auth_token_{device_id}')
    client_response = write_api.write(bucket=config.get('APP', 'INFLUX_BUCKET_AUTH'), record=point)
    # write() returns None on success
    if client_response is None:
        return device_id
    # Return None on failure
    return None
```

{{% caption %}}[iot-api-python/api/devices.py](https://github.com/influxdata/iot-api-python/blob/f354941c80b6bac643ca29efe408fde1deebdc96/api/devices.py#L47){{% /caption %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

The `create_device(device_id)` function takes a _`device_id`_ and does the following to write virtual device data to `INFLUX_BUCKET`:

1. Initialize `InfluxDBClient()` with `url`, `token`, and `org` values from the configuration.
2. Initialize a `WriteAPI` instance for writing data to an InfluxDB bucket.
3. Create a `Point`.
4. Use `write_api.write()` to write the `Point` to a bucket.
5. Check for failures--if the write was successful, `write_api` returns `None`.
6. Return _`device_id`_ if successful; `None` otherwise.

The function writes a point with the following elements:

| Element     | Name       | Value                     |
|:------------|:-----------|:--------------------------|
| measurement |            | `deviceauth`              |
| tag         | `deviceId` | device ID                 |
| field       | `key`      | authorization ID          |
| field       | `token`    | authorization (API) token |

Next, [create the API to list devices](#create-the-api-to-list-devices).

## Create the API to list devices

Add the `/api/devices` API endpoint to do the following:

1. [Retrieve and process devices](#retrieve-and-process-devices)
2. Return a list of devices.

### Retrieve and process devices

Retrieve registered devices in `INFLUX_BUCKET_AUTH` and process the query results.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}

1. Create a Flux query that gets the last row of each [series](/influxdb/v2.2/reference/glossary#series) that contains a `deviceauth` measurement.
   The example query below returns rows that contain the `key` field (authorization ID) and excludes rows that contain a `token` field (to avoid exposing tokens to the UI).

   ```js
   // Flux query finds devices
    from(bucket:`${INFLUX_BUCKET_AUTH}`)
         |> range(start: 0)
         |> filter(fn: (r) => r._measurement == "deviceauth" and r._field != "token")
         |> last()
   ```

2. Use the `QueryApi` client to send the Flux query to the `POST /api/v2/query` InfluxDB API endpoint.

   {{< code-tabs-wrapper >}}
   {{% code-tabs %}}
   [Python](#python)
   {{% /code-tabs %}}
   {{% code-tab-content %}}

   In `./api/devices.py`, add the following:

   ```python
   def get_device(device_id) -> {}:
       influxdb_client = InfluxDBClient(url=config.get('APP', 'INFLUX_URL'),
                                        token=config.get('APP', 'INFLUX_TOKEN'),
                                        org=config.get('APP', 'INFLUX_ORG'))
       # Queries must be formatted with single and double quotes correctly
       query_api = QueryApi(influxdb_client)
       device_id = str(device_id)
       device_filter = f'r.deviceId == "{device_id}" and r._field != "token"'
       flux_query = f'from(bucket: "{config.get("APP", "INFLUX_BUCKET_AUTH")}") ' \
                    f'|> range(start: 0) ' \
                    f'|> filter(fn: (r) => r._measurement == "deviceauth" and {device_filter}) ' \
                    f'|> last()'
       devices = {}
       response = query_api.query(flux_query)
      results = []
          for table in response:
              for record in table.records:
                  results.append((record.get_field(), record.get_value()))
       return results
   ```

{{% caption %}}[iot-api-python/api/devices.py get_device()](https://github.com/influxdata/iot-api-python/blob/f354941c80b6bac643ca29efe408fde1deebdc96/api/devices.py){{% /caption %}}

The `get_device(device_id)` function does the following:

1. Instantiates a `QueryApi` client and sends the Flux query to InfluxDB.
2. Iterates over the `FluxTable` in the response and returns a list of tuples.

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Create IoT virtual device

Create an IoT virtual device that generates simulated weather data.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}

Create a `./api/sensor.py` file that generates simulated weather telemetry data.
[See the example](https://github.com/influxdata/iot-api-python/blob/f354941c80b6bac643ca29efe408fde1deebdc96/api/sensor.py).

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Next, generate data for virtual devices and [write the data to InfluxDB](#write-telemetry-data).

## Write telemetry data

To write telemetry data to the InfluxDB bucket,
use the InfluxDB client library to send a `POST` request to the `/api/v2/write` InfluxDB API endpoint.

The example below uses the following steps to generate data and write to InfluxDB:

1. Create a function that takes `device_id` and writes simulated weather telemetry
   data to the telemetry bucket.
2. Initialize the `WriteAPI` instance.
3. Initialize `Sensor`.
4. Use `Sensor` to create a `Point` with the `environment` measurement and temperature, humidity, pressure, lat, and lon data.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}

In `./api/devices.py`, add the following `write_measurements(device_id)` function:

```python
def write_measurements(device_id):
    influxdb_client = InfluxDBClient(url=config.get('APP', 'INFLUX_URL'),
                                     token=config.get('APP', 'INFLUX_TOKEN'),
                                     org=config.get('APP', 'INFLUX_ORG'))
    write_api = influxdb_client.write_api(write_options=SYNCHRONOUS)
    virtual_device = Sensor()
    coord = virtual_device.geo()
    point = Point("environment") \
        .tag("device", device_id) \
        .tag("TemperatureSensor", "virtual_bme280") \
        .tag("HumiditySensor", "virtual_bme280") \
        .tag("PressureSensor", "virtual_bme280") \
        .field("Temperature", virtual_device.generate_measurement()) \
        .field("Humidity", virtual_device.generate_measurement()) \
        .field("Pressure", virtual_device.generate_measurement()) \
        .field("Lat", coord['latitude']) \
        .field("Lon", coord['latitude']) \
        .time(datetime.utcnow())
    print(f"Writing: {point.to_line_protocol()}")
    client_response = write_api.write(bucket=config.get('APP', 'INFLUX_BUCKET'), record=point)
    # write() returns None on success
    if client_response is None:
        # TODO Maybe also return the data that was written
        return device_id
    # Return None on failure
    return None
```

{{% caption %}}[iot-api-python/api/devices.py write_measurement()](https://github.com/influxdata/iot-api-python/blob/f354941c80b6bac643ca29efe408fde1deebdc96/api/devices.py){{% /caption %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Query telemetry data

To retrieve telemetry data from the InfluxDB bucket,
use the InfluxDB client library to send a `POST` request to the `/api/v2/query` InfluxDB API endpoint.
The example below uses the following steps to retrieve and process telemetry data:

 1. Query `environment` measurements in `INFLUX_BUCKET`.
 2. Filter results by `device_id`.
 3. Parse the returned `FluxTable` and return key-value pairs for each record.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}

In `./api/devices.py`, add the following `get_measurements(device_id)` function:

```python
def get_measurements(device_id):
    influxdb_client = InfluxDBClient(url=config.get('APP', 'INFLUX_URL'),
                                     token=config.get('APP', 'INFLUX_TOKEN'),
                                     org=config.get('APP', 'INFLUX_ORG'))
    # Queries must be formatted with single and double quotes correctly
    query_api = QueryApi(influxdb_client)
    device_id = str(device_id)
    device_filter = f'r.device == "{device_id}"'
    flux_query = f'from(bucket: "{config.get("APP", "INFLUX_BUCKET")}") ' \
                 f'|> range(start: 0) ' \
                 f'|> filter(fn: (r) => r._measurement == "environment" and {device_filter}) ' \
                 f'|> last()'
    response = query_api.query(flux_query)
    # iterate through the result(s)
    results = []
    for table in response:
        results.append(table.records[0].values)
    return results
```

{{% caption %}}[iot-api-python/api/devices.py get_measurements()](https://github.com/influxdata/iot-api-python/blob/f354941c80b6bac643ca29efe408fde1deebdc96/api/devices.py){{% /caption %}}

The output is the following:

```python
[
   {
      'result': '_result',
       'table': 0,
       '_start': datetime.datetime(1970, 1, 1, 0, 0, tzinfo=tzutc()),
       '_stop': datetime.datetime(2022, 5, 8, 22, 25, 10, 111697, tzinfo=tzutc()),
       '_time': datetime.datetime(2022, 5, 5, 17, 25, 48, 57014, tzinfo=tzutc()),
       '_value': 33.780799865722656,
       'HumiditySensor': 'virtual_bme280',
       'PressureSensor': 'virtual_bme280',
       'TemperatureSensor': 'virtual_bme280',
       '_field': 'Lat',
       '_measurement': 'environment',
       'device': 'test_device_508472435243'
    }
]
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Define API responses

In `app.py`, add API endpoints that match incoming requests and respond with the results of your modules.
In the following `/data` route example, `app.py` retrieves _`device_id_input`_ from
the `POST` request and then passes it to `get_measurements(device_id)`.
Once the query completes, the server renders `data.html` with the results.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Python](#python)
{{% /code-tabs %}}
{{% code-tab-content %}}

```python
@app.route('/data', methods=['GET', 'POST'])
def data():
    if request.method == 'GET':
        return render_template('data.html', data=None)
    else:
        device_id = request.form.get('device_id_input', None)
        results = devices.get_measurements(device_id)
        return render_template('data.html', data=results)
```

{{% caption %}}[iot-api-python/app.py](https://github.com/influxdata/iot-api-python/blob/f354941c80b6bac643ca29efe408fde1deebdc96/app.py){{% /caption %}}

To start the app, enter the following command into the terminal:

```bash
flask run
```

To view the application, visit <http://localhost:5000> in your browser.

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Install and run the UI

`influxdata/iot-api-ui` is a standalone [Next.js React](https://nextjs.org/docs/basic-features/pages) UI that uses your application API to write and query data in InfluxDB.
`iot-api-ui` uses Next.js _[rewrites](https://nextjs.org/docs/api-reference/next.config.js/rewrites)_ to route all requests in the `/api/` path to your API.

To install and run the UI, do the following:

1. In your `~/iot-api-apps` directory, clone the [`influxdata/iot-api-ui` repo](https://github.com/influxdata/iot-api-ui) and go into the `iot-api-ui` directory--for example:

   ```sh
   cd ~/iot-api-apps
   git clone git@github.com:influxdata/iot-api-ui.git
   cd ./iot-app-ui
   ```

2. The `./.env.development` file contains default configuration settings that you can
   edit or override (with a `./.env.local` file).
3. To start the UI, enter the following command into your terminal:

   ```sh
   yarn dev
   ```

   To view the list and register devices, visit <http://localhost:3000/devices> in your browser.

To learn more about the UI components, see [`influxdata/iot-api-ui`](https://github.com/influxdata/iot-api-ui).