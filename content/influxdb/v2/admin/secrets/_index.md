---
title: Manage secrets
description: Manage, use, and store secrets in InfluxDB.
influxdb/v2/tags: [secrets, security]
menu:
  influxdb_v2:
    parent: Administer InfluxDB
weight: 14
aliases:
  - /influxdb/v2/security/secrets/manage-secrets/
  - /influxdb/v2/security/secrets/
---

Secrets are key-value pairs that contain sensitive information you want to control
access to, such as API keys, passwords, or certificates.
There are two options for storing secrets with InfluxDB:

- By default, secrets are Base64-encoded and stored in the InfluxDB embedded key value store,
  [BoltDB](https://github.com/boltdb/bolt).
- You can also set up a Vault server to store secrets.
  For details, see [Store secrets in Vault](/influxdb/v2/admin/secrets/use-vault).

---

{{< children >}}
