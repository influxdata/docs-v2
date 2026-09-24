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

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/operations.md, docs/external/overview.md -->

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
[Manage tokens](/influxdb3/edr/manage-tokens/).

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

A node needs at least one of the following:

- `downstream` or `downstreams`—where it sends data.
- `upstreams`—who sends it data.

A node with both is a regional relay—see
[Replicate to InfluxDB 3 Enterprise](/influxdb3/edr/replicate/to-enterprise/)
for multi-hop topologies.

## Start the agents

```bash { placeholders="SOURCE_INSTANCE_DATA_DIR|DESTINATION_INSTANCE_PORT|DESTINATION_INSTANCE_DATA_DIR" }
# Source node:
influxdb3-edr \
  --config /etc/edr/source-config.yaml \
  --data-dir SOURCE_INSTANCE_DATA_DIR \
  --token-store /etc/edr/secrets \
  --listen 0.0.0.0:9090 \
  --state-location /var/lib/edr/source-state

# Destination node:
EDR_WRITE_ENDPOINT="http://localhost:DESTINATION_INSTANCE_PORT" \
influxdb3-edr \
  --config /etc/edr/destination-config.yaml \
  --data-dir DESTINATION_INSTANCE_DATA_DIR \
  --token-store /etc/edr/secrets \
  --listen 0.0.0.0:9190 \
  --state-location /var/lib/edr/destination-state
```

- {{% code-placeholder-key %}}`SOURCE_INSTANCE_DATA_DIR`{{% /code-placeholder-key %}}:
  the source InfluxDB instance's data directory
- {{% code-placeholder-key %}}`DESTINATION_INSTANCE_PORT`{{% /code-placeholder-key %}}:
  the destination InfluxDB instance's HTTP port
- {{% code-placeholder-key %}}`DESTINATION_INSTANCE_DATA_DIR`{{% /code-placeholder-key %}}:
  the destination InfluxDB instance's data directory

Each `influxdb3-edr` agent needs its own `--data-dir` (pointing at its
InfluxDB instance's object store), `--listen` address, and
`--state-location`, so the two agents on one host don't collide. See
[Install EDR](/influxdb3/edr/install/#configure-edr) for what each flag
does.

## Verify replication

Use each instance's own InfluxDB admin or database token—not the EDR
auth and write tokens from [Create a token store](#create-a-token-store),
which authenticate the agents to each other, not you to InfluxDB.

1. Write a point to the source instance:

   ```bash { placeholders="SOURCE_INSTANCE_PORT|SOURCE_INSTANCE_ADMIN_TOKEN" }
   curl -X POST "http://localhost:SOURCE_INSTANCE_PORT/api/v3/write_lp?db=getting_started" \
     --header "Authorization: Bearer SOURCE_INSTANCE_ADMIN_TOKEN" \
     --data-raw "edr_test,host=source value=1"
   ```

   - {{% code-placeholder-key %}}`SOURCE_INSTANCE_PORT`{{% /code-placeholder-key %}}:
     the source InfluxDB instance's HTTP port
   - {{% code-placeholder-key %}}`SOURCE_INSTANCE_ADMIN_TOKEN`{{% /code-placeholder-key %}}:
     an admin or database token for the source instance

2. Query the destination instance for the same point:

   ```bash { placeholders="DESTINATION_INSTANCE_PORT|DESTINATION_INSTANCE_ADMIN_TOKEN" }
   curl -G "http://localhost:DESTINATION_INSTANCE_PORT/api/v3/query_sql" \
     --header "Authorization: Bearer DESTINATION_INSTANCE_ADMIN_TOKEN" \
     --data-urlencode "db=getting_started" \
     --data-urlencode "q=SELECT * FROM edr_test"
   ```

   - {{% code-placeholder-key %}}`DESTINATION_INSTANCE_PORT`{{% /code-placeholder-key %}}:
     the destination InfluxDB instance's HTTP port
   - {{% code-placeholder-key %}}`DESTINATION_INSTANCE_ADMIN_TOKEN`{{% /code-placeholder-key %}}:
     an admin or database token for the destination instance

   The point EDR replicated from the source appears in the result.

3. Open `http://127.0.0.1:9091/ui` on the source host to watch the
   replication—the embedded UI shows topology, health, and lag. The UI and
   `/metrics` bind to loopback by default (`--observability-listen`);
   expose them deliberately if you need off-host access. See
   [Monitor EDR](/influxdb3/edr/monitor/).

## Test recovery

EDR delivers at-least-once, even across a destination outage:

1. Stop the destination agent.
2. Write more points to the source.
3. Restart the destination agent.

The destination catches up on the backlog it missed while stopped—no data
written at the source is lost. See
[EDR state and recovery](/influxdb3/edr/reference/state-and-recovery/) for
what the agent persists to make this possible. If an agent crashes rather
than stopping cleanly, see the
[log post-mortem playbook](/influxdb3/edr/troubleshoot/log-postmortem-playbook/)
to reconstruct what happened from its captured log.

## Next

- [Run the signals demo](/influxdb3/edr/demo/)—a fuller 4-node topology
  (edge to regional relay to central hub) that also demonstrates an
  intermittent link recovering.
- [Configuration file reference](/influxdb3/edr/reference/config-file/)—
  scope and bandwidth scheduling for production.
- [Replicate to multiple destinations](/influxdb3/edr/replicate/to-multiple-destinations/)—
  fan out one source to several destinations at once.
- [Monitor EDR](/influxdb3/edr/monitor/)—health, historic fill, and
  gap fill.
- [Troubleshoot EDR](/influxdb3/edr/troubleshoot/).

{{< page-nav prev="/influxdb3/edr/install/" prevText="Install EDR" next="/influxdb3/edr/demo/" nextText="Run the signals demo" >}}
