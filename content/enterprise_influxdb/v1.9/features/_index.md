---
title: InfluxDB Enterprise features
description: Users, clustering, and other InfluxDB Enterprise features.
aliases:
    - /enterprise/v1.8/features/
menu:
  enterprise_influxdb_1_9:
    name: Enterprise features
    weight: 60
---

InfluxDB Enterprise has additional capabilities that enhance [availability](#availability) and [security](#security).

## Availability
### Clustering

InfluxDB Enterprise runs on a network of independent servers, a *cluster*,
to provide fault tolerance and availability of the database.

{{% note %}}
InfluxDB Enterprise can also run with a single meta node and a single data node.
However this does not take advantage of the clustering capablity,
and therefore does not provide high availablity assurances.
{{% /note %}}

For more information on clustering, see [Clustering in InfluxDB Enterprise](/enterprise_influxdb/v1.9/concepts/clustering/).

### Hinted handoff

Hinted handoff (HH) is how InfluxDB Enterprise deals with data node outages while writes are happening.
HH is essentially a durable disk based queue.

For more information, see ["Hinted handoff"](/enterprise_influxdb/v1.9/concepts/clustering/#hinted-handoff).

### Anti-entropy

Anti-entropy is an optional services to eliminate edge cases related to cluster consistency.

For more information, see ["Use Anti-Entropy service in InfluxDB Enterprise"](/enterprise_influxdb/v1.9/administration/anti-entropy/).

## Security

InfluxDB Enterprise offers the following security enhancements:

- Authorization with [user permissions and roles](/enterprise_influxdb/v1.9/features/users/)
- [Fine-grained authorization](/enterprise_influxdb/v1.9/guides/fine-grained-authorization/)
  for particular data
- [Support for LDAP ](/enterprise_influxdb/v1.9/administration/manage/security/ldap/)
- Configrable password hashing alogrithm for FIPS compliance
<!-- - Kapacitor Security integration (now with Kapacitor OSS) -->

---

{{< children hlevel="h3" >}}
