---
title: EDR limitations
description: >
  What EDR is not, and known implementation limitations tracked for future
  releases.
menu:
  influxdb3_edr:
    name: Limitations
    parent: Reference
weight: 207
---

## What EDR is not

EDR is not a synchronous replication layer, a conflict resolution system, a
backup tool, or a transformation layer. The destination is eventually
consistent. Data arrives byte-for-byte as written at the source, scoped to
the configured databases/tables.

EDR is specified exclusively for the PachaTree storage engine and its
associated data formats. The Parquet-based storage engine is not supported.

EDR is a commercial feature of InfluxDB 3 Enterprise. It is distinct from
the open source Synchronizer plugin and is not available with InfluxDB 3
Core as a source. In deployments where Core might otherwise be chosen for
its simplicity, InfluxDB 3 Enterprise can be deployed as a single node to
serve as an EDR source.

## Known implementation limitations

Current limitations of the implementation:

1. **No retention hold enforcement.** The agent requests holds on Gen0/cv2
   files during recovery but the InfluxDB compactor does not enforce them.
   Correctness does not depend on holds (recovery falls through WAL to cv2
   with per-file tracking), but a hold would narrow boundary overlap,
   reduce over-replication, and close the residual window where a file
   deleted mid-recovery defers to a wider cv2 pass. This is an outstanding
   ask of the InfluxDB team.
2. **Receiver-side scope enforcement is not implemented.** The downstream
   does not validate incoming data against the upstream's declared scope.
   In peer-to-peer topologies, sender-side scope filtering is currently the
   only guard against circular amplification. If you're evaluating EDR for
   a multi-tenant or systems-integrator deployment, tenant isolation relies
   on sender-side config discipline, not a receiver-enforced guarantee.
3. **Silent windows are not propagated to the downstream.** A fully silent
   schedule window (`silent_reports: false`) causes the downstream to mark
   the channel unhealthy even though the silence is intentional.
4. **Decommission endpoint removed.** A stubbed, unauthenticated
   decommission endpoint was removed rather than hardened; retire an
   upstream via config and token revocation.
5. **PT-wire partial application.** A multi-database PT batch that fails
   partway may have applied earlier databases; the failure is reported to
   the sender without classification (schema vs auth vs write). Idempotent
   re-delivery converges the state, but error reporting should improve.
6. **Topology cycle rendering.** The UI tree renderer does not detect
   cycles; peer-to-peer topologies need `share_topology: false` on both
   peers.
7. **Historic fill over-replication residue.** Sending whole cv2 files
   over-delivers for windows narrower than the file; block-level time
   filters help only time-partitioned workloads. Row-level filtering at
   encode time is future work.
8. **Series disjointness is unenforced.** When multiple upstreams write to
   the same downstream table, each series (database + table + tag set)
   should be owned by exactly one upstream, so per-point write ordering
   stays a purely local concern within one upstream's stream. This is a
   documented operator responsibility, not enforced.
9. **Open downstream registration, upstream/downstream scale-out, and
   Cloud-as-upstream** are design-stage items, not yet implemented.

## Sizing and capacity

The public documentation doesn't currently publish RAM/CPU minimums for a
constrained gateway, or a disk-footprint-per-device-stream formula at a
given cardinality. Size WAL retention to your expected outage window—see
[Size WAL retention](/influxdb3/edr/admin/size-wal-retention/)—and test
your specific workload's cardinality and write volume before committing to
constrained hardware.

## Fleet upgrade orchestration

EDR's protocol negotiation supports mixed-version fleets without
configuration (see [Compatibility](/influxdb3/edr/reference/compatibility/)),
and the recommended order is to upgrade the reader (EDR) before the source
server. Orchestrating an EDR upgrade across many unattended edge nodes—for
example, with configuration management or fleet-rollout tooling—is outside
the scope of this documentation.
