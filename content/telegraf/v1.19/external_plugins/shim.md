---
title: Use the `execd` shim
description:
menu:
  telegraf_1_19:
     name: Use the `execd` shim
     weight: 50
     parent: External plugins
---

The shim makes it easy to extract an internal input,
processor, or output plugin from the main Telegraf repo out to a stand-alone
repo. This allows anyone to build and run it as a separate app using one of the
`execd` plugins:
- [inputs.execd](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/execd)
- [processors.execd](https://github.com/influxdata/telegraf/blob/master/plugins/processors/execd)
- [outputs.execd](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/execd)

## Extract a plugin using the shim wrapper

1. Move the project to an external repo. We recommend preserving the path
  structure: for example, if your plugin was located at
  `plugins/inputs/cpu` in the Telegraf repo, move it to `plugins/inputs/cpu`
  in the new repo.
2. Copy [main.go](https://github.com/influxdata/telegraf/blob/master/plugins/common/shim/example/cmd/main.go) into your project under the `cmd` folder.
  This serves as the entry point to the plugin when run as a stand-alone program.
  {{% note %}}
  The shim isn't designed to run multiple plugins at the same time, so include only one plugin per repo.
  {{% /note %}}
3. Edit the `main.go` file to import your plugin. For example,`_ "github.com/me/my-plugin-telegraf/plugins/inputs/cpu"`. See an example of where to edit `main.go` [here](https://github.com/influxdata/telegraf/blob/7de9c5ff279e10edf7fe3fdd596f3b33902c912b/plugins/common/shim/example/cmd/main.go#L9).
4. Add a [plugin.conf](https://github.com/influxdata/telegraf/blob/master/plugins/common/shim/example/cmd/plugin.conf) for configuration
  specific to your plugin.
  {{% note %}}
  This config file must be separate from the rest of the config for Telegraf, and must not be in a shared directory with other Telegraf configs.
  {{% /note %}}

## Test and run your plugin

1. Build the `cmd/main.go` using the following command with your plugin name: `go build -o plugin-name cmd/main.go`
1. Test the binary:
2. If you're building a processor or output, first feed valid metrics in on `STDIN`. Skip this step if you're building an input.
3. Test out the binary by running it (for example, `./project-name -config plugin.conf`).
  Metrics will be written to `STDOUT`. You might need to hit enter or wait for your poll duration to elapse to see data.
4. Press `Ctrl-C` to end your test.
5. Configure Telegraf to call your new plugin binary. For an input, this would
  look something like:

```toml
[[inputs.execd]]
  command = ["/path/to/rand", "-config", "/path/to/plugin.conf"]
  signal = "none"
```

Refer to the `execd` plugin documentation for more information.

## Publish your plugin

Publishing your plugin to GitHub and open a Pull Request
back to the Telegraf repo letting us know about the availability of your
[external plugin](https://github.com/influxdata/telegraf/blob/master/EXTERNAL_PLUGINS.md).
