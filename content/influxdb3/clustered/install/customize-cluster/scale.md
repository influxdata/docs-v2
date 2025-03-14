---
title: Customize your cluster scale
seotitle: Customize the scale of your InfluxDB cluster
description: >
  Customize the scale of your cluster to best suit your workload.
menu:
  influxdb3_clustered:
    name: Customize cluster scale
    parent: Customize your cluster
weight: 201
related:
  - /influxdb3/clustered/admin/scale-cluster/
---

InfluxDB Clustered lets you scale each component in your cluster individually,
so you can customize your cluster's scale to address the specific the specific
needs of your workload.
For example, if you have a heavy write workload, but not a heavy query workload,
you can scale your Router and Ingester both [vertically](/influxdb3/clustered/admin/scale-cluster/#vertical-scaling)
and [horizontally](/influxdb3/clustered/admin/scale-cluster/#horizontal-scaling)
to increase your write throughput and latency.

## Default scale settings

- **1 router**:
  Additional routers increase your cluster's ability to handle concurrent write
  requests.
- **3 ingesters**:
  Ensures redundancy on the write path.
- **1 querier**:
  The optimal number of queriers depends on the number of concurrent queries you
  are likely to have and how long they take to execute.
- **1 compactor**:
  While you can have multiple compactors, it is more efficient to scale the
  compactor vertically (assign more CPU and memory) rather than horizontally
  (increase the number of compactors).
- **1 garbage collector**:
  The garbage collector is a light-weight process that only needs to be scaled
  vertically when you observe high resource usage by the garbage collector.
  _The garbage collector cannot be scaled horizontally._

The default values provide a good starting point for testing.
Once you have your cluster up and running and are looking for scaling
recommendations for your anticipated workload, please
[contact the InfluxData Support team](https://support.influxdata.com) to help you
identify appropriate scale settings based on
your anticipated workload.

## Customize scale settings

Your `AppInstance` resource controls the scale of components in your InfluxDB
cluster. You can edit the `AppInstance` resource directly or, if using the
[InfluxDB Clustered Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-clustered)
to manage your deployment, you can edit resource settings in your `values.yaml`.

> [!Note]
> _For specific scaling recommendations and guidelines, see
> [Scale your cluster](/influxdb3/clustered/admin/scale-cluster/)._

With Kubernetes, you can define the minimum resources and the resource limits for each component.

{{< tabs-wrapper >}}
{{% tabs "medium" %}}
[AppInstance](#)
[Helm](#)
{{% /tabs %}}

{{% tab-content %}}

<!----------------------------- BEGIN APPINSTANCE ----------------------------->

**To use custom scale settings for your InfluxDB cluster**, edit values for the
following fields in your `myinfluxdb.yml`.
If omitted, your cluster uses the default scale settings.

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
  - `prometheus`
    - `requests`
      - `cpu`: Minimum CPU resource units to assign to prometheus
      - `memory`: Minimum memory resource units to assign to prometheus
    - `limits`
      - `cpu`: Maximum CPU Resource units to assign to prometheus
      - `memory`: Maximum memory resource units to assign to prometheus

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

**To use custom scale settings for your InfluxDB cluster**, modify the following fields
in your `values.yaml`. If omitted, your cluster will use the default scale settings.

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
# The following settings tune the various pods for their cpu/memory/replicas
# based on workload needs. Only uncomment the specific resources you want
# to change. Anything left commented will use the package default.
resources:
  # The ingester handles data being written
  ingester:
    requests:
      cpu: INGESTER_CPU_MIN
      memory: INGESTER_MEMORY_MIN
      replicas: INGESTER_REPLICAS # Default is 3
    limits:
      cpu: INGESTER_CPU_MAX
      memory: INGESTER_MEMORY_MAX

  # The compactor reorganizes old data to improve query and storage efficiency.
  compactor:
    requests:
      cpu: COMPACTOR_CPU_MIN
      memory: COMPACTOR_MEMORY_MIN
      replicas: COMPACTOR_REPLICAS # Default is 1
    limits:
      cpu: COMPACTOR_CPU_MAX
      memory: COMPACTOR_MEMORY_MAX

  # The querier handles querying data.
  querier:
    requests:
      cpu: QUERIER_CPU_MIN
      memory: QUERIER_MEMORY_MIN
      replicas: QUERIER_REPLICAS # Default is 1          
    limits:
      cpu: QUERIER_CPU_MAX
      memory: QUERIER_MEMORY_MAX

  # The router performs some API routing.
  router:
    requests:
      cpu: ROUTER_CPU_MIN
      memory: ROUTER_MEMORY_MIN
      replicas: ROUTER_REPLICAS # Default is 1
    limits:
      cpu: ROUTER_CPU_MAX
      memory: ROUTER_MEMORY_MAX
  
  # The garbage collector evicts obsolete data and files
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

##### Related Kubernetes documentation

- [CPU resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
- [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)

## Apply the changes to your cluster

Use `kubectl` or `helm` (if using the InfluxDB Clustered Helm chart), to apply
the changes to your cluster:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[kubectl](#)
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

{{< page-nav prev="content/influxdb3/clustered/install/customize-cluster/" prevText="Customize your cluster" next="/influxdb3/clustered/install/customize-cluster/config/" nextText="Customize cluster configuration" >}}
