---
title: Use the InfluxDB AppInstance resource configuration
list_title: Configure your InfluxDB AppInstance resource directly
description: >
  Configure your InfluxDB cluster by editing configuration options in 
  the provided `AppInstance` resource.
menu:
menu:
  influxdb3_clustered:
    name: Configure AppInstance
    parent: Configure your cluster
weight: 220
list_code_example: |
  <a class="btn arrow" href="/influxdb3/clustered/install/set-up-cluster/configure-cluster/directly/">Configure AppInstance directly <em class="op65">Recommended</em> <span class="cf-icon CaretOutlineRight"></span></a>
aliases:
  - /influxdb3/clustered/install/configure-cluster/directly/
---

Configure your InfluxDB cluster by editing configuration options in 
the `AppInstance` resource provided by InfluxData.
Resource configuration for your cluster includes the following:

- **`influxdb-docker-config.json`**: an authenticated Docker configuration file.
  The InfluxDB Clustered software is in a secure container registry.
  This file grants access to the collection of container images required to
  install InfluxDB Clustered.
- **A tarball that contains the following files**:

  - **`app-instance-schema.json`**: Defines the schema
    that you can use to validate `example-customer.yml` and your cluster configuration in tools like [Visual Studio Code (VS Code)](https://code.visualstudio.com/).
  - **`example-customer.yml`**: Configuration for your InfluxDB cluster that includes
    information about [prerequisites](/influxdb3/clustered/install/set-up-cluster/prerequisites/).

    > [!Note]
    > The following sections refer to a `myinfluxdb.yml` file that you copy from
    > `example-customer.yml` and edit for your InfluxDB cluster.

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
  - Region (required for S3, might not be required for other object stores)
- **Local or attached storage information** _(for ingester pods)_
  - Storage class
  - Storage size

You deploy {{% product-name %}} to a Kubernetes namespace, referred to as the
_target_ namespace in the following procedures.
For simplicity, we assume this namespace is `influxdb`--you can use any name you like.

To manage {{% product-name %}} installation, updates, and upgrades, you edit  
and apply a [Kubernetes custom resource (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)  
(`AppInstance`), which you define in a YAML file that conforms to the `app-instance-schema.json` schema.

{{% product-name %}} includes `example-customer.yml` as a configuration template.

The `AppInstance` resource contains key information, such as:

- Name of the target namespace
- Version of the InfluxDB package
- Reference to the InfluxDB container registry pull secrets
- Hostname of your cluster's InfluxDB API
- Parameters to connect to [external prerequisites](/influxdb3/clustered/install/set-up-cluster/prerequisites/)

> [!Note]
> #### Update your namespace if using a namespace other than influxdb
> 
> If you use a namespace name other than `influxdb`, update the
> `metadata.namespace` property in your `myinfluxdb.yml` to use your custom
> namespace name.

## Configure your cluster

1.  [Create a cluster configuration file](#create-a-cluster-configuration-file)
2.  [Configure access to the InfluxDB container registry](#configure-access-to-the-influxdb-container-registry)
3.  [Modify the configuration file to point to prerequisites](#modify-the-configuration-file-to-point-to-prerequisites)

### Create a cluster configuration file

Copy the provided `example-customer.yml` file to create a new configuration file
specific to your InfluxDB cluster. For example, `myinfluxdb.yml`.

<!-- pytest.mark.skip -->

```bash
cp example-customer.yml myinfluxdb.yml
```

> [!Note]
> 
> #### Use VS Code to edit your configuration file
> 
> We recommend using [Visual Studio Code (VS Code)](https://code.visualstudio.com/)
> to edit your `myinfluxdb.yml` configuration file due to its JSON Schema support,
> including autocompletion and validation features that help when 
> editing your InfluxDB configuration. InfluxData provides an
> `app-instance-schema.json` JSON schema file that VS Code can use to validate
> your configuration settings.

### Configure access to the InfluxDB container registry

The provided `influxdb-docker-config.json` grants access to a collection of
container images required to run {{% product-name %}}.
Your Kubernetes Cluster needs access to the container registry to pull and
install InfluxDB.

When pulling the {{% product-name %}} image, you're likely in one of two scenarios:

- Your Kubernetes cluster can pull from the InfluxData container registry.
- Your cluster runs in an environment without network interfaces ("air-gapped") and
  can only access a private container registry.

In both scenarios, you need a valid _pull secret_.

{{< tabs-wrapper >}}
{{% tabs %}}
[Public registry](#)
[Private registry (air-gapped)](#)
{{% /tabs %}}

{{% tab-content %}}

<!--------------------------- BEGIN Public Registry --------------------------->

#### Public registry

To pull from the InfluxData registry, you need to create a Kubernetes secret in the target namespace.

```bash
kubectl create secret docker-registry gar-docker-secret \
  --from-file=.dockerconfigjson=influxdb-docker-config.json \
  --namespace influxdb
```

If successful, the output is the following:

```text
secret/gar-docker-secret created
```

By default, the name of the secret is `gar-docker-secret`.
If you change the name of the secret, you must also change the value of the
`imagePullSecret` field in the `AppInstance` custom resource to match.

<!---------------------------- END Public Registry ---------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!--------------------------- BEGIN PRIVATE REGISTRY (AIR-GAPPED) -------------------------->

#### Private registry (air-gapped)

If your Kubernetes cluster can't use a public network to download container images
from the InfluxData container registry, follow these steps to copy images and
configure the AppInstance for a private registry:

1. [Copy the images to your private registry](#copy-the-images-to-your-private-registry)
2. [Configure your AppInstance](#configure-your-appinstance)

##### Copy the images to your private registry

Use `crane` to copy images from the InfluxData registry to your own private registry.

1. [Install crane](https://github.com/google/go-containerregistry/tree/main/cmd/crane#installation)
   for your system.
2. Create a container registry secret file and verify access:

{{% code-placeholders "PACKAGE_VERSION" %}}

```bash
mkdir -p /tmp/influxdbsecret
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

```bash
Error: fetching manifest us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:<package-version>: GET https://us-docker.pkg.dev/v2/token?scope=repository%3Ainfluxdb2-artifacts%2Fclustered%2Finfluxdb%3Apull&service=: DENIED: Permission "artifactregistry.repositories.downloadArtifacts" denied on resource "projects/influxdb2-artifacts/locations/us/repositories/clustered" (or it may not exist)
```

3. Extract the list of InfluxDB images from the package metadata:
You can use any standard OCI image inspection tool--for example:

{{% code-placeholders "PACKAGE_VERSION" %}}

<!-- pytest.mark.skip -->

```bash
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

4. Use `crane` to copy the images to your private registry:

{{% code-placeholders "REGISTRY_HOSTNAME" %}}

<!-- pytest.mark.skip -->

```bash
</tmp/images.txt xargs -I% crane cp % REGISTRY_HOSTNAME/%
```

{{% /code-placeholders %}}


Replace {{% code-placeholder-key %}}`REGISTRY_HOSTNAME`{{% /code-placeholder-key %}}
with the hostname of your private registry--for example:

```text
myregistry.mydomain.io
```

##### Configure your AppInstance

Configure your `AppInstance` resource with a reference to your private registry name.

In your `myinfluxdb.yml`:

1. Set `spec.package.spec.images.registryOverride` to the location of your private registry.
2. If your private container registry requires pull secrets to access images, set `spec.imagePullSecrets.name` to the pull secret name.

{{% expand-wrapper %}}
{{% expand "View `myinfluxdb.yml` AppInstance configuration" %}}
{{% code-placeholders "REGISTRY_HOSTNAME | PULL_SECRET_NAME" %}}
```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    spec:
      images:
        registryOverride: REGISTRY_HOSTNAME
  # Configure connection to PostgreSQL database
  values:
    global:
      catalog:
        dsn: "postgres://username:password@postgres-host:5432/influxdb?sslmode=require"
    # Configure S3-compatible object storage
    objectStorage:
      bucket: "influxdb-bucket"
      endpoint: "https://s3-endpoint"
      accessKeyId: "ACCESS_KEY"
      secretAccessKey: "SECRET_KEY"
      region: "region"
  # Configure image pull secrets if needed
  imagePullSecrets:
    - name: PULL_SECRET_NAME
```
{{% /code-placeholders %}}
{{% /expand %}}
{{% /expand-wrapper %}}

<!---------------------------- END Private Registry (AIR-GAPPED) --------------------------->

{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Modify the configuration file to point to prerequisites

Update your `myinfluxdb.yml` configuration file with credentials necessary to
connect your cluster to your prerequisites.

- [Configure ingress](#configure-ingress)
- [Configure the object store](#configure-the-object-store)
- [Configure the catalog database](#configure-the-catalog-database)
- [Configure local storage for ingesters](#configure-local-storage-for-ingesters)

#### Configure ingress

To configure ingress, provide values for the following fields in your
`myinfluxdb.yml` configuration file:

- **`spec.package.spec.ingress.hosts`: Cluster hostnames**

  Provide the hostnames that Kubernetes should
  use to expose the InfluxDB API endpoints.
  For example: `{{< influxdb/host >}}`.

  _You can provide multiple hostnames. The ingress layer accepts incoming
  requests for all listed hostnames. This can be useful if you want to have
  distinct paths for your internal and external traffic._

  > [!Note]
  > You are responsible for configuring and managing DNS. Options include:
  > 
  > - Manually managing DNS records
  > - Using [external-dns](https://github.com/kubernetes-sigs/external-dns) to
  >   synchronize exposed Kubernetes services and ingresses with DNS providers.

- **`spec.package.spec.ingress.tlsSecretName`: TLS certificate secret name**

  (Optional): Provide the name of the secret that contains your TLS certificate
  and key. The examples in this guide use the name `ingress-tls`.

  > [!Note]
  > Writing to and querying data from InfluxDB does not require TLS.
  > For simplicity, you can wait to enable TLS before moving into production.
  > For more information, see Phase 4 of the InfluxDB Clustered installation
  > process, [Secure your cluster](/influxdb3/clustered/install/secure-cluster/).

{{% code-callout "ingress-tls|cluster-host\.com" "green" %}}

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
# ...
ingress:
  hosts:
    - {{< influxdb/host >}}
  tlsSecretName: ingress-tls
```

{{% /code-callout %}}

#### Configure the object store

To connect your InfluxDB cluster to your object store, provide the required
credentials in your `myinfluxdb.yml`. The credentials required depend on your
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
following fields in your `myinfluxdb.yml`:

- `spec.package.spec.objectStore`
  - `bucket`: Object storage bucket name
  - `s3`
    - `endpoint`: Object storage endpoint URL
    - `allowHttp`: _Set to `true` to allow unencrypted HTTP connections_
    - `accessKey.value`: Object storage access key
    - `secretKey.value`: Object storage secret key
    - `region`: Object storage region

{{% code-placeholders "S3_(URL|ACCESS_KEY|SECRET_KEY|BUCKET_NAME|REGION)" %}}

```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      objectStore:
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

          # Bucket that the Parquet files will be stored in
          bucket: S3_BUCKET_NAME

          # This value is required for AWS S3, it may or may not be required for other providers.
          region: S3_REGION
```

{{% /code-placeholders %}}

---

Replace the following:

- {{% code-placeholder-key %}}`S3_URL`{{% /code-placeholder-key %}}: Object storage endpoint URL
- {{% code-placeholder-key %}}`S3_ACCESS_KEY`{{% /code-placeholder-key %}}: Object storage access key
- {{% code-placeholder-key %}}`S3_SECRET_KEY`{{% /code-placeholder-key %}}: Object storage secret key
- {{% code-placeholder-key %}}`S3_BUCKET_NAME`{{% /code-placeholder-key %}}: Object storage bucket name
- {{% code-placeholder-key %}}`S3_REGION`{{% /code-placeholder-key %}}: Object storage region

---

<!----------------------------------- END S3 ---------------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!-------------------------------- BEGIN AZURE -------------------------------->

If using Azure Blob Storage as your object store, provide values for the
following fields in your `myinfluxdb.yml`:

- `spec.package.spec.objectStore`
  - `bucket`: Azure Blob Storage bucket name
  - `azure`:
    - `accessKey.value`: Azure Blob Storage access key
      _(can use a `value` literal or `valueFrom` to retrieve the value from a secret)_
    - `account.value`: Azure Blob Storage account ID
      _(can use a `value` literal or `valueFrom` to retrieve the value from a secret)_

{{% code-placeholders "AZURE_(BUCKET_NAME|ACCESS_KEY|STORAGE_ACCOUNT)" %}}

```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
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
following fields in your `myinfluxdb.yml`:

- `spec.package.spec.objectStore`
  - `bucket`: Google Cloud Storage bucket name
  - `google`:
    - `serviceAccountSecret.name`: the Kubernetes Secret name that contains your
      Google IAM service account credentials
    - `serviceAccountSecret.key`: the key inside of your Google IAM secret that
      contains your Google IAM account credentials

{{% code-placeholders "GOOGLE_(BUCKET_NAME|IAM_SECRET|CREDENTIALS_KEY)" %}}

```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
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
provide values for the following fields in your `myinfluxdb.yml` configuration file:

> [!Note]
> We recommend storing sensitive credentials, such as your PostgreSQL-compatible DSN,
> as secrets in your Kubernetes cluster.

- `spec.package.spec.catalog.dsn.valueFrom.secretKeyRef`
  - `.name`: Secret name
  - `.key`: Key in the secret that contains the DSN

{{% code-placeholders "SECRET_(NAME|KEY)" %}}

```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      catalog:
        # A postgresql style DSN that points to a postgresql compatible database.
        # postgres://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
        dsn:
          valueFrom:
            secretKeyRef:
              name: SECRET_NAME
              key: SECRET_KEY
```

{{% /code-placeholders %}}

---

Replace the following:

- {{% code-placeholder-key %}}`SECRET_NAME`{{% /code-placeholder-key %}}:
  Name of the secret containing your PostgreSQL-compatible DSN
- {{% code-placeholder-key %}}`SECRET_KEY`{{% /code-placeholder-key %}}:
  Key in the secret that references your PostgreSQL-compatible DSN

---

> [!Warning]
> ##### Percent-encode special symbols in PostgreSQL DSNs
> 
> Percent-encode special symbols in PostgreSQL DSNs to ensure
> {{% product-name %}} parses them correctly.
> Consider this when using DSNs with auto-generated passwords that include special
> symbols for added security.
> 
> If a DSN contains special characters that aren't percent-encoded,
> you might encounter an error similar to the following:
> 
> ```txt
> Catalog DSN error: A catalog error occurred: unhandled external error: error with configuration: invalid port > number
> ```
> 
> For more information, see the [PostgreSQL Connection URI docs](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING-URIS).
>
> {{< expand-wrapper >}}
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

> [!Note]
> 
> ##### PostgreSQL instances without TLS or SSL
> 
> If your PostgreSQL-compatible instance runs without TLS or SSL, you must include
> the `sslmode=disable` parameter in the DSN. For example:
> 
> {{% code-callout "sslmode=disable" %}}
```
postgres://username:passw0rd@mydomain:5432/influxdb?sslmode=disable
```
{{% /code-callout %}}

#### Configure local storage for ingesters

InfluxDB ingesters require local storage to store the Write Ahead Log (WAL) for
incoming data.
To connect your InfluxDB cluster to local storage, provide values for the
following fields in your `myinfluxdb.yml` configuration file:

- `spec.package.spec.ingesterStorage`
  - `.storageClassName`: [Kubernetes storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/).
    This differs based on the Kubernetes environment and desired storage characteristics.
  - `storage`: Storage size. We recommend a minimum of 2 gibibytes (`2Gi`).

{{% code-placeholders "STORAGE_(CLASS|SIZE)" %}}

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      ingesterStorage:
        storageClassName: STORAGE_CLASS
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

{{< page-nav prev="/influxdb3/clustered/install/secure-cluster/auth/" prevText="Set up authentication" next="/influxdb3/clustered/install/set-up-cluster/licensing/" nextText="Install your license" >}}
