---
title: Chronograf frequently asked questions (FAQ)
menu:
  chronograf_1_6:
    name: Frequently asked questions (FAQ)
    weight: 10
    parent: Troubleshooting
---

## How do I connect Chronograf to an InfluxDB Enterprise cluster?

The connection details form requires additional information when connecting Chronograf to an [InfluxDB Enterprise cluster](/{{< latest "enterprise_influxdb" >}}/).

When you enter the InfluxDB HTTP bind address in the `Connection String` input, Chronograf automatically checks if that InfluxDB instance is a data node.
If it is a data node, Chronograf automatically adds the `Meta Service Connection URL` input to the connection details form.
Enter the HTTP bind address of one of your cluster's meta nodes into that input and Chronograf takes care of the rest.

![Cluster connection details](/img/chronograf/1-6-faq-cluster-connection.png)

Note that the example above assumes that you do not have authentication enabled.
If you have authentication enabled, the form requires username and password information.
For more details about monitoring an InfluxDB Enterprise cluster, see the [Monitor an InfluxDB Enterprise Cluster](/chronograf/v1.6/guides/monitoring-influxenterprise-clusters/) guide.
