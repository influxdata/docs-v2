---
title: Wavefront output data format
list_title: Wavefront
description: Use the `wavefront` output data format (serializer) to convert Telegraf metrics into Wavefront data format.
menu:
  telegraf_v1_ref:
    name: Wavefront
    weight: 10
    parent: Output data formats
    identifier: output-data-format-wavefront
---

Use the `wavefront` output data format (serializer) to convert Telegraf metrics into the [Wavefront Data Format](https://docs.wavefront.com/wavefront_data_format.html).

## Configuration

```toml
[[outputs.file]]
  files = ["stdout"]

  ## Data format to output.
  data_format = "wavefront"

  ## Use strict rules to sanitize metric and tag names.
  ## When enabled, forward slash (/) and comma (,) are accepted.
  # wavefront_use_strict = false

  ## Point tags to use as the source name for Wavefront.
  ## If none found, "host" is used.
  # wavefront_source_override = ["hostname", "address", "agent_host", "node_host"]

  ## Disable prefix path conversion.
  ## Default behavior (enabled): prod.prefix.name.metric.name
  ## Disabled behavior: prod.prefix_name.metric_name
  # wavefront_disable_prefix_conversion = false
```

### Configuration options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `wavefront_use_strict` | boolean | `false` | Use strict sanitization rules |
| `wavefront_source_override` | array | `[]` | Tags to use as source name |
| `wavefront_disable_prefix_conversion` | boolean | `false` | Disable path-style prefix conversion |

## Metrics

A Wavefront metric equals a single field value of a Telegraf measurement.
The metric name format is: `<measurement_name>.<field_name>`

Only boolean and numeric fields are serialized. Other types generate an error.

## Example

**Input metric:**
```
cpu,cpu=cpu0,host=testHost user=12,idle=88,system=0 1234567890
```

**Output (Wavefront format):**
```
"cpu.user" 12.000000 1234567890 source="testHost" "cpu"="cpu0"
"cpu.idle" 88.000000 1234567890 source="testHost" "cpu"="cpu0"
"cpu.system" 0.000000 1234567890 source="testHost" "cpu"="cpu0"
```
