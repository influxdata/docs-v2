---
title: Filter Telegraf metrics
description: >
  Use metric filters on any Telegraf plugin to select which metrics a plugin
  handles and which tags and fields remain: namepass, namedrop, tagpass,
  tagdrop, metricpass, fieldinclude, fieldexclude, taginclude, and tagexclude.
menu:
  telegraf_v1:
    name: Filter metrics
    parent: Configure Telegraf
weight: 105
related:
  - /telegraf/v1/concepts/data-pipeline/
  - /telegraf/v1/configuration/plugin-options/
  - /telegraf/v1/configuration/toml/
---

Metric filters attach to any input, output, processor, or aggregator plugin
and control which metrics that plugin handles.
Filters fall into two categories:

- **Selectors** include or exclude entire metrics.
  When a selector excludes a metric from an input or output plugin, the
  metric is dropped.
  When a selector excludes a metric from a processor or aggregator plugin,
  the metric skips the plugin and continues downstream unchanged.
- **Modifiers** remove tags and fields from metrics that pass.
  If a modifier removes all of a metric's fields, the metric is dropped.

The point at which filters apply depends on the plugin type.
See [Where filtering happens](/telegraf/v1/concepts/data-pipeline/#where-filtering-happens).

Each filter parameter lists its data type.
None of the filter parameters are set by default.

- [Selectors](#selectors)
  - [namepass](#namepass)
  - [namepass_separator](#namepass_separator)
  - [namedrop](#namedrop)
  - [namedrop_separator](#namedrop_separator)
  - [tagpass](#tagpass)
  - [tagdrop](#tagdrop)
  - [metricpass](#metricpass)
- [Modifiers](#modifiers)
  - [fieldinclude](#fieldinclude)
  - [fieldexclude](#fieldexclude)
  - [taginclude](#taginclude)
  - [tagexclude](#tagexclude)
- [Order of operations](#order-of-operations)
- [Examples](#examples)

## Selectors

Selectors decide *whether* a plugin handles a metric.

### namepass

An array of [glob pattern](https://github.com/gobwas/glob#syntax) strings.
Only metrics whose measurement name matches a pattern in the list are
emitted.

**Type:** array of strings

### namepass_separator

A custom list of separator characters excluded from wildcard glob matching
in `namepass` patterns.
Useful for dot-delimited measurement names, such as Graphite metrics.

**Type:** string

### namedrop

The inverse of `namepass`: metrics whose measurement name matches a pattern
are discarded.
Telegraf tests `namedrop` after metrics pass the `namepass` test.

**Type:** array of strings

### namedrop_separator

A custom list of separator characters excluded from wildcard glob matching
in `namedrop` patterns.

**Type:** string

### tagpass

A table mapping tag keys to arrays of glob pattern strings.
Only metrics that contain a matching tag key with a tag value matching one
of its patterns are emitted.
Conditions across tag keys are combined with OR: a metric passes if any
listed tag key matches.

**Type:** table

> [!Important]
> Because of how TOML parses tables, `tagpass` and `tagdrop` in explicit
> table syntax (`[inputs.cpu.tagpass]`) must be defined at the *end* of the
> plugin definition; otherwise subsequent options are read as part of the
> table.
> With inline table syntax (`tagpass = {...}`), the table must be in the main
> plugin definition, not in a sub-table.
> See [Table ordering](/telegraf/v1/configuration/toml/#table-ordering).

### tagdrop

The inverse of `tagpass`: if a match is found, the metric is discarded.
Telegraf tests `tagdrop` after metrics pass the `tagpass` test.

**Type:** table

### metricpass

A [Common Expression Language (CEL)](https://github.com/google/cel-go/tree/master)
expression with a boolean result: `true` passes the metric, anything else
discards it.
CEL expressions are more general than the other selectors and support
time-based filtering.

`metricpass` expressions have access to the following variables:

- `name` (string): the measurement name
- `tags` (map of strings): the metric's tags
- `fields` (map): the metric's fields
- `time` (timestamp): the metric's timestamp

For the functions and operators available in Telegraf CEL expressions, see
the
[CEL functions and operators reference](/telegraf/v1/agent-status-eval/functions/).
For complete language syntax, see the
[CEL language definition](https://github.com/google/cel-spec/blob/master/doc/langdef.md).

Expressions that compile but fail at runtime (for example, reading a field
that doesn't exist) abort evaluation, log an error, and report `true`, so the
metric passes.

**Type:** string

> [!Note]
> CEL is an interpreted language, so `metricpass` filtering is much slower
> than `namepass`, `tagpass`, and the other selectors.
> In high-throughput scenarios, prefer the more restricted filter options
> where possible.

## Modifiers

Modifiers decide *which tags and fields* remain on metrics the plugin
handles.
Telegraf applies modifiers before a metric is passed to a processor,
aggregator, or output plugin.
On input plugins, modifiers apply after the input runs.

### fieldinclude

An array of glob pattern strings.
Only fields whose field key matches a pattern in the list are emitted.

**Type:** array of strings

### fieldexclude

The inverse of `fieldinclude`: fields with a matching field key are
discarded.
Telegraf tests `fieldexclude` after fields pass the `fieldinclude` test.

**Type:** array of strings

### taginclude

An array of glob pattern strings.
Only tags with a tag key matching one of the patterns are emitted.
In contrast to `tagpass`, which passes an entire metric based on its tags,
`taginclude` removes non-matching tags from the metric.
Any tag can be removed, including global tags and the agent `host` tag.

**Type:** array of strings

### tagexclude

The inverse of `taginclude`: tags with a matching tag key are discarded from
the metric.

**Type:** array of strings

## Order of operations

- Selectors run before modifiers: selectors decide whether the plugin
  handles a metric, then modifiers adjust its tags and fields.
- `pass` tests run before `drop` tests: Telegraf tests `namedrop` only on
  metrics that passed `namepass`, and `tagdrop` only on metrics that passed
  `tagpass`.
- The stage at which filters apply depends on the plugin type.
  See [Where filtering happens](/telegraf/v1/concepts/data-pipeline/#where-filtering-happens).

To keep explicitly defined tags from being removed by `taginclude` or
`tagexclude`, use the agent
[`always_include_local_tags`](/telegraf/v1/configuration/agent/#always_include_local_tags)
and
[`always_include_global_tags`](/telegraf/v1/configuration/agent/#always_include_global_tags)
settings.

## Examples

### Filter metrics by tag

`tagpass` conditions across tag keys are combined with OR: the disk metric
passes if the filesystem is ext4 or xfs, *or* the path is `/opt` or under
`/home`.

```toml
[[inputs.disk]]
  [inputs.disk.tagpass]
    fstype = ["ext4", "xfs"]
    path = ["/opt", "/home*"]
```

Drop Windows network metrics for uninteresting interfaces:

```toml
[[inputs.win_perf_counters]]
  [[inputs.win_perf_counters.object]]
    ObjectName = "Network Interface"
    Instances = ["*"]
    Counters = ["Bytes Received/sec", "Bytes Sent/sec"]
    Measurement = "win_net"
  [inputs.win_perf_counters.tagdrop]
    instance = ["isatap*", "Local*"]
```

### Filter fields

```toml
# Drop guest and steal CPU usage fields
[[inputs.cpu]]
  percpu = false
  totalcpu = true
  fieldexclude = ["usage_guest", "usage_steal"]

# Only store inode-related disk metrics
[[inputs.disk]]
  fieldinclude = ["inodes*"]
```

### Filter metrics by name

```toml
# Drop all container metrics from the kubelet
[[inputs.prometheus]]
  urls = ["http://kube-node-1:4194/metrics"]
  namedrop = ["container_*"]

# Only store REST client metrics from the kubelet
[[inputs.prometheus]]
  urls = ["http://kube-node-1:4194/metrics"]
  namepass = ["rest_client_*"]
```

### Use separators with name filters

With `namepass_separator = "."`, the pattern `A.*.B` matches `A.C.B` but not
`A.C.D.B`, because the wildcard doesn't cross the separator:

```toml
[[inputs.socket_listener]]
  data_format = "graphite"
  templates = ["measurement*"]
  namepass = ["A.*.B"]
  namepass_separator = "."
```

### Trim tags from metrics

```toml
# Keep only the "cpu" tag on cpu metrics
[[inputs.cpu]]
  percpu = true
  totalcpu = true
  taginclude = ["cpu"]

# Remove the "fstype" tag from disk metrics
[[inputs.disk]]
  tagexclude = ["fstype"]
```

### Route metrics to different outputs

Filters on output plugins let each output receive a different subset of
metrics:

```toml
[[outputs.influxdb]]
  urls = ["http://localhost:8086"]
  database = "telegraf"
  namedrop = ["aerospike*"]

[[outputs.influxdb]]
  urls = ["http://localhost:8086"]
  database = "telegraf-aerospike-data"
  namepass = ["aerospike*"]
```

Route metrics with a dedicated tag, then remove the tag before writing:

```toml
[[inputs.disk]]
  [inputs.disk.tags]
    influxdb_database = "other"

[[outputs.influxdb]]
  urls = ["http://influxdb.example.com"]
  database = "db_default"
  [outputs.influxdb.tagdrop]
    influxdb_database = ["*"]

[[outputs.influxdb]]
  urls = ["http://influxdb.example.com"]
  database = "db_other"
  tagexclude = ["influxdb_database"]
  [outputs.influxdb.tagpass]
    influxdb_database = ["other"]
```
