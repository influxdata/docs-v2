---
title: kapacitor version
description: >
  The `kapacitor version` command outputs the version, build branch, and git
  commit hash for the current `kapacitor` CLI.
menu:
  kapacitor_v1:
    name: kapacitor version
    parent: kapacitor
weight: 301
---

The `kapacitor version` command outputs the version, build branch, and git
commit hash for the current `kapacitor` CLI.

## Usage

```sh
kapacitor version
```

## Examples

```sh
kapacitor version
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}
```sh
Kapacitor OSS v{{< latest-patch >}} (git: HEAD 00x0x0X0Xx0x0xXX0xxxXxx00000xX0000x0xXx0)
```
{{% /expand %}}
{{< /expand-wrapper >}}
