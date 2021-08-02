---
title: Create a user
seotitle: Create a user in InfluxDB
description: Create a user in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_2_0:
    name: Create a user
    parent: Manage users
weight: 101
products: [oss]
---

Use the `influx` command line interface (CLI) to create a user.

{{% note %}}
Additional users cannot be created in the InfluxDB UI.
{{% /note %}}

## Create a user using the influx CLI

To create a new user, use the [`influx user create` command](/influxdb/v2.0/reference/cli/influx/user/create)
and include the following:

- Username
- Organization name or organization ID to add the user to _(provided in the output of
  [`influx org list`](/influxdb/v2.0/reference/cli/influx/org/list/))_

```sh
# Syntax
influx user create -n <username> -o <org-name>

# Example
influx user create -n johndoe -o example-org
```

### Create a user with a password and organization
To create a new user with a password and add the user as a member of an organization,
include a password and organization ID with the `influx user create` command.

- Username
- Organization name or organization ID to add the user to _(provided in the output of
  [`influx org list`](/influxdb/v2.0/reference/cli/influx/org/list/))_
- Password

```sh
# Syntax
influx user create -n <username> -p <password> -o <org-name>

# Example
influx user create -n johndoe -p PaSsWoRd -o example-org
```
