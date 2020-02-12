---
title: Create an InfluxDB template
description: >
  Use the InfluxDB UI and the `influx pkg export` command to create InfluxDB templates.
menu:
  v2_0:
    parent: InfluxDB templates
    name: Create a template
    identifier: Create an InfluxDB template
weight: 102
v2.0/tags: [templates]
---

Use the InfluxDB user interface (UI) and the `influx pkg export` command to
create InfluxDB templates.
Add resources (buckets, Telegraf configurations, tasks, and more) in the InfluxDB
UI and export then the resources as a template.

{{% note %}}
Templatable resources are scoped to a single organization, so the simplest way to create a
template is to create a new organization, build the template within the organization,
then [export all resources](#export-all-resources) as a template.

**InfluxDB OSS** supports multiple organizations so you can create new organizations
for the sole purpose of building and maintaining a template.
In **InfluxDB Cloud**, your user account is an organization.
**We recommend using InfluxDB OSS to create InfluxDB templates.**
{{% /note %}}

**To create a template:**

1. [Start InfluxDB](/v2.0/get-started/).
2. [Create a new organization](/v2.0/organizations/create-org/).
3. In the InfluxDB UI add one or more of the following templatable resources:

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

{{% warn %}}
InfluxDB templates do not support the [table visualization type](/v2.0/visualize-data/visualization-types/table/).
Dashboard cells that use the table visualization are not included in exported templates.
{{% /warn %}}

## Export a template
Do one of the following to export a template:

1. Export all resources in an organization _(recommended)_
2. Export specific resources in an organization

### Export all resources
To export all templatable resources within an organization to a template manifest,
use the `influx pkg export all` command.
Provide the following:

- **Organization name** or **ID**
- **Authentication token** with read access to the organization
- **Destination path and filename** for the template manifest.
  The filename extension determines the template format—both **YAML** (`.yml`) and
  **JSON** (`.json`) are supported.

###### Export all resources to a template
```sh
# Syntax
influx pkg export all -o <org-name> -f <file-path> -t <token>

# Example
influx pkg export all \
  -o my-org \
  -f ~/templates/awesome-template.yml \
  -t $INFLUX_TOKEN
```

For information about flags, see the
[`influx pkg export all` documentation](/v2.0/reference/cli/influx/pkg/export/all/).

### Export specific resources
To export specific templatable resources within an organization to a template manifest,
use the `influx pkg export` with resource flags for each resource to include.
Provide the following:

- **Organization name** or **ID**
- **Authentication token** with read access to the organization
- **Destination file** path for the template manifest.
  The extension of the destination file determines the output format of the manifest file.
  Export template manifests in either YAML (`.yml` or `.yaml`) or JSON (`.json`).
- **Resource flags** with corresponding lists of resource IDs to include in the template.
  For information about what resource flags are available, see the
  [`influx pkg export` documentation](/v2.0/reference/cli/influx/pkg/export/).

###### Export specific resources to a template
```sh
# Syntax
influx pkg export all -o <org-name> -f <file-path> -t <token> [resource-flags]

# Example
influx pkg export all \
  -o my-org \
  -f ~/templates/awesome-template.yml \
  -t $INFLUX_TOKEN \
  --buckets=00x000ooo0xx0xx,o0xx0xx00x000oo \
  --dashboards=00000xX0x0X00x000 \
  --telegraf-configs=00000x0x000X0x0X0
```

## Share your InfluxDB templates
Share your InfluxDB templates with the entire InfluxData community.
**Contribute your template to the [InfluxDB Community Templates](https://github.com/influxdata/community-templates/)
repository on GitHub.**

<a class="btn" href="https://github.com/influxdata/community-templates/" target="\_blank">View InfluxDB Community Templates</a>
