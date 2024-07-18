---
title: Scale your InfluxDB cluster
description: >
  InfluxDB Clustered lets you scale individual components of your cluster both
  vertically and horizontally to match your specific workload.
menu:
  influxdb_clustered:
    parent: Administer InfluxDB Clustered
    name: Scale your cluster
weight: 207
influxdb/clustered/tags: [scale]
related:
  - /influxdb/clustered/reference/internals/storage-engine/
  - https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits, Kubernetes resource requests and limits
---

InfluxDB Clustered lets you scale individual components of your cluster both
vertically and horizontally to match your specific workload.
Use the `AppInstance` resource defined in your `influxdb.yml` to manage
resources available to each component.

- [Scaling strategies](#scaling-strategies)
  - [Vertical scaling](#vertical-scaling)
  - [Horizontal scaling](#horizontal-scaling)
- [Scale components in your cluster](#scale-components-in-your-cluster)
  - [Horizontally scale a component](#horizontally-scale-a-component)
  - [Vertically scale a component](#vertically-scale-a-component)
  - [Apply your changes](#apply-your-changes)
- [Scale your cluster as a whole](#scale-your-cluster-as-a-whole)
- [Recommended scaling strategies per component](#recommended-scaling-strategies-per-component)
  - [Ingester](#ingester)
  - [Querier](#querier)
  - [Router](#router)
  - [Compactor](#compactor)
  - [Catalog](#catalog)
  - [Object store](#object-store)

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

## Scale components in your cluster

The following components of your InfluxDB cluster are scaled by modifying
properties in your `AppInstance` resource:

- Ingester
- Querier
- Compactor
- Router

{{% note %}}
#### Scale your Catalog and Object store

Your InfluxDB [Catalog](/influxdb/clustered/reference/internals/storage-engine/#catalog)
and [Object store](/influxdb/clustered/reference/internals/storage-engine/#object-store)
are managed outside of your `AppInstance` resource. Scaling mechanisms for these
components depend on the technology and underlying provider used for each.
{{% /note %}}

Use the `spec.package.spec.resources` property in your `AppInstance` resource
defined in your `influxdb.yml` to define system resource minimums and limits
for each pod and the number of replicas per component.
`requests` are the minimum that the Kubernetes scheduler should reserve for a pod.
`limits` are the maximum that a pod should be allowed to use.

Your `AppInstance` resource can included the following properties to define
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

{{< expand-wrapper >}}
{{% expand "View example `AppInstance` with resource requests and limits" %}}

{{% code-placeholders "(INGESTER|COMPACTOR|QUERIER|ROUTER)_(CPU_(MAX|MIN)|MEMORY_(MAX|MIN)|REPLICAS)" %}}

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
```

{{% /code-placeholders %}}

{{% /expand %}}
{{< /expand-wrapper >}}

{{% note %}}
Applying resource limits to pods is optional, but provides better resource
isolation and protects against pods using more resources than intended. For
information, see [Kubernetes resource requests and limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#requests-and-limits).
{{% /note %}}

##### Related Kubernetes documentation

- [CPU resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
- [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)

### Horizontally scale a component

To horizontally scale a component in your InfluxDB cluster, increase or decrease
the number of replicas for the component in the `spec.package.spec.resources`
property in your `AppInstance` resource and [apply the change](#apply-your-changes).

{{% warn %}}
#### Only use the AppInstance to scale component replicas

Only use the `AppInstance` resource to scale component replicas.
Manually scaling replicas may cause errors.
{{% /warn %}}

For example--to horizontally scale your
[Ingester](/influxdb/clustered/reference/internals/storage-engine/#ingester):

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

### Vertically scale a component

To vertically scale a component in your InfluxDB cluster, increase or decrease
the CPU and memory resource units to assign to component pods in the
`spec.package.spec.resources` property in your `AppInstance` resource and
[apply the change](#apply-your-changes).

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

### Apply your changes

After modifying the `AppInstance` resource, use `kubectl apply` to apply the
configuration changes to your cluster and scale the updated components.

```sh
kubectl apply \
  --filename myinfluxdb.yml \
  --namespace influxdb
```

## Scale your cluster as a whole

Scaling your entire InfluxDB Cluster is done by scaling your Kubernetes cluster
and is managed outside of InfluxDB. The process of scaling your entire Kubernetes
cluster depends on your underlying Kubernetes provider. You can also use 
[Kubernetes autoscaling](https://kubernetes.io/docs/concepts/cluster-administration/cluster-autoscaling/)
to automatically scale your cluster as needed.

## Recommended scaling strategies per component

- [Ingester](#ingester)
- [Querier](#querier)
- [Router](#router)
- [Compactor](#compactor)
- [Catalog](#catalog)
- [Object store](#object-store)

### Ingester

The Ingester can be scaled both [vertically](#vertical-scaling) and
[horizontally](#horizontal-scaling).
Vertical scaling increases write throughput and is typically the most effective
scaling strategy for the Ingester.

### Querier

The Querier can be scaled both [vertically](#vertical-scaling) and
[horizontally](#horizontal-scaling).
Horizontal scaling increases query throughput to handle more concurrent queries.
Vertical scaling improves the Querier’s ability to process computationally
intensive queries.

### Router

The Router can be scaled both [vertically](#vertical-scaling) and
[horizontally](#horizontal-scaling).
Horizontal scaling increases request throughput and is typically the most effective
scaling strategy for the Router.

### Compactor

The Compactor can be scaled both [vertically](#vertical-scaling) and
[horizontally](#horizontal-scaling).
Because compaction is a compute-heavy process, vertical scaling (especially
increasing the available CPU) is the most effective scaling strategy for the
Compactor. Horizontal scaling increases compaction throughput, but not as
efficiently as vertical scaling.

### Catalog

Scaling strategies available for the Catalog depend on the PostgreSQL-compatible
database used to run the catalog. All support [vertical scaling](#vertical-scaling).
Most support [horizontal scaling](#horizontal-scaling) for redundancy and failover.

### Object store

Scaling strategies available for the Object store depend on the underlying
object storage services used to run the object store. Most support
[horizontal scaling](#horizontal-scaling) for redundancy, failover, and
increased capacity.
