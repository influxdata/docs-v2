---
title: Troubleshoot systemd errors
list_title: systemd permission errors
description: Troubleshoot errors with InfluxDB and systemd permissions
menu:
  enterprise_influxdb_1_9:
    name: systemd errors
    parent: Troubleshoot
    weight: 1
---

When running InfluxDB using systemd (Ubuntu, Debian, CentOS), you might encounter errors in the InfluxDB logs (via `journalctl -u influxdb`) like:

- `error msg="Unable to open series file"`
- `run: open server: open tsdb store: mkdir /var/lib/influxdb/data/_internal/_series/00: permission denied`

When InfluxDB is installed with systemd, an `influxdb` user and group is automatically created.
If the user runs an `influxd` process directly from their login shell, it can generate new series files not accessible by the `influxdb` user.
In this case, when systemd starts the InfluxDB service (via `sudo systemctl start influxdb`),
the InfluxDB process will exit because it cannot access the leftover files owned by the `root` user.

To resolve this issue, set all files in the InfluxDB directories to be owned by the `influxdb` user and group.
Run the following command:

```
sudo chown -R influxdb:influxdb /var/lib/influxdb/*
```

Alternatively, if the data is not important, reset the database by removing all files:

```
sudo rm -rf /var/lib/influxdb/
```
