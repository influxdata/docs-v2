---
title: Manage users
seotitle: Manage users and permissions in InfluxDB Cloud Dedicated
description: >
  Manage users and access to resources in your InfluxDB Cloud Dedicated cluster.
  Use the Admin UI for self-service user management or contact support for advanced operations
menu:
  influxdb3_cloud_dedicated:
    parent: Administer InfluxDB Cloud
weight: 101
influxdb3/cloud-dedicated/tags: [user groups]
related:
  - /influxdb3/cloud-dedicated/reference/internals/security/
  - /influxdb3/cloud-dedicated/admin/tokens/ 
---

Manage users and access to resources in your {{% product-name %}} cluster.

By assigning users to different groups based on the level of access they need,
you can minimize unnecessary access and reduce the risk of inadvertent
actions.
User groups associate access privileges with user attributes--an important part of the
Attribute-Based Access Control (ABAC) security model which grants access based on
user attributes, resource types, and environment context.

- [Available user groups](#available-user-groups)
- [Manage users](#manage-users)

## Available user groups

In {{% product-name %}}, users have "management" responsibilities, such as creating and 
deleting [databases](/influxdb3/cloud-dedicated/admin/databases/), [viewing resource information](/influxdb3/cloud-dedicated/admin/monitor-your-cluster/), and provisioning
[database tokens](/influxdb3/cloud-dedicated/admin/tokens/database/) for reading and writing data. 

A user can belong to the following groups, each with predefined privileges:

- **Admin**: Read and write permissions on all resources.
- **Member**: Read permission on certain resources and create permission for
  database tokens; members can't delete or create databases or management tokens.
- **Auditor**: Read permission on all resources; auditors can't modify resources.

> [!Note]
> #### Existing users are Admin by default
> 
> With the release of user groups for {{% product-name %}}, all existing users
> in your account are initially assigned to the Admin group, retaining full
> access to resources in your cluster.

## User management methods

Choose the appropriate method for your user management needs:

### Admin UI (Self-service)
Use the Admin UI for user management tasks (available to Admin users only):

- **View users and invitations** - View existing users, invite status, invite ID, and invitation date
- **Invite new users** - Send invitations with role assignment (Admin, Member, Auditor)
- **Revoke pending invitations** - Cancel invitations that haven't been accepted

> [!Note] 
> #### Role permissions
>
> Auditor role users can view the invite list but cannot send or revoke invitations. Member role users cannot access the invite list...

For more information, see [Manage users in the Admin UI](/influxdb3/cloud-dedicated/admin/users/admin-ui/).

### Contact support (Advanced operations)
For operations not available in the Admin UI:

- View or change user roles after invitation acceptance
- Remove accepted users from your account
- Advanced user configurations

{{< children >}}
