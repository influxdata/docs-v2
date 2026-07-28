---
title: Manage tokens
seotitle: Manage tokens in {{< product-name >}}
description: >
  Manage tokens to authenticate and authorize access to actions, resources, and
  data in your {{< product-name >}} instance.
menu:
  influxdb3_cloud:
    parent: Administer InfluxDB
weight: 104
influxdb3/cloud/tags: [tokens, security]
related:
  - /influxdb3/cloud/get-started/setup/
  - /influxdb3/cloud/reference/cli/influxdb3/
---

{{% product-name %}} uses token-based authorization to authenticate and
authorize actions in your instance.

> [!Note]
> #### Manage InfluxDB 3 Cloud tokens with the influxdb3 CLI
>
> In {{% product-name %}}, you create and manage tokens with the
> [`influxdb3` CLI](/influxdb3/cloud/reference/cli/influxdb3/) or the InfluxDB
> HTTP API.

## Token types

{{% product-name %}} supports the following token types:

- **Admin tokens**: Grant full administrative access to all actions and
  resources in the instance.
  - **Operator token**: The first admin token on an instance. InfluxData
    manages the operator token for your {{% product-name %}} instance.
    - Never expires
    - Cannot be edited or deleted
  - **Named admin tokens**: Additional admin tokens that you create and manage.
    - Can be created, edited, and deleted
    - Long-lived by default and expire only if you set an expiration
    - Cannot modify or remove the operator token
- **Database tokens**: Grant scoped read and write access to specific
  databases. Use database tokens to authorize applications that write or query
  data.
  - Grant `read`, `write`, or both to one or more databases
  - Cannot perform administrative actions

> [!Note]
> #### Store secure tokens in a secret store
>
> Token strings are returned _only_ when you create the token.
> Store tokens in a **secure secret store**.
> Anyone with access to an admin token has full control over your
> {{% product-name %}} instance.
> If you lose a token string, recreate the token.

## Create a token

Before you create tokens:

- [Configure the `influxdb3` CLI](/influxdb3/cloud/get-started/setup/#configure-the-influxdb3-cli)
  and [log in to your instance](/influxdb3/cloud/get-started/setup/#log-in-to-your-instance).
- Make sure you have admin privileges. Creating tokens requires admin access.
  If your user doesn't have admin access, ask an administrator to create a token
  for you.

Create a **named admin token**:

<!--pytest.mark.skip-->

```sh
influxdb3 create token --admin --name "support-2026"
```

To set an expiration, add `--expiry` with a duration (for example, `90d` or
`1y`):

<!--pytest.mark.skip-->

```sh
influxdb3 create token --admin --name "temp-90d" --expiry 90d
```

Create a **database token** with scoped read and write permissions:

<!--pytest.mark.skip-->

```sh { placeholders="DATABASE_NAME" }
influxdb3 create token \
  --permission "db:DATABASE_NAME:read,write" \
  --name "Read/write token for DATABASE_NAME"
```

Copy the raw token string immediately and store it securely.
It's shown only once.

## List tokens

List token names, types, and expirations (token strings aren't shown):

<!--pytest.mark.skip-->

```sh
influxdb3 show tokens
```

## Delete a token

<!--pytest.mark.skip-->

```sh { placeholders="TOKEN_NAME" }
influxdb3 delete token --token-name "TOKEN_NAME"
```

---

Because {{% product-name %}} runs the same InfluxDB 3 engine as
InfluxDB 3 Enterprise, token management works the same way.
For more details, see
[Manage tokens in InfluxDB 3 Enterprise](/influxdb3/enterprise/admin/tokens/).
