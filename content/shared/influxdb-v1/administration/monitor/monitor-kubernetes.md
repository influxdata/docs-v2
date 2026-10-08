## Monitor Kubernetes
The TICK stack is an easy and performant way to monitor the services that make up a Kubernetes cluster, whether or not you're running InfluxDB in a Kubernetes cluster or somewhere else.

### kube-influxdb Kubernetes monitoring project

The [kube-influxdb](https://github.com/influxdata/kube-influxdb) project is a set of Helm charts to make collection and visualization of Kubernetes metrics easy. It uses Telegraf as the primary agent to collect metrics and events.

[Read the kube-influxdb Getting Started guide.](https://github.com/influxdata/kube-influxdb/blob/master/docs/v1.0/getting_started.md)

### Collect Kubernetes metrics with Telegraf

The [Telegraf metrics collection agent](/telegraf/v1/introduction/getting-started/) can collect many types of metrics in a Kubernetes cluster, like [Docker container metrics](/telegraf/v1/input-plugins/docker/) and [stats from kubelets](/telegraf/v1/input-plugins/kubernetes/). It can even scrape [Prometheus metrics API endpoints](/telegraf/v1/input-plugins/prometheus/). Telegraf is used in the [kube-influxdb project](#kube-influxdb-kubernetes-monitoring-project) to collect metrics.

[Read about setting up a Kubernetes monitoring architecture using Telegraf](https://www.influxdata.com/blog/monitoring-kubernetes-architecture/)

### Prometheus remote read and write support

InfluxDB supports the Prometheus remote read and write API for clusters already using Prometheus for metrics collection that need a more flexible time series data store.

[Read about the Prometheus remote read and write API support in InfluxDB](/product/version/supported_protocols/prometheus/)
