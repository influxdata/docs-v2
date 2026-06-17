---
title: Role-based access control (RBAC)
seotitle: Role-based access control (RBAC) in InfluxDB 3 Enterprise
description: >
  How {{% product-name %}} role-based access control (RBAC) works: built-in
  roles, the permissions model, and current limitations. RBAC is part of the
  user authentication preview.
menu:
  influxdb3_enterprise:
    name: Role-based access control
    parent: Enterprise internals
weight: 108
related:
  - /influxdb3/enterprise/admin/security/manage-users/
  - /influxdb3/enterprise/reference/internals/authentication/
---

> [!Note]
> #### RBAC is part of the user authentication preview
>
> Role-based access control applies to the multi-user authentication preview,
> which is **off by default** in {{% product-name %}}. Existing `apiv3_`
> token workflows are unaffected. See
> [Manage users and authentication](/influxdb3/enterprise/admin/security/manage-users/)
> to enable the preview.

Role-based access control (RBAC) governs what authenticated users can do in
{{% product-name %}}. Each user is assigned one or more built-in roles that
determine their permissions.

## Built-in roles

{{% product-name %}} provides three built-in roles:

- **Admin**: Full administrative access, including user and role management.
- **Auditor**: Read access intended for reviewing and auditing the system.
- **Member**: Standard access for working with data.

## Assign roles

Assign roles to a user with the `influxdb3 update user-roles` command. See
[Manage users and authentication](/influxdb3/enterprise/admin/security/manage-users/)
for the user-management workflow.

## Limitations

RBAC has the following known limitations in {{% product-name %}}:

- **Token scope can exceed role scope**: A non-admin user can currently create tokens with broader permissions than their assigned role.
