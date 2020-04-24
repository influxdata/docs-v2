---
title: Invite a user
list_title: Invite a user
description: >
  Invite a user to collaborate
weight: 103
menu:
  v2_0:
    parent: Manage multiple users
    name: Invite a user
---

## Invite user from {{< cloud-name >}}

1. Navigate to the **Members** page under **Organizations** in the left navigation bar.
2. Under "Add a new member to your organization," enter the email address of the user to invite.
   (Users must be invited one at a time.)
3. Click **Add & Invite**.

An invitation with an activation link will be sent to the specified email address.

Once activated, the new user will be added as an **Owner** with permissions to read and write all resources.

{{% warn %}}
Take care when inviting a user as an **Owner**.
Owners can delete resources and other users.
{{% /warn %}}

{{% cloud %}}
Currently {{<cloud-name >}} has only one permission level.
Future releases will contain read-only users.
{{% /cloud %}}
