---
title: Run Telegraf Controller in Docker
seotitle: Run Telegraf Controller in Docker
description: >
  Use the official influxdata/telegraf-controller Docker image to run
  Telegraf Controller as a container.
menu:
  telegraf_controller:
    name: Run in Docker
    parent: Install Telegraf Controller
weight: 100
related:
  - /telegraf/controller/install/
  - /telegraf/controller/install/upgrade/
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/reference/eula/
  - /telegraf/controller/get-started/
---

Use the official [`influxdata/telegraf-controller`](https://hub.docker.com/r/influxdata/telegraf-controller)
Docker image to run {{% product-name %}} as a container. The image contains
the same signed executable that is attached to each release, supports both
`linux/amd64` and `linux/arm64`, and runs as a non-root user.

> [!Note]
> Docker images are available for {{% product-name %}} 1.2.0 and later.

- [Image and supported tags](#image-and-supported-tags)
- [Quick start](#quick-start)
- [Accept the EULA](#accept-the-eula)
- [Persist your data](#persist-your-data)
- [Configure the container](#configure-the-container)
- [Set up the owner account](#set-up-the-owner-account)
- [Use PostgreSQL](#use-postgresql)
- [Use Docker Compose](#use-docker-compose)
- [Container health checks](#container-health-checks)
- [Next steps](#next-steps)

## Image and supported tags

The image is published to Docker Hub as `influxdata/telegraf-controller`
with the following tags:

- **`X.Y.Z`** (for example, `{{< latest-patch >}}`): a specific release.
- **`X.Y`**: the most recent patch release of a minor version.
- **`latest`**: the most recent stable release.

Pin a specific version in production so deployments are reproducible and
upgrades are deliberate. The examples in this guide pin the current release.

## Quick start

1.  **Run the {{% product-name %}} container:**

    ```bash
    docker run --detach \
      --name telegraf-controller \
      --publish 8888:8888 \
      --publish 8000:8000 \
      --env TELEGRAF_CONTROLLER_EULA=accept \
      --volume telegraf-controller:/var/lib/telegraf-controller \
      influxdata/telegraf-controller:{{< latest-patch >}}
    ```

2.  **Open <http://localhost:8888>** and follow the setup screen to create
    the owner account.

By default, {{% product-name %}} runs on an embedded SQLite database stored
in the mounted volume. Telegraf agents fetch configurations from port `8888`
and send heartbeats to port `8000`, so publish both ports on an interface
your agents can reach.

## Accept the EULA

{{% product-name %}} requires acceptance of the
[End User License Agreement](/telegraf/controller/reference/eula/) before it
starts. Set `TELEGRAF_CONTROLLER_EULA=accept` to accept it. Without
acceptance, the container exits immediately with instructions.

Acceptance is recorded in the data directory. With a mounted volume, you only
need the variable on the first run, or again when you upgrade to a release
that updates the EULA (release notes call this out). Without a volume, every
container start is a fresh instance and requires the variable. Leaving the
variable set permanently, as the examples in this guide do, is safe. Repeated
acceptance has no additional effect.

## Persist your data

The container stores all of its state in `/var/lib/telegraf-controller`:
the EULA acceptance record, the embedded SQLite database, and instance
identity. Mount a volume at that path, as every example in this guide does.

> [!Important]
> Without a volume mounted at `/var/lib/telegraf-controller`, the container
> is ephemeral. All data is lost when the container is removed.

Named volumes (for example,
`--volume telegraf-controller:/var/lib/telegraf-controller`) work without
additional setup. If you bind-mount a host directory instead, make sure the
directory is writable by the container user. The image runs as a non-root
user, and you can find its UID with the following command:

```bash
docker run --rm --entrypoint id influxdata/telegraf-controller:{{< latest-patch >}} -u
```

## Configure the container

Pass configuration as environment variables with `--env`, or append
command-line flags after the image name. Flags take precedence over
environment variables. For the complete list of options, see
[Configuration options](/telegraf/controller/reference/config-options/).

For example, to print the version:

```bash
docker run --rm influxdata/telegraf-controller:{{< latest-patch >}} --version
```

Inside the container, {{% product-name %}} listens on ports `8888` (web
interface, API, and agent configuration downloads) and `8000` (agent
heartbeats). If you publish a different host port or serve
{{% product-name %}} behind a reverse proxy, set the
[public URL options](/telegraf/controller/reference/config-options/#public-urls-and-cors)
so links and CORS checks use the external address.

### Enable TLS

To serve HTTPS, mount your certificate and key into the container and point
the TLS options at them:

```bash { placeholders="HOST_TLS_DIR" }
docker run --detach \
  --name telegraf-controller \
  --publish 8888:8888 \
  --publish 8000:8000 \
  --env TELEGRAF_CONTROLLER_EULA=accept \
  --env SSL_CERT_PATH=/etc/telegraf-controller/tls/server.crt \
  --env SSL_KEY_PATH=/etc/telegraf-controller/tls/server.key \
  --volume HOST_TLS_DIR:/etc/telegraf-controller/tls:ro \
  --volume telegraf-controller:/var/lib/telegraf-controller \
  influxdata/telegraf-controller:{{< latest-patch >}}
```

Replace {{% code-placeholder-key %}}`HOST_TLS_DIR`{{% /code-placeholder-key %}}
with the host directory that contains your TLS certificate (`server.crt`) and
private key (`server.key`).

> [!Note]
> Make sure the certificate and key files on the host are readable by the
> container user. If the container cannot read the files,
> {{% product-name %}} logs a warning and serves plain HTTP.

To make agents trust the certificate, see
[Secure agent connections with TLS](/telegraf/controller/admin/secure-tls/).

## Set up the owner account

By default, the first visit to the web interface walks you through creating
the owner account. For automated deployments, create the owner at startup by
passing all three bootstrap variables:

```bash { placeholders="OWNER_EMAIL_ADDRESS|OWNER_ACCOUNT_USERNAME|OWNER_ACCOUNT_PASSWORD" }
docker run --detach \
  --name telegraf-controller \
  --publish 8888:8888 \
  --publish 8000:8000 \
  --env TELEGRAF_CONTROLLER_EULA=accept \
  --env OWNER_EMAIL=OWNER_EMAIL_ADDRESS \
  --env OWNER_USERNAME=OWNER_ACCOUNT_USERNAME \
  --env OWNER_PASSWORD=OWNER_ACCOUNT_PASSWORD \
  --volume telegraf-controller:/var/lib/telegraf-controller \
  influxdata/telegraf-controller:{{< latest-patch >}}
```

Replace the following:

- {{% code-placeholder-key %}}`OWNER_EMAIL_ADDRESS`{{% /code-placeholder-key %}}:
  the owner's email address.
- {{% code-placeholder-key %}}`OWNER_ACCOUNT_USERNAME`{{% /code-placeholder-key %}}:
  the owner's username.
- {{% code-placeholder-key %}}`OWNER_ACCOUNT_PASSWORD`{{% /code-placeholder-key %}}:
  the owner's password.

All three variables must be set together. See
[Owner account options](/telegraf/controller/reference/config-options/#owner-account).

## Use PostgreSQL

For production deployments, point `DATABASE_URL` at a PostgreSQL database.
{{% product-name %}} selects the database engine from the URL scheme and
applies schema migrations automatically at startup:

```bash { placeholders="POSTGRES_USER|POSTGRES_PASSWORD|POSTGRES_HOST" }
docker run --detach \
  --name telegraf-controller \
  --publish 8888:8888 \
  --publish 8000:8000 \
  --env TELEGRAF_CONTROLLER_EULA=accept \
  --env DATABASE_URL="postgresql://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOST:5432/telegraf_controller" \
  --volume telegraf-controller:/var/lib/telegraf-controller \
  influxdata/telegraf-controller:{{< latest-patch >}}
```

Replace the following:

- {{% code-placeholder-key %}}`POSTGRES_USER`{{% /code-placeholder-key %}} and
  {{% code-placeholder-key %}}`POSTGRES_PASSWORD`{{% /code-placeholder-key %}}:
  the credentials for the PostgreSQL database.
- {{% code-placeholder-key %}}`POSTGRES_HOST`{{% /code-placeholder-key %}}: the
  hostname or address of the PostgreSQL database.

Still keep the volume mount when using PostgreSQL. The EULA acceptance
record and instance identity live in the data directory.

> [!Note]
> To reach a PostgreSQL server running on the Docker host, use
> `host.docker.internal` as the host name. Docker Desktop provides it
> automatically. On Linux Docker Engine, add
> `--add-host=host.docker.internal:host-gateway` to the `docker run` command.

## Use Docker Compose

The following `docker-compose.yml` runs {{% product-name %}} with a
PostgreSQL database:

```yaml
services:
  telegraf-controller:
    image: influxdata/telegraf-controller:{{< latest-patch >}}
    container_name: telegraf-controller
    ports:
      - "8888:8888"
      - "8000:8000"
    environment:
      TELEGRAF_CONTROLLER_EULA: accept
      DATABASE_URL: postgresql://postgres:postgres@db:5432/telegraf_controller
    volumes:
      - telegraf-controller:/var/lib/telegraf-controller
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: telegraf_controller
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  telegraf-controller:
  postgres-data:
```

Start the services:

```bash
docker compose up -d
```

To use the embedded SQLite database instead, remove the `db` service, the
`depends_on` block, and the `DATABASE_URL` line.

## Container health checks

The image includes a built-in Docker health check that polls the readiness
endpoint. Check the container's health state with the following command:

```bash
docker inspect --format '{{.State.Health.Status}}' telegraf-controller
```

For orchestrators and load balancers, {{% product-name %}} exposes two
unauthenticated endpoints on the API port:

- `GET /api/health/live`: the process is up.
- `GET /api/health/ready`: dependencies, including the database, are
  reachable.

## Next steps

- [Get started with {{% product-name %}}](/telegraf/controller/get-started/)
- [Apply a Telegraf Enterprise license](/telegraf/controller/telegraf-enterprise/apply-license/)
- [Upgrade a Docker deployment](/telegraf/controller/install/upgrade/#upgrade-a-docker-deployment)
