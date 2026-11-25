---
title: Manage users
seotitle: Manage users and permissions in {{< product-name >}}
description: >
  Manage users and access to resources in your {{< product-name >}} instance.
  Use the Admin UI for self-service user management or contact support for
  advanced operations.
menu:
  influxdb3_cloud:
    parent: Administer InfluxDB
weight: 101
influxdb3/cloud/tags: [users, roles]
related:
  - /influxdb3/cloud/admin/tokens/
  - /influxdb3/cloud/admin/users/roles/
  - /influxdb3/cloud/admin/users/permissions/
---

Manage users and access to resources in your {{% product-name %}} instance.

Assign users roles based on the level of access they need, to minimize
unnecessary access and reduce the risk of inadvertent actions.
Roles were previously called _user groups_.

- [Roles](#roles)
- [User management methods](#user-management-methods)

## Roles

In {{% product-name %}}, users have management responsibilities, such as creating and
deleting [databases](/influxdb3/cloud/admin/databases/) and provisioning
[database tokens](/influxdb3/cloud/admin/tokens/) for reading and writing data.

Every account starts with the following default roles:

- **Admin**: Full access to account and instance resources.
- **Member**: Create, describe, read, write, and delete permissions on
  databases, and view, create, and delete permissions on database
  (resource) tokens.
  Members can't create admin tokens and can only view users and instances.
  Members can't use the Admin UI **Tokens** page, which requires the **Admin** role.
  To create database tokens, members use the `influxdb3` CLI or the HTTP API.
- **Auditor**: View permission on users, instances, and invitations,
  and describe permission on databases.
  Auditors can see databases and schemas and view database tokens,
  but can't query or write data or modify resources.

You can also [create custom roles](/influxdb3/cloud/admin/users/create-custom-role/)
that grant only the access you choose.
When you invite a user, you choose one or more roles for them.

For more information, see [Understand roles](/influxdb3/cloud/admin/users/roles/)
and the [permissions reference](/influxdb3/cloud/admin/users/permissions/).

## User management methods

Use the Admin UI to perform the following user management tasks:

- **View users and invitations** - View existing users, and view each invitation's recipient, status, sent date, and expiration date
- **Invite new users** - Send invitations with role assignment
- **Revoke pending invitations** - Cancel invitations that haven't been accepted
- **Create and edit roles** - Create custom roles, grant permissions, and assign roles to users

> [!Note]
> #### Role permissions
>
> The tasks you can perform depend on your roles.
> By default, **Admin** can perform all of these tasks.
> **Auditor** can view the invite list but can't send or revoke invitations.
> **Member** can't access the invite list.

For more information, see [Manage users in the Admin UI](/influxdb3/cloud/admin/users/admin-ui/).

{{< children >}}
