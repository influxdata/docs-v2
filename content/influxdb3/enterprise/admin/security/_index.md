---
title: Security
seotitle: Secure InfluxDB 3 Enterprise
description: >
  Secure {{% product-name %}}: authenticate clients with tokens, enable
  multi-user authentication and role-based access control (RBAC), and harden the
  host.
menu:
  influxdb3_enterprise:
    name: Security
    parent: Administer InfluxDB
weight: 205
---

Secure {{% product-name %}} at the authentication, authorization, and host
levels.

## Authentication

Verify the identity of clients and users that connect to {{% product-name %}}.

- [Manage tokens](/influxdb3/enterprise/admin/tokens/): Authenticate API and CLI
  requests with `apiv3_` tokens.
- [Manage users and authentication](/influxdb3/enterprise/admin/security/manage-users/):
  Enable multi-user authentication (preview) so users log in with individual
  credentials.

## Authorization

Control what authenticated users and tokens can do.

- [Role-based access control (RBAC)](/influxdb3/enterprise/reference/internals/rbac/):
  Assign built-in roles to users and understand the permissions model.

## Host hardening

- [Harden the host and service](/influxdb3/enterprise/admin/security/harden-the-host/):
  Configure systemd sandboxing and host-level filesystem protections.
