---
title: Manage environment variables for Clustered components
description: >
  Manage environment variables for Clustered components.
menu:
  influxdb_clustered:
    parent: Administer InfluxDB Clustered
    name: Manage environment variables
weight: 101
influxdb/clustered/tags: []
---

There are numerous environment variables available to the components of Clustered.
This is handled entirely through your `AppInstance` configuration.

Environment variables enable you to tweak the running configuration of Clustered.
Many of them are already set for you, but you may wish to tune them specifically,
either by our request or for your own means. 

An example of tuning environment variables for the `garbage-collector` component
is provided below:

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    # ...
    spec:
      components:
       garbage-collector:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '6h'
                 INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF: '6h'
```

{{% note %}}
All components can have their environment variables tuned in the same way, by
specifying their component name in this manner.
{{% /note %}}


{{% expand "All components example" %}}

The following example demonstrates all of the InfluxDB 3 Clustered component names
being tuned in specific ways.


```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    # ...
    spec:
      components:
       ingester:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_WAL_ROTATION_PERIOD_SECONDS: '360'
       querier:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_EXEC_MEM_POOL_BYTES: '10737418240' # 10GiB
       router:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_MAX_HTTP_REQUESTS: '5000'
       compactor:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_EXEC_MEM_POOL_PERCENT: '80'
       garbage-collector:
         template:
           containers:
             iox:
               env:
                 INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '6h'
                 INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF: '6h'
```
{{% /expand %}}
