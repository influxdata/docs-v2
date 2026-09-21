---
title: Manage the database
description: >
  Telegraf Controller stores all application state in a SQLite (default) or
  PostgreSQL database. Learn where the database lives, how to configure it,
  and how to back it up, restore it, and troubleshoot it.
menu:
  telegraf_controller:
    name: Manage the database
    parent: Administer Telegraf Controller
weight: 101
related:
  - /telegraf/controller/reference/config-options/
  - /telegraf/controller/admin/high-availability/
  - /telegraf/controller/install/#set-up-your-database
---

{{% product-name %}} stores all application state in a relational database:
configurations and configuration versions, configuration groups, agents,
labels, reporting rules, users, tokens, and settings.
Losing the database means losing all of this data, so operators should know
where the database lives, how to back it up, and how to repair it.

- [Choose a database](#choose-a-database)
- [Configure the database connection](#configure-the-database-connection)
- [SQLite companion files](#sqlite-companion-files)
- [Audit log storage is separate](#audit-log-storage-is-separate)

## Choose a database

- **SQLite** (default): zero-setup embedded database.
  Recommended for development or light workloads.
  Data lives in a single local file that {{% product-name %}} creates
  automatically on first run (for default file paths, see
  [Default SQLite data locations](/telegraf/controller/install/#default-sqlite-data-locations)),
  and backups are simple.
  SQLite supports one {{% product-name %}} instance at a time, requires a
  local filesystem, and serializes writes, so a heavy agent workload can
  cause
  [lock contention](/telegraf/controller/admin/database/troubleshoot/#identify-the-failure-type).
- **PostgreSQL** (or PostgreSQL-compatible): a separate database server.
  Recommended for production use cases.
  Required for [high availability](/telegraf/controller/admin/high-availability/),
  and the right choice when you want the database on separate
  infrastructure from the {{% product-name %}} host or want to reuse
  existing PostgreSQL backup, monitoring, and operations tooling.

## Configure the database connection

Use the `--database` command flag or the `DATABASE_URL` environment variable
to specify the database connection string:

```bash
# Use a custom SQLite database location
telegraf_controller --database="/path/to/database.db"

# Use PostgreSQL
telegraf_controller --database="postgresql://user:password@localhost:5432/telegraf_controller"
```

For the full list of database-related options, see the
[configuration options reference](/telegraf/controller/reference/config-options/).

## SQLite companion files

While {{% product-name %}} runs, SQLite creates two companion files next to
the database file: a write-ahead log (`sqlite.db-wal`) and a shared-memory
file (`sqlite.db-shm`).

> [!Warning]
> The `-wal` and `-shm` files are part of the database.
> Never delete, move, or edit them while they exist.
> Removing a write-ahead log can corrupt the database or silently discard
> recent writes.

## Audit log storage is separate

If you use [audit logging](/telegraf/controller/admin/audit-logs/),
{{% product-name %}} writes audit records to separate per-month SQLite
files, not to the application database.
Include both in your backup strategy.
See
[Back up and restore audit log files](/telegraf/controller/admin/database/back-up-and-restore/#back-up-and-restore-audit-log-files).

{{< children hlevel="h2" >}}
