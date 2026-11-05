<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
> **Note:** This plugin requires {{% product-name %}}.8.2 or later, `paho-mqtt>=2.1,<3`, `protobuf>=5` and
> `influxdata-plugin-utils>=0.5.0`.


The MQTT Sparkplug B Publisher turns {{% product-name %}} into a **Sparkplug B Edge Node**.
As rows are written, it publishes them to an MQTT broker as a compliant
`spBv1.0` session — Protocol Buffers payloads, birth and death certificates,
sequence numbers and aliases — so a SCADA system, Ignition, or any Sparkplug
host application consumes the data natively.

- **A real Edge Node, not a passthrough**: `NBIRTH` announces the metric set,
  `NDATA`/`DDATA` carry the values, `NDEATH`/`DDEATH` report loss, `bdSeq` and
  `seq` keep the session ordered, and aliases keep each message compact
- **Devices from your data**: publish at node level, one device per source
  table, or one device per distinct tag value
- **Store-and-forward**: a broker outage buffers rows in memory under a byte
  budget and a drop policy, then replays them with `is_historical` so old data
  never overwrites the host's live value
- **Survives across writes**: one background sender owns the connection, the
  sequence numbers and the buffer, so a slow or down broker never blocks writes
- **Rebirth, STATE and takeover handled**: answers a host's rebirth `NCMD`,
  gates on a primary host's `STATE`, and detects an orphan takeover

## Contents

- [How it works](#how-it-works) — the Edge Node session and the background sender
- [Deployment: one session per node](#deployment-one-session-per-node) — read this first
- [Devices and metrics](#devices-and-metrics) — how rows become Sparkplug metrics
- [Store-and-forward](#store-and-forward) — the buffer, historical data and draining
- [Rebirth, STATE and takeover](#rebirth-state-and-takeover)
- [Setup](#setup) · [Examples](#examples) · [Parameters](#parameters)
- [Where settings come from](#where-settings-come-from) · [Installation](#installation)
- [Observability](#observability) · [Troubleshooting](#troubleshooting)

---

## How it works

### The Edge Node session

The plugin owns one Sparkplug Edge Node, identified by `sparkplug_group_id` and
`sparkplug_edge_node_id`. Every topic is `spBv1.0/<group>/<type>/<edge_node>`,
with a device appended for device-level messages:

| Message  | Topic                                      | When                                          |
|----------|--------------------------------------------|-----------------------------------------------|
| `NBIRTH` | `spBv1.0/<group>/NBIRTH/<node>`            | On connect: declares every node metric        |
| `NDATA`  | `spBv1.0/<group>/NDATA/<node>`             | Node-level values                             |
| `NDEATH` | `spBv1.0/<group>/NDEATH/<node>`            | Registered as the MQTT will; also on offline  |
| `DBIRTH` | `spBv1.0/<group>/DBIRTH/<node>/<device>`   | Declares a device's metrics                   |
| `DDATA`  | `spBv1.0/<group>/DDATA/<node>/<device>`    | Device values                                 |
| `DDEATH` | `spBv1.0/<group>/DDEATH/<node>/<device>`   | A device idle past `sparkplug_device_timeout` |
| `NCMD`   | `spBv1.0/<group>/NCMD/<node>` (subscribed) | A host asks for a rebirth                     |
| `STATE`  | `spBv1.0/STATE/<host>` (subscribed)        | Primary host online/offline                   |

Each connect carries a fresh `bdSeq` (matching the will's) and starts `NBIRTH`
at `seq=0`; every message after it increments `seq`, wrapping at 255. Each
metric is declared once in a birth with a name and an **alias**, and after that
every `NDATA`/`DDATA` carries only the alias, which keeps messages small.

### The background sender

Publishing does not happen on the write path. A write validates the
configuration, turns the batch into compact buffered entries, and returns
immediately. A **background sender** owns the MQTT connection, the sequence
numbers and the buffer: it connects, publishes the births, drains the buffer,
answers rebirths and runs the watchdog. A broker that is slow or down therefore
never blocks writes into InfluxDB.

If no write arrives for `idle_disconnect`, the sender publishes `NDEATH` and
shuts the connection down, so a deleted or idle trigger cannot leave an orphan
session alive until the server restarts.

---

## Deployment: one session per node

**A Sparkplug Edge Node is a single identity; two live sessions for one
`group`/`node` pair fight over the broker.** Deploy accordingly:

- **Create the trigger WITHOUT `--run-asynchronous`.** A synchronous trigger
  ensures exactly one sender is ever built.
- **Run exactly one process node for this trigger.** On a multi-node cluster the
  node specification picks only the owner, but runs are placed round-robin across **every** process node, so two process
  nodes would stand up two sessions. A
  single `--mode all` node (the Docker default) or one standalone `--mode
  process` node is the supported shape.
- **Keep `client_id` stable** across trigger recreations (the default already is,
  derived from the group and node). The broker then evicts an orphan of the same
  identity by takeover.

---

## Devices and metrics

`sparkplug_device_from` decides how a row maps to a Sparkplug device:

| `sparkplug_device_from` | Result                                        | Metric name   | Needs                    |
|-------------------------|-----------------------------------------------|---------------|--------------------------|
| *(unset)*               | Node-level `NDATA`                            | `table/field` | —                        |
| `table`                 | One device per source table                   | `field`       | —                        |
| `tag:<name>`            | One device per distinct value of tag `<name>` | `field`       | exactly one source table |

`payload_fields` is the **declared metric set** of the birth certificate and is
mandatory. Each entry is a column, optionally `name:type` to override the
datatype inferred from the schema; supported types are `int8/16/32/64`,
`uint8/16/32/64`, `float`, `double`, `boolean`, `string` and `datetime`. Signed
integers are encoded as two's-complement in Sparkplug's unsigned fields.

Sparkplug `datetime` is milliseconds since the epoch, but a source column may
hold another unit, so a datetime entry may name it: `name:datetime:unit` with
`unit` one of `s`, `ms` (default), `us` or `ns` — the value is converted to
milliseconds. For example `event_ts:datetime:ns` reads a nanosecond column.

A column written but not in `payload_fields` is not published (and is logged once
at startup). A tag that is neither the device dimension nor pinned to a single
value in `allow_values` is refused at startup, because its series would otherwise
collapse onto one metric name.

---

## Store-and-forward

Nothing is handed to a disconnected client. While the broker is unreachable,
entries accumulate in the buffer up to `max_queue_bytes`, measured by their
in-memory size. At the cap, `drop_policy` decides what goes: `drop_oldest`
(default) keeps the freshest data, `drop_newest` the earliest.

**Historical data.** A row whose own timestamp is older than `now − live_window`
is published with `is_historical = true` rather than as the node's current value,
so a backfill, late data or a WAL replay after a restart never rolls the host's
live value back or re-fires an alarm. `sparkplug_replay_historical = false`
discards those rows instead of replaying them. Rows merely delayed by
back-pressure are seconds old and stay live. `live_window = 0` turns the test off.

**Drain order.** `fifo` (default) drains strictly in order, so after a long
outage live data waits behind the backlog. `live_first` publishes recent rows
first and drains the historical ones with the leftover rate budget, so current
values stay prompt.

**Report by exception.** With `report_by_exception = true` a metric is published
only when its value changed from the last published value — the
Sparkplug-recommended mode for periodically polled sources. `deadband` suppresses
a numeric change smaller than itself.

After a reconnect the buffered data is replayed on the new session with correct,
continuous sequence numbers.

---

## Rebirth, STATE and takeover

- **Rebirth.** A host publishes `Node Control/Rebirth` on `NCMD`; the sender
  answers with the full `NBIRTH` + `DBIRTH` sequence, coalescing a burst of
  requests into one. A rebirth is held while a configured primary host is
  offline, just like the first birth.
- **Primary host STATE.** Set `sparkplug_primary_host_id` to subscribe to
  `spBv1.0/STATE/<id>` and hold the first `NBIRTH` until the host is online. On
  `offline` the node publishes `NDEATH`, stops cleanly, and the next write
  rebuilds it — reconnecting and again waiting for the host to come back online.
- **Takeover.** With MQTT 5 the `0x8E` reason code is exact; on 3.1.1 a run of
  quick post-connect closes (`takeover_attempts`) is read as another client
  taking the identity, after which this client stops and cools down. paho-mqtt
  2.1 leaves a reason-only DISCONNECT undecoded (mosquitto sends `e0 01 8e`), so
  the plugin reads the reason byte itself; if it cannot, MQTT 5 falls back to the
  3.1.1 heuristic.

---

## Setup

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/mqtt_sparkplug_publisher/mqtt_sparkplug_publisher.py \
  --trigger-spec "all_tables" \
  --trigger-arguments 'broker_url=mqtt://broker:1883,sparkplug_group_id=plant1,sparkplug_edge_node_id=influxdb3,source_measurements=press_line,payload_fields=temp pressure' \
  spb_press
influxdb3 enable trigger --database mydb spb_press
```
Batches for any table other than `source_measurements` are ignored, so
`all_tables` is a safe trigger specification and keeps a sparse source table
from idling the client out.

---

## Examples

Source row used throughout:

```
press_line,machine=press7 temp=21.5,pressure=4.2 1791019630123456789
```
**Node-level metrics.** No device; metric names are `table/field`:

```bash
--trigger-arguments 'broker_url=mqtt://broker:1883,sparkplug_group_id=plant1,sparkplug_edge_node_id=influxdb3,source_measurements=press_line,payload_fields=temp pressure'
```
```
spBv1.0/plant1/NBIRTH/influxdb3   bdSeq, Node Control/Rebirth, press_line/temp, press_line/pressure
spBv1.0/plant1/NDATA/influxdb3    press_line/temp=21.5, press_line/pressure=4.2   (is_historical if old)
```
**A device per machine.** One source table, device from the `machine` tag;
metric names are the bare field names:

```bash
--trigger-arguments 'broker_url=mqtt://broker:1883,sparkplug_group_id=plant1,sparkplug_edge_node_id=influxdb3,source_measurements=press_line,payload_fields=temp pressure,sparkplug_device_from=tag:machine'
```
```
spBv1.0/plant1/DBIRTH/influxdb3/press7   temp, pressure
spBv1.0/plant1/DDATA/influxdb3/press7    temp=21.5, pressure=4.2
```
**Publish only changed values, with a deadband.** Typed metric and filters
contain commas, so this one goes in a TOML file:

```toml
broker_url = "mqtts://broker:8883"
sparkplug_group_id = "plant1"
sparkplug_edge_node_id = "influxdb3"
source_measurements = ["press_line"]
payload_fields = ["temp", "pressure", "count:int64"]
report_by_exception = true
deadband = 0.5
filters = [["temp", ">=", 185]]
tls_ca_cert = "certs/ca.pem"
```
```bash
--trigger-arguments 'config_file_path=mqtt_sparkplug_publisher_config.toml'
```
> The trigger CLI splits on commas, so any value containing a comma — a typed
> metric list, `filters`, `allow_values` — belongs in the TOML file, which is
> also the right place for credentials.

---

## Parameters

**Required**

| Parameter                | Default      | Example                          | What it does                                                                                                                                                                                                                                                                                    |
|--------------------------|--------------|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `broker_url`             | **required** | `mqtt://broker.example.com:1883` | Broker address and transport in one value: `mqtt://`, `mqtts://`, `ws://`, `wss://`, `unix:///path`, or a bare `host[:port]`. Port defaults by scheme.                                                                                                                                          |
| `sparkplug_group_id`     | **required** | `plant1`                         | Sparkplug Group ID, the second topic token. No `/`, `+` or `#`. With the edge node id, must be unique across the infrastructure.                                                                                                                                                                |
| `sparkplug_edge_node_id` | **required** | `influxdb3`                      | Sparkplug Edge Node ID, the fourth topic token. No `/`, `+` or `#`.                                                                                                                                                                                                                             |
| `source_measurements`    | **required** | `press_line weld_line`           | Space-separated source tables; exactly one when `sparkplug_device_from` names a tag. Other tables are ignored, so `all_tables` is a safe spec.                                                                                                                                                  |
| `payload_fields`         | **required** | `temp pressure count:int64`      | Space-separated metric columns, each optionally `name:type` to override the inferred datatype; a datetime may add a source unit as `name:datetime:unit` (`s`/`ms`/`us`/`ns`, default `ms`), converted to the milliseconds Sparkplug requires. The declared metric set of the birth certificate. |

**Connection**

| Parameter               | Default                 | Example      | What it does                                                                                                                                                                                                             |
|-------------------------|-------------------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `client_id`             | `influxdb3-spb-<8 hex>` | `plant-spb`  | MQTT client identifier, stable by default so the broker evicts an orphan by takeover. Set only when ACLs require a known one; keep it stable.                                                                            |
| `mqtt_version`          | `3.1.1`                 | `5`          | `3.1.1` (default) or `5`. MQTT 5 is strongly recommended: it carries the `0x8E` takeover reason code and the broker's Maximum Packet Size.                                                                               |
| `username`              | *(empty)*               | `publisher`  | User name sent in CONNECT. Never logged.                                                                                                                                                                                 |
| `password`              | *(empty)*               | `<password>` | Password. Prefer the TOML file: trigger arguments are readable from the system tables. Never logged.                                                                                                                     |
| `keep_alive`            | `60`                    | `30`         | Seconds declared in CONNECT, minimum 1. A dropped link is detected after about 1.5× this; QoS 0 data sent meanwhile is lost but counted published.                                                                       |
| `reconnect_min_backoff` | `1s`                    | `2s`         | Shortest gap between connection attempts, doubling to the ceiling, reset on a successful CONNACK.                                                                                                                        |
| `reconnect_max_backoff` | `120s`                  | `60s`        | Ceiling for the backoff doubling.                                                                                                                                                                                        |
| `takeover_attempts`     | `3`                     | `5`          | Consecutive quick post-connect closes read as a takeover, after which the client stops. Integer ≥ 2. Used on MQTT 3.1.1; MQTT 5 reads the `0x8E` reason code instead and falls back to this only when it cannot be read. |
| `idle_disconnect`       | `1h`                    | `30min`      | After this long with no invocation the sender publishes `NDEATH` and exits. Minimum 1min. Use the `all_tables` spec so a sparse table does not idle it out.                                                              |

**Sparkplug**

| Parameter                     | Default   | Example       | What it does                                                                                                                                                                             |
|-------------------------------|-----------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sparkplug_device_from`       | *(empty)* | `tag:machine` | Empty (node-level `NDATA`, names `table/field`), `table` (per-table device), or `tag:<name>` (one device per tag value, needs one source table).                                         |
| `sparkplug_device_timeout`    | `0`       | `5min`        | Publish `DDEATH` for a device idle this long, and `DBIRTH` again when it returns. `0` never does, since an idle device cannot be told from a removed one.                                |
| `sparkplug_primary_host_id`   | *(empty)* | `scada1`      | Set to subscribe to `spBv1.0/STATE/<id>`, wait for `online` before the first `NBIRTH`, and on `offline` publish `NDEATH`, stop, and rebuild on the next write (awaiting `online` again). |
| `live_window`                 | `5min`    | `0`           | A row older than `now − live_window` is published `is_historical = true` instead of as the current value. `0` turns the test off (every row live).                                       |
| `sparkplug_replay_historical` | `true`    | `false`       | What happens to rows marked historical by `live_window`: `true` republishes them `is_historical = true`; `false` discards them. Live rows unaffected.                                    |
| `report_by_exception`         | `false`   | `true`        | Publish a metric only when its value changed from the last published for that alias. The Sparkplug-recommended mode for periodically polled sources.                                     |
| `deadband`                    | `0`       | `0.5`         | With `report_by_exception`, a numeric change smaller than this is treated as no change, to suppress analog noise.                                                                        |

**TLS** (for `mqtts://` and `wss://`; a relative path resolves under `PLUGIN_DIR`)

| Parameter                  | Default   | Example            | What it does                                                                                          |
|----------------------------|-----------|--------------------|-------------------------------------------------------------------------------------------------------|
| `tls_ca_cert`              | *(empty)* | `certs/ca.pem`     | CA certificate; omit to use the system trust store.                                                   |
| `tls_client_cert`          | *(empty)* | `certs/client.pem` | Client certificate for mutual TLS.                                                                    |
| `tls_client_key`           | *(empty)* | `certs/client.key` | Client private key. Must be unencrypted; a passphrase-protected key is refused at configuration time. |
| `tls_insecure_skip_verify` | `false`   | `true`             | Skip certificate chain and hostname verification. Leave `false` outside a lab.                        |
| `tls_alpn`                 | *(empty)* | `x-amzn-mqtt-ca`   | ALPN protocol name, how AWS IoT Core serves MQTT on port 443.                                         |

**WebSocket** (for `ws://` and `wss://`)

| Parameter    | Default           | Example                      | What it does                                                                         |
|--------------|-------------------|------------------------------|--------------------------------------------------------------------------------------|
| `ws_path`    | from `broker_url` | `/mqtt`                      | Path for the WebSocket connection.                                                   |
| `ws_headers` | *(empty)*         | `Authorization:'Bearer abc'` | Extra headers on the upgrade: space-separated `name:'value'` pairs, or a TOML table. |

**Row selection**

| Parameter      | Default   | Example                        | What it does                                                                                                                                                                                                                             |
|----------------|-----------|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `filters`      | *(empty)* | `temp:'>=185' state:'!=error'` | Per-row comparisons with `=`, `!=`, `>`, `<`, `>=`, `<=`. As a string, space-separated `column:'op value'` pairs; in a file, `[column, op, value]` triples. A numeric value compares numerically; quote it (`'185'`) to compare as text. |
| `allow_values` | *(empty)* | `machine:'press7 press8'`      | Membership tests, matched as strings. Only listed rows pass. Also the way to pin a non-device tag to one value so several series do not merge onto one metric.                                                                           |
| `deny_values`  | *(empty)* | `machine:'press9'`             | Rows whose value is listed are skipped; a deny wins over an allow.                                                                                                                                                                       |

**Delivery and buffering**

| Parameter                 | Default       | Example       | What it does                                                                                                                                                                                                        |
|---------------------------|---------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `max_payload_bytes`       | `122880`      | `262144`      | Largest message built, counting topic and properties. A per-device batch is split to stay under it; the birth size is checked before connecting. Integer ≥ 1024. Clamped by an MQTT 5 broker's Maximum Packet Size. |
| `max_queue_bytes`         | `67108864`    | `16777216`    | The only bound on the in-memory buffer, measured by the entries' in-memory size. Integer ≥ 1024. Per trigger; every trigger shares one engine process.                                                              |
| `drop_policy`             | `drop_oldest` | `drop_newest` | At the buffer cap: `drop_oldest` (default) keeps the freshest data, `drop_newest` the earliest.                                                                                                                     |
| `drain_order`             | `fifo`        | `live_first`  | `fifo` (default) drains in order; `live_first` publishes recent rows first and drains historical ones with the leftover rate budget.                                                                                |
| `max_message_age`         | `0`           | `10min`       | On drain, a buffered entry older than this is discarded instead of published. Duration or `0` (never).                                                                                                              |
| `max_messages_per_second` | `0`           | `500`         | Token-bucket cap on how fast the sender hands messages over, and on the `DBIRTH` burst. Integer ≥ 1, or `0` (no limit).                                                                                             |
| `max_unconfirmed_bytes`   | `16777216`    | `4194304`     | Back-pressure threshold, as the total size handed over and not yet reported back. Integer ≥ 65536.                                                                                                                  |

**Common**

| Parameter             | Default   | Example                                | What it does                                                                                                                                                          |
|-----------------------|-----------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `config_file_path`    | *(empty)* | `mqtt_sparkplug_publisher_config.toml` | TOML file under `PLUGIN_DIR` holding any of these settings. Read after the environment and the arguments and winning over both; the place for commas and credentials. |
| `stats_interval`      | `1min`    | `5min`                                 | How often counters are written to `mqtt_sparkplug_publisher_stats` and summarised in the log. Duration or `0` (log summary only, no measurement).                     |
| `enable_full_logging` | `false`   | `true`                                 | When `false`, an exception is logged as its type only; reason codes and errno are logged either way. Credentials are never logged.                                    |

---

## Where settings come from

Every setting may come from three layers, applied in order, each winning over
the one before:

1. **Environment** — `INFLUXDB3_MQTT_SPARKPLUG_PUBLISHER_<SETTING>` (uppercase).
2. **Trigger arguments** — `--trigger-arguments 'key=value,key=value'`.
3. **TOML file** — `config_file_path`, read from `PLUGIN_DIR`.

A list is space-separated in an argument (`payload_fields=temp pressure`) and a
native array in TOML (`payload_fields = ["temp", "pressure"]`). Because the CLI
splits arguments on commas, put any value containing a comma — and all
credentials — in the TOML file. See `mqtt_sparkplug_publisher_config.toml` for
a documented template.

---

## Installation

- **{{% product-name %}}**: 3.8.2 or later, with the Processing Engine enabled
- **Python packages**: `influxdata-plugin-utils>=0.5.0`, `paho-mqtt>=2.1,<3`, `protobuf>=5`

> One virtual environment serves every plugin on a node, so a package pinned by
> one plugin affects the others. This plugin requires `paho-mqtt` 2.x and runs
> alongside the other MQTT plugins without conflict. Its Sparkplug codec is built
> from a descriptor embedded in the plugin rather than a generated module or a
> library such as `pysparkplug`, so the plugin ships as a single file and pins no
> `protobuf` version — it will not downgrade packages the other plugins rely on.

1. Start {{% product-name %}} with the Processing Engine enabled:

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install the packages:

   ```bash
   influxdb3 install package influxdata-plugin-utils
   influxdb3 install package paho-mqtt
   influxdb3 install package protobuf
   ```
---

## Observability

Counters reach the log as a summary line and the `mqtt_sparkplug_publisher_stats`
table in the trigger's own database, at most once per `stats_interval`.

| Field                                         | Meaning                                                          |
|-----------------------------------------------|------------------------------------------------------------------|
| `published`                                   | Data messages handed to the socket                               |
| `confirmed`                                   | Message ids the broker took (at QoS 0, the socket write)         |
| `buffered`                                    | Metrics that entered the buffer                                  |
| `dropped_policy`                              | Discarded by `drop_policy` at `max_queue_bytes`                  |
| `dropped_age`                                 | Discarded by `max_message_age`                                   |
| `dropped_historical`                          | Discarded by `sparkplug_replay_historical = false`               |
| `dropped_unencodable`                         | A metric that could not be encoded, or alone exceeds the limit   |
| `dropped_shutdown`                            | Buffered metrics dropped when the watchdog reaped an idle client |
| `lost`                                        | QoS 0 messages a dropped connection took with it                 |
| `reconnects`                                  | Connections after the first                                      |
| `rebirths_served`                             | Rebirth requests answered                                        |
| `births`                                      | Birth sequences published                                        |
| `command_errors`                              | `NCMD`/`STATE` messages that failed to decode                    |
| `sender_errors`                               | Unexpected errors the sender caught and carried on from          |
| `queue_depth`, `queue_bytes`, `devices_known` | The buffer and the live device set right now                     |

Rows are tagged with `broker` (`host:port`), `group` and `edge_node`.

**"Published" is not a delivery count.** At QoS 0 it means the message reached
the socket, nothing about the broker having received it. A low `keep_alive`
shortens the window in which a silently dropped link counts QoS 0 data as
published while it is actually lost.

---

## Troubleshooting

### The host sees no data, but the counters stay green

A broker ACL may be dropping the QoS 0 publishes silently. Subscribe to the
node's own birth topic — `mosquitto_sub -t 'spBv1.0/<group>/NBIRTH/<node>'` — to
confirm delivery. MQTT 5 surfaces an authorization refusal as a reason code; on
3.1.1 it is silent.

### Two sessions keep evicting each other

Two live senders share one `group`/`node` identity. Make sure the trigger runs
on exactly **one** process node and was created **without** `--run-asynchronous`
(see [Deployment](#deployment-one-session-per-node)). A stable `client_id` lets
the broker evict the orphan cleanly rather than flapping.

### Old data overwrites the host's live value

`live_window` is too short or `0`. A backfill or a WAL replay carries old
timestamps; with a `live_window` that covers your backfill horizon those rows go
out `is_historical = true` and the host keeps its current value. Set
`sparkplug_replay_historical = false` to drop them entirely instead.

### A device never disappears after it stops reporting

`sparkplug_device_timeout` defaults to `0`, which never publishes `DDEATH`
because an idle device cannot be told from a removed one. Set it to a duration
longer than the device's normal reporting gap.

### The client stops and will not reconnect for a while

A refused birth (packet too large or not authorized) cools down for five
minutes; a detected takeover cools down for ten seconds, before the next
invocation rebuilds the client. The log line names which. Fix the underlying
cause (payload size, ACL, or the duplicate session) rather than recreating the
trigger in a loop.

### A trigger created before its source table exists

That is expected. The schema cannot be read until the table is written, so the
plugin logs that the table is not found yet and starts without its metrics; they
join the birth automatically on the first write to that table, with a rebirth.
Other source tables that do exist are unaffected.

### The host still shows an old node after I renamed it

Changing `sparkplug_group_id`, `sparkplug_edge_node_id` or `broker_url` publishes
`NDEATH` on the old topics before switching, so the host marks the old node dead.
Changing only a non-identity setting (password, TLS, keep-alive) keeps the same
identity and corrects the host with a fresh `NBIRTH` instead.

### A low `keep_alive` costs more PINGREQ

That is the trade-off: a lower `keep_alive` shortens the window in which a
silently dropped link loses QoS 0 data counted as published, at the cost of more
keep-alive traffic. 15–30s is a reasonable floor on an unreliable link.

---

## Report an issue

For plugin issues, see the
[Plugins repository issues page](https://github.com/influxdata/influxdb3_plugins/issues).


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
