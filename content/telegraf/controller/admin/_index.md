---
title: Administer Telegraf Controller
description: >
  Manage a Telegraf Controller server: manage and troubleshoot the
  database, monitor server health, configure networking, and run
  Telegraf Controller as a system service.
menu:
  telegraf_controller:
    name: Administer Telegraf Controller
weight: 13
related:
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/install/
---

Administer and operate a {{% product-name %}} server.
This section covers operator-level tasks: managing the database that stores
{{% product-name %}} data, monitoring server health, and configuring the
server's runtime environment.

{{< children >}}

## Other administration tasks

Additional operator documentation lives in the following sections:

- [Install {{% product-name %}}](/telegraf/controller/install/):
  download, install, and set up the server and its database.
- [Secure with TLS](/telegraf/controller/install/secure-tls/):
  enable HTTPS with your own certificates.
- [Upgrade](/telegraf/controller/install/upgrade/):
  upgrade to a new version of {{% product-name %}}.
- [Troubleshoot installation](/telegraf/controller/install/troubleshoot/):
  resolve installation and startup issues.
- [High availability](/telegraf/controller/high-availability/):
  deploy a multi-instance cluster behind a load balancer.
- [Audit logs](/telegraf/controller/audit-logs/):
  record security-relevant events to a tamper-evident audit log.
- [Authentication](/telegraf/controller/authentication/):
  configure local, LDAP, or OIDC authentication.
