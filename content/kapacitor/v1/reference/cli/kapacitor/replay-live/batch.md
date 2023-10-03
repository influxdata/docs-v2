---
title: kapacitor replay-live batch
description: >
  The `kapacitor replay-live batch` command replays queries in a batch task
  without saving a recording.
menu:
  kapacitor_v1:
    name: kapacitor replay-live batch
    parent: kapacitor replay-live
weight: 301
---

The `kapacitor replay-live batch` command replays queries in a batch task
without saving a recording.

## Usage

```sh
kapacitor replay-live batch [flags]
```

## Flags {#replay-live-flags}

| Flag          | Description                                                               |
| :------------ | :------------------------------------------------------------------------ |
| `-no-wait`    | Run replay in the background                                              |
| `-past`       | Set start time via `now - past`                                           |
| `-real-clock` | Replay queries in real time, otherwise replay queries as fast as possible |
| `-rec-time`   | Use times saved in the recording instead of present times                 |
| `-replay-id`  | ID to assign to the replay (default is a random ID)                       |
| `-start`      | Start time for the set of queries                                         |
| `-stop`       | Stop time for the set of queries (default now)                            |
| `-task`       | {{< req >}}: Task ID                                                      |

## Examples

- [Live-replay batch queries in an absolute time range](#live-replay-batch-queries-in-an-absolute-time-range)
- [Live-replay batch queries in a relative time range](#live-replay-batch-queries-in-a-relative-time-range)

### Live-replay batch queries in an absolute time range

```sh
kapacitor replay-live batch \
  -task cpu_idle \
  -start 2023-09-01T00:00:00Z \
  -stop 2023-09-02T00:00:00Z
```  

### Live-replay batch queries in a relative time range

```sh
kapacitor replay-live batch \
  -task cpu_idle \
  -past 10h
```
