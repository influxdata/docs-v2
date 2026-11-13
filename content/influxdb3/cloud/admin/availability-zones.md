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
  - /influxdb3/cloud/reference/regions/
---

Each {{% product-name %}} instance runs in one or more availability zones of
its cloud provider region.
The number of zones that your instance uses affects its resilience to a zone
failure.

What an availability zone is, and the uptime commitments that apply to it,
depend on your cloud provider:

- **AWS**: [Availability Zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones)
  and the [Amazon Compute Service Level Agreement](https://aws.amazon.com/compute/sla/)
- **Azure**: [Azure availability zones](https://learn.microsoft.com/azure/reliability/availability-zones-overview)
  and the [Azure service level agreements](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services)

These agreements cover the cloud provider's infrastructure, not
{{% product-name %}}.

Not all cloud provider regions are available for {{% product-name %}}.
For the available regions and how to request one, see
[Supported regions](/influxdb3/cloud/reference/regions/).

- [View your instance's availability zones](#view-your-instances-availability-zones)
- [Single-zone and multi-zone instances](#single-zone-and-multi-zone-instances)

## View your instance's availability zones

To see the zones that your instance uses, open the instance **Overview** page
in the Admin UI and find **Availability Zones** on the **Instance Details** card.
For more information, see
[View instance details](/influxdb3/cloud/admin/monitor-instance/#view-instance-details).

## Single-zone and multi-zone instances

- **Single-zone instance**: All of the instance's components run in one zone.
  A failure in that zone can make the instance unavailable, and the instance
  doesn't fail over to another zone.
- **Multi-zone instance**: The instance's components are spread across multiple
  zones, which improves resilience to a zone failure.

If **Availability Zones** shows a dash (—), the instance isn't restricted to
specific zones.

> [!Important]
> #### Connect using the instance URL
>
> Use the instance URL in your clients, not an IP address that it resolves to.
> The addresses behind the URL can change.
