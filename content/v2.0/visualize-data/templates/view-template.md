---
title: View templates
seotitle: View InfluxDB templates
description: View templates in the InfluxDB user interface (UI).
v2.0/tags: [templates]
menu:
  v2_0:
    name: View templates
    parent: Manage templates
weight: 202

---
To view templates in the InfluxDB UI:

1. Click the **Settings** icon in the left navigation.

    {{< nav-icon "settings" >}}

2. Select the **Templates** tab.

  - In the **Static Templates** tab, a list of pre-created templates appears. For a list of static templates, see [Static templates](#static-templates) below.
  - In the **User Templates** tab, a list of custom user-created templates appears.

3. Click on the name of a template to view its JSON.

## Static templates
The following Telegraf-related dashboards templates are available:

- [Docker](#docker)
- [Getting Started with Flux](#getting-started-with-flux)
- [Kubernetes](#kubernetes)
- [Local Metrics](#local-metrics)
- [Nginx](#nginx)
- [Redis](#redis)
- [System](#system)

### Docker
The Docker dashboard template contains an overview of Docker metrics. It displays the following information:

- System Uptime
- nCPUs
- System Load
- Total Memory
- Memory Usage
- Disk Usage
- CPU Usage
- System Load
- Swap
- Number of Docker containers
- CPU usage per container
- Memory usage % per container
- Memory usage per container
- Network TX traffic per container/sec
- Network RX traffic per container/sec
- Disk I/O read per container/sec
- Disk I/O write per container/sec


#### Plugins

- [`cpu` plugin](/v2.0/reference/telegraf-plugins/#cpu)
- [`disk` plugin](/v2.0/reference/telegraf-plugins/#disk)
- [`diskio` plugin](/v2.0/reference/telegraf-plugins/#diskio)
- [`docker` plugin](//v2.0/reference/telegraf-plugins/#docker)
- [`mem` plugin](/v2.0/reference/telegraf-plugins/#mem)
- [`swap` plugin](/v2.0/reference/telegraf-plugins/#swap)
- [`system` plugin](/v2.0/reference/telegraf-plugins/#system)

### Getting Started with Flux
This dashboard is designed to get you started with the Flux language. It contains explanations and visualizations for a series of increasingly complex example Flux queries.

- Creating your first basic Flux query
- Filtering data using the `filter` function
- Windowing data with the `window` function
- Aggregating data with the `aggregateWindow` function
- Multiple aggregates using Flux variables and the `yield` function
- Joins and maps with the `join`, `map`, `group`, and `drop` functions

#### Plugins

- [`cpu` plugin](/v2.0/reference/telegraf-plugins/#cpu)
- [`disk` plugin](/v2.0/reference/telegraf-plugins/#disk)

### Kubernetes

The Kubernetes dashboard gives a visual overview of Kubernetes metrics. It displays the following information:

- Allocatable Memory
- Running Pods
- Running Containers
- K8s Node Capacity CPUs
- K8s Node Allocatable CPUs
- DaemonSet
- Capacity Pods
- Allocatable Pods
- Resource Requests CPU
- Resource Limit milliscpu
- Resource Memory
- Node Memory
- Replicas Available
- Persistent Volumes Status
- Running Containers

#### Plugins
- [`kubernetes` plugin](/v2.0/reference/telegraf-plugins/)

### Local Metrics
The Local Metrics dashboard shows a visual overview of some of the metrics available from the Local Metrics endpoint located at /`metrics`. It displays the following information:

- Uptime
- Instance Info
- # of Orgs
- # of Users
- # of Buckets
- # of Tokens
- # of Telegraf configurations
- # of Dashboards
- # of Scrapers
- # of Tasks
- Local Object Store IO
- Memory Allocations (Bytes)
- Memory Usage (%)
- Memory Allocs & Frees (Bytes)

### Nginx
The Nginx dashboard gives a visual overview of Nginx metrics. It displays the following information:

- System Uptime
- nCPUs
- System Load
- Total Memory
- Memory Usage
- Disk Usage
- CPU Usage
- System Load
- Swap
- Nginx active connections
- Nginx reading: writing/waiting
- Nginx requests & connections/min
- Network


#### Plugins
- [`cpu` plugin](/v2.0/reference/telegraf-plugins/#cpu)
- [`disk` plugin](/v2.0/reference/telegraf-plugins/#disk)
- [`diskio` plugin](/v2.0/reference/telegraf-plugins/#diskio)
- [`mem` plugin](/v2.0/reference/telegraf-plugins/#mem)
- [`nginx` plugin](/v2.0/reference/telegraf-plugins/#nginx)
- [`swap` plugin](/v2.0/reference/telegraf-plugins/#swap)
- [`system` plugin](/v2.0/reference/telegraf-plugins/#system)

### Redis
The Redis dashboard gives a visual overview of Nginx metrics. It displays the following information:

- System Uptime
- nCPUs
- System Load
- Total Memory
- Memory Usage
- Disk Usage
- CPU Usage
- System Load
- Swap
- Redis used memory
- Redis CPU
- Redis # commands processed per sec
- Redis eviced/expired keys
- Redis connected slaves
- Keyspace hitrate
- Redis - Network Input/Output
- Redis connections
- Redis uptime

#### Plugins
- [`cpu` plugin](/v2.0/reference/telegraf-plugins/#cpu)
- [`disk` plugin](/v2.0/reference/telegraf-plugins/#disk)
- [`mem` plugin](/v2.0/reference/telegraf-plugins/#mem)
- [`redis` plugin](/v2.0/reference/telegraf-plugins/#redis)
- [`swap` plugin](/v2.0/reference/telegraf-plugins/#swap)
- [`system` plugin](/v2.0/reference/telegraf-plugins/#system)


### System
The System dashboard gives a visual overview of system metrics. It displays the following information:

- System Uptime
- nCPUs
- System Load
- Total Memory
- Memory Usage
- Disk Usage
- CPU Usage
- System Load
- Disk IO
- Network
- Processes
- Swap

#### Plugins
- [`disk` plugin](/v2.0/reference/telegraf-plugins/#disk)
- [`diskio` plugin](/v2.0/reference/telegraf-plugins/#diskio)
- [`mem` plugin](/v2.0/reference/telegraf-plugins/#mem)
- [`net` plugin](/v2.0/reference/telegraf-plugins/#net)
- [`swap` plugin](/v2.0/reference/telegraf-plugins/#swap)
- [`system` plugin](/v2.0/reference/telegraf-plugins/#system)
