---
title: Authentication
seotitle: Authentication in InfluxDB 3 Explorer
description: >
  Learn how users sign in to InfluxDB 3 Explorer with a username and password
  or SSO, when Explorer requires sign-in, and where to
  configure each authentication method.
menu:
  influxdb3_explorer:
    name: Authentication
weight: 7
alt_links:
  enterprise: /influxdb3/enterprise/admin/explorer-ui/
cascade:
  metadata: [Explorer v1.11+, InfluxDB 3 Enterprise v3.12+]
  related:
    - /influxdb3/explorer/manage-users/
    - /influxdb3/enterprise/admin/security/manage-users/, Manage users and authentication in InfluxDB 3 Enterprise
    - /influxdb3/enterprise/admin/explorer-ui/, Use the integrated Explorer UI in InfluxDB 3 Enterprise
---

This section describes how users sign in to {{% product-name %}}.
To authenticate API requests and client connections to InfluxDB 3, see
[Manage tokens](/influxdb3/explorer/manage-tokens/).

Explorer uses the users, roles, and authentication methods of the
InfluxDB 3 Enterprise server that it connects to.
When the server has user authentication turned on, each person signs in to
Explorer with their own account.

- [When Explorer requires sign-in](#when-explorer-requires-sign-in)
- [Authentication methods](#authentication-methods)
- [Configuration model](#configuration-model)
- [What changes when users sign in](#what-changes-when-users-sign-in)
- [Sign in](#sign-in)
- [Sessions](#sessions)

## When Explorer requires sign-in

The InfluxDB 3 server determines whether Explorer requires sign-in.
Explorer checks the server and follows the configuration of the server.

| InfluxDB 3 server                                        | What Explorer does                                                               |
| :------------------------------------------------------- | :------------------------------------------------------------------------------- |
| InfluxDB 3 Enterprise with user authentication turned on | Requires each user to sign in.                                                   |
| InfluxDB 3 Enterprise with token authentication only     | Doesn't require sign-in. Uses the token that you store with a server connection. |
| InfluxDB 3 Enterprise started with `--without-auth`      | Doesn't require sign-in or a token.                                              |
| InfluxDB 3 Core                                          | Doesn't require sign-in. Uses the token that you store with a server connection. |

To turn user authentication on or off, set the
[`--user-auth-type`](/influxdb3/enterprise/reference/config-options/#user-auth-type)
option when you start InfluxDB 3 Enterprise.
See
[Enable user authentication](/influxdb3/enterprise/admin/security/manage-users/#enable-user-authentication)
in the InfluxDB 3 Enterprise documentation.

The Explorer Docker container checks the server that you set as
`DEFAULT_INFLUX_SERVER`.
If you don't pre-configure a server, Explorer doesn't require sign-in.
See
[Pre-configure InfluxDB connections](/influxdb3/explorer/install/docker/#pre-configure-influxdb-connections).

The `--mode` option of the Explorer Docker container doesn't turn sign-in on or
off.
It sets whether Explorer runs in
[query mode or admin mode](/influxdb3/explorer/install/docker/#choose-operational-mode).
To manage users, the Docker container must run in admin mode.

Sign-in requires {{% product-name %}} v1.11 or later.
Use it with InfluxDB 3 Enterprise v3.12 or later, where user authentication is
generally available.
To check the version and edition of your server, see
[Check which version applies to you](/influxdb3/explorer/install/#check-which-version-applies-to-you).

> [!Note]
> #### InfluxDB 3 Enterprise v3.11
>
> In InfluxDB 3 Enterprise v3.11, user authentication is a preview.
>
> - The integrated Explorer UI in v3.11 is Explorer v1.10, which doesn't
>   support sign-in.
> - The Explorer v1.11 Docker container follows the configuration of the
>   server, so it requires sign-in if you turn on the preview.
>   Explorer can't ask a v3.11 server what each user is allowed to do.
>   Explorer decides from the roles of the user instead, and can display pages
>   that the server refuses.

## Authentication methods

Explorer supports two authentication methods.
You can use one method or both.
Each method matches a value of the `--user-auth-type` server option.

| Method       | How users sign in                                                    | Server value |
| :----------- | :------------------------------------------------------------------- | :----------- |
| **Password** | Username and password stored in InfluxDB 3 Enterprise                | `basic`      |
| **SSO**      | Single sign-on (SSO) with an OpenID Connect (OIDC) identity provider | `oauth`      |

To use both methods, set `--user-auth-type basic,oauth`.
The default value is `none`, which turns user authentication off.
For more information, see
[`--user-auth-type`](/influxdb3/enterprise/reference/config-options/#user-auth-type)
in the InfluxDB 3 Enterprise documentation.

Each user signs in with the method that an administrator selects when adding
the user: **Password**, **SSO**, or **Both**.
For more information, see
[Manage users](/influxdb3/explorer/manage-users/#authentication-methods).

## Configuration model

You configure authentication on the InfluxDB 3 Enterprise server, not in
Explorer.
See the following in the InfluxDB 3 Enterprise documentation:

- [Enable user authentication](/influxdb3/enterprise/admin/security/manage-users/#enable-user-authentication)
- [Configure JWT signing keys](/influxdb3/enterprise/admin/security/manage-users/#configure-jwt-signing-keys)
  for password sign-in
- [Authenticate with OAuth/OIDC](/influxdb3/enterprise/admin/security/manage-users/#optional-authenticate-with-oauthoidc)
  for SSO
- [Configure SSO for the Explorer UI](/influxdb3/enterprise/admin/explorer-ui/#configure-sso-for-the-explorer-ui)
  for SSO in the integrated Explorer UI

In Explorer, you manage the following:

- Users and their roles.
  See [Manage users](/influxdb3/explorer/manage-users/).
- The session secret of the Explorer Docker container.
  See [Sessions](#sessions).
- The SSO settings of the Explorer Docker container.
  See
  [Configure single sign-on](/influxdb3/explorer/install/docker/#configure-single-sign-on).

## What changes when users sign in

When the server requires sign-in, Explorer works differently than it does with
a stored token:

- Explorer sends requests to the server as the user who is signed in, not with
  a stored token.
- Explorer configures the connection to the server for you.
  Users work with the server that they signed in to, and can't add other
  server connections or store tokens.
- Explorer hides the pages and actions that the roles of a user don't allow.
- Dashboards, saved queries, and query history belong to the user who creates
  them.

## Sign in

If the server doesn't have any users or an operator token, Explorer opens a
setup page instead of the **Sign in** page.
See [Set up the first user](/influxdb3/explorer/authentication/set-up-first-user/).

### Sign in with a username and password

1.  Open Explorer in your browser.
2.  On the **Sign in** page, enter your **Username** and **Password**.
3.  Click **Sign in**.

If you opened a link to a specific page, Explorer opens that page after you
sign in.

If an administrator requires you to change your password, Explorer opens the
**Change your password** page.
See [Change a required password](/influxdb3/explorer/manage-users/account/#change-a-required-password).

### Sign in with SSO

Before you sign in with SSO, an administrator does the following:

- Configures the InfluxDB 3 Enterprise server to use your identity provider.
  See
  [Configure SSO for the Explorer UI](/influxdb3/enterprise/admin/explorer-ui/#configure-sso-for-the-explorer-ui).
  For the Explorer Docker container, the administrator also configures the
  container.
  See
  [Configure single sign-on](/influxdb3/explorer/install/docker/#configure-single-sign-on).
- [Adds a user](/influxdb3/explorer/manage-users/add/#add-a-user-that-signs-in-with-sso)
  for you with an **OAuth ID** that matches the subject (`sub`) that your
  identity provider sends.

To sign in:

1.  Open Explorer in your browser.
2.  On the **Sign in** page, click **Sign in with SSO**.
3.  Sign in with your identity provider.

Your identity provider returns you to Explorer.

## Sessions

Explorer keeps a user signed in for up to 120 days, and extends that time
while the user works in Explorer.

Explorer ends a session sooner when any of the following happen:

- The user [signs out](/influxdb3/explorer/manage-users/account/#sign-out).
- An administrator deletes the user.
- The session secret changes.
  A new session secret signs out every user.

To keep users signed in when the server or container restarts, use the same
session secret each time:

- For the integrated Explorer UI, see
  [Sessions](/influxdb3/enterprise/admin/explorer-ui/#sessions) in the
  InfluxDB 3 Enterprise documentation.
- For the Docker container, set `SESSION_SECRET_KEY`.
  See [Environment variables](/influxdb3/explorer/install/docker/#environment-variables).

When a session ends, Explorer opens the **Sign in** page.
After the user signs in, Explorer returns to the page that the user was
working in.

{{< children hlevel="h2" >}}
