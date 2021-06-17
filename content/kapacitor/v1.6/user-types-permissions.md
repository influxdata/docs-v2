---
title: Kapacitor user types and permissions
description: >
  View Kapacitor user types and permissions available when using internal
  Kapacitor authorizations.
menu:
  kapacitor_1_6_ref:
    name: User types & permissions
weight: 100
related:
  - /kapacitor/v1.6/administration/auth
  - /kapacitor/v1.6/administration/auth/kapacitor-auth
---

{{% note %}}
Kapacitor user types and permissions only apply when using
[internal Kapacitor authorizations](/kapacitor/v1.6/administration/auth/kapacitor-auth).
If using **InfluxDB Enterprise**, Kapacitor inherits user permissions from the
InfluxDB Enterprise authorization service.
{{% /note %}}

## User types
The following user types are available in Kapacitor:

- **admin**: Kapacitor user with full permissions.
- **normal**: Kapacitor user with explicitly set permissions.

## User permissions
The following user permissions are available in Kapacitor.
Multiple permissions can be assigned to a single [normal user](#user-types).

- **none**: Grant no permissions.
- **api**: Grant permissions for CRUD actions through the Kapacitor API.
- **config_api**: Grant permission to [configure Kapacitor through the API](/kapacitor/v1.6/administration/configuration/#configure-with-the-http-api).
- **write_points**: Grant permission to write points to Kapacitor.
- **all**: Grant all permissions.
