---
title: Custom-compile Telegraf
description: Use the Telegraf custom builder tool to compile Telegraf with only the plugins you need and reduce the Telegraf binary size. 
menu:
  telegraf_1_24:
    name: Custom-compile Telegraf
    Parent: Install
weight: 20
---
Use the Telegraf custom builder tool to compile Telegraf with only the plugins you need and reduce the Telegraf binary size.

## Requirements

- Ensure you've installed the current version of [Go](https://go.dev/). 
- Create your Telegraf configuration file with the plugins you want to use. For details, see [Configuration options](/telegraf/v1.24/configuration/).

## Build and run the custom builder

1. Clone the Telegraf repository:
    ```
    git clone https://github.com/influxdata/telegraf.git
    ```
2. Change directories into the top-level of the Telegraf repository:
    ```
    cd telegraf
    ```
3. Build the Telegraf custom builder tool by entering the folllowing command:
    ```sh
    make build_tools
    ```
4. Run the `custom_builder` utility with at least one `--config` or `--config-directory` flag to specify Telegraf configuration files to build from. `--config` accepts local file paths and URLs. `--config-dir` accepts local directory paths. You can include multiple `--config` and `--config-dir` flags. The custom builder builds a `telegraf` binary with only the plugins included in the specified configuration files or directories:
    - **Single Telegraf configuration**: 
        ```sh
        ./tools/custom_builder/custom_builder --config /etc/telegraf.conf
        ```
    - **Single Telegraf confiuaration and Telegraf configuration directory**: 
        ```
        /tools/custom_builder/custom_builder --config
        /etc/telegraf.conf --config-dir /etc/telegraf/telegraf.d
        ```
    - **Remote Telegraf configuration**:
        ```
        ./tools/custom_builder/custom_builder --config http://url-to-remote-telegraf/telegraf.conf
        ```

5. View your customized Telegraf binary within the top level of your Telegraf repository.

## Update your custom binary

To add or remove plugins from your customized Telegraf build, edit your configuration file and rerun the command from step 4 above. 