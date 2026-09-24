---
title: Networking and ports
description: >
  When you run Telegraf Controller, identify the ports and listeners it uses, determine which clients need access to each one, and expose them safely with Transport Layer Security (TLS), firewalls, and reverse proxies.
menu:
  telegraf_controller:
    name: Networking and ports
    parent: Administer Telegraf Controller
weight: 105
related:
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/admin/secure-tls/
  - /telegraf/controller/admin/high-availability/load-balancing/
---

{{% product-name %}} serves different kinds of traffic on different ports.
When you run {{% product-name %}}, identify the ports and listeners it uses, determine which clients need access to each one, and expose them safely with Transport Layer Security (TLS), firewalls, and reverse proxies.

- [Ports and listeners](#ports-and-listeners)
- [Expose the right ports](#expose-the-right-ports)
- [TLS](#tls)
- [Reverse proxies and public URLs](#reverse-proxies-and-public-urls)
- [High availability](#high-availability)
- [Outbound connections](#outbound-connections)

## Ports and listeners

{{% product-name %}} starts up to three HTTP listeners.
Each listens on all network interfaces, so use your firewall to control
which networks can reach each port.

| Listener                 | Default port | Configure with                                                             | Used by                                                    |
| :----------------------- | :----------- | :------------------------------------------------------------------------- | :--------------------------------------------------------- |
| Web interface and API    | `8888`       | [`port`](/telegraf/controller/reference/config-options/#port)               | Browsers, API clients, and agents fetching configurations   |
| Web interface (optional) | Not set      | [`ui-port`](/telegraf/controller/reference/config-options/#ui-port)         | Browsers, when the web interface is served on its own port  |
| Agent heartbeat service  | `8000`       | [`heartbeat-port`](/telegraf/controller/reference/config-options/#heartbeat-port) | Telegraf agents sending heartbeats                    |

The agent heartbeat service is a separate HTTP server embedded in the same
{{% product-name %}} process.
Requests to it require an API token.
Both the API listener and the heartbeat listener also expose unauthenticated
health endpoints designed for load balancers and monitoring.
See
[Health endpoints](/telegraf/controller/admin/high-availability/load-balancing/#health-endpoints).

## Expose the right ports

- **Browsers** need the web interface and API port.
  If you serve the web interface on a separate port with
  [`ui-port`](/telegraf/controller/reference/config-options/#ui-port),
  browsers load the interface from that port and call the API directly, so
  they need both ports.
- **Telegraf agents** need the web interface and API port to fetch
  configurations and the heartbeat port to send heartbeats.
- **Load balancers and monitoring systems** need whichever ports they
  probe for health.

No other inbound access is required.
Where possible, keep all ports off the public internet and restrict them to
the networks that need them.

> [!Warning]
> If you turn off authentication for endpoint groups with
> [`disable-auth-endpoints`](/telegraf/controller/reference/config-options/#disable-auth-endpoints),
> anyone with network access to those endpoints can use them without an API
> token.
> Before turning off authentication for the `heartbeat` or `agents` groups,
> make sure your firewall restricts those ports to networks you trust.

## TLS

One certificate and key pair
([`ssl-cert-path`](/telegraf/controller/reference/config-options/#ssl-cert-path)
and
[`ssl-key-path`](/telegraf/controller/reference/config-options/#ssl-key-path))
enables HTTPS on all listeners: the web interface and API, the separate web
interface port if configured, and the agent heartbeat service.
For setup, certificate options, and configuring agents to trust the
certificate, see
[Secure with TLS](/telegraf/controller/admin/secure-tls/).

## Reverse proxies and public URLs

When {{% product-name %}} runs behind a reverse proxy, or port remapping
changes the addresses clients use, adjust the URLs {{% product-name %}}
presents:

- **Public endpoints**: set the **User Interface URL**, **API URL**, and
  **Heartbeat URL** in settings so that invite links, agent commands, and
  generated heartbeat configuration use the external addresses.
  See [Public endpoints](/telegraf/controller/settings/#public-endpoints).
- **Split web interface mode**: when
  [`ui-port`](/telegraf/controller/reference/config-options/#ui-port) is set
  and a proxy changes the URL or port browsers use, configure the API URL
  the web interface calls and the origins the API accepts.
  See
  [Public URLs and CORS](/telegraf/controller/reference/config-options/#public-urls-and-cors).

## High availability

In a [high-availability cluster](/telegraf/controller/admin/high-availability/),
the load balancer routes web interface and API traffic to each node's API
port and agent heartbeat traffic to each node's heartbeat port, using the
unauthenticated health endpoints as probes.
See
[Configure a load balancer](/telegraf/controller/admin/high-availability/load-balancing/).

## Outbound connections

{{% product-name %}} also opens outbound connections that restricted
networks may need to allow:

- **Database**: your PostgreSQL server, if you
  [use PostgreSQL](/telegraf/controller/admin/database/) instead of SQLite.
- **Authentication providers**: your LDAP or OIDC provider, when
  [configured](/telegraf/controller/authentication/).
- **Audit log forwarding**: your syslog or webhook destinations, when
  [audit log forwarding](/telegraf/controller/admin/audit-logs/enable-configure/)
  is configured.

<!-- TODO: document analytics/telemetry outbound connections here alongside
  the planned telemetry pipeline update. Details in PLAN.md. -->

