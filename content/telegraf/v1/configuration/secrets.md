---
title: Use secrets in Telegraf configurations
description: >
  Keep credentials out of plain-text Telegraf configuration files: configure
  secret store plugins and reference secrets with @{store_id:secret_name}
  syntax.
menu:
  telegraf_v1:
    name: Secrets
    parent: Configure Telegraf
weight: 107
related:
  - /telegraf/v1/secretstore-plugins/
  - /telegraf/v1/commands/secrets/
  - /telegraf/v1/configuration/environment-variables/
---

Secret stores keep credentials and other sensitive values out of plain-text
configuration files.
Configure one or more secret store plugins, then reference secrets in plugin
configurations. Telegraf resolves them at runtime and protects them in memory.

A secret reference has the form:

```text
@{<secret_store_id>:<secret_name>}
```

where `secret_store_id` is the unique `id` you assign to a secret store
plugin, and `secret_name` is the name of the secret in that store.
Both can contain only letters, numbers, and underscores.

## Configure a secret store

Each secret store plugin is configured with a required `id` that other
configuration references. For the available stores, such as the OS keyring,
Docker secrets, systemd credentials, and encrypted files, see
[secret store plugins](/telegraf/v1/secretstore-plugins/).

The following example configures two stores and uses a secret from the first
to unlock the second:

```toml
[[secretstores.os]]
  id = "local_secrets"

[[secretstores.jose]]
  id = "cloud_secrets"
  path = "/etc/telegraf/secrets"
  # Optional reference to another secret store to unlock this one
  password = "@{local_secrets:cloud_store_passwd}"
```

## Reference secrets in plugins

Use secret references in plugin options that support them:

```toml
[[inputs.http]]
  urls = ["http://server.company.org/metrics"]
  username = "@{local_secrets:company_server_http_metric_user}"
  password = "@{local_secrets:company_server_http_metric_pass}"

[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "@{cloud_secrets:influxdb_token}"
  database = "your_database"
```

> [!Note]
> #### Not all configuration options support secrets
>
> A plugin option must be implemented as secret-capable to accept a secret
> reference. Using a secret reference in an unsupported option fails.
> Options that support secrets are noted in each plugin's documentation.

## Manage secrets from the command line

Use the [`telegraf secrets` command](/telegraf/v1/commands/secrets/) to list,
read, and store secrets in configured secret stores.

## Memory locking

Telegraf locks the memory pages that contain secrets, so the locked-memory
limit must be large enough for the number of secrets in use.
Telegraf checks the limit and the number of secrets at startup and warns if
the limit is too low.
Raise the limit with `ulimit -l`.

If Telegraf runs in a FreeBSD jail, the jail must permit locked memory pages.
Add the `allow.mlock = 1;` jail parameter to the jail's definition
in `/etc/jail.conf`.
