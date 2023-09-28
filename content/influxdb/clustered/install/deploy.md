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

Use the `kubectl apply` command to apply your custom-configured `myinfluxdb.yml`
and deploy your InfluxDB cluster:

```sh
kubectl apply \
  --filename myinfluxdb.yml \
  --namespace influxdb
```

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
