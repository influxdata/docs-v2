---
title: Flux InfluxDB v1 package
list_title: v1 package
description: >
  The Flux InfluxDB v1 package provides functions for managing data from an InfluxDB v1.x
  database or structured using the InfluxDB v1 data structure.
  Import the `influxdata/influxdb/v1` package.
aliases:
  - /influxdb/v2.0/reference/flux/functions/influxdb-v1/
  - /influxdb/v2.0/reference/flux/stdlib/influxdb-v1/
  - /influxdb/cloud/reference/flux/stdlib/influxdb-v1/
menu:
  flux_0_x_ref:
    name: v1
    parent: influxdb-pkg
weight: 202
flux/v0.x/tags: [functions, influxdb-v1, package]
---

InfluxDB v1 Flux functions provide tools for managing data from an InfluxDB v1.x
database or structured using the InfluxDB v1 data structure.
Import the `influxdata/influxdb/v1` package:

```js
import "influxdata/influxdb/v1"
```

## Functions
{{< children type="functions" show="pages" >}}

{{% warn %}}
#### Deprecated functions
In **Flux 0.88.0**, the following InfluxDB v1 package functions moved to the
[InfluxDB schema package](/flux/v0.x/stdlib/influxdata/influxdb/schema/).
These functions are still available in the `v1` package for backwards compatibility,
but are deprecated in favor of `schema`.

| Deprecated v1 function        | → | Corresponding schema function                                                                      |
|:-------------------           |:-:|:------------------------                                                                           |
| **v1.fieldKeys()**            | → | [schema.fieldKeys()](/flux/v0.x/stdlib/influxdata/influxdb/schema/fieldkeys/)                       |
| **v1.fieldsAsCols()**         | → | [schema.fieldsAsCols()](/flux/v0.x/stdlib/influxdata/influxdb/schema/fieldsascols/)                 |
| **v1.measurementFieldKeys()** | → | [schema.measurementFieldKeys()](/flux/v0.x/stdlib/influxdata/influxdb/schema/measurementfieldkeys/) |
| **v1.measurements()**         | → | [schema.measurements()](/flux/v0.x/stdlib/influxdata/influxdb/schema/measurements/)                 |
| **v1.measurementTagKeys()**   | → | [schema.measurementTagKeys()](/flux/v0.x/stdlib/influxdata/influxdb/schema/measurementtagkeys/)     |
| **v1.measurementTagValues()** | → | [schema.measurementTagValues()](/flux/v0.x/stdlib/influxdata/influxdb/schema/measurementtagvalues/) |
| **v1.tagKeys()**              | → | [schema.tagKeys()](/flux/v0.x/stdlib/influxdata/influxdb/schema/tagkeys/)                           |
| **v1.tagValues()**            | → | [schema.tagValues()](/flux/v0.x/stdlib/influxdata/influxdb/schema/tagvalues/)                       |
{{% /warn %}}
