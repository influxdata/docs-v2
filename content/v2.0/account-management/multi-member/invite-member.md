---
title: Invite a member
list_title: Invite a member
description: >
  Invite a member to collaborate in InfluxDB Cloud.
weight: 103
menu:
  v2_0:
    parent: Manage multiple members
    name: Invite a member
---

1. Navigate to the **Members** page under **Organizations** in the left navigation bar.
   {{< nav-icon "org" >}}
2. Under **Add a new member to your organization**, enter the email address of the member to invite.
   (Members must be invited one at a time.)
3. Click **Add & Invite**.

An invitation with an activation link is sent to the specified email address.
The activation link expires after 72 hours.

Once activated, the new member is added as an **Owner** with permissions to read and write all resources.

{{% warn %}}
Currently, Cloud 2.0 has only one permission level: Owner.
With Owner permissions, a member can delete resources and other members from your organization.
Take care when inviting a member.
{{% /warn %}}
