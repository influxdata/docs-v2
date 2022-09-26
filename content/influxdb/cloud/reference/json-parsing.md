---
title: JSON parsing examples
description: >
  Review example JSON parsing rules for native subscriptions.
menu:
  influxdb_cloud_ref:
    name: JSON parsing examples
weight: 8
influxdb/v2.0/tags: [mqtt]
related:
---

Use the following examples to help you set up JSON parsing rules using [JSON Path](https://jsonpath.com/) 
for [native subscriptions](/influxdb/cloud/write-data/no-code/native-subscriptions). All JSON paths start with a `$`.

## Example MQTT message in "flat" JSON format

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

With "flat" JSON, all values are at the root level (`$`) and are referenced with dot notation.

| InfluxDB Element | JSON Path       | Data Type | Parsed Result        |
| :--------------- | :-------------- | :-------- | :------------------- |
| Measurement      | `$.device_type` | String    | "temperature_sensor" |
| Timestamp        | `$.time`        | Timestamp | 1653998899010000000  |
| Tag              | `$.device_id`   | Integer   | 2036                 |
| Field 1          | `$.temperature` | Float     | 25.0                 |
| Field 2          | `$.error_state` | String    | "in_error"           |

## Example MQTT message with nested JSON objects 

```json
{
  "device_information": {
    "device_type":"temperature_sensor",
    "device_id":2036,
    "model_id":"KN24683"
  },
  "temperature":25.0,
  "time":165411795400000000,
  "error_state":"in_error"
}
```

| InfluxDB Element | JSON Path                          | Data Type | Parsed Result        |
| :--------------- | :--------------------------------- | :-------- | :------------------- |
| Measurement      | `$.device_information.device_type` | String    | "temperature_sensor" |
| Timestamp        | `$.time`                           | Timestamp | 1653998899010000000  |
| Tag              | `$.device_information.device_id`   | Integer   | 2036                 |
| Field 1          | `$.temperature`                    | Float     | 25.0                 |
| Field 2          | `$.error_state`                    | String    | "in_error"           |

## Example MQTT message with JSON arrays
Currently, there is limited support for working with key/value pairs that are held within 
a JSON array. Entire arrays cannot be loaded into a single field value, but if your messages 
have a fixed number of values in the array being passed, you can specify an array index number
in your JSON path.


```json
{
   "device_information":{
      "device_type":"temperature_sensor",
      "device_id":2309,
      "model_id":"KN24683"
   },
   "time":1653998899010000000,
   "temperature":25.0,
   "error_state":"in_error",
   "errors_encountered":[
      {
         "time_encountered":"2022:05:30:23:11",
         "error_number":403
      },
      {
         "time_encountered":"2022:06:01:12:15",
         "error_number":404
      }
   ]
}
```

| InfluxDB Element | JSON Path                               | Data Type | Parsed Result        |
| :--------------- | :-------------------------------------- | :-------- | :------------------- |
| Measurement      | `$.device_information.device_type`      | String    | "temperature_sensor" |
| Timestamp        | `$.time`                                | Timestamp | 1653998899010000000  |
| Tag              | `$.device_information.device_id`        | Integer   | 2036                 |
| Field 1          | `$.temperature`                         | Float     | 25.0                 |
| Field 2          | `$.error_state`                         | String    | "in_error"           |
| Field 3          | `$.errors_encountered.[0].error_number` | Integer   | 403                  |
| Field 4          | `$.errors_encountered.[1].error_number` | Integer   | 404                  |
