---
title: Role permissions reference
seotitle: Role permissions reference for {{< product-name >}}
description: >
  Reference for the account and instance permissions that you can grant to a
  role in {{< product-name >}}, and the permissions that each default role
  starts with.
menu:
  influxdb3_cloud:
    parent: Manage users
    name: Permissions reference
weight: 203
influxdb3/cloud/tags: [users, roles, permissions, admin ui]
related:
  - /influxdb3/cloud/admin/users/roles/
  - /influxdb3/cloud/admin/users/create-custom-role/
  - /influxdb3/cloud/admin/tokens/
---

Use this reference to choose the permissions for a
[role](/influxdb3/cloud/admin/users/roles/).
The tables use the same names as the role page in the Admin UI.

- [Account permissions](#account-permissions)
- [Instance permissions](#instance-permissions)
- [Default role permissions](#default-role-permissions)

## Account permissions

Account permissions apply to the whole account.

| Resource            | Permission | Allows the user to                                      |
| :------------------ | :--------- | :------------------------------------------------------ |
| Account Permissions | Update     | Rename the account                                      |
| Roles               | Manage     | Create, edit, and delete roles                          |
| Account Users       | View       | View the users in the account                           |
| Account Users       | Create     | Add users to the account                                |
| Account Users       | Update     | Change a user in the account, including their roles     |
| Account Users       | Delete     | Remove users from the account                           |
| Instances           | View       | View instances in the account                           |
| Instances           | Update     | Change instance settings                                |
| Management Tokens   | View       | View management tokens                                  |
| Management Tokens   | Create     | Create management tokens                                |
| Management Tokens   | Update     | Change or revoke management tokens                      |
| Invitations         | View       | View invitations                                        |
| Invitations         | Manage     | Send and revoke invitations                             |

[Management tokens](/influxdb3/cloud/admin/tokens/#token-types) are
account-level tokens.
They're separate from the instance admin and resource tokens described in
[Instance-wide permissions](#instance-wide-permissions).

## Instance permissions

Instance permissions apply to one instance.
A role has no access to an instance until you grant it.

### Database permissions

Grant database permissions on **All databases**, which includes databases created
later, or on specific databases.

| Permission | Allows the user to                                          | Applies to           |
| :--------- | :---------------------------------------------------------- | :------------------- |
| Read       | Query data                                                  | All or specific      |
| Create     | Create databases                                            | **All databases** only |
| Describe   | List databases and view their schemas, but not read the data | All or specific      |
| Write      | Write data                                                  | All or specific      |
| Delete     | Delete databases                                            | All or specific      |

### Instance-wide permissions

Instance-wide permissions apply to tokens and system endpoints on the instance.

| Resource         | Permission | Allows the user to                     |
| :--------------- | :--------- | :------------------------------------- |
| Resource tokens  | View       | View resource (database) tokens        |
| Resource tokens  | Create     | Create resource tokens                 |
| Resource tokens  | Delete     | Delete resource tokens                 |
| Admin tokens     | Create     | Create admin tokens                    |
| Admin tokens     | Delete     | Delete admin tokens                    |
| System endpoints | Health     | Access the instance `/health` endpoint |
| System endpoints | Metrics    | Access the instance `/metrics` endpoint |
| System endpoints | Ping       | Access the instance `/ping` endpoint   |
| System endpoints | Ready      | Access the instance `/ready` endpoint  |

The **Tokens** page in the Admin UI requires the **Admin** role.
A user with token permissions in a custom role can manage tokens using the
[`influxdb3` CLI](/influxdb3/cloud/reference/cli/influxdb3/) or the HTTP API.

> [!Warning]
> #### Token permissions can exceed a role's database access
>
> A user who can create resource tokens can create a token with broader database
> access than their role grants.
> Only grant **Create** on **Resource tokens** to users you trust with that access.

## Default role permissions

The following tables show the permissions that each default role starts with.
**Admin** has full access and you can't change it.
If you've edited the **Member** or **Auditor** role for your account, your
permissions might differ.

### Default account permissions

| Resource            | Admin | Member | Auditor |
| :------------------ | :---- | :----- | :------ |
| Account Permissions | All   | None   | None    |
| Roles               | All   | None   | None    |
| Account Users       | All   | View   | View    |
| Instances           | All   | View   | View    |
| Management Tokens   | All   | None   | View    |
| Invitations         | All   | None   | View    |

### Default instance permissions

| Resource         | Admin | Member                                 | Auditor       |
| :--------------- | :---- | :------------------------------------- | :------------ |
| All databases    | All   | Read, Create, Describe, Write, Delete  | Describe only |
| Resource tokens  | All   | View, Create, Delete                   | View          |
| Admin tokens     | All   | None                                   | None          |
| System endpoints | All   | None                                   | None          |

Only the **Admin** role can query the `_internal` database.
