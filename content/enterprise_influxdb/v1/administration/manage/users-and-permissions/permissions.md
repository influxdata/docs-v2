---
title: Enterprise users and permissions reference
description: >
  Detailed reference for users, roles, permissions, and permission-to-statement mappings.
menu:
  enterprise_influxdb_v1:
    parent: Manage users and permissions
weight: 100
aliases:
  - /enterprise_influxdb/v1/features/users/
---

{{% enterprise-warning-authn-b4-authz %}}

- [Users](#users)
- [Permissions](#permissions)

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

## Permissions

A **permission** (also *privilege*) is the ability to access a resource in some way, including:
- viewing the resource
- copying the resource
- dropping the resource
- writing to the resource
- full management capabilities

InfluxDB Enterprise clusters have 16 permissions:

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

In addition, two tokens govern Kapacitor permissions:

* `KapacitorAPI`:
  Grants the user permission to create, read, update and delete
  tasks, topics, handlers and similar Kapacitor artifacts.
* `KapacitorConfigAPI`:
  Grants the user permission to override the Kapacitor configuration
  dynamically using the configuration endpoint.

### Permissions scope

Using the InfluxDB Enterprise Meta API,
these permissions can be set at the cluster-wide level (for all databases at once)
and for specific databases.
For examples, see [Manage authorization with the InfluxDB Enterprise Meta API](/enterprise_influxdb/v1/administration/manage/users-and-permissions/authorization-api/).

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
