---
title: Install your InfluxDB Clustered license
description: >
  Install your InfluxDB Clustered license to authorize the use of the InfluxDB
  Clustered software.
menu:
  influxdb_clustered:
    name: Install your License
    parent: Install InfluxDB Clustered
weight: 135
influxdb/clustered/tags: [licensing]
related:
  - /influxdb/clustered/admin/licensing/
  - /influxdb/clustered/admin/upgrade/
---

Install your InfluxDB Clustered license in your cluster to authorize the use
of the InfluxDB Clustered software.

{{% note %}}
#### License enforcement is currently an opt-in feature

In currently available versions of InfluxDB Clustered, license enforcement is an
opt-in feature that allows InfluxData to introduce license enforcement to
customers, and allows customers to deactivate the feature if issues arise.
In the future, all releases of InfluxDB Clustered will require an active license
to use the product.

To opt into license enforcement, include the `useLicensedBinaries` feature flag
in your `AppInstance` resource _([See the example below](#enable-feature-flag))_.
To deactivate license enforcement, remove the `useLicensedBinaries` feature flag.
{{% /note %}}

## Install your InfluxDB license

1.  If you haven't already,
    [request an InfluxDB Clustered license](https://influxdata.com/contact-sales).
2.  InfluxData provides you with a `license.yml` file that encapsulates your
    license token as a custom Kubernetes resource.
3.  Use `kubectl` to apply and create the `License` resource in your InfluxDB
    namespace:

    ```sh
    kubectl apply --filename license.yml --namespace influxdb
    ```
  
4.  <span id="enable-feature-flag"></span>
    Update your `AppInstance` resource to enable the `useLicensedBinaries` feature flag.
    Add the `useLicensedBinaries` entry to the `.spec.package.spec.featureFlags`
    property--for example:

    ```yml
    apiVersion: kubecfg.dev/v1alpha1
    kind: AppInstance
    # ...
    spec:
      package:
        spec:
          featureFlags:
            - useLicensedBinaries
    ```

InfluxDB Clustered detects the `License` resource and extracts the credentials
into a secret required by InfluxDB Clustered Kubernetes pods.
Pods validate the license secret both at startup and periodically (roughly once
per hour) while running.

## Upgrade from a non-licensed release

If you are currently using a non-licensed preview release of InfluxDB Clustered
and want to upgrade to a licensed release, do the following:

1.  [Install an InfluxDB license](#install-your-influxdb-license)
2.  In your `myinfluxdb.yml`, update the package version defined in
    `spec.package.image` to use a licensed release.

    {{% warn %}}
#### Upgrade to checkpoint releases first

When upgrading InfluxDB Clustered, always upgrade to each
[checkpoint release](/influxdb/clustered/admin/upgrade/#checkpoint-releases)
first, before proceeding to newer versions.
Upgrading past a checkpoint release without first upgrading to it may result in
corrupt or lost data.
    {{% /warn %}}

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

{{< page-nav prev="/influxdb/clustered/install/configure-cluster/" prevText="Configure your cluster" next="/influxdb/clustered/install/deploy/" nextText="Deploy your cluster" >}}
