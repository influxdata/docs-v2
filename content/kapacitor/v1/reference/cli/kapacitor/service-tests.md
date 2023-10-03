---
title: kapacitor service-tests
description: >
  The `kapacitor service-tests` command executes one or more of the available
  service tests.
menu:
  kapacitor_v1:
    name: kapacitor service-tests
    parent: kapacitor
weight: 301
---

The `kapacitor service-tests` command executes one or more of the available
service tests.

{{% note %}}
_Use the [`kapacitor list service-tests` command](/kapacitor/v1/reference/cli/kapacitor/list/)
to list all available service tests._
{{% /note %}}

## Usage

```sh
kapacitor service-tests [<service> ...]
```

## Arguments

- **service**: Kapacitor service (handler) to execute service tests for

## Examples

```sh
kapacitor service-tests slack talk smtp
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}
```text
Service             Success   Message
slack               true
talk                false     service is not enabled
smtp                false     service is not enabled
```
{{% /expand %}}
{{< /expand-wrapper >}}
