---
title: Get started with Flux
description: >
  Get started with Flux, InfluxData's functional data scripting language.
  This step-by-step guide through the basics of writing a Flux query.
menu:
  v2_0:
    name: Get started
    identifier: get-started
    parent: Flux
    weight: 2
---

Flux is InfluxData's new functional data scripting language designed for querying,
analyzing, and acting on data.

This multi-part getting started guide walks through important concepts related to Flux,
how to query time series data from InfluxDB using Flux, and introduces Flux syntax and functions.

## Key concepts
Flux introduces important new concepts you should understand as you get started.

### Pipe-forward operator
Flux uses pipe-forward operators (`|>`) extensively to chain operations together.
After each function or operation, Flux returns a table or collection of tables containing data.
The pipe-forward operator pipes those tables into the next function or operation where
they are further processed or manipulated.

### Tables
Flux structures all data in tables.
When data is streamed from data sources, Flux formats it as annotated
comma-separated values (CSV), representing tables.
Functions then manipulate or process them and output new tables.

#### Group keys
Every table has a **group key** which describes the contents of the table.
It's a list of columns for which every row in the table will have the same value.
Columns with unique values in each row are **not** part of the group key.

As functions process and transform data, each modifies the group keys of output tables.
Understanding how tables and group keys are modified by functions is key to properly
shaping your data for the desired output.

###### Example group key
```js
[_start, _stop, _field, _measurement, host]
```

Note that `_time` and `_value` are excluded from the example group key because they
are unique to each row.

## Tools for working with Flux

You have multiple [options for writing and running Flux queries](/flux/v0.12/guides/executing-queries),
but as you're getting started, we recommend using the following:

### 1. Data Explorer
The InfluxDB user interface's (UI) Data Explorer makes it easy to build or write
your first Flux script and visualize the results.

![Flux in the Data Explorer](/img/flux-data-explorer,png)

The Data Explorer provides multiple ways to create Flux queries.
Toggle between the two with the button to the left of **Submit** in the Data Explorer.

![Flux Query Builder and Script Editor Toggle](/img/flux-ui-toggle.png)

#### Query Builder _(default)_
The Query Builder is a visual tool for building Flux Queries.
Select the organization and bucket from which you would like to query data.
Filter data by any columns available in the data.
Transform you data using using aggregate functions.

#### Script Editor
The Script Editor is an in-browser code editor where you can write raw Flux scripts.

### 2. influx CLI
The [`influx repl` command](/v2.0/reference/cli/influx/repl) opens an interactive
read-eval-print-loop (REPL) for querying data within an organization in InfluxDB with Flux.

```bash
influx repl --org org-name
```

<div class="page-nav-btns">
  <a class="btn next" href="/v2.0/query-data/flux/get-started/query-influxdb/">Query InfluxDB with Flux</a>
</div>
