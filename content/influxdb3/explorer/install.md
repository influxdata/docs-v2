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
- [Quick start](#quick-start)
- [Installation methods](#installation-methods)
- [Configuration options](#configuration-options)
  - [Persist data across restarts](#persist-data-across-restarts)
  - [Pre-configure InfluxDB connections](#pre-configure-influxdb-connections)
  - [Enable TLS/SSL (HTTPS)](#enable-tlsssl-https)
  - [Choose operational mode](#choose-operational-mode)
- [Advanced configuration](#advanced-configuration)
  - [Environment variables](#environment-variables)
  - [Volume reference](#volume-reference)
  - [Port reference](#port-reference)
- [Complete examples](#complete-examples)
<!-- END TOC -->

## Quick start

Get {{% product-name %}} running in minutes:

1. **Run the Explorer container:**

   ```bash
   docker run --detach \
     --name influxdb3-explorer \
     --publish 8888:80 \
     influxdata/influxdb3-ui:{{% latest-patch %}}
   ```

2. **Access the Explorer UI at <http://localhost:8888>**

3. **[Configure your InfluxDB connection in the UI](/influxdb3/explorer/get-started)**

---

## Installation methods

### Prerequisites

Install [Docker](https://docs.docker.com/engine/) or [Docker Desktop](https://docs.docker.com/desktop/) if you haven't already.

### Basic setup

> [!Tip]
> To get the latest updates, run the following command before starting the container:
> 
> ```bash
> docker pull influxdata/influxdb3-ui:{{% latest-patch %}}
> ```

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Docker run](#)
[Docker Compose](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
docker run --detach \
  --name influxdb3-explorer \
  --publish 8888:80 \
  influxdata/influxdb3-ui:{{% latest-patch %}}
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```yaml
# docker-compose.yml
version: '3.8'

services:
  explorer:
    image: influxdata/influxdb3-ui:{{% latest-patch %}}
    container_name: influxdb3-explorer
    ports:
      - "8888:80"
    volumes:
      - ./config:/app-root/config:ro
    restart: unless-stopped
```

Start the container:

```bash
docker-compose up -d
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Production setup

For production deployments with persistence, admin mode, and automatic image updates:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Docker run](#)
[Docker Compose](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
docker run --detach \
  --name influxdb3-explorer \
  --pull always \
  --publish 8888:80 \
  --volume $(pwd)/db:/db:rw \
  --volume $(pwd)/config:/app-root/config:ro \
  --env SESSION_SECRET_KEY=$(openssl rand -hex 32) \
  --restart unless-stopped \
  influxdata/influxdb3-ui:{{% latest-patch %}} \
  --mode=admin
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```yaml
# docker-compose.yml
version: '3.8'

services:
  explorer:
    image: influxdata/influxdb3-ui:{{% latest-patch %}}
    container_name: influxdb3-explorer
    pull_policy: always
    command: ["--mode=admin"]
    ports:
      - "8888:80"
    volumes:
      - ./db:/db:rw
      - ./config:/app-root/config:ro
      - ./ssl:/etc/nginx/ssl:ro
    environment:
      SESSION_SECRET_KEY: ${SESSION_SECRET_KEY:-changeme123456789012345678901234}
    restart: unless-stopped
```

Create a `.env` file that contains the following:

```bash
SESSION_SECRET_KEY=your_32_char_hex_string_here
```

Start the container:

```bash
docker-compose up -d
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

## Configuration options

### Persist data across restarts

{{% product-name %}} stores application data in a SQLite database. To persist this data across container restarts:

1. **Create a local directory:**

   ```bash
   mkdir -m 700 ./db
   ```

2. **Mount the directory when running the container:**

   {{< code-tabs-wrapper >}}
   {{% code-tabs %}}
   [Docker](#)
   [Docker Compose](#)
   {{% /code-tabs %}}

   {{% code-tab-content %}}
   ```bash
   docker run --detach \
     --name influxdb3-explorer \
     --publish 8888:80 \
     --volume $(pwd)/db:/db:rw \
     influxdata/influxdb3-ui:{{% latest-patch %}}
   ```
   {{% /code-tab-content %}}

   {{% code-tab-content %}}
   ```yaml
   version: '3.8'
   
   services:
     explorer:
       image: influxdata/influxdb3-ui:{{% latest-patch %}}
       container_name: influxdb3-explorer
       ports:
         - "8888:80"
       volumes:
         - ./db:/db:rw
       restart: unless-stopped
   ```
   {{% /code-tab-content %}}
   {{< /code-tabs-wrapper >}}

> [!Important]
> Without a mounted `./db` directory, application data is lost when the container is deleted.

### Pre-configure InfluxDB connections

Instead of configuring connections through the UI, you can pre-define connection settings using a `config.json` file. This is useful for:
- Automated deployments
- Shared team configurations
- Quick setup for known environments

1. **Create a `config.json` file:**

   ```bash
   mkdir -p config
   cat > config/config.json << 'EOF'
   {
     "DEFAULT_INFLUX_SERVER": "http://host.docker.internal:8181",
     "DEFAULT_INFLUX_DATABASE": "mydb",
     "DEFAULT_API_TOKEN": "your-token-here",
     "DEFAULT_SERVER_NAME": "Local InfluxDB 3"
   }
   EOF
   ```

   Customize the following properties for your InfluxDB 3 instance:

   - **`DEFAULT_INFLUX_SERVER`**: your [InfluxDB 3 Core](/influxdb3/core/reference/config-options/#http-bind) or [Enterprise](/influxdb3/enterprise/reference/config-options/#http-bind) server URL
   - **`DEFAULT_INFLUX_DATABASE`**: the name of your [InfluxDB 3 Core](/influxdb3/core/admin/databases/) or [Enterprise](/influxdb3/enterprise/admin/databases/) database
   - **`DEFAULT_API_TOKEN`**: your [InfluxDB 3 Core](/influxdb3/core/admin/tokens/) or [Enterprise](/influxdb3/enterprise/admin/tokens/) authorization token with the necessary permissions to access your server
   - **`DEFAULT_SERVER_NAME`**: a display name (only used by Explorer) for your [InfluxDB 3 Core](/influxdb3/core/get-started/setup/#start-influxdb) or [Enterprise](/influxdb3/enterprise/get-started/setup/#start-influxdb) server

   > [!Note]
   > #### When to use `host.docker.internal`
   >
   > If your InfluxDB 3 instance is running in Docker (not the same container as Explorer),
   > use `host.docker.internal` as your server host to allow the Explorer container to
   > connect to the InfluxDB container on the host--for example:
   >
   > ```txt
   > "DEFAULT_INFLUX_SERVER": "http://host.docker.internal:8181"
   > ```
   >
   > - If both Explorer and InfluxDB are in the same Docker network, use the container name instead.
   > - If InfluxDB is running natively on your machine (not in Docker), use `localhost`.
   >
   > For more information, see the [Docker networking documentation](https://docs.docker.com/desktop/features/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host).

2. **Mount the configuration directory:**

   {{< code-tabs-wrapper >}}
   {{% code-tabs %}}
   [Docker](#)
   [Docker Compose](#)
   {{% /code-tabs %}}

   {{% code-tab-content %}}
   ```bash
   docker run --detach \
     --name influxdb3-explorer \
     --publish 8888:80 \
     --volume $(pwd)/config:/app-root/config:ro \
     influxdata/influxdb3-ui:{{% latest-patch %}}
   ```
   {{% /code-tab-content %}}

   {{% code-tab-content %}}
   ```yaml
   version: '3.8'
   
   services:
     explorer:
       image: influxdata/influxdb3-ui:{{% latest-patch %}}
       container_name: influxdb3-explorer
       ports:
         - "8888:80"
       volumes:
         - ./config:/app-root/config:ro
       restart: unless-stopped
   ```
   {{% /code-tab-content %}}
   {{< /code-tabs-wrapper >}}

### Enable TLS/SSL (HTTPS)

To enable TLS/SSL for secure connections:

1. **Create SSL directory and add certificate files:**

   ```bash
   mkdir -m 755 ./ssl
   # Copy your certificate files to the ssl directory
   cp /path/to/server.crt ./ssl/
   cp /path/to/server.key ./ssl/
   ```

   Required files:
   - Certificate: `server.crt` or `fullchain.pem`
   - Private key: `server.key`

2. **Run the container with SSL enabled:**

   {{< code-tabs-wrapper >}}
   {{% code-tabs %}}
   [Docker](#)
   [Docker Compose](#)
   {{% /code-tabs %}}

   {{% code-tab-content %}}
   ```bash
   docker run --detach \
     --name influxdb3-explorer \
     --publish 8888:443 \
     --volume $(pwd)/ssl:/etc/nginx/ssl:ro \
     influxdata/influxdb3-ui:{{% latest-patch %}}
   ```
   {{% /code-tab-content %}}

   {{% code-tab-content %}}
   ```yaml
   version: '3.8'
   
   services:
     explorer:
       image: influxdata/influxdb3-ui:{{% latest-patch %}}
       container_name: influxdb3-explorer
       ports:
         - "8888:443"
       volumes:
         - ./ssl:/etc/nginx/ssl:ro
       restart: unless-stopped
   ```
   {{% /code-tab-content %}}
   {{< /code-tabs-wrapper >}}

3. **Access the Explorer UI at <https://localhost:8888>**

> [!Note]
> The nginx web server automatically detects and uses certificate files in the mounted path.

### Choose operational mode

{{% product-name %}} supports two operational modes:

- **Query mode** (default): Read-only UI for querying data
- **Admin mode**: Full UI with administrative capabilities

Set the mode using the `--mode` parameter:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Docker](#)
[Docker Compose](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
# Query mode (default)
docker run --detach \
  --name influxdb3-explorer \
  --publish 8888:80 \
  influxdata/influxdb3-ui:{{% latest-patch %}} \
  --mode=query

# Admin mode
docker run --detach \
  --name influxdb3-explorer \
  --publish 8888:80 \
  influxdata/influxdb3-ui:{{% latest-patch %}} \
  --mode=admin
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```yaml
version: '3.8'

services:
  explorer:
    image: influxdata/influxdb3-ui:{{% latest-patch %}}
    container_name: influxdb3-explorer
    # For query mode (default), omit the command
    # For admin mode, add:
    command: ["--mode=admin"]
    ports:
      - "8888:80"
    restart: unless-stopped
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

---

## Advanced configuration

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SESSION_SECRET_KEY` | _(random)_ | Secret key for session management. **Set this in production to persist sessions across restarts.** |
| `DATABASE_URL` | `/db/sqlite.db` | Path to SQLite database inside container |
| `SSL_CERT_PATH` | `/etc/nginx/ssl/cert.pem` | Path to SSL certificate file |
| `SSL_KEY_PATH` | `/etc/nginx/ssl/key.pem` | Path to SSL private key file |

> [!Important]
> Always set `SESSION_SECRET_KEY` in production to persist user sessions across container restarts.
> Enter the following command to generate a secure key:
>
> ```bash
> openssl rand -hex 32
> ```

### Volume reference

| Container Path | Purpose | Permissions | Required |
|----------------|---------|-------------|----------|
| `/db` | SQLite database storage | 700 | No (but recommended) |
| `/app-root/config` | Connection configuration | 755 | No |
| `/etc/nginx/ssl` | TLS/SSL certificates | 755 | Only for HTTPS |

### Port reference

| Container Port | Protocol | Purpose | Common Host Mapping |
|----------------|----------|---------|---------------------|
| 80 | HTTP | Web UI (unencrypted) | 8888 |
| 443 | HTTPS | Web UI (encrypted) | 8888 |

---

## Complete examples

### Production setup with all features

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Docker](#)
[Docker Compose](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
# Create required directories
mkdir -m 700 ./db
mkdir -m 755 ./config ./ssl

# Generate session secret
export SESSION_SECRET=$(openssl rand -hex 32)

# Create configuration
cat > config/config.json << 'EOF'
{
  "DEFAULT_INFLUX_SERVER": "http://host.docker.internal:8181",
  "DEFAULT_INFLUX_DATABASE": "production",
  "DEFAULT_API_TOKEN": "your-production-token",
  "DEFAULT_SERVER_NAME": "Production InfluxDB 3"
}
EOF

# Run Explorer with all features
docker run --detach \
  --name influxdb3-explorer \
  --pull always \
  --publish 8888:443 \
  --volume $(pwd)/db:/db:rw \
  --volume $(pwd)/config:/app-root/config:ro \
  --volume $(pwd)/ssl:/etc/nginx/ssl:ro \
  --env SESSION_SECRET_KEY=$SESSION_SECRET \
  --restart unless-stopped \
  influxdata/influxdb3-ui:{{% latest-patch %}} \
  --mode=admin
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```yaml
# docker-compose.yml
version: '3.8'

services:
  explorer:
    image: influxdata/influxdb3-ui:{{% latest-patch %}}
    container_name: influxdb3-explorer
    pull_policy: always
    command: ["--mode=admin"]
    ports:
      - "8888:443"
    volumes:
      - ./db:/db:rw
      - ./config:/app-root/config:ro
      - ./ssl:/etc/nginx/ssl:ro
    environment:
      SESSION_SECRET_KEY: ${SESSION_SECRET_KEY}
    restart: unless-stopped
```

Create a `.env` file that contains the following:

```bash
SESSION_SECRET_KEY=your_32_char_hex_string_here
```

Start the container:

```bash
docker-compose up -d
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Development setup (minimal)

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Docker](#)
[Docker Compose](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```bash
docker run --rm \
  --name influxdb3-explorer-dev \
  --publish 8888:80 \
  influxdata/influxdb3-ui:{{% latest-patch %}}
```
{{% /code-tab-content %}}

{{% code-tab-content %}}
```yaml
# docker-compose.yml
version: '3.8'

services:
  explorer:
    image: influxdata/influxdb3-ui:{{% latest-patch %}}
    container_name: influxdb3-explorer-dev
    ports:
      - "8888:80"
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}
