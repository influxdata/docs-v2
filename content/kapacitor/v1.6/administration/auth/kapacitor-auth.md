---
title: Set up internal Kapacitor authorizations
description: >
  Use user-based authorizations stored and managed in **Kapacitor** to
  authenticate requests to the Kapacitor HTTP API. 
menu:
  kapacitor_1_6:
    name: Use Kapacitor authorizations
    parent: Authentication and authorization
weight: 201
related:
  - /kapacitor/v1.6/working/api/#users, Kapacitor HTTP API – Manage users
  - /kapacitor/v1.6/user-types-permissions
---

Use user-based authorizations and permissions stored in Kapacitor to
authenticate requests to the Kapacitor HTTP API. 

## Use Kapacitor authorizations

1. Create an **admin** user:
    
    1.  Set the following in the `[auth]` configuration group in your `kapacitor.conf`:
        
        - **enabled**: true
        - **bcrypt**: _an integer greater than or equal to 4_
        - **meta-\***: _empty string or false_

        <!--  -->
        ```toml
        [auth]
          enabled = true
          cache-expiration = "1h"
          bcrypt-cost = 4
          meta-addr = ""
          meta-username = ""
          meta-password = ""
          meta-use-tls = false
          meta-ca = ""
          meta-cert = ""
          meta-key = ""
          meta-insecure-skip-verify = false
        ```

        Or use environment variables to set these configuration options:

        ```sh
        export KAPACITOR_AUTH_ENABLED=true
        export KAPACITOR_AUTH_BCRYPT=4
        ```
    
    2.  Start `kapacitord` using the updated configuration:

        ```sh
        kapactord -config /path/to/kapacitor.conf
        ```
    
    3.  Use the `/users` endpoint of the Kapacitor HTTP API to create a new admin user.
        In the request body, provide a JSON object with the following fields:

        - **name**: _admin username_
        - **password**: _admin password_
        - **type**: `"admin"`

        ```sh
        curl --request POST 'http://localhost:9092/kapacitor/v1/users' \
          --data '{
            "name": "exampleUsername",
            "password": "examplePassword",
            "type":"admin"
        }'
        ```

2.  Stop the `kapacitord` service.

3.  Set `[http].auth-enabled` to `true` in your `kapacitor.conf`:

    ```toml
    [http]
      #...
      auth-enabled: true
      #...
    ```

    Or use the `KAPACITOR_HTTP_AUTH_ENABLED` environment variable:

    ```sh
    export KAPACITOR_HTTP_AUTH_ENABLED=true
    ```

4.  Restart `kapacitord` with the updated configuration.

    ```sh
    kapacitord -config /path/to/kapacitor.conf
    ```

5.  _(Optional)_ Create additional users with user-specific permissions.
    For more information, see:

    - [Kapacitor HTTP API – Create a user](/kapacitor/v1.6/working/api/#create-a-user)
    - [Kapacitor user types and permissions](/kapacitor/v1.6/user-types-permissions)


## Authenticate with the Kapacitor CLI
To authenticate with Kapacitor when using the [`kapacitor` CLI](/kapacitor/v1.6/working/cli_client/),
provide your username and password as part of the Kapacitor `-url`:

```sh
# Syntax
kapacitor -url http://<username>:<password>@localhost:9092

# Example
kapacitor -url http://admin:Pa5sw0Rd@localhost:9092
```

## Authenticate with the Kapacitor API
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
