---
title: Manage API tokens
seotitle: Manage API tokens in InfluxDB
description: Manage API tokens in InfluxDB using the InfluxDB UI or the influx CLI.
influxdb/v2/tags: [tokens, authentication, security]
menu:
  influxdb_v2:
    name: Manage tokens
    parent: Administer InfluxDB
weight: 11
aliases:
  - /influxdb/v2/users/tokens
  - /influxdb/v2/security/tokens/
---

InfluxDB **API tokens** ensure secure interaction between InfluxDB and external tools such as clients or applications.
An API token belongs to a specific user and identifies InfluxDB permissions within the user's organization.

Learn how to create, view, update, or delete an API token.

## API token types

- [Operator API token](#operator-token)
- [All Access API token](#all-access-token)
- [Read/Write token](#readwrite-token)

### Operator token

Grants full read and write access to **all organizations and all organization resources in InfluxDB OSS 2.x**.
Some operations--for example, [retrieving the server configuration](/influxdb/v2/reference/config-options/)--require _operator_ permissions.

#### Initial operator token

When you first initialize {{% product-name %}}, the [setup](/influxdb/v2/get-started/setup/) process creates an initial user, org, bucket, and an Operator token with full read/write access to all organizations.
When running setup, you can either:

- Supply the token value yourself ([`influx setup --token` flag](/influxdb/v2/reference/cli/influx/setup/) or the [setup API](/influxdb/v2/api/v2/#tag/Setup) `token` field), or
- Let InfluxDB auto-generate it. InfluxDB stores the generated token in the active influx CLI config so the CLI can use it later. 

#### Creating operator tokens after setup

To [create an operator token manually](/influxdb/v2/admin/tokens/create-token/) with the InfluxDB UI, `api/v2` API, or `influx` CLI after the setup process is completed, you must use an existing [Operator token](/influxdb/v2/admin/tokens/#operator-token).

To create a new Operator token without using an existing one, see how to use the [`influxd recovery auth`](/influxdb/v2/reference/cli/influxd/recovery/auth/) CLI.

> [!Tip]
> Because Operator tokens have full read and write access to all organizations in the database,
> we recommend [creating an All Access token](/influxdb/v2/admin/tokens/create-token/)
> for each organization and using those to manage InfluxDB.
> This helps to prevent accidental interactions across organizations.

### All Access token

Grants full read and write access to all resources in an organization.

### Read/Write token

Grants read access, write access, or both to specific buckets in an organization.

## Token hashing

InfluxDB can store API tokens as hashes on disk. Hashed storage protects
tokens at rest: a copy of the underlying database file doesn't expose
usable tokens.

| InfluxDB version | Token hashing default |
| :--- | :--- |
| 2.9.0 and later | **Enabled** by default |
| 2.8.0–2.8.x | Available, **disabled** by default |
| 2.7 and earlier | Not supported |

### How token hashing works

When `influxd` starts with token hashing enabled:

1. Existing unhashed tokens are migrated to hashed form.
2. After migration, the original token strings cannot be retrieved.
3. New tokens created while hashing is enabled are stored as hashes.

Hashed tokens continue to authenticate exactly like unhashed tokens —
clients and integrations that already store their token in plaintext
continue to work.

If you disable token hashing later, tokens that have already been hashed
on disk remain hashed. New tokens created while hashing is disabled are
stored unhashed.

### Before upgrading to 2.9.0

> [!Important]
> #### Capture plaintext tokens before you upgrade
>
> Once `influxd` 2.9.0 starts with the default settings, all existing
> tokens are hashed and the original strings cannot be recovered.
> Capture any tokens you still need in plaintext **before** the first
> 2.9.0 startup — including the operator token, which is required when
> [restoring a backup](/influxdb/v2/admin/backup-restore/restore/) with
> `influx restore --full`.

### Backup and restore

A backup taken from an instance with token hashing enabled does not
contain a plaintext operator token. To restore that backup with
`influx restore --full`, supply the operator token via the
`--operator-token <token>` flag (`influx-cli` v2.8.0+). Without that
flag, the CLI cannot authenticate post-restore requests.

### Disable token hashing

To opt out of the default — for example, to preserve compatibility with a
possible downgrade to InfluxDB 2.7 or earlier — start `influxd` with the
[`use-hashed-tokens`](/influxdb/v2/reference/config-options/#use-hashed-tokens)
option set to `false`:

```sh
influxd --use-hashed-tokens=false
```

Or set the environment variable or configuration file equivalent:

```sh
export INFLUXD_USE_HASHED_TOKENS=false
```

```yml
use-hashed-tokens: false
```

### Downgrade considerations

Downgrading to InfluxDB 2.7 or earlier after token hashing has run on a
database **erases all stored tokens** as part of the schema downgrade.
If you may need to downgrade, start `influxd` 2.9.0 with
`--use-hashed-tokens=false` so that token hashing never runs on the
database.

If token hashing is _never_ enabled, downgrading from 2.9.0 to 2.8.x or
2.7.x is supported. Downgrading directly to a version earlier than 2.7
is not recommended.

### Replace a lost token

Because hashing prevents recovery of the original token string, replace
lost tokens by [creating a new token](/influxdb/v2/admin/tokens/create-token/).
To replace a lost _operator_ token without an existing one, use
[`influxd recovery auth`](/influxdb/v2/reference/cli/influxd/recovery/auth/).

{{< children hlevel="h2" >}}
