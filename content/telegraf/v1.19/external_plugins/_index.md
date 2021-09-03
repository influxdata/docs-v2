---
title: External plugins
description:
menu:
  telegraf_1_19:
     name: External plugins
     weight: 50
---

[External plugins](/EXTERNAL_PLUGINS.md) are external programs that are built outside
of Telegraf that can run through an `execd` plugin. These external plugins allow for
more flexibility compared to internal Telegraf plugins.  

- External plugins can access to libraries not written in Go
- Utilize licensed software that isn't available to the open source community
- Can include large dependencies that would otherwise bloat Telegraf
- You don't need to wait on the Telegraf team to publish your plugin and start working with it.
- using the [shim](/plugins/common/shim) you can easily convert plugins between internal and external use

{{< children hlevel="h2" >}}
