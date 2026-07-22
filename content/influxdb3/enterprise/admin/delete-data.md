---
title: Delete data
seotitle: Delete data from InfluxDB 3 Enterprise
description: >
  Delete rows from InfluxDB 3 Enterprise by time range and tag predicate using
  the influxdb3 delete rows command. Deletes are asynchronous and applied by the
  compactor.
menu:
  influxdb3_enterprise:
    name: Delete data
    parent: Administer InfluxDB
weight: 106
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/delete/rows/
  - /influxdb3/enterprise/admin/tokens/
---

Row-level deletion is an {{% product-name %}} feature that requires the
[PachaTree storage engine](/influxdb3/enterprise/performance-preview/)--the
default for new clusters.
On clusters that started on 3.10 or earlier, first run the
[storage engine upgrade](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree)
(`--upgrade-pacha-tree`).
Use it to delete rows from a database by time range and an optional tag
predicate.

## How row deletion works

Row deletion is **asynchronous**.
When you run `influxdb3 delete rows`, {{% product-name %}} records a delete
request and persists it to object storage.
The [compactor](/influxdb3/enterprise/get-started/multi-server/#high-availability-with-a-dedicated-compactor)
applies the request the next time it rewrites the affected run sets.

By default, deletes don't apply for up to **24 hours** after you submit the
request.
This delay is tunable with the `--row-delete-min-age` server flag.

> [!Note]
> Because deletes are applied during compaction, rows remain queryable until the
> compactor processes the request.
> Don't expect rows to disappear immediately after the command returns.

## Delete rows

Use the `influxdb3 delete rows` command to delete rows from a database.
For the complete command syntax and flags, see the
[`influxdb3 delete rows`](/influxdb3/enterprise/reference/cli/influxdb3/delete/rows/)
CLI reference.

### Specify a time range

A delete request must include an explicit time scope.
Use one of the following:

- `--min-time`: start of the range (**inclusive**)
- `--max-time`: end of the range (**exclusive**)
- `--all-time`: delete rows across all time

### Filter with a tag predicate

You can narrow a delete to rows that match a tag predicate.
Predicates support **tag equality only**:

- Compare a tag to a string literal--for example, `region = "us-west"`.
- Combine conditions with `AND` only.
- `OR`, `NOT`, and `IN` operators, and field columns, are **not supported**.

### Required permissions

Deleting rows from a database requires the `db:<DATABASE_NAME>:delete`
[token permission](/influxdb3/enterprise/admin/tokens/).
Deleting rows from the `_internal` database requires an admin token.

### Cancel a pending delete

Use the `influxdb3 cancel row-delete` command to cancel a pending delete request
before the compactor applies it.

> [!Note]
> {{% product-name %}} allows at most **1000 pending delete requests** across the
> cluster.

## Monitor row deletes

Query the `system.row_deletes` system table to review the status of delete
requests:

```sql
SELECT * FROM system.row_deletes
```

{{% product-name %}} also emits nine `influxdb3_compactor_row_delete_*` metrics
that report row-deletion activity in the compactor.

> [!Note]
> A dedicated system-tables reference is planned as a follow-up.
> Until then, this guide documents the `system.row_deletes` table.

## Known issues

### Ghost rows after a completed delete

Rows in the un-compacted ingest tail can survive after a delete request reports
`completed`.
If you observe rows that should have been deleted, re-issue the delete after the
affected data compacts, then verify row counts.

### system.row_deletes can return HTTP 500

Querying `system.row_deletes` after an `--all-time` delete that has no tag
predicate can return an HTTP `500` error.
As a workaround, use the `GET /api/v3/row_delete_requests` API endpoint to review
delete requests instead.
