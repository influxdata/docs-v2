---
title: Graphite input data format
description: Use the Graphite data format to translate Graphite dot buckets directly into Telegraf measurement names, with a single value field, and without any tags.
menu:
  telegraf_1_26_ref:

    name: Graphite
    weight: 40
    parent: Input data formats
    aliases:
        - /telegraf/v1.26/data_formats/template-patterns/
---

The Graphite data format translates Graphite *dot* buckets directly into
Telegraf measurement names, with a single value field, and without any tags.
By default, the separator is left as `.`, but this can be changed using the
`separator` argument. For more advanced options, Telegraf supports specifying
[templates](#templates) to translate graphite buckets into Telegraf metrics.

## Configuration

```toml
[[inputs.exec]]
  ## Commands array
  commands = ["/tmp/test.sh", "/usr/bin/mycollector --foo=bar"]

  ## measurement name suffix (for separating different commands)
  name_suffix = "_mycollector"

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "graphite"

  ## This string will be used to join the matched values.
  separator = "_"

  ## Each template line requires a template pattern. It can have an optional
  ## filter before the template and separated by spaces. It can also have optional extra
  ## tags following the template. Multiple tags should be separated by commas and no spaces
  ## similar to the line protocol format. There can be only one default template.
  ## Templates support below format:
  ## 1. filter + template
  ## 2. filter + template + extra tag(s)
  ## 3. filter + template with field key
  ## 4. default template
  templates = [
    "*.app env.service.resource.measurement",
    "stats.* .host.measurement* region=eu-east,agent=sensu",
    "stats2.* .host.measurement.field",
    "measurement*"
  ]
```

## Templates

Template patterns are a mini language that describes how a dot-delimited
string should be mapped to and from [metrics](/telegraf/v1.26/concepts/metrics/).

A template has the following format:
```
"host.mytag.mytag.measurement.measurement.field*"
```

You can set the following keywords:

- `measurement`: Specifies that this section of the graphite bucket corresponds
to the measurement name. This can be specified multiple times.
- `field`: Specifies that this section of the graphite bucket corresponds
to the field name. This can be specified multiple times.
- `measurement*`: Specifies that all remaining elements of the graphite bucket
correspond to the measurement name.
- `field*`: Specifies that all remaining elements of the graphite bucket
correspond to the field name.

{{% note %}}
`field*` can't be used in conjunction with `measurement*`.
{{% /note %}}

Any part of the template that isn't a keyword is treated as a tag key, which can also be used multiple times.

### Examples

#### Measurement and tag templates

The most basic template is to specify a single transformation to apply to all
incoming metrics.

##### Template <!--This content is duplicated in /telegraf/v1.26/data_formats/input/graphite/-->

```toml
templates = [
    "region.region.measurement*"
]
```

##### Resulting transformation

```
us.west.cpu.load 100
=> cpu.load,region=us.west value=100
```

You can also specify multiple templates using [filters](#filter-templates).

```toml
templates = [
    "*.*.* region.region.measurement", # <- all 3-part measurements will match this one.
    "*.*.*.* region.region.host.measurement", # <- all 4-part measurements will match this one.
]
```

#### Field templates

The field keyword tells Telegraf to give the metric that field name.

##### Template

```toml
separator = "_"
templates = [
    "measurement.measurement.field.field.region"
]
```

##### Resulting transformation

```
cpu.usage.idle.percent.eu-east 100
=> cpu_usage,region=eu-east idle_percent=100
```

You can also derive the field key from all remaining elements of the graphite
bucket by specifying `field*`.

##### Template

```toml
separator = "_"
templates = [
    "measurement.measurement.region.field*"
]
```

##### Resulting transformation

```
cpu.usage.eu-east.idle.percentage 100
=> cpu_usage,region=eu-east idle_percentage=100
```

#### Filter templates

You can also filter templates based on the name of the bucket
using a wildcard.

##### Template

```toml
templates = [
    "cpu.* measurement.measurement.region",
    "mem.* measurement.measurement.host"
]
```

##### Resulting transformation

```
cpu.load.eu-east 100
=> cpu_load,region=eu-east value=100

mem.cached.localhost 256
=> mem_cached,host=localhost value=256
```

#### Adding tags

You can add additional tags to a metric that don't exist on the received metric by specifying them after the pattern. Tags have the same format as the line protocol.
Separate multiple tags with commas.

##### Template

```toml
templates = [
    "measurement.measurement.field.region datacenter=1a"
]
```

##### Resulting transformation

```
cpu.usage.idle.eu-east 100
=> cpu_usage,region=eu-east,datacenter=1a idle=100
```
