

### What's in this guide

{{% show-in "enterprise" %}}
This guide covers Enterprise as well as InfluxDB 3 Core, including the following topics:
{{% /show-in %}}
{{% show-in "core" %}}
This guide covers InfluxDB 3 Core (the open source release), including the following topics:
{{% /show-in %}}

- [Install and startup](#install-and-startup)
- [Authentication and authorization](#authentication-and-authorization)
- [Data Model](#data-model)
- [Tools to use](#tools-to-use)
- [Write data](#write-data)
- [Query data](#query-data)
- [Last values cache](#last-values-cache)
- [Distinct values cache](#distinct-values-cache)
- [Python plugins and the processing engine](#python-plugins-and-the-processing-engine)
{{% show-in "enterprise" %}}
- [Multi-server setups](#multi-server-setup)
{{% /show-in %}}

> [!Tip]
> #### Find support for {{% product-name %}}
>
> The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for {{% product-name %}}.
> For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.

### Install and startup

{{% product-name %}} runs on **Linux**, **macOS**, and **Windows**.

{{% show-in "enterprise" %}}
{{% tabs-wrapper %}}
{{% tabs %}}
[Linux or macOS](#linux-or-macos)
[Windows](#windows)
[Docker](#docker)
{{% /tabs %}}
{{% tab-content %}}
<!--------------- BEGIN LINUX AND MACOS -------------->
To get started quickly, download and run the install script--for example, using [curl](https://curl.se/download.html):

<!--pytest.mark.skip-->
```bash
curl -O https://www.influxdata.com/d/install_influxdb3.sh \
&& sh install_influxdb3.sh enterprise
```

Or, download and install [build artifacts](/influxdb3/enterprise/install/#download-influxdb-3-enterprise-binaries):

- [Linux | AMD64 (x86_64) | GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_amd64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_amd64.tar.gz.sha256)
- [Linux | ARM64 (AArch64) | GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_arm64.tar.gz.sha256)
- [macOS | Silicon (ARM64)](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_darwin_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_darwin_arm64.tar.gz.sha256)

> [!Note]
> macOS Intel builds are coming soon.

<!--------------- END LINUX AND MACOS -------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------- BEGIN WINDOWS -------------->
Download and install the {{% product-name %}} [Windows (AMD64, x86_64) binary](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}-windows_amd64.zip)
 •
[sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}-windows_amd64.zip.sha256)
<!--------------- END WINDOWS -------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------- BEGIN DOCKER -------------->

The [`influxdb:3-enterprise` image](https://hub.docker.com/_/influxdb/tags?tag=3-core&name=3-enterprise)
is available for x86_64 (AMD64) and ARM64 architectures.

Pull the image:

<!--pytest.mark.skip-->
```bash
docker pull influxdb:3-enterprise
```

<!--------------- END DOCKER -------------->
{{% /tab-content %}}
{{% /tabs-wrapper %}}
{{% /show-in %}}

{{% show-in "core" %}}
{{% tabs-wrapper %}}
{{% tabs %}}
[Linux or macOS](#linux-or-macos)
[Windows](#windows)
[Docker](#docker)
{{% /tabs %}}
{{% tab-content %}}
<!--------------- BEGIN LINUX AND MACOS -------------->
To get started quickly, download and run the install script--for example, using [curl](https://curl.se/download.html):

<!--pytest.mark.skip-->
```bash
curl -O https://www.influxdata.com/d/install_influxdb3.sh \
&& sh install_influxdb3.sh
```
Or, download and install [build artifacts](/influxdb3/core/install/#download-influxdb-3-core-binaries):

- [Linux | AMD64 (x86_64) | GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_amd64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_amd64.tar.gz.sha256)
- [Linux | ARM64 (AArch64) | GNU](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_arm64.tar.gz.sha256)
- [macOS | Silicon (ARM64)](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_darwin_arm64.tar.gz)
  •
  [sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_darwin_arm64.tar.gz.sha256)

> [!Note]
> macOS Intel builds are coming soon.

<!--------------- END LINUX AND MACOS -------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------- BEGIN WINDOWS -------------->
Download and install the {{% product-name %}} [Windows (AMD64, x86_64) binary](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}-windows_amd64.zip)
 •
[sha256](https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}-windows_amd64.zip.sha256)
<!--------------- END WINDOWS -------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------- BEGIN DOCKER -------------->
The [`influxdb:3-core` image](https://hub.docker.com/_/influxdb/tags?tag=3-core&name=3-core)
is available for x86_64 (AMD64) and ARM64 architectures.

Pull the image:

<!--pytest.mark.skip-->
```bash
docker pull influxdb:3-core
```

<!--------------- END DOCKER -------------->
{{% /tab-content %}}
{{% /tabs-wrapper %}}
{{% /show-in %}}

_Build artifacts and images update with every merge into the {{% product-name %}} `main` branch._

#### Verify the install

After you have installed {{% product-name %}}, enter the following command to verify that it completed successfully:

```bash
influxdb3 --version
```

If your system doesn't locate `influxdb3`, then `source` the configuration file (for example, .bashrc, .zshrc) for your shell--for example:

<!--pytest.mark.skip-->
```zsh
source ~/.zshrc
```


#### Start InfluxDB

To start your InfluxDB instance, use the `influxdb3 serve` command and provide the following:

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

For more information, see how to [Manage your license](/influxdb3/enterprise/admin/license/).
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

### Data model

The database server contains logical databases, which have tables, which have columns. Compared to previous versions of InfluxDB you can think of a database as a `bucket` in v2 or as a `db/retention_policy` in v1. A `table` is equivalent to a `measurement`, which has columns that can be of type `tag` (a string dictionary), `int64`, `float64`, `uint64`, `bool`, or `string` and finally every table has a `time` column that is a nanosecond precision timestamp.

In InfluxDB 3, every table has a primary key--the ordered set of tags and the time--for its data.
This is the sort order used for all Parquet files that get created. When you create a table, either through an explicit call or by writing data into a table for the first time, it sets the primary key to the tags in the order they arrived. This is immutable. Although InfluxDB is still a _schema-on-write_ database, the tag column definitions for a table are immutable.

Tags should hold unique identifying information like `sensor_id`, or `building_id` or `trace_id`. All other data should be kept in fields. You will be able to add fast last N value and distinct value lookups later for any column, whether it is a field or a tag.

### Tools to use

The following table compares tools that you can use to interact with {{% product-name %}}.
This tutorial covers many of the recommended tools.

| Tool                                                                                              |      Administration      |          Write           |          Query           |
| :------------------------------------------------------------------------------------------------ | :----------------------: | :----------------------: | :----------------------: |
| **`influxdb3` CLI** {{< req text="\* " color="magenta" >}}                           | **{{< icon "check" >}}** | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| **InfluxDB HTTP API** {{< req text="\* " color="magenta" >}}                     | **{{< icon "check" >}}** | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| **InfluxDB 3 Explorer** {{< req text="\* " color="magenta" >}}                           | **{{< icon "check" >}}** |            -               | **{{< icon "check" >}}** |
| [InfluxDB 3 client libraries](/influxdb3/version/reference/client-libraries/v3/)                  |            -             | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| [InfluxDB v2 client libraries](/influxdb3/version/reference/client-libraries/v2/)                 |            -             | **{{< icon "check" >}}** |            -             |
| [InfluxDB v1 client libraries](/influxdb3/version/reference/client-libraries/v1/)                 |            -             | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| [InfluxDB 3 processing engine](#python-plugins-and-the-processing-engine){{< req text="\* " color="magenta" >}}                              |                          | **{{< icon "check" >}}** | **{{< icon "check" >}}** |
| [Telegraf](/telegraf/v1/)                                                                         |            -             | **{{< icon "check" >}}** |            -             |
| [Chronograf](/chronograf/v1/)                                                                     |            -             |            -             |            -             |
| <span style="opacity:.5;">`influx` CLI</span>                                                     |            -             |            -             |            -             |
| <span style="opacity:.5;">`influxctl` CLI</span>                                                  |            -             |            -             |            -             |
| <span style="opacity:.5;">InfluxDB v2.x user interface</span>                                     |            -             |            -             |            -             |
| **Third-party tools**                                                                             |                          |                          |                          |
| Flight SQL clients                                                                                |            -             |            -             | **{{< icon "check" >}}** |
| [Grafana](/influxdb3/version/visualize-data/grafana/)                                             |            -             |            -             | **{{< icon "check" >}}** |

{{< caption >}}
{{< req type="key" text="Covered in this guide" color="magenta" >}}
{{< /caption >}}

### Write data

InfluxDB is a schema-on-write database. You can start writing data and InfluxDB creates the logical database, tables, and their schemas on the fly.
After a schema is created, InfluxDB validates future write requests against it before accepting the data.
Subsequent requests can add new fields on-the-fly, but can't add new tags.

{{% show-in "core" %}}
> [!Note]
> #### Core is optimized for recent data
>
> {{% product-name %}} is optimized for recent data but accepts writes from any time period.
> The system persists data to Parquet files for historical analysis with [InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/) or third-party tools.
> For extended historical queries and optimized data organization, consider using [InfluxDB 3 Enterprise](/influxdb3/enterprise/get-started/).
{{% /show-in %}}

#### Write data in line protocol syntax

{{% product-name %}} accepts data in [line protocol](/influxdb3/version/reference/syntax/line-protocol/) syntax.
The following code block is an example of time series data in [line protocol](/influxdb3/version/reference/syntax/line-protocol/) syntax:

- `cpu`: the table name.
- `host`, `region`, `applications`: the tags. A tag set is an ordered, comma-separated list of key/value pairs where the values are strings.
- `val`, `usage_percent`, `status`: the fields. A field set is a comma-separated list of key/value pairs.
- timestamp: If you don't specify a timestamp, InfluxData uses the time when data is written.
  The default precision is a nanosecond epoch.
  To specify a different precision, pass the `precision` parameter in your CLI command or API request.

```
cpu,host=Alpha,region=us-west,application=webserver val=1i,usage_percent=20.5,status="OK"
cpu,host=Bravo,region=us-east,application=database val=2i,usage_percent=55.2,status="OK"
cpu,host=Charlie,region=us-west,application=cache val=3i,usage_percent=65.4,status="OK"
cpu,host=Bravo,region=us-east,application=database val=4i,usage_percent=70.1,status="Warn"
cpu,host=Bravo,region=us-central,application=database val=5i,usage_percent=80.5,status="OK"
cpu,host=Alpha,region=us-west,application=webserver val=6i,usage_percent=25.3,status="Warn"
```

### Write data using the CLI

To quickly get started writing data, you can use the `influxdb3` CLI.

> [!Note]
> For batching and higher-volume write workloads, we recommend using the [HTTP API](#write-data-using-the-http-api).
>
> #### Write data using InfluxDB API client libraries
>
> InfluxDB provides supported client libraries that integrate with your code
> to construct data as time series points and write the data as line protocol to your {{% product-name %}} database.
> For more information, see how to [use InfluxDB client libraries to write data](/influxdb3/version/write-data/api-client-libraries/).

##### Example: write data using the influxdb3 CLI

Use the `influxdb3 write` command to write data to a database.

In the code samples, replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/version/admin/databases/) to write to.
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to write to the specified database{{% /show-in %}}

##### Write data via stdin

Pass data as quoted line protocol via standard input (stdin)--for example:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --precision ns \
  --accept-partial \
'cpu,host=Alpha,region=us-west,application=webserver val=1i,usage_percent=20.5,status="OK"
cpu,host=Bravo,region=us-east,application=database val=2i,usage_percent=55.2,status="OK"
cpu,host=Charlie,region=us-west,application=cache val=3i,usage_percent=65.4,status="OK"
cpu,host=Bravo,region=us-east,application=database val=4i,usage_percent=70.1,status="Warn"
cpu,host=Bravo,region=us-central,application=database val=5i,usage_percent=80.5,status="OK"
cpu,host=Alpha,region=us-west,application=webserver val=6i,usage_percent=25.3,status="Warn"'
```
{{% /code-placeholders %}}

##### Write data from a file

Pass the `--file` option to write line protocol you have saved to a file--for example, save the
[sample line protocol](#write-data-in-line-protocol-syntax) to a file named `server_data`
and then enter the following command:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --precision ns \ 
  --accept-partial \
  --file path/to/server_data 
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the [database](/influxdb3/version/admin/databases/) to write to.
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to write to the specified database{{% /show-in %}}

### Write data using the HTTP API

{{% product-name %}} provides three write API endpoints that respond to HTTP `POST` requests.
The `/api/v3/write_lp` endpoint is the recommended endpoint for writing data and
provides additional options for controlling write behavior.

If you need to write data using InfluxDB v1.x or v2.x tools, use the compatibility API endpoints.
Compatibility APIs work with [Telegraf](/telegraf/v1/), InfluxDB v2.x and v1.x [API client libraries](/influxdb3/version/reference/client-libraries), and other tools that support the v1.x or v2.x APIs.

{{% tabs-wrapper %}}
{{% tabs %}}
[/api/v3/write_lp](#)
[v2 compatibility](#)
[v1 compatibility](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------ BEGIN /api/v3/write_lp -------------->
{{% product-name %}} adds the `/api/v3/write_lp` endpoint.

{{<api-endpoint endpoint="/api/v3/write_lp?db=mydb&precision=nanosecond&accept_partial=true&no_sync=false" method="post" >}}

This endpoint accepts the same line protocol syntax as previous versions,
and supports the following parameters:

- `?accept_partial=<BOOLEAN>`: Accept or reject partial writes (default is `true`).
- `?no_sync=<BOOLEAN>`: Control when writes are acknowledged:
  - `no_sync=true`: Acknowledges writes before WAL persistence completes.
  - `no_sync=false`: Acknowledges writes after WAL persistence completes (default).
- `?precision=<PRECISION>`: Specify the precision of the timestamp. The default is nanosecond precision.
- request body: The line protocol data to write.

For more information about the parameters, see [Write data](/influxdb3/version/write-data/).

##### Example: write data using the /api/v3 HTTP API

The following examples show how to write data using `curl` and the `/api/3/write_lp` HTTP endpoint.
To show the difference between accepting and rejecting partial writes, line `2` in the example contains a `string` value (`"hi"`) for a `float` field (`temp`).

###### Partial write of line protocol occurred

With `accept_partial=true` (default):

```bash
curl -v "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=auto" \
  --header 'Authorization: Bearer apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0==' \
  --data-raw 'home,room=Sunroom temp=96
home,room=Sunroom temp="hi"'
```

The response is the following:

```
< HTTP/1.1 400 Bad Request
...
{
  "error": "partial write of line protocol occurred",
  "data": [
    {
      "original_line": "home,room=Sunroom temp=hi",
      "line_number": 2,
      "error_message": "invalid column type for column 'temp', expected iox::column_type::field::float, got iox::column_type::field::string"
    }
  ]
}
```

Line `1` is written and queryable.
The response is an HTTP error (`400`) status, and the response body contains the error message `partial write of line protocol occurred` with details about the problem line. 

###### Parsing failed for write_lp endpoint

With `accept_partial=false`:

```bash
curl -v "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=auto&accept_partial=false" \
  --header 'Authorization: Bearer apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0==' \
  --data-raw 'home,room=Sunroom temp=96
home,room=Sunroom temp="hi"'
```

The response is the following:

```
< HTTP/1.1 400 Bad Request
...
{
  "error": "parsing failed for write_lp endpoint",
  "data": {
    "original_line": "home,room=Sunroom temp=hi",
    "line_number": 2,
    "error_message": "invalid column type for column 'temp', expected iox::column_type::field::float, got iox::column_type::field::string"
  }
}
```

InfluxDB rejects all points in the batch.
The response is an HTTP error (`400`) status, and the response body contains `parsing failed for write_lp endpoint` and details about the problem line.

For more information about the ingest path and data flow, see [Data durability](/influxdb3/version/reference/internals/durability/).
<!------------ END /api/v3/write_lp -------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------ BEGIN /api/v2/write -------------->
The `/api/v2/write` InfluxDB v2 compatibility endpoint provides backwards compatibility with clients (such as [Telegraf's InfluxDB v2 output plugin](/telegraf/v1/plugins/#output-influxdb_v2) and [InfluxDB v2 API client libraries](/influxdb3/version/reference/client-libraries/v2/)) that can write data to InfluxDB OSS v2.x and Cloud 2 (TSM).

{{<api-endpoint endpoint="/api/v2/write?bucket=mydb&precision=ns" method="post" >}}
<!------------ END /api/v2/write -------------->
{{% /tab-content %}}

{{% tab-content %}}
<!------------ BEGIN /write (v1) ---------------->
The `/write` InfluxDB v1 compatibility endpoint provides backwards compatibility for clients that can write data to InfluxDB v1.x.

{{<api-endpoint endpoint="/write?db=mydb&precision=ns" method="post" >}}

<!------------ END /write (v1) ---------------->
{{% /tab-content %}}
{{% /tabs-wrapper %}}

> [!Note]
> #### Compatibility APIs differ from native APIs
> 
> Keep in mind that the compatibility APIs differ from the v1 and v2 APIs in previous versions in the following ways:
>
> - Tags in a table (measurement) are _immutable_
> - A tag and a field can't have the same name within a table.

#### Write responses

By default, InfluxDB acknowledges writes after flushing the WAL file to the object store (occurring every second).
For high write throughput, you can send multiple concurrent write requests.

#### Use no_sync for immediate write responses

To reduce the latency of writes, use the `no_sync` write option, which acknowledges writes _before_ WAL persistence completes.
When `no_sync=true`, InfluxDB validates the data, writes the data to the WAL, and then immediately responds to the client, without waiting for persistence to the object store.

Using `no_sync=true` is best when prioritizing high-throughput writes over absolute durability. 

- Default behavior (`no_sync=false`): Waits for data to be written to the object store before acknowledging the write. Reduces the risk of data loss, but increases the latency of the response.
- With `no_sync=true`: Reduces write latency, but increases the risk of data loss in case of a crash before WAL persistence. 

##### Immediate write using the HTTP API

The `no_sync` parameter controls when writes are acknowledged--for example:

```bash
curl "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=auto&no_sync=true" \
  --header 'Authorization: Bearer apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0==' \
  --data-raw "home,room=Sunroom temp=96"
```

### Create a database or table

To create a database without writing data, use the `create` subcommand--for example:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 create database DATABASE_NAME \
  --token AUTH_TOKEN 
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: the {{% token-link "admin" %}} for your {{% product-name %}} server

To learn more about a subcommand, use the `-h, --help` flag or view the [InfluxDB 3 CLI reference](/influxdb3/version/reference/cli/influxdb3/create):

```bash
influxdb3 create -h
```

### Query data

InfluxDB 3 supports native SQL for querying, in addition to InfluxQL, an
SQL-like language customized for time series queries.

{{% show-in "core" %}}
{{< product-name >}} limits
query time ranges to 72 hours (both recent and historical) to ensure query performance.
For more information about the 72-hour limitation, see the
[update on InfluxDB 3 Core’s 72-hour limitation](https://www.influxdata.com/blog/influxdb3-open-source-public-alpha-jan-27/).
{{% /show-in %}}

> [!Note]
> Flux, the language introduced in InfluxDB 2.0, is **not** supported in InfluxDB 3.

The quickest way to get started querying is to use the `influxdb3` CLI (which uses the Flight SQL API over HTTP2).

The `query` subcommand includes options to help ensure that the right database is queried with the correct permissions. Only the `--database` option is required, but depending on your specific setup, you may need to pass other options, such as host, port, and token.

| Option | Description | Required |
|---------|-------------|--------------|
| `--host` | The host URL of the server [default: `http://127.0.0.1:8181`] to query | No |
| `--database` | The name of the database to operate on | Yes |
| `--token` | The authentication token for the {{% product-name %}} server | No |
| `--language` | The query language of the provided query string [default: `sql`] [possible values: `sql`, `influxql`] | No  |
| `--format` | The format in which to output the query [default: `pretty`] [possible values: `pretty`, `json`, `jsonl`, `csv`, `parquet`] | No |
| `--output` | The path to output data to | No |

#### Example: query `“SHOW TABLES”` on the `servers` database:

```console
$ influxdb3 query --database servers "SHOW TABLES"
+---------------+--------------------+--------------+------------+
| table_catalog | table_schema       | table_name   | table_type |
+---------------+--------------------+--------------+------------+
| public        | iox                | cpu          | BASE TABLE |
| public        | information_schema | tables       | VIEW       |
| public        | information_schema | views        | VIEW       |
| public        | information_schema | columns      | VIEW       |
| public        | information_schema | df_settings  | VIEW       |
| public        | information_schema | schemata     | VIEW       |
+---------------+--------------------+--------------+------------+
```

#### Example: query the `cpu` table, limiting to 10 rows:

```console
$ influxdb3 query --database servers "SELECT DISTINCT usage_percent, time FROM cpu LIMIT 10"
+---------------+---------------------+
| usage_percent | time                |
+---------------+---------------------+
| 63.4          | 2024-02-21T19:25:00 |
| 25.3          | 2024-02-21T19:06:40 |
| 26.5          | 2024-02-21T19:31:40 |
| 70.1          | 2024-02-21T19:03:20 |
| 83.7          | 2024-02-21T19:30:00 |
| 55.2          | 2024-02-21T19:00:00 |
| 80.5          | 2024-02-21T19:05:00 |
| 60.2          | 2024-02-21T19:33:20 |
| 20.5          | 2024-02-21T18:58:20 |
| 85.2          | 2024-02-21T19:28:20 |
+---------------+---------------------+
```

### Query using the CLI for InfluxQL

[InfluxQL](/influxdb3/version/reference/influxql/) is an SQL-like language developed by InfluxData with specific features tailored for leveraging and working with InfluxDB. It’s compatible with all versions of InfluxDB, making it a good choice for interoperability across different InfluxDB installations.

To query using InfluxQL, enter the `influxdb3 query` subcommand and specify `influxql` in the language option--for example:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 query \
  --database DATABASE_NAME \
  --token <AUTH_TOKEN> \
  --language influxql \
  "SELECT DISTINCT usage_percent FROM cpu WHERE time >= now() - 1d"
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query 
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}

### Query using the API

InfluxDB 3 supports Flight (gRPC) APIs and an HTTP API.
To query your database using the HTTP API, send a request to the `/api/v3/query_sql` or `/api/v3/query_influxql` endpoints.
In the request, specify the database name in the `db` parameter
and a query in the `q` parameter.
You can pass parameters in the query string or inside a JSON object.

Use the `format` parameter to specify the response format: `pretty`, `jsonl`, `parquet`, `csv`, and `json`. Default is `json`.

##### Example: Query passing URL-encoded parameters

The following example sends an HTTP `GET` request with a URL-encoded SQL query:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
curl -G "http://{{< influxdb/host >}}/api/v3/query_sql" \
  --header 'Authorization: Bearer AUTH_TOKEN' \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=select * from cpu limit 5"
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query 
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}

##### Example: Query passing JSON parameters

The following example sends an HTTP `POST` request with parameters in a JSON payload:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
curl http://{{< influxdb/host >}}/api/v3/query_sql \
  --data '{"db": "DATABASE_NAME", "q": "select * from cpu limit 5"}'
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query 
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}

### Query using the Python client

Use the InfluxDB 3 Python library to interact with the database and integrate with your application.
We recommend installing the required packages in a Python virtual environment for your specific project.

To get started, install the `influxdb3-python` package.

```bash
pip install influxdb3-python
```

From here, you can connect to your database with the client library using just the **host** and **database name:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```python
from influxdb_client_3 import InfluxDBClient3

client = InfluxDBClient3(
    token='AUTH_TOKEN',
    host='http://{{< influxdb/host >}}',
    database='DATABASE_NAME'
)
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query 
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}

The following example shows how to query using SQL, and then
use PyArrow to explore the schema and process results.
To authorize the query, the example retrieves the {{% token-link "database" %}}
from the `INFLUXDB3_AUTH_TOKEN` environment variable.

```python
from influxdb_client_3 import InfluxDBClient3
import os

client = InfluxDBClient3(
    token=os.environ.get('INFLUXDB3_AUTH_TOKEN'),
    host='http://{{< influxdb/host >}}',
    database='servers'
)

# Execute the query and return an Arrow table
table = client.query(
    query="SELECT * FROM cpu LIMIT 10",
    language="sql"
)

print("\n#### View Schema information\n")
print(table.schema)

print("\n#### Use PyArrow to read the specified columns\n")
print(table.column('usage_active'))
print(table.select(['host', 'usage_active']))
print(table.select(['time', 'host', 'usage_active']))

print("\n#### Use PyArrow compute functions to aggregate data\n")
print(table.group_by('host').aggregate([]))
print(table.group_by('cpu').aggregate([('time_system', 'mean')]))
```

For more information about the Python client library, see the [`influxdb3-python` repository](https://github.com/InfluxCommunity/influxdb3-python) in GitHub.

### Query using InfluxDB 3 Explorer (Beta)

You can use the InfluxDB 3 Explorer web-based interface to query and visualize data,
and administer your {{% product-name %}} instance.
For more information, see how to [install InfluxDB 3 Explorer (Beta)](/influxdb3/explorer/install/) using Docker
and get started querying your data.

### Last values cache

{{% product-name %}} supports a **last-n values cache** which stores the last N values in a series or column hierarchy in memory. This gives the database the ability to answer these kinds of queries in under 10 milliseconds.

You can use the `influxdb3` CLI to [create a last value cache](/influxdb3/version/reference/cli/influxdb3/create/last_cache/).

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN|TABLE_NAME|CACHE_NAME" %}}
```bash
influxdb3 create last_cache \
  --token AUTH_TOKEN
  --database DATABASE_NAME \
  --table TABLE_NAME \
  CACHE_NAME
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create the last values cache in
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to create the last values cache in
- {{% code-placeholder-key %}}`CACHE_NAME`{{% /code-placeholder-key %}}: Optionally, a name for the new cache

Consider the following `cpu` sample table:

| host | application | time | usage\_percent | status |
| ----- | ----- | ----- | ----- | ----- |
| Bravo | database | 2024-12-11T10:00:00 | 55.2 | OK |
| Charlie | cache | 2024-12-11T10:00:00 | 65.4 | OK |
| Bravo | database | 2024-12-11T10:01:00 | 70.1 | Warn |
| Bravo | database | 2024-12-11T10:01:00 | 80.5 | OK |
| Alpha | webserver | 2024-12-11T10:02:00 | 25.3 | Warn |

The following command creates a last value cache named `cpuCache`:

```bash
influxdb3 create last_cache \
  --token apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0== \
  --database servers \
  --table cpu \
  --key-columns host,application \
  --value-columns usage_percent,status \
  --count 5 cpuCache
```

_You can create a last values cache per time series, but be mindful of high cardinality tables that could take excessive memory._

#### Query a last values cache

To query data from the LVC, use the [`last_cache()`](/influxdb3/version/reference/sql/functions/cache/#last_cache) function in your query--for example:

```bash
influxdb3 query \
  --token apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0== \
  --database servers \
  "SELECT * FROM last_cache('cpu', 'cpuCache') WHERE host = 'Bravo';"
```

> [!Note]
> #### Only works with SQL
> 
> The last values cache only works with SQL, not InfluxQL; SQL is the default language.

#### Delete a last values cache

Use the `influxdb3` CLI to [delete a last values cache](/influxdb3/version/reference/cli/influxdb3/delete/last_cache/)

{{% code-placeholders "DATABASE_NAME|TABLE_NAME|CACHE_NAME" %}}
```bash
influxdb3 delete last_cache \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --table TABLE \
  --cache-name CACHE_NAME
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to delete the last values cache from
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to delete the last values cache from
- {{% code-placeholder-key %}}`CACHE_NAME`{{% /code-placeholder-key %}}: the name of the last values cache to delete

### Distinct values cache

Similar to the [last values cache](#last-values-cache), the database can cache in RAM the distinct values for a single column in a table or a hierarchy of columns.
This is useful for fast metadata lookups, which can return in under 30 milliseconds.
Many of the options are similar to the last value cache.

You can use the `influxdb3` CLI to [create a distinct values cache](/influxdb3/version/reference/cli/influxdb3/create/distinct_cache/).

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN|TABLE_NAME|CACHE_NAME" %}}
```bash
influxdb3 create distinct_cache \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --table TABLE \
  --columns COLUMNS \
  CACHE_NAME
```
{{% /code-placeholders %}}
Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create the last values cache in
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to create the distinct values cache in
- {{% code-placeholder-key %}}`CACHE_NAME`{{% /code-placeholder-key %}}: Optionally, a name for the new cache

Consider the following `cpu` sample table:

| host | application | time | usage\_percent | status |
| ----- | ----- | ----- | ----- | ----- |
| Bravo | database | 2024-12-11T10:00:00 | 55.2 | OK |
| Charlie | cache | 2024-12-11T10:00:00 | 65.4 | OK |
| Bravo | database | 2024-12-11T10:01:00 | 70.1 | Warn |
| Bravo | database | 2024-12-11T10:01:00 | 80.5 | OK |
| Alpha | webserver | 2024-12-11T10:02:00 | 25.3 | Warn |

The following command creates a distinct values cache named `cpuDistinctCache`:

```bash
influxdb3 create distinct_cache \
  --token apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0== \
  --database servers \
  --table cpu \
  --columns host,application \
  cpuDistinctCache
```

#### Query a distinct values cache

To query data from the distinct values cache, use the [`distinct_cache()`](/influxdb3/version/reference/sql/functions/cache/#distinct_cache) function in your query--for example:

```bash
influxdb3 query \
  --token apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0== \
  --database servers \
  "SELECT * FROM distinct_cache('cpu', 'cpuDistinctCache')"
```

> [!Note]
> #### Only works with SQL
> 
> The distinct cache only works with SQL, not InfluxQL; SQL is the default language.

#### Delete a distinct values cache

Use the `influxdb3` CLI to [delete a distinct values cache](/influxdb3/version/reference/cli/influxdb3/delete/distinct_cache/)

{{% code-placeholders "DATABASE_NAME|TABLE_NAME|CACHE_NAME" %}}
```bash
influxdb3 delete distinct_cache \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --table TABLE \
  --cache-name CACHE_NAME
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to delete the distinct values cache from
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to delete the distinct values cache from
- {{% code-placeholder-key %}}`CACHE_NAME`{{% /code-placeholder-key %}}: the name of the distinct values cache to delete

### Python plugins and the processing engine

The InfluxDB 3 processing engine is an embedded Python VM for running code inside the database to process and transform data.

To activate the processing engine, pass the `--plugin-dir <PLUGIN_DIR>` option when starting the {{% product-name %}} server.
`PLUGIN_DIR` is your filesystem location for storing [plugin](#plugin) files for the processing engine to run.

#### Plugin

A plugin is a Python function that has a signature compatible with a Processing engine [trigger](#trigger).

#### Trigger

When you create a trigger, you specify a [plugin](#plugin), a database, optional arguments,
and a _trigger-spec_, which defines when the plugin is executed and what data it receives.

##### Trigger types

InfluxDB 3 provides the following types of triggers, each with specific trigger-specs:

- **On WAL flush**: Sends a batch of written data (for a specific table or all tables) to a plugin (by default, every second).
- **On Schedule**: Executes a plugin on a user-configured schedule (using a crontab or a duration); useful for data collection and deadman monitoring.
- **On Request**: Binds a plugin to a custom HTTP API endpoint at `/api/v3/engine/<ENDPOINT_PATH>`.
  The plugin receives the HTTP request headers and content, and can then parse, process, and send the data into the database or to third-party services.

### Test, create, and trigger plugin code

##### Example: Python plugin for WAL rows 

```python
# This is the basic structure for Python plugin code that runs in the
# InfluxDB 3 Processing engine.

# When creating a trigger, you can provide runtime arguments to your plugin,
# allowing you to write generic code that uses variables such as monitoring
thresholds, environment variables, and host names.
#
# Use the following exact signature to define a function for the WAL flush
# trigger.
# When you create a trigger for a WAL flush plugin, you specify the database
# and tables that the plugin receives written data from on every WAL flush
# (default is once per second).
def process_writes(influxdb3_local, table_batches, args=None):
    # here you can see logging. for now this won't do anything, but soon 
    # we'll capture this so you can query it from system tables
    if args and "arg1" in args:
        influxdb3_local.info("arg1: " + args["arg1"])

    # here we're using arguments provided at the time the trigger was set up 
    # to feed into paramters that we'll put into a query
    query_params = {"host": "foo"}
    # here's an example of executing a parameterized query. Only SQL is supported. 
    # It will query the database that the trigger is attached to by default. We'll 
    # soon have support for querying other DBs.
    query_result = influxdb3_local.query("SELECT * FROM cpu where host = '$host'", query_params)
    # the result is a list of Dict that have the column name as key and value as 
    # value. If you run the WAL test plugin with your plugin against a DB that 
    # you've written data into, you'll be able to see some results
    influxdb3_local.info("query result: " + str(query_result))

    # this is the data that is sent when the WAL is flushed of writes the server 
    # received for the DB or table of interest. One batch for each table (will 
    # only be one if triggered on a single table)
    for table_batch in table_batches:
        # here you can see that the table_name is available.
        influxdb3_local.info("table: " + table_batch["table_name"])

        # example to skip the table we're later writing data into
        if table_batch["table_name"] == "some_table":
            continue

        # and then the individual rows, which are Dict with keys of the column names and values
        for row in table_batch["rows"]:
            influxdb3_local.info("row: " + str(row))

    # this shows building a line of LP to write back to the database. tags must go first and 
    # their order is important and must always be the same for each individual table. Then 
    # fields and lastly an optional time, which you can see in the next example below
    line = LineBuilder("some_table")\
        .tag("tag1", "tag1_value")\
        .tag("tag2", "tag2_value")\
        .int64_field("field1", 1)\
        .float64_field("field2", 2.0)\
        .string_field("field3", "number three")
    
    # this writes it back (it actually just buffers it until the completion of this function
    # at which point it will write everything back that you put in)
    influxdb3_local.write(line)

    # here's another example, but with us setting a nanosecond timestamp at the end
    other_line = LineBuilder("other_table")
    other_line.int64_field("other_field", 1)
    other_line.float64_field("other_field2", 3.14)
    other_line.time_ns(1302)

    # and you can see that we can write to any DB in the server
    influxdb3_local.write_to_db("mytestdb", other_line)

    # just some log output as an example
    influxdb3_local.info("done")
```

##### Test a plugin on the server

Test your InfluxDB 3 plugin safely without affecting written data. During a plugin test:

- A query executed by the plugin queries against the server you send the request to.
- Writes aren't sent to the server but are returned to you.

To test a plugin, do the following:

1. Create a _plugin directory_--for example, `/path/to/.influxdb/plugins`
2. [Start the InfluxDB server](#start-influxdb) and include the `--plugin-dir <PATH>` option.
3. Save the [example plugin code](#example-python-plugin-for-wal-rows) to a plugin file inside of the plugin directory. If you haven't yet written data to the table in the example, comment out the lines where it queries.
4. To run the test, enter the following command with the following options:

   - `--lp` or  `--file`: The line protocol to test
   - Optional: `--input-arguments`: A comma-delimited list of `<KEY>=<VALUE>` arguments for your plugin code

{{% code-placeholders "INPUT_LINE_PROTOCOL|INPUT_ARGS|DATABASE_NAME|AUTH_TOKEN|PLUGIN_FILENAME" %}}
```bash
influxdb3 test wal_plugin \
--lp INPUT_LINE_PROTOCOL \
--input-arguments INPUT_ARGS \
--database DATABASE_NAME \
--token AUTH_TOKEN \
PLUGIN_FILENAME
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`INPUT_LINE_PROTOCOL`{{% /code-placeholder-key %}}: the line protocol to test
- Optional: {{% code-placeholder-key %}}`INPUT_ARGS`{{% /code-placeholder-key %}}: a comma-delimited list of `<KEY>=<VALUE>` arguments for your plugin code--for example, `arg1=hello,arg2=world`
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to test against
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: the {{% token-link "admin" %}} for your {{% product-name %}} server
- {{% code-placeholder-key %}}`PLUGIN_FILENAME`{{% /code-placeholder-key %}}: the name of the plugin file to test

The command runs the plugin code with the test data, yields the data to the plugin code, and then responds with the plugin result.
You can quickly see how the plugin behaves, what data it would have written to the database, and any errors.
You can then edit your Python code in the plugins directory, and rerun the test.
The server reloads the file for every request to the `test` API.

For more information, see [`influxdb3 test wal_plugin`](/influxdb3/version/reference/cli/influxdb3/test/wal_plugin/) or run `influxdb3 test wal_plugin -h`.

With the plugin code inside the server plugin directory, and a successful test,
you're ready to create a plugin and a trigger to run on the server.

##### Example: Test, create, and run a plugin

The following example shows how to test a plugin, and then create the plugin and
trigger:

```bash
# Test and create a plugin
# Requires:
#   - A database named `mydb` with a table named `foo`
#   - A Python plugin file named `test.py`
# Test a plugin
influxdb3 test wal_plugin \
  --lp "my_measure,tag1=asdf f1=1.0 123" \
  --token apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0== \
  --database sensors \
  --input-arguments "arg1=hello,arg2=world" \
  test.py
```

```bash
# Create a trigger that runs the plugin
influxdb3 create trigger \
  --token apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0== \
  --database sensors \
  --plugin test_plugin \
  --trigger-spec "table:foo" \
  --trigger-arguments "arg1=hello,arg2=world" \
  trigger1
```

After you have created a plugin and trigger, enter the following command to
enable the trigger and have it run the plugin as you write data:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN|TRIGGER_NAME" %}}
```bash
influxdb3 enable trigger \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  TRIGGER_NAME
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to enable the trigger in
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}
- {{% code-placeholder-key %}}`TRIGGER_NAME`{{% /code-placeholder-key %}}: the name of the trigger to enable

For example, to enable the trigger named `trigger1` in the `sensors` database:

```bash
influxdb3 enable trigger \
  --token apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0== \
  --database sensors
  trigger1 
```

For more information, see [Python plugins and the Processing engine](/influxdb3/version/plugins/).

{{% show-in "enterprise" %}}
### Multi-server setup

{{% product-name %}} is built to support multi-node setups for high availability, read replicas, and flexible implementations depending on use case.  

### High availability

Enterprise is architecturally flexible, giving you options on how to configure multiple servers that work together for high availability (HA) and high performance.
Built on top of the diskless engine and leveraging the Object store, an HA setup ensures that if a node fails, you can still continue reading from, and writing to, a secondary node.

A two-node setup is the minimum for basic high availability, with both nodes having read-write permissions.

{{< img-hd src="/img/influxdb/influxdb-3-enterprise-high-availability.png" alt="Basic high availability setup" />}}

In a basic HA setup:

- Two nodes both write data to the same Object store and both handle queries
- Node 1 and Node 2 are _read replicas_ that read from each other’s Object store directories
- One of the nodes is designated as the Compactor node

> [!Note]
> Only one node can be designated as the Compactor.
> Compacted data is meant for a single writer, and many readers.

The following examples show how to configure and start two nodes
for a basic HA setup.

- _Node 1_ is for compaction (passes `compact` in `--mode`)
- _Node 2_ is for ingest and query

```bash
## NODE 1

# Example variables
# node-id: 'host01'
# cluster-id: 'cluster01'
# bucket: 'influxdb-3-enterprise-storage'

influxdb3 serve \
  --node-id host01 \
  --cluster-id cluster01 \
  --mode ingest,query,compact \
  --object-store s3 \
  --bucket influxdb-3-enterprise-storage \
  --http-bind {{< influxdb/host >}} \
  --aws-access-key-id <AWS_ACCESS_KEY_ID> \
  --aws-secret-access-key <AWS_SECRET_ACCESS_KEY>
```

```bash
## NODE 2

# Example variables
# node-id: 'host02'
# cluster-id: 'cluster01'
# bucket: 'influxdb-3-enterprise-storage'

influxdb3 serve \
  --node-id host02 \
  --cluster-id cluster01 \
  --mode ingest,query \
  --object-store s3 \
  --bucket influxdb-3-enterprise-storage \
  --http-bind localhost:8282 \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY
```

After the nodes have started, querying either node returns data for both nodes, and _NODE 1_ runs compaction.
To add nodes to this setup, start more read replicas with the same cluster ID.

### High availability with a dedicated Compactor

Data compaction in InfluxDB 3 is one of the more computationally expensive operations.
To ensure that your read-write nodes don't slow down due to compaction work, set up a compactor-only node for consistent and high performance across all nodes.

{{< img-hd src="/img/influxdb/influxdb-3-enterprise-dedicated-compactor.png" alt="Dedicated Compactor setup" />}}

The following examples show how to set up high availability with a dedicated Compactor node:

1. Start two read-write nodes as read replicas, similar to the previous example.

   ```bash
   ## NODE 1 — Writer/Reader Node #1

   # Example variables
   # node-id: 'host01'
   # cluster-id: 'cluster01'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve \
     --node-id host01 \
     --cluster-id cluster01 \
     --mode ingest,query \
     --object-store s3 \
     --bucket influxdb-3-enterprise-storage \
     --http-bind {{< influxdb/host >}} \
     --aws-access-key-id <AWS_ACCESS_KEY_ID> \
     --aws-secret-access-key <AWS_SECRET_ACCESS_KEY>
   ```

   ```bash
   ## NODE 2 — Writer/Reader Node #2

   # Example variables
   # node-id: 'host02'
   # cluster-id: 'cluster01'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve \
     --node-id host02 \
     --cluster-id cluster01 \
     --mode ingest,query \
     --object-store s3 \
     --bucket influxdb-3-enterprise-storage \
     --http-bind localhost:8282 \
     --aws-access-key-id <AWS_ACCESS_KEY_ID> \
     --aws-secret-access-key <AWS_SECRET_ACCESS_KEY>
   ```

2. Start the dedicated compactor node with the `--mode=compact` option to ensure the node **only** runs compaction.

   ```bash
   ## NODE 3 — Compactor Node

   # Example variables
   # node-id: 'host03'
   # cluster-id: 'cluster01'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve \
     --node-id host03 \
     --cluster-id cluster01 \
     --mode compact \
     --object-store s3 \
     --bucket influxdb-3-enterprise-storage \
     --aws-access-key-id <AWS_ACCESS_KEY_ID> \
     --aws-secret-access-key <AWS_SECRET_ACCESS_KEY>
   ```

### High availability with read replicas and a dedicated Compactor

For a robust and effective setup for managing time-series data, you can run ingest nodes alongside read-only nodes and a dedicated Compactor node.

{{< img-hd src="/img/influxdb/influxdb-3-enterprise-workload-isolation.png" alt="Workload Isolation Setup" />}}

1. Start ingest nodes by assigning them the **`ingest`** mode.
   To achieve the benefits of workload isolation, you'll send _only write requests_ to these ingest nodes. Later, you'll configure the _read-only_ nodes.

   ```bash
   ## NODE 1 — Writer Node #1

   # Example variables
   # node-id: 'host01'
   # cluster-id: 'cluster01'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve \
     --node-id host01 \
     --cluster-id cluster01 \
     --mode ingest \
     --object-store s3 \
     --bucket influxdb-3-enterprise-storage \
     --http-bind {{< influxdb/host >}} \
     --aws-access-key-id <AWS_ACCESS_KEY_ID> \
     --aws-secret-access-key <AWS_SECRET_ACCESS_KEY>
   ```

<!-- The following examples use different ports for different nodes. Don't use the influxdb/host shortcode below. -->

   ```bash
   ## NODE 2 — Writer Node #2

   # Example variables
   # node-id: 'host02'
   # cluster-id: 'cluster01'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve \
     --node-id host02 \
     --cluster-id cluster01 \
     --mode ingest \
     --object-store s3 \
     --bucket influxdb-3-enterprise-storage \
     --http-bind localhost:8282 \
     --aws-access-key-id <AWS_ACCESS_KEY_ID> \
     --aws-secret-access-key <AWS_SECRET_ACCESS_KEY>
   ```

2. Start the dedicated Compactor node with ` compact`.

   ```bash
   ## NODE 3 — Compactor Node

   # Example variables
   # node-id: 'host03'
   # cluster-id: 'cluster01'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve \
    --node-id host03 \
    --cluster-id cluster01 \
    --mode compact \
    --object-store s3 \
    --bucket influxdb-3-enterprise-storage \
    --aws-access-key-id <AWS_ACCESS_KEY_ID> \
     <AWS_SECRET_ACCESS_KEY>
   ```

3. Finally, start the query nodes as _read-only_ with `--mode query`.

   ```bash
   ## NODE 4 — Read Node #1

   # Example variables
   # node-id: 'host04'
   # cluster-id: 'cluster01'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve \
     --node-id host04 \
     --cluster-id cluster01 \
     --mode query \
     --object-store s3 \
     --bucket influxdb-3-enterprise-storage \
     --http-bind localhost:8383 \
     --aws-access-key-id <AWS_ACCESS_KEY_ID> \
     --aws-secret-access-key <AWS_SECRET_ACCESS_KEY>
   ```

   ```bash
   ## NODE 5 — Read Node #2

   # Example variables
   # node-id: 'host05'
   # cluster-id: 'cluster01'
   # bucket: 'influxdb-3-enterprise-storage'

   influxdb3 serve \
    --node-id host05 \
    --cluster-id cluster01 \
    --mode query \
    --object-store s3 \
    --bucket influxdb-3-enterprise-storage \
    --http-bind localhost:8484 \
    --aws-access-key-id <AWS_ACCESS_KEY_ID> \
     <AWS_SECRET_ACCESS_KEY>
   ```

Congratulations, you have a robust setup for workload isolation using {{% product-name %}}.

### Writing and querying for multi-node setups

You can use the default port `8181` for any write or query, without changing any of the commands.

> [!Note]
> #### Specify hosts for writes and queries
>
> To benefit from this multi-node, isolated architecture, specify hosts:
> 
> - In write requests, specify a host that you have designated as _write-only_.
> - In query requests, specify a host that you have designated as _read-only_. 
> 
> When running multiple local instances for testing or separate nodes in production, specifying the host ensures writes and queries are routed to the correct instance.

{{% code-placeholders "(http://localhost:8585)|AUTH_TOKEN|DATABASE_NAME|QUERY" %}}
```bash
# Example querying a specific host
# HTTP-bound Port: 8585
influxdb3 query \
  --host http://localhost:8585
  --token AUTH_TOKEN \
  --database DATABASE_NAME "QUERY" 
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`http://localhost:8585`{{% /code-placeholder-key %}}: the host and port of the node to query
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query
- {{% code-placeholder-key %}}`QUERY`{{% /code-placeholder-key %}}: the SQL or InfluxQL query to run against the database

### File index settings

To accelerate performance on specific queries, you can define non-primary keys to index on, which helps improve performance for single-series queries.
This feature is only available in {{% product-name %}} and is not available in Core.

#### Create a file index

{{% code-placeholders "AUTH_TOKEN|DATABASE|TABLE|COLUMNS" %}}

```bash
# Example variables on a query
# HTTP-bound Port: 8585

influxdb3 create file_index \
  --host http://localhost:8585 \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  --table TABLE_NAME \
  COLUMNS
```

#### Delete a file index

```bash
influxdb3 delete file_index \
  --host http://localhost:8585 \
  --database DATABASE_NAME \
  --table TABLE_NAME \
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create the file index in
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}: the name of the table to create the file index in
- {{% code-placeholder-key %}}`COLUMNS`{{% /code-placeholder-key %}}: a comma-separated list of columns to index on, for example, `host,application`
{{% /show-in %}}
