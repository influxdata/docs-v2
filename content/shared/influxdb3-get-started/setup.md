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
  InfluxDB supports the following: local file system (`file`), `memory`,
  S3 (and compatible services like Ceph or Minio) (`s3`),
  Google Cloud Storage (`google`), and Azure Blob Storage (`azure`).
  The default is `file`.
  Depending on the object store type, you may need to provide additional options
  for your object store configuration.
{{% show-in "enterprise" %}}
- `--node-id`: A string identifier that distinguishes individual server instances within the cluster. This forms the final part of the storage path: `<CONFIGURED_PATH>/<CLUSTER_ID>/<NODE_ID>`. In a multi-node setup, this ID is used to reference specific nodes.
- `--cluster-id`: A string identifier that determines part of the storage path hierarchy. All nodes within the same cluster share this identifier. The storage path follows the pattern `<CONFIGURED_PATH>/<CLUSTER_ID>/<NODE_ID>`. In a multi-node setup, this ID is used to reference the entire cluster.
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

{{% show-in "enterprise" %}}
> [!Note]
> The combined path structure `<CONFIGURED_PATH>/<CLUSTER_ID>/<NODE_ID>` ensures proper organization of data in your object store, allowing for clean separation between clusters and individual nodes.
{{% /show-in %}}

##### Filesystem object store

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

To run the [Docker image](/influxdb3/version/install/#docker-image) and persist data to the file system, mount a volume for the object store-for example, pass the following options:

- `-v /path/on/host:/path/in/container`: Mounts a directory from your file system to the container
- `--object-store file --data-dir /path/in/container`: Uses the mount for server storage


{{% show-in "enterprise" %}}
<!--pytest.mark.skip-->
```bash
# File system object store with Docker 
# Create a mount
# Provide the mount path
docker run -it \
 -v /path/on/host:/path/in/container \
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
 -v /path/on/host:/path/in/container \
 influxdb:3-core influxdb3 serve \
 --node-id my_host \
 --object-store file \
 --data-dir /path/in/container
```
{{% /show-in %}}

> [!Note]
> 
> The {{% product-name %}} Docker image exposes port `8181`, the `influxdb3` server default for HTTP connections.
> To map the exposed port to a different port when running a container, see the Docker guide for [Publishing and exposing ports](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/).

##### S3 object store

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

#### Memory object store

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

For more information about server options, use the CLI help or view the [InfluxDB 3 CLI reference](/influxdb3/version/reference/cli/influxdb3/serve/):

```bash
influxdb3 serve --help
```

> [!Tip]
> #### Run the InfluxDB 3 Explorer query interface (beta)
> 
> InfluxDB 3 Explorer (currently in beta) is the web-based query and 
> administrative interface for InfluxDB 3.
> It provides visual management of databases and tokens and an easy way to query your time series data.
> 
> For more information, see the [InfluxDB 3 Explorer documentation](/influxdb3/explorer/).

{{% show-in "enterprise" %}}
#### Licensing

When first starting a new instance, {{% product-name %}} prompts you to select a license type.

InfluxDB 3 Enterprise licenses authorize the use of the InfluxDB 3 Enterprise software and apply to a single cluster. Licenses are primarily based on the number of CPUs InfluxDB can use, but there are other limitations depending on the license type. The following InfluxDB 3 Enterprise license types are available:

- **Trial**: 30-day trial license with full access to InfluxDB 3 Enterprise capabilities.
- **At-Home**: For at-home hobbyist use with limited access to InfluxDB 3 Enterprise capabilities.
- **Commercial**: Commercial license with full access to InfluxDB 3 Enterprise capabilities.

You can learn more on managing your InfluxDB 3 Enterprise license on the [Manage your license](https://docs.influxdata.com/influxdb3/enterprise/admin/license/)page.
{{% /show-in %}}

### Authentication and authorization

{{% product-name %}} uses token-based authentication and authorization, which is enabled by default when you start the server.

With authentication enabled, you must provide a token with `influxdb3` CLI commands and HTTP API requests.

{{% show-in "enterprise" %}}
{{% product-name %}} supports the following types of tokens:

- **admin token**: Grants access to all CLI actions and API endpoints. A server can have one admin token.
- **resource tokens**: Tokens that grant read and write access to specific resources (databases and system information endpoints) on the server.

  - A database token grants access to write and query data in a
    database
  - A system token grants read access to system information endpoints and
    metrics for the server
{{% /show-in %}}
{{% show-in "core" %}}
{{% product-name %}} supports _admin_ tokens, which grant access to all CLI actions and API endpoints. 
{{% /show-in %}}

For more information about tokens and authorization, see [Manage tokens](/influxdb3/version/admin/tokens/).

#### Create an operator token

After you start the server, create your first admin token.
The first admin token you create is the _operator_ token for the server.

Use the `influxdb3` CLI or the HTTP API to create your operator token.

> [!Important]
> **Store your token securely**
> 
> InfluxDB displays the token string only when you create it.
> Store your token securely—you cannot retrieve it from the database later.

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
Store your token securely—you cannot retrieve it from the database later.

#### Set your token for authentication

Use your operator token to authenticate server actions in {{% product-name %}},
such as creating additional tokens, performing administrative tasks, and writing and querying data.

Use one of the following methods to provide your token and authenticate `influxdb3` CLI commands.

In your command, replace {{% code-placeholder-key %}}`YOUR_AUTH_TOKEN`{{% /code-placeholder-key %}} with your token string (for example, the [operator token](#create-an-operator-token) from the previous step).

{{< tabs-wrapper >}}
{{% tabs %}}
[Environment variable (recommended)](#)
[Command option](#)
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
influxdb3 show databases --token AUTH_TOKEN
```
{{% /code-placeholders %}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}

For HTTP API requests, include your token in the `Authorization` header--for example:

{{% code-placeholders "AUTH_TOKEN" %}}
```bash
curl "http://{{< influxdb/host >}}/api/v3/configure/database" \
  --header "Authorization: Bearer AUTH_TOKEN"
```
{{% /code-placeholders %}}

#### Learn more about tokens and permissions

- [Manage admin tokens](/influxdb3/version/admin/tokens/admin/) - Understand and manage operator and named admin tokens
{{% show-in "enterprise" %}}
- [Manage resource tokens](/influxdb3/version/admin/tokens/resource/) - Create, list, and delete resource tokens
{{% /show-in %}}
- [Authentication](/influxdb3/version/reference/internals/authentication/) - Understand authentication, authorizations, and permissions in {{% product-name %}}