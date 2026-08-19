---
title: Configure query groups
description: >
  Create and manage query groups to organize query nodes for distributed query
  processing in an InfluxDB 3 Enterprise cluster.
menu:
  influxdb3_enterprise:
    parent: Administer InfluxDB
    name: Configure query groups
weight: 101
related:
  - /influxdb3/enterprise/admin/clustering/
  - /influxdb3/enterprise/reference/cli/influxdb3/show/nodes/
  - /influxdb3/enterprise/reference/cli/influxdb3/create/query_group/
  - /influxdb3/enterprise/reference/cli/influxdb3/update/query_group/
  - /influxdb3/enterprise/reference/cli/influxdb3/delete/query_group/
influxdb3/enterprise/tags: [clustering, query nodes, query groups]
draft: true
---

> [!Warning]
> #### Query groups aren't operational in v3.11
>
> The `influxdb3 create query_group`, `show query_groups`,
> `update query_group`, and `delete query_group` commands work and store
> query group definitions in the catalog, but the server doesn't yet use
> those definitions to affect query routing, data placement, or replication.
> Creating a query group currently has no effect on how query nodes behave.

A query group is a named, ordered list of query nodes and a replication factor.
Use query groups to organize query nodes for distributed query processing in an
{{% product-name %}} cluster.

Before you configure a query group, make sure that the nodes you plan to add
are running and have query capability.

- [Why use query groups](#why-use-query-groups)
- [How query groups affect node behavior](#how-query-groups-affect-node-behavior)
- [List query nodes](#list-query-nodes)
- [Create a query group](#create-a-query-group)
- [View query groups](#view-query-groups)
- [Update a query group](#update-a-query-group)
- [Delete a query group](#delete-a-query-group)
- [Cautions and limitations](#cautions-and-limitations)

## Why use query groups

Without query groups, every query node in a cluster follows every ingester
stream and reads every compacted shard--each node loads a full copy of your
data independently.
This works, but it means every node pays the same memory and I/O cost
regardless of your cluster's actual query capacity needs.

A query group turns a set of query nodes into a single logical unit that
behaves like an availability zone:

- **Full data coverage, split work**: The group as a whole can answer any
  query, but no single node in the group holds everything.
  Each node reads only a subset of ingester streams and compacted shards, so
  members of the group divide the memory and I/O cost of tracking all the
  data among themselves instead of each node bearing the full cost alone.
- **Configurable redundancy**: The group's replication factor controls how
  many nodes keep an in-memory copy of each ingester stream and compacted
  shard. A higher replication factor tolerates more node failures within the
  group at the cost of more duplicated memory usage; a lower replication
  factor uses less memory per node but leaves less headroom if a node goes
  down.
- **Workload isolation**: Group query nodes by workload or tenant--for
  example, dedicate one group to interactive dashboards and another to
  scheduled batch queries so that a spike in one workload doesn't starve
  the other of resources.

## How query groups affect node behavior

A running query node uses its group membership to discover which subset of
data it's responsible for (its _placement group_):

- A node belongs to **at most one query group**.
  If you need a node to serve more than one workload, add it to the group
  best suited for its resources, or create a dedicated group.
- A node that isn't a member of any group keeps the default, ungrouped
  behavior: it loads all data by following every ingester stream and reading
  every compacted shard.
  This means a cluster can mix grouped and ungrouped query nodes, but an
  ungrouped node doesn't benefit from the reduced memory and I/O footprint
  that grouping provides.

## List query nodes

Use [`influxdb3 show nodes`](/influxdb3/enterprise/reference/cli/influxdb3/show/nodes/)
to list node IDs and operating modes in your cluster.
Use the `node_id` values for the `--node-ids` option when you create or update
a query group.

```bash { placeholders="AUTH_TOKEN" }
influxdb3 show nodes --token AUTH_TOKEN
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token with sufficient privileges

## Create a query group

Create a query group with a unique name, an ordered list of query node IDs, and
a replication factor.
The replication factor must be greater than zero and cannot exceed the number
of nodes in the group.

The order of node IDs is significant.
{{% product-name %}} preserves the order you provide exactly--it never
sorts or reorders the list--because the position of each node in the group
determines which slice of ingester streams and compacted shards that node is
responsible for.
Changing the order of existing members (even without adding or removing any
node) changes how work is split across the group.
Provide node IDs in the order you intend the server to retain, and avoid
reordering members unless you intend to reshuffle each node's assigned
workload.

```bash { placeholders="AUTH_TOKEN|QUERY_GROUP_NAME" }
influxdb3 create query_group QUERY_GROUP_NAME \
  --node-ids query-node-0,query-node-1,query-node-2 \
  --replication-factor 2 \
  --token AUTH_TOKEN
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token with sufficient privileges
- {{% code-placeholder-key %}}`QUERY_GROUP_NAME`{{% /code-placeholder-key %}}:
  Unique name for the query group

## View query groups

Use `influxdb3 show query_groups` to list query groups and retrieve a group ID.
You need the group ID to update or delete a group.

```bash { placeholders="AUTH_TOKEN" }
influxdb3 show query_groups --format json --token AUTH_TOKEN
```

The JSON output includes each group's ID, name, replication factor, and query
nodes in their configured order.

## Update a query group

Use `influxdb3 update query_group` to change the name, member list, replication
factor, or more than one of these values at once.

```bash { placeholders="AUTH_TOKEN|QUERY_GROUP_ID" }
influxdb3 update query_group QUERY_GROUP_ID \
  --node-ids query-node-0,query-node-1,query-node-2 \
  --replication-factor 2 \
  --token AUTH_TOKEN
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token with sufficient privileges
- {{% code-placeholder-key %}}`QUERY_GROUP_ID`{{% /code-placeholder-key %}}:
  ID of the query group to update

## Delete a query group

Delete a query group by its ID when it is no longer needed.

```bash { placeholders="AUTH_TOKEN|QUERY_GROUP_ID" }
influxdb3 delete query_group QUERY_GROUP_ID --token AUTH_TOKEN
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  Authentication token with sufficient privileges
- {{% code-placeholder-key %}}`QUERY_GROUP_ID`{{% /code-placeholder-key %}}:
  query group identifier to delete

## Cautions and limitations

- **Enterprise-only**: Query groups are an {{% product-name %}} feature.
  {{% product-name omit="Enterprise" %}} doesn't support them.
- **One group per node**: A query node can belong to only one query group.
  Adding a node that's already a member of another group to a new group
  moves it out of its previous group.
- **Ungrouped nodes still work, but don't scale the same way**: A query node
  that isn't in any group falls back to loading all data.
  If you create query groups for some nodes but leave others out, verify
  that the leftover ungrouped nodes have enough memory and I/O capacity to
  keep following every ingester stream and shard.
- **Replication factor bounds redundancy, not query capacity**: A higher
  replication factor increases how many nodes in the group hold an
  in-memory copy of the same data, which improves fault tolerance but also
  increases the memory each node in the group uses.
  It doesn't increase how many queries the group can serve concurrently.
- **Reordering members redistributes work**: Because each node's position
  in the list determines the data it's responsible for, updating a group's
  member order (with [`influxdb3 update query_group`](#update-a-query-group))
  triggers a redistribution of work across the group's nodes, even if the
  membership itself doesn't change.
- **Deleting a group doesn't stop its nodes**: Deleting a query group
  removes the group definition from the catalog.
  The query nodes that were members keep running, but revert to the
  ungrouped default of loading all data.
