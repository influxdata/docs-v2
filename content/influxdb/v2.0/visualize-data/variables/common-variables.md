---
title: Common variable queries
description: Useful queries to use to populate values in common dashboard variable use cases.
menu:
  influxdb_2_0:
    parent: Use and manage variables
    name: Common variable queries
weight: 208
influxdb/v2.0/tags: [variables]
---

## List buckets
List all buckets in the current organization.

_**Flux functions:**
[buckets()](/{{< latest "flux" >}}/stdlib/universe/buckets/),
[rename()](/{{< latest "flux" >}}/stdlib/universe/rename/),
[keep()](/{{< latest "flux" >}}/stdlib/universe/keep/)_

```js
buckets()
  |> rename(columns: {"name": "_value"})
  |> keep(columns: ["_value"])
```

## List measurements
List all measurements in a specified bucket.

_**Flux package:** [InfluxDB schema](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/)  
**Flux functions:** [schema.measurements()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurements/)_

```js
import "influxdata/influxdb/schema"

schema.measurements(bucket: "bucket-name")
```

## List fields in a measurement
List all fields in a specified bucket and measurement.

_**Flux package:** [InfluxDB schema](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/)  
**Flux functions:** [schema.measurementTagValues()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurementtagvalues/)_

```js
import "influxdata/influxdb/schema"

schema.measurementTagValues(
  bucket: "bucket-name",
  measurement: "measurement-name",
  tag: "_field"
)
```

## List unique tag values
List all unique tag values for a specific tag in a specified bucket.
The example below lists all unique values of the `host` tag.

_**Flux package:** [InfluxDB schema](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/)_  
_**Flux functions:** [schema.tagValues()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/tagvalues/)_  

```js
import "influxdata/influxdb/schema"

schema.tagValues(bucket: "bucket-name", tag: "host")
```

## List Docker containers
List all Docker containers when using the Docker Telegraf plugin.

_**Telegraf plugin:** [Docker](/{{< latest "telegraf" >}}/plugins/inputs/#docker)_  
_**Flux package:** [InfluxDB schema](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/)_  
_**Flux functions:** [schema.tagValues()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/tagvalues/)_

```js
import "influxdata/influxdb/schema"

schema.tagValues(bucket: "bucket-name", tag: "container_name")
```

## List Kubernetes pods
List all Kubernetes pods when using the Kubernetes Telegraf plugin.

_**Telegraf plugin:** [Kubernetes](/{{< latest "telegraf" >}}/plugins/inputs/#kubernetes)_  
_**Flux package:** [InfluxDB schema](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/)_  
_**Flux functions:** [schema.measurementTagValues()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurementtagvalues/)_

```js
import "influxdata/influxdb/schema"

schema.measurementTagValues(
  bucket: "bucket-name",
  measurement: "kubernetes_pod_container",
  tag: "pod_name"
)
```

## List Kubernetes nodes
List all Kubernetes nodes when using the Kubernetes Telegraf plugin.

_**Telegraf plugin:** [Kubernetes](/{{< latest "telegraf" >}}/plugins/inputs/#kubernetes)_  
_**Flux package:** [InfluxDB schema](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/)_  
_**Flux functions:** [schema.measurementTagValues()](/{{< latest "flux" >}}/stdlib/influxdata/influxdb/schema/measurementtagvalues/)_

```js
import "influxdata/influxdb/schema"

schema.measurementTagValues(
  bucket: "bucket-name",
  measurement: "kubernetes_node",
  tag: "node_name"
)
```
