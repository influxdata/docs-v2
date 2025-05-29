---
title: InfluxDB 3 Explorer Documentation
description: >
  InfluxDB 3 Explorer is a web-based interface for interacting with InfluxDB 3 Core and Enterprise. Visualize, query, and manage your time series data efficiently.
menu:
  explorer_v1:
    name: InfluxDB 3 Explorer
weight: 1
aliases:
  - /explorer/
  - /explorer/v3/
  - /influxdb/v3/explorer/
---

InfluxDB 3 Explorer is a web application designed for visualizing, querying, and managing your InfluxDB 3 Core and Enterprise data. It provides an intuitive interface to easily interact with your time series data, simplifying operations and enhancing data insights.

## Overview

InfluxDB 3 Explorer enables users to explore and visualize data with a built-in visualizer, quickly write new data, and manage their databases and token setups.

## Key Features

### Database and Query Management

- Create and manage InfluxDB 3 databases
- Create and manage admin and resource tokens
- Configure new instance of InfluxDB 3 Enterprise

### Data Management

- Quickly query data with a built-in visualizer
- Write new data and setup new Telegraf configurations.

## Deployment with Docker

### Quick Start

Run InfluxDB 3 Explorer quickly with Docker:

```sh
docker run -d \
  -p 8888:80 \
  -p 8889:8888 \
  explorer:latest \
  --MODE=admin
