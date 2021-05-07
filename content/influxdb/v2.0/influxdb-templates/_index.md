---
title: InfluxDB templates
description: >
  InfluxDB templates are preconfigured InfluxDB resources and can contain everything
  from dashboards and Telegraf configurations to notifications and alerts.
menu: influxdb_2_0
weight: 9
influxdb/v2.0/tags: [templates]
---

InfluxDB templates are preconfigured InfluxDB resources and can contain everything
from dashboards and Telegraf configurations to notifications and alerts.
Use InfluxDB templates to quickly get set up monitoring a specific technology,
set up a fresh instance of InfluxDB, back up your dashboard configuration, or
share your configuration with the InfluxData community.

**InfluxDB templates do the following:**

- Reduce setup time by giving you resources that are already configured for your use-case.
- Facilitate secure, portable, and source-controlled InfluxDB resource states.
- Simplify sharing and using pre-built InfluxDB solutions.

{{< youtube 2JjW4Rym9XE >}}

## Template manifests

A template consists of one or more files known as **manifests** that define the
InfluxDB [resources](#template-resources).
Template manifests support the following formats:

- [YAML](https://yaml.org/)
- [JSON](https://www.json.org/)
- [Jsonnet](https://jsonnet.org/)

{{% note %}}
Template manifests are compatible with
[Kubernetes Custom Resource Definitions (CRD)](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/).
{{% /note %}}

The `metadata.name` field in manifests uniquely identifies each resource in the template.
`metadata.name` values must be [DNS-1123](https://tools.ietf.org/html/rfc1123) compliant.
If resources in the template depend on other InfluxDB resources, all dependencies
should be included in the template, otherwise, the resources may not be usable.

_See [Create an InfluxDB template](/influxdb/v2.0/influxdb-templates/create/) for information about
generating template manifests._

### Template resources

Include the following **resources** in a template:

- buckets
- checks
- dashboards
- dashboard variables
- labels
- notification endpoints
- notification rules
- tasks
- Telegraf configurations

## Stacks

Use **InfluxDB stacks** to manage InfluxDB templates.
When you apply a template, InfluxDB associates resources in the template with a stack.
Use stacks to add, update, or remove InfluxDB templates over time.

For more information, see [InfluxDB stacks](#influxdb-stacks) below.

---

{{< children >}}
