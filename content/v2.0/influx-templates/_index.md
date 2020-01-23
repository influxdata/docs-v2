---
title: Influx templates
description: >
  Influx templates are prepackaged InfluxDB configurations that contain everything
  from dashboards and Telegraf configurations to notifications and alerts.
menu: v2_0
weight: 10
v2.0/tags: [influx templates]
---

Influx templates are prepackaged InfluxDB configurations that contain everything
from dashboards and Telegraf configurations to notifications and alerts.
Use Influx templates to quickly set up a fresh instance of InfluxDB, back up your
dashboard configuration, or share your configuration with the InfluxData community.

## Template manifests
A template manifest is a file that defines the contents of a template and supports
the following formats:

- YAML
- JSON
- Jsonnet

_See [Create an Influx Template](/v2.0/influx-templates/create/) for information about
generating manifest files._

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

---

{{< children >}}
