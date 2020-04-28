---
title: Invite a user
list_title: Invite a user
description: >
  Invite a user to collaborate in InfluxDB Cloud.
weight: 103
menu:
  v2_0:
    parent: Manage multiple users
    name: Invite a user
---

{{% warn %}}
Currently, Cloud 2.0 has only one permission level: Owner.
With Owner permissions, a user can delete resources and other users from your organization.
Take care when inviting a user.
Future releases will contain multiple permission levels.
{{% /warn %}}

1. Navigate to the **Members** page under **Organizations** in the left navigation bar.
2. Under **Add a new member to your organization**, enter the email address of the user to invite.
   (Users must be invited one at a time.)
3. Click **Add & Invite**.

An invitation with an activation link is sent to the specified email address.
The activation link expires after 72 hours.

Once activated, the new user is added as an **Owner** with permissions to read and write all resources.
