---
title: Recover user credentials
seotitle: Recover InfluxDB user credentials
description: Recover InfluxDB user credentials using the influx CLI.
menu:
  influxdb_v2:
    name: Recover credentials
    parent: Manage users
weight: 106
aliases:
  - /influxdb/v2/users/recover-credentials/
related:
  - /influxdb/v2/reference/cli/influxd/recovery/
---

Use the `influxd` command line interface (CLI) to recover user credentials and
regain access to your InfluxDB instance:

- [Update a password](#update-a-password)
- [List existing users in the InfluxDB instance](#list-existing-users-in-the-influxdb-instance)
- [Create a user for recovery purposes](#create-a-user-for-recovery-purposes)

## Update a password

To update a password, run the following:

```sh
influxd recovery user update \
  --username example-username \
  --password ExAmPL3-paS5W0rD
```

{{% note %}}
**Note:** If you're not sure of the username, [list existing users in the InfluxDB instance](#list-existing-users-in-the-influxdb-instance) or [create a user for recovery purposes](#create-a-user-for-recovery-purposes).
{{% /note %}}

## List existing users in the InfluxDB instance

To list existing users in the system, run the following:

```sh
influxd recovery user list
```

{{% note %}}
If you used a [custom `bolt-path`](/influxdb/v2/reference/config-options/#bolt-path) when starting InfluxDB, provide your custom bolt path to the `influx recovery user list` command with the `--bolt-path` flag.
{{% /note %}}

## Create a user for recovery purposes

To create a new user for recovery purposes, run the following:

```sh
influxd recovery user create \
  --username example-username \
  --password ExAmPL3-paS5W0rD
```
