
Upgrade your {{% product-name %}} version.

- [Before you upgrade](#before-you-upgrade)
- [Upgrade an InfluxDB 3 instance](#upgrade-an-influxdb-3-instance)
{{% show-in "enterprise" %}}
- [Upgrade a multi-node cluster](#upgrade-a-multi-node-cluster)
  - [Multi-node upgrade procedure](#multi-node-upgrade-procedure)
  - [Rolling upgrade constraints](#rolling-upgrade-constraints)
  - [Troubleshooting cluster upgrades](#troubleshooting-cluster-upgrades)
{{% /show-in %}}

## Before you upgrade

{{% show-in "core" %}}
Before upgrading your {{% product-name %}} instance, review the [release notes](/influxdb3/version/release-notes/) for compatibility requirements and then plan your upgrade strategy.
{{% /show-in %}}
{{% show-in "enterprise" %}}
Before upgrading your {{% product-name %}} cluster, review the [release notes](/influxdb3/version/release-notes/) for compatibility requirements and then plan your upgrade strategy.
{{% /show-in %}}

> [!Important]
> #### Upgrading to InfluxDB 3.10 is a one-way migration
>
> The first time you start InfluxDB 3.10, it automatically upgrades the on-disk
> catalog format from v2 to v3. After migration, 3.9.x and older
> binaries are unable to read the new catalog, and fail to start on the same
> cluster data.
>
> Before upgrading, back up `{prefix}/catalogs/` and `{prefix}/_catalog_checkpoint`.
> Restoring these objects is the only way to roll back to 3.9.x.
>
> {{% show-in "enterprise" %}}If your cluster uses the upgraded storage engine (the default for new clusters, or after running the storage engine upgrade with `--upgrade-pacha-tree`), data written in the new `.pt` file format is also unreadable by 3.9.x.{{% /show-in %}}

### Verify your current version

Before upgrading, verify the {{% product-name %}} version running on each node.

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#)
[Docker](#)
{{% /tabs %}}
{{% tab-content %}}
```bash
influxdb3 --version
```
{{% /tab-content %}}
{{% tab-content %}}
```bash { placeholders="CONTAINER_NAME" }
docker exec CONTAINER_NAME influxdb3 --version
```

Replace the following:

- {{% code-placeholder-key %}}`CONTAINER_NAME`{{% /code-placeholder-key %}}: The name of your {{% product-name %}} container

{{% /tab-content %}}
{{< /tabs-wrapper >}}

The command returns version information similar to the following:

<!--pytest-codeblocks:expected-output-->

```
influxdb3 {{% latest-patch %}}
```

> [!Tip]
> ### Verify your InfluxDB version
> 
> Before and after upgrading, verify the {{% product-name %}} version running on your instance.

## Upgrade an InfluxDB 3 instance

{{< tabs-wrapper >}}
{{% tabs %}}
[Install script](#)
[systemctl](#)
[Docker](#)
[Docker Compose](#)
[Windows](#)
{{% /tabs %}}
{{% tab-content %}}
```bash
curl -O https://www.influxdata.com/d/install_influxdb3.sh \
&& sh install_influxdb3.sh {{< product-key >}}
```
{{% /tab-content %}}
{{% tab-content %}}
```bash
# 1. Download the new version
curl -L https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}_linux_amd64.tar.gz \
  -o influxdb3-{{< product-key >}}.tar.gz

# 2. Extract the archive
tar xvzf influxdb3-{{< product-key >}}.tar.gz

# 3. Stop the service
sudo systemctl stop influxdb3

# 4. Install the new binary
sudo cp influxdb3 /usr/local/bin/

# 5. Start the service
sudo systemctl start influxdb3
```
{{% /tab-content %}}
{{% tab-content %}}
```bash { placeholders="CONTAINER_NAME" }
docker stop CONTAINER_NAME
docker pull influxdb:{{< product-key >}}
docker start CONTAINER_NAME
```

Replace the following:

- {{% code-placeholder-key %}}`CONTAINER_NAME`{{% /code-placeholder-key %}}: The name of your {{% product-name %}} container

{{% /tab-content %}}
{{% tab-content %}}
```bash
docker compose down
docker compose pull
docker compose up -d
```
{{% /tab-content %}}
{{% tab-content %}}
```powershell
# Download the latest Windows binary
Invoke-WebRequest `
  -Uri "https://dl.influxdata.com/influxdb/releases/influxdb3-{{< product-key >}}-{{< latest-patch >}}-windows_amd64.zip" `
  -OutFile "influxdb3-{{< product-key >}}.zip"

# Extract the binary
Expand-Archive -Path influxdb3-{{< product-key >}}.zip -DestinationPath . -Force

# Stop the service, replace the binary, and start the service
Stop-Service influxdb3
Copy-Item -Path "influxdb3.exe" -Destination "C:\Program Files\InfluxData\influxdb3\" -Force
Start-Service influxdb3
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{% show-in "enterprise" %}}

## Upgrade a multi-node cluster

Upgrade {{% product-name %}} instances to newer versions using rolling upgrades to minimize downtime.
When upgrading multi-node clusters, you need to understand catalog version constraints and the recommended upgrade order for different node modes.

- [Catalog version compatibility](#catalog-version-compatibility)
- [Multi-node upgrade procedure](#multi-node-upgrade-procedure)
- [Rolling upgrade constraints](#rolling-upgrade-constraints)
- [Troubleshooting cluster upgrades](#troubleshooting-cluster-upgrades)

### Catalog version compatibility

{{% product-name %}} uses a catalog to track metadata about tables, tags, and fields.
Some versions introduce catalog version updates that affect how nodes can interoperate during rolling upgrades.

> [!Important]
> #### Important version transitions
> 
> - **3.4.x**: Introduced a catalog version update that requires all nodes to upgrade before catalog modifications can resume.
> - **3.2.x to 3.5.x**: Nodes running 3.2.1 can temporarily coexist with nodes running 3.5.0, but catalog modifications are blocked until all nodes complete the upgrade.

During a rolling upgrade across a catalog version boundary, nodes running older versions cannot modify the catalog.
This affects writes that add new tables, tags, or fields, but allows writes to existing tables, tags, and fields.



### Multi-node upgrade procedure

Follow these steps to upgrade your {{% product-name %}} deployment with minimal downtime.

#### Recommended node upgrade order

The order in which you upgrade nodes affects the availability of catalog modifications during the upgrade.
Different node modes have different impacts on catalog updates:

- **Ingest nodes**: Primarily update the catalog when accepting writes that add new tables, tags, or fields via line protocol.
- **Query nodes**: Can accept API requests that update the catalog (for example, `influxdb3 create table`), but less frequently than ingest nodes.
- **Compactor nodes**: Rarely modify the catalog during normal operation.
- **Process nodes**: Process data without modifying the catalog structure.

**Recommended upgrade order:**

1. **Ingest nodes**: Upgrade ingest nodes first to restore catalog modification capability as quickly as possible.
   If you have multiple ingest nodes and can route traffic while one is down, upgrade them sequentially.
2. **Query nodes**: Upgrade query nodes after upgrading all ingest nodes.
3. **Compactor nodes**: Upgrade compactor nodes last, as they have minimal impact on catalog modifications.
4. **Process nodes**: Can be upgraded at any time, as they don't modify the catalog.

#### Perform a rolling upgrade

Follow these steps to upgrade each node in your deployment:

{{< tabs-wrapper >}}
{{% tabs %}}
[systemctl](#)
[Docker](#)
[Docker Compose](#)
[Helm](#)
[Ansible](#)
{{% /tabs %}}
{{% tab-content %}}

```bash
# 1. Stop the service
sudo systemctl stop influxdb3

# 2. Install the new version
# Follow the installation instructions for your platform:
# https://docs.influxdata.com/influxdb3/enterprise/install/

# 3. Start the service
sudo systemctl start influxdb3

# 4. Verify the version
influxdb3 --version

# 5. Check the node's health
influxdb3 query \
  --database _internal \
  --token ADMIN_TOKEN \
  "SELECT * FROM system.queries LIMIT 5"
```

Replace the following:

- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: An admin token

{{% /tab-content %}}
{{% tab-content %}}

```bash { placeholders="CONTAINER_NAME|NODE_ID|CLUSTER_ID|OBJECT_STORE_TYPE|ADMIN_TOKEN" }
# 1. Stop the container
docker stop CONTAINER_NAME

# 2. Pull the latest image
docker pull influxdb:enterprise

# 3. Start the container with the new image
# IMPORTANT: Adjust the docker run command to match your existing
# container configuration, including environment variables, volume mounts,
# object store settings, and network settings.
docker run -d \
  --name CONTAINER_NAME \
  -p 8181:8181 \
  -e INFLUXDB3_LICENSE_EMAIL=your-email@example.com \
  -v ~/.influxdb3/data:/var/lib/influxdb3/data \
  influxdb:enterprise \
  influxdb3 serve \
  --node-id NODE_ID \
  --cluster-id CLUSTER_ID \
  --object-store OBJECT_STORE_TYPE \
  --data-dir /var/lib/influxdb3/data

# 4. Verify the version
docker exec CONTAINER_NAME influxdb3 --version

# 5. Check the node's health
docker exec CONTAINER_NAME influxdb3 query \
  --database _internal \
  --token ADMIN_TOKEN \
  "SELECT * FROM system.queries LIMIT 5"
```

Replace the following:

- {{% code-placeholder-key %}}`CONTAINER_NAME`{{% /code-placeholder-key %}}: The name of your {{% product-name %}} container
- {{% code-placeholder-key %}}`NODE_ID`{{% /code-placeholder-key %}}: The node identifier for this instance
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}: The cluster identifier for your deployment
- {{% code-placeholder-key %}}`OBJECT_STORE_TYPE`{{% /code-placeholder-key %}}: The object store type (for example, `file`, `s3`, `azure`, or `google`)
- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: An admin token

> [!Note]
> #### Use the influxdb:enterprise image tag
>
> The `influxdb:enterprise` tag always points to the latest InfluxDB 3 Enterprise release.
> Use `docker pull influxdb:enterprise` to pull the latest version, or specify a version tag directly (for example, `influxdb:{{< latest-patch >}}-enterprise`) to upgrade to a specific version.

> [!Important]
> If you use a cloud object store (S3, Azure, or Google Cloud), include the appropriate credentials and bucket configuration in the `docker run` command.

{{% /tab-content %}}
{{% tab-content %}}

```bash { placeholders="ADMIN_TOKEN" }
# 1. Stop the services
docker compose down

# 2. Update the image in your compose.yaml file
# Change the image version to: influxdb:enterprise

# 3. Start the services with the new image
docker compose up -d

# 4. Verify the version
docker compose exec influxdb3 influxdb3 --version

# 5. Check the node's health
docker compose exec influxdb3 influxdb3 query \
  --database _internal \
  --token ADMIN_TOKEN \
  "SELECT * FROM system.queries LIMIT 5"
```

Replace the following:

- {{% code-placeholder-key %}}`ADMIN_TOKEN`{{% /code-placeholder-key %}}: An admin token

> [!Note]
> #### Use the influxdb:enterprise image tag
>
> The `influxdb:enterprise` tag always points to the latest InfluxDB 3 Enterprise release.
> Update the `image:` field in your `compose.yaml` to `influxdb:enterprise` to pull the latest version, or specify a version tag directly (for example, `influxdb:{{< latest-patch >}}-enterprise`) to upgrade to a specific version.
{{% /tab-content %}}
{{% tab-content %}}

The [{{% product-name %}} Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-enterprise)
runs a separate StatefulSet for each node mode, but the image tag
(`image.tag`) is a single chart-wide value.
A plain `helm upgrade` therefore rolls _every_ node mode at once, and Kubernetes
doesn't order rollouts across StatefulSets—so the upgrade doesn't follow the
[recommended node upgrade order](#recommended-node-upgrade-order) on its own.

To control the order, freeze the modes you aren't upgrading yet with the
`updateStrategy.rollingUpdate.partition` field, then release them one mode at a
time.
Setting `partition` to a StatefulSet's replica count holds every pod in that
StatefulSet at its current version.

```bash { placeholders="RELEASE_NAME|NAMESPACE|VERSION" }
# 1. Freeze the modes you upgrade later (partition >= replica count),
#    then apply the new image tag. Only ingesters roll.
helm upgrade RELEASE_NAME influxdata/influxdb3-enterprise \
  --namespace NAMESPACE \
  --reuse-values \
  --set image.tag=VERSION-enterprise \
  --set querier.updateStrategy.rollingUpdate.partition=99 \
  --set compactor.updateStrategy.rollingUpdate.partition=99 \
  --set processingEngine.updateStrategy.rollingUpdate.partition=99

# 2. Wait for the ingester pods to roll and become ready
kubectl rollout status --namespace NAMESPACE \
  "$(kubectl get statefulset --namespace NAMESPACE \
    --selector app.kubernetes.io/component=ingester --output name)"

# 3. Release queriers, then compactor, then the processing engine
helm upgrade RELEASE_NAME influxdata/influxdb3-enterprise \
  --namespace NAMESPACE --reuse-values \
  --set querier.updateStrategy.rollingUpdate.partition=0
kubectl rollout status --namespace NAMESPACE \
  "$(kubectl get statefulset --namespace NAMESPACE \
    --selector app.kubernetes.io/component=querier --output name)"

helm upgrade RELEASE_NAME influxdata/influxdb3-enterprise \
  --namespace NAMESPACE --reuse-values \
  --set compactor.updateStrategy.rollingUpdate.partition=0 \
  --set processingEngine.updateStrategy.rollingUpdate.partition=0

# 4. Verify every node re-registered and reports running
influxdb3 show nodes
```

Replace the following:

- {{% code-placeholder-key %}}`RELEASE_NAME`{{% /code-placeholder-key %}}: Your Helm release name
- {{% code-placeholder-key %}}`NAMESPACE`{{% /code-placeholder-key %}}: The namespace of your release
- {{% code-placeholder-key %}}`VERSION`{{% /code-placeholder-key %}}: The target version (for example, `{{< latest-patch >}}`)

> [!Important]
> #### Raise the termination grace period before upgrading
>
> The chart doesn't set `terminationGracePeriodSeconds`, so pods inherit the
> Kubernetes default of 30 seconds.
> If a node is still flushing its write-ahead log when Kubernetes sends
> `SIGKILL`, it stops ungracefully and has to replay its WAL on restart.
> Raise the grace period above your observed shutdown time before you roll a
> cluster—see
> [Deploy with an orchestrator](/influxdb3/version/admin/node-lifecycle/#kubernetes-and-helm).

> [!Warning]
> #### A rollout is a restart, not a removal
>
> Each pod keeps its StatefulSet-ordinal name, so every node re-registers under
> its existing node ID.
> Don't run
> [`influxdb3 remove node`](/influxdb3/version/reference/cli/influxdb3/remove/node/)
> as part of an upgrade—removal permanently deletes the node's catalog entry and
> object-store files.
> See [Restart compared to removal](/influxdb3/version/admin/node-lifecycle/#restart-compared-to-removal).

> [!Caution]
> #### helm rollback doesn't undo a catalog migration
>
> `helm rollback` reverts the image tag, but it can't revert changes the newer
> version already made to your cluster data.
> After a node starts {{% product-name %}} 3.10 or later, the on-disk catalog is
> migrated to v3 and older binaries fail to start against it—so rolling the
> release back leaves pods crash-looping on a catalog they can't read.
> Restoring the catalog objects you backed up is the only way back.
> See [Upgrading to InfluxDB 3.10 is a one-way migration](#upgrading-to-influxdb-310-is-a-one-way-migration).

{{% /tab-content %}}
{{% tab-content %}}

Drive the upgrade one node at a time with `serial: 1`, and order your plays by
node mode to match the
[recommended node upgrade order](#recommended-node-upgrade-order).

```yaml
# Upgrade one host at a time, ingest nodes first.
- hosts: influxdb3_ingest
  serial: 1
  vars:
    # Pin the target version so every host lands on the same build.
    influxdb3_version: "{{< latest-patch >}}"
  tasks:
    - name: Stop influxdb3 gracefully
      ansible.builtin.systemd_service:
        name: influxdb3
        state: stopped

    # Replace this task with the install method you use--for example, a
    # package from your own repository or the downloaded release archive.
    # See https://docs.influxdata.com/influxdb3/enterprise/install/
    - name: Install influxdb3 {{ influxdb3_version }}
      ansible.builtin.include_role:
        name: influxdb3_install

    - name: Start influxdb3
      ansible.builtin.systemd_service:
        name: influxdb3
        state: started

    - name: Wait for the node to report healthy
      ansible.builtin.uri:
        url: "http://{{ inventory_hostname }}:8181/health"
        status_code: 200
      register: health
      until: health.status == 200
      retries: 30
      delay: 10

# Repeat for influxdb3_query, then influxdb3_compact, then influxdb3_process.
```

Because `systemd` escalates to `SIGKILL` after `TimeoutStopSec`, confirm your
unit file allows enough time for the final WAL flush before you roll a cluster:

```ini
[Service]
KillSignal=SIGTERM
TimeoutStopSec=300
```

> [!Important]
> #### Restart in place—don't remove nodes
>
> Each host restarts with the same
> [`--node-id`](/influxdb3/version/reference/config-options/#node-id), so it
> re-registers as the same node.
> Never add
> [`influxdb3 remove node`](/influxdb3/version/reference/cli/influxdb3/remove/node/)
> to an upgrade playbook—see
> [Restart compared to removal](/influxdb3/version/admin/node-lifecycle/#restart-compared-to-removal).

{{% /tab-content %}}
{{< /tabs-wrapper >}}

**Repeat these steps** for each remaining node in the recommended order.

### Rolling upgrade constraints

Understand the constraints that apply during rolling upgrades to avoid unexpected write failures.

#### Writes during catalog version transitions

When upgrading from v3.3.x (or earlier) to v3.4.x, nodes running older versions cannot modify the catalog during the rolling upgrade.

**Behavior by write type:**

- **Writes to existing measurements, tags, and fields**: Succeed on all nodes, regardless of version.
- **Writes that add new measurements, tags, or fields**: Fail on nodes running older versions until those nodes are upgraded.

For example, if you're upgrading from 3.2.1 to 3.5.0:

- An ingest node running 3.2.1 can write data to existing measurements.
- An ingest node running 3.2.1 cannot write data that adds new measurements, tags, or fields.
- After upgrading the ingest node to 3.5.0, it can write data that adds new measurements, tags, or fields.

When a node running an older version receives a write that attempts to add a new
measurement, the write fails with an error similar to:

<!--pytest-codeblocks:expected-output-->

```
Error: Catalog modification failed: node is running an older version
```

### Troubleshooting cluster upgrades

#### Writes fail during upgrade

If writes fail during a rolling upgrade, verify that you're not attempting to add new measurements, tags, or fields to nodes running older versions.

1. **Check the write payload** to determine if it adds new measurements, tags, or fields
2. **Verify the node version** that received the write
3. **Route writes to upgraded nodes** or wait until all nodes complete the upgrade before adding new measurements, tags, or fields

#### Upgrade order issues

If you upgrade nodes out of the [recommended order](#recommended-node-upgrade-order), you may experience longer periods where catalog modifications are blocked.

#### Nodes upgrade out of order in Helm deployments

The {{% product-name %}} Helm chart uses a single chart-wide `image.tag`, so a
plain `helm upgrade` rolls every node mode at once instead of following the
[recommended node upgrade order](#recommended-node-upgrade-order).
Use `updateStrategy.rollingUpdate.partition` to release one mode at a time, as
shown in the **Helm** tab of
[Perform a rolling upgrade](#perform-a-rolling-upgrade).

#### Nodes don't return to running after a rollout

A node that was killed before it finished flushing its write-ahead log stops
ungracefully and replays its WAL on restart, which can extend startup.
In Kubernetes, this usually means `terminationGracePeriodSeconds` (default 30)
is shorter than the node's shutdown time; with `systemd`, it usually means
`TimeoutStopSec` is too low.
See [Deploy with an orchestrator](/influxdb3/version/admin/node-lifecycle/#deploy-with-an-orchestrator).

#### Extra nodes appear in the catalog after an upgrade

Each restart registered a new node ID instead of reclaiming the existing one.
Verify that your deployment assigns a stable
[`--node-id`](/influxdb3/version/reference/config-options/#node-id)—a
Kubernetes Deployment generates a new pod name on every rollout, so use a
StatefulSet instead.
See [Node lifecycle](/influxdb3/version/admin/node-lifecycle/#kubernetes-and-helm).

#### Version compatibility problems

If nodes fail to communicate after an upgrade, verify that all nodes are running compatible versions.

1. **Connect to each node** and [verify the version](#verify-your-current-version)
2. Review the [release notes](/influxdb3/enterprise/release-notes/) for your target version to identify any breaking changes or compatibility requirements.

#### Catalog version constraints

Different version transitions may have different catalog version constraints.
The v3.3.x → v3.4.x transition has specific constraints, but other version transitions may differ.

**Before upgrading**, review the [release notes](/influxdb3/enterprise/release-notes/) for your target version to understand:

- Whether the upgrade crosses a catalog version boundary
- How long catalog modifications may be blocked during the upgrade
- Any special upgrade procedures or constraints

{{% /show-in %}}
