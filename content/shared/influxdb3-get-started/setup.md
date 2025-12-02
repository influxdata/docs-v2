<!-- TOC -->
- [Prerequisites](#prerequisites)
- [Quick-Start Mode (Development)](#quick-start-mode-development)
- [Start InfluxDB](#start-influxdb)
  - [Object store examples](#object-store-examples)
{{% show-in "enterprise" %}}
- [Set up licensing](#set-up-licensing)
  - [Available license types](#available-license-types)
{{% /show-in %}}
- [Set up authorization](#set-up-authorization)
  - [Create an operator token](#create-an-operator-token)
  - [Set your token for authorization](#set-your-token-for-authorization)

<!-- /TOC -->

## Prerequisites

To get started, you'll need:

- **{{% product-name %}}**: [Install and verify the latest version](/influxdb3/version/install/) on your system.
- If you want to persist data, have access to one of the following:
  - A directory on your local disk where you can persist data (used by examples in this guide)
  - S3-compatible object store and credentials

## Quick-Start Mode (Development)

For development, testing, and home use, you can start {{% product-name %}} without
any arguments. The system automatically generates required configuration values
based on your system's hostname:

```bash
influxdb3
```

When you run `influxdb3` without arguments, the following values are auto-generated:

{{% show-in "enterprise" %}}
- **`node-id`**: `{hostname}-node` (or `primary-node` if hostname is unavailable)
- **`cluster-id`**: `{hostname}-cluster` (or `primary-cluster` if hostname is unavailable)
{{% /show-in %}}
{{% show-in "core" %}}
- **`node-id`**: `{hostname}-node` (or `primary-node` if hostname is unavailable)
{{% /show-in %}}
- **`object-store`**: `file`
- **`data-dir`**: `~/.influxdb`

The system displays warning messages showing the auto-generated identifiers:

{{% show-in "enterprise" %}}
```
Using auto-generated node id: mylaptop-node. For production deployments, explicitly set --node-id
Using auto-generated cluster id: mylaptop-cluster. For production deployments, explicitly set --cluster-id
```
{{% /show-in %}}
{{% show-in "core" %}}
```
Using auto-generated node id: mylaptop-node. For production deployments, explicitly set --node-id
```
{{% /show-in %}}

> [!Important]
> #### When to use quick-start mode
>
> Quick-start mode is designed for development, testing, and home lab environments
> where simplicity is prioritized over explicit configuration.
>
> **For production deployments**, use explicit configuration values with the
> [`influxdb3 serve` command](/influxdb3/version/reference/cli/influxdb3/serve/)
> as shown in the [Start InfluxDB](#start-influxdb) section below.

**Configuration precedence**: Environment variables override auto-generated defaults.
For example, if you set `INFLUXDB3_NODE_IDENTIFIER_PREFIX=my-node`, the system
uses `my-node` instead of generating `{hostname}-node`.

## Start InfluxDB

Use the [`influxdb3 serve` command](/influxdb3/version/reference/cli/influxdb3/serve/)
to start {{% product-name %}}.
Provide the following:

{{% show-in "enterprise" %}}
- `--node-id`: A string identifier that distinguishes individual server
  instances within the cluster. This forms the final part of the storage path:
  `<CONFIGURED_PATH>/<CLUSTER_ID>/<NODE_ID>`.
  In a multi-node setup, this ID is used to reference specific nodes.
- `--cluster-id`: A string identifier that determines part of the storage path
  hierarchy. All nodes within the same cluster share this identifier.
  The storage path follows the pattern `<CONFIGURED_PATH>/<CLUSTER_ID>/<NODE_ID>`.
  In a multi-node setup, this ID is used to reference the entire cluster.
{{% /show-in %}}
{{% show-in "core" %}}
- `--node-id`: A string identifier that distinguishes individual server instances.
  This forms the final part of the storage path: `<CONFIGURED_PATH>/<NODE_ID>`.
{{% /show-in %}}
- `--object-store`: Specifies the type of object store to use.
  InfluxDB supports the following:
  
  - `file`: local file system 
  - `memory`: in memory _(no object persistence)_
  - `memory-throttled`: like `memory` but with latency and throughput that
    somewhat resembles a cloud-based object store
  - `s3`: AWS S3 and S3-compatible services like Ceph or Minio
  - `google`: Google Cloud Storage
  - `azure`: Azure Blob Storage

- Other object store parameters depending on the selected `object-store` type.
  For example, if you use `s3`, you must provide the bucket name and credentials.

> [!Note]
> #### Diskless architecture
>
> InfluxDB 3 supports a diskless architecture that can operate with object
> storage alone, eliminating the need for locally attached disks.
> {{% product-name %}} can also work with only local disk storage when needed. 
>
> {{% show-in "enterprise" %}} 
> The combined path structure `<CONFIGURED_PATH>/<CLUSTER_ID>/<NODE_ID>` ensures
> proper organization of data in your object store, allowing for clean
> separation between clusters and individual nodes.
> {{% /show-in %}}

For this getting started guide, use the `file` object store to persist data to
your local disk.

{{% show-in "enterprise" %}}
```bash
# File system object store
# Provide the filesystem directory
influxdb3 serve \
  --node-id host01 \
  --cluster-id cluster01 \
  --object-store file \
  --data-dir ~/.influxdb3
```
{{% /show-in %}}
{{% show-in "core" %}}
```bash
# File system object store
# Provide the file system directory
influxdb3 serve \
  --node-id host01 \
  --object-store file \
  --data-dir ~/.influxdb3
```
{{% /show-in %}}

### Object store examples

{{< expand-wrapper >}}
{{% expand "File system object store" %}}

Store data in a specified directory on the local filesystem.
This is the default object store type.

Replace the following with your values:

{{% show-in "enterprise" %}}
```bash
# Filesystem object store
# Provide the filesystem directory
influxdb3 serve \
  --node-id host01 \
  --cluster-id cluster01 \
  --object-store file \
  --data-dir ~/.influxdb3
```
{{% /show-in %}}
{{% show-in "core" %}}
```bash
# File system object store
# Provide the file system directory
influxdb3 serve \
  --node-id host01 \
  --object-store file \
  --data-dir ~/.influxdb3
```
{{% /show-in %}}

{{% /expand %}}
{{% expand "Docker with a mounted file system object store" %}}

To run the [Docker image](/influxdb3/version/install/#docker-image) and persist
data to the local file system, mount a volume for the object store--for example,
provide the following options with your `docker run` command:

- `--volume /path/on/host:/path/in/container`: Mounts a directory from your file system to the container
- `--object-store file --data-dir /path/in/container`: Uses the volume for object storage

{{% show-in "enterprise" %}}
<!--pytest.mark.skip-->
```bash
# File system object store with Docker 
# Create a mount
# Provide the mount path
docker run -it \
 --volume /path/on/host:/path/in/container \
 influxdb:3-enterprise influxdb3 serve \
 --node-id my_host \
 --cluster-id my_cluster \
 --object-store file \
 --data-dir /path/in/container
```
{{% /show-in %}}
{{% show-in "core" %}}
<!--pytest.mark.skip-->
```bash
# File system object store with Docker 
# Create a mount
# Provide the mount path
docker run -it \
 --volume /path/on/host:/path/in/container \
 influxdb:3-core influxdb3 serve \
 --node-id my_host \
 --object-store file \
 --data-dir /path/in/container
```
{{% /show-in %}}

> [!Note]
> 
> The {{% product-name %}} Docker image exposes port `8181`, the `influxdb3`
> server default for HTTP connections.
> To map the exposed port to a different port when running a container, see the
> Docker guide for [Publishing and exposing ports](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/).

{{% /expand %}}
{{% expand "Docker compose with a mounted file system object store" %}}
Open `compose.yaml` for editing and add a `services` entry for
   {{% product-name %}}--for example:
{{% show-in "enterprise" %}}
```yaml
# compose.yaml
services:
  influxdb3-{{< product-key >}}:
    image: influxdb:3-{{< product-key >}}
    ports:
      - 8181:8181 
    command:
      - influxdb3
      - serve
      - --node-id=node0
      - --cluster-id=cluster0
      - --object-store=file
      - --data-dir=/var/lib/influxdb3/data
      - --plugin-dir=/var/lib/influxdb3/plugins
    environment:
      - INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=EMAIL_ADDRESS
    volumes:
      - type: bind
        # Path to store data on your host system
        source: ~/.influxdb3/data
        # Path to store data in the container
        target: /var/lib/influxdb3/data
      - type: bind
        # Path to store plugins on your host system
        source: ~/.influxdb3/plugins
        # Path to store plugins in the container
        target: /var/lib/influxdb3/plugins
```
   Replace `EMAIL_ADDRESS` with your email address to bypass the email prompt
   when generating a trial or at-home license. For more information, see [Manage your
   {{% product-name %}} license](/influxdb3/version/admin/license/).
{{% /show-in %}}
{{% show-in "core" %}}
```yaml
# compose.yaml
services:
  influxdb3-{{< product-key >}}:
    image: influxdb:3-{{< product-key >}}
    ports:
      - 8181:8181
    command:
      - influxdb3
      - serve
      - --node-id=node0
      - --object-store=file
      - --data-dir=/var/lib/influxdb3/data
      - --plugin-dir=/var/lib/influxdb3/plugins
    volumes:
      - type: bind
        # Path to store data on your host system
        source: ~/.influxdb3/data
        # Path to store data in the container
        target: /var/lib/influxdb3/data
      - type: bind
        # Path to store plugins on your host system
        source: ~/.influxdb3/plugins
        # Path to store plugins in the container
        target: /var/lib/influxdb3/plugins
```
{{% /show-in %}}

Use the Docker Compose CLI to start the server--for example:

<!--pytest.mark.skip-->
```bash
docker compose pull && docker compose up influxdb3-{{< product-key >}}
```

The command pulls the latest {{% product-name %}} Docker image and starts
`influxdb3` in a container with host port `8181` mapped to container port
`8181`, the server default for HTTP connections.

> [!Tip]
> #### Custom port mapping
>
> To customize your `influxdb3` server hostname and port, specify the
> [`--http-bind` option or the `INFLUXDB3_HTTP_BIND_ADDR` environment variable](/influxdb3/version/reference/config-options/#http-bind).
>
> For more information about mapping your container port to a specific host port, see the
> Docker guide for [Publishing and exposing ports](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/).

{{% /expand %}}
{{% expand "S3 object storage" %}}

Store data in an S3-compatible object store.
This is useful for production deployments that require high availability and durability.
Provide your bucket name and credentials to access the S3 object store.

{{% show-in "enterprise" %}}
```bash
# S3 object store (default is the us-east-1 region)
# Specify the object store type and associated options
influxdb3 serve \
  --node-id host01 \
  --cluster-id cluster01 \
  --object-store s3 \
  --bucket OBJECT_STORE_BUCKET \
  --aws-access-key AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY
```

```bash
# Minio or other open source object store
# (using the AWS S3 API with additional parameters)
# Specify the object store type and associated options
influxdb3 serve \
  --node-id host01 \
  --cluster-id cluster01 \
  --object-store s3 \
  --bucket OBJECT_STORE_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --aws-endpoint ENDPOINT \
  --aws-allow-http
```
{{% /show-in %}}
{{% show-in "core" %}}
```bash
# S3 object store (default is the us-east-1 region)
# Specify the object store type and associated options
influxdb3 serve \
  --node-id host01 \
  --object-store s3 \
  --bucket OBJECT_STORE_BUCKET \
  --aws-access-key AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY
```

```bash
# Minio or other open source object store
# (using the AWS S3 API with additional parameters)
# Specify the object store type and associated options
influxdb3 serve \
  --node-id host01 \
  --object-store s3 \
  --bucket OBJECT_STORE_BUCKET \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY \
  --aws-endpoint ENDPOINT \
  --aws-allow-http
```
{{% /show-in %}}

{{% /expand %}}
{{% expand "Memory-based object store" %}}

Store data in RAM without persisting it on shutdown.
It's useful for rapid testing and development.

{{% show-in "enterprise" %}}
```bash
# Memory object store
# Stores data in RAM; doesn't persist data
influxdb3 serve \
  --node-id host01 \
  --cluster-id cluster01 \
  --object-store memory
```
{{% /show-in %}}
{{% show-in "core" %}}
```bash
# Memory object store
# Stores data in RAM; doesn't persist data
influxdb3 serve \
  --node-id host01 \
  --object-store memory
```
{{% /show-in %}}

{{% /expand %}}
{{< /expand-wrapper >}}

For more information about server options, use the CLI help or view the
[InfluxDB 3 CLI reference](/influxdb3/version/reference/cli/influxdb3/serve/):

```bash
influxdb3 serve --help
```

{{% show-in "enterprise" %}}
## Set up licensing

When you first start a new instance, {{% product-name %}} prompts you to select a
license type.

InfluxDB 3 Enterprise licenses:

- **Authorize** usage of InfluxDB 3 Enterprise software for a single cluster.
- **Apply per cluster**, with limits based primarily on CPU cores.
- **Vary by license type**, each offering different capabilities and restrictions.

### Available license types

- **Trial**: 30-day trial license with full access to InfluxDB 3 Enterprise capabilities.
- **At-Home**: For at-home hobbyist use with limited access to InfluxDB 3 Enterprise capabilities.
- **Commercial**: Commercial license with full access to InfluxDB 3 Enterprise capabilities.

> [!Important]
> #### Trial and at-home licenses with Docker
>
> To generate the trial or home license in Docker, bypass the email prompt.
> The first time you start a new instance, provide your email address with the
> `--license-email` option or the `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL` environment variable.
>
> _Currently, if you use Docker and enter your email address in the prompt, a bug may
> prevent the container from generating the license ._
>
> For more information, see [the Docker Compose example](/influxdb3/enterprise/admin/license/?t=Docker+compose#start-the-server-with-your-license-email).
{{% /show-in %}}

> [!Tip]
> #### Use the InfluxDB 3 Explorer query interface
>
> You can complete the remaining steps in this guide using InfluxDB 3 Explorer,
> the web-based query and administrative interface for InfluxDB 3.
> Explorer provides visual management of databases and tokens and an
> easy way to write and query your time series data.
> 
> For more information, see the [InfluxDB 3 Explorer documentation](/influxdb3/explorer/).

## Set up authorization

{{% product-name %}} uses token-based authorization to authorize actions in the
database. Authorization is enabled by default when you start the server.
With authorization enabled, you must provide a token with `influxdb3` CLI
commands and HTTP API requests.

{{% show-in "enterprise" %}}
{{% product-name %}} supports the following types of tokens:

- **admin token**: Grants access to all CLI actions and API endpoints.
- **resource tokens**: Tokens that grant read and write access to specific
  resources (databases and system information endpoints) on the server.

  - A database token grants access to write and query data in a
    database
  - A system token grants read access to system information endpoints and
    metrics for the server
{{% /show-in %}}
{{% show-in "core" %}}
{{% product-name %}} supports _admin_ tokens, which grant access to all CLI actions and API endpoints. 
{{% /show-in %}}

For more information about tokens and authorization, see [Manage tokens](/influxdb3/version/admin/tokens/).

### Create an operator token

After you start the server, create your first admin token.
The first admin token you create is the _operator_ token for the server.

Use the [`influxdb3 create token` command](/influxdb3/version/reference/cli/influxdb3/create/token/)
with the `--admin` option to create your operator token:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[CLI](#)
[Docker](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

```bash
influxdb3 create token --admin
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```bash { placeholders="CONTAINER_NAME" }
# With Docker — in a new terminal:
docker exec -it CONTAINER_NAME influxdb3 create token --admin
```

Replace {{% code-placeholder-key %}}`CONTAINER_NAME`{{% /code-placeholder-key %}} with the name of your running Docker container.

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

The command returns a token string for authenticating CLI commands and API requests.

> [!Important]
> #### Store your token securely
> 
> InfluxDB displays the token string only when you create it.
> Store your token securely—you cannot retrieve it from the database later.

### Set your token for authorization

Use your operator token to authenticate server actions in {{% product-name %}},
such as {{% show-in "enterprise" %}}creating additional tokens, {{% /show-in %}}
performing administrative tasks{{% show-in "enterprise" %}},{{% /show-in %}}
and writing and querying data.

Use one of the following methods to provide your token and authenticate `influxdb3` CLI commands.

In your command, replace {{% code-placeholder-key %}}`YOUR_AUTH_TOKEN`{{% /code-placeholder-key %}} with your token string (for example, the [operator token](#create-an-operator-token) from the previous step).

#### To have your token provided automatically, set the environment variable:

{{< tabs-wrapper >}}
{{% tabs %}}
[macOS and Linux](#)
[PowerShell](#)
[CMD](#)
{{% /tabs %}}
{{% tab-content %}}

```bash { placeholders="YOUR_AUTH_TOKEN" }
export INFLUXDB3_AUTH_TOKEN=YOUR_AUTH_TOKEN
```

{{% /tab-content %}}
{{% tab-content %}}

```powershell { placeholders="YOUR_AUTH_TOKEN" }
$env:INFLUXDB3_AUTH_TOKEN = "YOUR_AUTH_TOKEN"
```

{{% /tab-content %}}
{{% tab-content %}}

```cmd { placeholders="YOUR_AUTH_TOKEN" }
set INFLUXDB3_AUTH_TOKEN=YOUR_AUTH_TOKEN 
# Make sure to include a space character at the end of this command.
```

{{% /tab-content %}}
{{< /tabs-wrapper >}}

#### Include the `--token` option with CLI commands:

```bash { placeholders="YOUR_AUTH_TOKEN" }
influxdb3 show databases --token YOUR_AUTH_TOKEN
```

For HTTP API requests, include your token in the `Authorization` header--for example:

```bash { placeholders="YOUR_AUTH_TOKEN" }
curl "http://{{< influxdb/host >}}/api/v3/configure/database" \
  --header "Authorization: Bearer YOUR_AUTH_TOKEN"
```

#### Learn more about tokens and permissions

- [Manage admin tokens](/influxdb3/version/admin/tokens/admin/) - Understand and
  manage operator and named admin tokens
{{% show-in "enterprise" %}}
- [Manage resource tokens](/influxdb3/version/admin/tokens/resource/) - Create,
  list, and delete resource tokens
{{% /show-in %}}
- [Authentication](/influxdb3/version/reference/internals/authentication/) -
  Understand authentication, authorizations, and permissions in {{% product-name %}}
<!-- //TODO - Authenticate with compatibility APIs -->
{{% show-in "core" %}}
{{% page-nav
  prev="/influxdb3/version/get-started/"
  prevText="Get started"
  next="/influxdb3/version/get-started/write/"
  nextText="Write data"
%}}
{{% /show-in %}}
{{% show-in "enterprise" %}}
{{% page-nav
  prev="/influxdb3/version/get-started/"
  prevText="Get started"
  next="/influxdb3/version/get-started/multi-server/"
  nextText="Create a multi-node cluster"
%}}
{{% /show-in %}}
