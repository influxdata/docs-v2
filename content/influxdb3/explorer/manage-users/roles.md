---
title: User roles and access
seotitle: User roles and access in InfluxDB 3 Explorer
description: >
  Learn which InfluxDB 3 Explorer pages and actions each built-in
  InfluxDB 3 Enterprise role allows, and what Explorer displays when the
  server refuses access.
menu:
  influxdb3_explorer:
    name: User roles and access
    parent: Manage users
weight: 105
alt_links:
  enterprise: /influxdb3/enterprise/reference/internals/rbac/
---

When users sign in to {{% product-name %}}, the roles assigned to each user
determine which pages and actions Explorer displays.

- [How Explorer decides what to display](#how-explorer-decides-what-to-display)
- [Pages and the access they require](#pages-and-the-access-they-require)
- [Actions and the access they require](#actions-and-the-access-they-require)
- [Databases in selectors](#databases-in-selectors)
- [When access is refused](#when-access-is-refused)
- [Servers that don't require sign-in](#servers-that-dont-require-sign-in)
- [Custom roles](#custom-roles)

## How Explorer decides what to display

The InfluxDB 3 Enterprise server decides what each user can do.
When a user signs in, Explorer asks the server which actions the user's roles
allow, and hides the pages and actions that the server would refuse.

Hiding a page doesn't grant or remove access.
The server checks every request, so a user can't get around a hidden page by
opening its URL or by calling the API.

The access of a user is the combination of all roles assigned to the user.

## Pages and the access they require

The following table shows which pages each built-in role can open.
A page that a role can't open doesn't appear in the navigation.

| Page                                                  | Admin | Member | Auditor |
| :---------------------------------------------------- | :---: | :----: | :-----: |
| **System Overview**                                   |  Yes  |   No   |   No    |
| **Manage Databases**                                  |  Yes  |  Yes   |   Yes   |
| **Query Data**                                        |  Yes  |  Yes   |   No    |
| **Dashboards**                                        |  Yes  |  Yes   |   No    |
| **Write Data**                                        |  Yes  |  Yes   |   No    |
| **Security** > **Manage Users**                       |  Yes  |  Yes   |   Yes   |
| **Security** > **Manage Tokens**                      |  Yes  |   No   |   No    |
| **Manage Tables**                                     |  Yes  |   No   |   No    |
| **Configure** > **Caches**                            |  Yes  |   No   |   No    |
| **Manage Plugins**                                    |  Yes  |   No   |   No    |
| **Transform Data**                                    |  Yes  |   No   |   No    |

Every user can open **Get Help** and the **Servers**, **CL Builder**, and
**Integrations** pages under **Configure**.

After sign-in, Explorer opens **System Overview** for a user who can open it
and **Configure** > **Servers** for every other user.

A user without any roles holds only the basic permissions of the server and
sees only the pages that don't require access.

> [!Note]
> #### Member and Auditor can't read system information
>
> The server refuses system information, such as metrics and health, to the
> **Member** and **Auditor** roles.
> For this reason, **System Overview** is available only to **Admin**.
> For what each role allows on the server, see
> [Role-based access control (RBAC)](/influxdb3/enterprise/reference/internals/rbac/#built-in-roles)
> in the InfluxDB 3 Enterprise documentation.

## Actions and the access they require

| Action                                                  | Admin | Member | Auditor |
| :------------------------------------------------------ | :---: | :----: | :-----: |
| Create a database                                       |  Yes  |  Yes   |   No    |
| Set the retention period of a database                  |  Yes  |  Yes   |   No    |
| Delete a database                                       |  Yes  |   No   |   No    |
| Create or delete a table                                |  Yes  |   No   |   No    |
| Create or delete a cache                                |  Yes  |   No   |   No    |
| Create or delete a token                                |  Yes  |   No   |   No    |
| Add, update, or delete a user                           |  Yes  |   No   |   No    |
| Change the roles of a user                              |  Yes  |   No   |   No    |

The server allows the **Member** role to create and delete tokens with the
`influxdb3` CLI or the API.
Explorer offers token management only to administrators.

## Databases in selectors

Database selectors, such as the database list in **Query Data** and
**Write Data**, list only the databases that the user can use for that task:

- **Query Data** lists the databases that the user can read.
- **Write Data** lists the databases that the user can write to.

The server lists only the databases that a user can read or describe.
A database that a user can only write to doesn't appear in any selector.

## When access is refused

If a user opens a page that their roles don't allow, Explorer displays a
message inside the page instead of the page content--for example:

```text
Your role does not allow you to manage tokens
You are signed in with the Member role. Ask an administrator to grant access, or to run:
influxdb3 update user-roles <user-id> --role <role>
```

The message names the roles of the user.
If Explorer can't read the roles of the user, the message says
`Your roles on this deployment could not be read.`
If the user doesn't have any roles, the message says
`Your account holds no roles on this deployment.`

To give a user access, an administrator
[changes the roles of the user](/influxdb3/explorer/manage-users/update/#change-the-roles-of-a-user)
or runs `influxdb3 update user-roles`.

## Servers that don't require sign-in

When the server doesn't require sign-in, Explorer has no user roles to check.
The token that you store with the server connection decides what Explorer can
do, and the server refuses requests that the token doesn't allow.
In this case, Explorer displays messages about the token instead of roles--for
example, `Plugins need an admin token`.

## Custom roles

InfluxDB 3 Enterprise can also have custom roles.
For more information, see
[Custom roles](/influxdb3/enterprise/reference/internals/rbac/#custom-roles)
in the InfluxDB 3 Enterprise documentation.
