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

## Contents

- [Set up InfluxDB](#set-up-influxdb)
  - [Authenticate with an InfluxDB API token](#authenticate-with-an-influxdb-api-token)
- [Introducing IoT Starter](#introducing-iot-starter)
  - [Create the application](#create-the-application)
  - [Install influxdb-client package](#install-influxdb-client-package)
  - [Create a Flask application](#create-a-flask-application)
  - [Create the UI](#create-the-ui)
- [Configure the application](#configure-the-application)
  - [Create config.ini](#create-configini)
- [Create IoT virtual device](#create-iot-virtual-device)
- [Store devices in InfluxDB](#store-devices-in-influxdb)
- [Query for devices](#query-for-devices)
- [Write telemetry data](#write-telemetry-data)
- [Query telemetry data](#query-telemetry-data)
- [Connect the UI to the API](#connect-the-ui-to-the-api)

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

### Create the application

Use [Flask](https://flask.palletsprojects.com/), a light-weight Python web
framework, and [Jinja](https://jinja.palletsprojects.com/), a templating engine,
to create your application.

1. Create and navigate into a new project directory.

    ```bash
    mkdir iotproject && cd $_
    ```

2. Create and activate a Python virtual environment for the new project.

    ```bash
    # Create a new virtual environment named "virtualenv"
    # Python 3.8+
    python -m venv virtualenv

    # Activate the virtualenv (OS X & Linux)
    source virtualenv/bin/activate
    ```

3. After activation completes, use the `pip` package installer (included with Python) to
install Flask and Jinja.

    ```bash
    pip install Flask
    pip install Jinja
    ```

### Install influxdb-client package

Use pip to install the influxdb-client package in your virtual environment.

For more information about the package, see [the Python InfluxDB client package](https://pypi.org/project/influxdb-client/).

```bash
pip install influxdb-client
```

### Create a Flask application

In your project, create a `app.py` file that:

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

{{% caption %}}[@influxdata/iot-python-app app.py](https://github.com/influxdata/iot-python-api/blob/main/app.py){{% /caption %}}

To start your application with the debugger and hot-reloader enabled,
enter the following command in your terminal:

```bash
export FLASK_ENV=development
flask run
```

In your browser, visit <http://localhost:5000> to view the “Hello World!” response.

### Create the UI

1. Create a `./templates/index.html` file that serves as your application landing page and contains the following Jinja HTML:

   ```html
       <!DOCTYPE html>
       <html lang="en">
           <head>
               <meta charset="UTF-8">
               <title>IOT Center</title>
           </head>
           {% extends 'base.html' %}
           <body>
           {% block content %}
               <h1>Welcome to IOT Center</h1>
               <p>The current time is {{time}}</p>
           {% endblock %}

           </body>
       </html>
   ```

   {{% caption %}}[/iot-api-python/templates/index.html](https://github.com/influxdata/iot-python-api/blob/main/templates/index.html){{% /caption %}}

2. Create a `./templates/base.html` file that provides the layout, navigation, CSS, and JavaScript for your UI.
   In `./templates/base.html`, paste the following Jinja HTML:

   {{% truncate %}}

   ```html
       <!doctype html>
       <html lang="en">
         <head>
           <!-- Required meta tags -->
           <meta charset="utf-8">
           <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
           <!-- Bootstrap CSS -->
           <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
           <link rel="stylesheet" href="{{ url_for('static', filename= 'css/style.css') }}">
           <title>{% block title %} {% endblock %}</title>
         </head>
         <body>
           <nav class="navbar navbar-expand-md navbar-light bg-light">
               <a class="navbar-brand" href="{{ url_for('index')}}">IoT Center</a>
               <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                   <span class="navbar-toggler-icon"></span>
               </button>
               <div class="collapse navbar-collapse" id="navbarNav">
                   <ul class="navbar-nav">
                       <li class="nav-item">
                           <a class="nav-link" href="#">About</a>
                       </li>
                       <li>
                           <a class="nav-link" href="{{url_for('get_buckets')}}">Buckets</a>
                       </li>
               </div>
           </nav>
           <div class="container">
               {% block content %} {% endblock %}
           </div>
           <!-- Optional JavaScript -->
           <!-- jQuery first, then Popper.js, then Bootstrap JS -->
           <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
         </body>
       </html>
       ```
       {{% caption %}}[/iot-api-python/templates/base.html](https://github.com/influxdata/iot-python-api/blob/main/templates/base.html){{% /caption %}}

       To inherit the base layout, all other pages in your application will extend `base.html` and provide
       content to be rendered in the content block:
       ```html
         <div class="container">
               {% block content %} {% endblock %}
         </div>
   ```

   {{% caption %}}[/iot-api-python/templates/base.html](https://github.com/influxdata/iot-python-api/blob/main/templates/base.html){{% /caption %}}

   {{% /truncate %}}

To inherit the base layout, all other pages in your application will extend `./templates/base.html` and provide
content to be rendered in the content block:

```html
  <div class="container">
        {% block content %} {% endblock %}
  </div>
```

## Configure the application

### Create config.ini

The Python client library lets you integrate InfluxDB into your application
and interact with your InfluxDB instance. The client needs the following
information to connect to your InfluxDB instance:

To set up the client configuration, create a `config.ini` in your project's top
level directory and paste the following to provide the necessary InfluxDB credentials:

```ini
[APP]
INFLUX_URL = <INFLUX_URL>
INFLUX_TOKEN = <INFLUX_TOKEN>
INFLUX_ORG = <INFLUX_ORG_ID>
INFLUX_BUCKET = <INFLUX_BUCKET>
INFLUX_BUCKET_AUTH = <INFLUX_DEVICE_BUCKET>
```

{{% caption %}}[@influxdata/iot-python-app config.ini](https://github.com/influxdata/iot-python-api/blob/main/config.ini){{% /caption %}}

Replace the following:

- **`<INFLUX_TOKEN>`**: your InfluxDB [API token](#authorization) with permission to query (_read_) buckets
and create (_write_) authorizations for devices.
- **`<INFLUX_URL>`**: your InfluxDB instance URL.
- **`<INFLUX_ORG_ID>`**: your InfluxDB org ID.
- **`<INFLUX_BUCKET>`**: name of your InfluxDB bucket that will store device measurement data.
- **`<INFLUX_DEVICE_BUCKET>`**: name of your InfluxDB bucket that will store device authorizations.

The following is a sample configuration:

```ini
[APP]
INFLUX_URL = https://us-west-2-2.aws.cloud2.influxdata.com/
INFLUX_TOKEN = 52Pc_ZkJsRh1PKzlwrK8yO6jWSDh6WPAHbfqp-5aROz4zBnY2mvkKws9YoYzksGH3_Xp90rVqo2PRiajTxaUcw==
INFLUX_ORG = bea7ea952287f70d
INFLUX_BUCKET = iot_center
INFLUX_BUCKET_AUTH = iot_center_devices
```

## Create IoT virtual device

The IoT virtual device generates simulated weather data to store in InfluxDB.

Create a `./api/sensor.py` file that contains the following:

{{% truncate %}}

```python
import json
import random
import urllib3

http = urllib3.PoolManager()

# Helper function to fetch lat lon data
def fetch_json(url):
    """Fetch JSON from url."""
    response = http.request('GET', url)
    if not 200 <= response.status <= 299:
        raise Exception(f'[HTTP - {response.status}]: {response.reason}')
    config_fresh = json.loads(response.data.decode('utf-8'))
    return config_fresh


class Sensor:
    def __init__(self):
        self.id = ''
        self.temperature = None
        self.pressure = None
        self.humidity = None
        self.geo = None

    def generate_measurement(self):
        return round(random.uniform(0, 100))

    def geo(self):
        """
        Get GEO location from https://freegeoip.app/json/'.
        :return: Returns a dictionary with `latitude` and `longitude` key.
        """
        try:
            return fetch_json('https://freegeoip.app/json/')
        except Exception:
            return {
                'latitude':  self.generate_measurement(),
                'longitude':  self.generate_measurement(),
            }
```

{{% caption %}}[/iot-api-python/api/sensor.py](https://github.com/influxdata/iot-python-api/blob/main/api/sensor.py){{% /caption %}}
{{% /truncate %}}

The Sensor object's function `generate_measurement()` will be used to simulate
weather data.

## Store devices in InfluxDB

In this section, you will learn how to use the python client library to store
virtual device information in InfluxDB.

Create a `./api/devices.py` file to contain the core functionality for your app.
In `./api/devices.py`, import the necessary classes from `influxdb_client`.

```python
import configparser
from datetime import datetime
from uuid import uuid4
from influxdb_client import Authorization, InfluxDBClient, Permission, PermissionResource, Point, WriteOptions
from influxdb_client.client.authorizations_api import AuthorizationsApi
from influxdb_client.client.bucket_api import BucketsApi
from influxdb_client.client.query_api import QueryApi
from influxdb_client.client.write_api import SYNCHRONOUS

from api.sensor import Sensor
```

Get the configuration key-value pairs.

```python
config = configparser.ConfigParser()
config.read('config.ini')
```

Create and store the device:

1. In `./api/devices.py`, create a function `create_device(device_id)`
   that takes a `device_id` and stores virtual device data to `INFLUX_BUCKET`.
2. Initialize `InfluxDBClient()` with `url`, `token`, and `org` values from your configuration.
3. Initialize a `WriteAPI` instance for writing data to an InfluxDB bucket.
4. Create a `Point` with a `deviceauth` measurement, a `deviceId` tag, a `key` field, and a `token` field.
5. Use `write_api.write()` to send the request to the `/api/v2/write` InfluxDB API endpoint to write the `Point` to a bucket.
6. Check for failures--if the write was successful, `write_api` returns `None`.
7. Return `device_id` if successful; `None` otherwise.

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

{{% caption %}}[/iot-api-python/api/devices.py create_device() line 59](https://github.com/influxdata/iot-python-api/blob/main/api/devices.py#L59){{% /caption %}}

## Query for devices

After storing device information in an InfluxDB bucket, use the client library to query for devices.
In `./api/devices.py`, create a `get_devices(device_id)` function that takes a `device_id` and returns the query result as a list of tuples.

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

{{% caption %}}[/iot-api-python/api/devices.py get_device() line 31](https://github.com/influxdata/iot-python-api/blob/main/api/devices.py#L31){{% /caption %}}

Create a `QueryApi` instance and a Flux query that retrieves devices from `INFLUX_BUCKET_AUTH`.
Create a query template that does the following:

1. Retrieve the `INFLUX_BUCKET_AUTH` bucket ID from `config`.
2. Query the `deviceauth` measurement.
3. Filter points by a specified device ID.
4. Filter out points with the `token` field.

```python
device_filter = f'r.deviceId == "{device_id}" and r._field != "token"'
flux_query = f'from(bucket: "{config.get("APP", "INFLUX_BUCKET_AUTH")}") ' \
           f'|> range(start: 0) ' \
           f'|> filter(fn: (r) => r._measurement == "deviceauth" and {device_filter}) ' \
           f'|> last()'
```

`get_device(device_id)` parses `FluxTable` and returns a list of dicts
for each record, as in the following example:

```python
    response = query_api.query(flux_query)
    results = []
    for table in response:
        results.append(table.records[0].values)

    return results
```

## Write telemetry data

After device information has been stored, generate telemetry data and write the
records into InfluxDB.

1. In `devices.py`, create a `write_measurements()` function
   that takes a `device_id` and writes simulated weather telemetry
   data to the telemetry bucket.
2. Initialize the `WriteAPI` instance.
3. Initialize the `Sensor` object.
4. Create a `Point` with data for temperature, humidity, pressure,
   lat, and lon using the `Sensor` object.
5. Set the `_measurement` value to `environment`. `environment` is used as the
   main filter for future queries in this guide.

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

{{% caption %}}[/iot-api-python/api/devices.py write_measurement() line 84](https://github.com/influxdata/iot-python-api/blob/main/api/devices.py#L84){{% /caption %}}

## Query telemetry data

After you write telemetry data to the bucket, query InfluxDB to retrieve the data.

In `./api/devices.py`, create a `get_measurements(device_id)` function to do the following:

 1. Query for weather telemetry data generated by the virtual device.
 2. Query the `environment` measurement.
 3. Filter by `device_id`.
 4. Parse the returned `FluxTable` and return each record as a [dictionary](https://docs.python.org/tutorial/datastructures.html#dictionaries) containing the
data from each record returned.

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

{{% caption %}}[/iot-api-python/api/devices.py get_measurements() line 116](https://github.com/influxdata/iot-python-api/blob/main/api/devices.py#L116){{% /caption %}}

`get_measurements(device_id)` parses `FluxTable` and returns a list of dicts
for each record--for example:

```python
# iterate through the result(s)
    results = []
    for table in response:
        results.append(table.records[0].values)

    return results
```

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

## Connect the UI to the API

Create a UI that uses your application API to write and query data in InfluxDB.
Your dashboard has the following four main views:

- Query Devices: queries and displays device information.
- Create Devices: creates virtual IoT devices.
- Write Data: writes telemetry data.
- Query Data: queries telemetry data.

In the `./templates` directory, create the following files:

- [`create.html`](https://github.com/influxdata/iot-python-api/blob/main/templates/create.html): provides the `Create Devices` view.
- [`data.html`](https://github.com/influxdata/iot-python-api/blob/main/templates/data.html): provides the `Query Data` view.
- [`devices.html`](https://github.com/influxdata/iot-python-api/blob/main/templates/devices.html): provides the `Query Devices` view.
- [`write.html`](https://github.com/influxdata/iot-python-api/blob/main/templates/write.html): provides the `Write Data` view.

 Update `base.html` and `app.py` to route server requests to your views.
`app.py` serves the routes and runs the core logic necessary to populate the UI.

For example, in the `data` route, `app.py` retrieves `device_id_input` from
`data.html` once a user submits input in a `POST` request.
`app.py` then passes the form data to `get_measurements(device_id)`.
Once the query completes, `data.html` displays the results.

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

{{% caption %}}[@influxdata/iot-python-app app.py line 83](https://github.com/influxdata/iot-python-api/blob/main/app.py#L83){{% /caption %}}

After these files are created and updated, run the app to view the completed
IoT Center at `http://localhost:5000`.

```bash
flask run
```
