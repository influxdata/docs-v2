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
  Any session that the user has open stops working.
- Explorer deletes the dashboards, connections, saved queries, and query
  history of the user.
  Other users, including administrators, can't open them.

If you add a user with the same username again, the new user starts without
any Explorer data.

> [!Note]
> In Explorer v1.11.0, the confirmation dialog says that the dashboards and
> history of the user are kept.
> Explorer deletes them in every v1.11 release.

## Delete a user

1.  Navigate to **Security** > **Manage Users**.
2.  In the **Actions** column, click the menu for the user, and then select
    **Delete user**.
3.  In the confirmation dialog, click the **Delete** button that names the
    user--for example, **Delete Jane Smith**.
    To cancel, click **Keep User**.

## Restrictions

- You can't delete the only administrator.
  Assign the **Admin** role to another user first.
  See
  [Change the roles of a user](/influxdb3/explorer/manage-users/update/#change-the-roles-of-a-user).
- If you delete your own user, your session ends immediately.
  Only another administrator, or someone with the operator token, can give
  you access again.
