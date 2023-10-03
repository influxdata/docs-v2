---
title: kapacitor replay-live query
description: >
  The `kapacitor replay-live query` command replays the result of a query
  against a task without saving a recording.
menu:
  kapacitor_v1:
    name: kapacitor replay-live query
    parent: kapacitor replay-live
weight: 301
---

The `kapacitor replay-live query` command replays the result of a query
against a task without saving a recording.

## Usage

```sh
kapacitor replay-live query [flags]
```

## Flags {#replay-live-flags}

| Flag          | Description                                                                                         |
| :------------ | :-------------------------------------------------------------------------------------------------- |
| `-cluster`    | [Named InfluxDB cluster or instance](/kapacitor/v1/administration/configuration/#influxdb) to query |
| `-no-wait`    | Run replay in the background                                                                        |
| `-query`      | InfluxQL query to replay                                                                            |
| `-real-clock` | Replay queries in real time, otherwise replay queries as fast as possible                           |
| `-rec-time`   | Use times saved in the recording instead of present times                                           |
| `-replay-id`  | ID to assign to the replay (default is a random ID)                                                 |
| `-task`       | {{< req >}}: Task ID                                                                                |

## Examples

##### Replay the results of a query against an alert task

```sh
kapacitor replay-live query \
  -task cpu_alert \
  -rec-time \
  -query 'SELECT value FROM telegraf.default.cpu_idle WHERE time > now() - 1h'
```
