---
title: Deploy a highly available Telegraf Controller cluster
list_title: Deploy a cluster
description: >
  Deploy multiple Telegraf Controller nodes against a shared PostgreSQL
  database, route traffic with a load balancer using the health endpoints, and
  tune PostgreSQL for fast failover.
menu:
  telegraf_controller:
    name: Deploy a cluster
    parent: High availability
weight: 101
related:
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/telegraf-enterprise/apply-license/
  - /telegraf/controller/reference/architecture/
---

Deploy multiple {{% product-name %}} nodes against a shared PostgreSQL database,
put them behind a load balancer, and let one node lead while the others stand
by. This guide covers configuring the nodes, routing traffic with the health
endpoints, and tuning PostgreSQL for quick failover.

{{< telegraf/enterprise-feature "High availability" >}}

- [Prerequisites](#prerequisites)
- [Provision shared PostgreSQL and secrets](#provision-shared-postgresql-and-secrets)
- [Enable high availability on each node](#enable-high-availability-on-each-node)
- [Apply the license](#apply-the-license)
- [Put the cluster behind a load balancer](#put-the-cluster-behind-a-load-balancer)
- [Tune PostgreSQL for fast failover](#tune-postgresql-for-fast-failover)
- [Verify leadership and failover](#verify-leadership-and-failover)

## Prerequisites

- A valid [Telegraf Enterprise license](/telegraf/enterprise/). You apply the
  license once; every node reads it from the shared database. See
  [Apply a license](/telegraf/controller/telegraf-enterprise/apply-license/).
- A PostgreSQL database that every node can reach over the network. You can use
  self-managed PostgreSQL or a PostgreSQL-compatible managed service. High
  availability does not support SQLite. See
  [Requirements and constraints](/telegraf/controller/high-availability/#requirements-and-constraints).
- Two or more hosts to run the {{% product-name %}} binary.
- A load balancer that can route traffic based on an HTTP health check.

## Provision shared PostgreSQL and secrets

Every node connects to the same PostgreSQL database and signs sessions with the
same secret.

1. Provision a PostgreSQL database and note its connection string. Connect nodes
   directly to PostgreSQL, or use a connection pooler in **session-pooling**
   mode. Transaction-pooling mode breaks leader election.

2. Generate a single `SESSION_SECRET` to share across all nodes. Reuse the same
   value on every node so a session stays valid regardless of which node serves
   the request.

   ```bash
   openssl rand -hex 32
   ```

> [!Important]
> #### Keep DATABASE_URL and SESSION_SECRET identical on every node
>
> A mismatched `DATABASE_URL` points a node at the wrong database, and a
> mismatched `SESSION_SECRET` invalidates sessions when the load balancer routes
> a user to a different node. The API, web interface, and heartbeat ports can
> differ between nodes.

## Enable high availability on each node

On every node, set `HA_ENABLED=true`, point `DATABASE_URL` at the shared
PostgreSQL database, and set the shared `SESSION_SECRET`. Start the binary the
same way you would a single node. You apply the license separately, once, in the
next step.

{{< tabs-wrapper >}}
{{% tabs %}}
[systemd](#)
[Shell](#)
[Windows (PowerShell)](#)
<!-- [Docker](#) -->
{{% /tabs %}}
{{% tab-content %}}

Add the high-availability variables to each node's systemd unit file (typically
`/etc/systemd/system/telegraf-controller.service`):

```ini { placeholders="POSTGRES_USER|POSTGRES_PASSWORD|POSTGRES_HOST|SHARED_SECRET" }
[Service]
Environment=HA_ENABLED=true
Environment=DATABASE_URL=postgresql://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOST:5432/telegraf_controller
Environment=SESSION_SECRET=SHARED_SECRET
```

Reload systemd and restart the service on each node:

```bash
sudo systemctl daemon-reload
sudo systemctl restart telegraf-controller
```

{{% /tab-content %}}
{{% tab-content %}}

Export the high-availability variables, then start the binary on each node:

```bash { placeholders="POSTGRES_USER|POSTGRES_PASSWORD|POSTGRES_HOST|SHARED_SECRET" }
export HA_ENABLED=true
export DATABASE_URL="postgresql://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOST:5432/telegraf_controller"
export SESSION_SECRET="SHARED_SECRET"

telegraf_controller --no-interactive
```

{{% /tab-content %}}
{{% tab-content %}}

Set the high-availability variables, then start the binary on each node:

```powershell { placeholders="POSTGRES_USER|POSTGRES_PASSWORD|POSTGRES_HOST|SHARED_SECRET" }
$env:HA_ENABLED="true"
$env:DATABASE_URL="postgresql://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOST:5432/telegraf_controller"
$env:SESSION_SECRET="SHARED_SECRET"

./telegraf_controller.exe --no-interactive
```

{{% /tab-content %}}
<!-- {{% tab-content %}} -->
<!-- BEGIN Docker example — hidden until an official
     influxdata/telegraf-controller Docker image is published, which is on the
     roadmap. Restore this tab (and its button above) when the image ships.

Pass the high-availability variables to each container:

```bash
docker run \
  -e HA_ENABLED=true \
  -e DATABASE_URL=postgresql://user:password@postgres.example.com:5432/telegraf_controller \
  -e SESSION_SECRET=SHARED_SECRET \
  influxdata/telegraf-controller
```

END Docker example -->
<!-- {{% /tab-content %}} -->
{{< /tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`POSTGRES_USER`{{% /code-placeholder-key %}} and
  {{% code-placeholder-key %}}`POSTGRES_PASSWORD`{{% /code-placeholder-key %}}:
  the credentials for the shared PostgreSQL database.
- {{% code-placeholder-key %}}`POSTGRES_HOST`{{% /code-placeholder-key %}}: the
  hostname or address of the shared PostgreSQL database, reachable from every
  node.
- {{% code-placeholder-key %}}`SHARED_SECRET`{{% /code-placeholder-key %}}: the
  shared session secret generated with `openssl rand -hex 32`, identical on
  every node.

Optionally, set
[`HA_POLL_INTERVAL_MS`](/telegraf/controller/reference/config-options/#ha-poll-interval-ms)
to change how quickly settings, token, and license changes propagate between
nodes. It defaults to `5000` (5 seconds).

## Apply the license

Apply your Telegraf Enterprise license to one of your {{% product-name %}}
nodes. Use either method:

- Set [`LICENSE_FILE_PATH`](/telegraf/controller/reference/config-options/#license-file-path)
  on one node at first startup to seed the license into the shared database.
- Apply the license through the user interface or API after the cluster is
  running.

Every node reads the license from the shared database and becomes licensed
within one poll interval, without a restart. For details, see
[Apply a license](/telegraf/controller/telegraf-enterprise/apply-license/).

After a license is present, one node acquires the leader lock and the rest stand
by. Confirm the cluster's state with the
[health endpoints](/telegraf/controller/high-availability/load-balancing/#health-endpoints).

## Put the cluster behind a load balancer

Run the cluster behind a load balancer that health-checks each node and routes
around any node that fails. Route each class of traffic using the node's
unauthenticated health endpoints:

- **Web interface and API** traffic: route to nodes that return `200` from
  `GET /health/ready` on the API port (default `8888`). If you serve the web
  interface on a separate
  [`ui-port`](/telegraf/controller/reference/config-options/#ui-port), route that
  port as its own pool, health-checked with `GET /`.
- **Agent heartbeat** traffic: route to nodes that return `200` from
  `GET /health` on the heartbeat port (default `8000`).

Because sessions are validated with the shared `SESSION_SECRET`, sticky sessions
are not required.

For the full list of health endpoints and example configurations for HAProxy,
NGINX, and cloud load balancers such as AWS Elastic Load Balancing, see
[Configure a load balancer](/telegraf/controller/high-availability/load-balancing/).

## Tune PostgreSQL for fast failover

When a leader shuts down gracefully, it releases the advisory lock and a standby
takes over almost immediately, typically within a second or two. When a leader
fails abruptly (a crash, a killed process, or a lost host), PostgreSQL must first
notice that the leader's connection is gone before another node can acquire the
lock. With default operating-system keepalive settings, that can take much
longer than a graceful handoff.

To bound failover time, shorten PostgreSQL's TCP keepalive settings so the server
detects dropped connections sooner:

```sql
ALTER SYSTEM SET tcp_keepalives_idle = 10;
ALTER SYSTEM SET tcp_keepalives_interval = 5;
ALTER SYSTEM SET tcp_keepalives_count = 3;
SELECT pg_reload_conf();
```

With settings in this range, failover after an abrupt failure completes in well
under a minute. Adjust the values to match your availability requirements and
network conditions. Throughout either kind of failover, the surviving nodes keep
ingesting agent heartbeats.

## Verify leadership and failover

1. Identify the current leader by querying each node's leader endpoint. Exactly
   one node returns `200`:

   ```bash
   curl -s http://node-1.example.com:8888/health/leader
   curl -s http://node-2.example.com:8888/health/leader
   ```

2. Confirm that each licensed node reports ready:

   ```bash
   curl -s http://node-1.example.com:8888/health/ready
   ```

3. Test failover by stopping the leader (for example, `sudo systemctl stop
   telegraf-controller` on the leader host). Within a few seconds, another
   node's `GET /health/leader` returns `200`, and the load balancer continues to
   serve web interface, API, and heartbeat traffic from the surviving nodes.
