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
- [Recover from a license misconfiguration](#recover-from-a-license-misconfiguration)
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
opt-in feature that allows InfluxData to introduce license enforcement to
customers, and allows customers to deactivate the feature if issues arise.
In the future, all releases of InfluxDB Clustered will require an active license
to use the product.

To opt into license enforcement, include the `useLicensedBinaries` feature flag
in your `AppInstance` resource _([See the example below](#enable-feature-flag))_.
To deactivate license enforcement, remove the `useLicensedBinaries` feature flag.
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
    Update your `AppInstance` resource to include the `useLicensedBinaries` feature flag.
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

If you deploy a licensed release of InfluxDB Clustered without an invalid or
expired license, many of the pods in your cluster will crash on startup and will
likely enter a `CrashLoopBackoff` state without ever running or becoming healthy.
Because the license is stored in a volume-mounted Kubernetes secret, invalid
licenses affect both old and new pods.

Once a valid `License` resource is applied, new pods will begin to start up normally.
Licenses are validated when the `License` resource is applied. If the license
is invalid when you attempt to apply it, the InfluxDB clustered license
controller will not add or update the required secret.

## Renew your license

Your InfluxData sales representative will proactively reach out to you regarding
license renewals in advance of your license expiration. You are also welcome to
contact your sales representative at any time.

---

## License enforcement

InfluxDB Clustered authorizes use of InfluxDB software through licenses issued
by InfluxData. The following sections provide information about InfluxDB Clustered
license enforcement.

### A valid license is required

_When you include the `useLicensedBinaries` feature flag_,
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

The following table outlines license expiry logging behavior to show when the log
messages begin, the level (`Warn` or `Error`), and the periodicity at which they
repeat.

| Starts at             | Log level | Log periodicity |
| :-------------------- | :-------- | :-------------- |
| 1 month before expiry | Warn      | 1 msg per hour  |
| 1 week before expiry  | Warn      | 1 msg per 5 min |
| At expiry             | Error     | 1 msg per 5 min |

#### Query brownout

Starting one month after your contractual license expiry, the InfluxDB
[Querier](/influxdb/clustered/reference/internals/storage-engine/#querier)
begins "browning out" requests. Brownouts return
`FailedPrecondition` response codes to queries for a portion of every hour.

| Starts at            | Brownout coverage  |
| :------------------- | :----------------- |
| 7 days after expiry  | 5 minutes per hour |
| 1 month after expiry | 100% of queries    |

**Brownouts only occur after the license has contractually expired**.
Also, they **only impact query operations**--no other operations (writes,
compaction, garbage collection, etc) are affected.
