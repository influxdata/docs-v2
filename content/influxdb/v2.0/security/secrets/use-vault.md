---
title: Store secrets in Vault
description: Use Vault as an InfluxDB secret store and manage secrets through the in InfluxDB API.
influxdb/v2.0/tags: [secrets, security]
menu:
  influxdb_2_0:
    parent: Store and use secrets
weight: 306
---

[Vault](https://www.vaultproject.io/) secures, stores, and controls access
to tokens, passwords, certificates, and other sensitive secrets.
Store sensitive secrets in Vault using InfluxDB's built-in Vault integration.

To store secrets in Vault, complete the following steps:
 
1. [Start a Vault server](#start-a-vault-server).
2. [Provide Vault server address and token](#provide-vault-server-address-and-token).
3. [Start InfluxDB](#start-influxdb).
4. [Manage secrets through the InfluxDB API](#manage-secrets-through-the-influxdb-api).

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

## Provide Vault server address and token

Use `influxd` Vault-related tags or [Vault environment variables](https://www.vaultproject.io/docs/commands/index.html#environment-variables)
to provide connection credentials and other important Vault-related information to InfluxDB.

### Required credentials

#### Vault address

Provide the API address of your Vault server _(available in the Vault server output)_
using the [`--vault-addr` flag](/influxdb/v2.0/reference/config-options/#vault-addr) when
starting `influxd` or with the `VAULT_ADDR` environment variable.

#### Vault token

Provide your [Vault token](https://learn.hashicorp.com/vault/getting-started/authentication)
(required to access your Vault server) using the [`--vault-token` flag](/influxdb/v2.0/reference/config-options/#vault-token)
when starting `influxd` or with the `VAULT_TOKEN` environment variable.

_Your Vault server configuration may require other Vault settings._

## Start InfluxDB

Start the [`influxd` service](/influxdb/v2.0/reference/cli/influxd/) with the `--secret-store`
option set to `vault` any other necessary flags.

```bash
influxd --secret-store vault \
  --vault-addr=http://127.0.0.1:8200 \
  --vault-token=s.0X0XxXXx0xXxXXxxxXxXxX0x
```

`influxd` includes the following Vault configuration options.
If set, these flags override any [Vault environment variables](https://www.vaultproject.io/docs/commands/index.html#environment-variables):

- `--vault-addr`
- `--vault-cacert`
- `--vault-capath`
- `--vault-client-cert`
- `--vault-client-key`
- `--vault-max-retries`
- `--vault-client-timeout`
- `--vault-skip-verify`
- `--vault-tls-server-name`
- `--vault-token`

For more information, see [InfluxDB configuration options](/influxdb/v2.0/reference/config-options/).

## Manage secrets through the InfluxDB API

Use the InfluxDB `/org/{orgID}/secrets` API endpoint to add tokens to Vault.
For details, see [Manage secrets](/influxdb/v2.0/security/secrets/manage-secrets/).
