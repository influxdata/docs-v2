---
title: socket.from() function
description: >
  `socket.from()` returns data from a socket connection and outputs a stream of tables
  given a specified decoder.
menu:
  flux_v0_ref:
    name: socket.from
    parent: socket
    identifier: socket/from
weight: 101
flux/v0.x/tags: [inputs]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/socket/socket.flux#L47-L47

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`socket.from()` returns data from a socket connection and outputs a stream of tables
given a specified decoder.

The function produces a single table for everything that it receives from the
start to the end of the connection.

##### Function type signature

```js
(url: string, ?decoder: string) => stream[A]
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### url
({{< req >}})
URL to return data from.

**Supported URL schemes**:
- tcp
- unix

### decoder

Decoder to use to parse returned data into a stream of tables.

**Supported decoders**:
- csv
- line


## Examples

- [Query annotated CSV from a socket connection](#query-annotated-csv-from-a-socket-connection)
- [Query line protocol from a socket connection](#query-line-protocol-from-a-socket-connection)

### Query annotated CSV from a socket connection

```js
import "socket"

socket.from(url: "tcp://127.0.0.1:1234", decoder: "csv")

```


### Query line protocol from a socket connection

```js
import "socket"

socket.from(url: "tcp://127.0.0.1:1234", decoder: "line")

```

