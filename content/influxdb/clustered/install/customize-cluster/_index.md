---
title: Customize your InfluxDB cluster
description: >
  Customize the scale and configuration of your cluster to best suit your workload.
menu:
  influxdb_clustered:
    name: Customize your cluster
    parent: Install InfluxDB Clustered
weight: 102
metadata: ['Install InfluxDB Clustered -- Phase 2']
related:
  - /influxdb/clustered/admin/scale-cluster/
---

This phase of the installation process is where you customize the scale and
configuration of your cluster to best suit your workload.

## Configure the size of your cluster

InfluxDB Clustered lets you scale ...

##### Default scale settings

- **3 ingesters**:
  Ensures redundancy on the write path.
- **1 compactor**:
  While you can have multiple compactors, it is more efficient to scale the
  compactor vertically (assign more CPU and memory) rather than horizontally
  (increase the number of compactors).
- **1 querier**:
  The optimal number of queriers depends on the number of concurrent queries you are
  likely to have and how long they take to execute.

The default values provide a good starting point for testing.
Once you have your cluster up and running and are looking for scaling recommendations
for your anticipated workload,
please [contact the InfluxData Support team](https://support.influxdata.com).

##### Customize scale settings

**To use custom scale settings for your InfluxDB cluster**, edit values for the following fields
in your `myinfluxdb.yml`. If omitted, your cluster uses the default scale settings.

- `spec.package.spec.resources`
  - `ingester.requests`
    - `cpu`: CPU resource units to assign to ingesters
    - `memory`: Memory resource units to assign to ingesters
    - `replicas`: Number of ingester replicas to provision
  - `compactor.requests`
    - `cpu`: CPU resource units to assign to compactors
    - `memory`: Memory resource units to assign to compactors
    - `replicas`: Number of compactor replicas to provision
  - `querier.requests`
    - `cpu`: CPU resource units to assign to queriers
    - `memory`: Memory resource units to assign to queriers
    - `replicas`: Number of querier replicas to provision
  - `router.requests`
    - `cpu`: CPU resource units to assign to routers
    - `memory`: Memory resource units to assign to routers
    - `replicas`: Number of router replicas to provision

###### Related Kubernetes documentation

- [CPU resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
- [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)

{{% code-placeholders "(INGESTER|COMPACTOR|QUERIER|ROUTER)_(CPU|MEMORY|REPLICAS)" %}}

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
        # The ingester handles data being written
        ingester:
          requests:
            cpu: INGESTER_CPU
            memory: INGESTER_MEMORY
            replicas: INGESTER_REPLICAS # Default is 3

        # The compactor reorganizes old data to improve query and storage efficiency.
        compactor:
          requests:
            cpu: COMPACTOR_CPU
            memory: COMPACTOR_MEMORY
            replicas: COMPACTOR_REPLICAS # Default is 1

        # The querier handles querying data.
        querier:
          requests:
            cpu: QUERIER_CPU
            memory: QUERIER_MEMORY
            replicas: QUERIER_REPLICAS # Default is 1

        # The router performs some api routing.
        router:
          requests:
            cpu: ROUTER_CPU
            memory: ROUTER_MEMORY
            replicas: ROUTER_REPLICAS # Default is 1
```

{{% /code-placeholders %}}

<!-- HELM VERSIOn -->

#### Configure the size of your cluster

By default, an InfluxDB cluster is configured with the following:

- **3 ingesters**:  
  Ensures redundancy on the write path.
- **1 compactor**:  
  While you can have multiple compactors, it is more efficient to scale the
  compactor vertically (assign more CPU and memory) rather than horizontally
  (increase the number of compactors).
- **1 querier**:  
  The optimal number of queriers depends on the number of concurrent queries you are
  likely to have and how long they take to execute.

The default values provide a good starting point for testing.
Once you have your cluster up and running and are looking for scaling recommendations,
please [contact the InfluxData Support team](https://support.influxdata.com).
We are happy to work with you to identify appropriate scale settings based on
your anticipated workload.

**To use custom scale settings for your InfluxDB cluster**, modify the following fields
in your values.yaml`. If omitted, your cluster will use the default scale settings.

- `resources`
  - `ingester.requests`
    - `cpu`: CPU resource units to assign to ingesters
    - `memory`: Memory resource units to assign to ingesters
    - `replicas`: Number of ingester replicas to provision
  - `compactor.requests`
    - `cpu`: CPU resource units to assign to compactors
    - `memory`: Memory resource units to assign to compactors
    - `replicas`: Number of compactor replicas to provision
  - `querier.requests`
    - `cpu`: CPU resource units to assign to queriers
    - `memory`: Memory resource units to assign to queriers
    - `replicas`: Number of querier replicas to provision
  - `router.requests`
    - `cpu`: CPU resource units to assign to routers
    - `memory`: Memory resource units to assign to routers
    - `replicas`: Number of router replicas to provision

###### Related Kubernetes documentation

- [CPU resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
- [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)

{{% code-placeholders "(INGESTER|COMPACTOR|QUERIER|ROUTER)_(CPU|MEMORY|REPLICAS)" %}}

```yml
# The following settings tune the various pods for their cpu/memory/replicas
# based on workload needs. Only uncomment the specific resources you want
# to change. Anything left commented will use the package default.
resources:
  # The ingester handles data being written
  ingester:
    requests:
      cpu: INGESTER_CPU
      memory: INGESTER_MEMORY
      replicas: INGESTER_REPLICAS # Default is 3

  # The compactor reorganizes old data to improve query and storage efficiency.
  compactor:
    requests:
      cpu: COMPACTOR_CPU
      memory: COMPACTOR_MEMORY
      replicas: COMPACTOR_REPLICAS # Default is 1

  # The querier handles querying data.
  querier:
    requests:
      cpu: QUERIER_CPU
      memory: QUERIER_MEMORY
      replicas: QUERIER_REPLICAS # Default is 1

  # The router performs some api routing.
  router:
    requests:
      cpu: ROUTER_CPU
      memory: ROUTER_MEMORY
      replicas: ROUTER_REPLICAS # Default is 1
```

{{% /code-placeholders %}}

<!-- HELM VERSION -->