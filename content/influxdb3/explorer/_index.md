---
title: InfluxDB 3 Explorer documentation
description: >
  InfluxDB 3 Explorer is a standalone web-based interface for interacting with InfluxDB 3 Core and Enterprise. Visualize, query, and manage your time series data efficiently.
menu:
  influxdb3_explorer:
    name: InfluxDB 3 Explorer
weight: 1
cascade:
  product: influxdb3_explorer
  version: explorer
  prepend: |
    > [!Important]
    > #### Explorer's distribution model is changing in v1.10
    >
    > Starting with v1.10, Explorer is included with
    > [InfluxDB 3 Enterprise](/influxdb3/enterprise/) and runs as WebAssembly
    > (WASM) instead of a standalone Docker container. Explorer v1.9 and
    > earlier remains available as Docker. See
    > [Install Explorer](/influxdb3/explorer/install/) to find the
    > instructions for your version.
---

InfluxDB 3 Explorer is the standalone web application designed for visualizing, querying, and managing your data stored in InfluxDB 3 Core and Enterprise.
Explorer provides an intuitive interface for interacting with your time series data, streamlining database operations and enhancing data insights.

## Key features

Use InfluxDB 3 Explorer for:

- **Database management**: Create and manage InfluxDB 3 instances, databases, tokens, plugins, and more
- **Data visualization and analysis**: Query data with a built-in visualizer for enhanced data insights  
- **Data ingestion**: Write new data and setup Telegraf configurations

## Quick start

How you install {{% product-name %}} depends on your version:

- **v1.10 and later** is included with InfluxDB 3 Enterprise and runs as WASM.
- **v1.9 and earlier** runs as a standalone Docker container:

  ```sh
  # Pull the Docker image
  docker pull influxdata/influxdb3-ui

  # Run the Docker container
  docker run --detach \
    --name influxdb3-explorer \
    --publish 8080:8080 \
    --publish 8443:8443 \
    influxdata/influxdb3-ui \
    --mode=admin

  # Visit http://localhost:8080 in your browser to begin using InfluxDB 3 Explorer
  ```

For installation and configuration options, see [Install InfluxDB 3 Explorer](/influxdb3/explorer/install/).
<a class="btn" href="/influxdb3/explorer/get-started/">Get started using InfluxDB 3 Explorer</a>
