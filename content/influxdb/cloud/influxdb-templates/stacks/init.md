---
title: Initialize an InfluxDB stack
list_title: Initialize a stack
description: >
  InfluxDB automatically creates a new stack each time you [apply an InfluxDB template](/influxdb/cloud/influxdb-templates/use/)
  **without providing a stack ID**.
  To manually create or initialize a new stack, use the [`influx stacks init` command](/influxdb/cloud/reference/cli/influx/stacks/init/).
menu:
  influxdb_cloud:
    parent: InfluxDB stacks
    name: Initialize a stack
weight: 201
related:
  - /influxdb/cloud/reference/cli/influx/stacks/init/
list_code_example: |
  ```sh
  influx apply \
    -o example-org \
    -f path/to/template.yml
  ```
  ```sh
  influx stacks init \
    -o example-org \
    -n "Example Stack" \
    -d "InfluxDB stack for monitoring some awesome stuff" \
    -u https://example.com/template-1.yml \
    -u https://example.com/template-2.yml
  ```
---

InfluxDB automatically creates a new stack each time you [apply an InfluxDB template](/influxdb/cloud/influxdb-templates/use/)
**without providing a stack ID**.
To manually create or initialize a new stack, use the [`influx stacks init` command](/influxdb/cloud/reference/cli/influx/stacks/init/).

## Initialize a stack when applying a template
To automatically create a new stack when [applying an InfluxDB template](/influxdb/cloud/influxdb-templates/use/)
**don't provide a stack ID**.
InfluxDB applies the resources in the template to a new stack and provides the **stack ID** the output.

```sh
influx apply \
  -o example-org \
  -f path/to/template.yml
```

## Manually initialize a new stack
Use the [`influx stacks init` command](/influxdb/cloud/reference/cli/influx/stacks/init/)
to create or initialize a new InfluxDB stack.

**Provide the following:**

- Organization name or ID
- Stack name
- Stack description
- InfluxDB template URLs

<!-- -->
```sh
# Syntax
influx stacks init \
  -o <org-name> \
  -n <stack-name> \
  -d <stack-description \
  -u <package-url>

# Example
influx stacks init \
  -o example-org \
  -n "Example Stack" \
  -d "InfluxDB stack for monitoring some awesome stuff" \
  -u https://example.com/template-1.yml \
  -u https://example.com/template-2.yml
```
