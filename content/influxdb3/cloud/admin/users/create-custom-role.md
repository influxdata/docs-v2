---
title: Create a custom role
seotitle: Create a custom role in {{< product-name >}}
description: >
  Follow this walkthrough to create a custom role in the {{< product-name >}}
  Admin UI, grant it permissions, assign it to users, and then edit or delete it.
menu:
  influxdb3_cloud:
    parent: Manage users
    name: Create a custom role
weight: 204
influxdb3/cloud/tags: [users, roles, permissions, admin ui]
related:
  - /influxdb3/cloud/admin/users/roles/
  - /influxdb3/cloud/admin/users/permissions/
  - /influxdb3/cloud/admin/users/admin-ui/
---

Use the Admin UI to create a custom role, grant it permissions, and assign it to
users.
This walkthrough creates a **Spice analyst** role that can only query the
`arrakis` database on one instance.

To create and edit roles, you need the **Manage** permission on **Roles**.
The **Admin** role includes this permission.

- [Create the role](#create-the-role)
- [Grant permissions](#grant-permissions)
- [Assign the role to users](#assign-the-role-to-users)
- [Verify the role](#verify-the-role)
- [Edit a role](#edit-a-role)
- [Delete a role](#delete-a-role)

## Create the role

1.  Go to [console.influxdata.com](https://console.influxdata.com) and sign in.
2.  In the navigation, under **Account**, select **Roles**.
3.  Click **Create role**.
4.  In the **Create role** dialog, enter the following:

    - **Role name**: `Spice analyst`
    - **Description**: `Can query the arrakis database`
    - **Copy permissions from**: _Optional._ To start from an existing role's
      permissions, including its access on each instance, select that role.
      For this example, select **None**.

5.  Click **Create role**.

{{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-roles-create-role.png" alt="Create role dialog with the Spice analyst role name and description" />}}

The role's page opens.
It shows the role's **Account permissions**, **Instance permissions**, and
**Users**.

## Grant permissions

A new role starts with no permissions unless you copied them from another role.
For a description of each permission, see the
[permissions reference](/influxdb3/cloud/admin/users/permissions/).

1.  Click **Edit**.
2.  Under **Instance permissions**, find the instance that contains the
    `arrakis` database.
3.  Under **Database permissions**, in the **Add Databases** field, select
    `arrakis`.
4.  In the `arrakis` row, select **Read** and **Describe**.

    **Read** lets users query the database.
    **Describe** lets them list the database and view its schema.

    {{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-roles-database-permissions.png" alt="Database permissions with Read and Describe selected for the arrakis database" />}}

5.  Click **Save changes**.
6.  Review the summary of changes, and then click **Save changes** to confirm.
    To go back without saving, click **Keep editing**.

This role doesn't need any **Account permissions** to query the database.
To let its users see other users or instances in the account, grant **View** on
**Account Users** or **Instances**.

> [!Warning]
> #### Token permissions can exceed a role's database access
>
> This example doesn't grant token permissions.
> A user who can create resource tokens can create a token with broader database
> access than their role grants.
> Only grant **Create** on **Resource tokens** to users you trust with that access.

## Assign the role to users

1.  On the role's page, in the **Users** section, click **Edit users**.
2.  Select the users to give this role.
    To remove the role from a user, clear the selection for that user.
3.  Click **Save users**.

Changes to a role's users apply as soon as you save them.
If you're editing the role's permissions, save or discard those changes first.

You can also assign roles when you [invite a user](/influxdb3/cloud/admin/users/admin-ui/#invite-a-user)
or [change a user's roles](/influxdb3/cloud/admin/users/admin-ui/#change-a-users-roles)
on the **Users** page.

> [!Note]
> A user must hold at least one role.
> To remove a user's only role, give them another role first.

## Verify the role

Sign in as a user who holds only this role, and then do the following:

1.  Select the instance.
2.  In the navigation, select **Query**.
3.  In the **Database** list, check that `arrakis` is the only database.
4.  Run a query, such as the following:

    ```sql
    SELECT * FROM spice_harvest LIMIT 10
    ```

For more information, see
[Execute queries in the Admin UI](/influxdb3/cloud/query-data/execute-queries/admin-ui/).

## Edit a role

1.  In the navigation, under **Account**, select **Roles**, and then select the
    role.
2.  Click **Edit**.
3.  Change the role's name, description, or permissions.
4.  Click **Save changes**, review the summary, and then click **Save changes** to
    confirm.
    To cancel your edits, click **Discard**.

Permission changes apply immediately to everyone who holds the role.

You can't edit the **Admin** role.

> [!Note]
> You can only change a role's access on an instance that's available.
> If an instance is starting or deleted, its permissions are read-only.

## Delete a role

1.  In the navigation, under **Account**, select **Roles**, and then select the
    role.
2.  At the bottom of the role's page, click **Delete this role**.
3.  Confirm the deletion.

Deleting a role can't be undone.
Users who hold the role lose its access, and keep any other roles they hold.

You can't delete the **Admin** role.
