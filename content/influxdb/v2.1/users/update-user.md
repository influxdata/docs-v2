---
title: Update a user
seotitle: Update a user in InfluxDB
description: Update a user in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_2_1:
    name: Update a user
    parent: Manage users
weight: 103
products: [oss]
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to update a user.

## Update a user in the InfluxDB UI

{{% note %}}
User information cannot be updated in the InfluxDB UI.
{{% /note %}}

## Update a user using the influx CLI

Use the [`influx user update` command](/influxdb/v2.1/reference/cli/influx/user/update)
to update a user. Updating a user requires the following:

- The user ID _(provided in the output of `influx user list`)_

##### Update the name of a user
```sh
# Syntax
influx user update -i <user-id> -n <new-username>

# Example
influx user update -i 034ad714fdd6f000 -n janedoe
```
