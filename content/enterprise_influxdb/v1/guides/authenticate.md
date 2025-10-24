---
title: Authenticate requests to InfluxDB Enterprise v1
description: >
  Calculate percentages using basic math operators available in InfluxQL or Flux.
  This guide walks through use cases and examples of calculating percentages from two values in a single query.
menu:
  enterprise_influxdb_v1:
    weight: 25
    parent: Guides
    name: Authenticate requests
---

_To require valid credentials for cluster access, see ["Enable authentication"](/enterprise_influxdb/v1/administration/configure/security/authentication/)._

## Authenticate requests

### Authenticate with the InfluxDB API

Authenticate with the [InfluxDB API](/enterprise_influxdb/v1/tools/api/) using one of the following options:

- [Authenticate with basic authentication](#authenticate-with-basic-authentication)
- [Authenticate with query parameters in the URL or request body](#authenticate-with-query-parameters-in-the-url-or-request-body)

If you authenticate with both basic authentication **and** the URL query parameters,
the user credentials specified in the query parameters take precedence.
The following examples demonstrate queries with [admin user](#admin-users) permissions.
To learn about different users types, permissions, and how to manage users, see [authorization](#authorization).

{{% note %}}
InfluxDB Enterprise redacts passwords in log output when you enable authentication.
{{% /note %}}

#### Authenticate with basic authentication
```bash
curl -G http://localhost:8086/query \
  -u todd:password4todd \
  --data-urlencode "q=SHOW DATABASES"
```

#### Authenticate with query parameters in the URL or request body
Set `u` as the username and `p` as the password.

##### Credentials as query parameters
```bash
curl -G "http://localhost:8086/query?u=todd&p=password4todd" \
  --data-urlencode "q=SHOW DATABASES"
```

##### Credentials in the request body
```bash
curl -G http://localhost:8086/query \
  --data-urlencode "u=todd" \
  --data-urlencode "p=password4todd" \
  --data-urlencode "q=SHOW DATABASES"
```

### Authenticate with the CLI

There are three options for authenticating with the [CLI](/enterprise_influxdb/v1/tools/influx-cli/):

- [Authenticate with environment variables](#authenticate-with-environment-variables)
- [Authenticate with CLI flags](#authenticate-with-cli-flags)
- [Authenticate with credentials in the influx shell](#authenticate-with-credentials-in-the-influx-shell)

#### Authenticate with environment variables
Use the `INFLUX_USERNAME` and `INFLUX_PASSWORD` environment variables to provide
authentication credentials to the `influx` CLI.

```bash
export INFLUX_USERNAME=todd
export INFLUX_PASSWORD=password4todd
echo $INFLUX_USERNAME $INFLUX_PASSWORD
todd password4todd

influx
Connected to http://localhost:8086 version {{< latest-patch >}}
InfluxDB shell {{< latest-patch >}}
```

#### Authenticate with CLI flags
Use the `-username` and `-password` flags to provide authentication credentials
to the `influx` CLI.

```bash
influx -username todd -password password4todd
Connected to http://localhost:8086 version {{< latest-patch >}}
InfluxDB shell {{< latest-patch >}}
```

#### Authenticate with credentials in the influx shell
Start the `influx` shell and run the `auth` command.
Enter your username and password when prompted.

```bash
$ influx
Connected to http://localhost:8086 version {{< latest-patch >}}
InfluxDB shell {{< latest-patch >}}
> auth
username: todd
password:
>
```

### Authenticate using JWT tokens
For a more secure alternative to using passwords, include JWT tokens with requests to the InfluxDB API.
This is currently only possible through the [InfluxDB HTTP API](/enterprise_influxdb/v1/tools/api/).

1. **Add a shared secret in your InfluxDB Enterprise configuration file**.

   InfluxDB Enterprise uses the shared secret to encode the JWT signature.
   By default, `shared-secret` is set to an empty string, in which case no JWT authentication takes place.
   <!-- TODO: meta, data, or both? -->
   Add a custom shared secret in your [InfluxDB configuration file](/enterprise_influxdb/v1/administration/configure/config-data-nodes/#shared-secret).
   The longer the secret string, the more secure it is:

   ```toml
   [http]
   shared-secret = "my super secret pass phrase"
   ```

   Alternatively, to avoid keeping your secret phrase as plain text in your InfluxDB configuration file,
   set the value with the `INFLUXDB_HTTP_SHARED_SECRET` environment variable.

2. **Generate your JWT token**.

   Use an authentication service to generate a secure token
   using your InfluxDB username, an expiration time, and your shared secret.
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

3. **Include the token in HTTP requests**.

   Include your generated token as part of the `Authorization` header in HTTP requests:

   ```
   Authorization: Bearer <myToken>
   ```
   {{% note %}}
Only unexpired tokens will successfully authenticate.
Be sure your token has not expired.
   {{% /note %}}

#### Example query request with JWT authentication
```bash
curl -G "http://localhost:8086/query?db=demodb" \
  --data-urlencode "q=SHOW DATABASES" \
  --header "Authorization: Bearer <header>.<payload>.<signature>"
```

## Authenticate Telegraf requests to InfluxDB

Authenticating [Telegraf](/telegraf/v1/) requests to an InfluxDB instance with
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

