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
more flexibility compared to internal Telegraf plugins. Benefits to using external plugins include:
- Access to libraries not written in Go
- Using licensed software (not available to open source community)
- Including large dependencies that would otherwise bloat Telegraf
- Using your external plugin immediately without waiting for the Telegraf team to publish
- Easily convert plugins between internal and external using the [shim](/plugins/common/shim)



{{< children hlevel="h2" >}}
