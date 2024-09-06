---
title: Manage environment variables in your InfluxDB Cluster
description: >
  Use environment variables to define settings for individual components in your
  InfluxDB cluster.
menu:
  influxdb_clustered:
    parent: Administer InfluxDB Clustered
    name: Manage environment variables
weight: 208
---

Use environment variables to define settings for individual components in your
InfluxDB cluster and adjust your cluster's running configuration.
Define environment variables for each component in your `AppInstance` resource.

There are a number of environment variables available to InfluxDB Clustered components.
Many environment variables have default settings, but you can override these
defaults by setting custom values for environment variables.

{{% warn %}}
#### Overriding default settings may affect overall cluster performance

{{% product-name %}} components have complex interactions with each other that
can be affected when overriding default configuration settings.
Before using environment variables to make configuration changes, you should
consider consulting [InfluxData Support](https://support.influxdata.com/) to
identify any potential unintended consequences of configuration changes.
{{% /warn %}}

## AppInstance component schema

In your `AppInstance` resource, configure individual component settings in the
`spec.package.spec.components` property. This property supports the following
InfluxDB Clustered component keys:

- `ingester`
- `querier`
- `router`
- `compactor`
- `garbage-collector`

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
          # Ingester settings ...
        querier:
          # Querier settings ...
        router:
          # Router settings. ...
        compactor:
          # Compactor settings ...
        garbage-collector:
          # Garbage collector settings ...
```

_For more information about components in the InfluxDB v3 storage engine, see
the [InfluxDB v3 storage engine architecture](/influxdb/clustered/reference/internals/storage-engine/)._

## Set environment variables for a component

1.  Under the specific component property, use the `<component>.template.containers.iox.env`
    property to define environment variables.
2.  In the `env` property, structure each environment variable as a key-value pair.
    For example, to configure environment variables for the Garbage collector:

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

3.  Use `kubectl apply` to apply the configuration changes to your cluster and
    add or update environment variables in each component.

    ```sh
    kubectl apply \
      --filename myinfluxdb.yml \
      --namespace influxdb
    ```
{{% note %}}
#### Update instead of removing environment variables

Removing environment variables from your `AppInstance` resource configuration
will not revert those environment variables to their default setting.
To revert back to the default settings, update the value in your `AppInstance`
resource to the default value rather than removing the environment variable definition.
{{% /note %}}

{{< expand-wrapper >}}
{{% expand "View example of environment variables in all components" %}}

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
{{< /expand-wrapper >}}
