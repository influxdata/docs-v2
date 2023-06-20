---
title: Manage API tokens
seotitle: Manage API tokens in InfluxDB
description: Manage API tokens in InfluxDB using the InfluxDB UI or the influx CLI.
influxdb/cloud-serverless/tags: [tokens, authentication, security]
menu:
  influxdb_cloud_serverless:
    name: Manage tokens
    parent: Administer InfluxDB Cloud
weight: 9
---

InfluxDB **API tokens** ensure secure interaction between InfluxDB and external
tools such as clients or applications.
An API token belongs to a specific user and identifies InfluxDB permissions
within an organization.

Learn how to create, view, update, or delete an API token.

## API token types

- [All-Access API token](#all-access-api-token)
- [Custom API token](#custom-api-token)

### All-Access API token
Grants full read and write access to all resources in an organization.

### Custom API token
Grants read access, write access, or both to specific resources in an organization.

---

{{< children hlevel="h2" >}}
