---
title: Configure a load balancer for high availability
list_title: Configure a load balancer
description: >
  Put a Telegraf Controller high-availability cluster behind a load balancer.
  Health-check each node with the unauthenticated health endpoints and route web
  interface, API, and agent heartbeat traffic to healthy nodes.
menu:
  telegraf_controller:
    name: Configure a load balancer
    parent: High availability
weight: 102
related:
  - /telegraf/controller/high-availability/deploy/
  - /telegraf/controller/reference/config-options/
---

A [high-availability](/telegraf/controller/high-availability/) cluster runs
behind a load balancer that health-checks each node and routes around any node
that fails. {{% product-name %}} exposes unauthenticated health endpoints for
this purpose. This page describes those endpoints and shows worked
configurations for common load balancers.

{{< telegraf/enterprise-feature "High availability" >}}

- [Health endpoints](#health-endpoints)
- [Route traffic to healthy nodes](#route-traffic-to-healthy-nodes)
- [Example configurations](#example-configurations)

## Health endpoints

Each node exposes health endpoints designed as load-balancer probes. They are
unauthenticated, so a load balancer can probe them without credentials. The
`/health/*` endpoints listen on the API port
([`--port`](/telegraf/controller/reference/config-options/#port), default
`8888`). The Rust heartbeat server exposes a separate `/health` endpoint on the
heartbeat port
([`--heartbeat-port`](/telegraf/controller/reference/config-options/#heartbeat-port),
default `8000`).

| Endpoint             | Port           | Status codes | Body                     | Purpose                                                                                     |
| :------------------- | :------------- | :----------- | :----------------------- | :------------------------------------------------------------------------------------------ |
| `GET /health/live`   | API port       | `200`        | `{"status":"ok"}`        | Process liveness. Does not check the database. Use as a liveness probe.                      |
| `GET /health/ready`  | API port       | `200`, `503` | `{"ready":true\|false}`  | Node can serve web interface and API traffic. Use as the readiness probe for UI/API nodes.  |
| `GET /health/leader` | API port       | `200`, `503` | `{"leader":true\|false}` | Returns `200` only on the current leader. Use to locate the leader.                         |
| `GET /health`        | Heartbeat port | `200`, `503` | Status text              | Routing hint for heartbeat traffic. Heartbeat ingestion is always accepted, even on `503`.  |

When you serve the web interface on a separate port with
[`ui-port`](/telegraf/controller/reference/config-options/#ui-port), the
`/health/*` endpoints stay on the API port. The web interface port serves only
static files and has no health endpoint; health-check it with an HTTP `GET /`,
which returns the web interface with `200`.

## Route traffic to healthy nodes

By default, a {{% product-name %}} node serves the web interface and API together
on the API port and accepts agent heartbeats on the heartbeat port. You can also
serve the web interface on its own port with
[`ui-port`](/telegraf/controller/reference/config-options/#ui-port). Route each
class of traffic to nodes that pass the matching health check:

| Traffic                          | Port                                                | Health check                      |
| :------------------------------- | :-------------------------------------------------- | :-------------------------------- |
| Web interface and API (combined) | API port (`--port`, default `8888`)                 | `GET /health/ready` returns `200` |
| Web interface (separate port)    | UI port (`--ui-port`)                               | `GET /` returns `200`             |
| API (with a separate UI port)    | API port (`--port`, default `8888`)                 | `GET /health/ready` returns `200` |
| Agent heartbeat                  | Heartbeat port (`--heartbeat-port`, default `8000`) | `GET /health` returns `200`       |

Every licensed node serves web interface and API traffic, so distribute requests
across all healthy nodes. Sessions are validated with the shared `SESSION_SECRET`,
so sticky sessions are not required. Every node ingests heartbeats even when the
heartbeat `GET /health` returns `503`, so that check is a routing hint rather than
a gate.

> [!Note]
> Use `GET /health/leader` for diagnostics and for tools that need to reach the
> leader directly. Do not use it as the readiness probe for web interface and API
> traffic, because standby nodes serve that traffic too.

> [!Note]
> #### Serving the web interface on a separate port
>
> When you serve the web interface on its own port, route it as a separate pool.
> Because browsers reach the API through the load balancer's external address,
> also set
> [`public-api-url`](/telegraf/controller/reference/config-options/#public-api-url)
> and [`public-ui-url`](/telegraf/controller/reference/config-options/#public-ui-url)
> so the web interface calls the correct external API URL and the API's CORS
> checks allow the web interface origin. See
> [Public URLs and CORS](/telegraf/controller/reference/config-options/#public-urls-and-cors).

## Example configurations

The following examples serve the web interface and API together on the API port
and route agent heartbeat traffic separately, for a three-node cluster. Replace
the node addresses, ports, and health-check thresholds with values that match
your deployment. If you serve the web interface on its own port, add a third pool
for the UI port, health-checked with `GET /`.

{{< tabs-wrapper >}}
{{% tabs %}}
[HAProxy](#)
[NGINX](#)
[AWS Elastic Load Balancing](#)
[Other cloud load balancers](#)
{{% /tabs %}}
{{% tab-content %}}

Open-source HAProxy performs active HTTP health checks and stops routing to a
node that fails them. Configure one backend per traffic class:

```haproxy { placeholders="NODE_1_IP|NODE_2_IP|NODE_3_IP" }
frontend fe_web
    bind *:8888
    default_backend be_api

frontend fe_heartbeat
    bind *:8000
    default_backend be_heartbeat

backend be_api
    balance roundrobin
    option httpchk
    http-check send meth GET uri /health/ready
    http-check expect status 200
    server node1 NODE_1_IP:8888 check inter 3s fall 3 rise 2
    server node2 NODE_2_IP:8888 check inter 3s fall 3 rise 2
    server node3 NODE_3_IP:8888 check inter 3s fall 3 rise 2

backend be_heartbeat
    balance roundrobin
    option httpchk
    http-check send meth GET uri /health
    http-check expect status 200
    server node1 NODE_1_IP:8000 check inter 3s fall 3 rise 2
    server node2 NODE_2_IP:8000 check inter 3s fall 3 rise 2
    server node3 NODE_3_IP:8000 check inter 3s fall 3 rise 2
```

Replace
{{% code-placeholder-key %}}`NODE_1_IP`{{% /code-placeholder-key %}},
{{% code-placeholder-key %}}`NODE_2_IP`{{% /code-placeholder-key %}}, and
{{% code-placeholder-key %}}`NODE_3_IP`{{% /code-placeholder-key %}} with the
addresses of your {{% product-name %}} nodes.

{{% /tab-content %}}
{{% tab-content %}}

Open-source NGINX proxies traffic and passively removes a node after failed
responses, but it does not actively probe the health endpoints. For active
health checks against `/health/ready`, use NGINX Plus.

Open-source NGINX (passive checks):

```nginx { placeholders="NODE_1_IP|NODE_2_IP|NODE_3_IP" }
upstream tc_api {
    server NODE_1_IP:8888 max_fails=3 fail_timeout=10s;
    server NODE_2_IP:8888 max_fails=3 fail_timeout=10s;
    server NODE_3_IP:8888 max_fails=3 fail_timeout=10s;
}

upstream tc_heartbeat {
    server NODE_1_IP:8000 max_fails=3 fail_timeout=10s;
    server NODE_2_IP:8000 max_fails=3 fail_timeout=10s;
    server NODE_3_IP:8000 max_fails=3 fail_timeout=10s;
}

server {
    listen 8888;
    location / {
        proxy_pass http://tc_api;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

server {
    listen 8000;
    location / {
        proxy_pass http://tc_heartbeat;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

NGINX Plus (active checks):

```nginx { placeholders="NODE_1_IP|NODE_2_IP|NODE_3_IP" }
upstream tc_api {
    zone tc_api 64k;
    server NODE_1_IP:8888;
    server NODE_2_IP:8888;
    server NODE_3_IP:8888;
}

upstream tc_heartbeat {
    zone tc_heartbeat 64k;
    server NODE_1_IP:8000;
    server NODE_2_IP:8000;
    server NODE_3_IP:8000;
}

match tc_ready {
    status 200;
}

match tc_health {
    status 200;
}

server {
    listen 8888;
    location / {
        proxy_pass http://tc_api;
        health_check uri=/health/ready match=tc_ready interval=3s fails=3 passes=2;
    }
}

server {
    listen 8000;
    location / {
        proxy_pass http://tc_heartbeat;
        health_check uri=/health match=tc_health interval=3s fails=3 passes=2;
    }
}
```

Replace
{{% code-placeholder-key %}}`NODE_1_IP`{{% /code-placeholder-key %}},
{{% code-placeholder-key %}}`NODE_2_IP`{{% /code-placeholder-key %}}, and
{{% code-placeholder-key %}}`NODE_3_IP`{{% /code-placeholder-key %}} with the
addresses of your {{% product-name %}} nodes.

{{% /tab-content %}}
{{% tab-content %}}

On AWS, create a target group per traffic class and configure each target
group's health check to probe the node's health endpoint. This applies to both
Application Load Balancers (ALB) and Network Load Balancers (NLB).

| Target group          | Targets (port)  | Health check protocol | Health check path | Success codes |
| :-------------------- | :-------------- | :-------------------- | :---------------- | :------------ |
| Web interface and API | Nodes on `8888` | HTTP                  | `/health/ready`   | `200`         |
| Agent heartbeat       | Nodes on `8000` | HTTP                  | `/health`         | `200`         |

Create a target group for each traffic class with the AWS CLI:

```bash { placeholders="VPC_ID" }
# Web interface and API target group
aws elbv2 create-target-group \
  --name telegraf-controller-api \
  --protocol HTTP \
  --port 8888 \
  --vpc-id VPC_ID \
  --health-check-protocol HTTP \
  --health-check-path /health/ready \
  --matcher HttpCode=200

# Agent heartbeat target group
aws elbv2 create-target-group \
  --name telegraf-controller-heartbeat \
  --protocol HTTP \
  --port 8000 \
  --vpc-id VPC_ID \
  --health-check-protocol HTTP \
  --health-check-path /health \
  --matcher HttpCode=200
```

Replace {{% code-placeholder-key %}}`VPC_ID`{{% /code-placeholder-key %}} with
the ID of the VPC that contains your nodes, then register each node with both
target groups.

{{% /tab-content %}}
{{% tab-content %}}

Other cloud load balancers follow the same pattern. Configure the backend
service or health probe to send an HTTP `GET` to each node's health endpoint and
treat only `200` as healthy:

- **Web interface and API**: HTTP health check on the API port (`8888`) at path
  `/health/ready`, expecting `200`.
- **Agent heartbeat**: HTTP health check on the heartbeat port (`8000`) at path
  `/health`, expecting `200`.

For example, use a Google Cloud health check or an Azure Load Balancer health
probe with these settings. Consult your provider's documentation for the exact
field names.

{{% /tab-content %}}
{{< /tabs-wrapper >}}
