---
title: kapacitor replay-live
description: >
  The `kapacitor replay-live` command and its subcommands replay data to a task
  without saving a recording.
menu:
  kapacitor_v1:
    name: kapacitor replay-live
    parent: kapacitor
weight: 301
---

The `kapacitor replay-live` command and its subcommands replay data to a task
without saving a recording.
The command is a hybrid of the `kapacitor record batch|query` and
`kapacitor replay` commands.

## Usage

```sh
kapacitor replay-live [subcommand] [flags]
```

## Subcommands

| Subcommand                                                          | Description                 |
| :------------------------------------------------------------------ | :-------------------------- |
| [batch](/kapacitor/v1/reference/cli/kapacitor/replay-live/batch/)   | Replay data to a batch task |
| [stream](/kapacitor/v1/reference/cli/kapacitor/replay-live/stream/) | Replay data to stream task  |
