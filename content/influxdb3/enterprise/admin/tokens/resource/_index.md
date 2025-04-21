---
title: Manage resource tokens
seotitle: Manage resource tokens in {{< product-name >}} 
description: >
  Manage resource tokens in your {{< product-name >}} instance.
  Resource tokens grant fine-grained permissions on resources, such as databases
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
Resource tokens grant fine-grained permissions on resources, such as databases
and system information endpoints in your {{< product-name >}} instance.
  
- **Databases**: Database tokens allow for actions like writing and querying data.

- **System resources**: System information tokens allow read access to server runtime statistics and health.
  Access controls for system information API endpoints help prevent information leaks and attacks (such as DoS).

{{< children depth="1" >}}

