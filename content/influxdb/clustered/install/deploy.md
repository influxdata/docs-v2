---
title: Deploy your InfluxDB cluster
description: >
  Use Kubernetes to deploy your InfluxDB cluster.
menu:
  influxdb_clustered:
    name: Deploy your cluster
    parent: Install InfluxDB Clustered
weight: 104
---

Use Kubernetes and related tools to deploy your InfluxDB cluster.
This guide provides instructions for deploying your InfluxDB cluster using the
following tools:

- **kubectl**: CLI for controlling the Kubernetes cluster manager
- **kubit**: A Kubernetes controller that can render and apply jsonnet
  templates based on the [kubecfg](https://github.com/kubecfg/kubecfg) jsonnet
  tooling and framework

InfluxDB Clustered uses an `AppInstance` Kubernetes custom resource (CR) to
configure and deploy your InfluxDB Cluster.
Installing a `CustomResourceDefinition` (CRD) requires cluster-wide permissions and may cause `kubectl` to
fail if you do not have those permissions in your cluster.

`kubectl` uses your local credentials to install the `AppInstance` CRD.
If you do not have the necessary permissions, you can
[use the `kubit` CLI to manually install the package in your cluster](?t=kubit#kubctl-or-kubit).

{{% note %}}
**If you meet any of the following criteria, 
[install and use the `kubit` CLI](?t=kubit#kubctl-or-kubit)
on your local machine. This allows you to act as the operator would and deploy
your cluster, but from your terminal.**

- You do not have permissions to install a CRD.
- You do not have permissions to install the operator in the `kubit` namespace.
- You do not have permissions to create cluster-wide role-based access
  control (RBAC).
- You want to preview the generated YAML.
- You do not want to run the operator in your Kubernetes cluster.
{{% /note %}}

<!-- Hidden anchor for links to the kubctl/kubit tabs -->
<span id="kubctl-or-kubit"></span>

{{< tabs-wrapper >}}
{{% tabs %}}
[kubectl](#)
[kubit](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------- BEGIN kubectl ------------------------------->

Use the `kubectl apply` command to apply your custom-configured `myinfluxdb.yml`
and deploy your InfluxDB cluster:

```sh
kubectl apply \
  --filename myinfluxdb.yml \
  --namespace influxdb
```

<!-------------------------------- END kubectl -------------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!-------------------------------- BEGIN kubit -------------------------------->

1.  [Install the `kubit` CLI](https://github.com/kubecfg/kubit#cli-tool)
    and related tools on your local machine.

2.  Use the `kubit local apply` command to apply your custom-configured
    `myinfluxdb.yml` and deploy your InfluxDB Cluster.

    ```sh
    kubit local apply myinfuxdb.yml
    ```

<!--------------------------------- END kubit --------------------------------->
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Check deployment status

Kubernetes deployments do take time to complete. To check on the status of a
deployment, use the `kubectl get` command:

```sh
kubectl get \
  --filename myinfluxdb.yml \
  --output yaml | yq -P .status.conditions
```

The `status` field contains two useful fields:

- `conditions`: Summary of the current state of the deployment
- `lastLogs`: Verbose logs of deployment stages

For example, if you have incorrect container registry credentials:

```sh
$ kubectl get --filename myinfluxdb.yml --output yaml | yq -P .status.conditions
- lastTransitionTime: "2023-08-18T12:53:54Z"
  message: ""
  observedGeneration: null
  reason: Failed
  status: "False"
  type: Reconcilier
- lastTransitionTime: "2023-08-18T12:53:54Z"
  message: |
    Cannot launch installation job: OCI error: Authentication failure: {"errors":[{"code":"UNAUTHORIZED","message":"authentication failed"}]}
  observedGeneration: null
  reason: Failed
  status: "False"
  type: Ready
```

## Inspect cluster pods

After deploying your InfluxDB cluster, use the following command to list all
the deployed pods:

```sh
kubectl get pods --namespace influxdb
```

This command should return a collection of pods similar to:

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

{{< page-nav prev="/influxdb/clustered/install/configure-install/" prevText="Configure your cluster" next="/influxdb/clustered/install/use-your-cluster/" nextText="Use your cluster" >}}
