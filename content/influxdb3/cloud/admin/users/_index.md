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
influxdb3/cloud/tags: [user groups]
related:
  - /influxdb3/cloud/admin/tokens/
---

Manage users and access to resources in your {{% product-name %}} instance.

By assigning users to different groups based on the level of access they need,
you can minimize unnecessary access and reduce the risk of inadvertent
actions.
User groups associate access privileges with user attributes—an important part of the
Attribute-Based Access Control (ABAC) security model which grants access based on
user attributes, resource types, and environment context.

- [Available user groups](#available-user-groups)
- [User management methods](#user-management-methods)

## Available user groups

In {{% product-name %}}, users have management responsibilities, such as creating and
deleting [databases](/influxdb3/cloud/admin/databases/) and provisioning
[database tokens](/influxdb3/cloud/admin/tokens/) for reading and writing data.

A user can belong to the following groups, each with predefined privileges:

- **Admin**: Read and write permissions on all resources.
- **Member**: Create, describe, read, write, and delete permissions on
  databases, and view, create, and delete permissions on database
  (resource) tokens.
  Members can't view or create admin tokens and can only view users and instances.
  Members can't use the console **Tokens** page, which requires the **Admin** role.
  To create database tokens, members use the `influxdb3` CLI or the HTTP API.
- **Auditor**: View permission on users, instances, and invitations,
  and describe permission on databases.
  Auditors can see databases and schemas and view database tokens,
  but can't query or write data or modify resources.

When you invite a user, you choose one or more roles for them.

## User management methods

Admin users can use the Admin UI to perform the following user management tasks:

- **View users and invitations** - View existing users, and view each invitation's recipient, status, sent date, and expiration date
- **Invite new users** - Send invitations with role assignment (Admin, Member, Auditor)
- **Revoke pending invitations** - Cancel invitations that haven't been accepted

> [!Note]
> #### Role permissions
>
> Auditor role users can view the invite list but cannot send or revoke invitations. Member role users cannot access the invite list.

For more information, see [Manage users in the Admin UI](/influxdb3/cloud/admin/users/admin-ui/).

{{< children >}}
