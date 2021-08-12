---
title: IoT sensor common queries
description: >
  Different scenarios for common queries -- IoT 
influxdb/v2.0/tags: [queries]
menu:
  influxdb_2_0:
    name: IoT common queries
    parent: Common queries
weight: 205
---

The following scenarios walk through IoT sensor common queries: 
- [Record time in state](#record-time-in-state)
- [Calculate time weighted average](#calculate-time-weighted-average)
- [Calculate value between events](#calculate-value-between-events)
- [Record data points with added context](#record-data-points-with-added-context)
- [Group aggregate on value change(s)](#group-aggregate-on-value-change(s))

## Record time in state

Machine state would be a Boolean value that changes states occasionally. I would like to know the percent of time or total time it was in the “true” state over a given interval. It is possible that no points were recorded during that interval, and that the last state prior to that interval is needed.

We could potentially tie this example into using the Mosaic chart as well. Since Mosaic allows you to visualize time in state....

## Calculate time weighted average

A flow sensor records data intermittently (whenever the data changes by a certain percentage) to save on overhead. I would like to know the time weighted average over a given interval. It is possible that no points were recorded during that interval, and that the last state prior to that interval is needed. Expand and create a more contextual example for: https://docs.influxdata.com/influxdb/v2.0/reference/flux/stdlib/built-in/transformations/aggregates/timeweightedavg/ (non reference)/

## Calculate value between events

Events are recorded for when a batch of beer is started and when a batch of beer is completed. I would like to calculate the average temperature value during that period.
If each batch is identified with a tag, it means that the start and end is the only range when data will be collected for this series and ultimately the data will age out. If we have many tanks to brew beer at the same time, we should be able to use tags to correctly calculate this. But, an example detailing this out would be useful.

## Record data points with added context
Equipment speed measurements are recorded periodically (float), as is the production order number (string), but not as a field set – as separate streams. I would like to query the equipment speed measurements either in their raw form or aggregated on windows, but I would like to also have the result set include the production order number that was active at that point in time. Example of using experimental.join and how to ensure the timestamps align along with the tag keys... But, need to figure out what ties the two streams together?

## Group aggregate on value change(s)
Similar to Scenario 4, but I’d like to have something akin to a “group by” aggregate for one or more measurements over given interval, grouped by one or more context values that might change state (production order number, crew, machine state, etc.)