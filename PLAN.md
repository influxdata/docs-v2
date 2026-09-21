# Telegraf Controller operator documentation plan

Working plan for the `docs/controller-admin` base branch.
This file must be removed (closing commit) before the base branch merges to
master. A required check blocks `PLAN.md` from merging.

## Goals

- Establish **Administer Telegraf Controller** (`/telegraf/controller/admin/`)
  as the home for operator and server-management documentation.
- Ship database management and troubleshooting content first.
  Target: merge to master before Telegraf Controller 1.2 (end of October 2026).
- Stub future operator pages (`draft: true`) so the structure is planned and
  reviewable now, and content can be built out over time.

## Constraints

- **Based on master, not `docs/telegraf-controller-1.2.0`.** Content must
  apply to the released product (v1.1.x). Do not reference unreleased
  features. Known 1.2-only items to avoid: the heartbeat telemetry sweep and
  its `Heartbeat telemetry sweep failed` log message, the
  `agent_heartbeat_stats` table, and the additional API health endpoints.
- **No moves of existing pages in Parcel 1.** Every move is a dedicated
  future parcel with a Hugo alias and an inbound-fragment survey.
- Never stub a page that already exists elsewhere (duplicate nav entries when
  undrafted). Planned moves are recorded here instead.

## Design principles

- Follow the existing nav naming convention (`Manage ...`).
- GitHub alert callouts (`> [!Note]`), `{{% product-name %}}`, never
  "the controller".
- Weights in levels: top-level 13, children 101+, grandchildren 201+.
- Sentence-case headings; definition-list bullets (`**Term**: definition.`);
  no em-dash punctuation.
- Draft stubs carry an HTML `TODO` comment describing the intended content.

## Target nav tree

```
admin/_index.md                Administer Telegraf Controller   weight 13
├── database/_index.md         Manage the database              weight 101
│   ├── back-up-and-restore.md Back up and restore              weight 201
│   └── troubleshoot.md        Troubleshoot                     weight 202
├── monitor.md                 Monitor                (draft)   weight 102
├── networking.md              Networking and ports   (draft)   weight 103
└── run-as-a-service.md        Run as a service       (draft)   weight 104
```

### Planned moves (future parcels)

Each move requires an alias from the old URL and an inbound-fragment survey
before it runs:

- `install/secure-tls.md` → `admin/`
- `install/upgrade.md` → `admin/`
- `high-availability/` → `admin/` (decide whether the whole section moves)
- `audit-logs/` → `admin/`

Authentication (Local/LDAP/OIDC) stays where it is.

## Page sources (upstream)

- **Database pages**: released behavior verified against the
  `telegraf_ui` repo (`libs/heartbeat-napi` WAL configuration) and the
  published install reference (`--database`/`DATABASE_URL`, default
  SQLite data locations, ports).
- **Monitor stub**: heartbeat read-only info/status/log endpoints.
  1.2 adds additional API health endpoints and data; document those when
  1.2 ships (1.2-specific TODO recorded in the stub).
- **Networking stub**: `APP_PORT` 8888, optional `UI_PORT`,
  `HEARTBEAT_PORT` 8000. The heartbeat listener is a separate HTTP server
  with its own security posture.
- **Run as a service stub**: systemd/launchd/Windows service setup; clean
  shutdown ties into corruption prevention in
  `database/troubleshoot.md`.

## URL and alias strategy

- All Parcel 1 pages are new URLs. No aliases needed.
- Future move parcels: Hugo alias from every old URL; fragment checks run
  against built HTML with exact-match unquoted ids.

## Parcel table

Every parcel gets its own branch and merges into `docs/controller-admin`
by PR. The base branch receives no direct commits.

| Parcel  | Branch                           | Scope                                                          | Depends on |
| ------- | -------------------------------- | -------------------------------------------------------------- | ---------- |
| 1       | `docs/controller-admin-database` | PLAN.md, admin scaffold, database section, install cross-links | none       |
| 2+      | TBD                              | Build out monitor, networking, run-as-a-service stubs          | 1          |
| M1–M4   | TBD                              | Moves: secure-tls, upgrade, high-availability, audit-logs      | 1          |
| closing | TBD                              | Convention sweep, verify links/anchors, remove PLAN.md         | all        |

## Conventions log

Decisions accrued during review land here, plus a sweep entry in the
closing parcel for any adopted mid-stream.

- Engine guidance lives on `admin/database/_index.md` ("Choose a
  database"), not on the install page: SQLite is recommended for
  development or light workloads, PostgreSQL for production use cases.
- Decision guidance describes observable consequences (for example, SQLite
  serializes writes, so heavy agent workloads can cause lock contention),
  not internal architecture (for example, which components hold database
  connections).
