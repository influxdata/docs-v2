---
title: Manage settings
description: >
  Configure authentication requirements, login security, and password
  policies in Telegraf Controller.
menu:
  telegraf_controller:
    name: Manage settings
weight: 9
---

Owners and administrators can configure authentication, login security, and
password requirements for {{% product-name %}}.

Navigate to the **Settings** page from the left navigation menu to view and
modify these settings.

{{< img-hd src="/img/telegraf/controller-settings.png" alt="Telegraf Controller settings page" />}}

## Require authentication per endpoint

{{% product-name %}} organizes API endpoints into groups.
Authentication can be required or disabled for each group independently, giving
you fine-grained control over which resources require credentials.

| Endpoint group    | Covers                          |
| :---------------- | :------------------------------ |
| `agents`          | Agent monitoring and management |
| `configs`         | Configuration management        |
| `labels`          | Label management                |
| `reporting-rules` | Reporting rule management       |
| `heartbeat`       | Agent heartbeat requests        |

When authentication is disabled for a group, anyone with network access can use
those endpoints without an API token.
When enabled, requests require valid authentication.

> [!Note]
> By default, authentication is required for all endpoints.

To toggle authentication for endpoint groups:

1. Navigate to the **Settings** page.
2. Toggle authentication on or off for each endpoint group.
3. Click **Save**.

> [!Warning]
> Disabling authentication for endpoints means anyone with network access to
> {{% product-name %}} can access those resources without credentials.

### Environment variable and CLI flag

You can configure disabled authentication endpoints at startup using the
`DISABLED_AUTH_ENDPOINTS` environment variable or the `--disable-auth-endpoints`
CLI flag.
The value is a comma-separated list of endpoint groups, or `"*"` to disable
authentication for all endpoints.

```bash
# Disable auth for agents and heartbeat only
export DISABLED_AUTH_ENDPOINTS="agents,heartbeat"

# Disable auth for all endpoints
export DISABLED_AUTH_ENDPOINTS="*"
```

Using the CLI flag:

```bash
# Disable auth for agents and heartbeat only
./telegraf_controller --disable-auth-endpoints=agents,heartbeat

# Disable auth for all endpoints
./telegraf_controller --disable-auth-endpoints="*"
```

These values are used as initial defaults when {{% product-name %}} creates its settings record for the first time.
After that, changes made through the **Settings** page take precedence.

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
