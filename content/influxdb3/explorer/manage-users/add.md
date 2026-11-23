---
title: Add a user
seotitle: Add a user with InfluxDB 3 Explorer
description: >
  Use InfluxDB 3 Explorer to add a user to an InfluxDB 3 Enterprise server,
  select how the user signs in, and assign roles.
menu:
  influxdb3_explorer:
    name: Add a user
    parent: Manage users
weight: 102
---

Administrators can add users to an InfluxDB 3 Enterprise server from
{{% product-name %}}.
When you add a user, you select how the user signs in and assign roles to the
user.
The user can sign in as soon as you add them.

> [!Note]
> You must have the **Admin** role to add a user.

- [Add a user](#add-a-user)
- [Add a user that signs in with SSO](#add-a-user-that-signs-in-with-sso)
- [Add a user without a role](#add-a-user-without-a-role)
- [Authentication methods that the server doesn't allow](#authentication-methods-that-the-server-doesnt-allow)

## Add a user

1.  Navigate to **Security** > **Manage Users**.
2.  Click **Add User**.
3.  Under **Authentication**, select how the user signs in:
    **Password**, **SSO**, or **Both**.
    The default is **Password**.
    For more information, see
    [Authentication methods](/influxdb3/explorer/manage-users/#authentication-methods).
4.  For **Password** or **Both**, enter the following:

    - **Username**: 3 to 64 characters: letters, numbers, underscores, and
      hyphens.
    - **Password**: 10 to 64 characters.
    - **Display name** _(optional)_: The name that Explorer displays for the
      user.
    - **Require password change at first sign-in**: Selected by default.
      The user must change the password the first time they sign in.
      See
      [Change a required password](/influxdb3/explorer/manage-users/account/#change-a-required-password).

5.  For **SSO** or **Both**, enter the **OAuth ID** of the user.
    See
    [Add a user that signs in with SSO](#add-a-user-that-signs-in-with-sso).
6.  Under **Roles**, select the roles to assign to the user.
    Each role displays its description from the server.
7.  Click **Create Account**.

Explorer adds the user to the **Manage Users** page.
Share the username and password with the user through a secure channel.

> [!Important]
> #### You can't change the authentication method later
>
> To change how a user signs in,
> [delete the user](/influxdb3/explorer/manage-users/delete/) and add the user
> again.

> [!Tip]
> #### Give a user a second way to sign in
>
> An administrator can't reset a forgotten password.
> If the server uses an identity provider, select **Both** so that the user
> can sign in with SSO if they forget their password.

## Add a user that signs in with SSO

To add a user that signs in through an identity provider, select **SSO** or
**Both** under **Authentication**, and then enter the **OAuth ID** of the
user.
The **OAuth ID** must match the subject (`sub`) that your identity provider
sends for the user.

If you select **SSO**, Explorer doesn't ask for a username, a password, or a
display name.
To set a display name for the user after you add them, see
[Edit a display name](/influxdb3/explorer/manage-users/update/#edit-a-display-name).

## Add a user without a role

If you don't select a role, the user has only the basic permissions of the
server until an administrator assigns roles.
To assign roles later, see
[Change the roles of a user](/influxdb3/explorer/manage-users/update/#change-the-roles-of-a-user).

## Authentication methods that the server doesn't allow

If you select an authentication method that the server doesn't have turned
on, Explorer displays a warning--for example:

```text
This server isn't running with SSO sign-in enabled. The account will be created, but this person can't sign in with it until the server is restarted with --user-auth-type including oauth.
```

Explorer still adds the user, but the user can't sign in until you restart
the server with that method turned on.

To turn on an authentication method, see
[Authentication methods](/influxdb3/explorer/authentication/#authentication-methods).
