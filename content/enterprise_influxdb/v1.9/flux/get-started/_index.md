---
title: Get started with Flux
description: >
  Get started with Flux, InfluxData's new functional data scripting language.
  This step-by-step guide will walk you through the basics and get you on your way.
menu:
  enterprise_influxdb_1_9:
    name: Get started with Flux
    identifier: get-started
    parent: Flux
    weight: 2
aliases:
  - /enterprise_influxdb/v1.9/flux/getting-started/
  - /enterprise_influxdb/v1.9/flux/introduction/getting-started/
canonical: /{{< latest "influxdb" "v2" >}}/query-data/get-started/
v2: /influxdb/v2.0/query-data/get-started/
---

Flux is InfluxData's new functional data scripting language designed for querying,
analyzing, and acting on data.

This multi-part getting started guide walks through important concepts related to Flux.
It covers querying time series data from InfluxDB using Flux, and introduces Flux syntax and functions.

## What you will need

##### InfluxDB v1.8+
Flux v0.65 is built into InfluxDB v1.8 and can be used to query data stored in InfluxDB.

---

_For information about downloading and installing InfluxDB, see [InfluxDB installation](/enterprise_influxdb/v1.9/introduction/installation)._

---

##### Chronograf v1.8+
**Not required but strongly recommended**.
Chronograf v1.8's Data Explorer provides a user interface (UI) for writing Flux scripts and visualizing results.
Dashboards in Chronograf v1.8+ also support Flux queries.

---

_For information about downloading and installing Chronograf, see [Chronograf installation](/{{< latest "chronograf" >}}/introduction/installation)._

---

## Key concepts
Flux introduces important new concepts you should understand as you get started.

### Buckets
Flux introduces "buckets," a new data storage concept for InfluxDB.
A **bucket** is a named location where data is stored that has a retention policy.
It's similar to an InfluxDB v1.x "database," but is a combination of both a database and a retention policy.
When using multiple retention policies, each retention policy is treated as is its own bucket.

Flux's [`from()` function](/{{< latest "flux" >}}/stdlib/universe/from), which defines an InfluxDB data source, requires a `bucket` parameter.
When using Flux with InfluxDB v1.x, use the following bucket naming convention which combines
the database name and retention policy into a single bucket name:

###### InfluxDB v1.x bucket naming convention
```js
// Pattern
from(bucket:"<database>/<retention-policy>")

// Example
from(bucket:"telegraf/autogen")
```

### Pipe-forward operator
Flux uses pipe-forward operators (`|>`) extensively to chain operations together.
After each function or operation, Flux returns a table or collection of tables containing data.
The pipe-forward operator pipes those tables into the next function or operation where
they are further processed or manipulated.

### Tables
Flux structures all data in tables.
When data is streamed from data sources, Flux formats it as annotated comma-separated values (CSV), representing tables.
Functions then manipulate or process them and output new tables.
This makes it easy to chain together functions to build sophisticated queries.

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

You have multiple [options for writing and running Flux queries](/enterprise_influxdb/v1.9/flux/guides/execute-queries/),
but as you're getting started, we recommend using the following:

### Chronograf's Data Explorer
Chronograf's Data Explorer makes it easy to write your first Flux script and visualize the results.
To use Chronograf's Flux UI, open the **Data Explorer** and to the right of the source
dropdown above the graph placeholder, select **Flux** as the source type.

This will provide **Schema**, **Script**, and **Functions** panes.
The Schema pane allows you to explore your data.
The Script pane is where you write your Flux script.
The Functions pane provides a list of functions available in your Flux queries.

<div class="page-nav-btns">
  <a class="btn next" href="/enterprise_influxdb/v1.9/flux/get-started/query-influxdb/">Query InfluxDB with Flux</a>
</div>
