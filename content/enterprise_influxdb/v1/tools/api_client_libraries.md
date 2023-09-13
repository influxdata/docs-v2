---
title: InfluxDB client libraries
description: >
  InfluxDB client libraries includes support for Arduino, C#, C++, Go, Java, JavaScript, PHP, Python, and Ruby.
aliases:
    - /enterprise_influxdb/v1/clients/api_client_libraries/
    - /enterprise_influxdb/v1/clients/
    - /enterprise_influxdb/v1/clients/api
menu:
  enterprise_influxdb_v1:
    weight: 30
    parent: Tools
v2: /influxdb/v2/api-guide/client-libraries/
---

InfluxDB client libraries are language-specific packages that integrate with InfluxDB APIs and support **InfluxDB 1.8+** and **InfluxDB 2.x**.

{{% warn %}}

Client libraries for [InfluxDB 1.7 and earlier](/influxdb/v1/tools/api_client_libraries/) may continue to work, but aren't maintained by InfluxData.

{{% /warn %}}

## Client libraries for InfluxDB 2.x and 1.8+

InfluxDB 2.x client libraries use InfluxDB `/api/v2` endpoints and work with [InfluxDB 2.0 API compatibility endpoints](/enterprise_influxdb/v1/tools/api/#influxdb-2-0-api-compatibility-endpoints).
Functionality varies among client libraries.
For specifics about a client library, see the library's GitHub repository.

### Arduino

- [InfluxDB Arduino Client](https://github.com/tobiasschuerg/InfluxDB-Client-for-Arduino)
  - Contributed by [Tobias Schürg (tobiasschuerg)](https://github.com/tobiasschuerg)

### C\#

- [influxdb-client-csharp](https://github.com/influxdata/influxdb-client-csharp)
  - Maintained by [InfluxData](https://github.com/influxdata)

## C++
* [influxdb-cxx](https://github.com/offa/influxdb-cxx)
  * Maintained by [offa](https://github.com/offa)

### Go

- [influxdb-client-go](https://github.com/influxdata/influxdb-client-go)
  - Maintained by [InfluxData](https://github.com/influxdata)

### Java

- [influxdb-client-java](https://github.com/influxdata/influxdb-client-java)
   - Maintained by [InfluxData](https://github.com/influxdata)

### JavaScript

* [influxdb-javascript](https://github.com/influxdata/influxdb-client-js)
   - Maintained by [InfluxData](https://github.com/influxdata)

### PHP

- [influxdb-client-php](https://github.com/influxdata/influxdb-client-php)
   - Maintained by [InfluxData](https://github.com/influxdata)

### Python

* [influxdb-client-python](https://github.com/influxdata/influxdb-client-python)
   - Maintained by [InfluxData](https://github.com/influxdata)

### Ruby

- [influxdb-client-ruby](https://github.com/influxdata/influxdb-client-ruby)
   - Maintained by [InfluxData](https://github.com/influxdata)

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
    client = influxdb_client.InfluxDBClient(url="http://localhost:8086",token=token)
    ```

    > **Note:** The database (and retention policy, if applicable) are converted to a [bucket](/v2.0/reference/glossary/#bucket) data store compatible with InfluxDB 2.0.

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
