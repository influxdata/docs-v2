---
title: Managing Chronograf organizations
description: "Managing multiple organizations or groups: creating, configuring, mapping, and removing organizations."
menu:
  chronograf_1_7:
    name: Managing Chronograf organizations
    weight: 80
    parent: Administration
---

**On this page:**

* [About Chronograf organizations](#about-chronograf-organizations)
* [Using the Default organization](#using-the-default-organization)
* [Creating organizations](#creating-organizations)
* [Configuring organizations](#configuring-organizations)
* [Mapping organizations](#mapping-organizations)
* [Removing organizations](#removing-organizations)


## About Chronograf organizations

> ***Note:*** Support for organizations and user roles is available in Chronograf 1.4 or later. 
First, OAuth 2.0 authentication must be configured (if it is, you'll see the Chronograf Admin tab on the Admin menu).
For more information, see [managing security](/chronograf/v1.7/administration/managing-security/).

For information about the new user roles and SuperAdmin status, see [Managing Chronograf users](/chronograf/v1.7/administration/managing-chronograf-users/).

A Chronograf organization is a collection of Chronograf users who share common Chronograf-owned resources, including dashboards, InfluxDB connections, and Kapacitor connections. Organizations can be used to represent companies, functional units, projects, or teams. Chronograf users can be members of multiple organizations.

> ***Note:*** Only users with SuperAdmin status can manage organizations. Admins, editors, viewers, and members cannot manage organizations unless they have SuperAdmin status.

## Using the Default organization

>***Note:*** The Default organization can be used to support Chronograf as configured in versions earlier than 1.4.
> Upon upgrading, any Chronograf resources that existed prior to 1.4 automatically become owned by the Default organization.

Upon installation, the Default organization is ready for use and allows Chronograf to be used as-is.

## Creating organizations

Your company, organizational units, teams, and projects may require the creation of additional organizations, beyond the Default organization. Additional organizations can be created as described below.

**To create an organization:**

**Required status:** SuperAdmin

1) In the Chronograf navigation bar, click **Admin** (crown icon) > **Chronograf** to open the **Chronograf Admin** page.
2) In the **All Orgs** tab, click **Create Organization**.
3) Under **Name**, click on **"Untitled Organization"** and enter the new organization name.
4) Under **Default Role**, select the default role for new users within that organization. Valid options include `member` (default), `viewer`, `editor`, and `admin`.
5) Click **Save**.

## Configuring organizations

**Required status:** SuperAdmin

You can configure existing and new organizations in the **Organizations** tab of the **Chronograf Admin** page as follows:

* **Name**: The name of the organization. Click on the organization name to change it.

  > ***Note:*** You can change the Default organization's name, but that organization will always be the default organization.

* **Public**: [Default organization only] Indicates whether a user can authenticate without being explicitly added to the organization. When **Public** is toggled to **Off**, new users cannot authenticate into your Chronograf instance unless they have been explicitly added to the organization by an administrator.

  > ***Note:*** All organizations other than the Default organization require users to be explicitly added by an administrator.

* **Default Role**: The role granted to new users by default when added to an organization. Valid options are `member` (default), `viewer`, `editor`, and `admin`.

See the following pages for more information about managing Chronograf users and security:

* [Managing Chronograf users](/chronograf/v1.7/administration/managing-chronograf-users/)
* [Managing security](/chronograf/v1.7/administration/managing-security/)

## Mapping organizations

**To create an organization mapping:**

**Required status:** SuperAdmin

1) In the Chronograf navigation bar, select **Admin** (crown icon) > **Chronograf** to open the **Chronograf Admin** page.
2) Click the **Org Mappings** tab to view a list of organization mappings.
3) To add an organization mapping, click the **Create Mapping** button. A new row is added to the listing.
4) In the new row, enter the following:

- **Scheme**, select `oauth2`.
- **Provider**: Enter the provider. Valid values include `Google` and `GitHub`.
- **Provider Org**: [Optional] Enter the email domain(s) you want to accept.
- **Organization**: Select the organization that can use this authentication provider.

**To remove an organization mapping:**

**Required status:** SuperAdmin

1) In the Chronograf navigation bar, select **Admin** (crown icon) > **Chronograf** to open the **Chronograf Admin** page.
2) Click the **Org Mappings** tab to view a list of organization mappings.
3) To remove an organization mapping, click the **Delete** button at the end of the mapping row you want to remove, and then confirm the action.

## Removing organizations

When an organization is removed:

* Users within that organization are removed from that organization and will be logged out of the application.
* All users with roles in that organization are updated to no longer have a role in that organization
* All resources owned by that organization are deleted.


**To remove an organization:**

**Required status:** SuperAdmin

1) In the navigation bar of the Chronograf application, select **Admin** (crown icon) > **Chronograf** to open the **Chronograf Admin** page.
2) Click the **All Orgs** tab to view a list of organizations.
3) To the right of the the organization that you want to remove, click the **Remove** button (trashcan icon) and then confirm by clicking the **Save** button.
