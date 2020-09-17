---
title: Remove an InfluxDB stack
list_title: Remove a stack
description: >
  Use the [`influx stacks remove` command](/influxdb/cloud/reference/cli/influx/stacks/remove/)
  to remove an InfluxDB stack and all its associated resources.
menu:
  influxdb_cloud:
    parent: InfluxDB stacks
    name: Remove a stack
weight: 204
related:
  - /influxdb/cloud/reference/cli/influx/stacks/remove/
list_code_example: |
  ```sh
  influx stacks remove \
    -o example-org \
    --stack-id=12ab34cd56ef
  ```
---

Use the [`influx stacks remove` command](/influxdb/cloud/reference/cli/influx/stacks/remove/)
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
