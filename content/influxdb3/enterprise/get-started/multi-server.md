---
title: Create a multi-node cluster
seotitle: Create a multi-node InfluxDB 3 Enterprise cluster
description: >
  Create a multi-node InfluxDB 3 Enterprise cluster for high availability,
  performance, read replicas, and more to meet the specific needs of your use case.
menu:
  influxdb3_enterprise:
    name: Create a multi-node cluster
    parent: Get started
    identifier: gs-multi-node-cluster 
weight: 102
influxdb3/enterprise/tags: [cluster, multi-node, multi-server]
---

Create a multi-node {{% product-name %}} cluster for high availability, performance, and workload isolation.
Configure nodes with specific _modes_ (ingest, query, process, compact) to optimize for your use case.

## Prerequisites

- Shared object store
- Network connectivity between nodes

## Basic multi-node setup

<!-- pytest.mark.skip -->
```bash
## NODE 1 compacts stored data

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

<!-- pytest.mark.skip -->
```bash
## NODE 2 handles writes and queries 

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

Learn how to set up a multi-node cluster for different use cases, including high availability, read replicas, processing data, and workload isolation.

- [Create an object store](#create-an-object-store)
- [Connect to your object store](#connect-to-your-object-store)
- [Server modes](#server-modes)
- [Cluster configuration examples](#cluster-configuration-examples)
- [Writing and querying in multi-node clusters](#writing-and-querying-in-multi-node-clusters)

## Create an object store

With the {{% product-name %}} diskless architecture, all data is stored in a common object store.
In a multi-node cluster, you connect all nodes to the same object store.

Enterprise supports the following object stores:

- AWS S3 (or S3-compatible)
- Azure Blob Storage
- Google Cloud Storage

> [!Note]
> Refer to your object storage provider's documentation for 
> setting up an object store.

## Connect to your object store

When starting your {{% product-name %}} node, include provider-specific options for connecting to your object store--for example:

{{< tabs-wrapper >}}
{{% tabs %}}
[S3 or S3-compatible](#)
[Azure Blob Storage](#)
[Google Cloud Storage](#)
{{% /tabs %}}
{{% tab-content %}}
<!---------------------------------- BEGIN S3 --------------------------------->

To use an AWS S3 or S3-compatible object store, provide the following options
with your `influxdb3 serve` command:

- `--object-store`: `s3`
- `--bucket`: Your AWS S3 bucket name
- `--aws-access-key-id`: Your AWS access key ID  
  _(can also be defined using the `AWS_ACCESS_KEY_ID` environment variable)_
- `--aws-secret-access-key`: Your AWS secret access key  
  _(can also be defined using the `AWS_SECRET_ACCESS_KEY` environment variable)_

{{% code-placeholders "AWS_(BUCKET_NAME|ACCESS_KEY_ID|SECRET_ACCESS_KEY)" %}}
<!-- pytest.mark.skip -->
```bash
influxdb3 serve \
  # ...
  --object-store s3 \
  --bucket AWS_BUCKET_NAME \
  --aws-access-key-id AWS_ACCESS_KEY_ID \
  --aws-secret-access-key AWS_SECRET_ACCESS_KEY
```
{{% /code-placeholders %}}

_For information about other S3-specific settings, see
[Configuration options - AWS](/influxdb3/enterprise/reference/config-options/#aws)._

<!----------------------------------- END S3 ---------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------- BEGIN AZURE BLOB STORAGE ------------------------->

To use Azure Blob Storage as your object store, provide the following options
with your `influxdb3 serve` command:

- `--object-store`: `azure`
- `--bucket`: Your Azure Blob Storage container name
- `--azure-storage-account`: Your Azure Blob Storage storage account name  
  _(can also be defined using the `AZURE_STORAGE_ACCOUNT` environment variable)_
- `--aws-secret-access-key`: Your Azure Blob Storage access key  
  _(can also be defined using the `AZURE_STORAGE_ACCESS_KEY` environment variable)_

{{% code-placeholders "AZURE_(CONTAINER_NAME|STORAGE_ACCOUNT|STORAGE_ACCESS_KEY)" %}}
<!-- pytest.mark.skip -->
```bash
influxdb3 serve \
  # ...
  --object-store azure \
  --bucket AZURE_CONTAINER_NAME \
  --azure-storage-account AZURE_STORAGE_ACCOUNT \
  --azure-storage-access-key AZURE_STORAGE_ACCESS_KEY
```
{{% /code-placeholders %}}

<!--------------------------- END AZURE BLOB STORAGE -------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------- BEGIN GOOGLE CLOUD STORAGE ------------------------>

To use Google Cloud Storage as your object store, provide the following options
with your `influxdb3 serve` command:

- `--object-store`: `google`
- `--bucket`: Your Google Cloud Storage bucket name
- `--google-service-account`: The path to to your Google credentials JSON file
  _(can also be defined using the `GOOGLE_SERVICE_ACCOUNT` environment variable)_

{{% code-placeholders "GOOGLE_(BUCKET_NAME|SERVICE_ACCOUNT)" %}}
<!-- pytest.mark.skip -->
```bash
influxdb3 serve \
  # ...
  --object-store google \
  --bucket GOOGLE_BUCKET_NAME \
  --google-service-account GOOGLE_SERVICE_ACCOUNT
```
{{% /code-placeholders %}}

<!-------------------------- END GOOGLE CLOUD STORAGE ------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Server modes

{{% product-name %}} _modes_ determine what subprocesses the Enterprise node runs.
These subprocesses fulfill required tasks including data ingestion, query
processing, compaction, and running the processing engine.

The `influxdb3 serve --mode` option defines what subprocesses a node runs.
Each node can run in one _or more_ of the following modes:

- **all** _(default)_: Runs all necessary subprocesses.
- **ingest**: Runs the data ingestion subprocess to handle writes.
- **query**: Runs the query processing subprocess to handle queries.
- **process**: Runs the processing engine subprocess to trigger and execute plugins.
- **compact**: Runs the compactor subprocess to optimize data in object storage.

  > [!Important]
  > Only _one_ node in your cluster can run in `compact` mode.

### Server mode examples

#### Configure a node to only handle write requests
<!-- pytest.mark.skip -->
```bash
influxdb3 serve \
  # ...
  --mode ingest
```

#### Configure a node to only run the Compactor
<!-- pytest.mark.skip -->
```bash
influxdb3 serve \
  # ...
  --mode compact
```

#### Configure a node to handle queries and run the processing engine 
<!-- pytest.mark.skip -->
```bash
influxdb3 serve \
  # ...
  --mode query,process
```

## Cluster configuration examples

- [High availability cluster](#high-availability-cluster)
- [High availability with a dedicated Compactor](#high-availability-with-a-dedicated-compactor)
- [High availability with read replicas and a dedicated Compactor](#high-availability-with-read-replicas-and-a-dedicated-compactor)

### High availability cluster

A minimum of two nodes are required for basic high availability (HA), with both
nodes reading and writing data.

{{< img-hd src="/img/influxdb/influxdb-3-enterprise-high-availability.png" alt="Basic high availability setup" />}}

In a basic HA setup:

- Two nodes both write data to the same object store and both handle queries
- Node 1 and Node 2 are _read replicas_ that read from each other’s object store directories
- One of the nodes is designated as the Compactor node

> [!Note]
> Only one node can be designated as the Compactor.
> Compacted data is meant for a single writer, and many readers.

The following examples show how to configure and start two nodes for a basic HA
setup.

- _Node 1_ is for compaction
- _Node 2_ is for ingest and query

<!-- pytest.mark.skip -->
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

<!-- pytest.mark.skip -->
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

After the nodes have started, querying either node returns data for both nodes,
and _NODE 1_ runs compaction.
To add nodes to this setup, start more read replicas with the same cluster ID.

### High availability with a dedicated Compactor

Data compaction in {{% product-name %}} is one of the more computationally
demanding operations.
To ensure stable performance in ingest and query nodes, set up a
compactor-only node to isolate the compaction workload.

{{< img-hd src="/img/influxdb/influxdb-3-enterprise-dedicated-compactor.png" alt="Dedicated Compactor setup" />}}

The following examples sets up high availability with a dedicated Compactor node:

1.  Start two read-write nodes as read replicas, similar to the previous example.

    <!-- pytest.mark.skip -->
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

    <!-- pytest.mark.skip -->
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

2.  Start the dedicated compactor node with the `--mode=compact` option to ensure the node **only** runs compaction.

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

For a robust and effective setup for managing time-series data, you can run
ingest nodes alongside query nodes and a dedicated Compactor node.

{{< img-hd src="/img/influxdb/influxdb-3-enterprise-workload-isolation.png" alt="Workload Isolation Setup" />}}

1.  Start ingest nodes with the **`ingest`** mode.
    
    > [!Note]
    > Send all write requests to only your ingest nodes.

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

2. Start the dedicated Compactor node with the `compact` mode.

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

3.  Finally, start the query nodes using the `query` mode.

    > [!Note]
    > Send all query requests to only your query nodes.

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

## Writing and querying in multi-node clusters

You can use the default port `8181` for any write or query request without
changing any of the commands.

> [!Note]
> #### Specify hosts for write and query requests
>
> To benefit from this multi-node, isolated architecture:
> 
> - Send write requests to a node that you have designated as an ingester.
> - Send query requests to a node that you have designated as a querier. 
> 
> When running multiple local instances for testing or separate nodes in
> production, specifying the host ensures writes and queries are routed to the
> correct instance.

{{% code-placeholders "(http://localhost:8585)|AUTH_TOKEN|DATABASE_NAME|QUERY" %}}
```bash
# Example querying a specific host
# HTTP-bound Port: 8585
influxdb3 query \
  --host http://localhost:8585
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  "QUERY" 
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`http://localhost:8585`{{% /code-placeholder-key %}}: the host and port of the node to query
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query
- {{% code-placeholder-key %}}`QUERY`{{% /code-placeholder-key %}}: the SQL or InfluxQL query to run against the database

{{% page-nav
  prev="/influxdb3/enterprise/get-started/setup/"
  prevText="Set up InfluxDB"
  next="/influxdb3/enterprise/get-started/write/"
  nextText="Write data"
%}}