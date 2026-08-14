---
title: Monitor system metrics
description: >
  Use Telegraf to collect CPU, memory, disk, and network metrics from a host
  and write them to InfluxDB 3.
menu:
  telegraf_v1:
    name: Monitor system metrics
    parent: Configuration examples
weight: 101
related:
  - /telegraf/v1/input-plugins/cpu/
  - /telegraf/v1/input-plugins/disk/
  - /telegraf/v1/get-started/
---

Collect CPU, memory, disk, and network metrics from a host and write them
to InfluxDB 3.
This is the canonical starter configuration and a template for any
polling-input pipeline.

## Configuration

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[global_tags]
  ## Tags applied to all metrics from this agent.
  environment = "production"

[agent]
  interval = "10s"
  round_interval = true

[[inputs.cpu]]
  ## Report per-CPU and total-CPU usage.
  percpu = true
  totalcpu = true

[[inputs.mem]]

[[inputs.disk]]
  ## Ignore pseudo and temporary filesystems.
  ignore_fs = ["tmpfs", "devtmpfs", "devfs", "overlay", "aufs", "squashfs"]

[[inputs.net]]
  ## Collect from physical interfaces only.
  interfaces = ["eth*", "en*"]

[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your InfluxDB authorization token
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the database to write to

## How it works

- **`[global_tags]`** adds an `environment` tag to every metric the agent
  produces, so you can distinguish hosts by role or deployment when
  querying.
- **`[agent]`** gathers all inputs every 10 seconds, aligned to the clock
  (`round_interval`), so metrics from multiple hosts share timestamps.
- **The four input plugins** poll the operating system on each interval.
  Telegraf adds a `host` tag automatically.
  The `disk` and `net` filters keep noisy pseudo-filesystems and virtual
  interfaces out of your data.
- **`[[outputs.influxdb_v3]]`** batches and writes all collected metrics.

## Example output

```text
cpu,cpu=cpu-total,environment=production,host=host1 usage_idle=92.4,usage_user=4.2,usage_system=3.4 1709572230000000000
mem,environment=production,host=host1 used_percent=64.2,available=5836500992i,total=17179869184i 1709572230000000000
disk,device=disk1s1,environment=production,fstype=apfs,host=host1,mode=rw,path=/ used_percent=38.7 1709572230000000000
net,environment=production,host=host1,interface=en0 bytes_recv=918273645i,bytes_sent=234981723i 1709572230000000000
```

## Extend this example

- Add [inputs.system](/telegraf/v1/input-plugins/system/) for load
  averages and uptime, or
  [inputs.processes](/telegraf/v1/input-plugins/processes/) for process
  counts.
- To run this configuration on every host in a fleet, serve it from a URL
  or use [Telegraf Controller](/telegraf/controller/).
  See [Load configuration from a URL](/telegraf/v1/configuration/file/#load-configuration-from-a-url).
