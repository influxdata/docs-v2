---
title: Rename hosts in InfluxDB Enterprise
aliases:
    - /enterprise/v1.7/administration/renaming/
menu:
  enterprise_influxdb_1_7:
    name: Rename hosts
    weight: 100
    parent: Administration
---

## Host renaming

The following instructions allow you to rename a host within your InfluxDB Enterprise instance.

First, suspend write and query activity to the cluster.

### Rename meta nodes

- Find the meta node leader with `curl localhost:8091/status`. The `leader` field in the JSON output reports the leader meta node. We will start with the two meta nodes that are not leaders.
- On a non-leader meta node, run `influxd-ctl remove-meta`. Once removed, confirm by running `influxd-ctl show` on the meta leader.
- Stop the meta service on the removed node, edit its configuration file to set the new "hostname" under "/etc/influxdb/influxdb-meta.conf".
- Update the actual OS host's name if needed, apply DNS changes.
- Start the meta service.
- On the meta leader, add the meta node with the new hostname using `influxd-ctl add-meta newmetanode:8091`. Confirm with `influxd-ctl show`
- Repeat for the second meta node.
- Once the two non-leaders are updated, stop the leader and wait for another meta node to become the leader - check with `curl localhost:8091/status`.
- Repeat the process for the last meta node (former leader).

Intermediate verification

- Verify the state of the cluster with `influxd-ctl show`. The version must be reported on all nodes for them to be healthy.
- Verify there is a meta leader with `curl localhost:8091/status` and that all meta nodes list the rest in the output.
- Restart all data nodes one by one. Verify that `/var/lib/influxdb/meta/client.json` on all data nodes references the new meta names.
- Verify the `show shards` output lists all shards and node ownership as expected.
- Verify that the cluster is in good shape functional-wise, responds to writes and queries.

### Rename data nodes

- Find the meta node leader with `curl localhost:8091/status`. The `leader` field in the JSON output reports the leader meta node.
- Stop the service on the data node you want to rename. Edit its configuration file to set the new `hostname` under `/etc/influxdb/influxdb.conf`.
- Update the actual OS host's name if needed, apply DNS changes.
- Start the data service. Errors will be logged until it is added to the cluster again.
- On the meta node leader, run `influxd-ctl update-data oldname:8088 newname:8088`. Upon success you will get a message updated data node ID to `newname:8088`.
- Verify with `influxd-ctl show` on the meta node leader. Verify there are no errors in the logs of the updated data node and other data nodes. Restart the service on the updated data node. Verify writes, replication and queries work as expected.
- Repeat on the remaining data nodes. Remember to only execute the `update-data` command from the meta leader.

Final verification

- Verify the state of the cluster with `influxd-ctl show`. The version must be reported on all nodes for them to be healthy.
- Verify the `show shards` output lists all shards and node ownership as expected.
- Verify meta queries work (show measurements under a database).
- Verify data are being queried successfully.

Once you've performed the verification steps, resume write and query activity.
