---
title: External plugins
description:
menu:
  telegraf_1_19:
     name: External plugins
     weight: 50
---

To add functionality that doesn't already exist in Telegraf plugins, 
write an [external plugin](/EXTERNAL_PLUGINS.md) in any language (Telegraf plugins must be written in Go), 
and then run the external plugin through the `etcd` plugin.

- External plugins can access to libraries not written in Go
- Utilize licensed software that isn't available to the open source community
- Can include large dependencies that would otherwise bloat Telegraf
- You don't need to wait on the Telegraf team to publish your plugin and start working with it.
- using the [shim](/plugins/common/shim) you can easily convert plugins between internal and external use

{{< children hlevel="h2" >}}
