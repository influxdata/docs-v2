---
title: InfluxDB templates in InfluxDB Cloud
list_title: InfluxDB templates in Cloud
description: >
  Install templates directly in the UI or download the `influx` CLI to apply and manage InfluxDB templates in your InfluxDB Cloud account.
menu:
  influxdb_2_0:
    parent: InfluxDB templates
    name: Templates in Cloud
weight: 101
aliases:
  - /influxdb/v2.0/influxdb-templates/get_started_cloud/
influxdb/v2.0/tags: [templates]
products: [cloud]
---

## Install and customize a template in the Cloud UI

1. Under **Settings** icon in the navigation bar.

    {{< nav-icon "settings" >}}

2. Click **Templates**.
3. (Optional) To browse a wide variety of templates, click **Browse Community Templates**.
4. Enter the URL to the template's YAML or JSON file (in the [InfluxData Community Templates](https://github.com/influxdata/community-templates) repository), and then click **Lookup Template**.
The Template Installer displays the template name and number of resources included in the template (for example, dashboards, Telegraf configurations, variables, labels, and more).
5. Click **Install Template**. A message confirms the template has been successfully installed.
6. Under **Installed Templates**, find the template, and do the following:
   - Click **View Readme**. Complete the instructions to finalize your template.

    {{% note %}}
    To ensure the template works, complete the ReadMe instructions. For example, you maybe need to create a bucket with a specific name in your Cloud instance before the template can be used.)
    {{% /note %}}
   - (Optional) To customize a template, under **Installed Resources**, expand the template resources, and then click the resource to update. You can update any resource included in the template. Templates resources may include any of the following resources; follow the links to find how to customize each resource:

   - Buckets. [Update buckets](/influxdb/v2.0/organizations/buckets/update-bucket/)
   - Dashboards. [Control dashboards](/influxdb/v2.0/visualize-data/dashboards/control-dashboard/)
   - Labels. [Edit labels](/influxdb/v2.0/visualize-data/labels/#edit-a-label)
   - Checks. [Update checks](/influxdb/v2.0/monitor-alert/checks/update/)
   - Notification endpoints. [Update notification endpoints](/influxdb/v2.0/monitor-alert/notification-endpoints/update/)
   - Notification rules. [Update notification rules](/influxdb/v2.0/monitor-alert/notification-rules/update/)
   - Telegraf configurations. [Update a Telegraf configurations](/influxdb/v2.0/telegraf-configs/update/)

7. (Optional) Add or delete resources from the template, and then use the `influx` CLI to [export resources to a new template (JSON or YAML file)](/influxdb/v2.0/influxdb-templates/create/#export-all-resources).  

## Apply and manage templates using the influx CLI

Use the [`influx` command line interface (CLI)](/influxdb/v2.0/reference/cli/influx/)
to apply and manage templates in your InfluxDB Cloud account.

If you haven’t already, do the following:

1. [Download and install `influx` CLI](/influxdb/v2.0/get-started/#optional-download-install-and-use-the-influx-cli).
2. [Configure the `influx` CLI](/influxdb/v2.0/get-started/#set-up-influxdb) to use your
   InfluxDB Cloud instance URL, organization, and tokens.
3. [Use the `influx` CLI](/influxdb/v2.0/reference/cli/influx/) to use, manage, and create
   InfluxDB templates:

    - [Use templates](/influxdb/v2.0/influxdb-templates/use/)
    - [Create templates](/influxdb/v2.0/influxdb-templates/create/)
