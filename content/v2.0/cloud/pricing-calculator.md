---
title: InfluxDB Cloud 2.0 pricing calculator
description: >
  Use the InfluxDB Cloud 2.0 pricing calculator to estimate costs by adjusting the number of devices, 
  plugins, metrics, and writes for the Pay As You Go Plan.
weight: 2
menu:
  v2_0_cloud:
    name: Pricing calculator
---

Use the {{< cloud-name >}} pricing calculator to estimate costs by adjusting your number of devices,
  plugins, users, dashboards, writes, and retention. Default configurations include:

| Configuration                      | Hobby  | Standard | Professional | Enterprise |
|:-----------------------------------|-------:|---------:|-------------:|-----------:|
| **Devices**                        |  8     |   200    |     500      |   1000     |
| **Plugins per device**             |  1     |     4    |       4      |      5     |  
| **Users**                          |  1     |     2    |      10      |     20     |
| **Concurrent dashboards per user** |  2     |     2    |       2      |      2     |
| **Writes per minute**              |  6     |     4    |       3      |      3     |
| **Average retention in days**      |  7     |    30    |      30      |     30     |

**To estimate costs** 

1. Click the **Pricing Calculator** icon in the left navigation bar.
2. Choose your region.
2. Select your configuration:
   - **Hobby**. For a single user monitoring a few machines or sensors.
   - **Standard**. For a single team requiring real-time visibility and monitoring a single set of use cases.
   - **Professional**. For teams monitoring multiple disparate systems or use cases.
   - **Enterprise**. For teams monitoring multiple domains and use cases accessing a variety of dashboards.
3. Adjust the default configuration values to match your number of devices, plugins, metrics, and so on. The **Projected Usage** costs are automatically updated as you adjust your configuration.
4. Click **Get started with InfluxDB Cloud** [to get started](https://v2.docs.influxdata.com/v2.0/cloud/get-started/).
