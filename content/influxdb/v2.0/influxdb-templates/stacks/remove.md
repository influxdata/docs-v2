---
title: Remove an InfluxDB stack
list_title: Remove a stack
description: >
  Use the [`influx stacks remove` command](/influxdb/v2.0/reference/cli/influx/stacks/remove/)
  to remove an InfluxDB stack and all its associated resources.
menu:
  influxdb_2_0:
    parent: InfluxDB stacks
    name: Remove a stack
weight: 205
related:
  - /influxdb/v2.0/reference/cli/influx/stacks/remove/
list_code_example: |
  ```sh
  influx stacks remove \
    -o example-org \
    --stack-id=12ab34cd56ef
  ```
---

Use the [`influx stacks remove` command](/influxdb/v2.0/reference/cli/influx/stacks/remove/)
to remove an InfluxDB stack and all its associated resources.

**Provide the following:**

- Organization name or ID
- Stack ID

<!-- -->
```sh
# Syntax
influx stacks remove -o <org-name> --stack-id=<stack-id>

# Example
influx stacks remove \
  -o example-org \
  --stack-id=12ab34cd56ef
```
