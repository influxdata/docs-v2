---
title: Manage InfluxDB logs
description: >
  Learn how to configure, manage, and process your InfluxDB logs.
menu:
  influxdb_2_7:
    name: Manage logs
    parent: Administer InfluxDB
weight: 10
---

Learn how to configure, manage, and process your InfluxDB logs:

- [Configure your InfluxDB log location](#configure-your-influxdb-log-location)
- [Configure your log level](#configure-your-log-level)
- [Enable the Flux query log](#enable-the-flux-query-log)
- [Use external tools to manage and process logs](#use-external-tools-to-manage-and-process-logs)
- [Log formats](#log-formats)

## Configure your InfluxDB log location

By default, InfluxDB outputs all logs to **stdout**. To view InfluxDB logs,
view the output of the [`influxd`](/influxdb/v2.7/reference/cli/influxd/) process.

- [Write logs to a file](#write-logs-to-a-file)
- [Logs when running InfluxDB as a service](#logs-when-running-influxdb-as-a-service)

### Write logs to a file

To write InfluxDB logs to a file, redirect **stdout** to a file when starting
the InfluxDB service ([`influxd`](/influxdb/v2.7/reference/cli/influxd/)).

```sh
influxd 1> /path/to/influxdb.log
```

{{% note %}}
When logging to a file, InfluxDB uses the [logfmt](#logfmt) format.
{{% /note %}}

### Logs when running InfluxDB as a service

If you use a service manager to run InfluxDB, the service manager determines the location of logs.

{{< tabs-wrapper >}}
{{% tabs %}}
[systemd](#)
[sysvinit](#)
{{% /tabs %}}
<!------------------------------- BEGIN systemd ------------------------------->
{{% tab-content %}}

Most Linux systems direct logs to the `systemd` journal.
To access these logs, use the following command:

```sh
sudo journalctl -u influxdb.service
```

For more information, see the [journald.conf documentation](https://www.freedesktop.org/software/systemd/man/journald.conf.html).

{{% /tab-content %}}
<!-------------------------------- END systemd -------------------------------->
<!------------------------------- BEGIN sysvinit ------------------------------>
{{% tab-content %}}

When InfluxDB is run as a service, **stdout** is discarded by default (sent to `/dev/null`).
To write logs to a file:

1.  Open the InfluxDB startup script (`/etc/default/influxdb`) in a text editor.
2.  Set the `STDOUT` environment variable to the path where you want to store
    the InfluxDB logs. For example:

    ```conf
    STDOUT=/var/log/influxdb/influxd.log
    ```

3.  Save the changes to the startup script.
4.  Restart the InfluxDB service to apply the changes.

    ```sh
    service influxdb restart
    ```

{{% /tab-content %}}
<!-------------------------------- END sysvinit ------------------------------->
{{< /tabs-wrapper >}}

## Configure your log level

Use the [`log-level` InfluxDB configuration option](/influxdb/v2.7/reference/config-options/#log-level)
to specify the log levels the InfluxDB service outputs.
InfluxDB supports the following log levels:

- **debug**: Output logs with debug, info, and error log levels.
- **info**: _(Default)_ Output logs with info and error log levels.
- **error**: Output logs with the error log level only.

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[influxd flag](#)
[Environment variable](#)
[InfluxDB configuration file](#)
{{% /tabs %}}

{{% tab-content %}}
```sh
influxd --log-level=info
```
{{% /tab-content %}}

{{% tab-content %}}
```sh
export INFLUXD_LOG_LEVEL=info
```
{{% /tab-content %}}

{{% tab-content %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
log-level: info
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
log-level = "info"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "log-level": "info"
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /tab-content %}}

{{< /tabs-wrapper >}}

_For information about configuring InfluxDB, see [InfluxDB configuration options](/influxdb/v2.7/reference/config-options/)._

## Enable the Flux query log

Use the [`flux-log-enabled` configuration option](/influxdb/v2.7/reference/config-options/#flux-log-enabled)
to enable Flux query logging. InfluxDB outputs Flux query logs to **stdout**
with all other InfluxDB logs.

{{< tabs-wrapper >}}
{{% tabs "small" %}}
[influxd flag](#)
[Environment variable](#)
[InfluxDB configuration file](#)
{{% /tabs %}}

{{% tab-content %}}
```sh
influxd --flux-log-enabled
```
{{% /tab-content %}}

{{% tab-content %}}
```sh
export INFLUXD_FLUX_LOG_ENABLED=true
```
{{% /tab-content %}}

{{% tab-content %}}

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[YAML](#)
[TOML](#)
[JSON](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```yml
flux-log-enabled: true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```toml
flux-log-enabled = true
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```json
{
  "flux-log-enabled": true
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /tab-content %}}

{{< /tabs-wrapper >}}

_For information about configuring InfluxDB, see [InfluxDB configuration options](/influxdb/v2.7/reference/config-options/)._


## Use external tools to manage and process logs

Use the following popular tools to manage and process InfluxDB logs:

### logrotate

[logrotate](https://github.com/logrotate/logrotate) simplifies the
administration of log files and provides automatic rotation compression, removal
and mailing of log files. Logrotate can be set to handle a log file hourly,
daily, weekly, monthly or when the log file gets to a certain size.

### hutils

[hutils](https://blog.heroku.com/hutils-explore-your-structured-data-logs) is a
collection of command line utilities for working with logs with [logfmt](#logfmt)
encoding, including:

- **lcut**: Extracts values from a logfmt trace based on a specified field name.
- **lfmt**: Reformats and highlights key sections of logfmt lines.
- **ltap**: Accesses messages from log providers in a consistent way to allow
  easy parsing by other utilities that operate on logfmt traces.
- **lviz**: Visualizes logfmt output by building a tree out of a dataset
  combining common sets of key-value pairs into shared parent nodes.

### lnav (Log File Navigator)

[lnav (Log File Navigator)](http://lnav.org/) is an advanced log file viewer useful for watching
and analyzing log files from a terminal.
The lnav viewer provides a single log view, automatic log format detection,
filtering, timeline view, pretty-print view, and querying logs using SQL.


## Log formats

InfluxDB outputs logs in one of two formats depending on the location of where
logs are output.

- [Console/TTY](#consoletty)
- [logfmt](#logfmt)

### Console/TTY

**When logging to a terminal or other TTY devices**, InfluxDB uses a console-friendly format.

##### Example console/TTY format
```sh
2022-09-29T21:58:29.936355Z	info	Welcome to InfluxDB	{"log_id": "0dEoz3C0000", "version": "dev", "commit": "663d43d210", "build_date": "2022-09-29T21:58:29Z", "log_level": "info"}
2022-09-29T21:58:29.977671Z	info	Resources opened	{"log_id": "0dEoz3C0000", "service": "bolt", "path": "/Users/exampleuser/.influxdbv2/influxd.bolt"}
2022-09-29T21:58:29.977891Z	info	Resources opened	{"log_id": "0dEoz3C0000", "service": "sqlite", "path": "/Users/exampleuser/.influxdbv2/influxd.sqlite"}
2022-09-29T21:58:30.059709Z	info	Checking InfluxDB metadata for prior version.	{"log_id": "0dEoz3C0000", "bolt_path": "/Users/exampleuser/.influxdbv2/influxd.bolt"}
```

### logfmt

**When logging to a file**, InfluxDB uses **logfmt**, a machine-readable
structured log format that provides simpler integrations with external tools like
[Splunk](https://www.splunk.com/), [Papertrail](https://www.papertrail.com/),
[Elasticsearch](https://www.elastic.co/), and other third party tools.

##### Example logfmt format
```sh
ts=2022-09-29T16:54:16.021427Z lvl=info msg="Welcome to InfluxDB" log_id=0dEYZvqG000 version=dev commit=663d43d210 build_date=2022-09-29T16:54:15Z log_level=info
ts=2022-09-29T16:54:16.062239Z lvl=info msg="Resources opened" log_id=0dEYZvqG000 service=bolt path=/Users/exampleuser/.influxdbv2/influxd.bolt
ts=2022-09-29T16:54:16.062457Z lvl=info msg="Resources opened" log_id=0dEYZvqG000 service=sqlite path=/Users/exampleuser/.influxdbv2/influxd.sqlite
ts=2022-09-29T16:54:16.144430Z lvl=info msg="Checking InfluxDB metadata for prior version." log_id=0dEYZvqG000 bolt_path=/Users/exampleuser/.influxdbv2/influxd.bolt
```
