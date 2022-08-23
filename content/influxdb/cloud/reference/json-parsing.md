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

Use the following examples to help you set up parsing rules for [native subscriptions](/influxdb/cloud/write-data/no-code/native-subscriptions).

## Example simple MQTT message in JSON format

```js
{
"device_type":"temperature_sensor",
"device_id":2036,
"model_id":"KN24683",
 "temperature":25.0,
 "time":1653998899010000000,
"error_state":"in_error"

}
```

JSON paths start with a “$.” In the above example, all of the values are at the root level of the JSON, so the JSON paths for these elements are very simple:

- Measurement: $.device_type
- Timestamp: $.time
- Tag: $.device_id
- Field 1: $.temperature
- Field 2: $.error_state


## Example nested MQTT message in JSON format 

```js
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
In this example, the JSON path to the measurement would be `$.device_information.device_type`

The JSON path to the tag would be `$device_information.device_id`.
