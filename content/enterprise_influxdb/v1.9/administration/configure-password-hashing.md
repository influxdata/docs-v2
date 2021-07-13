---
title: Configure password hashing
description: >
  Configure the cryptographic algorithm used for password hashing.
menu:
  enterprise_influxdb_1_9:
    name: Configure password hashing
    weight: 80
    parent: Administration
---

Compliance standards might require particular hashing alorithms
when storing the InfluxDB Enterprise [user](/enterprise_influxdb/v1.9/concepts/glossary/#user) passwords.

By default, InfluxDB Enterprise uses `bcrypt` for password hashing.
Use the following configuration options to configure the password hashing algorithm.

{{% note %}}
The `meta.password-hash` setting must be the same in both the data and meta node configuration files.
{{% /note %}}


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

## Change password hashing algorithm

Complete the following steps
to change the password hashing algorithm used by an existing InfluxDB Enterprise cluster:

1. Ensure all meta and data nodes are running InfluxDB Enterprise 1.9.3 or later.
2. Edit the meta and data node configuration files as in the [example above](#example-configuration).
2. Restart each meta and node to pick up the configuration change.
3. [Reset](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/#reset-a-users-password) all passwords.
   For all existing usernames within the cluster,
   the passwords *must* be reset in order for the new hashing algorithm to be applied.
   Otherwise, the previous algorithm will continue to be used.
