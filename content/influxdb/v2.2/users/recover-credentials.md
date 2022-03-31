---
title: Recover user credentials
seotitle: Recover InfluxDB user credentials
description: Recover InfluxDB user credentials using the influx CLI.
menu:
  influxdb_2_2:
    name: Recover credentials
    parent: Manage users
weight: 106
products: [oss]
---

Use the `influx` command line interface (CLI) to recover user credentials, view all users in the system, or update a password.

### Recover all users

To recover all users in the system, run the following:

```sh
influxd recovery user list \
// by default, path to BoltDB file is `~.influxdbv2/influxd.bolt`, change as needed
--bolt-path
```

### Create a user for recovery purposes

To create a new user for recovery purposes, run the following:

```sh
influxd recovery user create \
--username example-username \
--password ExAmPL3-paS5W0rD
```

## Update a password

To update a password, run the following:

```sh
influxd recovery user update \
--username example-username \
--password ExAmPL3-paS5W0rD
```
