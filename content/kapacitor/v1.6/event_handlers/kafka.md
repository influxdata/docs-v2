---
title: Kafka event handler
list_title: Kafka
description: >
  The Kafka event handler allows you to send Kapacitor alerts to an Apache Kafka cluster. This page includes configuration options and usage examples.
menu:
  kapacitor_1_6_ref:
    name: Kafka
    weight: 600
    parent: Event handlers
---

[Apache Kafka](https://kafka.apache.org/) is a distributed streaming platform
designed for building real-time data pipelines and streaming apps.
Configure Kapacitor to send alert messages to a Kafka cluster.

## Configuration
Configuration as well as default [option](#options) values for the Kafka event
handler are set in your `kapacitor.conf`.
Below is an example configuration:

```toml
[[kafka]]
  enabled = true
  id = "localhost"
  brokers = []
  timeout = "10s"
  batch-size = 100
  batch-timeout = "1s"
  use-ssl = false
  ssl-ca = ""
  ssl-cert = ""
  ssl-key = ""
  insecure-skip-verify = false
  # Optional SASL configuration
  sasl-username = "xxxxx"
  sasl-password = "xxxxxxxx"
  sasl-mechanism = ""
  sasl-version = ""
  # Use if sasl-mechanism is GSSAPI. GSSAPI is for organizations using Kerberos.
  sasl-gssapi-service-name = ""
  sasl-gssapi-auth-type = "KRB5_USER_AUTH"
  sasl-gssapi-disable-pafxfast = false
  sasl-gssapi-kerberos-config-path = "/"
  sasl-gssapi-key-tab-path = ""
  sasl-gssapi-realm = "realm"
  # Use if sasl-mechanism is `OAUTHBEARER` (experimental).
  sasl-access-token = ""

```

{{% note %}}
Multiple Kafka clients may be configured with multiple `[[kafka]]` sections in TOML.
The `id` acts as a unique identifier for each configured Kafka client.
{{% /note %}}

#### enabled
Set to `true` to enable the Kafka event handler.

#### id
A unique identifier for the Kafka cluster.

#### brokers
List of Kafka broker addresses using the `host:port` format.

#### timeout
Timeout on network operations with the Kafka brokers.
If set to 0, a default of 10s is used.

#### batch-size
The number of messages batched before being sent to Kafka.
If set to 0, a default of 100 is used.

#### batch-timeout
The maximum amount of time to wait before flushing an incomplete batch.
If set to 0, a default of 1s is used.

#### use-ssl
Enable SSL communication.
Must be `true` for other SSL options to take effect.

#### ssl-ca
Path to certificate authority file.

#### ssl-cert
Path to host certificate file.

#### ssl-key
Path to certificate private key file.

#### insecure-skip-verify
Use SSL but skip chain and host verification.
_(Required if using a self-signed certificate.)_

### (Optional) SASL configuration

#### sasl-username
Username to use for SASL authentication.

#### sasl-password
Password to use for SASL authentication.

#### sasl-mechanism
SASL mechanism type. Options include `GSSAPI`, `OAUTHBEARER`, `PLAIN`.

#### sasl-version
SASL protocol version.

#### sasl-gssapi-service-name
The service name for GSSAPI.

#### sasl-gssapi-auth-type
The authorization type for GSSAPI.

####  sasl-gssapi-disable-pafxfast
Set to `true` or `false`.

####  sasl-gssapi-kerberos-config-path
Path to the Kerberos config file.

#### sasl-gssapi-key-tab-path
Path to the Kerberos key tab.

####  sasl-gssapi-realm
Default Kerberos realm.

#### sasl-access-token
Used if the SASL mechanism is `OAUTHBEARER` (experimental).

## Options
The following Kafka event handler options can be set in a
[handler file](/kapacitor/v1.6/event_handlers/#create-a-topic-handler-with-a-handler-file) or when using
`.kafka()` in a TICKscript.

| Name                 | Type    | Description                                                                                               |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| cluster              | string  | Name of the Kafka cluster.                                                                                |
| topic                | string  | Kafka topic. _In TICKscripts, this is set using `.kafkaTopic()`._                                         |
| template             | string  | Message template.                                                                                         |
| disablePartitionById | boolean | Disable partitioning Kafka messages by message ID.                                                        |
| partitionAlgorithm   | string  | Algorithm to use to assign message IDs to Kafka partitions (`crc32` _(default)_, `murmur2`, or `fnv-1a`). |

{{% note %}}
#### Kafka message partitioning
In **Kapacitor 1.6+**, messages with the same ID are sent to the same Kafka partition.
Previously, messages were sent to the Kafka partition with the least amount of data, regardless of the message ID.
Messages with no ID are spread randomly between partitions.
This aligns the Kapacitor concept of message IDs with the Kafka concept of message keys.

To revert to the previous behavior, use the **disablePartitionById** option.

When partitioning by ID, use the **partitionHashAlgorithm** to specify the
method used to assign message IDs to Kafka partitions.
Kapacitor supports the following partitioning algorithms:

- **crc32**: _(default)_ aligns with `librdkafka` and `confluent-kafka-go`
- **murmur2**: aligns with canonical Java partitioning logic
- **fnv-1a**: aligns with Shopify's `sarama` project
{{% /note %}}

### Example: handler file
```yaml
id: kafka-event-handler
topic: kapacitor-topic-name
kind: kafka
options:
  cluster: kafka-cluster
  topic: kafka-topic-name
  template: kafka-template-name
  disablePartitionById: false
  partitionAlgorithm: crc32
```

### Example: TICKscript
```js
|alert()
  // ...
  .kafka()
    .cluster('kafka-cluster')
    .kafkaTopic('kafka-topic-name')
    .template('kafka-template-name')
    .disablePartitionById(FALSE)
    .partitionAlgorithm('crc32')
```

##  Using the Kafka Event Handler
With the Kafka event handler enabled in your `kapacitor.conf`, use the `.kafka()`
attribute in your TICKscripts to send alerts to a Kafka cluster or define a
Kafka handler that subscribes to a topic and sends published alerts to Kafka.

The examples below use the following Kafka configuration defined in the `kapacitor.conf`:

_**Kafka settings in kapacitor.conf**_  
```toml
[[kafka]]
  enabled = true
  id = "infra-monitoring"
  brokers = ["123.45.67.89:9092", "123.45.67.90:9092"]
  timeout = "10s"
  batch-size = 100
  batch-timeout = "1s"
  use-ssl = true
  ssl-ca = "/etc/ssl/certs/ca.crt"
  ssl-cert = "/etc/ssl/certs/cert.crt"
  ssl-key = "/etc/ssl/certs/cert-key.key"
  insecure-skip-verify = true
```

### Send alerts to a Kafka cluster from a TICKscript

The following TICKscript uses the `.kafka()` event handler to send the message,
"Hey, check your CPU", whenever idle CPU usage drops below 10%.
It publishes the messages to the `cpu-alerts` topic in the `infra-monitoring`
Kafka cluster defined in the `kapacitor.conf`.

_**kafka-cpu-alert.tick**_  
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .kafka()
      .kafkaTopic('cpu-alerts')
```

### Send alerts to a Kafka cluster from a defined handler

The following setup sends an alert to the `cpu` topic with the message, "Hey,
check your CPU". A Kafka handler is added that subscribes to the `cpu` topic and
publishes all alert messages to the `cpu-alerts` topic associated with the
`infra-monitoring` Kafka cluster defined in the `kapacitor.conf`.

Create a TICKscript that publishes alert messages to a topic.
The TICKscript below sends an alert message to the `cpu` topic any time CPU
idle usage drops below 10% _(or CPU usage is above 90%)_.

##### cpu\_alert.tick
```js
stream
  |from()
    .measurement('cpu')
  |alert()
    .crit(lambda: "usage_idle" < 10)
    .message('Hey, check your CPU')
    .topic('cpu')
```

Add and enable the TICKscript:

```bash
kapacitor define cpu_alert -tick cpu_alert.tick
kapacitor enable cpu_alert
```

Create a handler file that subscribes to the `cpu` topic and uses the Kafka
event handler to send alerts to the `cpu-alerts` topic in Kafka.

##### kafka\_cpu\_handler.yaml
```yaml
id: kafka-cpu-alert
topic: cpu
kind: kafka
options:
  topic: 'cpu-alerts'
```

Add the handler:

```bash
kapacitor define-topic-handler kafka_cpu_handler.yaml
```

### Using SASL with Kapacitor

To use an authentication method other than SSL, configure Kapacitor to use SASL. 
An example would be using Kapacitor to authenticate directly against Kafka with a username/password. 
Multiple configuration options are available, but the most common usage is username and password as shown in the following example:

```toml
[[kafka]]
  enabled = true
  id = "infra-monitoring"
  brokers = ["123.45.67.89:9092", "123.45.67.90:9092"]
  timeout = "10s"
  batch-size = 100
  batch-timeout = "1s"
  use-ssl = true
  ssl-ca = "/etc/ssl/certs/ca.crt"
  ssl-cert = "/etc/ssl/certs/cert.crt"
  ssl-key = "/etc/ssl/certs/cert-key.key"
  insecure-skip-verify = true
  sasl-username = "kafka"
  sasl-password = "kafkapassword"
```



