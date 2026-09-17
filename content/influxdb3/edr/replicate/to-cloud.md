---
title: Replicate to InfluxDB 3 Cloud
description: >
  Set up EDR to replicate data from InfluxDB 3 Enterprise to InfluxDB 3
  Cloud.
menu:
  influxdb3_edr:
    name: Replicate to Cloud
    parent: Replicate
weight: 2
---

Use EDR to replicate data from InfluxDB 3 Enterprise to
[InfluxDB 3 Cloud](/influxdb3/cloud/). This guide covers only what's
different when Cloud is the destination—auth and endpoint. For shared
configuration (token store, `historic_fill`, scope, bandwidth scheduling),
see [Configuration file reference](/influxdb3/edr/reference/config-file/).

<!-- TODO(pm): the source docs (docs/external/*.md) don't document a
Cloud-specific destination shape beyond "mode: direct" — confirm whether
InfluxDB 3 Cloud runs an EDR agent (agent-to-agent mode) or is always a
direct-mode destination, and what the production endpoint/auth flow looks
like, before publishing this page. See PLAN.md §9. -->

## Direct mode: write straight to InfluxDB 3 Cloud

When the destination does not run an EDR agent, EDR replicates directly to a
plain InfluxDB v3 write endpoint:

```yaml
downstream:
  name: "cloud-influx"
  address: "https://cloud.influxdata.com"
  auth_token: "cloud-api-token"
  mode: direct
```

In direct mode:

- There is no `/connect` handshake.
- Health checks use the destination's `GET /health`.
- No topology is propagated to the destination.
- Auth failures and schema conflicts are handled identically to
  agent-to-agent mode.
- The `pt` wire encoding is not available—direct mode always uses `lp`
  (Line Protocol).

Replace `cloud-api-token` with a token-store entry containing an InfluxDB 3
Cloud API token with write access to the target database. See
[Manage tokens](/influxdb3/edr/manage-tokens/).

## Compatibility

EDR's agent-to-agent compatibility matrix (protocol version negotiation,
storage-format preflight) applies to hops between two `influxdb3-edr`
agents. A direct-mode connection to InfluxDB 3 Cloud doesn't negotiate an
agent protocol version—compatibility is governed by the InfluxDB 3 write
API itself. See
[Compatibility](/influxdb3/edr/reference/compatibility/) for the full
agent-to-agent and agent-to-InfluxDB compatibility matrices.

## Next

- [Size WAL retention](/influxdb3/edr/size-wal-retention/) on the
  source Enterprise instance to cover your expected outage windows.
- [Monitor EDR](/influxdb3/edr/monitor/) to watch replication health
  and lag to Cloud.
