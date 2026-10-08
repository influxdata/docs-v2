---
title: influxdb3 create query_group
description: >
  The `influxdb3 create query_group` command creates a new distributed query group.
menu:
  influxdb3_enterprise:
    parent: influxdb3 create
    name: influxdb3 create query_group
weight: 500
source: /shared/influxdb3-cli/create/query_group.md
canonical: self
draft: true
prepend: |
  > [!Warning]
  > #### Query groups aren't operational in v3.11
  >
  > This command works and stores the query group definition in the catalog,
  > but the server doesn't yet use it to affect query routing, data
  > placement, or replication.
---

<!--
//SOURCE - content/shared/influxdb3-cli/create/query_group.md
-->
