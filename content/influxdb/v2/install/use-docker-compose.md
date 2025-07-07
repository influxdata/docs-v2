---
title: Install InfluxDB using Docker Compose
description: Use Docker Compose and secrets to install and set up InfluxDB OSS.
menu:
  influxdb_v2:
    name: Use Docker Compose
    parent: Install InfluxDB
weight: 2
influxdb/v2/tags: [install]
related:
  - /influxdb/v2/install/
  - /influxdb/v2/reference/cli/influx/auth/
  - /influxdb/v2/reference/cli/influx/config/
  - /influxdb/v2/reference/cli/influx/
  - /influxdb/v2/admin/tokens/
alt_links:
  v1: /influxdb/v1/introduction/install/docker/
---

Use Docker Compose to install and set up InfluxDB v2, the time series platform
is purpose-built to collect, store, process and visualize metrics and events.

When you use Docker Compose to create an InfluxDB container, you can use
Compose [`secrets`](https://docs.docker.com/compose/use-secrets/) to control
access to sensitive credentials such as username, password, and token and
prevent leaking them in your `docker inspect` output.

The `influxdb` Docker image provides the following environment
variables to use with Compose `secrets`:

- `DOCKER_INFLUXDB_INIT_USERNAME_FILE`: the container's path to the file that
  contains the username for your initial [user](/influxdb/v2/admin/users/).
- `DOCKER_INFLUXDB_INIT_PASSWORD_FILE`: the container's path to the file that
  contains the password for your initial [user](/influxdb/v2/admin/users/).
- `DOCKER_INFLUXDB_INIT_ADMIN_TOKEN_FILE`: the container's path to the file that
  contains a token to use for your initial
  [Operator token](/influxdb/v2/admin/tokens/#operator-token).
  If you don't specify an initial token, InfluxDB generates one for you.

## Set up using Docker Compose secrets

Follow steps to set up and run InfluxDB using Docker Compose and `secrets`:

1. If you haven't already, install
   [Docker Desktop](https://www.docker.com/get-started/) for your system.

2. Copy the following `compose.yaml` into your project directory.

   ```yml
   # compose.yaml
   services:
     influxdb2:
       image: influxdb:2
       ports:
         - 8086:8086
       environment:
         DOCKER_INFLUXDB_INIT_MODE: setup
         DOCKER_INFLUXDB_INIT_USERNAME_FILE: /run/secrets/influxdb2-admin-username
         DOCKER_INFLUXDB_INIT_PASSWORD_FILE: /run/secrets/influxdb2-admin-password
         DOCKER_INFLUXDB_INIT_ADMIN_TOKEN_FILE: /run/secrets/influxdb2-admin-token
         DOCKER_INFLUXDB_INIT_ORG: docs
         DOCKER_INFLUXDB_INIT_BUCKET: home
       secrets:
         - influxdb2-admin-username
         - influxdb2-admin-password
         - influxdb2-admin-token
       volumes:
         - type: volume
           source: influxdb2-data
           target: /var/lib/influxdb2
         - type: volume
           source: influxdb2-config
           target: /etc/influxdb2
   secrets:
     influxdb2-admin-username:
       file: ~/.env.influxdb2-admin-username
     influxdb2-admin-password:
       file: ~/.env.influxdb2-admin-password
     influxdb2-admin-token:
       file: ~/.env.influxdb2-admin-token
   volumes:
     influxdb2-data:
     influxdb2-config:
    ```

3. For each secret in `compose.yaml`, create a file that contains the secret
   value--for example:

   - `~/.env.influxdb2-admin-username`:

     ```text
     admin
     ```

   - `~/.env.influxdb2-admin-password`:

     ```text
     MyInitialAdminPassword
     ```

   - `~/.env.influxdb2-admin-token`:

     ```text
     MyInitialAdminToken0==
     ```

4. To set up and run InfluxDB, enter the following command in your
   terminal:

   <!--pytest.mark.skip-->

   ```sh
   docker compose up influxdb2
   ```

At runtime, the `influxdb` image:

1. Mounts `secrets` files from your host filesystem to `/run/secrets/<SECRET_NAME>`
in the container.
2. Assigns the environment variables to the specified files--for example:

   ```yaml
   environment:
     DOCKER_INFLUXDB_INIT_USERNAME_FILE: /run/secrets/influxdb2-admin-username
     DOCKER_INFLUXDB_INIT_PASSWORD_FILE: /run/secrets/influxdb2-admin-password
     DOCKER_INFLUXDB_INIT_ADMIN_TOKEN_FILE: /run/secrets/influxdb2-admin-token
   ```

3. Retrieves the secrets from the mounted files and runs setup.
4. Starts InfluxDB.
5. Runs any custom initialization scripts mounted inside the container's
  `/docker-entrypoint-initdb.d/` path.

If successful, InfluxDB initializes the user, password, organization, bucket,
and _[Operator token](/influxdb/v2/admin/tokens/#operator-token)_, and then
logs to stdout. You can view the InfluxDB UI at <http://localhost:8086>.

{{% warn %}}

Although Docker prevents inadvertently exposing secrets (for example, in
`docker inspect` output), a
user that has access to the running container's filesystem can view the secrets.

{{% /warn %}}

### Run InfluxDB CLI commands in a container

After you start a container using the `influxdb` Docker Hub image, you can
[use `docker exec` with the `influx` and `influxd`
CLIs](/influxdb/v2/install/?t=Docker#run-influxdb-cli-commands-in-a-container) inside the
container.

### Manage files in mounted volumes

To copy files, such as the InfluxDB server `config.yml` file, between your local
file system and a volume, use the
[`docker container cp` command](https://docs.docker.com/reference/cli/docker/container/cp/).

For more InfluxDB and Docker configuration options,
see the [`influxdb` Docker Hub image](https://hub.docker.com/_/influxdb)
documentation.
