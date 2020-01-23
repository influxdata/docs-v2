---
title: Influx Templates
description: >
  Influx Templates are prepackaged InfluxDB configurations that contain
  everything from dashboards and Telegraf configurations to notifications and
  alerts in a single manifest file.
menu: v2_0
weight: 10
v2.0/tags: [influx templates]
---

Influx Templates are prepackaged InfluxDB configurations that contain everything
from dashboards and Telegraf configurations to notifications and alerts in a single manifest file.
Use Influx Templates to quickly set up a fresh instance of InfluxDB, backup your
dashboard configuration, or share your configuration with the InfluxData community.

## Template manifests
A template manifest is a file that defines the contents of a template.
Manifest files support the following formats:

- YAML
- JSON
- Jsonnet

_See [Create an Influx Template](/v2.0/influx-templates/create/) for information about
generating manifest files._

### Template resources
Template **resources** are elements of the InfluxDB user interface (UI) that can
be included in a template.
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
