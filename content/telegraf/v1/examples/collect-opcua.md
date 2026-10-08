---
title: Collect industrial data from OPC UA
description: >
  Use the Telegraf opcua input plugin to read values from an OPC UA server,
  such as a PLC or SCADA gateway, and write them to InfluxDB 3. Covers
  browse-based node discovery (Telegraf 1.39+) and explicit node
  configuration.
menu:
  telegraf_v1:
    name: Collect industrial data
    parent: Configuration examples
weight: 108
related:
  - /telegraf/v1/input-plugins/opcua/
  - /telegraf/v1/input-plugins/opcua_listener/
  - /telegraf/v1/input-plugins/modbus/
---

Read process values from an OPC UA server, such as a PLC, historian, or
SCADA gateway, and write them to InfluxDB 3.
OPC UA is the standard interface for industrial equipment, and this
pattern is the foundation of most IIoT monitoring pipelines.

There are two ways to tell Telegraf which nodes to read:

- **[Discover nodes with browse patterns](#discover-nodes-with-browse-patterns)**
  (Telegraf 1.39+, recommended): Telegraf walks the server's address space
  and matches nodes against glob patterns.
- **[Define nodes explicitly](#define-nodes-explicitly)** (all versions):
  you list every node to read.

If your address space is large or changes over time, we recommend
upgrading to Telegraf 1.39 or later and using browse-based discovery.

## Discover nodes with browse patterns

Instead of enumerating every node, describe them with patterns.
Telegraf browses the server's address space, matches Variable nodes
against each pattern, and reads everything that matches:

```toml { placeholders="AUTH_TOKEN|DATABASE_NAME" }
[[inputs.opcua]]
  ## OPC UA server endpoint.
  endpoint = "opc.tcp://plc-gateway.factory.local:4840"
  connect_timeout = "10s"
  request_timeout = "5s"

  ## Security settings negotiated with the server.
  security_policy = "Basic256Sha256"
  security_mode = "SignAndEncrypt"
  auth_method = "UserName"
  username = "telegraf"
  password = "example-password"

  ## Use the timestamp reported by the data source.
  timestamp = "source"

  [inputs.opcua.browse]
    ## Optional safety limits for the browse walk.
    depth = 10
    max_nodes = 50000

    ## Read every motor valve on every line in Plant1.
    [[inputs.opcua.browse.paths]]
      pattern = "Plant1/*/MV*"
      name = "motor_valves"
      default_tags = { plant = "plant1" }

    ## Read every temperature node, wherever it lives.
    [[inputs.opcua.browse.paths]]
      pattern = "**/Temperature"
      name = "temperatures"

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

### How discovery works

- **Patterns** match against browse paths with `/` as the segment
  separator: `*` matches one segment or characters within a segment,
  `**` matches any number of segments, and `?`, `[abc]`, and `{a,b}`
  match within a segment.
- **Each `paths` rule becomes a metric group**: the rule's `name` is the
  measurement name and its `default_tags` apply to every matched node.
  A node matching multiple patterns appears in each group.
- **Discovery repeats on every connect**, so nodes added to or removed
  from the server are picked up on reconnect without restarting Telegraf
  or editing the configuration.
- **`depth` and `max_nodes`** bound the walk on large address spaces, and
  `root` starts the walk somewhere other than the standard Objects folder
  (node-ID form, for example `root = "ns=0;i=85"`).
- Browse-based discovery is backward compatible: explicit `nodes` and
  `group` entries keep working alongside it.

## Define nodes explicitly

On Telegraf versions earlier than 1.39, or when you want exact control
over what's read and how fields are named, list each node.
Replace the `[inputs.opcua.browse]` section with `group` and `nodes`
definitions:

```toml
  ## Machine-state nodes, grouped so they share a measurement name
  ## and tags.
  [[inputs.opcua.group]]
    name = "press_line"
    namespace = "3"
    identifier_type = "s"
    default_tags = { line = "assembly-2" }

    nodes = [
      {name="temperature", identifier="Press04.Temperature"},
      {name="pressure", identifier="Press04.Pressure"},
      {name="cycle_count", identifier="Press04.CycleCount"},
    ]
```

- **The `group` table** sets shared properties for its nodes: the
  `press_line` measurement name, the OPC UA namespace, the identifier
  type (`s` for string identifiers), and a `line` tag applied to every
  node.
- **`nodes`** lists the values to read.
  Each node's `name` becomes the field key, and `identifier` is the node
  ID as shown in your OPC UA browser, combining with the group's
  namespace to form IDs like `ns=3;s=Press04.Temperature`.
- Add one `[[inputs.opcua.group]]` per machine or line, each with its own
  measurement name and default tags.

## Connection and security

These settings apply to both methods:

- **`endpoint`** is the OPC UA server address.
  The security policy, mode, and authentication method must match what
  the server allows.
  Set `security_policy = "auto"` and `security_mode = "auto"` to
  negotiate automatically.
  If certificate files aren't specified, Telegraf creates a self-signed
  client certificate, which most servers require you to trust before
  reads succeed.
- **`timestamp = "source"`** uses the timestamp attached to each value by
  the data source instead of the collection time, preserving the true
  observation time of each reading.
- On each collection interval, Telegraf reads all configured or
  discovered nodes and emits one metric per node, with the node ID as an
  `id` tag and the OPC UA status in a `Quality` field.

## Example output

From the explicit configuration above:

```text
press_line,id=ns\=3;s\=Press04.Temperature,line=assembly-2 temperature=76.2,Quality="OK (0x0)" 1709572232000000000
press_line,id=ns\=3;s\=Press04.Pressure,line=assembly-2 pressure=101.4,Quality="OK (0x0)" 1709572232000000000
press_line,id=ns\=3;s\=Press04.CycleCount,line=assembly-2 cycle_count=18342i,Quality="OK (0x0)" 1709572232000000000
```

With browse-based discovery, each metric uses its rule's `name` as the
measurement name and the node's browse name as the field key, for example
`motor_valves` metrics tagged `plant=plant1`.

## Extend this example

- For servers that support subscriptions, the
  [opcua_listener](/telegraf/v1/input-plugins/opcua_listener/) input
  receives value changes as they happen instead of polling.
  It supports the same browse-based discovery in Telegraf 1.39+.
- For devices that speak Modbus instead of OPC UA, the
  [modbus](/telegraf/v1/input-plugins/modbus/) input reads holding
  registers, coils, and inputs directly.
  Equipment publishing MQTT can use the
  [MQTT example](/telegraf/v1/examples/collect-mqtt/) pattern.
- To reduce write volume from fast-changing values, downsample before
  writing.
  See [Downsample metrics before writing](/telegraf/v1/examples/downsample-metrics/).
