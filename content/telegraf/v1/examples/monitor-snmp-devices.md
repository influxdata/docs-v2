---
title: Monitor SNMP devices
description: >
  Use the Telegraf snmp input plugin to poll network devices for system and
  interface metrics and write them to InfluxDB 3.
menu:
  telegraf_v1:
    name: Monitor SNMP devices
    parent: Configuration examples
weight: 109
related:
  - /telegraf/v1/input-plugins/snmp/
  - /telegraf/v1/configuration/secrets/
---

Poll network devices, such as switches, routers, and firewalls, for system
and per-interface metrics over SNMP, and write them to InfluxDB 3.

## Configuration

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[inputs.snmp]]
  ## Devices to poll.
  agents = ["udp://switch1.example.com:161", "udp://switch2.example.com:161"]

  ## SNMP version and community string.
  version = 2
  community = "public"

  ## Use the "source" tag for the device address, consistent with
  ## other plugins.
  agent_host_tag = "source"

  ## Device-level values collected once per poll.
  [[inputs.snmp.field]]
    oid = "RFC1213-MIB::sysUpTime.0"
    name = "uptime"

  [[inputs.snmp.field]]
    oid = "RFC1213-MIB::sysName.0"
    name = "sysName"
    is_tag = true

  ## Per-interface values collected from the interfaces table.
  [[inputs.snmp.table]]
    oid = "IF-MIB::ifTable"
    name = "interface"
    inherit_tags = ["sysName"]

    ## Tag rows by interface name.
    [[inputs.snmp.table.field]]
      oid = "IF-MIB::ifDescr"
      name = "ifDescr"
      is_tag = true

[[outputs.influxdb_v3]]
  urls = ["http://localhost:8181"]
  token = "AUTH_TOKEN"
  database = "DATABASE_NAME"
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your InfluxDB authorization token
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the database to write to

> [!Important]
> Name-based OIDs like `IF-MIB::ifTable` require MIB files, which Telegraf
> looks for in `/usr/share/snmp/mibs` by default.
> On Debian and Ubuntu, install them with
> `sudo apt install snmp-mibs-downloader`.
> Without MIB files, use numeric OIDs instead, for example
> `oid = ".1.3.6.1.2.1.1.3.0"` for `sysUpTime`.

## How it works

- **`agents`** lists the devices to poll.
  One plugin instance polls every agent with the same credentials and
  field definitions; metrics carry a `source` tag identifying the device.
- **`[[inputs.snmp.field]]`** entries read single (scalar) values.
  `sysUpTime` becomes an `uptime` field, and `sysName` becomes a tag on
  every metric from the device.
- **`[[inputs.snmp.table]]`** walks the `IF-MIB::ifTable` and produces one
  metric per table row, so each interface gets its own `interface`
  metric with counters such as `ifInOctets`, `ifOutOctets`, and
  `ifOperStatus` as fields.
  The `ifDescr` column is stored as a tag to identify the interface, and
  `inherit_tags` copies the device-level `sysName` tag onto each row.
- For SNMPv3, replace `community` with the `sec_name`, `sec_level`,
  `auth_protocol`, and `priv_protocol` options from the
  [plugin documentation](/telegraf/v1/input-plugins/snmp/), and keep
  passwords out of the config file with
  [secret stores](/telegraf/v1/configuration/secrets/).

## Example output

```text
snmp,source=switch1.example.com,sysName=sw-core-01 uptime=1284923i 1709572230000000000
interface,ifDescr=GigabitEthernet0/1,source=switch1.example.com,sysName=sw-core-01 ifInOctets=918273645i,ifOutOctets=234981723i,ifOperStatus=1i,ifSpeed=1000000000i 1709572230000000000
interface,ifDescr=GigabitEthernet0/2,source=switch1.example.com,sysName=sw-core-01 ifInOctets=81723645i,ifOutOctets=34981723i,ifOperStatus=2i,ifSpeed=1000000000i 1709572230000000000
```

## Extend this example

- Interface octet counters are cumulative.
  Compute per-interval rates at query time, or use the
  [derivative aggregator](/telegraf/v1/aggregator-plugins/derivative/) to
  emit rates directly.
- To collect only specific columns instead of the whole table, list them
  as `[[inputs.snmp.table.field]]` entries and remove the table walk of
  unneeded columns with `index_as_tag` and column filters described in
  the [plugin documentation](/telegraf/v1/input-plugins/snmp/).
- Poll many devices efficiently by increasing `max_repetitions` for
  bulk requests, and set per-plugin `interval` to poll SNMP less often
  than your other inputs.
