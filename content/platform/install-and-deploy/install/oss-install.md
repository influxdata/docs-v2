---
title: Install the InfluxData 1.x TICK stack (OSS)
list_title: TICK stack (OSS)
description: Install and configure the open source InfluxData 1.x TICK stack – Telegraf, InfluxDB, Chronograf, and Kapacitor.
alias: /platform/installation/oss-install
menu:
  platform:
    name: TICK stack (OSS)
    parent: install-platform
    weight: 2
---

## Download the TICK stack components

To download each of the TICK stack components, see [InfluxData downloads page](https://www.influxdata.com/downloads/).
Telegraf, InfluxDB, Chronograf, and Kapacitor are each separate binaries that need
to be installed, configured, and started separately.


## Install Telegraf

The [Telegraf installation instructions](/telegraf/v1/install/)
walk through installing and configuring Telegraf.

## Install InfluxDB

The [InfluxDB OSS installation instructions](/influxdb/v1/introduction/installation/)
walk through installing and configuring the open source version of InfluxDB.

## Install Chronograf

The [Chronograf installation instructions](/chronograf/v1/introduction/installation/)
walk through installing and configuring Chronograf.

## Install Kapacitor

The [Kapacitor OSS installation instructions](/kapacitor/v1/introduction/installation/)
walk through installing and configuring the open source version of Kapacitor.

## InfluxData Sandbox

The [InfluxData Sandbox](https://github.com/influxdata/sandbox) is an alternative
method for installing the OSS TICK stack that uses Docker and Docker Compose to build
and network each component. For information about installing the Sandbox, view the
[InfluxData Sandbox installation instructions](/platform/install-and-deploy/deploying/sandbox-install).
