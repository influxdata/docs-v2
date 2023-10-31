---
title: Configure your InfluxDB cluster
description: >
  InfluxDB Clustered deployments are managed with Kubernetes and configured using
  a YAML configuration file.
menu:
  influxdb_clustered:
    name: Configure your cluster
    parent: Install InfluxDB Clustered
weight: 103
---

InfluxDB Clustered deployments are managed with Kubernetes and configured using
a YAML configuration file. InfluxData provides the following items:

- **`influxdb-docker-config.json`**: Authenticated Docker configuration file.
  The InfluxDB Clustered software is in a secure container registry.
  This file grants access to the collection of container images required to
  install InfluxDB Clustered.
- **A tar-ball that contains**:
  - **`app-instance-schema.json`**: Defines the schema for `example-customer.yml`
    to be used with [Visual Studio Code (VS Code)](https://code.visualstudio.com/).
  - **`example-customer.yml`**: Configuration for your InfluxDB cluster that includes
    information about [prerequisites](/influxdb/clustered/install/prerequisites/).

    {{% note %}}
This documentation refers to a `myinfluxdb.yml` file.
This is a copy of the `example-customer.yml` edited for your InfluxDB cluster.
    {{% /note %}}

## Configuration data

When ready to install InfluxDB, have the following information available:

- **InfluxDB cluster hostname**: hostname Kubernetes uses to expose InfluxDB API endpoints
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
- **OAuth2 provider credentials**
  - Client ID
  - JWKS endpoint
  - Device authorization endpoint
  - Token endpoint

InfluxDB is deployed to a Kubernetes namespace which, throughout the following
installation procedure, is referred to as the _target_ namespace.
For simplicity, we assume this namespace is named `influxdb`, however
you're free to use any name you like.

The InfluxDB installation, update, and upgrade processes are driven by editing
and applying a [Kubernetes custom resource (CRD)](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
called `AppInstance`.
The `AppInstance` CRD is defined in a YAML file (use `example-customer.yml` as a
starting point) that contains key information, such as:

- Name of the target namespace
- Version of the InfluxDB package
- Reference to the InfluxDB container registry pull secrets
- Hostname on which the InfluxDB API is exposed
- Parameters to connect to [external prerequisites](/influxdb/clustered/install/prerequisites/)

## Configure your cluster

1. [Create a cluster configuration file](#create-a-cluster-configuration-file)
2. [Create a namespace for InfluxDB](#create-a-namespace-for-influxdb)
3. [Install kubecfg kubit operator](#install-kubecfg-kubit-operator)
4. [Configure access to the InfluxDB container registry](#configure-access-to-the-influxdb-container-registry)
5. [Set up cluster ingress](#set-up-cluster-ingress)
6. [Modify the configuration file to point to prerequisites](#modify-the-configuration-file-to-point-to-prerequisites)

### Create a cluster configuration file

Use the provided `example-customer.yml` file to create a new configuration file
specific to your InfluxDB cluster. For example, `myinfluxdb.yml`. 

```sh
cp example-customer.yml myinfluxdb.yml
```

{{% note %}}
#### Use VS Code to edit your configuration file

We recommend using VS Code to edit your `myinfluxdb.yml` configuration file because
of its ability to associate a JSON Schema and help with autocompletion and validation.
This ensures the best experience when editing your InfluxDB configuration.
InfluxData provides `app-instance-schema.json` to use with VS Code and correctly
validate configuration settings.
{{% /note %}}

### Create a namespace for InfluxDB

Create a namespace for InfluxDB. For example, using `kubectl`::

```sh
kubectl create namespace influxdb
```

If you use a namespace name other than `influxdb`, update the `.metadata.namespace`
field in your `myinfluxdb.yml` to use your custom namespace name.

### Install kubecfg kubit operator

The [`kubecfg kubit` operator](https://github.com/kubecfg/kubit) (maintained by InfluxData)
simplifies the installation and management of the InfluxDB Clustered package.
It manages the application of the jsonnet templates uses to install, manage, and
update an InfluxDB cluster.

Use `kubectl` to install the [kubecfg kubit](https://github.com/kubecfg/kubit) operator.

```sh
kubectl apply -k 'https://github.com/kubecfg/kubit//kustomize/global?ref=v0.0.11'
```

### Configure access to the InfluxDB container registry

The provided `influxdb-docker-config.json` grants access to a collection of
container images required to run InfluxDB Clustered.
Your Kubernetes Cluster needs access to the container registry to pull down and
install InfluxDB.

There are two main scenarios:

- You have a kubernetes cluster that can pull from the InfluxData container registry.
- You run in an environment with no network interfaces ("air-gapped") and you
  can only access a private container registry.

In both cases you need a valid container registry secret file.
Use [crane](https://github.com/google/go-containerregistry/tree/main/cmd/crane) 

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
registry, that command will succeed and return the JSON manifest of that Docker
image, which looks similar to:

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

If there’s a problem with the Docker configuration, you will not be able to
retrieve the manifest, and the command returns an error. For example:

```sh
Error: fetching manifest us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:<package-version>: GET https://us-docker.pkg.dev/v2/token?scope=repository%3Ainfluxdb2-artifacts%2Fclustered%2Finfluxdb%3Apull&service=: DENIED: Permission "artifactregistry.repositories.downloadArtifacts" denied on resource "projects/influxdb2-artifacts/locations/us/repositories/clustered" (or it may not exist)
```

{{< tabs-wrapper >}}
{{% tabs %}}
[Public registry (non air-gapped)](#)
[Private registry (air-gapped)](#)
{{% /tabs %}}

{{% tab-content %}}
<!--------------------------- BEGIN Public Registry --------------------------->

#### Public registry (non air-gapped)

To pull from the InfluxData registry, you need to create a Kubernetes secret in the target namespace.

```sh
kubectl create secret docker-registry gar-docker-secret \
  --from-file=.dockerconfigjson=influxdb-docker-config.json \
  --namespace influxdb
```

You should see `secret/gar-docker-secret created` in response to this command.

By default, this secret is named `gar-docker-secret`.
If you change the name of this secret, you must also change the value of the
`imagePullSecret` field in the `AppInstance` custom resource to match.

<!---------------------------- END Public Registry ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!--------------------------- BEGIN Private Registry -------------------------->

#### Private registry (air-gapped)

If your Kubernetes cluster doesn't have the ability to download container images
from our container registry over the public network, do the following:

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

This command produces a list of image names, similar to:

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
with the hostname of your private registry. For example: `myregistry.mydomain.io`.

---

To tell InfluxDB where your private registry is, set the
`.spec.package.spec.images.registryOverride` field in `myinfluxdb.yml`.
For example:

{{% code-placeholders "REGISTRY_HOSTNAME" %}}
```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
...
spec:
  package:
    spec:
      images:
        registryOverride: REGISTRY_HOSTNAME
```
{{% /code-placeholders %}}

<!---------------------------- END Private Registry --------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

### Set up cluster ingress

Provide your own [Kubernetes ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
or install the [Nginx Ingress Controller](https://github.com/kubernetes/ingress-nginx)
to use the InfluxDB-defined ingress.

If using the InfluxDB-defined ingress, add a valid TLS Certificate to the
cluster as a secret. Provide the paths to the TLS certificate file and key file:

{{% code-placeholders "TLS_(CERT|KEY)_PATH" %}}
```sh
kubectl create secret tls ingress-tls \
  --namespace influxdb \
  --cert TLS_CERT_PATH \
  --key TLS_KEY_PATH
```
{{% /code-placeholders %}}

---

Replace the following:

- _{{% code-placeholder-key %}}`TLS_CERT_PATH`{{% /code-placeholder-key %}}:
  Path to the certificate file on your local machine._
- _{{% code-placeholder-key %}}`TLS_KEY_PATH`{{% /code-placeholder-key %}}:
  Path to the certificate secret key file on your local machine._

---

Provide the TLS certificate secret to the InfluxDB configuration in the
[Configure ingress step](#configure-ingress).

### Modify the configuration file to point to prerequisites

Update your `myinfluxdb.yml` configuration file with credentials necessary to
connect your cluster to your prerequisites.

- [Configure ingress](#configure-ingress)
- [Configure the object store](#configure-the-object-store)
- [Configure the catalog database](#configure-the-catalog-database)
- [Configure local storage for ingesters](#configure-local-storage-for-ingesters)
- [Configure your OAuth2 provider](#configure-your-oauth2-provider)
- [Configure the size of your cluster](#configure-the-size-of-your-cluster)

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
  
  {{% note %}}
Your are responsible for configuring and managing DNS. Options include:

- Manually managing DNS records
- Using [external-dns](https://github.com/kubernetes-sigs/external-dns) to
  synchronize exposed Kubernetes services and ingresses with DNS providers.
  {{% /note %}}

- **`spec.package.spec.ingress.tlsSecretName`: TLS certificate secret name**
  
  Provide the name of the secret that
  [contains your TLS certificate and key](#set-up-cluster-ingress).
  The examples above and below use the name, `ingress-tls`.

  _The `tlsSecretName` field is optional. You may want to use it if you already have a TLS certificate for your DNS name._

  {{< expand-wrapper >}}
{{% expand "Use cert-manager and Let's Encrypt to manage TLS certificates" %}}

If you instead want to automatically create an [ACME](https://datatracker.ietf.org/doc/html/rfc8555)
certificate (e.g. with [Let's Encrypt](https://letsencrypt.org/)), refer
to the [cert-manager documentation](https://cert-manager.io/docs/usage/ingress/)
for more details on how to annotate the `Ingress` resource produced by the
InfluxDB installer operator. The operator lets you to add annotations
(with `kubectl annotate`) and preserves them as it operates on resources.

{{% note %}}
If you choose to use cert-manager, it's your responsibility to install and configure it.
{{% /note %}}
{{% /expand %}}
{{< /expand-wrapper >}}

{{% code-callout "ingress-tls|cluster-host\.com" "green" %}}
```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
...
spec:
  package:
    spec:
...
      ingress:
        hosts: 
          - {{< influxdb/host >}}
        tlsSecretName: ingress-tls
```
{{% /code-callout %}}


#### Configure the object store

To connect your InfluxDB cluster to your object store, provide values for the
following fields in your `myinfluxdb.yml` configuration file:

- `spec.package.spec.objectStore`
  - `.endpoint`: Object storage endpoint URL
  - `.allowHttp`: _Set to `true` to allow unencrypted HTTP connections_
  - `.accessKey.value`: Object storage access key
  - `.secretKey.value`: Object storage secret key
  - `.bucket`: Object storage bucket name
  - `.region`: Object storage region

{{% code-placeholders "S3_(URL|ACCESS_KEY|SECRET_KEY|BUCKET_NAME|REGION)" %}}
```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
...
spec:
  package:
    spec:
      objectStore:
        # URL for S3 Compatible object store
        endpoint: S3_URL

        # Set to true to allow communication over HTTP (instead of HTTPS)
        allowHttp: "false"

        # S3 Access Key
        # This can also be provided as a valueFrom: secretKeyRef:
        accessKey:
          value: S3_ACCESS_KEY

        # S3 Secret Key
        # This can also be provided as a valueFrom: secretKeyRef:
        secretKey:
          value: S3_SECRET_KEY

        # Bucket that the parquet files will be stored in
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

#### Configure the catalog database

The InfluxDB catalog is a PostgreSQL-compatible relational database that stores
metadata about your time series data.
To connect your InfluxDB cluster to your PostgreSQL-compatible database,
provide values for the following fields in your `myinfluxdb.yml` configuration file:

{{% note %}}
We recommend storing sensitive credentials like your PostgreSQL-compatible DSN
as secrets in your Kubernetes cluster.
{{% /note %}}

- `spec.package.spec.catalog.dsn.valueFrom.secretKeyRef`
  - `.name`: Secret name
  - `.key`:  Key in the secret that contains the DSN

{{% code-placeholders "SECRET_(NAME|KEY)" %}}
```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
...
spec:
  package:
    spec:
      catalog:
        # A postgresql style DSN that points at a postgresql compatible database.
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
following fields in your `myinfluxdb.yml` configuration file:

- `spec.package.spec.ingesterStorage`
  - `.storageClassName`: [Kubernetes storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/).
    This will differ based on the Kubernetes environment and desired storage characteristics.
  - `storage`: Storage size. We recommend a minimum of 2 gibibytes (`2Gi`).

{{% code-placeholders "STORAGE_(CLASS|SIZE)" %}}
```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
...
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

#### Configure your OAuth2 provider

InfluxDB Clustered uses OAuth2 to authenticate administrative access to your cluster.
To connect your InfluxDB cluster to your OAuth2 provide, provide values for the
following fields in your `myinfluxdb.yml` configuration file:

- `spec.package.spec.admin`
  - `identityProvider`: Identity provider name.
    _If using Microsoft Entra ID (formerly Azure Active Directory), set the name
    to `azure`_.
  - `jwksEndpoint`: JWKS endpoint provide by your identity provider.
  - `users`: List of OAuth2 user IDs to grant administrative access to
    your InfluxDB cluster. IDs are provided by your identity provider.

Below are examples for **Keycloak**, **Auth0**, and **Microsoft Entra ID**, but
other OAuth2 providers should work as well:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Keycloak](#)
[Auth0](#)
[Microsoft Entra ID](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% code-callout "keycloak" "green" %}}
{{% code-placeholders "KEYCLOAK_(HOST|REALM|USER_ID)" %}}
```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
...
spec:
  package:
    spec:
      admin:
        identityProvider: keycloak
        jwksEndpoint: |-
          https://KEYCLOAK_HOST/auth/realms/KEYCLOAK_REALM/protocol/openid-connect/certs
        users:
          - KEYCLOAK_USER_ID
```
{{% /code-placeholders %}}
{{% /code-callout %}}

---

Replace the following:

- {{% code-placeholder-key %}}`KEYCLOAK_HOST`{{% /code-placeholder-key %}}:
  Host and port of your Keycloak server
- {{% code-placeholder-key %}}`KEYCLOAK_REALM`{{% /code-placeholder-key %}}:
  Keycloak realm
- {{% code-placeholder-key %}}`KEYCLOAK_USER_ID`{{% /code-placeholder-key %}}:
  Keycloak user ID to grant InfluxDB administrative access to

---

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-callout "auth0" "green" %}}
{{% code-placeholders "AUTH0_(HOST|USER_ID)" %}}
```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
...
spec:
  package:
    spec:
      admin:
        identityProvider: auth0
        jwksEndpoint: |-
          https://AUTH0_HOST/.well-known/openid-configuration
        users:
          - AUTH0_USER_ID
```
{{% /code-placeholders %}}
{{% /code-callout %}}

---

Replace the following:

- {{% code-placeholder-key %}}`AUTH0_HOST`{{% /code-placeholder-key %}}:
  Host and port of your Auth0 server
- {{% code-placeholder-key %}}`AUTH0_USER_ID`{{% /code-placeholder-key %}}:
  Auth0 user ID to grant InfluxDB administrative access to

---

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-callout "azure" "green" %}}
{{% code-placeholders "AZURE_(USER|TENANT)_ID" %}}
```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
...
spec:
  package:
    spec:
      admin:
        identityProvider: azure
        jwksEndpoint: |-
          https://login.microsoftonline.com/AZURE_TENANT_ID/discovery/v2.0/keys
        users:
          - AZURE_USER_ID
```
{{% /code-placeholders %}}
{{% /code-callout %}}

---

Replace the following:

- {{% code-placeholder-key %}}`AZURE_TENANT_ID`{{% /code-placeholder-key %}}:
  Microsoft Entra tenant ID
- {{% code-placeholder-key %}}`AZURE_USER_ID`{{% /code-placeholder-key %}}:
  Microsoft Entra user ID to grant InfluxDB administrative access to
  _(See [Find user IDs with Microsoft Entra ID](/influxdb/clustered/install/auth/?t=Microsoft+Entra+ID#find-user-ids-with-microsoft-entra-id))_

---

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

##### Adding users

Finally, you will need to add all the users you wish to have access to use influxctl.
Update the `spec.package.spec.admin.users` field with a list of these users.
See [Adding or removing users](/repalce/this) for more details.


#### Configure the size of your cluster

By default, the each InfluxDB cluster is configured with the following:

- **3 ingesters**  
  Ensures redundancy on the write path.
- **1 compactor**  
  While you can have multiple compactors, it is more efficient to scale the
  compactor vertically (assign more CPU and memory) rather than horizontally
  (increase the number of compactors).
- **1 querier**  
  The number of queriers depends on the number of concurrent queries you are
  likely to have and how long they take to execute.

This is a good starting point for testing.
Once you have your cluster up and running and are looking for scaling recommendations,
please [reach out to InfluxData](https://support.influxdata.com).
We are happy to work with you to identify appropriate scale settings based on
your anticipated workload.

**To use custom scale settings for your InfluxDB cluster**, modify the following fields
in your `myinfluxdb.yml`. If omitted, your cluster will use the default scale settings.

- `spec.package.spec.resources`
  - `.ingester.requests`
    - `.cpu`: CPU Resource units to assign to ingesters
    - `.memory`: Memory resource units to assign to ingesters
    - `replicas`: Number of ingester replicas to provision
  - `.compactor.requests`
    - `.cpu`: CPU Resource units to assign to compactors
    - `.memory`: Memory resource units to assign to compactors
    - `replicas`: Number of compactor replicas to provision
  - `.querier.requests`
    - `.cpu`: CPU Resource units to assign to queriers
    - `.memory`: Memory resource units to assign to queriers
    - `replicas`: Number of querier replicas to provision
  - `.router.requests`
    - `.cpu`: CPU Resource units to assign to routers
    - `.memory`: Memory resource units to assign to routers
    - `replicas`: Number of router replicas to provision

###### Related Kubernetes documentation

- [CPU resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)
- [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)


{{% code-placeholders "(INGESTER|COMPACTOR|QUERIER|ROUTER)_(CPU|MEMORY|REPLICAS)" %}}
```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
...
spec:
  package:
    spec:
      # The following settings tune the various pods for their cpu/memory/replicas
      # based on workload needs. Only uncomment the specific resources you want
      # to change. Anything left commented will use the package default.
      resources:
        # The ingester handles data being written
        ingester:
          requests:
            cpu: INGESTER_CPU
            memory: INGESTER_MEMORY
            replicas: INGESTER_REPLICAS # Default is 3

        # The compactor reorganizes old data to improve query and storage efficiency.
        compactor:
          requests:
            cpu: COMPACTOR_CPU
            memory: COMPACTOR_MEMORY
            replicas: COMPACTOR_REPLICAS # Default is 1

        # The querier handles querying data.
        querier:
          requests:
            cpu: QUERIER_CPU
            memory: QUERIER_MEMORY
            replicas: QUERIER_REPLICAS # Default is 1

        # The router performs some api routing.
        router:
          requests:
            cpu: ROUTER_CPU
            memory: ROUTER_MEMORY
            replicas: ROUTER_REPLICAS # Default is 1
```
{{% /code-placeholders %}}

{{< page-nav prev="/influxdb/clustered/install/auth/" prevText="Set up authentication" next="/influxdb/clustered/install/deploy/" nextText="Deploy your cluster" >}}
