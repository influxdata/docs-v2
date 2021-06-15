---
title: Use InfluxDB Enterprise authorizations
seotitle: Authenticate with Kapacitor using InfluxDB Enterprise
description: >
  Use user-based authorizations stored and managed in **InfluxDB Enterprise** to
  authenticate requests to the Kapacitor HTTP API.
menu:
  kapacitor_1_6:
    name: Use InfluxDB Enterprise authorizations
    parent: Authentication and authorization
weight: 202
---

Use user-based authorizations stored and managed in **InfluxDB Enterprise** to
authenticate requests to the Kapacitor HTTP API.

- [How authentication works](#how-authentication-works)
- [Create an InfluxDB Enterprise user or role with Kapacitor permissions](#create-an-influxdb-enterprise-user-or-role-with-kapacitor-permissions)
- [Enable and configure Kapacitor authentication](#enable-and-configure-kapacitor-authentication)
- [Authenticate with Kapacitor](#authenticate-with-kapacitor)

## How authentication works
The process of using InfluxDB Enterprise authorizations to authenticate with Kapacitor
involves three components of the enterprise [TICK stack](/platform/#influxdata-1x-tick-stack):

- [InfluxDB Enterprise](/{{< latest "enterprise_influxdb" >}}/) meta nodes
- [Kapacitor](/kapacitor/v1.6/)
- [Chronograf](/{{< latest "chronograf" >}}/) _(to aid in the creation of users and roles)_

1.  Kapacitor parses user credentials provided in an API request.
2.  Kapacitor checks to see if the username and password currently match any user
    details stored in the local Kapacitor cache.
3.  **If the user details are in the cache**, skip to step 7.  
    **If user details are not in the cache**, Kapacitor sends the credentials to
    the InfluxDB Enterprise meta API endpoint.
4.  The InfluxDB Enterprise meta server checks if the credentials are valid and,
    if valid, returns a user details JSON document to Kapacitor.
5.  Kapacitor checks the user details document for the correct privileges.
6.  Kapacitor caches the user details.
7.  **If the user has the correct privileges**, Kapacitor completes the request.  
    **If the user does not have the correct privileges**, Kapacitor aborts the
    transaction and returns 403 error like the following:

    ```sh
    {"error":"user <USER> does not have \"read\" privilege for API endpoint \"/kapacitor/v1/tasks\""}
    ```

## Create an InfluxDB Enterprise user or role with Kapacitor permissions
Use the InfluxDB Enterprise meta API to create a user with Kapacitor permissions
or to create a role with Kapacitor permissions and assign a user to that role.

{{% note %}}
The examples below use the InfluxDB Enterprise meta API to manage users and roles,
but you can also [use Chronograf to manage users and roles](/{{< latest "chronograf" >}}/administration/managing-influxdb-users/).
{{% /note %}}

**To interact with Kapacitor, the user or role must have one or both of the following permissions:**

- **KapacitorAPI**: Grant permissions for CRUD actions through the Kapacitor API.
- **KapacitorConfigAPI**: Grant permission to [configure Kapacitor through the API](/kapacitor/v1.6/administration/configuration/#configure-with-the-http-api).

{{< tabs-wrapper >}}
{{% tabs %}}
[Create a user](#)
[Create a role and assign a user](#)
{{% /tabs %}}
<!----------------------------- BEGIN user content ---------------------------->
{{% tab-content %}}

1. [Create a new InfluxDB Enterprise user](#create-a-new-influxdb-enterprise-user)
2. [Grant Kapacitor permissions to the new user](#grant-kapacitor-permissions-to-the-new-user)

### Create a new InfluxDB Enterprise user
Use the following request method and endpoint of the of the InfluxDB Enterprise
meta API to create a new InfluxDB Enterprise user:

{{< api-endpoint method="post" endpoint="/user" >}}

Provide the following:

- **InfluxDB Enterprise meta URL**: URL of the _**lead**_ InfluxDB Enterprise meta node
- **Basic authentication**: InfluxDB Enterprise username and password
- **Request body**: JSON object with the following fields:
    - **action**: create
    - **user**: JSON object with the following fields:
        - **name**: Username
        - **password**: Password

```sh
curl --request POST https://172.17.0.2:8091/user \
  --user "admin:changeit" \
  --data '{
    "action":"create",
    "user": {
      "name":"johndoe",
      "password":"pa5sw0Rd"
    }
  }' 
```

### Grant Kapacitor permissions to the new user
Use the following request method and endpoint of the InfluxDB Enterprise meta API
to grant Kapacitor-related permissions to the new user:

{{< api-endpoint method="POST" endpoint="/user" >}}

Provide the following:

- **InfluxDB Enterprise meta URL**: URL of the _**lead**_ InfluxDB Enterprise meta node
- **Basic authentication**: InfluxDB Enterprise username and password
- **Request body**: JSON object with the following fields:
    - **action**: add-permissions
    - **user**: JSON object with the following fields:
        - **name**: Username
        - **permissions**: JSON object with the following fields:
            -**""**: List of permissions to add

```sh
$ curl --request POST https://172.17.0.2:8091/user \
  --user "username:password" \
  --data '{
    "action": "add-permissions",
    "user":{
      "name": "johndoe",
      "permissions": {
        "":[
          "KapacitorAPI",
          "KapacitorConfigAPI"
        ]
      }
    }
  }'
```
{{% /tab-content %}}
<!------------------------------ END user content ----------------------------->
<!----------------------------- BEGIN role content ---------------------------->
{{% tab-content %}}

1. [Create a new InfluxDB Enterprise role](#create-a-new-influxdb-enterprise-role)
2. [Grant Kapacitor permissions to the new role](#grant-kapacitor-permissions-to-the-new-role)
3. [Create a new InfluxDB Enterprise user](#create-a-new-influxdb-enterprise-user-role)
4. [Assign a user to the new role](#assign-a-user-to-the-new-role)

### Create a new InfluxDB Enterprise role
Use the following request method and endpoint of the of the InfluxDB Enterprise
meta API to create a new InfluxDB Enterprise role:

{{< api-endpoint method="post" endpoint="/role" >}}

Provide the following:

- **InfluxDB Enterprise meta URL**: URL of the _**lead**_ InfluxDB Enterprise meta node
- **Basic authentication**: InfluxDB Enterprise username and password
- **Request body**: JSON object with the following fields:
    - **action**: create
    - **role**: JSON object with the following fields:
        - **name**: Role name

```sh
curl --request POST https://172.17.0.2:8091/role \
  --user "admin:changeit" \
  --data '{
    "action":"create",
    "user": {
      "name":"kapacitor",
    }
  }' 
```

### Grant Kapacitor permissions to the new role
Use the following request method and endpoint of the InfluxDB Enterprise meta API
to grant Kapacitor-related permissions to the new role:

{{< api-endpoint method="POST" endpoint="/role" >}}

Provide the following:

- **InfluxDB Enterprise meta URL**: URL of the _**lead**_ InfluxDB Enterprise meta node
- **Basic authentication**: InfluxDB Enterprise username and password
- **Request body**: JSON object with the following fields:
    - **action**: add-permissions
    - **role**: JSON object with the following fields:
        - **name**: Role name
        - **permissions**: JSON object with the following fields:
            -**""**: List of permissions to add

```sh
$ curl --request POST https://172.17.0.2:8091/user \
  --user "username:password" \
  --data '{
    "action": "add-permissions",
    "role":{
      "name": "kapacitor",
      "permissions": {
        "":[
          "KapacitorAPI",
          "KapacitorConfigAPI"
        ]
      }
    }
  }'
```

### Create a new InfluxDB Enterprise user {id="create-a-new-influxdb-enterprise-user-role"}
Use the following request method and endpoint of the of the InfluxDB Enterprise
meta API to create a new InfluxDB Enterprise user:

{{< api-endpoint method="post" endpoint="/user" >}}

Provide the following:

- **InfluxDB Enterprise meta URL**: URL of the _**lead**_ InfluxDB Enterprise meta node
- **Basic authentication**: InfluxDB Enterprise username and password
- **Request body**: JSON object with the following fields:
    - **action**: create
    - **user**: JSON object with the following fields:
        - **name**: Username
        - **password**: Password

```sh
curl --request POST https://172.17.0.2:8091/user \
  --user "admin:changeit" \
  --data '{
    "action":"create",
    "user": {
      "name":"johndoe",
      "password":"pa5sw0Rd"
    }
  }' 
```

### Assign a user to the new role
Use the following request method and endpoint of the of the InfluxDB Enterprise
meta API to assign an InfluxDB Enterprise user to the new role:

{{< api-endpoint method="post" endpoint="/role" >}}

Provide the following:

- **Basic authentication**: InfluxDB Enterprise username and password
- **Request body**: JSON object with the following fields:
    - **action**: add-users
    - **role**: JSON object with the following fields:
        - **name**: Role name
        - **users**: List of users to add

```sh
curl --request POST  https://172.17.0.2:8091/role \
  --user "username:password" \
  --data '{
    "action": "add-users",
    "role": {
      "name": "example-role",
      "users": [
        "johndoe"
      ]
    }
  }'
```
{{% /tab-content %}}
<!------------------------------ END role content ----------------------------->
{{< /tabs-wrapper >}}


## Enable and configure Kapacitor authentication
Enable and configure [authentication-related Kapacitor configuration options](/kapacitor/v1.6/administration/auth/#kapacitor-authentication-configuration-options)
in your `kapacitor.conf` or with environment variables:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[kapacitor.conf](#)
[Environment variables](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```toml
[http]
  # ...
  auth-enabled = true

[auth]
  enabled = true
  cache-expiration = "1h"
  bcrypt-cost = 4
  meta-addr = " 172.17.0.2:8091:8091"
  meta-username = "example-influxdb-username"
  meta-password = "example-influxdb-password"
  meta-use-tls = true
  meta-ca = "/path/to/cert.ca"
  meta-cert = "/path/to/cert.cert"
  meta-key = "/path/to/cert.key"
  meta-insecure-skip-verify = false

# ...
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
export KAPACITOR_HTTP_AUTH_ENABLED=true
export KAPACITOR_AUTH_ENABLED=true
export KAPACITOR_AUTH_CACHE_EXPIRATION=1h
export KAPACITOR_AUTH_BCRYPT_COST=4
export KAPACITOR_AUTH_META_ADDR=172.17.0.2:8091
export KAPACITOR_AUTH_META_USERNAME=example-username
export KAPACITOR_AUTH_META_PASSWORD=example-password
export KAPACITOR_AUTH_META_USE-tls=true
export KAPACITOR_AUTH_META_CA=/path/to/cert.ca
export KAPACITOR_AUTH_META_CERT=/path/to/cert.cert
export KAPACITOR_AUTH_META_KEY=/path/to/cert.key
export KAPACITOR_AUTH_META_INSECURE_SKIP_VERIFY=false
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Authenticate with Kapacitor
With authentication enabled, Kapacitor requires valid user credentials for all API requests.

- [Authenticate with the Kapacitor CLI](#authenticate-with-the-kapacitor-cli)
- [Authenticate with the Kapacitor API](#authenticate-with-the-kapacitor-api)

### Authenticate with the Kapacitor CLI
To authenticate with Kapacitor when using the [`kapacitor` CLI](/kapacitor/v1.6/working/cli_client/),
provide your username and password as part of the Kapacitor `-url`:

```sh
# Syntax
kapacitor -url http://<username>:<password>@localhost:9092

# Example
kapacitor -url http://admin:Pa5sw0Rd@localhost:9092
```

### Authenticate with the Kapacitor API
To authenticate directly with the Kapacitor API, use **basic authentication** to
provide your username and password.

```sh
# Syntax
curl --request GET http://localhost:9092/kapacitor/v1/tasks \
  -u "<username>:<password>" 

# Example
curl --request GET http://localhost:9092/kapacitor/v1/tasks \
  -u "johndoe:Pa5sw0Rd" 
```