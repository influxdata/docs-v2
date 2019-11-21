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

Use the [`influx user create` command](/v2.0/reference/cli/influx/user/create)
to create a new user. A new user requires the following:

- A username

```sh
# Pattern
influx user create -n <username>

# Example
influx user create -n johndoe
```

### Create a user with a password and organization
To create a new user with a password and add the user as a member of an organization,
include a password and organization ID with the `influx user create` command.

_Use the [`influx org find` command](/v2.0/reference/cli/influx/org/find/)
to retrieve your organization ID._

```sh
# Pattern
influx user create -n <username> -p <password> -o <org-id>

# Example
influx user create -n johndoe -p PaSsWoRd -o 0o0x00o0x0000oo0
```
