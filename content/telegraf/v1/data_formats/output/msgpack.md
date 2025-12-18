---
title: MessagePack output data format
list_title: MessagePack
description: Use the `msgpack` output data format (serializer) to convert Telegraf metrics into MessagePack format.
menu:
  telegraf_v1_ref:
    name: MessagePack
    weight: 10
    parent: Output data formats
    identifier: output-data-format-msgpack
---

The `msgpack` output data format (serializer) translates the Telegraf metric format to the [MessagePack](https://msgpack.org/) format. MessagePack is an efficient binary serialization format that lets you exchange data among multiple languages like JSON.

### Configuration

```toml
[[outputs.file]]
  ## Files to write to, "stdout" is a specially handled file.
  files = ["stdout", "/tmp/metrics.out"]

  ## Data format to output.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_OUTPUT.md
  data_format = "msgpack"
```


### Example output

Output of this format is MessagePack binary representation of metrics with a structure identical to the following JSON:

```json
{
   "name":"cpu",
   "time": <TIMESTAMP>, // https://github.com/msgpack/msgpack/blob/master/spec.md#timestamp-extension-type
   "tags":{
      "tag_1":"host01",
      ...
   },
   "fields":{
      "field_1":30,
      "field_2":true,
      "field_3":"field_value"
      "field_4":30.1
      ...
   }
}
```
