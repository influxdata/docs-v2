<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
scheduled opcua, ingestion, iot, industrial {{% product-name %}}

> **Note:** This plugin requires {{% product-name %}}.8.2 or later.


The OPC UA Plugin enables periodic ingestion of OPC UA node values into {{% product-name %}}. Connect to an OPC UA server, read current values from configured nodes, and automatically write them as time-series data with support for automatic data type detection. Designed for industrial IoT scenarios — PLCs, SCADA systems, CNC machines, and other OPC UA-enabled equipment.

**Key characteristics:**
- **Polling-based**: Reads current node values on each scheduled trigger call (not subscription-based)
- **Two operating modes**: Explicit node listing for precise control, or browse mode for auto-discovery of thousands of devices
- **Auto type detection**: OPC UA data types are automatically mapped to InfluxDB field types
- **Namespace URI support**: Use stable namespace URIs instead of numeric indexes that may change on server restart
- **Quality filtering**: Accept or reject OPC UA values based on quality category (good, uncertain, bad)
- **Persistent connection**: OPC UA connection is cached and reused across scheduled calls with automatic reconnect on failure
- **Scalar values only**: Arrays, structures, and other complex OPC UA types are not supported

## Operating Modes

The plugin supports two mutually exclusive modes for specifying which OPC UA nodes to read:

### Explicit nodes mode

Specify each node ID manually. Best for small setups where you need precise control over field names and types. All nodes are written as fields in a **single data point** per trigger execution.

### Browse mode

Automatically discover devices and their variables by browsing the OPC UA address space from a root node. Best for large-scale deployments with hundreds or thousands of devices sharing the same variable structure. The plugin maps the Object hierarchy to InfluxDB tags and writes **one data point per unique tag combination** per trigger execution.

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger. This plugin supports TOML configuration files for complex setups, which can be specified using the `config_file_path` parameter.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter    | Type   | TOML Section | Description                                                                                                                                                               |
|--------------|--------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `server_url` | string | `[opcua]`    | OPC UA server endpoint URL (for example, `opc.tcp://localhost:4840`). Must use the `opc.tcp://` or `opc.tls://` scheme; other schemes (`file://`, `http://`, etc.) are rejected. |
| `table_name` | string | `[opcua]`    | InfluxDB measurement name for storing data                                                                                                                                |

**One of the following is required** (mutually exclusive):

| Parameter     | Type    | TOML Section     | Description                                                                                                                         |
|---------------|---------|------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| `nodes`       | string  | `[opcua.nodes]`  | Space-separated node mappings. Format: `field_name:namespace:identifier[:type]`. See [Node mapping](#node-mapping-format).          |
| `browse_root` | string  | `[opcua.browse]` | Root node ID for auto-discovery mode (for example, `ns=2;s=Devices` or `nsu=<uri>;s=Devices`). See [Browse mode](#browse-mode-parameters). |

### Namespace parameters

| Parameter    | Type   | Default | TOML Section          | Description                                                                                                                                                                                                                                                                          |
|--------------|--------|---------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `namespaces` | string | none    | `[opcua.namespaces]`  | Space-separated namespace alias mappings. Format: `alias=namespace_uri`. Aliases can be used instead of numeric namespace indexes in `nodes` and `tag_nodes` for stable configuration that survives server restarts. The plugin resolves URIs to numeric indexes at connection time. |

**CLI format:**

```bash
namespaces="siemens=urn:vendor:s7 beckhoff=urn:beckhoff:ua"
nodes="temperature:siemens:s=SpindleTemp pressure:beckhoff:s=CoolantPressure:float"
```
**TOML format:**

In TOML configuration, namespace aliases are not used — write node IDs directly with `nsu=<uri>;...` format:

```toml
[opcua.nodes]
temperature = "nsu=urn:vendor:s7;s=SpindleTemp"
pressure = ["nsu=urn:beckhoff:ua;s=CoolantPressure", "float"]
```
The plugin resolves `nsu=` URIs to numeric `ns=` indexes after connecting to the server.

### Browse mode parameters

| Parameter          | Type   | Default   | TOML Section     | Description                                                                                                                                                                                                                                                                                                                                                  |
|--------------------|--------|-----------|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `browse_root`      | string | none      | `[opcua.browse]` | Root node ID for auto-discovery. Accepts a numeric namespace (`ns=2;s=Devices`) or a namespace URI (`nsu=<uri>;s=Devices`) resolved at connection time for restart stability. See [Namespace URI resolution](#namespace-uri-resolution).                                                                                                                     |
| `browse_depth`     | int    | 2         | `[opcua.browse]` | Maximum browse depth. 1 = direct children, 2 = children of children, etc.                                                                                                                                                                                                                                                                                    |
| `browse_cache_ttl` | int    | 3600      | `[opcua.browse]` | Seconds to cache the discovered node set before re-browsing. Discovery runs on the first call and every `browse_cache_ttl` seconds thereafter; cached node IDs are read in between. Set low for a fast-changing address space, high to run discovery infrequently while collecting on a short trigger interval. See [Discovery caching](#discovery-caching). |
| `path_tags`        | list   | `[]`      | `[opcua.browse]` | Tag names mapping Object hierarchy levels to InfluxDB tags. First entry maps to depth-1 Objects, second to depth-2, etc. Length must be strictly less than `browse_depth`. Objects beyond `path_tags` length become field name prefixes. **Required in TOML** (specify `[]` explicitly for no hierarchy tags); defaults to `[]` in CLI.                      |
| `filter`           | string | none      | `[opcua.browse]` | Regex pattern to filter discovered variable names. Only matching variables are included. Matches the original Variable browse name, not the prefixed field name (see [filter in nested hierarchies](#filter-in-nested-hierarchies)).                                                                                                                         |
| `exclude_branches` | string | none      | `[opcua.browse]` | Regex pattern to exclude Object nodes (branches) by browse name. Matched Objects and their entire subtree are skipped. Works at all browse depths. See [Exclude branches](#exclude-branches).                                                                                                                                                                |
| `browse_tags`      | list   | none      | `[opcua.browse]` | Variable names that should be stored as InfluxDB tags instead of fields. Values are converted to strings. See [Browse tags](#browse-tags).                                                                                                                                                                                                                   |
| `name_separator`   | string | none      | `[opcua.browse]` | Separator for splitting Variable browse names into segments for tag extraction. Required when `name_tags` is set. See [Name tags](#name-tags).                                                                                                                                                                                                               |
| `name_tags`        | list   | none      | `[opcua.browse]` | Tag names extracted from leading segments of Variable browse names split by `name_separator`. Remaining segments form the field name (joined with `_`). See [Name tags](#name-tags).                                                                                                                                                                         |

> **Note:** integer parameters (`browse_depth`, `browse_cache_ttl`) also accept numeric strings, so `browse_depth = "2"` is valid in TOML. `browse_cache_ttl` is capped at 30 days.

### Tag parameters

| Parameter      | Type   | Default | TOML Section          | Description                                                                                                                                                                                                       |
|----------------|--------|---------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `default_tags` | string | none    | `[opcua.default_tags]`| Space-separated static tags added to every point. Format: `key=value`.                                                                                                                                            |
| `tag_nodes`    | string | none    | `[opcua.tag_nodes]`   | Space-separated tag node mappings. Format: `tag_name:namespace:identifier`. Values are read from OPC UA nodes at each execution and used as string tags. See [Static and dynamic tags](#static-and-dynamic-tags). |

### Quality filter parameters

| Parameter        | Type   | Default | TOML Section | Description                                                                                                                                                             |
|------------------|--------|---------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `quality_filter` | string | "good"  | `[opcua]`    | Space-separated list of OPC UA quality categories to accept: `good`, `uncertain`, `bad`. Values with non-matching quality are skipped and logged to `opcua_exceptions`. |

**CLI format:**

```bash
quality_filter="good uncertain"
```
**TOML format:**

```toml
[opcua]
quality_filter = ["good", "uncertain"]
```
### Authentication parameters

| Parameter  | Type   | Default | TOML Section    | Description                                                       |
|------------|--------|---------|-----------------|-------------------------------------------------------------------|
| `username` | string | none    | `[opcua.auth]`  | Username for UserToken authentication                             |
| `password` | string | none    | `[opcua.auth]`  | Password for UserToken authentication                             |

**Note:** Both `username` and `password` must be provided together.

**Security:** When `security_policy` is not set, the connection is unencrypted and credentials are sent in cleartext. The plugin refuses to send `username`/`password` in that case unless `allow_insecure_auth` is explicitly set to `true`. Prefer configuring a `security_policy` for an encrypted connection.

### Security parameters

| Parameter         | Type   | Default          | TOML Section        | Description                                                                                                        |
|-------------------|--------|------------------|---------------------|--------------------------------------------------------------------------------------------------------------------|
| `security_policy` | string | none             | `[opcua.security]`  | OPC UA security policy: `Basic128Rsa15`, `Basic256`, `Basic256Sha256`, `Aes128Sha256RsaOaep`, `Aes256Sha256RsaPss` |
| `security_mode`   | string | "SignAndEncrypt" | `[opcua.security]`  | OPC UA security mode: `Sign`, `SignAndEncrypt`. Used when `security_policy` is set.                                |
| `certificate`     | string | none             | `[opcua.security]`  | Path to client certificate (DER format). Required when `security_policy` is set.                                   |
| `private_key`     | string | none             | `[opcua.security]`  | Path to client private key (PEM format). Required when `security_policy` is set.                                   |

**Note:** When `security_policy` is set, both `certificate` and `private_key` are required. The OPC UA server must trust the client certificate.

### Advanced parameters

| Parameter              | Type   | Default | TOML Section | Description                                                                                                                                                                                                              |
|------------------------|--------|---------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `config_file_path`     | string | none    | CLI only     | Path to TOML config file (absolute or relative to `PLUGIN_DIR`)                                                                                                                                                          |
| `config_cache_ttl`     | int    | 3600    | `[opcua]`    | Seconds to cache the parsed configuration (max 2592000). Controls how quickly credential, endpoint, table, or filter changes take effect. Independent of `browse_cache_ttl`.                                             |
| `disable_config_cache` | bool   | false   | `[opcua]`    | Reload configuration on every call instead of caching for `config_cache_ttl` seconds. Also disables caching of the discovered browse structure, so in browse mode the address space is re-walked on every call. Useful during development. |
| `allow_insecure_auth`  | bool   | false   | `[opcua]`    | Permit sending `username`/`password` when `security_policy` is not set (credentials sent in cleartext over an unencrypted connection). Only enable on a trusted network.                                                 |
| `enable_full_logging`  | bool   | false   | `[opcua]`    | When `true`, full exception messages are written to logs. When `false` (default), only the exception type is logged, to avoid leaking sensitive values (credentials, payloads, paths). Enable temporarily for debugging. |

### Static and dynamic tags

The plugin supports two ways to attach tags to every written data point:

- **Static tags** (`default_tags`): Fixed key-value pairs defined at configuration time. Do not change between trigger calls.
- **Dynamic tags** (`tag_nodes`): Values read from OPC UA nodes on each trigger execution, then converted to strings and used as tag values. Useful for identifiers stored on the device itself — serial number, model name, firmware version, or any other variable property.

Dynamic tags are merged with static tags before writing. If a key appears in both, the dynamic value takes precedence.

**CLI format:**

```bash
# Static tags
default_tags="location=factory_1 line=A"

# Dynamic tags — same syntax as nodes, type suffix is ignored (values always stored as strings)
tag_nodes="machine_id:2:s=MachineID serial:2:s=SerialNumber"
```
**TOML format:**

```toml
[opcua.default_tags]
location = "factory_1"
line = "A"

[opcua.tag_nodes]
machine_id = "ns=2;s=MachineID"
serial = "ns=2;s=SerialNumber"
# List format is accepted but type is ignored — values are always read as strings
# firmware = ["ns=2;s=FirmwareVersion", "string"]
```
### Browse tags

In browse mode, some discovered variables may represent identifiers (room name, zone, asset ID) rather than measurements. Use `browse_tags` to store them as InfluxDB tags instead of fields.

**CLI format:**

```bash
browse_tags="room zone"
```
**TOML format:**

```toml
[opcua.browse]
browse_root = "ns=2;s=Sensors"
browse_depth = 2
browse_tags = ["room", "zone"]
```
**Example:**

Given this OPC UA address space:
```
Sensors
  +-- Sensor_001
  |   +-- room (value="Building_A")  -> tag
  |   +-- zone (value="Zone_3")      -> tag
  |   +-- temperature (value=22.5)    -> field
  |   +-- humidity (value=45.0)       -> field
```
The plugin writes:
```
sensor_data,device=Sensor_001,room=Building_A,zone=Zone_3 temperature=22.5,humidity=45.0 <timestamp>
```
### Exclude branches

Use `exclude_branches` to skip entire Object nodes (and all their children) during auto-discovery. The pattern is a Python regex matched against Object browse names using `re.search()` (partial match). Works at all browse depths — both within `path_tags` range (skipping entire device groups) and beyond (skipping sub-object branches that would become field prefixes).

**CLI format:**

```bash
exclude_branches="Debug_.*|Test_.*"
```
**TOML format:**

```toml
[opcua.browse]
browse_root = "ns=2;s=Factory"
browse_depth = 3
path_tags = ["line", "station"]
exclude_branches = "Debug_.*|Test_.*"
```
**Example:**

Given this OPC UA address space with `path_tags = ["line", "station"]`:
```
Factory
  +-- Line_A
  |   +-- Station_01       -> included
  |   +-- Station_02       -> included
  |   +-- Debug_Station    -> EXCLUDED (matches "Debug_.*")
  +-- Test_Line            -> EXCLUDED (matches "Test_.*")
      +-- Station_01       -> not discovered (parent excluded)
```
The plugin writes only data from non-excluded branches:
```
factory_data,line=Line_A,station=Station_01 Temperature=42.5,Pressure=3.2 <timestamp>
factory_data,line=Line_A,station=Station_02 Temperature=38.1,Pressure=2.8 <timestamp>
```
`Debug_Station` and `Test_Line` (with all its children) are completely skipped.

**Note:** `exclude_branches` filters Object nodes (branches), while `filter` filters Variable nodes (leaves). They are independent and can be used together.

### Name tags

Use `name_tags` with `name_separator` when Variable browse names encode hierarchy in a flat format (for example, `BuildingA.Zone3.Temperature`). The plugin splits each Variable name by the separator, extracts leading segments as InfluxDB tags, and uses remaining segments as the field name. Variables are then grouped by extracted tag combinations — one point per unique combination.

Variables that don't have enough segments (fewer than `len(name_tags) + 1`) are skipped with a warning.

**CLI format:**

```bash
name_separator="."
name_tags="building zone"
```
**TOML format:**

```toml
[opcua.browse]
browse_root = "ns=2;s=FlatSensors"
browse_depth = 1
path_tags = []
name_separator = "."
name_tags = ["building", "zone"]
```
**Example:**

Given Variables directly under `browse_root`:
```
FlatSensors
  +-- BuildingA.Zone3.Temperature (value=22.5)
  +-- BuildingA.Zone3.Humidity    (value=45.0)
  +-- BuildingB.Zone1.Temperature (value=20.1)
  +-- BuildingB.Zone1.Humidity    (value=50.2)
```
The plugin splits by `.`, extracts 2 leading segments as tags, and groups:
```
flat_sensors,building=BuildingA,zone=Zone3 Temperature=22.5,Humidity=45.0 <timestamp>
flat_sensors,building=BuildingB,zone=Zone1 Temperature=20.1,Humidity=50.2 <timestamp>
```
**Note:** Tag names in `name_tags` must not overlap with `path_tags` tag names.

### File path resolution

All file paths in the plugin (configuration file, certificates) follow the same resolution logic:

- **Absolute paths** (for example, `/etc/opcua/client.der`) are used as-is
- **Relative paths** (for example, `certs/client.der`) are resolved from `PLUGIN_DIR` environment variable

If a relative path is specified and `PLUGIN_DIR` is not set, the plugin will return an error.

### Example TOML configuration

[opcua_config_example.toml](https://github.com/influxdata/influxdb3_plugins/blob/master/influxdata/opcua/opcua_config_example.toml) - comprehensive configuration example with multiple scenarios

### TOML section reference

| TOML section           | Description                                                                                                                                                      |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `[opcua]`              | Required. `server_url`, `table_name`, `quality_filter`, `config_cache_ttl`, `disable_config_cache`, `allow_insecure_auth`                                        |
| `[opcua.default_tags]` | Static tags as `key = "value"` pairs                                                                                                                             |
| `[opcua.namespaces]`   | Namespace alias mappings as `alias = "uri"` pairs. Validated but not used for alias substitution in TOML — use `nsu=<uri>;...` directly in node IDs              |
| `[opcua.tag_nodes]`    | Dynamic tags from OPC UA nodes                                                                                                                                   |
| `[opcua.nodes]`        | Explicit node mappings (mutually exclusive with `[opcua.browse]`)                                                                                                |
| `[opcua.browse]`       | Browse mode settings: `browse_root`, `browse_depth`, `browse_cache_ttl`, `path_tags`, `filter`, `exclude_branches`, `browse_tags`, `name_separator`, `name_tags` |
| `[opcua.security]`     | `security_policy`, `security_mode`, `certificate`, `private_key`                                                                                                 |
| `[opcua.auth]`         | `username`, `password`                                                                                                                                           |

## Node Mapping Format

### CLI arguments format

```
field_name:namespace:identifier[:type]
```
| Component    | Required | Description                                                                              |
|--------------|----------|------------------------------------------------------------------------------------------|
| `field_name` | yes      | InfluxDB field name for this node value                                                  |
| `namespace`  | yes      | OPC UA namespace index (non-negative integer) or alias defined in `namespaces` parameter |
| `identifier` | yes      | OPC UA node identifier with type prefix (`s=`, `i=`, `g=`, `b=`)                         |
| `type`       | no       | Explicit type override: `int`, `uint`, `float`, `string`, `bool`                         |

When namespace is a numeric index, the node ID is built as `ns=<namespace>;<identifier>`.
When namespace is an alias, the corresponding URI is looked up in `namespaces` and the node ID is built as `nsu=<uri>;<identifier>`, then resolved to a numeric index at connection time.

**Examples:**

```bash
# Auto-detected types
"temperature:2:s=SpindleTemp pressure:2:s=CoolantPressure"

# With explicit type override
"rpm:2:i=1234:uint status:3:s=MachineStatus:string"

# Using namespace alias (requires namespaces="siemens=urn:vendor:s7")
"temperature:siemens:s=SpindleTemp"
```
### TOML format

```toml
[opcua.nodes]
# Auto-detected type (string format)
temperature = "ns=2;s=SpindleTemp"

# Explicit type override (list format)
rpm = ["ns=2;s=SpindleRPM", "uint"]

# Using namespace URI (resolved at connection time)
pressure = "nsu=urn:vendor:s7;s=CoolantPressure"
```
### Type auto-detection

When no explicit type is specified, the plugin automatically maps OPC UA data types to InfluxDB field types:

| OPC UA VariantType                    | InfluxDB type | LineBuilder method |
|---------------------------------------|---------------|--------------------|
| Boolean                               | bool          | `bool_field()`     |
| SByte, Int16, Int32, Int64            | int           | `int64_field()`    |
| Byte, UInt16, UInt32, UInt64          | uint          | `uint64_field()`   |
| Float, Double                         | float         | `float64_field()`  |
| String, DateTime, and all other types | string        | `string_field()`   |

## Browse Mode

Browse mode automatically discovers devices and their variables by traversing the OPC UA address space hierarchy. This is designed for large-scale deployments where manually listing every node ID is impractical.

### How browse works

The plugin uses `path_tags` to map Object hierarchy levels to InfluxDB tags:

```
browse_root (specified by browse_root parameter)
  +-- Device_001 (Object, depth 1) -> path_tags[0] = "device" -> tag: device=Device_001
  |   +-- Temperature (Variable)   -> field
  |   +-- Pressure (Variable)      -> field
  |   +-- Status (Variable)        -> field
  +-- Device_002 (Object, depth 1) -> path_tags[0] = "device" -> tag: device=Device_002
  |   +-- Temperature (Variable)   -> field
  +-- ... (hundreds/thousands of devices)
```
- **Object nodes** at depths within `path_tags` range become **tag values** — the Object browse name is stored as the value of the corresponding tag
- **Object nodes** beyond `path_tags` range become **field name prefixes** (for example, `Position_X`)
- **Variable nodes** become **fields** — their browse name (with optional prefix) becomes the field name
- **Variable nodes** directly under `browse_root` (with `path_tags = []`) are written as a single point without hierarchy tags

Each unique combination of tag values produces one data point. All Variables within that combination are collected as fields of that point. Tags on the final data point come from multiple sources (in merge order): `default_tags`, `tag_nodes`, `path_tags`, `browse_tags`, and `name_tags`. See the corresponding parameter sections below for details.

### Nested hierarchies

For servers with deeper nesting, increase `browse_depth` and configure `path_tags` to control which Object levels become tags vs field prefixes:

```bash
# path_tags = ["device"], browse_depth = 3
browse_root (depth 0)
  +-- Robot_001 (Object, depth 1)   -> tag: device=Robot_001
      +-- Speed (Variable, depth 2) -> field: "Speed"
      +-- Position (Object, depth 2) -> field prefix: "Position_"
      |   +-- X (Variable, depth 3)  -> field: "Position_X"
      |   +-- Y (Variable, depth 3)  -> field: "Position_Y"
      |   +-- Z (Variable, depth 3)  -> field: "Position_Z"
      +-- Gripper (Object, depth 2)  -> field prefix: "Gripper_"
          +-- Force (Variable, depth 3) -> field: "Gripper_Force"
```
Result — one data point per device, all Variables (including nested) collected as fields:
```
robot_data,device=Robot_001 Speed=100i,Position_X=1.5,Position_Y=2.3,Position_Z=0.8,Gripper_Force=5.2 <timestamp>
```
With multi-level `path_tags = ["line", "station"]` and `browse_depth = 3`, each unique line×station combination produces one data point:

```
browse_root (depth 0)
  +-- Line_A (Object, depth 1)       -> tag: line=Line_A
  |   +-- Station_01 (Object, depth 2) -> tag: station=Station_01
  |   |   +-- Temperature (Variable)   -> field
  |   |   +-- Pressure (Variable)      -> field
  |   +-- Station_02 (Object, depth 2) -> tag: station=Station_02
  |       +-- Temperature (Variable)   -> field
  |       +-- Pressure (Variable)      -> field
  +-- Line_B (Object, depth 1)       -> tag: line=Line_B
      +-- Station_01 (Object, depth 2) -> tag: station=Station_01
          +-- Temperature (Variable)   -> field
```
Result — one data point per unique tag combination (3 points):
```
factory_data,line=Line_A,station=Station_01 Temperature=42.5,Pressure=3.2 <timestamp>
factory_data,line=Line_A,station=Station_02 Temperature=38.1,Pressure=2.8 <timestamp>
factory_data,line=Line_B,station=Station_01 Temperature=40.0 <timestamp>
```
Objects beyond `path_tags` length become field name prefixes with underscore separator (for example, `Position_X`).

### Browse structure caching

The discovered node structure (which devices have which variables) is cached for **1 hour**. Only values are re-read on each trigger call. This means:
- First call: browse + read (slower)
- Subsequent calls: read only (fast)
- After 1 hour: browse is repeated to pick up any new devices or variables
- Config reload also invalidates the browse cache

### TOML configuration for browse mode

```toml
[opcua]
server_url = "opc.tcp://192.168.1.100:4840"
table_name = "cnc_data"

[opcua.browse]
browse_root = "ns=2;s=Devices"
browse_depth = 2
path_tags = ["device"]
# filter = "Temperature|Pressure|Status"  # optional regex
# browse_tags = ["room", "zone"]          # optional: store these as tags instead of fields

[opcua.default_tags]
location = "factory_1"
```
### Browse mode example output

Given 3 devices with 3 variables each, the plugin writes:

```
cnc_data,location=factory_1,device=Device_001 Temperature=42.5,Pressure=3.2,Status="running" <timestamp>
cnc_data,location=factory_1,device=Device_002 Temperature=38.1,Pressure=2.8,Status="idle" <timestamp>
cnc_data,location=factory_1,device=Device_003 Temperature=40.0,Pressure=3.0,Status="running" <timestamp>
```
## Data requirements

The plugin automatically creates the target measurement table on first write. No pre-existing schema is required.

### OPC UA node requirements

- **Scalar values only**: The plugin reads scalar (single) values. Arrays, structures, ExtensionObjects, and other complex types are not supported — they will be converted to string representation.
- **Readable nodes**: Nodes must have the `Read` access level. Nodes with `Bad` status codes are skipped with errors logged.
- **Explicit mode**: Node IDs must be known in advance.
- **Browse mode**: The `browse_root` node must exist and contain Object/Variable child nodes.

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled
- **Python packages**:
  - `asyncua` (async Python OPC UA client library)

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install required Python packages:

   ```bash
   influxdb3 install package asyncua
   ```
## Trigger setup

### Scheduled reading with TOML configuration

Recommended for production use:

```bash
# 1. Set PLUGIN_DIR environment variable
export PLUGIN_DIR=~/.plugins

# 2. Copy and edit configuration file
cp opcua_config_example.toml $PLUGIN_DIR/my_opcua_config.toml
# Edit my_opcua_config.toml with your OPC UA server and node settings

# 3. Create the trigger
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/opcua/opcua.py \
  --trigger-spec "every:10s" \
  --trigger-arguments config_file_path=my_opcua_config.toml \
  opcua_ingestion
```
### Scheduled reading with command-line arguments (explicit mode)

For simple setups:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/opcua/opcua.py \
  --trigger-spec "every:5s" \
  --trigger-arguments 'server_url=opc.tcp://192.168.1.100:4840,table_name=cnc_machine,nodes=temperature:2:s=SpindleTemp pressure:2:s=CoolantPressure:float rpm:2:i=1234:uint,default_tags=location=factory_1,tag_nodes=machine_id:2:s=MachineID serial:2:s=SerialNumber' \
  opcua_cnc
```
### Explicit mode with namespace aliases

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/opcua/opcua.py \
  --trigger-spec "every:5s" \
  --trigger-arguments 'server_url=opc.tcp://192.168.1.100:4840,table_name=cnc_machine,namespaces=siemens=urn:vendor:s7,nodes=temperature:siemens:s=SpindleTemp pressure:siemens:s=CoolantPressure:float' \
  opcua_ns_alias
```
### Browse mode with command-line arguments

For auto-discovery of many devices:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/opcua/opcua.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'server_url=opc.tcp://192.168.1.100:4840,table_name=cnc_data,browse_root=ns=2;s=Devices,browse_depth=2,path_tags=device,default_tags=location=factory_1' \
  opcua_browse
```
### Browse mode with multi-level path_tags

Map multiple Object hierarchy levels to tags:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/opcua/opcua.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'server_url=opc.tcp://192.168.1.100:4840,table_name=factory_data,browse_root=ns=2;s=Factory,browse_depth=3,path_tags=line station,default_tags=plant=north' \
  opcua_multi_level
```
### Browse mode with filter and browse_tags

Read only specific variables from each device, storing some as tags:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/opcua/opcua.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'server_url=opc.tcp://192.168.1.100:4840,table_name=plc_data,browse_root=ns=3;s=Floor2,browse_depth=2,path_tags=device,filter=Temperature|Pressure|Status|room,browse_tags=room' \
  opcua_filtered
```
### Browse mode with exclude_branches

Skip specific Object branches during auto-discovery:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/opcua/opcua.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'server_url=opc.tcp://192.168.1.100:4840,table_name=factory_data,browse_root=ns=2;s=Factory,browse_depth=3,path_tags=line station,exclude_branches=Debug_.*|Test_.*,default_tags=plant=north' \
  opcua_exclude
```
### Browse mode with name_tags (flat namespace)

Extract tags from Variable browse names in flat namespaces:

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/opcua/opcua.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'server_url=opc.tcp://192.168.1.100:4840,table_name=flat_sensors,browse_root=ns=2;s=FlatSensors,browse_depth=1,path_tags=,name_separator=.,name_tags=building zone' \
  opcua_flat
```
### Secure connection with certificates

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/opcua/opcua.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'server_url=opc.tcp://secure-plc.company.com:4840,table_name=plc_data,nodes=speed:3:s=Motor.Speed torque:3:s=Motor.Torque,security_policy=Basic256Sha256,security_mode=SignAndEncrypt,certificate=certs/client.der,private_key=certs/client.pem,username=operator,password=secret' \
  secure_opcua
```
### Accept uncertain quality values

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/opcua/opcua.py \
  --trigger-spec "every:10s" \
  --trigger-arguments 'server_url=opc.tcp://192.168.1.100:4840,table_name=sensor_data,nodes=temperature:2:s=Temperature pressure:2:s=Pressure,quality_filter=good uncertain' \
  opcua_with_uncertain
```
## Statistics and Monitoring

The plugin tracks statistics and writes them to the `opcua_stats` table every 10 plugin calls.

### opcua_stats Table

| Field                  | Type  | Description                                    |
|------------------------|-------|------------------------------------------------|
| `server_url` (tag)     | tag   | OPC UA server URL                              |
| `table_name` (tag)     | tag   | Target InfluxDB measurement                    |
| `nodes_read`           | int   | Nodes successfully read in current period      |
| `nodes_failed`         | int   | Nodes failed to read in current period         |
| `points_written`       | int   | Data points written in current period          |
| `success_rate`         | float | Success rate for current period (%)            |
| `total_nodes_read`     | int   | Total nodes successfully read (all time)       |
| `total_nodes_failed`   | int   | Total nodes failed (all time)                  |
| `total_points_written` | int   | Total data points written (all time)           |
| `total_success_rate`   | float | Total success rate (all time, %)               |

### Querying Statistics

```bash
# Get latest statistics
influxdb3 query --database mydb \
  "SELECT * FROM opcua_stats ORDER BY time DESC LIMIT 10"

# Success rate over time
influxdb3 query --database mydb \
  "SELECT server_url, success_rate, nodes_read, nodes_failed, points_written
   FROM opcua_stats
   WHERE time > now() - INTERVAL '1 hour'
   ORDER BY time DESC"
```
## Error Handling

Node read errors, type conversion failures, and quality filter rejections are logged to the `opcua_exceptions` table:

### opcua_exceptions Table

| Field                | Type   | Description                                                              |
|----------------------|--------|--------------------------------------------------------------------------|
| `node_id` (tag)      | tag    | OPC UA node ID that failed                                               |
| `field_name` (tag)   | tag    | Configured field name for this node                                      |
| `error_type` (tag)   | tag    | Error type: `NodeReadError`, `TypeConversionError`, `QualityFilterError` |
| `error_message`      | string | Detailed error message                                                   |

### Checking for Errors

```bash
influxdb3 query --database mydb \
  "SELECT * FROM opcua_exceptions ORDER BY time DESC LIMIT 10"
```
## Important Behaviors

### Timestamp handling

All fields within a single data point share the **same timestamp** — the latest OPC UA timestamp among successfully read nodes that passed the quality filter. Per node, `SourceTimestamp` is preferred; if unavailable, `ServerTimestamp` is used. The maximum across all accepted nodes becomes the point timestamp. If no OPC UA timestamps are available, system time is used.

### Connection lifecycle

The OPC UA connection is **persistent** — it is cached and reused across scheduled trigger calls. This avoids the overhead of connecting/disconnecting on every call. The connection is automatically re-established if it fails during a read operation (one reconnect attempt per call). The connection is dropped and all caches are cleared if a call fails after reconnect.

### Dynamic tags ignore quality_filter

The `tag_nodes` feature only accepts values with **"good"** quality, regardless of the `quality_filter` setting. This is by design — tag values are identifiers (serial number, machine ID) and must be reliable. An uncertain or bad serial number should not become an InfluxDB tag.

### Quality filter with "bad" category

Including `"bad"` in `quality_filter` has no practical effect. Nodes with bad StatusCode have no value on the OPC UA server — the plugin cannot write a non-existent value. These nodes will still generate `NodeReadError` exceptions even if "bad" is in the filter.

### filter applies to browse_tags variables

The `filter` regex applies to **all** discovered variables, including those listed in `browse_tags`. If you use `filter` and `browse_tags` together, the browse_tags variable names must also match the filter pattern, otherwise they won't be discovered.

Example: with `browse_tags = ["room"]` and `filter = "temp|hum"`, the `room` variable will **not** be found. Use `filter = "room|temp|hum"` instead.

### filter in nested hierarchies

The `filter` regex is applied to the **original Variable browse name**, not to the resulting prefixed field name. In nested hierarchies where Objects beyond `path_tags` become field prefixes, `filter` matches the variable's own name at its level in the tree.

Example with `path_tags = ["device"]` and `browse_depth = 3`:
```
Robot_001 (Object, depth 1) -> tag: device=Robot_001
  +-- Position (Object, depth 2) -> prefix: "Position_"
  |   +-- X (Variable)           -> field: "Position_X"
  |   +-- Y (Variable)           -> field: "Position_Y"
  +-- Speed (Variable)           -> field: "Speed"
```
- `filter = "X|Speed"` matches `X` and `Speed` — writes fields `Position_X` and `Speed`
- `filter = "Position_X"` matches **nothing** — `Position_X` is the field name, not the browse name

### exclude_branches vs filter

`exclude_branches` and `filter` are independent parameters that operate on different node types:

- **`exclude_branches`** matches **Object** node browse names — skips the entire branch (Object + all children)
- **`filter`** matches **Variable** node browse names — includes/excludes individual leaf values

They can be used together. For example, `exclude_branches = "Debug_.*"` with `filter = "Temperature|Pressure"` will first skip all debug Object branches, then among remaining branches only discover Temperature and Pressure variables.

### browse_tags follow quality_filter

Unlike `tag_nodes` which always require "good" quality, `browse_tags` variables are subject to the normal `quality_filter` setting. If `quality_filter = ["good", "uncertain"]`, browse_tags with uncertain quality will be accepted.

### Groups with only browse_tags produce no data point

If all variables in a device group are listed in `browse_tags` (no regular fields remain), no data point is written for that group. InfluxDB requires at least one field per point — browse_tags alone are not sufficient.

### Discovery caching

Two independent caches, each with its own TTL:

- **Parsed configuration** — cached for `config_cache_ttl` seconds (default **1 hour**). Controls how quickly a change to credentials, endpoint, table, or filters is picked up.
- **Discovered browse structure** — cached for `browse_cache_ttl` seconds (default **1 hour**). Discovery runs on the first call and every `browse_cache_ttl` seconds thereafter; cached node IDs are read in between.

This means:
- Set a low `browse_cache_ttl` for a fast-changing address space, or set it much larger than the trigger interval so discovery runs rarely while collection stays frequent — the recommended pattern for large or high-latency servers where a full browse is expensive
- New devices added to the OPC UA server appear after at most `browse_cache_ttl` seconds
- Changes to the config take effect after at most `config_cache_ttl` seconds. Changes to the browse-relevant part (`server_url`, `browse_root`, `browse_depth`, `filter`, `exclude_branches`, …) also trigger an immediate re-browse on the next config reload; other changes keep the cached structure
- A failed connection drops the cached config, so a credential or endpoint fix is retried on the next call rather than after `config_cache_ttl`
- `disable_config_cache = true` disables both caches, so config and address space are re-read on every call
- Any unhandled error clears all caches, forcing a fresh reload on the next call

### Namespace URI resolution

When using `nsu=` node IDs (either from `namespaces` aliases in CLI mode or directly in TOML), the URI-to-index resolution happens **once at connection time**. The resolved numeric indexes are stored in the config object. If the server assigns different namespace indexes after a restart, the plugin will re-resolve them on the next reconnect.

This applies to `nodes`, `tag_nodes`, and `browse_root` — use `browse_root = "nsu=<uri>;s=..."` in browse mode for the same restart stability. If the URI is not found on the server, connection fails with a configuration error rather than browsing into an empty result.

### Namespace aliases in TOML vs CLI

In **CLI arguments** mode, you can define short aliases (for example, `siemens`) via the `namespaces` parameter and use them in `nodes` and `tag_nodes` definitions. In **TOML** mode, aliases are not supported — use the full `nsu=<uri>;...` format directly in node IDs. The `[opcua.namespaces]` section in TOML is validated but not used for alias substitution.

## Troubleshooting

### Check Plugin Logs

```bash
influxdb3 query --database _internal \
  "SELECT * FROM system.processing_engine_logs
   WHERE trigger_name = 'opcua_ingestion'
   ORDER BY time DESC LIMIT 20"
```
### Common Issues

#### "asyncua library not installed" or "No module named 'asyncua'"

```bash
influxdb3 install package asyncua
```
#### "Configuration file not found"

- For relative paths, ensure `PLUGIN_DIR` environment variable is set
- For absolute paths, verify the file exists at the specified location

```bash
# For relative paths
export PLUGIN_DIR=~/.plugins
ls $PLUGIN_DIR/my_opcua_config.toml

# Or use absolute path
ls /etc/opcua/my_opcua_config.toml
```
#### "Failed to connect to OPC UA server"

- Verify server URL and port (`opc.tcp://host:port`)
- Check network connectivity to the OPC UA server
- Ensure the OPC UA server is running and accepting connections
- For secure connections, verify that the server trusts the client certificate

#### "Certificate and private_key required when security_policy is set"

When using a security policy, both files are required:
- `certificate`: Client certificate in DER format (`.der`)
- `private_key`: Client private key in PEM format (`.pem`)

#### "Invalid 'server_url' scheme"

- `server_url` must use the `opc.tcp://` or `opc.tls://` scheme
- Other schemes (`file://`, `http://`, etc.) are rejected

#### "Refusing to send username/password over an unencrypted connection"

- `username`/`password` are set but no `security_policy` is configured
- Configure a `security_policy` for an encrypted connection (recommended)
- Or, only on a trusted network, set `allow_insecure_auth = true` to permit cleartext credentials

#### "Namespace URI not found on server"

- The `nsu=` URI does not match any namespace registered on the server
- Use an OPC UA browser (UaExpert) to see the server's namespace array
- Namespace URIs are case-sensitive

#### "Bad status" errors for specific nodes

- Verify the node ID exists on the server (use an OPC UA browser like UaExpert)
- Check that the configured user has read access to the node
- The node may be temporarily unavailable — check the server's diagnostic info

#### "Null value" for a node

- The node exists but has no value assigned
- The server may not have initialized the variable yet
- Check the node's status in an OPC UA client tool

#### All nodes failing

- Verify the namespace index is correct (namespaces may differ between server restarts — consider using `nsu=` URIs instead)
- Use an OPC UA browser to confirm the exact node IDs
- Check server logs for access control issues

#### "Browse discovered no variables" (browse mode)

- Verify `browse_root` points to a valid node that contains Object or Variable children
- If `browse_root` uses a numeric `ns=` index, confirm the index is still current — it can shift after a server restart. Use `nsu=<uri>;s=...` instead so the plugin resolves the index at connection time
- Check that `browse_depth` is sufficient to reach Variable nodes
- The root node may contain nodes of other types (for example, Methods) — only Objects and Variables are traversed
- If using `filter`, verify the regex pattern matches your variable names
- If using `exclude_branches`, verify the pattern is not excluding all Object nodes at a required depth
- Use an OPC UA browser (UaExpert) to inspect the address space structure

#### Config changes not taking effect

- Configuration is cached for `config_cache_ttl` seconds (default 1 hour) — either wait for expiry, lower `config_cache_ttl`, or set `disable_config_cache = true`
- Any plugin error automatically clears the cache

#### "Previous opcua call still running, skipping this tick"

- The plugin reuses a single cached connection and event loop, which cannot be used by two calls at once. With an asynchronous trigger (`--run-asynchronous`), scheduled invocations may overlap; if a call is still running when the next tick fires, that tick is skipped instead of failing.
- Occasional skips are harmless. Frequent skips mean each read takes longer than the interval — reduce the per-call runtime or give it more time:
  - Read fewer nodes per trigger, or narrow browse mode (smaller `browse_depth`, tighter `filter`/`exclude_branches`)
  - Increase the trigger interval (e.g. `--trigger-spec "every:30s"` instead of `every:10s`)
  - Check for a slow or unreachable server adding connection latency

## Limitations

- **Polling only**: The plugin reads current values on each scheduled call. It does not use OPC UA subscriptions for change-based monitoring. Fast-changing signals may be missed between polling intervals.
- **No Historical Data Access (HDA)**: Only current values are read, not historical data from the server.
- **No write support**: The plugin only reads from OPC UA nodes. Writing values or calling methods is not supported.
- **Scalar values only**: Arrays, structures, ExtensionObjects, and other complex data types are converted to string representation.
- **Single table**: All nodes (or all browsed devices) are written to one measurement. For multiple tables, create separate plugin triggers.
- **Browse mode requires hierarchy**: Browse discovers nodes based on the OPC UA address space hierarchy. If the server uses a flat namespace with dotted identifiers (for example, `API15_Histo1.zone_5130.Signal`) rather than a folder tree, browse mode will not discover child signals — use `name_tags` with `name_separator` to extract hierarchy from flat names, or use explicit nodes mode instead.
- **No OPC-DA support**: Only OPC UA (Unified Architecture) is supported. Legacy OPC-DA (COM/DCOM-based) connections require a separate gateway.

## Logging

Logs are stored in the `_internal` database (or the database where the trigger is created) in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database _internal "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'your_trigger_name'"
```

Log columns:
- **event_time**: Timestamp of the log event
- **trigger_name**: Name of the trigger that generated the log
- **log_level**: Severity level (INFO, WARN, ERROR)
- **log_text**: Message describing the action or error

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
