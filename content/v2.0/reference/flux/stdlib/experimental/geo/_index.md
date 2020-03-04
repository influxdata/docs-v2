---
title: Flux Geo package
list_title: Geo package
description: >
  The Flux Geo package provides tools for working with geo-temporal data and performing
  geographic location filtering and grouping.
  Import the `experimental/geo` package.
menu:
  v2_0_ref:
    name: Geo
    parent: Experimental
weight: 201
v2.0/tags: [functions, package]
---

The Flux Geo package provides tools for working with geo-temporal data and performing
geographic location filtering and grouping.
Import the `experimental/geo` package:

```js
import "experimental/geo"
```

## Geo package functions
{{< children type="functions" show="pages" >}}

## Geo schema requirements
The Geo package uses the Go implementation of the [S2 Geometry Library](https://s2geometry.io/).
Functions in the Geo package require the following:

- a **`s2_cell_id` tag** containing an **S2 cell ID as a token** (more information [below](#s2-cell-ids))
- a **`lat` field** containing the **latitude in decimal degrees** (WGS 84)
- a **`lon` field** containing the **longitude in decimal degrees** (WGS 84)

#### Schema recommendations
- a tag that identifies the data source
- a tag that identifies the point type (for example: `start`, `stop`, `via`)
- a field that identifies the track or route

##### Examples of geo-temporal line protocol
```
taxi,pt=start,s2_cell_id=89c2594 tip=3.75,dist=14.3,lat=40.744614,lon=-73.979424,tid=1572566401123234345i 1572566401947779410
bike,id=biker-007,pt=via,s2_cell_id=89c25dc lat=40.753944,lon=-73.992035,tid=1572588100i 1572567115
```

### S2 Cell IDs
Use **latitude** and **longitude** with the `s2.CellID.ToToken` endpoint of the S2
Geometry Library to generate `s2_cell_id` tags.
Specify your [S2 Cell ID level](https://s2geometry.io/resources/s2cell_statistics.html).

{{% note %}}
For faster filtering, use higher S2 Cell ID levels.
But know that that higher levels increase
[series cardinality](/v2.0/reference/glossary/#series-cardinality).
{{% /note %}}

Language-specific implementations of the S2 Geometry Library provide methods for
generating S2 Cell ID tokens.
