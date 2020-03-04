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

The Geo package use the Go implementation of the [S2 Geometry Library](https://s2geometry.io/).
Functions in the Geo package expect data with the following:

- `s2_cell_id` tag containing an S2 cell ID (as a token) at a
  [level](https://s2geometry.io/resources/s2cell_statistics.html) determined by the user
- `lat`, `lon` fields containing WGS84 coordinates in decimal degrees


The `s2_cell_id` tag contains cell ID token (`s2.CellID.ToToken()`) of corresponding level.
The cell levels are shown at [https://s2geometry.io/resources/s2cell_statistics.html].
The level must be decided by the user.
The rule of thumb is that it should be as high as possible for faster filtering
but not too high in order to avoid risk of having high cardinality.
The token can be easily calculated from lat and lon using Google S2 library which is available for many languages.

The schema may further contain a tag which identifies data source (`id` by default),
and a field representing track identification (`tid` by default).
For some use cases a tag denoting point type (eg. with values like `start`/`stop`/`via`) may also be useful.

Examples of line protocol input (`s2_cell_id` with cell ID level 11 token):

```
taxi,pt=start,s2_cell_id=89c2594 tip=3.75,dist=14.3,lat=40.744614,lon=-73.979424,tid=1572566401123234345i 1572566401947779410
```

```
bike,id=biker-007,pt=via,s2_cell_id=89c25dc lat=40.753944,lon=-73.992035,tid=1572588100i 1572567115
```

{{< children type="functions" show="pages" >}}
