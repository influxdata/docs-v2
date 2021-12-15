---
title: Enterprise permissions
description: Overview of user management and security in InfluxDB Enterprise.
menu:
  enterprise_influxdb_1_9:
    parent: Manage security
weight: 100
aliases:
  - /enterprise_influxdb/v1.9/features/users/
---

<!--
Consider:
Penelope, who has a Dev role, w/ permissions: she can Manage Queries, Monitor, Add/remove Nodes.
Jim has role Marketing, w/ permissions:  he can View Admin, Graph Role, View Chronograf.
-->

## Users

Users have permissions and roles.

### Roles

Roles are groups of permissions.
A single role can belong to several users.

InfluxDB Enterprise clusters have two built-in roles:

#### Global Admin

The Global Admin role has all 16 [cluster permissions](#permissions).

#### Admin

The Admin role has all [cluster permissions](#permissions) except for the
permissions to:

* Add/Remove Nodes
* Copy Shard
* Manage Shards
* Rebalance

### Permissions

InfluxDB Enterprise clusters have 16 permissions:

| Permission                | Description                                             |
|:--------------------------|---------------------------------------------------------|
| View Admin                | Permission to view or edit admin screens                |
| View Chronograf           | Permission to use Chronograf tools                      |
| Create Databases          | Permission to create databases                          |
| Create Users & Roles      | Permission to create users and roles                    |
| Add/Remove Nodes          | Permission to add/remove nodes from a cluster           |
| Drop Databases            | Permission to drop databases                            |
| Drop Data                 | Permission to drop measurements and series              |
| Read                      | Permission to read data                                 |
| Write                     | Permission to write data                                |
| Rebalance                 | Permission to rebalance a cluster                       |
| Manage Shards             | Permission to copy and delete shards                    |
| Manage Continuous Queries | Permission to create, show, and drop continuous queries |
| Manage Queries            | Permission to show and kill queries                     |
| Manage Subscriptions      | Permission to show, add, and drop subscriptions         |
| Monitor                   | Permission to show stats and diagnostics                |
| Copy Shard                | Permission to copy shards                               |

### Permission to Statement

The following table describes permissions required to execute the associated database statement.
<!-- It also describes whether these permissions apply just to InfluxDB (Database) or InfluxDB Enterprise (Cluster). -->

| Permission                             | Statement                                                                                                                                                                                    |
|----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| CreateDatabasePermission               | AlterRetentionPolicyStatement, CreateDatabaseStatement, CreateRetentionPolicyStatement, ShowRetentionPoliciesStatement                                                                       |
| ManageContinuousQueryPermission        | CreateContinuousQueryStatement, DropContinuousQueryStatement, ShowContinuousQueriesStatement                                                                                                 |
| ManageSubscriptionPermission           | CreateSubscriptionStatement, DropSubscriptionStatement, ShowSubscriptionsStatement                                                                                                           |
| CreateUserAndRolePermission            | CreateUserStatement, DropUserStatement, GrantAdminStatement, GrantStatement, RevokeAdminStatement, RevokeStatement, SetPasswordUserStatement, ShowGrantsForUserStatement, ShowUsersStatement |
| DropDataPermission                     | DeleteSeriesStatement, DeleteStatement, DropMeasurementStatement, DropSeriesStatement                                                                                                        |
| DropDatabasePermission                 | DropDatabaseStatement, DropRetentionPolicyStatement                                                                                                                                          |
| ManageShardPermission                  | DropShardStatement,ShowShardGroupsStatement, ShowShardsStatement                                                                                                                             |
| ManageQueryPermission                  | KillQueryStatement, ShowQueriesStatement                                                                                                                                                     |
| MonitorPermission                      | ShowDiagnosticsStatement, ShowStatsStatement                                                                                                                                                 |
| ReadDataPermission                     | ShowFieldKeysStatement, ShowMeasurementsStatement, ShowSeriesStatement, ShowTagKeysStatement, ShowTagValuesStatement, ShowRetentionPoliciesStatement                                         |
| NoPermissions                          | ShowDatabasesStatement                                                                                                                                                                       |
| Determined by type of select statement | SelectStatement                                                                                                                                                                              |

### Statement to Permission

The following table describes database statements and the permissions required to execute them.
It also describes whether these permissions apply the the database or cluster level.

| Statement                      | Permissions                            | Scope    |                                                                          |
|--------------------------------|----------------------------------------|----------|--------------------------------------------------------------------------|
| AlterRetentionPolicyStatement  | CreateDatabasePermission               | Database |                                                                          |
| CreateContinuousQueryStatement | ManageContinuousQueryPermission        | Database |                                                                          |
| CreateDatabaseStatement        | CreateDatabasePermission               | Cluster  |                                                                          |
| CreateRetentionPolicyStatement | CreateDatabasePermission               | Database |                                                                          |
| CreateSubscriptionStatement    | ManageSubscriptionPermission           | Database |                                                                          |
| CreateUserStatement            | CreateUserAndRolePermission            | Database |                                                                          |
| DeleteSeriesStatement          | DropDataPermission                     | Database |                                                                          |
| DeleteStatement                | DropDataPermission                     | Database |                                                                          |
| DropContinuousQueryStatement   | ManageContinuousQueryPermission        | Database |                                                                          |
| DropDatabaseStatement          | DropDatabasePermission                 | Cluster  |                                                                          |
| DropMeasurementStatement       | DropDataPermission                     | Database |                                                                          |
| DropRetentionPolicyStatement   | DropDatabasePermission                 | Database |                                                                          |
| DropSeriesStatement            | DropDataPermission                     | Database |                                                                          |
| DropShardStatement             | ManageShardPermission                  | Cluster  |                                                                          |
| DropSubscriptionStatement      | ManageSubscriptionPermission           | Database |                                                                          |
| DropUserStatement              | CreateUserAndRolePermission            | Database |                                                                          |
| GrantAdminStatement            | CreateUserAndRolePermission            | Database |                                                                          |
| GrantStatement                 | CreateUserAndRolePermission            | Database |                                                                          |
| KillQueryStatement             | ManageQueryPermission                  | Database |                                                                          |
| RevokeAdminStatement           | CreateUserAndRolePermission            | Database |                                                                          |
| RevokeStatement                | CreateUserAndRolePermission            | Database |                                                                          |
| SelectStatement                | Determined by type of select statement | n/a      |                                                                          |
| SetPasswordUserStatement       | CreateUserAndRolePermission            | Database |                                                                          |
| ShowContinuousQueriesStatement | ManageContinuousQueryPermission        | Database |                                                                          |
| ShowDatabasesStatement         | NoPermissions                          | Cluster  | The user's grants determine which databases are returned in the results. |
| ShowDiagnosticsStatement       | MonitorPermission                      | Database |                                                                          |
| ShowFieldKeysStatement         | ReadDataPermission                     | Database |                                                                          |
| ShowGrantsForUserStatement     | CreateUserAndRolePermission            | Database |                                                                          |
| ShowMeasurementsStatement      | ReadDataPermission                     | Database |                                                                          |
| ShowQueriesStatement           | ManageQueryPermission                  | Database |                                                                          |
| ShowRetentionPoliciesStatement | CreateDatabasePermission               | Database |                                                                          |
| ShowSeriesStatement            | ReadDataPermission                     | Database |                                                                          |
| ShowShardGroupsStatement       | ManageShardPermission                  | Cluster  |                                                                          |
| ShowShardsStatement            | ManageShardPermission                  | Cluster  |                                                                          |
| ShowStatsStatement             | MonitorPermission                      | Database |                                                                          |
| ShowSubscriptionsStatement     | ManageSubscriptionPermission           | Database |                                                                          |
| ShowTagKeysStatement           | ReadDataPermission                     | Database |                                                                          |
| ShowTagValuesStatement         | ReadDataPermission                     | Database |                                                                          |
| ShowUsersStatement             | CreateUserAndRolePermission            | Database |                                                                          |

---

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
