---
title: Blocks
description: A block is a possibly empty sequence of statements within matching braces ({}).
menu:
  influxdb_cloud_ref:
    parent: Flux specification
    name: Blocks
weight: 203
---

A _block_ is a possibly empty sequence of statements within matching braces (`{}`).

```
Block         = "{" StatementList "} .
StatementList = { Statement } .
```

In addition to _explicit blocks_ in the source code, there are _implicit blocks_:

1. The _universe block_ encompasses all Flux source text.
2. Each package has a _package block_ containing all Flux source text for that package.
3. Each file has a _file block_ containing all Flux source text in that file.
4. Each function literal has its own _function block_ even if not explicitly declared.

Blocks nest and influence scoping.
