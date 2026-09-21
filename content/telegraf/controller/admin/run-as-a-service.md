---
title: Run Telegraf Controller as a service
list_title: Run as a service
description: >
  Run Telegraf Controller as a managed system service with systemd, launchd,
  or the Windows Service Manager.
menu:
  telegraf_controller:
    name: Run as a service
    parent: Administer Telegraf Controller
weight: 104
draft: true
---

Run {{% product-name %}} as a managed system service so it starts on boot,
restarts on failure, and shuts down cleanly.

<!-- TODO: planned content for this page:
  - systemd: a complete example unit file (ExecStart, Restart policy,
    EnvironmentFile for configuration, User/Group), plus enable/start
    commands and where journald puts the logs.
  - launchd (macOS): an example LaunchDaemon plist and load/unload
    commands.
  - Windows: registering the executable as a Windows service.
  - Managing configuration through environment files rather than command
    flags (cross-link /telegraf/controller/reference/config-options/).
  - Clean shutdown: services must stop the process with SIGTERM and allow
    time for it to exit; forced kills risk database corruption
    (cross-link /telegraf/controller/admin/database/troubleshoot/).
-->
