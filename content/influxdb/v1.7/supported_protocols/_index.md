---
title: Supported protocols in InfluxDB
menu:
  influxdb_1_7:
    name: Supported protocols
    weight: 90

---


InfluxData supports the following protocols for interacting with InfluxDB:

### [CollectD](/influxdb/v1.7/supported_protocols/collectd)
Using the collectd input, InfluxDB can accept data transmitted in collectd native format. This data is transmitted over UDP.

### [Graphite](/influxdb/v1.7/supported_protocols/graphite)
The Graphite plugin allows measurements to be saved using the Graphite line protocol. By default, enabling the Graphite plugin will allow you to collect metrics and store them using the metric name as the measurement.

### [OpenTSDB](/influxdb/v1.7/supported_protocols/opentsdb)
InfluxDB supports both the telnet and HTTP OpenTSDB protocol.
This means that InfluxDB can act as a drop-in replacement for your OpenTSDB system.

### [Prometheus](/influxdb/v1.7/supported_protocols/prometheus)
InfluxDB provides native support for the Prometheus read and write API to convert remote reads and writes to InfluxDB queries and endpoints.

### [UDP](/influxdb/v1.7/supported_protocols/udp)
UDP (User Datagram Protocol) can be used to write to InfluxDB. The CollectD input accepts data transmitted in collectd native format over UDP.
