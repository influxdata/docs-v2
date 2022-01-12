---
title: Manage authorization with the InfluxDB Enterprise Meta API
description: >
  Manage users and permissions with the InfluxDB Enterprise Meta API.
menu:
  enterprise_influxdb_1_9:
    name: Manage authorization with the API
    parent: Manage users and permissions
weight: 41
aliases:
  - /enterprise_influxdb/v1.9/administration/manage/security/authentication_and_authorization-api/
  - /enterprise_influxdb/v1.9/administration/security/authentication_and_authorization-api/
---

{{% enterprise-warning-authn-b4-authz %}}

- [Overview](#overview)
- [API examples](#user-and-privilege-management-over-the-influxdb-enterprise-meta-api)

Use the InfluxDB Enterprise Meta API to manage authorization for a cluster.

<!--
## permission "tokens"
Predefined key tokens take the form of verb-object pairs.
When the token lacks the verb part, full management privileges are implied.
These predefined tokens are:
-->

For more information, see [Enterprise users and permissions](/enterprise_influxdb/v1.9/administration/manage/users-and-permissions/permissions/).

### Example API requests

{{% note %}}
Many of the examples below use the `jq` utility to format JSON output for readability.
[Install `jq`](https://stedolan.github.io/jq/download/) to process JSON output.
If you don’t have access to `jq`, remove the `| jq` shown in the example.
{{% /note %}}

**Users**:

- [List users](#list-users)
- [Create a user against a follower node](#create-a-user-against-a-follower-node)
- [Create a user against the lead node](#create-a-user-against-the-lead-node)
- [Retrieve a user details document](#retrieve-a-user-details-document)
- [Grant permissions to a user](#grant-permissions-to-a-user)
- [Verify user permissions](#verify-user-permissions)
- [Remove permissions from a user](#remove-permissions-from-a-user)
- [Remove a user](#remove-a-user)
- [Verify user removal](#verify-user-removal)
- [Change a user's password](#change-a-users-password)

**Roles**:

- [List roles](#list-roles)
- [Create a role](#create-a-role)
- [Verify roles](#verify-roles)
- [Retrieve a role document](#retrieve-a-role-document)
- [Add permissions to a role](#add-permissions-to-a-role)
- [Verify role permissions](#verify-role-permissions)
- [Add a user to a role](#add-a-user-to-a-role)
- [Verify user in role](#verify-user-in-role)
- [Remove a user from a role](#remove-a-user-from-a-role)
- [Remove a permission from a role](#remove-a-permission-from-a-role)
- [Delete a role](#delete-a-role)
- [Verify role deletion](#verify-role-deletion)

#### Users

Use the `/user` endpoint of the InfluxDB Enterprise Meta API to manage users.

##### List users
View a list of existing users.

```sh
curl --location-trusted -u "admin:changeit" -s https://cluster_node_1:8091/user | jq
```

```json
{
    "users": [
        {
            "hash": "$2a$10$NelNfrWdxubN0/TnP7DwquKB9/UmJnyZ7gy0i69MPldK73m.2WfCu",
            "name": "admin",
            "permissions": {
                "": [
                    "ViewAdmin",
                    "ViewChronograf",
                    "CreateDatabase",
                    "CreateUserAndRole",
                    "AddRemoveNode",
                    "DropDatabase",
                    "DropData",
                    "ReadData",
                    "WriteData",
                    "Rebalance",
                    "ManageShard",
                    "ManageContinuousQuery",
                    "ManageQuery",
                    "ManageSubscription",
                    "Monitor",
                    "CopyShard",
                    "KapacitorAPI",
                    "KapacitorConfigAPI"
                ]
            }
        }
    ]
}
```

##### Create a user against a follower node

Transactions that modify the user store must be sent to the lead meta node using `POST`.

If the node returns a 307 redirect message,
try resending the request to the lead node as indicated by the `Location` field in the HTTP response header.

```sh
curl --location-trusted -u "admin:changeit" -s -v -d '{"action":"create","user":{"name":"phantom2","password":"changeit"}}' https://cluster_node_2:8091/user
```

```
*   Trying 172.31.16.140...
* Connected to cluster_node_2 (172.31.16.140) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_2 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_2
* 	 start date: Tue, 27 Mar 2018 12:34:09 GMT
* 	 expire date: Thu, 26 Mar 2020 12:34:09 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
* Server auth using Basic with user 'admin'
> POST /user HTTP/1.1
> Host: cluster_node_2:8091
> Authorization: Basic YWRtaW46Y2hhbmdlaXQ=
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 68
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 68 out of 68 bytes
< HTTP/1.1 307 Temporary Redirect
< Influxdb-Metaindex: 33402
< Location: https://cluster_node_1:8091/user
< Request-Id: b7489b68-38c4-11e8-9cf7-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:30:17 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

##### Create a user against the lead node

```sh
curl --location-trusted -u "admin:changeit" -s -v -d '{"action":"create","user":{"name":"phantom","password":"changeit"}}' https://cluster_node_1:8091/user
```

```
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
* Server auth using Basic with user 'admin'
> POST /user HTTP/1.1
> Host: cluster_node_1:8091
> Authorization: Basic YWRtaW46Y2hhbmdlaXQ=
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 68
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 68 out of 68 bytes
< HTTP/1.1 200 OK
< Request-Id: 6711760c-38c4-11e8-b7ff-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:28:02 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

##### Retrieve a user details document

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/user?name=phantom | jq
```

```json
{
    "users": [
        {
            "hash": "$2a$10$hR.Ih6DpIHUaynA.uqFhpOiNUgrADlwg3rquueHDuw58AEd7zk5hC",
            "name": "phantom"
        }
    ]
}
```

##### Grant permissions to a user

```
curl --location-trusted --negotiate -u "admin:changeit" -s -v -d '{"action":"add-permissions","user":{"name":"phantom","permissions":{"":["KapacitorAPI","KapacitorConfigAPI"]}}}' https://cluster_node_1:8091/user
```

```
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /user HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 111
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 111 out of 111 bytes
< HTTP/1.1 200 OK
< Request-Id: 604141f2-38c6-11e8-bc15-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:42:10 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

##### Verify user permissions

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/user?name=phantom | jq
```

```json
{
    "users": [
        {
            "hash": "$2a$10$hR.Ih6DpIHUaynA.uqFhpOiNUgrADlwg3rquueHDuw58AEd7zk5hC",
            "name": "phantom",
            "permissions": {
                "": [
                    "KapacitorAPI",
                    "KapacitorConfigAPI"
                ]
            }
        }
    ]
}
```

##### Remove permissions from a user

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v -d '{"action":"remove-permissions","user":{"name":"phantom","permissions":{"":["KapacitorConfigAPI"]}}}' https://cluster_node_1:8091/user
```

```
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /user HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 99
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 99 out of 99 bytes
< HTTP/1.1 200 OK
< Request-Id: 1d84744c-38c7-11e8-bd97-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:47:27 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

##### Remove a user

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v -d '{"action":"delete","user":{"name":"phantom2"}}' https://cluster_node_1:8091/user
```

```
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /user HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 46
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 46 out of 46 bytes
< HTTP/1.1 200 OK
< Request-Id: 8dda5513-38c7-11e8-be84-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:50:36 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

##### Verify user removal

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/user?name=phantom
```

```json
{
    "error": "user not found"
}
```

##### Change a user's password

```sh
curl --location-trusted -u "admin:changeit" -H "Content-Type: application/json" -d '{"action": "change-password", "user": {"name": "<username>", "password": "newpassword"}}' localhost:8091/user
```

<!-- TODO -->

#### Roles

The Influxd-Meta API provides an endpoint `/role` for managing roles.

##### List roles

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role | jq
```

```
{}
```

In a fresh installation no roles will have been created yet.
As when creating a user the lead node must be used.

##### Create a role

```sh
curl --location-trusted --negotiate -u "admin:changeit"  -v -d '{"action":"create","role":{"name":"spectre"}}' https://cluster_node_1:8091/role
```

```
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 45
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 45 out of 45 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33408
< Request-Id: 733b3294-38c8-11e8-805f-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 11:57:01 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

##### Verify roles
Verify the role has been created.

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role | jq
```

```json
{
    "roles": [
        {
            "name": "djinn",
        },
        {
            "name": "spectre"
        },
    ]
}

```

##### Retrieve a role document
Retrieve a record for a single node.

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role?name=spectre | jq
```

```json
{
   "roles": [
       {
           "name": "spectre"
       }
   ]
}
```

##### Add permissions to a role
Add permissions to a role.

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v -d '{"action":"add-permissions","role":{"name":"spectre","permissions":{"":["KapacitorAPI","KapacitorConfigAPI"]}}}' https://cluster_node_1:8091/role
```

```
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 111
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 111 out of 111 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33412
< Request-Id: 603934f5-38c9-11e8-8252-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 12:03:38 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

##### Verify role permissions
Verify permissions have been added.

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role?name=spectre | jq
```

```json
{
    "roles": [
        {
            "name": "spectre",
            "permissions": {
                "": [
                    "KapacitorAPI",
                    "KapacitorConfigAPI"
                ]
            }
        }
    ]
}
```

##### Add a user to a role

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v -d '{"action":"add-users","role":{"name":"spectre","users":["phantom"]}}'  https://cluster_node_1:8091/role
```

```
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 68
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 68 out of 68 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33413
< Request-Id: 2f3f4310-38ca-11e8-83f4-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 12:09:26 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

##### Verify user in role
Verify user has been added to role.

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role?name=spectre | jq
```

```json
{
    "roles": [
        {
            "name": "spectre",
            "permissions": {
                "": [
                    "KapacitorAPI",
                    "KapacitorConfigAPI"
                ]
            },
            "users": [
                "phantom"
            ]
        }
    ]
}
```

##### Remove a user from a role

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v -d '{"action":"remove-users","role":{"name":"spectre","users":["phantom"]}}' https://admin:changeit@cluster_node_1:8091/role
```

```
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 71
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 71 out of 71 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33414
< Request-Id: 840896df-38ca-11e8-84a9-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 12:11:48 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

##### Remove a permission from a role

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v -d '{"action":"remove-permissions","role":{"name":"spectre","permissions":{"":["KapacitorConfigAPI"]}}}' https://cluster_node_1:8091/role
```

```
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 99
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 99 out of 99 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33415
< Request-Id: a1d9a3e4-38ca-11e8-84f0-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 12:12:38 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

##### Delete a role

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v -d '{"action":"delete","role":{"name":"spectre"}}' https://cluster_node_1:8091/role
```

```
*   Trying 172.31.16.108...
* Connected to cluster_node_1 (172.31.16.108) port 8091 (#0)
* found 149 certificates in /etc/ssl/certs/ca-certificates.crt
* found 596 certificates in /etc/ssl/certs
* ALPN, offering http/1.1
* SSL connection using TLS1.2 / ECDHE_RSA_AES_128_GCM_SHA256
* 	 server certificate verification OK
* 	 server certificate status verification SKIPPED
* 	 common name: cluster_node_1 (matched)
* 	 server certificate expiration date OK
* 	 server certificate activation date OK
* 	 certificate public key: RSA
* 	 certificate version: #1
* 	 subject: C=CZ,ST=Praha,L=Hlavni-mesto,O=Bonitoo.io,OU=QA,CN=cluster_node_1
* 	 start date: Tue, 27 Mar 2018 12:29:36 GMT
* 	 expire date: Thu, 26 Mar 2020 12:29:36 GMT
* 	 issuer: C=CZ,ST=Praha,L=Hlavni-mesto,O=bonitoo.io,OU=QA,CN=bonitoo.io,EMAIL=tester@qa.org
* 	 compression: NULL
* ALPN, server did not agree to a protocol
> POST /role HTTP/1.1
> Host: cluster_node_1:8091
> User-Agent: curl/7.47.0
> Accept: */*
> Content-Length: 45
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 45 out of 45 bytes
< HTTP/1.1 200 OK
< Influxdb-Metaindex: 33416
< Request-Id: c9ae3c8b-38ca-11e8-8546-000000000000
< X-Influxdb-Version: 1.5.1-c1.5.1
< Date: Thu, 05 Apr 2018 12:13:45 GMT
< Content-Length: 0
< Content-Type: text/plain; charset=utf-8
<
```

##### Verify role deletion

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s https://cluster_node_1:8091/role?name=spectre | jq
```

```json
{
    "error": "role not found"
}
```
