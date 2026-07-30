---
title: High availability
description: >
  Run multiple Telegraf Controller nodes against a shared PostgreSQL database
  for continuous availability. One node is elected leader to run cluster-wide
  background work while every node serves traffic, and a standby takes over if
  the leader fails.
menu:
  telegraf_controller:
    name: High availability
weight: 11
cascade:
  metadata: [Telegraf Enterprise]
related:
  - /telegraf/controller/high-availability/deploy/
  - /telegraf/controller/reference/architecture/
  - /telegraf/controller/reference/config-options/
  - /telegraf/enterprise/
---

High availability lets you run more than one {{% product-name %}} node against a
shared PostgreSQL database so that management operations continue if a node
fails. One node is elected **leader** and performs cluster-wide work; the
remaining nodes stand by, ready to take over. Every node keeps accepting agent
heartbeats, so agent monitoring continues without interruption during a
failover.

{{< telegraf/enterprise-feature "High availability" >}}

- [How high availability works](#how-high-availability-works)
- [What runs on the leader](#what-runs-on-the-leader)
- [Requirements and constraints](#requirements-and-constraints)
- [How configuration changes propagate](#how-configuration-changes-propagate)
- [How licensing affects high availability](#how-licensing-affects-high-availability)
- [Audit logs in a cluster](#audit-logs-in-a-cluster)

## How high availability works

When you set `HA_ENABLED=true`, each {{% product-name %}} node connects to the
same PostgreSQL database and competes for a single PostgreSQL advisory lock. The
node that holds the lock is the **leader**. The other nodes are **standbys**
that continuously try to acquire the lock and take over the moment it becomes
available.

- **Leader**: holds the advisory lock, serves the web interface and API,
  accepts agent heartbeats, and runs all cluster-wide background work.
- **Standby**: connects to the same database, accepts agent heartbeats, and
  serves the web interface and API to whichever node the load balancer routes
  to, but does not run cluster-wide background work.

Each node re-evaluates leadership every few seconds. If the leader releases the
lock during a graceful shutdown, or its database connection drops after a crash,
a standby acquires the lock and becomes the new leader.

Coordination happens entirely through the shared database. Nodes do not
communicate with each other directly, so no quorum, voting, or separate
coordination service is required.

## What runs on the leader

Some work must happen exactly once for the whole cluster. {{% product-name %}}
runs the following only on the leader:

- **Agent status evaluation**: the background scheduler that marks agents as
  `not_reporting` when they miss heartbeats, restores them to `ok` when
  heartbeats resume, and applies reporting-rule retention.
- **Usage telemetry**: the cluster reports anonymous usage once, from the leader
  only, so the cluster counts as a single instance.

Every node, leader or standby, continues to:

- Accept agent heartbeats on the heartbeat port.
- Serve the web interface and API to authenticated users when the instance is
  licensed.

Because every node ingests heartbeats, agents keep reporting throughout a
leadership change.

## Requirements and constraints

Running {{% product-name %}} in a highly available configuration requires the
following:

- **A Telegraf Enterprise license.** The license is stored in the shared
  database, so you apply it once and every node reads it. Leadership election
  runs only while the license is valid, expiring, or within its grace period.
  See [How licensing affects high availability](#how-licensing-affects-high-availability).
- **PostgreSQL.** High availability depends on a PostgreSQL advisory lock and
  shared state. You can use self-managed PostgreSQL or a PostgreSQL-compatible
  database, such as a managed PostgreSQL service, as long as it supports
  session-level advisory locks. SQLite is single-writer and cannot coordinate
  multiple nodes; if you set `HA_ENABLED=true` with a SQLite database,
  {{% product-name %}} exits at startup with an error.
- **A direct PostgreSQL connection.** A leader holds its advisory lock on a
  single database session for as long as it leads. A connection pooler in
  transaction-pooling mode, such as PgBouncer, breaks this because it does not
  keep one session bound to the node. Connect directly to PostgreSQL, or use a
  pooler in session-pooling mode.
- **An identical `SESSION_SECRET` and `DATABASE_URL` on every node.** A shared
  `SESSION_SECRET` keeps a user's session valid on whichever node the load
  balancer routes them to, so sticky sessions are not required. A shared
  `DATABASE_URL` points every node at the same database.
- **At least two nodes** for redundancy. There is no upper limit, but each node
  holds a PostgreSQL connection, so size the database's `max_connections`
  accordingly.

> [!Note]
> #### Ports can differ between nodes
>
> `SESSION_SECRET` and `DATABASE_URL` must match on every node, but the API, web
> interface, and heartbeat ports can differ. Set them per node with
> [`--port`](/telegraf/controller/reference/config-options/#port),
> [`--ui-port`](/telegraf/controller/reference/config-options/#ui-port), and
> [`--heartbeat-port`](/telegraf/controller/reference/config-options/#heartbeat-port).

## How configuration changes propagate

Each node caches settings, API tokens, and license state in memory. When a
change is written on any node, {{% product-name %}} records a new cache version
in the shared database, and every node reloads the affected data on its next
poll.

The poll interval is set by
[`HA_POLL_INTERVAL_MS`](/telegraf/controller/reference/config-options/#ha-poll-interval-ms)
and defaults to `5000` (5 seconds). This interval is the upper bound on how long
a settings, token, or license change takes to apply across the cluster. Lower it
for faster convergence, or raise it to reduce database polling.

## How licensing affects high availability

Because the license lives in the shared database, every node evaluates the same
license state. A node attempts to become leader only while the license is valid.
The license state determines whether a node can lead and whether it serves web
interface and API traffic:

| License state                    | Elects a leader? | Leader serves UI/API | Standby serves UI/API |
| :------------------------------- | :--------------: | :------------------: | :-------------------: |
| Valid, expiring, or grace period |       Yes        |         Yes          |          Yes          |
| Expired (past grace period)      |  No new leader   |         Yes          |    No (returns 503)   |
| Unlicensed                       |        No        |   No leader elected  |    No (returns 503)   |

Agent heartbeats are always accepted on every node, regardless of license state.

Licensing is checked when a node tries to acquire the lock, not continuously. A
node that is already the leader when its license expires keeps the lock, but no
standby can be promoted until you apply a valid license again. After you restore
a license, a leader is elected within one election interval (a few seconds). For
the full license lifecycle, see
[License enforcement](/telegraf/controller/telegraf-enterprise/license-enforcement/).

## Audit logs in a cluster

[Audit logging](/telegraf/controller/audit-logs/) is **per node**, not shared.
Each node writes its own tamper-evident audit files, maintains its own hash
chain, and forwards events to whatever destination that node is configured to
use. Querying a node's [audit log API](/telegraf/controller/audit-logs/view/)
returns only that node's events.

To review activity across the whole cluster, forward each node's audit events to
a shared destination, such as syslog or a webhook, and aggregate them there. See
[Forward audit events](/telegraf/controller/audit-logs/enable-configure/#forward-audit-events).

> [!Important]
> #### Tamper detection is per node
>
> Each node maintains its own
> [hash chain](/telegraf/controller/audit-logs/#tamper-detection) and sequence
> numbers, so events from different nodes merged into one time-ordered stream do
> not form a single valid chain. Verify integrity per node: separate aggregated
> events by their originating node, then check each node's chain on its own.
>
> Keep forwarded events separable by node. File forwarding writes a separate file
> per node, and syslog forwarding tags each event with the originating host.
> Webhook payloads do not include a node identifier, so send each node's events
> to a distinct webhook endpoint when you need to tell nodes apart.

{{< children hlevel="h2" >}}
