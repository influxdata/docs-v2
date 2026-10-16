---
title: Manage tokens
description: >
  Create, rotate, and store EDR's auth and write tokens.
menu:
  influxdb3_enterprise:
    parent: edr
    identifier: edr-manage-tokens
    name: Manage tokens
weight: 7
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/operations.md, docs/external/edr-spec.md -->
<!-- GA_REVIEW: EDR 1.0.0 at fcdf286; release-specific updates reconciled with docs/external at c2f088e. Existing VERIFIED corrections take precedence over upstream prose. -->

Tokens are resolved from the token store **on every use—never cached**. To
rotate a token, overwrite the file; the next operation uses the new value.
No restart required. If both ends rotate, update the destination first.

## Token store

Set the directory with `--token-store` or `INFLUXDB3_EDR_TOKEN_STORE`.
The file name is the token reference in the configuration.
Each file can contain either a whitespace-trimmed raw token or an InfluxDB server token JSON object:

```json
{"token": "DESTINATION_TOKEN", "name": "destination-write"}
```

The store reads the `token` field.
If `expiry_millis` is present and has passed, the agent warns once; the server still enforces token validity.
Other fields, such as `name`, do not affect token resolution.
For example, copy a server `admin-token.json` unchanged into the store and reference it with `write_token: admin-token.json`.
The store does not select entries from a `permission-tokens.json` collection; provision the required token as its own file.
Keep local token files `chmod 600`.
The agent warns once per file if group or world permissions are present.
Kubernetes Secret volumes can use `0440` with the container's group.
Token names are validated against path traversal. Tokens are never logged.

Each node's config file references two kinds of tokens by name:

- **Auth token**—identifies a source to its destination. Each upstream
  needs a unique auth token so the downstream can identify who connected
  (`upstreams[].auth_token` on the receiving node; `auth_token` on the
  sending node's `downstream`).
- **Write token**—the destination's EDR agent uses it to write the
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

Sync Vault secrets into the file store, for example, with Vault Agent templates.
