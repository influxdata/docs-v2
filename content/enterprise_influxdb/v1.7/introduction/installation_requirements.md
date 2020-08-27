---
title: Installation requirements
aliases:
  - /enterprise_influxdb/v1.7/introduction/meta_node_installation/
  - /enterprise_influxdb/v1.7/introduction/data_node_installation/
  - /enterprise/v1.7/introduction/installation_guidelines/
menu:
  enterprise_influxdb_1_7:
    weight: 20
    parent: Introduction
---

Review the installation requirements below, and then check out available options to [Install and deploy InfluxDB Enterprise](/enterprise_influxdb/v1.7/install-and-deploy/).
## Requirements for InfluxDB Enterprise clusters

For an overview of the architecture and concepts in an InfluxDB Enterprise Cluster, review [Clustering Guide](/enterprise_influxdb/v1.7/concepts/clustering/).

For clusters using a license key and not a license file, all nodes must be able to contact `portal.influxdata.com`
via port `80` or port `443`. Nodes that go more than four hours without connectivity to the Portal may experience license issues.

### Frequently Overlooked Requirements

The following are the most frequently overlooked requirements when installing a cluster.

#### Ensure connectivity between machines

All nodes in the cluster must be able to resolve each other by hostname or IP,
whichever is used in the configuration files.

For simplicity, ensure that all nodes can reach all other nodes on ports `8086`, `8088`, `8089`, and `8091`.
If you alter the default ports in the configuration file(s), ensure the configured ports are open between the nodes.

#### Synchronize time between hosts

InfluxDB Enterprise uses hosts' local time in UTC to assign timestamps to data and for coordination purposes.
Use the Network Time Protocol (NTP) to synchronize time between hosts.

#### Use SSDs

Clusters require sustained availability of 1000-2000 IOPS from the attached storage.
SANs must guarantee at least 1000 IOPS is always available to InfluxDB Enterprise
nodes or they may not be sufficient.
SSDs are strongly recommended, and we have had no reports of IOPS contention from any customers running on SSDs.

#### Use three and only three meta nodes

Although technically the cluster can function with any number of meta nodes, the best pratice is to ALWAYS have an odd number of meta nodes.
This allows the meta nodes to reach consensus.
An even number of meta nodes cannot achieve consensus because there can be no "deciding vote" cast between the nodes if they disagree.

Therefore, the minumum number of meta nodes for a high availability (HA) installation is three. The typical HA installation for InfluxDB Enterprise deploys three meta nodes.

Aside from three being a magic number, a three meta node cluster can tolerate the permanent loss of a single meta node with no degradation in any function or performance.
A replacement meta node can be added to restore the cluster to full redundancy.
A three meta node cluster that loses two meta nodes will still be able to handle
basic writes and queries, but no new shards, databases, users, etc. can be created.

Running a cluster with five meta nodes does allow for the permanent loss of
two meta nodes without impact on the cluster, but it doubles the
Raft communication overhead.

#### Meta and data nodes are fully independent

Meta nodes run the Raft consensus protocol together, and manage the metastore of
all shared cluster information: cluster nodes, databases, retention policies,
shard groups, users, continuous queries, and subscriptions.

Data nodes store the shard groups and respond to queries.
They request metastore information from the meta group as needed.

There is no requirement at all for there to be a meta process on a data node,
or for there to be a meta process per data node.
Three meta nodes is enough for an arbitrary number of data nodes, and for best
redundancy, all nodes should run on independent servers.

#### Install Chronograf last

Chronograf should not be installed or configured until the
InfluxDB Enterprise cluster is fully functional.
