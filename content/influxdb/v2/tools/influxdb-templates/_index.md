---
title: InfluxDB templates
description: >
  InfluxDB templates are prepackaged InfluxDB configurations that contain everything
  from dashboards and Telegraf configurations to notifications and alerts.
menu:
  influxdb_v2:
    parent: Tools & integrations
weight: 103
aliases:
  - /influxdb/v2/influxdb-templates/
influxdb/v2/tags: [templates]
---

InfluxDB templates are prepackaged InfluxDB configurations that contain everything
from dashboards and Telegraf configurations to notifications and alerts.
Use templates to monitor your technology stack,
set up a fresh instance of InfluxDB, back up your dashboard configuration, or
[share your configuration](https://github.com/influxdata/community-templates/) with the InfluxData community.

**InfluxDB templates do the following:**

- Reduce setup time by giving you resources that are already configured for your use-case.
- Facilitate secure, portable, and source-controlled InfluxDB resource states.
- Simplify sharing and using pre-built InfluxDB solutions.

{{< youtube 2JjW4Rym9XE >}}

<a class="btn github" href="https://github.com/influxdata/community-templates/" target="_blank">View InfluxDB community templates</a>

## Template manifests

A template **manifest** is a file that defines
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
The `spec` object contains the resource configuration.

#### Example

```yaml
# bucket-template.yml
# Template manifest that defines two buckets.
apiVersion: influxdata.com/v2alpha1
kind: Bucket
metadata:
    name: thirsty-shaw-91b005
spec:
    description: My IoT Center Bucket
    name: iot-center
    retentionRules:
      - everySeconds: 86400
        type: expire
---
apiVersion: influxdata.com/v2alpha1
kind: Bucket
metadata:
    name: upbeat-fermat-91b001
spec:
    name: air_sensor
---
```

_See [Create an InfluxDB template](/influxdb/v2/tools/influxdb-templates/create/) for information about
generating template manifests._

### Template resources

Templates may contain the following InfluxDB resources:

- [buckets](/influxdb/v2/organizations/buckets/create-bucket/)
- [checks](/influxdb/v2/monitor-alert/checks/create/)
- [dashboards](/influxdb/v2/visualize-data/dashboards/create-dashboard/)
- [dashboard variables](/influxdb/v2/visualize-data/variables/create-variable/)
- [labels](/influxdb/v2/visualize-data/labels/)
- [notification endpoints](/influxdb/v2/monitor-alert/notification-endpoints/create/)
- [notification rules](/influxdb/v2/monitor-alert/notification-rules/create/)
- [tasks](/influxdb/v2/process-data/manage-tasks/create-task/)
- [Telegraf configurations](/influxdb/v2/write-data/no-code/use-telegraf/)

## Stacks

Use **InfluxDB stacks** to manage InfluxDB templates.
When you apply a template, InfluxDB associates resources in the template with a stack.
Use stacks to add, update, or remove InfluxDB templates over time.

For more information, see [InfluxDB stacks](#influxdb-stacks) below.

---

{{< children >}}
