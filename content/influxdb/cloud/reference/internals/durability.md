---
title: InfluxDB Cloud data durability
description: >
  InfluxDB Cloud ensures the durability of all stored data by replicating data across
  geographic locations, automatically creating backups, and verifying that replicated
  data is consistent and backups are readable.
weight: 101
menu:
  influxdb_cloud_ref:
    name: Data durability
    parent: InfluxDB Cloud internals
influxdb/cloud/tags: [backups, internals]
---

InfluxDB Cloud ensures the durability of all stored data by replicating data across
geographic locations, automatically creating backups, and verifying that replicated
data is consistent and backups are readable.

##### On this page

- [Data replication](#data-replication)
- [Backup processes](#backup-processes)
- [Recovery](#recovery)
- [Data verification](#data-verification)

## Data replication
InfluxDB Cloud replicates data in both the write tier and in the storage tier.

- **Write tier:** all data written to InfluxDB is processed by a durable message queue.
  The message queue partitions each batch of points and then replicates each partition
  across other physical nodes in the message queue cluster.
- **Storage tier:** all data in the storage tier is replicated across two geographic locations.

## Backup processes
InfluxDB Cloud backs up all data in the following way:

- [Backup on write](#backup-on-write)
- [Backup after compaction](#backup-after-compaction)

### Backup on write
All inbound write requests to InfluxDB Cloud are added to a durable message queue.
The message queue caches the raw [line protocol](/influxdb/cloud/reference/glossary/#line-protocol)
of each write request before writing the data to the storage tier.
The queue then routinely persists the cache to an object storage location as an out-of-band backup.
Message queue backups provide raw line protocol that can be used to recover from
catastrophic failure in the storage tier or an accidental deletion.

The durability of the message queue is 96 hours, meaning InfluxDB Cloud can sustain
a failure of its underlying storage tier or object storage services for up to 96 hours
without any data loss.

To minimize potential data loss due to defects introduced within the broader InfluxDB Cloud service,
InfluxData minimizes code between the data ingest and backup processes.

### Backup after compaction
The InfluxDB storage engine compresses data over time in a process known as
[compaction](/influxdb/cloud/reference/glossary/#compaction).
When each compaction cycle completes, InfluxDB Cloud stores compressed
[TSM](/influxdb/cloud/reference/glossary/#tsm-time-structured-merge-tree) files
in an object storage location.

## Recovery
InfluxDB Cloud uses out-of-band backups stored in object storage to recover data:

- **Message queue backup:** line protocol based on inbound write requests
- **Historic backup:** compressed TSM files

The Recovery Point Objective (RPO) is any accepted write.
The Recovery Time Objective (RTO) is harder to definitively predict as potential failure modes can vary.
While most common failure modes can be resolved within minutes or hours,
critical failure modes may take longer.
For example, if we need to rebuild all data from the message queue backup,
it could take 24 hours or longer.

## Data verification
InfluxDB Cloud has two data verification services running at all times:

- **Entropy detection:** ensures that replicated data is consistent
- **Backup verification:** validates and ensures backups in object storage are readable
