---
title: Store secrets
description:
v2.0/tags: [secrets, security]
menu:
  v2_0:
    parent: Security & authorization
weight: 102
---

There are two options for storing secrets with InfluxDB:

- By default, secrets are Base64-encoded and stored in the InfluxDB embedded key value store, [BoltDB](https://github.com/boltdb/bolt).
- You can also set up Vault to store secrets. For details, see [Store secrets in Vault](/v2.0/security/secrets/use-vault).
