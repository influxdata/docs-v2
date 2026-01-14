---
description: "Telegraf plugin for aggregating metrics using Derivative"
menu:
  telegraf_v1_ref:
    parent: aggregator_plugins_reference
    name: Derivative
    identifier: aggregator-derivative
tags: [Derivative, "aggregator-plugins", "configuration", "math"]
introduced: "v1.18.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.1/plugins/aggregators/derivative/README.md, Derivative Plugin Source
---

# Derivative Aggregator Plugin

This plugin computes the derivative for all fields of the aggregated metrics.

**Introduced in:** Telegraf v1.18.0
**Tags:** math
**OS support:** all

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Calculates a derivative for every field.
[[aggregators.derivative]]
  ## The period in which to flush the aggregator.
  # period = "30s"

  ## Suffix to append for the resulting derivative field.
  # suffix = "_rate"

  ## Field to use for the quotient when computing the derivative.
  ## When using a field as the derivation parameter the name of that field will
  ## be used for the resulting derivative, e.g. *fieldname_by_parameter*.
  ## By default the timestamps of the metrics are used and the suffix is omitted.
  # variable = ""

  ## Maximum number of roll-overs in case only one measurement is found during a period.
  # max_roll_over = 10
```

This aggregator will estimate a derivative for each field of a metric, which is
contained in both the first and last metric of the aggregation interval.
Without further configuration the derivative will be calculated with respect to
the time difference between these two measurements in seconds.
The following formula is applied is for every field

```text
derivative = (value_last - value_first) / (time_last - time_first)
```

The resulting derivative will be named `<fieldname>_rate` if no `suffix` is
configured.

To calculate a derivative for every field use

```toml
[[aggregators.derivative]]
  ## Specific Derivative Aggregator Arguments:

  ## Configure a custom derivation variable. Timestamp is used if none is given.
  # variable = ""

  ## Suffix to add to the field name for the derivative name.
  # suffix = "_rate"

  ## Roll-Over last measurement to first measurement of next period
  # max_roll_over = 10

  ## General Aggregator Arguments:

  ## calculate derivative every 30 seconds
  period = "30s"
```

## Time Derivatives

In its default configuration it determines the first and last measurement of
the period. From these measurements the time difference in seconds is
calculated. This time difference is than used to divide the difference of each
field using the following formula:

```text
derivative = (value_last - value_first) / (time_last - time_first)
```

For each field the derivative is emitted with a naming pattern
`<fieldname>_rate`.

## Custom Derivation Variable

The plugin supports to use a field of the aggregated measurements as derivation
variable in the denominator. This variable is assumed to be a monotonically
increasing value. In this feature the following formula is used:

```text
derivative = (value_last - value_first) / (variable_last - variable_first)
```

**Make sure the specified variable is not filtered and exists in the metrics
passed to this aggregator!**

When using a custom derivation variable, you should change the `suffix` of the
derivative name.  See the next section on customizing the derivative
name |
| 16        |  4.0  |                     |             |                     |             |
| 18        |  2.0  |                     |             |                     |             |
| 20        |  0.0  |                     |             |                     |             |
||| -1.0 | -1.0 | | |

The difference stems from the change of the value between periods, e.g. from 6.0
to 8.0 between first and second period.  Those changes are omitted with
`max_roll_over = 0` but are respected with `max_roll_over = 1`.  That there are
no more differences in the calculated derivatives is due to the example data,
which has constant derivatives in during the first and last period, even when
including the gap between the periods.  Using `max_roll_over` with a value
greater 0 may be important, if you need to detect changes between periods,
e.g. when you have very few measurements in a period or quasi-constant metrics
with only occasional changes.

### Tags

No tags are applied by this aggregator.
Existing tags are passed through the aggregator untouched.

## Example Output

```text
net bytes_recv=15409i,packets_recv=164i,bytes_sent=16649i,packets_sent=120i 1508843640000000000
net bytes_recv=73987i,packets_recv=364i,bytes_sent=87328i,packets_sent=452i 1508843660000000000
net bytes_recv_by_packets_recv=292.89 1508843660000000000
net packets_sent_rate=16.6,bytes_sent_rate=3533.95 1508843660000000000
net bytes_sent_by_packet=292.89 1508843660000000000
```
