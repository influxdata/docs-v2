---
title: Set up InfluxDB
seotitle: Run the initial InfluxDB setup process
description: The initial setup process for walks through creating a default organization, user, and bucket.
menu:
 v2_0:
  name: Set up InfluxDB
  parent: Get started
  weight: 2
---

The initial setup process for InfluxDB walks through creating a default organization,
user, and bucket.
The setup process is available in both the InfluxDB user interface (UI) and in
the `influx` command line interface (CLI).

## Start the influxd daemon
In order to setup InfluxDB via the UI or the CLI, first start the `influxd` daemon by running:

```bash
influxd
```

_See the [`influxd` documentation](/v2.0/reference/cli/influxd) for information about
available flags and options._

{{% note %}}
#### InfluxDB "phone-home"
By default, InfluxDB sends telemetry data back to InfluxData.
The [InfluxData telemetry](https://www.influxdata.com/telemetry) page provides
information about what data is collected and how it is used.

Top opt-out of sending telemetry data back to InfluxData, include the
`--reporting-disabled` flag when starting `influxd`.

```bash
influxd --reporting-disabled
```
{{% /note %}}


## Set up InfluxDB through the UI

1. With `influxd` running, visit [localhost:9999](http://localhost:9999).
2. Click **Get Started**

### Set up your initial user

1. Enter a **Username** for your initial user.
2. Enter a **Password** and **Confirm Password** for your user.
3. Enter your initial **Organization Name**.
4. Enter your initial **Bucket Name**.
5. Click **Continue**.

InfluxDB is now initialized with a primary user, organization, and bucket.
You are ready to [collect data](#).


## Set up InfluxDB through the influx CLI
Begin the InfluxDB setup process via the `influx` CLI by running:

```bash
influx setup
```

1. Enter a **primary username**.
2. Enter a **password** for your user.
3. **Confirm your password** by entering it again.
4. Enter a name for your **primary organization**.
5. Enter a name for your **primary bucket**.
6. Enter a **retention period** (in hours) for your primary bucket.
   Enter nothing for an infinite retention period.
7. Confirm the details for your primary user, organization, and bucket.

InfluxDB is now initialized with a primary user, organization, and bucket.
You are ready to [collect data](#).
