---
title: kapacitor record batch
description: >
  The `kapacitor record batch` command records the result of a Kapacitor batch task.
menu:
  kapacitor_v1:
    name: kapacitor record batch
    parent: kapacitor record
weight: 301
---

The `kapacitor record batch` command records the result of a Kapacitor batch task.
Once the recording is stopped, the command outputs the recording ID. 
If no recording ID is specified, Kapacitor assigns a random ID.

{{< req "The command requires the following" >}}:

- **Time range to query**: Use the `-past` flag or `-start` and `-stop` flags
- **Task ID**: Use the `-task` flag

_To replay the recording, see [`kapacitor replay`](/kapacitor/v1/reference/cli/kapacitor/replay/)._

## Usage

```sh
kapacitor record batch [flags]
```

## Flags

| Flag            | Description                                         |
| :-------------- | :-------------------------------------------------- |
| `-no-wait`      | Run recording in the background                     |
| `-past`         | Set start time via `now - past`                     |
| `-recording-id` | ID to assign to the recording                       |
| `-start`        | Start time for the set of queries                   |
| `-stop`         | Stop time for the set of queries (default is now)   |
| `-task`         | {{< req >}}: Task ID (uses the queries in the task) |

## Examples

- [Record a batch task using an absolute time range](#record-a-batch-task-using-an-absolute-time-range)
- [Record a batch task using a relative time range](#record-a-batch-task-using-a-relative-time-range)
- [Record a batch task and assign a custom recording ID](#record-a-batch-task-and-assign-a-custom-recording-id)

### Record a batch task using an absolute time range

```sh
kapacitor record batch \
  -task example-task-id \
  -start 2023-01-01T00:00:00Z \
  -stop 2023-06-01T00:00:00Z
```

### Record a batch task using a relative time range

```sh
kapacitor record batch \
  -task example-task-id \
  -past 90d
```

### Record a batch task and assign a custom recording ID

```sh
kapacitor record batch \
  -task example-task-id \
  -past 90d \
  -recording-id 90d-example-task-rec
```
