---
title: Set up TLS in your InfluxDB cluster
description: >
  Set up TLS in your InfluxDB to ensure both incoming and outgoing data is
  encrypted and secure.
menu:
  influxdb3_clustered:
    name: Set up TLS
    parent: Secure your cluster
weight: 210
---

Set up TLS in your InfluxDB cluster to ensure both incoming and outgoing data is
encrypted and secure.
We recommend using TLS to encrypt communication for the
following:

- Ingress to your cluster
- Connection to your Object store
- Connection to your Catalog store (PostgreSQL-compatible) database

> [!Note]
> If using self-signed certs,
> [provide a custom certificate authority (CA) bundle](#provide-a-custom-certificate-authority-bundle).

- [Set up ingress TLS](#set-up-ingress-tls)
- [Require HTTPS on the object store](#require-https-on-the-object-store)
- [Require TLS on your catalog database](#require-tls-on-your-catalog-database)
- [Provide a custom certificate authority bundle](#provide-a-custom-certificate-authority-bundle)
- [Apply the changes to your cluster](#apply-the-changes-to-your-cluster)

## Set up ingress TLS

Kubernetes support many different ingress controllers, some of which provide
simple mechanisms for creating and managing TLS certificates.
If using the [InfluxDB-defined ingress and the Nginx Ingress Controller](/influxdb3/clustered/install/set-up-cluster/prerequisites/#set-up-a-kubernetes-ingress-controller),
add a valid TLS Certificate to the cluster as a secret.
Provide the paths to the TLS certificate file and key file:

{{% code-placeholders "TLS_(CERT|KEY)_PATH" %}}

<!-- pytest.mark.skip -->

```bash
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

### Configure ingress

Update your `AppInstance` resource to reference the secret that
[contains your TLS certificate and key](#set-up-ingress-tls).
The examples below use the name `ingress-tls`.

- **If modifying the `AppInstance` resource directly**, reference the TLS secret
  in the `spec.package.spec.ingress.tlsSecretName` property.
- **If using the InfluxDB Clustered Helm chart**, reference the TLS secret in
  the `ingress.tlsSecretName` property in your `values.yaml`.

_The `tlsSecretName` field is optional. You may want to use it if you already have a TLS certificate for your DNS name._

{{< expand-wrapper >}}
{{% expand "Use cert-manager and Let's Encrypt to manage TLS certificates" %}}

If you instead want to automatically create an [ACME](https://datatracker.ietf.org/doc/html/rfc8555)
certificate (for example, using [Let's Encrypt](https://letsencrypt.org/)), refer
to the [cert-manager documentation](https://cert-manager.io/docs/usage/ingress/)
for more details on how to annotate the `Ingress` resource produced by the
InfluxDB installer operator. The operator lets you to add annotations
(with `kubectl annotate`) and preserves them as it operates on resources.

> [!Note]
> If you choose to use cert-manager, it's your responsibility to install and configure it.

{{% /expand %}}
{{< /expand-wrapper >}}

{{% code-callout "ingress-tls|cluster-host\.com" "green" %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[AppInstance](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
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
{{% /code-tab-content %}}
{{% code-tab-content %}}
```yaml
ingress:
  hosts:
    - {{< influxdb/host >}}
  tlsSecretName: ingress-tls
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-callout %}}

## Require HTTPS on the object store

Some object store providers allow unsecure connections when accessing the object
store. Refer to your object store provider's documentation for information about
installing TLS certificates and ensuring all connections are secure.

If using **AWS S3 or an S3-compatible** object store, set following property
in your `AppInstance` resources to `false` to disallow unsecure connections to
your object store:

- **If modifying the `AppIsntance` resource directly**:  
  `spec.package.spec.objectStore.s3.allowHttp`
- **If using the InfluxDB Clustered Helm chart**:  
  `objectStore.s3.allowHttp` in your `values.yaml`

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[AppInstance](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      objectStore:
        s3:
          # ...
          allowHttp: 'false'
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```yml
objectStore:
  s3:
    # ...
    allowHttp: 'false'
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Require TLS on your catalog database

Refer to your PostreSQL-compatible database provider's documentation for
installing TLS certificates and ensuring secure connections.

If currently using an unsecure connection to your Catalog store database, update your
Catalog store data source name (DSN) to **remove the `sslmode=disable` query parameter**:

{{% code-callout "\?sslmode=disable" "magenta delete" %}}
```txt
postgres://username:passw0rd@mydomain:5432/influxdb?sslmode=disable
```
{{% /code-callout %}}

## Provide a custom certificate authority bundle {note="Optional"}

InfluxDB attempts to make TLS connections to the services it depends on--notably,
the [Catalog](/influxdb3/clustered/reference/internals/storage-engine/#catalog)
and the [Object store](/influxdb3/clustered/reference/internals/storage-engine/#object-store).
InfluxDB validates certificates for all connections.

_If you host dependent services yourself and you use a private or otherwise not
well-known certificate authority to issue certificates to them, 
InfluxDB won't recognize the issuer and can't validate the certificates._
To allow InfluxDB to validate the certificates from your custom CA,
configure the `AppInstance` resource to use a **PEM certificate
bundle** that contains your custom certificate authority chain.

1.  Use `kubectl` to create a config map that contains your PEM-formatted
    certificate bundle file.
    Your certificate authority administrator should provide you with a
    PEM-formatted bundle file.
    
    > [!Note]
    > This PEM bundle file establishes a chain of trust for the
    > external services that InfluxDB depends on.
    > It's _not_ the certificate that InfluxDB uses to
    > host its own TLS endpoints.

    In the example, replace `/path/to/private_ca.pem` with the path to your PEM-formatted certificate bundle file:

    <!-- pytest.mark.skip -->

    ```bash
    kubectl --namespace influxdb create configmap custom-ca --from-file=certs.pem=/path/to/private_ca.pem
    ```

    > [!Note]
    > #### Bundle multiple certificates
    > 
    > You can append multiple certificates into the same bundle.
    > This approach helps when you need to include intermediate certificates or
    > explicitly include leaf certificates.
    > 
    > Include certificates in the bundle in the following order:
    > 
    > 1. Leaf certificates
    > 2. Intermediate certificates required by leaf certificates
    > 3. Root certificate

2.  Update your `AppInstance` resource to refer to the `custom-ca` config map.

    - **If modifying the `AppInstance` resource directly**:  
      Add the config map to the `.spec.package.spec.egress` property.
    - **If using the InfluxDB Clustered Helm chart**:  
      Set `useCustomEgress` to `true` and update the `egress` property to refer
      to the config map.

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[AppInstance](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      egress:
        customCertificates:
          valueFrom:
            configMapKeyRef:
              key: ca.pem
              name: custom-ca
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```yml
useCustomEgress: true
egress:
  customCertificates:
    valueFrom:
      configMapKeyRef:
        key: ca.pem
        name: custom-ca
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

## Apply the changes to your cluster

Use `kubectl` or `helm` (if using the InfluxDB Clustered Helm chart), to apply
the configuration changes to your cluster:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[kubectl](#)
[Helm](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->

```bash
kubectl apply \
  --filename myinfluxdb.yml \
  --namespace influxdb
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!-- pytest.mark.skip -->

```bash
helm upgrade \
  influxdata/influxdb3-clustered \
  -f ./values.yml \
  --namespace influxdb
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{< page-nav prev="/influxdb3/clustered/install/secure-cluster/" prevText="Secure your cluster" next="/influxdb3/clustered/install/secure-cluster/auth/" nextText="Set up authentication" >}}
