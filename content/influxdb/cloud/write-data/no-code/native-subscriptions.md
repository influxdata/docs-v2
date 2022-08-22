---
title: Set up native subscriptions
weight: 101
description: >
  Use native subscriptions to ingest data.
menu:
  influxdb_cloud:
    name: Native subscriptions
    parent: Write data
influxdb/v2.0/tags: [mqtt]
---

To ingest MQTT (Message Queuing Telemetry Transport) data into InfluxDB, do the following to set up a native subscription:

1. [Subscribe to an MQTT topic](#subscribe-to-an-mqtt-topic) in InfluxDB Cloud by configuring an MQTT broker, and specifying the topic(s) to subscribe to.
2. [Define parsing rules](#define-parsing-rules) for JSON or regex data (line protocol requires no configuration).

{{% note %}}
For troubleshooting help, see [Troubleshoot MQTT ingest errors](/influxdb/cloud/write-data/troubleshoot/#troubleshoot-mqtt-ingest-errors/)
{{% /note %}}

#### Subscribe to an MQTT topic

1. In the navigation menu on the left, click **Load Data** > **Native Subscriptions**.

{{< nav-icon "data" >}}

2. Click **+ Create Subscription**.
3. On the **Setting Up - MQTT Subscriber** page, under **Connect to Broker**, enter the following:
   - Subscription Name
   - Description
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

#### Define parsing rules

{{% note %}}
JSON parsing is faster and more efficient than string parsing. We recommend using JSON parsing when your MQTT messages are in JSON format.
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

Select a **Timepstamp precision** from the dropdown menu:
   - **MS**: Milliseconds
   - **S**: Seconds
   - **US**: Microseconds
   - **NS**: Nanoseconds

{{% /tab-content %}}

<!-------------------------------- BEGIN JSON -------------------------------->
{{% tab-content %}}

Associate **JSON** key/value pairs with **InfluxDB elements** (measurements, timestamps, fields, or tags) using parsing rules. 

{{% expand "Example JSON" %}}
```
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

1. On the **Setting Up - MQTT Connector** page, under **Data Format**, do the following:

  1. (Optional) In the **JSON path to timestamp** field, specify the path in the MQTT message to the JSON key that holds the timestamp: for the example above, `"time":1653998899010000000`. Otherwise, InfluxDB automatically assigns a timestamp when messages are ingested into InfluxDB.

   {{% warn %}}
   **Important**: Configure the timestamp format that matches the format in your messages.
   {{% /warn %}}

2. Configure the JSON parsing rules: 
   1. Under **Measurement**, enter the **JSON path** (start with `$.`) to assign the InfluxDB measurement key. For the above example, enter `$.device_type`.
3. Select the **Data Type** for the measurement.
4. Specify the JSON paths to tag and field names as needed, and then select the data type for the tag or field. At least one field is required. For the above example, add fields with the JSON paths `$.temperature` and `$.error_state` and a tag with the path `$.error_state`.
Note that JSON paths with arrays are supported, for example, `$.device_information.errors_encountered[0].error_number`.


{{% /tab-content %}}

<!-------------------------------- BEGIN String -------------------------------->
{{% tab-content %}}

Associate **String** key/value pairs with **InfluxDB elements** (measurements, timestamps, fields, or tags).

1. On the **Setting Up - MQTT Connector** page, under **Data Format**, do the following:

  1. (Optional) In the **Regex pattern to find timestamp** field, enter the regex (regular expression) to find the timestamp in the MQTT message.  Otherwise, InfluxDB automatically assigns a timestamp when messages are ingested into InfluxDB.
  
      {{% note %}}
      **Note**: Parsing rules only support finding one value at a time.
      {{% /note %}}
      
      For example, if the timestamp string is `time=1653998899010000000`, use a regex to find the string you're looking for and capture the timestamp:
   - `time=([\s\S]*?)\n` (captures value after `=` until the EOL (end of line) is reached)
   - `time=([\s\S]*?),` (captures value after `=` until comma is reached)

   {{% warn %}}
   **Important**: Configure the timestamp format that matches the format in your messages.
   {{% /warn %}}

  2. Under **Measurement**, if the string is `device_type=temperature_sensor` use regex to find the measurement name. For example:
      - `device_type=([\s\S]*?)\n` captures the value after the `=` until the EOL (end of line) is reached), in this case the value would be `temperature_sensor`.
  3. Select the **Data Type** for the measurement.
  4. Enter **Tag** and **Field**. At least one field is required. For tag and field names, use the regex to find the tag or field name, and what to capture. For example:
     - `device_id=\d\d\d\d-([0-9][0-9][0-9][0-9])` (matches on the `device_id=` and also matches on the first four digits of the device id, and then captures the four digits.
  5. Select the **Data Type** for the tag or field.

{{% /tab-content %}}

{{< /tabs-wrapper >}}
