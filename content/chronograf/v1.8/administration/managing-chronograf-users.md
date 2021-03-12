---
title: Manage Chronograf users
description: >
  Manage users and roles, including SuperAdmin permission and organization-bound users.
menu:
  chronograf_1_8:
    name: Manage Chronograf users
    weight: 90
    parent: Administration
---

**On this page**

* [Manage Chronograf users and roles](#manage-chronograf-users-and-roles)
* [Organization-bound users](#organization-bound-users)
  * [InfluxDB and Kapacitor users within Chronograf](#influxdb-and-kapacitor-users-within-chronograf)
  * [Chronograf-owned resources](#chronograf-owned-resources)
  * [Chronograf-accessed resources](#chronograf-accessed-resources)
  * [Members](#members-role-member)
  * [Viewers](#viewers-role-viewer)
  * [Editors](#editors-role-editor)
  * [Admins](#admins-role-admin)
* [Cross-organization SuperAdmin permission](#cross-organization-superadmin-permission)
  * [All New Users are SuperAdmins configuration option](#all-new-users-are-superadmins-configuration-option)
* [Create users](#create-users)
* [Update users](#update-users)
* [Remove users](#remove-users)
* [Navigate organizations](#navigate-organizations)
  * [Log in and log out](#log-in-and-log-out)
  * [Switch the current organization](#switch-the-current-organization)
  * [Purgatory](#purgatory)

## Manage Chronograf users and roles

> ***Note:*** Support for organizations and user roles is available in Chronograf 1.4 or later. First, OAuth 2.0 authentication must be configured (if it is, you'll see the Chronograf Admin tab on the Admin menu). For more information, see [Managing security](/chronograf/v1.8/administration/managing-security/).

Chronograf includes four organization-bound user roles and one cross-organization SuperAdmin permission. In an organization, admins (with the `admin` role) or users with SuperAdmin permission can create, update, and assign roles to a user or remove a role assignment.

### Organization-bound users

Chronograf users are assigned one of the following four organization-bound user roles, listed here in order of increasing capabilities:

- [`member`](#members-role-member)
- [`viewer`](#viewers-role-viewer)
- [`editor`](#editors-role-editor)
- [`admin`](#admins-role-admin)

Each of these four roles, described in detail below, have different capabilities for the following Chronograf-owned or Chronograf-accessed resources.

#### InfluxDB and Kapacitor users within Chronograf

Chronograf uses InfluxDB and Kapacitor connections to manage user access control to InfluxDB and Kapacitor resources within Chronograf. The permissions of the InfluxDB and Kapacitor user specified within such a connection determine the capabilities for any Chronograf user with access (i.e., viewers, editors, and administrators) to that connection. Administrators include either an admin (`admin` role) or a user of any role with SuperAdmin permission.

> **Note:** Chronograf users are entirely separate from InfluxDB and Kapacitor users.
> The Chronograf user and authentication system applies to the Chronograf user interface.
> InfluxDB and Kapacitor users and their permissions are managed separately.
> [Chronograf connections](/chronograf/v1.8/administration/creating-connections/)
> determine which InfluxDB or Kapacitor users to use when when connecting to each service.

#### Chronograf-owned resources

Chronograf-owned resources include internal resources that are under the full control of Chronograf, including:

- Kapacitor connections
- InfluxDB connections
- Dashboards
- Canned layouts
- Chronograf organizations
- Chronograf users
- Chronograf Status Page content for News Feeds and Getting Started

#### Chronograf-accessed resources

Chronograf-accessed resources include external resources that can be accessed using Chronograf, but are under limited control by Chronograf. Chronograf users with the roles of `viewer`, `editor`, and `admin`, or users with SuperAdmin permission, have equal access to these resources:

- InfluxDB databases, users, queries, and time series data (if using InfluxDB Enterprise, InfluxDB roles can be accessed too)
- Kapacitor alerts and alert rules (called tasks in Kapacitor)

#### Members (role:`member`)

Members are Chronograf users who have been added to organizations but do not have any functional capabilities. Members cannot access any resources within an organization and thus effectively cannot use Chronograf. Instead, a member can only access Purgatory, where the user can [switch into organizations](#navigate-organizations) based on assigned roles.

By default, new organizations have a default role of `member`. If the Default organization is Public, then anyone who can authenticate, would become a member, but not be able to use Chronograf until an administrator assigns a different role.

#### Viewers (role:`viewer`)

Viewers are Chronograf users with effectively read-only capabilities for Chronograf-owned resources within their current organization:

- View canned dashboards
- View canned layouts
- View InfluxDB connections
- Switch current InfluxDB connection to other available connections
- Access InfluxDB resources through the current connection
- View the name of the current Kapacitor connection associated with each InfluxDB connection
- Access Kapacitor resources through the current connection
- [Switch into organizations](#navigate-organizations) where the user has a role

For Chronograf-accessed resources, viewers can:

- InfluxDB
  - Read and write time series data
  - Create, view, edit, and delete databases and retention policies
  - Create, view, edit, and delete InfluxDB users
  - View and kill queries
  - _InfluxDB Enterprise_: Create, view, edit, and delete InfluxDB Enterprise roles
- Kapacitor
  - View alerts
  - Create, edit, and delete alert rules

#### Editors (role:`editor`)

Editors are Chronograf users with limited capabilities for Chronograf-owned resources within their current organization:

- Create, view, edit, and delete dashboards
- View canned layouts
- Create, view, edit, and delete InfluxDB connections
- Switch current InfluxDB connection to other available connections
- Access InfluxDB resources through the current connection
- Create, view, edit, and delete Kapacitor connections associated with InfluxDB connections
- Switch current Kapacitor connection to other available connections
- Access Kapacitor resources through the current connection
- [Switch into organizations](#navigate-organizations) where the user has a role

For Chronograf-accessed resources, editors can:

- InfluxDB
  - Read and write time series data
  - Create, view, edit, and delete databases and retention policies
  - Create, view, edit, and delete InfluxDB users
  - View and kill queries
  - _InfluxDB Enterprise_: Create, view, edit, and delete InfluxDB Enterprise roles
- Kapacitor
  - View alerts
  - Create, edit, and delete alert rules

#### Admins (role:`admin`)

Admins are Chronograf users with all capabilities for the following Chronograf-owned resources within their current organization:

- Create, view, update, and remove Chronograf users
- Create, view, edit, and delete dashboards
- View canned layouts
- Create, view, edit, and delete InfluxDB connections
- Switch current InfluxDB connection to other available connections
- Access InfluxDB resources through the current connection
- Create, view, edit, and delete Kapacitor connections associated with InfluxDB connections
- Switch current Kapacitor connection to other available connections
- Access Kapacitor resources through the current connection
- [Switch into organizations](#navigate-organizations) where the user has a role

For Chronograf-accessed resources, admins can:

- InfluxDB
  - Read and write time series data
  - Create, view, edit, and delete databases and retention policies
  - Create, view, edit, and delete InfluxDB users
  - View and kill queries
  - _InfluxDB Enterprise_: Create, view, edit, and delete InfluxDB Enterprise roles
- Kapacitor
  - View alerts
  - Create, edit, and delete alert rules

### Cross-organization SuperAdmin permission

SuperAdmin permission is a Chronograf permission that allows any user, regardless of role, to perform all administrator functions both within organizations, as well as across organizations. A user with SuperAdmin permission has _unlimited_ capabilities, including for the following Chronograf-owned resources:

* Create, view, update, and remove organizations
* Create, view, update, and remove users within an organization
* Grant or revoke the SuperAdmin permission of another user
* [Switch into any organization](#navigate-organizations)
* Toggle the Public setting of the Default organization
* Toggle the global config setting for [All new users are SuperAdmin](#all-new-users-are-superadmins-configuration-option)

Important SuperAdmin behaviors:

* SuperAdmin permission grants any user (whether `member`, `viewer`, `editor`, or `admin`) the full capabilities of admins and the SuperAdmin capabilities listed above.
* When a Chronograf user with SuperAdmin permission creates a new organization or switches into an organization where that user has no role, that SuperAdmin user is automatically assigned the `admin` role by default.
* SuperAdmin users cannot revoke their own SuperAdmin permission.
* SuperAdmin users are the only ones who can change the SuperAdmin permission of other Chronograf users. Regular admins who do not have SuperAdmin permission can perform normal operations on SuperAdmin users (create that user within their organization, change roles, and remove them), but they will not see that these users have SuperAdmin permission, nor will any of their actions affect the SuperAdmin permission of these users.
* If a user has their SuperAdmin permission revoked, that user will retain their assigned roles within their organizations.

#### All New Users are SuperAdmins configuration option

By default, the **Config** setting for "**All new users are SuperAdmins"** is **On**. Any user with SuperAdmin permission can toggle this under the **Admin > Chronograf > Organizations** tab. If this setting is **On**, any new user (who is created or who authenticates) will_ automatically have SuperAdmin permisison. If this setting is **Off**, any new user (who is created or who authenticates) will _not_ have SuperAdmin permisison unless they are explicitly granted it later by another user with SuperAdmin permission.

### Create users

Role required: `admin`

**To create a user:**

1. Open Chronograf in your web browser and select **Admin (crown icon) > Chronograf**.
2. Click the **Users** tab and then click **Create User**.
3. Add the following user information:
   * **Username**: Enter the username as provided by the OAuth provider.
   * **Role**: Select the Chronograf role.
   * **Provider**: Enter the OAuth 2.0 provider to be used for authentication. Valid values are: `github`, `google`, `auth0`, `heroku`, or other names defined in the [`GENERIC_NAME` environment variable](/chronograf/v1.8/administration/config-options#generic-name).
   * **Scheme**: Displays `oauth2`, which is the only supported authentication scheme in this release.
4. Click **Save** to finish creating the user.

### Update users

Role required: `admin`

Only a user's role can be updated. A user's username, provider, and scheme cannot be updated. (Effectively, to "update" a user's username, provider, or scheme, the user must be removed and added again with the desired values.)

**To change a user's role:**

1. Open Chronograf in your web browser and select **Admin (crown icon) > Chronograf**.
2. Click the **Users** tab to display the list of users within the current organization.
3. Select a new role for the user. The update is automatically persisted.

### Remove users

Role required: `admin`

**To remove a user:**

1. Open Chronograf in your web browser and select **Admin (crown icon) > Chronograf**.
2. Click the **Users** tab to display the list of users.
3. Hover your cursor over the user you want to remove and then click **Remove** and **Confirm**.

### Navigate organizations

Chronograf is always used in the context of an organization. When a user logs in to Chronograf, that user will access only the resources owned by their current organization. The only exception to this is that users with SuperAdmin permission will also be able to [manage organizations](/chronograf/v1.8/administration/managing-organizations/) in the Chronograf Admin page.

#### Log in and log out

A user can log in from the Chronograf homepage using any configured OAuth 2.0 provider.

A user can log out by hovering over the **User (person icon)** in the left navigation bar and clicking **Log out**.

#### Switch the current organization

A user's current organization and role is highlighted in the **Switch Organizations** list, which can be found by hovering over the **User (person icon)** in the left navigation bar.

When a user has a role in more than one organization, that user can switch into any other organization where they have a role by selecting the desired organization in the **Switch Organizations** list.

#### Purgatory

If at any time, a user is a `member` within their current organization and does not have SuperAdmin permission, that user will be redirected to a page called Purgatory. There, the user will see their current organization and role, as well as a message to contact an administrator for access.

On the same page, that user will see a list of all of their organizations and roles. The user can switch into any listed organization where their role is `viewer`, `editor`, or `admin` by clicking **Log in** next to the desired organization.

**Note** In the rare case that a user is granted SuperAdmin permission while in Purgatory, they will be able to switch into any listed organization, as expected.
