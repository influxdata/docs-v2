---
title: InfluxDB Cloud data durability
description: >
  InfluxDB Cloud ensures the durability of all stored data by automatically creating
  backups, replicating data across geographic locations, and verifying replicated
  data is consistent and backups are readable.
weight: 101
menu:
  influxdb_cloud_ref:
    name: Data durability
    parent: InfluxDB Cloud internals
influxdb/cloud/tags: [backups, internals]
---

InfluxDB Cloud ensures the durability of all stored data by automatically creating
backups, replicating data across geographic locations, and verifying replicated
data is consistent and backups are readable.

##### On this page

- [Backup processes](#backup-processes)
- [Recovery](#recovery)
- [Data verification](#data-verification)

## Backup processes
InfluxDB Cloud stores **two out-of-band backup copies** of all data.
The following processes each generate backups:

- [Backup on write](#backup-on-write)
- [Backup after compaction](#backup-after-compaction)

### Backup on write
All inbound write requests to InfluxDB Cloud queue in a durable message queue.
The message queue stores the raw [line protocol](/influxdb/cloud/reference/glossary/#line-protocol)
of each write request in an object storage location as an out-of-band backup.
The message queue also writes data to the live storage service, replicates it twice
across two geographic locations, and makes it available to the InfluxDB Cloud service.

The durability of the message queue is 72 hours, meaning InfluxDB Cloud can sustain
a failure of its underlying storage tier or object storage services for up to 72 hours.

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
catastrophic or extreme failure modes may take longer.
For example, if we need to rebuild all data from the message queue backup,
it could take 24 hours or longer.

## Data verification
InfluxDB Cloud has two data verification services running 24x7:

- **Entropy detection:** ensures that replicated data is consistent
- **Backup verification:** validates and ensures backups in object storage are readable
