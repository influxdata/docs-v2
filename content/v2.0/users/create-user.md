---
title: Create a user
seotitle: Create a user in InfluxDB
description: Create a user in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  v2_0:
    name: Create a user
    parent: Manage users
weight: 101
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create a user.

## Create a user in the InfluxDB UI

{{% note %}}
While in alpha, additional users cannot be created in the InfluxDB UI.
{{% /note %}}

## Create a user using the influx CLI

Use the [`influx user create` command](/v2.0/reference/cli/influx/create/create)
to create a new user. A new user requires the following:

- A username

```sh
# Pattern
influx user create -n <username>

# Example
influx user create -n johndoe
```
