---
title: Install your InfluxDB Clustered license
description: >
  Install your InfluxDB Clustered license to authorize the use of the InfluxDB
  Clustered software.
menu:
  influxdb_clustered:
    name: Install your license
    parent: Install InfluxDB Clustered
weight: 135
influxdb/clustered/tags: [licensing]
related:
  - /influxdb/clustered/admin/licensing/
  - /influxdb/clustered/admin/upgrade/
---

Install your InfluxDB Clustered license in your cluster to authorize the use
of the InfluxDB Clustered software.

## Install your InfluxDB license

1.  If you haven't already,
    [request an InfluxDB Clustered license](https://influxdata.com/contact-sales).
2.  InfluxData provides you with a `license.yml` file that encapsulates your
    license token as a custom Kubernetes resource.
3.  Use `kubectl` to apply and create the `License` resource in your InfluxDB
    namespace:

    <!--pytest.mark.skip-->

    ```sh
    kubectl apply --filename license.yml --namespace influxdb
    ```

InfluxDB Clustered detects the `License` resource and extracts the credentials
into a secret required by InfluxDB Clustered Kubernetes pods.
Pods validate the license secret both at startup and periodically (roughly once
per hour) while running.

## Upgrade from a non-licensed release

If you are currently using a non-licensed preview release of InfluxDB Clustered
and want to upgrade to a licensed release, do the following:

1.  [Install an InfluxDB license](#install-your-influxdb-license)
2.  If you [use the `AppInstance` resource configuration](/influxdb/clustered/install/configure-cluster/directly/)
    to configure your cluster, in your `myinfluxdb.yml`,
    update the package version defined in `spec.package.image` to use a licensed
    release.
    
    If using the InfluxDB Clustered Helm chart, update the `image.tag` property
    in your `values.yaml`to use a licensed release.

    {{% warn %}}
#### Upgrade to checkpoint releases first

When upgrading InfluxDB Clustered, always upgrade to each
[checkpoint release](/influxdb/clustered/admin/upgrade/#checkpoint-releases)
first, before proceeding to newer versions.
Upgrading past a checkpoint release without first upgrading to it may result in
corrupt or lost data.
    {{% /warn %}}

{{% code-placeholders "PACKAGE_VERSION" %}}

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
    # ...
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:PACKAGE_VERSION
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

```yml
# values.yaml

image:
  tag: PACKAGE_VERSION
```

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`PACKAGE_VERSION`{{% /code-placeholder-key %}} with
the version number to upgrade to.

## Troubleshoot licensing

After you have activated licensing, use the following signals to verify licensing
and troubleshoot issues with your {{< product-name omit="Clustered" >}}
cluster.

In your commands, replace the following:

- {{% code-placeholder-key %}}`NAMESPACE`{{% /code-placeholder-key %}}:
  your [InfluxDB namespace](/influxdb/clustered/install/configure-cluster/#create-a-namespace-for-influxdb)
- {{% code-placeholder-key %}}`POD_NAME`{{% /code-placeholder-key %}}:
  your [InfluxDB Kubernetes pod](/influxdb/clustered/install/deploy/#inspect-cluster-pods)

### Verify database components

After you [install your license](#install-your-influxdb-license),
run the following command to check that database pods start up and are in the
`Running` state:

<!--pytest.mark.skip-->

{{% code-placeholders "NAMESPACE" %}}

```sh
kubectl get pods -l app=iox --namespace NAMESPACE
```

{{% /code-placeholders %}}

If a `Pod` fails to start, run the following command to view pod information:

<!--pytest.mark.skip-->

{{% code-placeholders "POD_NAME|NAMESPACE" %}}

```sh
kubectl describe pod POD_NAME --namespace NAMESPACE
```

{{% /code-placeholders %}}

### Verify the `Secret` exists 

Run the following command to verify that the licensing activation created a
`iox-license` secret:

<!--pytest.mark.skip-->

{{% code-placeholders "NAMESPACE" %}}

```sh
kubectl get secret iox-license --namespace NAMESPACE
```

If the secret doesn't exist,
[view `license-controller` logs](#view-license-controller-logs) for
more information or errors.

{{% /code-placeholders %}}

### View `license controller` logs

The `license controller` component creates a `Secret` named `iox-license` from your
`License`.

To view `license controller` logs for troubleshooting, run the following
command:

<!--pytest.mark.skip-->

{{% code-placeholders "NAMESPACE" %}}

```sh
kubectl logs deployment/license-controller --namespace NAMESPACE
```

{{% /code-placeholders %}}


{{< page-nav prev="/influxdb/clustered/install/configure-cluster/" prevText="Configure your cluster" next="/influxdb/clustered/install/deploy/" nextText="Deploy your cluster" keepTab=true >}}
