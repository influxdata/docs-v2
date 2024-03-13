---
title: Set up prerequisites
description: >
  InfluxDB Clustered requires prerequisites such as a Kubernetes cluster, object storage,
  a PostgreSQL-compatitble database and more. Learn how to set up and configure the
  necessary prerequisites.
menu:
  influxdb_clustered:
    name: Prerequisites
    parent: Install InfluxDB Clustered
weight: 101
---

InfluxDB Clustered requires the following prerequisites:

- **Kubernetes cluster**: version 1.25 or higher
- **Object storage**: AWS S3 or S3-compatible storage used to store the InfluxDB parquet files. It is **highly** recommended to enable object versioning.
- **PostgreSQL-compatible database** _(AWS Aurora, hosted Postgres, etc.)_:
  Used to store the InfluxDB catalog
  - Supported PostgreSQL versions: **13.8–14.6**
- **OAuth 2.0 provider**:
  - Must support [Device Authorization Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow)
  - Tested and supported providers:
    - [Microsoft Entra ID _(formerly Azure Active Directory)_](https://www.microsoft.com/en-us/security/business/microsoft-entra)
    - [Keycloak](https://www.keycloak.org/)
    - [Auth0](https://auth0.com/)
- **TLS certificate**: for ingress to the cluster

## Set up a Kubernetes cluster

1.  Deploy a Kubernetes cluster. You must Kubernetes v1.25 or higher.
2.  Create two namespaces--`influxdb` and `kubit`.
3.  Install an [ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) in the cluster and a mechanism to obtain a
    valid TLS certificate (for example: [cert-manager](https://cert-manager.io/)
    or provide the certificate PEM manually out of band).
    To use the InfluxDB-specific ingress controller, install [Ingress NGINX](https://github.com/kubernetes/ingress-nginx).
4.  Ensure your Kubernetes cluster can access the InfluxDB container registry,
    or, if running in an air-gapped environment, a local container registry to
    which you can copy the InfluxDB images.

{{% note %}}
It is strongly recommended that you run the PostgreSQL-compatible database
(that stores the InfluxDB Catalog) and the Object Store (that stores InfluxDB Parquet files)
in a separate namespace from InfluxDB or external to Kubernetes entirely.

Running the Catalog database and Object Store in a separate namespace or outside
of Kubernetes makes management of the InfluxDB instance easier and helps to
prevents accidental data loss.
{{% /note %}}

### Cluster sizing recommendation

For a [medium-size workload](https://www.influxdata.com/resources/influxdb-3-0-vs-oss/),
InfluxData has tested InfluxDB Clustered using the following AWS products
and sizing:

- S3 for the object store (size is determined by how much data you write)
- Aurora Postgresql - serverless v2 scaling configuration (2-64 ACUs)
- EC2 instances - primarily m6i.2xlarge (8 CPU, 32GB RAM)
  - 3 m6i.2xlarge instances for ingesters and routers (with minimum of 2Gi of local storage)
  - 3 m6i.2xlarge instances for queriers
  - 1 m6i.2xlarge instance for compactors
  - 1 t3.large for the Kubernetes control plane

Your sizing may need to be different based on your environment and workload,
but this is a reasonable starting size for your initial testing.

## Set up local storage

The InfluxDB ingester pods need local storage to store the Write-Ahead Log (WAL).
The recommended minimum size of the local storage is 2 gibibytes (`2Gi`).

## Set up an OAuth2 provider

InfluxDB requires access to an OAuth2 authentication service to authenticate user access.
InfluxDB Clustered requires that the OAuth2 service supports
[Device Authorization Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow).
InfluxData has tested with [Microsoft Entra ID _(formerly Azure Active Directory)_](https://www.microsoft.com/en-us/security/business/microsoft-entra), [Keycloak](https://www.keycloak.org/), and
[Auth0](https://auth0.com/), but any OAuth2 provider should work.
To access the OAuth2 server, InfluxDB requires the following OAuth2 connection credentials:

  - Client ID
  - JWKS endpoint
  - Device authorization endpoint
  - Token endpoint.

## Set up client Software

On the system used to configure the cluster (not the cluster itself), install
the following:

- [kubectl _(v1.27)_](https://kubernetes.io/docs/reference/kubectl/kubectl/)
- [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md)

## Configure object storage permissions

Ensure the identity you use to connect to your S3-compatible object store has the correct
permissions to allow InfluxDB to perform all the actions it needs to.

{{< expand-wrapper >}}
{{% expand "View example AWS S3 access policy" %}}

The IAM role that you use to access AWS S3 should have the following policy:

{{% code-placeholders "S3_BUCKET_NAME" %}}
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

{{% code-placeholders "GCP_SERVICE_ACCOUNT|GCP_BUCKET" %}}
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

{{% code-placeholders "PRINCIPAL|AZURE_SUBSCRIPTION|AZURE_RESOURCE_GROUP|AZURE_STORAGE_ACCOUNT|AZURE_STORAGE_CONTAINER" %}}
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

{{< page-nav next="/influxdb/clustered/install/auth/" nextText="Set up authentication" >}}
