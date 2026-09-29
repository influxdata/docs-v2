---
title: Role-based access control (RBAC)
seotitle: Role-based access control (RBAC) in InfluxDB 3 Enterprise
description: >
  How {{% product-name %}} role-based access control (RBAC) works: built-in
  roles and the permissions model for multi-user authentication.
menu:
  influxdb3_enterprise:
    name: Role-based access control
    parent: Enterprise internals
weight: 108
related:
  - /influxdb3/enterprise/admin/security/manage-users/
  - /influxdb3/enterprise/reference/internals/authentication/
---

<!-- GA status per 3.12 product release notes; confirm with product before publishing. -->

> [!Note]
> #### RBAC applies to multi-user authentication
>
> Role-based access control governs users signed in through multi-user
> authentication, which is **off by default** in {{% product-name %}}. Existing
> `apiv3_` token workflows are unaffected. See
> [Manage users and authentication](/influxdb3/enterprise/admin/security/manage-users/)
> to enable it.

Role-based access control (RBAC) governs what authenticated users can do in
{{% product-name %}}. Each user is assigned one or more built-in roles that
determine their permissions.

## Built-in roles

{{% product-name %}} provides three built-in roles:

- **Admin**: Full access to all resources, including creating and managing
  other users, roles, and tokens.
- **Auditor**: Read-only access to databases, tokens, users, roles, and
  system information.
- **Member**: Read, write, create, and delete access to databases, and the
  ability to create, read, and delete tokens. Read-only access to users,
  roles, and system information. Can't manage users, roles, or admin tokens.

## Assign roles

Assign roles to a user with the `influxdb3 update user-roles` command. See
[Manage users and authentication](/influxdb3/enterprise/admin/security/manage-users/)
for the user-management workflow.

## Custom roles

Authoring custom roles (creating roles and editing role permissions) is
disabled by default (`--rbac-authoring-disabled` defaults to `true`).
Listing roles and assigning the built-in roles to users remain available
regardless of this setting.
See
[configuration options](/influxdb3/enterprise/reference/config-options/#rbac-authoring-disabled)
for details.

## Limitations

RBAC has the following known limitation in {{% product-name %}}:

- **Token scope can exceed role scope**: A user with token-creation
  permission (**Admin** or **Member**) can create a token with
  database-level permissions broader than their own role.
  {{% product-name %}} only restricts non-admin users from creating tokens
  that grant system-resource permissions.
