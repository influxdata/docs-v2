---
title: Troubleshoot Telegraf Controller
description: >
  Find the fix for a Telegraf Controller problem by symptom: startup
  failures, port conflicts, rejected agent heartbeats, TLS errors, and
  database errors.
aliases:
  - /telegraf/controller/install/troubleshoot/
menu:
  telegraf_controller:
    name: Troubleshoot
    parent: Administer Telegraf Controller
weight: 108
related:
  - /telegraf/controller/admin/monitor/
  - /telegraf/controller/reference/config-options/
---

Find the fix for a {{% product-name %}} problem by its symptom.
Symptoms appear in the server log output, in agent logs, or as errors in the
web interface.
For the log messages worth alerting on before they become problems, see
[Monitor {{% product-name %}}](/telegraf/controller/admin/monitor/).

## Find your symptom

- **`address already in use` at startup**: another process holds one of the
  server's ports.
  See [Port already in use](/telegraf/controller/admin/troubleshoot/installation/#port-already-in-use).
- **`Permission denied` when running the binary, or macOS blocks the
  executable**: the file is not executable, or the macOS quarantine
  attribute blocks it.
  See [Permission denied](/telegraf/controller/admin/troubleshoot/installation/#permission-denied-linuxmacos).
- **Browsers or agents cannot connect to a running server**: a firewall
  blocks the server's ports.
  See [Ports are not reachable](/telegraf/controller/admin/troubleshoot/installation/#ports-are-not-reachable).
- **Agent heartbeats return `401 Invalid token`**: the heartbeat service
  cannot validate tokens, often because its token cache cannot load.
  See [Agent heartbeats return 401 Invalid token](/telegraf/controller/admin/troubleshoot/agents/#agent-heartbeats-return-401-invalid-token).
- **The heartbeat service health indicator shows a warning or an error**:
  the indicator message names the problem.
  Token and 401 messages point to
  [Agent heartbeats return 401 Invalid token](/telegraf/controller/admin/troubleshoot/agents/#agent-heartbeats-return-401-invalid-token),
  and database messages point to
  [Troubleshoot the database](/telegraf/controller/admin/troubleshoot/database/).
  For the full list of indicator states, see
  [Heartbeat service health](/telegraf/controller/admin/monitor/#heartbeat-service-health).
- **Agents log `x509: certificate signed by unknown authority`**: agents do
  not trust the server's TLS certificate.
  See [Agents do not trust the server certificate](/telegraf/controller/admin/troubleshoot/agents/#agents-do-not-trust-the-server-certificate).
- **`database is locked`, `database or disk is full`, or `database disk
  image is malformed` in the log**: SQLite lock contention, disk
  exhaustion, or corruption.
  See [Identify the failure type](/telegraf/controller/admin/troubleshoot/database/#identify-the-failure-type).
- **The server cannot connect to PostgreSQL, or logs `error performing TLS
  handshake`**: a connection string, network, or certificate trust problem.
  See [PostgreSQL](/telegraf/controller/admin/troubleshoot/database/#postgresql).
- **License errors**: a missing, expiring, or expired Telegraf Enterprise
  license.
  See [Troubleshoot licensing](/telegraf/controller/telegraf-enterprise/troubleshoot/).

{{< children hlevel="h2" >}}
