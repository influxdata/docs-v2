---
title: Manage Telegraf agents at scale
description: >
  Use Telegraf Controller to centrally manage configurations, monitor agent
  health, and organize a fleet of Telegraf agents.
menu:
  telegraf_v1:
    name: Manage agents at scale
    parent: Administer Telegraf
weight: 104
related:
  - /telegraf/controller/
  - /telegraf/v1/enterprise/
  - /telegraf/v1/administer/monitor/
  - /telegraf/v1/configuration/labels-selectors/
---

Managing more than a handful of Telegraf agents by editing configuration
files on each host doesn't scale well.
[Telegraf Controller](/telegraf/controller/) is a centralized application
for managing Telegraf deployments across your infrastructure.

Telegraf Controller provides:

- **Centralized configuration management**: store configurations in one
  place and serve them to agents over a URL.
  Agents load them with the `--config` flag; see
  [Load configuration from a URL](/telegraf/v1/configuration/file/#load-configuration-from-a-url).
- **Agent status and monitoring**: agents running the
  [heartbeat output plugin](/telegraf/v1/output-plugins/heartbeat/) report
  health and a self-evaluated status back to Telegraf Controller; see
  [Monitor Telegraf](/telegraf/v1/administer/monitor/).
- **Labels and organization**: group and find agents and configurations
  across environments.

Telegraf Controller has a free tier, and additional capabilities are
available with [Telegraf Enterprise](/telegraf/v1/enterprise/), including
higher limits, audit logging, and LDAP and OIDC authentication.

To get started, see the
[Telegraf Controller documentation](/telegraf/controller/).
