---
title: Create an organization
seotitle: Create an organization in InfluxDB
description: Create an organization in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_2_0:
    name: Create an organization
    parent: Manage organizations
weight: 101
products: [oss]
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create an organization.

{{% note %}}
#### Organization and bucket limits
A single InfluxDB 2.0 OSS instance supports approximately 20 buckets actively being
written to or queried across all organizations depending on the use case.
Any more than that can adversely affect performance.
Because each organization is created with a bucket, we do not recommend more than
20 organizations in a single InfluxDB OSS instance.
{{% /note %}}

## Create an organization in the InfluxDB UI

1. In the navigation menu on the left, click the **Account dropdown**.

    {{< nav-icon "account" >}}

2. Select **Create Organization**.
3. In the window that appears, enter an **Organization Name** and **Bucket Name** and click **Create**.

## Create an organization using the influx CLI

Use the [`influx org create` command](/influxdb/v2.0/reference/cli/influx/org/create)
to create a new organization. A new organization requires the following:

- A name for the organization

```sh
# Syntax
influx org create -n <org-name>

# Example
influx org create -n my-org
```
