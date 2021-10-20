---
title: Get started with authentication and authorization
description: >
  Learn the basics of managing authentication and authorization in InfluxDB Enterprise
menu:
  enterprise_influxdb_1_9:
    name: Get started with authentication and authorization
    parent: Manage security
weight: 30
related:
  - /enterprise_influxdb/v1.9/guides/fine-grained-authorization/
  - /{{< latest "chronograf" >}}/administration/managing-influxdb-users/
---

{{% note %}}
#### Authentication recommended on public endpoints
If InfluxDB Enterprise is being deployed on a publicly accessible endpoint,
we strongly recommend enabling authentication.
Otherwise, data and potentially destructive commands will be publicly available to any unauthenticated user.
For additional security,
InfluxDB Enterprise should be run behind a third-party service.
Authentication and authorization should not be soley relied upon
to prevent access and protect data from malicious actors.
{{% /note %}}

## Introduction

This guide covers the methods and mechanisms for securing and managing access to a cluster.
There are two aspects: 
*authentication* (verifying a user's identity)
and *authorization* (verifying what the user has access to).

In InfluxDB Enterprise authentication *must* be enabled before *authorization* can be managed.

In InfluxB 1.x OSS, there are only database permissions.
InfluxDB Enterprise has an array of permissions.


There are three ways to manage permissions.
Each is useful in different scenarios.
The methods are:

- [`influx` CLI]() (1.x) and InfluxQL
- [Chronograf]()
- InfluxDB Enterprise meta API

<!-- Also need to handle Chronograf and Kapacitor permssions. -->

All of theses methods allow you to manage specific permissions for users by database.
For example, you can grant Alice the ability to write to a database *X*,
and then grant Bob the ability to read from that database.

### Enable authentication

After [installing the data nodes](),
we recommend enabling authenticating right away to control access to you cluster.

Authentication is disabled by default in InfluxDB and InfluxDB Enterprise.
All credentials are silently ignored, and all users have all privileges.

To enable authentication in a cluster, do the following:

1. Set all `auth-enabled` options to `true` in the `[http]` section of all meta and data nodes:
   ```toml
   [http]
     [...<snip>...]
     auth-enabled = true # Set to true
     pprof-auth-enabled = true
     ping-auth-enabled = true
     [...<snip>...]
   ```
1. **Create an [admin user](#admin-users)**.

   To create an admin user,
   run the following command using the [`influx` CLI](/enterprise_influxdb/v1.9/tools/influx-cli/):
   ```
   CREATE USER admin WITH PASSWORD 'mypassword' WITH ALL PRIVILEGES
   ```
1. **Restart InfluxDB Enterprise**.
   Once restarted, InfluxDB Enterprise checks user credentials on every request and only
   processes requests that have valid credentials for an existing user.

## Manage authorizations

### InfluxQL
### Chronograf
### API

- How can I use API to grant N permissions to N users?

```sh
curl -v \
    -H "Content-Type: application/json" \
    -X POST \
    -d '{"action":"create", "user":{"name": "admin", "password": "admin", "permissions":{"":["CreateDatabase","CreateUserAndRole","DropData","DropDatabase","ManageQuery","ManageContinuousQuery","ManageShard","ManageSubscription","Monitor","ReadData","ViewAdmin","ViewChronograf","WriteData"]}}}' \
    -H "Authorization: Bearer $(./influxd-ctl -auth-type jwt -secret foo2 token)" \
    localhost:8191/user

{
  "action": "create",
  "user": {
    "name": "admin",
    "password": "admin",
    "permissions": {
      "": [
        "CreateDatabase",
        "CreateUserAndRole",
        "DropData",
        "DropDatabase",
        "ManageQuery",
        "ManageContinuousQuery",
        "ManageShard",
        "ManageSubscription",
        "Monitor",
        "ReadData",
        "ViewAdmin",
        "ViewChronograf",
        "WriteData"
      ]
    }
  }
}
```
