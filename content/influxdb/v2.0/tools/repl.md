---
title: Interactive Flux REPL
seotitle: Interactive Flux REPL
description: Use the Flux REPL (Read–Eval–Print Loop) to execute Flux scripts and interact with InfluxDB and other data sources.
influxdb/v2.0/tags: [flux]
menu:
  influxdb_2_0:
    name: Flux REPL
    parent: Tools
weight: 104
---

Use the Flux REPL (Read–Eval–Print Loop) to execute Flux scripts and interact with InfluxDB and other data sources.
[Build the REPL](#build-the-repl) from the Flux source code.

## Build the REPL

See the [Flux repository README](https://github.com/influxdata/flux#requirements) for instructions on building the REPL.

## Use the REPL

To open a new REPL session, run:

```sh
./flux repl
```

To query data from InfluxDB, provide the organization, token, and host parameters to the [`from()` function](/v2.0/reference/flux/stdlib/built-in/inputs/from/).

Exit the REPL by pressing **Control + D**.
