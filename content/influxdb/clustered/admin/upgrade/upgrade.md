---
title: Upgrade Clustered
description: >
    Upgrading InfluxDB Clustered
menu:
  influxdb_clustered:
    parent: Administer InfluxDB Clustered
---

Whilst Clustered is in its Alpha/Beta stage, you have been granted credentials to our website which hosts Clustered releases. If you have forgotten your credentials or lost
the domain, please reach out to your InfluxData sales representative for Clustered or use the appropriate communication channel with us.


As Clustered is managed through Kubernetes using an operator and a `CustomResourceDefinition`, an `AppInstance`, this means that upgrades to the product are simple. It also has the advantage that configuration is managed through code and files, so it can be version controlled.

Clustered is versioned using a `YYYYMMDD-BUILD_NUMBER` format, such as `20240214-863513`.

Before proceeding, you should verify the current version of the package image that you are using, you can retrieve this from the following command:

```
kubectl get appinstances.kubecfg.dev influxdb -o jsonpath='{.spec.package.image}'
```

From the output of this command, you will retrieve your running version of Clustered. We'll use `20240214-863513` going forward.


In normal circumstances, you can easily upgrade Clustered by simply changing the package version you have in your `AppInstance`.

Using the following example, altering the `PACKAGE_VERSION` below to a another release will perform an upgrade of Clustered.

**Note: special care must be taken for checkpoint releases.**

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name:
  namespace: influxdb
spec:
  package:
    apiVersion: influxdata.com/v1alpha1
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:<PACKAGE_VERSION>
    spec:
     ...
```
