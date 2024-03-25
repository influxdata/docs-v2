---
title: Upgrade InfluxDB Clustered
seotitle:
description: >
  Use Kubernetes to upgrade your InfluxDB Clustered version.
menu:
  influxdb_clustered:
    name: Upgrade InfluxDB
    parent: Administer InfluxDB Clustered
weight: 206
influxdb/clustered/tags: [upgrade]
related:
  - /influxdb/clustered/install/
  - /influxdb/clustered/install/configure-cluster/
  - /influxdb/clustered/install/deploy/
---

Use Kubernetes to upgrade your InfluxDB Clustered version.
InfluxDB Clustered versioning is defined in the `AppInstance`
`CustomResourceDefinition` (CRD) in your
[`myinfluxdb.yml`](/influxdb/clustered/install/configure-cluster/).

- [Version format](#version-format)
- [Upgrade your InfluxDB Clustered version](#upgrade-your-influxdb-clustered-version)

## Version format

InfluxDB Clustered uses the `YYYYMMDD-BUILD_NUMBER` version format.
For example, a version created on January 1, 2024 would have a version number
similar to the following:

```
20240101-863513
```

## Upgrade your InfluxDB Clustered version

1. [Identify your current InfluxDB Clustered package version](#identify-your-current-influxdb-clustered-package-version)
2. [Identify the version to upgrade to](#identify-the-version-to-upgrade-to)
3. [Update your image to use a new package version](#update-your-image-to-use-a-new-package-version)
4. [Apply the updated image](#apply-the-updated-image)

### Identify your current InfluxDB Clustered package version

Use the following command to return the image Kubernetes uses to build your
InfluxDB cluster:

```sh
kubectl get appinstances.kubecfg.dev influxdb -o jsonpath='{.spec.package.image}'
```

The package version number is at the end of the returned string (after `influxdb:`):

{{% code-callout "PACKAGE_VERSION" "orange" %}}

```
us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:PACKAGE_VERSION
```

{{% /code-callout %}}

### Identify the version to upgrade to

All available InfluxDB Clustered package versions are provided at
[oci.influxdata.com](https://oci.influxdata.com).
Find the package version you want to upgrade to and copy the version number.

{{% note %}}

#### oci.influxdata.com credentials

[oci.influxdata.com](https://oci.influxdata.com) requires you to log in with
credentials provided by InfluxData.
If you don't have these credentials,
[contact InfluxData Support](https://support.influxdata.com).

{{% /note %}}

#### Checkpoint releases

Some InfluxDB Clustered releases are _checkpoint releases_ that introduce a
breaking change to an InfluxDB component.
Checkpoint releases are only made when absolutely necessary and are clearly
identified at [oci.influxdata.com](https://oci.influxdata.com).

**When upgrading, always upgrade to each checkpoint release first, before proceeding
to newer versions.**

{{% warn %}}

#### Upgrade to checkpoint releases first

Upgrading past a checkpoint release without first upgrading to it may result
in corrupt or lost data.

{{% /warn %}}

{{< expand-wrapper >}}
{{% expand "View checkpoint release upgrade example" %}}

Given the following InfluxDB Clustered versions (ordered newest to oldest):

| Available Versions |                                            |
| :----------------- | :----------------------------------------: |
| 20240215-433509    |                                            |
| 20240214-863513    | <strong class="orange">checkpoint</strong> |
| 20240111-824437    |                                            |
| 20231213-791734    |                                            |
| 20231117-750011    |                                            |
| 20231115-746129    |                                            |
| 20231024-711448    |                                            |
| 20231004-666907    | <strong class="orange">checkpoint</strong> |
| 20230922-650371    | <em class="blue">Your current version</em> |

To upgrade to the most recent version (`20240215-433509`), you **must** do the
following:

1. Upgrade to the `20231004-666907` checkpoint release.
2. Upgrade to the `20240214-863513` checkpoint release.
3. Upgrade to `20240215-433509`.

You can upgrade to versions between checkpoint releases, but you must always
upgrade to a checkpoint before upgrading beyond it.

{{% /expand %}}
{{< /expand-wrapper >}}

### Update your image to use a new package version

In your `myinfluxdb.yml`, update the package version defined in
`spec.package.image` to the version you want to upgrade to.

{{% code-placeholders "PACKAGE_VERSION" %}}

```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    # ...
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:PACKAGE_VERSION
```

{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`PACKAGE_VERSION`{{% /code-placeholder-key %}} with
the version number to upgrade to.

### Apply the updated image

Use the following command to apply the updated image configuration and upgrade
your InfluxDB Cluster:

```sh
kubectl apply \
  --filename myinfluxdb.yml \
  --namespace influxdb
```
