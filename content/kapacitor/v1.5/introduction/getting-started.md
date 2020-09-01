---
title: Get started with Kapacitor
weight: 20
menu:
  kapacitor_1_5:
    parent: Introduction
---

Use Kapacitor to import (stream or batch) time series data, and then transform, analyze, and act on the data. To get started using Kapacitor, use Telegraf to collect system metrics on your local machine and store them in InfluxDB. Then, use Kapacitor to process your system data.

- [Overview](#overview)
- [Start InfluxDB and collect Telegraf data](#start-influxdb-and-collect-telegraf-data)
- [Start Kapacitor](#start-kapacitor)
- Kapacitor tasks
    - [Execute a task](#execute-a-task)
    - [Trigger an alert from stream data](#trigger-alerts-from-stream-data)
    - [Example alert on CPU usage](#example-alert-on-cpu-usage)
    - [Gotcha - single versus double quotes](#gotcha-single-versus-double-quotes)
    - [Extending TICKscripts](#extending-tickscripts)
    - [A real world example](#a-real-world-example)
    - [Trigger an alert from batch data](#trigger-alerts-from-batch-data)
    - [Load tasks](#load-tasks-with-kapacitor)

## Overview

Kapacitor tasks define work to do on a set of data using [TICKscript](/kapacitor/v1.5/tick/) syntax. Kapacitor tasks include:

- `stream` tasks. A stream task replicates data written to InfluxDB in Kapacitor. Offloads query overhead and requires Kapacitor to store the data on disk.
- `batch` tasks. A batch task queries and processes data for a specified interval.

To get started, do the following:

1. If you haven't already, [download and install the InfluxData TICK stack (OSS)](/platform/install-and-deploy/install/oss-install).
2. [Start InfluxDB and start Telegraf](#start-influxdb-and-collect-telegraf-data). By default, Telegraf starts sending system metrics to InfluxDB and creates a 'telegraf' database.
3. Start Kapacitor.

> **Note:** Example commands in the following procedures are written for Linux.

## Start InfluxDB and collect Telegraf data

1. Start InfluxDB by running the following command:

    ```bash
    $ sudo systemctl start influxdb
    ```

2. In the Telegraf configuration file (`/etc/telegraf/telegraf.conf`), configure `[[outputs.influxd]]` to specify how to connect to InfluxDB and the destination database.

    ```sh
    [[outputs.influxdb]]
    ## InfluxDB url is required and must be in the following form: http/udp "://" host [ ":" port]
    ## Multiple urls can be specified as part of the same cluster; only ONE url is written to each interval.
    ## InfluxDB url
    urls = ["http://localhost:8086"]

    ## The target database for metrics is required (Telegraf creates if one doesn't exist).
    database = "telegraf"
    ```

3. Run the following command to start Telegraf:

    ```
    $ sudo systemctl start telegraf
    ```

    InfluxDB and Telegraf are now running on localhost.

4. After a minute, run the following command to use the InfluxDB API to query for the Telegraf data:

    ```bash
    $ curl -G 'http://localhost:8086/query?db=telegraf' --data-urlencode 'q=SELECT mean(usage_idle) FROM cpu'
    ```

    Results similar to the following appear:

    ```
    {"results":[{"statement_id":0,"series":[{"name":"cpu","columns":["time","mean"],"values":[["1970-01-01T00:00:00Z",91.82304336748372]]}]}]}
    ```

## Start Kapacitor

1. Run the following command to generate a Kapacitor configuration file:

    ```bash
    kapacitord config > kapacitor.conf
    ```
    By default, the Kapacitor configuration file is saved in `/etc/kapacitor/kapacitor.conf`. If you save the file to another location, specify the location when starting Kapacitor.

    > The Kapacitor configuration is a [TOML](https://github.com/toml-lang/toml) file. Inputs configured for InfluxDB also work for Kapacitor.

2. Start the Kapacitor service:

    ```bash
    $ sudo systemctl start kapacitor
    ```

    Because InfluxDB is running on `http://localhost:8086`, Kapacitor finds it during start up and creates several [subscriptions](/kapacitor/v1.5/administration/subscription-management/) on InfluxDB.
    Subscriptions tell InfluxDB to send data to Kapacitor.

3. (Optional) To view log data, run the following command:

    ```
    $ sudo tail -f -n 128 /var/log/kapacitor/kapacitor.log

    ```

    Kapacitor listens on an HTTP port and posts data to InfluxDB. Now, InfluxDB streams data from Telegraf to Kapacitor.

### Execute a task

- At the beginning of a TICKscript, specify the database and retention policy
that contain data:

    ```js
    dbrp "telegraf"."autogen"

    // ...
    ```

    When Kapacitor receives data from a database and retention policy that matches those
    specified, Kapacitor executes the TICKscript.

    > Kapacitor supports executing tasks based on database and retention policy (no other conditions).

## Trigger alerts from stream data

Triggering an alert is a common Kapacitor use case. The database and retention policy to alert on must be defined.

##### Example alert on CPU usage

1. Copy the following TICKscript into a file called `cpu_alert.tick`:

    ```js
    dbrp "telegraf"."autogen"

    stream
        // Select the CPU measurement from the `telegraf` database.
        |from()
            .measurement('cpu')
        // Triggers a critical alert when the CPU idle usage drops below 70%
        |alert()
            .crit(lambda: int("usage_idle") <  70)
            // Write each alert to a file.
            .log('/tmp/alerts.log')
    ```

2. In the command line, use the `kapacitor` CLI to define the task using the `cpu_alert.tick` TICKscript:

    ```bash
    kapacitor define cpu_alert -tick cpu_alert.tick
    ```

    > If the database and retention policy aren't included in the TICKscript (for example, `dbrp "telegraf"."autogen"`), use the `kapacitor define` command with the `-dbrp` flag followed by <DBNAME>"."<RETENTION_POLICY>" to specify them when adding the task.

3. (Optional) Use the `list` command to verify the alert has been created:

    ```
    $ kapacitor list tasks
    ID        Type      Status    Executing Databases and Retention Policies
    cpu_alert stream    disabled  false     ["telegraf"."autogen"]
    ```

4. (Optional) Use the `show` command to view details about the task:

    ```
    $ kapacitor show cpu_alert
    ID: cpu_alert
    Error:
    Template:
    Type: stream
    Status: disabled
    Executing: false
    ...
    ```

4. To ensure log files and communication channels aren't spammed with alerts, [test the task](#test-the-task).
5. Enable the task to start processing the live data stream:

    ```bash
    kapacitor enable cpu_alert
    ```

    Alerts are written to the log in real time.

6. Run the `show` command to verify the task is receiving data and behaving as expected:

    ```bash
    $ kapacitor show cpu_alert
    |from()
    // Information about the state of the task and any error it may have encountered.
    ID: cpu_alert
    Error:
    Type: stream
    Status: Enabled
    Executing: true
    Created: 04 May 16 21:01 MDT
    Modified: 04 May 16 21:04 MDT
    LastEnabled: 04 May 16 21:03 MDT
    Databases Retention Policies: [""."autogen"]

    // Displays the version of the TICKscript that Kapacitor has stored in its local database.
    TICKscript:
    stream
        // Select just the cpu me
            .measurement('cpu')
        |alert()
            .crit(lambda: "usage_idle" <  70)
            // Whenever we get an alert write it to a file.
            .log('/tmp/alerts.log')

    DOT:
    digraph asdf {
    graph [throughput="0.00 points/s"];

    stream0 [avg_exec_time_ns="0" ];
    stream0 -> from1 [processed="12"];

    from1 [avg_exec_time_ns="0" ];
    from1 -> alert2 [processed="12"];

    alert2 [alerts_triggered="0" avg_exec_time_ns="0" ];
    }
    ```

Returns a [graphviz dot](http://www.graphviz.org) formatted tree that shows the data processing pipeline defined by the TICKscript and key-value associative array entries with statistics about each node and links along an edge to the next node also including associative array statistical information. The *processed* key in the link/edge members indicates the number of data points that have passed along the specified edge of the graph.

In the example above, the `stream0` node (aka the `stream` var from the TICKscript) has sent 12 points to the `from1` node.
The `from1` node has also sent 12 points on to the `alert2` node. Since Telegraf is configured to send `cpu` data, all 12 points match the database/measurement criteria of the `from1` node and are passed on.

    > If necessary, install graphviz on Debian or RedHat using the package provided by the OS provider. The packages offered on the graphviz site are not up-to-date.

    Now that the task is running with live data, here is a quick hack to use 100% of one core to generate some artificial cpu activity:

    ```bash
    while true; do i=0; done
    ```

##### Test the task

Complete the following steps to ensure log files and communication channels aren't spammed with alerts.

1. Record the data stream:

    ```bash
    kapacitor record stream -task cpu_alert -duration 60s
    ```

    If a connection error appears, for example: `getsockopt: connection refused` (Linux) or `connectex: No connection could be made...` (Windows),
    verify the Kapacitor service is running (see [Installing and Starting Kapacitor](/kapacitor/v1.5/introduction/installation/)).
    If Kapacitor is running, check the firewall settings of the host machine and ensure that port `9092` is accessible.
    Also, check messages in `/var/log/kapacitor/kapacitor.log`. If there's an issue with the `http` or other configuration in `/etc/kapacitor/kapacitor.conf`, the issue appears in the log.
    If the Kapacitor service is running on another host machine, set the `KAPACITOR_URL` environment variable in the local shell to the Kapacitor endpoint on the remote machine.

2. Retrieve the returned ID and assign the ID to a bash variable to use later (the actual UUID returned is different):

    ```bash
    rid=cd158f21-02e6-405c-8527-261ae6f26153
    ```

3. Confirm the recording captured some data by running:

    ```bash
    kapacitor list recordings $rid
    ```

    The output should appear like:

    ```
    ID                                      Type    Status    Size      Date
    cd158f21-02e6-405c-8527-261ae6f26153    stream  finished  2.2 kB    04 May 16 11:44 MDT
    ```

    If the size is more than a few bytes, data has been captured.
    If Kapacitor isn't receiving data, check each layer: Telegraf → InfluxDB → Kapacitor.
    Telegraf logs errors if it cannot communicate to InfluxDB.
    InfluxDB logs an error about `connection refused` if it cannot send data to Kapacitor.
    Run the query `SHOW SUBSCRIPTIONS` against InfluxDB to find the endpoint that InfluxDB is using to send data to Kapacitor.

    In the following example, InfluxDB must be running on localhost:8086:

    ```
    $ curl -G 'http://localhost:8086/query?db=telegraf' --data-urlencode 'q=SHOW SUBSCRIPTIONS'

    {"results":[{"statement_id":0,"series":[{"name":"_internal","columns":["retention_policy","name","mode","destinations"],"values":[["monitor","kapacitor-ef3b3f9d-0997-4c0b-b1b6-5d0fb37fe509","ANY",["http://localhost:9092"]]]},{"name":"telegraf","columns":["retention_policy","name","mode","destinations"],"values":[["autogen","kapacitor-ef3b3f9d-0997-4c0b-b1b6-5d0fb37fe509","ANY",["http://localhost:9092"]]]}]}]}
    ```

4. Use `replay` to test the recorded data for a specific task:

    ```bash
    kapacitor replay -recording $rid -task cpu_alert
    ```

    > Use the flag `-real-clock` to set the replay time by deltas between the timestamps. Time is measured on each node by the data points it receives.

5. Review the log for alerts:

    ```bash
    sudo cat /tmp/alerts.log
    ```

    Each JSON line represents one alert, and includes the alert level and data that triggered the alert.

    > If the host machine is busy, it may take awhile to log alerts.

6. (Optional) Modify the task to be really sensitive to ensure the alerts are working.
   In the TICKscript, change the lamda function `.crit(lambda: "usage_idle" < 70)` to `.crit(lambda: "usage_idle" < 100)`, and run the `define` command with just the `TASK_NAME` and `-tick` arguments:

    ```bash
    kapacitor define cpu_alert -tick cpu_alert.tick
    ```
    Every data point received during the recording triggers an alert.

7. Replay the modified task to verify the results.

    ```bash
    kapacitor replay -recording $rid -task cpu_alert
    ```

    Once the `alerts.log` results verify that the task is working, change the `usage_idle` threshold back to a more reasonable level and redefine the task once more using the `define` command as shown in step 6.

### Gotcha - single versus double quotes

Single quotes and double quotes in TICKscripts do very different things:

Note the following example:

```js
var data = stream
    |from()
        .database('telegraf')
        .retentionPolicy('autogen')
        .measurement('cpu')
        // NOTE: Double quotes on server1
        .where(lambda: "host" == "server1")
```

The result of this search will always be empty, because double quotes were used around "server1". This means that Kapacitor will search for a series where the field "host" is equal to the value held in _the field_ "server1". This is probably not what was intended. More likely the intention was to search for a series where tag "host" has _the value_ 'server1', so single quotes should be used. Double quotes denote data fields, single quotes string values.  To match the _value_, the tick script above should look like this:

```js
var data = stream
    |from()
        .database('telegraf')
        .retentionPolicy('autogen')
        .measurement('cpu')
        // NOTE: Single quotes on server1
        .where(lambda: "host" == 'server1')
```

### Extending TICKscripts

The TICKscript below will compute the running mean and compare current values to it.
It will then trigger an alert if the values are more than 3 standard deviations away from the mean.
Replace the `cpu_alert.tick` script with the TICKscript below:

```js
stream
    |from()
        .measurement('cpu')
    |alert()
        // Compare values to running mean and standard deviation
        .crit(lambda: sigma("usage_idle") > 3)
        .log('/tmp/alerts.log')
```

Just like that, a dynamic threshold can be created, and, if cpu usage drops in the day or spikes at night, an alert will be issued.
Try it out.
Use `define` to update the task TICKscript.

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
```

>**Note:** If a task is already enabled, redefining the task with the `define` command automatically reloads (`reload`) the task.
To define a task without reloading it, use `-no-reload`

Now tail the alert log:

```bash
sudo tail -f /tmp/alerts.log
```

There should not be any alerts triggering just yet.
Next, start a while loop to add some load:

```bash
while true; do i=0; done
```

An alert trigger should be written to the log shortly, once enough artificial load has been created.
Leave the loop running for a few minutes.
After canceling the loop, another alert should be issued indicating that cpu usage has again changed.
Using this technique, alerts can be generated for the raising and falling edges of cpu usage, as well as any outliers.

### A real world example

Now that the basics have been covered, here is a more real world example.
Once the metrics from several hosts are streaming to Kapacitor, it is possible to do something like: Aggregate and group
the cpu usage for each service running in each datacenter, and then trigger an alert
based off the 95th percentile.
In addition to just writing the alert to a log, Kapacitor can
integrate with  third party utilities: currently Slack, PagerDuty, HipChat, VictorOps and more are supported. The alert can also be sent by email, be posted to a custom endpoint or can trigger the execution of a custom script.
Custom message formats can also be defined so that alerts have the right context and meaning.
The TICKscript for this would look like the following example.

*Example - TICKscript for stream on multiple service cpus and alert on 95th percentile*
```js
stream
    |from()
        .measurement('cpu')
    // create a new field called 'used' which inverts the idle cpu.
    |eval(lambda: 100.0 - "usage_idle")
        .as('used')
    |groupBy('service', 'datacenter')
    |window()
        .period(1m)
        .every(1m)
    // calculate the 95th percentile of the used cpu.
    |percentile('used', 95.0)
    |eval(lambda: sigma("percentile"))
        .as('sigma')
        .keep('percentile', 'sigma')
    |alert()
        .id('{{ .Name }}/{{ index .Tags "service" }}/{{ index .Tags "datacenter"}}')
        .message('{{ .ID }} is {{ .Level }} cpu-95th:{{ index .Fields "percentile" }}')
        // Compare values to running mean and standard deviation
        .warn(lambda: "sigma" > 2.5)
        .crit(lambda: "sigma" > 3.0)
        .log('/tmp/alerts.log')

        // Post data to custom endpoint
        .post('https://alerthandler.example.com')

        // Execute custom alert handler script
        .exec('/bin/custom_alert_handler.sh')

        // Send alerts to slack
        .slack()
        .channel('#alerts')

        // Sends alerts to PagerDuty
        .pagerDuty()

        // Send alerts to VictorOps
        .victorOps()
        .routingKey('team_rocket')
```

Something so simple as defining an alert can quickly be extended to apply to a much larger scope.
With the above script, an alert will be triggered if any service in any datacenter deviates more than 3
standard deviations away from normal behavior as defined by the historical 95th percentile of cpu usage, and will do so within 1 minute!

For more information on how alerting works, see the [AlertNode](/kapacitor/v1.5/nodes/alert_node/) docs.

## Trigger alerts from batch data

In addition to processing data in streams, Kapacitor can also periodically query InfluxDB and process data in batches.

While triggering an alert based off cpu usage is more suited for the streaming case, the basic idea
of how `batch` tasks work is demonstrated here by following the same use case.

##### Example alert on batch data

This TICKscript does roughly the same thing as the earlier stream task, but as a batch task:

```js
dbrp "telegraf"."autogen"

batch
    |query('''
        SELECT mean(usage_idle)
        FROM "telegraf"."autogen"."cpu"
    ''')
        .period(5m)
        .every(5m)
        .groupBy(time(1m), 'cpu')
    |alert()
        .crit(lambda: "mean" < 70)
        .log('/tmp/batch_alerts.log')
```

1. Copy the script above into the file `batch_cpu_alert.tick`.

2. Define the task:

    ```bash
    kapacitor define batch_cpu_alert -tick batch_cpu_alert.tick
    ```
3. Verify its creation:

    ```bash
    $ kapacitor list tasks
    ID              Type      Status    Executing Databases and Retention Policies
    batch_cpu_alert batch     disabled  false     ["telegraf"."autogen"]
    cpu_alert       stream    enabled   true      ["telegraf"."autogen"]
    ```

 4. Record the result of the query in the task (note, the actual UUID differs):

    ```bash
    kapacitor record batch -task batch_cpu_alert -past 20m
    # Save the id again
    rid=b82d4034-7d5c-4d59-a252-16604f902832
    ```

    This records the last 20 minutes of batches using the query in the `batch_cpu_alert` task.
    In this case, since the `period` is 5 minutes, the last 4 batches are recorded and saved.

5. Replay the batch recording the same way:

    ```bash
    kapacitor replay -recording $rid -task batch_cpu_alert
    ```

6. Check the alert log to make sure alerts were generated as expected.
The `sigma` based alert above can also be adapted for working with batch data.
Play around and get comfortable with updating, testing, and running tasks in Kapacitor.

## Load tasks with Kapacitor

To load a task with Kapacitor, save the TICKscript in a _load_ directory specified in `kapacitor.conf`. TICKscripts must include the database and retention policy declaration `dbrp`.

TICKscripts in the load directory are automatically loaded when Kapacitor starts and do not need to be added with the kapacitor define command.

For more information, see [Load Directory](/kapacitor/v1.5/guides/load_directory/).
