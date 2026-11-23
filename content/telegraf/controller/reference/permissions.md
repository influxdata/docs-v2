---
title: Permissions
description: >
  Reference for Telegraf Controller permission strings: the syntax, the
  resources and actions you can grant, how Telegraf Controller checks and
  restricts permissions, and the permissions each user role holds.
menu:
  telegraf_controller:
    name: Permissions
    parent: Reference
weight: 107
related:
  - /telegraf/controller/tokens/
  - /telegraf/controller/tokens/create/
  - /telegraf/controller/reference/authentication-authorization/
  - /telegraf/controller/reference/api/
---

{{% product-name %}} describes what a user or an API token may do with a
**permission string**: a list of resources and the actions allowed on each.
Every [user role](/telegraf/controller/reference/authentication-authorization/#user-roles)
has a fixed permission string, and every
[API token](/telegraf/controller/tokens/) stores its own.

You work with permission strings in the following places:

- The **Permissions** card on the **Create API Token** page builds one from
  the boxes you check.
  See [Create an API token](/telegraf/controller/tokens/create/).
- The `permissions` field of `POST /api/tokens` accepts one, and the token
  endpoints return one for each token.
  See [API](/telegraf/controller/reference/api/).
- The token detail page shows a token's permissions as a read-only grid.

## Syntax

A permission string is zero or more _grants_ separated by semicolons.
Each grant names one resource and one or more actions:

```
RESOURCE:ACTION[,ACTION...][;RESOURCE:ACTION[,ACTION...]...]
```

- `RESOURCE` is one of the [resources](#resources), or `*` for every resource.
- `ACTION` is one of the [actions](#actions), or `*` for every action.
- A colon (`:`) separates a resource from its actions, a comma (`,`) separates
  actions, and a semicolon (`;`) separates grants.
- Spaces around a grant or an action are ignored.
- The order of grants doesn't matter, and a resource can appear in more than
  one grant.
- An empty string grants nothing.

For example, the following string lets a client read and update
configurations, read configuration groups, and send heartbeats:

```
configs:read,write;config-groups:read;heartbeat:write
```

### Wildcards

- `*` in place of a resource applies the actions to every resource.
  For example, `*:read` grants read access to everything.
- `*` in place of an action grants every action on the resource.
  For example, `agents:*` grants `read`, `write`, and `delete` on agents.
- `*:*` grants everything. This is the Owner role's permission string.

When a wildcard appears in a token request, {{% product-name %}} expands it
to the permissions your role holds.
See [How requested permissions are restricted](#how-requested-permissions-are-restricted).

### Invalid strings

{{% product-name %}} rejects a permission string, and the API returns
`400 Bad Request`, when the string contains any of the following:

- A resource or action that isn't in the vocabulary, for example
  `config:read` instead of `configs:read`.
- A grant without actions, for example `configs`.
- A trailing semicolon or comma, for example `configs:read;` or
  `configs:read,`.

The validator accepts any action on any resource.
An action that no endpoint requires, such as `delete` on `heartbeat`, is
stored but has no effect.
The **Permissions** grid in the web interface offers only the actions each
resource supports.

## Resources

| Resource              | Label in the web interface | Actions                   | Controls |
| :-------------------- | :------------------------- | :------------------------ | :------- |
| `configs`             | Configurations             | `read`, `write`, `delete` | [Configurations](/telegraf/controller/configs/), their versions and TOML, and [configuration aliases](/telegraf/controller/configs/aliases/). |
| `config-groups`       | Configuration Groups       | `read`, `write`, `delete` | [Configuration groups](/telegraf/controller/config-groups/) and their members. |
| `constants`           | Constants                  | `read`, `write`, `delete` | [Constants](/telegraf/controller/configs/constants/). |
| `agents`              | Agents                     | `read`, `write`, `delete` | [Agents](/telegraf/controller/agents/), their labels and reporting rule assignments, [heartbeat data](/telegraf/controller/agents/heartbeat-data/), status checks, and the fleet summary. |
| `reporting-rules`     | Reporting Rules            | `read`, `write`, `delete` | [Reporting rules](/telegraf/controller/agents/reporting-rules/). |
| `labels`              | Labels                     | `read`, `write`, `delete` | [Labels](/telegraf/controller/labels/). |
| `heartbeat`           | Heartbeat                  | `read`, `write`           | `write` lets a Telegraf agent send heartbeats. `read` lets a client read the [heartbeat service health](/telegraf/controller/admin/monitor/#heartbeat-service-health). |
| `tokens`              | Tokens                     | `read`, `write`, `delete` | [API tokens](/telegraf/controller/tokens/). A request authenticated with a token manages only the tokens of its own user. See [Token visibility](/telegraf/controller/tokens/#token-visibility). |
| `analytics`           | Analytics                  | `read`                    | No endpoint requires this permission in the current release. |
| `users`               | Users                      | `read`, `write`, `delete` | [User accounts](/telegraf/controller/users/). Account self-service and ownership transfer accept only a signed-in session. See [Session-only endpoints](/telegraf/controller/reference/authentication-authorization/#session-only-endpoints). |
| `invites`             | Invites                    | `read`, `write`, `delete` | [User invitations](/telegraf/controller/users/invite/). |
| `password-resets`     | Password Resets            | `read`, `write`, `delete` | Password reset requests. |
| `settings`            | Settings                   | `read`, `write`           | Authentication settings on the [Settings](/telegraf/controller/settings/) page. Changing the LDAP and OIDC sections also requires the Owner role. |
| `auth-config`         | Auth Config                | `read`, `write`           | Authentication provider details and group-to-role mappings. Only the Owner role holds `write`. |
| `license`             | License                    | `read`, `write`           | The [Telegraf Enterprise license](/telegraf/controller/telegraf-enterprise/). Only the Owner role holds `write`. |
| `entitlements`        | Entitlements               | `read`                    | Current entitlements and usage. Every role holds `read`. |
| `security-advisories` | Security Advisories        | `read`, `write`           | [Security advisories](/telegraf/controller/security-advisories/) (Telegraf Enterprise). `read` views advisories and fleet exposure. `write` checks for advisories, imports advisory files, and acknowledges notifications. |
| `audit`               | Audit Log                  | `read`                    | The [audit log](/telegraf/controller/admin/audit-logs/) and its integrity check (Telegraf Enterprise). |

## Actions

- **`read`**: list and view the resource.
- **`write`**: create and update the resource, and perform actions on it,
  such as checking agent statuses.
  Operations that change a resource without deleting it, such as removing a
  label from an agent, are also `write` operations.
- **`delete`**: delete the resource.
- **`*`**: every action on the resource.

## How permissions are checked

Each API endpoint requires one or more permissions.
The [interactive API reference](/telegraf/controller/reference/api/) lists
them for every endpoint.

A request satisfies a required permission when at least one grant in the
caller's permission string covers it: the grant's resource is the required
resource or `*`, and one of the grant's actions is the required action or `*`.
When an endpoint requires more than one permission, the request must cover
all of them.

Which permission string applies depends on how the request is authenticated:

- A signed-in session uses the permissions of the user's role.
- An API token uses the permissions stored on the token, which never exceed
  the role of the user it belongs to.

Telegraf agents send heartbeats to the heartbeat service on its own port.
The heartbeat service accepts an active token that holds `heartbeat:write`.
See [Use API tokens](/telegraf/controller/tokens/use/).

Endpoint groups with authentication disabled skip the permission check.
See [Endpoint authentication](/telegraf/controller/reference/authentication-authorization/#endpoint-authentication).

## Role permissions

Each [user role](/telegraf/controller/reference/authentication-authorization/#user-roles)
holds the following permissions.
**All** means every action listed for the resource under
[Resources](#resources).

| Resource              | Owner | Administrator | Manager | Viewer |
| :-------------------- | :---- | :------------ | :------ | :----- |
| `configs`             | All   | All           | All     | Read   |
| `config-groups`       | All   | All           | All     | Read   |
| `constants`           | All   | All           | All     | Read   |
| `agents`              | All   | All           | All     | Read   |
| `reporting-rules`     | All   | All           | All     | Read   |
| `labels`              | All   | All           | All     | Read   |
| `heartbeat`           | All   | All           | All     | None   |
| `tokens`              | All   | All           | All     | None   |
| `analytics`           | All   | All           | None    | None   |
| `users`               | All   | All           | None    | None   |
| `invites`             | All   | All           | None    | None   |
| `password-resets`     | All   | All           | None    | None   |
| `settings`            | All   | All           | None    | None   |
| `auth-config`         | All   | Read          | None    | None   |
| `license`             | All   | Read          | None    | None   |
| `entitlements`        | All   | Read          | Read    | Read   |
| `security-advisories` | All   | All           | Read    | Read   |
| `audit`               | All   | Read          | None    | None   |

{{< expand-wrapper >}}
{{% expand "Role permission strings" %}}

**Owner**: `*:*`

**Administrator**:

```
configs:*;config-groups:*;constants:*;agents:*;labels:*;reporting-rules:*;tokens:*;heartbeat:*;analytics:*;users:*;invites:*;password-resets:*;settings:*;auth-config:read;license:read;entitlements:read;security-advisories:*;audit:read
```

**Manager**:

```
configs:*;config-groups:*;constants:*;agents:*;labels:*;reporting-rules:*;tokens:*;heartbeat:*;entitlements:read;security-advisories:read
```

**Viewer**:

```
configs:read;config-groups:read;constants:read;agents:read;labels:read;reporting-rules:read;entitlements:read;security-advisories:read
```

{{% /expand %}}
{{< /expand-wrapper >}}

## How requested permissions are restricted

When you create a token, {{% product-name %}} compares each requested grant
with the permissions of your role and keeps only what the role holds:

- A grant your role holds is kept as written.
- A wildcard is replaced by the grants your role holds that it covers.
  For an Administrator, `*:*` becomes the Administrator permission string,
  and `license:*` becomes `license:read`.
- A grant your role doesn't hold is dropped without an error.
  For example, a Manager who requests `users:read` receives a token with no
  `users` grant.
  Check the `permissions` field in the response, or the token's detail page,
  to see what the token received.

A request authenticated with an API token is also restricted to the
permissions of that token, so a token can't create a token broader than
itself.

The same restriction applies again when a token is
[reassigned](/telegraf/controller/tokens/reassign/) to another user, using
the target user's role, when a user's role changes, and after an
[ownership transfer](/telegraf/controller/users/transfer-ownership/), when
the former owner's tokens are restricted to the **Administrator** role.
See [API tokens](/telegraf/controller/reference/authentication-authorization/#api-tokens).

## Permission presets

The **Create API Token** page offers presets that fill the **Permissions**
grid for you.

| Preset             | Permission string                                  | Available to                  |
| :----------------- | :------------------------------------------------- | :---------------------------- |
| **Custom**         | Starts empty. Check the actions you want.          | Owner, Administrator, Manager |
| **Telegraf Agent** | `configs:read;config-groups:read;heartbeat:write`  | Owner, Administrator, Manager |
| **Read-Only**      | `read` on every resource                           | Owner, Administrator, Manager |
| **Full Access**    | `*:*`                                              | Owner, Administrator          |

A preset is restricted to your role like any other request, so **Read-Only**
for a Manager grants `read` on the resources a Manager can access, and
**Full Access** for an Administrator grants the Administrator permission
string.
Changing any box after selecting a preset switches the preset back to
**Custom**.
