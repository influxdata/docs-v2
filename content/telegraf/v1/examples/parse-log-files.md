---
title: Parse log files
description: >
  Use the Telegraf tail input plugin and grok patterns to parse web server
  access logs into structured metrics and write them to InfluxDB 3.
menu:
  telegraf_v1:
    name: Parse log files
    parent: Configuration examples
weight: 105
related:
  - /telegraf/v1/input-plugins/tail/
  - /telegraf/v1/data_formats/input/grok/
---

Follow a log file as it's written and parse each line into a structured
metric using grok patterns.
This example parses NGINX or Apache access logs in the combined log
format:

```text
203.0.113.10 - frank [13/Aug/2026:10:55:36 -0700] "GET /api/orders HTTP/1.1" 200 2326 "https://example.com/start" "Mozilla/5.0"
```

## Configuration

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[inputs.tail]]
  ## Files to tail. Glob patterns are supported.
  files = ["/var/log/nginx/access.log"]

  ## Read new entries only, or persisted offsets after a restart.
  initial_read_offset = "saved-or-end"

  ## Use the access_log measurement name.
  name_override = "access_log"

  ## Parse each line with the built-in combined log format pattern.
  data_format = "grok"
  grok_patterns = ["%{COMBINED_LOG_FORMAT}"]

[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your InfluxDB authorization token
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the database to write to

## How it works

- **`inputs.tail`** follows the file like `tail -F`: it picks up new lines
  as they're written, handles log rotation, and persists its read offset
  so a Telegraf restart doesn't re-ingest or skip lines
  (`initial_read_offset = "saved-or-end"`).
- **`grok_patterns`** matches each line against the built-in
  `COMBINED_LOG_FORMAT` pattern, which extracts:
  - `resp_code` and `verb` as **tags**, so you can group and filter by
    status code and HTTP method
  - `resp_bytes` as an integer field, plus `client_ip`, `request`,
    `referrer`, and `agent` as string fields
  - the bracketed request time as the **metric timestamp**
- Lines that don't match the pattern are dropped with a log message.
  For plain Apache logs without referrer and agent, use
  `%{COMMON_LOG_FORMAT}` instead.

## Example output

```text
access_log,path=/var/log/nginx/access.log,resp_code=200,verb=GET agent="Mozilla/5.0",auth="frank",client_ip="203.0.113.10",http_version=1.1,ident="-",referrer="https://example.com/start",request="/api/orders",resp_bytes=2326i 1786643736000000000
```

## Write custom patterns

For application logs with custom formats, define your own pattern with
named captures and types:

```toml
[[inputs.tail]]
  files = ["/var/log/app/app.log"]
  name_override = "app_log"
  data_format = "grok"
  grok_custom_patterns = '''
APP_LOG %{TIMESTAMP_ISO8601:timestamp:ts-"2006-01-02 15:04:05"} \[%{LOGLEVEL:level:tag}\] %{NUMBER:duration_ms:float} %{GREEDYDATA:message}
'''
  grok_patterns = ["%{APP_LOG}"]
```

The `:tag` modifier stores a capture as a tag, type modifiers such as
`:float` and `:int` set field types, and `ts-` modifiers parse the
timestamp.
For the full modifier reference, see the
[grok input data format](/telegraf/v1/data_formats/input/grok/).

## Extend this example

- Tail multiple log files with glob patterns, such as
  `/var/log/nginx/*.log`.
  The `path` tag distinguishes the source file.
- High-traffic logs produce one metric per request.
  To store aggregates instead, downsample request counts and durations
  before writing.
  See [Downsample metrics before writing](/telegraf/v1/examples/downsample-metrics/).
