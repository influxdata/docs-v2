---
title: Secure your InfluxDB cluster
description: >
  ....
menu:
  influxdb_clustered:
    name: Secure your cluster
    parent: Install InfluxDB Clustered
weight: 104
---

- **OAuth 2.0 provider**:
  - Must support [Device Authorization Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow)
  - Tested and supported providers:
    - [Microsoft Entra ID _(formerly Azure Active Directory)_](https://www.microsoft.com/en-us/security/business/microsoft-entra)
    - [Keycloak](https://www.keycloak.org/)
    - [Auth0](https://auth0.com/)
- **TLS certificate**: for ingress to the cluster

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

## Ingress TLS

- Multiple ingress providers. Some provide simple mechanisms for creating and
  and managing TLS certificates.

If using the InfluxDB-defined ingress, add a valid TLS Certificate to the
cluster as a secret. Provide the paths to the TLS certificate file and key file:

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

- **`spec.package.spec.ingress.tlsSecretName`: TLS certificate secret name**

  Provide the name of the secret that
  [contains your TLS certificate and key](#set-up-cluster-ingress).
  The examples in this guide use the name `ingress-tls`.

  _The `tlsSecretName` field is optional. You may want to use it if you already have a TLS certificate for your DNS name._

  {{< expand-wrapper >}}
  {{% expand "Use cert-manager and Let's Encrypt to manage TLS certificates" %}}

If you instead want to automatically create an [ACME](https://datatracker.ietf.org/doc/html/rfc8555)
certificate (for example, using [Let's Encrypt](https://letsencrypt.org/)), refer
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


<!-- HELM version of TLS config -->

{{< expand-wrapper >}}
  {{% expand "Use cert-manager and Let's Encrypt to manage TLS certificates" %}}

If you instead want to automatically create an [ACME](https://datatracker.ietf.org/doc/html/rfc8555)
certificate (for example, using [Let's Encrypt](https://letsencrypt.org/)), refer
to the [cert-manager documentation](https://cert-manager.io/docs/usage/ingress/).
In `ingress.tlsSecretName`, provide a name for the secret it should create.

{{% note %}}
If you choose to use cert-manager, it's your responsibility to install and configure it.
{{% /note %}}
{{% /expand %}}
{{< /expand-wrapper >}}

{{% code-callout "ingress-tls|cluster-host\.com" "green" %}}

```yaml
ingress:
  hosts:
    - {{< influxdb/host >}}
  tlsSecretName: ingress-tls
```

{{% /code-callout %}}

<!-- END HELM TLS CONFIG -->

## Require HTTPS the object store

- `spec.package.spec.objectStore.allowHttp`:
  _Set to `false` to disallow unencrypted HTTP connections_

```yml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
# ...
spec:
  package:
    spec:
      objectStore:
        allowHttp: 'false'
```

<!--  -->

### Provide a custom certificate authority bundle {note="Optional"}

InfluxDB attempts to make TLS connections to the services it depends on--notably,
the [Catalog](/influxdb/clustered/reference/internals/storage-engine/#catalog)
and the [Object store](/influxdb/clustered/reference/internals/storage-engine/#object-store).
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
    
    {{% note %}}
This PEM bundle file establishes a chain of trust for the
external services that InfluxDB depends on.
It's *not* the certificate that InfluxDB uses to
host its own TLS endpoints.
    {{% /note %}}

    In the example, replace `/path/to/private_ca.pem` with the path to your PEM-formatted certificate bundle file:

    <!-- pytest.mark.skip -->

    ```bash
    kubectl --namespace influxdb create configmap custom-ca --from-file=certs.pem=/path/to/private_ca.pem
    ```

    {{% note %}}
#### Bundle multiple certificates

You can append multiple certificates into the same bundle.
This approach helps when you need to include intermediate certificates or explicitly include leaf certificates.

Include certificates in the bundle in the following order:

1. Leaf certificates
2. Intermediate certificates required by leaf certificates
3. Root certificate
    {{% /note %}}

2.  In `myinfluxdb.yml`, update the `.spec.package.spec.egress` field to refer
    to the config map that you generated in the preceding step--for example:

    ```yml
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

<!-- HELM VERSION -->

### Provide a custom certificate authority bundle {note="Optional"}

InfluxDB attempts to make TLS connections to the services it depends on; notably
the [Catalog](/influxdb/clustered/reference/internals/storage-engine/#catalog),
and the [Object store](/influxdb/clustered/reference/internals/storage-engine/#object-store).
InfluxDB validates the certificates for all of the connections it makes.

**If you host these services yourself and you use a private or otherwise not
well-known certificate authority to issue certificates to theses services**, 
InfluxDB will not recognize the issuer and will be unable to validate the certificates.
To allow InfluxDB to validate these certificates, provide a PEM certificate
bundle containing your custom certificate authority chain.

1.  Use `kubectl` to create a config map containing your PEM bundle.
    Your certificate authority administrator should provide you with a
    PEM-formatted certificate bundle file.
    
    {{% note %}}
This PEM-formatted bundle file is *not* the certificate that InfluxDB uses to
host its own TLS endpoints. This bundle establishes a chain of trust for the
external services that InfluxDB depends on.
    {{% /note %}}

    In the example below, `private_ca.pem` is the certificate bundle file.

    ```sh
    kubectl --namespace influxdb create configmap custom-ca --from-file=certs.pem=/path/to/private_ca.pem
    ```

    {{% note %}}
It's possible to append multiple certificates into the same bundle.
This can help if you need to include intermediate certificates or explicitly
include leaf certificates. Leaf certificates should be included before any
intermediate certificates they depend on. The root certificate should
be last in the bundle.
    {{% /note %}}

2.  Update your `values.yaml` to enable custom egress and refer to your
    certificate authority config map. Set `useCustomEgress` to `true` and update
    the `egress` property to refer to that config map. For example:

    ```yml
    useCustomEgress: true
    egress:
      #    # If you're using a custom CA you will need to specify the full custom CA bundle here.
      #    #
      #    # NOTE: the custom CA is currently only honoured for outbound requests used to obtain
      #    # the JWT public keys from your identiy provider (see `jwksEndpoint`).
      customCertificates:
        valueFrom:
          configMapKeyRef:
            key: ca.pem
            name: custom-ca
    ```

<!-- END HELM VERSION -->
