---
title: Create an Influx template
description: >
  Use the InfluxDB UI and the `influx pkg export` command to create Influx templates.
menu:
  v2_0:
    parent: Influx templates
    name: Create a template
    identifier: Create an Influx template
weight: 101
v2.0/tags: [influx templates]
---

Use the InfluxDB user interface (UI) and the `influx pkg export` command to
create Influx templates.
Add buckets, Telegraf configurations, tasks, and more in the InfluxDB UI and export
them as a template.

{{% note %}}
The simplest way to create a template is to create a new organization and build
the template within the organization.
**InfluxDB OSS** supports multiple organizations.
In **InfluxDB Cloud**, your user account is an organization.
**We recommend using InfluxDB OSS to create Influx templates.**
{{% /note %}}

**To create a template:**

1. [Start InfluxDB](/v2.0/get-started/).
2. [Create a new organization](/v2.0/organizations/create-org/).
3. Use the InfluxDB UI to add resources to your template.
   The following resources are templatable:

   - [buckets](/v2.0/organizations/buckets/create-bucket/)
   - [checks](/v2.0/monitor-alert/checks/create/)
   - [dashboards](/v2.0/visualize-data/dashboards/create-dashboard/)
   - [dashboard variables](/v2.0/visualize-data/variables/create-variable/)
   - [labels](/v2.0/visualize-data/labels/)
   - [notification endpoints](/v2.0/monitor-alert/notification-endpoints/create/)
   - [notification rules](/v2.0/monitor-alert/notification-rules/create/)
   - [tasks](/v2.0/process-data/manage-tasks/create-task/)
   - [Telegraf configurations](/v2.0/write-data/use-telegraf/)

4. Export the template _(see [below](#export-a-template))_.

## Export a template
There are two methods for exporting a template.

1. Export all resources in an organization _(recommended)_
2. Export specific resources in an organization

### Export all resources
Use the `influx pkg export all` command to export all templatable resources
into a new template manifest.
Provide the following:

- **Organization name** or **ID**
- **Authentication token** with read access to the organization
- **Destination file** path for the template manifest.
  The extension of the destination file determines the output format of the manifest file.
  Export template manifests in either YAML (`.yml` or `.yaml`) or JSON (`.json`).

###### Export all resources to a template manifest
```sh
# Syntax
influx pkg export all -o <org-name> -f <filepath> -t <token>

# Example
influx pkg export all \
  -o my-org \
  -f ~/templates/awesome-template.yml \
  -t $INFLUX_TOKEN
```

For information about other options and flags, see the
[`influx pkg export all` documentation](/v2.0/reference/cli/influx/pkg/export/all/).

### Export specific resources
Use the `influx pkg export` with resource flagss to export all specific templatable
resources into a new template manifest.
Provide the following:

- **Organization name** or **ID**
- **Authentication token** with read access to the organization
- **Destination file** path for the template manifest.
  The extension of the file determines the output format of the manifest file.
  Influx templates support YAML, JSON, and Jsonnet.
- **Resource flags** with corresponding lists of resource IDs to include in the template.
  For information about what resource flags are available, see the
  [`influx pkg export` documentation](/v2.0/reference/cli/influx/pkg/export/).

###### Export specific resources to a template manifest
```sh
# Syntax
influx pkg export all -o <org-name> -f <filepath> -t <token> [resource-flags]

# Example
influx pkg export all \
  -o my-org \
  -f ~/templates/awesome-template.yml \
  -t $INFLUX_TOKEN \
  --buckets=00x000ooo0xx0xx,o0xx0xx00x000oo \
  --dashboards=00000xX0x0X00x000 \
  --telegraf-configs=00000x0x000X0x0X0
```
