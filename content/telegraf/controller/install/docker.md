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
the EULA acceptance record, the embedded SQLite database, the
[audit log](/telegraf/controller/admin/audit-logs/), and instance identity.
Mount a volume at that path, as every example in this guide does.

> [!Important]
> Without a volume mounted at `/var/lib/telegraf-controller`, the container
> is ephemeral. All data is lost when the container is removed.

The container runs as the unprivileged user `telegraf-controller` (UID and
GID `10001`). Named volumes (for example,
`--volume telegraf-controller:/var/lib/telegraf-controller`) get the right
ownership automatically. If you bind-mount a host directory instead, make
the directory writable by that user first:

```bash
mkdir -p ./telegraf-controller-data
sudo chown 10001:10001 ./telegraf-controller-data
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

{{% product-name %}} secures login sessions with a secret that is generated
at random on each start, so users are signed out whenever the container
restarts. To keep sessions valid across restarts, set `SESSION_SECRET` to a
long random value and pass the same value on every start.
See [session-secret](/telegraf/controller/reference/config-options/#session-secret).

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

The built-in container health check uses plain HTTP, so override it when you
serve HTTPS.
See [Container health checks](#container-health-checks).

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

### Connect to PostgreSQL over TLS

Use `sslmode=verify-full` in production.
If the database certificate is not issued by a public CA (for example, Amazon
RDS, Google Cloud SQL, or a corporate CA), mount the CA certificate into the
container and pass it with `sslrootcert`:

```bash { placeholders="POSTGRES_USER|POSTGRES_PASSWORD|POSTGRES_HOST|HOST_CA_FILE" }
docker run --detach \
  --name telegraf-controller \
  --publish 8888:8888 \
  --publish 8000:8000 \
  --env TELEGRAF_CONTROLLER_EULA=accept \
  --env DATABASE_URL="postgresql://POSTGRES_USER:POSTGRES_PASSWORD@POSTGRES_HOST:5432/telegraf_controller?sslmode=verify-full&sslrootcert=/etc/telegraf-controller/db-ca.pem" \
  --volume HOST_CA_FILE:/etc/telegraf-controller/db-ca.pem:ro \
  --volume telegraf-controller:/var/lib/telegraf-controller \
  influxdata/telegraf-controller:{{< latest-patch >}}
```

Replace {{% code-placeholder-key %}}`HOST_CA_FILE`{{% /code-placeholder-key %}}
with the path to the CA certificate on the Docker host.

- The container runs as UID `10001`, so the CA file must be readable by that
  user.
- {{% code-placeholder-key %}}`POSTGRES_HOST`{{% /code-placeholder-key %}} must
  match a name in the server certificate. For Amazon RDS, use the instance
  endpoint, not an IP address.
- Pass the CA certificate with `sslrootcert` in `DATABASE_URL`. Both the API
  server and the heartbeat service read it there. `DATABASE_CA_CERT` and
  `NODE_EXTRA_CA_CERTS` each reach only one of them.

For all PostgreSQL TLS options, see
[Database TLS](/telegraf/controller/reference/config-options/#database-tls).

## Use Docker Compose

The following `docker-compose.yml` runs {{% product-name %}} with a
PostgreSQL database:

```yaml { placeholders="postgres_user|postgres_password" }
services:
  telegraf-controller:
    image: influxdata/telegraf-controller:{{< latest-patch >}}
    container_name: telegraf-controller
    ports:
      - "8888:8888"
      - "8000:8000"
    environment:
      TELEGRAF_CONTROLLER_EULA: accept
      DATABASE_URL: postgresql://postgres_user:postgres_password@db:5432/telegraf_controller
    volumes:
      - telegraf-controller:/var/lib/telegraf-controller
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: postgres_user
      POSTGRES_PASSWORD: postgres_password
      POSTGRES_DB: telegraf_controller
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres_user"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  telegraf-controller:
  postgres-data:
```

Replace the following:

- {{% code-placeholder-key %}}`postgres_user`{{% /code-placeholder-key %}} and
  {{% code-placeholder-key %}}`postgres_password`{{% /code-placeholder-key %}}:
  the username and password for the PostgreSQL `db` service.
  The same values appear in `DATABASE_URL` so {{% product-name %}} can
  connect to the database.

Start the services:

```bash
docker compose up -d
```

To use the embedded SQLite database instead, remove the `db` service, the
`depends_on` block, and the `DATABASE_URL` line.

## Container health checks

The image includes a built-in Docker health check that requests
`http://localhost:${APP_PORT}/health/ready` every 30 seconds, with a
5-second timeout and a 30-second start period. Check the container's health
state with the following command:

```bash
docker inspect --format '{{.State.Health.Status}}' telegraf-controller
```

> [!Note]
> The built-in health check uses plain HTTP on the port set by `APP_PORT`.
> If you serve HTTPS, or change the port with the `--port` flag instead of
> `APP_PORT`, override the check with `--health-cmd` or disable it with
> `--no-healthcheck`.

For orchestrators and load balancers, {{% product-name %}} exposes two
unauthenticated endpoints on the API port:

- `GET /health/live`: the process is up.
- `GET /health/ready`: dependencies, including the database, are reachable.

## Next steps

- [Get started with {{% product-name %}}](/telegraf/controller/get-started/)
- [Apply a Telegraf Enterprise license](/telegraf/controller/telegraf-enterprise/apply-license/)
- [Upgrade a Docker deployment](/telegraf/controller/install/upgrade/#upgrade-a-docker-deployment)
