# Impact of licensing

We are entering a transition period, to ease the process of configuring licenses for deployments of InfluxDB 3.0 Clustered. After the end of this transition period, all releases of InfluxDB 3.0 Clustered will require an active license for the product.

The IOx binaries will validate the license on startup, and they will log an error message and exit if one is not provided. In the event your license expires, you will enter a short grace period, during which the IOx binaries will begin to log warning messages about the expired license. After a short time, read-oriented queries will begin to induce intermittent failures, and continue to log warning messages. Write-oriented operations will not be affected, to prevent accidental data loss. At the end of the grace period, all database operations will cease to function, and the IOx binaries will exit immediately on startup.

You should expect your sales representative to proactively reach out to you regarding license renewals in advance of your license expiration. You are of course welcome to contact your sales representative at any time.

# Direct onboarding to a licensed release of Clustered

Customers setting up a Clustered deployment for the first time can apply a License resource after creating the Kubernetes cluster. First, you must [configure your cluster][setup-guide]. You will be able to apply the License resource after the namespace is created and prepared.

{{% note %}}

As part of the transition period, licensing is currently an opt-in feature. It is controlled by a feature flag: `useLicensedBinaries`.

{{% /note %}}

## Installation process

1. Request a license token from InfluxData
2. InfluxData will supply a `license.yml` file that encapsulates your license token as a custom Kubernetes resource
3. Apply this resource in your Clustered namespace  
   `kubectl apply -f license.yml -n <your_clustered_namespace>`  
   This will create a `License` resource in your namespace
4. Update your Clustered `AppInstance` resource to enable the `useLicensedBinaries` feature flag


Add the `useLicensedBinaries` entry to the `.spec.package.spec.featureFlags` field in your `AppInstance` resource--for example:

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

A controller that's included in the InfluxDB 3.0 Clustered deployment will detect the License resource and extract an authorization token. It will validate the token and use it to authorize the IOx database engine to startup and begin functioning.

# Upgrading from a preview release of Clustered

This process is similar to first time installation. The normal upgrade workflow is to update the image reference in the Clustered AppImage resource, and then use `kubectl apply` to apply the change. For the best experience, you should get and apply a license file before updating to a licensed release.

## Upgrade process

1. If you are not already upgraded to at least the previous checkpoint release, you should perform those upgrades now
2. Request a license token from InfluxData  
   InfluxData will supply a `license.yml` file that encapsulates your license token as a custom Kubernetes resource
3. Apply this resource in your Clustered namespace  
   `kubectl apply -f license.yml -n <your_clustered_namespace>`  
   This will create a `License` resource in your namespace
4. Update your Clustered `AppInstance` resource, as described above
5. Upgrade to the licensed release

# Recovery process

In the event you deploy a release of Clustered without a valid license, many of the pods in that release will crash on startup, and will likely enter a `CrashLoopBackoff` state in Kubernetes without ever running or becoming healthy. If this happens during an upgrade, the Kubernetes control plane should detect it and prevent terminating the existing pods from the previous version. This means the previous version should continue running, and you can resolve the issues with the license without experiencing any service disruption. Once a valid License resource is applied, the new pods should begin to start up normally. This is an error recovery feature of Kubernetes, and it depends on the correct functioning of the Kubernetes cluster with enough capacity to perform rolling upgrades.

[setup-guide]: https://docs.influxdata.com/influxdb/clustered/install/configure-cluster/
[deployment-guide]: https://docs.influxdata.com/influxdb/clustered/install/deploy/