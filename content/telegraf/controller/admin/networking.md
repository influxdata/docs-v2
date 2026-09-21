---
title: Networking and ports
description: >
  Ports Telegraf Controller listens on, how to expose them safely, and how
  to run Telegraf Controller behind a reverse proxy or firewall.
menu:
  telegraf_controller:
    name: Networking and ports
    parent: Administer Telegraf Controller
weight: 103
draft: true
---

Understand the network surface of a {{% product-name %}} server and expose
it safely.

<!-- TODO: planned content for this page:
  - Port reference table: web interface and API port (`--port`/`APP_PORT`,
    default 8888), optional separate UI port (`--ui-port`/`UI_PORT`), and
    the agent heartbeat service port (`--heartbeat-port`/`HEARTBEAT_PORT`,
    default 8000).
  - The heartbeat listener is a separate HTTP server from the API server,
    with a different security posture: it accepts agent heartbeats and is
    not behind the API's authentication guards. Explain what should and
    should not be able to reach it (agents yes, the public internet no)
    and give firewall guidance.
  - Reverse proxies: running the web interface/API behind a reverse proxy,
    and how that interacts with built-in TLS
    (cross-link /telegraf/controller/install/secure-tls/).
  - Which ports a load balancer must forward in a high-availability
    deployment (cross-link /telegraf/controller/high-availability/).
-->
