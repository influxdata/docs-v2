---
title: View InfluxDB Stacks
list_title: View stacks
description: >
  Use the [`influx pkg stack list` command](/v2.0/reference/cli/influx/pkg/stack/list/)
  to view installed InfluxDB Stacks and their associated resources.
menu:
  v2_0:
    parent: InfluxDB Stacks
    name: View stacks
weight: 202
related:
  - /v2.0/reference/cli/influx/pkg/stack/list/
list_code_example: |
  ```sh
  influx pkg stack list -o example-org
  ```
---

Use the [`influx pkg stack list` command](/v2.0/reference/cli/influx/pkg/stack/list/)
to view installed InfluxDB Stacks and their associated resources.

**Provide the following:**

- Organization name or ID

<!-- -->
```sh
# Syntax
influx pkg stack list -o <org-name>

# Example
influx pkg stack list -o example-org
```

### Filter stacks
To output information about specific stacks, use the `--stack-name` or `--stack-id`
flags to filter output by stack names or stack IDs.

##### Filter by stack name
```sh
# Syntax
influx pkg stack list \
  -o <org-name> \
  --stack-name=<stack-name>

# Example
influx pkg stack list \
  -o example-org \
  --stack-name=stack1 \
  --stack-name=stack2
```

### Filter by stack ID
```sh
# Syntax
influx pkg stack list \
  -o <org-name> \
  --stack-id=<stack-id>

# Example
influx pkg stack list \
  -o example-org \
  --stack-id=12ab34cd56ef \
  --stack-id=78gh910i11jk
```
