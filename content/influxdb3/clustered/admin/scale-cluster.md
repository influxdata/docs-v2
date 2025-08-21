---
title: Scale your InfluxDB cluster
description: >
  InfluxDB Clustered lets you scale individual components of your cluster both
  vertically and horizontally to match your specific workload.
menu:
  influxdb3_clustered:
    parent: Administer InfluxDB Clustered
    name: Scale your cluster
weight: 207
influxdb3/clustered/tags: [scale, performance, Kubernetes]
related:
  - /influxdb3/clustered/reference/internals/storage-engine/
  - /influxdb3/clustered/write-data/best-practices/data-lifecycle/
  - /influxdb3/clustered/query-data/troubleshoot-and-optimize/optimize-queries/
  - https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits, Kubernetes resource requests and limits
---

InfluxDB Clustered lets you scale individual components of your cluster both
vertically and horizontally to match your specific workload.
Use the `AppInstance` resource defined in your `influxdb.yml` to manage
resources available to each component.

- [Scaling strategies](#scaling-strategies)
  - [Vertical scaling](#vertical-scaling)
  - [Horizontal scaling](#horizontal-scaling)
- [Scale your cluster as a whole](#scale-your-cluster-as-a-whole)
- [Scale components in your cluster](#scale-components-in-your-cluster)
  - [Horizontally scale a component](#horizontally-scale-a-component)
  - [Vertically scale a component](#vertically-scale-a-component)
  - [Apply your changes](#apply-your-changes)
- [Recommended scaling strategies per component](#recommended-scaling-strategies-per-component)

## Scaling strategies

The following scaling strategies can be applied to components in your InfluxDB
cluster.

### Vertical scaling

Vertical scaling (also known as "scaling up") involves increasing the resources
(such as RAM or CPU) available to a process or system.
Vertical scaling is typically used to handle resource-intensive tasks that
require more processing power.

{{< html-diagram/scaling-strategy "vertical" >}}

### Horizontal scaling

Horizontal scaling (also known as "scaling out") involves increasing the number of
nodes or processes available to perform a given task.
Horizontal scaling is typically used to increase the amount of workload or
throughput a system can manage, but also provides additional redundancy and failover.

{{< html-diagram/scaling-strategy "horizontal" >}}

## Scale your cluster as a whole

Scaling your entire InfluxDB Cluster is done by scaling your Kubernetes cluster
and is managed outside of InfluxDB. The process of scaling your entire Kubernetes
cluster depends on your underlying Kubernetes provider. You can also use 
[Kubernetes autoscaling](https://kubernetes.io/docs/concepts/cluster-administration/cluster-autoscaling/)
to automatically scale your cluster as needed.

## Scale components in your cluster

The following components of your InfluxDB cluster are scaled by modifying
properties in your `AppInstance` resource:

- Ingester
- Querier
- Compactor
- Router
- Garbage collector
- Catalog service

> [!Note]
> #### Scale your Catalog and Object store
> 
> Your InfluxDB [Catalog](/influxdb3/clustered/reference/internals/storage-engine/#catalog)
> and [Object store](/influxdb3/clustered/reference/internals/storage-engine/#object-store)
> are managed outside of your `AppInstance` resource. Scaling mechanisms for these
> components depend on the technology and underlying provider used for each.

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[AppInstance](#)
[Helm](#)
{{% /tabs %}}

{{% tab-content %}}

<!----------------------------- BEGIN APPINSTANCE ----------------------------->

Use the `spec.package.spec.resources` property in your `AppInstance` resource
defined in your `influxdb.yml` to define system resource minimums and limits
for each pod and the number of replicas per component.
`requests` are the minimum that the Kubernetes scheduler should reserve for a pod.
`limits` are the maximum that a pod should be allowed to use.

Your `AppInstance` resource can include the following properties to define
resource minimums and limits per pod and replicas per component:

- `spec.package.spec.resources`
  - `ingester`
    - `requests`
      - `cpu`: Minimum CPU resource units to assign to ingesters
      - `memory`: Minimum memory resource units to assign to ingesters
      - `replicas`: Number of ingester replicas to provision
    - `limits`
      - `cpu`: Maximum CPU resource units to assign to ingesters
      - `memory`: Maximum memory resource units to assign to ingesters
  - `compactor`
    - `requests`
      - `cpu`: Minimum CPU resource units to assign to compactors
      - `memory`: Minimum memory resource units to assign to compactors
      - `replicas`: Number of compactor replicas to provision
    - `limits`
      - `cpu`: Maximum CPU resource units to assign to compactors
      - `memory`: Maximum memory resource units to assign to compactors
  - `querier`
    - `requests`
      - `cpu`: Minimum CPU resource units to assign to queriers
      - `memory`: Minimum memory resource units to assign to queriers
      - `replicas`: Number of querier replicas to provision
    - `limits`
      - `cpu`: Maximum CPU resource units to assign to queriers
      - `memory`: Maximum memory resource units to assign to queriers
  - `router`
    - `requests`
      - `cpu`: Minimum CPU resource units to assign to routers
      - `memory`: Minimum memory resource units to assign to routers
      - `replicas`: Number of router replicas to provision
    - `limits`
      - `cpu`: Maximum CPU Resource units to assign to routers
      - `memory`: Maximum memory resource units to assign to routers
  - `garbage-collector`
    - `requests`
      - `cpu`: Minimum CPU resource units to assign to the garbage collector
      - `memory`: Minimum memory resource units to assign to the garbage collector
    - `limits`
      - `cpu`: Maximum CPU Resource units to assign to the garbage collector
      - `memory`: Maximum memory resource units to assign to the garbage collector

{{< expand-wrapper >}}
{{% expand "View example `AppInstance` with resource requests and limits" %}}

{{% code-placeholders "(INGESTER|COMPACTOR|QUERIER|ROUTER|GC)_(CPU_(MAX|MIN)|MEMORY_(MAX|MIN)|REPLICAS)" %}}

```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      # The following settings tune the various pods for their cpu/memory/replicas
      # based on workload needs. Only uncomment the specific resources you want
      # to change. Anything left commented will use the package default.
      resources:
        ingester:
          requests:
            cpu: INGESTER_CPU_MIN
            memory: INGESTER_MEMORY_MIN
            replicas: INGESTER_REPLICAS # Default is 3
          limits:
            cpu: INGESTER_CPU_MAX
            memory: INGESTER_MEMORY_MAX
        compactor:
          requests:
            cpu: COMPACTOR_CPU_MIN
            memory: COMPACTOR_MEMORY_MIN
            replicas: COMPACTOR_REPLICAS # Default is 1
          limits:
            cpu: COMPACTOR_CPU_MAX
            memory: COMPACTOR_MEMORY_MAX
        querier:
          requests:
            cpu: QUERIER_CPU_MIN
            memory: QUERIER_MEMORY_MIN
            replicas: QUERIER_REPLICAS # Default is 1          
          limits:
            cpu: QUERIER_CPU_MAX
            memory: QUERIER_MEMORY_MAX
        router:
          requests:
            cpu: ROUTER_CPU_MIN
            memory: ROUTER_MEMORY_MIN
            replicas: ROUTER_REPLICAS # Default is 1
          limits:
            cpu: ROUTER_CPU_MAX
            memory: ROUTER_MEMORY_MAX
        garbage-collector:
          requests:
            cpu: GC_CPU_MIN
            memory: GC_MEMORY_MIN
          limits:
            cpu: GC_CPU_MAX
            memory: GC_MEMORY_MAX
```

{{% /code-placeholders %}}

{{% /expand %}}
{{< /expand-wrapper >}}

<!------------------------------ END APPINSTANCE ------------------------------>

{{% /tab-content %}}
{{% tab-content %}}

<!--------------------------------- BEGIN HELM -------------------------------->

Use the `resources` property in your `values.yaml` to define system resource
minimums and limits for each pod and the number of replicas per component.
`requests` are the minimum that the Kubernetes scheduler should reserve for a pod.
`limits` are the maximum that a pod should be allowed to use.

Use the following properties to define resource minimums and limits per pod and
replicas per component:

- `resources`
  - `ingester`
    - `requests`
      - `cpu`: Minimum CPU resource units to assign to ingesters
      - `memory`: Minimum memory resource units to assign to ingesters
      - `replicas`: Number of ingester replicas to provision
    - `limits`
      - `cpu`: Maximum CPU resource units to assign to ingesters
      - `memory`: Maximum memory resource units to assign to ingesters
  - `compactor`
    - `requests`
      - `cpu`: Minimum CPU resource units to assign to compactors
      - `memory`: Minimum memory resource units to assign to compactors
      - `replicas`: Number of compactor replicas to provision
    - `limits`
      - `cpu`: Maximum CPU resource units to assign to compactors
      - `memory`: Maximum memory resource units to assign to compactors
  - `querier`
    - `requests`
      - `cpu`: Minimum CPU resource units to assign to queriers
      - `memory`: Minimum memory resource units to assign to queriers
      - `replicas`: Number of querier replicas to provision
    - `limits`
      - `cpu`: Maximum CPU resource units to assign to queriers
      - `memory`: Maximum memory resource units to assign to queriers
  - `router`
    - `requests`
      - `cpu`: Minimum CPU resource units to assign to routers
      - `memory`: Minimum memory resource units to assign to routers
      - `replicas`: Number of router replicas to provision
    - `limits`
      - `cpu`: Maximum CPU Resource units to assign to routers
      - `memory`: Maximum memory resource units to assign to routers
  - `garbage-collector`
    - `requests`
      - `cpu`: Minimum CPU resource units to assign to the garbage collector
      - `memory`: Minimum memory resource units to assign to the garbage collector
    - `limits`
      - `cpu`: Maximum CPU Resource units to assign to the garbage collector
      - `memory`: Maximum memory resource units to assign to the garbage collector

{{< expand-wrapper >}}
{{% expand "View example `values.yaml` with resource requests and limits" %}}

{{% code-placeholders "(INGESTER|COMPACTOR|QUERIER|ROUTER|GC)_(CPU_(MAX|MIN)|MEMORY_(MAX|MIN)|REPLICAS)" %}}

```yml
# ...
  resources:
    ingester:
      requests:
        cpu: INGESTER_CPU_MIN
        memory: INGESTER_MEMORY_MIN
        replicas: INGESTER_REPLICAS # Default is 3
      limits:
        cpu: INGESTER_CPU_MAX
        memory: INGESTER_MEMORY_MAX
    compactor:
      requests:
        cpu: COMPACTOR_CPU_MIN
        memory: COMPACTOR_MEMORY_MIN
        replicas: COMPACTOR_REPLICAS # Default is 1
      limits:
        cpu: COMPACTOR_CPU_MAX
        memory: COMPACTOR_MEMORY_MAX
    querier:
      requests:
        cpu: QUERIER_CPU_MIN
        memory: QUERIER_MEMORY_MIN
        replicas: QUERIER_REPLICAS # Default is 1          
      limits:
        cpu: QUERIER_CPU_MAX
        memory: QUERIER_MEMORY_MAX
    router:
      requests:
        cpu: ROUTER_CPU_MIN
        memory: ROUTER_MEMORY_MIN
        replicas: ROUTER_REPLICAS # Default is 1
      limits:
        cpu: ROUTER_CPU_MAX
        memory: ROUTER_MEMORY_MAX
    garbage-collector:
      requests:
        cpu: GC_CPU_MIN
        memory: GC_MEMORY_MIN
      limits:
        cpu: GC_CPU_MAX
        memory: GC_MEMORY_MAX
```

{{% /code-placeholders %}}

{{% /expand %}}
{{< /expand-wrapper >}}

<!---------------------------------- END HELM --------------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

> [!Note]
> Applying resource limits to pods is optional, but provides better resource
> isolation and protects against pods using more resources than intended. For
> information, see [Kubernetes resource requests and limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits).

##### Related Kubernetes documentation

- [CPU resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
- [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)

### Horizontally scale a component

To horizontally scale a component in your InfluxDB cluster, increase or decrease
the number of replicas for the component and [apply the change](#apply-your-changes).

> [!Warning]
> #### Only use the AppInstance to scale component replicas
> 
> Only use the `AppInstance` resource to scale component replicas.
> Manually scaling replicas may cause errors.

For example--to horizontally scale your
[Ingester](/influxdb3/clustered/reference/internals/storage-engine/#ingester):

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[AppInstance](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      resources:
        ingester:
          requests:
            # ...
            replicas: 6
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```yaml
# ...
resources:
  ingester:
    requests:
      # ...
      replicas: 6
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Vertically scale a component

To vertically scale a component in your InfluxDB cluster, increase or decrease
the CPU and memory resource units to assign to component pods and
[apply the change](#apply-your-changes).

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[AppInstance](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      resources:
        ingester:
          requests:
            cpu: "500m"
            memory: "512MiB"
            # ...
          limits:
            cpu: "1000m"
            memory: "1024MiB"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```yaml
# ...
resources:
  ingester:
    requests:
      cpu: "500m"
      memory: "512MiB"
      # ...
    limits:
      cpu: "1000m"
      memory: "1024MiB"
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Apply your changes

After modifying the `AppInstance` resource, use `kubectl apply` to apply the
configuration changes to your cluster and scale the updated components.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[AppInstance](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->

```bash
kubectl apply \
  --filename myinfluxdb.yml \
  --namespace influxdb
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->

```bash
helm upgrade \
  influxdata/influxdb3-clustered \
  -f ./values.yml \
  --namespace influxdb
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Recommended scaling strategies per component

- [Router](#router)
- [Ingester](#ingester)
- [Querier](#querier)
- [Compactor](#compactor)
- [Garbage collector](#garbage-collector)
- [Catalog store](#catalog-store)
- [Catalog service](#catalog-service)
- [Object store](#object-store)

### Router

The [Router](/influxdb3/clustered/reference/internals/storage-engine/#router) can be scaled both [vertically](#vertical-scaling) and
[horizontally](#horizontal-scaling).

- **Recommended**: Horizontal scaling increases write throughput and is typically the most
effective scaling strategy for the Router.
- Vertical scaling (specifically increased CPU) improves the Router's ability to
parse incoming line protocol with lower latency.

#### Router latency

Latency of the Router’s write endpoint is directly impacted by:

- Ingester latency--the router calls the Ingester during a client write request
- Catalog latency during schema validation

### Ingester

The [Ingester](/influxdb3/clustered/reference/internals/storage-engine/#ingester) can be scaled both [vertically](#vertical-scaling) and
[horizontally](#horizontal-scaling).

- **Recommended**: Vertical scaling is typically the most effective scaling strategy for the Ingester.
Compared to horizontal scaling, vertical scaling not only increases write throughput but also lessens query, catalog, and compaction overheads as well as Object store costs.
- Horizontal scaling can help distribute write load but comes with additional coordination overhead.

#### Ingester storage volume

Ingesters use an attached storage volume to store the
[Write-Ahead Log (WAL)](/influxdb3/clustered/reference/glossary/#wal-write-ahead-log).
With more storage available, Ingesters can keep bigger WAL buffers, which
improves query performance and reduces pressure on the Compactor.
Storage speed also helps with query performance.

Configure the storage volume attached to Ingester pods in the
`spec.package.spec.ingesterStorage` property of your `AppInstance` resource or,
if using Helm, the `ingesterStorage` property of your `values.yaml`. 

{{< expand-wrapper >}}
{{% expand "View example Ingester storage configuration" %}}

{{% code-placeholders "STORAGE_(CLASS|SIZE)" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[AppInstance](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      # ...
      ingesterStorage:
        # (Optional) Set the storage class. This will differ based on the K8s
        #environment and desired storage characteristics.
        # If not set, the default storage class is used.
        storageClassName: STORAGE_CLASS
        # Set the storage size (minimum 2Gi recommended)
        storage: STORAGE_SIZE
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```yml
# ...
ingesterStorage:
  # (Optional) Set the storage class. This will differ based on the K8s
  #environment and desired storage characteristics.
  # If not set, the default storage class is used.
  storageClassName: STORAGE_CLASS
  # Set the storage size (minimum 2Gi recommended)
  storage: STORAGE_SIZE
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

{{% /expand %}}
{{< /expand-wrapper >}}

### Querier

The [Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier) can be scaled both [vertically](#vertical-scaling) and
[horizontally](#horizontal-scaling).

- **Recommended**: [Vertical scaling](#vertical-scaling) improves the Querier's ability to process concurrent or computationally 
intensive queries, and increases the effective cache capacity.
- Horizontal scaling increases query throughput to handle more concurrent queries. 
Consider horizontal scaling if vertical scaling doesn't adequately address
concurrency demands or reaches the hardware limits of your underlying nodes.

### Compactor

- **Recommended**: Maintain **1 Compactor pod** and use [vertical scaling](#vertical-scaling) for the Compactor.
Scale CPU and memory resources together, as compactor concurrency settings scale based on memory, not CPU count.
- Because compaction is a compute-heavy process, horizontal scaling increases compaction throughput, but not as
efficiently as vertical scaling.

> [!Important]
> When scaling the Compactor, scale CPU and memory resources together.

### Garbage collector

The [Garbage collector](/influxdb3/clustered/reference/internals/storage-engine/#garbage-collector) is a lightweight process that typically doesn't require
significant system resources. 

- Don't horizontally scale the Garbage collector; it isn't designed for distributed load.
- Consider [vertical scaling](#vertical-scaling) only if you observe consistently high CPU usage or if the container
regularly runs out of memory.

### Catalog store

The [Catalog store](/influxdb3/clustered/reference/internals/storage-engine/#catalog-store) is a PostgreSQL-compatible database that stores critical metadata for your InfluxDB cluster.
An underprovisioned Catalog store can cause write outages and system-wide performance issues.

- Scaling strategies depend on your specific PostgreSQL implementation
- All PostgreSQL implementations support [vertical scaling](#vertical-scaling)
- Most implementations support [horizontal scaling](#horizontal-scaling) for improved redundancy and failover


### Catalog service

The [Catalog service](/influxdb3/clustered/reference/internals/storage-engine/#catalog-service) (iox-shared-catalog statefulset) caches 
and manages access to the Catalog store.

- **Recommended**: Maintain **exactly 3 replicas** of the Catalog service for optimal redundancy. Additional replicas are discouraged.
- If performance improvements are needed, use [vertical scaling](#vertical-scaling).

> [!Note]
> #### Managing Catalog components
> 
> The [Catalog service](/influxdb3/clustered/reference/internals/storage-engine/#catalog-service) is managed through the
> `AppInstance` resource, while the [Catalog store](/influxdb3/clustered/reference/internals/storage-engine/#catalog-store) 
> is managed separately according to your PostgreSQL implementation.

### Object store

The [Object store](/influxdb3/clustered/reference/internals/storage-engine/#object-store)
contains time series data in Parquet format.

Scaling strategies depend on the underlying object storage services used.
Most services support
[horizontal scaling](#horizontal-scaling) for redundancy, failover, and
increased capacity.
