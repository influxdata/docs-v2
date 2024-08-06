---
title: Manage users in your InfluxDB cluster
description: >
  Manage users with administrative access to your InfluxDB cluster through your
  identity provider and your InfluxDB `AppInstance` resource.
menu:
  influxdb_clustered:
    name: Manage users
    parent: Administer InfluxDB Clustered
weight: 102
cascade:
  related:
    - /influxdb/clustered/install/auth/
    - /influxdb/clustered/install/configure-cluster/
---

Manage users with administrative access to your InfluxDB cluster through your
[identity provider](/influxdb/clustered/install/auth/) and your InfluxDB
`AppInstance` resource. Administrative access lets users perform actions like
creating databases and tokens.

{{% note %}}
#### Users versus database tokens

All _users_ have administrative access to your cluster and can perform
administrative actions in your InfluxDB cluster.
_Database tokens_ authorize read and write access to databases in your InfluxDB
cluster. A person or client doesn't need to be a user to read and write data in your cluster,
but they must have a database token.
{{% /note %}}

{{< children >}}
