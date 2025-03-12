---
title: Manage environment variables in your InfluxDB Cluster
description: >
  Use environment variables to define settings for individual components in your
  InfluxDB cluster.
menu:
  influxdb3_clustered:
    parent: Administer InfluxDB Clustered
    name: Manage environment variables
weight: 208
---

Use environment variables to define settings for individual components in your
InfluxDB cluster and adjust your cluster's running configuration.
Define environment variables for each component in your `AppInstance` resource.

InfluxDB Clustered components support various environment variables.
While many of these variables have default settings, you can customize them by
setting your own values.

> [!Warning]
> #### Overriding default settings may affect overall cluster performance
> 
> {{% product-name %}} components have complex interactions that can be affected
> when overriding default configuration settings.
> Changing these settings may impact overall cluster performance.
> Before making configuration changes using environment variables, consider
> consulting [InfluxData Support](https://support.influxdata.com/) to identify any
> potential unintended consequences.

## AppInstance component schema

In your `AppInstance` resource, configure individual component settings in the
`spec.package.spec.components` property if configuring your `AppInstance` resource
directly or, if using Helm, use the `components` property in your `values.yaml`.
This property supports the following InfluxDB Clustered component keys:

- `ingester`
- `querier`
- `router`
- `compactor`
- `garbage-collector`

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[AppInstance](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
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
{{% /code-tab-content %}}
{{% code-tab-content %}}
```yaml
# ...
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
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

_For more information about components in the InfluxDB 3 storage engine, see
the [InfluxDB 3 storage engine architecture](/influxdb3/clustered/reference/internals/storage-engine/)._

## Set environment variables for a component

1.  Under the specific component property, use the
    `<component>.template.containers.iox.env` property to define environment
    variables.
2.  In the `env` property, structure each environment variable as a key-value
    pair where the key is the environment variable name and the value is the
    environment variable value (string-formatted).
    For example, to configure environment variables for the Garbage collector:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[AppInstance](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
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
{{% /code-tab-content %}}
{{% code-tab-content %}}
```yaml
# ...
components:
  garbage-collector:
    template:
      containers:
        iox:
          env:
            INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF: '6h'
            INFLUXDB_IOX_GC_PARQUETFILE_CUTOFF: '6h'
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

3.  Apply the configuration changes to your cluster and add or update
    environment variables in each component.

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

> [!Note]
> #### Update environment variables instead of removing them
> 
> Most configuration settings that can be overridden by environment variables have
> default values that are used if the environment variable is unset. Removing
> environment variables from your `AppInstance` resource configuration will not
> remove those environment variables entirely; instead, they will revert to their
> default settings. To revert to the default settings, simply unset the
> environment variable or update the value in your `AppInstance` resource to the
> default value.
> 
> In the preceding example, the `INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF` environment
> variable is set to `6h`. If you remove `INFLUXDB_IOX_GC_OBJECTSTORE_CUTOFF` from
> the `env` property, the cutoff reverts to its default setting of `30d`.

{{< expand-wrapper >}}
{{% expand "View example of environment variables in all components" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[AppInstance](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
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
{{% /code-tab-content %}}
{{% code-tab-content %}}
```yaml
# ...
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
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /expand %}}
{{< /expand-wrapper >}}
