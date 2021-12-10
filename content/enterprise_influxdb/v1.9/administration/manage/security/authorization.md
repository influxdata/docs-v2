---
title: Manage authorization
description: >
  Set up and manage authorization in InfluxDB Enterprise.
menu:
  enterprise_influxdb_1_9:
    name: Manage authorization
    parent: Manage security
weight: 41
related:
  - /enterprise_influxdb/v1.9/guides/fine-grained-authorization/
  - /{{< latest "chronograf" >}}/administration/managing-influxdb-users/
aliases:
  - /enterprise_influxdb/v1.9/administration/authentication_and_authorization/
---

This document covers setting up and managing authorization in InfluxDB Enterprise.

- [User Types and Privileges](#user-types-and-privileges)
- [User Management Commands](#user-management-commands)
- [HTTP Errors](#authentication-and-authorization-http-errors)

## Authorization

Authorization in InfluxDB Enterprise refers to managing user permissions.
To enable authorization, you must first [enable authentication](/enterprise_influxdb/v1.9/administration/configure/security/authentication/).

This page shows examples of basic user and permission management using InfluxQL statements.
However, *only a subset of Enterprise permissions can be managed with InfluxQL.*
Using InfluxQL, you can perform the following actions:

- Create new users and assign them either the admin role (or no role).
- grant READ and/or WRITE permissions to users.  (READ, WRITE, ALL)
- REVOKE permissions from users.
- GRANT or REVOKE specific database access to individual users.

Consider using [Chronograf](/{{< latest "chronograf" >}}/administration/managing-influxdb-users/)
and/or the [Enterprise meta API](/enterprise_influxdb/v1.9/administration/manage/security/authentication_and_authorization-api/)
to manage InfluxDB Enterprise users and roles.

However, InfluxDB Enterprise offers more granular permissions than InfluxDB OSS.
You can use Chronograf to access and assign these more granular permissions to individual users.

The [InfluxDB Enterprise meta API](/enterprise_influxdb/v1.9/administration/manage/security/authentication_and_authorization-api/)
provides the most comprehensive way to manage users, roles, permission
and other [fine grained authorization](/enterprise_influxdb/v1.9/administration/manage/security/fine-grained-authorization/) (FGA) capabilities.

<!-- You cannot specify per-database permissions (grants) for users via Chronograf. -->

### User types and privileges

InfluxDB Enterprise has the following kinds of users:

- [Admin users](#admin-users)
- [Non-admin users](#non-admin-users)

#### Admin users

Admin users have the following permissions:

| Permission                | Description                                             | Token                  |
|:--------------------------|---------------------------------------------------------|------------------------|
| View Admin                | Permission to view or edit admin screens                | `ViewAdmin`            |
| View Chronograf           | Permission to use Chronograf tools                      | `ViewChronograf`       |
| Create Databases          | Permission to create databases                          | `CreateDatabase`       |
| Create Users & Roles      | Permission to create users and roles                    | `CreateUserAndRole`    |
| Add/Remove Nodes          | Permission to add/remove nodes from a cluster           | `AddRemoveNode`        |
| Drop Databases            | Permission to drop databases                            | `DropDatabase`         |
| Drop Data                 | Permission to drop measurements and series              | `DropData`             |
| Read                      | Permission to read data                                 | `ReadData`             |
| Write                     | Permission to write data                                | `WriteData`            |
| Rebalance                 | Permission to rebalance a cluster                       | `Rebalance`            |
| Manage Shards             | Permission to copy and delete shards                    | `ManageShard`          |
| Manage Continuous Queries | Permission to create, show, and drop continuous queries | `ManageContnuousQuery` |
| Manage Queries            | Permission to show and kill queries                     | `ManageQuery`          |
| Manage Subscriptions      | Permission to show, add, and drop subscriptions         | `ManageSubscription`   |
| Monitor                   | Permission to show stats and diagnostics                | `Monitor`              |
| Copy Shard                | Permission to copy shards                               | `CopyShard`            |

{{% caption %}}
For more information about these commands,
see [Database management](/enterprise_influxdb/v1.9/query_language/manage-database/) and
[Continuous queries](/enterprise_influxdb/v1.9/query_language/continuous_queries/).
{{% /caption %}}

<!--
Admin users have access to the following user management commands:

| Admin user management                                                           | Non-admin user management                                                                        | General user management                   |
|:--------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|-------------------------------------------|
| [`CREATE USER`](#user-management-commands)                                      | [`CREATE USER`](#user-management-commands)                                                       | [`SET PASSWORD`](#reset-a-users-password) |
| [`GRANT ALL PRIVILEGES`](#grant-administrative-privileges-to-an-existing-user)  | [`GRANT [READ,WRITE,ALL]`](#grant-read-write-or-all-database-privileges-to-an-existing-user)     | [`DROP USER`](#drop-a-user)               |
| [`REVOKE ALL PRIVILEGES`](#revoke-administrative-privileges-from-an-admin-user) | [`REVOKE [READ,WRITE,ALL]`](#revoke-read-write-or-all-database-privileges-from-an-existing-user) |                                           |
| [`SHOW USERS`](#show-all-existing-users-and-their-admin-status)                 |                                                                                                  |                                           |

{{% caption %}}
See [below](#user-management-commands) for a complete discussion of the user management commands.
{{% /caption %}}
-->

#### Non-admin users

When authentication is enabled
a new non-admin user has no access to any database
until they are specifically [granted privileges to a database](#grant-read-write-or-all-database-privileges-to-an-existing-user)
by an admin user.

Non-admin users can [`SHOW`](/enterprise_influxdb/v1.9/query_language/explore-schema/#show-databases)
the databases for which they have `ReadData` or `WriteData` permissions.

### User management commands

User management commands apply to either
[admin users](#manage-admin-users),
[non-admin users](#manage-non-admin-users),
or [both](#manage-admin-and-non-admin-users).

#### Manage admin users

Create an admin user with:

```sql
CREATE USER admin WITH PASSWORD '<password>' WITH ALL PRIVILEGES
```

{{% note %}}
Repeating the exact `CREATE USER` statement is idempotent.
If any values change the database will return a duplicate user error.

```sql
> CREATE USER todd WITH PASSWORD '123456' WITH ALL PRIVILEGES
> CREATE USER todd WITH PASSWORD '123456' WITH ALL PRIVILEGES
> CREATE USER todd WITH PASSWORD '123' WITH ALL PRIVILEGES
ERR: user already exists
> CREATE USER todd WITH PASSWORD '123456'
ERR: user already exists
> CREATE USER todd WITH PASSWORD '123456' WITH ALL PRIVILEGES
>
```
{{% /note %}}

##### `GRANT` administrative privileges to an existing user
```sql
GRANT ALL PRIVILEGES TO <username>
```

##### `REVOKE` administrative privileges from an admin user
```sql
REVOKE ALL PRIVILEGES FROM <username>
```

##### `SHOW` all existing users and their admin status
```sql
SHOW USERS
```

###### CLI Example
```sql
> SHOW USERS
user 	   admin
todd     false
paul     true
hermione false
dobby    false
```

#### Manage non-admin users

##### `CREATE` a new non-admin user
```sql
CREATE USER <username> WITH PASSWORD '<password>'
```

###### CLI example
```js
> CREATE USER todd WITH PASSWORD 'influxdb41yf3'
> CREATE USER alice WITH PASSWORD 'wonder\'land'
> CREATE USER "rachel_smith" WITH PASSWORD 'asdf1234!'
> CREATE USER "monitoring-robot" WITH PASSWORD 'XXXXX'
> CREATE USER "$savyadmin" WITH PASSWORD 'm3tr1cL0v3r'
```

{{% note %}}
##### Important notes about providing user credentials
- The user value must be wrapped in double quotes if
  it starts with a digit, is an InfluxQL keyword, contains a hyphen,
  or includes any special characters (for example: `!@#$%^&*()-`).
- The password [string](/influxdb/v1.8/query_language/spec/#strings) must be wrapped in single quotes.
  Do not include the single quotes when authenticating requests.
  We recommend avoiding the single quote (`'`) and backslash (`\`) characters in passwords.
  For passwords that include these characters, escape the special character with a backslash
  (e.g. (`\'`) when creating the password and when submitting authentication requests.
- Repeating the exact `CREATE USER` statement is idempotent.
  If any values change the database will return a duplicate user error.

###### CLI example
```sql
> CREATE USER "todd" WITH PASSWORD '123456'
> CREATE USER "todd" WITH PASSWORD '123456'
> CREATE USER "todd" WITH PASSWORD '123'
ERR: user already exists
> CREATE USER "todd" WITH PASSWORD '123456'
> CREATE USER "todd" WITH PASSWORD '123456' WITH ALL PRIVILEGES
ERR: user already exists
> CREATE USER "todd" WITH PASSWORD '123456'
>
```
{{% /note %}}

##### `GRANT` `READ`, `WRITE` or `ALL` database privileges to an existing user

```sql
GRANT [READ,WRITE,ALL] ON <database_name> TO <username>
```

CLI examples:

`GRANT` `READ` access to `todd` on the `NOAA_water_database` database:

```sql
> GRANT READ ON "NOAA_water_database" TO "todd"
```

`GRANT` `ALL` access to `todd` on the `NOAA_water_database` database:

```sql
> GRANT ALL ON "NOAA_water_database" TO "todd"
```

##### `REVOKE` `READ`, `WRITE`, or `ALL` database privileges from an existing user

```
REVOKE [READ,WRITE,ALL] ON <database_name> FROM <username>
```

CLI examples:

`REVOKE` `ALL` privileges from `todd` on the `NOAA_water_database` database:

```sql
> REVOKE ALL ON "NOAA_water_database" FROM "todd"
```

`REVOKE` `WRITE` privileges from `todd` on the `NOAA_water_database` database:

```sql
> REVOKE WRITE ON "NOAA_water_database" FROM "todd"
```

{{% note %}}
If a user with `ALL` privileges has `WRITE` privileges revoked, they are left with `READ` privileges, and vice versa.
{{% /note %}}

##### `SHOW` a user's database privileges

```sql
SHOW GRANTS FOR <user_name>
```

CLI example:

```sql
> SHOW GRANTS FOR "todd"
database		            privilege
NOAA_water_database	        WRITE
another_database_name	    READ
yet_another_database_name   ALL PRIVILEGES
one_more_database_name      NO PRIVILEGES
```

#### Manage admin and non-admin users

##### Reset a user's password

```sql
SET PASSWORD FOR <username> = '<password>'
```

CLI example:

```sql
> SET PASSWORD FOR "todd" = 'password4todd'
```

{{% note %}}
The password [string](/influxdb/v1.8/query_language/spec/#strings) must be wrapped in single quotes.
Do not include the single quotes when authenticating requests.

We recommend avoiding the single quote (`'`) and backslash (`\`) characters in passwords
For passwords that include these characters, escape the special character with a backslash (e.g. (`\'`) when creating the password and when submitting authentication requests.
{{% /note %}}

##### `DROP` a user

```sql
DROP USER <username>
```

CLI example:

```sql
> DROP USER "todd"
```

## Authentication and authorization HTTP errors

Requests with no authentication credentials or incorrect credentials yield the `HTTP 401 Unauthorized` response.

Requests by unauthorized users yield the `HTTP 403 Forbidden` response.
