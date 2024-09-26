---
title: InfluxDB client libraries
description: >
  InfluxDB client libraries includes support for Arduino, C#, C++, Go, Java, JavaScript, PHP, Python, and Ruby.
aliases:
    - /influxdb/v1/clients/api_client_libraries/
    - /influxdb/v1/clients/
    - /influxdb/v1/clients/api
menu:
  influxdb_v1:
    weight: 30
    parent: Tools
v2: /influxdb/v2/api-guide/client-libraries/
---

InfluxDB v2 client libraries are language-specific packages that integrate
with the InfluxDB v2 API and support both **InfluxDB 1.8+** and **InfluxDB 2.x**.

{{% note %}}
If you're getting started with InfluxDB v1, we recommend using the
InfluxDB v1 client libraries and InfluxQL for
[InfluxDB v3 compatibility](/influxdb/v1/tools/api/#influxdb-v3-compatibility).

For more information about API and client library compatibility, see the
[InfluxDB v1 API reference](/influxdb/v1/tools/api/).
{{% /note %}}

## Client libraries

Functionality varies between client libraries. Refer to client libraries on GitHub for specifics regarding each client library.

### Arduino

- [InfluxDB Arduino Client](https://github.com/tobiasschuerg/InfluxDB-Client-for-Arduino)


### C\#

- [influxdb-client-csharp](https://github.com/influxdata/influxdb-client-csharp)

## C++
* [influxdb-cxx](https://github.com/offa/influxdb-cxx)


### Go

- [influxdb-client-go](https://github.com/influxdata/influxdb-client-go)

### Java

- [influxdb-client-java](https://github.com/influxdata/influxdb-client-java)

### JavaScript

* [influxdb-javascript](https://github.com/influxdata/influxdb-client-js)


### PHP

- [influxdb-client-php](https://github.com/influxdata/influxdb-client-php)


### Python

* [influxdb-client-python](https://github.com/influxdata/influxdb-client-python)


### Ruby

- [influxdb-client-ruby](https://github.com/influxdata/influxdb-client-ruby)


## Install and use a client library

To install and use the Python client library, follow the [instructions below](#install-and-use-the-python-client-library). To install and use other client libraries, refer to the client library documentation for detail.

### Install and use the Python client library

1. Install the Python client library.

    ```sh
    pip install influxdb-client
    ```

2. Ensure that InfluxDB is running. If running InfluxDB locally, visit http://localhost:8086. (If using InfluxDB Cloud, visit the URL of your InfluxDB Cloud UI.)

3. In your program, import the client library and use it to write data to InfluxDB. For example:

    ```sh
    import influxdb_client
    from influxdb_client.client.write_api import SYNCHRONOUS
    ```

4. Define your database and token variables, and create a client and writer object. The InfluxDBClient object takes 2 parameters: `url` and `token`

    ```sh
    database = "<my-db>"
    token = "<my-token>"
    client = influxdb_client.InfluxDBClient(
    url="http://localhost:8086",
    token=token,
    ```

    {{% note %}}
The database (and retention policy, if applicable) are converted to a
[bucket](/influxdb/v2/reference/glossary/#bucket) data store compatible with InfluxDB v2.
    {{% /note %}}

5. Instantiate a writer object using the client object and the write_api method. Use the `write_api` method to configure the writer object.

    ```sh
    client = influxdb_client.InfluxDBClient(url=url, token=token)
    write_api = client.write_api(write_options=SYNCHRONOUS)
    ```

6. Create a point object and write it to InfluxDB using the write method of the API writer object. The write method requires three parameters: database, (optional) retention policy, and record.

    ```sh
    p = influxdb_client.Point("my_measurement").tag("location", "Prague").field("temperature", 25.3)
    write_api.write(database:rp, record=p)
    ```
