---
title: Avro input data format
list_title: Avro
description: Use the `avro` input data format to parse Avro binary or JSON data into Telegraf metrics.
menu:
  telegraf_1_27_ref:
    name: Avro
    weight: 10
    parent: Input data formats
metadata: [Avro Parser Plugin]
---

Use the `avro` input data format to parse binary or JSON [Avro](https://avro.apache.org/) message data into Telegraf metrics.

## Wire format

Avro messages should conform to [Wire Format](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html#wire-format) using the following byte-mapping:

| Bytes | Area       | Description                                      |
| ----- | ---------- | ------------------------------------------------ |
| 0     | Magic Byte | Confluent serialization format version number; currently always `0`. |
| 1-4   | Schema ID  | 4-byte schema ID as returned by Schema Registry. |
| 5-    | Data       | Serialized data.                                 |

{{% caption %}}
Source: [Confluent Documentation](https://docs.confluent.io/platform/current/schema-registry/fundamentals/serdes-develop/index.html#wire-format)
{{% /caption %}}

For more information about Avro schema and encodings, see the [specification](https://avro.apache.org/docs/current/specification/) in the Apache Avro documentation.

## Configuration

```toml
[[inputs.kafka_consumer]]
  ## Kafka brokers.
  brokers = ["localhost:9092"]

  ## Topics to consume.
  topics = ["telegraf"]

  ## Maximum length of a message to consume, in bytes (default 0/unlimited);
  ## larger messages are dropped
  max_message_len = 1000000

  ## Avro data format settings
  data_format = "avro"

  ## Avro message format
  ## Supported values are "binary" (default) and "json"
  # avro_format = "binary"

  ## Url of the schema registry; exactly one of schema registry and
  ## schema must be set
  avro_schema_registry = "http://localhost:8081"

  ## Schema string; exactly one of schema registry and schema must be set
  #avro_schema = '''
  #        {
  #          "type":"record",
  #          "name":"Value",
  #          "namespace":"com.example",
  #          "fields":[
  #              {
  #                  "name":"tag",
  #                  "type":"string"
  #              },
  #              {
  #                  "name":"field",
  #                  "type":"long"
  #              },
  #              {
  #                  "name":"timestamp",
  #                  "type":"long"
  #              }
  #          ]
  #      }
  #'''

  ## Measurement string; if not set, determine measurement name from
  ## schema (as "<namespace>.<name>")
  # avro_measurement = "ratings"

  ## Avro fields to be used as tags; optional.
  # avro_tags = ["CHANNEL", "CLUB_STATUS"]

  ## Avro fields to be used as fields; if empty, any Avro fields
  ## detected from the schema, not used as tags, will be used as
  ## measurement fields.
  # avro_fields = ["STARS"]

  ## Avro fields to be used as timestamp; if empty, current time will
  ## be used for the measurement timestamp.
  # avro_timestamp = ""
  ## If avro_timestamp is specified, avro_timestamp_format must be set
  ## to one of 'unix', 'unix_ms', 'unix_us', or 'unix_ns'
  # avro_timestamp_format = "unix"

  ## Used to separate parts of array structures.  As above, the default
  ## is the empty string, so a=["a", "b"] becomes a0="a", a1="b".
  ## If this were set to "_", then it would be a_0="a", a_1="b".
  # avro_field_separator = "_"

  ## Default values for given tags: optional
  # tags = { "application": "hermes", "region": "central" }
```
