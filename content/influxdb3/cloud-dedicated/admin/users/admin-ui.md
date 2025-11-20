---
title: Manage users in the Admin UI
seotitle: Manage users in InfluxDB Cloud Dedicated Admin UI
description: >
  Use the InfluxDB Cloud Dedicated Admin UI to view users, send invitations, assign roles, 
  and manage user access to your cluster. Learn how to invite new users, revoke invitations, 
  and understand role-based permissions.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage users
    name: Admin UI
weight: 201
influxdb3/cloud-dedicated/tags: [users, admin ui, invitations, roles]
related:
  - /influxdb3/cloud-dedicated/admin/users/
  - /influxdb3/cloud-dedicated/reference/internals/security/
  - /influxdb3/cloud-dedicated/admin/tokens/
---

Use the {{% product-name %}} Admin UI to manage users and control access to your cluster through a web-based interface. The Admin UI provides self-service user management capabilities, allowing administrators to invite new users, assign roles, and manage invitations without contacting support.

- [Access the Users page](#access-the-users-page)
- [View existing users](#view-existing-users)
- [Invite a user](#invite-a-user)
- [Manage invitations](#manage-invitations)
- [User roles and permissions](#user-roles-and-permissions)
- [Limitations](#limitations)

## Access the Users page

{{< admin-ui-access >}}

{{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-users.png" alt="InfluxDB Cloud Dedicated Admin UI users" />}}

The Users page displays your account information and a table of existing users and invitations. Use the **Users** page to manage access to your InfluxDB account:

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
  - `accepted`: User has accepted the invitation and has access to the cluster
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

An invitation email with an activation link is sent to the specified email address. The user must accept the invitation to gain access to your {{% product-name %}} cluster.

{{% note %}}
#### Invitation expiration
Invitations expire after a set period. If an invitation expires, you'll need to send a new invitation to the user.
{{% /note %}}

## Manage invitations

### Revoke an invitation

You can revoke pending invitations that haven't been accepted yet:

1. In the Users table, locate the invitation you want to revoke.
2. Click the **Actions** menu (⋮) for that invitation.
3. Select **Revoke Invitation**.
4. Confirm the revocation when prompted.

Revoked invitations can no longer be used to access your cluster. The invitation status will change to `revoked`.

### View invitation details

Click on any invitation in the table to view additional details, including:
- Complete invitation ID
- Exact timestamp of invitation creation
- Current status and any status changes

## User roles and permissions

{{% product-name %}} uses role-based access control to manage user permissions for the following roles:

### Admin
- Full read and write permissions on all cluster resources
- Can create and delete databases, tables, and tokens
- Can send and revoke user invitations
- Can manage all aspects of cluster administration

### Member  
- Read permission on databases and certain cluster resources
- Can create database tokens for data access
- Cannot delete or create databases
- Cannot manage other users or send invitations

### Auditor
- Read-only access to all cluster resources
- Can view databases, tables, and configuration
- Can see user invitations but cannot create or revoke them
- Cannot modify any resources or create tokens

> [!Note]
> #### Role assignment
>
> User roles are assigned when sending invitations and cannot currently be changed through the Admin UI.
> To modify a user's role, [contact InfluxData support](https://support.influxdata.com).

## Limitations

- **Historical records**: Invitation records remain even after user removal; use the [`influxctl users list`](https://docs.influxdata.com/influxdb3/cloud-dedicated/reference/influxctl/#list-users) command to confirm current users

For operations not available in the Admin UI, contact [InfluxData support](https://support.influxdata.com) for role changes, user removal, or other advanced user management tasks.
