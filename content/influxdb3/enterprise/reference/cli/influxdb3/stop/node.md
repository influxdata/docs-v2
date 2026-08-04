---
title: influxdb3 stop node
description: >
  The `influxdb3 stop node` command gracefully stops a cluster node: the node
  drains its write-ahead log (WAL) and confirms the stop before it reads as
  stopped, freeing its licensed cores for other nodes.
menu:
  influxdb3_enterprise:
    parent: influxdb3 stop
    name: influxdb3 stop node
weight: 301
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/remove/node/
  - /influxdb3/enterprise/admin/recover-node/
  - /influxdb3/enterprise/reference/cli/influxdb3/show/nodes/
  - /influxdb3/enterprise/reference/cli/influxdb3/serve/
source: /shared/influxdb3-cli/stop/node.md
canonical: self
---

<!--
//SOURCE - content/shared/influxdb3-cli/stop/node.md
-->
