---
title: Configure password hashing
description: >
  Configure the cryptographic algorithm used for password hashing.
menu:
  enterprise_influxdb_1_9:
    name: Configure password hashing
    weight: 80
    parent: Administration
related:
    - /enterprise_influxdb/v1.9/administration/configuration/
---


By default, InfluxDB Enterprise uses `bcrypt` for password hashing.
[FIPS] compliance standards require particular hashing alorithms.
Use `pbkdf2-sha256` or `pbkdf2-sha256` for FIPS compliance.

## Change password hashing algorithm

Complete the following steps
to change the password hashing algorithm used by an existing InfluxDB Enterprise cluster:

1. Ensure all meta and data nodes are running InfluxDB Enterprise 1.9.3 or later.
2. In your meta node and data node configuration files, set [`password-hash`] to your desired algorithm
   and [`ensure-fips`] to `true`.

   {{% note %}}
The `meta.password-hash` setting must be the same in both the data and meta node configuration files.
   {{% /note %}}
3. Restart each meta and data node to load the configuration change.
4. [Reset](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/#reset-a-users-password) all user passwords.
   For all existing usernames within the cluster,
   the passwords *must* be reset in order for the new hashing algorithm to be applied.
   Otherwise, the previous algorithm will continue to be used.

## Example configuration

**Example data node configuration:**

```toml
[meta]
  # Configures password hashing scheme. Use "pbkdf2-sha256" or "pbkdf2-sha512"
  # for a FIPS-ready password hash. This setting must have the same value as
  # the meta nodes' meta.password-hash configuration.
  password-hash = "pbkdf2-sha256"

  # Configures strict FIPS-readiness check on startup.
  ensure-fips = true
```

**Example meta node configuration:**

```toml
[meta]
  # Configures password hashing scheme. Use "pbkdf2-sha256" or "pbkdf2-sha512"
  # for a FIPS-ready password hash. This setting must have the same value as
  # the data nodes' meta.password-hash configuration.
  password-hash = "pbkdf2-sha256"

  # Configures strict FIPS-readiness check on startup.
  ensure-fips = true
```

[FIPS]: https://csrc.nist.gov/publications/detail/fips/140/3/final
[`password-hash`]: /enterprise_influxdb/v1.9/administration/config-meta-nodes/#password-hash--bcrypt
[`ensure-fips`]: /enterprise_influxdb/v1.9/administration/config-meta-nodes/#ensure-fips--false
