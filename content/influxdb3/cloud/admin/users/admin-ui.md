---
title: Manage users in the Admin UI
seotitle: Manage users in the {{< product-name >}} Admin UI
description: >
  Use the {{< product-name >}} Admin UI to view users, send invitations, assign
  roles, and manage user access to your instance. Learn how to invite new users,
  revoke invitations, and understand role-based permissions.
menu:
  influxdb3_cloud:
    parent: Manage users
    name: Admin UI
weight: 201
influxdb3/cloud/tags: [users, admin ui, invitations, roles]
related:
  - /influxdb3/cloud/admin/users/
  - /influxdb3/cloud/admin/tokens/
---

Use the {{% product-name %}} Admin UI to manage users and control access to your instance through a web-based interface. The Admin UI provides self-service user management, allowing administrators to invite new users, assign roles, and manage invitations.

- [Access the Users page](#access-the-users-page)
- [View existing users](#view-existing-users)
- [Invite a user](#invite-a-user)
- [Manage invitations](#manage-invitations)
- [User roles and permissions](#user-roles-and-permissions)
- [Manage users](#manage-users)
- [Limitations](#limitations)

## Access the Users page

Access the {{% product-name %}} Admin UI at
[console.influxdata.com](https://console.influxdata.com).
If you don't have login credentials,
[contact InfluxData support](https://support.influxdata.com).

<!-- TODO: Add an InfluxDB 3 Cloud Admin UI Users page screenshot. -->

The **Users** page displays your account information and a table of existing users and invitations. Use it to manage access to your InfluxDB account:

- View all users who have accepted the user agreement and have access to the account
- Invite new users to the account
- View user roles, email addresses, and join dates
- Manage user permissions and access
- Toggle between Users and Invitations tabs

## View existing users

The **Users** tab lists users who have accepted the user agreement and have
access to the account. It displays the following information:

- **First Name** and **Last Name**
- **Email**
- **Roles**
- **Joined On**
- An **Actions** menu for each user

To view invitations, select **Invitations**.
The **Invitations** tab displays the following information:

- **Recipient**
- **Status** (`Pending`, `Accepted`, `Revoked`, or `Expired`)
- **Invitation Sent**
- **Invitation Expires**
- An **Actions** menu for each invitation

## Invite a user

Only users with the **Admin** role can send new invitations.

1. On the Users page, click **{{< icon "plus" >}} Invite Users**.
2. In the **Invite User** dialog:
   - Enter the **email address** of the user you want to invite
   - In the **Roles** list, select one or more roles.
     You must select at least one role to send the invitation.
     - **Admin**: Full management of account resources and users
     - **Member**: Database access and database token management
     - **Auditor**: Read-only access to account resources
3. Click **Send Invitation**.

An invitation email with an activation link is sent to the specified email address.
The user must accept the invitation to gain access to your {{% product-name %}} instance.

To accept, the invitee signs in or signs up with the invited email address,
enters a **First Name** and **Last Name**,
accepts the subscription terms, and then selects **Join Account**.

{{% note %}}
#### Invitation expiration
Invitations expire after 7 days.
If an invitation expires, send a new invitation to the user.
{{% /note %}}

## Manage invitations

### Revoke an invitation

You can revoke pending invitations that haven't been accepted yet:

1. Select the **Invitations** tab.
2. Locate the invitation you want to revoke.
3. Click the **Actions** menu (three vertical dots) for that invitation.
4. Select **Revoke Invitation**.

The revocation takes effect immediately, without a confirmation prompt.
Revoked invitations can no longer be used to access your instance.
The invitation status changes to `Revoked`.

## User roles and permissions

{{% product-name %}} uses role-based access control to manage user permissions for the following roles:

### Admin
- Full read and write permissions on all instance resources
- Can create and delete databases, tables, and tokens
- Can send and revoke user invitations
- Can manage all aspects of instance administration
- Can use the **Tokens** page in the console

### Member
- Can create, describe, read, write, and delete databases
- Can view, create, and delete database (resource) tokens, but has no access to admin tokens
- Can view users and instances, but cannot manage other users or send invitations
- Cannot use the console **Tokens** page, which requires the **Admin** role.
  Members create database tokens with the
  [`influxdb3` CLI](/influxdb3/cloud/reference/cli/influxdb3/)
  (after `influxdb3 auth login --oauth`) or the HTTP API.

### Auditor
- Can view users, instances, and invitations
- Can describe databases to see databases and schemas, but cannot query or write data
- Can view database (resource) tokens, but has no access to admin tokens
- Cannot send or revoke invitations or modify any resources

> [!Note]
> #### Role assignment
>
> Admins assign a role when inviting a user and can
> [change a user's roles](#change-a-users-roles) after the invitation is accepted.

## Manage users

Only users with the **Admin** role can change roles or remove users.

### Change a user's roles

1. On the **Users** tab, locate the user.
2. Click the **Actions** menu (three vertical dots) for that user.
3. Select **Edit Roles**.
4. In the **Roles** list, select one or more roles.
   A user must have at least one role.
5. Click **Save Changes**.

### Remove a user

1. On the **Users** tab, locate the user.
2. Click the **Actions** menu (three vertical dots) for that user.
3. Select **Remove User**.
4. In the **Remove User** dialog, verify the displayed email address, and then
   click **Remove User**.

## Limitations

- **Historical records**: Invitation records remain even after user removal.
