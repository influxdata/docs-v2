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
  - The first admin token on an instance is the _operator_ token. It never
    expires and is managed by InfluxData--InfluxData provides you an initial
    admin token to administer your instance.
  - **Named admin tokens** are additional admin tokens. They're long-lived by
    default and expire only if you set an expiration.
- **Database tokens**: Grant scoped read and/or write access to specific
  databases. Use database tokens to authorize applications that write or query
  data.

## Create a token

Before you create tokens, [configure the `influxdb3` CLI](/influxdb3/cloud/get-started/setup/#configure-the-influxdb3-cli)
to connect to your instance and authenticate with your admin token.

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

The raw token string is shown only once--copy it immediately and store it
securely.

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
