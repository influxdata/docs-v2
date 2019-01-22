---
title: Install InfluxDB v2.0
seotitle: Download and install InfluxDB v2.0
description: placeholder
menu:
  v2_0:
    name: Install InfluxDB
    parent: Get started
    weight: 1
---

### Download InfluxDB v2.0
Visit [InfluxData Downloads page](https://portal.influxdata.com/downloads/) and
download the InfluxDB v2.0 package appropriate for your operating system.

<a class="btn download" href="https://portal.influxdata.com/downloads/" target="\_blank">Download InfluxDB</a>

### Place the executables in your $PATH
Place the `influx` and `influxd` executables in your system `$PATH`.

### Networking ports
By default, InfluxDB uses TCP port `9999` for client-server communication over InfluxDB’s HTTP API.
