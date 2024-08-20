---
title: Install InfluxDB Clustered
description: >
  Use Kubernetes to deploy and manage InfluxDB Clustered.
menu: influxdb_clustered
weight: 2
---

InfluxDB Clustered is deployed and managed using Kubernetes.
This multi-page guide walks through setting up prerequisites and configuring
your InfluxDB cluster deployment.

InfluxDB Clustered is a commercial product offered by InfluxData, the creators
of InfluxDB. Please contact InfluxData Sales to obtain a license before
installing InfluxDB Clustered.

<a class="btn" href="{{< cta-link >}}">Contact InfluxData Sales</a>

## Setup, configure, and deploy InfluxDB Clustered

{{< children type="ordered-list" >}}


<!-- TODO: ADD CLUSTER ARCHITECTURE OVERVIEW -->

<!--

-------- TODO: ALL THIS INFORMATION NEEDS TO LAND IN THE ADMIN SECTION ---------

### Updating your InfluxDB Cluster

Updating your InfluxDB cluster is as simple as re-applying your app-instance with a new package version. Note that if the new version of the package has changes to the AppInstance schema, those changes will need to be made at the same time that the new package is deployed.

### Redeploying your cluster safely

The word safely here means being able to redeploy your cluster while still being able to use the tokens you’ve created, and being able to write/query to the database you’ve previously created.

All of the important state in Influxdb 3.0 lives in the Catalog (the Postgres equivalent database) and the Object Store (the S3 compatible store). These should be treated with the utmost care. 

If a full redeploy of your cluster needs to happen, the namespace containing the Influxdb instance can be deleted **_as long as your Catalog and Object Store are not in this namespace_**. Then, the influxdb AppInstance can be redeployed. It is possible the operator may need to be removed and reinstalled. In that case, deleting the namespace that the operator is deployed into and redeploying is acceptable.

### Backing up your data

The Catalog and Object store contain all of the important state for Influxdb 3.0. They should be the primary focus of backups. Following the industry standard best practices for your chosen Catalog implementation and Object Store implementation should provide sufficient backups.  In our Cloud products, we do daily backups of our Catalog, in addition to automatic snapshots, and we preserve our Object Store files for 100 days after they have been soft-deleted.

### Recovering your data

After recovering the catalog and object store, you will need to update the dsn in myinfluxdb.yml and re-apply. -->

{{< page-nav next="/influxdb/clustered/install/prerequisites/" >}}
