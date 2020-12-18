---
title: Manage authentication tokens
seotitle: Manage authentication tokens in InfluxDB
description: Manage authentication tokens in InfluxDB using the InfluxDB UI or the influx CLI.
aliases:
  - /influxdb/v2.0/users/tokens
influxdb/v2.0/tags: [tokens, authentication, security]
menu:
  influxdb_2_0:
    name: Manage tokens
    parent: Security & authorization
weight: 103
---

InfluxDB ensures secure interaction between users and data through the use of **authentication tokens**.
A token belongs to an organization and identifies InfluxDB permissions within the organization.

Learn how to create, view, update, or delete an authentication token.

{{% note %}}
#### Permissions for the initial user
The user created in the InfluxDB setup process has **full read and write access to
all organizations** in the database.
To prevent accidental interactions across organizations, we recommend
[creating an All Access token](/influxdb/v2.0/security/tokens/create-token/)
for each organization and using those to manage InfluxDB.
{{% /note %}}

{{< children >}}
