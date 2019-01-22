---
title: Setup InfluxDB
seotitle: Run the initial InfluxDB setup process
description: placeholder
menu:
 v2_0:
  name: Setup InfluxDB
  parent: Get started
  weight: 2
---

To setup InfluxDB for the first time, you must create a default organization, user, and bucket.
InfluxDB provides a one-time setup process that does all of these things.
The setup process is available in both the InfluxDB user interface (UI) and in
the `influx` command line interface (CLI).

The setup API is only available on an uninitialized InfluxDB installation.

## Through the UI
- start `influxd`
- Visit [localhost:9999](http://localhost:9999)

## Through the influx CLI
```bash
influx setup
```
