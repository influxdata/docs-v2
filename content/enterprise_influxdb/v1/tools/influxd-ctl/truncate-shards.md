---
title: influxd-ctl truncate-shards
description: >
  The `influxd-ctl truncate-shards` command truncates all shards that are currently
  being written to (also known as "hot" shards) and creates new shards to write
  new data to.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
related:
  - /enterprise_influxdb/v1/administration/manage/clusters/rebalance/
  - /enterprise_influxdb/v1/tools/influxd-ctl/show-shards/
---

The `influxd-ctl truncate-shards` command truncates all shards that are currently
being written to (also known as "hot" shards) and creates new shards to write
new data to.

> [!Caution]
> #### Overlapping shards with forecast and future data
>
> Running `truncate-shards` on shards containing future timestamps can create 
> overlapping shards with duplicate data points.
>
> [Understand the risks with future data](#understand-the-risks-with-future-data).

## Usage

```sh
influxd-ctl truncate-shards [flags]
```

## Flags

| Flag     | Description                                              |
| :------- | :------------------------------------------------------- |
| `-delay` | Duration from now to truncate shards _(default is 1m0s)_ |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples

##### Truncate shards 3 minutes after command execution

```bash
influxd-ctl truncate-shards -delay 3m
```

## Understand the risks with future data

> [!Important]
> If you need to rebalance shards that contain future data, contact [InfluxData support](https://www.influxdata.com/contact/) for assistance.

When you write data points with timestamps in the future (for example, forecast data from machine learning models),
the `truncate-shards` command behaves differently and can cause data duplication issues.

### How truncate-shards normally works

For shards containing current data:
1. The command creates an artificial stop point in the shard at the truncation timestamp
2. Creates a new shard starting from the truncation point
3. Example: A one-week shard (Sunday to Saturday) becomes:
   - Shard A: Sunday to truncation point (Wednesday 2pm)
   - Shard B: Truncation point (Wednesday 2pm) to Saturday
   
This works correctly because the meta nodes understand the boundaries and route queries appropriately.

### The problem with future data

For shards containing future timestamps:
1. The truncation doesn't cleanly split the shard at a point in time
2. Instead, it creates overlapping shards that cover the same time period
3. Example: If you're writing September forecast data in August:
   - Original shard: September 1-7
   - After truncation: 
     - Shard A: September 1-7 (with data up to truncation)
     - Shard B: September 1-7 (for new data after truncation)
   - **Result**: Duplicate data points for the same timestamps
