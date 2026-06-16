---
title: Deploy InfluxDB 3 Enterprise as a managed service with InfluxDB 3 Cloud
list_title: InfluxDB 3 Cloud (managed)
description: >
  InfluxDB 3 Cloud is the fully managed, cloud-hosted deployment option for
  InfluxDB 3 Enterprise. Get the performance and scalability of InfluxDB 3
  Enterprise without provisioning or operating your own infrastructure.
menu:
  influxdb3_enterprise:
    name: InfluxDB 3 Cloud (managed)
    parent: Install InfluxDB 3 Enterprise
weight: 102
related:
  - /influxdb3/enterprise/get-started/
  - /influxdb3/enterprise/install/
influxdb3/enterprise/tags: [install, cloud, managed]
---

InfluxDB 3 Cloud is the fully managed, cloud-hosted deployment option for
{{< product-name >}}. It runs the same InfluxDB 3 Enterprise engine--including
its diskless architecture, high write and query throughput, and horizontal
scalability--as a managed service, so you can write and query time series data
without provisioning or operating your own infrastructure.

Choose InfluxDB 3 Cloud when you want the capabilities of {{< product-name >}}
but prefer InfluxData to manage deployment, scaling, upgrades, and availability
for you. It is the recommended destination for
[InfluxDB Cloud Dedicated](/influxdb3/cloud-dedicated/) customers.

## Compare deployment options

| Capability | Self-managed Enterprise | InfluxDB 3 Cloud (managed) |
| :--------- | :---------------------- | :------------------------- |
| Infrastructure | You provision and operate | InfluxData operates |
| Scaling and upgrades | You manage | Managed for you |
| Architecture | InfluxDB 3 Enterprise | InfluxDB 3 Enterprise |
| Query languages | SQL, InfluxQL | SQL, InfluxQL |

For instructions on running {{< product-name >}} on your own infrastructure,
see [Install InfluxDB 3 Enterprise](/influxdb3/enterprise/install/).

> [!Important]
> #### InfluxDB 3 Cloud is in early access
>
> InfluxDB 3 Cloud is currently an early access release offered to select
> customers as we continue to expand availability.
>
> Interested in trying InfluxDB 3 Cloud?
> [Contact InfluxData sales](https://www.influxdata.com/contact-sales/) to
> request access.
