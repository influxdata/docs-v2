---
title: Troubleshoot Telegraf
description: >
  Diagnose Telegraf problems: validate configurations with --test, debug
  output issues, read debug logs, profile with pprof, resolve AppArmor
  denials, and understand common errors.
menu:
  telegraf_v1:
    name: Troubleshoot Telegraf
    parent: Administer Telegraf
weight: 105
aliases:
  - /telegraf/v1/administration/troubleshooting/
  - /telegraf/v1/configure_plugins/troubleshoot/
related:
  - /telegraf/v1/administer/monitor/
  - /telegraf/v1/configuration/agent/
  - /telegraf/v1/commands/
---

Use the following techniques to diagnose Telegraf problems:

- [Validate your configuration with `--test`](#validate-your-configuration-with---test)
- [Run all plugins once with `--once`](#run-all-plugins-once-with---once)
- [Add a file output to inspect metrics](#add-a-file-output-to-inspect-metrics)
- [Enable debug logging](#enable-debug-logging)
- [Profile Telegraf with pprof](#profile-telegraf-with-pprof)
- [Resolve AppArmor denials](#resolve-apparmor-denials)
- [Common errors](#common-errors)

## Validate your configuration with `--test`

Run a single collection and print the metrics to standard output:

<!--pytest.mark.skip-->

```bash
telegraf --config telegraf.conf --test
```

Test mode runs inputs, processors, and aggregators, but not outputs, so
nothing is written to your destinations.
Service inputs that wait for pushed data might not output metrics before
Telegraf exits.
Use the `--test-wait <seconds>` flag to give them time to deliver.

## Run all plugins once with `--once`

After testing, run a single complete execution of all configured plugins,
including processors, aggregators, and outputs:

<!--pytest.mark.skip-->

```bash
telegraf --config telegraf.conf --once
```

Unlike `--test`, this writes metrics to your configured outputs.

## Add a file output to inspect metrics

If `--test` shows the expected metrics but data isn't arriving at your
destination, add a [file output](/telegraf/v1/output-plugins/file/) to see
exactly what Telegraf sends:

```toml
[[outputs.file]]
  files = ["stdout"]
```

This helps determine whether the problem is in your output configuration or
the connection to the destination.

## Enable debug logging

Set [`debug = true`](/telegraf/v1/configuration/agent/#debug) in the
`[agent]` table to run Telegraf with debug log messages:

```text
2021-06-28T19:18:00Z I! Starting Telegraf {{< latest-patch >}}
2021-06-28T19:18:00Z I! Loaded inputs: cpu disk diskio mem net processes swap system
2021-06-28T19:18:00Z I! Loaded outputs: influxdb_v3
2021-06-28T19:18:00Z D! [agent] Initializing plugins
2021-06-28T19:18:00Z D! [agent] Connecting outputs
2021-06-28T19:18:00Z D! [agent] Attempting connection to [outputs.influxdb_v3]
2021-06-28T19:18:00Z D! [agent] Successfully connected to outputs.influxdb_v3
2021-06-28T19:18:00Z D! [agent] Starting service inputs
```

For where logs go and how to rotate them, see
[Read Telegraf logs](/telegraf/v1/administer/monitor/#read-telegraf-logs).

## Profile Telegraf with pprof

Telegraf serves Go's standard `net/http/pprof` runtime profiling data.
Profiling is off by default.
Enable it with the `--pprof-addr` option:

<!--pytest.mark.skip-->

```bash
telegraf --config telegraf.conf --pprof-addr localhost:6060
```

To view the available profiles, open `http://localhost:6060/debug/pprof/`
in your browser.

Inspect the heap profile or capture a 30-second CPU profile with the
`go tool pprof` command:

<!--pytest.mark.skip-->

```bash
go tool pprof http://localhost:6060/debug/pprof/heap
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
```

To visualize heap memory, generate an image a few moments after Telegraf
starts and again at later intervals, and attach it to bug reports:

<!--pytest.mark.skip-->

```bash
go tool pprof -png http://localhost:6060/debug/pprof/heap > heap.png
```

## Resolve AppArmor denials

When Telegraf runs under AppArmor, you might see denial messages depending
on the plugins used and the AppArmor profile applied, such as:

```text
type=AVC msg=audit(1588901740.036:2457789): apparmor="DENIED" operation="ptrace" profile="docker-default" pid=9030 comm="telegraf" requested_mask="read" denied_mask="read" peer="unconfined"
```

Telegraf has no control over the AppArmor profiles on your system.
To address a denial, analyze the message for the operation and requested
mask (in this example, `ptrace` with `read`), decide whether allowing it
makes sense for your environment, and adjust your profile.
Expect possible additional denials after each change.

For AppArmor profile syntax, see the `apparmor.d` man page or the
[AppArmor wiki](https://gitlab.com/apparmor/apparmor/-/wikis/home).

## Common errors

### Context deadline exceeded (Client.Timeout while awaiting headers)

A generic error from Go's HTTP client, usually caused by a temporary
network, DNS, proxy, or firewall issue.
The condition is normally short-lived and Telegraf recovers without data
loss.

### No such host errors for names other programs resolve

Go uses a pure Go DNS resolver by default, which behaves differently than
the C library resolver.
To switch to the cgo resolver, set the `GODEBUG` environment variable:

<!--pytest.mark.skip-->

```bash
export GODEBUG=netdns=cgo
```

When running as a service, add the variable to `/etc/default/telegraf`.

### Windows service fails to start with error 1067

The service was installed with a relative configuration path.
Reinstall the service with the absolute path of the configuration file.
See
[Run Telegraf as a service](/telegraf/v1/administer/run-as-service/#windows).
