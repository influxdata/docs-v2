---
title: Initialize an InfluxDB Stack
list_title: Initialize a stack
description: >
  Use the [`influx pkg stack init` command](/v2.0/reference/cli/influx/pkg/stack/init/)
  to create or initialize a new InfluxDB Stack.
menu:
  v2_0:
    parent: InfluxDB Stacks
    name: Initialize a stack
weight: 201
related:
  - /v2.0/reference/cli/influx/pkg/stack/init/
list_code_example: |
  ```sh
  influx pkg stack init ...
  ```
---

Use the [`influx pkg stack init` command](/v2.0/reference/cli/influx/pkg/stack/init/)
to create or initialize a new InfluxDB Stack.

**Provide the following:**

- Organization name or ID
- Stack name
- Stack description
- InfluxDB template URLs (package URLs)

<!-- -->
```sh
# Syntax
influx pkg stack init \
  -o <org-name> \
  -n <stack-name> \
  -d <stack-description \
  -u <list-of-package-urls>

# Example
influx pkg stack init \
  -o example-org \
  -n example-stack \
  -d "InfluxDB stack for monitoring some awesome stuff" \
  -u https://example.com/template-1.yml,https://example.com/template-2.yml
```
