---
title: Use a multi-server setup
seotitle: Use a multi-server InfluxDB 3 Enterprise setup
menu:
  influxdb3_enterprise:
    name: Multi-server
    parent: Get started
weight: 4
influxdb3/enterprise/tags: [cluster, multi-node, multi-server]
draft: true
---

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