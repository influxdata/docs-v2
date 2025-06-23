<!-- TOC -->

- [Install {{% product-name %}}](#install-influxdb-3-{{% product-key %}})
  - [Verify the installation](#verify-the-installation)
- [Start InfluxDB](#start-influxdb)
  - [{{% product-name %}} store examples](#influxdb-3-{{% product-key %}}-store-examples)
- [Set up licensing](#set-up-licensing)
- [Set up authorization](#set-up-authorization)
  - [Create an operator token](#create-an-operator-token)
  - [Set your token for authorization](#set-your-token-for-authorization)

<!-- /TOC -->

## Install {{% product-name %}}

{{% product-name %}} runs on **Linux**, **macOS**, and **Windows**.
If using **Linux** or **macOS**, you can download and use the {{% product-name %}}
quick installer using [curl](https://curl.se/download.html):

<!--pytest.mark.skip-->
```bash
curl -O https://www.influxdata.com/d/install_influxdb3.sh \
&& sh install_influxdb3.sh {{% show-in "enterprise" %}}enterprise{{% /show-in %}}
```

For detailed installation instructions, including for Windows and Docker,
see [Install {{% product-name %}}](/influxdb3/version/install/).

{{% show-in "enterprise" %}}
> [!Note]
> For information about setting up a multi-node {{% product-name %}} cluster,
> see [Create a multi-node cluster](/influxdb3/enterprise/install/multi-server/).
{{% /show-in %}}

You can also download and install [{{% product-name %}} build artifacts](/influxdb3/enterprise/install/#download-influxdb-3-enterprise-binaries) directly:

{{< expand-wrapper >}}
{{% expand "Linux binaries" %}}

- [Linux | AMD64 (x86_64) | GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_amd64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_amd64.tar.gz.sha256)
- [Linux | ARM64 (AArch64) | GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_arm64.tar.gz.sha256)

{{% /expand %}}
{{% expand "macOS binaries" %}}

- [macOS | Silicon (ARM64)](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_darwin_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_darwin_arm64.tar.gz.sha256)

> [!Note]
> macOS Intel builds are coming soon.

{{% /expand %}}
{{% expand "Windows binaries" %}}

- [Windows (AMD64, x86_64) binary](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}-windows_amd64.zip)
 •
[sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}-windows_amd64.zip.sha256)

{{% /expand %}}
{{% expand "Docker image" %}}

The [`influxdb:3-enterprise` image](https://hub.docker.com/_/influxdb/tags?tag=3-core&name=3-enterprise)
is available for x86_64 (AMD64) and ARM64 architectures.

Pull the image:

<!--pytest.mark.skip-->
```bash
docker pull influxdb:3-enterprise
```
{{% /expand %}}
{{< /expand-wrapper >}}

### Verify the installation

After installing {{% product-name %}}, enter the following command to verify
that it installed successfully:

```bash
influxdb3 --version
```

If your system doesn't locate `influxdb3`, then `source` the configuration file (for example, .bashrc, .zshrc) for your shell--for example:

<!--pytest.mark.skip-->
```zsh
source ~/.zshrc
```

## Start InfluxDB

Use the [`influxdb3 serve` command](/influxdb3/version/reference/cli/influxdb3/serve/)
to start {{% product-name %}}.
Provide the following:

- `--object-store`: Specifies the type of object store to use.
  InfluxDB supports the following:
  
  - `file` _(default)_: local file system 
  - `memory`: in memory _(no object persistence)_
  - `memory-throttled`: like `memory` but with latency and throughput that
    somewhat resembles a cloud-based object store
  - `s3`: AWS S3 and S3-compatible services like Ceph or Minio
  - `google`: Google Cloud Storage
  - `azure`: Azure Blob Storage

  > [!Note]  
  > Depending on the object store type, you may need to provide additional
  > options for your object store configuration.

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

The following examples show how to start {{% product-name %}} with different object store configurations.

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

### {{% product-name %}} store examples

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
- `--object-store file --data-dir /path/in/container`: Use the volume mount for object storage


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

When starting a new {{% product-name %}} instance, you must provide a **valid license key** to enable Enterprise features such as clustering, plugin support, and multi-user authorization.

InfluxDB 3 Enterprise licenses:

- **Authorize** usage of InfluxDB 3 Enterprise software.
- **Apply per cluster**, with limits based primarily on CPU cores.
- **Vary by license type**, each offering different capabilities and restrictions.

### Available license types:

- **Trial**: 30-day trial license with full access to InfluxDB 3 Enterprise capabilities.
- **At-Home**: For at-home hobbyist use with limited access to InfluxDB 3 Enterprise capabilities.
- **Commercial**: Commercial license with full access to InfluxDB 3 Enterprise capabilities.

You can obtain a license key from the [InfluxData pricing page](https://www.influxdata.com/pricing/).

### Start InfluxDB 3 Enterprise with your license

Use the following `docker run` command to start an InfluxDB 3 Enterprise container using your email address to activate a trial or at-home license.

{{% code-placeholders "YOUR_EMAIL_ADDRESS" %}}

```bash
docker run -d --name influxdb3-enterprise \
  -v "$PWD/data:/var/lib/influxdb3" \
  -v "$PWD/plugins:/plugins" \
  -p 8181:8181 \
  -e INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=YOUR_EMAIL_ADDRESS \
  quay.io/influxdb/influxdb3-enterprise:latest \
  serve \
    --cluster-id cluster1 \
    --node-id node1 \
    --plugin-dir /plugins \
    --object-store file \
    --data-dir /var/lib/influxdb3
```

{{% /code-placeholders %}}

- Replace `YOUR_EMAIL_ADDRESS` with the email you want to associate with the license.

Once the Docker container is running, create an admin token to authenticate requests:

{{% code-placeholders "YOUR_LICENSE_KEY" %}}

```bash
docker exec -it influxdb3-enterprise influxdb3 create token --admin
```

{{% /code-placeholders %}}

Use the token to create a database:

{{% code-placeholders "YOUR_AUTH_TOKEN" %}}

```bash
docker exec -it influxdb3-enterprise \
  influxdb3 create database example_db --token YOUR_AUTH_TOKEN
```

{{% /code-placeholders %}}

> [!Note]
> A valid license is required to use `create token` and other authorization features in {{% product-name %}}.

For more information, see [Manage your InfluxDB 3 Enterprise license](/influxdb3/enterprise/admin/license/).
{{% /show-in %}}

> [!Tip]
> #### Use the InfluxDB 3 Explorer query interface (beta)
> 
> The remainder of the getting started guide can be completed using
> InfluxDB 3 Explorer (currently in beta), the web-based query and 
> administrative interface for InfluxDB 3, but doesn't include instructions for
> Explorer. Explorer provides visual management of databases and tokens and an
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

{{% code-placeholders "CONTAINER_NAME" %}}
```bash
# With Docker — in a new terminal:
docker exec -it CONTAINER_NAME influxdb3 create token --admin
```
{{% /code-placeholders %}}

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

{{< tabs-wrapper >}}
{{% tabs %}}
[Environment variable (recommended)](#)
[Command option](#)
[Docker](#)
{{% /tabs %}}
{{% tab-content %}}

Set the `INFLUXDB3_AUTH_TOKEN` environment variable to have the CLI use your token  automatically:

{{% code-placeholders "YOUR_AUTH_TOKEN" %}}
```bash
export INFLUXDB3_AUTH_TOKEN=YOUR_AUTH_TOKEN
```
{{% /code-placeholders %}}

{{% /tab-content %}}
{{% tab-content %}}

Include the `--token` option with CLI commands:

{{% code-placeholders "YOUR_AUTH_TOKEN" %}}
```bash
influxdb3 show databases --token YOUR_AUTH_TOKEN
```
{{% /code-placeholders %}}

{{% /tab-content %}}
{{% tab-content %}}

Run the CLI in a Docker container using the `INFLUXDB3_AUTH_TOKEN` environment variable:

{{% code-placeholders "YOUR_AUTH_TOKEN" %}}
```bash
docker run --rm \
  -e INFLUXDB3_AUTH_TOKEN=YOUR_AUTH_TOKEN \
  quay.io/influxdb/influxdb3:latest \
  query \
  --host http://host.docker.internal:8181 \
  --database example_db \
  "SHOW TABLES"
```
{{% /code-placeholders %}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}

For HTTP API requests, include your token in the `Authorization` header--for example:

{{% code-placeholders "YOUR_AUTH_TOKEN" %}}
```bash
curl "http://{{< influxdb/host >}}/api/v3/configure/database" \
  --header "Authorization: Bearer YOUR_AUTH_TOKEN"
```
{{% /code-placeholders %}}

#### Learn more about tokens and permissions

- [Manage admin tokens](/influxdb3/version/admin/tokens/admin/) - Understand and
  manage operator and named admin tokens
{{% show-in "enterprise" %}}
- [Manage resource tokens](/influxdb3/version/admin/tokens/resource/) - Create,
  list, and delete resource tokens
{{% /show-in %}}
- [Authentication](/influxdb3/version/reference/internals/authentication/) -
  Understand authentication, authorizations, and permissions in {{% product-name %}}

{{% page-nav
  prev="/influxdb3/version/get-started/"
  prevText="Get started"
  next="/influxdb3/version/get-started/write/"
  nextText="Write data"
%}}
