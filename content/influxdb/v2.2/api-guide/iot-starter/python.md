---
title: IoT Starter Guide
seotitle: Use API client libraries to build an IoT Center
description: Write, query, and manage authorizations with InfluxDB client libraries.
weight: 3
menu:
  influxdb_2_2:
    name: IoT Center - Python
    parent: IoT Center
influxdb/cloud/tags: [api]
aliases:
  - /influxdb/v2.2/reference/api/client-libraries/python/
  - /influxdb/cloud/tools/api/iot-starter/python/
---

## Build a starter Python IoT app with the InfluxDB API and client libraries

This guide is for Python developers who want to build applications using the InfluxDB API and client libraries.
InfluxDB API client libraries are maintained by InfluxData and the user community. As a developer, client libraries let you take advantage of:
- Idioms for InfluxDB requests, responses, and errors
- Common patterns in a familiar programming language

In this guide, you'll use the InfluxDB API and Python client libraries to build a real application, and learn the basics by 
deconstructing the flow of events and data between the app, devices, and InfluxDB.

You'll see code samples that use InfluxDB API Python client libraries to
manage IoT devices, write data to InfluxDB, query data from InfluxDB, create visualizations, and monitor the health of devices and the application itself.


## Contents
### InfluxDB API Overview
1. [InfluxDB API basics](#influxdb-api-basics)
2. [InfluxDB URL](#influxdb-url)
3. [Data formats](#data-formats)
4. [Responses](#responses)
5. [Resources in InfluxDB](#resources-in-influxdb)

### Tutorial Guide
From start to finish, you will:
1. [Set up InfluxDB](#set-up-influxdb)
2. [Create a web server](#introducing-iot-center)
   1. [Create a UI dashboard using Jinja](#create-iot-center)
   2. [Install influxdb-client package](#install-influxdb-client-package)
   3. [Create a configuration file for authentication with InfluxDB](#create-config.ini)
3. [Create a virtual IoT device](#create-iot-virtual-device)
4. [Develop with the API](#develop-with-the-api)
   1. [Store virtual IoT device to InfluxDB using the API](#store-virtual-iot-device-to-influxdb)
   2. [Query bucket for IoT device using the API](#query-bucket-for-device)
   3. [Write telemetry data to InfluxDB using the API](#write-telemetry-data)
   4. [Query telemetry data in InfluxDB using the API](#query-telemetry-data)
5. [Connect the UI to the API](#connect-the-ui-to-the-api) 


## InfluxDB API basics

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
will have one of the following formats, depending on the endpoint and response status:

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
   "description": "IoT Center: device3",
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

## Set up InfluxDB

If you don't already have an InfluxDB instance, [create an InfluxDB Cloud account](https://www.influxdata.com/products/influxdb-cloud/) or [install InfluxDB OSS](https://www.influxdata.com/products/influxdb/).


### Authenticate with an InfluxDB API token

For convenience in development, use an _All-Access_ token for your application to read and write with the InfluxDB API.
To create an All-Access token, use one of the following:
- [InfluxDB UI](influxdb/v2.1/security/tokens/create-token/#create-an-all-access-token)
- [InfluxDB CLI](/influxdb/v2.1/security/tokens/create-token/#create-an-all-access-token-1)

{{% note %}}

For a production application, we recommend you create a token with minimal permissions and only use it with that application.

{{% /note %}}

## Introducing IoT Center

The IoT Center architecture has four layers:

- **InfluxDB API**: InfluxDB v2 API.
- **IoT device**: Virtual or physical devices write IoT data to the InfluxDB API.
- **IoT Center UI**: User interface sends requests to IoT Center server and renders views for the browser.
- **IoT Center server**: Server and API receives requests from the UI, sends requests to InfluxDB,
  and processes responses from InfluxDB.

### Create IoT Center 

You will be using Flask alongside Jinja to create your IoT Center application. 
Flask is a micro web framework written in Python that lets you develop web applications.
Flask provides features such as:
* lightweight with minimal dependencies
* built-in web server
* RESTful request dispatching

Flask uses the Jinja web template engine used to help render an HTML. 

To start, create and activate a Python virtual environment for the new project.


```bash
$ mkdir iotproject
$ cd iotproject

# Create a new virtual environment named "virtualenv"
# Python 3.8+
$ python -m venv virtualenv

# Activate the virtualenv (OS X & Linux)
$ source virtualenv/bin/activate
```

After activation completes, use the `pip` package installer (included with Python) to
install Flask and Jinja
```bash
$ pip install Flask
$ pip install Jinja
```

### Install influxdb-client Package
Use pip to install the influxdb-client package in your virtual environment.
Additional information regarding the package can be found [here](https://pypi.org/project/influxdb-client/)
```bash
$ pip install influxdb-client
```

### Create a Flask Application

In your project, create a `app.py` file that contains the following:
```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
  return "Hello World!"
```
{{% caption %}}[@influxdata/iot-python-app app.py](https://github.com/influxdata/iot-python-api/blob/main/app.py){{% /caption %}}

To run your new Flask application, enter the following command in your terminal:  

`flask run`

In your browser, visit <http://localhost:5000> to view the “Hello World!” response.

### Create the UI

In the `./templates` directory of your project, create an `index.html` page to serve as your application's landing page. 
In `index.html` paste the following Jinja template:

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
{{% caption %}}[@influxdata/iot-python-app ./templates/index.html](https://github.com/influxdata/iot-python-api/blob/main/templates/index.html){{% /caption %}}

In the `./templates` directory of your project, create a `base.html` file. 
In `base.html` paste the following:

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
{{% caption %}}[@influxdata/iot-python-app ./templates/base.html](https://github.com/influxdata/iot-python-api/blob/main/templates/base.html){{% /caption %}}

`base.html` provides the layout, navbar, CSS, and JavaScript for your UI.
To inherit the base layout, all other pages in your application will extend `base.html` and provide
content to be rendered in the content block:

```html
  <div class="container">
        {% block content %} {% endblock %}
  </div>
```


## Configure IoT App

### Create config.ini

The Python client library allows you to integrate InfluxDB into your application
and interact with your InfluxDB instance. The client needs the following 
information to connect to your InfluxDB instance:


* your InfluxDB [API token](#authorization) with permission to query (_read_) buckets
and create (_write_) authorizations for IoT devices.
* your InfluxDB instance url
* your InfluxDB org ID
* your InfluxDB bucket names

To set up the client configuration, create a `config.ini` in your project's top 
level directory.
In `config.ini`, paste the following:

```ini
[APP]
INFLUX_URL = {{INFLUX_URL}}
INFLUX_TOKEN = {{INFLUX_TOKEN}}
INFLUX_ORG = {{INFLUX_ORG_ID}}
INFLUX_BUCKET = {{INFLUX_BUCKET_FOR_TELEMETRY}}
INFLUX_BUCKET_AUTH = {{INFLUX_BUCKET_FOR_DEVICES}}
```
{{% caption %}}[@influxdata/iot-python-app config.ini](https://github.com/influxdata/iot-python-api/blob/main/config.ini){{% /caption %}}

The following is a sample configuration.
```ini
[APP]
INFLUX_URL = https://us-west-2-2.aws.cloud2.influxdata.com/
INFLUX_TOKEN = 52Pc_ZkJsRh1PKzlwrK8yO6jWSDh6WPAHbfqp-5aROz4zBnY2mvkKws9YoYzksGH3_Xp90rVqo2PRiajTxaUcw==
INFLUX_ORG = bea7ea952287f70d
INFLUX_BUCKET = sly's Bucket
INFLUX_BUCKET_AUTH = devices_auth
```


## Create IoT Virtual Device
The IoT virtual device generates simulated weather data for you to store in
InfluxDB. 

In the `./api` directory of your project, create a `sensor.py` file.

[//]: # Probably preferable to link the file rather than have the whole file written up()
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
{{% caption %}}[@influxdata/iot-python-app ./api/sensor.py](https://github.com/influxdata/iot-python-api/blob/main/api/sensor.py){{% /caption %}}

The Sensor object's function `generate_measurement()` will be used to simulate 
weather data.


## Develop with the API

## Store Virtual IoT Device to InfluxDB

In this section, you will learn how to use the python client library to store
virtual device information in InfluxDB.
Virtual device information will be stored in your first bucket. 
Telemetry data from the device will be stored in the second bucket. 
(You will learn more about this later on in the guide).

In your `./api` directory, create a `devices.py` file. This file holds the 
core functionality for your app.

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

config = configparser.ConfigParser()
config.read('config.ini')

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
{{% caption %}}[@influxdata/iot-python-app ./api/devices.py create_device() line 59](https://github.com/influxdata/iot-python-api/blob/main/api/devices.py#L59){{% /caption %}}


This file imports all the necessary classes from `influxdb_client`.
The configuration key value pairs are ingested at the top of the file.  
```python
config = configparser.ConfigParser()
config.read('config.ini')
```

`create_device` stores virtual device data by reading in a device_id and 
writing that information to a bucket.
Use the config to initialize `influxdb_client`. `InfluxDBClient` requires
your url, token, and org to create a connection to your InfluxDB instance.
```python
influxdb_client = InfluxDBClient(url=config.get('APP', 'INFLUX_URL'),
                                  token=config.get('APP', 'INFLUX_TOKEN'),
                                  org=config.get('APP', 'INFLUX_ORG'))
```

Create a `WriteAPI` using `InfluxDBClient`. The `WriteApi` instance writes
records to a specified bucket. To generate a record, create a `Point` object.
In the `Point` sample below, `deviceauth` is the name of the `_measurement`.
`deviceId` is used as the tag, and two separate fields named `key` and `token` 
are used to storethe device authorization information 
(more information on authorization will be provided further along in the guide).
After the `Point` has been set up, use `write_api` to send the API request to
`/api/v2/write` and write the record to your bucket. `write_api` returns `None` 
on success. Check for any failures then return the `device_id` if the request
was successful.
```python
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

## Query Bucket For Device
After storing device information to a bucket, use the client library to query 
for the device information.  

Create a new function called `get_devices()` within `devices.py`. This function 
will take in a `device_id` and return a list of tuples that represent the 
records generated by the query.
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
{{% caption %}}[@influxdata/iot-python-app ./api/devices.py get_device() line 31](https://github.com/influxdata/iot-python-api/blob/main/api/devices.py#L31){{% /caption %}}

Create a `QueryApi` instance. The `QueryApi` instance queries records from a
specified bucket using Flux. To generate the Flux query, set the bucket 
information, range, and query filter. This query will filter on `_measurement` 
value, `deviceauth`, and searches for any device_id that matches the passed in 
device_id. Add clause to search for `_field`s that do not contain `token` as a 
value.

```python
device_filter = f'r.deviceId == "{device_id}" and r._field != "token"'
flux_query = f'from(bucket: "{config.get("APP", "INFLUX_BUCKET_AUTH")}") ' \
           f'|> range(start: 0) ' \
           f'|> filter(fn: (r) => r._measurement == "deviceauth" and {device_filter}) ' \
           f'|> last()'
```

The client returns a `FluxTable`. Parse the object into a list of tuples.
```python
# Samples results
[('key', 'fake_auth_id_1'), ('key', 'fake_auth_id_2')]
```

## Write Telemetry Data
After device information has been stored, generate telemetry data and write the
records into InfluxDB.

In `devices.py` create a new function `write_measurements()`. 
This function will take in a `device_id` and write simulated weather telemetry 
data to the second bucket. Initialize the `WriteAPI` instance. Then,
initialize the `Sensor` object. Create a `Point` that contains data for 
temperature, humidity, pressure, lat, and lon using the `Sensor`. 
Set the `_measurement` value to `environment`. `environment` will be used as the
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
{{% caption %}}[@influxdata/iot-python-app ./api/devices.py write_measurement() line 84](https://github.com/influxdata/iot-python-api/blob/main/api/devices.py#L84){{% /caption %}}

## Query Telemetry Data
After telemetry data is written into your bucket, query InfluxDB to retrieve the 
telemetry data.  

Within `devices.py` create a new function called `get_measurements()`. 
This function will take in a `device_id` and query for simulated weather 
telemetry data produced by the virtual device. Query on the `_measurement`,
`environment` and search for all records where `device` matches the `device_id`. 
Parse the returned `FluxTable` and return each record as a dict containing the 
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
{{% caption %}}[@influxdata/iot-python-app ./api/devices.py get_measurements() line 116](https://github.com/influxdata/iot-python-api/blob/main/api/devices.py#L116){{% /caption %}}

The code below shows how `FluxTable` is parsed and returned as a list of dicts
for each record returned.
```python
# iterate through the result(s)
    results = []
    for table in response:
        results.append(table.records[0].values)

    return results
```
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
Now that the core functionality has been implemented, we can now create a UI to perform these requests.
Your IoT Dashboard will have four main pages.
* Query Devices
* Create Devices
* Write Data
* Query Data

In the `./templates` directory, create the following files 
* `create.html`(link outs to the files. UI code explanation out of scope) (Page to create virutal IoT device)
* `data.html` (Page to query for telemetry data)
* `devices.html` (Page to query for device data)
* `write.html` (Page to write telemetry data)

After those files are created, update `base.html` and `app.py` to connect the routes.
Without going into details regarding the UI, `app.py` serves the routes and runs
the core logic. 

For example, in the `data` route, `device_id_input` is retrieved from 
`data.html` when user input is submitted. `get_measurements()` is then called 
with the provided input. After the query is ran, `data.html` re-renders with the
query results. 

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