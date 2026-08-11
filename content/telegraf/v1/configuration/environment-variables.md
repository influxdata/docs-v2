---
title: Use environment variables in Telegraf configurations
description: >
  Substitute environment variables anywhere in the Telegraf configuration
  file with ${VAR} syntax, including shell parameter expansion forms for
  defaults and required variables.
menu:
  telegraf_v1:
    name: Environment variables
    parent: Configure Telegraf
weight: 106
related:
  - /telegraf/v1/configuration/secrets/
  - /telegraf/v1/configuration/file/
  - /telegraf/v1/configuration/toml/
---

Use environment variables anywhere in the configuration file by enclosing
them in `${}`.
Telegraf replaces variables before parsing the file, so a variable can supply
any part of the configuration.

Quoting follows the TOML type of the value:

- For strings, put the variable inside quotes, such as `"${STR_VAR}"`.
- For numbers and booleans, leave the variable unquoted, such as
  `${INT_VAR}` or `${BOOL_VAR}`.
- In double-quoted strings, escape backslashes, such as
  `"C:\\Program Files"`.
  For values that contain a single backslash, use a single-quoted literal
  string, such as `'C:\Program Files'`.
  See
  [Basic strings and literal strings](/telegraf/v1/configuration/toml/#basic-strings-and-literal-strings).

> [!Note]
> For credentials, consider [secret stores](/telegraf/v1/configuration/secrets/)
> instead of environment variables. Secrets are resolved at runtime and
> protected in memory.

## Expansion forms

Telegraf supports shell parameter expansion for environment variables:

- **`${VARIABLE}`**: the value of `VARIABLE`.
- **`${VARIABLE:-default}`**: `default` if `VARIABLE` is unset or empty.
- **`${VARIABLE-default}`**: `default` only if `VARIABLE` is unset.
- **`${VARIABLE:?err}`**: exits with an error message containing `err` if
  `VARIABLE` is unset or empty.
- **`${VARIABLE?err}`**: exits with an error message containing `err` if
  `VARIABLE` is unset.

## Where to define variables

Define variables in the environment that starts Telegraf, such as your shell,
a systemd unit, or a container environment.
When using the `.deb` or `.rpm` packages, define environment variables in
`/etc/default/telegraf`.
The service reads this file at startup.

## Example

Define the variables:

```sh
# /etc/default/telegraf
INFLUX_HOST="http://localhost:8086"
INFLUX_TOKEN="replace_with_your_token"
INFLUX_ORG="your_org"
INFLUX_BUCKET="telegraf"
```

Reference them in the configuration file:

```toml
[global_tags]
  user = "${USER}"

[[inputs.mem]]

[[outputs.influxdb_v2]]
  urls = ["${INFLUX_HOST}"]
  token = "${INFLUX_TOKEN}"
  organization = "${INFLUX_ORG}"
  bucket = "${INFLUX_BUCKET}"
```

After substitution, Telegraf parses the effective configuration:

```toml
[global_tags]
  user = "alice"

[[inputs.mem]]

[[outputs.influxdb_v2]]
  urls = ["http://localhost:8086"]
  token = "replace_with_your_token"
  organization = "your_org"
  bucket = "telegraf"
```
