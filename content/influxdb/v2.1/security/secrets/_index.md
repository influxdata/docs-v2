---
title: Manage secrets
description: Manage, use, and store secrets in InfluxDB.
influxdb/v2.1/tags: [secrets, security]
menu:
  influxdb_2_1:
    parent: Security & authorization
weight: 102
aliases:
  - /influxdb/v2.1/security/secrets/manage-secrets/
---

Secrets are key-value pairs that contain sensitive information you want to control
access to, such as API keys, passwords, or certificates.
There are two options for storing secrets with InfluxDB:

- By default, secrets are Base64-encoded and stored in the InfluxDB embedded key value store,
  [BoltDB](https://github.com/boltdb/bolt).
- You can also set up a Vault server to store secrets.
  For details, see [Store secrets in Vault](/influxdb/v2.1/security/secrets/use-vault).

---

{{< children >}}
