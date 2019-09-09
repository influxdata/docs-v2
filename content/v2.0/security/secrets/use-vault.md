---
title: Store secrets in Vault
description: Manage secrets in InfluxDB using the InfluxDB UI or the influx CLI.
v2.0/tags: [secrets, security]
menu:
  v2_0:
    parent: Store secrets
weight: 201
---

[Vault](https://www.vaultproject.io/) secures, stores, and tightly controls access
to tokens, passwords, certificates, and other sensitive secrets.
Store sensitive secrets in Vault using the InfluxDB built-in Vault integration.

{{% note %}}
When not using Vault, secrets are Base64-encoded and stored in the InfluxDB embedded key value store,
[BoltDB](https://github.com/boltdb/bolt).
{{% /note %}}

## Start a Vault server

Start a Vault server and ensure InfluxDB has network access to the server.

The following links provide information about running Vault in both development and production:

- [Install Vault](https://learn.hashicorp.com/vault/getting-started/install)
- [Start a Vault dev server](https://learn.hashicorp.com/vault/getting-started/dev-server)
- [Deploy Vault](https://learn.hashicorp.com/vault/getting-started/deploy)

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

## Test Vault storage

With Vault and InfluxDB servers running, use the InfluxDB API to test Vault:

{{% note %}}
Replace `<org-id>` with your [organization ID](/v2.0/organizations/view-orgs/#view-your-organization-id)
and `YOURAUTHTOKEN` with your [InfluxDB authentication token](/v2.0/security/tokens/).
{{% /note %}}

##### Retrieve an organization's secrets

```sh
curl --request GET \
  --url http://localhost:9999/api/v2/orgs/<org-id>/secrets \
  --header 'authorization: Token YOURAUTHTOKEN'

# should return
#  {
#    "links": {
#      "org": "/api/v2/orgs/031c8cbefe101000",
#      "secrets": "/api/v2/orgs/031c8cbefe101000/secrets"
#    },
#    "secrets": []
#  }
```

##### Add secrets to an organization

```sh
curl --request PATCH \
  --url http://localhost:9999/api/v2/orgs/<org-id>/secrets \
  --header 'authorization: Token YOURAUTHTOKEN' \
  --header 'content-type: application/json' \
  --data '{
	"foo": "bar",
	"hello": "world"
}'

# should return 204 no content
```

##### Retrieve the added secrets

```bash
curl --request GET \
  --url http://localhost:9999/api/v2/orgs/<org-id>/secrets \
  --header 'authorization: Token YOURAUTHTOKEN'

# should return
#  {
#    "links": {
#      "org": "/api/v2/orgs/031c8cbefe101000",
#      "secrets": "/api/v2/orgs/031c8cbefe101000/secrets"
#    },
#    "secrets": [
#      "foo",
#      "hello"
#    ]
#  }
```

## Vault secrets storage

For each organization, InfluxDB creates a [secrets engine](https://learn.hashicorp.com/vault/getting-started/secrets-engines)
using the following pattern: `/secret/data/<org-id>`

{{% note %}}
The InfluxDB API supports KV engine v2 only.
{{% /note %}}

#### Enable KV secrets engine v2

To pass the correct version of the KV secrets engine when you enable a secrets engine, run: `vault secrets enable kv-v2`.

Secrets are stored in Vault as key value pairs in their respective secrets engines.

```
/secret/data/031c8cbefe101000 ->
  this_key: foo
  that_key: bar
  a_secret: key
```
