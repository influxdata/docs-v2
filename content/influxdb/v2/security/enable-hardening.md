---
title: Enable security features
seotitle: Enable security and hardening features in InfluxDB
description: >
  Enable a collection of additional security and hardening features in InfluxDB OSS to better
  secure your InfluxDB instance.
weight: 102
menu:
  influxdb_v2:
    parent: Security & authorization
influxdb/v2.7/tags: [security, hardening]
---

InfluxDB {{< current-version >}} provides optional security features that ensure your
InfluxDB instance is secure in whatever environment it's used in.

To enable all [additional security features](#security-features), use the
[`hardening-enabled` configuration option](/influxdb/v2/reference/config-options/#hardening-enabled)
when starting InfluxDB.

## Security features

- [Private IP Validation](#private-ip-validation)

### Private IP Validation

Some Flux functions ([`to()`](/flux/v0.x/stdlib/influxdata/influxdb/to/),
[`from()`](/flux/v0.x/stdlib/influxdata/influxdb/from/), [`http.post()`](/flux/v0.x/stdlib/http/post/), etc.),
[template fetching](/influxdb/v2/influxdb-templates/) and
[notification endpoints](influxdb/v2.7/monitor-alert/notification-endpoints/)
can require InfluxDB to make HTTP requests over the network.
With private IP validation enabled, InfluxDB first verifies that the IP address of the URL is not a private IP address.

IP addresses are considered private if they fall into one of the following categories:

- IPv4 loopback (`127.0.0.0/8`)
- RFC1918 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`)
- RFC3927 (`169.254.0.0/16`)
- IPv6 loopback (`::1/128`)
- IPv6 link-local (`fe80::/10`)
- IPv6 unique local (`fc00::/7`)

{{% note %}}
#### Private IP considerations
If your environment requires that these authenticated HTTP requests be made to private IP addresses,
omit the use of `--hardening-enabled` and
consider instead setting up egress firewalling to limit which hosts InfluxDB is allowed to connect.
{{% /note %}}
