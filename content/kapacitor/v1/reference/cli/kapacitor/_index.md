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

| Command                                                                             | Description                                                                                            |
| :---------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| [backup](/kapacitor/v1/reference/cli/kapacitor/backup/)                             | Backup the Kapacitor database.                                                                         |
| [define](/kapacitor/v1/reference/cli/kapacitor/define/)                             | Create/update a task.                                                                                  |
| [define-template](/kapacitor/v1/reference/cli/kapacitor/define-template/)           | Create/update a template.                                                                              |
| [define-topic-handler](/kapacitor/v1/reference/cli/kapacitor/define-topic-handler/) | Create/update an alert handler for a topic.                                                            |
| [delete](/kapacitor/v1/reference/cli/kapacitor/delete/)                             | Delete tasks, templates, recordings, replays, topics or topic-handlers.                                |
| [disable](/kapacitor/v1/reference/cli/kapacitor/disable/)                           | Stop running a task.                                                                                   |
| [enable](/kapacitor/v1/reference/cli/kapacitor/enable/)                             | Enable and start running a task with live data.                                                        |
| [flux](/kapacitor/v1/reference/cli/kapacitor/flux/)                                 | Flux task information and management                                                                   |
| [help](/kapacitor/v1/reference/cli/kapacitor/help/)                                 | Prints help for a command.                                                                             |
| [level](/kapacitor/v1/reference/cli/kapacitor/level/)                               | Sets the logging level on the kapacitord server.                                                       |
| [list](/kapacitor/v1/reference/cli/kapacitor/list/)                                 | List information about tasks, templates, recordings, replays, topics, topic-handlers or service-tests. |
| [logs](/kapacitor/v1/reference/cli/kapacitor/logs/)                                 | Follow arbitrary Kapacitor logs.                                                                       |
| [push](/kapacitor/v1/reference/cli/kapacitor/push/)                                 | Publish a task definition to another Kapacitor instance. Not implemented yet.                          |
| [record](/kapacitor/v1/reference/cli/kapacitor/record/)                             | Record the result of a query or a snapshot of the current stream data.                                 |
| [reload](/kapacitor/v1/reference/cli/kapacitor/reload/)                             | Reload a running task with an updated task definition.                                                 |
| [replay](/kapacitor/v1/reference/cli/kapacitor/replay/)                             | Replay a recording to a task.                                                                          |
| [replay-live](/kapacitor/v1/reference/cli/kapacitor/replay-live/)                   | Replay data against a task without recording it.                                                       |
| [service-tests](/kapacitor/v1/reference/cli/kapacitor/service-tests/)               | Test a service.                                                                                        |
| [show](/kapacitor/v1/reference/cli/kapacitor/show/)                                 | Display detailed information about a task.                                                             |
| [show-template](/kapacitor/v1/reference/cli/kapacitor/show-template/)               | Display detailed information about a template.                                                         |
| [show-topic](/kapacitor/v1/reference/cli/kapacitor/show-topic/)                     | Display detailed information about an alert topic.                                                     |
| [show-topic-handler](/kapacitor/v1/reference/cli/kapacitor/show-topic-handler/)     | Display detailed information about an alert handler for a topic.                                       |
| [stats](/kapacitor/v1/reference/cli/kapacitor/stats/)                               | Display various stats about Kapacitor.                                                                 |
| [vars](/kapacitor/v1/reference/cli/kapacitor/vars/)                                 | Print debug vars in JSON format.                                                                       |
| [version](/kapacitor/v1/reference/cli/kapacitor/version/)                           | Displays the Kapacitor version info.                                                                   |
| [watch](/kapacitor/v1/reference/cli/kapacitor/watch/)                               | Watch logs for a task.                                                                                 |

## Flags

| Flag          | Description                                                                                                                                     |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `-skipVerify` | Disable SSL verification (note, this is insecure). Defaults to the KAPACITOR_UNSAFE_SSL environment variable or false if not set.               |
| `-url`        | URL of the `kapacitord` server (`http(s)://host:port`). Defaults to the KAPACITOR_URL environment variable or http://localhost:9092 if not set. |