---
title: Manage tokens
seotitle: Manage tokens in InfluxDB Clustered
description: >
  Manage database tokens in your InfluxDB cluster.
  Database tokens grant read and write permissions to one or more databases and
  allow for actions like writing and querying data.
menu:
  influxdb3_clustered:
    parent: Administer InfluxDB Clustered
weight: 103
influxdb/clustered/tags: [tokens]
---

InfluxDB uses token authentication to authorize access to data in your
{{< product-name omit=" Clustered" >}} cluster.
With {{< product-name >}}, there are two types of tokens:

- [Database tokens](#database-tokens)
- [Management tokens](#management-tokens)

#### Database tokens

Database tokens grant read and write permissions to one or more databases
and allows for actions like writing and querying data.

All read and write actions performed against time series data in your
{{< product-name omit=" Clustered" >}} cluster must be authorized using a token. 

#### Management tokens

Management tokens grant permission to perform administrative actions such as
managing users, databases, and database tokens.
Management tokens allow clients, such as the
[`influxctl` CLI](/influxdb3/clustered/reference/cli/influxctl/),
to perform administrative actions.

> [!Note]
> #### Store secure tokens in a secret store
> 
> Token strings are returned _only_ on token creation.
> Store database tokens in a **secure secret store**.
> For example, see how to [authenticate Telegraf using tokens in your OS secret store](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/os).

---

{{< children hlevel="h2" readmore=true hr=true >}}
