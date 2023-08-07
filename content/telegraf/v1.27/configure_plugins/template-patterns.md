---
title: Telegraf template patterns
description: |
    Template patterns describe how a dot-delimited string should be mapped to
    and from Telegraf metrics.
menu:
  telegraf_1_27_ref:
    weight: 10
    name: Template patterns
---

Template patterns describe how a dot-delimited string should be mapped to
and from Telegraf [metrics](/telegraf/v1.27/metrics/).

A template has the form:

```text
"host.mytag.mytag.measurement.measurement.field*"
```

Where the following keywords can be set:

- `measurement`: specifies that this section of the graphite bucket corresponds
  to the measurement name. This can be specified multiple times.
- `field`: specifies that this section of the graphite bucket corresponds
  to the field name. This can be specified multiple times.
- `measurement*`: specifies that all remaining elements of the graphite bucket
  correspond to the measurement name.
- `field*`: specifies that all remaining elements of the graphite bucket
  correspond to the field name.

Any part of the template that is not a keyword is treated as a tag key. This
can also be specified multiple times.

**Note the following:**

- `measurement` must be specified in your template.
- `field*` cannot be used in conjunction with `measurement*`.

## Examples

### Measurement and tag templates

A basic template specifies a single transformation to apply to all
incoming metrics:

```toml
templates = [
    "region.region.measurement*"
]
```

This results in the following Graphite to Telegraf metric transformation.

```text
us.west.cpu.load 100
=> cpu.load,region=us.west value=100
```

Multiple templates can also be specified, but these should be differentiated
using _filters_ (see below for more details)

```toml
templates = [
    "*.*.* region.region.measurement", # <- all 3-part measurements will match this one.
    "*.*.*.* region.region.host.measurement", # <- all 4-part measurements will match this one.
]
```

### Field Templates

The field keyword tells Telegraf to give the metric that field name.
So the following template:

```toml
separator = "_"
templates = [
    "measurement.measurement.field.field.region"
]
```

would result in the following Graphite -> Telegraf transformation.

```text
cpu.usage.idle.percent.eu-east 100
=> cpu_usage,region=eu-east idle_percent=100
```

The field key can also be derived from all remaining elements of the graphite
bucket by specifying `field*`:

```toml
separator = "_"
templates = [
    "measurement.measurement.region.field*"
]
```

which would result in the following Graphite -> Telegraf transformation.

```text
cpu.usage.eu-east.idle.percentage 100
=> cpu_usage,region=eu-east idle_percentage=100
```

### Filter Templates

Users can also filter the templates to use based on the name of the bucket,
using glob matching--for example:

```toml
templates = [
    "cpu.* measurement.measurement.region",
    "mem.* measurement.measurement.host"
]
```

which would result in the following transformation:

```text
cpu.load.eu-east 100
=> cpu_load,region=eu-east value=100

mem.cached.localhost 256
=> mem_cached,host=localhost value=256
```

### Adding Tags

Additional tags can be added to a metric that don't exist on the received metric.
You can add additional tags by specifying them after the pattern.
Tags have the same format as the line protocol.
Multiple tags are separated by commas.

```toml
templates = [
    "measurement.measurement.field.region datacenter=1a"
]
```

would result in the following Graphite -> Telegraf transformation.

```text
cpu.usage.idle.eu-east 100
=> cpu_usage,region=eu-east,datacenter=1a idle=100
```

[metrics]: /docs/METRICS.md