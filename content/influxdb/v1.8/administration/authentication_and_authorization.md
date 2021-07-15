---
title: Authentication and authorization in InfluxDB
description: Set up and manage authentication and authorization in InfluxDB OSS.
aliases:
  /influxdb/v1.8/query_language/authentication_and_authorization/
menu:
  influxdb_1_8:
    name: Manage authentication and authorization
    weight: 20
    parent: Administration
v2: /influxdb/v2.0/security/tokens/
---

This document covers setting up and managing authentication and authorization in InfluxDB.

- [Authentication](#authentication)
  - [Set up Authentication](#set-up-authentication")
  - [Authenticate Requests](#authenticate-requests)
- [Authorization](#authorization)
  - [User Types and Privileges](#user-types-and-privileges)
  - [User Management Commands](#user-management-commands)
- [HTTP Errors](#authentication-and-authorization-http-errors)

{{% note %}}
Authentication and authorization should not be relied upon to prevent access and protect data from malicious actors.
If additional security or compliance features are desired, InfluxDB should be run behind a third-party service. If InfluxDB is
being deployed on a publicly accessible endpoint, we strongly recommend authentication be enabled. Otherwise the data will be
publicly available to any unauthenticated user.
{{% /note %}}

## Authentication

The InfluxDB API and the [command line interface](/influxdb/v1.8/tools/shell/) (CLI), which connects to the database using the API, include simple, built-in authentication based on user credentials.
When you enable authentication, InfluxDB only executes HTTP requests that are sent with valid credentials.

{{% note %}}
Authentication only occurs at the HTTP request scope.
Plugins do not currently have the ability to authenticate requests and service
endpoints (for example, Graphite, collectd, etc.) are not authenticated.
{{% /note %}}

### Set up authentication

1.  **Create at least one [admin user](#admin-users)**.
    See the [authorization section](#authorization) for how to create an admin user.

    {{% note %}}
If you enable authentication and have no users, InfluxDB will **not** enforce authentication
and will only accept the [query](#user-management-commands) that creates a new admin user.
    {{% /note %}}

    InfluxDB will enforce authentication once there is an admin user.

2.  **Enable authentication in your configuration file**
    by setting the `auth-enabled` option to `true` in the `[http]` section:

    ```toml
    [http]
      enabled = true
      bind-address = ":8086"
      auth-enabled = true # Set to true
      log-enabled = true
      write-tracing = false
      pprof-enabled = true
      pprof-auth-enabled = true
      debug-pprof-enabled = false
      ping-auth-enabled = true
      https-enabled = true
      https-certificate = "/etc/ssl/influxdb.pem"
    ```

    {{% note %}}
If `pprof-enabled` is set to `true`, set `pprof-auth-enabled` and `ping-auth-enabled`
to `true` to require authentication on profiling and ping endpoints.
    {{% /note %}}

3.  **Restart InfluxDB**.
    Once restarted, InfluxDB checks user credentials on every request and only
    processes requests that have valid credentials for an existing user.

### Authenticate requests

#### Authenticate with the InfluxDB API

There are two options for authenticating with the [InfluxDB API](/influxdb/v1.8/tools/api/).

If you authenticate with both Basic Authentication **and** the URL query parameters, the user credentials specified in the query parameters take precedence.
The queries in the following examples assume that the user is an [admin user](#admin-users).
See the section on [authorization](#authorization) for the different user types, their privileges, and more on user management.

> **Note:** InfluxDB redacts passwords when you enable authentication.

##### Authenticate with Basic Authentication
```bash
curl -G http://localhost:8086/query \
  -u todd:influxdb4ever \
  --data-urlencode "q=SHOW DATABASES"
```

##### Authenticate with query parameters in the URL or request body
Set `u` as the username and `p` as the password.

###### Credentials as query parameters
```bash
curl -G "http://localhost:8086/query?u=todd&p=influxdb4ever" \
  --data-urlencode "q=SHOW DATABASES"
```

###### Credentials in the request body
```bash
curl -G http://localhost:8086/query \
  --data-urlencode "u=todd" \
  --data-urlencode "p=influxdb4ever" \
  --data-urlencode "q=SHOW DATABASES"
```

#### Authenticate with the CLI

There are three options for authenticating with the [CLI](/influxdb/v1.8/tools/shell/).

##### Authenticate with environment variables
Use the `INFLUX_USERNAME` and `INFLUX_PASSWORD` environment variables to provide
authentication credentials to the `influx` CLI.

```bash
export INFLUX_USERNAME=todd
export INFLUX_PASSWORD=influxdb4ever
echo $INFLUX_USERNAME $INFLUX_PASSWORD
todd influxdb4ever

influx
Connected to http://localhost:8086 version 1.4.x
InfluxDB shell 1.4.x
```

##### Authenticate with CLI flags
Use the `-username` and `-password` flags to provide authentication credentials
to the `influx` CLI.

```bash
influx -username todd -password influxdb4ever
Connected to http://localhost:8086 version 1.4.x
InfluxDB shell 1.4.x
```

##### Authenticate with credentials in the influx shell
Start the `influx` shell and run the `auth` command.
Enter your username and password when prompted.

```bash
> influx
Connected to http://localhost:8086 version 1.4.x
InfluxDB shell 1.8.x
> auth
username: todd
password:
>
```

#### Authenticate using JWT tokens
For a more secure alternative to using passwords, include JWT tokens with requests to the InfluxDB API.
This is currently only possible through the [InfluxDB HTTP API](/influxdb/v1.8/tools/api/).

1. [Add a shared secret in your InfluxDB configuration file](#add-a-shared-secret-in-your-influxdb-configuration-file)
2. [Generate your JWT token](#generate-your-jwt-token)
3. [Include the token in HTTP requests](#include-the-token-in-http-requests)

##### Add a shared secret in your InfluxDB configuration file
InfluxDB uses the shared secret to encode the JWT signature.
By default, `shared-secret` is set to an empty string, in which case no JWT authentication takes place.
Add a custom shared secret in your [InfluxDB configuration file](/influxdb/v1.8/administration/config/#shared-secret).
The longer the secret string, the more secure it is:

```toml
[http]
  shared-secret = "my super secret pass phrase"
```

Alternatively, to avoid keeping your secret phrase as plain text in your InfluxDB configuration file, set the value with the `INFLUXDB_HTTP_SHARED_SECRET` environment variable.


##### Generate your JWT token
Use an authentication service to generate a secure token using your InfluxDB username, an expiration time, and your shared secret.
There are online tools, such as [https://jwt.io/](https://jwt.io/), that will do this for you.

The payload (or claims) of the token must be in the following format:

```json
{
  "username": "myUserName",
  "exp": 1516239022
}
```

- **username** - The name of your InfluxDB user.  
- **exp** - The expiration time of the token in UNIX epoch time.
  For increased security, keep token expiration periods short.
  For testing, you can manually generate UNIX timestamps using [https://www.unixtimestamp.com/index.php](https://www.unixtimestamp.com/index.php).

Encode the payload using your shared secret.
You can do this with either a JWT library in your own authentication server or by hand at [https://jwt.io/](https://jwt.io/).

The generated token follows this format: `<header>.<payload>.<signature>`

##### Include the token in HTTP requests
Include your generated token as part of the ``Authorization`` header in HTTP requests.
Use the ``Bearer`` authorization scheme:

```
Authorization: Bearer <myToken>
```
{{% note %}}
Only unexpired tokens will successfully authenticate.
Be sure your token has not expired.
{{% /note %}}

###### Example query request with JWT authentication
```bash
curl -G "http://localhost:8086/query?db=demodb" \
  --data-urlencode "q=SHOW DATABASES" \
  --header "Authorization: Bearer <header>.<payload>.<signature>"
```

## Authenticate Telegraf requests to InfluxDB

Authenticating [Telegraf](/{{< latest "telegraf" >}}/) requests to an InfluxDB instance with
authentication enabled requires some additional steps.
In the Telegraf configuration file (`/etc/telegraf/telegraf.conf`), uncomment
and edit the `username` and `password` settings.

```toml
###############################################################################
#                            OUTPUT PLUGINS                                   #
###############################################################################

# ...

[[outputs.influxdb]]
  # ...
  username = "example-username" # Provide your username
  password = "example-password" # Provide your password

# ...
```

Restart Telegraf and you're all set!

## Authorization

Authorization is only enforced once you've [enabled authentication](#set-up-authentication).
By default, authentication is disabled, all credentials are silently ignored, and all users have all privileges.

### User types and privileges

#### Admin users
Admin users have `READ` and `WRITE` access to all databases and full access to the following administrative queries:

##### Database management
- `CREATE DATABASE`
- `DROP DATABASE`  
- `DROP SERIES`
- `DROP MEASUREMENT`  
- `CREATE RETENTION POLICY`
- `ALTER RETENTION POLICY`
- `DROP RETENTION POLICY`  
- `CREATE CONTINUOUS QUERY`
- `DROP CONTINUOUS QUERY`  

For more information about these commands, see [Database management](/influxdb/v1.8/query_language/manage-database/) and
[Continuous queries](/influxdb/v1.8/query_language/continuous_queries/).

##### User management
- Admin user management
  - [`CREATE USER`](#user-management-commands)
  - [`GRANT ALL PRIVILEGES`](#grant-administrative-privileges-to-an-existing-user)
  - [`REVOKE ALL PRIVILEGES`](#revoke-administrative-privileges-from-an-admin-user)
  - [`SHOW USERS`](#show-all-existing-users-and-their-admin-status)  
- Non-admin user management:  
  - [`CREATE USER`](#user-management-commands)
  - [`GRANT [READ,WRITE,ALL]`](#grant-read-write-or-all-database-privileges-to-an-existing-user)
  - [`REVOKE [READ,WRITE,ALL]`](#revoke-read-write-or-all-database-privileges-from-an-existing-user)
- General user management:  
  - [`SET PASSWORD`](#reset-a-users-password)
  - [`DROP USER`](#drop-a-user)  

See [below](#user-management-commands) for a complete discussion of the user management commands.

#### Non-admin users
Non-admin users can have one of the following three privileges per database:

- `READ`  
- `WRITE`  
- `ALL` (both `READ` and `WRITE` access)  

`READ`, `WRITE`, and `ALL` privileges are controlled per user per database. A new non-admin user has no access to any database until they are specifically [granted privileges to a database](#grant-read-write-or-all-database-privileges-to-an-existing-user) by an admin user.
Non-admin users can [`SHOW`](/influxdb/v1.8/query_language/explore-schema/#show-databases) the databases on which they have `READ` and/or `WRITE` permissions.

### User management commands

#### Admin user management

When you enable HTTP authentication, InfluxDB requires you to create at least one admin user before you can interact with the system.

```sql
CREATE USER admin WITH PASSWORD '<password>' WITH ALL PRIVILEGES
```

##### Create another admin user

```sql
CREATE USER <username> WITH PASSWORD '<password>' WITH ALL PRIVILEGES
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

#### Non-admin user management

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
>
```

{{% note %}}
##### Important notes about providing user credentials
- The user value must be wrapped in double quotes if it starts with a digit, is an InfluxQL keyword, contains a hyphen and or includes any special characters, for example: `!@#$%^&*()-`
- The password [string](/influxdb/v1.8/query_language/spec/#strings) must be wrapped in single quotes.
  Do not include the single quotes when authenticating requests.
  We recommend avoiding the single quote (`'`) and backslash (`\`) characters in passwords.
  For passwords that include these characters, escape the special character with a backslash (e.g. (`\'`) when creating the password and when submitting authentication requests.
- Repeating the exact `CREATE USER` statement is idempotent. If any values change the database will return a duplicate user error. See GitHub Issue [#6890](https://github.com/influxdata/influxdb/pull/6890) for details.

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
>
```

`GRANT` `ALL` access to `todd` on the `NOAA_water_database` database:

```sql
> GRANT ALL ON "NOAA_water_database" TO "todd"
>
```

##### `REVOKE` `READ`, `WRITE`, or `ALL` database privileges from an existing user

```
REVOKE [READ,WRITE,ALL] ON <database_name> FROM <username>
```

CLI examples:

`REVOKE` `ALL` privileges from `todd` on the `NOAA_water_database` database:

```sql
> REVOKE ALL ON "NOAA_water_database" FROM "todd"
>
```

`REVOKE` `WRITE` privileges from `todd` on the `NOAA_water_database` database:

```sql
> REVOKE WRITE ON "NOAA_water_database" FROM "todd"
>
```

>**Note:** If a user with `ALL` privileges has `WRITE` privileges revoked, they are left with `READ` privileges, and vice versa.

##### `SHOW` a user's database privileges

```sql
SHOW GRANTS FOR <user_name>
```

CLI example:

```sql
> SHOW GRANTS FOR "todd"
database		            privilege
NOAA_water_database	        WRITE
another_database_name	      READ
yet_another_database_name   ALL PRIVILEGES
one_more_database_name      NO PRIVILEGES
```

#### General admin and non-admin user management

##### Reset a user's password

```sql
SET PASSWORD FOR <username> = '<password>'
```

CLI example:

```sql
> SET PASSWORD FOR "todd" = 'influxdb4ever'
>
```

{{% note %}}
**Note:** The password [string](/influxdb/v1.8/query_language/spec/#strings) must be wrapped in single quotes.
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
>
```

## Authentication and authorization HTTP errors

Requests with no authentication credentials or incorrect credentials yield the `HTTP 401 Unauthorized` response.

Requests by unauthorized users yield the `HTTP 403 Forbidden` response.
