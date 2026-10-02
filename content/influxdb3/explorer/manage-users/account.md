---
title: Manage your account
seotitle: Manage your account in InfluxDB 3 Explorer
description: >
  View your roles, change your password, and sign out of InfluxDB 3 Explorer.
menu:
  influxdb3_explorer:
    name: Manage your account
    parent: Manage users
weight: 101
---

Any user who is signed in can manage their own account from the account menu.
Use the account menu to view your roles, change your password, or sign out.

- [Account menu](#account-menu)
- [Change your password](#change-your-password)
- [Change a required password](#change-a-required-password)
- [Forgotten passwords](#forgotten-passwords)
- [Sign out](#sign-out)

## Account menu

In the sidebar, click your name to open the account menu.
The account menu displays your display name, your username, and the roles
assigned to you.

To change your display name or your roles, ask an administrator.

## Change your password

To change your password, you must provide your current password along with
the new one.

1.  In the sidebar, click your name to open the account menu.
2.  Click **Change password**.
3.  In the **Current password** field, enter your existing password.
4.  In the **New password** field, enter your new password.
5.  In the **Confirm new password** field, re-enter the new password.
6.  Click **Change password**.

> [!Note]
> Your new password must be 10 to 64 characters and different from your
> current password.

If you only sign in with SSO, you don't have a password in InfluxDB, and the
account menu doesn't display **Change password**.

## Change a required password

An administrator can require you to change your password the next time you
sign in.
When you sign in, Explorer opens the **Change your password** page.
You can't use Explorer until you change your password.

1.  In the **Current password** field, enter your existing password.
2.  In the **New password** field, enter your new password.
3.  In the **Confirm new password** field, re-enter the new password.
4.  Click **Change password**.

After you change your password, Explorer opens the page that you requested.

## Forgotten passwords

> [!Important]
> #### Explorer can't reset a forgotten password
>
> Only you can change your password, and you need your current password to
> change it.
> If you forget your password, ask an administrator to delete your user and
> add it again.

## Sign out

1.  In the sidebar, click your name to open the account menu.
2.  Click **Sign out**.

Explorer opens the **Sign in** page.
If you signed in with SSO and your identity provider supports sign-out,
Explorer sends you to your identity provider to sign out.
