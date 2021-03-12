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

## Authentication token types

- [Admin token](#admin-token)
- [All-Access token](#all-access-token)
- [Read/Write token](#readwrite-token)

#### Admin token
Grants full read and write access to all resources in **all organizations in InfluxDB OSS 2.x**.

{{% note %}}
Admin tokens are created in the InfluxDB setup process and cannot be created manually.
Because Admin tokens have full read and write access to all organizations in the database,
we recommend [creating an All-Access token](/influxdb/v2.0/security/tokens/create-token/)
for each organization and using those to manage InfluxDB.
This helps to prevent accidental interactions across organizations.
{{% /note %}}

#### All-Access token
Grants full read and write access to all resources in an organization.

#### Read/Write token
Grants read or write access to specific resources in an organization.

{{< children hlevel="h2" >}}
