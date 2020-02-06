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
The simplest way to create a new template is to create a new organization and build
the template within the organization.
**InfluxDB OSS** supports multiple organizations. In **InfluxDB Cloud**, your user account is an organization.
**We recommend using InfluxDB OSS to create Influx templates.**
{{% /note %}}

**To create a template:**

1. [Start InfluxDB](/v2.0/get-started/).
2. [Create a new organization](/v2.0/organizations/create-org/).
3. In the InfluxDB UI, add all the resources to include in the template.
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

4. [Export the template](#export-a-template).

## Export a template

### Export all

Then you can just `influx pkg export all -o <org-name>`

### Export specific resources


## Placeholder outline
- Create a template
  - `influx pkg`
  - Package everything vs package specific things
  - Include secrets (only keys are included, uses will still need to populate the secret)
  - Submit a template to the InfluxDB community template repo
  - View your package summary
  - Validate a package
