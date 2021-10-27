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

<!--
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
-->

This guide covers the basics of securing and managing access to an InfluxDB Enterprise cluster.
There are two aspects to consider: 
*authentication* (verifying a user's identity)
and *authorization* (verifying what the user has access to).

<!-- After enabling authentication, we will walk through some basic examples of managing users and permissions. -->

## Enable authentication

In InfluxDB Enterprise authentication must be enabled *before* authorization can be managed.

Authentication is disabled by default in InfluxDB and InfluxDB Enterprise.

Once you have a working cluster
(that is, after [installing the data nodes](/enterprise_influxdb/v1.9/introduction/install-and-deploy/installation/data_node_installation/)),
we recommend enabling authenticatiion right away to control access to you cluster.

To enable authentication in a cluster, do the following:

1. Set `auth-enabled` to `true` in the `[http]` section of the config files for all meta and data nodes:
   ```toml
   [http]
     # ...
     auth-enabled = true
   ```
1. Next, create an admin user.
   Using the [`influx` CLI](/enterprise_influxdb/v1.9/tools/influx-cli/),
   run the following command:
   ```
   CREATE USER admin WITH PASSWORD 'mypassword' WITH ALL PRIVILEGES
   ```
   <!-- when you run this command, it gives all but the 4 extra permissions -->
1. Restart InfluxDB Enterprise.
   Once restarted, InfluxDB Enterprise will now check user credentials on every request
   and only processes requests that have valid credentials.
   <!-- What's the best way to restart? -->

## Permissions in InfluxDB Enterprise

InfluxDB Enterprise has an expanded set of permissions, compared to InfluxDB OSS.
In InfluxB 1.x OSS, there are only database-level privileges.
([Fine-grained authorization]() is not available.)
The three privileges in OSS are `read`, `write`, and `all`.

In addition to these three basic database-level permissions,
_which can only be granted by InfluxQL_,
InfluxDB Enterprise's [full set of permissions](/enterprise_influxdb/v1.9/administration/manage/security/authentication_and_authorization-api/#list-of-available-privileges)
allows for controling read and write access to data to all databases at once,
as well as cluster-management actions like creating or deleting resources.

## Available methods for managing authorization

There are three ways to manage authorizations in InfluxDB Enterprise.
Each is useful in different scenarios.
The methods are:

- the [`influx` CLI](#influxql) (1.x) with [InfluxQL](#influxql)
- [Chronograf]()
- the InfluxDB Enterprise meta API

Each of these allows you to manage specific permissions for users by database.

<!-- Also need to handle Chronograf and Kapacitor permssions. -->

### Manage read and write privileges with InfluxQL

InfluxQL can be used to manage basic read and write privileges.
For example, you can grant Alice the ability to write to a database *X*,
and then grant Bob the ability to read from that database.

To demonstrate, let's create a new user and allow them some access.
First, log in as an admin user.
The simplest way to do this is to use the `auth` command.

```sh
$ influx
Connected to http://localhost:8086 version 1.9.5-c1.9.5
InfluxDB shell version: 1.8.7
> auth
```

This will prompt for username and password.
Enter the credentials for the admin you created above in ["Enable authentication"](#enable-authentication).

Then run:

```sh
> CREATE USER alice WITH PASSWORD 'admin'
```

This creates a regular, non-admin user.

Since we are logged in as an admin user, we can create a database.
Create a database called `test` by running

```sh
> CREATE DATABASE test
```

Now we can grant Alice permission to write to the `test` database.

```sh
> GRANT WRITE ON test TO alice
```

We can inspect Alice's permissions with

```sh
> SHOW GRANTS FOR alice
database privilege
-------- ---------
test     WRITE
```

InfluxQL provides a quick way to grant read and write privileges.
However, you can only grant `READ`, `WRITE`, and `ALL` (admin) privileges with this method.

### Manage specific privileges with Chronograf

The Chronograf user interface can manage the [full set of permissions](/enterprise_influxdb/v1.9/administration/manage/security/authentication_and_authorization-api/#list-of-available-privileges).

The permissions listed in Chronograf (and available through the API) are global for the cluster.
Outside of [FGA](), the only database-level permissions available are read and write.
These can only be managed using [the `influx` CLI and InfluxQL](#manage-read-and-write-privileges-with-influxql).

### API

The API offers the greatest flexibility when managing authorization.
It can be used to automate.

<!-- How does `NoPermissions` behave? https://github.com/influxdata/plutonium/blob/master/meta/data.go#L1833 -->

- How can I use the API to grant N permissions to N users?

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

Create a user with some permissions:

```json
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

