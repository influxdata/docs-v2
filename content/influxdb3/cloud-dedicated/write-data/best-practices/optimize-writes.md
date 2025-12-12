---
title: Optimize writes to InfluxDB
description: >
  Tips and examples to optimize performance and system overhead when writing data to
  InfluxDB Cloud Dedicated.
weight: 203
menu:
  influxdb3_cloud_dedicated:
    name: Optimize writes
    parent: write-best-practices
influxdb/cloud/tags: [best practices, write]
related:
  - /resources/videos/ingest-data/, How to Ingest Data in InfluxDB (Video)
  - /influxdb3/cloud-dedicated/write-data/use-telegraf/
---

Use these tips to optimize performance and system overhead when writing data to InfluxDB.

- [Batch writes](#batch-writes)
- [Sort tags by key](#sort-tags-by-key)
- [Use the coarsest time precision possible](#use-the-coarsest-time-precision-possible)
- [Use gzip compression](#use-gzip-compression)
  - [Enable gzip compression in Telegraf](#enable-gzip-compression-in-telegraf)
  - [Enable gzip compression in InfluxDB client libraries](#enable-gzip-compression-in-influxdb-client-libraries)
  - [Use gzip compression with the InfluxDB API](#use-gzip-compression-with-the-influxdb-api)
- [Synchronize hosts with NTP](#synchronize-hosts-with-ntp)
- [Write multiple data points in one request](#write-multiple-data-points-in-one-request)
- [Pre-process data before writing](#pre-process-data-before-writing)
  - [Prerequisites](#prerequisites)
  - [Filter data from a batch](#filter-data-from-a-batch)
  - [Coerce data types to avoid rejected point errors](#coerce-data-types-to-avoid-rejected-point-errors)
  - [Merge lines to optimize memory and bandwidth](#merge-lines-to-optimize-memory-and-bandwidth)
  - [Avoid sending duplicate data](#avoid-sending-duplicate-data)
  - [Run custom preprocessing code](#run-custom-preprocessing-code)

> [!Note]
> The following tools write to InfluxDB and employ _most_ write optimizations by default:
> 
> - [Telegraf](/influxdb3/cloud-dedicated/write-data/use-telegraf/)
> - [InfluxDB client libraries](/influxdb3/cloud-dedicated/reference/client-libraries/)

## Batch writes

Write data in batches to minimize network overhead when writing data to InfluxDB.

> [!Note]
> The optimal batch size is 10,000 lines of line protocol or 10 MBs,
> whichever threshold is met first.

## Sort tags by key

Before writing data points to InfluxDB, sort tags by key in lexicographic order.
_Verify sort results match results from the [Go `bytes.Compare` function](http://golang.org/pkg/bytes/#Compare)._

```text
# Line protocol example with unsorted tags
measurement,tagC=therefore,tagE=am,tagA=i,tagD=i,tagB=think fieldKey=fieldValue 1562020262

# Optimized line protocol example with tags sorted by key
measurement,tagA=i,tagB=think,tagC=therefore,tagD=i,tagE=am fieldKey=fieldValue 1562020262
```

## Use the coarsest time precision possible

By default, InfluxDB writes data in nanosecond precision.
However if your data isn't collected in nanoseconds, there is no need to write at that precision.
For better performance, use the coarsest precision possible for timestamps.

_Specify timestamp precision when [writing to InfluxDB](/influxdb3/cloud-dedicated/write-data/)._

## Use gzip compression

Use gzip compression to speed up writes to InfluxDB.
Benchmarks have shown up to a 5x speed improvement when data is compressed.

{{< tabs-wrapper >}}
{{% tabs %}}
[Telegraf](#)
[Client libraries](#)
[InfluxDB API](#)
{{% /tabs %}}
{{% tab-content %}}

### Enable gzip compression in Telegraf

In the `influxdb_v2` output plugin configuration in your `telegraf.conf`, set the
`content_encoding` option to `gzip`:

```toml
[[outputs.influxdb_v2]]
  urls = ["https://{{< influxdb/host >}}"]
  # ...
  content_encoding = "gzip"
```

{{% /tab-content %}}
{{% tab-content %}}

### Enable gzip compression in InfluxDB client libraries

Each [InfluxDB client library](/influxdb3/cloud-dedicated/reference/client-libraries/) provides
options for compressing write requests or enforces compression by default.
The method for enabling compression is different for each library.
For specific instructions, see the
[InfluxDB client libraries documentation](/influxdb3/cloud-dedicated/reference/client-libraries/).
{{% /tab-content %}}
{{% tab-content %}}

### Use gzip compression with the InfluxDB API

When using the InfluxDB API `/api/v2/write` endpoint to write data,
compress the data with `gzip` and set the `Content-Encoding` header to `gzip`--for example:

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "(DATABASE)_(TOKEN|NAME)" %}}
{{% code-callout "Content-Encoding: gzip" "orange" %}}
```bash
echo "mem,host=host1 used_percent=23.43234543 1641024000
mem,host=host2 used_percent=26.81522361 1641027600
mem,host=host1 used_percent=22.52984738 1641031200
mem,host=host2 used_percent=27.18294630 1641034800" | gzip > system.gzip \

curl --request POST "https://{{< influxdb/host >}}/api/v2/write?org=ignored&bucket=DATABASE_NAME&precision=s" \
  --header "Authorization: Token DATABASE_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --header "Content-Encoding: gzip" \
  --data-binary @system.gzip
```

{{% /code-callout %}}
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/cloud-dedicated/admin/databases/) to write data to
- {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}:
  a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  with _write_ access to the specified database.
  _Store this in a secret store or environment variable to avoid exposing the raw token string._

{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Synchronize hosts with NTP

Use the Network Time Protocol (NTP) to synchronize time between hosts.
If a timestamp isn't included in line protocol, InfluxDB uses its host's local
time (in UTC) to assign timestamps to each point.
If a host's clocks isn't synchronized with NTP, timestamps may be inaccurate.

## Write multiple data points in one request

To write multiple lines in one request, each line of line protocol must be delimited by a new line (`\n`).

## Pre-process data before writing

Pre-processing data in your write workload can help you avoid [write failures](/influxdb3/cloud-dedicated/write-data/troubleshoot/#troubleshoot-failures) due to schema conflicts or resource use.
For example, if you have many devices that write to the same measurement, and some devices use different data types for the same field, then you might want to generate an alert or convert field data to fit your schema before you send the data to InfluxDB.

With [Telegraf](/telegraf/v1/), you can process data from other services and files and then write it to InfluxDB.
In addition to processing data with Telegraf's included plugins, you can use the [Execd processor plugin](/telegraf/v1/plugins/#processor-execd) to integrate your own code and external applications.

The following examples show how to [configure the Telegraf agent](/telegraf/v1/configuration) and [plugins](/telegraf/v1/plugins/) to optimize writes.
The examples use the [File input plugin](/telegraf/v1/plugins/#input-file) to read data from a file
and use the [InfluxDB v2 output plugin](/telegraf/v1/plugins/#input-influxdb) to write data to a database, but you can use any input and output plugin.

### Prerequisites

[Install Telegraf](/telegraf/v1/install/) if you haven't already.

### Filter data from a batch

Use Telegraf and metric filtering to filter data before writing it to InfluxDB.

Configure [metric filters](/telegraf/v1/configuration/#filters) to retain or remove data elements (before processor and aggregator plugins run).

1.  Enter the following command to create a Telegraf configuration that parses system usage data, removes the specified fields and tags, and then writes the data to InfluxDB:

    <!--pytest-codeblocks:cont-->

    {{< code-placeholders "DATABASE_NAME|DATABASE_TOKEN" >}}

```sh
cat <<EOF >> ./telegraf.conf
  [[inputs.cpu]]
    # Remove the specified fields from points.
    fieldpass = ["usage_system", "usage_idle"]
    # Remove the specified tags from points.
    tagexclude = ["host"]
  [[outputs.influxdb_v2]]
    urls = ["https://{{< influxdb/host >}}"]
    token = "DATABASE_TOKEN"
    organization = ""
    bucket = "DATABASE_NAME"
EOF
```

   {{< /code-placeholders >}}

    Replace the following:

    - {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/cloud-dedicated/admin/databases/) to write data to
    - {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens) with _write_ access to the specified database.
      _Store this in a secret store or environment variable to avoid exposing the raw token string._

2.  To test the input and processor, enter the following command:

    <!--pytest-codeblocks:cont-->

```sh
telegraf --test --config telegraf.conf
```

The output is similar to the following.
For each row of input data, the filters pass the metric name, tags, specified fields, and timestamp.

```text
> cpu,cpu=cpu0 usage_idle=100,usage_system=0 1702067201000000000
...
> cpu,cpu=cpu-total usage_idle=99.80198019802448,usage_system=0.1980198019802045 1702067201000000000
```

### Coerce data types to avoid rejected point errors

Use Telegraf and the [Converter processor plugin](/telegraf/v1/plugins/#processor-converter) to convert field data types to fit your schema.

For example, if you write the sample data in
[Get started home sensor data](/influxdb3/cloud-dedicated/reference/sample-data/#get-started-home-sensor-data) to a database, and then try to write the following batch to the same measurement:

```text
home,room=Kitchen temp=23.1,hum=36.6,co=22.1 1641063600
home,room=Living\ Room temp=22i,hum=36.4,co=17i 1641067200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200
```

InfluxDB expects `co` to contain an integer value and rejects points with `co` floating-point decimal (`22.1`) values.
To avoid the error, configure Telegraf to convert fields to the data types in your schema columns.

The following example converts the `temp`, `hum`, and `co` fields to fit the [sample data](/influxdb3/cloud-dedicated/reference/sample-data/#get-started-home-sensor-data) schema:

<!--before-test
```sh
curl -s "https://{{< influxdb/host >}}/api/v2/write?bucket=DATABASE_NAME&precision=s" \
  --header "Authorization: Token DATABASE_TOKEN" \
  --header "Content-type: text/plain; charset=utf-8" \
  --header "Accept: application/json" \
  --data-binary "
    home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600
    home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1641067200
    home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200"
```
-->

1. In your terminal, enter the following command to create the sample data file:

   <!--pytest-codeblocks:cont-->

   ```sh
   cat <<EOF > ./home.lp
   home,room=Kitchen temp=23.1,hum=36.6,co=22.1 1641063600
   home,room=Living\ Room temp=22i,hum=36.4,co=17i 1641067200
   home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200
   EOF
   ```

2. Enter the following command to create a Telegraf configuration that parses the sample data, converts the field values to the specified data types, and then writes the data to InfluxDB:

    <!--pytest-codeblocks:cont-->

    {{< code-placeholders "DATABASE_NAME|DATABASE_TOKEN" >}}

   ```sh
   cat <<EOF > ./telegraf.conf
   [[inputs.file]]
     ## For each interval, parse data from files in the list.
     files = ["home.lp"]
     influx_timestamp_precision = "1s"
     precision = "1s"
     tagexclude = ["host"]
   [[processors.converter]]
     [processors.converter.fields]
       ## A data type and a list of fields to convert to the data type.
       float = ["temp", "hum"]
       integer = ["co"]
   [[outputs.influxdb_v2]]
     ## InfluxDB v2 API credentials and the database to write to.
     urls = ["https://{{< influxdb/host >}}"]
     token = "DATABASE_TOKEN"
     organization = ""
     bucket = "DATABASE_NAME"
   EOF
   ```

    {{< /code-placeholders >}}

    Replace the following:

    - {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/cloud-dedicated/admin/databases/) to write data to
    - {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens) with _write_ access to the specified database.
      _Store this in a secret store or environment variable to avoid exposing the raw token string._

3.  To test the input and processor, enter the following command:

    <!--pytest-codeblocks:cont-->

    ```bash
    telegraf --test --config telegraf.conf
    ```

    Telegraf outputs the following to stdout, and then exits:

    <!--pytest-codeblocks:expected-output-->

    ```
    > home,room=Kitchen co=22i,hum=36.6,temp=23.1 1641063600000000000
    > home,room=Living\ Room co=17i,hum=36.4,temp=22 1641067200000000000
    > home,room=Kitchen co=26i,hum=36.5,temp=22.7 1641067200000000000
    ```

    <!-- hidden-test >

    ```bash
    # Run once and exit.
    telegraf --once --config telegraf.conf
    ```
    -->

### Merge lines to optimize memory and bandwidth

Use Telegraf and the [Merge aggregator plugin](/telegraf/v1/plugins/#aggregator-merge) to merge points that share the same measurement, tag set, and timestamp.

The following example creates sample data for two series (the combination of measurement, tag set, and timestamp), and then merges points in each series:

1.  In your terminal, enter the following command to create the sample data file and calculate the number of seconds between the earliest timestamp and _now_.
    The command assigns the calculated value to a `grace_duration` variable that you'll use in the next step.

    ```bash
    cat <<EOF > ./home.lp
    home,room=Kitchen temp=23.1 1641063600
    home,room=Kitchen hum=36.6 1641063600
    home,room=Kitchen co=22i 1641063600
    home,room=Living\ Room temp=22.7 1641063600
    home,room=Living\ Room hum=36.4 1641063600
    home,room=Living\ Room co=17i 1641063600
    EOF
    grace_duration="$(($(date +%s)-1641063000))s"
    ```

2.  Enter the following command to configure Telegraf to parse the file, merge the points, and write the data to InfluxDB--specifically, the configuration sets the following properties:

    - `influx_timestamp_precision`: for parsers, specifies the timestamp precision in the input data
    - Optional: `aggregators.merge.grace` extends the duration for merging points.
      To ensure the sample data is included, the configuration uses the calculated variable from the preceding step.

    <!--pytest-codeblocks:cont-->
    {{< code-placeholders "DATABASE_NAME|DATABASE_TOKEN" >}}

  ```bash
  cat <<EOF > ./telegraf.conf
  # Parse metrics from a file
  [[inputs.file]]
    ## A list of files to parse during each interval.
    files = ["home.lp"]
    ## The precision of timestamps in your data.
    influx_timestamp_precision = "1s"
    tagexclude = ["host"]
  # Merge separate metrics that share a series key
  [[aggregators.merge]]
    grace = "$grace_duration"
    ## If true, drops the original metric.
    drop_original = true
  # Writes metrics as line protocol to the InfluxDB v2 API
  [[outputs.influxdb_v2]]
    ## InfluxDB v2 API credentials and the database to write data to.
    urls = ["https://{{< influxdb/host >}}"]
    token = "DATABASE_TOKEN"
    organization = ""
    bucket = "DATABASE_NAME"
  EOF
  ```

    {{< /code-placeholders >}}

    Replace the following:

    - {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/cloud-dedicated/admin/databases/) to write data to
    - {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens) with _write_ access to the specified database.
      _Store this in a secret store or environment variable to avoid exposing the raw token string._

3.  To test the input and aggregator, enter the following command:

    <!--pytest-codeblocks:cont-->

    ```bash
    telegraf --test --config telegraf.conf
    ```

    Telegraf outputs the following to stdout, and then exits:

    <!--pytest-codeblocks:expected-output-->

    ```
    > home,room=Kitchen co=22i,hum=36.6,temp=23.1 1641063600000000000
    > home,room=Living\ Room co=17i,hum=36.4,temp=22.7 1641063600000000000
    ```

    <!-- hidden-test >

    ```bash
    # Run once and exit.
    telegraf --once --config telegraf.conf
    ```
    -->


### Avoid sending duplicate data

When writing duplicate points (points with the same timestamp and tag set),
InfluxDB deduplicates the data by creating a union of the duplicate points.
Deduplicating your data can reduce your write payload size and resource usage.

> [!Important]
> #### Write ordering for duplicate points
>
> InfluxDB attempts to honor write ordering for duplicate points, with the most
> recently written point taking precedence. However, when data is flushed from
> the in-memory buffer to Parquet files—typically every 15 minutes, but
> sometimes sooner—this ordering is not guaranteed if duplicate points are flushed
> at the same time. As a result, the last written duplicate point may not always
> be retained in storage.
>
> For recommended patterns and anti-patterns to avoid, see
> [Duplicate points](/influxdb3/cloud-dedicated/reference/syntax/line-protocol/#duplicate-points)
> in the line protocol reference.

Use Telegraf and the [Dedup processor plugin](/telegraf/v1/plugins/#processor-dedup)
to filter data whose field values are exact repetitions of previous values.

The following example shows how to use Telegraf to remove points that repeat field values, and then write the data to InfluxDB:

1.  In your terminal, enter the following command to create the sample data file and calculate the number of seconds between the earliest timestamp and _now_.
    The command assigns the calculated value to a `dedup_duration` variable that you'll use in the next step.

    ```bash
    cat <<EOF > ./home.lp
    home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600
    home,room=Living\ Room temp=22.5,hum=36.4,co=17i 1641063600
    home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641063605
    home,room=Living\ Room temp=22.5,hum=36.4,co=17i 1641063605
    home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063610
    home,room=Living\ Room temp=23.0,hum=36.4,co=17i 1641063610
    EOF
    dedup_duration="$(($(date +%s)-1641063000))s"
    ```

2.  Enter the following command to configure Telegraf to parse the file, drop duplicate points, and write the data to InfluxDB--specifically, the sample configuration sets the following:

    - `influx_timestamp_precision`: for parsers, specifies the timestamp precision in the input data
    - `processors.dedup`: configures the Dedup processor plugin
    - Optional: `processors.dedup.dedup_interval`. Points in the range `dedup_interval` _to now_ are considered for removal.
      To ensure the sample data is included, the configuration uses the calculated variable from the preceding step.

    <!--pytest-codeblocks:cont-->

    {{< code-placeholders "DATABASE_NAME|DATABASE_TOKEN" >}}
  ```bash
  cat <<EOF > ./telegraf.conf
  # Parse metrics from a file
  [[inputs.file]]
    ## A list of files to parse during each interval.
    files = ["home.lp"]
    ## The precision of timestamps in your data.
    influx_timestamp_precision = "1s"
    tagexclude = ["host"]
  # Filter metrics that repeat previous field values
  [[processors.dedup]]
    ## Drops duplicates within the specified duration
    dedup_interval = "$dedup_duration"
  # Writes metrics as line protocol to the InfluxDB v2 API
  [[outputs.influxdb_v2]]
    ## InfluxDB v2 API credentials and the database to write data to.
    urls = ["https://{{< influxdb/host >}}"]
    token = "DATABASE_TOKEN"
    organization = ""
    bucket = "DATABASE_NAME"
  EOF
  ```

    {{< /code-placeholders >}}

    Replace the following:

    - {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/cloud-dedicated/admin/databases/) to write data to
    - {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens) with _write_ access to the specified database.
      _Store this in a secret store or environment variable to avoid exposing the raw token string._

3.  To test the input and processor, enter the following command:

    <!--pytest-codeblocks:cont-->

    ```bash
    telegraf --test --config telegraf.conf
    ```

    Telegraf outputs the following to stdout, and then exits:

    <!--pytest-codeblocks:expected-output-->

    ```
    > home,room=Kitchen co=22i,hum=36.6,temp=23.1 1641063600000000000
    > home,room=Living\ Room co=17i,hum=36.4,temp=22.5 1641063600000000000
    > home,room=Kitchen co=26i,hum=36.5,temp=22.7 1641063605000000000
    > home,room=Kitchen co=22i,hum=36.6,temp=23.1 1641063610000000000
    > home,room=Living\ Room co=17i,hum=36.4,temp=23 1641063610000000000
    ```

    <!-- hidden-test >

    ```bash
    # Run once and exit.
    telegraf --once --config telegraf.conf
    ```
    -->

### Run custom preprocessing code

Use Telegraf and the [Execd processor plugin](/telegraf/v1/plugins/#processor-execd) to execute code external to Telegraf and then write the processed data.
The Execd plugin expects line protocol data in stdin, passes the data to the configured executable, and then outputs line protocol to stdout.

The following example shows how to use Telegraf to execute Go code for processing metrics and then write the output to InfluxDB.
The Go `multiplier.go` sample code does the following:

   1. Imports `influx` parser and serializer plugins from Telegraf.
   2. Parses each line of data into a Telegraf metric.
   3. If the metric contains a `count` field, multiplies the field value by `2`; otherwise, prints a message to stderr and exits.

1.  In your editor, enter the following sample code and save the file as `multiplier.go`:

    ```go
    package main

    import (
        "fmt"
        "os"

        "github.com/influxdata/telegraf/plugins/parsers/influx"
        influxSerializer "github.com/influxdata/telegraf/plugins/serializers/influx"
    )

    func main() {
        parser := influx.NewStreamParser(os.Stdin)
        serializer := influxSerializer.Serializer{}
        if err := serializer.Init(); err != nil {
            fmt.Fprintf(os.Stderr, "serializer init failed: %v\n", err)
            os.Exit(1)
        }

        for {
            metric, err := parser.Next()
            if err != nil {
                if err == influx.EOF {
                    return // stream ended
                }
                if parseErr, isParseError := err.(*influx.ParseError); isParseError {
                    fmt.Fprintf(os.Stderr, "parse ERR %v\n", parseErr)
                    os.Exit(1)
                }
                fmt.Fprintf(os.Stderr, "ERR %v\n", err)
                os.Exit(1)
            }

            c, found := metric.GetField("count")
            if !found {
                fmt.Fprintf(os.Stderr, "metric has no count field\n")
                os.Exit(1)
            }
            switch t := c.(type) {
            case float64:
                t *= 2
                metric.AddField("count", t)
            case int64:
                t *= 2
                metric.AddField("count", t)
            default:
                fmt.Fprintf(os.Stderr, "count is not an unknown type, it's a %T\n", c)
                os.Exit(1)
            }
            b, err := serializer.Serialize(metric)
            if err != nil {
                fmt.Fprintf(os.Stderr, "ERR %v\n", err)
                os.Exit(1)
            }
            fmt.Fprint(os.Stdout, string(b))
        }
    }
    ```

    <!-- hidden-test
    ```bash
    cat <<EOF > ./multiplier.go
    package main

    import (
        "fmt"
        "os"
        "github.com/influxdata/telegraf/plugins/parsers/influx"
        influxSerializer "github.com/influxdata/telegraf/plugins/serializers/influx"
    )

    func main() {
        parser := influx.NewStreamParser(os.Stdin)
        serializer := influxSerializer.Serializer{}
        if err := serializer.Init(); err != nil {
            fmt.Fprintf(os.Stderr, "serializer init failed: %v\n", err)
            os.Exit(1)
        }

        for {
            metric, err := parser.Next()
            if err != nil {
                if err == influx.EOF {
                    return // stream ended
                }
                if parseErr, isParseError := err.(*influx.ParseError); isParseError {
                    fmt.Fprintf(os.Stderr, "parse ERR %v\n", parseErr)
                    os.Exit(1)
                }
                fmt.Fprintf(os.Stderr, "ERR %v\n", err)
                os.Exit(1)
            }

            c, found := metric.GetField("count")
            if !found {
                fmt.Fprintf(os.Stderr, "metric has no count field\n")
                os.Exit(1)
            }
            switch t := c.(type) {
            case float64:
                t *= 2
                metric.AddField("count", t)
            case int64:
                t *= 2
                metric.AddField("count", t)
            default:
                fmt.Fprintf(os.Stderr, "count is not an unknown type, it's a %T\n", c)
                os.Exit(1)
            }
            b, err := serializer.Serialize(metric)
            if err != nil {
                fmt.Fprintf(os.Stderr, "ERR %v\n", err)
                os.Exit(1)
            }
            fmt.Fprint(os.Stdout, string(b))
        }
    }
    EOF
    ```
    -->

2.  Initialize the module and install dependencies:

    <!--pytest-codeblocks:cont-->

    ```bash
    go mod init processlp
    go mod tidy
    ```

3.  In your terminal, enter the following command to create the sample data file:

    <!--pytest-codeblocks:cont-->

    ```bash
    cat <<EOF > ./home.lp
    home,room=Kitchen temp=23.1,count=1 1641063600
    home,room=Living\ Room temp=22.7,count=1 1641063600
    home,room=Kitchen temp=23.1 1641063601
    home,room=Living\ Room temp=22.7 1641063601
    EOF
    ```

4.  Enter the following command to configure Telegraf to parse the file, execute the Go binary, and write the data--specifically, the sample configuration sets the following:

    - `influx_timestamp_precision`: for parsers, specifies the timestamp precision in the input data
    - `processors.execd`: configures the Execd plugin
    - `processors.execd.command`: sets the executable and arguments for Execd to run

    <!--pytest-codeblocks:cont-->

    {{< code-placeholders "DATABASE_NAME|DATABASE_TOKEN" >}}
  ```bash
  cat <<EOF > ./telegraf.conf
  # Parse metrics from a file
  [[inputs.file]]
    ## A list of files to parse during each interval.
    files = ["home.lp"]
    ## The precision of timestamps in your data.
    influx_timestamp_precision = "1s"
    tagexclude = ["host"]
  # Filter metrics that repeat previous field values
  [[processors.execd]]
    ## A list that contains the executable command and arguments to run as a daemon.
    command = ["go", "run", "multiplier.go"]
  # Writes metrics as line protocol to the InfluxDB v2 API
  [[outputs.influxdb_v2]]
    ## InfluxDB v2 API credentials and the database to write data to.
    urls = ["https://{{< influxdb/host >}}"]
    token = "DATABASE_TOKEN"
    organization = ""
    bucket = "DATABASE_NAME"
  EOF
  ```

    {{< /code-placeholders >}}

    Replace the following:

    - {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/cloud-dedicated/admin/databases/) to write data to
    - {{% code-placeholder-key %}}`DATABASE_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens) with _write_ access to the specified database.
      _Store this in a secret store or environment variable to avoid exposing the raw token string._

5.  To test the input and processor, enter the following command:

    <!--pytest-codeblocks:cont-->

    ```bash
    telegraf --test --config telegraf.conf
    ```

    Telegraf outputs the following to stdout, and then exits:

    <!--pytest-codeblocks:expected-output-->

    ```
    > home,room=Kitchen count=2,temp=23.1 1641063600000000000
    > home,room=Living\ Room count=2,temp=22.7 1641063600000000000
    ```

   <!-- hidden-test >
   ```bash
   # Run once and exit.
   telegraf --once --config telegraf.conf
   ```
   -->
