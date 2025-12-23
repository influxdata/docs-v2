---
title: Deploy InfluxDB 3 Enterprise on Kubernetes
description: >
  Use the official Helm chart to deploy {{% product-name %}} on Kubernetes
  for predictable, repeatable deployments aligned with production best practices.
menu:
  influxdb3_enterprise:
    name: Deploy on Kubernetes
    parent: Install InfluxDB 3 Enterprise
weight: 101
related:
  - /influxdb3/enterprise/get-started/
  - /influxdb3/enterprise/admin/object-storage/
  - /influxdb3/enterprise/get-started/multi-server/
  - https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-enterprise, InfluxDB 3 Enterprise Helm Chart (GitHub)
alt_links:
  clustered: /influxdb3/clustered/install/set-up-cluster/configure-cluster/use-helm/
influxdb3/enterprise/tags: [install, kubernetes, helm]
---

Use the official {{% product-name %}} Helm chart to deploy {{< product-name >}}
on Kubernetes.
The Helm chart packages recommended deployment patterns into a single chart,
eliminating the need to maintain custom manifests or configure deployments from scratch.

> [!Note]
> #### Beta status
>
> The {{% product-name %}} Helm chart is currently in **beta**.
> During this phase, InfluxData is refining defaults and ensuring upgrades
> behave as operators expect.
> [Find support for {{% product-name %}}](#find-support) or
> [report a Helm chart issue](#report-an-issue-with-helm-charts).


- [Key features](#key-features)
- [Prerequisites](#prerequisites)
- [Install the Helm chart](#install-the-helm-chart)
- [Configuration options](#configuration-options)
  - [Object storage](#object-storage)
  - [Cluster configuration](#cluster-configuration)
  - [Ingress](#ingress)
- [Upgrade the deployment](#upgrade-the-deployment)
- [Uninstall](#uninstall)
- [Troubleshooting](#troubleshooting)
- [Report an issue with Helm charts](#report-an-issue-with-helm-charts)
- [Find support](#find-support)

## Key features

- **Simplified deployment**: Deploy {{< product-name >}} with a single Helm chart
  instead of maintaining custom Kubernetes manifests
- **Production patterns**: Includes recommended configurations for
  object storage, cluster settings, and environment-specific overrides
- **Standard Helm workflows**: Use familiar Helm mechanisms for installs,
  upgrades, and rollouts
- **Environment overrides**: Customize deployments for different environments
  (development, staging, production)

## Prerequisites

Before deploying {{< product-name >}} on Kubernetes, ensure you have:

- A Kubernetes cluster (version 1.25 or later)
- [Helm](https://helm.sh/docs/intro/install/) installed (version 3.0 or later)
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/) configured to access your cluster
- Object storage configured (Amazon S3, Azure Blob Storage, Google Cloud Storage,
  or S3-compatible storage such as MinIO)

### Licensing

{{< product-name >}} requires a license to run.
For more information about license types, activation, and management, see
[Manage your {{< product-name >}} license](/influxdb3/enterprise/admin/license/).

## Install the Helm chart

1.  Add the InfluxData Helm repository:

    ```bash
    helm repo add influxdata https://helm.influxdata.com/
    ```

2.  Update your Helm repositories:

    ```bash
    helm repo update
    ```

3.  Create a namespace for InfluxDB:

    ```bash
    kubectl create namespace influxdb
    ```

4.  Create a `values.yaml` file with your configuration.
    See [Configuration options](#configuration-options) for available settings.

5.  Install the chart:

    <!--pytest.mark.skip-->
    ```bash
    helm install influxdb3-{{< product-key >}} influxdata/influxdb3-{{< product-key >}} \
      --namespace influxdb \
      --values values.yaml
    ```

6.  Verify the deployment:

    <!--pytest.mark.skip-->
    ```bash
    kubectl get pods --namespace influxdb
    ```

## Configuration options

The Helm chart supports common production configurations through the `values.yaml` file.
Download the default values file as a starting point:

<!--pytest.mark.skip-->
```bash
curl -O https://raw.githubusercontent.com/influxdata/helm-charts/master/charts/influxdb3-{{< product-key >}}/values.yaml
```

### Object storage

Configure object storage for Parquet file storage.
{{< product-name >}} supports Amazon S3, Azure Blob Storage, Google Cloud Storage,
and S3-compatible storage.

{{< tabs-wrapper >}}
{{% tabs %}}
[Amazon S3](#)
[Azure Blob Storage](#)
[Google Cloud Storage](#)
[S3-compatible (MinIO)](#)
{{% /tabs %}}

{{% tab-content %}}
<!--------------------------------- BEGIN S3 --------------------------------->

Configure Amazon S3 as your object store:

```yaml { placeholders="S3_BUCKET|S3_REGION|S3_ACCESS_KEY|S3_SECRET_KEY" }
objectStore:
  type: s3
  bucket: S3_BUCKET
  region: S3_REGION
  accessKey: S3_ACCESS_KEY
  secretKey: S3_SECRET_KEY
```

Replace the following:

- {{% code-placeholder-key %}}`S3_BUCKET`{{% /code-placeholder-key %}}: your S3 bucket name
- {{% code-placeholder-key %}}`S3_REGION`{{% /code-placeholder-key %}}: AWS region (for example, `us-east-1`)
- {{% code-placeholder-key %}}`S3_ACCESS_KEY`{{% /code-placeholder-key %}}: AWS access key ID
- {{% code-placeholder-key %}}`S3_SECRET_KEY`{{% /code-placeholder-key %}}: AWS secret access key

<!---------------------------------- END S3 ---------------------------------->
{{% /tab-content %}}

{{% tab-content %}}
<!------------------------------- BEGIN Azure -------------------------------->

Configure Azure Blob Storage as your object store:

```yaml { placeholders="AZURE_CONTAINER|AZURE_ACCOUNT|AZURE_ACCESS_KEY" }
objectStore:
  type: azure
  bucket: AZURE_CONTAINER
  account: AZURE_ACCOUNT
  accessKey: AZURE_ACCESS_KEY
```

Replace the following:

- {{% code-placeholder-key %}}`AZURE_CONTAINER`{{% /code-placeholder-key %}}: your Azure container name
- {{% code-placeholder-key %}}`AZURE_ACCOUNT`{{% /code-placeholder-key %}}: Azure storage account name
- {{% code-placeholder-key %}}`AZURE_ACCESS_KEY`{{% /code-placeholder-key %}}: Azure storage access key

<!-------------------------------- END Azure --------------------------------->
{{% /tab-content %}}

{{% tab-content %}}
<!------------------------------- BEGIN GCS ---------------------------------->

Configure Google Cloud Storage as your object store:

```yaml { placeholders="GCS_BUCKET" }
objectStore:
  type: gcs
  bucket: GCS_BUCKET
  serviceAccountSecret:
    name: gcs-credentials
    key: credentials.json
```

Replace {{% code-placeholder-key %}}`GCS_BUCKET`{{% /code-placeholder-key %}}
with your Google Cloud Storage bucket name.

Create a Kubernetes secret with your service account credentials:

<!--pytest.mark.skip-->
```bash
kubectl create secret generic gcs-credentials \
  --from-file=credentials.json=/path/to/service-account.json \
  --namespace influxdb
```

<!-------------------------------- END GCS ----------------------------------->
{{% /tab-content %}}

{{% tab-content %}}
<!------------------------------- BEGIN MinIO -------------------------------->

Configure S3-compatible storage (such as MinIO) as your object store:

```yaml { placeholders="MINIO_BUCKET|MINIO_ENDPOINT|MINIO_ACCESS_KEY|MINIO_SECRET_KEY" }
objectStore:
  type: s3
  bucket: MINIO_BUCKET
  endpoint: MINIO_ENDPOINT
  accessKey: MINIO_ACCESS_KEY
  secretKey: MINIO_SECRET_KEY
  forcePathStyle: true
```

Replace the following:

- {{% code-placeholder-key %}}`MINIO_BUCKET`{{% /code-placeholder-key %}}: your MinIO bucket name
- {{% code-placeholder-key %}}`MINIO_ENDPOINT`{{% /code-placeholder-key %}}: MinIO endpoint URL (for example, `http://minio.minio.svc:9000`)
- {{% code-placeholder-key %}}`MINIO_ACCESS_KEY`{{% /code-placeholder-key %}}: MinIO access key
- {{% code-placeholder-key %}}`MINIO_SECRET_KEY`{{% /code-placeholder-key %}}: MinIO secret key

<!-------------------------------- END MinIO --------------------------------->
{{% /tab-content %}}

{{< /tabs-wrapper >}}

### Cluster configuration

Configure cluster-level settings:

```yaml
# Cluster name
clusterName: my-influxdb-cluster

# Resource limits and requests
resources:
  limits:
    cpu: "4"
    memory: 8Gi
  requests:
    cpu: "2"
    memory: 4Gi

# Persistent storage for Write-Ahead Log (WAL)
persistence:
  enabled: true
  size: 10Gi
  storageClass: standard
```

### Ingress

Configure ingress to expose the InfluxDB API:

```yaml { placeholders="INFLUXDB_HOST" }
ingress:
  enabled: true
  hosts:
    - INFLUXDB_HOST
  tls:
    - secretName: influxdb-tls
      hosts:
        - INFLUXDB_HOST
```

Replace {{% code-placeholder-key %}}`INFLUXDB_HOST`{{% /code-placeholder-key %}}
with your InfluxDB hostname (for example, `influxdb.example.com`).

## Upgrade the deployment

To upgrade your deployment after modifying `values.yaml`:

<!--pytest.mark.skip-->
```bash
helm upgrade influxdb3-{{< product-key >}} influxdata/influxdb3-{{< product-key >}} \
  --namespace influxdb \
  --values values.yaml
```

To upgrade to a new chart version:

<!--pytest.mark.skip-->
```bash
helm repo update
helm upgrade influxdb3-{{< product-key >}} influxdata/influxdb3-{{< product-key >}} \
  --namespace influxdb \
  --values values.yaml
```

## Uninstall

To remove the InfluxDB deployment:

<!--pytest.mark.skip-->
```bash
helm uninstall influxdb3-{{< product-key >}} --namespace influxdb
```

> [!Warning]
> Uninstalling the Helm release does not delete persistent volumes or
> data in object storage.
> To remove _all_ data, manually delete the persistent volume claims
> and object storage bucket.

## Troubleshooting

### View pod logs

To view logs from the InfluxDB pod:

<!--pytest.mark.skip-->
```bash
kubectl logs -l app.kubernetes.io/name=influxdb3-{{< product-key >}} \
  --namespace influxdb
```

### Check pod status

To check the status of InfluxDB pods:

<!--pytest.mark.skip-->
```bash
kubectl get pods --namespace influxdb -o wide
```

### Describe pod for events

To see detailed information and events for a pod:

```bash { placeholders="POD_NAME" }
kubectl describe pod POD_NAME --namespace influxdb
```

Replace {{% code-placeholder-key %}}`POD_NAME`{{% /code-placeholder-key %}}
with the name of the pod (from `kubectl get pods`).

## Report an issue with Helm charts

For Helm chart issues or feedback, see the Helm charts repository [issues page](https://github.com/influxdata/helm-charts/issues).

## Find support

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find community support for {{< product-name >}}.
Customers with a [commercial license](/influxdb3/enterprise/admin/license/) can contact [InfluxData Support](https://support.influxdata.com).

{{< page-nav prev="/influxdb3/enterprise/install/" prevText="Install InfluxDB 3 Enterprise" next="/influxdb3/enterprise/get-started/" nextText="Get started with InfluxDB 3 Enterprise" >}}
