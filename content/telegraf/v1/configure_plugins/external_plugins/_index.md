---
title: Integrate with external plugins
description: >
  External plugins are programs built outside of Telegraf that run through
  the execd plugins. Use them to collect, process, or write metrics with
  code written in any language.
menu:
  telegraf_v1:
    name: External plugins
    parent: Use plugins
weight: 104
related:
  - /telegraf/v1/input-plugins/execd/
  - /telegraf/v1/processor-plugins/execd/
  - /telegraf/v1/output-plugins/execd/
---

[External plugins](https://github.com/influxdata/telegraf/blob/master/EXTERNAL_PLUGINS.md)
are programs built outside of Telegraf that run through one of the `execd`
plugins:

- [inputs.execd](/telegraf/v1/input-plugins/execd/)
- [processors.execd](/telegraf/v1/processor-plugins/execd/)
- [outputs.execd](/telegraf/v1/output-plugins/execd/)

External plugins allow more flexibility than internal Telegraf plugins:

- Write plugins in any language.
  Internal Telegraf plugins must be written in Go.
- Use libraries not written in Go, including libraries that require CGO
  support.
- Use licensed software that isn't available to the open source community.
- Include large dependencies that would otherwise bloat Telegraf.
- Run your plugin immediately, without waiting for the Telegraf team to
  review and publish it.
- Convert plugins between internal and external using the
  [shim](/telegraf/v1/configure_plugins/external_plugins/shim/).

{{< children hlevel="h2" >}}

For community-built external plugins, see the
[external plugins list](https://github.com/influxdata/telegraf/blob/master/EXTERNAL_PLUGINS.md)
in the Telegraf repository.
