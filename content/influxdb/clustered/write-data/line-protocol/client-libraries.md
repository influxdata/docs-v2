---
title: Use InfluxDB client libraries to write line protocol data
description: >
  Use InfluxDB API clients to write line protocol data to InfluxDB Clustered.
menu:
  influxdb_clustered:
    name: Use client libraries
    parent: Write line protocol
    identifier: write-client-libs
weight: 103
related:
  - /influxdb/clustered/reference/syntax/line-protocol/
  - /influxdb/clustered/get-started/write/
---

Use InfluxDB client libraries to build line protocol, and then write it to an
InfluxDB database.

- [Construct line protocol](#construct-line-protocol)
- [Set up your project](#set-up-your-project)
- [Construct points and write line protocol](#construct-points-and-write-line-protocol)
- [Run the example](#run-the-example)
  - [Home sensor data line protocol](#home-sensor-data-line-protocol)

## Construct line protocol

With a [basic understanding of line protocol](/influxdb/clustered/write-data/line-protocol/),
you can now construct line protocol and write data to InfluxDB.
Consider a use case where you collect data from sensors in your home.
Each sensor collects temperature, humidity, and carbon monoxide readings.
To collect this data, use the following schema:

- **measurement**: `home`
  - **tags**
    - `room`: Living Room or Kitchen
  - **fields**
    - `temp`: temperature in °C (float)
    - `hum`: percent humidity (float)
    - `co`: carbon monoxide in parts per million (integer)
  - **timestamp**: Unix timestamp in _second_ precision

The following example shows how to construct and write points that follow this schema.

## Set up your project

The examples in this guide assume you followed [Set up InfluxDB](/influxdb/clustered/get-started/setup/)
and [Write data set up](/influxdb/clustered/get-started/write/#set-up-your-project-and-credentials)
instructions in [Get started](/influxdb/clustered/get-started/).

After setting up InfluxDB and your project, you should have the following:

- {{< product-name >}} credentials:

  - [Database](/influxdb/clustered/admin/databases/)
  - [Database token](/influxdb/clustered/admin/tokens/#database-tokens)
  - Cluster hostname

- A directory for your project.

- Credentials stored as environment variables or in a project configuration file--for example, a `.env` ("dotenv") file.

- Client libraries installed for writing data to InfluxDB.

The following example shows how to construct `Point` objects that follow the [example `home` schema](#example-home-schema), and then write the points as line protocol to an
{{% product-name %}} database.

{{< tabs-wrapper >}}
{{% tabs %}}
[Go](#)
[Node.js](#)
[Python](#)
{{% /tabs %}}
{{% tab-content %}}

<!-- BEGIN GO PROJECT SETUP -->

1.  Install [Go 1.13 or later](https://golang.org/doc/install).

2.  Inside of your project directory, install the client package to your project dependencies.

    ```sh
    go get github.com/influxdata/influxdb-client-go/v2
    ```

<!-- END GO SETUP PROJECT -->

{{% /tab-content %}}
{{% tab-content %}}

<!-- BEGIN NODE.JS PROJECT SETUP -->

Inside of your project directory, install the `@influxdata/influxdb-client` InfluxDB v2 JavaScript client library.

```sh
npm install --save @influxdata/influxdb-client
```

<!-- END NODE.JS SETUP PROJECT -->

{{% /tab-content %}}
{{% tab-content %}}

<!-- BEGIN PYTHON SETUP PROJECT -->

1.  **Optional, but recommended**: Use [`venv`](https://docs.python.org/3/library/venv.html)) or [`conda`](https://docs.continuum.io/anaconda/install/) to activate a virtual environment for installing and executing code--for example:

    Inside of your project directory, enter the following command using `venv` to create and activate a virtual environment for the project:

    ```sh
    python3 -m venv envs/env1 && source ./envs/env1/bin/activate
    ```

2.  Install the [`influxdb3-python`](https://github.com/InfluxCommunity/influxdb3-python), which provides the InfluxDB `influxdb_client_3` Python client library module and also installs the [`pyarrow` package](https://arrow.apache.org/docs/python/index.html) for working with Arrow data.

    ```sh
    pip install influxdb3-python
    ```

<!-- END PYTHON SETUP PROJECT -->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Construct points and write line protocol

{{< tabs-wrapper >}}
{{% tabs %}}
[Go](#)
[Node.js](#)
[Python](#)
{{% /tabs %}}
{{% tab-content %}}

<!-- BEGIN GO SETUP SAMPLE -->

1.  Create a file for your module--for example: `write-point.go`.

2.  In `write-point.go`, enter the following sample code:

        ```go
        package main

        import (
          "os"
          "time"
          "fmt"
          "github.com/influxdata/influxdb-client-go/v2"
        )

        func main() {
          // Set a log level constant
          const debugLevel uint = 4

          /**
            * Define options for the client.
            * Instantiate the client with the following arguments:
            *   - An object containing InfluxDB URL and token credentials.
            *   - Write options for batch size and timestamp precision.
          **/
          clientOptions := influxdb2.DefaultOptions().
                            SetBatchSize(20).
                            SetLogLevel(debugLevel).
                            SetPrecision(time.Second)

          client := influxdb2.NewClientWithOptions(os.Getenv("INFLUX_URL"),
                      os.Getenv("INFLUX_TOKEN"),
                      clientOptions)

          /**
            * Create an asynchronous, non-blocking write client.
            * Provide your InfluxDB org and database as arguments
          **/
          writeAPI := client.WriteAPI(os.Getenv("INFLUX_ORG"), "get-started")

          // Get the errors channel for the asynchronous write client.
          errorsCh := writeAPI.Errors()

          /** Create a point.
            * Provide measurement, tags, and fields as arguments.
          **/
          p := influxdb2.NewPointWithMeasurement("home").
                AddTag("room", "Kitchen").
                AddField("temp", 72.0).
                AddField("hum", 20.2).
                AddField("co", 9).
                SetTime(time.Now())

          // Define a proc for handling errors.
          go func() {
            for err := range errorsCh {
                fmt.Printf("write error: %s\n", err.Error())
            }
          }()

          // Write the point asynchronously
          writeAPI.WritePoint(p)

          // Send pending writes from the buffer to the database.
          writeAPI.Flush()

          // Ensure background processes finish and release resources.
          client.Close()
        }
        ```

    <!-- END GO SETUP SAMPLE -->

    {{% /tab-content %}}
    {{% tab-content %}}
    <!-- BEGIN NODE.JS SETUP SAMPLE -->

3.  Create a file for your module--for example: `write-point.js`.

4.  In `write-point.js`, enter the following sample code:

        ```js
        'use strict'
        /** @module write
         * Use the JavaScript client library for Node.js. to create a point and write it to InfluxDB
        **/

        import {InfluxDB, Point} from '@influxdata/influxdb-client'

        /** Get credentials from the environment **/
        const url = process.env.INFLUX_URL
        const token = process.env.INFLUX_TOKEN
        const org = process.env.INFLUX_ORG

        /**
         * Instantiate a client with a configuration object
         * that contains your InfluxDB URL and token.
        **/
        const influxDB = new InfluxDB({url, token})

        /**
         * Create a write client configured to write to the database.
         * Provide your InfluxDB org and database.
        **/
        const writeApi = influxDB.getWriteApi(org, 'get-started')

        /**
         * Create a point and add tags and fields.
         * To add a field, call the field method for your data type.
        **/
        const point1 = new Point('home')
          .tag('room', 'Kitchen')
          .floatField('temp', 72.0)
          .floatField('hum', 20.2)
          .intField('co', 9)
        console.log(` ${point1}`)

        /**
         * Add the point to the batch.
        **/
        writeApi.writePoint(point1)

        /**
         * Flush pending writes in the batch from the buffer and close the write client.
        **/
        writeApi.close().then(() => {
          console.log('WRITE FINISHED')
        })
        ```

    <!-- END NODE.JS SETUP SAMPLE -->

    {{% /tab-content %}}
    {{% tab-content %}}
    <!-- BEGIN PYTHON SETUP SAMPLE -->

5.  Create a file for your module--for example: `write-point.py`.

6.  In `write-point.py`, enter the following sample code to write data in batching mode:

        ```python
        import os
        from influxdb_client_3 import Point, write_client_options, WritePrecision, WriteOptions, InfluxDBError

        # Create an array of points with tags and fields.
        points = [Point("home")
                    .tag("room", "Kitchen")
                    .field("temp", 25.3)
                    .field('hum', 20.2)
                    .field('co', 9)]

        # With batching mode, define callbacks to execute after a successful or failed write request.
        # Callback methods receive the configuration and data sent in the request.
        def success(self, data: str):
            print(f"Successfully wrote batch: data: {data}")

        def error(self, data: str, exception: InfluxDBError):
            print(f"Failed writing batch: config: {self}, data: {data} due: {exception}")

        def retry(self, data: str, exception: InfluxDBError):
            print(f"Failed retry writing batch: config: {self}, data: {data} retry: {exception}")

        # Configure options for batch writing.
        write_options = WriteOptions(batch_size=500,
                                            flush_interval=10_000,
                                            jitter_interval=2_000,
                                            retry_interval=5_000,
                                            max_retries=5,
                                            max_retry_delay=30_000,
                                            exponential_base=2)

        # Create an options dict that sets callbacks and WriteOptions.
        wco = write_client_options(success_callback=success,
                                  error_callback=error,
                                  retry_callback=retry,
                                  write_options=write_options)

        # Instantiate a synchronous instance of the client with your
        # InfluxDB credentials and write options.
        with InfluxDBClient3(host=config['INFLUX_HOST'],
                                token=config['INFLUX_TOKEN'],
                                database=config['INFLUX_DATABASE'],
                                write_client_options=wco) as client:

              client.write(points, write_precision='s')
        ```

    <!-- END PYTHON SETUP PROJECT -->

    {{% /tab-content %}}
    {{< /tabs-wrapper >}}

The sample code does the following:

1.  Instantiates a client configured with the InfluxDB URL and API token.

2.  Uses the client to instantiate a **write client** with credentials.

    <!-- vale InfluxDataDocs.v3Schema = NO -->

3.  Constructs a `Point` object with the [measurement](/influxdb/clustered/reference/glossary/#measurement) name (`"home"`).
    <!-- vale InfluxDataDocs.v3Schema = YES -->

4.  Adds a tag and fields to the point.

5.  Adds the point to a batch to be written to the database.

6.  Sends the batch to InfluxDB and waits for the response.

7.  Executes callbacks for the response, flushes the write buffer, and releases resources.

## Run the example

To run the sample and write the data to your InfluxDB Clustered database, enter the following command in your terminal:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Go](#)
[Node.js](#)
[Python](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!-- BEGIN GO RUN EXAMPLE -->

```sh
go run write-point.go
```

<!-- END GO RUN EXAMPLE -->

{{% /code-tab-content %}}
{{% code-tab-content %}}

<!-- BEGIN NODE.JS RUN EXAMPLE -->

```sh
node write-point.js
```

<!-- END NODE.JS RUN EXAMPLE -->

{{% /code-tab-content %}}

{{% code-tab-content %}}

<!-- BEGIN PYTHON RUN EXAMPLE -->

```sh
python write-point.py
```

<!-- END PYTHON RUN EXAMPLE -->

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

The example logs the point as line protocol to stdout, and then writes the point to the database.
The line protocol is similar to the following:

### Home sensor data line protocol

```sh
home,room=Kitchen co=9i,hum=20.2,temp=72 1641024000
```
