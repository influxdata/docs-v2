---
title: InfluxDB file system layout
description: >
  The InfluxDB Enterprise file system layout depends on the operating system, package manager,
  or containerization platform used to install InfluxDB.
weight: 102
menu:
  enterprise_influxdb_1_9:
    name: File system layout
    parent: Concepts
---

The InfluxDB Enterprise file system layout depends on the installation method
or containerization platform used to install InfluxDB Enterprise.

- [InfluxDB Enterprise file structure](#influxdb-enterprise-file-structure)
- [File system layout](#file-system-layout)

## InfluxDB Enterprise file structure
The InfluxDB file structure includes the following:

- [Data directory](#data-directory)
- [WAL directory](#wal-directory)
- [Metastore directory](#metastore-directory)
- [Hinted handoff directory](#hinted-handoff-directory)
- [InfluxDB Enterprise configuration files](#influxdb-enterprise-configuration-files)

### Data directory
(**Data nodes only**)
Directory path where InfluxDB Enterprise stores time series data (TSM files).
To customize this path, use the [`[data].dir`](/enterprise_influxdb/v1.9/administration/config-data-nodes/#dir--varlibinfluxdbdata)
configuration option.

### WAL directory
(**Data nodes only**)
Directory path where InfluxDB Enterprise stores Write Ahead Log (WAL) files.
To customize this path, use the [`[data].wal-dir`](/enterprise_influxdb/v1.9/administration/config-data-nodes/#wal-dir--varlibinfluxdbwal)
configuration option.

### Hinted handoff directory
(**Data nodes only**)
Directory path where hinted handoff (HH) queues are stored.
To customize this path, use the [`[hinted-handoff].dir`](/enterprise_influxdb/v1.9/administration/config-data-nodes/#dir--varlibinfluxdbhh)
configuration option.

### Metastore directory
Directory path of the InfluxDB Enterprise metastore, which stores information
about the cluster, users, databases, retention policies, shards, and continuous queries.

**On data nodes**, the metastore contains information about InfluxDB Enterprise meta nodes.
To customize this path, use the [`[meta].dir` configuration option in your data node configuration file](/enterprise_influxdb/v1.9/administration/config-data-nodes/#dir--varlibinfluxdbmeta).

**On meta nodes**, the metastore contains information about the InfluxDB Enterprise RAFT cluster.
To customize this path, use the [`[meta].dir` configuration option in your meta node configuration file](/enterprise_influxdb/v1.9/administration/config-meta-nodes/#dir--varlibinfluxdbmeta).

### InfluxDB Enterprise configuration files
InfluxDB Enterprise stores default data and meta node configuration file on disk.
For more information about using InfluxDB Enterprise configuration files, see:

- [Configure data nodes](/enterprise_influxdb/v1.9/administration/config-data-nodes/)
- [Configure meta nodes](/enterprise_influxdb/v1.9/administration/config-meta-nodes/)

## File system layout
InfluxDB Enterprise supports **.deb-** and **.rpm-based** Linux package managers.
The file system layout is the same with each.

- [Data node file system layout](#data-node-file-system-layout)
- [Meta node file system layout](#meta-node-file-system-layout)

### Data node file system layout
| Path                                                                 | Default                       |
| :------------------------------------------------------------------- | :---------------------------- |
| [Data directory](#data-directory)                                    | `/var/lib/influxdb/data/`     |
| [WAL directory](#wal-directory)                                      | `/var/lib/influxdb/wal/`      |
| [Metastore directory](#metastore-directory)                          | `/var/lib/influxdb/meta/`     |
| [Hinted handoff directory](#hinted-handoff-directory)                | `/var/lib/influxdb/hh/`       |
| [Default config file path](#influxdb-enterprise-configuration-files) | `/etc/influxdb/influxdb.conf` |

##### Data node file system overview
{{% filesystem-diagram %}}
- /etc/influxdb/
    - influxdb.conf _<span style="opacity:.4">(Data node configuration file)</span>_
- /var/lib/influxdb/
  - data/
    - _<span style="opacity:.4">TSM directories and files</span>_
  - hh/
    - _<span style="opacity:.4">HH queue files</span>_
  - meta/
    - client.json
  - wal/
    - _<span style="opacity:.4">WAL directories and files</span>_
{{% /filesystem-diagram %}}

### Meta node file system layout
| Path                                                                 | Default                            |
| :------------------------------------------------------------------- | :--------------------------------- |
| [Metastore directory](#metastore-directory)                          | `/var/lib/influxdb/meta/`          |
| [Default config file path](#influxdb-enterprise-configuration-files) | `/etc/influxdb/influxdb-meta.conf` |

##### Meta node file system overview
{{% filesystem-diagram %}}
- /etc/influxdb/
  - influxdb-meta.conf _<span style="opacity:.4">(Meta node configuration file)</span>_
- /var/lib/influxdb/
  - meta/
    - peers.json
    - raft.db
    - snapshots/
      - _<span style="opacity:.4">Snapshot directories and files</span>_  
{{% /filesystem-diagram %}}
