---
title: Monitor Telegraf Controller
list_title: Monitor
description: >
  Monitor the health of a Telegraf Controller server using its health
  endpoints, the heartbeat service health indicator and API, and its log
  output.
menu:
  telegraf_controller:
    name: Monitor
    parent: Administer Telegraf Controller
weight: 104
related:
  - /telegraf/controller/admin/high-availability/load-balancing/
  - /telegraf/controller/admin/troubleshoot/database/
  - /telegraf/controller/admin/troubleshoot/agents/
---

Monitor a {{% product-name %}} server with its built-in health endpoints and
its log output.

- [Health endpoints](#health-endpoints)
- [Heartbeat service health](#heartbeat-service-health)
- [Server logs](#server-logs)
- [What to watch for](#what-to-watch-for)

For monitoring the agents themselves, including the fleet summary and
per-agent heartbeat data, see
[Monitor agents](/telegraf/controller/agents/monitor/).

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

## Heartbeat service health

{{% product-name %}} reports the health of its embedded heartbeat service,
the listener that receives agent heartbeats, in the web interface and
through an authenticated API endpoint.
Unlike the [health endpoint probes](#health-endpoints), these report why
the service is unhealthy, not only whether it responds.

### Health indicator in the web interface

The heartbeat service health indicator appears near the bottom of the left
navigation.

<!-- TODO: screenshot of the heartbeat service health indicator near the
  bottom of the left navigation, showing the healthy state. Save to
  /static/img/telegraf/controller-admin-monitor-heartbeat-health-indicator.png
  and replace this comment with:
  {{< img-hd src="/img/telegraf/controller-admin-monitor-heartbeat-health-indicator.png" alt="Heartbeat service health indicator in the left navigation" />}} -->

| Status  | Indicator message                                                                                                 | Action                                                                                                                                                     |
| :------ | :---------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ok      | Heartbeat service is healthy.                                                                                      | None.                                                                                                                                                        |
| Unknown | Heartbeat service has not reached the database yet.                                                                | If the state persists after startup, check the server log for database errors.                                                                               |
| Warning | Agent status check failed. Agent statuses may be outdated.                                                         | Check the server log for the underlying error.                                                                                                               |
| Warning | No tokens loaded, so every agent heartbeat is rejected. Create an API token with the heartbeat:write permission.   | [Create a token](/telegraf/controller/tokens/create/).                                                                                                       |
| Error   | Heartbeat service is not running.                                                                                  | Check the server log, then restart {{% product-name %}}.                                                                                                     |
| Error   | Heartbeat service cannot connect to the database. Agent heartbeats are rejected and agent statuses are not updated. | See [Troubleshoot the database](/telegraf/controller/admin/troubleshoot/database/).                                                                          |
| Error   | Token cache failed to load. Agent heartbeats are rejected with 401.                                                | See [Agent heartbeats return 401 Invalid token](/telegraf/controller/admin/troubleshoot/agents/#agent-heartbeats-return-401-invalid-token).                  |

### Query heartbeat service health with the API

`GET /api/heartbeat/health` returns the detail behind the indicator.
The endpoint requires an API token with **read** permission on the
**Heartbeat** API.

<!--pytest.mark.skip-->
```bash { placeholders="API_TOKEN" }
curl "https://telegraf-controller.example.com/api/heartbeat/health" \
  -H "Authorization: Bearer API_TOKEN"
```

The response reports:

- **Service**: whether the heartbeat service is running (`running`) and
  whether heartbeat authentication is enabled (`authEnabled`).
- **Database**: connectivity (`dbConnected`, `null` until the service
  first reaches the database), the last database error, and when it
  occurred.
- **Token cache**: how many API tokens are loaded, the last refresh and
  last successful refresh times, and the last refresh error.
- **Scheduler**: whether the agent status check scheduler is active, its
  last run and last successful run times, and the last run error.

> [!Note]
> If the `heartbeat` endpoint group is listed in
> [`disable-auth-endpoints`](/telegraf/controller/reference/config-options/#disable-auth-endpoints),
> this endpoint answers without authentication and its response includes
> database error text.
> Make sure your firewall restricts who can reach the API port.
> See
> [Expose the right ports](/telegraf/controller/admin/networking/#expose-the-right-ports).

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
  [LaunchDaemon example](/telegraf/controller/admin/run-as-a-service/#macos-launchdaemon)
  uses `/var/log/telegraf-controller.log`.
- **Windows service**: configure your service manager to capture console
  output to files.
  See
  [Run {{% product-name %}} as a service](/telegraf/controller/admin/run-as-a-service/#windows-nssm).

## What to watch for

Alert on the following log messages.
Each entry links to the page that explains how to fix the problem.

- **Database errors**, such as `database is locked`,
  `database or disk is full`, or `database disk image is malformed`.
  See [Troubleshoot the database](/telegraf/controller/admin/troubleshoot/database/).
- **Rejected agent heartbeats**, which return HTTP `401` with an invalid token error.
  See [Agent heartbeats return 401 Invalid token](/telegraf/controller/admin/troubleshoot/agents/#agent-heartbeats-return-401-invalid-token).
- **License errors**.
  See [Troubleshoot licensing](/telegraf/controller/telegraf-enterprise/troubleshoot/).

