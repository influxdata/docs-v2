---
title: Manage your InfluxDB Clustered license
description: >
  Install and manage your InfluxDB Clustered license to authorize the use of
  the InfluxDB Clustered software.
menu:
  influxdb3_clustered:
    parent: Administer InfluxDB Clustered
    name: Manage your license
weight: 101
influxdb3/clustered/tags: [licensing]
related:
  - /influxdb3/clustered/install/set-up-cluster/licensing/
  - /influxdb3/clustered/admin/upgrade/
---

Install and manage your InfluxDB Clustered license to authorize the use of
the InfluxDB Clustered software.

- [Install your InfluxDB license](#install-your-influxdb-license)
- [Verify your license](#verify-your-license)
  - [Verify database components](#verify-database-components)
  - [Verify the Secret exists ](#verify-the-secret-exists)
  - [View license controller logs](#view-license-controller-logs)
- [Recover from a license misconfiguration](#recover-from-a-license-misconfiguration)
- [Renew your license](#renew-your-license)
- [License enforcement](#license-enforcement)
  - [A valid license is required](#a-valid-license-is-required)
  - [Periodic license checks](#periodic-license-checks)
  - [License grace periods](#license-grace-periods)
    - [License expiry logs](#license-expiry-logs)
    - [Query brownout](#query-brownout)

## Install your InfluxDB license

> [!Note]
> If setting up an InfluxDB Clustered deployment for the first time, first
> [set up the prerequisites](/influxdb3/clustered/install/set-up-cluster/licensing/) and
> [configure your cluster](/influxdb3/clustered/install/set-up-cluster/configure-cluster/).
> After your InfluxDB namespace is created and prepared, you can 
> install your license.

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

## Verify your license

After you have activated your license, use the following signals to verify the
license is active and functioning.

In your commands, replace the following:

- {{% code-placeholder-key %}}`NAMESPACE`{{% /code-placeholder-key %}}:
  your [InfluxDB namespace](/influxdb3/clustered/install/set-up-cluster/configure-cluster/#create-a-namespace-for-influxdb)
- {{% code-placeholder-key %}}`POD_NAME`{{% /code-placeholder-key %}}:
  your [InfluxDB Kubernetes pod](/influxdb3/clustered/install/set-up-cluster/deploy/#inspect-cluster-pods)

### Verify database components

After you [install your license](#install-your-influxdb-license),
run the following command to check that database pods start up and are in the
`Running` state:

<!--pytest.mark.skip-->

```bash
kubectl get pods -l app=iox --namespace influxdb
```

If a `Pod` fails to start, run the following command to view pod information:

<!--pytest.mark.skip-->

{{% code-placeholders "POD_NAME" %}}

```sh
kubectl describe pod POD_NAME --namespace influxdb
```

{{% /code-placeholders %}}

### Verify the `Secret` exists 

Run the following command to verify that the licensing activation created a
`iox-license` secret:

<!--pytest.mark.skip-->

```sh
kubectl get secret iox-license --namespace influxdb
```

If the secret doesn't exist,
[view `license-controller` logs](#view-license-controller-logs) for more
information or errors.

### View `license controller` logs

The `license controller` component creates a `Secret` named `iox-license` from
your `License`. To view `license controller` logs for troubleshooting, run the
following command:

<!--pytest.mark.skip-->

```sh
kubectl logs deployment/license-controller --namespace influxdb
```

## Recover from a license misconfiguration

If you deploy a licensed release of {{% product-name %}} with an invalid or
expired license, many of the pods in your cluster will crash on startup and will
likely enter a `CrashLoopBackoff` state without ever running or becoming healthy.
Because InfluxDB stores the license in a volume-mounted Kubernetes secret, invalid
licenses affect old and new pods.

After you apply a valid `License` resource, new pods will begin to start up normally.

InfluxDB validates a license when you apply it.
If the license is invalid when you try to apply it, the `license controller`
won't add or update the required secret.

## Renew your license

Before your license expires, your InfluxData sales representative will
contact you about license renewal.
You may also contact your sales representative at any time.

### Apply your renewed license

When you receive your renewed license file from InfluxData:

1. Use `kubectl` to apply the updated license:

   <!--pytest.mark.skip-->

   ```sh
   kubectl apply --filename license.yml --namespace influxdb
   ```

   > [!Note]
   > You may see a warning about missing `kubectl.kubernetes.io/last-applied-configuration` annotation.
   > This warning is expected and can be safely ignored—the license will be applied successfully.

2. [Verify the license update](#verify-your-license) by checking that:
   - The `iox-license` secret is updated
   - Database pods remain in `Running` state
   - No license-related errors appear in pod logs

### License validation timing

InfluxDB Clustered validates licenses:
- When pods start up
- Periodically during operation (roughly once per hour)

After applying a renewed license, the system should automatically detect and use the new license during the next validation cycle.

### Troubleshooting license renewal

If you experience query failures with "no license found" errors after applying a renewed license:

1. **Check the license secret**:

   <!--pytest.mark.skip-->

   ```sh
   kubectl get secret iox-license --namespace influxdb -o yaml
   ```

   Verify the secret was updated with the new license data.

2. **Check license controller logs**:

   <!--pytest.mark.skip-->

   ```sh
   kubectl logs deployment/license-controller --namespace influxdb
   ```

   Look for successful license processing messages or any errors.

3. **Verify pod status**:

   <!--pytest.mark.skip-->

   ```sh
   kubectl get pods -l app=iox --namespace influxdb
   ```

   Ensure all pods are in `Running` state and not crash-looping.

4. **If issues persist**, you may need to restart affected services:

   <!--pytest.mark.skip-->

   ```sh
   # Scale down the querier service
   kubectl scale deployment iox-shared-querier --replicas=0 --namespace influxdb

   # Wait for pods to terminate, then scale back up
   kubectl scale deployment iox-shared-querier --replicas=1 --namespace influxdb
   ```

   > [!Important]
   > Service restart should not be routinely necessary. If you consistently need to restart services after license renewal, contact InfluxData support.

---

## License enforcement

InfluxDB Clustered authorizes use of InfluxDB software through licenses issued
by InfluxData. The following sections provide information about InfluxDB Clustered
license enforcement.

### A valid license is required

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
[Querier](/influxdb3/clustered/reference/internals/storage-engine/#querier)
begins "browning out" requests. Brownouts return
`FailedPrecondition` response codes to queries for a portion of every hour.

| Starts at            | Brownout coverage  |
| :------------------- | :----------------- |
| 7 days after expiry  | 5 minutes per hour |
| 1 month after expiry | 100% of queries    |

**Brownouts only occur after the license has contractually expired**.
Also, they **only impact query operations**--no other operations (writes,
compaction, garbage collection, etc) are affected.
