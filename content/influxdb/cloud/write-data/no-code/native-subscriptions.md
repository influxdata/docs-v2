---
title: Set up native MQTT subscriptions
weight: 102
aliases:
  - /influxdb/cloud/write-data/no-code/load-data/
description: >
  Use native subscriptions to ingest data.
menu:
  influxdb_cloud:
    name: Native MQTT subscriptions
    parent: Write data
influxdb/v2.0/tags: [mqtt, native subscription]
---

{{% note %}}
This feature is available with usage-based plans only. For more information, see [InfluxDB Cloud Plans](/influxdb/cloud/account-management/pricing-plans/).
{{% /note %}}

To ingest MQTT (Message Queuing Telemetry Transport) data into InfluxDB, do the following to set up a native subscription:

1. [Subscribe to an MQTT topic](#subscribe-to-an-mqtt-topic) in InfluxDB Cloud by configuring an MQTT broker, and specifying the topic(s) to subscribe to.
2. [Define parsing rules](#define-parsing-rules) for JSON or regex data (line protocol requires no configuration).

{{% note %}}
For troubleshooting help, see [Troubleshoot MQTT ingest errors](/influxdb/cloud/write-data/troubleshoot/#troubleshoot-mqtt-ingest-errors/).
{{% /note %}}

#### Subscribe to an MQTT topic

1. In the navigation menu on the left, click **Load Data** > **Native Subscriptions**.

    {{< nav-icon "data" >}}

2. Click **+ Create Subscription**.
3. On the **Setting Up - MQTT Subscriber** page, under **Connect to Broker**, enter the following:
   - Subscription Name
   - Description (optional)
   - Protocol
   - Hostname or IP address (hostname or URL of the MQTT broker)
   - Port (TCP/IP port number the MQTT broker uses)
   - Security details. Choose one of the following: 
      - **None**
      - **Basic** (username/password)
      - **Certificate**

4. Under **Subscribe to a topic**, in the **Topic** field, enter the MQTT topic name to subscribe to. Note, MQTT brokers typically support wildcard subscriptions with the wildcard characters `+` and  `#`. 

   - To subscribe to all topics in a directory, use `+`. For example, if an `iotdevices` directory includes two directories called `asia` and `europe`, to subscribe to a `sensor` topic in either directory, use `iotdevices/+/sensors` to subscribe to `iotdevices/asia/sensors`, and `iotdevices/europe/sensors`.
   - To subscribe to all topics in a directory, use `#`. For example, `iotdevices/#` subscribes to all topics in the  `iotdevices` directory. For more information about MQTT subscriptions and wildcards, see [the MQTT specification for Topic Names and Topic Filters](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901241).

5. Under **Write Destination**, select an existing InfluxDB bucket to write data to or click **+ Create bucket**. For more information, see [Create a bucket](/influxdb/cloud/organizations/buckets/create-bucket/).
6. Click **Save Subscription** to save and start running the MQTT subscription. 

#### Define parsing rules

{{% note %}}
JSON parsing is faster and more efficient than string parsing. We recommend using JSON parsing when your MQTT messages are in JSON format. For examples, see [JSON parsing examples](/influxdb/cloud/reference/json-parsing/).
{{% /note %}}

- Under **Define Data Parsing Rules**, select one of the following MQTT data formats:

   - **Line protocol** (no configuration required)
   - **JSON**. To define parsing rules to ingest JSON data, click the **JSON** tab below.
   - **String**. To define parsing rules to ingest String data, click the **String** tab below.

{{< tabs-wrapper >}}
{{% tabs %}}

[Line protocol](#)
[JSON](#)
[String](#)

{{% /tabs %}}

<!-------------------------------- BEGIN Line protocol -------------------------------->
{{% tab-content %}}
Use line protocol to write data into InfluxDB. Line protocol doesn't require any parsing or configuration.

- Select a **Timestamp precision** from the dropdown menu:
   - **MS**: Milliseconds
   - **S**: Seconds
   - **US**: Microseconds
   - **NS**: Nanoseconds

{{% /tab-content %}}

<!-------------------------------- BEGIN JSON -------------------------------->
{{% tab-content %}}

To associate **JSON** key-value pairs with **InfluxDB elements** (measurements, timestamps, fields, or tags) using parsing rules, complete the following steps:

{{< expand-wrapper >}}
{{% expand "Example JSON" %}}
```json
{
   "device_type":"temperature_sensor",
   "device_id":2036,
   "model_id":"KN24683",
   "temperature":25.0,
   "time":1653998899010000000,
   "error_state":"in_error"
}
```
{{% /expand %}}
{{< /expand-wrapper >}}

1. On the **Setting Up - MQTT Connector** page, under **Data Format**, select the **JSON** format:

2. (Optional) In the **JSON path to timestamp** field, specify the path in the
   MQTT message to the JSON key that holds the timestamp.
   For the [example above](#example-json), use `$.time`.
   Otherwise, InfluxDB automatically assigns a timestamp when messages are ingested into InfluxDB.
  
      ***Important***: *Configure the timestamp format that **matches the format** in your messages.*

3. Under **Measurement**, do one of the following:

   - **Use a JSON path to identify the measurement name**:
      
      1. Select the **JSON Path** {{< icon "toggle-off" >}} toggle.
      2. Enter the **JSON path** (starting with `$.`) to assign the InfluxDB measurement key.
         For the [example above](#example-json), enter `$.device_type`.

   - **Explicitly set the measurement name**:

      1. Select the {{< icon "toggle" >}} **Name** toggle.
      2. Enter a measurement name.

4. Select the **Data Type** for the measurement.
5. Specify the JSON paths to **tag** and **field** names as needed, and then
   select the **data type** for the tag or field. At least one field is required.
   For the [example above](#example-json), add fields with the JSON paths
   `$.temperature` and `$.error_state` and tags with the paths `$.device_id` and `$.model_id`.

{{% note %}}
The JSON parser supports JSON paths with arrays.
For example, `$.device_information.errors_encountered[0].error_number`.
{{% /note %}}

{{% /tab-content %}}

<!-------------------------------- BEGIN String -------------------------------->
{{% tab-content %}}

To associate **String** key-value pairs with **InfluxDB elements** (measurements, timestamps, fields, or tags),
Use regular expressions to identify each element in a string.

{{% note %}}
#### Parse with regular expressions

InfluxDB Native Subscriptions use Java-flavored regular expression patterns 
to identify InfluxDB elements in a string.
Parsing rules only support finding **one value at a time**.
{{% /note %}}

Complete the following steps:

{{< expand-wrapper >}}
{{% expand "Example string" %}}
```string
device_type=temperature_sensor
device_id=2036
model_id=KN24683
temperature=25.0
time=1653998899010000000
error_state=in_error
```
{{% /expand %}}
{{< /expand-wrapper >}}

1. On the **Setting Up - MQTT Connector** page, under **Data Format**, select the **String** format.

2. (Optional) In the **Regex pattern to find timestamp** field, enter the regex
   (regular expression) to find the timestamp in the MQTT message.
   Otherwise, InfluxDB automatically assigns a timestamp when messages are ingested into InfluxDB.

   For the [example above](#example-string), use `time=([\s\S]*?)\n` to capture
   everything between `time=` and the next newline (`\n`).

   ***Important***: *Configure the timestamp format that **matches the format** in your messages.*

3. Under **Measurement**, do one of the following:

   - **Use a regular expression to identify the measurement name**:
      
      1. Select the **Regex** {{< icon "toggle-off" >}} toggle.
      2. Enter a regular expression to identify the measurement name.
         For the [example above](#example-string), use `device_type=([\s\S]*?)\n`
         to capture everything between `device_type=` and the next newline (`\n`)
         In this case the measurement would be `temperature_sensor`.

   - **Explicitly set the measurement name**:

      1. Select the {{< icon "toggle" >}} **Name** toggle.
      2. Enter a measurement name.

4. Enter **Tag** and **Field**. At least one field is required. For tag and field names,
   use the regex to find the tag or field name, and what to capture.
   For the [example above](#example-string) use `device_id=(\d{4})` to
   capture the 4 digits after `device_id=`.
  
{{% note %}}
#### All fields are written as strings
When parsing **field values** from a string, the regular expression returns
a string and the field is written to InfluxDB as a string.
To cast field values to other data types, use
[type conversion functions](/{{< latest "flux" >}}/function-types/#type-conversions)
when querying the data.
{{% /note %}}

{{% /tab-content %}}

{{< /tabs-wrapper >}}
