---
title: Bypass your identity provider
description: >
  InfluxDB clustered generates a valid access token (known as the _admin token_)
  that can be used in development and testing environments in lieu of configuring
  and using an OAuth2 identity provider.
menu:
  influxdb_clustered:
    parent: Administer InfluxDB Clustered
weight: 207
---

{{< product-name >}} generates a valid access token (known as the _admin token_)
for managing databases and database tokens and stores it as a secret in your
InfluxDB namespace.
You can use the admin token with the [`influxctl` CLI](/influxdb/clustered/reference/cli/influxctl/)
in lieu of configuring and using an OAuth2 identity provider.

{{% warn %}}
#### Do not use in production

This feature is for development and testing purposes only and should not be used
in a production InfluxDB cluster.
{{% /warn %}}

## Configure influxctl to use the admin token

{{% code-placeholders "INFLUXDB_NAMESPACE|DIRECTORY_PATH" %}}

1.  If you haven't already, [download, install, or upgrade to `influxctl` v2.2.0 or newer](/influxdb/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Use `kubectl` to retrieve the admin token from your cluster namespace's
    secret store and copy it to a file:

    ```sh
    kubectl get secrets/admin-token \
      --template={{.data.token}} \
      --namespace INFLUXDB_NAMESPACE | base64 -d > token.json
    ```

3.  Update your `influxctl` connection profile with a new `[profile.auth.token]`
    section.
4.  In the `[profile.auth.token]` section, assign the `token_file` setting to the location of your saved admin token file:

    ```toml
    [[profile]]
    # ...
      [profile.auth.token]
        token_file = "/DIRECTORY_PATH/token.json"
    ```
{{% /code-placeholders %}}

In the examples above, replace the following:

- {{% code-placeholder-key %}}`INFLUXDB_NAMESPACE`{{% /code-placeholder-key %}}:
  The name of your InfluxDB namespace.
- {{% code-placeholder-key %}}`DIRECTORY_PATH`{{% /code-placeholder-key %}}:
  The directory path to your admin token file, `token.json`.

## Revoke an admin token

The admin token is a long-lived access token.
The only way to revoke the token is to do the following:

{{% code-placeholders "INFLUXDB_NAMESPACE|KEY_GEN_JOB|001" %}}

1.  Delete the `rsa-keys` secret from your InfluxDB cluster's context and namespace:

    ```sh
    kubectl delete secrets/rsa-keys --namespace INFLUXDB_NAMESPACE
    ```

2.  Rerun the `key-gen` job:

    1.  List the jobs in your InfluxDB namespace to find the key-gen job pod:

        ```
        # List jobs to find the key-gen job pod
        kubectl get jobs --namespace INFLUXDB_NAMESPACE
        ```

    2.  Run the key-gen job and increment the job number as needed:
    
        ```sh
        kubectl create job \
          --from=job/KEY_GEN_JOB key-gen-001 \
          --namespace INFLUXDB_NAMESPACE
        ```

3.  Restart the `token-management` service:

    ```sh
    kubectl delete pods \
      --selector app=token-management \
      --namespace INFLUXDB_NAMESPACE
    ```

{{% /code-placeholders %}}

In the examples above, replace the following:

- {{% code-placeholder-key %}}`INFLUXDB_NAMESPACE`{{% /code-placeholder-key %}}:
  The name of your InfluxDB namespace.
- {{% code-placeholder-key %}}`KEY_GEN_JOB`{{% /code-placeholder-key %}}:
  The name of the key-gen job pod.
- {{% code-placeholder-key %}}`001`{{% /code-placeholder-key %}}:
  A unique number used to increment the key-gen job.

{{% note %}}
To create a new admin token after revoking the existing one, rerun the
`create-admin-token` job.
{{% /note %}}
