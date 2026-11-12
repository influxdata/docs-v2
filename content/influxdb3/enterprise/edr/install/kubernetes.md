---
title: Install EDR on Kubernetes
description: >
  Deploy EDR sender, receiver, and combined agents with Helm, durable
  object-store state, and Kubernetes token Secrets.
menu:
  influxdb3_enterprise:
    parent: edr-install
    identifier: edr-install-kubernetes
    name: Kubernetes and Helm
weight: 102
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@fcdf286 docs/external/kubernetes.md, deploy/helm-edr-adjunct/values.yaml, deploy/helm-edr-adjunct/templates/ -->

The `influxdb3-edr-adjunct` Helm chart deploys a separate EDR agent alongside an unmodified [InfluxDB 3 Enterprise Helm release](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-enterprise).
The sender reads the source's object store directly.
It does not inject a sidecar or change the server release.
The agent stores its cursor and journals in its own object-store location, separate from source data.
It needs no state PersistentVolumeClaim (PVC).

## Prerequisites

- An InfluxDB 3 Enterprise source on a [supported server line](/influxdb3/enterprise/edr/reference/compatibility/), using the upgraded storage engine and S3, Google Cloud Storage, or Azure Blob Storage.
- The EDR 1.0.0 image in a registry your Kubernetes nodes can pull from.
  Select the `amd64` or `arm64` image for your nodes.
- The EDR Helm bundle `edr-helm-v1.0.0.tgz` and its example values files.
  [Contact the InfluxData Sales team]({{< cta-link >}}) for artifacts and deployment coordination.
- Durable agent state storage and credentials that can access it.
  Senders also need source object-store access.
- A destination write token and a shared authentication token for each sender/receiver link.

Load the delivered image archive before pushing the required architecture's image to your registry:

```bash
docker load --input edr-images-v1.0.0.tar.gz
```

Use image tag `1.0.0-pro7dd361197e-amd64` or `1.0.0-pro7dd361197e-arm64`.
Set `image.repository` to your registry's image path in each values file.

## Choose a role

| `role` | Operation | Required configuration |
|---|---|---|
| `sender` | Reads a source store and sends data downstream. | `source`, `downstream`, and `state` |
| `receiver` | Accepts replication and writes to a destination server. | `receiver` and `state` |
| `combined` | Receives data into a local server and sends that server's data onward. | `source`, `downstream`, `receiver`, and `state` |

A sender-to-receiver pipeline uses two releases of the EDR chart.
Copy the corresponding example from the delivered chart into your own values file.
Keep the chart's `values.yaml` as a reference.
Extract the archive to access its examples:

```bash
tar --extract --gzip --file edr-helm-v1.0.0.tgz
```

The S3 examples below assume the Enterprise releases are named `idb-src` and `idb-dst` in the same namespace.
Replace bucket names, registry paths, and Secret names for your deployment.

> [!Important]
> Chart defaults assert `idempotentWrites: true` and set `concurrentSends: 8`.
> Use these defaults only for duplicate-safe workloads without overwrites.
> For workloads with overwrites, set `idempotentWrites: false`, `concurrentSends: 1`, and `historicFill: none`.
> See [Performance vs. correctness](/influxdb3/enterprise/edr/reference/config-file/#performance-vs-correctness).

## Deploy a sender

Create `my-sender.yaml`:

```yaml
role: sender
image:
  repository: REGISTRY/edr
  tag: "1.0.0-pro7dd361197e-amd64"
state:
  location: "s3://edr-state/idb-src"
s3:
  existingSecret: idb-src-influxdb3-enterprise-s3
source:
  releaseName: idb-src
  objectStore: s3
  s3:
    bucket: influxdb3-enterprise-src
tokenStore:
  existingSecret: edrs-tokens
downstream:
  address: "http://edrr-edr:9090"
  authToken: downstream-auth
  idempotentWrites: false
  concurrentSends: 1
  historicFill: none
```

Create the `edrs-tokens` Kubernetes Secret with a `downstream-auth` key containing the shared link token.
The `s3.existingSecret` must contain `access-key-id` and `secret-access-key` keys.
Its credentials must access both the source bucket and agent state location.

Install from the delivered chart archive:

```bash
helm install edrs ./edr-helm-v1.0.0.tgz --values my-sender.yaml
```

The agent's node name is `edrs-edr`.
The receiver must use this name in its upstream list.

## Deploy a receiver

Create `my-receiver.yaml`:

```yaml
role: receiver
image:
  repository: REGISTRY/edr
  tag: "1.0.0-pro7dd361197e-amd64"
state:
  location: "s3://edr-state/idb-dst"
s3:
  existingSecret: idb-dst-influxdb3-enterprise-s3
tokenStore:
  existingSecret: edrr-link-tokens
  extraSecrets:
    - idb-dst-admin-token
receiver:
  writeEndpoint: "http://idb-dst-influxdb3-enterprise-ingester:8181"
  upstreams:
    - name: edrs-edr
      authToken: link-auth
      writeToken: admin-token.json
```

Create `edrr-link-tokens` with a `link-auth` key whose value equals the sender's `downstream-auth` token.
Use the actual Secret configured by the destination Enterprise release's `security.auth.adminToken.existingSecret` in place of `idb-dst-admin-token`.
Its `admin-token.json` key mounts unchanged into the token directory.
Alternatively, supply a dedicated write token as its own file in a projected Secret and use that file name as `writeToken`.
The receiver needs no source store, but it needs credentials for its own state location.

```bash
helm install edrr ./edr-helm-v1.0.0.tgz --values my-receiver.yaml
```

## Deploy a combined relay

Start from the chart's `examples/values-combined.yaml`.
Set `role: combined` and configure both facets in one values file:

- Point `source` at the relay's own Enterprise store.
- Point `downstream.address` at the next receiver.
- Point `receiver.writeEndpoint` at the relay's own Enterprise write endpoint.
- Add each incoming sender to `receiver.upstreams` with its node name and token references.
- Set `state.location` to a separate durable location for the relay agent.
- Project all required incoming, outgoing, and write-token files through `tokenStore.existingSecret` and `tokenStore.extraSecrets`.

```bash
helm install edrm ./edr-helm-v1.0.0.tgz --values my-combined.yaml
```

## Object stores and token Secrets

S3, Google Cloud Storage, and Azure Blob Storage support both source reads and agent state.
Use `s3://`, `gs://`, or `az://` for `state.location`.
For sources, the chart uses `source.objectStore: s3`, `gcs`, or `azure`; this differs from the binary's `--object-store-type google` spelling.

| Provider | Source values | Credential values |
|---|---|---|
| S3 | `source.s3.bucket` | `s3.existingSecret` with `access-key-id` and `secret-access-key` |
| Google Cloud Storage | `source.gcs.bucket` | `gcs.existingSecret` with `service-account.json` |
| Azure Blob Storage | `source.azure.container` | `azure.storageAccount` and `azure.existingSecret` with `azure-storage-account-key` |

Where configured, platform identity can supply credentials instead of an explicit credential Secret.
See the delivered chart's values reference for provider settings and endpoints.

The chart projects token Secrets as files at `/etc/influxdb3-edr/tokens` and sets `INFLUXDB3_EDR_TOKEN_STORE`.
File names must match the configuration's token references.
The volume uses no `subPath` mount.
Once Kubernetes updates the projected files, the agent reads rotated tokens on the next use without a restart.
A Helm upgrade that changes chart-rendered config or token values rolls the pod through checksum annotations.
See [Manage tokens](/influxdb3/enterprise/edr/manage-tokens/).

## Operations and limitations

- Run exactly one replica per agent.
  The chart fixes `replicas: 1` and uses `strategy: Recreate` to avoid concurrent agents sharing state.
  Do not scale the Deployment.
- Keep the same `state.location` when replacing or restarting a Deployment.
  Its cursor and journals survive pod deletion in object storage.
- Apply configuration changes with `helm upgrade`; changes such as a downstream address require a restart.
- The `<release>-edr` ClusterIP Service exposes replication on port 9090 and observability on port 9091 by default.
  Scrape the observability port for [metrics](/influxdb3/enterprise/edr/monitor/).
- Source and state use one credential set per process.
  Keep both in the same provider and account.
- S3 source buckets are bucket-rooted; source bucket prefixes are not supported.
  Agent state can use its own prefix.
- File-backed source storage with a ReadWriteMany PVC is for development only.
  Use object storage for production.
