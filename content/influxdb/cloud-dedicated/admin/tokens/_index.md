---
title: Manage tokens
seotitle: Manage tokens in InfluxDB Cloud Dedicated
description: >
  Manage database tokens in your InfluxDB Cloud Dedicated cluster.
  Database tokens grant read and write permissions to one or more databases and
  allow for actions like writing and querying data.
menu:
  influxdb_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 101
influxdb/cloud-dedicated/tags: [tokens]
aliases:
  - /influxdb/cloud-dedicated/security/tokens/
---

InfluxDB uses token authentication to authorize access to data in your
{{< product-name omit=" Clustered" >}} cluster.
There are two types of tokens:

- [Management tokens](#management-tokens)
- [Database tokens](#database-tokens)

#### Management tokens

Management tokens grant permission to perform administrative actions such as
managing users, databases, and database tokens.
Management tokens allow clients, such as the
[`influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/),
to perform administrative actions.

#### Database tokens

Database tokens grant read and write permissions to one or more databases
and allows for actions like writing and querying data.

All read and write actions performed against time series data in your InfluxDB
Cloud Dedicated cluster must be authorized using a token. 

{{% note %}}
#### Store secure tokens in a secret store

Token strings are returned _only_ on token creation.
We recommend storing database tokens in a **secure secret store**.
For example, see how to [authenticate Telegraf using tokens in your OS secret store](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/os).
{{% /note %}}

---

{{< children hlevel="h2" readmore=true hr=true >}}
