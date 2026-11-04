---
title: Back up and restore the database
list_title: Back up and restore
description: >
  Back up the Telegraf Controller database safely while the server is
  running or stopped, and restore from a backup.
menu:
  telegraf_controller:
    name: Back up and restore
    parent: Manage the database
weight: 201
related:
  - /telegraf/controller/admin/troubleshoot/database/
  - /telegraf/controller/install/upgrade/
  - /telegraf/controller/admin/audit-logs/
---

Back up the {{% product-name %}} database regularly, and always before an
[upgrade](/telegraf/controller/install/upgrade/), so you can restore the
server to a known-good state.

- [SQLite](#sqlite)
  - [Back up SQLite](#back-up-sqlite)
  - [Restore SQLite](#restore-sqlite)
- [PostgreSQL](#postgresql)
  - [Back up PostgreSQL](#back-up-postgresql)
  - [Restore PostgreSQL](#restore-postgresql)
- [Back up and restore audit log files](#back-up-and-restore-audit-log-files)

> [!Important]
> Database backups contain user records, hashed credentials, API tokens, and
> session data.
> Store backup files with the same care as the live database.

## SQLite

### Back up SQLite

How you back up SQLite depends on whether {{% product-name %}} is running.

#### While {{% product-name %}} is running

Use the SQLite `.backup` command, which produces a consistent copy of a live
database:

```bash
sqlite3 /path/to/sqlite.db ".backup '/path/to/backups/sqlite-backup.db'"
```

Replace `/path/to/sqlite.db` with your database location.
For default locations, see
[Default SQLite data locations](/telegraf/controller/install/#default-sqlite-data-locations).

> [!Warning]
> Never copy a live database file with `cp` or a file manager.
> While {{% product-name %}} is running, part of the database state lives in
> the `-wal` companion file, and a plain copy taken mid-write produces a
> corrupt backup.

The `.backup` command requires the SQLite command-line shell.
For installation instructions, see
[SQLite CLI prerequisites](/telegraf/controller/admin/troubleshoot/database/#prerequisites-install-the-sqlite-cli).

#### While {{% product-name %}} is stopped

With the server stopped, the database is a regular file.
Copy the database file and, if present, its `-wal` and `-shm` companion
files:

```bash
cp /path/to/sqlite.db /path/to/sqlite.db-wal /path/to/sqlite.db-shm /path/to/backups/
```

### Restore SQLite

1.  Stop {{% product-name %}}.
2.  Move the current database file and any `-wal` and `-shm` companion files
    out of the way:

    ```bash
    mkdir -p /path/to/old-database
    mv /path/to/sqlite.db* /path/to/old-database/
    ```

3.  Copy the backup file to the configured database path:

    ```bash
    cp /path/to/backups/sqlite-backup.db /path/to/sqlite.db
    ```

4.  Start {{% product-name %}} and verify that the web interface loads and
    your configurations and agents are present.

## PostgreSQL

For PostgreSQL, use standard PostgreSQL tooling or your provider's backup
features.

### Back up PostgreSQL

```bash
pg_dump --dbname=telegraf_controller --file=telegraf_controller.sql
```

### Restore PostgreSQL

```bash
psql --dbname=telegraf_controller --file=telegraf_controller.sql
```

## Back up and restore audit log files

If you use [audit logging](/telegraf/controller/admin/audit-logs/),
{{% product-name %}} writes audit records to per-month SQLite files,
separate from the application database.
Audit log files are SQLite databases even if the application database is
PostgreSQL.
Restoring an application database backup does not restore audit logs.

Follow the same SQLite [backup](#back-up-sqlite) and
[restore](#restore-sqlite) procedures for each audit log file.
For default audit log file locations, see
[Where audit logs are stored](/telegraf/controller/admin/audit-logs/#where-audit-logs-are-stored).

> [!Note]
> In a
> [high-availability {{% product-name %}} cluster](/telegraf/controller/admin/high-availability/),
> each node writes its own audit log files.
> Back up the audit log files on every node.
> See
> [Audit logs in a cluster](/telegraf/controller/admin/high-availability/#audit-logs-in-a-cluster).
