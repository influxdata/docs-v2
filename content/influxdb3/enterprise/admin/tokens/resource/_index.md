---
title: Manage resource tokens
seotitle: Manage resource tokens in {{< product-name >}} 
description: >
  Manage resource tokens in your {{< product-name >}} instance.
  Resource tokens grant permissions on specific resources, such as databases
  and system information endpoints in your {{< product-name >}} instance.
  Database resource tokens allow for actions like writing and querying data.
menu:
  influxdb3_enterprise:
    parent: Manage tokens
    name: Resource tokens
weight: 101
influxdb3/enterprise/tags: [tokens]
---

Manage resource tokens in your {{< product-name >}} instance.
Resource tokens provide scoped access to specific resources:

- **Database tokens**: provide access to specific databases for actions like writing and querying data
- **System tokens**: provide access to system-level resources, such as API endpoints for server runtime statistics and health.

Resource tokens are user-defined and available only in {{% product-name %}}.

{{< children depth="1" >}}

