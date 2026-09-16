---
title: Manage EDR
description: >
  Install, configure, and operate EDR—replicating InfluxDB 3 Enterprise data
  to Enterprise, InfluxDB 3 Cloud, or AWS Timestream for InfluxDB 3.
menu:
  influxdb3_edr:
    name: Manage
weight: 5
---

Use the following guides to install, configure, and operate {{% product-name %}}.

## Which guide for which downstream

| Your goal | Guide |
|---|---|
| Install the agent and CLI on each node | [Install EDR](/influxdb3/edr/install/) |
| Replicate InfluxDB 3 Enterprise to another Enterprise instance | [Replicate to InfluxDB 3 Enterprise](/influxdb3/edr/admin/replicate-to-enterprise/) |
| Replicate InfluxDB 3 Enterprise to InfluxDB 3 Cloud | [Replicate to InfluxDB 3 Cloud](/influxdb3/edr/admin/replicate-to-cloud/) |
| Replicate one source to multiple destinations at once | [Replicate to multiple destinations](/influxdb3/edr/admin/multi-destination-fan-out/) |
| Size WAL retention and WAL cleanup for your expected outages | [Size WAL retention](/influxdb3/edr/admin/size-wal-retention/) |
| Watch replication health, lag, and progress | [Monitor EDR](/influxdb3/edr/admin/monitor/) |
| Manage and rotate auth and write tokens | [Manage tokens](/influxdb3/edr/admin/manage-tokens/) |
| Run EDR in Docker | [Run EDR in Docker](/influxdb3/edr/install/docker/) |
| Diagnose something that looks wrong | [Troubleshoot EDR](/influxdb3/edr/admin/troubleshoot/) |
| Diagnose a crashed or restarted agent from a captured log | [EDR log post-mortem playbook](/influxdb3/edr/admin/log-postmortem-playbook/) |

{{< children >}}
