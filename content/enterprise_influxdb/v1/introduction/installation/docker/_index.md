---
title: Install and run InfluxDB v1 Enterprise with Docker
description: Install and run InfluxDB v1 Enterprise using Docker images for meta nodes and data nodes.
menu:
  enterprise_influxdb_v1:
    name: Install with Docker
    weight: 30
    parent: Install
related:
  - /enterprise_influxdb/v1/introduction/installation/docker/docker-troubleshooting/
---

InfluxDB v1 Enterprise provides Docker images for both meta nodes and data nodes to simplify cluster deployment and management.
Using Docker allows you to quickly set up and run InfluxDB Enterprise clusters with consistent configurations.

> [!Important]
> #### Enterprise license required
> You must have a valid license to run InfluxDB Enterprise.
> Contact <sales@influxdata.com> for licensing information or obtain a 14-day demo license via the [InfluxDB Enterprise portal](https://portal.influxdata.com/users/new).

## Docker image variants

InfluxDB Enterprise provides two specialized Docker images:

- **`influxdb:meta`**: Enterprise meta node package for clustering
- **`influxdb:data`**: Enterprise data node package for clustering

## Requirements

- [Docker](https://docs.docker.com/get-docker/) installed and running
- Valid [InfluxData license key](#enterprise-license-required)
- Network connectivity between nodes
- At least 3 meta nodes (odd number recommended)
- At least 2 data nodes

## Set up an InfluxDB Enterprise cluster with Docker

### 1. Create a Docker network

Create a custom Docker network to allow communication between meta and data nodes:

```bash
docker network create influxdb
```

### 2. Start meta nodes

Start three meta nodes using the `influxdb:meta` image.
Each meta node requires a unique hostname and the Enterprise license key:

```bash
# Start first meta node
docker run -d \
  --name=influxdb-meta-0 \
  --network=influxdb \
  -h influxdb-meta-0 \
  -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key \
  influxdb:meta

# Start second meta node
docker run -d \
  --name=influxdb-meta-1 \
  --network=influxdb \
  -h influxdb-meta-1 \
  -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key \
  influxdb:meta

# Start third meta node
docker run -d \
  --name=influxdb-meta-2 \
  --network=influxdb \
  -h influxdb-meta-2 \
  -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key \
  influxdb:meta
```

### 3. Configure meta nodes to know each other

From the first meta node, add the other meta nodes to the cluster:

```bash
# Add the second meta node
docker exec influxdb-meta-0 \
  influxd-ctl add-meta influxdb-meta-1:8091

# Add the third meta node
docker exec influxdb-meta-0 \
  influxd-ctl add-meta influxdb-meta-2:8091
```

### 4. Start data nodes

Start two or more data nodes using the `influxdb:data` image:

```bash
# Start first data node
docker run -d \
  --name=influxdb-data-0 \
  --network=influxdb \
  -h influxdb-data-0 \
  -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key \
  influxdb:data

# Start second data node
docker run -d \
  --name=influxdb-data-1 \
  --network=influxdb \
  -h influxdb-data-1 \
  -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key \
  influxdb:data
```

### 5. Add data nodes to the cluster

From the first meta node, register each data node with the cluster:

```bash
# Add first data node
docker exec influxdb-meta-0 \
  influxd-ctl add-data influxdb-data-0:8088

# Add second data node
docker exec influxdb-meta-0 \
  influxd-ctl add-data influxdb-data-1:8088
```

### 6. Verify the cluster

Check that all nodes are properly added to the cluster:

```bash
docker exec influxdb-meta-0 influxd-ctl show
```

Expected output:
```
Data Nodes
==========
ID   TCP Address            Version
4    influxdb-data-0:8088   1.x.x-cX.X.X
5    influxdb-data-1:8088   1.x.x-cX.X.X

Meta Nodes
==========
TCP Address            Version
influxdb-meta-0:8091   1.x.x-cX.X.X
influxdb-meta-1:8091   1.x.x-cX.X.X
influxdb-meta-2:8091   1.x.x-cX.X.X
```

## Configuration options

### Using environment variables

You can configure {{% product-name %}} using environment variables with the format `INFLUXDB_<SECTION>_<NAME>`.

Common environment variables:
- `INFLUXDB_REPORTING_DISABLED=true`
- `INFLUXDB_META_DIR=/path/to/metadir`
- `INFLUXDB_ENTERPRISE_REGISTRATION_ENABLED=true`
- `INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key`

For all available environment variables, see how to [Configure Enterprise](/enterprise_influxdb/v1/administration/configure/).

### Using configuration files

You can also mount custom configuration files:

```bash
# Mount custom meta configuration
docker run -d \
  --name=influxdb-meta-0 \
  --network=influxdb \
  -h influxdb-meta-0 \
  -v /path/to/influxdb-meta.conf:/etc/influxdb/influxdb-meta.conf \
  -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key \
  influxdb:meta

# Mount custom data configuration
docker run -d \
  --name=influxdb-data-0 \
  --network=influxdb \
  -h influxdb-data-0 \
  -v /path/to/influxdb.conf:/etc/influxdb/influxdb.conf \
  -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key \
  influxdb:data
```

## Exposing ports

To access your InfluxDB Enterprise cluster from outside Docker, expose the necessary ports:

```bash
# Data node with HTTP API port exposed
docker run -d \
  --name=influxdb-data-0 \
  --network=influxdb \
  -h influxdb-data-0 \
  -p 8086:8086 \
  -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key \
  influxdb:data
```

## Persistent data storage

To persist data beyond container lifecycles, mount volumes:

```bash
# Meta node with persistent storage
docker run -d \
  --name=influxdb-meta-0 \
  --network=influxdb \
  -h influxdb-meta-0 \
  -v influxdb-meta-0-data:/var/lib/influxdb \
  -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key \
  influxdb:meta

# Data node with persistent storage
docker run -d \
  --name=influxdb-data-0 \
  --network=influxdb \
  -h influxdb-data-0 \
  -v influxdb-data-0-data:/var/lib/influxdb \
  -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key \
  influxdb:data
```

## Next steps

Once your InfluxDB Enterprise cluster is running:

1. [Set up authentication and authorization](/enterprise_influxdb/v1/administration/configure/security/authentication/) for your cluster.
2. [Enable TLS encryption](/enterprise_influxdb/v1/guides/enable-tls/) for secure communication.
3. [Install and set up Chronograf](/enterprise_influxdb/v1/introduction/installation/chrono_install) for cluster management and visualization.
4. Configure your load balancer to send client traffic to data nodes. For more information, see [Data node installation](/enterprise_influxdb/v1/introduction/installation/data_node_installation/).
5. [Monitor your cluster](/enterprise_influxdb/v1/administration/monitor/) for performance and reliability.
6. [Write data with the InfluxDB API](/enterprise_influxdb/v1/guides/write_data/).
7. [Query data with the InfluxDB API](/enterprise_influxdb/v1/guides/query_data/).
