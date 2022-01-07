---
title: View InfluxDB stacks
list_title: View stacks
description: >
  Use the [`influx stacks` command](/influxdb/v2.1/reference/cli/influx/stacks/)
  to view installed InfluxDB stacks and their associated resources.
menu:
  influxdb_2_1:
    parent: InfluxDB stacks
    name: View stacks
weight: 204
related:
  - /influxdb/v2.1/reference/cli/influx/stacks/
list_code_example: |
  ```sh
  influx stacks -o example-org
  ```
---

Use the [`influx stacks` command](/influxdb/v2.1/reference/cli/influx/stacks/)
to view installed InfluxDB stacks and their associated resources.

**Provide the following:**

- Organization name or ID

<!-- -->
```sh
# Syntax
influx stacks -o <org-name>

# Example
influx stacks -o example-org
```

### Filter stacks

To output information about specific stacks, use the `--stack-name` or `--stack-id`
flags to filter output by stack names or stack IDs.

##### Filter by stack name

```sh
# Syntax
influx stacks \
  -o <org-name> \
  --stack-name=<stack-name>

# Example
influx stacks \
  -o example-org \
  --stack-name=stack1 \
  --stack-name=stack2
```

### Filter by stack ID

```sh
# Syntax
influx stacks \
  -o <org-name> \
  --stack-id=<stack-id>

# Example
influx stacks \
  -o example-org \
  --stack-id=12ab34cd56ef \
  --stack-id=78gh910i11jk
```
