---
title: Set up prerequisites
description: >
  ...
menu:
  influxdb_clustered:
    name: Prerequisites
    parent: Install InfluxDB Clustered
weight: 101
---

InfluxDB Clustered requires the following prerequisites:

- **Kubernetes cluster**: version 1.25 or higher
- **Object storage**: AWS S3 or S3-compatible storage used to store the InfluxDB parquet files
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
3.  Install an Ingress controller in the cluster and a mechanism to obtain a
    valid TLS certificate (for example: [cert-manager](https://cert-manager.io/)
    or provide the certificate PEM manually out of band). InfluxDB Clustered
    currently supports [Ingress NGINX](https://github.com/kubernetes/ingress-nginx),
    but others may work.
4.  Ensure your Kubernetes cluster can access to the InfluxDB container registry,
    or, if running in an air-gapped environment, a local container registry to
    which you will need to copy the InfluxDB images.

{{% note %}}
It is strongly recommended that you run the PostgreSQL-compatible database
(that stores the InfluxDB Catalog) and the Object Store (that stores InfluxDB parquet files)
in a separate namespace from InfluxDB or external to Kubernetes entirely.

Running the Catalog database and Object Store in a separate namespace or outside
of Kubernetes makes management of the InfluxDB instance easier and helps to
prevents accidental data loss.
{{% /note %}}

### Cluster sizing recommendation

For a [medium-size workload](https://www.influxdata.com/resources/influxdb-3-0-vs-oss/),
InfluxData has tested the InfluxDB Clustered using the following AWS products
and sizing:

- S3 for object store (size is determined by how much data you write)
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
[Auth0](https://auth0.com/), but the any OAuth2 provider should work.
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

Ensure the identity you're using to connect to your S3-compatible object store has the correct
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

{{% expand "View requirements for Google Cloud Storage" %}}

When opting for Google Cloud Storage as the backing object store, the principal you are using should be granted the `roles/storage.objectUser` role.

For example, leveraging Google Service Accounts:

{{% code-placeholders "GCP_SERVICE_ACCOUNT|GCP_BUCKET" %}}
```bash
gcloud storage buckets add-iam-policy-binding gs://GCP_BUCKET --member="serviceAccount:GCP_SERVICE_ACCOUNT" --role="roles/storage.objectUser"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`GCP_SERVICE_ACCOUNT`{{% /code-placeholder-key %}}: The name of the Service Account.
- {{% code-placeholder-key %}}`GCP_BUCKET`{{% /code-placeholder-key %}}: The name of your Google Cloud Storage bucket.

{{% /expand %}}

{{< /expand-wrapper >}}

{{< page-nav next="/influxdb/clustered/install/auth/" nextText="Set up authentication" >}}
