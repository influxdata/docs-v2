---
title: kapacitor
description: >
  The `kapacitor` CLI interacts with and manages the Kapacitor server.
menu:
  kapacitor_v1:
    name: kapacitor
    parent: Command line tools
weight: 201
---

The `kapacitor` CLI interacts with and manages the Kapacitor server.

## Usage

```sh
kapacitor [command] [flags] [args]
```

## Commands

| Command                                                                             | Description                                            |
| :---------------------------------------------------------------------------------- | :----------------------------------------------------- |
| [backup](/kapacitor/v1/reference/cli/kapacitor/backup/)                             | Backup the Kapacitor database                          |
| [define](/kapacitor/v1/reference/cli/kapacitor/define/)                             | Create or update a task                                |
| [define-template](/kapacitor/v1/reference/cli/kapacitor/define-template/)           | Create or update a template                            |
| [define-topic-handler](/kapacitor/v1/reference/cli/kapacitor/define-topic-handler/) | Create or update an alert handler for a topic          |
| [delete](/kapacitor/v1/reference/cli/kapacitor/delete/)                             | Delete Kapacitor resources                             |
| [disable](/kapacitor/v1/reference/cli/kapacitor/disable/)                           | Disable a task                                         |
| [enable](/kapacitor/v1/reference/cli/kapacitor/enable/)                             | Enable a task                                          |
| [flux](/kapacitor/v1/reference/cli/kapacitor/flux/)                                 | Manage Kapacitor Flux tasks                            |
| [help](/kapacitor/v1/reference/cli/kapacitor/help/)                                 | Print help for a command                               |
| [level](/kapacitor/v1/reference/cli/kapacitor/level/)                               | Set the logging level on the `kapacitord` server       |
| [list](/kapacitor/v1/reference/cli/kapacitor/list/)                                 | List information about Kapacitor resources             |
| [logs](/kapacitor/v1/reference/cli/kapacitor/logs/)                                 | Output Kapacitor logs                                  |
| [record](/kapacitor/v1/reference/cli/kapacitor/record/)                             | Record the results of a task or query                  |
| [reload](/kapacitor/v1/reference/cli/kapacitor/reload/)                             | Reload a task with an updated task definition          |
| [replay](/kapacitor/v1/reference/cli/kapacitor/replay/)                             | Replay a recording to a task                           |
| [replay-live](/kapacitor/v1/reference/cli/kapacitor/replay-live/)                   | Replay data to a task without recording it             |
| [service-tests](/kapacitor/v1/reference/cli/kapacitor/service-tests/)               | Run service tests                                      |
| [show](/kapacitor/v1/reference/cli/kapacitor/show/)                                 | Display information about a task                       |
| [show-template](/kapacitor/v1/reference/cli/kapacitor/show-template/)               | Display information about a template                   |
| [show-topic](/kapacitor/v1/reference/cli/kapacitor/show-topic/)                     | Display information about an alert topic               |
| [show-topic-handler](/kapacitor/v1/reference/cli/kapacitor/show-topic-handler/)     | Display information about an alert handler for a topic |
| [stats](/kapacitor/v1/reference/cli/kapacitor/stats/)                               | Display Kapacitor server statistics                    |
| [vars](/kapacitor/v1/reference/cli/kapacitor/vars/)                                 | Print Kapacitor debug vars in JSON format              |
| [version](/kapacitor/v1/reference/cli/kapacitor/version/)                           | Display the Kapacitor version                          |
| [watch](/kapacitor/v1/reference/cli/kapacitor/watch/)                               | Watch logs for a task                                  |

## Flags {#kapacitor-flags}

| Flag          | Description                                                           | Environment variable   |
| :------------ | :-------------------------------------------------------------------- | :--------------------- |
| `-skipVerify` | Disable SSL or TLS verification                                       | `KAPACITOR_UNSAFE_SSL` |
| `-url`        | URL of the `kapacitord` server _(default is `http://localhost:9092`)_ | `KAPACITOR_URL`        |
