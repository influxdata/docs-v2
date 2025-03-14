---
title: Installation requirements
description: Requirements for installing and deploying InfluxDB Enterprise.
aliases:
  - /enterprise_influxdb/v1/introduction/meta_node_installation/
  - /enterprise_influxdb/v1/introduction/data_node_installation/
  - /enterprise/v1.8/introduction/installation_guidelines/
  - /enterprise_influxdb/v1/introduction/installation_guidelines/
menu:
  enterprise_influxdb_v1:
    weight: 102
    parent: Introduction
---

Review the installation requirements below, and then check out available options to [install and deploy InfluxDB Enterprise](/enterprise_influxdb/v1/introduction/installation/). For an overview of the architecture and concepts in an InfluxDB Enterprise cluster, review [Clustering in InfluxDB Enterprise](/enterprise_influxdb/v1/concepts/clustering/).

## Requirements for InfluxDB Enterprise clusters

InfluxDB Enterprise clusters require a license. To use a license key, all nodes in the cluster must be able to contact https://portal.influxdata.com via port `80` or port `443`. If nodes in the cluster cannot communicate with https://portal.influxdata.com, you must use the `license-path` configuration setting. For more information, see [Enterprise license settings](/enterprise_influxdb/v1/administration/config-data-nodes/#enterprise-license-settings).

Nodes attempt to download a new license file for the given key every four hours. If a node cannot connect to the server and retrieve a new license file, the node uses the existing license file. After a license expires, nodes have the following grace periods:

- If [InfluxDB daemon (`influxd`)](/enterprise_influxdb/v1/tools/influxd#sidebar) starts and fails to validate the license, the node has a 4-hour grace period.
- If `influxd` starts and validates the license, and then a later license check fails, the node has a 14-day grace period.

### Frequently overlooked requirements

The following are the most frequently overlooked requirements when installing a cluster.

- [Ensure connectivity between machines](#ensure-connectivity-between-machines)
- [Synchronize time between hosts](#synchronize-time-between-hosts)
- [Use SSDs](#use-ssds)
- [Do not use NFS or NFS-based services](#do-not-use-nfs-or-nfs-based-services)
- [Do not use LVM](#do-not-use-lvm)
- [Disable swap](#disable-swap)
- [Use three and only three meta nodes](#use-three-and-only-three-meta-nodes)
- [Meta and data nodes are fully independent](#meta-and-data-nodes-are-fully-independent)
- [Install Chronograf last](#install-chronograf-last)


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

#### Do not use NFS or NFS-based services

For disk storage, use block devices only.
InfluxDB Enterprise does **not** support NFS (Network File System)-mounted devices
or services such as [AWS EFS](https://aws.amazon.com/efs/),
[Google Filestore](https://cloud.google.com/filestore), or 
[Azure files](https://azure.microsoft.com/en-us/services/storage/files/).

#### Do not use LVM 

Don't use LVM for software RAID, JBOD, or disk encryption.
These use cases can lead to performance issues. 

If you use LVM solely for creating logical volumes, use it with Device Mapper’s linear mapping for optimal performance.

#### Disable swap

To avoid potential disk contention when InfluxDB is under high load,
disable swap in your operating system settings.

#### Use three and only three meta nodes

Although technically the cluster can function with any number of meta nodes, the best practice is to ALWAYS have an odd number of meta nodes.
This allows the meta nodes to reach consensus.
An even number of meta nodes cannot achieve consensus because there can be no "deciding vote" cast between the nodes if they disagree.

Therefore, the minimum number of meta nodes for a high availability (HA) installation is three. The typical HA installation for InfluxDB Enterprise deploys three meta nodes.

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

#### Set up monitoring

Monitoring gives you visibility into the status and performance of your cluster.
See ["Monitor the InfluxData Platform"](/platform/monitoring/influxdata-platform/) for information on setting up monitoring for your InfluxDB Enterprise installation.
