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
User groups associate access privileges with user attributes--an important part of the
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
- **Member**: Read permission on certain resources and create permission for
  database tokens; members can't delete or create databases or admin tokens.
- **Auditor**: Read permission on all resources; auditors can't modify resources.

> [!Note]
> #### Users are Admin by default
>
> All users in your account are initially assigned to the Admin group,
> retaining full access to resources in your instance.

## User management methods

Admin users can use the Admin UI to perform the following user management tasks:

- **View users and invitations** - View existing users, invite status, invite ID, and invitation date
- **Invite new users** - Send invitations with role assignment (Admin, Member, Auditor)
- **Revoke pending invitations** - Cancel invitations that haven't been accepted

> [!Note]
> #### Role permissions
>
> Auditor role users can view the invite list but cannot send or revoke invitations. Member role users cannot access the invite list.

For more information, see [Manage users in the Admin UI](/influxdb3/cloud/admin/users/admin-ui/).

{{< children >}}
