---
title: Configure your InfluxDB cluster using Helm
description: >
  ...
menu:
  influxdb_clustered:
    name: Use Helm
    parent: Configure your cluster
weight: 230
---

The [InfluxDB Clustered Helm chart](https://github.com/influxdata/helm-charts/tree/master/charts/influxdb3-clustered)
provides an alternative method for deploying your InfluxDB cluster using
[Helm](https://helm.sh/). When using Helm, apply configuration options in the
`values.yaml` file provided by the Helm chart.



- Add the InfluxData Helm chart repository

  ```bash
  helm repo add influxdata https://helm.influxdata.com/
  ```

- Download base `values.yaml` for the InfluxDB Clustered Helm chart.

  ```bash
  curl https://raw.githubusercontent.com/influxdata/helm-charts/master/charts/influxdb3-clustered/values.yaml > test-values.yaml
  ```

  <a href="https://github.com/influxdata/helm-charts/blob/master/charts/influxdb3-clustered/values.yaml" class="btn github">View values.yaml on GitHub</a>


