---
title: InfluxDB templates in InfluxDB Cloud
list_title: InfluxDB templates in Cloud
description: >
  Install templates directly in the UI or download the `influx` CLI to apply
  and manage InfluxDB templates in your InfluxDB Cloud account.
menu:
  influxdb_cloud:
    parent: InfluxDB templates
    name: Templates in Cloud
weight: 101
aliases:
  - /influxdb/cloud/influxdb-templates/get_started_cloud/
influxdb/cloud/tags: [templates]
products: [cloud]
---

To use templates in InfluxDB Cloud, you have a couple options:

- [Install and customize templates directly in the Cloud UI](#install-and-customize-a-template-in-the-cloud-ui)
- [Apply and manage templates using the `influx` CLI](#apply-and-manage-templates-using-the-influx-cli)

## Install and customize a template in the Cloud UI

{{% note %}}
To ensure the template works, complete the **ReadMe** instructions after installing a template. For example, you may need to configure telegraf to write specific data to your Cloud instance before the template can be used.
{{% /note %}}

1. Under **Settings** icon in the navigation bar.

    {{< nav-icon "settings" >}}

2. Click **Templates**.
3. (Optional) If you already have a template URL, you can skip this step. Click **Browse Community Templates** to explore templates and obtain a template URL (YAML or JSON file).
4. Enter the URL to the template's YAML or JSON file (from the [InfluxData Community Templates](https://github.com/influxdata/community-templates) repository), and then click **Lookup Template**.
The Template Installer displays the template name and the number of resources included in the template (for example, dashboards, Telegraf configurations, buckets, and more).
5. Click **Install Template**. A message confirms the template has been successfully installed.
6. Under **Installed Templates**, find the template, and do the following:
   - Click **View Readme**. Complete the instructions to finalize your template.
   - (Optional) To customize a template, under **Installed Resources**, expand the template resources, and then click a resource to update it. Update any of the following resources included in the template:

    - Buckets. [Update buckets](/influxdb/cloud/organizations/buckets/update-bucket/)
    - Dashboards. [Control dashboards](/influxdb/cloud/visualize-data/dashboards/control-dashboard/)
    - Labels. [Edit labels](/influxdb/cloud/visualize-data/labels/#edit-a-label)
    - Checks. [Update checks](/influxdb/cloud/monitor-alert/checks/update/)
    - Notification endpoints. [Update notification endpoints](/influxdb/cloud/monitor-alert/notification-endpoints/update/)
    - Notification rules. [Update notification rules](/influxdb/cloud/monitor-alert/notification-rules/update/)
    - Telegraf configurations. [Update a Telegraf configurations](/influxdb/cloud/telegraf-configs/update/)

7. (Optional) Add or delete resources from the template, and then use the `influx` CLI to [export resources to a new template (JSON or YAML file)](/influxdb/cloud/influxdb-templates/create/#export-all-resources).

{{% note %}}
To install and configure the `influx` CLI, complete steps 1-2 in the procedure below.
{{% /note %}}

## Apply and manage templates using the influx CLI

Use the [`influx` CLI](/influxdb/cloud/reference/cli/influx/)
to apply and manage templates in your InfluxDB Cloud account.
If you haven’t already, do the following:

1. [Download and install `influx` CLI](/influxdb/cloud/get-started/#optional-download-install-and-use-the-influx-cli).
2. [Configure the `influx` CLI](/influxdb/cloud/get-started/#set-up-influxdb) to use your
   InfluxDB Cloud instance URL, organization, and tokens.
3. [Use the `influx` CLI](/influxdb/cloud/reference/cli/influx/) to use, manage, and create
   InfluxDB templates:

    - [Use templates](/influxdb/cloud/influxdb-templates/use/)
    - [Create templates](/influxdb/cloud/influxdb-templates/create/)