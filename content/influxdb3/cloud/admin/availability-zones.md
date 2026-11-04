---
title: Availability zones
seotitle: Availability zones in {{< product-name >}}
description: >
  Learn how the number of availability zones that your {{< product-name >}}
  instance uses affects its resilience to a zone failure.
menu:
  influxdb3_cloud:
    parent: Administer InfluxDB
    name: Availability zones
weight: 106
influxdb3/cloud/tags: [availability zones, resilience, admin ui]
related:
  - /influxdb3/cloud/admin/monitor-instance/
---

Each {{% product-name %}} instance runs in one or more availability zones of
its cloud provider region.
An availability zone is an isolated location within a region.
The number of zones that your instance uses affects its resilience to a zone
failure.

- [View your instance's availability zones](#view-your-instances-availability-zones)
- [Single-zone and multi-zone instances](#single-zone-and-multi-zone-instances)

## View your instance's availability zones

To see the zones that your instance uses, open the instance **Overview** page
in the Admin UI and find **Availability Zones** on the **Instance Details** card.
For more information, see
[View instance details](/influxdb3/cloud/admin/monitor-instance/#view-instance-details).

## Single-zone and multi-zone instances

- **Single-zone instance**: All of the instance's components run in one zone.
  That zone is a single point of failure, so a failure in the zone can make the
  instance unavailable, and traffic can't fail over to another zone.
- **Multi-zone instance**: The instance's components are spread across multiple
  zones, which improves resilience to a zone failure.

> [!Important]
> #### Connect using the instance URL
>
> Use the instance URL in your clients, not an IP address that it resolves to.
> The addresses behind the URL can change.
