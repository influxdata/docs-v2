---
title: Telegraf Controller release notes
description: >
  Important features, bug fixes, and changes in Telegraf Controller releases.
menu:
  telegraf_controller:
    name: Release notes
    parent: Reference
weight: 101
---

## v0.0.5-beta {date="TBD"}

<!-- placeholder for v0.0.5-beta release notes -->

## v0.0.4-alpha {date="2026-02-05"}

### Features

- Require InfluxData EULA acceptance before starting the server.
- Add plugin support to the Telegraf Builder UI and TOML parser:
  - ActiveMQ (`inputs.activemq`)
  - Vault (`secretstores.vault`)
  - All parsers
  - All serializers
- Add support for custom logs directory.
- Reduce binary size.

### Bug fixes

- Fix question mark position in deletion popup.

## v0.0.3-alpha {date="2026-01-14"}

### Features

- Add linux-arm64 binary support.
- Add build validation for missing plugins.
- Add local file handling for configurations.

## v0.0.2-alpha {date="2026-01-13"}

### Features

- Identify external configurations for Telegraf agents.
- Add SSL support for backend connections.
- Add health check status API endpoint.
- Add `Last-Modified` header to GET TOML API response and remove duplicate
  protocol handling.
- Compile native Rust NAPI server for heartbeat service.

### Bug fixes

- Fix default parsing unit to use seconds.
- Fix command line string generation.

## v0.0.1-alpha {date="2026-01-01"}

_Initial alpha build of Telegraf Controller._
