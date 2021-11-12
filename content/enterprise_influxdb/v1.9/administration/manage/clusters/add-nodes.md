---
title: Add node to existing cluster
description: Add nodes to an existing InfluxDB Enterprise cluster.
aliases:
menu:
  enterprise_influxdb_1_9:
    name: Add nodes
    parent: Manage clusters
weight: 19
---

To add a data node to an existing cluster, follow the steps below.

1. Install and start a new data node.
   Complete steps 1–3 of the [data node installation instructions](/enterprise_influxdb/v1.9/introduction/install-and-deploy/installation/data_node_installation/#step-1-add-appropriate-dns-entries-for-each-of-your-servers).
2. To join the new node to the cluster, do one of the following:
    -  From a meta node, run:
        ```sh
         influxd-ctl add-data <new data node address>:<port>
         ```
      - From a remote server, run:

        ```sh
             influxd-ctl -bind <existing_meta_node:8091> add-data <new data node 
             address>:<port>
              ```
3. (Optional) [Rebalance the cluster](/enterprise_influxdb/v1.9/administration/manage/clusters/rebalance/).
