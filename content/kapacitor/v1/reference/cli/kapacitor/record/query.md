---
title: kapacitor record query
description: >
  The `kapacitor record query` command records the result of a Kapacitor stream task.
menu:
  kapacitor_v1:
    name: kapacitor record query
    parent: kapacitor record
weight: 301
---

The `kapacitor record query` command records the result of an InfluxQL query.
Once the recording is stopped, the command outputs the recording ID. 
If no recording ID is specified, Kapacitor assigns a random ID.

{{< req "The command requires the following" >}}:

- **InfluxQL query**: Use the `-query` flag
- **Recording type**: Use the `-type` flag and pass either `batch` or `query`

_To replay the recording, see [`kapacitor replay`](/kapacitor/v1/reference/cli/kapacitor/replay/)._

## Usage

```sh
kapacitor record query [flags]
```

## Flags

| Flag            | Description                                                                                         |
| :-------------- | :-------------------------------------------------------------------------------------------------- |
| `-query`        | {{< req >}}: Query to record.                                                                       |
| `-type`         | {{< req >}}: Recording type (`stream` or `batch`)                                                   |
| `-cluster`      | [Named InfluxDB cluster or instance](/kapacitor/v1/administration/configuration/#influxdb) to query |
| `-no-wait`      | Run recording in the background                                                                     |
| `-recording-id` | ID to assign to the recording                                                                       |

## Examples

- [Record an InfluxQL query](#record-an-influxql-query)
- [Record an InfluxQL query and assign a custom recording ID](#record-an-influxql-query-and-assign-a-custom-recording-id)
- [Record an InfluxQL query for a specific InfluxDB cluster](#record-an-influxql-query-for-a-specific-influxdb-cluster)

### Record an InfluxQL query

```sh
influx record query \
  -query "SELECT temp, hum FROM db.rp.home" \
  -type batch
```

### Record an InfluxQL query and assign a custom recording ID

```sh
influx record query \
  -query "SELECT temp, hum FROM db.rp.home" \
  -type batch \
  -recording-id example-query-rec
```

### Record an InfluxQL query for a specific InfluxDB cluster

```sh
influx record query \
  -query "SELECT temp, hum FROM db.rp.home" \
  -type batch \
  -cluster influxdb-enterprise
```
