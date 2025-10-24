---
title: Manage authorization with the InfluxDB Enterprise v1 Meta API
description: >
  Manage users and permissions with the InfluxDB Enterprise v1 Meta API.
menu:
  enterprise_influxdb_v1:
    name: Manage authorization with the API
    parent: Manage users and permissions
weight: 41
aliases:
  - /enterprise_influxdb/v1/administration/manage/security/authentication_and_authorization-api/
  - /enterprise_influxdb/v1/administration/security/authentication_and_authorization-api/
---

{{% enterprise-warning-authn-b4-authz %}}

Use the InfluxDB Enterprise Meta API to manage authorization for a cluster.

The API can be used to manage both cluster-wide and database-specific [permissions](/enterprise_influxdb/v1/administration/manage/users-and-permissions/permissions/#permissions).
Chronograf can only manage cluster-wide permissions.
To manage permissions at the database level, use the API.

<!--
## permission "tokens"
Predefined key tokens take the form of verb-object pairs.
When the token lacks the verb part, full management privileges are implied.
These predefined tokens are:
-->

For more information, see [Enterprise users and permissions](/enterprise_influxdb/v1/administration/manage/users-and-permissions/permissions/).

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
- [Grant permissions to a user for all databases](#grant-permissions-to-a-user-for-all-databases)
- [Grant permissions to a user for a specific database](#grant-permissions-to-a-user-for-a-specific-database)
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
- [Add permissions to a role for all databases](#add-permissions-to-a-role-for-all-databases)
- [Add permissions to a role for a specific database](#add-permissions-to-a-role-for-a-specific-database)
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
curl --location-trusted -u "admin:changeit" -s -v \
  -d '{"action":"create","user":{"name":"phantom2","password":"changeit"}}' \
  https://cluster_node_2:8091/user
```

##### Create a user against the lead node

```sh
curl --location-trusted -u "admin:changeit" -s -v \
  -d '{"action":"create","user":{"name":"phantom","password":"changeit"}}' \
  https://cluster_node_1:8091/user
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

##### Grant permissions to a user for all databases

To grant a list of permissions for all databases in a cluster,
use the `""` key in the permissions object, as shown in the example below.

```
curl --location-trusted --negotiate -u "admin:changeit" -s -v \
  -d '{"action":"add-permissions","user":{"name":"phantom","permissions":{"":["ReadData", "WriteData"]}}}' \
  https://cluster_node_1:8091/user
```

##### Grant permissions to a user for a specific database

Grant `ReadData` and `WriteData` permissions to the user named `phantom` for `MyDatabase`.

```
curl --location-trusted --negotiate -u "admin:changeit" -s -v \
  -d '{"action":"add-permissions","user":{"name":"phantom","permissions":{"MyDatabase":["ReadData","WriteData"]}}}' \
  https://cluster_node_1:8091/user
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
                "MyDatabase": [
                    "ReadData",
                    "WriteData"
                ]
            }
        }
    ]
}
```

##### Remove permissions from a user

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v \
  -d '{"action":"remove-permissions","user":{"name":"phantom","permissions":{"":["KapacitorConfigAPI"]}}}' \
  https://cluster_node_1:8091/user
```

##### Remove a user

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v \
  -d '{"action":"delete","user":{"name":"phantom2"}}' \
  https://cluster_node_1:8091/user
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
curl --location-trusted -u "admin:changeit" -H "Content-Type: application/json" \
  -d '{"action": "change-password", "user": {"name": "<username>", "password": "newpassword"}}' \
  localhost:8091/user
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
curl --location-trusted --negotiate -u "admin:changeit" -v \
  -d '{"action":"create","role":{"name":"spectre"}}' \
  https://cluster_node_1:8091/role
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

##### Add permissions to a role for all databases

To grant a list of permissions to a role for all databases in a cluster,
use the `""` key in the permissions object, as shown in the example below.

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v \
   -d '{"action":"add-permissions","role":{"name":"spectre","permissions":{"":["ReadData","WriteData"]}}}' \
   https://cluster_node_1:8091/role
```


##### Add permissions to a role for a specific database

Grant `ReadData` and `WriteData` permissions to the role named `spectre` for `MyDatabase`.

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v \
   -d '{"action":"add-permissions","role":{"name":"spectre","permissions":{"MyDatabase":["ReadData","WriteData"]}}}' \
   https://cluster_node_1:8091/role
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
                "MyDatabase": [
                    "ReadData",
                    "WriteData"
                ]
            }
        }
    ]
}
```

##### Add a user to a role

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v \
  -d '{"action":"add-users","role":{"name":"spectre","users":["phantom"]}}' \
  https://cluster_node_1:8091/role
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
curl --location-trusted --negotiate -u "admin:changeit" -s -v \
  -d '{"action":"remove-users","role":{"name":"spectre","users":["phantom"]}}' \
  https://admin:changeit@cluster_node_1:8091/role
```

##### Remove a permission from a role

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v \
  -d '{"action":"remove-permissions","role":{"name":"spectre","permissions":{"":["KapacitorConfigAPI"]}}}' \
  https://cluster_node_1:8091/role
```

##### Delete a role

```sh
curl --location-trusted --negotiate -u "admin:changeit" -s -v \
  -d '{"action":"delete","role":{"name":"spectre"}}' \
  https://cluster_node_1:8091/role
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
