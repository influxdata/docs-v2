---
title: Upgrade from InfluxDB 1.x to 2.0 with Docker
description: >
  Use the automated upgrade process built into the InfluxDB 2.x Docker image to
  update InfluxDB 1.x Docker deployments to InfluxDB 2.x.
menu:
  influxdb_2_0:
    parent: InfluxDB 1.x to 2.0
    name: Upgrade with Docker
weight: 101
---

Use the automated upgrade process built into the [InfluxDB 2.x Docker image](https://hub.docker.com/_/influxdb)
to update InfluxDB 1.x Docker deployments to InfluxDB 2.x.

- [Upgrade requirements](#upgrade-requirements)
- [Upgrade examples](#upgrade-examples)

{{% note %}}
#### Export continuous queries before upgrading
The automated upgrade process **does not** migrate InfluxDB 1.x continuous queries (CQs)
to InfluxDB 2.x tasks. Export all of your CQs before upgrading to InfluxDB 2.x.
For information about exporting and migrating CQs to tasks, see
[Migrate continuous queries to tasks](/influxdb/v2.0/upgrade/v1-to-v2/migrate-cqs/).
{{% /note %}}

## Upgrade requirements
InfluxDB 2.x provides a 1.x-compatible API, but expects a different storage layout on disk.
To account for theses differences, the InfluxDB Docker image contains extra functionality to migrate
1.x data and configuration into 2.x layouts automatically before booting the `influxd` server.

- [InfluxDB 2.x initialization credentials](#influxdb-2x-initialization-credentials)
- [File system mounts](#file-system-mounts)
- [Upgrade initialization mode](#upgrade-initialization-mode)

{{% note %}}
The automated upgrade process will not run if an existing boltdb file is found at the configured path.
This behavior allows for the InfluxDB container to reboot post-upgrade without overwriting migrated data.
{{% /note %}}

Find more information about the automated InfluxDB upgrade process,
see [Upgrade from InfluxDB 1.x to 2.0](/influxdb/v2.0/upgrade/v1-to-v2/).

### InfluxDB 2.x initialization credentials
The automated InfluxDB upgrade process bootstraps an initial admin user,
[organization](/influxdb/v2.0/reference/glossary/#organization), and
[bucket](/influxdb/v2.0/reference/glossary/#bucket) required by InfluxDB 2.x.
Use the following environment variables to provide setup credentials:

-	`DOCKER_INFLUXDB_INIT_USERNAME`: username to set for the admin user ({{< req >}}).
-	`DOCKER_INFLUXDB_INIT_PASSWORD`: password to set for the admin user ({{< req >}}).
-	`DOCKER_INFLUXDB_INIT_ORG`: name to set for the initial organization ({{< req >}}).
-	`DOCKER_INFLUXDB_INIT_BUCKET`: name to set for the initial bucket ({{< req >}}).
-	`DOCKER_INFLUXDB_INIT_RETENTION`: duration for the initial bucket's retention period
  If not set, the initial bucket will retain data forever.
-	`DOCKER_INFLUXDB_INIT_ADMIN_TOKEN`: The authentication token to associate with the admin user.
  If not set, InfluxDB auto-generates a token.

### File system mounts
The InfluxDB upgrade process requires extra volumes to be mounted into the 2.x container.
Use **environment variables** and **Docker mounts** to specify and configure the
appropriate mount paths for the following:

-	1.x data on disk
-	Custom 1.x configuration file (if any)

The InfluxDB upgrade process searches for mounted 1.x data and configuration files
in the following priority order:

1.	1.x configuration file specified by the `DOCKER_INFLUXDB_INIT_UPGRADE_V1_CONFIG` environment variable
2.	1.x data directory specified by the `DOCKER_INFLUXDB_INIT_UPGRADE_V1_DIR` environment variable
3.	1.x configuration file mounted at `/etc/influxdb/influxdb.conf`
4.	1.x data directory mounted at `/var/lib/influxdb`

{{% note %}}
#### Avoid data loss
The automated upgrade process generates both data and configuration files, by default,
under `/var/lib/influxdb2` and `/etc/influxdb2`.
We recommend mounting volumes at both paths to avoid losing data.
{{% /note %}}

### Upgrade initialization mode
Set the `DOCKER_INFLUXDB_INIT_MODE` environment variable to `upgrade`.

## Upgrade examples
The examples below provide information for different InfluxDB Docker upgrade scenarios.

- [Minimal upgrade](#minimal-upgrade)
- [Upgrade with a custom InfluxDB 1.x configuration file](#upgrade-with-a-custom-influxdb-1-x-configuration-file)
- [Upgrade with custom paths](#upgrade-with-custom-paths)

### Minimal upgrade
If you're currently running a minimal InfluxDB 1.x deployment similar to:

```sh
docker run -p 8086:8086 \
  -v influxdb:/var/lib/influxdb \
  influxdb:1.8
```

**To upgrade this minimal deployment to InfluxDB 2.x:**

1.  Stop the running InfluxDB 1.x container.
2.  Start the InfluxDB container and specify the following:

    - Volume mount for the InfluxDB 1.x data directory
    - Volume mount for the InfluxDB 2.x data directory
    - InfluxDB [initialization mode](#upgrade-initialization-mode) environment variable
    - InfluxDB [initialization credential](#influxdb-2x-initialization-credentials) environment variables
    - `influxdb:2.0` Docker image

    ```sh
    docker run -p 8086:8086 \
      -v influxdb:/var/lib/influxdb \
      -v influxdb2:/var/lib/influxdb2 \
      -e DOCKER_INFLUXDB_INIT_MODE=upgrade \
      -e DOCKER_INFLUXDB_INIT_USERNAME=my-user \
      -e DOCKER_INFLUXDB_INIT_PASSWORD=my-password \
      -e DOCKER_INFLUXDB_INIT_ORG=my-org \
      -e DOCKER_INFLUXDB_INIT_BUCKET=my-bucket \
      influxdb:2.0
    ```

### Upgrade with a custom InfluxDB 1.x configuration file
If you're currently running an InfluxDB 1.x deployment with custom configuration
file similar to:

```sh
docker run -p 8086:8086 \
  -v influxdb:/var/lib/influxdb \
  -v $PWD/influxdb.conf:/etc/influxdb/influxdb.conf:ro \
  influxdb:1.8
```

**To upgrade an InfluxDB 1.x deployment with a custom configuration file to InfluxDB 2.x:**

1.  Stop the running InfluxDB 1.x container.
2.  Start the InfluxDB container and specify the following:

    - Volume mount for the InfluxDB 1.x data directory
    - Volume mount for the InfluxDB 1.x configuration file
    - Volume mount for the InfluxDB 2.x data directory
    - InfluxDB [initialization mode](#upgrade-initialization-mode) environment variable
    - InfluxDB [initialization credential](#influxdb-2x-initialization-credentials) environment variables
    - `influxdb:2.0` Docker image

```sh
docker run -p 8086:8086 \
  -v influxdb:/var/lib/influxdb \
  -v $PWD/influxdb.conf:/etc/influxdb/influxdb.conf:ro \
  -v influxdb2:/var/lib/influxdb2 \
  -e DOCKER_INFLUXDB_INIT_MODE=upgrade \
  -e DOCKER_INFLUXDB_INIT_USERNAME=my-user \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=my-password \
  -e DOCKER_INFLUXDB_INIT_ORG=my-org \
  -e DOCKER_INFLUXDB_INIT_BUCKET=my-bucket \
  influxdb:2.0
```

### Upgrade with custom paths
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

To retain your custom InfluxDB 1.x paths, start the InfluxDB container and specify the following:

- Volume mount for the InfluxDB 1.x data directory
- Volume mount for the InfluxDB 1.x configuration file
- Volume mount for the InfluxDB 2.x data directory
- InfluxDB [initialization mode](#upgrade-initialization-mode) environment variable
- InfluxDB [initialization credential](#influxdb-2x-initialization-credentials) environment variables
- InfluxDB 2.x [v1 configuration file path](#file-system-mounts) environment variable:
    - `DOCKER_INFLUXDB_INIT_UPGRADE_V1_CONFIG`
- InfluxDB 1.x custom path environment variables:
    - `DOCKER_INFLUXDB_CONFIG_PATH`
    - `DOCKER_INFLUXDB_BOLT_PATH`
    - `DOCKER_INFLUXDB_ENGINE_PATH`
- `influxdb:2.0` Docker image

```sh
docker run -p 8086:8086 \
  -v influxdb:/root/influxdb/data \
  -v $PWD/influxdb.conf:/root/influxdb/influxdb.conf:ro \
  -v influxdb2:/root/influxdb2/data \
  -e DOCKER_INFLUXDB_INIT_MODE=upgrade \
  -e DOCKER_INFLUXDB_INIT_USERNAME=my-user \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=my-password \
  -e DOCKER_INFLUXDB_INIT_ORG=my-org \
  -e DOCKER_INFLUXDB_INIT_BUCKET=my-bucket \
  -e DOCKER_INFLUXDB_INIT_UPGRADE_V1_CONFIG=/root/influxdb/influxdb.conf \
  -e DOCKER_INFLUXDB_CONFIG_PATH=/root/influxdb2/config.toml \
  -e DOCKER_INFLUXDB_BOLT_PATH=/root/influxdb2/influxdb.bolt \
  -e DOCKER_INFLUXDB_ENGINE_PATH=/root/influxdb2/engine \
  influxdb:2.0
```
{{% /tab-content %}}
<!--------------------------- END KEEP CUSTOM PATHS --------------------------->
<!-------------------------- BEGIN USE 2.x DEFAULTS --------------------------->
{{% tab-content %}}
To use InfluxDB 2.x default paths, start the InfluxDB container and specify the following:

- Volume mount for the InfluxDB 1.x data directory
- Volume mount for the InfluxDB 1.x configuration file
- Volume mount for the InfluxDB 2.x data directory
- InfluxDB [initialization mode](#upgrade-initialization-mode) environment variable
- InfluxDB [initialization credential](#influxdb-2x-initialization-credentials) environment variables
- InfluxDB 2.x [v1 configuration file path](#file-system-mounts) environment variable:
    - `DOCKER_INFLUXDB_INIT_UPGRADE_V1_CONFIG`
- `influxdb:2.0` Docker image

```sh
docker run -p 8086:8086 \
  -v influxdb:/root/influxdb/data \
  -v $PWD/influxdb.conf:/root/influxdb/influxdb.conf:ro \
  -v influxdb2:/var/lib/influxdb2 \
  -e DOCKER_INFLUXDB_INIT_MODE=upgrade \
  -e DOCKER_INFLUXDB_INIT_USERNAME=my-user \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=my-password \
  -e DOCKER_INFLUXDB_INIT_ORG=my-org \
  -e DOCKER_INFLUXDB_INIT_BUCKET=my-bucket \
  -e DOCKER_INFLUXDB_INIT_UPGRADE_V1_CONFIG=/root/influxdb/influxdb.conf \
  influxdb:2.0
```
{{% /tab-content %}}
<!--------------------------- END USE 2.x DEFAULTS ---------------------------->
{{< /tabs-wrapper >}}
