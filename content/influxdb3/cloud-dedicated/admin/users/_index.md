---
title: Manage users
seotitle: Manage users and permissions in InfluxDB Cloud Dedicated
description: >
  Manage users and access to resources in your InfluxDB Cloud Dedicated cluster.
  Assign user groups for role-based access control and security.
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

## Manage users

- [Assign a user to a different group](#assign-a-user-to-a-different-group)
- [Invite a user to your account](#invite-a-user-to-your-account)

### Assign a user to a different group

To assign existing users in your account to different
groups, [contact InfluxData support](https://support.influxdata.com/s/login/)
and provide the list of users and the desired [user groups](#available-user-groups)
for each.

### Invite a user to your account

For new users that you want to add to your account, the InfluxData Support Team
configures invitations with the attributes and groups that you specify. 

1. [Contact InfluxData support](https://support.influxdata.com/s/login/)
   to invite a user to your account.
   In your request, provide the user details, including email address, desired
   [user groups](#available-user-groups), and other attributes for the user.
2. InfluxData support creates the user account and emails the user an invitation
   that includes following:

   - A login URL to authenticate access to the cluster
   - The {{% product-name %}} **account ID**
   - The {{% product-name %}} **cluster ID**
   - The {{% product-name %}} **cluster URL**
   - A password reset email for setting the login password

3. The user accepts the invitation to your account

With a valid password, the user can access cluster resources by interacting with the
[`influxctl`](/influxdb3/cloud-dedicated/reference/influxctl/) command line tool.
The assigned user groups determine the user's access to resources.

> [!Note]
> #### Use database tokens to authorize data reads and writes
> 
> In {{% product-name %}}, user groups control access for managing cluster resources.
> [Database tokens](/influxdb3/cloud-dedicated/admin/tokens/database/) control access
> for reading and writing data in cluster databases.
