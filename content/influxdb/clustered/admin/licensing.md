---
title: Manage your InfluxDB Clustered license
description: >
  Install and manage your InfluxDB Clustered license to authorize the use of
  the InfluxDB Clustered software.
menu:
  influxdb_clustered:
    parent: Administer InfluxDB Clustered
    name: Manage your license
weight: 101
influxdb/clustered/tags: [licensing]
related:
  - /influxdb/clustered/install/licensing/
  - /influxdb/clustered/admin/upgrade/
---

Install and manage your InfluxDB Clustered license to authorize the use of
the InfluxDB Clustered software.

- [Install your InfluxDB license](#install-your-influxdb-license)
- [Recover from an unlicensed release](#recover-from-an-unlicensed-release)
- [Renew your license](#renew-your-license)
- [License enforcement](#license-enforcement)
  - [A valid license is required](#a-valid-license-is-required)
  - [Periodic license checks](#periodic-license-checks)
  - [License grace periods](#license-grace-periods)
    - [License expiry logs](#license-expiry-logs)
    - [Query brownout](#query-brownout)

{{% note %}}
#### License enforcement is currently an opt-in feature

In currently available versions of InfluxDB Clustered, license enforcement is an
opt-in feature. This allows InfluxData to introduce license enforcement to a
limited number of customers in a way that can easily be disabled if issues arise.
In the future, all releases of InfluxDB Clustered will require an active license
to use the product.

To opt into license enforcement, enable the `useLicensedBinaries` feature flag
in your `AppInstance` resource _([See the example below](#enable-feature-flag))_.

{{% /note %}}

## Install your InfluxDB license

{{% note %}}
If setting up an InfluxDB Clustered deployment for the first time, first
[set up the prerequisites](/influxdb/clustered/install/licensing/) and
[configure your cluster](/influxdb/clustered/install/configure-cluster/).
You will be able to install your license after the `influxdb` namespace is
created and prepared.
{{% /note %}}

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

## Recover from a license misconfiguration

If you deploy a licensed release of InfluxDB Clustered without a valid license,
many of the pods in your cluster will crash on startup and will likely enter a
`CrashLoopBackoff` state without ever running or becoming healthy.
If this happens during an upgrade, the Kubernetes control plane should detect
the crash loop of the new pods and prevent the termination of existing pods.
The previous version should continue running without experiencing any service
disruption while you work to provide a valid license.

Once a valid `License` resource is applied, new pods should begin to start up normally.
This is an error recovery feature of Kubernetes that depends on a correctly
functioning Kubernetes cluster with enough capacity to perform rolling upgrades.

## Renew your license

Your InfluxData sales representative will proactively reach out to you regarding
license renewals in advance of your license expiration. You are also welcome to
contact your sales representative at any time.

---

## License enforcement

InfluxDB Clustered authorizes use of InfluxDB software through licenses issued
by InfluxData. The following provides information about InfluxDB Clustered
license enforcement.

### A valid license is required

_When the `useLicensedBinaries` feature flag is enabled_,
Kubernetes pods running in your InfluxDB cluster must have a valid `License`
resource to run. Licenses are issued by InfluxData. If there is no `License`
resource installed in your cluster, one of two things may happen:

- Pods may become stuck in a `ContainerCreating` state if the cluster has
  never had a valid `License` resource installed.
- If an expired or invalid license is installed in the cluster, pods will become
  stuck in a `CrashLoopBackoff` state.
  Pod containers will attempt to start, detect the invalid license condition,
  print an error message, and then exit with a non-zero exit code.

### Periodic license checks

During normal operation, pods in your InfluxDB cluster check for a valid license
once per hour. You may see messages in your pod logs related to this behavior.

### License grace periods

When InfluxData issues a license, it is configured with two expiry dates.
The first is the expiry date of the contractual license. The second is a hard
expiry of the license credentials, after which pods in your cluster will begin
crash-looping until a new, valid license is installed in the cluster.

The period of time between the contractual license expiry and the hard license
expiry is considered the _grace period_. The standard grace period is 90 days,
but this may be negotiated as needed with your InfluxData sales representative.

#### License expiry logs

The table below outlines license expiry logging behavior. It shows when the log
messages begin, the level (warn vs error), and the periodicity at which they
repeat.

| Starts at             | Log level | Log periodicity |
| :-------------------- | :-------- | :-------------- |
| 1 month before expiry | Warn      | 1 msg per hour  |
| 1 week before expiry  | Warn      | 1 msg per 5 min |
| At expiry             | Error     | 1 msg per 5 min |

#### Query brownout

Starting one month after your contractual license expiry, the InfluxDB
[Querier](/influxdb/clustered/reference/internals/storage-engine/#querier)
begins "browning out" requests. Brownouts consist of returning
`FailedPrecondition` response codes to queries for a portion of every hour.

| Starts at            | Brownout coverage  |
| :------------------- | :----------------- |
| 7 days after expiry  | 5 minutes per hour |
| 1 month after expiry | 100% of queries    |

**Brownouts only occur after the license has contractually expired**.
Also, they **only impact query operations**. No other operations (writes,
compaction, garbage collection, etc) are affected.
