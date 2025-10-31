---
title: Manage fine-grained authorization
description: >
  Fine-grained authorization (FGA) in InfluxDB Enterprise v1 controls user access at the database, measurement, and series levels.
menu:
  enterprise_influxdb_v1:
    parent: Manage users and permissions
weight: 44
aliases:
  - /docs/v1.5/administration/fga
  - /enterprise_influxdb/v1/guides/fine-grained-authorization/
related:
  - /enterprise_influxdb/v1/administration/authentication_and_authorization/
  - /chronograf/v1/administration/managing-influxdb-users/
---

{{% enterprise-warning-authn-b4-authz %}}

Use fine-grained authorization (FGA) to control user access at the database, measurement, and series levels.

You must have [admin permissions](/enterprise_influxdb/v1/administration/manage/users-and-permissions/permissions/#admin) to set up FGA.

{{% warn %}}
#### FGA does not apply to Flux
FGA does not restrict actions performed by Flux queries (both read and write).
If using FGA, we recommend [disabling Flux](/enterprise_influxdb/{{< current-version >}}/flux/installation/).
{{% /warn %}}

{{% note %}}
FGA is only available in InfluxDB Enterprise.
InfluxDB OSS 1.x controls access at the database level only.
{{% /note %}}

## Set up fine-grained authorization

1. [Enable authentication](/enterprise_influxdb/v1/administration/configure/security/authentication/) in your InfluxDB configuration file.

2. Create users through the InfluxDB query API.

    ```sql
    CREATE USER username WITH PASSWORD 'password'
    ```

    For more information, see [User management commands](/enterprise_influxdb/v1/administration/manage/users-and-permissions/authorization-influxql/#user-management-commands).

3. Ensure that you can access the **meta node** API (port 8091 by default).

    {{% note %}}
In a typical cluster configuration, the HTTP ports for data nodes
(8086 by default) are exposed to clients but the meta node HTTP ports are not.
You may need to work with your network administrator to gain access to the meta node HTTP ports.
    {{% /note %}}

4. Create users. Do the following:
   1.  As Administrator, create users and grant users all permissions. The example below grants users `east` and `west` all permissions on the `datacenters` database.

       ```sql
       CREATE DATABASE datacenters

       CREATE USER east WITH PASSWORD 'east'
       GRANT ALL ON datacenters TO east

       CREATE USER west WITH PASSWORD 'west'
       GRANT ALL ON datacenters TO west
       ```

   2. Add fine-grained permissions to users as needed.

5. [Create roles](#manage-roles) to grant permissions to users assigned to a role.

    {{% note %}}
For an overview of how users and roles work in InfluxDB Enterprise, see [InfluxDB Enterprise users](/enterprise_influxdb/v1/features/users/).
    {{% /note %}}

6.  [Set up restrictions](#manage-restrictions).
   Restrictions apply to all non-admin users.

    {{% note %}}
Permissions (currently "read" and "write") may be restricted independently depending on the scenario.
    {{% /note %}}

7. [Set up grants](#manage-grants) to remove restrictions for specified users and roles.

---

{{% note %}}
#### Notes about examples
The examples below use `curl`, a command line tool for transferring data, to send
HTTP requests to the Meta API, and [`jq`](https://stedolan.github.io/jq/), a command line JSON processor,
to make the JSON output easier to read.
Alternatives for each are available, but are not covered in this documentation.

All examples assume authentication is enabled in InfluxDB.
Admin credentials must be sent with each request.
Use the `curl -u` flag to pass authentication credentials:

```sh
curl -u `username:password` #...
```
{{% /note %}}

---

## Matching methods
The following matching methods are available when managing restrictions and grants to databases, measurements, or series:

- `exact` (matches only exact string matches)
- `prefix` (matches strings the begin with a specified prefix)

```sh
# Match a database name exactly
"database": {"match": "exact", "value": "my_database"}

# Match any databases that begin with "my_"
"database": {"match": "prefix", "value": "my_"}
```

{{% note %}}
#### Wildcard matching
Neither `exact` nor `prefix` matching methods allow for wildcard matching.
{{% /note %}}

## Manage roles
Roles allow you to assign permissions to groups of users.
The following examples assume the `user1`, `user2` and `ops` users already exist in InfluxDB.

### Create a role
To create a new role, use the InfluxDB Meta API `/role` endpoint with the `action`
field set to `create` in the request body.

The following examples create two new roles:

- east
- west

```sh
# Create east role
curl -s --location-trusted -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "create",
    "role": {
      "name": "east"
    }
  }'

# Create west role
curl -s --location-trusted -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "create",
    "role": {
      "name": "west"
    }
  }'
```

### Specify role permissions
To specify permissions for a role,
use the InfluxDB Meta API `/role` endpoint with the `action` field set to `add-permissions`.
Specify the [permissions](/chronograf/v1/administration/managing-influxdb-users/#permissions) to add for each database.

The following example sets read and write permissions on `db1` for both `east` and `west` roles.

```sh
curl -s --location-trusted -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-permissions",
    "role": {
      "name": "east",
      "permissions": {
        "db1": ["ReadData", "WriteData"]
      }
    }
  }'

curl -s --location-trusted -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-permissions",
    "role": {
      "name": "west",
      "permissions": {
        "db1": ["ReadData", "WriteData"]
      }
    }
  }'
```

### Remove role permissions
To remove permissions from a role, use the InfluxDB Meta API `/role` endpoint with the `action` field
set to `remove-permissions`.
Specify the [permissions](/chronograf/v1/administration/managing-influxdb-users/#permissions) to remove from each database.

The following example removes read and write permissions from `db1` for the `east` role.

```sh
curl -s --location-trusted -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "remove-permissions",
    "role": {
      "name": "east",
      "permissions": {
        "db1": ["ReadData", "WriteData"]
      }
    }
  }'
```

### Assign users to a role
To assign users to role, set the `action` field to `add-users` and include a list
of users in the `role` field.

The following examples add user1, user2 and the ops user to the `east` and `west` roles.

```sh
# Add user1 and ops to the east role
curl -s --location-trusted -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-users",
    "role": {
      "name": "east",
      "users": ["user1", "ops"]
    }
  }'

# Add user1 and ops to the west role
curl -s --location-trusted -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "add-users",
    "role": {
      "name": "west",
      "users": ["user2", "ops"]
    }
  }'
```

### View existing roles
To view existing roles with their assigned permissions and users, use the `GET`
request method with the InfluxDB Meta API `/role` endpoint.

```sh
curl --location-trusted -XGET http://localhost:8091/role | jq
```

### Delete a role
To delete a role, the InfluxDB Meta API `/role` endpoint and set the `action`
field to `delete` and include the name of the role to delete.

```sh
curl -s --location-trusted -XPOST "http://localhost:8091/role" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "action": "delete",
    "role": {
      "name": "west"
    }
  }'
```

{{% note %}}
Deleting a role does not delete users assigned to the role.
{{% /note %}}

## Manage restrictions
Restrictions restrict either or both read and write permissions on InfluxDB assets.
Restrictions apply to all non-admin users.
[Grants](#manage-grants) override restrictions.

> In order to run meta queries (such as `SHOW MEASUREMENTS` or `SHOW TAGS` ),
> users must have read permissions for the database and retention policy they are querying.

Manage restrictions using the InfluxDB Meta API `acl/restrictions` endpoint.

```sh
curl --location-trusted -XGET "http://localhost:8091/influxdb/v2/acl/restrictions"
```

- [Restrict by database](#restrict-by-database)
- [Restrict by measurement in a database](#restrict-by-measurement-in-a-database)
- [Restrict by series in a database](#restrict-by-series-in-a-database)
- [View existing restrictions](#view-existing-restrictions)
- [Update a restriction](#update-a-restriction)
- [Remove a restriction](#remove-a-restriction)

> **Note:** For the best performance, set up minimal restrictions.

### Restrict by database
In most cases, restricting the database is the simplest option, and has minimal impact on performance.
The following example restricts reads and writes on the `my_database` database.

```sh
curl --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "permissions": ["read", "write"]
  }'
```

### Restrict by measurement in a database
The following example restricts read and write permissions on the `network`
measurement in the `my_database` database.
_This restriction does not apply to other measurements in the `my_database` database._

```sh
curl --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "permissions": ["read", "write"]
  }'
```

### Restrict by series in a database
The most fine-grained restriction option is to restrict specific tags in a measurement and database.
The following example restricts read and write permissions on the `datacenter=east` tag in the
`network` measurement in the `my_database` database.
_This restriction does not apply to other tags or tag values in the `network` measurement._

```sh
curl --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"]
  }'
```

_Consider this option carefully, as it allows writes to `network` without tags or
writes to `network` with a tag key of `datacenter` and a tag value of anything but `east`._

##### Apply restrictions to a series defined by multiple tags
```sh
curl --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [
      {"match": "exact", "key": "tag1", "value": "value1"},
      {"match": "exact", "key": "tag2", "value": "value2"}
    ],
    "permissions": ["read", "write"]
  }'
```

{{% note %}}
#### Create multiple restrictions at a time
There may be times where you need to create restrictions using unique values for each.
To create multiple restrictions for a list of values, use a bash `for` loop:

```sh
for value in val1 val2 val3 val4; do
  curl --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/restrictions" \
    -u "admin-username:admin-password" \
    -H "Content-Type: application/json" \
    --data-binary '{
      "database": {"match": "exact", "value": "my_database"},
      "measurement": {"match": "exact", "value": "network"},
      "tags": [{"match": "exact", "key": "datacenter", "value": "'$value'"}],
      "permissions": ["read", "write"]
    }'
done
```
{{% /note %}}

### View existing restrictions
To view existing restrictions, use the `GET` request method with the `acl/restrictions` endpoint.

```sh
curl --location-trusted -u "admin-username:admin-password" -XGET "http://localhost:8091/influxdb/v2/acl/restrictions" | jq
```

### Update a restriction
_You can not directly modify a restriction.
Delete the existing restriction and create a new one with updated parameters._

### Remove a restriction
To remove a restriction, obtain the restriction ID using the `GET` request method
with the `acl/restrictions` endpoint.
Use the `DELETE` request method to delete a restriction by ID.

```sh
# Obtain the restriction ID from the list of restrictions
curl --location-trusted -u "admin-username:admin-password" \
  -XGET "http://localhost:8091/influxdb/v2/acl/restrictions" | jq

# Delete the restriction using the restriction ID
curl --location-trusted -u "admin-username:admin-password" \
  -XDELETE "http://localhost:8091/influxdb/v2/acl/restrictions/<restriction_id>"
```

## Manage grants
Grants remove restrictions and grant users or roles either or both read and write
permissions on InfluxDB assets.

Manage grants using the InfluxDB Meta API `acl/grants` endpoint.

```sh
curl --location-trusted -u "admin-username:admin-password" \
  -XGET "http://localhost:8091/influxdb/v2/acl/grants"
```

- [Grant permissions by database](#grant-permissions-by-database)
- [Grant permissions by measurement in a database](#grant-permissions-by-measurement-in-a-database)
- [Grant permissions by series in a database](#grant-permissions-by-series-in-a-database)
- [View existing grants](#view-existing-grants)
- [Update a grant](#update-a-grant)
- [Remove a grant](#remove-a-grant)

### Grant permissions by database
The following examples grant read and write permissions on the `my_database` database.

> **Note:** This offers no guarantee that the users will write to the correct measurement or use the correct tags.

##### Grant database-level permissions to users
```sh
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "permissions": ["read", "write"],
    "users": [
      {"name": "user1"},
      {"name": "user2"}
    ]
  }'
```

##### Grant database-level permissions to roles
```sh
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "permissions": ["read", "write"],
    "roles": [
      {"name": "role1"},
      {"name": "role2"}
    ]
  }'
```

### Grant permissions by measurement in a database
The following examples grant permissions to the `network` measurement in the `my_database` database.
These grants do not apply to other measurements in the `my_database` database nor
guarantee that users will use the correct tags.

##### Grant measurement-level permissions to users
```sh
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "permissions": ["read", "write"],
    "users": [
      {"name": "user1"},
      {"name": "user2"}
    ]
  }'
```

To grant access for roles, run:

```sh
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "permissions": ["read", "write"],
    "roles": [
      {"name": "role1"},
      {"name": "role2"}
    ]
  }'
```

### Grant permissions by series in a database

The following examples grant access only to data with the corresponding `datacenter` tag.
_Neither guarantees the users will use the `network` measurement._

##### Grant series-level permissions to users
```sh
# Grant user1 read/write permissions on data with the 'datacenter=east' tag set.
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"],
    "users": [{"name": "user1"}]
  }'

# Grant user2 read/write permissions on data with the 'datacenter=west' tag set.
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "west"}],
    "permissions": ["read", "write"],
    "users": [{"name": "user2"}]
  }'
```

##### Grant series-level permissions to roles
```sh
# Grant role1 read/write permissions on data with the 'datacenter=east' tag set.
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "role1"}]
  }'

# Grant role2 read/write permissions on data with the 'datacenter=west' tag set.
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "west"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "role2"}]
  }'
```

### Grant access to specific series in a measurement
The following examples grant read and write permissions to corresponding `datacenter`
tags in the `network` measurement.
_They each specify the measurement in the request body._

##### Grant series-level permissions in a measurement to users
```sh
# Grant user1 read/write permissions on data with the 'datacenter=west' tag set
# inside the 'network' measurement.
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"],
    "users": [{"name": "user1"}]
  }'

# Grant user2 read/write permissions on data with the 'datacenter=west' tag set
# inside the 'network' measurement.
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "west"}],
    "permissions": ["read", "write"],
    "users": [{"name": "user2"}]
  }'
```

##### Grant series-level permissions in a measurement to roles
```sh
# Grant role1 read/write permissions on data with the 'datacenter=west' tag set
# inside the 'network' measurement.
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "east"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "role1"}]
  }'

# Grant role2 read/write permissions on data with the 'datacenter=west' tag set
# inside the 'network' measurement.
curl -s --location-trusted -XPOST "http://localhost:8091/influxdb/v2/acl/grants" \
  -u "admin-username:admin-password" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "database": {"match": "exact", "value": "my_database"},
    "measurement": {"match": "exact", "value": "network"},
    "tags": [{"match": "exact", "key": "datacenter", "value": "west"}],
    "permissions": ["read", "write"],
    "roles": [{"name": "role2"}]
  }'
```

Grants for specific series also apply to [meta queries](/enterprise_influxdb/v1/query_language/schema_exploration).
Results from meta queries are restricted based on series-level permissions.
For example, `SHOW TAG VALUES` only returns tag values that the user is authorized to see.

With these grants in place, a user or role can only read or write data from or to
the `network` measurement if the data includes the appropriate `datacenter` tag set.

{{% note %}}
Note that this is only the requirement of the presence of that tag;
`datacenter=east,foo=bar` will also be accepted.
{{% /note %}}

### View existing grants
To view existing grants, use the `GET` request method with the `acl/grants` endpoint.

```sh
curl --location-trusted -u "admin-username:admin-password" \
  -XGET "http://localhost:8091/influxdb/v2/acl/grants" | jq
```

### Update a grant
_You can not directly modify a grant.
Delete the existing grant and create a new one with updated parameters._

### Remove a grant
To delete a grant, obtain the grant ID using the `GET` request method with the
`acl/grants` endpoint.
Use the `DELETE` request method to delete a grant by ID.

```sh
# Obtain the grant ID from the list of grants
curl --location-trusted -u "admin-username:admin-password" \
  -XGET "http://localhost:8091/influxdb/v2/acl/grants" | jq

# Delete the grant using the grant ID
curl --location-trusted -u "admin-username:admin-password" \
  -XDELETE "http://localhost:8091/influxdb/v2/acl/grants/<grant_id>"
```
