---
title: Update an InfluxDB stack
list_title: Update a stack
description: >
  Use the [`influx apply` command](/influxdb/cloud/reference/cli/influx/apply/)
  to update a stack with a modified template.
  When applying a template to an existing stack, InfluxDB checks to see if the
  resources in the template match existing resources.
  InfluxDB updates, adds, and removes resources to resolve differences between
  the current state of the stack and the newly applied template.
menu:
  influxdb_cloud:
    parent: InfluxDB stacks
    name: Update a stack
weight: 202
related:
  - /influxdb/cloud/reference/cli/influx/apply
  - /influxdb/cloud/reference/cli/influx/stacks/update/
list_code_example: |
  ```sh
  influx apply \
    -o example-org \
    -u http://example.com/template-1.yml \
    -u http://example.com/template-2.yml \
    --stack-id=12ab34cd56ef
  ```
---

Use the [`influx apply` command](/influxdb/cloud/reference/cli/influx/apply/)
to update a stack with a modified template.
When applying a template to an existing stack, InfluxDB checks to see if the
resources in the template match existing resources.
InfluxDB updates, adds, and removes resources to resolve differences between
the current state of the stack and the newly applied template.

Each stack is uniquely identified by a **stack ID**.
For information about retrieving your stack ID, see [View stacks](/influxdb/cloud/influxdb-templates/stacks/view/).

**Provide the following:**

- Organization name or ID
- Stack ID
- InfluxDB template URLs to apply

<!-- -->
```sh
influx apply \
  -o example-org \
  -u http://example.com/template-1.yml \
  -u http://example.com/template-2.yml \
  --stack-id=12ab34cd56ef
```

Template resources are uniquely identified by their `metadata.name` field.
If errors occur when applying changes to a stack, all applied changes are
reversed and the stack is returned to its previous state.
