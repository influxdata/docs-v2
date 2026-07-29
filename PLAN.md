# Storage engine IA redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retire the `performance-preview/` beta identity for InfluxDB 3 Enterprise's
upgraded storage engine, consolidate its scattered explanation into the docset's
existing conceptual/reference/admin homes, and fix two real content gaps (the
undocumented time-disjoint compaction model, and `monitor.md`'s incomplete
system-table list) — closing the content-redesign portion of
[#7568](https://github.com/influxdata/docs-v2/issues/7568).

**Architecture:** No new information architecture. Content moves to homes that
already exist and already carry the right kind of explanation:
`reference/internals/` for concepts (matching `durability.md`/`data-retention.md`),
`reference/` for flag reference (matching `config-options.md`), `admin/query-system-data`
for system tables, `admin/performance-tuning` for tuning/troubleshooting. Shared
content uses the existing `source:` + per-product-stub pattern throughout.

**Tech Stack:** Hugo static site, Markdown content with Hugo shortcodes
(`{{% show-in %}}`, callouts), `link-checker`, Cypress (not touched by this
plan — no template/layout changes).

## Global Constraints

- Naming is already correct, do not change it: "the storage engine upgrade" /
  "the upgraded storage engine" vs. "the Parquet engine" / "Parquet-backed
  storage engine." Never write "PachaTree" in prose.
- Version qualifiers: introduced v3.9.0 and `remove node` v3.10.0 stay
  unlabeled unless contrast is needed. Default-for-new-clusters and CLI
  renames are **v3.11+**. Legacy Parquet-only behavior is "before 3.10" /
  "3.10 and earlier."
- No performance-gain numbers (no "up to 50% faster," no GTM figures) in any
  new or edited content — not yet finalized for publication.
- No performance-gain claim of any kind for Core — Core has no
  compaction/upgraded-engine code path.
- Engine resolution is **catalog-based**, not a runtime flag: new clusters
  are stamped with the upgraded engine at creation with no opt-out; existing
  Parquet clusters keep running Parquet until `--upgrade-pacha-tree`;
  `--use-pacha-tree` is a deprecated legacy alias with identical migration
  behavior.
- Semantic line feeds (one sentence per line), active voice, present tense,
  second person, Google Developer Documentation Style Guide.
- Redirects use Hugo `aliases` in the new destination page's frontmatter, not
  `layout:redirect` (we own every destination here).
- This branch (`storage-engine-ia-redesign`) is based on
  `release-influxdbv3.11` and carries the `release:pending` label from
  \#7568 — do not merge before the product ships.

***

### Task 1: Make the WAL tail definition engine-aware in `durability.md`

PR [#7567](https://github.com/influxdata/docs-v2/pull/7567) (open, base
`master`) adds a Parquet-only "WAL tail" definition to `durability.md` and a
glossary entry. This task applies that same content to this branch (so this
branch is self-contained regardless of #7567's merge timing — the two will
merge like any other parallel edit to shared content) and immediately
corrects it to cover both engines, since this branch already needs the
engine-aware version for Task 2.

**Files:**

- Modify: `content/shared/influxdb3-internals-reference/durability.md`
- Modify: `content/shared/influxdb3-reference/glossary.md`

**Interfaces:**

- Produces: the `#wal-tail` anchor on `durability.md`, linked by Task 3
  (`recover-node.md`, `stop/node.md`) and by the glossary entry.

- [ ] **Step 1: Add the engine-aware WAL tail section to `durability.md`**

  In `content/shared/influxdb3-internals-reference/durability.md`, insert
  after line 44 (end of "### Parquet storage") and before line 46
  ("### In-memory cache"):

  ```markdown
  ### WAL tail

  The _WAL tail_ is the most recent data in the WAL that {{% product-name %}}
  has not yet durably persisted beyond the WAL.
  {{% show-in "core" %}}Because {{% product-name %}} flushes the WAL to object
  storage every second, the WAL tail is durable, but it remains in the WAL
  until the next Parquet persistence captures it.{{% /show-in %}}
  {{% show-in "enterprise" %}}Because {{% product-name %}} flushes the WAL to
  object storage every second, the WAL tail is durable, but it remains in the
  WAL until the next persistence step captures it: the next Parquet
  persistence on the Parquet engine, or the next snapshot on the upgraded
  storage engine (the default for new clusters in 3.11+).{{% /show-in %}}
  ```

- [ ] **Step 2: Add the glossary entry**

  In `content/shared/influxdb3-reference/glossary.md`, insert before
  `### windowing` (currently line 1258 area, immediately after the existing
  `### WAL (write-ahead log)` entry's closing text "all points in the WAL
  must be flushed before the system accepts new writes."):

  ```markdown
  ### WAL tail

  The most recent points in the [WAL](#wal-write-ahead-log) that have not yet
  been durably persisted beyond the WAL.
  For details, see
  [Data durability](/influxdb3/version/reference/internals/durability/#wal-tail).
  ```

- [ ] **Step 3: Build and verify**

  Run: `npx hugo --quiet`
  Expected: build succeeds, no errors referencing `durability.md` or
  `glossary.md`.

- [ ] **Step 4: Commit**

  ```bash
  git add content/shared/influxdb3-internals-reference/durability.md \
          content/shared/influxdb3-reference/glossary.md
  git commit -m "docs(influxdb3): define WAL tail for both storage engines"
  ```

***

### Task 2: Document the time-disjoint compaction model in `durability.md`

Fixes content gap #1 from the design doc: the four-level L1-L4 compaction
model description is stale. 3.11 replaces it with time-disjoint two-level
compaction plus overlapping-L1 leading-edge parallelism — the actual source
of the query/ingest performance improvement (no numbers, per Global
Constraints).

**Files:**

- Modify: `content/shared/influxdb3-internals-reference/durability.md`

**Interfaces:**

- Consumes: the `## Data flow for writes` section structure from Task 1.

- Produces: the `#upgraded-storage-engine-compaction` anchor, linked by the
  new concept page (Task 4) instead of re-explaining compaction there.

- [ ] **Step 1: Add the Enterprise compaction section**

  Append to the end of `durability.md` (after "### In-memory cache"):

  ```markdown
  ## Upgraded storage engine compaction {#upgraded-storage-engine-compaction metadata="v3.11+"}

  {{% show-in "enterprise" %}}
  The upgraded storage engine (the default for new clusters in 3.11+)
  compacts data differently from the Parquet engine described above.

  Incoming writes are buffered in the WAL, flushed to snapshots, and merged
  into Gen0 files.
  From there, 3.11 uses **time-disjoint two-level compaction** by default:
  all leading-edge ingest funnels through a hot-tail L1 run set, and several
  concurrent L1 compaction jobs can run against the leading edge (or any
  heavily-written range) at once.
  L1 run sets are allowed to transiently overlap in their assigned time
  range under load — this is a healthy, query-safe state — and the compactor
  reconciles back to a disjoint L1 as high-priority background work.
  Under low load, nothing overlaps and behavior matches the legacy layout.

  Clusters that started on 3.10 or earlier and have not yet upgraded keep the
  legacy four-level (L1 through L4) compaction layout, where compaction
  serializes on a single hot tail and concurrent leading-edge writes must
  wait.
  Newly created window/shards use the time-disjoint layout; existing
  checkpoints keep their recorded layout until explicitly upgraded.

  For per-level and per-engine tuning options, see
  [Storage engine configuration reference](/influxdb3/enterprise/reference/storage-engine-config-options/).
  {{% /show-in %}}
  ```

- [ ] **Step 2: Build and verify**

  Run: `npx hugo --quiet`
  Expected: build succeeds.

- [ ] **Step 3: Commit**

  ```bash
  git add content/shared/influxdb3-internals-reference/durability.md
  git commit -m "docs(influxdb3): document time-disjoint compaction model"
  ```

***

### Task 3: Trim inline WAL-tail explanations to a link

`recover-node.md` and `stop/node.md` already correctly explain WAL tail
per-engine inline. Now that `durability.md#wal-tail` (Task 1) is the
canonical, engine-aware definition, trim these two down to a link — the
narrower fix from the design doc's PR #7567 dependency section.

**Files:**

- Modify: `content/influxdb3/enterprise/admin/recover-node.md:32-39`

- Modify: `content/shared/influxdb3-cli/stop/node.md:6-11`

- [ ] **Step 1: Trim `recover-node.md`**

  Replace (current lines 32-39):

  ```markdown
  captures them in a snapshot.
  These buffered writes—the ones a snapshot has not yet captured—are the node's
  _WAL tail_.
  Run the [`influxdb3 stop node`](/influxdb3/enterprise/reference/cli/influxdb3/stop/node/)
  command against a running node to save the WAL tail before the node reports a
  `stopped` state.
  The Parquet engine flushes the WAL, and the upgraded storage engine captures a
  snapshot.
  ```

  With:

  ```markdown
  captures them in a snapshot.
  These buffered writes are the node's
  [_WAL tail_](/influxdb3/enterprise/reference/internals/durability/#wal-tail).
  Run the [`influxdb3 stop node`](/influxdb3/enterprise/reference/cli/influxdb3/stop/node/)
  command against a running node to save the WAL tail before the node reports a
  `stopped` state.
  ```

  Leave the rest of the file (lines 41-56, including the `--force-finalize`
  guard explanation) unchanged — only the definition itself moves, not the
  surrounding node-lifecycle guidance.

- [ ] **Step 2: Trim `stop/node.md`**

  Replace (current lines 6-11):

  ```markdown
  1. The node is marked as `stopping` in the catalog.
  2. The node completes its stop cascade, then confirms the stop.
     The cascade drains the node's WAL tail—the writes buffered in the
     write-ahead log (WAL) since the last snapshot.
     The Parquet engine flushes the WAL, and the upgraded storage engine
     (the default for new clusters in {{< product-name >}} 3.11+) snapshots it.
  ```

  With:

  ```markdown
  1. The node is marked as `stopping` in the catalog.
  2. The node completes its stop cascade, then confirms the stop.
     The cascade drains the node's
     [WAL tail](/influxdb3/version/reference/internals/durability/#wal-tail)—the
     writes buffered in the write-ahead log (WAL) since the last snapshot.
  ```

  Leave lines 73-76 and 94 (the other two WAL-tail mentions further down)
  as-is — they reference the term in passing, not redefine it, and this task
  only removes duplicate *definitions*, not every mention of the term.

- [ ] **Step 3: Build and verify**

  Run: `npx hugo --quiet`
  Expected: build succeeds.

- [ ] **Step 4: Commit**

  ```bash
  git add content/influxdb3/enterprise/admin/recover-node.md \
          content/shared/influxdb3-cli/stop/node.md
  git commit -m "docs(influxdb3): link to canonical WAL tail definition"
  ```

***

### Task 4: Create the storage-engine concept page (shared + Core/Enterprise stubs)

Retires `performance-preview/_index.md`'s content into the shared+stub
pattern used by `durability.md`/`data-retention.md`. Core gets a short
Parquet-only paragraph; Enterprise gets the full orientation content, with
the compaction-model detail replaced by a link to Task 2's new section
(not re-explained here).

**Files:**

- Create: `content/shared/influxdb3-internals-reference/storage-engine.md`
- Create: `content/influxdb3/enterprise/reference/internals/storage-engine.md`
- Create: `content/influxdb3/core/reference/internals/storage-engine.md`

**Interfaces:**

- Produces: `/influxdb3/enterprise/reference/internals/storage-engine/` and
  `/influxdb3/core/reference/internals/storage-engine/`, linked from Task 5,
  6, 7, 8, and 9.

- Consumes: `#upgraded-storage-engine-compaction` anchor from Task 2.

- [ ] **Step 1: Write the shared body**

  Create `content/shared/influxdb3-internals-reference/storage-engine.md`:

  ````markdown
  {{% show-in "core" %}}
  {{% product-name %}} always writes and stores data using the Parquet
  storage engine — see [Data durability](/influxdb3/core/reference/internals/durability/)
  for how data flows from write to Parquet persistence.
  InfluxDB 3 Enterprise also offers an upgraded storage engine as an
  alternative; Core does not include it.
  {{% /show-in %}}

  {{% show-in "enterprise" %}}
  > [!Important]
  > #### The upgraded storage engine is the default for new clusters
  > New {{% product-name %}} clusters default to the upgraded storage
  > engine—no flag is required.
  > Clusters that started on 3.10 or earlier keep the Parquet engine until you
  > run the storage engine upgrade by restarting the cluster with
  > [`--upgrade-pacha-tree`](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree).

  ## What is the storage engine upgrade?

  {{% product-name %}} includes major upgrades to the storage layer that
  improve how data is written, stored, compressed, compacted, and queried.
  These upgrades touch every layer of the storage path—from a new on-disk
  file format to how fields are organized into column families and how
  compaction manages resources (see
  [Upgraded storage engine compaction](/influxdb3/enterprise/reference/internals/durability/#upgraded-storage-engine-compaction)
  for the compaction model).

  ## Why these upgrades

  The existing InfluxDB 3 storage layer uses [Apache Parquet](https://parquet.apache.org/)
  and is optimized for analytical workloads.
  Customers running high-cardinality, wide-schema, and query-intensive
  workloads need better single-series query performance, more predictable
  resource usage, and the schema flexibility that made InfluxDB v1 and v2
  popular.
  These upgrades extend the storage layer to support those workloads while
  maintaining full compatibility with InfluxDB 3's data model and query
  languages.

  Key improvements include:

  - **Faster single-series queries**: Improved response times for highly
    selective time-series queries.
  - **Consistent resource usage**: Bounded CPU and memory during persistence
    and compaction, eliminating spikes during heavy ingestion or compaction
    bursts.
  - **Wide-and-sparse table support**: Schemas with up to millions of columns
    and dynamic schema evolution without expensive rewrites.
  - **Column families**: Group related fields for efficient compression and
    I/O, so queries only read the data they need.
  - **Bulk data export**: Export compacted data as Parquet files for use with
    external tools.
  - **Automatic Parquet upgrade**: Seamlessly migrate existing data with
    hybrid query mode during the transition.

  ## Run the storage engine upgrade

  New clusters use the upgraded storage engine by default and do not need any
  flag.

  For clusters that started on 3.10 or earlier (Parquet engine), run the
  storage engine upgrade by including the `--upgrade-pacha-tree` flag in your
  [`influxdb3 serve` startup command](/influxdb3/enterprise/get-started/setup/):

  ```bash { callout="--upgrade-pacha-tree" }
  influxdb3 serve \
    --node-id host01 \
    --cluster-id cluster01 \
    --object-store file \
    --data-dir ~/.influxdb3 \
    --upgrade-pacha-tree
  ````

  You can also trigger the upgrade with an environment variable:

  ```bash
  export INFLUXDB3_UPGRADE_PACHA_TREE=true
  influxdb3 serve ...
  ```

  > \[!Note]
  >
  > #### Upgrading the storage engine
  >
  > The `--use-pacha-tree` flag and the `INFLUXDB3_USE_PACHA_TREE` and
  > `INFLUXDB3_ENTERPRISE_USE_PACHA_TREE` environment variables are
  > deprecated.
  > They are still accepted and start the same migration, but the server
  > logs a deprecation warning at startup.

  See [Storage engine configuration reference](/influxdb3/enterprise/reference/storage-engine-config-options/)
  for tuning options, or
  [Query system data](/influxdb3/enterprise/admin/query-system-data/#query-storage-engine-tables)
  for system tables and telemetry.

  > \[!Warning]
  >
  > #### Existing clusters with Parquet data
  >
  > On clusters with existing Parquet data, running the storage engine upgrade
  > **automatically converts Parquet files to `.pt` format** on startup, which
  > consumes additional CPU and memory while the migration runs.
  > Queries continue to work normally during this period.
  > See [Upgrade from Parquet](#upgrade-from-parquet) for details.
  >
  > Before you upgrade a production cluster, test the storage engine upgrade in
  > a staging or test environment first.

  ## What's changed

  These upgrades touch every layer of the storage path—from the on-disk file
  format to how data is compressed and organized.

  ### New file format

  Data is stored in a new columnar file format (`.pt` files) optimized for
  time-series workloads.
  All data within a file is sorted by column family key,
  [series key](/influxdb3/enterprise/reference/glossary/#series-key), and
  timestamp, which enables efficient compaction, querying, and filtering.

  The format uses type-specific compression algorithms that adapt to data
  characteristics—delta-delta RLE for timestamps, Gorilla encoding for
  floats, dictionary encoding for low-cardinality strings, and more.

  ### Column families

  Column families let you group related fields together so that queries only
  read the data they need.
  Fields in the same family are stored together on disk.
  For wide tables with hundreds of fields, this dramatically reduces I/O.

  When writing [line protocol](/influxdb3/enterprise/reference/line-protocol/),
  use the `::` (double-colon) delimiter in field names to assign fields to a
  family.
  The portion before `::` is the family name; everything after is the field
  name.

  ```txt
  metrics,host=sA cpu::usage_user=55.2,cpu::usage_sys=12.1,cpu::usage_idle=32.7 1000000000
  metrics,host=sA mem::free=2048i,mem::used=6144i,mem::cached=1024i 1000000000
  metrics,host=sA disk::read_bytes=50000i,disk::write_bytes=32000i 1000000000
  ```

  This creates three column families:

  | Family | Fields                                  |
  | :----- | :-------------------------------------- |
  | `cpu`  | `usage_user`, `usage_sys`, `usage_idle` |
  | `mem`  | `free`, `used`, `cached`                |
  | `disk` | `read_bytes`, `write_bytes`             |

  When a query references only `mem::free`, the storage layer reads only the
  `mem` family block and skips `cpu` and `disk` data entirely.

  > \[!Note]
  > Only the first `::` is significant.
  > A field name like `a::b::c` creates family `a` with field `b::c`.

  Fields written without `::` are assigned to auto-generated families (named
  `__0`, `__1`, etc.), each holding up to 100 fields.

  ## Upgrade from Parquet

  Existing clusters with Parquet data can upgrade with zero manual migration.
  The upgrade is fully automatic and occurs on initial startup.

  When you restart a cluster with `--upgrade-pacha-tree`, the system:

  1. Detects existing Parquet data and enters hybrid mode.
  2. Clears the legacy WAL on ingest nodes and streams Parquet files through
     a conversion pipeline.
  3. Integrates converted files into the new storage format through
     compaction.
  4. Automatically transitions once all data is migrated.

  During hybrid mode, queries merge results from both the legacy and upgraded
  storage layers.
  If there is a conflict (same series key and timestamp), the upgraded data
  takes precedence.

  After the upgrade completes, Parquet engine options remaining in your
  configuration—including options you may have relied on long before the
  upgrade—no longer have any effect.
  On the next server start following completion of the upgrade, each one
  logs a warning indicating it can be removed.
  Use the startup log as a checklist for cleaning up your configuration.

  To monitor upgrade progress, see
  [Query system data](/influxdb3/enterprise/admin/query-system-data/#query-storage-engine-tables).

  ## Downgrade to Parquet

  If you need to revert an upgraded cluster back to standard Parquet
  storage, use the `influxdb3 downgrade-to-parquet` command.
  This command updates the catalog and deletes all files specific to the
  upgraded storage engine from object storage.

  > \[!Note]
  >
  > #### Downgrade impacts
  >
  > The downgrade deletes all `.pt` files, including data written
  > after the upgrade.
  > **Only data that existed before the upgrade (original Parquet files) is
  > preserved.**
  > You can run the storage engine upgrade again later by restarting with
  > `--upgrade-pacha-tree`.

  Before you downgrade:

  1. **Stop all nodes** in the cluster before running the downgrade command.
     The command checks for running nodes and refuses to proceed if any are
     active.

     ```bash
     influxdb3 stop node --node-id <NODE_ID>
     ```

  2. **Verify table compatibility.**
     The downgrade validates that all tables can be represented in Parquet
     format.
     Tables that exceed the Parquet column limit or contain columns without
     legacy Parquet column IDs block the downgrade.

  Use the `--dry-run` flag to preview the downgrade—list files that would be
  deleted without making any changes:

  ```bash
  influxdb3 downgrade-to-parquet \
    --cluster-id cluster01 \
    --object-store file \
    --data-dir ~/.influxdb3 \
    --dry-run
  ```

  Run the downgrade:

  ```bash
  influxdb3 downgrade-to-parquet \
    --cluster-id cluster01 \
    --object-store file \
    --data-dir ~/.influxdb3
  ```

  After the downgrade completes, restart nodes without the
  `--upgrade-pacha-tree` flag to resume standard Parquet storage mode.

  For all available options, see
  [Storage engine configuration reference](/influxdb3/enterprise/reference/storage-engine-config-options/#downgrade-options).

  ## Export to Parquet

  You can export compacted data as Parquet files for use with external
  tools.

  > \[!Note]
  > Data must be compacted before it can be exported.
  > Uncompacted data is not available for export at this time.

  ```bash
  # Step 1: List available databases
  influxdb3 export databases

  # Step 2: List tables in a database
  influxdb3 export tables -d mydb

  # Step 3: List compacted 24-hour windows for a table
  influxdb3 export windows -d mydb -t cpu

  # Step 4: Export data as Parquet files
  influxdb3 export data -d mydb -t cpu -o ./export_output
  ```

  To export specific time windows only:

  ```bash
  influxdb3 export data -d mydb -t cpu -w 2026-01-15,2026-01-16 -o ./export_output
  ```

  ## Who should upgrade existing clusters

  New clusters use the upgraded storage engine by default.
  If your cluster started on 3.10 or earlier and still runs the Parquet
  engine, the storage engine upgrade especially benefits workloads with:

  - High cardinality or wide tables
  - Frequent backfill across time ranges
  - Query-heavy access patterns requiring low latency
  - Sparse schemas with dynamic column creation
  - Resource constraints where bounded memory and CPU usage matter

  ## Support and feedback

  - Contact [InfluxData support](https://support.influxdata.com)
  - Reach out to your InfluxData account team
    {{% /show-in %}}

  ```
  ```

- [ ] **Step 2: Create the Enterprise stub**

  Create `content/influxdb3/enterprise/reference/internals/storage-engine.md`:

  ```markdown
  ---
  title: Storage engine
  seotitle: InfluxDB 3 Enterprise storage engine
  description: >
    Learn about the InfluxDB 3 Enterprise storage engine, including the
    upgraded storage engine (the default for new clusters), its version
    history, and how to upgrade or downgrade an existing cluster.
  menu:
    influxdb3_enterprise:
      name: Storage engine
      parent: Enterprise internals
  weight: 105
  influxdb3/enterprise/tags: [storage, performance, internals]
  source: /shared/influxdb3-internals-reference/storage-engine.md
  canonical: self
  aliases:
    - /influxdb3/enterprise/performance-preview/
  related:
    - /influxdb3/enterprise/get-started/setup/
    - /influxdb3/enterprise/reference/storage-engine-config-options/
    - /influxdb3/enterprise/admin/query-system-data/
    - /influxdb3/enterprise/reference/internals/durability/
  ---

  <!--
  The content for this page is at
  // SOURCE content/shared/influxdb3-internals-reference/storage-engine.md
  -->
  ```

- [ ] **Step 3: Create the Core stub**

  Create `content/influxdb3/core/reference/internals/storage-engine.md`:

  ```markdown
  ---
  title: Storage engine
  seotitle: InfluxDB 3 Core storage engine
  description: >
    Learn about the InfluxDB 3 Core storage engine (Parquet) and how it
    differs from the optional upgraded storage engine available in
    InfluxDB 3 Enterprise.
  menu:
    influxdb3_core:
      name: Storage engine
      parent: Core internals
  weight: 105
  influxdb3/core/tags: [storage, internals]
  source: /shared/influxdb3-internals-reference/storage-engine.md
  canonical: self
  related:
    - /influxdb3/core/reference/internals/durability/
    - /influxdb3/enterprise/reference/internals/storage-engine/
  ---

  <!--
  The content for this page is at
  // SOURCE content/shared/influxdb3-internals-reference/storage-engine.md
  -->
  ```

  Check the exact `parent:` menu value against
  `content/influxdb3/core/reference/internals/_index.md`'s `menu.name` before
  committing — match it exactly (do not guess; read the file).
  Also check both stubs' `weight: 105` against their siblings' actual
  weights (`data-retention.md`, `authentication.md`, `rbac.md` where
  present, `durability/_index.md`) in each product's
  `reference/internals/` directory — adjust if 105 collides with an
  existing page, so menu order stays sensible.

- [ ] **Step 4: Build and verify**

  Run: `npx hugo --quiet`
  Expected: build succeeds, both stubs render, the Core stub shows only the
  short Parquet paragraph, the Enterprise stub shows the full page.

- [ ] **Step 5: Commit**

  ```bash
  git add content/shared/influxdb3-internals-reference/storage-engine.md \
          content/influxdb3/enterprise/reference/internals/storage-engine.md \
          content/influxdb3/core/reference/internals/storage-engine.md
  git commit -m "docs(influxdb3): add storage engine concept page for Core and Enterprise"
  ```

***

### Task 5: Create the storage-engine flag reference page

Retires `performance-preview/configure.md` into an Enterprise-only reference
page, sibling to `config-options.md`. Flag-reference content only — no
compaction-model prose (that's Task 2's job).

**Files:**

- Create: `content/influxdb3/enterprise/reference/storage-engine-config-options.md`

**Interfaces:**

- Produces: `/influxdb3/enterprise/reference/storage-engine-config-options/`,
  linked from Task 4, 8, and 9.

- [ ] **Step 1: Read the current `configure.md` in full**

  Run: `cat content/influxdb3/enterprise/performance-preview/configure.md`

  This is the source content for this page. Port it verbatim except:

  - Drop the two `[!Important]` callout boxes at the top that duplicate the
    concept page (the "default for new clusters" box and its surrounding
    prose) — replace with a single sentence: "For background on the upgraded
    storage engine, see [Storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)."
  - Replace the `## L1-L4 level tuning` section's introductory paragraph
    (currently "These options control per-level compaction parameters. Data
    enters L1 from snapshot batch compaction and promotes through levels
    based on run set count triggers.") with: "For what these levels mean and
    how the time-disjoint compaction model uses them, see [Upgraded storage
    engine compaction](/influxdb3/enterprise/reference/internals/durability/#upgraded-storage-engine-compaction)."
    Keep the L1-L4 option tables themselves unchanged, since those are still
    real, current flags.
  - Everything else (General, WAL, Snapshot, Gen0, File cache, Replication,
    Compactor, L1-L4 option tables, Example configurations, Downgrade
    options, Migrate from pt- option names) ports unchanged.

- [ ] **Step 2: Write the new frontmatter**

  ```yaml
  ---
  title: Storage engine configuration reference
  seotitle: Storage engine configuration reference for InfluxDB 3 Enterprise
  description: >
    Complete reference for all configuration options available with the
    upgraded InfluxDB 3 Enterprise storage engine, including WAL, snapshot,
    compaction, caching, and replication settings.
  menu:
    influxdb3_enterprise:
      name: Storage engine configuration
      parent: Reference
  weight: 108
  influxdb3/enterprise/tags: [storage, configuration, reference]
  aliases:
    - /influxdb3/enterprise/performance-preview/configure/
  related:
    - /influxdb3/enterprise/reference/internals/storage-engine/
    - /influxdb3/enterprise/admin/query-system-data/
    - /influxdb3/enterprise/reference/config-options/
  ---
  ```

  Check the exact `weight:` and `parent:` against
  `content/influxdb3/enterprise/reference/config-options.md`'s frontmatter
  before committing so this page sorts sensibly next to it — read that file's
  frontmatter and pick a weight that places this page adjacent, don't guess.

- [ ] **Step 3: Assemble and write the file**

  Combine Step 2's frontmatter with Step 1's ported body into
  `content/influxdb3/enterprise/reference/storage-engine-config-options.md`.

- [ ] **Step 4: Build and verify**

  Run: `npx hugo --quiet`
  Expected: build succeeds.

- [ ] **Step 5: Commit**

  ```bash
  git add content/influxdb3/enterprise/reference/storage-engine-config-options.md
  git commit -m "docs(influxdb3): relocate storage engine flag reference"
  ```

***

### Task 6: Add storage-engine system tables and telemetry to `query-system-data`

Fixes content gap #2 (incomplete system-table list) while relocating
`monitor.md`'s table catalog into the page that already documents every
other subsystem's system tables the same way.

**Files:**

- Modify: `content/shared/influxdb3-admin/query-system-data/_index.md`
- Modify: `content/influxdb3/enterprise/admin/query-system-data/_index.md`
  (frontmatter only, for the alias)

**Interfaces:**

- Produces: the `#query-storage-engine-tables` anchor, linked from Task 4
  and Task 8.

- Consumes: none.

- [ ] **Step 1: Verify the 5 new tables' actual columns against a live 3.11 instance**

  The internal notes name 5 new system tables but don't give column
  schemas: `system.pt_shards`, `system.pt_compaction_files`,
  `system.pt_storage_snapshots`, `system.pt_storage_checkpoints`,
  `system.pt_storage_run_set_indexes`.
  Before writing table docs for them, query each against a running 3.11
  Enterprise instance with the upgraded engine enabled:

  ```bash
  influxdb3 query --database <DB> "SELECT * FROM system.pt_shards LIMIT 1"
  influxdb3 query --database <DB> "SELECT * FROM system.pt_compaction_files LIMIT 1"
  influxdb3 query --database <DB> "SELECT * FROM system.pt_storage_snapshots LIMIT 1"
  influxdb3 query --database <DB> "SELECT * FROM system.pt_storage_checkpoints LIMIT 1"
  influxdb3 query --database <DB> "SELECT * FROM system.pt_storage_run_set_indexes LIMIT 1"
  ```

  Record the actual column names and types from each result — do not invent
  them. If no live 3.11 instance is available, follow the
  `influxdb3-test-setup` skill to stand one up first.

- [ ] **Step 2: Append the "Query storage engine tables" subsection**

  Insert at the end of `content/shared/influxdb3-admin/query-system-data/_index.md`
  (after line 237, the end of the "Query trigger logs" subsection), gated
  for Enterprise only:

  ````markdown
  #### Query storage engine tables {#query-storage-engine-tables}

  {{% show-in "enterprise" %}}
  The upgraded storage engine (the default for new clusters in 3.11+)
  exposes internal state through system tables.

  **`system.pt_ingest_wal`** — WAL files and their shards:

  ```sql
  SELECT * FROM system.pt_ingest_wal;
  ````

  Columns: `wal_file_id`, `node_id`, `node_name`, `shard_start_time`,
  `shard_duration_seconds`, `min_time`, `max_time`, `row_count`,
  `size_bytes`, `is_merged`.
  Use this table to monitor WAL accumulation, shard distribution, time
  coverage, and merge status (`is_merged = false` rows are unmerged).

  **`system.pt_ingest_files`** — Gen0 files with metadata:

  ```sql
  SELECT * FROM system.pt_ingest_files;
  ```

  Columns: `file_id`, `node_id`, `node_name`, `generation`, `min_time`,
  `max_time`, `row_count`, `size_bytes`, `has_bloom_filter`.
  Use this table to monitor file counts per generation, file sizes, and time
  ranges.

  **Compaction tables** — expose the compaction subsystem's state:

  - `system.pt_compaction_active_jobs`: currently running compaction jobs
    (`plan_id`, `plan_type`, `state`, `shard_id`, `total_slices`,
    `completed_slices`).
  - `system.pt_compaction_ingest_nodes`: per-ingest-node compaction lag
    (`node_id`, `compaction_lag`, `seen_lag`,
    `deferred_snapshot_count`—a non-zero value means snapshots are failing
    to compact and accumulating; check `system.pt_compaction_deferred_snapshots`).
  - `system.pt_compaction_nodes`: compaction node state.
  - `system.pt_compaction_run_sets`: pending compaction work grouped by time
    window and shard.
  - `system.pt_compaction_deferred_snapshots`: snapshots that failed to
    compact; a growing list indicates a persistent compaction failure—check
    `error_message`.
  - `system.pt_shards`, `system.pt_compaction_files`,
    `system.pt_storage_snapshots`, `system.pt_storage_checkpoints`,
    `system.pt_storage_run_set_indexes`: <!-- fill in from Step 1's verified
    output before merge; one sentence per table stating what it exposes and
    the primary column(s) to check -->

  **Parquet upgrade status** — if you
  [upgraded from Parquet](/influxdb3/enterprise/reference/internals/storage-engine/#upgrade-from-parquet):

  ```sql
  -- Per-node upgrade status
  SELECT * FROM system.upgrade_parquet_node;

  -- Per-file migration progress
  SELECT * FROM system.upgrade_parquet;
  ```

  Monitor `system.upgrade_parquet_node` to confirm each node reaches
  `completed` status.
  The status updates on a polling interval (default 5 seconds, configurable
  with `--upgrade-poll-interval`).

  **Query telemetry** — the query telemetry endpoint provides detailed
  execution statistics for analyzing query performance:

  ```bash
  curl -X GET "http://localhost:8181/api/v3/query_sql_telemetry" \
    -H "Authorization: Bearer AUTH_TOKEN"
  ```

  Replace `AUTH_TOKEN` with your authentication token.
  The response includes `query_id`, `execution_time_us`, per-chunk
  statistics (`chunks`), cache hit rates by type (`cache_stats`), and
  file-level read statistics (`file_stats`).
  {{% /show-in %}}

  ```

  The `<!-- fill in ... -->` line is a real, tracked TODO for Step 1's
  verification output, not a placeholder left in committed content — resolve
  it before Step 4's commit using the actual query results from Step 1.

  ```

- [ ] **Step 3: Add the redirect alias**

  In `content/influxdb3/enterprise/admin/query-system-data/_index.md`
  frontmatter, add:

  ```yaml
  aliases:
    - /influxdb3/enterprise/performance-preview/monitor/
  ```

- [ ] **Step 4: Resolve the Step 2 TODO, build, and verify**

  Replace the `<!-- fill in ... -->` placeholder with real column
  descriptions from Step 1's query output.
  Run: `npx hugo --quiet`
  Expected: build succeeds, no HTML comment placeholders remain in rendered
  output (`grep -rn "fill in from Step 1" content/` returns nothing).

- [ ] **Step 5: Commit**

  ```bash
  git add content/shared/influxdb3-admin/query-system-data/_index.md \
          content/influxdb3/enterprise/admin/query-system-data/_index.md
  git commit -m "docs(influxdb3): add storage engine system tables and telemetry"
  ```

***

### Task 7: Add storage-engine metrics and troubleshooting to `performance-tuning.md`

Relocates `monitor.md`'s "Performance analysis" and "Troubleshooting"
sections as new entries in the page that already documents this exact kind
of guidance for the Parquet engine.

**Files:**

- Modify: `content/shared/influxdb3-admin/performance-tuning.md`

**Interfaces:**

- Consumes: existing `## General monitoring principles` (line 28) and
  `## Common performance issues` (line 218) sections.

- [ ] **Step 1: Read the current sections to match style**

  Run: `sed -n '28,66p;218,258p' content/shared/influxdb3-admin/performance-tuning.md`

  Match the existing `### Key metrics to monitor` and `### <Issue name>` /
  `**Symptoms:**` / solution-list style exactly.

- [ ] **Step 2: Add storage-engine metric thresholds**

  Under `## General monitoring principles` / `### Key metrics to monitor`,
  add (gated, since Gen0/compaction metrics don't exist on the Parquet
  engine):

  ```markdown
  {{% show-in "enterprise" %}}
  On clusters running the upgraded storage engine (the default for new
  clusters in 3.11+):

  | Metric | Good | Warning | Action |
  |:-------|:-----|:--------|:-------|
  | Cache hit rate | >80% | <60% | Increase `--file-cache-size` or `--file-cache-recency` |
  | Rows read vs returned ratio | <100:1 | >1000:1 | Add more selective predicates |
  | WAL file count | <50 | >100 | Increase `--wal-flush-concurrency` |
  | Gen0 file count | <100 | >200 | Increase `--compactor-input-size-budget` |
  {{% /show-in %}}
  ```

- [ ] **Step 3: Add storage-engine troubleshooting entries**

  Under `## Common performance issues`, add four new `### <Issue>` entries
  following the existing `**Symptoms:**` pattern, gated Enterprise-only:

  ```markdown
  {{% show-in "enterprise" %}}
  ### High WAL file count (upgraded storage engine)

  **Symptoms:** `system.pt_ingest_wal` shows many accumulated files.

  **Possible causes:** Merge operations falling behind write rate,
  insufficient flush concurrency, object storage latency.

  **Solutions:**

  1. Increase flush concurrency: `--wal-flush-concurrency 8`
  2. Increase WAL flush interval to create larger, fewer files:
     `--wal-flush-interval 5s`
  3. Increase the WAL buffer size so each flush produces a larger file:
     `--wal-buffer-size 30MB`
  4. Check object storage performance and connectivity.

  ### High cache miss rate (upgraded storage engine)

  **Symptoms:** `cache_stats` from the query telemetry endpoint shows >40%
  miss rate.

  **Possible causes:** Cache size too small for working set, cache recency
  window too narrow, random access patterns across time ranges.

  **Solutions:**

  1. Increase cache size: `--file-cache-size 16GB`
  2. Extend cache recency window: `--file-cache-recency 24h`
  3. Extend eviction timeout: `--file-cache-evict-after 48h`

  ### Slow compaction (upgraded storage engine)

  **Symptoms:** Gen0 file count continues to grow.

  **Possible causes:** Compaction budget too low for write volume, high
  write rate overwhelming compaction, snapshot size too large creating
  oversized Gen0 files.

  **Solutions:**

  1. Increase the compaction input size budget:
     `--compactor-input-size-budget 12GB`
  2. Reduce snapshot size to create smaller, more frequent Gen0 files:
     `--snapshot-size 125MB`
  3. For distributed deployments, add a dedicated compactor node
     (`--mode compact`).

  ### Query node lag (upgraded storage engine)

  **Symptoms:** Query nodes return stale data.

  **Possible causes:** Replication falling behind, network latency to
  object storage, insufficient replica concurrency.

  **Solutions:**

  1. Increase replication concurrency: `--wal-replica-steady-concurrency 8`
  2. Reduce the replication polling interval: `--replication-interval 100ms`
  3. Increase replica queue length: `--wal-replica-queue-length 200`

  For a full list of replication options, see
  [Storage engine configuration reference](/influxdb3/enterprise/reference/storage-engine-config-options/#replication-query-nodes).
  {{% /show-in %}}
  ```

  This also fixes the pre-existing indentation bug from `monitor.md`'s
  "Slow compaction" solution 3 (extra leading spaces before `--mode compact`)
  — the code above has clean indentation.

- [ ] **Step 4: Build and verify**

  Run: `npx hugo --quiet`
  Expected: build succeeds.

- [ ] **Step 5: Commit**

  ```bash
  git add content/shared/influxdb3-admin/performance-tuning.md
  git commit -m "docs(influxdb3): add storage engine metrics and troubleshooting"
  ```

***

### Task 8: Trim scattered storage-engine callouts to pointers

Seven files repeat partial explanations of the storage engine instead of
pointing to the new concept page (Task 4). Trim each to a single pointer.

**Files:**

- Modify: `content/influxdb3/enterprise/admin/clustering.md:18-26,92-97,611-614`

- Modify: `content/influxdb3/enterprise/admin/load-capture.md:24-28`

- Modify: `content/influxdb3/enterprise/admin/import-data.md:17-22`

- Modify: `content/influxdb3/enterprise/admin/delete-data.md:18-23`

- Modify: `content/shared/influxdb3-admin/backup-restore.md` (link updates only, prose already tight)

- Modify: `content/shared/influxdb3-admin/upgrade.md:33` (link update only)

- Modify: `content/shared/influxdb3-reference/glossary.md` (IOx entry, add related link)

- [ ] **Step 1: `clustering.md` — trim the prepend note (lines 18-26)**

  Replace:

  ```yaml
  prepend: |
    > [!Note]
    > #### Using the performance upgrade preview?
    >
    > Thread allocation on this page applies to the Parquet storage engine.
    > If your cluster runs the upgraded storage engine (the default for new
    > clusters in InfluxDB 3 Enterprise 3.11+), use the
    > [configuration reference](/influxdb3/enterprise/performance-preview/configure/)
    > instead.
  ```

  With:

  ```yaml
  prepend: |
    > [!Note]
    > Thread allocation on this page applies to the Parquet storage engine.
    > If your cluster runs the upgraded storage engine (the default for new
    > clusters in InfluxDB 3 Enterprise 3.11+), see the
    > [storage engine configuration reference](/influxdb3/enterprise/reference/storage-engine-config-options/)
    > instead.
  ```

- [ ] **Step 2: `clustering.md` — fix the "Allocate threads by node type" callout (lines 92-97)**

  Replace:

  ```markdown
  > [!Important]
  > With the [performance upgrade preview](/influxdb3/enterprise/performance-preview/)
  > (`--use-pacha-tree`), ingest and compaction run on the IO thread pool
  > instead of the DataFusion thread pool. Follow the
  > [preview configuration reference](/influxdb3/enterprise/performance-preview/configure/)
  > instead of the guidance in this section.
  ```

  With:

  ```markdown
  > [!Important]
  > With the [upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)
  > (the default for new clusters in 3.11+), ingest and compaction run on the
  > IO thread pool instead of the DataFusion thread pool. Follow the
  > [storage engine configuration reference](/influxdb3/enterprise/reference/storage-engine-config-options/)
  > instead of the guidance in this section.
  ```

- [ ] **Step 3: `clustering.md` — fix line 614**

  Replace:

  ```markdown
  The upgraded storage engine (the default for new clusters) does not use DataFusion for compaction—refer to the [storage engine configuration reference](/influxdb3/enterprise/performance-preview/configure/) for tuning guidance.
  ```

  With:

  ```markdown
  The upgraded storage engine (the default for new clusters) does not use DataFusion for compaction—refer to the [storage engine configuration reference](/influxdb3/enterprise/reference/storage-engine-config-options/) for tuning guidance.
  ```

- [ ] **Step 4: `load-capture.md` — update the link (lines 24-28)**

  Replace:

  ```markdown
  > [!Note]
  > Load capture requires the [upgraded storage engine](/influxdb3/enterprise/performance-preview/)—the default for new clusters.
  > On clusters that started on 3.10 or earlier, first run the [storage engine upgrade](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree) (`--upgrade-pacha-tree`).
  ```

  With:

  ```markdown
  > [!Note]
  > Load capture requires the [upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)—the default for new clusters.
  > On clusters that started on 3.10 or earlier, first run the [storage engine upgrade](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree) (`--upgrade-pacha-tree`).
  ```

- [ ] **Step 5: `import-data.md` — update the link (lines 17-19)**

  Replace `[upgraded storage engine](/influxdb3/enterprise/performance-preview/)—the`
  with `[upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)—the`.

- [ ] **Step 6: `delete-data.md` — update the link (lines 18-20)**

  Replace `[upgraded storage engine](/influxdb3/enterprise/performance-preview/)—the`
  with `[upgraded storage engine](/influxdb3/enterprise/reference/internals/storage-engine/)—the`.

- [ ] **Step 7: `backup-restore.md` — verify no link change needed**

  This file already links only to `#upgrade-pacha-tree` on `config-options`,
  not to `performance-preview/` — confirm with
  `grep -n "performance-preview" content/shared/influxdb3-admin/backup-restore.md`
  (expect no output). No edit needed here.

- [ ] **Step 8: `upgrade.md` — verify no link change needed**

  Same check: `grep -n "performance-preview" content/shared/influxdb3-admin/upgrade.md`
  (expect no output — it links to `#upgrade-pacha-tree` on config-options,
  not performance-preview). No edit needed here.

- [ ] **Step 9: `glossary.md` — add a related-entries link to the IOx entry**

  Current entry (around line 496-502):

  ```markdown
  ### IOx

  The IOx storage engine (InfluxDB 3 storage engine) is a real-time, columnar
  database optimized for time series data built in Rust on top of
  [Apache Arrow](https://arrow.apache.org/) and
  [DataFusion](https://arrow.apache.org/datafusion/user-guide/introduction.html).
  IOx replaces the [TSM (Time Structured Merge tree)](#tsm-time-structured-merge-tree) storage engine.
  ```

  Add a `Related entries:` line after it (matching the pattern used
  elsewhere in this glossary, for example the `integer` entry a few lines
  above):

  ```markdown
  ### IOx

  The IOx storage engine (InfluxDB 3 storage engine) is a real-time, columnar
  database optimized for time series data built in Rust on top of
  [Apache Arrow](https://arrow.apache.org/) and
  [DataFusion](https://arrow.apache.org/datafusion/user-guide/introduction.html).
  IOx replaces the [TSM (Time Structured Merge tree)](#tsm-time-structured-merge-tree) storage engine.

  Related entries:
  [WAL tail](#wal-tail)

  For {{% product-name %}}-specific detail, see
  [Storage engine](/influxdb3/version/reference/internals/storage-engine/).
  ```

- [ ] **Step 10: Build and verify**

  Run: `npx hugo --quiet`
  Expected: build succeeds.

- [ ] **Step 11: Commit**

  ```bash
  git add content/influxdb3/enterprise/admin/clustering.md \
          content/influxdb3/enterprise/admin/load-capture.md \
          content/influxdb3/enterprise/admin/import-data.md \
          content/influxdb3/enterprise/admin/delete-data.md \
          content/shared/influxdb3-reference/glossary.md
  git commit -m "docs(influxdb3): tighten scattered storage engine callouts"
  ```

***

### Task 9: Mechanical link migration in remaining CLI reference pages

Seven `loadcap/*` CLI reference pages all carry the identical sentence
linking to `/influxdb3/enterprise/performance-preview/`. Single mechanical
find/replace, verified with a grep before and after.

**Files:**

- Modify: `content/influxdb3/enterprise/reference/cli/influxdb3/loadcap/_index.md`

- Modify: `content/influxdb3/enterprise/reference/cli/influxdb3/loadcap/preview.md`

- Modify: `content/influxdb3/enterprise/reference/cli/influxdb3/loadcap/start.md`

- Modify: `content/influxdb3/enterprise/reference/cli/influxdb3/loadcap/delete.md`

- Modify: `content/influxdb3/enterprise/reference/cli/influxdb3/loadcap/download.md`

- Modify: `content/influxdb3/enterprise/reference/cli/influxdb3/loadcap/list.md`

- Modify: `content/influxdb3/enterprise/reference/cli/influxdb3/loadcap/files.md`

- [ ] **Step 1: Confirm the exact match before editing**

  Run:

  ```bash
  grep -rn "Load capture requires the \[upgraded storage engine\](/influxdb3/enterprise/performance-preview/)" \
    content/influxdb3/enterprise/reference/cli/influxdb3/loadcap/
  ```

  Expected: 7 matches, one per file listed above, all identical text:
  `> Load capture requires the [upgraded storage engine](/influxdb3/enterprise/performance-preview/)—the default for new clusters.`

- [ ] **Step 2: Run the replacement**

  ```bash
  grep -rl "/influxdb3/enterprise/performance-preview/)" \
    content/influxdb3/enterprise/reference/cli/influxdb3/loadcap/ \
    | xargs sed -i '' 's#(/influxdb3/enterprise/performance-preview/)#(/influxdb3/enterprise/reference/internals/storage-engine/)#g'
  ```

  (Use `sed -i ''` on macOS; `sed -i` without the empty string argument on
  Linux.)

- [ ] **Step 3: Verify no more matches remain**

  Run: `grep -rn "performance-preview" content/influxdb3/enterprise/reference/cli/influxdb3/loadcap/`
  Expected: no output.

- [ ] **Step 4: Repo-wide sweep for any remaining un-migrated links**

  Run:

  ```bash
  grep -rln "performance-preview" content/ | grep -v "content/influxdb3/enterprise/performance-preview/"
  ```

  This lists any file this plan hasn't already touched that still links to
  the old section. Historical release-notes entries (for example, in
  `content/shared/v3-core-enterprise-release-notes/_index.md`) are expected
  and fine to leave as-is — the Task 4/5/6 aliases redirect them. For any
  *other* file this turns up, update its link the same way as Steps 1-2
  above before proceeding.

- [ ] **Step 5: Build and verify**

  Run: `npx hugo --quiet`
  Expected: build succeeds.

- [ ] **Step 6: Commit**

  ```bash
  git add content/influxdb3/enterprise/reference/cli/influxdb3/loadcap/
  git commit -m "docs(influxdb3): migrate remaining storage engine links"
  ```

***

### Task 10: Retire the `performance-preview/` section

Now that every piece of its content has a new home (Tasks 2, 4, 5, 6, 7) and
every inbound link has been updated (Tasks 8, 9) or is covered by an alias
(Tasks 4, 5, 6), delete the section.

**Files:**

- Delete: `content/influxdb3/enterprise/performance-preview/_index.md`

- Delete: `content/influxdb3/enterprise/performance-preview/configure.md`

- Delete: `content/influxdb3/enterprise/performance-preview/monitor.md`

- [ ] **Step 1: Confirm nothing still links here**

  Run: `grep -rln "performance-preview" content/ | grep -v "aliases:"`

  Expected: no output, or only the aliases lines in the Task 4/5/6 stub
  frontmatter (those are supposed to reference the old path — that's what
  makes the redirect work).

- [ ] **Step 2: Delete the directory**

  ```bash
  git rm -r content/influxdb3/enterprise/performance-preview/
  ```

- [ ] **Step 3: Build and verify**

  Run: `npx hugo --quiet`
  Expected: build succeeds, no broken references.

- [ ] **Step 4: Commit**

  ```bash
  git commit -m "docs(influxdb3): retire performance-preview section"
  ```

***

### Task 11: Full verification pass

- [ ] **Step 1: Hugo build**

  Run: `npx hugo --quiet`
  Expected: succeeds with no warnings about the files this plan touched.

- [ ] **Step 2: Link check**

  ```bash
  link-checker map content/influxdb3/enterprise/reference/internals/storage-engine.md \
    content/influxdb3/core/reference/internals/storage-engine.md \
    content/influxdb3/enterprise/reference/storage-engine-config-options.md \
    content/influxdb3/enterprise/admin/query-system-data/_index.md \
    content/influxdb3/enterprise/admin/performance-tuning.md \
    content/influxdb3/core/admin/performance-tuning.md \
    content/influxdb3/enterprise/admin/clustering.md \
    content/influxdb3/enterprise/admin/load-capture.md \
    content/influxdb3/enterprise/admin/import-data.md \
    content/influxdb3/enterprise/admin/delete-data.md \
    content/influxdb3/enterprise/admin/recover-node.md \
    content/influxdb3/enterprise/reference/cli/influxdb3/stop/node.md \
    | xargs link-checker check
  ```

  Expected: no broken links, no unresolved fragments.
  Also spot-check the three old URLs actually redirect:
  `curl -sI http://localhost:1313/influxdb3/enterprise/performance-preview/`
  (with `npx hugo server` running) should return a redirect or the new
  page's content, not a 404.

- [ ] **Step 3: Code block tests**

  Run: `yarn test:codeblocks:all`
  Expected: all relocated CLI examples (storage-engine.md,
  storage-engine-config-options.md) pass — these are unchanged commands from
  the already-tested `performance-preview/` pages, so no new failures are
  expected, but confirm.

- [ ] **Step 4: Lint**

  Run: `yarn lint`
  Expected: passes (frontmatter, shortcode syntax, heading hierarchy checks
  from `.claude/rules/content-review.md`).

- [ ] **Step 5: Final commit if any fixes were needed**

  If Steps 1-4 required fixes, commit them:

  ```bash
  git add -A
  git commit -m "docs(influxdb3): fix verification issues"
  ```

  (Review `git status` first — never `git add -A` without checking what's
  staged, per this repo's conventions.)
