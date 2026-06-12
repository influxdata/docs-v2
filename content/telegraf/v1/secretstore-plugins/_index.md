---
title: "Telegraf Secret Store Plugins"
description: "Telegraf secret store plugins provide secrets such as credentials to plugins."
menu:
  telegraf_v1_ref:
    name: Secret store plugins
    parent: plugins_reference
    identifier: secretstore_plugins_reference
    weight: 10
tags: [secretstore-plugins]
---

Telegraf secret store plugins provide secrets such as credentials to plugins.
Secret store plugins provide secrets like usernames, passwords, or tokens
to other plugins including other secret stores (for example, when retrieving
secrets requires a token). Different secret store plugins retrieve secrets from different stores, including the operating system, Docker Secrets, and HashiCorp Vault.

{{< telegraf/plugins type="secretstore" >}}
