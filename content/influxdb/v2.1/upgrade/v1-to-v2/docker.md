---
title: Upgrade from InfluxDB 1.x to 2.1 with Docker
list_title: Upgrade from 1.x to 2.1 with Docker
description: >
  Use the automated upgrade process built into the InfluxDB 2.x Docker image to
  update InfluxDB 1.x Docker deployments to InfluxDB 2.x.
menu:
  influxdb_2_1:
    parent: InfluxDB 1.x to 2.1
    name: Upgrade with Docker
weight: 101
---

Use the automated upgrade process built into the [InfluxDB 2.x Docker image](https://hub.docker.com/_/influxdb)
to update InfluxDB 1.x Docker deployments to InfluxDB 2.x.

- [Upgrade requirements](#upgrade-requirements)
- [Minimal upgrade](#minimal-upgrade)
- [Upgrade with a custom InfluxDB 1.x configuration file](#upgrade-with-a-custom-influxdb-1-x-configuration-file)
- [Upgrade with custom paths](#upgrade-with-custom-paths)

{{% note %}}
#### Export continuous queries before upgrading
The automated upgrade process **does not** migrate InfluxDB 1.x continuous queries (CQs)
to InfluxDB 2.x tasks (the 2.x equivalent). Export all of your CQs before upgrading to InfluxDB 2.x.
For information about exporting and migrating CQs to tasks, see
[Migrate continuous queries to tasks](/influxdb/v2.1/upgrade/v1-to-v2/migrate-cqs/).
{{% /note %}}

## Upgrade requirements
InfluxDB 2.x provides a 1.x compatibility API, but expects a different storage layout on disk.
To account for theses differences, the InfluxDB Docker image migrates
1.x data and into 2.x-compatible data automatically before booting the `influxd` server.

- [InfluxDB 2.x initialization credentials](#influxdb-2x-initialization-credentials)
- [File system mounts](#file-system-mounts)
- [Upgrade initialization mode](#upgrade-initialization-mode)

{{% note %}}
To ensure InfluxDB reboots post-upgrade without overwriting migrated data,
the upgrade won't run if an existing boltdb file is found at the
[configured 2.x configuration path](#file-system-mounts).
{{% /note %}}

Find more information about the automated InfluxDB upgrade process,
see [Automatically upgrade from InfluxDB 1.x to {{< current-version >}}](/influxdb/v2.1/upgrade/v1-to-v2/automatic-upgrade/).

### InfluxDB 2.x initialization credentials
The automated InfluxDB upgrade process bootstraps an initial admin user,
[organization](/influxdb/v2.1/reference/glossary/#organization), and
[bucket](/influxdb/v2.1/reference/glossary/#bucket) required by InfluxDB 2.x.
Set the following [environment variables in your Docker container](https://docs.docker.com/search/?q=environment%20variables)
to provide setup credentials:

- `DOCKER_INFLUXDB_INIT_USERNAME`: Username to set for the admin user ({{< req >}}).
- `DOCKER_INFLUXDB_INIT_PASSWORD`: Password to set for the admin user ({{< req >}}).
- `DOCKER_INFLUXDB_INIT_ORG`: Name to set for the initial organization ({{< req >}}).
- `DOCKER_INFLUXDB_INIT_BUCKET`: Name to set for the initial bucket ({{< req >}}).
- `DOCKER_INFLUXDB_INIT_RETENTION`: Duration for the initial bucket's retention period.
  If not set, the initial bucket will retain data forever.
- `DOCKER_INFLUXDB_INIT_ADMIN_TOKEN`: API token to associate with the admin user.
  If not set, InfluxDB automatically generates a token.

### File system mounts
The InfluxDB upgrade process requires extra volumes to be mounted into the 2.x container.
Use **environment variables** and **Docker mounts** to specify and configure the
appropriate mount paths for the following:

- 1.x data on disk
- Custom 1.x configuration file (if any)
- 2.x data on disk (`/var/lib/influxdb2`)
- 2.x configuration directory (`/etc/influxdb2`)

The InfluxDB upgrade process searches for mounted 1.x data and configuration files
in the following priority order:

1. 1.x configuration file specified by the `DOCKER_INFLUXDB_INIT_UPGRADE_V1_CONFIG` environment variable
2. 1.x data directory specified by the `DOCKER_INFLUXDB_INIT_UPGRADE_V1_DIR` environment variable
3. 1.x configuration file mounted at `/etc/influxdb/influxdb.conf`
4. 1.x data directory mounted at `/var/lib/influxdb`

{{% note %}}
#### Avoid data loss
By default, the automated upgrade process generates both data and configuration files
under `/var/lib/influxdb2` and `/etc/influxdb2`.
We recommend mounting volumes at both paths to avoid losing data.
{{% /note %}}

### Upgrade initialization mode
Set the `DOCKER_INFLUXDB_INIT_MODE` environment variable to `upgrade`.

## Minimal upgrade
If you're currently running a minimal InfluxDB 1.x deployment similar to:

```sh
docker run -p 8086:8086 \
  -v influxdb:/var/lib/influxdb \
  influxdb:1.8
```

**To upgrade this minimal deployment to InfluxDB 2.x:**

1.  Stop the running InfluxDB 1.x container.
2.  Start the InfluxDB container with the following:

    - Volume mount for the InfluxDB 1.x data directory
    - Volume mount for the InfluxDB 2.x data directory
    - InfluxDB [initialization mode](#upgrade-initialization-mode) environment variable
    - InfluxDB [initialization credential](#influxdb-2x-initialization-credentials) environment variables
    - `influxdb:{{< current-version >}}` Docker image

    ```sh
    docker run -p 8086:8086 \
      -v influxdb:/var/lib/influxdb \
      -v influxdb2:/var/lib/influxdb2 \
      -e DOCKER_INFLUXDB_INIT_MODE=upgrade \
      -e DOCKER_INFLUXDB_INIT_USERNAME=my-user \
      -e DOCKER_INFLUXDB_INIT_PASSWORD=my-password \
      -e DOCKER_INFLUXDB_INIT_ORG=my-org \
      -e DOCKER_INFLUXDB_INIT_BUCKET=my-bucket \
      influxdb:{{< current-version >}}
    ```

## Upgrade with a custom InfluxDB 1.x configuration file
If you're currently running an InfluxDB 1.x deployment with a custom configuration
file similar to:

```sh
docker run -p 8086:8086 \
  -v influxdb:/var/lib/influxdb \
  -v $PWD/influxdb.conf:/etc/influxdb/influxdb.conf:ro \
  influxdb:1.8
```

**To upgrade an InfluxDB 1.x deployment with a custom configuration file to InfluxDB 2.x:**

1.  Stop the running InfluxDB 1.x container.
2.  Start the InfluxDB container with the following:

    - Volume mount for the InfluxDB 1.x data directory
    - Volume mount for the InfluxDB 1.x configuration file
    - Volume mount for the InfluxDB 2.x data directory (`/var/lib/influxdb2`)
    - Volume mount for the InfluxDB 2.x configuration directory (`/etc/influxdb2`)
    - InfluxDB [initialization mode](#upgrade-initialization-mode) environment variable
    - InfluxDB [initialization credential](#influxdb-2x-initialization-credentials) environment variables
    - `influxdb:{{< current-version >}}` Docker image

```sh
docker run -p 8086:8086 \
  -v influxdb:/var/lib/influxdb \
  -v $PWD/influxdb.conf:/etc/influxdb/influxdb.conf:ro \
  -v influxdb2:/var/lib/influxdb2 \
  -v influxdb2:/etc/influxdb2 \
  -e DOCKER_INFLUXDB_INIT_MODE=upgrade \
  -e DOCKER_INFLUXDB_INIT_USERNAME=my-user \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=my-password \
  -e DOCKER_INFLUXDB_INIT_ORG=my-org \
  -e DOCKER_INFLUXDB_INIT_BUCKET=my-bucket \
  influxdb:{{< current-version >}}
```

## Upgrade with custom paths
If you're currently running an InfluxDB 1.x deployment with the data directory and
configuration file mounted at custom paths similar to:

```sh
docker run -p 8086:8086 \
  -v influxdb:/root/influxdb/data \
  -v $PWD/influxdb.conf:/root/influxdb/influxdb.conf:ro \
  influxdb:1.8 -config /root/influxdb/influxdb.conf
```

**To upgrade an InfluxDB 1.x deployment with custom paths to InfluxDB 2.x:**

1. Stop the running InfluxDB 1.x container.
2. Decide to either **keep using custom paths** or **use InfluxDB 2.x default paths**.

{{< tabs-wrapper >}}
{{% tabs %}}
[Keep using custom paths](#)
[Use InfluxDB 2.x defaults](#)
{{% /tabs %}}
<!-------------------------- BEGIN KEEP CUSTOM PATHS -------------------------->
{{% tab-content %}}

To retain your custom InfluxDB 1.x paths, start the InfluxDB container with the following:

- Volume mount for the InfluxDB 1.x data directory
- Volume mount for the InfluxDB 1.x configuration file
- Volume mount for the InfluxDB 2.x data directory
- Volume mount for the InfluxDB 2.x configuration directory
- InfluxDB [initialization mode](#upgrade-initialization-mode) environment variable
- InfluxDB [initialization credential](#influxdb-2x-initialization-credentials) environment variables
- InfluxDB 2.x [v1 configuration file path](#file-system-mounts) environment variable:
    - `DOCKER_INFLUXDB_INIT_UPGRADE_V1_CONFIG`
- InfluxDB 1.x custom path environment variables:
    - `INFLUXD_CONFIG_PATH`
    - `INFLUXD_BOLT_PATH`
    - `INFLUXD_ENGINE_PATH`
- `influxdb:{{< current-version >}}` Docker image

```sh
docker run -p 8086:8086 \
  -v influxdb:/root/influxdb/data \
  -v $PWD/influxdb.conf:/root/influxdb/influxdb.conf:ro \
  -v influxdb2:/root/influxdb2/data \
  -v influxdb2:/root/influxdb2 \
  -e DOCKER_INFLUXDB_INIT_MODE=upgrade \
  -e DOCKER_INFLUXDB_INIT_USERNAME=my-user \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=my-password \
  -e DOCKER_INFLUXDB_INIT_ORG=my-org \
  -e DOCKER_INFLUXDB_INIT_BUCKET=my-bucket \
  -e DOCKER_INFLUXDB_INIT_UPGRADE_V1_CONFIG=/root/influxdb/influxdb.conf \
  -e INFLUXD_CONFIG_PATH=/root/influxdb2/config.toml \
  -e INFLUXD_BOLT_PATH=/root/influxdb2/influxdb.bolt \
  -e INFLUXD_ENGINE_PATH=/root/influxdb2/engine \
  influxdb:{{< current-version >}}
```
{{% /tab-content %}}
<!--------------------------- END KEEP CUSTOM PATHS --------------------------->
<!-------------------------- BEGIN USE 2.x DEFAULTS --------------------------->
{{% tab-content %}}
To use default InfluxDB 2.x paths, start the InfluxDB container with the following:

- Volume mount for the InfluxDB 1.x data directory
- Volume mount for the InfluxDB 1.x configuration file
- Volume mount for the InfluxDB 2.x data directory (`/var/lib/influxdb2`)
- Volume mount for the InfluxDB 2.x configuration directory (`/etc/influxdb2`)
- InfluxDB [initialization mode](#upgrade-initialization-mode) environment variable
- InfluxDB [initialization credential](#influxdb-2x-initialization-credentials) environment variables
- InfluxDB 2.x [v1 configuration file path](#file-system-mounts) environment variable:
    - `DOCKER_INFLUXDB_INIT_UPGRADE_V1_CONFIG`
- `influxdb:{{< current-version >}}` Docker image

```sh
docker run -p 8086:8086 \
  -v influxdb:/root/influxdb/data \
  -v $PWD/influxdb.conf:/root/influxdb/influxdb.conf:ro \
  -v influxdb2:/var/lib/influxdb2 \
  -v influxdb2:/etc/influxdb2 \
  -e DOCKER_INFLUXDB_INIT_MODE=upgrade \
  -e DOCKER_INFLUXDB_INIT_USERNAME=my-user \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=my-password \
  -e DOCKER_INFLUXDB_INIT_ORG=my-org \
  -e DOCKER_INFLUXDB_INIT_BUCKET=my-bucket \
  -e DOCKER_INFLUXDB_INIT_UPGRADE_V1_CONFIG=/root/influxdb/influxdb.conf \
  influxdb:{{< current-version >}}
```
{{% /tab-content %}}
<!--------------------------- END USE 2.x DEFAULTS ---------------------------->
{{< /tabs-wrapper >}}
