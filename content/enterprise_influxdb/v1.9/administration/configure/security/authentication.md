---
title: Configure authentication
description: >
  Enable authentication to require credentials for a cluster.
menu:
  enterprise_influxdb_1_9:
    parent: Configure security
    name: Configure authentication
weight: 10
---

## Enable authentication

Authentication is disabled by default in InfluxDB and InfluxDB Enterprise.
Once you have a working cluster
(that is, after [installing the data nodes](/enterprise_influxdb/v1.9/introduction/install-and-deploy/installation/data_node_installation/)),
we recommend enabling authentication right away to control access to you cluster.

{{% enterprise-authn-b4-authz %}}

To enable authentication in a cluster, do the following:

1. Set `auth-enabled` to `true` in the `[http]` section of the config files 
   for all meta **and** data nodes:
   ```toml
   [http]
     # ...
     auth-enabled = true
   ```
1. Next, create an admin user (if you haven't already).
   Using the [`influx` CLI](/enterprise_influxdb/v1.9/tools/influx-cli/),
   run the following command:
   ```
   CREATE USER admin WITH PASSWORD 'mypassword' WITH ALL PRIVILEGES
   ```
1. Restart InfluxDB Enterprise.
   Once restarted, InfluxDB Enterprise checks user credentials on every request
   and only processes requests with valid credentials.

## Configure authentication using JWT tokens

For a more secure alternative to using passwords,
include JWT tokens with requests to the InfluxDB API.
This is currently only possible through the [InfluxDB HTTP API](/enterprise_influxdb/v1.9/tools/api/).

1. **Add a shared secret in your InfluxDB Enterprise configuration file**.

   InfluxDB Enterprise uses the shared secret to encode the JWT signature.
   By default, `shared-secret` is set to an empty string, in which case no JWT authentication takes place.
   <!-- TODO: meta, data, or both? -->
   Add a custom shared secret in your [InfluxDB configuration file](/enterprise_influxdb/v1.9/administration/configure/config-data-nodes/#shared-secret--).
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

## Authentication and authorization HTTP errors

Requests with no authentication credentials or incorrect credentials yield the `HTTP 401 Unauthorized` response.

Requests by unauthorized users yield the `HTTP 403 Forbidden` response.
