---
title: Influx Templates
description: >
  Influx Templates are prepackaged InfluxDB configurations that contain
  everything from dashboards and Telegraf configurations to notifications and
  alerts in a single file.
menu: v2_0
weight: 10
v2.0/tags: [influx templates]
---

Influx Templates are prepackaged InfluxDB configurations that contain everything
from dashboards and Telegraf configurations to notifications and alerts in a single file.
Use Influx Templates to quickly set up a fresh instance of InfluxDB, backup your
dashboard configuration, or share your configuration with the InfluxData community.

## Template manifests
A template is defined in a single file known as a **manifest**.
Template manifests support the following formats:

- YAML
- JSON
- Jsonnet

{{% note %}}
Template manifests are compatible with
[Kubernetes Custom Resource Definitions (CRD)](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/).
{{% /note %}}

_See [Create an Influx Template](/v2.0/influx-templates/create/) for information about
generating template manifests._

### Template resources
Template **resources** are elements of the InfluxDB user interface (UI) and data
storage that can be templated.
The following template resources are available:

- buckets
- checks
- dashboards
- dashboard variables
- labels
- notification endpoints
- notification rules
- tasks
- Telegraf configurations

---

{{< children >}}
