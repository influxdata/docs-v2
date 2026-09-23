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
│   └── back-up-and-restore.md Back up and restore              weight 201
├── secure-tls.md              Secure with TLS                  weight 102
├── high-availability/_index.md High availability               weight 103
│   ├── deploy.md              Deploy a cluster                 weight 201
│   └── load-balancing.md      Configure a load balancer        weight 202
├── monitor.md                 Monitor                          weight 104
├── networking.md              Networking and ports             weight 105
├── run-as-a-service.md        Run as a service                 weight 106
├── audit-logs/_index.md       Audit logs                       weight 107
│   ├── enable-configure.md    Enable and configure             weight 201
│   └── view.md                View audit logs                  weight 202
└── troubleshoot/_index.md     Troubleshoot                     weight 108
    ├── installation.md        Installation and startup         weight 201
    ├── agents.md              Agent heartbeats and tokens      weight 202
    └── database.md            Troubleshoot the database        weight 203
```

Children are ordered by operational impact: database first (the critical
asset), then TLS, high availability, monitor, networking, and audit logs
(Enterprise audience) last.

`run-as-a-service.md` was planned as a stub but dropped in Parcel 2:
service setup for all three platforms already lives inside the install
page's OS tabs. It returns as move parcel M5 (see below).

### Planned moves (future parcels)

Each move requires an alias from the old URL and an inbound-fragment survey
before it runs:

- Done in Parcel 3 (M1, M3, M4): `install/secure-tls.md`,
  `high-availability/` (whole section), and `audit-logs/` (whole section)
  moved into `admin/`. Every old URL has an alias; every internal link was
  rewritten to the new URL (internal links never rely on aliases — aliases
  serve external link sources only).
- M2 (upgrade) was canceled during Parcel 3 review: upgrade documentation
  stays with the install section permanently (it is part of the install
  lifecycle). The admin landing page links to it under "Other
  administration tasks".
- Done in Parcel 4 — `admin/troubleshoot/` section: a symptom-index
  `_index.md`; `admin/database/troubleshoot.md` moved to
  `admin/troubleshoot/database.md` with an internal link rewrite only (the
  URL never shipped on master, so no alias). `install/troubleshoot.md`
  split into `admin/troubleshoot/installation.md` (port conflicts,
  permission errors, unreachable ports) and `admin/troubleshoot/agents.md`
  (heartbeat 401 responses, agent certificate trust); its
  database-connection content merged into the database troubleshooting
  doc. The published `install/troubleshoot/` URL aliases to the new
  troubleshoot index. The old page's "Security considerations" section
  dissolved into the pages that now own each topic: the TLS and firewall
  bullets already live on `admin/secure-tls.md` and `admin/networking.md`,
  the SQLite file-permissions guidance moved to
  `admin/database/_index.md`, and the generic PostgreSQL
  "use strong passwords" bullet was dropped. Licensing troubleshooting
  stays with `telegraf-enterprise/`, linked from the index.
- Done in Parcel 5 (M5): the service-setup content in
  `install/_index.md`'s OS tabs extracted to
  `admin/run-as-a-service.md` (weight 106; audit-logs and troubleshoot
  bumped to 107/108). The install page keeps its URL and every service
  heading, so all published in-page anchor ids survive as one-line
  pointers to the new page. Hardening added with the move: "Before you
  begin" (EULA, owner account, explicit database path for a service
  user), a dedicated system user and environment file in the systemd
  example, `EnvironmentVariables` in the plist, NSSM environment and log
  capture, and a "Shut down cleanly" section linking corruption
  prevention. No aliases needed anywhere (no URL changed). The inbound
  anchor survey found only `admin/monitor.md`, which was retargeted.

Authentication (Local/LDAP/OIDC) stays where it is.

## Page sources (upstream)

- **Database pages**: released behavior verified against the
  `telegraf_ui` repo (`libs/heartbeat-napi` WAL configuration) and the
  published install reference (`--database`/`DATABASE_URL`, default
  SQLite data locations, ports).
- **Monitor page 1.2 follow-up** (TODO comment recorded in the page):
  `feat/769-heartbeat-health` adds authenticated
  `GET /api/heartbeat/health` reporting database connectivity, token cache
  status, and scheduler state; `feat/769-heartbeat-health-fe` adds a
  heartbeat service health indicator to the web interface (in the app
  header as of September 2026, but the location is not final).
  When documenting, note the endpoint answers without a session when the
  `heartbeat` group is listed in `DISABLED_AUTH_ENDPOINTS`.
  Verify everything against the released 1.2 build first.
- **Networking stub**: `APP_PORT` 8888, optional `UI_PORT`,
  `HEARTBEAT_PORT` 8000. The heartbeat listener is a separate HTTP server
  with its own security posture.
- **Run as a service** (move parcel M5): source content is the service
  sections already in `install/_index.md`; hardening additions verified
  against the released install reference (owner bootstrap flags, EULA
  environment variable, default data locations).

## URL and alias strategy

- **Aliases exist for published URLs only**: a URL needs an alias only if
  it exists on master (has been deployed). URLs that only ever existed on
  this unmerged base branch are intermediate states — restructure them
  freely with an internal link rewrite and no alias. Check with
  `git cat-file -e master:content/<path>`.
- All Parcel 1 pages are new URLs. No aliases needed.
- Move parcels: Hugo alias from every master-published old URL; fragment
  checks run against built HTML with exact-match unquoted ids.
- Parcel 3's seven aliases were verified against master (all published).

## Parcel table

Every parcel gets its own branch and merges into `docs/controller-admin`
by PR. The base branch receives no direct commits.

| Parcel  | Branch                               | Scope                                                                                                                                                | Depends on |
| ------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1       | `docs/controller-admin-database`     | PLAN.md, admin scaffold, database section, install cross-links                                                                                       | none       |
| 2       | `docs/controller-admin-stubs`        | Build out networking and monitor pages; drop run-as-a-service stub                                                                                   | 1          |
| 3       | `docs/controller-admin-moves`        | Moves M1, M3, M4: secure-tls, high-availability, audit-logs (aliases + internal link rewrite); M2 upgrade canceled; reorder admin children by impact | 1, 2       |
| 4       | `docs/controller-admin-troubleshoot` | admin/troubleshoot/ section: move database troubleshooting, split install troubleshooting into subject docs                                          | 3          |
| 5       | `docs/controller-admin-service`      | Extract install service content into admin/run-as-a-service, plus hardening additions                                                                | 3, 4       |
| closing | TBD                                  | Convention sweep, verify links/anchors, remove PLAN.md                                                                                               | all        |

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
- Analytics/telemetry disclosure is deferred: the outbound analytics the
  server and web interface can send (Amplitude) is not yet documented
  anywhere in the Controller docs. A TODO comment in `admin/networking.md`
  marks where it belongs. Document it alongside the planned telemetry
  pipeline update, covering destination hosts, what is sent, and how to
  opt out.
- Cross-references end as standalone `See [link].` sentences, never
  colon-joined tails (`...: see [link]`), and list lead-ins are complete
  sentences (adopted from PR review on the monitor page). Closing-parcel
  sweep: `grep -rn ": see" content/telegraf/controller/` on prose.
- Section index pages render children at h2:
  `{{< children hlevel="h2" >}}` (adopted on the database index in
  Parcel 1 and the admin and troubleshoot indexes in Parcel 4
  review). Closing-parcel sweep: check the high-availability and
  audit-logs indexes for bare `{{< children >}}`.
