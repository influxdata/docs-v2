Use InfluxDB 3 client libraries that integrate with your code to construct data
as time series points, and then write them as line protocol to an
{{% product-name %}} database.

- [Construct line protocol](#construct-line-protocol)
  - [Example home schema](#example-home-schema)
- [Set up your project](#set-up-your-project)
- [Construct points and write line protocol](#construct-points-and-write-line-protocol)

## Set up your project

Set up your {{< product-name >}} project and credentials
to write data using the InfluxDB 3 client library for your programming language
of choice.

1. [Install {{< product-name >}}](/influxdb3/version/get-started/install/)
2. [Set up {{< product-name >}}](/influxdb3/version/get-started/setup/) 
3. Create a project directory and store your
   {{< product-name >}} credentials as environment variables or in a project
   configuration file, such as a `.env` ("dotenv") file.

After setting up {{< product-name >}} and your project, you should have the following:

- {{< product-name >}} credentials:

  - [Database](/influxdb3/version/admin/databases/)
  - [Authorization token](/influxdb3/version/admin/tokens/)
  - {{% product-name %}} URL

- A directory for your project.
- Credentials stored as environment variables or in a project configuration
  file--for example, a `.env` ("dotenv") file.

### Initialize a project directory

Create a project directory and initialize it for your programming language.

<!-- vale InfluxDataDocs.v3Schema = YES -->

{{< tabs-wrapper >}}
{{% tabs %}}
[Go](#)
[Node.js](#)
[Python](#)
{{% /tabs %}}
{{% tab-content %}}
<!-- BEGIN GO PROJECT SETUP -->

1. Install [Go 1.13 or later](https://golang.org/doc/install).

2. Create a directory for your Go module and change to the directory--for
   example:

   ```sh
   mkdir iot-starter-go && cd $_
   ```

3. Initialize a Go module--for example:

   ```sh
   go mod init iot-starter
   ```

<!-- END GO SETUP PROJECT -->

{{% /tab-content %}}
{{% tab-content %}}
<!-- BEGIN JAVASCRIPT PROJECT SETUP -->

1. Install [Node.js](https://nodejs.org/en/download/).

2. Create a directory for your JavaScript project and change to the
   directory--for example:

   ```sh
   mkdir -p iot-starter-js && cd $_
   ```

3. Initialize a project--for example, using `npm`:

   <!-- pytest.mark.skip -->

   ```sh
   npm init
   ```
<!-- END JAVASCRIPT SETUP PROJECT -->

{{% /tab-content %}}
{{% tab-content %}}

<!-- BEGIN PYTHON SETUP PROJECT -->
1. Install [Python](https://www.python.org/downloads/)

2. Inside of your project directory, create a directory for your Python module
   and change to the module directory--for example:

   ```sh
   mkdir -p iot-starter-py && cd $_
   ```

3. **Optional, but recommended**: Use
   [`venv`](https://docs.python.org/3/library/venv.html) or
   [`conda`](https://docs.continuum.io/anaconda/install/) to activate a virtual
   environment for installing and executing code--for example, enter the
   following command using `venv` to create and activate a virtual environment
   for the project:

   ```bash
   python3 -m venv envs/iot-starter && source ./envs/iot-starter/bin/activate
   ```
<!-- END PYTHON SETUP PROJECT -->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Install the client library

Install the InfluxDB 3 client library for your programming language of choice.

{{< tabs-wrapper >}}
{{% tabs %}}
[C#](#)
[Go](#)
[Java](#)
[Node.js](#)
[Python](#)
{{% /tabs %}}
{{% tab-content %}}
<!-- BEGIN C# INSTALL CLIENT LIBRARY -->
Add the [InfluxDB 3 C# client library](https://github.com/InfluxCommunity/influxdb3-csharp) to your project using the
[`dotnet` CLI](https://docs.microsoft.com/dotnet/core/tools/dotnet) or
by adding the package to your project file--for example:

```bash
dotnet add package InfluxDB3.Client
```

{{% /tab-content %}}
{{% tab-content %}}
<!-- BEGIN GO INSTALL CLIENT LIBRARY -->
Add the
[InfluxDB 3 Go client library](https://github.com/InfluxCommunity/influxdb3-go)
to your project using the
[`go get` command](https://golang.org/cmd/go/#hdr-Add_dependencies_to_current_module_and_install_them)--for example:

```bash
go mod init path/to/project/dir && cd $_
go get github.com/InfluxCommunity/influxdb3-go/v2/influxdb3
```

{{% /tab-content %}}
{{% tab-content %}}
<!-- BEGIN JAVA INSTALL CLIENT LIBRARY -->
Add the [InfluxDB 3 Java client library](https://github.com/InfluxCommunity/influxdb3-java) to your project dependencies using
the [Maven](https://maven.apache.org/)
[Gradle](https://gradle.org/) build tools.

For example, to add the library to a Maven project, add the following dependency
to your `pom.xml` file:

```xml
<dependency>
  <groupId>com.influxdb</groupId>
  <artifactId>influxdb3-java</artifactId>
  <version>1.1.0</version>
</dependency>
```

To add the library to a Gradle project, add the following dependency to your `build.gradle` file:

```groovy
dependencies {
  implementation 'com.influxdb:influxdb3-java:1.1.0'
}
```

{{% /tab-content %}}
{{% tab-content %}}
<!-- BEGIN NODE.JS INSTALL CLIENT LIBRARY -->
For a Node.js project, use `@influxdata/influxdb3-client`, which provides main (CommonJS), 
module (ESM), and browser (UMD) exports.
Add the [InfluxDB 3 JavaScript client library](https://github.com/InfluxCommunity/influxdb3-js) using your preferred package manager--for example, using [`npm`](https://www.npmjs.com/):

```bash
npm install --save @influxdata/influxdb3-client
```

{{% /tab-content %}}
{{% tab-content %}}
<!-- BEGIN PYTHON INSTALL CLIENT LIBRARY -->
Install the [InfluxDB 3 Python client library](https://github.com/InfluxCommunity/influxdb3-python) using
[`pip`](https://pypi.org/project/pip/).
To use Pandas features, such as `to_pandas()`, provided by the Python
client library, you must also install the
[`pandas` package](https://pandas.pydata.org/).

```bash
pip install influxdb3-python pandas
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Construct line protocol

With a [basic understanding of line protocol](/influxdb3/version/write-data/#line-protocol),
you can construct line protocol data and write it to {{% product-name %}}.

Use client library write methods to provide data as raw line protocol
or as `Point` objects that the client library converts to line protocol.
If your program creates the data you write to InfluxDB, the `Point`
interface to take advantage of type safety in your program.

Client libraries provide one or more `Point` constructor methods. Some libraries
support language-native data structures, such as Go's `struct`, for creating
points.

Examples in this guide show how to construct `Point` objects that follow the [example `home` schema](#example-home-schema),
and then write the points as line protocol data to an {{% product-name %}} database.

#### Example home schema

Consider a use case where you collect data from sensors in your home. Each
sensor collects temperature, humidity, and carbon monoxide readings.

To collect this data, use the following schema:

<!-- vale InfluxDataDocs.v3Schema = YES -->

- **table**: `home`
  - **tags**
    - `room`: Living Room or Kitchen
  - **fields**
    - `temp`: temperature in °C (float)
    - `hum`: percent humidity (float)
    - `co`: carbon monoxide in parts per million (integer)
  - **timestamp**: Unix timestamp in _second_ precision

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
