---
title: kapacitord version
description: >
  The `kapacitord version` outputs the version, build branch, and git commit hash
  for the current Kapacitor server.
menu:
  kapacitor_v1:
    name: kapacitord version
    parent: kapacitord
weight: 301
---

The `kapacitord version` outputs the version, build branch, and git commit hash
for the current Kapacitor server.

## Usage

```sh
kapacitord version
```

## Examples

```sh
> kapacitord version
Kapacitor OSS version v{{< latest-patch >}} (git: HEAD 00x0x0X0Xx0x0xXX0xxxXxx00000xX0000x0xXx0)
```
