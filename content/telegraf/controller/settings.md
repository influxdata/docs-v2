---
title: Manage settings
description: >
  Configure login security and password policies in Telegraf Controller.
menu:
  telegraf_controller:
    name: Manage settings
weight: 9
related:
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/reference/authorization/
---

Owners and administrators can configure login security and password requirements
for {{% product-name %}}.

Navigate to the **Settings** page from the left navigation menu to view and
modify these settings.

## Login security

### Login attempts

You can configure the number of failed login attempts allowed before an account is locked out.
The default threshold is 5 attempts, with a minimum of 1.

To change the login attempt threshold:

1. Navigate to the **Settings** page.
2. Update the **Login attempts** value.
3. Click **Save**.

### Login lockout

When a user exceeds the failed attempt threshold, their account is locked for a configurable duration.
The default lockout duration is 15 minutes, with a minimum of 1 minute.
The lockout clears automatically after the configured duration has elapsed.

To change the lockout duration:

1. Navigate to the **Settings** page.
2. Update the **Login lockout duration** value.
3. Click **Save**.

> [!Tip]
> If a user is locked out, an owner or administrator can [reset their password](/telegraf/controller/users/update/#reset-a-users-password) to unlock the account.

### Password complexity requirements

{{% product-name %}} provides three password complexity levels that apply to all
password operations, including initial setup, password changes, password resets,
and invite completion.

| Level      | Min length | Uppercase* | Lowercase* | Digits* | Special characters* |
| :--------- | :--------: | :--------: | :--------: | :-----: | :-----------------: |
| **Low**    |     8      |     No     |     No     |   No    |         No          |
| **Medium** |     10     |    Yes     |    Yes     |   Yes   |         No          |
| **High**   |     12     |    Yes     |    Yes     |   Yes   |         Yes         |

{{% caption %}}
\* Passwords require at least one of the defined character types.
{{% /caption %}}

To change the password complexity level:

1. Navigate to the **Settings** page.
2. Select the desired **Password complexity** level.
3. Click **Save**.

> [!Note]
> Changing the password complexity level does not affect existing passwords. The new requirements apply only when users set or change their passwords.

### Environment variables

You can set initial defaults for login security settings using environment variables.
These values are applied when {{% product-name %}} initializes its settings for the first time.
Changes made on the **Settings** page override initialized settings.

| Environment variable     | Description                                | Default |
| :----------------------- | :----------------------------------------- | :-----: |
| `LOGIN_LOCKOUT_ATTEMPTS` | Failed attempts before lockout             |   `5`   |
| `LOGIN_LOCKOUT_MINUTES`  | Minutes to lock account                    |  `15`   |
| `PASSWORD_COMPLEXITY`    | Complexity level (`low`, `medium`, `high`) |  `low`  |

_For detailed descriptions and bootstrap behavior, see the
[Authentication and security section in the configuration options reference](/telegraf/controller/reference/config-options/#authentication-and-security)._
