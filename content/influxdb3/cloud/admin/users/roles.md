---
title: Understand roles
seotitle: Understand roles in {{< product-name >}}
description: >
  Learn how roles control what users can do in {{< product-name >}}, the
  difference between default and custom roles, and how account and instance
  permissions apply.
menu:
  influxdb3_cloud:
    parent: Manage users
    name: Understand roles
weight: 202
influxdb3/cloud/tags: [users, roles, permissions, admin ui]
related:
  - /influxdb3/cloud/admin/users/permissions/
  - /influxdb3/cloud/admin/users/create-custom-role/
  - /influxdb3/cloud/admin/users/admin-ui/
  - /influxdb3/cloud/admin/tokens/
---

A role is a named set of permissions.
Assign roles to users to control what they can do in your {{% product-name %}}
account and on each instance.

- [Default roles](#default-roles)
- [Custom roles](#custom-roles)
- [Account and instance permissions](#account-and-instance-permissions)
- [Users with multiple roles](#users-with-multiple-roles)
- [Role limits](#role-limits)

## Default roles

Every account starts with the following roles:

- **Admin**: Full access to account and instance resources.
  You can't edit or delete the **Admin** role.
- **Member**: Can create, query, write to, and delete databases, and can manage
  resource tokens.
- **Auditor**: Can view account resources and database schemas, but can't query
  or write data or change resources.

You can edit or delete the **Member** and **Auditor** roles for your account.
For the permissions that each role starts with, see
[Default role permissions](/influxdb3/cloud/admin/users/permissions/#default-role-permissions).

## Custom roles

Create a custom role when the default roles grant too much or too little access.
For example, you can create a role that can only query one database on one
instance.

To create and edit roles, you need the **Manage** permission on **Roles**.
The **Admin** role includes this permission.

To get started, see [Create a custom role](/influxdb3/cloud/admin/users/create-custom-role/).

## Account and instance permissions

Each role has two sets of permissions:

- **Account permissions** apply to the whole account, independent of any
  instance permission.
  For example, they control who can view users or send invitations.
- **Instance permissions** apply to one instance.
  They control access to the instance's databases, tokens, and system endpoints.
  Set them separately for each instance in the account.

Database permissions can apply to **All databases**, which includes databases
created later, or to specific databases that you select.

## Users with multiple roles

A user can hold more than one role, and must hold at least one.
A user who holds multiple roles has the combined permissions of those roles.

When you change a role's permissions, the change applies immediately to everyone
who holds the role.

## Role limits

- An account can have up to 20 roles, including the 3 default roles.
- A role name can have up to 64 characters and can contain letters, numbers,
  spaces, hyphens (`-`), and underscores (`_`).
  Role names must be unique in the account.
- A role description is required and can have up to 512 characters.
