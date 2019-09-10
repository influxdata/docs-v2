---
title: Store secrets in Vault
description: Manage secrets in InfluxDB using the InfluxDB UI or the influx CLI.
v2.0/tags: [secrets, security]
menu:
  v2_0:
    parent: Store and use secrets
weight: 201
---

[Vault](https://www.vaultproject.io/) secures, stores, and tightly controls access
to tokens, passwords, certificates, and other sensitive secrets.
Store sensitive secrets in Vault using the InfluxDB built-in Vault integration.

## Start a Vault server

Start a Vault server and ensure InfluxDB has network access to the server.

The following links provide information about running Vault in both development and production:

- [Install Vault](https://learn.hashicorp.com/vault/getting-started/install)
- [Start a Vault dev server](https://learn.hashicorp.com/vault/getting-started/dev-server)
- [Deploy Vault](https://learn.hashicorp.com/vault/getting-started/deploy)

{{% note %}}
InfluxDB supports the [Vault KV Secrets Engine Version 2 API](https://www.vaultproject.io/api/secret/kv/kv-v2.html) only.
When you create a secrets engine, enable the `kv-v2` version by running:

```js
vault secrets enable kv-v2
```
{{% /note %}}

For this example, install Vault on your local machine and start a Vault dev server.

```sh
vault server -dev
```

## Define Vault environment variables

Use [Vault environment variables](https://www.vaultproject.io/docs/commands/index.html#environment-variables)
to provide connection credentials and other important Vault-related information to InfluxDB.

#### Required environment variables

- `VAULT_ADDR`: The API address of your Vault server _(provided in the Vault server output)_.
- `VAULT_TOKEN`: The [Vault token](https://learn.hashicorp.com/vault/getting-started/authentication)
  required to access your Vault server.

_Your Vault server configuration may require other environment variables._

```sh
export VAULT_ADDR='http://127.0.0.1:8200' VAULT_TOKEN='s.0X0XxXXx0xXxXXxxxXxXxX0x'
```

## Start InfluxDB

Start the [`influxd` service](/v2.0/reference/cli/influxd/) with the `--secret-store`
option set to `vault`.

```bash
influxd --secret-store vault
```
