---
title: OpenTSDB Telnet "PUT" API input data format
list_title: OpenTSDB Telnet PUT API
description: 
  Use the `opentsdb` data format to parse OpenTSDB Telnet `PUT` API data into Telegraf metrics.
menu:
  telegraf_v1_ref:
     name: OpenTSDB
     weight: 10
     parent: Input data formats
metadata: []
---

Use the `opentsdb` data format to parse [OpenTSDB Telnet `PUT` API](http://opentsdb.net/docs/build/html/api_telnet/put.html) data into
Telegraf metrics. There are no additional configuration options for OpenTSDB.

For more detail on the format, see:

- [OpenTSDB Telnet "PUT" API guide](http://opentsdb.net/docs/build/html/api_telnet/put.html)
- [OpenTSDB data specification](http://opentsdb.net/docs/build/html/user_guide/writing/index.html#data-specification)

## Configuration

```toml
[[inputs.file]]
  files = ["example"]

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ##   https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "opentsdb"
```

## Example

```opentsdb
put sys.cpu.user 1356998400 42.5 host=webserver01 cpu=0
```
