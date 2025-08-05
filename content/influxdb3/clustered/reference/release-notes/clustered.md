---
title: InfluxDB Clustered release notes
description: >
  View InfluxDB Clustered release information including new features, bug fixes, and more.
menu:
  influxdb3_clustered:
    parent: Release notes
    name: InfluxDB Clustered
    identifier: clustered-release-notes
weight: 201
---

> [!Note]
> ## Checkpoint releases {.checkpoint}
> 
> Some InfluxDB Clustered releases are checkpoint releases that introduce a
> breaking change to an InfluxDB component.
> When [upgrading InfluxDB Clustered](/influxdb3/clustered/admin/upgrade/),
> **always upgrade to each checkpoint release first, before proceeding to newer versions**.
> 
> Checkpoint releases are only made when absolutely necessary and are clearly
> identified below with the <span class="cf-icon Shield pink"></span> icon.

{{< expand-wrapper >}}
{{% expand "Download release artifacts manually" %}}

To download a bundle of release artifacts for a specific version of
InfluxDB Clustered:

1.  [install `crane`](https://github.com/google/go-containerregistry/tree/main/cmd/crane#installation)
    and [`jq`](https://jqlang.org/download/).
2.  Ensure your InfluxData pull secret is in the `/tmp/influxdbsecret` directory
    on your local machine. This secret was provided to you by InfluxData to
    authorize the use of InfluxDB Clustered images.
3.  Run the following shell script:

{{% code-placeholders "RELEASE_VERSION" %}}
<!-- pytest.mark.skip -->
```bash
INFLUXDB_RELEASE="RELEASE_VERSION"
IMAGE="us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:$INFLUXDB_RELEASE"
DOCKER_CFG="/tmp/influxdbsecret"

DIGEST=$(DOCKER_CONFIG="$DOCKER_CFG" crane manifest "$IMAGE" | jq -r '.layers[1].digest')

DOCKER_CONFIG="$DOCKER_CFG" \
crane blob "$IMAGE@$DIGEST" | tar -xvzf - -C ./
```
{{% /code-placeholders %}}

_Replace {{% code-placeholder-key %}}`RELEASE_VERSION`{{% /code-placeholder-key %}}
with the InfluxDB Clustered release version you want to download artifacts for._

The script creates an `influxdb-3.0-clustered` directory in the current working
directory. This new directory contains artifacts associated with the specified release.

{{% /expand %}}
{{< /expand-wrapper >}}

{{< release-toc >}}

---

## 20250721-1796368 {date="2025-07-21"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20250721-1796368
```

#### Release artifacts
- [app-instance-schema.json](/downloads/clustered-release-artifacts/20250721-1796368/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20250721-1796368/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)


### Highlights

#### Integral support

InfluxQL `INTEGRAL()` function is now supported in the InfluxDB 3.0 database engine.

### Bug Fixes

- Fix `SHOW TABLES` timeout when a database has a large number of tables.

---

## 20250707-1777929 {date="2025-07-07"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20250707-1777929
```

#### Release artifacts
- [app-instance-schema.json](/downloads/clustered-release-artifacts/20250707-1777929/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20250707-1777929/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)


### Highlights

#### Database rename and undelete

Databases can now be renamed and undeleted with [influxctl v2.10.2](/influxdb3/clustered/reference/release-notes/influxctl/#v2102) or later.

#### Table delete and list

Tables can now be deleted and listed with [influxctl v2.10.2](/influxdb3/clustered/reference/release-notes/influxctl/#v2102) or later.

#### Faster ingester recovery

Persist queue workers now scale up when the queue is saturated to allow ingesters to get through the backlog quickly and restore write availability.

### Changes

#### Database Engine

- Update DataFusion to `47` and Apache Arrow to `55`.

---

## 20250618-1758428 {date="2025-06-18"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20250618-1758428
```

#### Release artifacts
- [app-instance-schema.json](/downloads/clustered-release-artifacts/20250618-1758428/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20250618-1758428/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Bug Fixes
- Update Grafana to `12.0.1-security-01` to address CVE-2025-3415, CVE-2025-4123, and CVE-2025-3580.

### Changes

#### Database Engine

- Update DataFusion to `45` and Apache Arrow to `54`.

---

## 20250613-1754010 {date="2025-06-11"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20250613-1754010
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20250613-1754010/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20250613-1754010/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Bug Fixes

- Remove default CPU and memory limits for the Catalog service and Prometheus.
- Add time formatting checks to reject invalid custom partitioning requests.
- Ensure that an incorrect backup is not created when `pg_dump` errs during data snapshot backups.

### Changes

#### Deployment

- Add support for Prometheus v3 when using the observability feature.
- Refresh dependencies to address security vulnerabilities and improve stability.

#### Configuration

- Change the default of `INFLUXDB_IOX_CREATE_CATALOG_BACKUP_INTERVAL` from `1h`
  to `4h`.
- Introduce the following environment variables to help in cases where the
  object store is large enough that the the garbage collector cannot keep up
  when cleaning obsolete objects:

  - `INFLUXDB_IOX_GC_PRIMARY_OBJECTSTORE_PARTITIONS`
  - `INFLUXDB_IOX_GC_SECONDARY_OBJECTSTORE_PARTITIONS`

  > [!Note]
  > Increasing these settings will add load to the object store and should not
  > be modified unnecessarily.

---

## 20250508-1719206 {date="2025-05-08"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20250508-1719206
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20250508-1719206/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20250508-1719206/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Changes

#### Deployment

- Expose the v0 REST API for the management and authorization service (Granite).

#### Database Engine

- Reuse database names after deletion.
- Create database tokens with expiration dates.
- Revoke database tokens rather than deleting them.

---

## 20250212-1570743 {date="2025-02-12"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20250212-1570743
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20250212-1570743/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20250212-1570743/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Bug Fixes

This release fixes a bug in the 20241217-1494922 release where the default 
Prometheus CPU limit was set to an integer instead of a string.

### Changes

#### Deployment

- Expose the Prometheus `retention` period to let users set a custom
  retention period for Prometheus metrics.

#### Database Engine

- Upgrade DataFusion
- Add the ability to restore a cluster from a Catalog store snapshot.

---

## 20241217-1494922 {date="2024-12-17"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20241217-1494922
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20241217-1494922/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20241217-1494922/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Bug Fixes

This fixes a bug present in release [20241024-1354148](#20241024-1354148), in
which `core` pods used an invalid DSN (omitting the `?` in the query string)
when attempting to connect to PostgreSQL. `core` pods now properly populate the
DSN before connecting.

### Changes

#### Deployment

- Entitlements associated with a `License` Custom Resource (CR), including the
  license expiration date, are now exposed in the `entitlements` property of
  that CR's `spec`.
- Reduced default log level from `debug` to `info` in auth sidecar.

#### Database Engine

- Datafusion upgrades
- Upgrade Rust to 1.83.0

---


## 20241024-1354148 {date="2024-10-24" .checkpoint}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20241022-1346953
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20241024-1354148/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20241024-1354148/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Known Bugs

### `core` service DSN parsing errors

This release has a known bug in the `core` pods with respect to handling of
options in Postgres DSNs. This bug can be seen in the `core-MMMMMMMMMM-NNNNN`
logs that look like the following:

```
2024-11-04T01:00:00.000Z | 3: error returned from database: database "influxdb&options=-c%20search_path=" does not exist
2024-11-04T01:00:19.000Z | 4: database "influxdb&options=-c%20search_path=" does not exist
```

Due to incorrect parsing of the
`POSTGRES_DSN` environment variable, the `influxdb&options=-c%20search_path=` string is
interpreted as the database name.

To work around this bug, in your AppInstance, 
include a `spec.package.spec.images.overrides` section to override the
`core` pods built-in image with an image that has the bugfix for the DSN
parsing error--for example:

```
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20241024-1354148
    apiVersion: influxdata.com/v1alpha1
    spec:
      images:
        overrides:
          - name: 'influxdb2-artifacts/granite/granite'
            newFQIN: 'us-docker.pkg.dev/influxdb2-artifacts/granite/granite:7acf9ca6e1ad15db80b22cd0bc071acdb561eb51'
# ...[remaining configuration]
```

### Highlights

#### AppInstance image override bug fix

In 20240925-1257864, the AppInstance image override was
broken with the introduction of strict always-on license enforcement.
This release fixes that bug.

This bug is expected to have an outsized impact on customers running InfluxDB
Clustered in air-gapped environments where the deployment model involves
overriding the default image repository to point to images copied to an
air-gapped registry.

This release is an alternative to 20240925-1257864 for
customers who depend on this image override feature.

#### Upgrade bug fix

20240925-1257864 introduced a schema migration bug that
caused an `init` container in the `account` Pods to hang indefinitely.
This would only affect InfluxDB Clustered during an upgrade; not a fresh install.
The 20240925-1257864 release has been removed from the release notes, but
relevant updates are included as part of this 20241024-1354148 release.

For customers who experience this bug when attempting to upgrade to
20240925-1257864, upgrade to this 20241024-1354148 instead.

#### Default to partial write semantics

In InfluxDB Clustered 20240925-1257864+, "partial writes" are enabled by default.
With partial writes enabled, InfluxDB accepts write requests with invalid or
malformed lines of line protocol and successfully write valid lines and rejects
invalid lines. Previously, if any line protocol in a batch was invalid, the
entire batch was rejected and no data was written.

To disable partial writes and revert back to the previous behavior, set the
`INFLUXDB_IOX_PARTIAL_WRITES_ENABLED` environment variable on your cluster's
Ingester to `false`. Define this environment variable in the
`spec.package.spec.components.ingester.template.containers.iox.env` property in
your `AppInstance` resource.

{{< expand-wrapper >}}
{{% expand "View example of disabling partial writes in your `AppInstance` resource" %}}

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    spec:
      components:
        ingester:
          template:
              containers:
                iox:
                  env:
                    INFLUXDB_IOX_PARTIAL_WRITES_ENABLED: false
```

{{% /expand %}}
{{< /expand-wrapper >}}

For more information about defining variables in your InfluxDB cluster, see
[Manage environment variables in your InfluxDB Cluster](/influxdb3/clustered/admin/env-vars/).

##### Write API behaviors

When submitting a write request that includes invalid or malformed line protocol,
The InfluxDB write API returns a 400 response code and does the following: 

- With partial writes _enabled_:

  - Writes all valid points and rejects all invalid points.
  - Includes details about the [rejected points](/influxdb3/clustered/write-data/troubleshoot/#troubleshoot-rejected-points)
    (up to 100 points) in the response body.

- With partial writes _disabled_:

  - Rejects all points in the batch.
  - Includes an error message and the first malformed line of line protocol in
    the response body.

#### Deploy and use the Catalog service by default

The Catalog service is a new IOx component that centralizes access to the
InfluxDB Catalog among Ingesters, Queriers, Compactors, and Garbage Collectors.
This is expected to improve Catalog query performance overall with an expected
drop in ninety-ninth percentile (p99) latencies.

### Upgrade notes

#### License now required

A valid license token is now required to start up your InfluxDB Cluster.
To avoid possible complications, ensure you have a valid license token. If you
do not, contact your InfluxData sales representative to get a license token
**before upgrading to this release**.

#### Removed prometheusOperator feature flag

The `prometheusOperator` feature flag has been removed.
**If you current have this feature flag enabled in your `AppInstance` resource,
remove it before upgrading to this release.**
This flag was deprecated in a previous release, but from this release forward,
enabling this feature flag may cause errors.

The installation of the Prometheus operator should be handled externally.

### Changes

#### Deployment

- Enable overriding the default CPU and memory resource requests and limits for
  the Garbage collector and Catalog services.
- Remove the Gateway service and implement the newly introduced Core service.
- Fix logic related to applying default resource limits for IOx components.
- Support [`ResourceQuota`s](https://kubernetes.io/docs/concepts/policy/resource-quotas/)
  with the `enableDefaultResourceLimits` feature flag. This causes resource
  limits to be applied even to containers that don't normally have limits
  applied.
- Introduces the `nodeAffinity` and CPU/Memory requests setting for "granite"
  components. Previously, these settings were only available for core IOx
  components.
- Prior to this release, many of the IOx dashboards deployed with the `grafana`
  feature flag were showing "no data." This has been fixed and now all
  dashboards should display actual data.

#### Database Engine

- Adjusted compactor concurrency scaling heuristic to improve performance as
  memory and CPU scale.
- Adjusted default `INFLUXDB_IOX_COMPACTION_PARTITION_MINUTE_THRESHOLD` from
  `20m` to `100m` to help compactor more quickly rediscover cool partitions.

#### Configuration

- Introduces the `podAntiAffinity` setting for InfluxDB Clustered components.
  Previously, the scheduling of pods was influenced by the Kubernetes
  scheduler's default behavior. For further details, see the
  [Kubernetes pod affinity documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#types-of-inter-pod-affinity-and-anti-affinity).

---

## 20240819-1176644 {date="2024-08-19" .checkpoint}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20240819-1176644
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20240819-1176644/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20240819-1176644/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

#### `admin` section is no longer required

Previously, an identity provider setup was required through the `admin` section
of the `AppInstance` resource, for example:

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
  package:
    image: <IMAGE>
    apiVersion: influxdata.com/v1alpha1
    spec:
      ## ...snip
      admin:
        users:
          - ...
        dsn:
          valueFrom:
            ...
        identityProvider: <PROVIDER>
        jwksEndpoint: <JWKS_ENDPOINT>
```

This section is no longer required and will no longer result in a schema
validation error when omitted.
When the `admin` section is omitted, the `admin-token` `Secret` can be used
instead to get started quickly.

> [!Note]
> We recommend OAuth for production; however, the `admin-token` lets you run an
> InfluxDB Cluster without having to integrate with an identity provider.**

### Upgrade notes

This release includes some preparatory work for changes being made to database
schemas  and tooling for internal services. It does not have an impact to
customer workloads.

### Changes

#### Deployment

- Various Grafana dashboard updates.
- A best-effort, pre-populated `influxctl` config file is provided as a
  `ConfigMap` for your convenience.
- Limit garbage collector replicas to 1, see the
  [documentation](/influxdb3/clustered/reference/internals/storage-engine/#garbage-collector-scaling-strategies) 
  for further details.

#### Database engine

- Improved efficiency of system table queries.
- Fixes for InfluxQL handling of `0` divisor.
- Improve router performance when retrieving statistics.
- Support InfluxQL queries over FlightSQL.
- Various dependency updates.

#### Configuration

- Added schema definitions for `admin.users`.

---

## 20240717-1117630 {date="2024-07-17"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20240717-1117630
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20240717-1117630/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20240717-1117630/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

#### Experimental license enforcement

This release introduces a new feature flag, `useLicensedBinaries`, that causes
InfluxDB to execute IOx components a container image implementing a new license
enforcement mechanism. License enforcement mechanisms include:

- A proper `License` Custom Resource manifest must be installed in the
  namespace to which InfluxDB Clustered is deployed. Only one `License` named
  `iox-license` may be deployed per namespace.
- Without a valid `License`, IOx pods crashloop with error logs indicating that
  no valid license can be loaded.
  - A valid `License` is one that is properly signed by InfluxData and has not
    exceeded its hard expiration date.
- One month before the `License` expires, all components begin logging
  pending expiry warning messages. These are visible with `kubectl log -n
  <namespace> <pod>`.
- If a valid `License` expires while the system is running, it enters a grace
  period.
- During the `License`'s grace period, the following happens:
  - Throughout the grace period, all components gradually increase the
    frequency of license expiry warnings.
  - One week into the grace period, the InfluxDB 3 Querier begins returning
    `FailedPrecondition` gRPC responses for the first 5 minutes of every hour.
  - One month into the grace period, the InfluxDB 3 Querier begins returning
    `FailedPrecondition` gRPC responses 100% of the time until the grace period
    ends.
- At the end of the `License` grace period, all IOx components shutdown as
  this is the "hard expiration" date when the binaries no longer consider
  the `License` valid.

This feature is being released on an experimental, opt-in basis while we work
with a small group of customers before making requiring licenses to run
InfluxDB Clustered. Before enabling the feature, please be sure you have a
`License` manifest provided to you by your InfluxData sales representative.

#### Default querier count increased

Prior to this release, the number of queriers which were spawned from the
default configuration was 1.
This has now been increased to 3. If you have previously overwritten the default
in the `AppInstance` resource, it is no longer required:

```yaml
apiVersion: kubecfg.dev/v1alpha1
kind: AppInstance
metadata:
  name: influxdb
  namespace: influxdb
spec:
   ...
      resources:
        querier:
          requests:
            #replicas: 3 # No longer required!
```

If you wish to keep the number of queriers to 1, you must override the
`replicas` as shown above.
Refer to the schema for further details.

This new configuration serves as a scalable default installation for
InfluxDB Clustered.

### Changes

#### Deployment

- Ingesters now have a `terminationGracePeriodSeconds` value of `600` to provid
  enough time to persist all buffered data.

#### Database engine

- Changed default `INFLUXDB_IOX_COMPACTION_*_CONCURRENCY` to be set based on
  available memory rather than available cores.
- Improved metadata caching and queries.
- Improved cache read efficiency.
- Improved cache cleaning.
- Fixed some I/O delays on query planning.
- Better handling for resizing worker pools.
- Faster recovery from ingester crashes.
- Faster graceful shutdown of terminating ingester pods.
- Fixed a rare issue where ingesters could become unresponsive after hitting
  memory limits.
- Added per-table column limit, to prevent unintended schema expansion.
- Reduced intermediate compactor writes to object storage.
- Increase compactor throughput.
- Numerous telemetry improvements.
- Reduced write thrashing in the catalog.
- Fixed errors with queries that use gap filling.
- Fixed errors with multiple rounds of bulk ingestion.
- Tuned garbage collector.
- Fixed some intermittent failures in bulk ingest.
- Reduced some network gossip between IOx pods.
- Fixed some inconsistent results on leading edge queries.
- Fixed WAL storage leak during ingester crash recovery.
- Improved garbage collection of data beyond the retention limit.

---

## 20240605-1035562 {date="2024-06-05" .checkpoint}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20240605-1035562
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20240605-1035562/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20240605-1035562/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

Multiple improvements to compaction, pruning, and performance of concurrent queries.

#### Feature flag: `noPrometheus`

The introduction of the `noPrometheus` feature flag removes the `StatefulSet`
and other resources related to a bare-bones installation of Prometheus that
could be used for basic monitoring of InfluxDB Clustered.

This feature flag is useful in cases where you already have an installation of
Prometheus and you wish to use it to monitor your InfluxDB cluster.

Refer to the `AppInstance` schema for further details regarding feature flags.

### Upgrade notes

Air-gapped installations need to prefetch the new granite image.

```
us-docker.pkg.dev/influxdb2-artifacts/granite/granite@sha256:1683f97386f8af9ce60662ae4ff423770fee166b11378583e211ea30dc849633
```

For more information, see the
[documentation](/influxdb3/clustered/install/set-up-cluster/configure-cluster/?t=Private+registry+%28air-gapped%29#public-registry-non-air-gapped).

### Changes

#### Deployment

- Updated Granite components to reference a single image, reducing the overall
  image size.
- Added Grafana licensing dashboard.
- Added the `noPrometheus` feature flag.

#### Database engine

- Ingesters now provide a soft, best-effort memory limit.
  - Provided by `INFLUXDB_IOX_RAM_SOFT_LIMIT_BYTES`, which applies a ceiling
    from a percentage of the container memory to avoid `OOMKilled` scenarios.
  - Upon reaching this limit, InfluxDB Clustered attempts to persist all
    buffered data is and returns a resource exhaustion error for write requests
    until memory usage is below 50%.
- Catalog cache write batching.
- Multiple compactor improvements.
- Improved performance of some metadata queries.
- Improved concurrent query performance.
  - Adjusted querier partitions assigned to large queries to reduce latency of
    sub-second queries and prevent resource bottlenecks cause by long running
    queries.
  - This can be tuned with the `INFLUXDB_IOX_NUM_QUERY_PARTITIONS` environment
    variable.
- Improved reporting for InfluxQL syntax errors.

---

## 20240430-976585 {date="2024-04-30"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20240430-976585
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20240430-976585/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20240430-976585/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

- Added configuration settings for an optional Prometheus `ServiceMonitor`
  under `observability.serviceMonitor`
  - The feature flag is now deprecated, and will be removed in a future release.

  > [!Warning]
  > Using this setting will delete and recreate the existing serviceMonitor
  > resource that was provided by the feature flag.

#### Deployment

- Removed Nginx server snippet annotations (`nginx.ingress.kubernetes.io/server-snippet`).
- Added `observability` key in the `AppInstance` resource.

#### Database engine

- Improved `NULL` handling for InfluxQL.

---

## 20240418-955990 {date="2024-04-18"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20240418-955990
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20240418-955990/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20240418-955990/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

#### Minimum `influxctl` version

If a user observes an unimplemented gRPC error when running `influxctl database`
commands, then the user should upgrade to `influxctl` v2.8.0 or later and
ensure they are running InfluxDB Clustered [20240326-922145](#20240326-922145)
or newer.

If upgrading InfluxDB Clustered is not an option, you can continue to use a
version of `influxctl` prior to v2.8.0.

### Changes

#### Deployment

- Routers now calculate the value of write replication based on the number of
  running ingesters.
  - This can be tuned through the `INFLUXDB_IOX_RPC_WRITE_REPLICAS` environment
    variable; however, high values can impact the performance of the system.

#### Database engine

- Router cache entries for namespace and retention periods are updated
  immediately via gossip.
  - Pod restarts are no longer required to immediately see updates.
- Fixes to InfluxQL gap-filling mechanism, `FILL`.

---

## 20240326-922145 {date="2024-03-26"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20240326-922145
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20240326-922145/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20240326-922145/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

#### Lower defaults for garbage collection

Prior to this release, the garbage collector was set at 100 days before objects,
that were no longer returned by queries, were deleted from object store.
This has been reduced to 30 days.
High values lead to a situation where there are many dangling objects and
therefore many unnecessary references in the catalog, which increases
operational burden and cost.

#### Added support for nodeAffinity at the per-component level

Introduces the `nodeAffinity` setting for individual components within
InfluxDB Clustered. Previously, the scheduling of pods was influenced by the
Kubernetes scheduler's default behavior. For further details, please consult the
[documentation](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).

### Changes

#### Deployment

- Support for environment variable modifications to specific components.
- Update optional Grafana component to version 10.3.4.
  - This upgrade from 9.x brings with it support for the SQL query type in the
    InfluxDB data source.

#### Database engine

- Various additional metrics and performance improvements.
- Improve compactor concurrency heuristics.
- Fix gRPC reflection to only include services served by a particular listening
  port.
  
  > [!Note]
  > `arrow.flight.protocol.FlightService` is known to be missing in the
  > `iox-shared-querier`'s reflection service even though `iox-shared-querier`
  > does run that gRPC service.

---

## 20240227-883344 {date="2024-02-27"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20240227-883344
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20240227-883344/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20240227-883344/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Changes

#### Deployment

- Gossip communication between the `global-router`, `iox-shared-compactor`, and 
  iox-shared-ingester` now works as expected.
- Provide sane defaults to the `global-router` for maximum number of concurrent
  requests.
- Lower the number of ndots for `dnsConfig` for IOx components.

#### Database engine

- `SHOW TAG VALUES` no longer causes a crash in the querier when the database
  has a large number of measurements.
- Number of partitions scanned over in the querier is now limited for safety.

---

## 20240214-863513 {date="2024-02-14" .checkpoint}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20240214-863513
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20240214-863513/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20240214-863513/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

#### Grafana dashboards by default

Previously, the `grafana` feature flag had to be enabled in order to have these
dashboards created. This now occurs by default and the feature flag is reserved
entirely for the creation of a Grafana `Deployment` and remains experimental.

The contents of these dashboards are placed within various `ConfigMap` resources,
under common format `grafana-dashboard-<uid>`. They can either be imported or
mounted into your existing Grafana instance.

### Upgrade notes

#### Consolidated authentication

An authentication component, previously known as `authz`, has been consolidated
into the `token-management` service.

Now there is a temporary `Job` in place, `delete-authz-schema`, that
automatically removes the `authz` schema from the configured PostgreSQL database.

### Changes

#### Documentation

- Fixed Google example in `example-customer.yml` file.

#### Deployment

- Fixed a logical error in the configuration when using Google Workload Identity
  caused the `INFLUXDB_IOX_OBJECT_STORE` variable to be set to `memory` instead
  of `google`.
- Compactor configuration concurrency is now derived from CPU limit of the pod.
- Compactor now has a lower L1 compaction threshold.

#### Database engine

- Correctly validate string length for column sizes.
- FlightSQL support for prepared statements.
- Improve metrics exposed by the compactor.
- Further optimizations to `LIMIT` queries.
- Add `SPREAD`, `MODE`, and `ELAPSED` support for InfluxQL.
- Add `EXPLAIN` to all supported statements in InfluxQL.
- Tracing correctly exposes HTTP path metrics.
- Dependency updates.

---

## 20240111-824437 {date="2024-01-11"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20240111-824437
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20240111-824437/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20240111-824437/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

#### Ingress improvements

- Ingress no longer requires a host name to be specified.
- When a TLS secret is not specified, the TLS annotations are not generated.

##### Istio support

This release includes first class support for Istio via the `Gateway` and
`VirtualService` resources.

This is enabled through the `ingress` key of the `AppInstance` resource--for example:

```yaml
package:
  spec:
    ingress:
      template:
        kind: 'Gateway'
        apiVersion: 'networking.istio.io/v1beta1'
        ## At present the 'selector' field is only used for Istio, this maps
        ## directly to the Gateway selector to decide which Istio ingress controller
        ## pods should serve the configured Gateway.
        selector:
          istio: 'ingressgateway'
```

Note that the use of `Gateway` implies the need for `VirtualService` resources,
these are automatically created for you.


### Upgrade notes

As part of a `partition_id` migration that runs, if you have more than 10
million rows in the `parquet_file` table, reach out to your Sales representative
before proceeding. You can confirm this with the following query: 

```sql
SELECT count(*) FROM iox_catalog.parquet_file
```

### Changes

#### Database engine

- `partition_id` is now used to consistently address a partition in the catalog.
  This requires a migration which may take some time to complete.
- Bug fixes and dependency updates.

---

## 20231213-791734 {date="2023-12-13"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20231213-791734
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20231213-791734/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20231213-791734/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

#### Labels/annotations

- You can now add custom annotations and labels in pods by specifying them under
  `spec.package.spec.components.*.metadata`
- Common settings for all components can be specified under
  `spec.package.spec.components.common`. This is useful when you need to
  configure common node selectors, taint tolerations, and annotations to adapt
  the workload to requirements of your specific execution environment.

#### Contour ingress support

Services are now properly annotated to support the Contour Ingress controller.

### Changes

#### Database engine

- Empty string values for `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are ignored.
- Dependency updates.
- Query performance improvements.
- Ingester active persist tasks are tracked as a metric.
- WAL rotation logs moved from debug to info log level.
- Fixed an issue where the compactor could get stuck until reboot.
- Fixed an issue where the compactor might panic.
- Added L2 -> L2 compactions when there are many small L2 files.

---

## 20231117-750011 {date="2023-11-17"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20231117-750011
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20231117-750011/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20231117-750011/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

> ![Important]
> **This release fixes a regression in the database engine that was introduced in
> [20231115-746129](#20231115-746129).**

### Changes

#### Deployment

- Add support for tuning per-component log filters.
- Add support for `tolerations` at the per-component level.

---

## 20231115-746129 {date="2023-11-15"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20231115-746129
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20231115-746129/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20231115-746129/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

#### Ingress templating

This update enables custom annotations on the `Ingress` resources.
This is useful when configuration ingress alongside third-party software, such
as `cert-manager`.

##### OpenShift `Route`

Along with the ingress templating feature, this version includes OpenShift
`Route` support.
Specify the `apiVersion` and `kind` of the `ingress` configuration to align
with `Route`s and change the typical `Ingress` objects to their `Route` equivalent.

```yaml
spec:
  package:
    spec:
      ingress:
        template:
          apiVersion: "route.openshift.io/v1"
          kind: "Route"
```

#### Support for Google Cloud Storage (GCS)

We now expose a `google` object within the `objectStore` configuration, which
enables support for using Google Cloud's GCS as a backing object store for IOx
components. This supports both
[GKE workload identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)
and [IAM Service Account](https://cloud.google.com/kubernetes-engine/docs/tutorials/authenticating-to-cloud-platform#step_3_create_service_account_credentials)
authentication methods.

#### Support for bypassing identity provider configuration for database/token management

We now generate a valid access token for managing Databases and Tokens and store
it as a secret within the namespace that InfluxDB is deployed. Use this token in
lieu of configuring an identity provider with `influxctl` for interacting with
the cluster.
**This access token is intended only for testing and is not recommended for use in production**.

This feature requires `influxctl` version 2.2.0 or later. To use the access
token, you first need to copy it to a file by running the following command:

<!-- pytest.mark.skip -->

```bash
kubectl get secrets/admin-token --template={{.data.token}} -n <your_influxdb_namespace> | base64 -d > token.json
```

After that, you need to tell `influxctl` where to find the access token by
adding the following lines to your `profile.toml` file.

```toml
[profile.auth.token]
token_file = "/path/to/token.json"
```

This is a long-lived access token. Currently, the only way to revoke the token
is to perform the following actions in this order:

1. Delete the `rsa-keys` secret from your Clustered context and namespace.
2. Rerun the `key-gen` job.
3. Restart the `authz` service.

If you want to create a new admin token after revoking the existing one, re-run
the `create-admin-token` job.

### Changes

#### Deployment

- Increase HTTP write request limit from 10 MB to 50 MB.
- Added support for [Telegraf Operator](https://github.com/influxdata/telegraf-operator).
  We have added the `telegraf.influxdata.com/port` annotation to all the pods.
  No configuration is required. We don't yet provide a way to specify the
  `telegraf.influxdata.com/class` annotation, which means the pods use the
  default Telegraf operator class (called `default`).
- Implement `ingress.template` for `Ingress` and openshift `Route`.
- Add `nodeSelector` support.
- Add Google Cloud support.
- Fix JSONSchema for `value` and `valueFrom` configuration.
- Remove `AWS_ACCESS_KEY_ID` and AWS_SECRET_ACCESS_KEY` environment variabless
  when [EKS IRSA](#eks-irsa) is enabled.

#### Database engine

- Ingester performance improvements.
- Query pruning improvements where, in many cases, less data is fetched.
- New compactor metrics.
- Compactor tuning: autoscale L1 compaction threshold based on load.
- FlightSQL query gRPC keep-alive fixes.
- Log some querier configs during startup.
- Bulk ingest gRPC API improvements.
- Add `partition_template` column to `system.tables` table.
- Add `last_new_file_created_at`, ` last_deleted_file_at`, `num_files` ,
  `total_size_mb` columns to `system.partitions` table.
- Enable gossip cache distribution for faster cache coherence between nodes.

---

## 20231024-711448 {date="2023-10-24"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20231024-711448
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20231024-711448/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20231024-711448/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

#### Additional `AppInstance` parameters

This includes an addition to the `AppInstance` `package` specification with a
new key: `hostingEnvironment`.
Going forward, this object will be updated with various environment-specific
functionality aimed at where you _host_ InfluxDB Clustered, such as `aws` or
`openshift`.

##### EKS IRSA

With the addition of the `hostingEnvironment` configuration to the `AppInstance`
resource, InfluxDB now supports passing an `eksRoleArn`.
This role ARN is placed onto the IOx `ServiceAccount`.
Please ensure that the role you provide has AWS S3 permissions.

##### OpenShift

InfluxDB Clustered now also support the `openshift` key under the
`hostingEnvironment` object. This specifies OpenShift tailored configuration for
your environment.

At the moment this simplifies the installation process by removing
`securityContext` from all pods since it is specified by your cluster's
configuration instead.

#### Ingress configuration

A backwards-compatible change to the ingress configuration that makes the
ingress use more fine-grained rules to avoid overriding other ingress rules.
You may want to review the details if you have customized the Kubernetes
manifests regarding the ingress resources.

##### v1 write endpoint

An endpoint has been exposed for the v1 write path, under `/write`.

### Changes

#### Database engine

- Honor `SSL_CERT_FILE` for PostgreSQL connections.
- Wait for gRPC when shutting down the querier.

#### Deployment

- Add defined `resources` to `authzpuller`.

---

## 20231004-666907 {date="2023-10-04" .checkpoint}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20231004-666907
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20231004-666907/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20231004-666907/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

#### Object store custom certificates

Support for custom certificates has been implemented since version
[20230912-619813](#20230912-619813).
Unfortunately, due to a bug, our Object store client didn't use the custom certificates.
This release fixes that so you can use the existing configuration for custom
certificates to also specify the certificate and certficate authority used by
your object store.

#### Resource limits

Until now, the configuration spec only exposed the Kubernetes resource
_requests_ and not the limits.
Setting the limits is important for proper cluster capacity configuration.
This release fixes this deficiency.

_See [Scale components in your cluster](/influxdb3/clustered/admin/scale-cluster/#scale-components-in-your-cluster)._

#### Object store configuration

A backwards-compatible change has been made to object store configuration.
This now enables the use of Azure blob storage.

#### Installation documentation moved to the documentation site

The "Install InfluxDB Clustered" instructions (formerly known as "GETTING_STARTED")
are now available on the public
[InfluxDB Clustered documentation](https://docs.influxdata.com/influxdb3/clustered/install/).

The `example-customer.yml` (also known as `myinfluxdb.yml`) example
configuration file still lives in the release bundle alongside the `RELEASE_NOTES`.

### Upgrade notes

You **must** update to this release before updating to any subsequent release.
This ensure as schema migration is sequenced properly otherwise a Kubernetes
cluster running pods with different versions will impact write availability.

### Changes

#### Deployment

- Add support for setting resource limits.

#### Documentation

- Prior to this release, the example query for the sample data
  (`air-sensor-data.lp`) was incorrect.

#### Database engine

- Use system certificate store.

---

## 20230922-650371 {date="2023-09-22"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20230922-650371
```

#### Release artifacts

- [app-instance-schema.json](/downloads/clustered-release-artifacts/20230922-650371/app-instance-schema.json)
- [example-customer.yml](/downloads/clustered-release-artifacts/20230922-650371/example-customer.yml)
- [InfluxDB Clustered README EULA July 2024.txt](/downloads/clustered-release-artifacts/InfluxDB%20Clustered%20README%20EULA%20July%202024.txt)

### Highlights

#### Configuration simplification

This release simplifies the configuration of the admin interface.
The `internalSigningKey` configuration section is now optional and is
autogenerated.

### Upgrade notes

We simplified the ingress rules, which may require some changes _if_ you have
custom Ingress resources pointing to the underlying services.
Otherwise, no changes are necessary.

#### Details

- Ingress that previously pointed to the `account` service should now point to
  the `gateway` service--for example: `/account.v1.AccountService`.
- Ingress that previously pointed to the `authz` service can be removed--for
  example: `/authz.public.v1.AuthzPublicService`.
- Ingress that previously pointed to the `database-management` service should
  now point to the `gateway` service--for example:
  `/database_management.v1.DatabaseService`.
- Ingress that previously pointed to the `token-management` service should now
  point to the `gateway` service--for example:
  `/token_management.public.v1.TokenManagementPublicService`.

### Changes

#### Deployment

- Update reference version of kubit to 0.0.11.
- Update the default number of routers to match ingesters (3).
- Ensure custom certificates are available to all components.

#### Database engine

- Catalog cache convergence improvements.
- Retry after out of memeory (OOM) errors.

---

## 20230915-630658 {date="2023-09-15"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20230915-630658
```

### Highlights

#### Persistent volume fixes

This release fixes am issue involving volume permissions in some volume
provisioners (for example, EBS).
No action is required for upgrades.

### Changes

- Removed the "Generate internal signing key" section from the "Getting started"
  documentation.
- Updated `Volume` permissions to fix issues in some environments.

---

## 20230914-628600 {date="2023-09-14"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20230914-628600
```

### Highlights

#### Updated Azure AD documentation

The `Appendix` / `Configuring Identity Provider` / `Azure` section of the
"Geting started" documentation has been updated:

```diff
- https://login.microsoftonline.com/{AZURE_TENANT_ID}/.well-known/openid-configuration
+ https://login.microsoftonline.com/{AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration
```

### Changes

#### Deployment

- Documentation fixes.
- Generate JWT signing keys automatically.

#### Database engine

- Various minor fixes.

---

## 20230912-619813 {date="2023-09-12"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20230912-619813
```

### Highlights

#### Custom CA certificates {note="(Optional)"}

InfluxDB processes inbound API requests (_ingress_) and issues outbound API
request to external services (_egress_).
The _ingress_ transport security parameters (TLS) are configured in the
`ingress` section. InfluxDB can work with any certificate signed with any
Certificate Authority (accepting that CA is then a matter of InfluxDB client's
configuration, outside of the scope of this document).

_Egress_ connections to TLS secured endpoints (`https` or TLS secured postgres)
are verified by a set of built-in certificate authorities (we use Debian's
[ca-certificates](https://packages.debian.org/stable/ca-certificates)).

You may need to override the list of accepted CAs if your InfluxDB cluster is
configured to access dependencies that use certificates issued by your private CA.
In some cases your network setup may even involve an auditing MitM proxy that
issues their own certificates.

This release includes an optional feature that allows you to specify your own CA
list. The custom CA replaces the standard set of CA certificates. The custom
certificate file can contain one or more PEM encoded CA certificates.

<!-- pytest.mark.skip -->

```bash
kubectl -n influxdb create  configmap custom-ca  --from-file=ca.pem
```

```yaml
....
kind: AppInstance
spec:
    ...
    spec:
      ...
      egress:
         customCertificates:
            valueFrom:
              configMapKeyRef:
                key: ca.pem
                name: custom-ca
      ...
```

### Changes

#### Deployment

- Allow users to specify custom certificate authorities for egress calls.

#### Database engine

- Fix health probe livelock.
- Handle oversized files in the compactor.
- Various minor optimizations.

---

## 20230911-604209 {date="2023-09-11"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20230911-604209
```

### Highlights

This release contains a breaking change to the monitoring subsystem that
requires manual intervention to unblock.
More details in the Upgrade notes section below.

### Upgrade notes

#### Prometheus StatefulSet

This release contains a change to the prometheus `StatefulSet` resources that
cannot be reconciled automatically by the operator.
You must delete the stateful set manually.
The operator will then automatically re-create the resources.

<!-- pytest.mark.skip -->

```bash
kubectl -n influxdb delete sts prometheus
```

### Changes

#### Documentation

- Update active directory documentation.

#### Deployment

- Set `serviceName` in Prometheus deployment.
- Ensure granite ingress has hostname declared.

#### Database engine

- Various dependency updates.
- Adjust compactor catalog query rate limiter for small clusters.

---

## 20230908-600131 {date="2023-09-08"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20230908-600131
```

### Highlights

#### Default storage class

The `storageClassName` parameters are no longer required.
InfluxDB uses the cluster's default storage class unless you override it in your
configuration.

### Changes

#### Deployment

- Remove unnecessary Grafana dashboards.
- Make storage class optional.

---

## 20230907-597343 {date="2023-09-07"}

### Quickstart

```yaml
spec:
  package:
    image: us-docker.pkg.dev/influxdb2-artifacts/clustered/influxdb:20230907-597343
```

### Upgrade Notes

This release requires a new configuration block:

```yaml
monitoringStorage:
  storage: 1Gi
  storageClassName: <your_storage_class>
```

### Changes

#### Deployment

- Make gRPC ingress work with the Traefik ingress controller.
- Add `hosts` field to ingress specification.
- Several fixes in ingress layer for the admin control plane.

#### Database engine

- Add support for `FILL(linear)` for selector functions in InfluxQL.
- Prevent sort order mismatches from creating overlapping chains.
- Minor performance optimizations.
- Change `loglevel` to `info` on "No compaction job found" errors.
