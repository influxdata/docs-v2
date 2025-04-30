  Use the `/api/v3/write_lp` HTTP API endpoint and InfluxDB v3 API clients to write points as line protocol data to {{% product-name %}}.

- [Use the /api/v3/write\_lp endpoint](#use-the-apiv3write_lp-endpoint)
  - [Example: write data using the /api/v3 HTTP API](#example-write-data-using-the-apiv3-http-api)
  - [Write responses](#write-responses)
  - [Use no\_sync for immediate write responses](#use-no_sync-for-immediate-write-responses)
- [Use API client libraries](#use-api-client-libraries)
  - [Construct line protocol](#construct-line-protocol)
  - [Set up your project](#set-up-your-project)

## Use the /api/v3/write_lp endpoint

{{% product-name %}} adds the `/api/v3/write_lp` endpoint.

{{<api-endpoint endpoint="/api/v3/write_lp?db=mydb&precision=nanosecond&accept_partial=true&no_sync=false" method="post" >}}

This endpoint accepts the same line protocol syntax as [previous versions](/influxdb3/version/write-data/compatibility-apis/),
and supports the following parameters:

- `?accept_partial=<BOOLEAN>`: Accept or reject partial writes (default is `true`).
- `?no_sync=<BOOLEAN>`: Control when writes are acknowledged:
  - `no_sync=true`: Acknowledge writes before WAL persistence completes.
  - `no_sync=false`: Acknowledges writes after WAL persistence completes (default).
- `?precision=<PRECISION>`: Specify the precision of the timestamp. The default is nanosecond precision.

For more information about the parameters, see [Write data](/influxdb3/version/write-data/).

InfluxData provides supported InfluxDB 3 client libraries that you can integrate with your code
to construct data as time series points, and then write them as line protocol to an {{% product-name %}} database.
For more information, see how to [use InfluxDB client libraries to write data](/influxdb3/version/write-data/client-libraries/).

### Example: write data using the /api/v3 HTTP API

The following examples show how to write data using `curl` and the `/api/3/write_lp` HTTP endpoint.
To show the difference between accepting and rejecting partial writes, line `2` in the example contains a string value (`"hi"`) for a float field (`temp`).

#### Partial write of line protocol occurred

With `accept_partial=true` (default):

```bash
curl -v "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=auto" \
  --data-raw 'home,room=Sunroom temp=96
home,room=Sunroom temp="hi"'
```

The response is the following:

```
< HTTP/1.1 400 Bad Request
...
{
  "error": "partial write of line protocol occurred",
  "data": [
    {
      "original_line": "home,room=Sunroom temp=hi",
      "line_number": 2,
      "error_message": "invalid column type for column 'temp', expected iox::column_type::field::float, got iox::column_type::field::string"
    }
  ]
}
```

Line `1` is written and queryable.
Line `2` is rejected.
The response is an HTTP error (`400`) status, and the response body contains the error message `partial write of line protocol occurred` with details about the problem line. 

#### Parsing failed for write_lp endpoint

With `accept_partial=false`:

```bash
curl -v "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=auto&accept_partial=false" \
  --data-raw 'home,room=Sunroom temp=96
home,room=Sunroom temp="hi"'
```

The response is the following:

```
< HTTP/1.1 400 Bad Request
...
{
  "error": "parsing failed for write_lp endpoint",
  "data": {
    "original_line": "home,room=Sunroom temp=hi",
    "line_number": 2,
    "error_message": "invalid column type for column 'temp', expected iox::column_type::field::float, got iox::column_type::field::string"
  }
}
```

InfluxDB rejects all points in the batch.
The response is an HTTP error (`400`) status, and the response body contains `parsing failed for write_lp endpoint` and details about the problem line.

For more information about the ingest path and data flow, see [Data durability](/influxdb3/version/reference/internals/durability/).

### Write responses

By default, InfluxDB acknowledges writes after flushing the WAL file to the Object store (occurring every second).
For high write throughput, you can send multiple concurrent write requests.

### Use no_sync for immediate write responses

To reduce the latency of writes, use the `no_sync` write option, which acknowledges writes _before_ WAL persistence completes.
When `no_sync=true`, InfluxDB validates the data, writes the data to the WAL, and then immediately responds to the client, without waiting for persistence to the Object store.

Using `no_sync=true` is best when prioritizing high-throughput writes over absolute durability. 

- Default behavior (`no_sync=false`): Waits for data to be written to the Object store before acknowledging the write. Reduces the risk of data loss, but increases the latency of the response.
- With `no_sync=true`: Reduces write latency, but increases the risk of data loss in case of a crash before WAL persistence. 

#### Immediate write using the HTTP API

The `no_sync` parameter controls when writes are acknowledged--for example:

```bash
curl "http://localhost:8181/api/v3/write_lp?db=sensors&precision=auto&no_sync=true" \
  --data-raw "home,room=Sunroom temp=96"
```

## Use API client libraries

Use InfluxDB 3 client libraries that integrate with your code to construct data
as time series points, and
then write them as line protocol to an {{% product-name %}} database.

- [Construct line protocol](#construct-line-protocol)
  - [Example home schema](#example-home-schema)
- [Set up your project](#set-up-your-project)
- [Construct points and write line protocol](#construct-points-and-write-line-protocol)

### Construct line protocol

With a [basic understanding of line protocol](/influxdb3/version/write-data/#line-protocol),
you can construct line protocol data and write it to {{% product-name %}}.

All InfluxDB client libraries write data in line protocol format to InfluxDB.
Client library `write` methods let you provide data as raw line protocol or as
`Point` objects that the client library converts to line protocol. If your
program creates the data you write to InfluxDB, use the client library `Point`
interface to take advantage of type safety in your program.

#### Example home schema

Consider a use case where you collect data from sensors in your home. Each
sensor collects temperature, humidity, and carbon monoxide readings.

To collect this data, use the following schema:

<!-- vale InfluxDataDocs.v3Schema = NO -->

- **table**: `home`
  - **tags**
    - `room`: Living Room or Kitchen
  - **fields**
    - `temp`: temperature in °C (float)
    - `hum`: percent humidity (float)
    - `co`: carbon monoxide in parts per million (integer)
  - **timestamp**: Unix timestamp in _second_ precision

<!-- vale InfluxDataDocs.v3Schema = YES -->

The following example shows how to construct and write points that follow the
`home` schema.

### Set up your project

After setting up {{< product-name >}} and your project, you should have the following:

- {{< product-name >}} credentials:

  - [Database](/influxdb3/version/admin/databases/)
  - Authorization token

    > [!Note]
    > While in beta, {{< product-name >}} does not require an authorization token.

  - {{% product-name %}} URL

- A directory for your project.

- Credentials stored as environment variables or in a project configuration
  file--for example, a `.env` ("dotenv") file.

- Client libraries installed for writing data to {{< product-name >}}.

The following examples use InfluxDB 3 client libraries to show how to construct
`Point` objects that follow the [example `home` schema](#example-home-schema),
and then write the data as line protocol to an {{% product-name %}} database.

{{< tabs-wrapper >}}
{{% tabs %}}
[Go](#)
[Node.js](#)
[Python](#)
{{% /tabs %}}
{{% tab-content %}}

The following steps set up a Go project using the
[InfluxDB 3 Go client](https://github.com/InfluxCommunity/influxdb3-go/):

<!-- BEGIN GO PROJECT SETUP -->

1. Install [Go 1.13 or later](https://golang.org/doc/install).

1. Create a directory for your Go module and change to the directory--for
   example:

   ```sh
   mkdir iot-starter-go && cd $_
   ```

1. Initialize a Go module--for example:

   ```sh
   go mod init iot-starter
   ```

1. Install [`influxdb3-go`](https://github.com/InfluxCommunity/influxdb3-go/),
   which provides the InfluxDB `influxdb3` Go client library module.

   ```sh
   go get github.com/InfluxCommunity/influxdb3-go/v2
   ```

<!-- END GO SETUP PROJECT -->

{{% /tab-content %}} {{% tab-content %}}

<!-- BEGIN NODE.JS PROJECT SETUP -->

The following steps set up a JavaScript project using the
[InfluxDB 3 JavaScript client](https://github.com/InfluxCommunity/influxdb3-js/).

1. Install [Node.js](https://nodejs.org/en/download/).

1. Create a directory for your JavaScript project and change to the
   directory--for example:

   ```sh
   mkdir -p iot-starter-js && cd $_
   ```

1. Initialize a project--for example, using `npm`:

   <!-- pytest.mark.skip -->

   ```sh
   npm init
   ```

1. Install the `@influxdata/influxdb3-client` InfluxDB 3 JavaScript client
   library.

   ```sh
   npm install @influxdata/influxdb3-client
   ```

<!-- END NODE.JS SETUP PROJECT -->

{{% /tab-content %}} {{% tab-content %}}

<!-- BEGIN PYTHON SETUP PROJECT -->

The following steps set up a Python project using the
[InfluxDB 3 Python client](https://github.com/InfluxCommunity/influxdb3-python/):

1. Install [Python](https://www.python.org/downloads/)

1. Inside of your project directory, create a directory for your Python module
   and change to the module directory--for example:

   ```sh
   mkdir -p iot-starter-py && cd $_
   ```

1. **Optional, but recommended**: Use
   [`venv`](https://docs.python.org/3/library/venv.html) or
   [`conda`](https://docs.continuum.io/anaconda/install/) to activate a virtual
   environment for installing and executing code--for example, enter the
   following command using `venv` to create and activate a virtual environment
   for the project:

   ```bash
   python3 -m venv envs/iot-starter && source ./envs/iot-starter/bin/activate
   ```

1. Install
   [`influxdb3-python`](https://github.com/InfluxCommunity/influxdb3-python),
   which provides the InfluxDB `influxdb_client_3` Python client library module
   and also installs the
   [`pyarrow` package](https://arrow.apache.org/docs/python/index.html) for
   working with Arrow data.

   ```sh
   pip install influxdb3-python
   ```

<!-- END PYTHON SETUP PROJECT -->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

#### Construct points and write line protocol

Client libraries provide one or more `Point` constructor methods. Some libraries
support language-native data structures, such as Go's `struct`, for creating
points.

{{< tabs-wrapper >}}
{{% tabs %}}
[Go](#)
[Node.js](#)
[Python](#)
{{% /tabs %}}
{{% tab-content %}}

<!-- BEGIN GO SETUP SAMPLE -->

1. Create a file for your module--for example: `main.go`.

2. In `main.go`, enter the following sample code:

   ```go
   package main

   import (
    "context"
    "os"
    "fmt"
    "time"
    "github.com/InfluxCommunity/influxdb3-go/v2/influxdb3"
    "github.com/influxdata/line-protocol/v2/lineprotocol"
   )

   func Write() error {
     url := os.Getenv("INFLUX_HOST")
     token := os.Getenv("INFLUX_TOKEN")
     database := os.Getenv("INFLUX_DATABASE")

     // To instantiate a client, call New() with InfluxDB credentials.
     client, err := influxdb3.New(influxdb3.ClientConfig{
      Host: url,
      Token: token,
      Database: database,
     })

     /** Use a deferred function to ensure the client is closed when the
       * function returns.
      **/
     defer func (client *influxdb3.Client)  {
      err = client.Close()
      if err != nil {
        panic(err)
      }
     }(client)

     /** Use the NewPoint method to construct a point.
       * NewPoint(measurement, tags map, fields map, time)
      **/
     point := influxdb3.NewPoint("home",
        map[string]string{
          "room": "Living Room",
        },
        map[string]any{
          "temp": 24.5,
          "hum":  40.5,
          "co":   15i},
        time.Now(),
      )

     /** Use the NewPointWithMeasurement method to construct a point with
       * method chaining.
      **/
     point2 := influxdb3.NewPointWithMeasurement("home").
      SetTag("room", "Living Room").
      SetField("temp", 23.5).
      SetField("hum", 38.0).
      SetField("co",  16i).
      SetTimestamp(time.Now())

     fmt.Println("Writing points")
     points := []*influxdb3.Point{point, point2}

     /** Write points to InfluxDB.
       * You can specify WriteOptions, such as Gzip threshold,
       * default tags, and timestamp precision. Default precision is lineprotocol.Nanosecond
      **/
     err = client.WritePoints(context.Background(), points,
       influxdb3.WithPrecision(lineprotocol.Second))
     return nil
   }

   func main() {
     Write()
   }
   ```

3. To run the module and write the data to your {{% product-name %}} database,
   enter the following command in your terminal:

   <!-- pytest.mark.skip -->

   ```sh
   go run main.go
   ```

<!-- END GO SAMPLE -->

{{% /tab-content %}}
{{% tab-content %}}

<!-- BEGIN NODE.JS SETUP SAMPLE -->

1. Create a file for your module--for example: `write-points.js`.

2. In `write-points.js`, enter the following sample code:

   ```js
   // write-points.js
   import { InfluxDBClient, Point } from '@influxdata/influxdb3-client';

   /**
    * Set InfluxDB credentials.
    */
   const host = process.env.INFLUX_HOST ?? '';
   const database = process.env.INFLUX_DATABASE;
   const token = process.env.INFLUX_TOKEN;

   /**
    * Write line protocol to InfluxDB using the JavaScript client library.
    */
   export async function writePoints() {
     /**
      * Instantiate an InfluxDBClient.
      * Provide the host URL and the database token.
      */
     const client = new InfluxDBClient({ host, token });

     /** Use the fluent interface with chained methods to construct Points. */
     const point = Point.measurement('home')
       .setTag('room', 'Living Room')
       .setFloatField('temp', 22.2)
       .setFloatField('hum', 35.5)
       .setIntegerField('co', 7)
       .setTimestamp(new Date().getTime() / 1000);

     const point2 = Point.measurement('home')
       .setTag('room', 'Kitchen')
       .setFloatField('temp', 21.0)
       .setFloatField('hum', 35.9)
       .setIntegerField('co', 0)
       .setTimestamp(new Date().getTime() / 1000);

     /** Write points to InfluxDB.
      * The write method accepts an array of points, the target database, and
      * an optional configuration object.
      * You can specify WriteOptions, such as Gzip threshold, default tags,
      * and timestamp precision. Default precision is lineprotocol.Nanosecond
      **/

     try {
       await client.write([point, point2], database, '', { precision: 's' });
       console.log('Data has been written successfully!');
     } catch (error) {
       console.error(`Error writing data to InfluxDB: ${error.body}`);
     }

     client.close();
   }

   writePoints();
   ```

3. To run the module and write the data to your {{\< product-name >}} database,
   enter the following command in your terminal:

   <!-- pytest.mark.skip -->

   ```sh
   node writePoints.js
   ```

   <!-- END NODE.JS SAMPLE -->

   {{% /tab-content %}}
   {{% tab-content %}}

   <!-- BEGIN PYTHON SETUP SAMPLE -->

1. Create a file for your module--for example: `write-points.py`.

2. In `write-points.py`, enter the following sample code to write data in
   batching mode:

   ```python
   import os
   from influxdb_client_3 import (
     InfluxDBClient3, InfluxDBError, Point, WritePrecision,
     WriteOptions, write_client_options)

   host = os.getenv('INFLUX_HOST')
   token = os.getenv('INFLUX_TOKEN')
   database = os.getenv('INFLUX_DATABASE')

   # Create an array of points with tags and fields.
   points = [Point("home")
               .tag("room", "Kitchen")
               .field("temp", 25.3)
               .field('hum', 20.2)
               .field('co', 9)]

   # With batching mode, define callbacks to execute after a successful or
   # failed write request.
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
   # InfluxDB credentials and write options, such as Gzip threshold, default tags,
   # and timestamp precision. Default precision is nanosecond ('ns').
   with InfluxDBClient3(host=host,
                           token=token,
                           database=database,
                           write_client_options=wco) as client:

         client.write(points, write_precision='s')
   ```

3. To run the module and write the data to your {{< product-name >}} database,
   enter the following command in your terminal:

   <!-- pytest.mark.skip -->

   ```sh
   python write-points.py
   ```

   <!-- END PYTHON SETUP PROJECT -->

   {{% /tab-content %}} {{< /tabs-wrapper >}}

The sample code does the following:

<!-- vale InfluxDataDocs.v3Schema = NO -->

1.  Instantiates a client configured with the InfluxDB URL and API token.
2.  Constructs `home`table `Point` objects.
3.  Sends data as line protocol format to InfluxDB and waits for the response.
4.  If the write succeeds, logs the success message to stdout; otherwise, logs
    the failure message and error details.
5.  Closes the client to release resources.

<!-- vale InfluxDataDocs.v3Schema = YES -->
