---
title: Telegraf agent settings
description: >
  Reference for every setting in the Telegraf [agent] configuration table,
  grouped by what it controls: scheduling, batching and buffering, flushing,
  logging, host identity, pipeline behavior, and state persistence.
menu:
  telegraf_v1:
    name: Agent settings
    parent: Configure Telegraf
weight: 103
related:
  - /telegraf/v1/concepts/data-pipeline/
  - /telegraf/v1/configuration/file/
  - /telegraf/v1/configuration/plugin-options/
---

The `[agent]` table configures how Telegraf itself runs and sets the defaults
used across all plugins.
Define the `[agent]` table only once, in the first configuration file that
Telegraf reads.

```toml
[agent]
  interval = "10s"
  round_interval = true
  metric_batch_size = 1000
  metric_buffer_limit = 10000
  flush_interval = "10s"
```

Each setting lists its data type and default value.
Duration and size values are TOML strings, such as `"10s"`, `"1m"`, or
`"10MB"`.
See [Durations](/telegraf/v1/configuration/toml/#durations).

- [Collection scheduling](#collection-scheduling)
  - [interval](#interval)
  - [round_interval](#round_interval)
  - [collection_jitter](#collection_jitter)
  - [collection_offset](#collection_offset)
- [Batching and buffering](#batching-and-buffering)
  - [metric_batch_size](#metric_batch_size)
  - [metric_buffer_limit](#metric_buffer_limit)
  - [buffer_strategy](#buffer_strategy)
  - [buffer_directory](#buffer_directory)
  - [buffer_disk_sync](#buffer_disk_sync)
- [Flushing](#flushing)
  - [flush_interval](#flush_interval)
  - [flush_jitter](#flush_jitter)
- [Timestamps](#timestamps)
  - [precision](#precision)
- [Logging](#logging)
  - [debug](#debug)
  - [quiet](#quiet)
  - [logformat](#logformat)
  - [structured_log_message_key](#structured_log_message_key)
  - [logfile](#logfile)
  - [logfile_rotation_interval](#logfile_rotation_interval)
  - [logfile_rotation_max_size](#logfile_rotation_max_size)
  - [logfile_rotation_max_archives](#logfile_rotation_max_archives)
  - [log_with_timezone](#log_with_timezone)
- [Host identity](#host-identity)
  - [hostname](#hostname)
  - [omit_hostname](#omit_hostname)
- [Pipeline behavior](#pipeline-behavior)
  - [skip_processors_before_aggregators](#skip_processors_before_aggregators)
  - [skip_processors_after_aggregators](#skip_processors_after_aggregators)
- [Tag handling](#tag-handling)
  - [always_include_local_tags](#always_include_local_tags)
  - [always_include_global_tags](#always_include_global_tags)
- [State persistence](#state-persistence)
  - [statefile](#statefile)
- [SNMP](#snmp)
  - [snmp_translator](#snmp_translator)

## Collection scheduling

### interval

The default data collection interval for all input plugins.

**Type:** duration  
**Default:** `"10s"`

### round_interval

Rounds the collection time to the interval.
For example, with `interval = "10s"`, Telegraf always collects on :00, :10,
:20, and so on.

**Type:** boolean  
**Default:** `true`

### collection_jitter

Sleeps each plugin for a random time within the jitter before collecting.
Use this to keep many plugins from querying resources such as sysfs at the
same time.

**Type:** duration  
**Default:** `"0s"`

### collection_offset

Shifts collection by the given interval.
Use this to schedule plugins at different times when they query constrained
devices.

**Type:** duration  
**Default:** `"0s"`

## Batching and buffering

### metric_batch_size

The maximum number of metrics per write.
Telegraf sends metrics to outputs in batches of at most this size.

**Type:** integer  
**Default:** `1000`

### metric_buffer_limit

The maximum number of unwritten metrics each output buffers.
Increasing this value allows longer output downtime without dropping metrics,
at the cost of more memory.
When the buffer fills, the oldest metrics are overwritten by new ones.

**Type:** integer  
**Default:** `10000`

### buffer_strategy

The buffer type for output plugins: `memory` or `disk`, which persists
pending metrics to disk for durability.
See
[Buffering and delivery](/telegraf/v1/concepts/data-pipeline/#buffering-and-delivery).

**Type:** string  
**Default:** `"memory"`

### buffer_directory

The directory for disk buffer files.
Each output plugin creates its own subdirectory.

**Type:** string  
**Default:** Not set; required when using the `disk` buffer strategy.

### buffer_disk_sync

Controls write durability in `disk` buffer mode.
Disabling sync improves write performance at the risk of losing metrics
buffered during the last flush interval in a power failure.

**Type:** boolean  
**Default:** `true`

## Flushing

### flush_interval

The default flush interval for all outputs.
The maximum time between flushes is `flush_interval + flush_jitter`.

**Type:** duration  
**Default:** `"10s"`

### flush_jitter

Jitters the flush interval by a random amount.
Use this to avoid large write spikes when running many Telegraf instances.

**Type:** duration  
**Default:** `"0s"`

## Timestamps

### precision

Rounds collected metric timestamps to the specified interval.
Precision is *not* applied to service inputs.
Each service input sets its own timestamp precision.

**Type:** duration  
**Default:** `"0s"` (no rounding)

## Logging

### debug

Log at debug level.

**Type:** boolean  
**Default:** `false`

### quiet

Log only error-level messages.

**Type:** boolean  
**Default:** `false`

### logformat

The log format: `text`, `structured`, or, on Windows, `eventlog`.

**Type:** string  
**Default:** `"text"`

### structured_log_message_key

Overrides the message key for structured logs.

**Type:** string  
**Default:** `"msg"`

### logfile

The file to log to.
Ignored for the `eventlog` format.

**Type:** string  
**Default:** Not set; Telegraf logs to stderr.

### logfile_rotation_interval

Rotates the log file after the specified interval.

**Type:** duration  
**Default:** `"0h"` (time-based rotation disabled)

### logfile_rotation_max_size

Rotates the log file when it exceeds the specified size.

**Type:** size  
**Default:** `"0MB"` (size-based rotation disabled)

### logfile_rotation_max_archives

The maximum number of rotated archives to keep. `-1` keeps all archives.

**Type:** integer  
**Default:** `5`

### log_with_timezone

The time zone to use when logging, such as `America/Chicago`, or `local` for
local time.

**Type:** string  
**Default:** Not set

## Host identity

### hostname

Overrides the hostname used in the `host` tag.

**Type:** string  
**Default:** Not set; Telegraf uses the operating system's hostname.

### omit_hostname

If `true`, Telegraf doesn't set the `host` tag on metrics.

**Type:** boolean  
**Default:** `false`

## Pipeline behavior

See
[Processor ordering](/telegraf/v1/concepts/data-pipeline/#processor-ordering)
for how these settings change the data pipeline.

### skip_processors_before_aggregators

If `true`, processors run only after aggregators instead of both before and
after.

**Type:** boolean  
**Default:** `false`

### skip_processors_after_aggregators

If `true`, processors don't run a second time after aggregators.
The default is scheduled to change to `true` in Telegraf 1.40, and Telegraf
logs a warning at startup until you set the option explicitly.

**Type:** boolean  
**Default:** `false`

## Tag handling

### always_include_local_tags

Tags defined directly on a plugin always pass tag filtering (`taginclude`
and `tagexclude`), so you don't have to list them twice.

**Type:** boolean  
**Default:** `false`

### always_include_global_tags

Tags defined in `[global_tags]` always pass tag filtering.

**Type:** boolean  
**Default:** `false`

## State persistence

### statefile

The file used to save the state of stateful plugins when Telegraf stops and
restore it on start.

**Type:** string  
**Default:** Not set; plugin state isn't persisted across restarts.

## SNMP

### snmp_translator

The method for translating SNMP objects: `gosmi` (built-in library) or
`netsnmp` (deprecated), which calls the external `snmptranslate` and
`snmptable` programs.

**Type:** string  
**Default:** `"netsnmp"`
