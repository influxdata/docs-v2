---
title: kapacitord downgrade
description: >
  The `kapacitord downgrade` reverts a topic store format upgrade.
menu:
  kapacitor_v1:
    name: kapacitord downgrade
    parent: kapacitord
weight: 301
metadata: [Kapacitor v1.7.0+]
---

The `kapacitord downgrade` reverts a topic store format upgrade.

Some versions of Kapacitor change the format of the topic store (for example: 1.6 to 1.7).
If you find that you need to use a previous version of Kapacitor with a different
topic store format, use this command to migrate the topic store back to the
previous format.

## Usage

```sh
kapacitord downgrade
```
