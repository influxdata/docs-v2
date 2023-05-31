---
title: Write line protocol data to InfluxDB Cloud Dedicated
description: >
  Use Telegraf and API clients to write line protocol data
  to InfluxDB Cloud Dedicated.
menu:
  influxdb_cloud_dedicated:
    name: Write line protocol data
    parent: Write data
weight: 103
related:
  - /influxdb/cloud-dedicated/reference/syntax/line-protocol/
  - /influxdb/cloud-dedicated/get-started/write/
---

Learn the fundamentals of constructing and writing line protocol data.
Use tools like Telegraf and InfluxDB client libraries to
build line protocol, and then write it to an InfluxDB database.

You can use these tools to build line protocol from scratch or transform
your data to line protocol.
However, if you already have CSV data, you might want to use tools that [consume CSV
and write it to InfluxDB as line protocol](/influxdb/cloud-dedicated/write-data/csv).

<!-- TOC -->

- [Line protocol](#line-protocol)
  - [Line protocol elements](#line-protocol-elements)
    - [Line protocol element parsing](#line-protocol-element-parsing)
- [Construct line protocol](#construct-line-protocol)
  - [Set up your project](#set-up-your-project)
  - [Construct points and write line protocol](#construct-points-and-write-line-protocol)
  - [Run the example](#run-the-example)
    - [Home sensor data line protocol](#home-sensor-data-line-protocol)

<!-- /TOC -->

## Line protocol

All data written to InfluxDB is written using [line protocol](/influxdb/cloud-dedicated/reference/syntax/line-protocol/), a text-based
format that lets you provide the necessary information to write a data point to InfluxDB.

### Line protocol elements

In InfluxDB, a point contains a measurement name, one or more fields, a timestamp, and optional tags that provide metadata about the observation.

Each line of line protocol contains the following elements:

{{< req type="key" >}}

- {{< req "\*" >}} **measurement**:  String that identifies the [measurement](/influxdb/cloud-dedicated/reference/glossary/#measurement) to store the data in.
- **tag set**: Comma-delimited list of key value pairs, each representing a tag.
  Tag keys and values are unquoted strings. _Spaces, commas, and equal characters must be escaped._
- {{< req "\*" >}} **field set**: Comma-delimited list of key value pairs, each representing a field.
  Field keys are unquoted strings. _Spaces and commas must be escaped._
  Field values can be [strings](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#string) (quoted),
  [floats](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#float),
  [integers](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#integer),
  [unsigned integers](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#uinteger),
  or [booleans](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#boolean).
- **timestamp**: [Unix timestamp](/influxdb/cloud-dedicated/reference/syntax/line-protocol/#unix-timestamp)
  associated with the data. InfluxDB supports up to nanosecond precision.
  _If the precision of the timestamp is not in nanoseconds, you must specify the
  precision when writing the data to InfluxDB._

#### Line protocol element parsing

- **measurement**: Everything before the _first unescaped comma before the first whitespace_.
- **tag set**: Key-value pairs between the _first unescaped comma_ and the _first unescaped whitespace_.
- **field set**: Key-value pairs between the _first and second unescaped whitespaces_.
- **timestamp**: Integer value after the _second unescaped whitespace_.
- Lines are separated by the newline character (`\n`).
  Line protocol is whitespace sensitive.

---

{{< influxdb/line-protocol >}}

---

_For schema design recommendations, see [InfluxDB schema design](/influxdb/cloud-dedicated/write-data/best-practices/schema-design/)._

## Construct line protocol

With a basic understanding of line protocol, you can now construct line protocol
and write data to InfluxDB.
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

Data is collected hourly beginning at 
{{% influxdb/custom-timestamps-span %}}**2022-01-01T08:00:00Z (UTC)** until **2022-01-01T20:00:00Z (UTC)**{{% /influxdb/custom-timestamps-span %}}.

The following example shows how to construct and write points that follow this schema.

### Set up your project

The examples in this guide assume you followed [Set up InfluxDB](/influxdb/cloud-dedicated/get-started/setup/) and [Write data set up](/influxdb/cloud-dedicated/get-started/write/#set-up-your-project-and-credentials) instructions in [Get started](/influxdb/cloud-dedicated/get-started/).

After setting up InfluxDB and your project, you should have the following:

- InfluxDB Cloud Dedicated credentials:
   - [Database](/influxdb/cloud-dedicated/admin/databases/)
   - [Token](/influxdb/cloud-dedicated/admin/tokens/)
   - [Region URL](/influxdb/cloud-dedicated/reference/regions/)

- A directory for your project.

- Credentials stored as environment variables or in a project configuration file--for example, a `.env` ("dotenv") file.

- Client libraries installed for writing data to InfluxDB.

The following example shows how to construct `Point` objects that follow the [example `home` schema](#example-home-schema), and then write the points as line protocol to an
InfluxDB Cloud Dedicated database.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Go](#)
[Node.js](#)
[Python](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- BEGIN GO PROJECT SETUP -->

1.  Install [Go 1.13 or later](https://golang.org/doc/install).

2.  Inside of your project directory, install the client package to your project dependencies.

    ```sh
    go get github.com/influxdata/influxdb-client-go/v2
    ```

<!-- END GO SETUP PROJECT -->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- BEGIN NODE.JS PROJECT SETUP -->

Inside of your project directory, install the `@influxdata/influxdb-client` InfluxDB v2 JavaScript client library.

```sh
npm install --save @influxdata/influxdb-client
```

<!-- END NODE.JS SETUP PROJECT -->
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- BEGIN PYTHON SETUP PROJECT -->

1.  **Optional, but recommended**: Use `venv` or `conda` to activate a virtual environment for installing and executing code--for example:

    Inside of your project directory, enter the following command to create and activate a virtual environment for the project:

    ```sh
    python3 -m venv envs/env1 && source ./envs/env1/bin/activate
    ```

2.  Install the `influxdb-client` InfluxDB v2 Python library.

    ```sh
    pip install influxdb-client
    ```

<!-- END PYTHON SETUP PROJECT -->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Construct points and write line protocol

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Go](#)
[Node.js](#)
[Python](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
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
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- BEGIN NODE.JS SETUP SAMPLE -->

1.  Create a file for your module--for example: `write-point.js`.

2.  In `write-point.js`, enter the following sample code:

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
{{% /code-tab-content %}}

{{% code-tab-content %}}
<!-- BEGIN PYTHON SETUP SAMPLE -->

1.  Create a file for your module--for example: `write-point.py`.

2.  In `write-point.py`, enter the following sample code:

    ```python
    import os
    from influxdb_client import InfluxDBClient, Point

    # Instantiate a client with a configuration object
    # that contains your InfluxDB URL and token.
    # InfluxDB ignores the org argument, but the client requires it.
    client = InfluxDBClient(url=os.getenv('INFLUX_URL'),
                            token=os.getenv('INFLUX_TOKEN'),
                            org='ignored')

    # Create an array of points with tags and fields.
    points = [Point("home")
                .tag("room", "Kitchen")
                .field("temp", 25.3)
                .field('hum', 20.2)
                .field('co', 9)]

    # Execute code after a successful write request.
    # Callback methods receive the configuration and data sent in the request.
    def success_callback(self, data):
        print(f"{data}")
        print(f"WRITE FINISHED")

    # Create a write client.
    # Optionally, provide callback methods to execute on request success, error, and completion.
    with client.write_api(success_callback=success_callback) as write_api:
        # Write the data to the database.
        write_api.write(bucket='get-started',
                        record=points,
                        content_encoding="identity",
                        content_type="text/plain; charset=utf-8",)
        # Flush the write buffer and release resources.
        write_api.close()
    ```
<!-- END PYTHON SETUP PROJECT -->
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

The sample code does the following:

1.  Instantiates a client configured with the InfluxDB URL and API token.

2.  Uses the client to instantiate a **write client** with credentials.

3.  Constructs a `Point` object with the [measurement](/influxdb/cloud-dedicated/reference/glossary/#measurement) name (`"home"`).

4.  Adds a tag and fields to the point.

5.  Adds the point to a batch to be written to the database.

6.  Sends the batch to InfluxDB and waits for the response.

7.  Executes callbacks for the response, flushes the write buffer, and releases resources.

### Run the example

To run the sample and write the data to your InfluxDB Cloud Dedicated database, enter the following command in your terminal:

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

{{% influxdb/custom-timestamps %}}

#### Home sensor data line protocol

```sh
home,room=Kitchen co=9i,hum=20.2,temp=72 1641024000
```

{{% /influxdb/custom-timestamps %}}
