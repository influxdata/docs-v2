---
title: Manage tokens
description: >
  Create, rotate, and store EDR's auth and write tokens.
menu:
  influxdb3_edr:
    name: Manage tokens
weight: 7
---

Tokens are resolved from the token store **on every use—never cached**. To
rotate a token, overwrite the file; the next operation uses the new value.
No restart required. If both ends rotate, update the destination first.

## Token store

The file-based store is a directory of plain-text files: file name = token
reference, content = secret (whitespace-trimmed). Keep files `chmod 600`.
Token names are validated against path traversal. Tokens are never logged.

Each node's config file references two kinds of tokens by name:

- **Auth token**—identifies a source to its destination. Each upstream
  needs a unique auth token so the downstream can identify who connected
  (`upstreams[].auth_token` on the receiving node; `auth_token` on the
  sending node's `downstream`).
- **Write token**—used by the destination's EDR agent to write the
  source's data into local InfluxDB (`upstreams[].write_token`). Typically
  the destination InfluxDB instance's admin or operator token.

```bash
mkdir -p /etc/edr/secrets

# Auth token -- generate a unique token per source node.
openssl rand -hex 32 > /etc/edr/secrets/my-auth-token

# Write token -- typically the destination's InfluxDB admin/operator token.
cp /path/to/destination-write-token /etc/edr/secrets/dest-write-token
```

## Rotate a token

Overwrite the token file at its existing path with the new secret. The
agent resolves tokens fresh on every use, so no restart is required. When
rotating a token shared between a source and a destination, update the
**destination** first, then the source.

## Retire an upstream

There's no dedicated decommission API. Permanently retire an upstream by
removing it from the downstream's config (its `upstreams` list) and
revoking its auth token. Previously replicated data at the destination is
preserved.

## Vault-backed token stores

A Vault-backed store is planned behind the same `TokenStore` service
provider interface (SPI). Until then, sync Vault secrets into the file
store—for example, with Vault Agent templates.
