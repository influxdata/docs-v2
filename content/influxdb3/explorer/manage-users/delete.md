---
title: Delete a user
seotitle: Delete a user with InfluxDB 3 Explorer
description: >
  Use InfluxDB 3 Explorer to delete a user from an InfluxDB 3 Enterprise
  server and immediately revoke the user's access.
menu:
  influxdb3_explorer:
    name: Delete a user
    parent: Manage users
weight: 104
---

> [!Warning]
> #### Deleting a user cannot be undone
>
> You can't restore a user that you delete in {{% product-name %}}.

> [!Note]
> You must have the **Admin** role to delete a user.

## What deletion does

When you delete a user:

- The user loses access immediately.
- Explorer keeps the dashboards and the history of the user.

## Delete a user

1.  Navigate to **Security** > **Manage Users**.
2.  In the **Actions** column, click the menu for the user, and then select
    **Delete user**.
3.  In the confirmation dialog, confirm the deletion.

## Restrictions

- You can't delete the only administrator.
  Assign the **Admin** role to another user first.
  See
  [Change the roles of a user](/influxdb3/explorer/manage-users/update/#change-the-roles-of-a-user).
- If you delete your own user, your session ends immediately.
  Only another administrator, or someone with the operator token, can give
  you access again.
