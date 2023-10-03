---
title: kapacitor replay
description: >
  The `kapacitor replay` command replays a task or query recording.
menu:
  kapacitor_v1:
    name: kapacitor replay
    parent: kapacitor
weight: 301
related:
  - /kapacitor/v1/reference/cli/kapacitor/record/
  - /kapacitor/v1/working/cli_client/#data-sampling, Kapacitor data sampling
---

The `kapacitor replay` command replays a task or query recording.

The times of the data points will either be relative to `now` or, if the `-rec-time`
flag is included, the exact times in the recording.
In either case, relative times between data points remain the same.

## Usage

```sh
kapacitor replay [flags]
```

## Flags

| Flag          | Description                                                         |
| :------------ | :------------------------------------------------------------------ |
| `-no-wait`    | Run replay in the background                                        |
| `-real-clock` | Replay data in real time, otherwise replay data as fast as possible |
| `-rec-time`   | Use times saved in the recording instead of present times           |
| `-recording`  | {{< req >}}: Recording ID to replay                                 |
| `-replay-id`  | ID to assign to the replay (default is a random ID)                 |
| `-task`       | Task ID                                                             |

## Examples

##### Replay a recording

```sh
kapacitor replay \
  -recording 4e0f09c5-1426-4778-8f9b-c4a88f5c2b66 \
  -task cpu_alert
```
