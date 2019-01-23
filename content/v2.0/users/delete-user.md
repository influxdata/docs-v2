---
title: Delete a user
seotitle: Delete a user from InfluxDB
description: Delete a user from InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  v2_0:
    name: Delete a user
    parent: Manage users
    weight: 3
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create a user.

## Delete a user from the InfluxDB UI

_Complete content coming soon_

## Delete a user using the influx CLI

Use the [`influx user delete` command](/v2.0/reference/cli/influx/user/delete)
to delete a user. Deleting a user requires the following:

- The user ID _(provided in the output of `influx user find`)_

```sh
# Pattern
influx user delete -i <user-id>

# Example
influx user delete -i 034ad714fdd6f000
```
