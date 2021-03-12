---
title: Remove a member
seotitle: Remove a member from an organization in InfluxDB
description: Remove a member from an organization.
menu:
  influxdb_2_0:
    name: Remove a member
    parent: Manage members
weight: 203
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to remove a member from an organization.

{{% note %}}
Removing a member from an organization removes all permissions associated with the organization,
but it does not delete the user from the system entirely.
For information about deleting a user from InfluxDB, see [Delete a user](/influxdb/v2.0/users/delete-user/).
{{% /note %}}

## Remove a member from an organization in the InfluxDB UI

1. In the navigation menu on the left, select **Org (Organization)** > **Members**.

    {{< nav-icon "org" >}}

2. Hover over the member you would like to delete and click the **{{< icon "delete" >}}** icon.
3. Click **Delete**.

## Remove a member from an organization using the influx CLI

Use the [`influx org members remove` command](/influxdb/v2.0/reference/cli/influx/org/members/remove)
to remove a member from an organization. Removing a member requires the following:

- The organization name or ID _(provided in the output of [`influx org list`](/influxdb/v2.0/reference/cli/influx/org/list/))_
- The member ID _(provided in the output of [`influx org members list`](/influxdb/v2.0/reference/cli/influx/org/members/list/))_

```sh
# Syntax
influx org members remove -o <member-id> -i <organization-id>

# Example
influx org members remove -o 00xXx0x00xXX0000 -i x0xXXXx00x0x000X
```
