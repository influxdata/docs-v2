---
title: Replicate to InfluxDB 3 Enterprise
description: >
  Set up EDR to replicate data from one InfluxDB 3 Enterprise instance to
  another, in edge-to-regional-to-central topologies.
menu:
  influxdb3_edr:
    name: Replicate to Enterprise
    parent: Replicate
weight: 1
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/operations.md, docs/external/start-here.md, docs/external/edr-spec.md -->

Use EDR to replicate data between InfluxDB 3 Enterprise instances—edge to
regional relay to central hub, or a direct edge-to-central hop. This guide
covers the Enterprise-to-Enterprise topology end to end. For general config
and CLI flag reference, see
[Configuration file reference](/influxdb3/edr/reference/config-file/).

## Prerequisites

- InfluxDB 3 Enterprise on the
  [upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)
  (the default for new clusters on 3.11+; on 3.10.x pass
  `--upgrade-pacha-tree`) on every node.
- The `influxdb3-edr` binary installed on every node that sources or
  receives data. See [Install EDR](/influxdb3/edr/install/).
- A token store directory with auth and write tokens.
- Sufficient WAL retention on each source node. See
  [Size WAL retention](/influxdb3/edr/size-wal-retention/).

## Topology shapes

Every EDR deployment, however large, is composed of the same three node
shapes:

| Role | What its config has |
|---|---|
| **Upstream-only (edge)**—a pure source | a `downstream:` (or `downstreams:`) block |
| **Regional relay**—receives *and* forwards | both `upstreams:` and `downstream:` |
| **Downstream-only (hub)**—a pure sink | an `upstreams:` list |

A node with both `downstream` (or `downstreams`) and `upstreams` is a
regional hub: it receives from edges and forwards on. There's no
architectural depth limit; practical deployments are 2-3 levels.

## 1. Create a token store

```bash
mkdir -p /etc/edr/secrets

# Auth token—identifies this source to the destination.
openssl rand -hex 32 > /etc/edr/secrets/my-auth-token

# Write token—used by the destination's EDR agent to write into its
# local InfluxDB. Typically the destination's InfluxDB admin/operator token.
cp /path/to/destination-write-token /etc/edr/secrets/dest-write-token
```

## 2. Configure the source node

```yaml
# /etc/edr/config.yaml -- source node
name: "factory-floor-01"

downstream:
  name: "regional-hub"
  address: "http://hub.internal:9090"
  auth_token: "my-auth-token"         # name of file in token store
  historic_fill:
    mode: none                       # required -- none | full | since
  comms:
    interval_secs: 10
    degraded_after: 3
    unhealthy_after: 6
  retry:
    initial_backoff_secs: 1
    max_backoff_secs: 30
    multiplier: 2
```

## 3. Configure the destination node

```yaml
# /etc/edr/config.yaml -- destination node
name: "regional-hub"

upstreams:
  - name: "factory-floor-01"
    auth_token: "factory-01-auth"      # verifies the source's identity
    write_token: "dest-write-token"    # used to write into local InfluxDB
  - name: "factory-floor-02"
    auth_token: "factory-02-auth"
    write_token: "dest-write-token"
```

To build a regional relay (receives from edges and forwards to a central
hub), give one node both an `upstreams:` list and a `downstream:` block.

## 4. Start the agents

```bash
# Source node:
influxdb3-edr \
  --config /etc/edr/config.yaml \
  --data-dir /var/lib/influxdb3 \
  --token-store /etc/edr/secrets \
  --listen 0.0.0.0:9090 \
  --state-location /var/lib/edr/state \
  --poll-interval-ms 1000

# Destination node:
EDR_WRITE_ENDPOINT="http://localhost:8181" \
influxdb3-edr \
  --config /etc/edr/config.yaml \
  --data-dir /var/lib/influxdb3 \
  --token-store /etc/edr/secrets \
  --listen 0.0.0.0:9090 \
  --state-location /var/lib/edr/state
```

## 5. Verify

Open `http://127.0.0.1:9091/ui`—the embedded UI shows topology, health,
replication lag, and data-flow metrics. The UI and `/metrics` bind to
loopback by default (`--observability-listen`); expose them deliberately if
you need off-host access. See [Monitor EDR](/influxdb3/edr/monitor/).

## Next

- [Replicate to multiple destinations](/influxdb3/edr/replicate/to-multiple-destinations/)
  if this source also needs to feed a central archive.
- [Size WAL retention](/influxdb3/edr/size-wal-retention/) for your
  expected outage windows.
- [Troubleshoot EDR](/influxdb3/edr/troubleshoot/) if replication
  doesn't start flowing.
