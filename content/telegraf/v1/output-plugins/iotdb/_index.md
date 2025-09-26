---
description: "Telegraf plugin for sending metrics to Apache IoTDB"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference
    name: Apache IoTDB
    identifier: output-iotdb
tags: [Apache IoTDB, "output-plugins", "configuration", "datastore"]
introduced: "v1.24.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.1/plugins/outputs/iotdb/README.md, Apache IoTDB Plugin Source
---

# Apache IoTDB Output Plugin

This plugin writes metrics to an [Apache IoTDB](https://iotdb.apache.org) instance, a database
for the Internet of Things, supporting session connection and data insertion.

**Introduced in:** Telegraf v1.24.0
**Tags:** datastore
**OS support:** all

[iotdb]: https://iotdb.apache.org

## Getting started

Before using this plugin, please configure the IP address, port number,
user name, password and other information of the database server,
as well as some data type conversion, time unit and other configurations.

Please see the configuration section

IoTDB uses a tree model for metadata while Telegraf uses a tag model
(see [InfluxDB-Protocol Adapter](https://iotdb.apache.org/UserGuide/Master/API/InfluxDB-Protocol.html)).
There are two available options of converting tags, which are specified by
setting `convert_tags_to`:

- `fields`. Treat Tags as measurements. For each Key:Value in Tag,
convert them into Measurement, Value, DataType, which are supported in IoTDB.
- `device_id`, default option. Treat Tags as part of device id. Tags
constitute a subtree of `Name`.

For example, there is a metric:

```markdown
Name="root.sg.device", Tags={tag1="private", tag2="working"}, Fields={s1=100, s2="hello"}
```

- `fields`, result: `root.sg.device, s1=100, s2="hello", tag1="private", tag2="working"`
- `device_id`, result: `root.sg.device.private.working, s1=100, s2="hello"`

[InfluxDB-Protocol Adapter]: https://iotdb.apache.org/UserGuide/Master/API/InfluxDB-Protocol.html

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Secret-store support

This plugin supports secrets from secret-stores for the `username` and
`password` option.
See the [secret-store documentation](/telegraf/v1/configuration/#secret-store-secrets) for more details on how
to use them.

[SECRETSTORE]: ../../../docs/CONFIGURATION.md#secret-store-secrets

## Configuration

```toml @sample.conf
# Save metrics to an IoTDB Database
[[outputs.iotdb]]
  ## Configuration of IoTDB server connection
  host = "127.0.0.1"
  # port = "6667"

  ## Configuration of authentication
  # user = "root"
  # password = "root"

  ## Timeout to open a new session.
  ## A value of zero means no timeout.
  # timeout = "5s"

  ## Configuration of type conversion for 64-bit unsigned int
  ## IoTDB currently DOES NOT support unsigned integers (version 13.x).
  ## 32-bit unsigned integers are safely converted into 64-bit signed integers by the plugin,
  ## however, this is not true for 64-bit values in general as overflows may occur.
  ## The following setting allows to specify the handling of 64-bit unsigned integers.
  ## Available values are:
  ##   - "int64"       --  convert to 64-bit signed integers and accept overflows
  ##   - "int64_clip"  --  convert to 64-bit signed integers and clip the values on overflow to 9,223,372,036,854,775,807
  ##   - "text"        --  convert to the string representation of the value
  # uint64_conversion = "int64_clip"

  ## Configuration of TimeStamp
  ## TimeStamp is always saved in 64bits int. timestamp_precision specifies the unit of timestamp.
  ## Available value:
  ## "second", "millisecond", "microsecond", "nanosecond"(default)
  # timestamp_precision = "nanosecond"

  ## Handling of tags
  ## Tags are not fully supported by IoTDB.
  ## A guide with suggestions on how to handle tags can be found here:
  ##     https://iotdb.apache.org/UserGuide/Master/API/InfluxDB-Protocol.html
  ##
  ## Available values are:
  ##   - "fields"     --  convert tags to fields in the measurement
  ##   - "device_id"  --  attach tags to the device ID
  ##
  ## For Example, a metric named "root.sg.device" with the tags `tag1: "private"`  and  `tag2: "working"` and
  ##  fields `s1: 100`  and `s2: "hello"` will result in the following representations in IoTDB
  ##   - "fields"     --  root.sg.device, s1=100, s2="hello", tag1="private", tag2="working"
  ##   - "device_id"  --  root.sg.device.private.working, s1=100, s2="hello"
  # convert_tags_to = "device_id"

  ## Handling of unsupported characters
  ## Some characters in different versions of IoTDB are not supported in path name
  ## A guide with suggetions on valid paths can be found here:
  ## for iotdb 0.13.x           -> https://iotdb.apache.org/UserGuide/V0.13.x/Reference/Syntax-Conventions.html#identifiers
  ## for iotdb 1.x.x and above  -> https://iotdb.apache.org/UserGuide/V1.3.x/User-Manual/Syntax-Rule.html#identifier
  ##
  ## Available values are:
  ##   - "1.0", "1.1", "1.2", "1.3"  -- use backticks to enclose tags with forbidden characters
  ##                                    such as @$#:[]{}() and space
  ##   - "0.13"                      -- use backticks to enclose tags with forbidden characters
  ##                                    such as space
  ## Keep this section commented if you don't want to sanitize the path
  # sanitize_tag = "1.3"
```
