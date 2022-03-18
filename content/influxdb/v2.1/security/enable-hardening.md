---
title: Enable security features
seotitle: Enable security and hardening features in InfluxDB
description: >
  Enable additional security features in InfluxDB.
weight: 102
menu:
  influxdb_2_1:
    parent: Security & authorization
influxdb/v2.1/tags: [security, hardening]
products: [oss]
---

InfluxDB is used in many environments and depending on your environment, enabling additional security features may be appropriate.
To enable all security hardening options now and in the future,
start InfluxDB with the `--hardening-enabled` command line flag:

    ```bash
    influxd \
    --hardening-enabled
    ```

## Security features

- [Private IP Validation](#private-ip-validation)

### Private IP Validation

Certain flux functions (eg, `to()`, `from()`, etc) and [template fetching](/influxdb/v2.1/influxdb-templates/) cause InfluxDB to make HTTP requests over the network.
When private IP validation is enabled, InfluxDB will first verify that the IP address of the URL is not a private IP address.
IP addresses are considered private if they fall into one of the following categories:
* IPv4 loopback (`127.0.0.0/8`)
* RFC1918 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
* RFC3927 (`169.254.0.0/16`)
* IPv6 loopback (`::1/128`)
* IPv6 link-local (`fe80::/10`)
* IPv6 unique local (`fc00::/7`)

{{% note %}}
#### Private IP considerations
If your environment requires that these authenticated HTTP requests be made to private IP addresses,
omit the use of `--hardening-enabled` and
consider instead setting up egress firewalling to limit which hosts InfluxDB is allowed to connect.
