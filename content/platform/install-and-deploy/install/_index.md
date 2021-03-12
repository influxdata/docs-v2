---
title: Install the InfluxData 1.x platform
description: Quickly install and configure the InfluxData platform to begin exploring time series data
menu:
  platform:
    name: Install the InfluxData Platform
    weight: 11
    identifier: install-platform
    parent: install-and-deploy-platform
---

Install and configure the InfluxData platform (TICK stack) using one of the following methods:

- For **non-production** environments. The quickest way to install the InfluxData platform is to [deploy the InfluxData 1.x platform in Docker containers](/platform/install-and-deploy/deploying/sandbox-install).
- For **production** environments. Do one of the following:

  - [Install the open source version of InfluxData 1.x platform](/platform/install-and-deploy/install/oss-install)
  - Install InfluxData 1.x Enterprise:
      1. [Install Telegraf](/{{< latest "telegraf" >}}/introduction/installation/)
      2. [Install InfluxDB Enterprise](/{{< latest "enterprise_influxdb" >}}/install-and-deploy/)
      3. [Install Kapacitor Enterprise](https://archive.docs.influxdata.com/enterprise_kapacitor/latest/introduction/installation_guide/)

{{% note %}}
Windows support is experimental.
{{% /note %}}
