---
title: Create a user
seotitle: Create a user in InfluxDB
description: placeholder
menu:
  v2_0:
    name: Create a user
    parent: Manage users
    weight: 1
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create a user.

## Create a user in the InfluxDB UI

_Complete content coming soon_

## Create a user using the influx CLI

Use the the [`influx user create` command](/v2.0/reference/cli/influx/create/create)
to create a new user. A new user requires the following:

- A username

```sh
# Pattern
influx user create -n <username>

# Example
influx user create -n johndoe
```
