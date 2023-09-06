---
title: Integrate with external plugins
description: |
  External plugins are external programs that are built outside of Telegraf that can run through an `execd` plugin.
menu:
  telegraf_v1:
     name: External plugins
     weight: 50
     parent: Configure plugins
---

[External plugins](https://github.com/influxdata/telegraf/blob/master/EXTERNAL_PLUGINS.md) are external programs that are built outside
of Telegraf that can run through an `execd` plugin. These external plugins allow for
more flexibility compared to internal Telegraf plugins. Benefits to using external plugins include:
- Access to libraries not written in Go
- Using licensed software (not available to open source community)
- Including large dependencies that would otherwise bloat Telegraf
- Using your external plugin immediately without waiting for the Telegraf team to publish
- Easily convert plugins between internal and external using the [shim](https://github.com/influxdata/telegraf/blob/master/plugins/common/shim/README.md)



{{< children hlevel="h2" >}}
