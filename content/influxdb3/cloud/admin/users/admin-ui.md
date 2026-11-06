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

{{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-users.png" alt="InfluxDB 3 Cloud Admin UI Users page" />}}

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

{{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-invitations.png" alt="InfluxDB 3 Cloud Admin UI Invitations tab" />}}

## Invite a user

To send invitations, you need the **Manage** permission on **Invitations**.
The **Admin** role includes this permission.

1. On the Users page, click **{{< icon "plus" >}} Invite Users**.
2. In the **Invite User** dialog:
   - Enter the **email address** of the user you want to invite
   - In the **Roles** list, select one or more roles, including any
     [custom roles](/influxdb3/cloud/admin/users/create-custom-role/).
     You must select at least one role to send the invitation.
     - **Admin**: Full management of account resources and users
     - **Member**: Database access and database token management
     - **Auditor**: Read-only access to account resources
3. Click **Send Invitation**.

{{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-invite-user.png" alt="Invite User dialog with the Roles list open" />}}

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

{{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-revoke-invitation.png" alt="Invitation Actions menu with Revoke Invitation" />}}

The revocation takes effect immediately, without a confirmation prompt.
Revoked invitations can no longer be used to access your instance.
The invitation status changes to `Revoked`.

## User roles and permissions

{{% product-name %}} uses role-based access control to manage user permissions.
Every account starts with the **Admin**, **Member**, and **Auditor** roles, and
you can create custom roles.

- To learn how roles work, see [Understand roles](/influxdb3/cloud/admin/users/roles/).
- For each permission and what the default roles include, see the
  [permissions reference](/influxdb3/cloud/admin/users/permissions/).
- To create a role, see [Create a custom role](/influxdb3/cloud/admin/users/create-custom-role/).

The **Tokens** page in the Admin UI requires the **Admin** role.
Other users create database tokens with the
[`influxdb3` CLI](/influxdb3/cloud/reference/cli/influxdb3/)
(after `influxdb3 auth login --oauth`) or the HTTP API, if their role allows it.

> [!Note]
> #### Role assignment
>
> Assign a role when inviting a user, and
> [change a user's roles](#change-a-users-roles) after the invitation is accepted.

## Manage users

To change a user's roles, you need the **Update** permission on **Account Users**.
To remove a user, you need the **Delete** permission on **Account Users**.
The **Admin** role includes both permissions.

### Change a user's roles

1. On the **Users** tab, locate the user.
2. Click the **Actions** menu (three vertical dots) for that user.
3. Select **Edit Roles**.

   {{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-user-actions-menu.png" alt="User Actions menu with Edit Roles and Remove User" />}}

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
