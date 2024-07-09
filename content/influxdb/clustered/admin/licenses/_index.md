---
title: Manage your InfluxDB Clustered license
description: >
  ...
menu:
  influxdb_clustered:
    parent: Administer InfluxDB Clustered
    name: Manage your InfluxDB license
weight: 101
influxdb/clustered/tags: [license]
---

{{% note %}}
_Currently optional, but will be required in future releases of InfluxDB Clustered._
{{% /note %}}

## Install your InfluxDB license

1.  If you haven't already, [request an InfluxDB Clustered license](https://influxdata.com/contact-sales).
2.  InfluxData provides you with a `license.yml` file that encapsulates your
    license token as a custom Kubernetes resource.
3.  Use `kubectl` to apply and create the `License` resource in your InfluxDB namespace:

    ```sh
    kubectl apply --filename license.yml --namespace influxdb
    ```

4.  Update your `AppInstance` resource to enable the `useLicensedBinaries` feature flag.
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

InfluxDB Clustered detects the `License` resource, extracts and validates the
license token, and then authorizes InfluxDB to start.

<!-- --- -->

- License expiration
  - Expiration date is within 30 days
    - Log license expiration warning every hour.
  - Expiration date is within 7 days
    - Log license expiration warning every five minutes.
  - Expiration date is past due
    - Log license expiration error every five minutes.
  - Expiration date is over 7 days
    - Log license expiration error every five minutes.
    - Return license expired error on query requests for the first five minutes of every hour.
      Errors should be returned on HTTP and gRPC (Flight) requests.
      This provides consistent behavior across all query pods and lower likelihood customers will misinterpret the errors as a legitimate query issue.
  - Expiration date is over 30 days
    - Log license expiration error every five minutes.
    - Return license expired error on every query request.
  - Expiration date is over 3 months
    - All IOx processes shut down, next startup they behave as if unlicensed

- Renew your license

<!-- Under what conditions (beside expiration) can a license be revoked? -->
