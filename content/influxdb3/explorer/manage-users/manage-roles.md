---
title: Manage roles
seotitle: Manage custom roles with InfluxDB 3 Explorer
description: >
  Use InfluxDB 3 Explorer to create, edit, duplicate, assign, and delete
  custom roles in InfluxDB 3 Enterprise.
menu:
  influxdb3_explorer:
    name: Manage roles
    parent: Manage users
weight: 106
metadata: [Explorer v1.12+, InfluxDB 3 Enterprise v3.12+]
related:
  - /influxdb3/explorer/manage-users/roles/
  - /influxdb3/enterprise/reference/internals/rbac/, Role-based access control (RBAC) in InfluxDB 3 Enterprise
  - /influxdb3/enterprise/reference/config-options/#rbac-authoring-disabled, rbac-authoring-disabled option
---

In {{% product-name %}} v1.12 and later, you can create custom roles that grant
exactly the permissions a group of users needs, and assign them to users.

To manage roles, navigate to **Security** > **Manage Roles** in Explorer.
The page lists every role on the server.

- [Requirements](#requirements)
- [Create a role](#create-a-role)
- [Edit the permissions of a role](#edit-the-permissions-of-a-role)
- [Assign a role to users](#assign-a-role-to-users)
- [Duplicate a role](#duplicate-a-role)
- [Delete a role](#delete-a-role)

## Requirements

- The InfluxDB 3 Enterprise server requires users to
  [sign in](/influxdb3/explorer/authentication/).
- The server has role authoring turned on.
  Role authoring is off by default.
  To turn it on, start the server with `--rbac-authoring-disabled=false` or
  set `INFLUXDB3_RBAC_AUTHORING_DISABLED=false`.
  See
  [`rbac-authoring-disabled`](/influxdb3/enterprise/reference/config-options/#rbac-authoring-disabled)
  in the InfluxDB 3 Enterprise documentation.
- To view roles, your roles must allow reading roles.
  To create, edit, or delete roles, your roles must allow those actions.
  The **Admin** role allows all of them.

When role authoring is off, Explorer lists roles but doesn't let you create
or edit them, and displays the following message:

```text
Role authoring is disabled on this server. Start it with --rbac-authoring-disabled=false to create and edit roles.
```

> [!Note]
> #### System roles can't be changed
>
> The server creates the **Admin**, **Member**, and **Auditor** roles.
> You can't edit or delete them.
> The **Admin** role has full access and isn't expressed as permissions.

## Create a role

1.  Navigate to **Security** > **Manage Roles**.
2.  Click **Create Role**.
3.  Enter a **Role Name**.
    Use letters, numbers, spaces, hyphens, and underscores.
4.  Enter a **Description**.
5.  Under **Start From**, select a role whose permissions to copy as a
    starting point.
    You can't start from **Admin**.
6.  Click **Next: Permissions**.
    Explorer creates the role and opens it.
7.  Set the permissions of the role.
    See [Edit the permissions of a role](#edit-the-permissions-of-a-role).

## Edit the permissions of a role

1.  Navigate to **Security** > **Manage Roles**, and then click the name of the
    role.
2.  Select the permissions to grant in each section:

    - **Administrative Permissions**: managing roles and admin tokens.
    - **Instance Permissions**: resource tokens, users, and system status
      endpoints.
    - **Database Permissions**: reading, writing, describing, and deleting
      data in specific databases or in all databases, and creating databases.

    Permissions granted on the **All databases** row also apply to databases
    created later.
    To set permissions for a specific database, click **Add database**.

3.  Click **Save changes**.
4.  Review the changes, and then click **Save Changes**.

If you hold the role that you edit, the changes also apply to your own access.

## Assign a role to users

1.  Navigate to **Security** > **Manage Roles**, and then click the name of the
    role.
2.  Under **Users**, click **Edit users**.
3.  Select the users to assign the role to, and clear the users to remove.
4.  Click **Apply**.

Assignment changes apply immediately.
They aren't part of unsaved permission edits.

You can also assign roles from the **Manage Users** page.
See
[Change the roles of a user](/influxdb3/explorer/manage-users/update/#change-the-roles-of-a-user).

## Duplicate a role

1.  Navigate to **Security** > **Manage Roles**.
2.  In the **Actions** column, click the menu for the role, and then select
    **Duplicate**.
3.  Enter a **New role name**, and then click **Create Role**.

The new role has the same permissions and description as the original.

## Delete a role

> [!Warning]
> Deleting a role removes its access from every user who holds it.
> You can't undo the deletion.

1.  Navigate to **Security** > **Manage Roles**.
2.  In the **Actions** column, click the menu for the role, and then select
    **Delete**.
3.  Click **Delete Role**.
