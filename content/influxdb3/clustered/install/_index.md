---
title: Install InfluxDB Clustered
description: >
  Use Kubernetes to deploy and manage InfluxDB Clustered.
menu: influxdb3_clustered
weight: 2
---

InfluxDB Clustered is deployed and managed using Kubernetes.
This installation guide walks you through the following four installation phases and
the goal of each phase.
This process helps you set up and run your cluster and ensure it
performs well with your expected production workload.

1.  **[Set up your cluster](/influxdb3/clustered/install/set-up-cluster/)**:
    Get a basic InfluxDB cluster up and running with as few external
    dependencies as possible and confirm you can write and query data.
2.  **[Customize your cluster](/influxdb3/clustered/install/customize-cluster/)**:
    Review and customize the available configuration options specific to your workload.
3.  **[Optimize your cluster](/influxdb3/clustered/install/optimize-cluster/)**:
    Scale and load test your InfluxDB cluster to confirm that it will satisfy
    your scalability and performance needs. Work with InfluxData to review your
    schema and determine how best to organize your data and develop queries
    representative of your workload to ensure queries meet performance requirements.
4.  **[Secure your cluster](/influxdb3/clustered/install/secure-cluster/)**:
    Integrate InfluxDB with your identity provider to manage access to your
    cluster. Install TLS certificates and enable TLS access.
    Prepare your cluster for production use.

## InfluxDB Clustered license

InfluxDB Clustered is a commercial product offered by InfluxData, the creators
of InfluxDB. Please contact InfluxData Sales to obtain a license _before_
installing InfluxDB Clustered.

<a class="btn" href="{{< cta-link >}}">Contact InfluxData Sales</a>

## Setup, configure, and deploy InfluxDB Clustered

> [!Note]
> #### Deploying in air-gapped environments
>
> To deploy InfluxDB Clustered in an air-gapped environment (without internet access),
> use one of the following approaches:
>
> - **Recommended**: Directly use `kubit local apply`
> - Helm (includes the kubit operator)
> - Directly use the kubit operator
> 
> For more information, see [Choose the right deployment tool for your environment](/influxdb3/clustered/install/set-up-cluster/configure-cluster/#choose-the-right-deployment-tool-for-your-environment)

{{< children type="ordered-list" >}}

<!-- TODO: ADD CLUSTER ARCHITECTURE OVERVIEW -->
<!---------- TODO: ALL THIS INFORMATION NEEDS TO LAND IN THE ADMIN SECTION ---------

### Updating your InfluxDB Cluster

Updating your InfluxDB cluster is as simple as re-applying your app-instance with a new package version. Note that if the new version of the package has changes to the AppInstance schema, those changes will need to be made at the same time that the new package is deployed.

### Redeploying your cluster safely

The word safely here means being able to redeploy your cluster while still being able to use the tokens you’ve created, and being able to write/query to the database you’ve previously created.

All of the important state in InfluxDB 3 lives in the Catalog store (the Postgres equivalent database) and the Object Store (the S3 compatible store). These should be treated with the utmost care. 

If a full redeploy of your cluster needs to happen, the namespace containing the Influxdb instance can be deleted **_as long as your Catalog store and Object Store are not in this namespace_**. Then, the influxdb AppInstance can be redeployed. It is possible the operator may need to be removed and reinstalled. In that case, deleting the namespace that the operator is deployed into and redeploying is acceptable.

### Backing up your data

The Catalog store and Object store contain all of the important state for InfluxDB 3. They should be the primary focus of backups. Following the industry standard best practices for your chosen Catalog store implementation and Object Store implementation should provide sufficient backups.  In our Cloud products, we do daily backups of our Catalog, in addition to automatic snapshots, and we preserve our Object Store files for 100 days after they have been soft-deleted.

### Recovering your data

After recovering the catalog and object store, you will need to update the dsn in myinfluxdb.yml and re-apply. -->

{{< page-nav next="/influxdb3/clustered/install/set-up-cluster/prerequisites/" >}}
