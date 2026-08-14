---
title: Monitor Docker containers
description: >
  Use Telegraf to collect container CPU, memory, network, and state metrics
  from the Docker daemon and write them to InfluxDB 3.
menu:
  telegraf_v1:
    name: Monitor Docker containers
    parent: Configuration examples
weight: 102
related:
  - /telegraf/v1/input-plugins/docker/
  - /telegraf/v1/configuration/filtering/
---

Collect per-container CPU, memory, network, and state metrics from the
Docker daemon and write them to InfluxDB 3.

## Configuration

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[inputs.docker]]
  ## Connect to the local Docker daemon socket.
  endpoint = "unix:///var/run/docker.sock"

  ## Collect from running containers only.
  container_state_include = ["running"]

  ## Report total container CPU instead of one metric per core.
  perdevice_include = []
  total_include = ["cpu", "blkio", "network"]

  ## Keep only the compose service label as a tag.
  docker_label_include = ["com.docker.compose.service"]

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

## Where to run Telegraf

Telegraf can monitor Docker from the host or from a container of its own.
Either way, the Telegraf process must be able to reach the Docker daemon
socket that `endpoint` points to.

**On the host**: add the `telegraf` user to the `docker` group so it can
read the socket, then restart Telegraf:

<!--pytest.mark.skip-->

```bash
sudo usermod -aG docker telegraf
```

**In a container**: use the official
[telegraf image](https://hub.docker.com/_/telegraf) and bind-mount the
Docker socket and your configuration file:

<!--pytest.mark.skip-->

```bash
docker run --detach --name telegraf \
  --volume /var/run/docker.sock:/var/run/docker.sock \
  --volume $PWD/telegraf.conf:/etc/telegraf/telegraf.conf:ro \
  telegraf
```

Mounting the Docker socket grants the container control over the Docker
daemon.
Only do this with images you trust.

## How it works

- **`endpoint`** connects to the Docker daemon through its Unix socket.
  Use `tcp://<host>:<port>` for a remote daemon, with the TLS options
  as needed.
- **`container_state_include`** skips created, exited, and paused
  containers, so you only pay for containers doing work.
- **`perdevice_include` and `total_include`** control metric granularity.
  This example reports accumulated totals per container instead of one
  metric per CPU core, block device, and interface, which keeps series
  counts low.
- **`docker_label_include`** limits which container labels become tags.
  Container labels are often high-cardinality; allowlist only the labels
  you query by.
- The plugin also produces `docker` and `docker_data` summary metrics for
  the engine itself, such as container counts and storage usage.

## Example output

```text
docker,engine_host=host1,server_version=27.0.3 n_containers=12i,n_containers_running=8i,n_images=41i 1709572230000000000
docker_container_cpu,com.docker.compose.service=api,container_image=example/api,container_name=api-1,container_version=1.4.2,cpu=cpu-total usage_percent=12.7 1709572230000000000
docker_container_mem,com.docker.compose.service=api,container_image=example/api,container_name=api-1,container_version=1.4.2 usage_percent=23.1,usage=498073600i,limit=2147483648i 1709572230000000000
docker_container_net,com.docker.compose.service=api,container_image=example/api,container_name=api-1,container_version=1.4.2,network=total rx_bytes=87234981i,tx_bytes=12873411i 1709572230000000000
```

## Extend this example

- Scope collection with `container_name_include` or metric
  [filters](/telegraf/v1/configuration/filtering/) when you only care
  about specific services.
- Add [inputs.docker_log](/telegraf/v1/input-plugins/docker_log/) to
  collect container logs through the same daemon connection.
