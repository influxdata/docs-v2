---
title: Optimize writes to InfluxDB
description: >
  Simple tips to optimize performance and system overhead when writing data to
  InfluxDB Cloud Serverless.
weight: 203
menu:
  influxdb_cloud_serverless:
    name: Optimize writes
    parent: write-best-practices
influxdb/cloud/tags: [best practices, write]
related:
  - /resources/videos/ingest-data/, How to Ingest Data in InfluxDB (Video)
---

Use these tips to optimize performance and system overhead when writing data to InfluxDB.

- [Batch writes](#batch-writes)
- [Sort tags by key](#sort-tags-by-key)
- [Use the coarsest time precision possible](#use-the-coarsest-time-precision-possible)
- [Use gzip compression](#use-gzip-compression)
- [Synchronize hosts with NTP](#synchronize-hosts-with-ntp)
- [Write multiple data points in one request](#write-multiple-data-points-in-one-request)

{{% note %}}
The following tools write to InfluxDB and employ _most_ write optimizations by default:

- [`influx` CLI](/influxdb/cloud-serverless/reference/cli/influx/write/)
- [Telegraf](/influxdb/cloud-serverless/write-data/use-telegraf/)
- [InfluxDB client libraries](/influxdb/cloud-serverless/reference/client-libraries/)
{{% /note %}}

## Batch writes

Write data in batches to minimize network overhead when writing data to InfluxDB.

{{% note %}}
The optimal batch size is 10,000 lines of line protocol or 10 MBs,
whichever threshold is met first.
{{% /note %}}

## Sort tags by key

Before writing data points to InfluxDB, sort tags by key in lexicographic order.
_Verify sort results match results from the [Go `bytes.Compare` function](http://golang.org/pkg/bytes/#Compare)._

<!--pytest.mark.skip-->

```sh
# Line protocol example with unsorted tags
measurement,tagC=therefore,tagE=am,tagA=i,tagD=i,tagB=think fieldKey=fieldValue 1562020262

# Optimized line protocol example with tags sorted by key
measurement,tagA=i,tagB=think,tagC=therefore,tagD=i,tagE=am fieldKey=fieldValue 1562020262
```

## Use the coarsest time precision possible

By default, InfluxDB writes data in nanosecond precision.
However if your data isn't collected in nanoseconds, there is no need to write at that precision.
For better performance, use the coarsest precision possible for timestamps.

_Specify timestamp precision when [writing to InfluxDB](/influxdb/cloud-serverless/write-data/)._

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

Each [InfluxDB client library](/influxdb/cloud-serverless/reference/client-libraries/) provides
options for compressing write requests or enforces compression by default.
The method for enabling compression is different for each library.
For specific instructions, see the
[InfluxDB client libraries documentation](/influxdb/cloud-serverless/reference/client-libraries/).
{{% /tab-content %}}
{{% tab-content %}}

### Use gzip compression with the InfluxDB API

When using the InfluxDB API `/api/v2/write` endpoint to write data,
compress the data with `gzip` and set the `Content-Encoding` header to `gzip`.

{{% code-callout "Content-Encoding: gzip" "orange" %}}

```sh
echo "mem,host=host1 used_percent=23.43234543 1641024000
mem,host=host2 used_percent=26.81522361 1641027600
mem,host=host1 used_percent=22.52984738 1641031200
mem,host=host2 used_percent=27.18294630 1641034800" | gzip > system.gzip \

curl --request POST "https://cloud2.influxdata.com/api/v2/write?org=ORG_NAME&bucket=BUCKET_NAME&precision=s" \
  --header "Authorization: Token API_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --header "Content-Encoding: gzip" \
  --data-binary @system.gzip
```

{{% /code-callout %}}
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

Pre-processing data in your write workload can help you avoid [schema conflicts]() and exceeding [limits and quotas]().
For example, if you have many devices that write to the same measurement, and some devices use different data types for the same field, then you might want to generate an alert or convert field data to fit your schema before you send the data to InfluxDB.

With Telegraf, you can listen for input data, process it, and then write it to InfluxDB.
In addition to processing data with Telegraf's included plugins, you can use the Execd plugin to integrate your own code and external applications.

The following examples show how to [configure](/telegraf/v1/configuration) the Telegraf agent and [plugins](/telegraf/v1/plugins/) to optimize writes.
The examples use the [File input plugin](/telegraf/v1/plugins/#input-file) to read data from a file
and use the [InfluxDB v2 output plugin](/telegraf/v1/plugins/#input-influxdb) to write data to a bucket, but you can use any input and output plugin.

### Prerequisites

Follow the instructions to [install Telegraf]().

### Filter data from a batch

Use Telegraf and metric filtering to filter data before writing it to InfluxDB.

Configure [metric filters](/telegraf/v1/configuration/#filters) to retain or remove data elements (before processor and aggregator plugins run).

```sh
cat <<EOF >> ./telegraf.conf
  [[inputs.cpu]]
    # Remove the specified fields from points.
    fieldpass = ["usage_system", "usage_idle"]
    # Remove the specified tags from points.
    tagexclude = ["host"]
  [[outputs.influxdb_v2]]
    urls = ["HOST"]
    token = "API_TOKEN"
    organization = ""
    bucket = "BUCKET_NAME"
EOF
```

Replace the following:

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
[Get started home sensor data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data) to a bucket, and then try to write the following batch to the same measurement:

```text
home,room=Kitchen temp=23.1,hum=36.6,co=22.1 1641063600
home,room=Living\ Room temp=22i,hum=36.4,co=17i 1641067200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200
```

InfluxDB expects `co` to contain an integer and rejects the point in which `co` contains a floating-point decimal (`22.1`).
To avoid the error, configure Telegraf to convert fields to the data types in your schema columns.

The following example converts the `temp`, `hum`, and `co` fields to fit the [sample data](/influxdb/cloud-serverless/reference/sample-data/#get-started-home-sensor-data) schema:

<!--before-test
```sh
(influx bucket create --name jason-test-create-bucket 2>/dev/null ||:) \
&& \
curl -s "https://{{< influxdb/host >}}/api/v2/write?bucket=BUCKET_NAME&precision=s" \
  --header "Authorization: Token API_TOKEN" \
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

2. Enter the following command to create a Telegraf configuration that parses the sample data, converts the field values to the specified data types, and then writes the data to stdout and a bucket:

   <!--pytest-codeblocks:cont-->

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
     ## InfluxDB v2 API credentials and the bucket to write data to.
     urls = ["https://{{< influxdb/host >}}"]
     token = "API_TOKEN"
     organization = ""
     bucket = "BUCKET_NAME"
   EOF
   ```

3. Enter the following command to run Telegraf for one interval and then exit:

   <!--pytest-codeblocks:cont-->

   ```sh
   # Run once and exit.
   telegraf --once --config telegraf.conf
   ```

   Telegraf writes the following lines:

   <!--pytest-codeblocks:cont-->

   <!--hidden-test
   ```sh
   telegraf --test --config telegraf.conf
   ```
   -->

   <!--pytest-codeblocks:expected-output-->

   ```
   > home,room=Kitchen co=22i,hum=36.6,temp=23.1 1641063600000000000
   > home,room=Living\ Room co=17i,hum=36.4,temp=22 1641067200000000000
   > home,room=Kitchen co=26i,hum=36.5,temp=22.7 1641067200000000000
   ```

### Merge lines to optimize memory and bandwidth

Use Telegraf and the [Merge aggregator plugin](/telegraf/v1/plugins/#aggregator-merge) to merge points that share the same measurement, tag set, and timestamp.

The following example creates sample data for two series (the combination of measurement, tag set, and timestamp), and then merges points in each series:

1. In your terminal, enter the following command to create the sample data file:

   ```bash
   cat <<EOF > ./home.lp
   home,room=Kitchen temp=23.1 1641063600
   home,room=Kitchen hum=36.6 1641063600
   home,room=Kitchen co=22i 1641063600
   home,room=Living\ Room temp=22.7 1641063600
   home,room=Living\ Room hum=36.4 1641063600
   home,room=Living\ Room co=17i 1641063600
   EOF
   grace_seconds=$(($(date +%s)-1641063000))
   grace="${grace_seconds}s"
   ```

2. Enter the following command to configure Telegraf to parse the file, merge the points, and write the data to a bucket. To merge series, you must specify the following in your Telegraf configuration:

   - the timestamp precision for your input data (for example, `influx_timestamp_precision` for line protocol)
   - Optional: `aggregators.merge.grace` to extend the window and allow more points to be merged. For demonstration purposes, the following example sets `grace` to a large duration to include the sample data timestamps.

   <!--pytest-codeblocks:cont-->

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
     grace = "$grace"
     ## If true, drops the original metric.
     drop_original = true
   # Writes metrics as line protocol to the InfluxDB v2 API
   [[outputs.influxdb_v2]]
     ## InfluxDB credentials and the bucket to write data to.
     urls = ["https://{{< influxdb/host >}}"]
     token = "API_TOKEN"
     organization = ""
     bucket = "BUCKET_NAME"
   EOF
   ```

3. Enter the following command to run Telegraf for one interval and then exit:

   <!--pytest-codeblocks:cont-->

   <!--before-test
   ```bash
   influx bucket create --name jason-test-create-bucket 2>/dev/null ||:
   ```
   -->

   <!--pytest-codeblocks:cont-->

   ```bash
   # Run once and exit.
   telegraf --once --config telegraf.conf
   ```

   Telegraf writes the following lines:

   <!--pytest-codeblocks:cont-->

   <!--hidden-test
   ```bash
   telegraf --test --config telegraf.conf
   ```
   -->

   <!--pytest-codeblocks:expected-output-->

   ```
   > home,room=Kitchen co=22i,hum=36.6,temp=23.1 1641063600000000000
   > home,room=Living\ Room co=17i,hum=36.4,temp=22.7 1641063600000000000
   ```

### Avoid sending duplicate data

Use Telegraf and the [Dedup processor plugin](/telegraf/v1/plugins/#processor-dedup) to filter data whose field values are exact repetitions of previous values.
Removing duplicate data can reduce your write payload size and resource usage.

The following example shows how to remove points that repeat values before writing them to InfluxDB:

1. In your terminal, enter the following command to create the sample data file:

   ```bash
   cat <<EOF > ./home.lp
   home,room=Kitchen co=22i,hum=36.6,temp=23.1 1641063600
   home,room=Kitchen co=22i,hum=36.6,temp=23.1 1641063601
   home,room=Living\ Room co=17i,hum=36.4,temp=22.7 1641063603
   EOF
   cp home.lp home_2.lp
   ```

2. Enter the following command to configure Telegraf to parse the file, drop points that repeat field values, and then write the data to a bucket. To merge series, you must specify the following in your Telegraf configuration:

   - the timestamp precision for your input data (for example, `influx_timestamp_precision` for line protocol)
   - Optional: `processors.dedup.dedup_interval` to specify the duration to consider for repeated field values.

   <!--pytest-codeblocks:cont-->

   ```bash
   cat <<EOF > ./telegraf.conf
   [agent]
     debug = true
   # Parse metrics from a file
   [[inputs.file]]
     ## A list of files to parse during each interval.
     files = ["home.lp", "home_2.lp"]
     ## The precision of timestamps in your data.
     influx_timestamp_precision = "1s"
     tagexclude = ["host"]
   # Filter metrics that repeat previous field values
   [[processors.dedup]]
     ## Drops duplicates within the specified duration
     dedup_interval = "600s"
   [[outputs.file]]
     files = ["stdout"]
   # Writes metrics as line protocol to the InfluxDB v2 API
   [[outputs.influxdb_v2]]
     ## InfluxDB credentials and the bucket to write data to.
     urls = ["https://{{< influxdb/host >}}"]
     token = "API_TOKEN"
     organization = ""
     bucket = "BUCKET_NAME"
   EOF
   ```

3. Enter the following command to run Telegraf for one interval and then exit:

   <!--pytest-codeblocks:cont-->

   <!--before-test
   ```bash
   influx bucket create --name jason-test-create-bucket 2>/dev/null ||:
   ```
   -->

   <!--pytest-codeblocks:cont-->

   ```bash
   # Run once and exit.
   # telegraf --once --config telegraf.conf
   ```

   Telegraf writes the following lines:

   <!--pytest-codeblocks:cont-->

   <!--hidden-test
   ```bash
   # --test is deterministic when writing field sequence to stdout,
   # whereas outputs.file reorders fields from one run to the next.
   telegraf --test --config telegraf.conf
   ```
   -->

   <!--pytest-codeblocks:expected-output-->

   ```
   > home,room=Kitchen co=22i,hum=36.6,temp=23.1 1641063600000000000
   > home,room=Living\ Room co=17i,hum=36.4,temp=22.7 1641063600000000000
   ```

### Run custom preprocessing code

Use Telegraf and the [Execd processor plugin](/telegraf/v1/plugins/#processor-execd) to execute code external to Telegraf and then write the processed data.
