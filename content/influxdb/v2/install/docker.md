---
title: Run InfluxDB in a Docker container
description: >
  Learn how to run the InfluxDB Docker Hub image and use InfluxDB in a Docker container.
  Start a container initialized with a primary user, token, bucket, and organization.
  Configure and interact with InfluxDB from within or outside a running container.
menu:
  influxdb_v2:
    name: Use Docker
    parent: Install InfluxDB
weight: 201
related:
  - /influxdb/v2/install/
  - /influxdb/v2/reference/config-options/
  - /influxdb/v2/admin/tokens/
  - /influxdb/v2/admin/buckets/
  - /influxdb/v2/tools/influx-cli/
  - /influxdb/v2/reference/api/
---

The InfluxDB v2 time series platform is purpose-built to collect, store,
process and visualize metrics and events.
Learn how to use the InfluxDB Docker Hub image to install, set up, and interact with InfluxDB.

- [Install and set up](#install-and-set-up)
- [Install Docker](#install-docker)
- [Run InfluxDB v2 in a Docker container](#run-influxdb-v2-in-a-docker-container)
  - [Run InfluxDB v2 with the Docker automated setup](#run-influxdb-v2-with-the-docker-automated-setup)
  - [Run InfluxDB v2 and setup manually](#run-influxdb-v2-and-setup-manually)
  - [Configuration](#configuration)
  - [Database Setup](#database-setup)
  - [Interacting with InfluxDB](#interacting-with-influxdb)
  - [Custom Initialization Scripts](#custom-initialization-scripts)
  - [Upgrading from InfluxDB 1.x](#upgrading-from-influxdb-1x)


## Docker-specific features

The InfluxDB Docker Hub image installs InfluxDB v2 in a container and lets you start a container with initialization options to automate InfluxDB setup.

You can use the `influx` CLI to interact with InfluxDB from inside or outside a container.

The image installs InfluxDB and the `influx` CLI in a container.

You can use the included `influx` CLI to run commands inside the container--for example, if you don't have access to the container on the host network or don't want to share InfluxDB credentials between the host and container.
If you setup InfluxDB (using automated setup options or the `influx` CLI) from within the container, then InfluxDB automatically provides a default connection configuration with credentials for the included `influx` CLI.

If you expose the container

## Install and set up


To quickly get up and running with InfluxDB v2 in Docker, see how to [install and set up using Docker](/influxdb/v2/install/?t=Docker).

## Install Docker

## Run InfluxDB v2 in a Docker container


- Image hosted at
- To download and inspect the image... ```docker pull```

The InfluxDB setup process is a one-time process that creates an initial primary user, token, bucket, and organization for your InfluxDB instance.
InfluxDB and Docker provide several ways to run the setup process--during `docker run` or after, from within or outside the container, and with or without network access to the container.

### Run InfluxDB v2 with the Docker automated setup

The InfluxDB Docker Hub image provides a Docker-specific feature that invokes the InfluxDB `setup` API when you create a container.

To start a new container and set up InfluxDB in a single command, pass `-e DOCKER_INFLUXDB_INIT_MODE=setup` and the required [initial setup options](#initial-setup-options) as environment variables
in your `docker run` command--for example:

```sh
docker run -d -p 8086:8086 \
  -v $PWD/data:/var/lib/influxdb2 \
  -v $PWD/config:/etc/influxdb2 \
  -e DOCKER_INFLUXDB_INIT_MODE=setup \
  -e DOCKER_INFLUXDB_INIT_USERNAME=<USERNAME> \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=<PASSWORD> \
  -e DOCKER_INFLUXDB_INIT_ORG=<ORG_NAME> \
  -e DOCKER_INFLUXDB_INIT_BUCKET=<BUCKET_NAME> \
  influxdb:latest
```

Replace the following with your own values:

- `<USERNAME>`: The username for the initial operator [user](https://docs.influxdata.com/influxdb/v2/admin/users/), a "super-user" with an [operator token](https://docs.influxdata.com/influxdb/v2/admin/tokens/#operator-token).
- `<PASSWORD>`: The password for the initial operator [user](https://docs.influxdata.com/influxdb/v2/admin/users/).
- `<ORG_NAME>`: The name for the initial [organization](https://docs.influxdata.com/influxdb/v2/admin/organizations/).
- `<BUCKET_NAME>`: The name for the initial [bucket](https://docs.influxdata.com/influxdb/v2/admin/buckets/).

The command passes the following arguments:

- `-p 8086:8086`: Forwards the container's `8086` port to expose the InfluxDB [UI](https://docs.influxdata.com/influxdb/v2/get-started/#influxdb-user-interface-ui) and [HTTP API](https://docs.influxdata.com/influxdb/v2/reference/api/) on the host's `8086` port.
- `--mount type=bind,source=$PWD/data,target=/var/lib/influxdb2`: Bind mounts the host's `$PWD/data` directory to the [InfluxDB data directory](https://docs.influxdata.com/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout) to persist data outside the container.
- `--mount type=bind,source=$PWD/config,target=/etc/influxdb2`: Bind mounts the host's `$PWD/config` host directory to the [InfluxDB configuration directory](https://docs.influxdata.com/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout) to persist configurations outside the container.
- `-e DOCKER_INFLUXDB_INIT_MODE=setup`: Environment variable that invokes the automated setup of the initial organization, user, bucket, and token when creating the container.

#### Initial setup options

`DOCKER_INFLUXDB_INIT_MODE=setup`: `setup` mode invokes automated setup of the initial organization, user, bucket, and token when creating the container.

In `setup` mode (`-e DOCKER_INFLUXDB_INIT_MODE=setup`), InfluxDB supports the following Docker-specific environment variables:

- `DOCKER_INFLUXDB_INIT_USERNAME`: The username to set for the initial [user](https://docs.influxdata.com/influxdb/v2/admin/users/), a "super-user" with an [operator token](https://docs.influxdata.com/influxdb/v2/admin/tokens/#operator-token).
- `DOCKER_INFLUXDB_INIT_PASSWORD`: The password to set for the initial [user](https://docs.influxdata.com/influxdb/v2/admin/users/).
- `DOCKER_INFLUXDB_INIT_ORG`: The name to set for the initial [organization](https://docs.influxdata.com/influxdb/v2/admin/organizations/).
- `DOCKER_INFLUXDB_INIT_BUCKET`: The name for the initial [bucket](https://docs.influxdata.com/influxdb/v2/admin/buckets/).
- Optional: `DOCKER_INFLUXDB_INIT_RETENTION`: The bucket [retention period (duration to keep data)](https://docs.influxdata.com/influxdb/v2/reference/internals/data-retention/#bucket-retention-period)
  Default is _infinite_ (`0`) and doesn't delete data.
- Optional: `DOCKER_INFLUXDB_INIT_ADMIN_TOKEN`: The value to set for the [_operator_ API token](https://docs.influxdata.com/influxdb/v2/admin/tokens/#operator-token).
  Default auto-generates an API token.

The following example shows how to pass values for all initial setup options:

```sh
docker run -d -p 8086:8086 \
  -v $PWD/data:/var/lib/influxdb2 \
  -v $PWD/config:/etc/influxdb2 \
  -e DOCKER_INFLUXDB_INIT_MODE=setup \
  -e DOCKER_INFLUXDB_INIT_USERNAME=my-user \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=my-password \
  -e DOCKER_INFLUXDB_INIT_ORG=my-org \
  -e DOCKER_INFLUXDB_INIT_BUCKET=my-bucket \
  -e DOCKER_INFLUXDB_INIT_RETENTION=1w \
  -e DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=my-super-secret-auth-token \
  influxdb:latest
```

{{% note %}}

#### Automated setup ignored

Automated setup won't run if an existing `influxd.bolt` boltdb file from a previous setup is found in the configured data directory.
This behavior allows for the InfluxDB container to reboot post-setup without encountering "DB is already set up" errors.

{{% /note %}}

### Setup InfluxDB in a running container

If you create an InfluxDB container and don’t specify [initial setup options](#initial-setup-options), you can
use the UI, `influx CLI`, or HTTP API to setup InfluxDB in the running container.

#### Setup from outside the container

1. Enter the following command to start an InfluxDB container:

   ```sh
   # Create config and data directories on the host
   mkdir config data && \
   # Start a new container
   docker run \
       --name influxdb2 \
       -p 8086:8086 \
       --mount type=bind,source=$PWD/data,target=/var/lib/influxdb2 \
       --mount type=bind,source=$PWD/config,target=/etc/influxdb2 \
       influxdb:{{% latest-patch patchVersion="v2" %}}
   ```

   The command passes the following arguments:

   - `-p 8086:8086`: [Publishes](https://docs.docker.com/reference/cli/docker/container/run/#publish) container port `8086` port (the default for the InfluxDB [UI](https://docs.influxdata.com/influxdb/v2/get-started/#influxdb-user-interface-ui) and [HTTP API](https://docs.influxdata.com/influxdb/v2/reference/api/)) to host port `8086`.
   - `--mount type=bind,source=$PWD/data,target=/var/lib/influxdb2`: Bind mounts the host's `$PWD/data` directory to the [InfluxDB data directory](https://docs.influxdata.com/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout) to persist data outside the container.
   - `--mount type=bind,source=$PWD/config,target=/etc/influxdb2`: Bind mounts the host's `$PWD/config` host directory to the [InfluxDB configuration directory](https://docs.influxdata.com/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout) to persist configurations outside the container.

2. Check that InfluxDB is accessible from the host system--for example:

   - In your browser, visit [http://localhost:8086].
   - In your terminal, send a request to the InfluxDB HTTP API:

     ```sh
     curl -v http://localhost:8086/ping
     ```

3. On the host system, [use the UI, `influx CLI`, or HTTP API to setup InfluxDB]().


#### Setup using influx CLI within the container

The InfluxDB Docker Hub image automatically installs the [`influx` CLI](https://docs.influxdata.com/influxdb/v2/reference/cli/influx/) into the container.

After you start a container, you can use the [`docker exec` command](https://docs.docker.com/reference/cli/docker/container/exec/) to run `influx` CLI commands within the running container--for example, enter the following command to run the initial setup:

```sh
docker exec influxdb2 influx setup \
  --username $USERNAME \
  --password $PASSWORD \
  --org $ORG_NAME \
  --bucket $BUCKET_NAME \
  --force
```

Replace the following environment variables with your own values:

- `$USERNAME`: The username for the initial operator [user](https://docs.influxdata.com/influxdb/v2/admin/users/), a "super-user" with an [operator token](https://docs.influxdata.com/influxdb/v2/admin/tokens/#operator-token).
- `$PASSWORD`: The password for the initial operator [user](https://docs.influxdata.com/influxdb/v2/admin/users/).
- `$ORG_NAME`: The name for the initial [organization](https://docs.influxdata.com/influxdb/v2/admin/organizations/).
- `$BUCKET_NAME`: The name for the initial [bucket](https://docs.influxdata.com/influxdb/v2/admin/buckets/).

InfluxDB stores the initial setup values that you provide as the default active configuration for the `influx` CLI.

To learn more, see how to [set up InfluxDB with the `influx` CLI](/influxdb/v2/install/#set-up-influxdb).

### InfluxDB v2 file paths and networking ports

The InfluxDB Docker Hub image uses the following default ports and file paths in an InfluxDB v2 container:

- TCP port `8086`: the default port for the InfluxDB [UI](https://docs.influxdata.com/influxdb/v2/get-started/#influxdb-user-interface-ui) and [HTTP API](https://docs.influxdata.com/influxdb/v2/reference/api/).
  To specify a different port or address, use the [`http-bind-address` option](https://docs.influxdata.com/influxdb/v2/reference/config-options/#http-bind-address).
- `/var/lib/influxdb2`: the [InfluxDB data directory](https://docs.influxdata.com/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout)

| [Engine path](#engine-path)   | `/var/lib/influxdb2/engine/`        |
| [Bolt path](#bolt-path)       | `/var/lib/influxdb2/influxd.bolt`   |
| [SQLite path](#sqlite-path)   | `/var/lib/influxdb2/influxd.sqlite` |
| [Configs path](#configs-path) | `/etc/influxdb2/configs`            |

- `/etc/influxdb2`: the [InfluxDB configuration directory](https://docs.influxdata.com/influxdb/v2/reference/internals/file-system-layout/?t=docker#file-system-layout)
  - `/etc/influxdb2/influx-configs`: Stores connection configurations if you setup InfluxDB from within the container (using [automated setup]() or [the container's `influx` CLI ]()).

### Configuration

Configure InfluxDB using a configuration file, environment variables, and CLI options.

#### Use a configuration file

##### Prerequisite

- The `influx server-config` command requires an [_operator_ token](), created when you [set up InfluxDB](https://docs.influxdata.com/influxdb/v2/install/#set-up-influxdb).

To customize and mount an InfluxDB configuration file, do the following:

1. Output the current server configuration to a file in the mounted configuration directory--for example:

   ```sh
   docker exec -it influxdb2 influx server-config > $PWD/config/config.yml
   ```

   Replace `$PWD/config/` with the host directory that you mounted to the `/etc/influxdb2` InfluxDB configuration directory.

2. Edit the `config.yml` file to customize [server configuration options]().
3. Restart the InfluxDB container.

   ```sh
   docker restart influxdb2
   ```

You can use [environment variables](#use-environment-variables) and [command line flags](#use-command-line-flags) to override specific [configuration options](https://docs.influxdata.com/influxdb/v2/reference/config-options/#configuration-options).

#### Use environment variables

Environment variables take precedence over [configuration file](#use-a-server-configuration-file) settings.

The following example passes an environment variable to Docker to override the [`storage-wal-fsync-delay`](/influxdb/v2/reference/config-options/#storage-wal-fsync-delay) option:

```sh
docker run -p 8086:8086 \
  -e INFLUXD_STORAGE_WAL_FSYNC_DELAY=15m \
  influxdb:2.7.5
```

#### Use command line flags

Command line flags take precedence over options in [environment variables](#use-environment-variables) and the [configuration file](#use-a-server-configuration-file).

The following example passes a command line flag to `influxd` to override the [`storage-wal-fsync-delay`](/influxdb/v2/reference/config-options/#storage-wal-fsync-delay) option:

```console
docker run -p 8086:8086 \
  influxdb:2.7.5 \
  --storage-wal-fsync-delay=15m
```

For more information and the complete list of options, see [configuration options](https://docs.influxdata.com/influxdb/v2/reference/config-options/).

### Interacting with InfluxDB

After you complete the initial setup, you're ready to write and query data.

- [Writing data](https://docs.influxdata.com/influxdb/v2/write-data/)
- [Reading data](https://docs.influxdata.com/influxdb/v2/query-data/)
- [Configuring security](https://docs.influxdata.com/influxdb/v2/security/)

### Custom Initialization Scripts

The InfluxDB image supports running arbitrary initialization scripts after initial system setup, on both the `setup` and `upgrade` paths. Scripts must have extension `.sh`, must have execute file permissions (`chmod +x <yourscript.sh>`) and be mounted inside of the `/docker-entrypoint-initdb.d` directory. When multiple scripts are present, they will be executed in lexical sort order by name.

As a convenience for script-writers, the image will export a number of variables into the environment before executing any scripts:

-	`INFLUX_CONFIGS_PATH`: Path to the CLI configs file written by `setup`/`upgrade`
-	`INFLUX_HOST`: URL to the `influxd` instance running setup logic
-	`DOCKER_INFLUXDB_INIT_USER_ID`: ID of the initial admin user created by `setup`/`upgrade`
-	`DOCKER_INFLUXDB_INIT_ORG_ID`: ID of the initial organization created by `setup`/`upgrade`
-	`DOCKER_INFLUXDB_INIT_BUCKET_ID`: ID of the initial bucket created by `setup`/`upgrade`

For example, if you wanted to grant write-access to an InfluxDB 1.x client on your initial bucket, you'd first create the file `$PWD/scripts/setup-v1.sh` with contents:

```bash
#!/bin/bash
set -e

influx v1 dbrp create \
  --bucket-id ${DOCKER_INFLUXDB_INIT_BUCKET_ID} \
  --db ${V1_DB_NAME} \
  --rp ${V1_RP_NAME} \
  --default \
  --org ${DOCKER_INFLUXDB_INIT_ORG}

influx v1 auth create \
  --username ${V1_AUTH_USERNAME} \
  --password ${V1_AUTH_PASSWORD} \
  --write-bucket ${DOCKER_INFLUXDB_INIT_BUCKET_ID} \
  --org ${DOCKER_INFLUXDB_INIT_ORG}
```

Then you'd run:

```console
$ docker run -p 8086:8086 \
      -v $PWD/data:/var/lib/influxdb2 \
      -v $PWD/config:/etc/influxdb2 \
      -v $PWD/scripts:/docker-entrypoint-initdb.d \
      -e DOCKER_INFLUXDB_INIT_MODE=setup \
      -e DOCKER_INFLUXDB_INIT_USERNAME=my-user \
      -e DOCKER_INFLUXDB_INIT_PASSWORD=my-password \
      -e DOCKER_INFLUXDB_INIT_ORG=my-org \
      -e DOCKER_INFLUXDB_INIT_BUCKET=my-bucket \
      -e V1_DB_NAME=v1-db \
      -e V1_RP_NAME=v1-rp \
      -e V1_AUTH_USERNAME=v1-user \
      -e V1_AUTH_PASSWORD=v1-password \
      influxdb:2.0
```

**NOTE:** Custom scripts will not run if an existing boltdb file is found at the configured path (causing `setup` or `upgrade` to be skipped). This behavior allows for the InfluxDB container to reboot post-initialization without encountering errors from non-idempotent script commands.

### Upgrading from InfluxDB 1.x

InfluxDB 2.x provides a 1.x-compatible API, but expects a different storage layout on disk. To bridge this mismatch, the InfluxDB image contains extra functionality to migrate 1.x data and config into 2.x layouts automatically before booting the `influxd` server.

The automated upgrade process bootstraps an initial admin user, organization, and bucket in the system. Additional environment variables are used to configure the setup logic:

-	`DOCKER_INFLUXDB_INIT_USERNAME`: The username to set for the system's initial super-user (**Required**).
-	`DOCKER_INFLUXDB_INIT_PASSWORD`: The password to set for the system's inital super-user (**Required**).
-	`DOCKER_INFLUXDB_INIT_ORG`: The name to set for the system's initial organization (**Required**).
-	`DOCKER_INFLUXDB_INIT_BUCKET`: The name to set for the system's initial bucket (**Required**).
-	`DOCKER_INFLUXDB_INIT_RETENTION`: The duration the system's initial bucket should retain data. If not set, the initial bucket will retain data forever.
-	`DOCKER_INFLUXDB_INIT_ADMIN_TOKEN`: The authentication token to associate with the system's initial super-user. If not set, a token will be auto-generated by the system.

It also requires extra volumes to be mounted into the 2.x container:

-	Data from the 1.x instance
-	Custom config from the 1.x instance (if any)

The upgrade process searches for mounted 1.x data / config in this priority order:

1.	A config file referred to by the `DOCKER_INFLUXDB_INIT_UPGRADE_V1_CONFIG` environment variable
2.	A data directory referred to by the `DOCKER_INFLUXDB_INIT_UPGRADE_V1_DIR` environment variable
3.	A config file mounted at `/etc/influxdb/influxdb.conf`
4.	A data directory mounted at `/var/lib/influxdb`

Finally, the `DOCKER_INFLUXDB_INIT_MODE` environment variable must be set to `upgrade`.

Automated upgrade will generate both data and config files, by default under `/var/lib/influxdb2` and `/etc/influxdb2`. It's recommended to mount volumes at both paths to avoid losing data.

**NOTE:** Automated upgrade will not run if an existing boltdb file is found at the configured path. This behavior allows for the InfluxDB container to reboot post-upgrade without overwriting migrated data.

Find more about the InfluxDB upgrade process [here](https://docs.influxdata.com/influxdb/v2.0/upgrade/v1-to-v2/). See below for examples of common upgrade scenarios.
