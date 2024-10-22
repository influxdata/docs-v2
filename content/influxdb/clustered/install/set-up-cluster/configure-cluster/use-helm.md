---
title: Configure your InfluxDB cluster using Helm
description: >
  Use Helm to configure and deploy your InfluxDB Clustered `AppInstance` resource.
menu:
  influxdb_clustered:
    name: Use Helm
    parent: Configure your cluster
weight: 230
list_code_example: |
  <a class="btn arrow" style="margin-bottom:3rem;" href="/influxdb/clustered/install/set-up-cluster/configure-cluster/use-helm/">Use Helm to configure AppInstance <span class="cf-icon CaretOutlineRight"></span></a>
related:
  - /influxdb/clustered/admin/users/
aliases:
  - /influxdb/clustered/install/configure-cluster/use-helm/
---

Manage your InfluxDB Clustered deployments using Kubernetes and apply configuration settings using a YAML configuration file.
The [InfluxDB Clustered Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-clustered)
provides an alternative method for deploying your InfluxDB cluster using
[Helm](https://helm.sh/). It acts as a wrapper for the InfluxDB `AppInstance`
resource. When using Helm, apply configuration options in a
a `values.yaml` on your local machine.

 InfluxData provides the following items:

- **`influxdb-docker-config.json`**: an authenticated Docker configuration file.
  The InfluxDB Clustered software is in a secure container registry.
  This file grants access to the collection of container images required to
  install InfluxDB Clustered.

---

## Configuration data

When ready to configure your InfluxDB cluster, have the following information
available:

- **InfluxDB cluster hostname**: the hostname Kubernetes uses to expose InfluxDB
  API endpoints
- **PostgreSQL-style data source name (DSN)**: used to access your
  PostgreSQL-compatible database that stores the InfluxDB Catalog.
- **Object store credentials** _(AWS S3 or S3-compatible)_
  - Endpoint URL
  - Access key
  - Bucket name
  - Region (required for S3, may not be required for other object stores)
- **Local storage information** _(for ingester pods)_
  - Storage class
  - Storage size

InfluxDB is deployed to a Kubernetes namespace which, throughout the following
installation procedure, is referred to as the _target_ namespace.
For simplicity, we assume this namespace is `influxdb`, however
you may use any name you like.

{{% note %}}
#### Set namespaceOverride if using a namespace other than influxdb

If you use a namespace name other than `influxdb`, update the `namespaceOverride`
field in your `values.yaml` to use your custom namespace name.
{{% /note %}}

### AppInstance resource

The InfluxDB installation, update, and upgrade processes are driven by editing
and applying a [Kubernetes custom resource (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
called `AppInstance`.
The `AppInstance` CRD is included in the InfluxDB Clustered Helm chart and can
be configured by applying custom settings in the `values.yaml` included in the
chart.

The `AppInstance` resource contains key information, such as:

- Name of the target namespace
- Version of the InfluxDB package
- Reference to the InfluxDB container registry pull secrets
- Hostname where the InfluxDB API is exposed
- Parameters to connect to [external prerequisites](/influxdb/clustered/install/set-up-cluster/prerequisites/)

### kubecfg kubit operator

The InfluxDB Clustered Helm chart also includes the
[`kubecfg kubit` operator](https://github.com/kubecfg/kubit) (maintained by InfluxData)
which simplifies the installation and management of the InfluxDB Clustered package.
It manages the application of the jsonnet templates used to install, manage, and
update an InfluxDB cluster.

{{% note %}}
If you already installed the `kubecfg kubit` operator separately when
[setting up prerequisites](/influxdb/clustered/install/set-up-cluster/prerequisites/#install-the-kubecfg-kubit-operator)
for your cluster, in your `values.yaml`, set `skipOperator` to `true`.

```yaml
skipOperator: true
```
{{% /note %}}

## Configure your cluster

1.  [Install Helm](#install-helm)
2.  [Create a values.yaml file](#create-a-valuesyaml-file)
3.  [Configure access to the InfluxDB container registry](#configure-access-to-the-influxdb-container-registry)
4.  [Modify the configuration file to point to prerequisites](#modify-the-configuration-file-to-point-to-prerequisites)

### Install Helm

If you haven't already, [install Helm](https://helm.sh/docs/intro/install/) on
your local machine.

### Create a values.yaml file

Download or copy the base `values.yaml` for the InfluxDB Clustered Helm chart
from GitHub and store it locally. For example--if using cURL:

```bash
curl -O https://raw.githubusercontent.com/influxdata/helm-charts/master/charts/influxdb3-clustered/values.yaml
```

Or you can copy the default `values.yaml` from GitHub:

<a href="https://github.com/influxdata/helm-charts/blob/master/charts/influxdb3-clustered/values.yaml" class="btn github">View values.yaml on GitHub</a>

### Configure access to the InfluxDB container registry

The provided `influxdb-docker-config.json` grants access to a collection of
container images required to run InfluxDB Clustered.
Your Kubernetes Cluster needs access to the container registry to pull down and
install InfluxDB.

When pulling images, there are two main scenarios:

- You have a Kubernetes cluster that can pull from the InfluxData container registry.
- You run in an environment with no network interfaces ("air-gapped") and you
  can only access a private container registry.

In both scenarios, you need a valid container registry secret file.
Use [crane](https://github.com/google/go-containerregistry/tree/main/cmd/crane)
to create a container registry secret file.

1.  [Install crane](https://github.com/google/go-containerregistry/tree/main/cmd/crane#installation)
2.  Use the following command to create a container registry secret file and
    retrieve the necessary secrets:

{{% code-placeholders "PACKAGE_VERSION" %}}

```sh
mkdir /tmp/influxdbsecret
cp influxdb-docker-config.json /tmp/influxdbsecret/config.json
DOCKER_CONFIG=/tmp/influxdbsecret \
  crane manifest \
  us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:PACKAGE_VERSION
```

{{% /code-placeholders %}}

---

Replace {{% code-placeholder-key %}}`PACKAGE_VERSION`{{% /code-placeholder-key %}}
with your InfluxDB Clustered package version.

---

If your Docker configuration is valid and you’re able to connect to the container
registry, the command succeeds and the output is the JSON manifest for the Docker
image, similar to the following:

{{< expand-wrapper >}}
{{% expand "View JSON manifest" %}}

```json
{
  "schemaVersion": 2,
  "config": {
    "mediaType": "application/vnd.kubecfg.bundle.config.v1+json",
    "digest": "sha256:6900d2f248e678176c68f3768e7e48958bb96a59232070ff31b3b018cf299aa7",
    "size": 8598
  },
  "layers": [
    {
      "mediaType": "application/vnd.kubecfg.bundle.tar+gzip",
      "digest": "sha256:7c1d62e76287035a9b22b2c155f328fae9beff2c6aa7a09a2dd2697539f41d98",
      "size": 404059
    }
  ],
  "annotations": {
    "org.opencontainers.image.created": "1970-01-01T00:00:00Z",
    "org.opencontainers.image.revision": "unknown",
    "org.opencontainers.image.source": "kubecfg pack"
  }
}
```

{{% /expand %}}
{{< /expand-wrapper >}}

If there’s a problem with the Docker configuration, crane won't retrieve the
manifest and the output is similar to the following error:

```sh
Error: fetching manifest us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:<package-version>: GET https://us-docker.pkg.dev/v2/token?scope=repository%3Ainfluxdb2-artifacts%2Fclustered%2Finfluxdb%3Apull&service=: DENIED: Permission "artifactregistry.repositories.downloadArtifacts" denied on resource "projects/influxdb2-artifacts/locations/us/repositories/clustered" (or it may not exist)
```

{{< tabs-wrapper >}}
{{% tabs %}}
[Public registry (non-air-gapped)](#)
[Private registry (air-gapped)](#)
{{% /tabs %}}

{{% tab-content %}}

<!--------------------------- BEGIN Public Registry --------------------------->

#### Public registry (non-air-gapped)

To pull from the InfluxData registry, you need to create a Kubernetes secret in the target namespace.

```sh
kubectl create secret docker-registry gar-docker-secret \
  --from-file=.dockerconfigjson=influxdb-docker-config.json \
  --namespace influxdb
```

If successful, the output is the following:

```text
secret/gar-docker-secret created
```

By default, this secret is named `gar-docker-secret`.
If you change the name of this secret, you must also change the value of the
`imagePullSecrets.name` field in your `values.yaml`.

<!---------------------------- END Public Registry ---------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!--------------------------- BEGIN Private Registry -------------------------->

#### Private registry (air-gapped)

If your Kubernetes cluster can't use a public network to download container images
from our container registry, do the following:

1.  Copy the images from the InfluxDB registry to your own private registry.
2.  Configure your `AppInstance` resource with a reference to your private
    registry name.
3.  Provide credentials to your private registry.

The list of images that you need to copy is included in the package metadata.
You can obtain it with any standard OCI image inspection tool. For example:

{{% code-placeholders "PACKAGE_VERSION" %}}

```sh
DOCKER_CONFIG=/tmp/influxdbsecret \
crane config \
  us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:PACKAGE_VERSION \
  | jq -r '.metadata["oci.image.list"].images[]' \
  > /tmp/images.txt
```

{{% /code-placeholders %}}

The output is a list of image names, similar to the following:

```
us-docker.pkg.dev/influxdb2-artifacts/idpe/idpe-cd-ioxauth@sha256:5f015a7f28a816df706b66d59cb9d6f087d24614f485610619f0e3a808a73864
us-docker.pkg.dev/influxdb2-artifacts/iox/iox@sha256:b59d80add235f29b806badf7410239a3176bc77cf2dc335a1b07ab68615b870c
...
```

Use `crane` to copy the images to your private registry:

{{% code-placeholders "REGISTRY_HOSTNAME" %}}

```sh
</tmp/images.txt xargs -I% crane cp % REGISTRY_HOSTNAME/%
```

{{% /code-placeholders %}}

---

Replace {{% code-placeholder-key %}}`REGISTRY_HOSTNAME`{{% /code-placeholder-key %}}
with the hostname of your private registry--for example:

```text
myregistry.mydomain.io
```

---

Set the
`images.registryOverride` field in your `values.yaml` to the location of your
private registry--for example:

{{% code-placeholders "REGISTRY_HOSTNAME" %}}

```yml
images:
  registryOverride: REGISTRY_HOSTNAME
```

{{% /code-placeholders %}}

<!---------------------------- END Private Registry --------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Modify the configuration file to point to prerequisites

Update your `values.yaml` file with credentials necessary to connect your
cluster to your prerequisites.

- [Configure ingress](#configure-ingress)
- [Configure the object store](#configure-the-object-store)
- [Configure the catalog database](#configure-the-catalog-database)
- [Configure local storage for ingesters](#configure-local-storage-for-ingesters)

#### Configure ingress

To configure ingress, provide values for the following fields in your
`values.yaml`:

- **`ingress.hosts`: Cluster hostnames**

  Provide the hostnames that Kubernetes should use to expose the InfluxDB API
  endpoints--for example: `{{< influxdb/host >}}`.

  _You can provide multiple hostnames. The ingress layer accepts incoming
  requests for all listed hostnames. This can be useful if you want to have
  distinct paths for your internal and external traffic._

  {{% note %}}
You are responsible for configuring and managing DNS. Options include:

- Manually managing DNS records
- Using [external-dns](https://github.com/kubernetes-sigs/external-dns) to
  synchronize exposed Kubernetes services and ingresses with DNS providers.
  {{% /note %}}

- **`ingress.tlsSecretName`: TLS certificate secret name**

  (Optional): Provide the name of the secret that contains your TLS certificate
  and key. The examples in this guide use the name `ingress-tls`.

  _The `tlsSecretName` field is optional. You may want to use it if you already
  have a TLS certificate for your DNS name._

  {{% note %}}
Writing to and querying data from InfluxDB does not require TLS.
For simplicity, you can wait to enable TLS before moving into production.
For more information, see Phase 4 of the InfluxDB Clustered installation
process, [Secure your cluster](/influxdb/clustered/install/secure-cluster/).
  {{% /note %}}

 {{% code-callout "ingress-tls|cluster-host\.com" "green" %}}

```yaml
ingress:
  hosts:
    - {{< influxdb/host >}}
  tlsSecretName: ingress-tls
```

{{% /code-callout %}}

#### Configure the object store

To connect your InfluxDB cluster to your object store, provide the required
credentials in your `values.yaml`. The credentials required depend on your
object storage provider.

{{< tabs-wrapper >}}
{{% tabs %}}
[Amazon S3 or S3-compatible](#)
[Azure Blob Storage](#)
[Google Cloud Storage](#)
{{% /tabs %}}

{{% tab-content %}}

<!---------------------------------- BEGIN S3 --------------------------------->

If using Amazon S3 or an S3-compatible object store, provide values for the
following fields in your `values.yaml`:

- `objectStore`
  - `bucket`: Object storage bucket name
  - `s3`:
    - `endpoint`: Object storage endpoint URL
    - `allowHttp`: _Set to `true` to allow unencrypted HTTP connections_
    - `accessKey.value`: Object storage access key
      _(can use a `value` literal or `valueFrom` to retrieve the value from a secret)_
    - `secretKey.value`: Object storage secret key
      _(can use a `value` literal or `valueFrom` to retrieve the value from a secret)_
    - `region`: Object storage region

{{% code-placeholders "S3_(URL|ACCESS_KEY|SECRET_KEY|BUCKET_NAME|REGION)" %}}

```yml
objectStore:
    # Bucket that the Parquet files will be stored in
  bucket: S3_BUCKET_NAME
  
  s3: 
    # URL for S3 Compatible object store
    endpoint: S3_URL

    # Set to true to allow communication over HTTP (instead of HTTPS)
    allowHttp: 'true'

    # S3 Access Key
    # This can also be provided as a valueFrom: secretKeyRef:
    accessKey:
      value: S3_ACCESS_KEY

    # S3 Secret Key
    # This can also be provided as a valueFrom: secretKeyRef:
    secretKey:
      value: S3_SECRET_KEY

    # This value is required for AWS S3, it may or may not be required for other providers.
    region: S3_REGION
```

{{% /code-placeholders %}}

---

Replace the following:

- {{% code-placeholder-key %}}`S3_BUCKET_NAME`{{% /code-placeholder-key %}}: Object storage bucket name
- {{% code-placeholder-key %}}`S3_URL`{{% /code-placeholder-key %}}: Object storage endpoint URL
- {{% code-placeholder-key %}}`S3_ACCESS_KEY`{{% /code-placeholder-key %}}: Object storage access key
- {{% code-placeholder-key %}}`S3_SECRET_KEY`{{% /code-placeholder-key %}}: Object storage secret key
- {{% code-placeholder-key %}}`S3_REGION`{{% /code-placeholder-key %}}: Object storage region

---

<!----------------------------------- END S3 ---------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!-------------------------------- BEGIN AZURE -------------------------------->

If using Azure Blob Storage as your object store, provide values for the
following fields in your `values.yaml`:

- `objectStore`
  - `bucket`: Azure Blob Storage bucket name
  - `azure`:
    - `accessKey.value`: Azure Blob Storage access key
      _(can use a `value` literal or `valueFrom` to retrieve the value from a secret)_
    - `account.value`: Azure Blob Storage account ID
      _(can use a `value` literal or `valueFrom` to retrieve the value from a secret)_

{{% code-placeholders "AZURE_(BUCKET_NAME|ACCESS_KEY|STORAGE_ACCOUNT)" %}}

```yml
objectStore:
    # Bucket that the Parquet files will be stored in
  bucket: AZURE_BUCKET_NAME
  
  azure:
    # Azure Blob Storage Access Key
    # This can also be provided as a valueFrom:
    accessKey:
      value: AZURE_ACCESS_KEY

    # Azure Blob Storage Account
    # This can also be provided as a valueFrom: secretKeyRef:
    account:
      value: AZURE_STORAGE_ACCOUNT
```

{{% /code-placeholders %}}

---

Replace the following:

- {{% code-placeholder-key %}}`AZURE_BUCKET_NAME`{{% /code-placeholder-key %}}: Object storage bucket name
- {{% code-placeholder-key %}}`AZURE_ACCESS_KEY`{{% /code-placeholder-key %}}: Azure Blob Storage access key
- {{% code-placeholder-key %}}`AZURE_STORAGE_ACCOUNT`{{% /code-placeholder-key %}}: Azure Blob Storage account ID

---

<!--------------------------------- END AZURE --------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!-------------------------------- BEGIN AZURE -------------------------------->

If using Google Cloud Storage as your object store, provide values for the
following fields in your `values.yaml`:

- `objectStore`
  - `bucket`: Google Cloud Storage bucket name
  - `google`:
    - `serviceAccountSecret.name`: the Kubernetes Secret name that contains your
      Google IAM service account credentials
    - `serviceAccountSecret.key`: the key inside of your Google IAM secret that
      contains your Google IAM account credentials

{{% code-placeholders "GOOGLE_(BUCKET_NAME|IAM_SECRET|CREDENTIALS_KEY)" %}}

```yml
objectStore:
    # Bucket that the Parquet files will be stored in
  bucket: GOOGLE_BUCKET_NAME
  
  google:
    # This section is not needed if you are using GKE Workload Identity.
    # It is only required to use explicit service account secrets (JSON files)
    serviceAccountSecret:
      # Kubernetes Secret name containing the credentials for a Google IAM
      # Service Account.
      name: GOOGLE_IAM_SECRET
      # The key within the Secret containing the credentials.
      key: GOOGLE_CREDENTIALS_KEY
```

{{% /code-placeholders %}}

---

Replace the following:

- {{% code-placeholder-key %}}`GOOGLE_BUCKET_NAME`{{% /code-placeholder-key %}}:
  Google Cloud Storage bucket name
- {{% code-placeholder-key %}}`GOOGLE_IAM_SECRET`{{% /code-placeholder-key %}}:
  the Kubernetes Secret name that contains your Google IAM service account
  credentials
- {{% code-placeholder-key %}}`GOOGLE_CREDENTIALS_KEY`{{% /code-placeholder-key %}}: 
  the key inside of your Google IAM secret that contains your Google IAM account
  credentials

---

<!--------------------------------- END AZURE --------------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

#### Configure the catalog database

The InfluxDB catalog is a PostgreSQL-compatible relational database that stores
metadata about your time series data.
To connect your InfluxDB cluster to your PostgreSQL-compatible database,
provide values for the following fields in your `values.yaml`:

{{% note %}}
We recommend storing sensitive credentials, such as your PostgreSQL-compatible DSN,
as secrets in your Kubernetes cluster.
{{% /note %}}

- `catalog.dsn`
  - `SecretName`: Secret name
  - `SecretKey`: Key in the secret that contains the DSN

{{% code-placeholders "SECRET_(NAME|KEY)" %}}

```yml
catalog:
  # Secret name and key within the secret containing the dsn string to connect
  # to the catalog
  dsn:
    # Kubernetes Secret name containing the dsn for the catalog.
    SecretName: SECRET_NAME
    # The key within the Secret containing the dsn.
    SecretKey: SECRET_KEY
```

{{% /code-placeholders %}}

---

Replace the following:

- {{% code-placeholder-key %}}`SECRET_NAME`{{% /code-placeholder-key %}}:
  Name of the secret containing your PostgreSQL-compatible DSN
- {{% code-placeholder-key %}}`SECRET_KEY`{{% /code-placeholder-key %}}:
  Key in the secret that references your PostgreSQL-compatible DSN

---

{{% warn %}}
##### Percent-encode special symbols in PostgreSQL DSNs

Special symbols in PostgreSQL DSNs should be percent-encoded to ensure they
are parsed correctly by InfluxDB Clustered. This is important to consider when
using DSNs containing auto-generated passwords which may include special
symbols to make passwords more secure.

A DSN with special characters that are not percent-encoded result in an error
similar to:

```txt
Catalog DSN error: A catalog error occurred: unhandled external error: error with configuration: invalid port number
```

{{< expand-wrapper >}}
{{% expand "View percent-encoded DSN example" %}}
To use the following DSN containing special characters:

{{% code-callout "#" %}}
```txt
postgresql://postgres:meow#meow@my-fancy.cloud-database.party:5432/postgres
```
{{% /code-callout %}}

You must percent-encode the special characters in the connection string:

{{% code-callout "%23" %}}
```txt
postgresql://postgres:meow%23meow@my-fancy.cloud-database.party:5432/postgres
```
{{% /code-callout %}}

{{% /expand %}}
{{< /expand-wrapper >}}

For more information, see the [PostgreSQL Connection URI
docs](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING-URIS).
{{% /warn %}}

{{% note %}}

##### PostgreSQL instances without TLS or SSL

If your PostgreSQL-compatible instance runs without TLS or SSL, you must include
the `sslmode=disable` parameter in the DSN. For example:

{{% code-callout "sslmode=disable" %}}

```
postgres://username:passw0rd@mydomain:5432/influxdb?sslmode=disable
```

{{% /code-callout %}}
{{% /note %}}

#### Configure local storage for ingesters

InfluxDB ingesters require local storage to store the Write Ahead Log (WAL) for
incoming data.
To connect your InfluxDB cluster to local storage, provide values for the
following fields in your `values.yaml`:

- `ingesterStorage`
  - `storageClassName`: [Kubernetes storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/).
    This differs based on the Kubernetes environment and desired storage characteristics.
  - `storage`: Storage size. We recommend a minimum of 2 gibibytes (`2Gi`).

{{% code-placeholders "STORAGE_(CLASS|SIZE)" %}}

```yaml
ingesterStorage:
  # (Optional) Set the storage class. This will differ based on the K8s
  # environment and desired storage characteristics.
  # If not set, the default storage class will be used.
  storageClassName: STORAGE_CLASS
  # Set the storage size (minimum 2Gi recommended)
  storage: STORAGE_SIZE
```

{{% /code-placeholders %}}

---

Replace the following:

- {{% code-placeholder-key %}}`STORAGE_CLASS`{{% /code-placeholder-key %}}:
  [Kubernetes storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/)
- {{% code-placeholder-key %}}`STORAGE_SIZE`{{% /code-placeholder-key %}}:
  Storage size (example: `2Gi`)

---

{{< page-nav prev="/influxdb/clustered/install/secure-cluster/auth/" prevText="Set up authentication" next="/influxdb/clustered/install/set-up-cluster/licensing" nextText="Install your license" tab="Helm" >}}
