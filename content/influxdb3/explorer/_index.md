---
title: InfluxDB 3 Explorer documentation
description: >
  InfluxDB 3 Explorer is a standalone web-based interface for interacting with InfluxDB 3 Core and Enterprise. Visualize, query, and manage your time series data efficiently.
menu:
  influxdb3_explorer:
    name: InfluxDB 3 Explorer
weight: 1
aliases:
  - /explorer/
  - /explorer/v3/
  - /influxdb/v3/explorer/
---

InfluxDB 3 Explorer is the standalone web application designed for visualizing, querying, and managing your data stored in InfluxDB 3 Core and Enterprise.
Explorer provides an intuitive interface for interacting with your time series data, streamlining database operations and enhancing data insights.

## Key features

Use InfluxDB 3 Explorer for:

- **Database and query management**: Create and manage InfluxDB 3 databases, admin and resource tokens, and configure new InfluxDB 3 Enterprise instances
- **Data visualization and analysis**: Query data with a built-in visualizer for enhanced data insights  
- **Data ingestion**: Write new data and setup Telegraf configurations

## Quick start

Run the Docker image to start InfluxDB 3 Explorer:

```sh
docker run -d \
  -p 8888:80 \
  -p 8889:8888 \
  explorer:latest \
  --MODE=admin
```

[Get started with InfluxDB 3 Explorer](/explorer/v1/get-started/)
