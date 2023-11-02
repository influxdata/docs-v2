---
title: Add a member
seotitle: Add a member to an organization in InfluxDB
description: >
  Use the `influx` command line interface (CLI) to add a member to an organization
  and optionally make that member an owner across all organizations.
menu:
  influxdb_v2:
    name: Add a member
    parent: Manage members
weight: 201
aliases:
  - /influxdb/v2/organizations/members/add-member/
---

Use the `influx` command line interface (CLI) to add a member to an organization
and optionally make that member an owner across all organizations.

## Add a member to an organization using the influx CLI

1. Get a list of users and their IDs by running the following:

    ```sh
    influx user list
    ```

2. To add a user as a member of an organization, use the `influx org members add command`.
   Provide the following:
   
   - Organization name
   - User ID
   - _(Optional)_ `--owner` flag to add the user as an owner 
    _(requires an [operator token](/influxdb/v2/security/tokens/#operator-token))_

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Add member](#)
[Add owner](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influx org members add \
  -n <org-name> \
  -m <user-ID>
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influx org members add \
  -n <org-name> \
  -m <user-ID> \
  --owner
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

For more information, see the [`influx org members add` command](/influxdb/v2/reference/cli/influx/org/members/add).
