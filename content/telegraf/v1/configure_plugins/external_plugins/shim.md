---
title: Use the execd shim
description: >
  Use the execd Go shim to extract an internal Telegraf input, processor, or
  output plugin into a stand-alone program that runs through an execd plugin.
menu:
  telegraf_v1:
    name: Use the execd shim
    parent: External plugins
weight: 201
related:
  - /telegraf/v1/input-plugins/execd/
  - /telegraf/v1/processor-plugins/execd/
  - /telegraf/v1/output-plugins/execd/
---

The [`execd` Go shim](https://github.com/influxdata/telegraf/tree/master/plugins/common/shim)
makes it easy to extract an internal input, processor, or output plugin from
the main Telegraf repo out to a stand-alone repo.
This lets anyone build and run it as a separate app using one of the `execd`
plugins:

- [inputs.execd](/telegraf/v1/input-plugins/execd/)
- [processors.execd](/telegraf/v1/processor-plugins/execd/)
- [outputs.execd](/telegraf/v1/output-plugins/execd/)

## Extract a plugin using the shim wrapper

1. Move the project to an external repo.
   We recommend preserving the path structure.
   For example, if your plugin was located at `plugins/inputs/cpu` in the
   Telegraf repo, move it to `plugins/inputs/cpu` in the new repo.
2. Copy
   [main.go](https://github.com/influxdata/telegraf/blob/master/plugins/common/shim/example/cmd/main.go)
   into your project under the `cmd` folder.
   This serves as the entry point to the plugin when run as a stand-alone
   program.
   > [!Note]
   > The shim isn't designed to run multiple plugins at the same time,
   > so include only one plugin per repo.
3. Edit the `main.go` file to import your plugin.
   For example, `_ "github.com/me/my-plugin-telegraf/plugins/inputs/cpu"`.
4. Add a
   [plugin.conf](https://github.com/influxdata/telegraf/blob/master/plugins/common/shim/example/cmd/plugin.conf)
   file for configuration specific to your plugin.
   > [!Note]
   > This config file must be separate from the rest of the config for
   > Telegraf, and must not be in a shared directory with other Telegraf
   > configs.
   > If Telegraf reads this config file, it won't know which plugin it
   > relates to.

## Test and run your plugin

1. Build the `cmd/main.go` using the following command with your plugin
   name:

   <!--pytest.mark.skip-->

   ```bash
   go build -o plugin-name cmd/main.go
   ```

2. Test the binary by running it, for example
   `./plugin-name -config plugin.conf`.
   If you're building a processor or output, first feed valid metrics in on
   `STDIN`.
   Skip this step if you're building an input.
   Metrics are written to `STDOUT`.
   You might need to press enter or wait for your poll duration to elapse
   to see data.
3. Press `Ctrl-C` to end your test.
4. Configure Telegraf to call your new plugin binary.
   For an input, this looks like:

   ```toml
   [[inputs.execd]]
     command = ["/path/to/plugin-name", "-config", "/path/to/plugin.conf"]
     signal = "none"
   ```

For more configuration options, see the
[execd input plugin documentation](/telegraf/v1/input-plugins/execd/).

## Publish your plugin

Publish your plugin to GitHub and open a pull request back to the Telegraf
repo to add it to the
[external plugins list](https://github.com/influxdata/telegraf/blob/master/EXTERNAL_PLUGINS.md).
