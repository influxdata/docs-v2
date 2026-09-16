---
title: Get started with EDR
description: >
  Set up two InfluxDB 3 Enterprise instances on one host, configure EDR to
  replicate between them, and verify a point written at the source arrives
  at the destination.
menu:
  influxdb3_edr:
    name: Get started
weight: 3
---

This guide takes you from two running InfluxDB 3 Enterprise instances to a
replicated point you can query at the destination. It uses EDR's native
binaries and one host with two instances, so you don't need a second
machine to see EDR work.

1. [Before you begin](#before-you-begin)
2. [Create a token store](#create-a-token-store)
3. [Configure the source node](#configure-the-source-node)
4. [Configure the destination node](#configure-the-destination-node)
5. [Start the agents](#start-the-agents)
6. [Verify replication](#verify-replication)
7. [Test recovery](#test-recovery)
8. [Next](#next)

## Before you begin

Start two InfluxDB 3 Enterprise instances on the host, each on the
[upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)
and its own data directory and port—one to act as the EDR source, one as
the destination. If you don't have InfluxDB 3 Enterprise running yet, see
[Get started with InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/).

Also [install the EDR binaries](/influxdb3/edr/install/) on the host. If
you'd rather run EDR in containers, see
[Run EDR in Docker](/influxdb3/edr/install/docker/) instead of the native
steps below—the configuration is the same either way.

EDR runs as a separate agent process (`influxdb3-edr`) alongside each
InfluxDB 3 Enterprise instance, reading its object store directly. The
InfluxDB binary itself is unmodified. For the full component and topology
model, see [EDR architecture](/influxdb3/edr/reference/architecture/).

## Create a token store

Each agent resolves its tokens from a token store: a directory of
plain-text files, one file per token.

```bash
mkdir -p /etc/edr/secrets

# Auth token—identifies the source to the destination.
openssl rand -hex 32 > /etc/edr/secrets/source-auth-token

# Write token—used by the destination's EDR agent to write into its
# local InfluxDB. Typically the destination's InfluxDB admin/operator token.
cp /path/to/destination-write-token /etc/edr/secrets/dest-write-token
```

For rotation, ownership, and Vault guidance, see
[Manage tokens](/influxdb3/edr/admin/manage-tokens/).

## Configure the source node

```yaml
# /etc/edr/source-config.yaml
name: "source"

downstream:
  name: "destination"
  address: "http://localhost:9190"     # the destination agent's --listen
  auth_token: "source-auth-token"      # name of file in token store
  historic_fill:
    mode: none                         # required—choose: none | full | since
```

`historic_fill` is required on every `downstream` entry—the agent refuses
to start without it. This walkthrough uses `mode: none` (live-only): EDR
replicates only data written after the agent starts, and doesn't backfill
data already on the source. `full` backfills all pre-existing data before
switching to live; `since` backfills data written after a given time. For
the complete semantics, see
[Configuration file reference](/influxdb3/edr/reference/config-file/).

## Configure the destination node

```yaml
# /etc/edr/destination-config.yaml
name: "destination"

upstreams:
  - name: "source"
    auth_token: "source-auth-token"    # verifies the source's identity
    write_token: "dest-write-token"    # used to write into local InfluxDB
```

A node needs at least one of `downstream`/`downstreams` (where it sends
data) or `upstreams` (who sends it data). A node with both is a regional
relay—see [Replicate to InfluxDB 3 Enterprise](/influxdb3/edr/admin/replicate-to-enterprise/)
for multi-hop topologies.

## Start the agents

```bash
# Source node:
influxdb3-edr \
  --config /etc/edr/source-config.yaml \
  --data-dir <source-instance-data-dir> \
  --token-store /etc/edr/secrets \
  --listen 0.0.0.0:9090 \
  --state-location /var/lib/edr/source-state

# Destination node:
EDR_WRITE_ENDPOINT="http://localhost:<destination-instance-port>" \
influxdb3-edr \
  --config /etc/edr/destination-config.yaml \
  --data-dir <destination-instance-data-dir> \
  --token-store /etc/edr/secrets \
  --listen 0.0.0.0:9190 \
  --state-location /var/lib/edr/destination-state
```

Each `influxdb3-edr` agent needs its own `--data-dir` (pointing at its
InfluxDB instance's object store), `--listen` address, and
`--state-location`, so the two agents on one host don't collide. See
[Install EDR](/influxdb3/edr/install/#configure-edr) for what each flag
does.

## Verify replication

1. Write a point to the source instance:

   ```bash
   curl -X POST "http://localhost:<source-instance-port>/api/v3/write_lp?db=getting_started" \
     --data-raw "edr_test,host=source value=1"
   ```

2. Query the destination instance for the same point:

   ```bash
   curl -G "http://localhost:<destination-instance-port>/api/v3/query_sql" \
     --data-urlencode "db=getting_started" \
     --data-urlencode "q=SELECT * FROM edr_test"
   ```

   The point EDR replicated from the source appears in the result.

3. Open `http://127.0.0.1:9091/ui` on the source host to watch the
   replication—the embedded UI shows topology, health, and lag. The UI and
   `/metrics` bind to loopback by default (`--observability-listen`);
   expose them deliberately if you need off-host access. See
   [Monitor EDR](/influxdb3/edr/admin/monitor/).

## Test recovery

EDR delivers at-least-once, even across a destination outage:

1. Stop the destination agent.
2. Write more points to the source.
3. Restart the destination agent.

The destination catches up on the backlog it missed while stopped—no data
written at the source is lost. See
[EDR state and recovery](/influxdb3/edr/reference/state-and-recovery/) for
what the agent persists to make this possible.

## Next

- [Run the signals demo](/influxdb3/edr/demo/)—a fuller 4-node topology
  (edge to regional relay to central hub) that also demonstrates an
  intermittent link recovering.
- [Manage EDR](/influxdb3/edr/admin/)—configure scope, bandwidth
  scheduling, and multi-destination fan-out for production.
- [Monitor EDR](/influxdb3/edr/admin/monitor/)—health, historic fill, and
  gap fill.
- [Troubleshoot EDR](/influxdb3/edr/admin/troubleshoot/)—when something
  looks wrong.
