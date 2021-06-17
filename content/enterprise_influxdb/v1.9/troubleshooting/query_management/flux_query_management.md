---
title: Flux query management
description: Flux query management controls.
menu:
  enterprise_influxdb_1_9:
    name: Flux query management
    weight: 40
    parent: Query management
---

## Configuration settings for Flux query management

The following configuration settings are in the
[flux-controller](/enterprise_influxdb/v1.9/administration/config-data-nodes/#flux-query-management-settings) section of the
configuration file.

### `[flux-controller]`

#### query-concurrency
Number of queries allowed to execute concurrently.
`0` means unlimited.
Default is `0`.

#### query-initial-memory-bytes
Initial bytes of memory allocated for a query.
`0` means unlimited.
Default is `0`.

#### query-max-memory-bytes
Maximum total bytes of memory allowed for an individual query.
`0` means unlimited.
Default is `0`.

#### total-max-memory-bytes
Maximum total bytes of memory allowed for all running Flux queries.
`0` means unlimited.
Default is `0`.

#### query-queue-size
Maximum number of queries allowed in execution queue.
When queue limit is reached, new queries are rejected.
`0` means unlimited.
Default is `0`.
