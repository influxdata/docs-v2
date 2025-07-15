---
title: Install and run InfluxDB using Docker
description: >
  Install and run InfluxDB OSS v1.x using Docker. Configure and operate InfluxDB in a Docker container.
menu:
  influxdb_v1:
    name: Use Docker 
    weight: 60
    parent: Install InfluxDB
related:
  - /influxdb/v1/introduction/install/, Install InfluxDB OSS v1
  - /influxdb/v1/introduction/get-started/, Get started with InfluxDB OSS v1
  - /influxdb/v1/administration/authentication_and_authorization/, Authentication and authorization in InfluxDB OSS v1
  - /influxdb/v1/guides/write_data/, Write data to InfluxDB OSS v1
  - /influxdb/v1/guides/query_data/, Query data in InfluxDB OSS v1
  - /influxdb/v1/administration/config/, Configure InfluxDB OSS v1
alt_links:
  core: /influxdb3/core/install/
  enterprise: /influxdb3/enterprise/install/
  v2: /influxdb/v2/install/use-docker-compose/
---

Install and run InfluxDB OSS v1.x using Docker containers.
This guide covers Docker installation, configuration, and initialization options.

- [Install and run InfluxDB](#install-and-run-influxdb)
  - [Pull the InfluxDB v1.x image](#pull-the-influxdb-v1x-image)
  - [Start InfluxDB](#start-influxdb)
- [Configure InfluxDB](#configure-influxdb)
  - [Using environment variables](#using-environment-variables)
  - [Using a configuration file](#using-a-configuration-file)
- [Initialize InfluxDB](#initialize-influxdb)
  - [Automatic initialization (for development)](#automatic-initialization-for-development)
  - [Custom initialization scripts](#custom-initialization-scripts)
- [Access the InfluxDB CLI](#access-the-influxdb-cli)
- [Next steps](#next-steps)


## Install and run InfluxDB

### Pull the InfluxDB v1.x image

```bash
docker pull influxdb:{{< latest-patch >}}
```

### Start InfluxDB

Start a basic InfluxDB container with persistent storage:

```bash
docker run -p 8086:8086 \
  -v $PWD/data:/var/lib/influxdb \
  influxdb:{{< latest-patch >}}
```

InfluxDB is now running and available at http://localhost:8086.

## Configure InfluxDB

### Using environment variables

Configure InfluxDB settings using environment variables:

```bash
docker run -p 8086:8086 \
  -v $PWD/data:/var/lib/influxdb \
  -e INFLUXDB_REPORTING_DISABLED=true \
  -e INFLUXDB_HTTP_AUTH_ENABLED=true \
  -e INFLUXDB_HTTP_LOG_ENABLED=true \
  influxdb:{{< latest-patch >}}
```

### Using a configuration file

Generate a default configuration file:

```bash
docker run --rm influxdb:{{< latest-patch >}} influxd config > influxdb.conf
```

Start InfluxDB with your custom configuration:

```bash
docker run -p 8086:8086 \
  -v $PWD/influxdb.conf:/etc/influxdb/influxdb.conf:ro \
  -v $PWD/data:/var/lib/influxdb \
  influxdb:{{< latest-patch >}}
```

## Initialize InfluxDB

### Automatic initialization (for development)

> [!Warning]
> Automatic initialization with InfluxDB v1 is not recommended for production.
> Use this approach only for development and testing.

Automatically create a database and admin user on first startup:

```bash
docker run -p 8086:8086 \
  -v $PWD/data:/var/lib/influxdb \
  -e INFLUXDB_DB=mydb \
  -e INFLUXDB_HTTP_AUTH_ENABLED=true \
  -e INFLUXDB_ADMIN_USER=admin \
  -e INFLUXDB_ADMIN_PASSWORD=supersecretpassword \
  influxdb:{{< latest-patch >}}
```

Environment variables for user creation:
- `INFLUXDB_USER`: Create a user with no privileges
- `INFLUXDB_USER_PASSWORD`: Password for the user
- `INFLUXDB_READ_USER`: Create a user who can read from `INFLUXDB_DB`
- `INFLUXDB_READ_USER_PASSWORD`: Password for the read user
- `INFLUXDB_WRITE_USER`: Create a user who can write to `INFLUXDB_DB`
- `INFLUXDB_WRITE_USER_PASSWORD`: Password for the write user

### Custom initialization scripts

InfluxDB v1.x Docker containers support custom initialization scripts for testing scenarios:

Create an initialization script (`init-scripts/setup.iql`):

```sql
CREATE DATABASE sensors;
CREATE DATABASE logs;

CREATE USER "telegraf" WITH PASSWORD 'secret123';
GRANT WRITE ON "sensors" TO "telegraf";

CREATE USER "grafana" WITH PASSWORD 'secret456';
GRANT READ ON "sensors" TO "grafana";
GRANT READ ON "logs" TO "grafana";

CREATE RETENTION POLICY "one_week" ON "sensors" DURATION 1w REPLICATION 1 DEFAULT;
```

Run with initialization scripts:

```bash
docker run -p 8086:8086 \
  -v $PWD/data:/var/lib/influxdb \
  -v $PWD/init-scripts:/docker-entrypoint-initdb.d \
  influxdb:{{< latest-patch >}}
```

Supported script types:
- Shell scripts (`.sh`)
- InfluxDB query language files (`.iql`)

> [!Important]
> Initialization scripts only run on first startup when the data directory is empty.
> Scripts execute in alphabetical order based on filename.

## Access the InfluxDB CLI

To access the InfluxDB command line interface from within the Docker container:

```bash
docker exec -it <container-name> influx
```

Replace `<container-name>` with your InfluxDB container name or ID.

## Next steps

Once you have InfluxDB running in Docker, see the [Get started guide](/influxdb/v1/introduction/get-started/) to:
- Create databases
- Write and query data
- Learn InfluxQL basics