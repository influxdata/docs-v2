---
title: kapacitor record
description: >
  The `kapacitor record` command records the result of an InfluxDB query or a
  snapshot of the live data stream.
menu:
  kapacitor_v1:
    name: kapacitor record
    parent: kapacitor
weight: 301
cascade:
  related: 
    - /kapacitor/v1/working/cli_client/#data-sampling, Kapacitor data sampling
    - /kapacitor/v1/reference/cli/kapacitor/replay/
---

The `kapacitor record` command and its subcommands record the result of an
InfluxDB query or a snapshot of the live data stream.

_To replay the recording, see [`kapacitor replay`](/kapacitor/v1/reference/cli/kapacitor/replay/)._

## Usage

```sh
kapacitor record [subcommand] [flags]
```

## Subcommands

| Subcommand                                                     | Description              |
| :------------------------------------------------------------- | :----------------------- |
| [batch](/kapacitor/v1/reference/cli/kapacitor/record/batch/)   | Record a batch task      |
| [query](/kapacitor/v1/reference/cli/kapacitor/record/query/)   | Record an InfluxDB query |
| [stream](/kapacitor/v1/reference/cli/kapacitor/record/stream/) | Record a stream task     |

