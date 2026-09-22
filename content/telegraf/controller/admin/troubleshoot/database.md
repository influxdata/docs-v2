---
title: Troubleshoot the database
list_title: Database
description: >
  Identify and repair Telegraf Controller database problems, including
  connection failures, lock contention, and database corruption.
menu:
  telegraf_controller:
    name: Database
    parent: Troubleshoot
weight: 203
related:
  - /telegraf/controller/admin/database/
  - /telegraf/controller/admin/database/back-up-and-restore/
  - /telegraf/controller/reference/config-options/
---

Use this guide to identify and repair problems with the {{% product-name %}}
database.
Database errors appear in the {{% product-name %}} server log output.

- [SQLite](#sqlite)
  - [Identify the failure type](#identify-the-failure-type)
  - [Prerequisites: install the SQLite CLI](#prerequisites-install-the-sqlite-cli)
  - [Diagnose corruption](#diagnose-corruption)
  - [Repair corrupted indexes](#repair-corrupted-indexes)
  - [Recover from severe corruption](#recover-from-severe-corruption)
  - [Prevent corruption](#prevent-corruption)
- [PostgreSQL](#postgresql)

## SQLite

### Identify the failure type

The following SQLite failures appear in log output, and they require
different responses:

- **`database is locked`**: lock contention, not damage.
  Another connection held the database longer than expected.
  This is usually transient and resolves on its own.
  If it persists, verify that only one {{% product-name %}} instance uses
  the database file and that the file is on a local filesystem.
  Do not run repair commands for lock errors.
- **`database or disk is full`**: the volume holding the database file is
  out of space, not damaged.
  Free disk space and restart {{% product-name %}}.
  No repair is needed unless a corruption error also appears.
- **`unable to open database file`**: the server cannot read or create the
  database file, which is usually a path or permissions problem, not damage.
  Check that the database directory exists and that the user running
  {{% product-name %}} can read and write the file and its directory.
  Do not run repair commands for this error.
- **`database disk image is malformed`**: database corruption.
  The database file or one of its internal structures is damaged.
  Corruption does not heal on its own and the affected queries keep failing
  until you repair the database.
  Follow the rest of this section.

### Prerequisites: install the SQLite CLI

Diagnosis and repair use the `sqlite3` command-line shell, which operates
directly on the database file:

- **macOS**: included with the operating system.
- **Linux**: install the `sqlite3` package, for example
  `apt install sqlite3` or `dnf install sqlite`.
- **Windows**: download the `sqlite-tools` bundle from the
  [SQLite download page](https://sqlite.org/download.html).

> [!Important]
> Stop {{% product-name %}} before running any diagnosis or repair command.
> Repairing a database while the server writes to it can make the damage
> worse.

### Diagnose corruption

1.  Stop {{% product-name %}}.
2.  Run an integrity check against the database file.
    Replace `/path/to/sqlite.db` with your database location
    (for default locations, see
    [Default SQLite data locations](/telegraf/controller/install/#default-sqlite-data-locations)):

    ```bash
    sqlite3 /path/to/sqlite.db "PRAGMA integrity_check;"
    ```

3.  Interpret the output:

    - **`ok`**: the database is intact.
      The error came from something else, for example a permissions problem
      or a full disk.
    - **Index errors only**, for example:

      ```
      wrong # of entries in index some_index_name
      ```

      Only index structures are damaged and the underlying table data is
      intact.
      This is repairable in place with no data loss.
      Continue to [Repair corrupted indexes](#repair-corrupted-indexes).
    - **Other errors**, for example messages that name table pages or rows:
      table data itself is damaged.
      Continue to
      [Recover from severe corruption](#recover-from-severe-corruption).

### Repair corrupted indexes

If the integrity check reported only index errors, rebuild all indexes from
the intact table data:

1.  [Back up the damaged database file](/telegraf/controller/admin/database/back-up-and-restore/#while-telegraf-controller-is-stopped)
    before changing it.
2.  Rebuild the indexes:

    ```bash
    sqlite3 /path/to/sqlite.db "REINDEX;"
    ```

3.  Verify the repair:

    ```bash
    sqlite3 /path/to/sqlite.db "PRAGMA integrity_check;"
    ```

    The check should now return `ok`.

4.  Start {{% product-name %}} and confirm the log output no longer reports
    database errors.

### Recover from severe corruption

If the integrity check reports damage beyond indexes, recover what SQLite
can read into a new database file:

1.  [Back up the damaged database file](/telegraf/controller/admin/database/back-up-and-restore/#while-telegraf-controller-is-stopped).
2.  Run the recovery:

    ```bash
    sqlite3 /path/to/sqlite.db ".recover" | sqlite3 /path/to/recovered.db
    ```

3.  Check the recovered file:

    ```bash
    sqlite3 /path/to/recovered.db "PRAGMA integrity_check;"
    ```

4.  Replace the damaged database with the recovered file, keeping the
    original for reference:

    ```bash
    mv /path/to/sqlite.db /path/to/sqlite.db.damaged
    mv /path/to/recovered.db /path/to/sqlite.db
    ```

5.  Start {{% product-name %}} and verify your configurations, agents, and
    users in the web interface.

> [!Note]
> Recovery salvages everything SQLite can still read, but rows in damaged
> regions may be lost.
> If recovery produces incomplete data,
> [restore from a backup](/telegraf/controller/admin/database/back-up-and-restore/#restore-sqlite)
> instead.

### Prevent corruption

SQLite is robust against crashes in normal operation.
Corruption almost always traces back to one of the following, all avoidable:

- **Copying a live database**: never copy the database file while
  {{% product-name %}} runs.
  Use the
  [safe backup methods](/telegraf/controller/admin/database/back-up-and-restore/)
  instead.
- **Deleting companion files**: never delete or move the `-wal` and `-shm`
  files next to the database.
  They are part of the database.
- **Network filesystems**: keep the database file on a local filesystem.
  File locking on NFS and SMB shares is unreliable and can corrupt SQLite
  databases.
- **Forced shutdown**: stop {{% product-name %}} with a normal termination
  signal (`SIGTERM` or Ctrl+C) rather than `kill -9`, and avoid powering
  off the host while the server is writing.
- **No backups**: corruption you can't repair is only a real loss without a
  backup.
  [Back up the database](/telegraf/controller/admin/database/back-up-and-restore/)
  on a schedule.

## PostgreSQL

{{% product-name %}} relies on your PostgreSQL server for database health,
so troubleshooting is directed at the server rather than at
{{% product-name %}}:

- **Connection problems**: verify that the PostgreSQL server is running,
  check the format of and credentials in your connection string (DSN or
  database URL), and verify network connectivity between the
  {{% product-name %}} host and the server.
- **TLS handshake failures**: `error performing TLS handshake` in the log
  means {{% product-name %}} does not trust the certificate presented by
  the PostgreSQL server.
  Provide the certificate authority (CA) certificate that signed it.
  See
  [Provide the database CA certificate](/telegraf/controller/admin/troubleshoot/agents/#provide-the-database-ca-certificate).
- **Server health and corruption**: use your PostgreSQL tooling and the
  [PostgreSQL documentation](https://www.postgresql.org/docs/).
- **Unrecoverable state**:
  [restore from a backup](/telegraf/controller/admin/database/back-up-and-restore/#restore-postgresql).
