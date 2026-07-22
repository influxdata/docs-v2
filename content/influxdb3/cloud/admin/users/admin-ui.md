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

The Users page shows a comprehensive view of all users and pending invitations for your account:

- **Invite ID**: Unique identifier for each user invitation
- **Email**: Email address of the invited or existing user
- **Invited At**: Date and time when the invitation was sent
- **Status**: Current status of the invitation
  - `accepted`: User has accepted the invitation and has access to the instance
  - `expired`: Invitation has expired and is no longer valid
  - `revoked`: Invitation has been manually revoked by an administrator

Use the search functionality to quickly find specific users by email address or invitation details.

## Invite a user

Only users with the **Admin** role can send new invitations.

1. On the Users page, click **{{< icon "plus" >}} Invite Users**.
2. In the **Invite User** dialog:
   - Enter the **email address** of the user you want to invite
   - Select the appropriate **role** from the dropdown menu:
     - **Admin**: Full read and write permissions on all resources
     - **Member**: Read permission on certain resources and create permission for database tokens
     - **Auditor**: Read permission on all resources without modification capabilities
3. Click **Send Invitation**.

An invitation email with an activation link is sent to the specified email address. The user must accept the invitation to gain access to your {{% product-name %}} instance.

{{% note %}}
#### Invitation expiration
Invitations expire after a set period. If an invitation expires, you'll need to send a new invitation to the user.
{{% /note %}}

## Manage invitations

### Revoke an invitation

You can revoke pending invitations that haven't been accepted yet:

1. In the Users table, locate the invitation you want to revoke.
2. Click the **Actions** menu (three vertical dots) for that invitation.
3. Select **Revoke Invitation**.
4. Confirm the revocation when prompted.

Revoked invitations can no longer be used to access your instance. The invitation status will change to `revoked`.

### View invitation details

Click on any invitation in the table to view additional details, including:
- Complete invitation ID
- Exact timestamp of invitation creation
- Current status and any status changes

## User roles and permissions

{{% product-name %}} uses role-based access control to manage user permissions for the following roles:

### Admin
- Full read and write permissions on all instance resources
- Can create and delete databases, tables, and tokens
- Can send and revoke user invitations
- Can manage all aspects of instance administration

### Member
- Read permission on databases and certain instance resources
- Can create database tokens for data access
- Cannot delete or create databases
- Cannot manage other users or send invitations

### Auditor
- Read-only access to all instance resources
- Can view databases, tables, and configuration
- Can see user invitations but cannot create or revoke them
- Cannot modify any resources or create tokens

> [!Note]
> #### Role assignment
>
> Admins assign a role when inviting a user and can update a user's role from
> the Admin UI after the invitation is accepted.

<!-- TODO: Document the self-service steps to change a user's role and to
remove a user from the account in the InfluxDB 3 Cloud console. -->

## Limitations

- **Historical records**: Invitation records remain even after user removal.
