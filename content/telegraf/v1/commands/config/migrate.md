---
title: telegraf config migrate
description: >
  The `telegraf config migrate` migrates deprecated plugins in a Telegraf configuration file to supported plugins.
menu:
  telegraf_v1_ref:
    parent: telegraf config
weight: 301
---

The `telegraf config migrate` command reads the configuration files specified 
in the `--config` or `--config-directory` and attempts to migrate plugins or
options that are currently deprecated to the recommended replacements.
If no configuration file is explicitly specified, the command reads the
[default locations](/telegraf/v1/configuration/#configuration-file-locations)
and uses those configuration files.

Migrated files are stored with a `.migrated` suffix at the
location of the source configuration files.
If migrating remote configurations, the migrated configuration is stored in the
current directory using the URL as the filename with a `.migrated` suffix.

{{% warn %}}
#### Test migrated configuration files

We strongly recommend testing migrated configuration files before using them in production.
{{% /warn %}}

## Usage

```sh
telegraf [global-flags] config migrate [flags]
```

## Flags

| Flag |           | Description                                      |
| :--- | :-------- | :----------------------------------------------- |
|      | `--force` | Forces overwriting of an existing migration file |
| `-h` | `--help`  | Show command help                                |

{{% caption %}}
_Also see [Telegraf global flags](/telegraf/v1/commands/#telegraf-global-flags)._
{{% /caption %}}

## Examples

- [Migrate a single configuration file](#migrate-a-single-configuration-file)
- [Migrate a configuration directory](#migrate-a-configuration-directory)

### Migrate a single configuration file

To migrate the file `mysettings.conf`, run the following command:

```sh
telegraf --config mysettings.conf config migrate
```

### Migrate a configuration directory

To migrate all configurations files in the `~/telegraf/conf/` directory, use
the following command:

```sh
telegraf --config-directory ~/telegraf/conf/ config migrate
```