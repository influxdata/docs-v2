---
title: InfluxDB Cloud data durability
description: >
  InfluxDB Cloud ensures the durability of all stored data by replicating data across
  multiple availability zones in a cloud region, automatically creating backups,
  and verifying that replicated data is consistent and readable.
weight: 101
menu:
  influxdb_cloud_ref:
    name: Data durability
    parent: InfluxDB Cloud internals
influxdb/cloud/tags: [backups, internals]
---

InfluxDB Cloud replicates all data in the storage tier across two availability
zones in a cloud region, automatically creates backups, and verifies that replicated
data is consistent and readable.

##### On this page

- [Data replication](#data-replication)
- [Backup processes](#backup-processes)
- [Recovery](#recovery)
- [Data verification](#data-verification)

## Data replication
InfluxDB Cloud replicates data in both the write tier and the storage tier.

- **Write tier:** all data written to InfluxDB is processed by a durable message queue.
  The message queue partitions each batch of points based off series keys and then
  replicates each partition across other physical nodes in the message queue.
- **Storage tier:** all data in the underlying storage tier is replicated across
  two availability zones in a cloud region.

## Backup processes
InfluxDB Cloud backs up all data in the following way:

- [Backup on write](#backup-on-write)
- [Backup after compaction](#backup-after-compaction)

### Backup on write
All inbound write requests to InfluxDB Cloud are added to a durable message queue.
The message queue does the following:

1. Caches the [line protocol](/influxdb/cloud/reference/glossary/#line-protocol)
   of each write request.
2. Writes data to the storage tier.
3. Routinely persists cached line protocol to object storage as an out-of-band backup.

Message queue backups provide raw line protocol that can be used to recover from
catastrophic failure in the storage tier or an accidental deletion.
The durability of the message queue is 96 hours, meaning InfluxDB Cloud can sustain
a failure of its underlying storage tier or object storage services for up to 96 hours
without any data loss.

To minimize potential data loss due to defects introduced in the InfluxDB Cloud service,
we minimize the code used between the data ingest and backup processes.

### Backup after compaction
The InfluxDB storage engine compresses data over time in a process known as
[compaction](/influxdb/cloud/reference/glossary/#compaction).
When each compaction cycle completes, InfluxDB Cloud stores compressed
[TSM](/influxdb/cloud/reference/glossary/#tsm-time-structured-merge-tree) files
in object storage.

## Recovery
InfluxDB Cloud uses the following out-of-band backups stored in object storage to recover data:

- **Message queue backup:** line protocol from inbound write requests within the last 96 hours
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
- **Data verification:** verifies that data written to InfluxDB is readable

## InfluxDB Cloud status
InfluxDB Cloud regions and underlying services are monitored at all times.
For information about the current status of InfluxDB Cloud, see the
[InfluxDB Cloud status page](https://status.influxdata.com).
