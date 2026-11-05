<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
> **Note:** This plugin requires {{% product-name %}}.8.2 or later and `paho-mqtt>=2.1,<3`.


The MQTT Publisher Plugin sends rows out of {{% product-name %}} to an MQTT broker. It
publishes **what is already in the database** — it computes nothing — which
makes it the outbound half of the pair whose inbound half is `mqtt_subscriber`.

- **Three ways to be driven**: a write trigger publishes rows as they land, a
  scheduled trigger publishes what a table has gained since the previous tick,
  and an HTTP trigger replays a time range on demand
- **Payload shapes consumers expect**: JSON, InfluxDB line protocol, or a
  template you write; one message per row, one per field with the bare value in
  the body, or one carrying a whole batch
- **Topics built from the data**: `plant/{machine}/{_table}` resolves per row,
  and a substituted value can never add a topic level
- **Survives a broker outage**: nothing is handed to a disconnected client; a
  write trigger buffers under a byte budget and a drop policy, while a
  scheduled trigger stops reading and leaves the rows in the database
- **Runs no threads**: the connection lives in the trigger's cache and is
  serviced by the invocation itself

## Contents

- [The three triggers](#the-three-triggers) — what they share, how they differ
- [Common behaviour](#common-behaviour) — the connection and the life of a message
- [Write trigger](#write-trigger) · [Scheduled trigger](#scheduled-trigger) · [HTTP trigger](#http-trigger)
  — each with its own behaviour, full parameter list and examples
- [Topics](#topics) · [Payloads](#payloads) · [Row selection](#row-selection)
- [Where settings come from](#where-settings-come-from) — layers and formats
- [Installation](#installation) · [Observability](#observability) · [Troubleshooting](#troubleshooting)

---

## The three triggers

One plugin file serves all three. They share the connection, the topic and
payload machinery, the filters and the buffer; they differ only in **where the
rows come from** and therefore in what can go wrong.

|                          | **Write** (`table:…`, `all_tables`)                     | **Scheduled** (`every:…`, `cron:…`)              | **HTTP** (`request:…`)                         |
|--------------------------|---------------------------------------------------------|--------------------------------------------------|------------------------------------------------|
| Rows come from           | the batch being written                                 | a query over a moving window                     | a query over a range you name                  |
| Fires when               | data lands                                              | the schedule says so                             | a request arrives                              |
| Latency                  | milliseconds                                            | up to one interval                               | on demand                                      |
| Position is kept by      | nothing — the batch is all there is                     | a **watermark** per table, in the cache          | the request's own range                        |
| While the broker is down | rows are **buffered in memory** under `max_queue_bytes` | nothing is read; the rows stay in the database   | the call stops and reports how far it got      |
| Risk to understand       | memory during a long outage                             | `settle_delay` versus how late the source writes | a range with no bounds replaying a whole table |
| Publishes `status_topic` | yes                                                     | yes                                              | no                                             |

**Which one to use**

| Your source                                                             | Trigger       | Why                                                                                                                                                               |
|-------------------------------------------------------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A table your clients write                                              | **write**     | Publishes within milliseconds, and nothing is read back from the database                                                                                         |
| A table another plugin derives — a rollup, a forecast, an anomaly score | **write**     | A derived row carries the timestamp of the period it describes and is written well after it, so a schedule would find it below the watermark and never publish it |
| A table you want sampled rather than mirrored                           | **scheduled** | One pass per tick, coalesced, paced by the schedule                                                                                                               |
| History, on demand                                                      | **HTTP**      | A bounded replay that leaves the watermark alone                                                                                                                  |

The three can coexist on one database — a write trigger for the live stream and
an HTTP trigger for backfills is the common pairing. Give them **different**
`client_id` values, or none at all, because a broker allows one session per
identifier and evicts the previous holder.

---

## Common behaviour

Everything in this section is the same whichever trigger you use.

### The connection

A connection is built once and kept in `influxdb3_local.cache`, so an
invocation that already has one spends well under a millisecond publishing.
There is **no background network loop**: the invocation pumps the socket
itself, which is what collects acknowledgements and notices a connection that
has gone.

An invocation does this, in order:

1. **Pump briefly.** A pending `FIN` from the broker is seen before any payload
   is handed over.
2. **Decide whether the client can be trusted.** It is replaced — never
   repaired — if the connection dropped, if a connection setting changed, or if
   it has been silent longer than `max_silence`.
3. **Drain the buffer**, handing over as many messages as the in-flight window
   and the back-pressure threshold allow.
4. **Pump again**, collecting whatever acknowledgements arrive within the
   budget.

Three consequences are worth knowing before configuring anything:

|                                                              | What follows                                                                                                                                                                                                     |
|--------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Nothing runs between invocations                             | A trigger invoked less often than 1.5 × `keep_alive` loses its connection between calls and reconnects on the next one — cheaply, but `status_topic` then reports the invocation rhythm rather than availability |
| Acknowledgements are collected only while an invocation runs | At QoS ≥ 1 the confirmed count trails the published one by up to one invocation, and no more than `max_inflight` messages are outstanding at a time                                                              |
| A dropped connection is replaced, never repaired             | Its unconfirmed messages go back to the **head** of the buffer, which is what lets a message the broker keeps refusing be retired after `max_delivery_attempts`                                                  |

**Why replace rather than reconnect.** `reconnect()` leaves paho holding the
messages that were in flight and resending them itself, so the plugin could
never retire one the broker keeps refusing: a single oversized message would
close the connection on every retry and nothing behind it would ever move.

**Why no keepalive ping.** Proving a quiet link needs a `PINGREQ`, which paho
does not expose. A trigger quiet for longer than `max_silence` is close to
being dropped by the broker anyway, so the plugin pre-emptively builds a new
client instead — and on a busy trigger `max_silence` is never reached.

**QoS 0 and silence.** With `qos = 0` there is no acknowledgement to prove the
link is alive, and paho's `PINGRESP` is not visible to the plugin, so a trigger
invoked less often than `max_silence` rebuilds its client on each invocation.
That is harmless — a fresh client still delivers — only slightly wasteful; raise
`max_silence` or use `qos = 1` if the reconnects are unwanted.

### The life of one message

```
row ──filters──▶ topic + payload ──▶ buffer ──▶ publish() ──▶ broker
       │               │               │            │
    skipped        too large      drop_policy    unconfirmed ──ack──▶ confirmed
                   → dropped      max_message_age               │
                                                         reason ≥ 0x80
                                                         → dropped
```
- **Filters** are applied first, so nothing is encoded for a row that will not
  be published.
- **Encoding** produces the topic and the payload. A message larger than
  `max_payload_bytes` is dropped and logged; a `batch` is split instead.
- **The buffer** holds what has not been handed over, bounded by
  `max_queue_bytes` — counted as payload + topic + 320 bytes of Python
  overhead, so the limit tracks real memory rather than payload bytes.
- **Handing over** happens only while the client is connected and the window
  has room. At QoS ≥ 1 the message waits in `unconfirmed` until acknowledged.
- **A reason code of `0x80` or above** (MQTT 5 only) names the message it
  refers to, so there is nothing to retry: it is dropped at once, counted and
  logged, without spending `max_delivery_attempts`. The exception is `0x97`
  *quota exceeded*, which is about the rate rather than the message.

**There is no delivery guarantee in either direction.** A message can be lost:
the buffer lives in memory and a restart discards it, QoS 0 packets go with a
dropped connection, and `drop_policy` and `max_message_age` discard by design.
A message can equally be duplicated: an invocation that fails after handing
rows over re-reads them, and QoS 1 is at-least-once by definition.

---

## Write trigger

Publishes rows as they are written. The trigger specification may be
`table:<name>` or `all_tables`; rows of a table not named in
`source_measurements` are ignored either way, so `all_tables` is safe and is
what you want when the buffer should drain on any write.

### How it behaves

- **The batch is all there is.** These rows exist nowhere the plugin can read
  them back from, so the in-memory buffer is the only thing between a broker
  outage and lost data. That is the opposite of the scheduled trigger, and it
  is why `max_queue_bytes`, `drop_policy` and `max_message_age` matter here.
- **Ingest is never stalled.** An invocation hands over what it can within
  `pump_budget` and returns; whatever is left waits for the next write.
- **No schema is needed up front.** A trigger created before the first write to
  its table starts with a warning and checks its placeholders and filter types
  once the table appears.
- **A column added later is picked up.** On a write trigger the row that brings
  a new column triggers one schema re-read, so a new tag is emitted as a tag
  immediately. A scheduled or backfill trigger selects only the columns it
  already knows, so it picks up a new column within an hour — the schema cache's
  TTL — or at once if the trigger is recreated.

What an outage looks like, with `max_queue_bytes = 64 MiB`,
`drop_policy = drop_oldest`, `max_message_age = 5min`:

```
t+0s     broker killed
t+1s     the pump notices; nothing more is handed over at any QoS
t+0..∞   every invocation appends to the buffer and returns as fast as ever;
         once the budget is reached, drop_policy decides what goes
t+7min   broker returns; the next invocation reconnects, drains the buffer
         oldest-first discarding anything past max_message_age, then publishes
         the new rows
```
### Setup

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/mqtt_publisher/mqtt_publisher.py \
  --trigger-spec "table:press_line" \
  --trigger-arguments 'broker_url=mqtt://broker:1883,source_measurements=press_line,topic=plant/{machine}/{_table}' \
  mqtt_publish_press
influxdb3 enable trigger --database mydb mqtt_publish_press
```
### Examples

Source row used throughout:

```
press_line,machine=press7,line=l1 temp=21.5,pressure=4.2,state="run" 1791019630123456789
```
**Mirror a table to one topic**

```bash
--trigger-arguments "broker_url=mqtt://broker:1883,source_measurements=press_line,topic=test4"
```
```
test4   {"time":"2026-10-03T09:27:10.123456789Z","machine":"press7","line":"l1",
         "temp":21.5,"pressure":4.2,"state":"run"}
```
**A topic per machine, line protocol** — the format to use when the far side is
another InfluxDB, because `mqtt_subscriber` parses it:

```bash
--trigger-arguments "broker_url=mqtt://broker:1883,source_measurements=press_line,topic=plant/{machine}/{_table},payload_format=lineprotocol"
```
```
plant/press7/press_line   press_line,machine=press7,line=l1 temp=21.5,pressure=4.2,state="run" 1791019630123456789
```
**One topic per field, bare values — the Unified Namespace shape**

```bash
--trigger-arguments "broker_url=mqtt://broker:1883,source_measurements=press_line,topic=plant/{machine}/{_field},payload_fields=temp pressure,layout=field,retain=true"
```
```
plant/press7/temp       21.5
plant/press7/pressure   4.2
```
`retain = true` means a dashboard subscribing an hour later sees the current
value at once instead of waiting for the next change.

**Publish only the rows above a threshold.** The template contains commas,
which the trigger CLI would split, so this one goes in a TOML file:

```toml
source_measurements = ["press_line"]
filters = [["temp", ">=", 185]]
topic = "plant/{machine}/cmd/setpoint"
payload_format = "template"
payload_template = '{"setpoint": 180, "reason": "temp {temp}"}'
qos = 1
```
```
plant/press7/cmd/setpoint   {"setpoint": 180, "reason": "temp 187.2"}
```
Remember that `filters` selects **rows, not transitions**: while the
temperature stays above 185, every row that arrives is published.

**Publishing a value another plugin derives.** The trigger is `onwrite`, not
`every:…`, and that is not a matter of taste: a rollup row carries the
timestamp of the *start* of the bin it summarises and is written once that bin
has closed, so a scheduled trigger would find every such row below its
watermark.

```bash
influxdb3 create trigger --database plant \
  --plugin-filename gh:influxdata/mqtt_publisher/mqtt_publisher.py \
  --trigger-spec "table:press_line_1m" \
  --trigger-arguments "broker_url=mqtt://broker:1883,source_measurements=press_line_1m,topic=plant/{machine}/rollup,payload_fields=temp_avg temp_max" \
  publish_rollup
```
**Announcing availability**

```bash
--trigger-arguments "broker_url=mqtt://broker:1883,source_measurements=press_line,topic=plant/{machine}/{_table},status_topic=plant/publisher/status"
```
```
plant/publisher/status   online     (retained, on connect)
plant/publisher/status   offline    (retained, the will, when the connection dies)
```
### Parameters

**Connection**

| Parameter               | Default                 | Example                                         | What it does                                                                                                                                                                                                                                                                                            |
|-------------------------|-------------------------|-------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `broker_url`            | **required**            | `mqtt://broker.example.com:1883`                | Broker address and transport in one value: mqtt://, mqtts://, ws://, wss://, unix:///path, or a bare host[:port]. The port defaults by scheme (1883, 8883, 80, 443) and TLS is chosen by the scheme.                                                                                                    |
| `client_id`             | `influxdb3-pub-<8 hex>` | `plant-publisher`                               | MQTT client identifier, defaulting to influxdb3-pub-<random> and kept across reconnects. The broker allows one session per identifier and evicts the previous holder, so set it only when ACLs require a known one, per trigger rather than in a shared file, and only on a trigger pinned to one node. |
| `username`              | *(empty)*               | `publisher`                                     | User name for the broker.                                                                                                                                                                                                                                                                               |
| `password`              | *(empty)*               | `<your-password>`                               | Password for the broker. Prefer the TOML file or the environment: trigger arguments are readable from the system tables.                                                                                                                                                                                |
| `mqtt_version`          | `3.1.1`                 | `5`                                             | Protocol version: '3.1.1' (default), '5' or '3.1'. Version 5 adds reason codes on acknowledgements, message expiry and broker-declared limits; without it a refused message cannot be told from a delivered one.                                                                                        |
| `keep_alive`            | `300`                   | `60`                                            | Seconds declared in CONNECT, 300 by default. Large on purpose because nothing pings between invocations, but it also caps a TLS handshake and a WebSocket upgrade, so lower it on an unreliable TLS path.                                                                                               |
| `max_silence`           | half of `keep_alive`    | `150s`                                          | How long the connection may be quiet before an invocation replaces it rather than writing into it blind. Defaults to half of keep_alive, and follows an MQTT 5 broker's Server Keep Alive when one is imposed.                                                                                          |
| `connect_timeout`       | `2s`                    | `5s`                                            | Bounds the TCP connect and the wait for CONNACK. It does not bound name resolution or a TLS handshake. Defaults to 2s.                                                                                                                                                                                  |
| `pump_budget`           | `50ms`                  | `200ms`                                         | How long one write invocation may spend running the network loop collecting acknowledgements. Raise it together with max_inflight when a QoS 1 trigger buffers against a healthy broker. Defaults to 50ms.                                                                                              |
| `reconnect_min_backoff` | `1s`                    | `2s`                                            | Shortest gap between connection attempts, doubling on each failure. Defaults to 1s.                                                                                                                                                                                                                     |
| `reconnect_max_backoff` | `120s`                  | `60s`                                           | Ceiling for the backoff doubling, reset once a CONNACK succeeds. Defaults to 120s.                                                                                                                                                                                                                      |
| `tls_ca_cert`           | *(empty)*               | `certs/ca.pem`                                  | CA certificate for mqtts:// or wss://. A relative path resolves under PLUGIN_DIR; omit to use the system trust store.                                                                                                                                                                                   |
| `tls_cert`              | *(empty)*               | `certs/client.pem`                              | Client certificate for mutual TLS.                                                                                                                                                                                                                                                                      |
| `tls_key`               | *(empty)*               | `certs/client.key`                              | Client private key for mutual TLS. Must be unencrypted; a passphrase-protected key is refused at configuration time.                                                                                                                                                                                    |
| `tls_insecure`          | `false`                 | `true`                                          | Skip server certificate verification. Defaults to false and should stay there outside a laboratory.                                                                                                                                                                                                     |
| `ws_path`               | from `broker_url`       | `/mqtt`                                         | Path for a WebSocket connection when it differs from the one in broker_url. Ignored outside ws:// and wss://.                                                                                                                                                                                           |
| `ws_headers`            | *(empty)*               | `Authorization:'Bearer abc' X-Tenant:'plant-1'` | Extra headers on the WebSocket upgrade, for brokers that authenticate there: space-separated name:'value' pairs, or a table of name to value in a TOML file or a request body. Ignored outside ws:// and wss://.                                                                                        |

**Availability**

| Parameter                | Default   | Example                  | What it does                                                                                                                                                                                                                             |
|--------------------------|-----------|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `status_topic`           | *(empty)* | `plant/publisher/status` | Retained availability topic. The online payload is published on every connect and the offline one is registered as the MQTT will. Meaningful only when invocations are more frequent than keep_alive; the HTTP trigger never touches it. |
| `status_online_payload`  | `online`  | `up`                     | Payload published retained on status_topic after every successful connect. Defaults to 'online'.                                                                                                                                         |
| `status_offline_payload` | `offline` | `down`                   | Payload registered as the MQTT will, so the broker emits it when the connection dies unexpectedly. Defaults to 'offline'.                                                                                                                |

**Source**

| Parameter             | Default      | Example                | What it does                                                                                                                                                                                                                                                            |
|-----------------------|--------------|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source_measurements` | **required** | `press_line weld_line` | Tables to publish, space-separated or as a list. On a write trigger, batches for any other table are ignored, so the trigger specification may safely be all_tables. On a schedule each is read in turn; on HTTP the first is the default table a request may override. |

**Row selection**

| Parameter      | Default   | Example                             | What it does                                                                                                                                                                                                                                                                                                                                        |
|----------------|-----------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `filters`      | *(empty)* | `temp:'>=185' state:'!=error'`      | Comparisons applied before any message is built, with =, !=, >, <, >= and <=. As a string, space-separated column:'operator value' pairs with each value quoted; in a TOML file or a request body, also a list of [column, operator, value] triples. A row lacking the column fails a positive test and passes '!='.                                |
| `allow_values` | *(empty)* | `machine:'press7 press8' line:'l1'` | Membership tests: as a string, space-separated column:'values' pairs with each list quoted; in a TOML file or a request body, also a table of column to values. Only rows whose value is listed are published, and a column not named here is unconstrained. Values are matched as strings, so for a numeric or boolean column use filters instead. |
| `deny_values`  | *(empty)* | `machine:'press9' line:'l9'`        | Same forms as allow_values. Rows whose value is listed are skipped, a deny match wins over an allow match, and a row lacking the column is published.                                                                                                                                                                                               |

**Message**

| Parameter             | Default      | Example                                      | What it does                                                                                                                                                                                                                                                                                         |
|-----------------------|--------------|----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `topic`               | **required** | `plant/{machine}/{_table}`                   | Topic to publish to. A plain string is valid; {column} is replaced by that column's value in the row, {_table} by the table name and {_field} by the field name under layout=field. A substituted value may not contain /, + or #.                                                                   |
| `topic_missing_value` | *(unset)*    | `unknown`                                    | Substitute for a placeholder whose column is empty on a row. Unset, such a row is skipped and counted.                                                                                                                                                                                               |
| `payload_format`      | `json`       | `lineprotocol`                               | Encoder: 'json' (default), 'lineprotocol' or 'template'. Ignored under layout=field, whose payload is the bare value.                                                                                                                                                                                |
| `payload_fields`      | *(empty)*    | `temp pressure`                              | Columns that reach the payload, space-separated or as a list; empty means every field and tag of the row. It narrows the payload only, not what a topic placeholder may refer to.                                                                                                                    |
| `payload_template`    | *(empty)*    | `{"setpoint": 180, "reason": "temp {temp}"}` | Required when payload_format=template. Uses the same placeholders as topic; a brace group that is not a placeholder stays literal, and {{ }} produce literal braces.                                                                                                                                 |
| `layout`              | `row`        | `field`                                      | 'row' (default) publishes one message per row, 'batch' one message per topic per invocation, 'field' one message per field carrying the bare value.                                                                                                                                                  |
| `time_format`         | `rfc3339`    | `ms`                                         | How a timestamp is rendered in a json payload and in a {time} placeholder, which payload_template accepts and topic refuses: 'rfc3339' (default), 'ms' or 'ns'. 'ns' exceeds the largest integer JavaScript represents exactly. Ignored by lineprotocol, whose grammar requires integer nanoseconds. |
| `qos`                 | `0`          | `1`                                          | Delivery guarantee asked of the broker: 0 (default), 1 or 2. QoS 2 is not recommended, being not exactly-once under a clean session and hiding a refusal at PUBREC.                                                                                                                                  |
| `retain`              | `false`      | `true`                                       | Set the MQTT retain flag, so a subscriber arriving later sees the current value at once. Defaults to false.                                                                                                                                                                                          |

**Limits and buffering**

| Parameter               | Default       | Example       | What it does                                                                                                                                                                                                                                                                                             |
|-------------------------|---------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `max_messages`          | `10000`       | `2000`        | Source rows one query reads at a time, which is what LIMIT receives: the page size of a scheduled tick and of a backfill call. The number of messages follows from layout. It does not apply to a write trigger, whose batch is encoded whole and bounded by max_queue_bytes instead. Defaults to 10000. |
| `max_payload_bytes`     | `122880`      | `262144`      | Largest message built, counting topic and properties. A batch is split to stay under it; a single row that still does not fit is dropped, counted and logged. Defaults to 122880, eight bytes short of AWS IoT Core's cap.                                                                               |
| `max_delivery_attempts` | `3`           | `5`           | Hand-overs before a message is treated as undeliverable, then dropped, counted and logged. An attempt is charged only to the oldest unconfirmed message. Defaults to 3.                                                                                                                                  |
| `max_queue_bytes`       | `67108864`    | `16777216`    | Bound on the in-memory buffer, counted as payload plus topic plus a per-message overhead so that it tracks real memory. Per trigger, and every trigger shares one engine process. Defaults to 67108864.                                                                                                  |
| `drop_policy`           | `drop_oldest` | `drop_newest` | What happens at max_queue_bytes: 'drop_oldest' (default) keeps the freshest data, 'drop_newest' preserves the earliest events.                                                                                                                                                                           |
| `max_message_age`       | `0`           | `5min`        | Discard a message whose row is older than this, measured from the row's timestamp and applied on both the direct and the buffered path. On a schedule it also clamps the watermark and must exceed settle_delay. A backfill is exempt. Defaults to 0, which never discards.                              |
| `max_unconfirmed_bytes` | `16777216`    | `4194304`     | Back-pressure threshold, as the total size of messages handed over and not yet confirmed. Defaults to 16777216.                                                                                                                                                                                          |
| `max_inflight`          | `20`          | `100`         | How many QoS >= 1 messages may await acknowledgement at once. Nothing past it is handed over, because paho would hold it outside every policy here. Defaults to 20.                                                                                                                                      |

**Common**

| Parameter             | Default                  | Example                      | What it does                                                                                                                                                                                      |
|-----------------------|--------------------------|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `config_file_path`    | *(empty)*                | `mqtt_publisher_config.toml` | TOML file under PLUGIN_DIR holding any of these settings. Read after the environment and the trigger arguments and winning over both; the place for values containing commas and for credentials. |
| `stats_interval`      | `1min`                   | `5min`                       | How often counters are written to mqtt_publisher_stats and summarised in the log. Defaults to 1min; 0 writes no measurement.                                                                      |
| `instance_name`       | hash of source and topic | `press-line`                 | Tag on mqtt_publisher_stats telling several triggers on one broker apart. Defaults to a stable hash of source_measurements and topic.                                                             |
| `enable_full_logging` | `false`                  | `true`                       | When false (the default), an exception's own message is withheld so that broker URLs and paths cannot reach the log. Reason codes, errno and the setting an error names are logged either way.    |

---

## Scheduled trigger

Publishes what each source table has gained since the previous tick. Create it **without** `--run-asynchronous`: a
watermark describes one reader, and two
ticks overlapping on a cold cache publish the same first page twice.

### How it behaves

**There is no lookback setting**, because a fixed window is not idempotent:
five minutes of lookback on a one-minute schedule publishes every row five
times, and duplicates that would collapse inside a table are five real MQTT
messages. A **watermark per source table** defines the range instead:

- bounded below by `time > watermark` and above by the invocation's start time
  less `settle_delay`;
- a **whole page** is read into the buffer, and the watermark follows it only
  once that page has drained — no further page is read while anything is
  pending;
- on a cold cache the watermark starts at *now − `settle_delay`*, so the first
  tick publishes nothing and the second publishes what appeared since.

**Why a page at a time.** Handing over is capped by the in-flight window, so a
tick can hand over fewer rows than it read. If the watermark followed the last
row handed over and those rows fell inside a group sharing one timestamp — 300
machines on aligned seconds produce exactly that — the watermark could not
enter the group without abandoning the rest, nor stay below it without
re-reading the same rows next tick. The group would republish for ever.

**Why a page always ends on a timestamp boundary.** The cursor is a timestamp,
so a page stopping inside a group would advance past rows that were never
published. A page that is entirely one timestamp is re-read whole, up to
`max_group_rows`.

**`settle_delay` exists because the watermark moves along the data's
timestamps, not along the order rows were written.** Two lags push a row's
visibility past its timestamp:

- **The server's own write-to-visibility lag.** A freshly written row is not
  queryable until the next WAL flush (up to `--wal-flush-interval`, default 1s).
  A tick whose window reaches `now` reads nothing yet, advances the watermark
  past that time, and the row is lost once it flushes. This hits **every**
  writer, which is why `settle_delay` defaults to **2s** — above the default
  flush interval. Keep it at or above the server's `--wal-flush-interval`.
- **A source that batches.** It writes a row late relative to the time it
  carries, and once the watermark has passed that time the row is never
  published:

```
12:00:05  tick publishes rows with time ≤ 12:00:05, watermark = 12:00:05
12:00:08  Telegraf flushes a batch timestamped 12:00:00 … 12:00:07
          everything in it at or below 12:00:05 is already behind — lost
```
Telegraf's default `flush_interval` is 10 s. A table **another plugin derives**
is late by that plugin's whole interval: a minute rollup carries the timestamp
of the start of the bin and can only be written once the bin has closed, so no
few-second `settle_delay` ever covers it. Use a write trigger on that table,
which has no watermark at all.

**The database is the buffer.** While the client cannot take anything, the tick
reads nothing and leaves the watermark where it is, so an outage costs memory
nothing and loses nothing:

```
t+0s     broker killed
t+1min   the tick connects, fails, logs it and reads nothing; the watermark
         stays where it was
t+1..7m  the same each tick; the buffer stays empty and memory is flat
t+7min   broker returns; each tick publishes up to max_messages per page,
         oldest first, until it has caught up
```
**A tick works through as many pages as `tick_budget` allows**, not one. One
page per tick is a ceiling, not a pace: a source writing 18 000 rows a minute
against a `max_messages` of 10 000 never catches up on an `every:1min`
schedule. A tick that stops with a full page still waiting logs a warning.

**Filters are compiled into the query**, so `max_messages` counts rows that
will actually be published rather than rows scanned.

### Setup

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/mqtt_publisher/mqtt_publisher.py \
  --trigger-spec "every:1min" \
  --trigger-arguments 'broker_url=mqtt://broker:1883,source_measurements=press_line,topic=plant/{machine}/sampled,settle_delay=15s' \
  mqtt_publish_sampled
influxdb3 enable trigger --database mydb mqtt_publish_sampled
```
### Example

A minute's worth of readings, coalesced into one message per machine, with
fifteen seconds of tolerance for a batching source:

```toml
source_measurements = ["press_line"]
topic = "plant/{machine}/sampled"
settle_delay = "15s"
layout = "batch"
payload_fields = ["temp", "pressure"]
max_message_age = "10min"
qos = 1
```
```
plant/press7/sampled   [{"time":"…:10.123456789Z","temp":21.5,"pressure":4.2},
                        {"time":"…:11.004000000Z","temp":21.6,"pressure":4.2}]
```
`max_message_age` must exceed `settle_delay`, and should exceed
`settle_delay` plus the schedule interval — otherwise each tick skips the part
of its window the next tick's clamp has already passed. The plugin refuses the
first; the second it can only log, because the trigger specification never
reaches it.

### Parameters

**Connection**

| Parameter               | Default                 | Example                                         | What it does                                                                                                                                                                                                                                                                                            |
|-------------------------|-------------------------|-------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `broker_url`            | **required**            | `mqtt://broker.example.com:1883`                | Broker address and transport in one value: mqtt://, mqtts://, ws://, wss://, unix:///path, or a bare host[:port]. The port defaults by scheme (1883, 8883, 80, 443) and TLS is chosen by the scheme.                                                                                                    |
| `client_id`             | `influxdb3-pub-<8 hex>` | `plant-publisher`                               | MQTT client identifier, defaulting to influxdb3-pub-<random> and kept across reconnects. The broker allows one session per identifier and evicts the previous holder, so set it only when ACLs require a known one, per trigger rather than in a shared file, and only on a trigger pinned to one node. |
| `username`              | *(empty)*               | `publisher`                                     | User name for the broker.                                                                                                                                                                                                                                                                               |
| `password`              | *(empty)*               | `<your-password>`                               | Password for the broker. Prefer the TOML file or the environment: trigger arguments are readable from the system tables.                                                                                                                                                                                |
| `mqtt_version`          | `3.1.1`                 | `5`                                             | Protocol version: '3.1.1' (default), '5' or '3.1'. Version 5 adds reason codes on acknowledgements, message expiry and broker-declared limits; without it a refused message cannot be told from a delivered one.                                                                                        |
| `keep_alive`            | `300`                   | `60`                                            | Seconds declared in CONNECT, 300 by default. Large on purpose because nothing pings between invocations, but it also caps a TLS handshake and a WebSocket upgrade, so lower it on an unreliable TLS path.                                                                                               |
| `max_silence`           | half of `keep_alive`    | `150s`                                          | How long the connection may be quiet before an invocation replaces it rather than writing into it blind. Defaults to half of keep_alive, and follows an MQTT 5 broker's Server Keep Alive when one is imposed.                                                                                          |
| `connect_timeout`       | `2s`                    | `5s`                                            | Bounds the TCP connect and the wait for CONNACK. It does not bound name resolution or a TLS handshake. Defaults to 2s.                                                                                                                                                                                  |
| `reconnect_min_backoff` | `1s`                    | `2s`                                            | Shortest gap between connection attempts, doubling on each failure. Defaults to 1s.                                                                                                                                                                                                                     |
| `reconnect_max_backoff` | `120s`                  | `60s`                                           | Ceiling for the backoff doubling, reset once a CONNACK succeeds. Defaults to 120s.                                                                                                                                                                                                                      |
| `tls_ca_cert`           | *(empty)*               | `certs/ca.pem`                                  | CA certificate for mqtts:// or wss://. A relative path resolves under PLUGIN_DIR; omit to use the system trust store.                                                                                                                                                                                   |
| `tls_cert`              | *(empty)*               | `certs/client.pem`                              | Client certificate for mutual TLS.                                                                                                                                                                                                                                                                      |
| `tls_key`               | *(empty)*               | `certs/client.key`                              | Client private key for mutual TLS. Must be unencrypted; a passphrase-protected key is refused at configuration time.                                                                                                                                                                                    |
| `tls_insecure`          | `false`                 | `true`                                          | Skip server certificate verification. Defaults to false and should stay there outside a laboratory.                                                                                                                                                                                                     |
| `ws_path`               | from `broker_url`       | `/mqtt`                                         | Path for a WebSocket connection when it differs from the one in broker_url. Ignored outside ws:// and wss://.                                                                                                                                                                                           |
| `ws_headers`            | *(empty)*               | `Authorization:'Bearer abc' X-Tenant:'plant-1'` | Extra headers on the WebSocket upgrade, for brokers that authenticate there: space-separated name:'value' pairs, or a table of name to value in a TOML file or a request body. Ignored outside ws:// and wss://.                                                                                        |

**Availability**

| Parameter                | Default   | Example                  | What it does                                                                                                                                                                                                                             |
|--------------------------|-----------|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `status_topic`           | *(empty)* | `plant/publisher/status` | Retained availability topic. The online payload is published on every connect and the offline one is registered as the MQTT will. Meaningful only when invocations are more frequent than keep_alive; the HTTP trigger never touches it. |
| `status_online_payload`  | `online`  | `up`                     | Payload published retained on status_topic after every successful connect. Defaults to 'online'.                                                                                                                                         |
| `status_offline_payload` | `offline` | `down`                   | Payload registered as the MQTT will, so the broker emits it when the connection dies unexpectedly. Defaults to 'offline'.                                                                                                                |

**Source**

| Parameter             | Default      | Example                | What it does                                                                                                                                                                                                                                                                                                                                                                                                   |
|-----------------------|--------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source_measurements` | **required** | `press_line weld_line` | Tables to publish, space-separated or as a list. On a write trigger, batches for any other table are ignored, so the trigger specification may safely be all_tables. On a schedule each is read in turn; on HTTP the first is the default table a request may override.                                                                                                                                        |
| `settle_delay`        | `2s`         | `30s`                  | Hold back the upper bound of the range, so rows still below the server's write-to-visibility lag (up to `--wal-flush-interval`, default 1s) are not skipped and rows a batching source writes late are still above the watermark when they appear. Keep it at or above `--wal-flush-interval`; a table another plugin derives needs that plugin's whole interval plus its offset and run time. Defaults to 2s. |
| `tick_budget`         | `5s`         | `20s`                  | How long one tick may keep working through pages before leaving the rest to the next one. One page per tick cannot catch up with a source writing more than max_messages per interval. Defaults to 5s.                                                                                                                                                                                                         |
| `max_group_rows`      | `100000`     | `500000`               | Most rows read for a single timestamp when a whole page carries one, since a page cannot stop inside a timestamp group without losing the rest of it. Beyond it the surplus is dropped, counted and logged, and the cursor advances anyway. Defaults to 100000.                                                                                                                                                |

**Row selection**

| Parameter      | Default   | Example                             | What it does                                                                                                                                                                                                                                                                                                                                        |
|----------------|-----------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `filters`      | *(empty)* | `temp:'>=185' state:'!=error'`      | Comparisons applied before any message is built, with =, !=, >, <, >= and <=. As a string, space-separated column:'operator value' pairs with each value quoted; in a TOML file or a request body, also a list of [column, operator, value] triples. A row lacking the column fails a positive test and passes '!='.                                |
| `allow_values` | *(empty)* | `machine:'press7 press8' line:'l1'` | Membership tests: as a string, space-separated column:'values' pairs with each list quoted; in a TOML file or a request body, also a table of column to values. Only rows whose value is listed are published, and a column not named here is unconstrained. Values are matched as strings, so for a numeric or boolean column use filters instead. |
| `deny_values`  | *(empty)* | `machine:'press9' line:'l9'`        | Same forms as allow_values. Rows whose value is listed are skipped, a deny match wins over an allow match, and a row lacking the column is published.                                                                                                                                                                                               |

**Message**

| Parameter             | Default      | Example                                      | What it does                                                                                                                                                                                                                                                                                         |
|-----------------------|--------------|----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `topic`               | **required** | `plant/{machine}/{_table}`                   | Topic to publish to. A plain string is valid; {column} is replaced by that column's value in the row, {_table} by the table name and {_field} by the field name under layout=field. A substituted value may not contain /, + or #.                                                                   |
| `topic_missing_value` | *(unset)*    | `unknown`                                    | Substitute for a placeholder whose column is empty on a row. Unset, such a row is skipped and counted.                                                                                                                                                                                               |
| `payload_format`      | `json`       | `lineprotocol`                               | Encoder: 'json' (default), 'lineprotocol' or 'template'. Ignored under layout=field, whose payload is the bare value.                                                                                                                                                                                |
| `payload_fields`      | *(empty)*    | `temp pressure`                              | Columns that reach the payload, space-separated or as a list; empty means every field and tag of the row. It narrows the payload only, not what a topic placeholder may refer to.                                                                                                                    |
| `payload_template`    | *(empty)*    | `{"setpoint": 180, "reason": "temp {temp}"}` | Required when payload_format=template. Uses the same placeholders as topic; a brace group that is not a placeholder stays literal, and {{ }} produce literal braces.                                                                                                                                 |
| `layout`              | `row`        | `field`                                      | 'row' (default) publishes one message per row, 'batch' one message per topic per invocation, 'field' one message per field carrying the bare value.                                                                                                                                                  |
| `time_format`         | `rfc3339`    | `ms`                                         | How a timestamp is rendered in a json payload and in a {time} placeholder, which payload_template accepts and topic refuses: 'rfc3339' (default), 'ms' or 'ns'. 'ns' exceeds the largest integer JavaScript represents exactly. Ignored by lineprotocol, whose grammar requires integer nanoseconds. |
| `qos`                 | `0`          | `1`                                          | Delivery guarantee asked of the broker: 0 (default), 1 or 2. QoS 2 is not recommended, being not exactly-once under a clean session and hiding a refusal at PUBREC.                                                                                                                                  |
| `retain`              | `false`      | `true`                                       | Set the MQTT retain flag, so a subscriber arriving later sees the current value at once. Defaults to false.                                                                                                                                                                                          |

**Limits and buffering**

| Parameter               | Default       | Example       | What it does                                                                                                                                                                                                                                                                                             |
|-------------------------|---------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `max_messages`          | `10000`       | `2000`        | Source rows one query reads at a time, which is what LIMIT receives: the page size of a scheduled tick and of a backfill call. The number of messages follows from layout. It does not apply to a write trigger, whose batch is encoded whole and bounded by max_queue_bytes instead. Defaults to 10000. |
| `max_payload_bytes`     | `122880`      | `262144`      | Largest message built, counting topic and properties. A batch is split to stay under it; a single row that still does not fit is dropped, counted and logged. Defaults to 122880, eight bytes short of AWS IoT Core's cap.                                                                               |
| `max_delivery_attempts` | `3`           | `5`           | Hand-overs before a message is treated as undeliverable, then dropped, counted and logged. An attempt is charged only to the oldest unconfirmed message. Defaults to 3.                                                                                                                                  |
| `max_queue_bytes`       | `67108864`    | `16777216`    | Bound on the in-memory buffer, counted as payload plus topic plus a per-message overhead so that it tracks real memory. Per trigger, and every trigger shares one engine process. Defaults to 67108864.                                                                                                  |
| `drop_policy`           | `drop_oldest` | `drop_newest` | What happens at max_queue_bytes: 'drop_oldest' (default) keeps the freshest data, 'drop_newest' preserves the earliest events.                                                                                                                                                                           |
| `max_message_age`       | `0`           | `5min`        | Discard a message whose row is older than this, measured from the row's timestamp and applied on both the direct and the buffered path. On a schedule it also clamps the watermark and must exceed settle_delay. A backfill is exempt. Defaults to 0, which never discards.                              |
| `max_unconfirmed_bytes` | `16777216`    | `4194304`     | Back-pressure threshold, as the total size of messages handed over and not yet confirmed. Defaults to 16777216.                                                                                                                                                                                          |
| `max_inflight`          | `20`          | `100`         | How many QoS >= 1 messages may await acknowledgement at once. Nothing past it is handed over, because paho would hold it outside every policy here. Defaults to 20.                                                                                                                                      |

**Common**

| Parameter             | Default                  | Example                      | What it does                                                                                                                                                                                      |
|-----------------------|--------------------------|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `config_file_path`    | *(empty)*                | `mqtt_publisher_config.toml` | TOML file under PLUGIN_DIR holding any of these settings. Read after the environment and the trigger arguments and winning over both; the place for values containing commas and for credentials. |
| `stats_interval`      | `1min`                   | `5min`                       | How often counters are written to mqtt_publisher_stats and summarised in the log. Defaults to 1min; 0 writes no measurement.                                                                      |
| `instance_name`       | hash of source and topic | `press-line`                 | Tag on mqtt_publisher_stats telling several triggers on one broker apart. Defaults to a stable hash of source_measurements and topic.                                                             |
| `enable_full_logging` | `false`                  | `true`                       | When false (the default), an exception's own message is withheld so that broker URLs and paths cannot reach the log. Reason codes, errno and the setting an error names are logged either way.    |

---

## HTTP trigger

Replays a time range on demand. One call handles one table and **never touches
the scheduled watermark**, so a backfill and a live scheduled trigger can run
against the same table without interfering.

### How it behaves

**The range is `[start, end)`** — `backfill_start` inclusive, `backfill_end`
exclusive — so adjacent calls chain without republishing the row on the seam.
Both may be omitted, and then the whole table is published, up to
`max_backfill_messages`.

**The call works through the range in pages**, waiting between them for the
unconfirmed total to fall below `max_unconfirmed_bytes`, so a large range
cannot outrun the broker and overflow the buffer.

**The answer carries two timestamps**, and they are not the same thing:

- `reached` — the last **fully confirmed** timestamp group. A group of which
  some messages are confirmed and some are not cannot be resumed from, so it
  does not count;
- `resume_from` — what to pass next time, already adjusted for the direction
  and the inclusivity of the bound it goes into, so nobody has to do nanosecond
  arithmetic on an RFC 3339 string.

**`max_backfill_messages` caps the whole call**, bounding each page by the
budget left so it holds per call, not only between pages, at timestamp-group
granularity. Reaching it with rows still to publish is an ordinary stop, not an
error: the answer says `complete: false` and carries a `resume_from`. Reaching
it with the range already exhausted answers `complete: true`, so an exact hit on
the last page costs no spurious resume. That cap is what makes a request with no
range safe to issue by accident.

**A long backfill outlasts its HTTP response.** The plugin finishes regardless
and logs progress — there is no way to stop it short of removing the trigger,
which is why the cap's default is low enough to notice.

**This trigger ignores `status_topic`.** Its client exists for one request, and
its coming and going says nothing about availability.

### Setup

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/mqtt_publisher/mqtt_publisher.py \
  --trigger-spec "request:mqtt_backfill" \
  --trigger-arguments 'broker_url=mqtt://broker:1883,source_measurements=press_line,topic=replay/{machine}/{_table}' \
  mqtt_backfill
influxdb3 enable trigger --database mydb mqtt_backfill
```
### Making a request

```bash
curl -X POST "http://localhost:8181/api/v3/engine/mqtt_backfill" \
  -H "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"backfill_start": "2026-10-05T00:00:00Z", "backfill_end": "2026-10-05T06:00:00Z"}'
```
```json
{
  "status": "ok",
  "table": "press_line",
  "published": 184320,
  "confirmed": 184320,
  "dropped": 0,
  "reached": "2026-10-05T05:59:59.000000000Z",
  "resume_from": "2026-10-05T05:59:59.000000001Z",
  "complete": true
}
```
A run that stops with rows still to publish — interrupted, or capped with the
range not yet exhausted — answers `"status": "aborted"` with `"complete": false`;
pass its `resume_from` as `backfill_start` to continue from exactly where it
stopped:

```bash
curl -X POST "http://localhost:8181/api/v3/engine/mqtt_backfill" \
  -H "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" -H 'Content-Type: application/json' \
  -d '{"backfill_start": "2026-10-05T05:59:59.000000001Z"}'
```
**Replaying into a different shape.** A request may change which rows are
taken, where they go and what the message says — which is what a replay for a
new consumer needs:

```bash
curl -X POST "http://localhost:8181/api/v3/engine/mqtt_backfill?backfill_order=newest_first" \
  -H "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" -H 'Content-Type: application/json' \
  -H 'X-Influxdb3-Mqtt-Publisher-Topic: replay/{machine}/{_table}' \
  -d '{
    "source_measurements": "weld_line",
    "backfill_start": "2026-10-05T00:00:00Z",
    "payload_fields": ["temp", "pressure"],
    "time_format": "ms",
    "filters": [["temp", ">=", 185]]
  }'
```
### What a request may set

Only these, in the body, a header or a query parameter:

`backfill_start`, `backfill_end`, `backfill_order`, `source_measurements`,
`filters`, `allow_values`, `deny_values`, `topic`, `topic_missing_value`,
`payload_format`, `payload_template`, `payload_fields`, `layout`,
`time_format`.

Which rows to take, where they go and what the message says stay open because
that is what a backfill varies. The broker, the credentials, the QoS, the TLS
material and every limit belong to the trigger, and **a request naming one is
refused** — the connection is the trigger's identity, and a caller who could
supply `broker_url` would be using the plugin to reach a broker of their own.

### Parameters

**Connection**

| Parameter               | Default                 | Example                                         | What it does                                                                                                                                                                                                                                                                                            |
|-------------------------|-------------------------|-------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `broker_url`            | **required**            | `mqtt://broker.example.com:1883`                | Broker address and transport in one value: mqtt://, mqtts://, ws://, wss://, unix:///path, or a bare host[:port]. The port defaults by scheme (1883, 8883, 80, 443) and TLS is chosen by the scheme.                                                                                                    |
| `client_id`             | `influxdb3-pub-<8 hex>` | `plant-publisher`                               | MQTT client identifier, defaulting to influxdb3-pub-<random> and kept across reconnects. The broker allows one session per identifier and evicts the previous holder, so set it only when ACLs require a known one, per trigger rather than in a shared file, and only on a trigger pinned to one node. |
| `username`              | *(empty)*               | `publisher`                                     | User name for the broker.                                                                                                                                                                                                                                                                               |
| `password`              | *(empty)*               | `<your-password>`                               | Password for the broker. Prefer the TOML file or the environment: trigger arguments are readable from the system tables.                                                                                                                                                                                |
| `mqtt_version`          | `3.1.1`                 | `5`                                             | Protocol version: '3.1.1' (default), '5' or '3.1'. Version 5 adds reason codes on acknowledgements, message expiry and broker-declared limits; without it a refused message cannot be told from a delivered one.                                                                                        |
| `keep_alive`            | `300`                   | `60`                                            | Seconds declared in CONNECT, 300 by default. Large on purpose because nothing pings between invocations, but it also caps a TLS handshake and a WebSocket upgrade, so lower it on an unreliable TLS path.                                                                                               |
| `max_silence`           | half of `keep_alive`    | `150s`                                          | How long the connection may be quiet before an invocation replaces it rather than writing into it blind. Defaults to half of keep_alive, and follows an MQTT 5 broker's Server Keep Alive when one is imposed.                                                                                          |
| `connect_timeout`       | `2s`                    | `5s`                                            | Bounds the TCP connect and the wait for CONNACK. It does not bound name resolution or a TLS handshake. Defaults to 2s.                                                                                                                                                                                  |
| `reconnect_min_backoff` | `1s`                    | `2s`                                            | Shortest gap between connection attempts, doubling on each failure. Defaults to 1s.                                                                                                                                                                                                                     |
| `reconnect_max_backoff` | `120s`                  | `60s`                                           | Ceiling for the backoff doubling, reset once a CONNACK succeeds. Defaults to 120s.                                                                                                                                                                                                                      |
| `tls_ca_cert`           | *(empty)*               | `certs/ca.pem`                                  | CA certificate for mqtts:// or wss://. A relative path resolves under PLUGIN_DIR; omit to use the system trust store.                                                                                                                                                                                   |
| `tls_cert`              | *(empty)*               | `certs/client.pem`                              | Client certificate for mutual TLS.                                                                                                                                                                                                                                                                      |
| `tls_key`               | *(empty)*               | `certs/client.key`                              | Client private key for mutual TLS. Must be unencrypted; a passphrase-protected key is refused at configuration time.                                                                                                                                                                                    |
| `tls_insecure`          | `false`                 | `true`                                          | Skip server certificate verification. Defaults to false and should stay there outside a laboratory.                                                                                                                                                                                                     |
| `ws_path`               | from `broker_url`       | `/mqtt`                                         | Path for a WebSocket connection when it differs from the one in broker_url. Ignored outside ws:// and wss://.                                                                                                                                                                                           |
| `ws_headers`            | *(empty)*               | `Authorization:'Bearer abc' X-Tenant:'plant-1'` | Extra headers on the WebSocket upgrade, for brokers that authenticate there: space-separated name:'value' pairs, or a table of name to value in a TOML file or a request body. Ignored outside ws:// and wss://.                                                                                        |

**Source**

| Parameter             | Default      | Example                | What it does                                                                                                                                                                                                                                                            |
|-----------------------|--------------|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source_measurements` | **required** | `press_line weld_line` | Tables to publish, space-separated or as a list. On a write trigger, batches for any other table are ignored, so the trigger specification may safely be all_tables. On a schedule each is read in turn; on HTTP the first is the default table a request may override. |
| `max_group_rows`      | `100000`     | `500000`               | Most rows read for a single timestamp when a whole page carries one, since a page cannot stop inside a timestamp group without losing the rest of it. Beyond it the surplus is dropped, counted and logged, and the cursor advances anyway. Defaults to 100000.         |

**Row selection**

| Parameter      | Default   | Example                             | What it does                                                                                                                                                                                                                                                                                                                                        |
|----------------|-----------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `filters`      | *(empty)* | `temp:'>=185' state:'!=error'`      | Comparisons applied before any message is built, with =, !=, >, <, >= and <=. As a string, space-separated column:'operator value' pairs with each value quoted; in a TOML file or a request body, also a list of [column, operator, value] triples. A row lacking the column fails a positive test and passes '!='.                                |
| `allow_values` | *(empty)* | `machine:'press7 press8' line:'l1'` | Membership tests: as a string, space-separated column:'values' pairs with each list quoted; in a TOML file or a request body, also a table of column to values. Only rows whose value is listed are published, and a column not named here is unconstrained. Values are matched as strings, so for a numeric or boolean column use filters instead. |
| `deny_values`  | *(empty)* | `machine:'press9' line:'l9'`        | Same forms as allow_values. Rows whose value is listed are skipped, a deny match wins over an allow match, and a row lacking the column is published.                                                                                                                                                                                               |

**Message**

| Parameter             | Default      | Example                                      | What it does                                                                                                                                                                                                                                                                                         |
|-----------------------|--------------|----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `topic`               | **required** | `plant/{machine}/{_table}`                   | Topic to publish to. A plain string is valid; {column} is replaced by that column's value in the row, {_table} by the table name and {_field} by the field name under layout=field. A substituted value may not contain /, + or #.                                                                   |
| `topic_missing_value` | *(unset)*    | `unknown`                                    | Substitute for a placeholder whose column is empty on a row. Unset, such a row is skipped and counted.                                                                                                                                                                                               |
| `payload_format`      | `json`       | `lineprotocol`                               | Encoder: 'json' (default), 'lineprotocol' or 'template'. Ignored under layout=field, whose payload is the bare value.                                                                                                                                                                                |
| `payload_fields`      | *(empty)*    | `temp pressure`                              | Columns that reach the payload, space-separated or as a list; empty means every field and tag of the row. It narrows the payload only, not what a topic placeholder may refer to.                                                                                                                    |
| `payload_template`    | *(empty)*    | `{"setpoint": 180, "reason": "temp {temp}"}` | Required when payload_format=template. Uses the same placeholders as topic; a brace group that is not a placeholder stays literal, and {{ }} produce literal braces.                                                                                                                                 |
| `layout`              | `row`        | `field`                                      | 'row' (default) publishes one message per row, 'batch' one message per topic per invocation, 'field' one message per field carrying the bare value.                                                                                                                                                  |
| `time_format`         | `rfc3339`    | `ms`                                         | How a timestamp is rendered in a json payload and in a {time} placeholder, which payload_template accepts and topic refuses: 'rfc3339' (default), 'ms' or 'ns'. 'ns' exceeds the largest integer JavaScript represents exactly. Ignored by lineprotocol, whose grammar requires integer nanoseconds. |
| `qos`                 | `0`          | `1`                                          | Delivery guarantee asked of the broker: 0 (default), 1 or 2. QoS 2 is not recommended, being not exactly-once under a clean session and hiding a refusal at PUBREC.                                                                                                                                  |
| `retain`              | `false`      | `true`                                       | Set the MQTT retain flag, so a subscriber arriving later sees the current value at once. Defaults to false.                                                                                                                                                                                          |

**Limits and buffering**

| Parameter               | Default       | Example       | What it does                                                                                                                                                                                                                                                                                             |
|-------------------------|---------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `max_messages`          | `10000`       | `2000`        | Source rows one query reads at a time, which is what LIMIT receives: the page size of a scheduled tick and of a backfill call. The number of messages follows from layout. It does not apply to a write trigger, whose batch is encoded whole and bounded by max_queue_bytes instead. Defaults to 10000. |
| `max_payload_bytes`     | `122880`      | `262144`      | Largest message built, counting topic and properties. A batch is split to stay under it; a single row that still does not fit is dropped, counted and logged. Defaults to 122880, eight bytes short of AWS IoT Core's cap.                                                                               |
| `max_delivery_attempts` | `3`           | `5`           | Hand-overs before a message is treated as undeliverable, then dropped, counted and logged. An attempt is charged only to the oldest unconfirmed message. Defaults to 3.                                                                                                                                  |
| `max_queue_bytes`       | `67108864`    | `16777216`    | Bound on the in-memory buffer, counted as payload plus topic plus a per-message overhead so that it tracks real memory. Per trigger, and every trigger shares one engine process. Defaults to 67108864.                                                                                                  |
| `drop_policy`           | `drop_oldest` | `drop_newest` | What happens at max_queue_bytes: 'drop_oldest' (default) keeps the freshest data, 'drop_newest' preserves the earliest events.                                                                                                                                                                           |
| `max_message_age`       | `0`           | `5min`        | Discard a message whose row is older than this, measured from the row's timestamp and applied on both the direct and the buffered path. On a schedule it also clamps the watermark and must exceed settle_delay. A backfill is exempt. Defaults to 0, which never discards.                              |
| `max_unconfirmed_bytes` | `16777216`    | `4194304`     | Back-pressure threshold, as the total size of messages handed over and not yet confirmed. Defaults to 16777216.                                                                                                                                                                                          |
| `max_inflight`          | `20`          | `100`         | How many QoS >= 1 messages may await acknowledgement at once. Nothing past it is handed over, because paho would hold it outside every policy here. Defaults to 20.                                                                                                                                      |

**Backfill range**

| Parameter               | Default        | Example                | What it does                                                                                                                                                                                              |
|-------------------------|----------------|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `backfill_start`        | *(empty)*      | `2026-10-05T00:00:00Z` | Inclusive lower bound of the range. Omitted, the range starts at the beginning of the table.                                                                                                              |
| `backfill_end`          | *(empty)*      | `2026-10-05T06:00:00Z` | Exclusive upper bound of the range, so adjacent calls chain without republishing the row on the seam. Omitted, the moment the request arrives.                                                            |
| `backfill_order`        | `oldest_first` | `newest_first`         | 'oldest_first' (default) or 'newest_first'.                                                                                                                                                               |
| `max_backfill_messages` | `1000000`      | `50000`                | Most messages one call publishes, honored at timestamp-group granularity (a group is published whole even if it overshoots). Reached with rows still remaining, the call answers complete=false with a resume_from; reached with the range exhausted, it answers complete=true. Defaults to 1000000; 0 removes the cap. Not settable from a request. |
| `publish_timeout`       | `5s`           | `30s`                  | How long the call waits at the end for its last page to be confirmed before answering. Defaults to 5s.                                                                                                    |

**Common**

| Parameter             | Default                  | Example                      | What it does                                                                                                                                                                                      |
|-----------------------|--------------------------|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `config_file_path`    | *(empty)*                | `mqtt_publisher_config.toml` | TOML file under PLUGIN_DIR holding any of these settings. Read after the environment and the trigger arguments and winning over both; the place for values containing commas and for credentials. |
| `stats_interval`      | `1min`                   | `5min`                       | How often counters are written to mqtt_publisher_stats and summarised in the log. Defaults to 1min; 0 writes no measurement.                                                                      |
| `instance_name`       | hash of source and topic | `press-line`                 | Tag on mqtt_publisher_stats telling several triggers on one broker apart. Defaults to a stable hash of source_measurements and topic.                                                             |
| `enable_full_logging` | `false`                  | `true`                       | When false (the default), an exception's own message is withheld so that broker URLs and paths cannot reach the log. Reason codes, errno and the setting an error names are logged either way.    |

---

## Topics

A plain string is valid and is the common case:

```
topic = test4
```
### A topic is not something that exists

Nothing has to be created in advance, and the plugin creates nothing. In MQTT
a topic is just a string in the PUBLISH packet: the broker matches it against
whatever subscriptions exist at that moment and delivers it to those. If nobody
is subscribed, the message is **discarded** and that is not an error — under
MQTT 5 the broker says so with reason code `0x10` *no matching subscribers*,
which this plugin counts as delivered, because it is.

Three things do constrain which topics you may use:

- **The broker's ACLs.** Publishing to a topic the client is not allowed is
  refused, which is authorisation rather than existence. Under MQTT 5 it comes
  back as `0x87` and the message is dropped and logged; under 3.1.1 Mosquitto
  acknowledges it and discards it silently, and nothing here can tell.
- **`retain = true` makes a topic persist.** The broker stores the last
  retained message per topic and hands it to every later subscriber. That is
  the point of the UNS pattern and of `status_topic` — and it is also the
  reason a topic template must produce a **bounded** set of topics. One topic
  per machine is a few hundred; one per timestamp would be one per row, stored
  for ever. That is why `{time}` is refused in a topic and offered only in the
  payload.
- **Broker-specific rules.** Managed brokers cap topic length and depth — AWS
  IoT Core allows seven forward slashes and 256 bytes — and reserve the `$`
  prefix for their own topics, which this plugin refuses outright.

A placeholder is `{`, a name matching `[A-Za-z_][A-Za-z0-9_]*`, and `}`. The
template is scanned for exactly that; every other character, braces included,
is literal, so a JSON-shaped template needs no escaping. `{{` and `}}` produce
literal braces.

```
topic = plant/{machine}/line/{line}/{_table}/{_field}
```
| Placeholder | Resolves to                                                                                                  |
|-------------|--------------------------------------------------------------------------------------------------------------|
| `{column}`  | The **value** of that tag or field in the row — `{machine}` on a row tagged `machine=press7` yields `press7` |
| `{_table}`  | The measurement name                                                                                         |
| `{_field}`  | The field name; meaningful only under `layout = field`                                                       |
| `{time}`    | The row's timestamp, rendered by `time_format`. **`payload_template` only** — refused in a topic             |

Rules that apply only when a placeholder is used:

- **Every placeholder must name a column of at least one source table.** The
  check happens when the schema is first read; requiring it in every table
  would make a trigger over several unlike tables impossible. A table that does
  not exist yet cannot be checked at all — the normal order for a write trigger
  — so that is one warning, and the check waits for the table.
- **An empty value is a runtime condition, not an error.** In InfluxDB a tag
  may legitimately be absent from part of a table. Such a row uses
  `topic_missing_value`; unset, the row is skipped and counted.
- **A substituted value containing `/`, `+`, `#` or a null character is
  refused.** `/` is refused because a value is data, and data must not be able
  to add a topic level: a tag value of `../cmd/setpoint` would otherwise steer
  the message into somebody else's command topic.
- **A topic that can never be published is refused with the settings.** Empty,
  starting with `$` (the broker's own namespace) or carrying an empty level —
  when no placeholder can change that, it is a configuration error rather than
  a line in the log for every row. A value that renders into one of those
  shapes is still refused and counted per row.

A column whose name falls outside the grammar — InfluxDB allows spaces and
dots in column names — cannot be interpolated, and there is no escape syntax.
`payload_fields` still reaches it; a topic that needs it needs it renamed.

---

## Payloads

| `payload_format` | Payload                                                                                       |
|------------------|-----------------------------------------------------------------------------------------------|
| `json`           | A JSON object per row, or an array under `layout = batch`                                     |
| `lineprotocol`   | InfluxDB line protocol — what `mqtt_subscriber` already parses, so the two form a closed loop |
| `template`       | `payload_template`, interpolated by the grammar above                                         |

| `layout` | Behaviour                                                                                                                                     | Telegraf equivalent |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------|---------------------|
| `row`    | One message per row                                                                                                                           | `non-batch`         |
| `batch`  | One message per topic per invocation, carrying all its rows                                                                                   | `batch`             |
| `field`  | One message per field, the payload being the bare value. `{_field}` is used where the topic places it and appended as a final level otherwise | `field`             |

**A payload carries the timestamp first and the remaining columns in name
order**, in JSON and in line protocol alike. A write trigger receives a row in
the engine's order and a query returns it in the statement's, so without one
order the same row would encode two ways depending on which trigger published
it — a difference that matters to anyone comparing or hashing payloads.

The two interact in two places that would otherwise be guesswork:

- **`layout = field` ignores `payload_format`.** The payload is the value and
  nothing else, so there is no object to shape and no template to fill.
  Setting one is not an error, but it has no effect.
- **`template` under `batch` renders once per row and joins with a newline**,
  the same shape `lineprotocol` takes in a batch. A JSON-shaped template then
  produces NDJSON, which a consumer can actually read.

**A column empty on a row does not appear in that row's payload, and a row left
with no selected values is skipped.** One rule settles two things: a write row
simply has no such key while a query returns every column and fills the gaps
with `None`, so without it the same logical row would be published as
`{"temp":21.5}` by one trigger and `{"temp":21.5,"pressure":null}` by another —
and a line protocol payload must carry at least one field.

**`lineprotocol` carries types, taken from the catalog**: `i` for int64, `u`
for uint64, `t`/`f` for boolean, quotes for a string. A bare number in line
protocol is a *float*, so an integer published without its suffix would be
re-ingested as a float and collide with the column it came from. A Python
value cannot tell int64 from uint64 — both are `int` — which is why the schema
is read rather than guessed. Escaping follows the line protocol rules exactly.

`payload_fields` narrows the **payload only**. A topic placeholder still
resolves against the whole row, so `topic=plant/{machine}` works with
`payload_fields=temp`.

---

## Row selection

Two mechanisms, deliberately non-overlapping:

- **`filters`** — scalar comparisons on column values. It selects **rows, not
  transitions**: every row satisfying the condition is published, for as long
  as it keeps satisfying it. Publishing on the crossing instead is what
  `state_change` and `threshold_deadman_checks` are for — they write an event
  row, and this plugin publishes that table.
- **`allow_values` / `deny_values`** — membership tests, meant for **string
  tags**. The list values are matched as strings, so on a numeric or boolean
  column a write trigger (`str(185.0) == "185.0"`) and a scheduled or backfill
  trigger (SQL `IN ('185')`, coerced by the engine) can disagree. For a numeric
  or boolean column use `filters` (`temp:'>=185'`), which is typed and matches
  the same rows on every trigger type.

A row that does **not carry the column** is treated differently by each, and
the difference is the one people get wrong:

|                                          | Row without the column | Why                                                            |
|------------------------------------------|------------------------|----------------------------------------------------------------|
| `filters` with `=`, `>`, `<`, `>=`, `<=` | skipped                | a positive match cannot be shown for a value that is not there |
| `filters` with `!=`                      | **published**          | it cannot equal a value it does not carry                      |
| `allow_values`                           | skipped                | membership in the list is not demonstrable                     |
| `deny_values`                            | **published**          | it cannot match a value it does not carry                      |

The two that publish are the ones SQL gets wrong on its own: `NULL != 'x'` and
`NULL NOT IN (…)` are both `NULL` rather than `TRUE`, so a bare `!=` or
`NOT IN` drops exactly those rows. Each negative test therefore compiles with
its own `IS NULL` arm, and both paths — compiled SQL and per-row Python —
select the same rows. Without it, adding one `deny_values` would silently stop
publishing every row lacking that tag, which on a table written by more than
one source can be most of it.

Filter columns and literals are **checked against the schema** when it is first
read: a column no source table has, an ordering comparison on a text column, or
a number compared against a text column are all refused with both names in the
message. Values are always **bound as query parameters**, never written into
the statement as text.

---

## Where settings come from

The write and scheduled triggers read three layers; the HTTP trigger reads six:

```
query parameters > headers > request body > TOML file > trigger arguments > environment
```
| Layer             | Spelling                                             | Notes                                                                                                                                     |
|-------------------|------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| environment       | `INFLUXDB3_MQTT_PUBLISHER_BROKER_URL`                | Any setting, upper-cased behind the prefix                                                                                                |
| trigger arguments | `broker_url=mqtt://host:1883`                        | Any setting. **No value may contain a comma** — the CLI splits on it                                                                      |
| TOML file         | `broker_url = "mqtt://host:1883"`                    | Any setting but `config_file_path` itself; the place for commas and for credentials that should stay out of the trigger catalogue         |
| request body      | `{"topic": "replay/{machine}"}`                      | HTTP only, and only the settings the HTTP section lists                                                                                   |
| headers           | `X-Influxdb3-Mqtt-Publisher-Topic: replay/{machine}` | HTTP only; the same settings, matched without regard to case. An unknown header is ignored, because every client sends headers of its own |
| query parameters  | `?topic=replay/{machine}`                            | HTTP only; the same settings                                                                                                              |

An unrecognised name is **refused with the list of accepted ones** rather than
ignored, in every layer the operator controls — a trigger argument, a key in
the TOML file, a body field or a query parameter. A misspelled setting that
silently did nothing would be found much later.

`config_file_path` names a layer rather than setting a value, so it is accepted
only from the environment and the trigger arguments: neither the file nor a
request can point the plugin at another file.

### Two ways to write a setting

A trigger argument can only be a string, so every setting has a compact string
form. A TOML file and a JSON request body carry real data structures, and four
settings accept those too — which reads better and keeps the types you wrote.

| Setting               | Compact string                   | Structured                                        |
|-----------------------|----------------------------------|---------------------------------------------------|
| `filters`             | `"temp:'>=185' state:'!=error'"` | `[["temp", ">=", 185], ["state", "!=", "error"]]` |
| `allow_values`        | `"machine:'press7 press8'"`      | `{ machine = ["press7", "press8"] }`              |
| `deny_values`         | `"machine:'press9'"`             | `{ machine = ["press9"] }`                        |
| `ws_headers`          | `"Authorization:'Bearer abc'"`   | `{ Authorization = "Bearer abc" }`                |
| `source_measurements` | `"press_line weld_line"`         | `["press_line", "weld_line"]`                     |
| `payload_fields`      | `"temp pressure"`                | `["temp", "pressure"]`                            |

`filters` also accepts a list of objects — `[{"column": "temp", "operator":
">=", "value": 185}]` — for a caller that generates the request. In the
structured form the value keeps the type you wrote, so `185` is a number; in
the compact form, and for a quoted `"185"`, it is read as one.

**The compact form's grammar**: pairs are separated by **whitespace outside
quotes**, and quotes say which spaces belong to a value. Either quote
character may be the outer pair, so a value carrying one kind is written with
the other — `state:"=o'brien"`. There is no escape for a quote inside the same
kind; a value needing both belongs in the structured form. One separator then
serves both levels — the pairs and the lists inside them — and a decimal
literal stays intact, which a dot separator could not:
`temp:'>=1.5' state:'!=in progress'`. An unbalanced quote is a configuration
error naming the setting.

---

## Installation

- **{{% product-name %}}**: 3.8.2 or later, with the Processing Engine enabled
- **Python packages**: `influxdata-plugin-utils>=0.5.0`, `paho-mqtt>=2.1,<3`

> One virtual environment serves every plugin on a node, so a requirement
> pinned here can still be overridden by one pinned elsewhere. This plugin
> needs paho 2.x: it registers `CallbackAPIVersion.VERSION2` and reads reason
> codes from `on_publish`, neither of which exists in 1.x.

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
   ```
---

## Observability

Counters reach the log as a summary line and the `mqtt_publisher_stats` table
in the trigger's own database, at most once per `stats_interval`.

| Field                                       | Meaning                                                                                              |
|---------------------------------------------|------------------------------------------------------------------------------------------------------|
| `published`                                 | Messages that reached the socket                                                                     |
| `confirmed`                                 | Acknowledged — at QoS 0, written to the socket                                                       |
| `failed`                                    | Publishes the client refused, and rows whose topic could not be built                                |
| `buffered`                                  | Messages that entered the buffer                                                                     |
| `dropped_policy`                            | Discarded by `drop_policy` at `max_queue_bytes`                                                      |
| `dropped_age`                               | Discarded by `max_message_age`                                                                       |
| `dropped_undeliverable`                     | Retired after `max_delivery_attempts`, or refused by a reason code                                   |
| `dropped_oversized`                         | A single row that did not fit `max_payload_bytes`                                                    |
| `lost_disconnect`                           | QoS 0 messages a dropped connection took with it                                                     |
| `reconnects`                                | Clients built after the first                                                                        |
| `skipped_reads`                             | Scheduled ticks that read nothing because the client could not take it                               |
| `quota_refusals`                            | Times the broker answered `0x97 quota exceeded`                                                      |
| `queue_depth`, `queue_bytes`, `unconfirmed` | The buffer and the in-flight window right now                                                        |
| `client_id`                                 | A **field**, not a tag — it changes on every reload and would otherwise leave a trail of dead series |

Rows are tagged with `broker` (`host:port`) and `instance_name`.

**"Published" is not a delivery count.** What it proves depends on the QoS: at
QoS 0 nothing about the broker having received it, at QoS 1 that the broker
accepted it at least once, at QoS 2 that the four-way handshake completed.
`PUBCOMP` is **not** a promise of exactly-once here — that needs session state
surviving a disconnection, and the plugin connects with a clean session by
design. QoS 2 costs two extra round trips and adds nothing to QoS 1.

---

## Code overview

| File                                     | Contents                                    |
|------------------------------------------|---------------------------------------------|
| `mqtt_publisher.py`                      | The plugin, with the metadata docstring     |
| `mqtt_publisher_config_data_writes.toml` | Write-trigger configuration template        |
| `mqtt_publisher_config_scheduler.toml`   | Scheduled-trigger template                  |
| `mqtt_publisher_config_http.toml`        | HTTP-trigger template                       |
| `test_mqtt_publisher.py`                 | Tests with a mocked MQTT client and runtime |

| Function                         | Role                                                     |
|----------------------------------|----------------------------------------------------------|
| `process_writes`                 | Publishes the rows of a write                            |
| `process_scheduled_call`         | Publishes what each table gained since the previous tick |
| `process_request`                | Backfills a time range on demand                         |
| `ensure_client` / `build_client` | The connection's life, including when to replace it      |
| `drain`                          | Hands the buffer to the client within a time budget      |
| `build_messages`                 | Rows into topics and payloads                            |
| `publish_scheduled`              | The watermark, paging and the tick budget                |
| `run_backfill`                   | The backfill cursor and its answer                       |

---

## Troubleshooting

### Nothing arrives, and the log says nothing is wrong

On a **scheduled** trigger over a table another plugin writes, check
`settle_delay`. A derived row carries the timestamp of the period it describes
and lands a whole interval later, so under the default `settle_delay` (2s) it is
below the watermark by the time it appears and is never published. Use a
write trigger on that table, or set `settle_delay` above the producing plugin's
interval plus its offset and run time.

An empty tick is also indistinguishable from a quiet table — the plugin does
not warn about it, because telling the two apart would cost an extra query per
tick and the right configuration is known in advance from how the source
writes.

### On {{% product-name %}}.11, a scheduled trigger or a backfill publishes only part of a table

If the table has **no tag columns at all**, this is a known server defect
rather than the plugin: on the upgraded storage engine — the default for new
clusters since 3.11.0 — a query carrying a `time` predicate against a tagless
table returns only the rows still in the write buffer, and the ones already
flushed to disk are missing with no error. Both query-driven triggers read
exactly that way; a **write** trigger is unaffected because it runs no query.

Fixed in 3.12.0, where a time-filtered query returns every row of a tagless
table. On 3.11.x, add any tag column to the table so its rows stay visible to
the query.

### `max_message_age` and `settle_delay` are refused together

`max_message_age` must exceed `settle_delay`, or the clamp puts the lower bound
of every window above its upper bound and nothing is ever published; with the
default `settle_delay` of 2s, a `max_message_age` of 2s or less is refused. It
should also exceed `settle_delay` plus the schedule interval, or each tick skips the
part of its window the next tick's clamp has already passed. The plugin cannot
check the second, because the trigger specification never reaches it, but the
clamp logs every range it skips.

### The scheduled trigger falls further and further behind

The source writes more rows per interval than one tick publishes. Raise
`tick_budget`, raise `max_messages`, or shorten the schedule. A tick that spends
its budget with a full page still waiting says so in the log.

### The retained status says `offline` but the publisher is healthy

The trigger is invoked less often than 1.5 × `keep_alive`, so the broker closes
the connection between calls and publishes the will. Either leave
`status_topic` unset, or arrange for the trigger to fire often enough — for a
write trigger that means `all_tables` rather than one sparse table.

### The retained status says `online` after the trigger was deleted

Deleting a trigger does not close its client's socket; the broker notices when
its keepalive expires, 1.5 × `keep_alive` after the last packet, and publishes
the will then. At the default that is seven and a half minutes. Deleting and
recreating releases it in about three seconds instead.

### A connection attempt blocks the trigger for minutes

`connect_timeout` bounds the TCP connect and the CONNACK wait, but a TLS
handshake and a WebSocket upgrade are bounded by `keep_alive` — paho's doing,
not the plugin's — and name resolution by the system resolver alone. Against a
TLS endpoint that accepts the connection and then goes silent, lower
`keep_alive`.

### At QoS 1 a large burst drains slowly

One invocation confirms only about `max_inflight` messages per round trip within
`pump_budget`, then returns; the rest stay in the in-memory buffer and drain on
the next invocation. At the defaults (`max_inflight = 20`, `pump_budget = 50ms`)
a single 50 000-row write at `qos = 1` confirmed ~50 on the first invocation and
climbed ~50 per later write — nothing is lost, but a one-shot burst on a table
written rarely delivers slowly. Raising the two together helps dramatically: the
same 50 000 rows at `pump_budget = 2s`, `max_inflight = 200` confirmed ~12 000 in
one invocation. So for high QoS 1 volume, raise `max_inflight` and `pump_budget`
(and `max_unconfirmed_bytes` with them), watch `all_tables` so any write drains
the buffer, or publish at `qos = 0`, where a whole batch goes out in one
invocation. Remember the buffer is in memory: an undrained backlog is lost if the
server restarts.

### The broker throttles and the plugin does not say why

Under `mqtt_version = 5` a quota refusal arrives as `0x97` and is logged, and
the invocation stops handing messages over without dead-lettering any of them.
MQTT 3.1.1 has no reason codes, so the broker simply closes the connection and
it is indistinguishable from any other disconnection — a reason to prefer
version 5 against a broker with a published rate limit, AWS IoT Core's hundred
publishes a second per connection being the common one.

### A message the broker's ACL forbids is counted as delivered

Under MQTT 3.1.1 `PUBACK` carries no reason code, and Mosquitto answers a
forbidden publish with an ordinary one rather than closing, so the broker
discards the message and the plugin cannot know. Under `mqtt_version = 5` the
same publish returns `0x87` and is dropped, counted and logged.

### Memory grows while the broker is down

That is a write trigger holding what it cannot publish, bounded by
`max_queue_bytes`. Lower it, or set `max_message_age` so stale readings are
discarded rather than queued. A scheduled trigger does not do this — it stops
reading instead.

### Two triggers keep disconnecting each other

They share an explicit `client_id`. The broker allows one session per
identifier and must evict the previous holder, so give each trigger its own in
its own trigger arguments, or point them at separate files with
`config_file_path` — a shared TOML file ranks above the trigger arguments and
cannot be overridden from them.

### On a cluster every message arrives several times

`--node-spec` defaults to `all`, so every process node owns the trigger and
runs it: a schedule fires once per owning node on every tick, a write trigger
once per owning node on every WAL flush. Pin it with
`--node-spec nodes:<node-id>`. Each node holds its own cache, so its own
watermark, buffer and client, and nothing reconciles them.

### A trigger created before its table exists logs a warning

That is expected and is the normal order for a write trigger: placeholders and
filter types cannot be checked against a schema that does not exist yet. They
are checked once the table appears.

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
