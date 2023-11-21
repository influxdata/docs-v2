---
title: Manage API tokens
seotitle: Manage API tokens in InfluxDB
description: Manage API tokens in InfluxDB using the InfluxDB UI or the influx CLI.
influxdb/cloud/tags: [tokens, authentication, security]
menu:
  influxdb_cloud:
    name: Manage tokens
    parent: Administer InfluxDB Cloud
weight: 11
aliases:
  - /influxdb/cloud/users/tokens
  - /influxdb/cloud/security/tokens/
---

InfluxDB **API tokens** ensure secure interaction between users and data.
A token belongs to an organization and identifies InfluxDB permissions within the organization.

Learn how to create, view, update, or delete an API token.

## API token types

- [All-Access token](#all-access-token)
- [Read/Write token](#readwrite-token)

#### All-Access token
Grants full read and write access to all resources in an organization.

#### Read/Write token
Grants read access, write access, or both to specific buckets in an organization.

{{< children hlevel="h2" >}}
