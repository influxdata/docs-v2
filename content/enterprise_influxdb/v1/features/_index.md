---
title: InfluxDB Enterprise features
description: Users, clustering, and other InfluxDB Enterprise features.
aliases:
    - /enterprise/v1.8/features/
menu:
  enterprise_influxdb_v1:
    name: Enterprise features
    weight: 60
---

InfluxDB Enterprise has additional capabilities that enhance
[availability](#clustering),
[scalability](#clustering), and
[security](#security),
and provide [eventual consistency](#eventual-consistency).

## Clustering

InfluxDB Enterprise runs on a network of independent servers, a *cluster*,
to provide fault tolerance, availability, and horizontal scalability of the database.

While many InfluxDB Enterprise features are available
when run with a single meta node and a single data node, this configuration does not take advantage of the clustering capability
or ensure high availability.

Nodes can be added to an existing cluster to improve database performance for querying and writing data.
Certain configurations (e.g., 3 meta and 2 data node) provide high-availability assurances
while making certain tradeoffs in query performance when compared to a single node.

Further increasing the number of nodes can improve performance in both respects.
For example, a cluster with 4 data nodes and a [replication factor](/enterprise_influxdb/v1/concepts/glossary/#replication-factor)
of 2 can support a higher volume of write traffic than a single node could.
It can also support a higher *query* workload, as the data is replicated
in two locations. Performance of the queries may be on par with a single
node in cases where the query can be answered directly by the node which
receives the query.

For more information on clustering, see [Clustering in InfluxDB Enterprise](/enterprise_influxdb/v1/concepts/clustering/).

## Security

Enterprise authorization uses an expanded set of [*16 user permissions and roles*](/enterprise_influxdb/v1/features/users/).
(InfluxDB OSS only has `READ` and `WRITE` permissions.)
Administrators can give users permission to read and write to databases,
create and remove databases, rebalance a cluster, and manage particular resources.

Organizations can automate managing permissions with the [InfluxDB Enterprise Meta API](/enterprise_influxdb/v1/administration/manage/security/authentication_and_authorization-api/).

[Fine-grained authorization](/enterprise_influxdb/v1/guides/fine-grained-authorization/)
for particular data is also available.

InfluxDB Enterprise can also use [LDAP for managing authentication](/enterprise_influxdb/v1/administration/manage/security/ldap/).

For FIPS compliance, InfluxDB Enterprise password hashing algorithms are configurable.

{{% note %}}
Kapacitor OSS can also delegate its LDAP and security setup to InfluxDB Enterprise.
For details, see ["Set up InfluxDB Enterprise authorizations"](/kapacitor/v1/administration/auth/influxdb-enterprise-auth/).
{{% /note %}}

## Eventual consistency

### Hinted handoff

Hinted handoff (HH) is how InfluxDB Enterprise deals with data node outages while writes are happening.
HH is essentially a durable disk based queue.

For more information, see ["Hinted handoff"](/enterprise_influxdb/v1/concepts/clustering/#hinted-handoff).

### Anti-entropy

Anti-entropy is an optional service to eliminate edge cases related to cluster consistency.

For more information, see ["Use Anti-Entropy service in InfluxDB Enterprise"](/enterprise_influxdb/v1/administration/anti-entropy/).

---

{{< children hlevel="h3" >}}
