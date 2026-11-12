---
title: Update users
seotitle: Update users with InfluxDB 3 Explorer
description: >
  Use InfluxDB 3 Explorer to change the roles of a user, edit a display name,
  and require a user to change their password.
menu:
  influxdb3_explorer:
    name: Update users
    parent: Manage users
weight: 103
---

Administrators can change the roles of a user, edit a display name, and
require a user to change their password in {{% product-name %}}.

> [!Note]
> You must have the **Admin** role to update a user.

- [Change the roles of a user](#change-the-roles-of-a-user)
- [Edit a display name](#edit-a-display-name)
- [Require a password change](#require-a-password-change)

## Change the roles of a user

1.  Navigate to **Security** > **Manage Users**.
2.  In the **Actions** column, click the menu for the user, and then select
    **Edit roles**.
3.  Select the roles to assign to the user, and clear the roles to remove.
    The dialog displays the roles that the user has after you save.
4.  Click **Save Roles**.

The access of a user is the combination of all roles assigned to the user.
If you clear every role, the user has only the basic permissions of the
server until an administrator assigns roles again.

> [!Note]
> #### You can't remove the Admin role from the only administrator
>
> If only one user has the **Admin** role, Explorer doesn't let you clear
> that role for the user.
> Assign the **Admin** role to another user first.

## Edit a display name

The display name is the name that Explorer displays for a user.

1.  Navigate to **Security** > **Manage Users**.
2.  In the **Actions** column, click the menu for the user, and then select
    **Edit display name**.
3.  In the **Display name** field, enter the new display name.
    The display name can't be empty.
4.  Click **Save**.

## Require a password change

When a password might be exposed, or when you want a user to replace a
password that you set, require the user to change their password.

1.  Navigate to **Security** > **Manage Users**.
2.  In the **Actions** column, click the menu for the user, and then select
    **Require password change**.
3.  In the confirmation dialog, click **Require Change**.

The status of the user changes to **Change required**.
The next time the user signs in, Explorer requires them to set a new password.
See
[Change a required password](/influxdb3/explorer/manage-users/account/#change-a-required-password).

> [!Important]
> #### What a required password change doesn't do
>
> - It doesn't end the current sessions of the user.
>   The user keeps access until they sign in again.
>   To revoke access immediately,
>   [delete the user](/influxdb3/explorer/manage-users/delete/).
> - It doesn't recover a forgotten password.
>   The user needs their current password to set a new one.

**Require password change** isn't available for a user that signs in with SSO
only.
The user doesn't have a password.
