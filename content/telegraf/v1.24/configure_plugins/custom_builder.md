---
title: Reduce Telegraf binary size with customized agent
description: Use the custom builder tool to reduce Telegraf binary disk space. 
menu:
  telegraf_1_24:

    name: Reduce binary size
    Parent: Configure plugins
    weight: 20
---
Reduce Telegraf's overall memory and disk footprint with the custom builder. This tool allows you to select which plugins to use in the Telegraf binary based on your configuration file. 

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
    ```
    make build_tools
    ```
4. Point the custom builder at your Telegraf configuration file or files that include the plugins you want to build, like in the following examples, to generate your customized binary:
    - **Single Telegraf configuration**: 
        ```
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