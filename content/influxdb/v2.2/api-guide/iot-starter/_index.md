---
title: InfluxDB API starter guide
seotitle: Build a starter app with InfluxDB API client libraries
description: >
  Follow step-by-step tutorials to build the IoT Center sample application
  with InfluxDB API client libraries in your favorite language or framework.
weight: 4
menu:
  influxdb_2_2:
    name: API starter guides
    parent: Develop with the API
influxdb/v2.2/tags: [api]
---

Follow step-by-step tutorials to build the IoT Center sample application
with InfluxDB API client libraries in your favorite language or framework.

## Node.js

[Build a Node.js and React app](/{{% latest "influxdb" %}}/api-guide/iot-starter/nodejs/)
with the InfluxDB client library for Javascript.

{{< children >}}

## Before You Start

- [InfluxDB API Overview](#influxdb-api-overview)
- [IoT Center Overview](#iot-center-overview)

These guides walk through building a sample IoT center application using 
InfluxDB client libraries and the InfluxDB API.
InfluxDB API client libraries are maintained by InfluxData and the user 
community. As a developer, client libraries let you take advantage of:
- Idioms for InfluxDB requests, responses, and errors
- Common patterns in a familiar programming language

These guides and the sample IoT application demonstrate how to use InfluxDB API 
client libraries to manage IoT devices, write data to InfluxDB, query data from 
InfluxDB, create visualizations, and monitor the health of devices and the 
application itself.


### InfluxDB API Overview

- [InfluxDB URL](#influxdb-url)
- [Data formats](#data-formats)
- [Responses](#responses)
- [Resources in InfluxDB](#resources-in-influxdb)

#### InfluxDB URL
Throughout these guides, your application sends API requests to [your InfluxDB URL](/influxdb/v2.2/reference/urls/).
```sh
http://localhost:8086
```

Most InfluxDB API operations use the `/api/v2` URL path. For example:
```sh
http://localhost:8086/api/v2/query
http://localhost:8086/api/v2/write
```

#### Data formats

##### Line protocol
InfluxDB client libraries use the [line protocol](/influxdb/v2.2/reference/syntax/line-protocol/) format to write data to InfluxDB.

##### Annotated CSV
The InfluxDB API returns query results in [Annotated CSV](/influxdb/v2.2/reference/syntax/annotated-csv/) format.

##### JSON
The InfluxDB API returns resources and errors in JSON format.

#### Responses
The InfluxDB API is a REST API that accepts standard HTTP request verbs
and returns standard HTTP response codes. If InfluxDB sends a response body, the body
uses one of the following formats, depending on the endpoint and response status:
- **JSON**: responses with resources or error messages
- **CSV**: responses with query results
- **Plain text**: some error responses, responses with system information

#### Resources in InfluxDB
**Resources** are InfluxDB objects that store data (.e.g. buckets) or configuration (.e.g. tasks) in InfluxDB.
The IoT center application uses the InfluxDB API to create, retrieve, update, and delete resources.
Many examples in these guides use the following InfluxDB resources:
- [Organization](/influxdb/v2.2/reference/glossary/#organization)
- [User](/influxdb/v2.2/reference/glossary/#user)
- [Authorization](/influxdb/v2.2/reference/glossary/#authorization)
- [Bucket](/influxdb/v2.2/reference/glossary/#bucket)

{{% note %}}
To learn more about InfluxDB data elements, schemas, and design principles, see the
[Key concepts reference topics](influxdb/v2.1/reference/key-concepts/).
{{% /note %}}


### IoT Center Overview

The IoT Center architecture has four layers:

- **InfluxDB API**: InfluxDB v2 API.
- **IoT device**: Virtual or physical devices write IoT data to the InfluxDB API.
- **IoT Center UI**: User interface sends requests to IoT Center server and renders views for the browser.
- **IoT Center server**: Server and API receives requests from the UI, sends requests to InfluxDB,
  and processes responses from InfluxDB.