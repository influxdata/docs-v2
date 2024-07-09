---
title: Install Your InfluxDB 3.0 License
description: >
  Install the InfluxDB 3.0 License in your cluster.
menu:
  influxdb_clustered:
    name: Install your License
    parent: Install InfluxDB Clustered
weight: 135
related:
  - /influxdb/clustered/install/deploy/
  - /influxdb/clustered/install/configure-cluster/
  - /influxdb/clustered/reference/licensing/
---

This document outlines the installation process for licenses in InfluxDB 3.0
Clustered. For information about how license enforcement works, please see the
[Licensing Enforcement reference doc][enforcement], which explains the license
enforcement behaviors you should expect from the product.

{{% note %}}

We are entering a transition period, during which InfluxDB 3.0 Clustered
license enforcement is an opt-in feature. This transition period allows us to
gently introduce license enforcement to a select few customers in a way that
can easily be disabled if problems arise. After the end of this transition
period, all releases of InfluxDB 3.0 Clustered will require an active license
for the product.

Licensing is enabled by the presence of an AppInstance feature flag:
`useLicensedBinaries`.

{{% /note %}}

# Onboarding to a licensed release of Clustered

Customers setting up a Clustered deployment for the first time can apply a
`License` resource after creating the Kubernetes cluster. First, you must
[configure your cluster][setup-guide]. You will be able to apply the License
resource after the namespace is created and prepared.

## Installation process

1. Request a license token from InfluxData
2. InfluxData will supply a `license.yml` file that encapsulates your license
   token as a custom Kubernetes resource
3. Apply this resource in your Clustered namespace\
   `kubectl apply -f license.yml -n <your_clustered_namespace>`\
   This will create a `License` resource in your namespace
4. Update your Clustered `AppInstance` resource to enable the
   `useLicensedBinaries` feature flag

Add the `useLicensedBinaries` entry to the `.spec.package.spec.featureFlags`
field in your `AppInstance` resource--for example:

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

A controller that's included in the InfluxDB 3.0 Clustered deployment will
detect the License resource and extract the credentials into a Secret needed by
IOx Kubernetes pods. The license will be validated by the IOx pods both at
startup and periodically (roughly once per hour) while running.

# Upgrading from a preview release of Clustered

This process is similar to first time installation. The normal upgrade workflow
is to update the image reference in the Clustered AppImage resource, and then
use `kubectl apply` to apply the change. For the best experience, you should get
and apply a license file before updating to a licensed release.

## Upgrade process

1. If you are not already upgraded to at least the previous checkpoint release,
   you should perform those upgrades now.
2. Request a license token from InfluxData\
   InfluxData will supply a `license.yml` file that encapsulates your license
   token as a custom Kubernetes resource.
3. Apply this resource in your Clustered namespace\
   `kubectl apply -f license.yml -n <your_clustered_namespace>`\
   This will create a `License` resource in your namespace.
4. Update your Clustered `AppInstance` resource, as described above.
5. Upgrade to the licensed release.

# Recovery process

In the event you deploy a release of Clustered without a valid license, many of
the pods in that release will crash on startup, and will likely enter a
`CrashLoopBackoff` state in Kubernetes without ever running or becoming healthy.
If this happens during an upgrade, the Kubernetes control plane should detect it
and prevent terminating the existing pods from the previous version. This means
the previous version should continue running, and you can resolve the issues
with the license without experiencing any service disruption. Once a valid
License resource is applied, the new pods should begin to start up normally.
This is an error recovery feature of Kubernetes, and it depends on the correct
functioning of the Kubernetes cluster with enough capacity to perform rolling
upgrades.

# Renewal Process

You should expect your sales representative to proactively reach out to you
regarding license renewals in advance of your license expiration. You are of
course welcome to contact your sales representative at any time.

[setup-guide]: /influxdb/clustered/install/configure-cluster/
[deployment-guide]: /influxdb/clustered/install/deploy/
[enforcement]: /influxdb/clustered/reference/licensing/
