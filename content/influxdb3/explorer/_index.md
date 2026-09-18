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
    > #### How you install Explorer depends on your InfluxDB 3 server
    >
    > Starting with InfluxDB 3 Enterprise v3.11, Explorer is included with
    > the server and runs as WebAssembly (WASM)--there's no separate
    > container to install. For InfluxDB 3 Core, or Enterprise earlier than
    > v3.11, Explorer runs as a standalone Docker container. See
    > [Install Explorer](/influxdb3/explorer/install/) to find the
    > instructions for your server.
---

InfluxDB 3 Explorer is the standalone web application designed for visualizing, querying, and managing your data stored in InfluxDB 3 Core and Enterprise.
Explorer provides an intuitive interface for interacting with your time series data, streamlining database operations and enhancing data insights.

## Key features

Use InfluxDB 3 Explorer for:

- **Database management**: Create and manage InfluxDB 3 instances, databases, tokens, plugins, and more
- **Data visualization and analysis**: Query data with a built-in visualizer for enhanced data insights  
- **Data ingestion**: Write new data and setup Telegraf configurations

## Quick start

How you install {{% product-name %}} depends on your InfluxDB 3 server:

- **InfluxDB 3 Enterprise v3.11 and later** includes Explorer as an
  integrated WASM component. See
  [Use the integrated InfluxDB 3 Explorer UI](/influxdb3/enterprise/visualize-data/explorer/).
- **InfluxDB 3 Core, or Enterprise earlier than v3.11**, runs Explorer as a
  standalone Docker container:

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
