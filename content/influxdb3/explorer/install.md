---
title: Install and run InfluxDB 3 Explorer
description: >
  Use [Docker](https://docker.com) to install and run **InfluxDB 3 Explorer**.
menu:
  influxdb3_explorer:
    name: Install Explorer
weight: 2
---


Use [Docker](https://docker.com) to install and run **InfluxDB 3 Explorer**.

<!-- BEGIN TOC -->
- [Run the InfluxDB 3 Explorer Docker container](#run-the-influxdb-3-explorer-docker-container)
- [Enable TLS/SSL (HTTPS)](#enable-tlsssl-(https))
- [Pre-configure InfluxDB connection settings](#pre-configure-influxdb-connection-settings)
- [Run in admin or query mode](#run-in-admin-or-query-mode)
  - [Run in Admin Mode](#run-in-admin-mode)
  - [Run in Query Mode](#run-in-query-mode)
- [Environment Variables](#environment-variables)
- [Volume Reference](#volume-reference)
- [Exposed Ports](#exposed-ports)
  - [Custom port mapping](#custom-port-mapping)
<!-- END TOC -->

## Run the InfluxDB 3 Explorer Docker container

1.  **Install Docker**

    If you haven't already, install [Docker](https://docs.docker.com/engine/) or
    [Docker Desktop](https://docs.docker.com/desktop/).

2.  **Pull the {{% product-name %}} Docker image**

    ```bash
    docker pull quay.io/influxdb/influxdb3-explorer:latest
    ```

3.  **Create local directories** _(optional)_

    {{% product-name %}} can mount the following directories on your local
    machine:

    | Directory  | Description                                                                                       | Permissions |
    | :--------- | :------------------------------------------------------------------------------------------------ | :---------: |
    | `./db`     | Stores {{% product-name %}} application data                                                                  |     700     |
    | `./config` | Stores [pre-configured InfluxDB connection settings](#pre-configure-influxdb-connection-settings) |     755     |
    | `./ssl`    | Stores TLS/SSL certificates _(Required when [using TLS/SSL](#enable-tlsssl-https))_               |     755     |

    > [!Important]
    > If you don't create and mount a local `./db` directory, {{% product-name %}}
    > stores application data in the container's file system.
    > This data will be lost when the container is deleted.

    To create these directories with the appropriate permissions, run the
    following commands from your current working directory:

    ```bash
    mkdir -m 700 ./db
    mkdir -m 755 ./config
    mkdir -m 755 ./ssl
    ```

4.  **Run the {{% product-name %}} container**

    Use the `docker run` command to start the {{% product-name %}} container.
    Include the following:

    - Port mappings:
      - `8888` to `80` (or `443` if using TLS/SSL)
      - `8889` to `8888`
    - Mounted volumes:
      - `$(pwd)/db:/db:rw`
      - `$(pwd)/config:/app-root/config:ro`
      - `$(pwd)/ssl:/etc/nginx/ssl:ro`
    - Any of the available [environment variables](#environment-variables) 

    ```bash
    docker run -d \
      --name influxdb3-explorer \
      --publish 8888:80 \
      --publish 8889:8888 \
      --volume $(pwd)/config:/app-root/config:ro \
      --volume $(pwd)/db:/db:rw \
      --volume $(pwd)/ssl:/etc/nginx/ssl:ro \
      --env MODE=admin \
      influxdb3-explorer
    ```

5.  **Access the {{% product-name %}} user interface (UI) at <http://localhost:8888>**.

---

## Enable TLS/SSL (HTTPS)

To enable TLS/SSL, mount valid certificate and key files into the container:

1.  **Place your TLS/SSL certificate files your local `./ssl` directory**

    Required files:

    - Certificate: `server.crt` or `fullchain.pem`
    - Private key: `server.key`

2.  **When running your container, mount the SSL directory and map port 443 to port 8888**
   
    Include the following options when running your Docker container:

    ```sh
    --volume $(pwd)/ssl:/etc/nginx/ssl:ro \
    --publish 8888:443
    ```

The nginx web server automatically uses certificate files when they are present
in the mounted path.

---

## Pre-configure InfluxDB connection settings

You can predefine InfluxDB connection settings using a `config.json` file.

{{% code-placeholders "INFLUXDB3_HOST|INFLUXDB_DATABASE_NAME|INFLUXDB3_AUTH_TOKEN|INFLUXDB3_SERVER_NAME" %}}

1.  **Create a `config.json` file in your local `./config` directory**

    ```json
    {
      "DEFAULT_INFLUX_SERVER": "INFLUXDB3_HOST",
      "DEFAULT_INFLUX_DATABASE": "INFLUXDB_DATABASE_NAME",
      "DEFAULT_API_TOKEN": "INFLUXDB3_AUTH_TOKEN",
      "DEFAULT_SERVER_NAME": "INFLUXDB3_SERVER_NAME"
    }
    ```

    > [!Important]
    > If connecting to an InfluxDB 3 Core or Enterprise instance running on
    > localhost (outside of the container), use the internal Docker network to
    > in your InfluxDB 3 host value--for example:
    >
    > ```txt
    > http://host.docker.internal:8181
    > ```

2.  **Mount the configuration directory**

    Include the following option when running your Docker container:

    ```sh
    --volumne $(pwd)/config:/app-root/config:ro
    ```

{{% /code-placeholders %}}

These settings will be used as defaults when the container starts.

---

## Run in admin or query mode

{{% product-name %}} has the following operational modes:

- **Admin mode (default):** Full UI and API access for administrators
- **Query mode:** Read-only UI and query interface

You can control the operational mode using the `MODE` environment variable.

### Run in Admin Mode {note="(default)"}

```sh
docker run -d \
  -e MODE=admin \
  ...
```

### Run in Query Mode

```sh
docker run -d \
  -e MODE=query \
  ...
```

If `MODE` is not set, the container defaults to admin mode.

---

## Environment Variables

| Variable       | Description                                      | Default              |
|----------------|--------------------------------------------------|----------------------|
| `DATABASE_URL` | Path to SQLite DB inside container               | `/db/sqlite.db`      |
| `MODE`         | Set to `admin` or `query`                        | `admin`              |

---

## Volume Reference

| Container Path       | Purpose                      | Host Example               |
|----------------------|------------------------------|----------------------------|
| `/db`                | SQLite DB storage            | `./db`                     |
| `/app-root/config`   | JSON config for defaults     | `./config`                 |
| `/etc/nginx/ssl`     | SSL certs for HTTPS          | `./ssl`                    |

---

## Exposed Ports

| Port | Protocol | Purpose                 |
|------|----------|-------------------------|
| 80   | HTTP     | Web access (unencrypted) |
| 443  | HTTPS    | Web access (encrypted)   |

### Custom port mapping

```sh
# Map ports to custom host values
-p 8080:80 -p 8443:443
```
