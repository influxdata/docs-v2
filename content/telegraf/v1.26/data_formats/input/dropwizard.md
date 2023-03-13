---
title: Dropwizard input data format
description: Use the `dropwizard` input data format to parse Dropwizard JSON representations into Telegraf metrics.
menu:
  telegraf_1_26_ref:

    name: Dropwizard
    weight: 30
    parent: Input data formats
    aliases:
        - /telegraf/v1.26/data_formats/template-patterns/
---

The `dropwizard` data format can parse a [Dropwizard JSON representation](http://metrics.dropwizard.io/3.1.0/manual/json/) representation of a single metrics registry. By default, tags are parsed from metric names as if they were actual InfluxDB Line Protocol keys (`measurement<,tag_set>`) which can be overridden using custom [template patterns](#templates). All field value types are supported, including `string`, `number` and `boolean`.


## Configuration

```toml
[[inputs.file]]
  files = ["example"]

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  data_format = "dropwizard"

  ## Used by the templating engine to join matched values when cardinality is > 1
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
  ## By providing an empty template array, templating is disabled and measurements are parsed as influxdb line protocol keys (measurement<,tag_set>)
  templates = []

  ## You may use an appropriate [gjson path](https://github.com/tidwall/gjson#path-syntax)
  ## to locate the metric registry within the JSON document
  # dropwizard_metric_registry_path = "metrics"

  ## You may use an appropriate [gjson path](https://github.com/tidwall/gjson#path-syntax)
  ## to locate the default time of the measurements within the JSON document
  # dropwizard_time_path = "time"
  # dropwizard_time_format = "2006-01-02T15:04:05Z07:00"

  ## You may use an appropriate [gjson path](https://github.com/tidwall/gjson#path-syntax)
  ## to locate the tags map within the JSON document
  # dropwizard_tags_path = "tags"

  ## You may even use tag paths per tag
  # [inputs.exec.dropwizard_tag_paths]
  #   tag1 = "tags.tag1"
  #   tag2 = "tags.tag2"
```


## Examples

A typical JSON of a dropwizard metric registry:

```json
{
	"version": "3.0.0",
	"counters" : {
		"measurement,tag1=green" : {
			"count" : 1
		}
	},
	"meters" : {
		"measurement" : {
			"count" : 1,
			"m15_rate" : 1.0,
			"m1_rate" : 1.0,
			"m5_rate" : 1.0,
			"mean_rate" : 1.0,
			"units" : "events/second"
		}
	},
	"gauges" : {
		"measurement" : {
			"value" : 1
		}
	},
	"histograms" : {
		"measurement" : {
			"count" : 1,
			"max" : 1.0,
			"mean" : 1.0,
			"min" : 1.0,
			"p50" : 1.0,
			"p75" : 1.0,
			"p95" : 1.0,
			"p98" : 1.0,
			"p99" : 1.0,
			"p999" : 1.0,
			"stddev" : 1.0
		}
	},
	"timers" : {
		"measurement" : {
			"count" : 1,
			"max" : 1.0,
			"mean" : 1.0,
			"min" : 1.0,
			"p50" : 1.0,
			"p75" : 1.0,
			"p95" : 1.0,
			"p98" : 1.0,
			"p99" : 1.0,
			"p999" : 1.0,
			"stddev" : 1.0,
			"m15_rate" : 1.0,
			"m1_rate" : 1.0,
			"m5_rate" : 1.0,
			"mean_rate" : 1.0,
			"duration_units" : "seconds",
			"rate_units" : "calls/second"
		}
	}
}
```

Would get translated into 4 different measurements:

```
measurement,metric_type=counter,tag1=green count=1
measurement,metric_type=meter count=1,m15_rate=1.0,m1_rate=1.0,m5_rate=1.0,mean_rate=1.0
measurement,metric_type=gauge value=1
measurement,metric_type=histogram count=1,max=1.0,mean=1.0,min=1.0,p50=1.0,p75=1.0,p95=1.0,p98=1.0,p99=1.0,p999=1.0
measurement,metric_type=timer count=1,max=1.0,mean=1.0,min=1.0,p50=1.0,p75=1.0,p95=1.0,p98=1.0,p99=1.0,p999=1.0,stddev=1.0,m15_rate=1.0,m1_rate=1.0,m5_rate=1.0,mean_rate=1.0
```

You may also parse a dropwizard registry from any JSON document which contains a dropwizard registry in some inner field.
Eg. to parse the following JSON document:

```json
{
	"time" : "2017-02-22T14:33:03.662+02:00",
	"tags" : {
		"tag1" : "green",
		"tag2" : "yellow"
	},
	"metrics" : {
		"counters" : 	{
			"measurement" : {
				"count" : 1
			}
		},
		"meters" : {},
		"gauges" : {},
		"histograms" : {},
		"timers" : {}
	}
}
```
and translate it into:

```
measurement,metric_type=counter,tag1=green,tag2=yellow count=1 1487766783662000000
```

you simply need to use the following additional configuration properties:

```toml
dropwizard_metric_registry_path = "metrics"
dropwizard_time_path = "time"
dropwizard_time_format = "2006-01-02T15:04:05Z07:00"
dropwizard_tags_path = "tags"
## tag paths per tag are supported too, eg.
#[inputs.yourinput.dropwizard_tag_paths]
#  tag1 = "tags.tag1"
#  tag2 = "tags.tag2"
```

## Templates <!--This content is duplicated in /telegraf/v1.26/data_formats/input/graphite/-->

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

##### Template

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
