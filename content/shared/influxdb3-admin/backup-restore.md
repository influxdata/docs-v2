<!-- Allow leading shortcode -->
{{% product-name %}} persists all data and metadata to object storage.
Back up your data by copying object storage files in a specific order to ensure consistency and reliability.

> [!Warning]
> Currently, {{% product-name %}} does not include built-in backup and restore tools.
> Because copying files during periods of activity is a transient process, the manual backup process _cannot guarantee 100% reliability_.
> Follow the recommended procedures and copy order to minimize risk of creating inconsistent backups.

## Supported object storage

InfluxDB 3 supports the following object storage backends for data persistence:

- **File system** (local directory)
- **AWS S3** and S3-compatible storage ([MinIO](/influxdb3/version/object-storage/minio/))
- **Azure Blob Storage**
- **Google Cloud Storage**
 
> [!Note]
> Backup and restore procedures don't apply to memory-based [object stores](/influxdb3/version/reference/config-options/#object-store).

## File structure

{{% show-in "core" %}}

| Location                                  | Description                                                                                   |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| `<node_id>/`                              | Root directory for all node state                                                             |
| `<node_id>/_catalog_checkpoint`           | Catalog state checkpoint file                                                                 |
| `<node_id>/catalogs/`                     | Catalog log files tracking catalog state changes                                              |
| `<node_id>/wal/`                          | [Write-ahead log files](/influxdb3/version/reference/internals/durability/#write-ahead-log-wal-persistence) containing written data                                                 |
| `<node_id>/snapshots/`                    | Snapshot files summarizing persisted [Parquet files](/influxdb3/version/reference/internals/durability/#parquet-storage)                                            |
| `<node_id>/dbs/<db>/<table>/<date>/`      | [Parquet files](/influxdb3/version/reference/internals/durability/#parquet-storage) organized by [database](/influxdb3/version/admin/databases/), [table](/influxdb3/version/admin/tables/), and time |
| `<node_id>/table-snapshots/<db>/<table>/` | Table snapshot files (regenerated on restart, optional for backup)                            |

{{% /show-in %}}
{{% show-in "enterprise" %}}

| Location                                  | Description                                                                                                                                                                                           |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cluster files**                         |                                                                                                                                                                                                       |
| `<cluster_id>/_catalog_checkpoint`        | Catalog state checkpoint file                                                                                                                                                                         |
| `<cluster_id>/catalogs/`                  | Catalog log files tracking catalog state changes                                                                                                                                                      |
| `<cluster_id>/commercial_license`         | Commercial [license](/influxdb3/version/admin/license/) file (if applicable)                                                                                                                       |
| `<cluster_id>/trial_or_home_license`      | Trial or home [license](/influxdb3/version/admin/license/) file (if applicable)                                                                                                                       |
| `<cluster_id>/enterprise`                 | Enterprise configuration file                                                                                                                                                                         |
| **Node files**                            |                                                                                                                                                                                                       |
| `<node_id>/wal/`                          | [Write-ahead log files](/influxdb3/version/reference/internals/durability/#write-ahead-log-wal-persistence) containing written data                                                                   |
| `<node_id>/snapshots/`                    | Snapshot files                                                                                                                                                                                        |
| `<node_id>/dbs/<db>/<table>/<date>/`      | [Parquet files](/influxdb3/version/reference/internals/durability/#parquet-storage) organized by [database](/influxdb3/version/admin/databases/), [table](/influxdb3/version/admin/tables/), and time |
| `<node_id>/table-snapshots/<db>/<table>/` | Table snapshot files (regenerated on restart, optional for backup)                                                                                                                                    |
| **Compactor node additional files**       |                                                                                                                                                                                                       |
| `<node_id>/cs`                            | Compaction summary files                                                                                                                                                                              |
| `<node_id>/cd`                            | Compaction detail files                                                                                                                                                                               |
| `<node_id>/c`                             | Generation detail and [Parquet files](/influxdb3/version/reference/internals/durability/#parquet-storage)                                                                                             |
{{% /show-in %}}

## Backup process

> [!Important]
> Copy files in the recommended order to reduce risk of creating inconsistent backups. Perform backups during downtime or minimal load periods when possible.

{{% show-in "core" %}}

**Recommended backup order:**
1. Snapshots directory
2. Database (dbs) directory
3. WAL directory
4. Catalogs directory
5. Catalog checkpoint file

{{< tabs-wrapper >}}
{{% tabs %}}
[File system](#)
[S3](#)
{{% /tabs %}}
{{% tab-content %}}
<!-- BEGIN File system backup -->

```bash { placeholders="NODE_ID" }
#!/bin/bash
NODE_ID="NODE_ID"
DATA_DIR="/path/to/data"
BACKUP_DIR="/backup/$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

# Copy in recommended order
cp -r $DATA_DIR/${NODE_ID}/snapshots "$BACKUP_DIR/"
cp -r $DATA_DIR/${NODE_ID}/dbs "$BACKUP_DIR/"
cp -r $DATA_DIR/${NODE_ID}/wal "$BACKUP_DIR/"
cp -r $DATA_DIR/${NODE_ID}/catalogs "$BACKUP_DIR/"
cp $DATA_DIR/${NODE_ID}/_catalog_checkpoint "$BACKUP_DIR/"

echo "Backup completed to $BACKUP_DIR"
```

Replace {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}} with your [node ID](/influxdb3/version/reference/config-options/#node-id).

> [!Note]
> This example works with Docker containers that use volume mounts for data persistence. Adjust the `DATA_DIR` path to match your volume mount configuration.

<!-- END File system backup -->
{{% /tab-content %}}
{{% tab-content %}}
<!-- BEGIN S3 backup -->

```bash { placeholders="NODE_ID|SOURCE_BUCKET|BACKUP_BUCKET" }
#!/bin/bash
NODE_ID="NODE_ID"
SOURCE_BUCKET="SOURCE_BUCKET"
BACKUP_BUCKET="BACKUP_BUCKET"
BACKUP_PREFIX="backup-$(date +%Y%m%d-%H%M%S)"

# Copy in recommended order
aws s3 sync s3://${SOURCE_BUCKET}/${NODE_ID}/snapshots \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${NODE_ID}/snapshots/

aws s3 sync s3://${SOURCE_BUCKET}/${NODE_ID}/dbs \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${NODE_ID}/dbs/

aws s3 sync s3://${SOURCE_BUCKET}/${NODE_ID}/wal \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${NODE_ID}/wal/

aws s3 sync s3://${SOURCE_BUCKET}/${NODE_ID}/catalogs \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${NODE_ID}/catalogs/

aws s3 cp s3://${SOURCE_BUCKET}/${NODE_ID}/_catalog_checkpoint \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${NODE_ID}/

echo "Backup completed to s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}"
```

Replace the following:
- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}: your [node ID](/influxdb3/version/reference/config-options/#node-id)
- {{% code-placeholder-key %}}`SOURCE_BUCKET`{{% /code-placeholder-key %}}: your InfluxDB data bucket
- {{% code-placeholder-key %}}`BACKUP_BUCKET`{{% /code-placeholder-key %}}: your backup destination bucket

<!-- END S3 backup -->
{{% /tab-content %}}
{{< /tabs-wrapper >}}
{{% /show-in %}}

{{% show-in "enterprise" %}}

**Recommended backup order:**
1. Compactor node directories (cs, cd, c)
2. All nodes' snapshots, dbs, wal directories
3. Cluster catalog and checkpoint
4. License files

{{< tabs-wrapper >}}
{{% tabs %}}
[S3](#)
[File system](#)
{{% /tabs %}}
{{% tab-content %}}
<!-- BEGIN S3 backup -->

```bash { placeholders="CLUSTER_ID|COMPACTOR_NODE|NODE1|NODE2|NODE3|SOURCE_BUCKET|BACKUP_BUCKET" }
#!/bin/bash
CLUSTER_ID="CLUSTER_ID"
COMPACTOR_NODE="COMPACTOR_NODE"
DATA_NODES=("NODE1" "NODE2" "NODE3")
SOURCE_BUCKET="SOURCE_BUCKET"
BACKUP_BUCKET="BACKUP_BUCKET"
BACKUP_PREFIX="backup-$(date +%Y%m%d-%H%M%S)"

# 1. Backup compactor node first
echo "Backing up compactor node..."
aws s3 sync s3://${SOURCE_BUCKET}/${COMPACTOR_NODE}/cs \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${COMPACTOR_NODE}/cs/

aws s3 sync s3://${SOURCE_BUCKET}/${COMPACTOR_NODE}/cd \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${COMPACTOR_NODE}/cd/

aws s3 sync s3://${SOURCE_BUCKET}/${COMPACTOR_NODE}/c \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${COMPACTOR_NODE}/c/

# 2. Backup all nodes (including compactor)
ALL_NODES=("${DATA_NODES[@]}" "$COMPACTOR_NODE")
for NODE_ID in "${ALL_NODES[@]}"; do
  echo "Backing up node: ${NODE_ID}"
  aws s3 sync s3://${SOURCE_BUCKET}/${NODE_ID}/snapshots \
    s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${NODE_ID}/snapshots/
  
  aws s3 sync s3://${SOURCE_BUCKET}/${NODE_ID}/dbs \
    s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${NODE_ID}/dbs/
  
  aws s3 sync s3://${SOURCE_BUCKET}/${NODE_ID}/wal \
    s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${NODE_ID}/wal/
done

# 3. Backup cluster catalog
echo "Backing up cluster catalog..."
aws s3 sync s3://${SOURCE_BUCKET}/${CLUSTER_ID}/catalogs \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${CLUSTER_ID}/catalogs/

aws s3 cp s3://${SOURCE_BUCKET}/${CLUSTER_ID}/_catalog_checkpoint \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${CLUSTER_ID}/

aws s3 cp s3://${SOURCE_BUCKET}/${CLUSTER_ID}/enterprise \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${CLUSTER_ID}/

# 4. Backup license files (may not exist)
aws s3 cp s3://${SOURCE_BUCKET}/${CLUSTER_ID}/commercial_license \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${CLUSTER_ID}/ 2>/dev/null || true

aws s3 cp s3://${SOURCE_BUCKET}/${CLUSTER_ID}/trial_or_home_license \
  s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${CLUSTER_ID}/ 2>/dev/null || true

echo "Backup completed to s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}"
```

Replace the following:
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: your [cluster ID](/influxdb3/version/reference/config-options/#cluster-id)
- {{% code-placeholder-key %}}`COMPACTOR_NODE`{{% /code-placeholder-key %}}: your [compactor](/influxdb3/version/get-started/multi-server/#high-availability-with-a-dedicated-compactor) node ID
- {{% code-placeholder-key %}}`NODE1`, `NODE2`, `NODE3`{{% /code-placeholder-key %}}: your data [node IDs](/influxdb3/version/reference/config-options/#node-id)
- {{% code-placeholder-key %}}`SOURCE_BUCKET`{{% /code-placeholder-key %}}: your InfluxDB data bucket
- {{% code-placeholder-key %}}`BACKUP_BUCKET`{{% /code-placeholder-key %}}: your backup destination bucket

<!-- END S3 backup -->
{{% /tab-content %}}
{{% tab-content %}}
<!-- BEGIN File system backup -->

```bash { placeholders="CLUSTER_ID|COMPACTOR_NODE|NODE1|NODE2|NODE3" }
#!/bin/bash
CLUSTER_ID="CLUSTER_ID"
COMPACTOR_NODE="COMPACTOR_NODE"
DATA_NODES=("NODE1" "NODE2" "NODE3")
DATA_DIR="/path/to/data"
BACKUP_DIR="/backup/$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

# 1. Backup compactor node first
echo "Backing up compactor node..."
cp -r $DATA_DIR/${COMPACTOR_NODE}/cs "$BACKUP_DIR/${COMPACTOR_NODE}/"
cp -r $DATA_DIR/${COMPACTOR_NODE}/cd "$BACKUP_DIR/${COMPACTOR_NODE}/"
cp -r $DATA_DIR/${COMPACTOR_NODE}/c "$BACKUP_DIR/${COMPACTOR_NODE}/"

# 2. Backup all nodes
ALL_NODES=("${DATA_NODES[@]}" "$COMPACTOR_NODE")
for NODE_ID in "${ALL_NODES[@]}"; do
  echo "Backing up node: ${NODE_ID}"
  mkdir -p "$BACKUP_DIR/${NODE_ID}"
  cp -r $DATA_DIR/${NODE_ID}/snapshots "$BACKUP_DIR/${NODE_ID}/"
  cp -r $DATA_DIR/${NODE_ID}/dbs "$BACKUP_DIR/${NODE_ID}/"
  cp -r $DATA_DIR/${NODE_ID}/wal "$BACKUP_DIR/${NODE_ID}/"
done

# 3. Backup cluster catalog
echo "Backing up cluster catalog..."
mkdir -p "$BACKUP_DIR/${CLUSTER_ID}"
cp -r $DATA_DIR/${CLUSTER_ID}/catalogs "$BACKUP_DIR/${CLUSTER_ID}/"
cp $DATA_DIR/${CLUSTER_ID}/_catalog_checkpoint "$BACKUP_DIR/${CLUSTER_ID}/"
cp $DATA_DIR/${CLUSTER_ID}/enterprise "$BACKUP_DIR/${CLUSTER_ID}/"

# 4. Backup license files (if they exist)
[ -f "$DATA_DIR/${CLUSTER_ID}/commercial_license" ] && \
  cp $DATA_DIR/${CLUSTER_ID}/commercial_license "$BACKUP_DIR/${CLUSTER_ID}/"
[ -f "$DATA_DIR/${CLUSTER_ID}/trial_or_home_license" ] && \
  cp $DATA_DIR/${CLUSTER_ID}/trial_or_home_license "$BACKUP_DIR/${CLUSTER_ID}/"

echo "Backup completed to $BACKUP_DIR"
```

Replace the following:
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: your [cluster ID](/influxdb3/version/reference/config-options/#cluster-id)
- {{% code-placeholder-key %}}`COMPACTOR_NODE`{{% /code-placeholder-key %}}: your [compactor](/influxdb3/version/get-started/multi-server/#high-availability-with-a-dedicated-compactor) node ID
- {{% code-placeholder-key %}}`NODE1`, `NODE2`, `NODE3`{{% /code-placeholder-key %}}: your data [node IDs](/influxdb3/version/reference/config-options/#node-id)

<!-- END File system backup -->
{{% /tab-content %}}
{{< /tabs-wrapper >}}
{{% /show-in %}}

## Restore process

> [!Warning]
> Restoring overwrites existing data. Always verify you have correct backups before proceeding.

{{% show-in "core" %}}

#### File system restore example

```bash { placeholders="NODE_ID|BACKUP_DATE" }
#!/bin/bash
NODE_ID="NODE_ID"
BACKUP_DIR="/backup/BACKUP_DATE"
DATA_DIR="/path/to/data"

# 1. Stop InfluxDB
systemctl stop influxdb3 || docker stop influxdb3-core

# 2. Optional: Clear existing data for clean restore
rm -rf ${DATA_DIR}/${NODE_ID}/*

# 3. Restore in reverse order of backup
mkdir -p ${DATA_DIR}/${NODE_ID}
cp ${BACKUP_DIR}/_catalog_checkpoint ${DATA_DIR}/${NODE_ID}/
cp -r ${BACKUP_DIR}/catalogs ${DATA_DIR}/${NODE_ID}/
cp -r ${BACKUP_DIR}/wal ${DATA_DIR}/${NODE_ID}/
cp -r ${BACKUP_DIR}/dbs ${DATA_DIR}/${NODE_ID}/
cp -r ${BACKUP_DIR}/snapshots ${DATA_DIR}/${NODE_ID}/

# 4. Set correct permissions (important for Docker)
chown -R influxdb:influxdb ${DATA_DIR}/${NODE_ID}

# 5. Start InfluxDB
systemctl start influxdb3 || docker start influxdb3-core
```

Replace the following:
- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}: your [node ID](/influxdb3/version/reference/config-options/#node-id)
- {{% code-placeholder-key %}}`BACKUP_DATE`{{% /code-placeholder-key %}}: backup directory timestamp (for example, 20240115-143022)

#### S3 restore example

```bash { placeholders="NODE_ID|BACKUP_DATE|BACKUP_BUCKET|TARGET_BUCKET" }
#!/bin/bash
NODE_ID="NODE_ID"
BACKUP_BUCKET="BACKUP_BUCKET"
BACKUP_PREFIX="backup-BACKUP_DATE"
TARGET_BUCKET="TARGET_BUCKET"

# 1. Stop InfluxDB
# Implementation depends on your deployment method

# 2. Optional: Clear existing data for clean restore
aws s3 rm s3://${TARGET_BUCKET}/${NODE_ID} --recursive

# 3. Restore from backup
aws s3 sync s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${NODE_ID}/ \
  s3://${TARGET_BUCKET}/${NODE_ID}/

# 4. Start InfluxDB
# Implementation depends on your deployment method
```

Replace the following:
- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}: your node ID
- {{% code-placeholder-key %}}`BACKUP_DATE`{{% /code-placeholder-key %}}: backup timestamp
- {{% code-placeholder-key %}}`BACKUP_BUCKET`{{% /code-placeholder-key %}}: bucket containing backup
- {{% code-placeholder-key %}}`TARGET_BUCKET`{{% /code-placeholder-key %}}: target bucket for restoration
{{% /show-in %}}

{{% show-in "enterprise" %}}

#### S3 restore example

```bash { placeholders="CLUSTER_ID|COMPACTOR_NODE|NODE1|NODE2|NODE3|BACKUP_DATE|BACKUP_BUCKET|TARGET_BUCKET" }
#!/bin/bash
CLUSTER_ID="CLUSTER_ID"
COMPACTOR_NODE="COMPACTOR_NODE"
DATA_NODES=("NODE1" "NODE2" "NODE3")
BACKUP_BUCKET="BACKUP_BUCKET"
BACKUP_PREFIX="backup-BACKUP_DATE"
TARGET_BUCKET="TARGET_BUCKET"

# 1. Stop all InfluxDB 3 Enterprise nodes
# Implementation depends on your orchestration

# 2. Restore cluster catalog and license first
aws s3 cp s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${CLUSTER_ID}/_catalog_checkpoint \
  s3://${TARGET_BUCKET}/${CLUSTER_ID}/

aws s3 sync s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${CLUSTER_ID}/catalogs \
  s3://${TARGET_BUCKET}/${CLUSTER_ID}/catalogs/

aws s3 cp s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${CLUSTER_ID}/enterprise \
  s3://${TARGET_BUCKET}/${CLUSTER_ID}/

# Restore license files if they exist
aws s3 cp s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${CLUSTER_ID}/commercial_license \
  s3://${TARGET_BUCKET}/${CLUSTER_ID}/ 2>/dev/null || true

aws s3 cp s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${CLUSTER_ID}/trial_or_home_license \
  s3://${TARGET_BUCKET}/${CLUSTER_ID}/ 2>/dev/null || true

# 3. Restore all nodes
ALL_NODES=("${DATA_NODES[@]}" "$COMPACTOR_NODE")
for NODE_ID in "${ALL_NODES[@]}"; do
  echo "Restoring node: ${NODE_ID}"
  aws s3 sync s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/${NODE_ID}/ \
    s3://${TARGET_BUCKET}/${NODE_ID}/
done

# 4. Start InfluxDB Enterprise nodes
# Start in order: data nodes, compactor
```

Replace the following:
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: your [cluster ID](/influxdb3/version/reference/config-options/#cluster-id)
- {{% code-placeholder-key %}}`COMPACTOR_NODE`{{% /code-placeholder-key %}}: your [compactor](/influxdb3/version/get-started/multi-server/#high-availability-with-a-dedicated-compactor) node ID
- {{% code-placeholder-key %}}`NODE1`, `NODE2`, `NODE3`{{% /code-placeholder-key %}}: your data [node IDs](/influxdb3/version/reference/config-options/#node-id)
- {{% code-placeholder-key %}}`BACKUP_DATE`{{% /code-placeholder-key %}}: backup timestamp
- {{% code-placeholder-key %}}`BACKUP_BUCKET`{{% /code-placeholder-key %}}: bucket containing backup
- {{% code-placeholder-key %}}`TARGET_BUCKET`{{% /code-placeholder-key %}}: target bucket for restoration

#### File system restore example

```bash { placeholders="CLUSTER_ID|COMPACTOR_NODE|NODE1|NODE2|NODE3|BACKUP_DATE" }
#!/bin/bash
CLUSTER_ID="CLUSTER_ID"
COMPACTOR_NODE="COMPACTOR_NODE"
DATA_NODES=("NODE1" "NODE2" "NODE3")
BACKUP_DIR="/backup/BACKUP_DATE"
DATA_DIR="/path/to/data"

# 1. Stop all InfluxDB 3 Enterprise nodes
# Implementation depends on your deployment method

# 2. Optional: Clear existing data
ALL_NODES=("${DATA_NODES[@]}" "$COMPACTOR_NODE")
for NODE_ID in "${ALL_NODES[@]}"; do
  rm -rf ${DATA_DIR}/${NODE_ID}/*
done
rm -rf ${DATA_DIR}/${CLUSTER_ID}/*

# 3. Restore cluster catalog and license
mkdir -p ${DATA_DIR}/${CLUSTER_ID}
cp ${BACKUP_DIR}/${CLUSTER_ID}/_catalog_checkpoint ${DATA_DIR}/${CLUSTER_ID}/
cp -r ${BACKUP_DIR}/${CLUSTER_ID}/catalogs ${DATA_DIR}/${CLUSTER_ID}/
cp ${BACKUP_DIR}/${CLUSTER_ID}/enterprise ${DATA_DIR}/${CLUSTER_ID}/

# Restore license files if they exist
[ -f "${BACKUP_DIR}/${CLUSTER_ID}/commercial_license" ] && \
  cp ${BACKUP_DIR}/${CLUSTER_ID}/commercial_license ${DATA_DIR}/${CLUSTER_ID}/
[ -f "${BACKUP_DIR}/${CLUSTER_ID}/trial_or_home_license" ] && \
  cp ${BACKUP_DIR}/${CLUSTER_ID}/trial_or_home_license ${DATA_DIR}/${CLUSTER_ID}/

# 4. Restore all nodes
for NODE_ID in "${ALL_NODES[@]}"; do
  echo "Restoring node: ${NODE_ID}"
  mkdir -p ${DATA_DIR}/${NODE_ID}
  cp -r ${BACKUP_DIR}/${NODE_ID}/* ${DATA_DIR}/${NODE_ID}/
done

# 5. Set correct permissions
# NOTE: Adjust 'influxdb:influxdb' to match your actual deployment user/group configuration.
chown -R influxdb:influxdb ${DATA_DIR}

# 6. Start InfluxDB Enterprise nodes
# Start in order: data nodes, compactor
```

Replace the following:
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: your [cluster ID](/influxdb3/version/reference/config-options/#cluster-id)
- {{% code-placeholder-key %}}`COMPACTOR_NODE`{{% /code-placeholder-key %}}: your [compactor](/influxdb3/version/get-started/multi-server/#high-availability-with-a-dedicated-compactor) node ID
- {{% code-placeholder-key %}}`NODE1`, `NODE2`, `NODE3`{{% /code-placeholder-key %}}: your data [node IDs](/influxdb3/version/reference/config-options/#node-id)
- {{% code-placeholder-key %}}`BACKUP_DATE`{{% /code-placeholder-key %}}: backup directory timestamp
{{% /show-in %}}

## Important considerations

### Recovery expectations

> [!Warning]
> Recovery succeeds to a consistent point in time, which is the **latest snapshot included** in the backup. Data written after that snapshot may not be present if its WAL was deleted after the backup. Any Parquet files without a snapshot reference are ignored.

{{% show-in "enterprise" %}}
### License files

> [!Important]
> License files are tied to:
> - The specific cloud provider (AWS, Azure, GCS)
> - The specific bucket name
> - For file storage: the exact file path
> 
> You cannot restore a license file to a different bucket or path. Contact InfluxData support if you need to migrate to a different bucket.
{{% /show-in %}}

### Docker considerations

When running {{% product-name %}} in containers:
- **Volume consistency**: Use the same volume mounts for backup and restore operations
- **File permissions**: Ensure container user can read restored files (use `chown` if needed)
- **Backup access**: Mount a backup directory to copy files from containers to the host
{{% show-in "enterprise" %}}- **Node coordination**: Stop and start all Enterprise nodes (querier, ingester, compactor) in the correct order{{% /show-in %}}

### Table snapshot files

Files in `<node_id>/table-snapshots/` are intentionally excluded from backup:
- These files are periodically overwritten
- They regenerate automatically on server restart
- Including them doesn't harm but increases backup size unnecessarily

### Timing recommendations

- Perform backups during downtime or minimal load periods
- Copying files while the database is active may create inconsistent backups
- Consider using filesystem or storage snapshots if available
- Compression is optional but recommended for long-term storage
