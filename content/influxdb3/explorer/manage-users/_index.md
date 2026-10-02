---
title: Manage users with InfluxDB 3 Explorer
seotitle: Manage InfluxDB users with InfluxDB 3 Explorer
description: >
  Use InfluxDB 3 Explorer to manage the users of an InfluxDB 3 Enterprise
  server, including how each user signs in and the roles assigned to each
  user.
menu:
  influxdb3_explorer:
    name: Manage users
weight: 6
cascade:
  metadata: [Explorer v1.11+, InfluxDB 3 Enterprise v3.12+]
  related:
    - /influxdb3/explorer/authentication/
    - /influxdb3/enterprise/admin/security/manage-users/, Manage users and authentication in InfluxDB 3 Enterprise
    - /influxdb3/enterprise/reference/internals/rbac/, Role-based access control (RBAC) in InfluxDB 3 Enterprise
---

Users are accounts that can sign in to {{% product-name %}} and work with an
InfluxDB 3 Enterprise server based on their assigned roles.
The users that you manage in Explorer are the users of the
InfluxDB 3 Enterprise server.

To manage users, navigate to **Security** > **Manage Users** in Explorer.

> [!Note]
> Explorer manages users only when the InfluxDB 3 Enterprise server has user
> authentication turned on.
> See
> [When Explorer requires sign-in](/influxdb3/explorer/authentication/#when-explorer-requires-sign-in).
> If you're running the
> [Docker container](/influxdb3/explorer/install/docker/), Explorer must also
> be running in
> [admin mode](/influxdb3/explorer/install/docker/#choose-operational-mode).

## Authentication methods

Every user signs in with one of the following authentication methods:

- **Password**: The user signs in with a username and password stored in
  InfluxDB 3 Enterprise.
- **SSO**: The user signs in through an OpenID Connect (OIDC) identity
  provider.
  The **OAuth ID** of the user matches the subject (`sub`) that the identity
  provider sends.
- **Both**: The user signs in with either a password or SSO.

An administrator selects the authentication method when adding a user.
**Password** is selected by default.
You can't change the authentication method of a user later.

For more information about how users sign in, see
[Authentication](/influxdb3/explorer/authentication/).

## User status

Each user has one of the following statuses:

- **Active**: The user can sign in and work in Explorer based on their
  assigned roles.
- **Change required**: The user must change their password the next time they
  sign in.
  See
  [Change a required password](/influxdb3/explorer/manage-users/account/#change-a-required-password).

## User roles

Roles determine what a user can see and do in Explorer.
A user can have more than one role.
The access of a user is the combination of all roles assigned to the user.

InfluxDB 3 Enterprise provides the following built-in roles:

- **Admin**
- **Member**
- **Auditor**

Of the built-in roles, only **Admin** can add, update, or delete users.
**Member** and **Auditor** can view users.

For what each role allows, and for information about custom roles, see
[Role-based access control (RBAC)](/influxdb3/enterprise/reference/internals/rbac/)
in the InfluxDB 3 Enterprise documentation.

{{< children hlevel="h2" >}}
