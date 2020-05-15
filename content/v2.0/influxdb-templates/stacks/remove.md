---
title: Remove an InfluxDB Stack
list_title: Remove a stack
description: >
  Use the [`influx pkg stack remove` command](/v2.0/reference/cli/influx/pkg/stack/remove/)
  to remove an InfluxDB Stack and all its associated resources.
menu:
  v2_0:
    parent: InfluxDB Stacks
    name: Remove a stack
weight: 203
related:
  - /v2.0/reference/cli/influx/pkg/stack/remove/
list_code_example: |
  ```sh
  influx pkg stack remove \
    -o example-org \
    --stack-id=12ab34cd56ef \
    --stack-id=78gh910i11jk
  ```
---

Use the [`influx pkg stack remove` command](/v2.0/reference/cli/influx/pkg/stack/remove/)
to remove an InfluxDB Stack and all its associated resources.

**Provide the following:**

- Organization name or ID
- Stack ID

<!-- -->
```sh
# Syntax
influx pkg stack remove -o <org-name> --stack-id=<stack-id>

# Example
influx pkg stack remove \
  -o example-org \
  --stack-id=12ab34cd56ef \
  --stack-id=78gh910i11jk
```
