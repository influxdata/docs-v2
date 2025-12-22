---
title: Install an InfluxDB Enterprise v1 cluster
description: Install InfluxDB Enterprise in your own on-premise environment.
aliases:
    - /enterprise_influxdb/v1/installation/
    - /enterprise_influxdb/v1/introduction/install-and-deploy/installation/
    - /enterprise_influxdb/v1/introduction/install-and-deploy/
    - /enterprise_influxdb/v1/install-and-deploy/
menu:
  enterprise_influxdb_v1:
    name: Install
    weight: 103
    parent: Introduction
related:
  - /enterprise_influxdb/v1/introduction/installation/docker/
  - /enterprise_influxdb/v1/introduction/installation/single-server/
  - /enterprise_influxdb/v1/introduction/installation/fips-compliant/
---

Complete the following steps to install an InfluxDB Enterprise cluster in your own environment:

1. [Install InfluxDB Enterprise meta nodes](/enterprise_influxdb/v1/introduction/installation/meta_node_installation/)
2. [Install InfluxDB data nodes](/enterprise_influxdb/v1/introduction/installation/data_node_installation/)
3. [Install Chronograf](/enterprise_influxdb/v1/introduction/installation/chrono_install/)

## Kubernetes with Helm

For Kubernetes deployments, InfluxData provides Helm charts.
See the [influxdb-enterprise Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb-enterprise) for Enterprise-specific configuration options and installation instructions.

{{< influxdbu title="Installing InfluxDB Enterprise" summary="Learn about InfluxDB architecture and how to install InfluxDB Enterprise with step-by-step instructions." action="Take the course" link="https://university.influxdata.com/courses/installing-influxdb-enterprise-tutorial/" >}}