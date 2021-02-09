---
title: Invite a user
list_title: Invite a user
description: >
  Invite a user to collaborate in InfluxDB Cloud.
weight: 103
menu:
  influxdb_cloud:
    parent: Manage multiple users
    identifier: invite_user_cloud
aliases:
  - /influxdb/v2.0/account-management/multi-user/invite-user/
---

Use the InfluxDB Cloud user interface (UI) to invite users to collaborate in
your InfluxDB Cloud organization.

- [Invite a user](#invite-a-user)
- [Withdraw an invitation](#withdraw-an-invitation)

## Invite a user

1. In the {{< cloud-name "short" >}} UI, click your user avatar in the left
   navigation menu, and select **Users**.

    {{< nav-icon "account" >}}

2. Under **Add a new user to your organization**, enter the email address of the user to invite.
   (Users must be invited one at a time.)
3. Click **Add & Invite**.

An invitation with an activation link is sent to the specified email address.
The activation link expires after 72 hours.

Once activated, the new user is added as an **Owner** with permissions to read and write all resources.

Accounts can have up to 50 pending invitations at one time.

## Withdraw an invitation

1. In the {{< cloud-name "short" >}} UI, select the user avatar in the left navigation menu, and select **Users**.

    {{< nav-icon "account" >}}

2. Click the {{< icon "delete" >}} next to the invitation you want to withdraw.
3. Confirm the withdrawl.

{{% warn %}}
#### Permissions

Currently, Cloud has only one permission level: Owner.
With Owner permissions, a user can delete resources and other users from your organization.
Take care when inviting a user.
{{% /warn %}}
