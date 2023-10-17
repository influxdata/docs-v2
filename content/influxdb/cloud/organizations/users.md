---
title: Manage users
seotitle: Manage users in your InfluxDB Cloud organization
description: >
  Learn how to invite, view, and manage users in your InfluxDB Cloud organization.
weight: 106
menu:
  influxdb_cloud:
    parent: Manage organizations
    name: Manage users
aliases:
  - /influxdb/v2/account-management/multi-user/
  - /influxdb/cloud/account-management/multi-user/
  - /influxdb/cloud/account-management/multi-user/invite-user/
  - /influxdb/cloud/account-management/multi-user/remove-user/
  - /influxdb/cloud/users/
---

{{< product-name >}} lets you invite and collaborate with multiple users in your organization.
By default, each user has full permissions on resources in your organization.

- [Users management page](#users-management-page)
- [Invite a user to your organization](#invite-a-user-to-your-organization)
  - [Resend an invitation](#resend-an-invitation)
  - [Withdraw an invitation](#withdraw-an-invitation)
- [Remove a user from your organization](#remove-a-user-from-your-organization)

{{% note %}}
If you have multiple users, we recommend creating a system account for administrative purposes. For example, if you have applications writing to InfluxDB, ensure the applications use the system account credentials.
{{% /note %}}

## Members page
Manage your organization's users from your organization's **Members page**.
In the {{< product-name "short" >}} user interface (UI), click your user avatar in the left
navigation menu, and select **Organization** > **Members**.

{{< nav-icon "account" >}}

## Invite a user to your organization

1.  Navigate to your organization's [Members page](#members-page).
2.  Under **Add a new user to your organization**, enter the email address of
    the user to invite and select their role in your organization.

    {{% note %}}
#### Available roles
Currently, InfluxDB Cloud has only one permission level for users: **Owner**.
With Owner permissions, a user can delete resources and other users from your organization.
Take care when inviting a user.
{{% /note %}}

    _Users must be invited one at a time._
3.  Click **{{< icon "plus" >}} {{< caps >}}Add & Invite{{< /caps >}}**.

An invitation with an activation link is sent to the specified email address.
The activation link expires after 72 hours.
Once activated, the new user is added as an **Owner** with permissions to read and write all resources.

Accounts can have up to 50 pending invitations at one time.

### Resend an invitation

1.  Navigate to your organization's [Members page](#members-page).
2.  Click the **{{< icon "refresh" >}}** icon next to the invitation you want to resend.

### Withdraw an invitation

1.  Navigate to your organization's [Members page](#members-page).
2.  Click the **{{< icon "delete" >}}** icon next to the invitation you want to withdraw.
3.  Click **{{< caps >}}Withdraw Invitation{{< /caps >}}**.

## Remove a user from your organization

{{% warn %}}
For security purposes, once an InfluxDB user account is deleted, the user (and their token) cannot be reactivated.
{{% /warn %}} 

1.  Navigate to your organization's [Members page](#members-page).
2.  Click the **{{< icon "delete" >}}** icon next to the user you want to remove.
3.  Click **{{< caps >}}Remove user access{{< /caps >}}**.
