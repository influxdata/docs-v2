---
title: InfluxDB file system layout
description: >
  The InfluxDB file system layout depends on the operating system, package manager,
  or containerization platform used to install InfluxDB.
weight: 102
menu:
  influxdb_2_0_ref:
    name: File system layout
    parent: InfluxDB internals
influxdb/v2.0/tags: [storage, internals]
---

The InfluxDB file system layout depends on the operating system, installation method,
or containerization platform used to install InfluxDB.
Anywhere InfluxDB is installed, its files on disk consist of the following:

- [Engine path](#engine-path)
- [Bolt path](#bolt-path)
- [Configs path](#configs-path)
- [InfluxDB configuration files](#influxdb-configuration-files)

#### Engine path
The **engine path** (referring to the [*storage engine*](/{{< latest "influxdb" >}}/reference/internals/storage-engine/)) is the directory path where InfluxDB stores time series data on disk.
The engine path contains the following directories:

- **data**: Time-Structured Merge Tree (TSM) files
- **wal**: Write Ahead Log (WAL) files.

Use the [engine-path](/influxdb/v2.0/reference/config-options/#engine-path)
configuration option to customize the engine path.

#### Bolt path
The **bolt path** is the file path where InfluxDB stores the [Boltdb](https://github.com/boltdb/bolt) database.
InfluxDB uses Boltdb as a file-based key-value store for non-time series data
such as users, dashboards, tasks, etc.
Use the [bolt-path](/influxdb/v2.0/reference/config-options/#bolt-path)
configuration option to customize the bolt path.

#### Configs path
The **configs path** is the file path where InfluxDB stores
[`influx` CLI connection configurations](/influxdb/v2.0/reference/cli/influx/config/) (configs).
Use the `--configs-path` flag with `influx` CLI commands to set and use a custom
configs path.

#### InfluxDB configuration files
Some operating systems and package managers store a default InfluxDB (`influxd`)
configuration file on disk.
For more information about using InfluxDB configuration files, see
[Configuration options](/influxdb/v2.0/reference/config-options/).

## File system layout per operating system
{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Docker](#)
[Kubernetes](#)
{{% /tabs %}}
<!---------------------------- BEGIN MACOS CONTENT ---------------------------->
{{% tab-content %}}

#### macOS default paths
| Path                          | Default                      |
|:----                          |:-------                      |
| [Engine path](#engine-path)   | `~/.influxdbv2/engine/`      |
| [Bolt path](#bolt-path)       | `~/.influxdbv2/influxd.bolt` |
| [Configs path](#configs-path) | `~/.influxdbv2/configs`      |

#### macOS file system overview
{{% filesystem-diagram %}}
- ~/.influxdbv2/
  - engine/
    - data/
      - _<span style="opacity:.4">TSM directories and files</span>_
    - wal/
      - _<span style="opacity:.4">WAL directories and files</span>_
  - configs
  - influxd.bolt
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!---------------------------- BEGIN MACOS CONTENT ---------------------------->

<!---------------------------- BEGIN LINUX CONTENT ---------------------------->
{{% tab-content %}}
When installing InfluxDB on Linux, you can download and install the `influxd` binary,
or you can use a package manager.
Which installation method you use determines the file system layout.

- [Installed as a standalone binary](#installed-as-a-standalone-binary)
- [Installed as a package](#installed-as-a-package)

### Installed as a standalone binary

#### Linux default paths (standalone binary)
| Path                          | Default                      |
|:----                          |:-------                      |
| [Engine path](#engine-path)   | `~/.influxdbv2/engine/`      |
| [Bolt path](#bolt-path)       | `~/.influxdbv2/influxd.bolt` |
| [Configs path](#configs-path) | `~/.influxdbv2/configs`      |

#### Linux file system overview (standalone binary)
{{% filesystem-diagram %}}
- ~/.influxdbv2/
  - engine/
    - data/
      - _<span style="opacity:.4">TSM directories and files</span>_
    - wal/
      - _<span style="opacity:.4">WAL directories and files</span>_
  - configs
  - influxd.bolt
{{% /filesystem-diagram %}}

### Installed as a package
InfluxDB OSS 2.0 supports [deb](#deb) and [rpm](#rpm) Linux package managers.
The file system layout is the same with each.

#### Linux default paths (package)
| Path                                                      | Default                          |
|:----                                                      |:-------                          |
| [Engine path](#engine-path)                               | `/var/lib/influxdb/engine/`      |
| [Bolt path](#bolt-path)                                   | `/var/lib/influxdb/influxd.bolt` |
| [Configs path](#configs-path)                             | `/var/lib/influxdb/configs`      |
| [Default config file path](#influxdb-configuration-files) | `/etc/influxdb/config.toml`      |

#### Linux file system overview (package)
{{% filesystem-diagram %}}
- /var/lib/influxdb/
  - engine/
    - data/
      - _<span style="opacity:.4">TSM directories and files</span>_
    - wal/
      - _<span style="opacity:.4">WAL directories and files</span>_
  - configs
  - influxd.bolt
- /etc/influxdb/
  - config.toml _<span style="opacity:.4">(influxd configuration file)</span>_
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!---------------------------- BEGIN LINUX CONTENT ---------------------------->

<!---------------------------- BEGIN DOCKER CONTENT --------------------------->
{{% tab-content %}}
InfluxDB Docker images are available from both [Dockerhub](https://hub.docker.com/_/influxdb)
and [Quay.io](https://quay.io/repository/influxdb/influxdb?tab=tags).
Each have a unique InfluxDB file system layout.

- [Dockerhub](#dockerhub)
- [Quay.io](#quayio)

### Dockerhub

{{% note %}}
The InfluxDB Dockerhub image uses `/var/lib/influxdb2` instead of `/var/lib/influxdb`
so you can easily mount separate volumes for InfluxDB 1.x and 2.x data during the
[upgrade process](/influxdb/v2.0/upgrade/v1-to-v2/docker/).
{{% /note %}}

#### Dockerhub default paths
| Path                          | Default                           |
|:----                          |:-------                           |
| [Engine path](#engine-path)   | `/var/lib/influxdb2/engine/`      |
| [Bolt path](#bolt-path)       | `/var/lib/influxdb2/influxd.bolt` |
| [Configs path](#configs-path) | `/etc/influxdb2/configs`          |

#### Dockerhub file system overview
{{% filesystem-diagram %}}
- /var/lib/influxdb2/
  - engine/
    - data/
      - _<span style="opacity:.4">TSM directories and files</span>_
    - wal/
      - _<span style="opacity:.4">WAL directories and files</span>_
  - influxd.bolt
- /etc/influxdb2/
  - configs
{{% /filesystem-diagram %}}

### Quay.io

#### Quay default paths
| Path                          | Default                          |
|:----                          |:-------                          |
| [Engine path](#engine-path)   | `/root/.influxdbv2/engine/`      |
| [Bolt path](#bolt-path)       | `/root/.influxdbv2/influxd.bolt` |
| [Configs path](#configs-path) | `/root/.influxdbv2/configs`      |

#### Quay file system overview
{{% filesystem-diagram %}}
- /root/.influxdbv2/
  - engine/
    - data/
      - _<span style="opacity:.4">TSM directories and files</span>_
    - wal/
      - _<span style="opacity:.4">WAL directories and files</span>_
  - configs
  - influxd.bolt
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!---------------------------- BEGIN DOCKER CONTENT --------------------------->

<!-------------------------- BEGIN KUBERNETES CONTENT ------------------------->
{{% tab-content %}}
#### Kubernetes default paths
| Path                          | Default                           |
|:----                          |:-------                           |
| [Engine path](#engine-path)   | `/var/lib/influxdb2/engine/`      |
| [Bolt path](#bolt-path)       | `/var/lib/influxdb2/influxd.bolt` |
| [Configs path](#configs-path) | `/etc/influxdb2/configs`          |

#### Kubernetes file system overview
{{% filesystem-diagram %}}
- /var/lib/influxdb2/
  - engine/
    - data/
      - _<span style="opacity:.4">TSM directories and files</span>_
    - wal/
      - _<span style="opacity:.4">WAL directories and files</span>_
  - influxd.bolt
- /etc/influxdb2/
  - configs
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!-------------------------- BEGIN KUBERNETES CONTENT ------------------------->
{{< /tabs-wrapper >}}
