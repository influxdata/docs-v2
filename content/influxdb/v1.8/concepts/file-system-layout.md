---
title: InfluxDB file system layout
description: >
  The InfluxDB file system layout depends on the operating system, package manager,
  or containerization platform used to install InfluxDB.
weight: 102
menu:
  influxdb_1_8:
    name: File system layout
    parent: Concepts
---

The InfluxDB file system layout depends on the operating system, installation method,
or containerization platform used to install InfluxDB.

- [InfluxDB file structure](#influxdb-file-structure)
- [File system layout](#file-system-layout)

## InfluxDB file structure
The InfluxDB file structure includes of the following:

### Data directory
Directory path where InfluxDB stores time series data (TSM files).
To customize this path, use the [`[data].dir`](/influxdb/v1.8/administration/config/#dir--varlibinfluxdbdata)
configuration option.

### WAL directory
Directory path where InfluxDB stores Write Ahead Log (WAL) files.
To customize this path, use the [`[data].wal-dir`](/influxdb/v1.8/administration/config/#wal-dir--varlibinfluxdbwal)
configuration option.

### Metastore directory
Directory path of the InfluxDB metastore, which stores information about users,
databases, retention policies, shards, and continuous queries.
To customize this path, use the [`[meta].dir`](/influxdb/v1.8/administration/config/#dir--varlibinfluxdbmeta)
configuration option.

## InfluxDB configuration files
Some operating systems and package managers store a default InfluxDB configuration file on disk.
For more information about using InfluxDB configuration files, see
[Configure InfluxDB](/influxdb/v1.8/administration/config/).

## File system layout
{{< tabs-wrapper >}}
{{% tabs %}}
[macOS](#)
[Linux](#)
[Windows](#)
[Docker](#)
[Kubernetes](#)
{{% /tabs %}}
<!---------------------------- BEGIN MACOS CONTENT ---------------------------->
{{% tab-content %}}

#### macOS default directories
| Path                                        | Default             |
| :------------------------------------------ | :------------------ |
| [Data directory](#data-directory)           | `~/.influxdb/data/` |
| [WAL directory](#wal-directory)             | `~/.influxdb/wal/`  |
| [Metastore directory](#metastore-directory) | `~/.influxdb/meta/` |

#### macOS file system overview
{{% filesystem-diagram %}}
- ~/.influxdb/
  - data/
    - _<span style="opacity:.4">TSM directories and files</span>_
  - wal/
    - _<span style="opacity:.4">WAL directories and files</span>_
  - meta/
    - meta.db
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!----------------------------- END MACOS CONTENT ----------------------------->

<!---------------------------- BEGIN LINUX CONTENT ---------------------------->
{{% tab-content %}}
When installing InfluxDB on Linux, you can download and install the `influxd` binary,
or you can use a package manager.
Which installation method you use determines the file system layout.

- [Installed as a standalone binary](#installed-as-a-standalone-binary)
- [Installed as a package](#installed-as-a-package)

### Installed as a standalone binary

#### Linux default directories (standalone binary)
| Path                                        | Default             |
| :------------------------------------------ | :------------------ |
| [Data directory](#data-directory)           | `~/.influxdb/data/` |
| [WAL directory](#wal-directory)             | `~/.influxdb/wal/`  |
| [Metastore directory](#metastore-directory) | `~/.influxdb/meta/` |

#### Linux file system overview (standalone binary)
{{% filesystem-diagram %}}
- ~/.influxdb/
  - data/
    - _<span style="opacity:.4">TSM directories and files</span>_
  - wal/
    - _<span style="opacity:.4">WAL directories and files</span>_
  - meta/
    - meta.db
{{% /filesystem-diagram %}}

### Installed as a package
InfluxDB 2.0 supports **.deb-** and **.rpm-based** Linux package managers.
The file system layout is the same with each.

#### Linux default directories (package)
| Path                                                      | Default                       |
| :-------------------------------------------------------- | :---------------------------- |
| [Data directory](#data-directory)                         | `/var/lib/influxdb/data/`     |
| [WAL directory](#wal-directory)                           | `/var/lib/influxdb/wal/`      |
| [Metastore directory](#metastore-directory)               | `/var/lib/influxdb/meta/`     |
| [Default config file path](#influxdb-configuration-files) | `/etc/influxdb/influxdb.conf` |

#### Linux file system overview (package)
{{% filesystem-diagram %}}
- /var/lib/influxdb/
  - data/
    - _<span style="opacity:.4">TSM directories and files</span>_
  - wal/
    - _<span style="opacity:.4">WAL directories and files</span>_
  - meta/
    - meta.db
- /etc/influxdb/
  - influxdb.conf _<span style="opacity:.4">(influxd configuration file)</span>_
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!----------------------------- END LINUX CONTENT ----------------------------->

<!--------------------------- BEGIN WINDOWS CONTENT --------------------------->
{{% tab-content %}}

#### Windows default paths
| Path                                        | Default                           |
| :------------------------------------------ | :-------------------------------- |
| [Data directory](#data-directory)           | `%USERPROFILE%\.influxdb\data\` |
| [WAL directory](#wal-directory)             | `%USERPROFILE%\.influxdb\wal\`  |
| [Metastore directory](#metastore-directory) | `%USERPROFILE%\.influxdb\meta\` |

#### Windows file system overview
{{% filesystem-diagram %}}
- %USERPROFILE%\\.influxdb\
  - data/
    - _<span style="opacity:.4">TSM directories and files</span>_
  - wal/
    - _<span style="opacity:.4">WAL directories and files</span>_
  - meta/
    - meta.db
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!---------------------------- END WINDOWS CONTENT ---------------------------->

<!---------------------------- BEGIN DOCKER CONTENT --------------------------->
{{% tab-content %}}

#### Docker default directories
| Path                                        | Default                   |
| :------------------------------------------ | :------------------------ |
| [Data directory](#data-directory)           | `/var/lib/influxdb/data/` |
| [WAL directory](#wal-directory)             | `/var/lib/influxdb/wal/`  |
| [Metastore directory](#metastore-directory) | `/var/lib/influxdb/meta/` |

#### Dockerhub file system overview
{{% filesystem-diagram %}}
- /var/lib/influxdb/
  - data/
    - _<span style="opacity:.4">TSM directories and files</span>_
  - wal/
    - _<span style="opacity:.4">WAL directories and files</span>_
  - meta/
    - meta.db
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!----------------------------- END DOCKER CONTENT ---------------------------->

<!-------------------------- BEGIN KUBERNETES CONTENT ------------------------->
{{% tab-content %}}
#### Kubernetes default paths
| Path                                        | Default                   |
| :------------------------------------------ | :------------------------ |
| [Data directory](#data-directory)           | `/var/lib/influxdb/data/` |
| [WAL directory](#wal-directory)             | `/var/lib/influxdb/wal/`  |
| [Metastore directory](#metastore-directory) | `/var/lib/influxdb/meta/` |

#### Kubernetes file system overview
{{% filesystem-diagram %}}
- /var/lib/influxdb/
  - data/
    - _<span style="opacity:.4">TSM directories and files</span>_
  - wal/
    - _<span style="opacity:.4">WAL directories and files</span>_
  - meta/
    - meta.db
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!--------------------------- END KUBERNETES CONTENT -------------------------->
{{< /tabs-wrapper >}}
