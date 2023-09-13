---
title: Nagios input data format
list_title: Nagios
description: Use the `nagios` input data format to parse the output of Nagios plugins into Telegraf metrics.
menu:
  telegraf_v1_ref:
    name: Nagios
    weight: 10
    parent: Input data formats
---

Use the `nagios` input data format to parse the output of
[Nagios plugins](https://www.nagios.org/downloads/nagios-plugins/) into
Telegraf metrics.

## Configuration

```toml
[[inputs.exec]]
  ## Commands array
  commands = ["/usr/lib/nagios/plugins/check_load -w 5,6,7 -c 7,8,9"]

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ##   https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "nagios"
```
