---
title: Install Kapacitor
Description: Install, start, and configure Kapacitor on your operating system of choice.
weight: 10
menu:
  kapacitor_1_5:
    parent: Introduction
---

This page provides directions for installing, starting, and configuring Kapacitor.

## Requirements

Installation of the InfluxDB package may require `root` or administrator privileges in order to complete successfully.

### Networking

Kapacitor listens on TCP port `9092` for all API and write
calls.

Kapacitor may also bind to randomized UDP ports
for handling of InfluxDB data via subscriptions.

## Installation

Kapacitor has two binaries:

* kapacitor: a CLI program for calling the Kapacitor API.
* kapacitord: the Kapacitor server daemon.

You can download the binaries directly from the
[downloads](https://portal.influxdata.com/downloads) page.

> **Note:** Windows support is experimental.

### Starting the Kapacitor service

For packaged installations, please see the respective sections below
for your operating system. For non-packaged installations (tarballs or
from source), you will need to start the Kapacitor application
manually by running:

```
./kapacitord -config <PATH TO CONFIGURATION>
```

#### macOS (using Homebrew)

To have `launchd` start Kapacitor at login:

```
ln -sfv /usr/local/opt/kapacitor/*.plist ~/Library/LaunchAgents
```

Then to load Kapacitor now:

```
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.kapacitor.plist
```

Or, if you don't want/need `lanchctl`, you can just run:

```
kapacitord -config /usr/local/etc/kapacitor.conf
```

#### Linux - SysV or Upstart systems

To start the Kapacitor service, run:

```
sudo service kapacitor start
```

#### Linux - systemd systems

To start the Kapacitor service, run:

```
sudo systemctl start kapacitor
```

## Configuration

An example configuration file can be found [here](https://github.com/influxdb/kapacitor/blob/master/etc/kapacitor/kapacitor.conf).

Kapacitor can also provide an example configuration for you using this command:

```bash
kapacitord config
```

To generate a new configuration file, run:
```
kapacitord config > kapacitor.generated.conf
```

### Shared secret

If using [Kapacitor v1.5.3](/kapacitor/v1.5/about_the_project/releasenotes-changelog/#v1-5-3-2019-06-18)
or newer and InfluxDB with [authentication enabled](/influxdb/v1.7/administration/authentication_and_authorization/),
set the `[http].shared-secret` option in your Kapacitor configuration file to the
shared secret of your InfluxDB instances.

```toml
# ...
[http]
  # ...
  shared-secret = "youramazingsharedsecret"
```

If not set, set to an empty string, or does not match InfluxDB's shared-secret,
the integration with InfluxDB will fail and Kapacitor will not start.

### Time zone

To display alerts notifications using a preferred time zone, either change the time zone
of the host on which Kapacitor is running or set the Kapacitor process' `TZ` environment variable.

#### systemd

Add the environment variable using `systemctl edit kapacitor`:

```
[Service]
Environment="TZ=Asia/Shanghai"
```

#### docker

Set the environment variable using the `-e` flag when starting the container (`-e TZ=Asia/Shanghai`)
or in your `docker-compose.yml`.
