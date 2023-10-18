---
title: kapacitor record stream
description: >
  The `kapacitor record stream` command records the result of a Kapacitor stream task.
menu:
  kapacitor_v1:
    name: kapacitor record stream
    parent: kapacitor record
weight: 301
---

The `kapacitor record stream` command records the result of a Kapacitor stream task.
Once the recording is stopped, the command outputs the recording ID. 
If no recording ID is specified, Kapacitor assigns a random ID.

{{< req "The command requires the following" >}}:

- **Recording duration**: Use the `-duration` flag
- **Task ID**: Use the `-task` flag

_To replay the recording, see [`kapacitor replay`](/kapacitor/v1/reference/cli/kapacitor/replay/)._

## Usage

```sh
kapacitor record stream [flags]
```

## Flags

| Flag            | Description                                              |
| :-------------- | :------------------------------------------------------- |
| `-duration`     | {{< req >}}: How long to record the data stream          |
| `-no-wait`      | Run recording in the background                          |
| `-recording-id` | ID to assign to the recording                            |
| `-task`         | {{< req >}}: Task ID (uses the `dbrp` value in the task) |

## Examples

- [Record a stream task](#record-a-stream-task)
- [Record a stream task and assign a custom recording ID](#record-a-stream-task-and-assign-a-custom-recording-id)

### Record a stream task

```sh
kapacitor record stream \
  -task example-task-id \
  -duration 1h
```

### Record a stream task and assign a custom recording ID

```sh
kapacitor record stream \
  -task example-task-id \
  -duration 1h \
  -recording-id 1h-example-stream-rec
```
