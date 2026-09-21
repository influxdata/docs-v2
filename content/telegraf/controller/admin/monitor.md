---
title: Monitor Telegraf Controller
list_title: Monitor
description: >
  Monitor the health of a Telegraf Controller server using its
  unauthenticated health endpoints and its log output.
menu:
  telegraf_controller:
    name: Monitor
    parent: Administer Telegraf Controller
weight: 104
related:
  - /telegraf/controller/admin/high-availability/load-balancing/
  - /telegraf/controller/admin/database/troubleshoot/
  - /telegraf/controller/install/troubleshoot/
---

Monitor a {{% product-name %}} server with its built-in health endpoints and
its log output.

- [Health endpoints](#health-endpoints)
- [Server logs](#server-logs)
- [What to watch for](#what-to-watch-for)

## Health endpoints

{{% product-name %}} exposes unauthenticated HTTP health endpoints on the
API port and on the heartbeat port.
`GET /health/live` and `GET /health/ready` on the API port are the
general-purpose liveness and readiness probes, and the heartbeat service
answers `GET /health` on its own port.
`GET /health/leader` identifies the leader in a
[high-availability cluster](/telegraf/controller/admin/high-availability/).

For the full endpoint reference, including status codes, response bodies,
and how to choose a probe, see
[Health endpoints](/telegraf/controller/admin/high-availability/load-balancing/#health-endpoints).
The endpoints are documented with load balancers in mind, but any monitoring
system can poll them.

## Server logs

{{% product-name %}} writes log output to the console (standard output and
standard error).
Where that output ends up depends on how you run the server:

- **Interactive terminal**: log output appears in the terminal.
- **systemd**: the journal captures console output.
  Read it with `journalctl -u telegraf-controller`.
- **LaunchDaemon (macOS)**: output goes to the file paths configured in the
  service plist.
  The
  [install example](/telegraf/controller/install/#install-as-a-launchdaemon)
  uses `/var/log/telegraf-controller.log`.
- **Windows service**: configure your service manager to capture console
  output to files.
  See
  [Install as a Windows Service](/telegraf/controller/install/#install-as-a-windows-service).

## What to watch for

Alert on the following log messages.
Each entry links to the page that explains how to fix the problem.

- **Database errors**, such as `database is locked`,
  `database or disk is full`, or `database disk image is malformed`.
  See [Troubleshoot the database](/telegraf/controller/admin/database/troubleshoot/).
- **Rejected agent heartbeats**, which return HTTP `401` with an invalid token error.
  See [Agent heartbeats return 401 Invalid token](/telegraf/controller/install/troubleshoot/#agent-heartbeats-return-401-invalid-token).
- **License errors**.
  See [Troubleshoot licensing](/telegraf/controller/telegraf-enterprise/troubleshoot/).

<!-- TODO (1.2): document the heartbeat service health additions when they
  ship:
  - GET /api/heartbeat/health (authenticated): heartbeat service health,
    including database connectivity, token cache status, and scheduler
    state.
  - A heartbeat service health indicator in the web interface. Its UI
    location is not final; confirm where it landed before documenting.
  Verify both against the released build. Details in PLAN.md. -->
