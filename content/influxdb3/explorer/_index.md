---
title: InfluxDB 3 Explorer documentation
description: >
  InfluxDB 3 Explorer is a standalone web-based interface for interacting with InfluxDB 3 Core and Enterprise. Visualize, query, and manage your time series data efficiently.
menu:
  influxdb3_explorer:
    name: InfluxDB 3 Explorer
weight: 1
---

InfluxDB 3 Explorer is the standalone web application designed for visualizing, querying, and managing your data stored in InfluxDB 3 Core and Enterprise.
Explorer provides an intuitive interface for interacting with your time series data, streamlining database operations and enhancing data insights.

> [!Important]
> #### InfluxDB 3 Core or Enterprise v3.1.0 or later required
>
> InfluxDB 3 Explorer is compatible with the following:
>
> - [InfluxDB 3 Core v3.1.0 or later](/influxdb3/core/install/)
> - [InfluxDB 3 Enterprise v3.1.0 or later](/influxdb3/enterprise/install/)

## Key features

Use InfluxDB 3 Explorer for:

- **Database and query management**: Create and manage InfluxDB 3 databases, admin and resource tokens, and configure new InfluxDB 3 Enterprise instances
- **Data visualization and analysis**: Query data with a built-in visualizer for enhanced data insights  
- **Data ingestion**: Write new data and setup Telegraf configurations

## Quick start

Run the Docker image to start InfluxDB 3 Explorer:

```sh
# Pull the Docker image
docker pull influxdata/influxdb3-ui:{{% latest-patch %}}

# Run the Docker container
docker run --detach \
  --name influxdb3-explorer \
  --publish 8888:80 \
  --publish 8889:8888 \
  influxdata/influxdb3-ui:{{% latest-patch %}} \
  --mode=admin

# Visit http://localhost:8888 to begin using Explorer
```


<a class="btn" href="/influxdb3/explorer/install/">Install and run InfluxDB 3 Explorer</a>  
<a class="btn" href="/influxdb3/explorer/get-started/">Get started using InfluxDB 3 Explorer</a>
