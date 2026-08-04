---
title: influxdb3 update query_group
description: >
  The `influxdb3 update query_group` command updates an existing distributed query group.
menu:
  influxdb3_enterprise:
    parent: influxdb3 update
    name: influxdb3 update query_group
weight: 402
source: /shared/influxdb3-cli/update/query_group.md
canonical: self
draft: true
prepend: |
  > [!Warning]
  > #### Query groups aren't operational in v3.11
  >
  > This command works and updates the query group definition in the
  > catalog, but query group definitions don't yet affect query routing,
  > data placement, or replication.
---

<!--
//SOURCE - content/shared/influxdb3-cli/update/query_group.md
-->
