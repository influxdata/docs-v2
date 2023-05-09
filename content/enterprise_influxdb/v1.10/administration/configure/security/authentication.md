---
title: Configure authentication
description: >
  Enable authentication to require credentials for a cluster.
menu:
  enterprise_influxdb_1_10:
    parent: Configure security
    name: Configure authentication
weight: 10
---

To configure authentication, do one of the following: 

- [Enable authentication](#enable-authentication)
- [Configure authentication using JWT tokens](#configure-authentication-using-jwt-tokens) ([InfluxDB HTTP API](/enterprise_influxdb/v1.10/tools/api/) only)

## Enable authentication

Authentication is disabled by default in InfluxDB and InfluxDB Enterprise.
After [installing the data nodes](/enterprise_influxdb/v1.10/introduction/install-and-deploy/installation/data_node_installation/),
enable authentication to control access to your cluster.

To enable authentication in a cluster, do the following:

1. Set `auth-enabled` to `true` in the `[http]` section of the configuration files 
   for all meta **and** data nodes:
   ```toml
   [http]
     # ...
     auth-enabled = true
   ```
1. Next, create an admin user (if you haven't already).
   Using the [`influx` CLI](/enterprise_influxdb/v1.10/tools/influx-cli/),
   run the following command:

   ```sql
   CREATE USER admin WITH PASSWORD 'mypassword' WITH ALL PRIVILEGES
   ```
1. Restart InfluxDB Enterprise.
   Once restarted, InfluxDB Enterprise checks user credentials on every request
   and only processes requests with valid credentials.

## Configure authentication using JWT tokens

For a more secure alternative to using passwords, include JWT tokens in requests to the InfluxDB API.

1. **Add a shared secret in your InfluxDB Enterprise configuration file**.

   InfluxDB Enterprise uses the shared secret to encode the JWT signature.
   By default, `shared-secret` is set to an empty string (no JWT authentication).
   Add a custom shared secret in your [InfluxDB configuration file](/enterprise_influxdb/v1.10/administration/configure/config-data-nodes/#shared-secret)
   for each meta and data node.
   Longer strings are more secure:

   ```toml
   [http]
   shared-secret = "my super secret pass phrase"
   ```

   Alternatively, to avoid keeping your secret phrase as plain text in your InfluxDB configuration file,
   set the value with the `INFLUXDB_HTTP_SHARED_SECRET` environment variable (for example, in Linux: `export INFLUXDB_HTTP_SHARED_SECRET=MYSUPERSECRETPASSPHRASE`).

2. **Generate your JWT token**.

   Use an authentication service (such as, [https://jwt.io/](https://jwt.io/)) 
  to generate a secure token using your InfluxDB username, an expiration time, and your shared secret.

   The payload (or claims) of the token must be in the following format:

   ```json
   {
       "username": "myUserName",
       "exp": 1516239022
   }
   ```

   - **username** - InfluxDB username.
   - **exp** - Token expiration in UNIX [epoch time](/enterprise_influxdb/v1.10/query_language/explore-data/#epoch_time).
     For increased security, keep token expiration periods short.
     For testing, you can manually generate UNIX timestamps using [https://www.unixtimestamp.com/index.php](https://www.unixtimestamp.com/index.php).

   To encode the payload using your shared secret, use a JWT library in your own authentication server or encode by hand at [https://jwt.io/](https://jwt.io/).

3. **Include the token in HTTP requests**.

   Include your generated token as part of the `Authorization` header in HTTP requests:

   ```
   Authorization: Bearer <myToken>
   ```
   {{% note %}}
Only unexpired tokens will successfully authenticate.
Verify your token has not expired.
   {{% /note %}}

#### Example query request with JWT authentication
```bash
curl -G "http://localhost:8086/query?db=demodb" \
  --data-urlencode "q=SHOW DATABASES" \
  --header "Authorization: Bearer <header>.<payload>.<signature>"
```

## Authentication and authorization HTTP errors

Requests with no authentication credentials or incorrect credentials yield the `HTTP 401 Unauthorized` response.

Requests by unauthorized users yield the `HTTP 403 Forbidden` response.

## Next steps

After configuring authentication,
you can [manage users and permissions](/enterprise_influxdb/v1.10/administration/manage/users-and-permissions/)
as necessary.

{{% enterprise-warning-authn-b4-authz %}}
