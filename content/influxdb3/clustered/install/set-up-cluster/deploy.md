---
title: Deploy your InfluxDB cluster
description: >
  Use Kubernetes to deploy your InfluxDB cluster.
menu:
  influxdb3_clustered:
    name: Deploy your cluster
    parent: Set up your cluster
weight: 240
related:
  - /influxdb3/clustered/admin/upgrade/
  - /influxdb3/clustered/install/set-up-cluster/licensing/
aliases:
  - /influxdb3/clustered/install/deploy/
---

Use Kubernetes and related tools to deploy your InfluxDB cluster.
This guide provides instructions for deploying your InfluxDB cluster using the
following tools:

- **kubectl**: CLI for controlling the Kubernetes cluster manager
- **kubit**: A Kubernetes controller that can render and apply jsonnet
  templates based on the [kubecfg](https://github.com/kubecfg/kubecfg) jsonnet
  tooling and framework
- **helm**: Uses the [InfluxDB Clustered Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-clustered), which includes the kubit operator.

To compare these tools and deployment methods, see [Choose the right deployment tool for your environment](/influxdb3/clustered/install/set-up-cluster/configure-cluster/#choose-the-right-deployment-tool-for-your-environment).

## Prerequisites

If you haven't already set up and configured your cluster, see how to
[install InfluxDB Clustered](/influxdb3/clustered/install/). 

<!-- Hidden anchor for links to the kubectl/kubit/helm tabs -->
<span id="kubectl-kubit-helm"></span>

{{< tabs-wrapper >}}
{{% tabs %}}
[kubectl](#)
[kubit CLI](#)
[helm](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN kubectl ------------------------------->
- [`kubectl` standard deployment (with internet access)](#kubectl-standard-deployment-with-internet-access)
- [`kubectl` air-gapped deployment](#kubectl-air-gapped-deployment)

## kubectl standard deployment (with internet access)

Use the `kubectl apply` command to apply your [custom-configured `myinfluxdb.yml`](/influxdb3/clustered/install/set-up-cluster/configure-cluster/directly/)
and deploy your InfluxDB cluster:

```sh
kubectl apply \
  --filename myinfluxdb.yml \
  --namespace influxdb
```

> [!Note]
> Due to the additional complexity and maintenance requirements, using `kubectl apply` isn't
> recommended for air-gapped environments.
> Instead, consider using the [`kubit` CLI approach](#kubit-cli), which is specifically designed for air-gapped deployments.

<!-------------------------------- END kubectl -------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------------- BEGIN kubit CLI -------------------------------->
## Standard and air-gapped deployments

_This approach avoids the need for installing the kubit operator in the cluster,
making it ideal for air-gapped clusters._

> [!Important]
> For air-gapped deployment, ensure you have [configured access to a private registry for InfluxDB images](/influxdb3/clustered/install/set-up-cluster/configure-cluster/directly/#configure-access-to-the-influxDB-container-registry).

1. On a machine with internet access, download the [`kubit` CLI](https://github.com/kubecfg/kubit#cli-tool)--for example:

   ```bash
   curl -L -o kubit https://github.com/kubecfg/kubit/archive/refs/tags/v0.0.22.tar.gz
   chmod +x kubit
   ```

   Replace {{% code-placeholder-key %}}`v0.0.22`{{% /code-placeholder-key%}} with the [latest release version](https://github.com/kubecfg/kubit/releases/latest).

2. If deploying InfluxDB in an air-gapped environment (without internet access),
    transfer the binary to your air-gapped environment.

3. Use the `kubit local apply` command to process your [custom-configured `myinfluxdb.yml`](/influxdb3/clustered/install/set-up-cluster/configure-cluster/directly/) locally
   and apply the resulting resources to your cluster:

   ```bash
   # Point to Docker credentials that have access to your registry
   # (public registry for standard deployments or private registry for air-gapped)
   DOCKER_CONFIG=/path/to/credentials kubit local apply myinfluxdb.yml
   ```

   If your local system doesn't have required tools installed, use Docker mode:

   ```bash
   # For Linux or macOS
   DOCKER_CONFIG=/path/to/credentials kubit local apply --docker myinfluxdb.yml
   ```

The `kubit local apply` command processes your AppInstance resource locally and
applies the resulting Kubernetes resources directly to your cluster.

<!------------------------------- END kubit CLI ------------------------------->

{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------------- BEGIN Helm --------------------------------->
- [Helm standard deployment (with internet access)](#helm-standard-deployment-with-internet-access)
- [Helm air-gapped deployment](#helm-air-gapped-deployment)

## Helm standard deployment (with internet access)

1. Add the InfluxData Helm chart repository:

   ```bash
   helm repo add influxdata https://helm.influxdata.com/
   ```

2. Update your Helm repositories to ensure you have the latest charts:

   ```bash
   helm repo update
   ```

3. Deploy the InfluxDB Clustered Helm chart with your [customized `values.yaml`](/influxdb3/clustered/install/set-up-cluster/configure-cluster/use-helm/#create-a-valuesyaml-file):

   ```bash
   helm install influxdb influxdata/influxdb3-clustered \
     -f values.yaml \
     --namespace influxdb \
     --create-namespace
   ```

If you need to update your deployment after making changes to your `values.yaml`, use the `helm upgrade` command:

```bash
helm upgrade influxdb influxdata/influxdb3-clustered \
  -f values.yaml \
  --namespace influxdb
```

## Helm air-gapped deployment

> [!Important]
> For air-gapped deployment, ensure you have [configured access to a private registry for InfluxDB images and the kubit operator](/influxdb3/clustered/install/set-up-cluster/configure-cluster/use-helm/#configure-access-to-the-influxDB-container-registry).

1. On a machine with internet access, download the Helm chart:

   ```bash
   # Add the InfluxData repository
   helm repo add influxdata https://helm.influxdata.com/
   
   # Update the repositories
   helm repo update
   
   # Download the chart as a tarball
   helm pull influxdata/influxdb3-clustered --version X.Y.Z
   ```
   
   Replace `X.Y.Z` with the specific chart version you want to use.

2. Transfer the chart tarball to your air-gapped environment using your secure file transfer method.

3. In your air-gapped environment, install the chart from the local tarball and values from your [customized `values.yaml`](/influxdb3/clustered/install/set-up-cluster/configure-cluster/use-helm/#create-a-valuesyaml-file):

   ```bash
   helm install influxdb ./influxdb3-clustered-X.Y.Z.tgz \
     -f values.yaml \
     --namespace influxdb \
     --create-namespace
   ```

4. Verify the deployment:

   ```bash
   kubectl get pods -n influxdb
   ```

If you need to update your deployment after making changes to your `values.yaml`, use the `helm upgrade` command:

```bash
helm upgrade influxdb ./influxdb3-clustered-X.Y.Z.tgz \
  -f values.yaml \
  --namespace influxdb
```

> [!Note]
> #### kubit's role in air-gapped environments
>
> When deploying with Helm in an air-gapped environment:
>
> 1. **Helm deploys the kubit operator** - The Helm chart includes the kubit operator, which needs its images mirrored to your private registry
> 2. **Operator requires access to all InfluxDB images** - The kubit operator deploys the actual InfluxDB components using images from your private registry
> 3. **Registry override is essential** - You must set the `images.registryOverride` and configure the kubit operator images correctly in the values file
>
> This is why you need to [mirror InfluxDB images and kubit operator images](/influxdb3/clustered/install/set-up-cluster/configure-cluster/use-helm/#mirror-influxdb-images) for air-gapped deployments.

<!--------------------------------- END Helm ---------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Check deployment status

Kubernetes deployments take some time to complete. To check on the status of a
deployment, use the `kubectl get` command:

> [!Note]
> The following example uses the [`yq` command-line YAML parser](https://github.com/mikefarah/yq)
> to parse and format the YAML output.
> You can also specify the output as `json` and use the
> [`jq` command-line JSON parser](https://jqlang.github.io/jq/) to parse and
> format the JSON output.
> Installing and using either of these utilities is optional.

```sh
kubectl get \
  --filename myinfluxdb.yml \
  --output yaml | yq -P .status.conditions
```

The `status` field in the output contains two useful fields:

- `conditions`: Summary of the current state of the deployment
- `lastLogs`: Verbose logs of deployment stages

For example, if you have incorrect container registry credentials, the output is similar to the following:

```yaml
- lastTransitionTime: '2023-08-18T12:53:54Z'
  message: ''
  observedGeneration: null
  reason: Failed
  status: 'False'
  type: Reconcilier
- lastTransitionTime: '2023-08-18T12:53:54Z'
  message: |
    Cannot launch installation job: OCI error: Authentication failure: {"errors":[{"code":"UNAUTHORIZED","message":"authentication failed"}]}
  observedGeneration: null
  reason: Failed
  status: 'False'
  type: Ready
```

## Inspect cluster pods

After deploying your InfluxDB cluster, use the following command to list all
the deployed pods:

```sh
kubectl get pods --namespace influxdb
```

This command returns a collection of pods similar to the following:

```
NAMESPACE     NAME                                      READY   STATUS      RESTARTS       AGE
influxdb      minio-0                                   2/2     Running     2 (101s ago)   114s
influxdb      catalog-db-0                              2/2     Running     0              114s
influxdb      keycloak-b89bc7b77-zpt2r                  1/1     Running     0              114s
influxdb      debug-service-548749c554-m4sxk            1/1     Running     0              91s
influxdb      token-gen-56a2e859-zlvnw                  0/1     Completed   0              91s
influxdb      database-management-579bfb9fcb-dw5sv      1/1     Running     0              91s
influxdb      database-management-579bfb9fcb-22qgm      1/1     Running     0              91s
influxdb      authz-59f456795b-qt52p                    1/1     Running     0              91s
influxdb      account-df457db78-j9z6f                   1/1     Running     0              91s
influxdb      authz-59f456795b-ldvmt                    1/1     Running     0              91s
influxdb      account-df457db78-8ds4f                   1/1     Running     0              91s
influxdb      token-management-754d966555-fmkbk         1/1     Running     0              90s
influxdb      token-management-754d966555-rbvtv         1/1     Running     0              90s
influxdb      global-gc-7db9b7cb4-ml6wd                 1/1     Running     0              91s
influxdb      iox-shared-compactor-0                    1/1     Running     1 (62s ago)    91s
influxdb      iox-shared-ingester-0                     1/1     Running     1 (62s ago)    91s
influxdb      iox-shared-ingester-1                     1/1     Running     1 (62s ago)    91s
influxdb      iox-shared-ingester-2                     1/1     Running     1 (62s ago)    91s
influxdb      global-router-86cf6b869b-56skm            3/3     Running     1 (62s ago)    90s
influxdb      iox-shared-querier-7f5998b9b-fpt62        4/4     Running     1 (62s ago)    90s
influxdb      kubit-apply-influxdb-g6qpx                0/1     Completed   0              8s
```

## Troubleshoot deploying InfluxDB Clustered

### Common issues

1. **Image pull errors**
   - Check that registry override and image pull secrets are properly configured
   - For air-gapped: Verify all images are mirrored and `registryOverride` is correctly set

2. **Missing kubit binary**
   - Ensure you've transferred the correct version of kubit for your platform
   - Verify the binary has executable permissions

3. **Kubit operator failures in air-gapped environments**

   - Ensure you've properly mirrored all kubit operator images and configured their references in your values file.

4. **PostgreSQL connectivity issues**
   - Verify network connectivity to your PostgreSQL database
   - Check that database credentials are correct in your configuration

{{< page-nav prev="/influxdb3/clustered/install/set-up-cluster/licensing/" prevText="Install your license" next="/influxdb3/clustered/install/set-up-cluster/test-cluster/" nextText="Test your cluster" >}}
