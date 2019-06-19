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
The following Telegraf-related dashboards templates are available.

### Docker
The Docker dashboard template displays the following information:

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

- [`docker` plugin](/telegraf/latest/plugins/inputs/#docker)
- [`disk` plugin](/telegraf/latest/plugins/inputs/#disk)
- [`mem` plugin](/telegraf/latest/plugins/inputs/#mem)
- [`diskio` plugin](/telegraf/latest/plugins/inputs/#diskio)
- [`system` plugin](/telegraf/latest/plugins/inputs/#system)
- [`cpu` plugin](/telegraf/latest/plugins/inputs/#cpu)

### Getting Started with Flux

### Kubernetes

### Local Metrics

### Nginx

### Redis

## System

  - **Docker**: A collection of useful visualizations for monitoring your system stats.
  - **Getting Started with Flux**
  - **Kubernetes**: A collection of useful visualization for monitoring your Kubernetes instance.
  - **Local Metrics**
  - **Nginx**
  - **Redis**
  - **System**
