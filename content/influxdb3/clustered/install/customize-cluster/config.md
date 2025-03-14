---
title: Customize your cluster configuration
seotitle: Customize the configuration of your InfluxDB cluster
description: >
  Customize the configuration of your InfluxDB cluster to best suit your workload.
menu:
  influxdb3_clustered:
    name: Customize cluster configuration
    parent: Customize your cluster
weight: 202
related:
  - /influxdb3/clustered/admin/env-vars/
---

Use environment variables to customize configuration options for components in
your InfluxDB cluster.

{{< tabs-wrapper >}}
{{% tabs "medium" %}}
[AppInstance](#)
[Helm](#)
{{% /tabs %}}

{{% tab-content %}}

<!----------------------------- BEGIN APPINSTANCE ----------------------------->

In your `AppInstance` resource, configure environment variables for individual
components in the
`spec.package.spec.components.<component>.template.containers.iox.env` property.
The following InfluxDB Clustered components are configurable:

- `ingester`
- `querier`
- `router`
- `compactor`
- `garbage-collector`

In the `env` property, structure each environment variable as a key-value pair
where the key is the environment variable name and the value is the environment
variable value (string-formatted)--for example:

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
        router:
          template:
            containers:
              iox:
                env:
                  INFLUXDB_IOX_MAX_HTTP_REQUESTS: '4500'
                  INFLUXDB_IOX_MAX_HTTP_REQUEST_SIZE: '52428800'
```

<!------------------------------ END APPINSTANCE ------------------------------>

{{% /tab-content %}}
{{% tab-content %}}

<!--------------------------------- BEGIN HELM -------------------------------->

In your `values.yaml`, configure environment variables for individual components
in the `components.<component>.template.containers.iox.env` property.
The following InfluxDB Clustered components are configurable:

- `ingester`
- `querier`
- `router`
- `compactor`
- `garbage-collector`

In the `env` property, structure each environment variable as a key-value pair
where the key is the environment variable name and the value is the environment
variable value (string-formatted)--for example:

```yaml
components:
  router:
    template:
      containers:
        iox:
          env:
            INFLUXDB_IOX_MAX_HTTP_REQUESTS: '4500'
            INFLUXDB_IOX_MAX_HTTP_REQUEST_SIZE: '52428800'
```

<!---------------------------------- END HELM --------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

For more information, see
[Manage environment variables in your InfluxDB Cluster](/influxdb3/clustered/admin/env-vars/).

> [!Note]
> #### Configurable settings
> 
> For information about what settings are configurable and their associated
> environment variables, [contact InfluxData Support](https://support.influxdata.com).

<!-- 

TODO: We need to get a list of what environment variables users can modify and
what each does. This section should show examples of how to set the environment
variables, but point to the master list somewhere in the reference section.

-->

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

{{< page-nav prev="content/influxdb3/clustered/install/customize-cluster/scale/" prevText="Customize cluster scale" next="/influxdb3/clustered/install/optimize-cluster/" nextText="Phase 3: Optimize your cluster" >}}
