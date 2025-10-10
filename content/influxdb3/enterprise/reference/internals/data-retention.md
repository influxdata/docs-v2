---
title: Data retention in {{< product-name >}}
description: >
  {{% product-name %}} enforces database and table retention periods at query time
  and, to optimize storage, routinely deletes expired data.
weight: 103
menu:
  influxdb3_enterprise:
    name: Data retention
    parent: Enterprise internals
influxdb3/enterprise/tags: [internals, retention]
related:
  - /influxdb3/enterprise/admin/databases/create/
  - /influxdb3/enterprise/admin/tables/create/
  - /influxdb3/enterprise/reference/cli/influxdb3/create/database/
  - /influxdb3/enterprise/reference/cli/influxdb3/create/table/
  - /influxdb3/enterprise/reference/cli/influxdb3/update/database/
  - /influxdb3/enterprise/api/v3/#operation/PostConfigureDatabase, Create database API
  - /influxdb3/enterprise/api/v3/#operation/PostConfigureTable, Create table API
  - /influxdb3/enterprise/api/v3/#operation/PatchConfigureDatabase, Update database API
  - /influxdb3/enterprise/reference/glossary/#retention-period
source: /shared/influxdb3-internals/data-retention.md
---

<!--
//SOURCE content/shared/influxdb3-internals/data-retention.md
-->
