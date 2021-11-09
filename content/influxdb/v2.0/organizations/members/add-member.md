---
title: Add a member
seotitle: Add a member to an organization in InfluxDB
description: Add a member to an organization.
menu:
  influxdb_2_0:
    name: Add a member
    parent: Manage members
weight: 201
---

Use the `influx` command line interface (CLI) to add a member to an organization.

<!-- ## Add a member to an organization in the InfluxDB UI

1. In the navigation menu on the left, select **Org (Organization)** > **Members**.

    {{< nav-icon "org" "v2" >}}

_Complete content coming soon_ -->

## Add a member to an organization using the influx CLI

1. Get a list of users and their IDs by running the following:

```sh
influx user list
```

2. To add a user to an organization, run the following command:

```sh
influx org members add -n <org-name> -m <user-ID>
```

For more information, see the [`influx org members add` command](/influxdb/v2.0/reference/cli/influx/org/members/add).
