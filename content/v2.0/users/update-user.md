---
title: Update a user
seotitle: Update a user in InfluxDB
description: placeholder
menu:
  v2_0:
    name: Update a user
    parent: Manage users
    weight: 3
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to update a user.

## Update a user in the InfluxDB UI

_Complete content coming soon_

## Update a user using the influx CLI

Use the the [`influx user update` command](/v2.0/reference/cli/influx/user/update)
to update a user. Updating a user requires the following:

- The user ID _(provided in the output of `influx user find`)_

##### Update the name of a user
```sh
# Pattern
influx user update -i <user-id> -n <new-username>

# Example
influx user update -i 034ad714fdd6f000 -n janedoe
```
