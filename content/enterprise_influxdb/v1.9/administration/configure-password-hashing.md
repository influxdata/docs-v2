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
[FIPS] compliance requires particular hashing alorithms.
Use `pbkdf2-sha256` or `pbkdf2-sha512` for FIPS compliance.

## Change password hashing algorithm

Complete the following steps
to change the password hashing algorithm used by an existing InfluxDB Enterprise cluster:

1. Ensure all meta and data nodes are running InfluxDB Enterprise 1.9.3 or later.
2. In your meta node and data node configuration files, set [`password-hash`] to one of the following:
   `pbkdf2-sha256`, or `pbkdf2-sha512`.
   Also set [`ensure-fips`] to `true`.

   {{% note %}}
The `meta.password-hash` setting must be the same in both the data and meta node configuration files.
   {{% /note %}}
3. Restart each meta and data node to load the configuration change.
4. To apply the new hashing algorithm, you must [reset](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/#reset-a-users-password)
   all existing passwords in the cluster.
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

## Using FIPS readiness checks

Log output for default (bcrypt, not FIPS-ready, not ensuring FIPS):

```
2021-07-21T17:19:27.823355Z     info    Password hashing configuration: bcrypt;cost=10  {"log_id": "0VUX6rgG000"}
2021-07-21T17:19:27.823363Z     info    Password hashing is FIPS-ready: false  {"log_id": "0VUX6rgG000"}
```

Log output for `pbkdf2-sha256` (FIPS ready, output looks same whether `ensure-fips` is enabled or not):

```
2021-07-21T17:20:44.024846Z     info    Password hashing configuration: pbkdf2-sha256;rounds=29000;salt_len=16  {"log_id": "0VUXBWE0001"}
2021-07-21T17:20:44.024857Z     info    Password hashing is FIPS-ready: true   {"log_id": "0VUXBWE0001"}
```

When `ensure-fips` is enabled, attempting to use `password-has = bcrypt`
results in the following warning being output in the logs:

```
run: create server: passwordhash: not FIPS-ready: config: 'bcrypt'
```

`pbkdf2-sha1` is disabled, which we have disabled:

```
run: create server: passwordhash: invalid PasswordHasher option: Unrecognized PasswordHasher: pbkdf2-sha1
```

[FIPS]: https://csrc.nist.gov/publications/detail/fips/140/3/final
[`password-hash`]: /enterprise_influxdb/v1.9/administration/config-meta-nodes/#password-hash--bcrypt
[`ensure-fips`]: /enterprise_influxdb/v1.9/administration/config-meta-nodes/#ensure-fips--false

