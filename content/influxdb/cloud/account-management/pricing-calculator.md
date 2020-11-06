---
title: InfluxDB Cloud pricing calculator
description: >
  Use the InfluxDB Cloud pricing calculator to estimate costs by adjusting the number of devices,
  plugins, metrics, and writes for the Usage-based Plan.
weight: 2
menu:
  influxdb_cloud:
    name: Pricing calculator
products: [cloud]
draft: true
---

Use the {{< cloud-name >}} pricing calculator to estimate costs for the Usage-based Plan by adjusting your number of devices,
  plugins, users, dashboards, writes, and retention. Default configurations include:

| Configuration                      | Hobby  | Standard | Professional | Enterprise |
|:-----------------------------------|-------:|---------:|-------------:|-----------:|
| **Devices**                        |  8     |   200    |     500      |   1000     |
| **Plugins per device**             |  1     |     4    |       4      |      5     |  
| **Users**                          |  1     |     2    |      10      |     20     |
| **Concurrent dashboards per user** |  2     |     2    |       2      |      2     |
| **Writes per minute**              |  6     |     4    |       3      |      3     |
| **Average retention in days**      |  7     |    30    |      30      |     30     |

Guidelines used to estimate costs for default configurations:

- Average metrics per plugin = 25
- Average KB per value = 0.01
- Number of cells per dashboard = 10
- Average response KB per cell = 0.5
- Average query duration = 75ms

**To estimate costs**

1. Do one of the following:

  - Free Plan. Click the **user avatar** in the top right corner of your
    {{< cloud-name "short" >}} user interface (UI) and select **Billing**.
    Then click the **Pricing Calculator** link at the bottom of the page.
  - Usage-based Plan. Open the pricing calculator [here](https://cloud2.influxdata.com/pricing).
3. Choose your region.
4. Select your configuration:
   - **Hobby**. For a single user monitoring a few machines or sensors.
   - **Standard**. For a single team requiring real-time visibility and monitoring a single set of use cases.
   - **Professional**. For teams monitoring multiple disparate systems or use cases.
   - **Enterprise**. For teams monitoring multiple domains and use cases accessing a variety of dashboards.
5. Adjust the default configuration values to match your number of devices, plugins, metrics, and so on. The **Projected Usage** costs are automatically updated as you adjust your configuration.
6. Click **Get started with InfluxDB Cloud** [to get started](/influxdb/cloud/get-started/).
