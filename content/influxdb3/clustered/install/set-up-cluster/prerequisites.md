---
title: Set up prerequisites
description: >
  InfluxDB Clustered requires prerequisites such as a Kubernetes cluster, object storage,
  a PostgreSQL-compatitble database and more. Learn how to set up and configure the
  necessary prerequisites.
menu:
  influxdb3_clustered:
    name: Prerequisites
    parent: Set up your cluster
weight: 201
aliases:
  - /influxdb3/clustered/install/prerequisites/
---

InfluxDB Clustered requires the following prerequisite external dependencies:

- **kubectl command line tool**
- **Kubernetes cluster**
- **kubecfg kubit operator**
- **Kubernetes ingress controller**
- **Object storage**: AWS S3 or S3-compatible storage (including Google Cloud Storage
  or Azure Blob Storage) to store the InfluxDB Parquet files.
- **PostgreSQL-compatible database** *(AWS Aurora, hosted PostgreSQL, etc.)*:
  Stores the [InfluxDB Catalog](/influxdb3/clustered/reference/internals/storage-engine/#catalog).
- **Local or attached storage**:
  Stores the Write-Ahead Log (WAL) for
  [InfluxDB Ingesters](/influxdb3/clustered/reference/internals/storage-engine/#ingester).

## Install prerequisites

- [Install kubectl](#install-kubectl)
- [Set up your Kubernetes cluster](#set-up-your-kubernetes-cluster)
- [Install the kubecfg kubit operator](#install-the-kubecfg-kubit-operator)
- [Set up a Kubernetes ingress controller](#set-up-a-kubernetes-ingress-controller)
- [Set up your object store](#set-up-your-object-store)
- [Set up your PostgreSQL-compatible database](#set-up-your-postgresql-compatible-database)
- [Set up local or attached storage](#set-up-local-or-attached-storage)

### Install kubectl

Kubernetes provides the `kubectl` command line tool for communicating with a
Kubernetes cluster's control plane. `kubectl` is used to manage your InfluxDB
cluster.

Follow instructions to install `kubectl` on your local machine:

> \[!Note]
> InfluxDB Clustered Kubernetes deployments require `kubectl` 1.27 or higher.

- [Install kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
- [Install kubectl on macOS](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)
- [Install kubectl on Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)

#### Set up your Kubernetes cluster

1. Deploy a Kubernetes cluster. The deployment process depends on your
   Kubernetes environment or Kubernetes cloud provider. Refer to the
   [Kubernetes documentation](https://kubernetes.io/docs/home/) or your cloud
   provider's documentation for information about deploying a Kubernetes cluster.

2. Ensure `kubectl` can connect to your Kubernetes cluster.
   Your Manage [kubeconfig file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
   defines cluster connection credentials.

3. Create two namespaces--`influxdb` and `kubit`. Use
   [`kubectl create namespace`](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_namespace/) to create the
   namespaces:

   <!-- pytest.mark.skip -->

   ```bash
   kubectl create namespace influxdb && \
   kubectl create namespace kubit
   ```

4. Install an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)
   in the cluster and a mechanism to obtain a valid TLS certificate
   (for example: [cert-manager](https://cert-manager.io/) or provide the
   certificate PEM manually out of band).
   To use the InfluxDB-specific ingress controller, install [Ingress NGINX](https://github.com/kubernetes/ingress-nginx).

5. Ensure your Kubernetes cluster can access the InfluxDB container registry,
   or, if running in an air-gapped environment, a local container registry to
   which you can copy the InfluxDB images.

### Cluster sizing recommendation

As a starting point for a production workload, InfluxData recommends the
following sizing for {{% product-name %}} components:

{{< tabs-wrapper >}}
{{% tabs %}}
[AWS](#)
[Google Cloud Platform](#)
[Microsoft Azure](#)
[On-Prem](#)
{{% /tabs %}}
{{% tab-content %}}

<!--------------------------------- BEGIN AWS --------------------------------->

- **Catalog store (PostgreSQL-compatible database) (x1):**
  - *[See below](#postgresql-compatible-database-requirements)*
- **Ingesters and Routers (x3):**
  - EC2 m6i.2xlarge (8 CPU, 32 GB RAM)
  - Local storage: minimum of 2 GB (high-speed SSD)
- **Queriers (x3):**
  - EC2 m6i.2xlarge (8 CPU, 32 GB RAM)
- **Compactors (x1):**
  - EC2 m6i.2xlarge (8 CPU, 32 GB RAM)
- **Kubernetes Control Plane (x1):**
  - EC2 t3.large (2 CPU, 8 GB RAM)

<!---------------------------------- END AWS ---------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!--------------------------------- BEGIN GCP --------------------------------->

- **Catalog store (PostgreSQL-compatible database) (x1):**
  - *[See below](#postgresql-compatible-database-requirements)*
- **Ingesters and Routers (x3):**
  - GCE c2-standard-8 (8 CPU, 32 GB RAM)
  - Local storage: minimum of 2 GB (high-speed SSD)
- **Queriers (x3):**
  - GCE c2-standard-8 (8 CPU, 32 GB RAM)
- **Compactors (x1):**
  - GCE c2-standard-8 (8 CPU, 32 GB RAM)
- **Kubernetes Control Plane (x1):**
  - GCE c2d-standard-2 (2 CPU, 8 GB RAM)

<!---------------------------------- END GCP ---------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!-------------------------------- BEGIN Azure -------------------------------->

- **Catalog store (PostgreSQL-compatible database) (x1):**
  - *[See below](#postgresql-compatible-database-requirements)*
- **Ingesters and Routers (x3):**
  - Standard\_D8s\_v3 (8 CPU, 32 GB RAM)
  - Local storage: minimum of 2 GB (high-speed SSD)
- **Queriers (x3):**
  - Standard\_D8s\_v3 (8 CPU, 32 GB RAM)
- **Compactors (x1):**
  - Standard\_D8s\_v3 (8 CPU, 32 GB RAM)
- **Kubernetes Control Plane (x1):**
  - Standard\_B2ms (2 CPU, 8 GB RAM)

<!--------------------------------- END Azure --------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!------------------------------- BEGIN ON-PREM ------------------------------->

- **Catalog store (PostgreSQL-compatible database) (x1):**
  - CPU: 4-8 cores
  - RAM: 16-32 GB
- **Ingesters and Routers (x3):**
  - CPU: 8 cores
  - RAM: 32 GB
  - Local storage: 2 GB (high-speed SSD)
- **Queriers (x3):**
  - CPU: 8 cores
  - RAM: 32 GB
- **Compactors (x1):**
  - CPU: 8 cores
  - RAM: 32 GB
- **Kubernetes Control Plane (x1):**
  - CPU: 2 cores
  - RAM: 8 GB

<!-------------------------------- END ON-PREM -------------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

Your sizing may need to be different based on your environment, cloud provider,
and workload, but this is a reasonable starting size for your initial testing.

### Install the kubecfg kubit operator

The [`kubecfg kubit` operator](https://github.com/kubecfg/kubit) (maintained by InfluxData)
simplifies the installation and management of the InfluxDB Clustered package.
It manages the application of the jsonnet templates used to install, manage, and
update an InfluxDB cluster.

> \[!Note]
>
> #### The InfluxDB Clustered Helm chart includes the kubit operator
>
> If using the [InfluxDB Clustered Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-clustered)
> to deploy your InfluxDB cluster, you do not need to install the kubit operator
> separately. The Helm chart installs the kubit operator.

Use `kubectl` to install the [kubecfg kubit](https://github.com/kubecfg/kubit)
operator **v0.0.22 or later**.

<!-- pytest.mark.skip -->

```bash
kubectl apply -k 'https://github.com/kubecfg/kubit//kustomize/global?ref=v0.0.22'
```

### Set up a Kubernetes ingress controller

[Kubernetes ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
routes HTTP/S requests to services within the cluster and requires deploying an
[ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/).
You can provide your own ingress or you can install
[Nginx Ingress Controller](https://github.com/kubernetes/ingress-nginx) to use
the InfluxDB-defined ingress.

> \[!Important]
>
> #### Allow gRPC/HTTP2
>
> InfluxDB Clustered components use gRPC/HTTP2 protocols.
> If using an external load balancer,
> you may need to explicitly enable these protocols on your load
> balancers.

### Set up your object store

InfluxDB Clustered supports AWS S3 or S3-compatible storage (including Google
Cloud Storage, Azure Blob Storage, and MinIO) for storing
[InfluxDB Parquet files](/influxdb3/clustered/reference/internals/storage-engine/#object-store).
Refer to your object storage provider's documentation for information about setting up an object store:

- [Create an AWS S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html)
- [Create a Google Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets)
- [Create an Azure Blog Storage container](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container)
- [Create a MinIO bucket](https://min.io/docs/minio/linux/reference/minio-mc/mc-mb.html)

{{% caption %}}
\* This list does not represent all S3-compatible object stores
that work with InfluxDB Clustered. Other S3-compatible object stores should work
as well.
{{% /caption %}}

> \[!Important]
>
> #### Object storage recommendations
>
> We **strongly** recommend the following:
>
> - ##### Enable object versioning
>
>   Enable object versioning in your object store.
>   Refer to your object storage provider's documentation for information about
>   enabling object versioning.
>
> - ##### Run the object store in a separate namespace or outside of Kubernetes
>
>   Run the Object store in a separate namespace from InfluxDB or external to
>   Kubernetes entirely. Doing so makes management of the InfluxDB cluster easier
>   and helps to prevent accidental data loss. While deploying everything in the
>   same namespace is possible, we do not recommend it for production environments.

#### Configure object storage permissions

Ensure the identity you use to connect to your S3-compatible object store has
the correct permissions to allow InfluxDB to perform all the actions it needs to.

{{< expand-wrapper >}}
{{% expand "View example AWS S3 access policy" %}}

The IAM role that you use to access AWS S3 should have the following policy:

{{% code-placeholders "S3\_BUCKET\_NAME" %}}

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Action": [
                "s3:PutObjectAcl",
                "s3:PutObject",
                "s3:ListMultipartUploadParts",
                "s3:GetObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:AbortMultipartUpload"
            ],
            "Resource": "arn:aws:s3:::S3_BUCKET_NAME/*",
        },
        {
            "Sid": "",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation"
            ],
            "Resource": "arn:aws:s3:::S3_BUCKET_NAME",
        },
        {
            "Sid": "",
            "Effect": "Allow",
            "Action": "s3:ListAllMyBuckets",
            "Resource": "*",
        }
    ]
}
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`S3_BUCKET_NAME`{{% /code-placeholder-key %}}: Name of your AWS S3 bucket

{{% /expand %}}

{{% expand "View the requirements for Google Cloud Storage" %}}

To use Google Cloud Storage (GCS) as your object store, your [IAM principal](https://cloud.google.com/iam/docs/overview) should be granted the `roles/storage.objectUser` role.
For example, if using [Google Service Accounts](https://cloud.google.com/iam/docs/service-account-overview):

{{% code-placeholders "GCP\_SERVICE\_ACCOUNT|GCP\_BUCKET" %}}

```bash
gcloud storage buckets add-iam-policy-binding \
    gs://GCP_BUCKET \
    --member="serviceAccount:GCP_SERVICE_ACCOUNT" \
    --role="roles/storage.objectUser"
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`GCP_SERVICE_ACCOUNT`{{% /code-placeholder-key %}}: Google Service Account name
- {{% code-placeholder-key %}}`GCP_BUCKET`{{% /code-placeholder-key %}}: GCS bucket name

{{% /expand %}}

{{% expand "View the requirements for Azure Blob Storage" %}}

To use Azure Blob Storage as your object store, your [service principal](https://learn.microsoft.com/en-us/entra/architecture/service-accounts-principal)
should be granted the `Storage Blob Data Contributor` role.
This is a built-in role for Azure which encompasses common permissions.
You can assign it using the following command:

{{% code-placeholders "PRINCIPAL|AZURE\_SUBSCRIPTION|AZURE\_RESOURCE\_GROUP|AZURE\_STORAGE\_ACCOUNT|AZURE\_STORAGE\_CONTAINER" %}}

```bash
az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee PRINCIPAL \
    --scope "/subscriptions/AZURE_SUBSCRIPTION/resourceGroups/AZURE_RESOURCE_GROUP/providers/Microsoft.Storage/storageAccounts/AZURE_STORAGE_ACCOUNT/blobServices/default/containers/AZURE_STORAGE_CONTAINER"
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`PRINCIPAL`{{% /code-placeholder-key %}}: A user, group, or service principal that the role should be assigned to
- {{% code-placeholder-key %}}`AZURE_SUBSCRIPTION`{{% /code-placeholder-key %}}: Your Azure subscription
- {{% code-placeholder-key %}}`AZURE_RESOURCE_GROUP`{{% /code-placeholder-key %}}: The resource group that your Azure Blob storage account belongs to
- {{% code-placeholder-key %}}`AZURE_STORAGE_ACCOUNT`{{% /code-placeholder-key %}}: Azure Blob storage account name
- {{% code-placeholder-key %}}`AZURE_STORAGE_CONTAINER`{{% /code-placeholder-key %}}: Container name in your Azure Blob storage account

{{% /expand %}}

{{< /expand-wrapper >}}

> \[!Note]
> To configure permissions with MinIO, use the
> [example AWS access policy](#view-example-aws-s3-access-policy).

### Set up your PostgreSQL-compatible database

The [InfluxDB Catalog](/influxdb3/clustered/reference/internals/storage-engine/#catalog)
that stores metadata related to your time series data requires a PostgreSQL or
PostgreSQL-compatible database *(AWS Aurora, hosted PostgreSQL, etc.)*.
The process for installing and setting up your PostgreSQL-compatible database
depends on the database and database provider you use.
Refer to your database's or provider's documentation for setting up your
PostgreSQL-compatible database.

#### PostgreSQL-compatible database requirements

- PostgreSQL version **13 or 14**.
- **Minimum of 4 GB of memory** or equivalent provider-specific units.
- To avoid conflicts and prevent issues caused by shared usage with other
  applications, ensure that your PostgreSQL-compatible instance is dedicated
  exclusively to InfluxDB.

> \[!Note]
> We **strongly** recommended running the PostgreSQL-compatible database
> in a separate namespace from InfluxDB or external to Kubernetes entirely.
> Doing so makes management of the InfluxDB cluster easier and helps to prevent
> accidental data loss.
>
> While deploying everything in the same namespace is possible, we do not
> recommend it for production environments.

### Set up local or attached storage

The [InfluxDB Ingester](/influxdb3/clustered/reference/internals/storage-engine/#ingester)
needs local or attached storage to store the Write-Ahead Log (WAL).
The read and write speed of the attached storage affects the write performance
of the Ingester, so the faster the storage device, the better your write
performance will be.
The recommended minimum size of the local storage is 2 gibibytes (`2Gi`).

Installation and setup of local or attached storage depends on your underlying
hardware or cloud provider. Refer to your provider's documentation for
information about installing and configuring local storage.

{{< page-nav prev="/influxdb3/clustered/install/set-up-cluster/" prevText="Back" next="/influxdb3/clustered/install/set-up-cluster/configure-cluster" nextText="Configure your cluster" >}}
