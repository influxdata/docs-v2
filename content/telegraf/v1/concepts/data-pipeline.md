---
title: The Telegraf data pipeline
description: >
  Learn how metrics flow through Telegraf: input plugins collect and parse
  data, processor and aggregator plugins transform it, and output plugins
  buffer, serialize, and write it to destinations.
menu:
  telegraf_v1:
    name: Data pipeline
    parent: How Telegraf works
weight: 102
related:
  - /telegraf/v1/concepts/metrics/
  - /telegraf/v1/configure_plugins/aggregator_processor/
  - /telegraf/v1/configuration/
---

Every metric that Telegraf handles follows the same path: input plugins
collect it, processor and aggregator plugins transform it, and output plugins
write it to one or more destinations.

{{< diagram natural-size center >}}
graph TD
  Inputs[<strong>Input plugins</strong> \n <em>Collect and parse</em>]
  P1[<strong>Processor plugins</strong> \n <em>First pass</em>]
  Agg[<strong>Aggregator plugins</strong> \n <em>Windowed aggregates</em>]
  P2[<strong>Processor plugins</strong> \n <em>Second pass</em>]
  Buffer[<strong>Output buffer</strong>]
  Outputs[<strong>Output plugins</strong> \n <em>Serialize and write</em>]

  Inputs --> P1
  P1 --> Agg
  Agg --> P2
  P2 --> Buffer
  Buffer --> Outputs
{{< /diagram >}}

Processor and aggregator plugins are optional.
With none configured, metrics move directly from inputs to the output buffer.

## Collect: input plugins

On each collection interval, Telegraf calls every polling input plugin to
gather metrics.
[Service input plugins](/telegraf/v1/concepts/#polling-and-service-inputs)
emit metrics as data arrives instead of waiting for the interval.

Input plugins that read raw data, such as files, message queues, or HTTP
responses, use a [parser](/telegraf/v1/data_formats/input/) selected by the
plugin's `data_format` option to convert that data into
[Telegraf metrics](/telegraf/v1/concepts/metrics/).

Input plugins apply [metric filters](#where-filtering-happens) after
gathering, so only metrics that pass the plugin's filters enter the pipeline.

## Process: processor plugins

Processor plugins act on metrics as they pass through and immediately emit
the result.
Typical uses include renaming metrics, converting units, enriching metrics
with tags, and running calculations.

Metrics that match a processor's filters are handed to the processor;
metrics that do not match bypass the processor and continue downstream
unchanged.

## Aggregate: aggregator plugins

Aggregator plugins produce new aggregate metrics, such as running means,
minimums, maximums, and standard deviations.
Each aggregator collects matching metrics into a time window defined by its
`period` setting and emits the aggregate values at the end of each period.

- Aggregators only aggregate metrics with timestamps inside the current
  period. Metrics older than the period are not included.
- Aggregates are created for each unique combination of measurement, field,
  and tag set. Use `taginclude` to group aggregates by specific tags only.
- By default, aggregators emit the aggregates *and* pass the original metrics
  downstream. Set `drop_original = true` to emit only the aggregates.

## Processor ordering

By default, processors run twice: once before aggregators and again on the
metrics that aggregators emit.
Only the aggregates take the second pass.
Original metrics continue to the output buffer without running through
processors again.
Running processors again lets you transform aggregate metrics, but it can
also produce unintended results. For example, a processor that scales values
scales the aggregates a second time after aggregation.

To control this behavior, use the following `[agent]` settings:

- `skip_processors_before_aggregators = true`: processors run only *after*
  aggregators.
- `skip_processors_after_aggregators = true`: processors run only *before*
  aggregators.
  The default is scheduled to change to `true` in Telegraf 1.40.

Alternatively, use metric filtering on the processor so aggregate metrics
bypass it, and make custom processor scripts idempotent so repeated
processing has no side effects.

For examples that combine processors and aggregators, see
[Why processors run twice](/telegraf/v1/configure_plugins/aggregator_processor/#why-processors-run-twice).

## Write: output plugins

Output plugins write metrics to their destinations.
Telegraf writes in batches of up to `metric_batch_size` metrics, on every
`flush_interval`, or sooner when a full batch is ready.
Output plugins that support serialization use a
[serializer](/telegraf/v1/data_formats/output/) selected by the plugin's
`data_format` option to convert metrics into the destination's format.

Output plugins apply metric filters before writing, so each output can
receive a different subset of the pipeline's metrics.

## Buffering and delivery

Each output plugin has its own buffer that holds metrics awaiting a
successful write.
If a destination is unreachable, metrics accumulate in the buffer, up to
`metric_buffer_limit` metrics, and Telegraf retries on the next flush.

The `[agent]` `buffer_strategy` setting controls buffer durability:

- `memory` (default): metrics buffer in memory only.
  If the buffer fills, Telegraf drops the oldest metrics to make room for new
  ones, and buffered metrics are lost if Telegraf stops.
- `disk`: each output persists its buffer to a write-ahead log in
  `buffer_directory`, and Telegraf removes entries as writes succeed.
  After a restart, Telegraf flushes existing log entries before new metrics.
  Telegraf does not limit the disk space these files use.
  Monitor the buffer directory to keep it from filling the disk.

For end-to-end delivery guarantees with queue-based inputs, see
[tracking metrics](/telegraf/v1/concepts/metrics/#tracking-metrics).

## Where filtering happens

You can attach [metric filters](/telegraf/v1/configuration/#metric-filtering)
to any plugin, but the point at which they apply depends on the plugin type:

- **Input plugins** filter *after* gathering: only passing metrics enter the
  pipeline.
- **Processor plugins** filter *before* processing: non-matching metrics
  bypass the processor unchanged.
- **Aggregator plugins** filter *before* aggregation: non-matching metrics
  pass downstream without being aggregated.
- **Output plugins** filter *before* writing: only passing metrics are sent
  to the destination.

For filter syntax and examples, see
[Metric filtering](/telegraf/v1/configuration/#metric-filtering).
