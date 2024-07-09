---
title: License Enforcement
description: >
  Details of Licensing expiry and grace period behavior.
weight: 110
menu:
  influxdb_clustered:
    parent: Reference
influxdb/clustered/tags:
  - licensing
related:
  - /influxdb/clustered/install/licensing/
---

This document outlines license enforcement mechanisms in InfluxDB 3.0
Clustered.

# A valid License is required

IOx pods running in your cluster must have a valid `License` issued by
InfluxData in order to run. If there is no `License` installed in your cluster,
one of two things may happen:

* IOx pods may become stuck in a `ContainerCreating` state if the cluster has
never had a valid `License` installed.
* If an invalid license (eg it is expired or has been tampered with) is
installed in the cluster then the pods will become stuck in a
`CrashLoopBackoff` state since the IOx pod containers will attempt to start,
detect the invalid license condition, print an error message, then exit with a
non-zero exit code.

If a valid `License` expires during normal opreation and the grace period
configured into the license runs out, IOx pods will enter the
`CrashLoopBackoff` state described above.

# Periodic Update Checks

During the course of normal operation, IOx pods will check for an updated
license once per hour. You may occasionally see messages in the pod logs
related to this behavior.

# License Grace Period

When a `License` is issued, it is configured with two expiry dates. The first
expiry date is the expiry of the contractual license. The second, is a hard
expiry of the license credentials themselves after which IOx pods will begin
crashlooping until a new valid license is installed in the cluster.

The period of time between the contractual license expiry and the hard license
expiry is considered a "grace period". The standard grace period is expected to
be 90 days, but this may be negotiated as needed with your Sales
representative.

## License Expiry Logs

The table below outlines License expiry logging behavior. It shows when the log
messages begin, the type (Warn vs Error), and the periodicity at which they
repeat.

| Starts At             | Log Type | Log Periodicity |
| ---------             | -------- | --------------- |
| 1 month before expiry | Warn     | 1 msg / hour    |
| 1 week before expiry  | Warn     | 1 msg / 5 min   |
| At expiry             | Error    | 1 msg / 5 min   |

## Query Brownout

Starting one month after contractual `License` expiry, the InfluxDB 3.0 Querier
begins "browning out" requests. Brownouts consist of returning
`FailedPrecondition` response codes to queries for some portion of every hour.

| Starts At            | Brownout Coverage |
| ---------            | ---------------   |
| 7 days after expiry  | 5 minutes / hour  |
| 1 month after expiry | 100% of queries   |

It's important to emphasize that **these brownouts only occur *after the
license has contractually expired** and have no impact on normal InfluxDB 3.0
operations. Also, they **only impact query operations**, and not any other
operations (write-oriented operations, compaction, garbage collection).
