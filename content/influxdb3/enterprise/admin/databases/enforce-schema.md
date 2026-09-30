---
title: Enforce a schema
description: >
  Use explicit schema mode to declare a database's tables and columns up
  front and reject writes that reference anything undeclared.
menu:
  influxdb3_enterprise:
    parent: Manage databases
weight: 204
list_code_example: |
  <!--pytest.mark.skip-->

  ```sh{placeholders="DATABASE_NAME|AUTH_TOKEN"}
  # Create a database that rejects undeclared tables and columns
  influxdb3 create database \
    --schema-mode explicit \
    --token AUTH_TOKEN \
    DATABASE_NAME

  # HTTP API
  curl --request POST "http://localhost:8181/api/v3/configure/database" \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer AUTH_TOKEN" \
    --data '{
      "db": "DATABASE_NAME",
      "schema_mode": "explicit"
    }'
  ```
related:
  - /influxdb3/enterprise/admin/databases/create/
  - /influxdb3/enterprise/admin/tables/create/
  - /influxdb3/enterprise/admin/tables/update/
  - /influxdb3/enterprise/reference/cli/influxdb3/create/database/
  - /influxdb3/enterprise/reference/cli/influxdb3/create/table/
  - /influxdb3/enterprise/reference/cli/influxdb3/update/table/
  - /influxdb3/enterprise/admin/upgrade/
influxdb3/enterprise/tags: [databases, tables, schema, write]
---

By default, {{% product-name %}} databases use _implicit_ schema mode: a
write that references a new table or column creates it.
_Explicit_ schema mode inverts that: tables and columns must be declared
through the configuration API before you can write to them, and a write
that references anything undeclared is rejected.

Explicit schema mode is available in {{% product-name %}} only.
InfluxDB 3 Core rejects a request to create a database with `explicit`
schema mode with HTTP status `400`
(`explicit schema mode is only available in InfluxDB 3 Enterprise`).

- [Create a database with explicit schema mode](#create-a-database-with-explicit-schema-mode)
- [Declare tables and columns](#declare-tables-and-columns)
- [Write to an explicit database](#write-to-an-explicit-database)
- [Partial writes](#partial-writes)
- [Evolve a declared schema](#evolve-a-declared-schema)
- [Propagation across a cluster](#propagation-across-a-cluster)
- [Limits](#limits)
- [Upgrade considerations](#upgrade-considerations)

## Create a database with explicit schema mode

[Schema mode](/influxdb3/enterprise/admin/databases/create/#schema-mode) is
set when you create a database and can't be changed afterward.

<!--pytest.mark.skip-->

```sh{placeholders="DATABASE_NAME|AUTH_TOKEN"}
influxdb3 create database \
  --schema-mode explicit \
  --token AUTH_TOKEN \
  DATABASE_NAME
```

or

<!--pytest.mark.skip-->

```bash{placeholders="DATABASE_NAME|AUTH_TOKEN"}
curl --request POST "http://localhost:8181/api/v3/configure/database" \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --data '{
    "db": "DATABASE_NAME",
    "schema_mode": "explicit"
  }'
```

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to create
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}

`retention_period` still works alongside `schema_mode`.
If you omit `schema_mode` or set it to `implicit`, the database uses the
default, unenforced behavior.
As a result, existing scripts and clients keep working unchanged.

## Declare tables and columns

Use the same [`influxdb3 create table` command](/influxdb3/enterprise/reference/cli/influxdb3/create/table/)
you'd use in an implicit database to declare a table's tag and field
columns:

<!--pytest.mark.skip-->

```sh{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
influxdb3 create table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --tags host,region \
  --fields usage:float64,online:bool \
  TABLE_NAME
```

or

<!--pytest.mark.skip-->

```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
curl --request POST "http://localhost:8181/api/v3/configure/table" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["host", "region"],
    "fields": [
      {"name": "usage", "type": "float64"},
      {"name": "online", "type": "bool"}
    ]
  }'
```

This is the same `POST /api/v3/configure/table` endpoint that declares
tables in an implicit database.
Explicit mode only changes what happens when a write later references a
table or column that isn't declared.
A declared table always gets its `time` column automatically.

For field type options, see
[Field data types](/influxdb3/enterprise/reference/cli/influxdb3/create/table/#field-data-types).

## Write to an explicit database

Line protocol that matches the declared schema is accepted as usual:

<!--pytest.mark.skip-->

```sh{placeholders="DATABASE_NAME|TABLE_NAME"}
influxdb3 write --database DATABASE_NAME 'TABLE_NAME,host=a,region=west usage=1.0,online=true'
```

A write that names an undeclared table or column is rejected.
An undeclared column error names the database, the table, the column, and the
column type.
An undeclared table error names the database and the table:

```text
column 'rack' (iox::column_type::tag) is not defined in table 'TABLE_NAME' of database 'DATABASE_NAME',
which uses explicit schemas; add the column with the /api/v3/configure/table API before writing to it
```

```text
table 'other_table' is not defined in database 'DATABASE_NAME', which uses explicit schemas;
create the table with the /api/v3/configure/table API before writing to it
```

<!-- VERIFIED against live Enterprise 3.12.0-0.rc.2 (2026-09-30), two-node
cluster, POST /api/v3/write_lp: an undeclared table returns 400 "table '<table>'
is not defined in database '<db>', which uses explicit schemas; ..." and names no
column. An undeclared tag or field returns 400 "column '<column>'
(iox::column_type::tag | iox::column_type::field::float) is not defined in table
'<table>' of database '<db>', ...". -->
Both errors return HTTP status `400`.

A few things to know about rejections:

- **A declared column written at the wrong type** is rejected the same way
  it is in an implicit database, with the existing `InvalidColumnType`
  error (`invalid column type for column '<column>', expected <expected>, got <got>`).
  Explicit mode adds nothing here.
- **A declared tag written as a field, or a field written as a tag,** is
  a wrong type on a declared column.
  It gets the same `invalid column type` error, not the undeclared-column
  error.
- **Every write endpoint rejects the line with status `400`.**
  The v1 (`/write`), v2 (`/api/v2/write`), and v3 (`/api/v3/write_lp`)
  endpoints all enforce the declared schema.
  The endpoint changes only the error format and whether other lines in the
  batch are stored.
  See [Partial writes](#partial-writes).
- **Processing Engine writes enforce the schema with `accept_partial=false`.**
  One rejected line fails the plugin's whole write.
- **Bulk import enforces the schema.**
  A rejected import returns HTTP status `500`
  (`Could not modify catalog: ...`).

<!-- VERIFIED against live Enterprise 3.12.0-0.rc.2 (2026-09-30), two-node
cluster: a declared tag written as a field and a declared field written as a tag
both return 400 "invalid column type for column '<column>', expected
<expected>, got <got>" (the same shape as a wrong field type), not the
undeclared-column error. /api/v3/write_lp, /api/v2/write, and /write all return
400 for an undeclared column. The Processing Engine and bulk import were not
probed; their behavior comes from the origin/3.12 source review in c508a354e. -->

## Partial writes

A rejection is a line-protocol error like any other.
As a result, the `accept_partial` parameter governs the rest of the batch
on the `/api/v3/write_lp` endpoint:

- With `accept_partial=false`, the whole request fails and nothing is
  written.
- With `accept_partial=true`, the offending lines are reported and the rest
  of the batch is written.

The `/api/v3/write_lp` endpoint defaults `accept_partial` to `true`.
A client that sends a batch with one undeclared column and no
`accept_partial` parameter gets a `400` response _and_ has its other lines
stored.

The legacy `/write` and `/api/v2/write` endpoints fail the whole request
when any line references an undeclared column, and they store nothing.
Setting `accept_partial=true` doesn't change this.
<!-- VERIFIED against live Enterprise 3.12.0-0.rc.2 (2026-09-30), two-node
cluster, batch of one valid line and one line with an undeclared field:
/api/v3/write_lp with no parameter or accept_partial=true returns 400 "partial
write of line protocol occurred" and stores the valid line.
/api/v3/write_lp with accept_partial=false returns 400 and stores nothing.
/api/v2/write and /write return 400 and store nothing, with or without
accept_partial=true. -->

## Evolve a declared schema

Add tag and field columns to a declared table with the
[`influxdb3 update table` command](/influxdb3/enterprise/reference/cli/influxdb3/update/table/)
or a `PATCH` request to `/api/v3/configure/table`:

<!--pytest.mark.skip-->

```sh{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
influxdb3 update table \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --tags rack \
  --fields temp:float64 \
  TABLE_NAME
```

or

<!--pytest.mark.skip-->

```bash{placeholders="DATABASE_NAME|TABLE_NAME|AUTH_TOKEN"}
curl --request PATCH "http://localhost:8181/api/v3/configure/table" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "db": "DATABASE_NAME",
    "table": "TABLE_NAME",
    "tags": ["rack"],
    "fields": [{"name": "temp", "type": "float64"}]
  }'
```

The write that was rejected above is accepted once you declare the column.
Schema evolution is **add-only**: you can declare new columns, but you can't
remove, rename, or retype an existing one.
Declaring a column that already exists at its declared type is a no-op.
Declaring it at a different type returns an error.

For more information, see [Add columns to a table](/influxdb3/enterprise/admin/tables/update/).

## Propagation across a cluster

In a multi-node cluster, nodes poll the object store for catalog updates at
[`--catalog-sync-interval`](/influxdb3/enterprise/reference/cli/influxdb3/serve/)
(default `1s`).
Enforcement reads each node's local view of the catalog.
That view can lag the node that accepted a declaration by about one
interval, and sometimes longer.
<!-- VERIFIED against live Enterprise 3.12.0-0.rc.2 (2026-09-30), two-node
cluster, default catalog sync interval: after a PATCH to
/api/v3/configure/table on node 1, a write of the new column to node 2 was
accepted after 518 to 1989 ms (six trials; 961 to 1957 ms in an earlier run).
So "up to one interval" was wrong. The cause of the longer trials isn't
established. Both nodes were started with --mode=ingest,query, and system.nodes
reports ingest,process,query for them. Query-only and process-only nodes were
not tested. The 1s default of --catalog-sync-interval was not re-read in this
run. -->

A client that declares a column on one node and immediately writes it to a
different node can have that write rejected.
The reason is that the second node hasn't yet seen the declaration.
The rejection is a per-line error the client can retry.
It self-corrects once the writing node's catalog catches up.

A node's catalog advances synchronously with a declaration made on that node.
That's why a column declared on the same node you write to is never rejected
this way.

Add-only evolution is what keeps this safe.
A lagging node's view of a declared column is never ahead of the catalog,
only behind.
As a result, the lag can reject a write that should have been accepted.
It can never accept a write that should have been rejected.

## Limits

- **Explicit schema mode is fixed at creation.** No API changes it
  afterward. An implicit database can't be made explicit.
  An explicit database can't be relaxed to implicit.
  If you need a different mode, create a new database and migrate your data.
- **Deleting and recreating a database resets the mode.** The mode belongs
  to the database that was created.
  As a result, recreating a database without `schema_mode` creates an
  implicit one.
- **The `_internal` database is always implicit** and can't be created,
  deleted, or patched through the API.
- **Schema evolution is add-only.** Column removal, rename, and type change
  are out of scope.
- **Value-level validation, per-column permissions, and retention rules**
  are separate concerns and aren't part of schema mode.

## Upgrade considerations

> [!Important]
> #### Explicit schema mode requires your cluster to have already committed to 3.12
>
> Creating an explicit database requires the cluster's catalog to already
> be at the catalog feature level that ships with 3.12.
> The catalog commits that level automatically once every node in the
> cluster is running 3.12. No explicit database has to exist for this to
> happen.
> Once every node has started on 3.12 and the cluster has committed to
> that level, no node in the cluster can roll back to a 3.11.x binary,
> whether or not you ever create an explicit database.
>
> By the time you can create an explicit database, your cluster has
> therefore already lost 3.11.x rollback compatibility.
> For more information about catalog version constraints during an
> upgrade, see
> [Upgrade InfluxDB 3 Enterprise](/influxdb3/enterprise/admin/upgrade/).
