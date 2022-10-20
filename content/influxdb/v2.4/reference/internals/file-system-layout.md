---
title: InfluxDB file system layout
description: >
  The InfluxDB file system layout depends on the operating system, package manager,
  or containerization platform used to install InfluxDB.
weight: 102
menu:
  influxdb_2_4_ref:
    name: File system layout
    parent: InfluxDB internals
influxdb/v2.4/tags: [storage, internals]
related:
  - /influxdb/v2.4/admin/internals/
---

The InfluxDB file system layout depends on the operating system, installation method,
or containerization platform used to install InfluxDB.

- [InfluxDB file structure](#influxdb-file-structure)
- [File system layout](#file-system-layout)

## InfluxDB file structure
The InfluxDB file structure includes of the following:

#### Engine path
Directory path to the [storage engine](/{{< latest "influxdb" >}}/reference/internals/storage-engine/),
where InfluxDB stores time series data, includes the following directories:

- **data**: Stores time-structured merge tree (TSM) files.
  For more information about the structure of the `data` directory, see
  [TSM directories and files layout](#tsm-directories-and-files-layout).
- **replicationq**: Store the replication queue for the [InfluxDB replication service](/influxdb/v2.4/write-data/replication/).
- **wal**: Stores write-ahead log (WAL) files.
  For more information about the structure of the `wal` directory, see
  [WAL directories and files layout](#wal-directories-and-files-layout).

To customize this path, use the [engine-path](/influxdb/v2.4/reference/config-options/#engine-path)
configuration option.

#### Bolt path
File path to the [Boltdb](https://github.com/boltdb/bolt) database, a file-based
key-value store for non-time series data, such as InfluxDB users, dashboards, tasks, etc.
To customize this path, use the [bolt-path](/influxdb/v2.4/reference/config-options/#bolt-path)
configuration option.

#### Configs path
File path to [`influx` CLI connection configurations](/influxdb/v2.4/reference/cli/influx/config/) (configs).
To customize this path, use the `--configs-path` flag with `influx` CLI commands.

#### InfluxDB configuration files
Some operating systems and package managers store a default InfluxDB (`influxd`) configuration file on disk.
For more information about using InfluxDB configuration files, see
[Configuration options](/influxdb/v2.4/reference/config-options/).

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

#### macOS default paths
| Path                          | Default                        |
|:------------------------------|:-------------------------------|
| [Engine path](#engine-path)   | `~/.influxdbv2/engine/`        |
| [Bolt path](#bolt-path)       | `~/.influxdbv2/influxd.bolt`   |
| [SQLite path](#sqlite-path)   | `~/.influxdbv2/influxd.sqlite` |
| [Configs path](#configs-path) | `~/.influxdbv2/configs`        |

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
  - influxd.sqlite
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

#### Linux default paths (standalone binary)
| Path                          | Default                      |
|:----                          |:-------                      |
| [Engine path](#engine-path)   | `~/.influxdbv2/engine/`      |
| [Bolt path](#bolt-path)       | `~/.influxdbv2/influxd.bolt` |
| [SQLite path](#sqlite-path)   | `~/.influxdbv2/influxd.sqlite` |
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
  - influxd.sqlite
{{% /filesystem-diagram %}}

### Installed as a package
InfluxDB {{< current-version >}} supports **.deb-** and **.rpm-based** Linux package managers.
The file system layout is the same with each.

#### Linux default paths (package)
| Path                                                      | Default                            |
|:----------------------------------------------------------|:-----------------------------------|
| [Engine path](#engine-path)                               | `/var/lib/influxdb/engine/`        |
| [Bolt path](#bolt-path)                                   | `/var/lib/influxdb/influxd.bolt`   |
| [SQLite path](#sqlite-path)                               | `/var/lib/influxdb/influxd.sqlite` |
| [Configs path](#configs-path)                             | `/var/lib/influxdb/configs`        |
| [Default config file path](#influxdb-configuration-files) | `/etc/influxdb/config.toml`        |

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
  - influxd.sqlite
- /etc/influxdb/
  - config.toml _<span style="opacity:.4">(influxd configuration file)</span>_
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!----------------------------- END LINUX CONTENT ----------------------------->

<!--------------------------- BEGIN WINDOWS CONTENT --------------------------->
{{% tab-content %}}

#### Windows default paths
| Path                          | Default                                  |
|:----                          |:-------                                  |
| [Engine path](#engine-path)   | `%USERPROFILE%\.influxdbv2\engine\`      |
| [Bolt path](#bolt-path)       | `%USERPROFILE%\.influxdbv2\influxd.bolt` |
| [SQLite path](#sqlite-path)   | `%USERPROFILE%\.influxdbv2\influxd.sqlite` |
| [Configs path](#configs-path) | `%USERPROFILE%\.influxdbv2\configs`      |

#### Windows file system overview
{{% filesystem-diagram %}}
- %USERPROFILE%\\.influxdbv2\
  - engine\
    - data\
      - _<span style="opacity:.4">TSM directories and files</span>_
    - wal\
      - _<span style="opacity:.4">WAL directories and files</span>_
  - configs
  - influxd.bolt
  - influxd.sqlite
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!---------------------------- END WINDOWS CONTENT ---------------------------->

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
[upgrade process](/influxdb/v2.4/upgrade/v1-to-v2/docker/).
{{% /note %}}

#### Dockerhub default paths
| Path                          | Default                           |
|:----                          |:-------                           |
| [Engine path](#engine-path)   | `/var/lib/influxdb2/engine/`      |
| [Bolt path](#bolt-path)       | `/var/lib/influxdb2/influxd.bolt` |
| [SQLite path](#sqlite-path)   | `/var/lib/influxdb2/influxd.sqlite` |
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
  - influxd.sqlite
- /etc/influxdb2/
  - configs
{{% /filesystem-diagram %}}

### Quay.io

#### Quay default paths
| Path                          | Default                          |
|:----                          |:-------                          |
| [Engine path](#engine-path)   | `/root/.influxdbv2/engine/`      |
| [Bolt path](#bolt-path)       | `/root/.influxdbv2/influxd.bolt` |
| [SQLite path](#sqlite-path)   | `/root/.influxdbv2/influxd.sqlite` |
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
  - influxd.sqlite
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!----------------------------- END DOCKER CONTENT ---------------------------->

<!-------------------------- BEGIN KUBERNETES CONTENT ------------------------->
{{% tab-content %}}
#### Kubernetes default paths
| Path                          | Default                             |
|:------------------------------|:------------------------------------|
| [Engine path](#engine-path)   | `/var/lib/influxdb2/engine/`        |
| [Bolt path](#bolt-path)       | `/var/lib/influxdb2/influxd.bolt`   |
| [SQLite path](#sqlite-path)   | `/var/lib/influxdb2/influxd.sqlite` |
| [Configs path](#configs-path) | `/etc/influxdb2/configs`            |

#### Kubernetes file system overview
{{% filesystem-diagram %}}
- /var/lib/influxdb2/
  - engine/
    - data/
      - _<span style="opacity:.4">TSM directories and files</span>_
        <a class="btn small-plus" href="#tsm-directories-and-files-layout">+</a>
    - wal/
      - _<span style="opacity:.4">WAL directories and files</span>_
  - influxd.bolt
  - influxd.sqlite
- /etc/influxdb2/
  - configs
{{% /filesystem-diagram %}}
{{% /tab-content %}}
<!--------------------------- END KUBERNETES CONTENT -------------------------->
{{< /tabs-wrapper >}}

---

#### TSM directories and files layout

TSM directories and files are stored in the `data` directory inside the [engine path](#engine-path).
The diagram below is **relative to the [engine path](#file-system-layout)**.

{{% filesystem-diagram %}}
- <span style="opacity:.4">...</span>/data/
  - 000xX00xxXx000x0/ _<span style="opacity:.4">(bucket ID)</span>_
    - _series/ _<span style="opacity:.4">(series directory)</span>_
      - 00/ _<span style="opacity:.4">(internal shard index)</span>_
        - 0000 _<span style="opacity:.4">(internal shard index file)</span>_
    - autogen 
      - 0123/ _<span style="opacity:.4">(shard ID)</span>_
        - index _<span style="opacity:.4">(index directory)</span>_
          - L0-00000001.tsl _<span style="opacity:.4">(write-ahead log for the TSI index)</span>_
          - L0-00000001.tsi _<span style="opacity:.4">(series index)</span>_
          - MANIFEST _<span style="opacity:.4">(index manifest)</span>_
{{% /filesystem-diagram %}}

#### WAL directories and files layout

WAL directories and files are stored in the `data` directory inside the [engine path](#engine-path).
The diagram below is **relative to the [engine path](#file-system-layout)**.

{{% filesystem-diagram %}}
- <span style="opacity:.4">...</span>/wal/
  - 000xX00xxXx000x0/ _<span style="opacity:.4">(bucket ID)</span>_
    - autogen/ 
      - 0123/ _<span style="opacity:.4">(shard ID)</span>_
        - _01234.wal _<span style="opacity:.4">(WAL file)</span>_
{{% /filesystem-diagram %}}
