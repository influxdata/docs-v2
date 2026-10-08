---
title: influxdb3 delete query_group
description: >
  The `influxdb3 delete query_group` command deletes a distributed query group.
menu:
  influxdb3_enterprise:
    parent: influxdb3 delete
    name: influxdb3 delete query_group
weight: 500
source: /shared/influxdb3-cli/delete/query_group.md
canonical: self
draft: true
prepend: |
  > [!Warning]
  > #### Query groups aren't operational in v3.11
  >
  > This command works and removes the query group definition from the
  > catalog, but query group definitions don't yet affect query routing,
  > data placement, or replication.
---

<!--
//SOURCE - content/shared/influxdb3-cli/delete/query_group.md
-->
