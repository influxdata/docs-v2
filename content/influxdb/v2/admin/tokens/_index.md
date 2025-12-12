---
title: Manage API tokens
seotitle: Manage API tokens in InfluxDB
description: Manage API tokens in InfluxDB using the InfluxDB UI or the influx CLI.
influxdb/v2/tags: [tokens, authentication, security]
menu:
  influxdb_v2:
    name: Manage tokens
    parent: Administer InfluxDB
weight: 11
aliases:
  - /influxdb/v2/users/tokens
  - /influxdb/v2/security/tokens/
---

InfluxDB **API tokens** ensure secure interaction between InfluxDB and external tools such as clients or applications.
An API token belongs to a specific user and identifies InfluxDB permissions within the user's organization.

Learn how to create, view, update, or delete an API token.

## API token types

- [Operator API token](#operator-token)
- [All Access API token](#all-access-token)
- [Read/Write token](#readwrite-token)

### Operator token
Grants full read and write access to **all organizations and all organization resources in InfluxDB OSS 2.x**.
Some operations, e.g. [retrieving the server configuration](/influxdb/v2/reference/config-options/), require operator permissions.
Operator tokens are created in the InfluxDB setup process.
To [create an operator token manually](/influxdb/v2/admin/tokens/create-token/) with the InfluxDB UI, `api/v2` API, or `influx` CLI after the setup process is completed, you must use an existing [Operator token](/influxdb/v2/admin/tokens/#operator-token).

To create a new Operator token without using an existing one, see how to use the [`influxd recovery auth`](/influxdb/v2/reference/cli/influxd/recovery/auth/) CLI.

{{% note %}}
Because Operator tokens have full read and write access to all organizations in the database,
we recommend [creating an All Access token](/influxdb/v2/admin/tokens/create-token/)
for each organization and using those to manage InfluxDB.
This helps to prevent accidental interactions across organizations.
{{% /note %}}

### All Access token
Grants full read and write access to all resources in an organization.

### Read/Write token
Grants read access, write access, or both to specific buckets in an organization.

{{< children hlevel="h2" >}}
