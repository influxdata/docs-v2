---
title: Telegraf Controller release notes
description: >
  Important features, bug fixes, and changes in Telegraf Controller releases.
menu:
  telegraf_controller:
    name: Release notes
    parent: Reference
weight: 101
---

## v0.0.6-beta {date="2026-04-13"}

<!-- Link only be on the latest version, update and move with new versions. -->
[Download Telegraf Controller v0.0.6-beta](/telegraf/controller/install/#download-and-install-telegraf-controller)

> [!Important]
> #### Updated End User License Agreement (EULA)
>
> This release includes an updated
> [EULA for {{% product-name %}}](/telegraf/controller/reference/eula/). After
> upgrading to this release, **you are required to accept the updated EULA**
> before {{% product-name %}} starts. For information about different ways to
> accept the updated EULA, see
> [Install {{% product-name %}}--Review the EULA](https://docs.influxdata.com/telegraf/controller/install/#review-the-eula).

### Features

- Separate managed and external configurations on the agent detail page.
- Enhance Heartbeat plugin with HTTP client configuration options for transport,
  TLS, OAuth2, and Cookie Auth.
- Add plugin support to the Telegraf Builder UI:
  - Intel PMU (`inputs.intel_pmu`)
  - Intel PowerStat (`inputs.intel_powerstat`)
  - Intel RDT (`inputs.intel_rdt`)
  - Internal (`inputs.internal`)
  - Internet Speed (`inputs.internet_speed`)
  - Interrupts (`inputs.interrupts`)
  - IPMI Sensor (`inputs.ipmi_sensor`)
  - Ipset (`inputs.ipset`)
  - Iptables (`inputs.iptables`)
  - Jenkins (`inputs.jenkins`)
  - Jolokia2 Agent (`inputs.jolokia2_agent`)
  - JTI OpenConfig Telemetry (`inputs.jti_openconfig_telemetry`)
  - Kafka Consumer (`inputs.kafka_consumer`)
  - Kapacitor (`inputs.kapacitor`)
  - Kernel Vmstat (`inputs.kernel_vmstat`)
  - IPVS (`inputs.ipvs`)
  - Kibana (`inputs.kibana`)
  - Kinesis Consumer (`inputs.kinesis_consumer`)
  - KNX Listener (`inputs.knx_listener`)
  - Kubernetes (`inputs.kubernetes`)
  - Kubernetes Inventory (`inputs.kube_inventory`)
  - Lanz (`inputs.lanz`)
  - LDAP (`inputs.ldap`)
  - LeoFS (`inputs.leofs`)

### Bug fixes

- Fix typo in TOML parsing rename configuration.

---

## v0.0.5-beta {date="2026-03-26"}

### Important changes

This release introduces user and account management, API token authentication,
and configurable authentication options.
By default, authentication is required to interact with all API endpoints.
If you have agents reading configurations from and reporting heartbeats
to {{% product-name %}}, they will begin to fail with authorization errors.

**To avoid agent authorization errors:**

1.  Temporarily disable authentication on the **Heartbeat** and **Configs** APIs.
    You can use either the `--disable-auth-endpoints` command flag or the
    `DISABLED_AUTH_ENDPOINTS` environment variable when starting
    {{% product-name %}}.
    
    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Command flags](#)
[Environment Variables](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->
```bash
telegraf_controller --disable-auth-endpoints=configs,heartbeat
```

{{% /code-tab-content %}}
{{% code-tab-content %}}

<!--pytest.mark.skip-->
```bash
export DISABLED_AUTH_ENDPOINTS="configs,heartbeat"

telegraf_controller --disable-auth-endpoints=configs,heartbeat
```

{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

2.  [Create an API token](/telegraf/controller/tokens/create/) with read
    permissions on the **Configs** API and write permissions on the
    **Heartbeat** API.

3.  Use the `INFLUX_TOKEN` environment variable to define the `token` option
    in your heartbeat output plugin configuration:
    
    ```toml { .tc-dynamic-values }
    [[outputs.heartbeat]]
    # ...
    token = "${INFLUX_TOKEN}"
    ```
    
4.  Define the `INFLUX_TOKEN` environment variable in your Telegraf
    environment:
    
    <!--pytest.mark.skip-->
    ```bash {placeholders="YOUR_TELEGRAF_CONTROLLER_TOKEN"}
    export INFLUX_TOKEN=YOUR_TELEGRAF_CONTROLLER_TOKEN

    telegraf --config "https://localhost:8888/api/configs/..."
    ```

    Replace {{% code-placeholder-key %}}`YOUR_TELEGRAF_CONTROLLER_TOKEN`{{% /code-placeholder-key %}}
    with your {{% product-name %}} API token.
    
    > [!Important]
    > It's important to use the `INFLUX_TOKEN` environment variable.
    > When present, Telegraf uses this specific variable to set the token used
    > in the `Authorization` header when requesting the configuration.

5.  Navigate to the **Settings** page in {{% product-name %}} and reenable
    authentication on the Configs and Heartbeat APIs. Save your changes.

### Features

- Add user authentication and session management with login and setup pages.
- Add user management with invite system, password reset, and password
  complexity validation.
- Add token management with create workflow and management pages.
- Add account management page with ownership transfer flow.
- Add settings page.
- Add application version retrieval and display.
- Enhance Heartbeat plugin with logs, status configurations, and agent
  status checks.
- Add dynamic parsing component support for Exec and Google Cloud PubSub Push plugins.
- Add plugin support to the Telegraf Builder UI:
  - Aerospike (`inputs.aerospike`)
  - Alibaba Cloud Monitor Service (Aliyun) (`inputs.aliyuncms`)
  - Amazon Elastic Container Service (`inputs.ecs`)
  - AMD ROCm System Management Interface (SMI) (`inputs.amd_rocm_smi`)
  - AMQP Consumer (`inputs.amqp_consumer`)
  - Apache (`inputs.apache`)
  - APC UPSD (`inputs.apcupsd`)
  - Apache Aurora (`inputs.aurora`)
  - Azure Queue Storage (`inputs.azure_storage_queue`)
  - Bcache (`inputs.bcache`)
  - Beanstalkd (`inputs.beanstalkd`)
  - Beat (`inputs.beat`)
  - BIND 9 Nameserver (`inputs.bind`)
  - Bond (`inputs.bond`)
  - Burrow (`inputs.burrow`)
  - Ceph Storage (`inputs.ceph`)
  - chrony (`inputs.chrony`)
  - Cisco Model-Driven Telemetry (MDT) (`inputs.cisco_telemetry_mdt`)
  - ClickHouse (`inputs.clickhouse`)
  - Google Cloud PubSub Push (`inputs.cloud_pubsub_push`)
  - Amazon CloudWatch Metric Streams (`inputs.cloudwatch_metric_streams`)
  - Netfilter Conntrack (`inputs.conntrack`)
  - Hashicorp Consul (`inputs.consul`)
  - Hashicorp Consul Agent (`inputs.consul_agent`)
  - Bosch Rexroth ctrlX Data Layer (`inputs.ctrlx_datalayer`)
  - Mesosphere Distributed Cloud OS (`inputs.dcos`)
  - Device Mapper Cache (`inputs.dmcache`)
  - Data Plane Development Kit (DPDK) (`inputs.dpdk`)
  - Elasticsearch (`inputs.elasticsearch`)
  - Ethtool (`inputs.ethtool`)
  - Exec (`inputs.exec`)
  - Fibaro (`inputs.fibaro`)
  - File (`inputs.file`)
  - Filecount (`inputs.filecount`)
  - File statistics (`inputs.filestat`)
  - Fireboard (`inputs.fireboard`)
  - AWS Data Firehose (`inputs.firehose`)
  - Fluentd (`inputs.fluentd`)
  - Fritzbox (`inputs.fritzbox`)
  - GitHub (`inputs.github`)
  - gNMI (gRPC Network Management Interface) (`inputs.gnmi`)
  - Google Cloud Storage (`inputs.google_cloud_storage`)
  - GrayLog (`inputs.graylog`)
  - HAProxy (`inputs.haproxy`)
  - HDDtemp (`inputs.hddtemp`)
  - HTTP (`inputs.http`)
  - HTTP Listener v2 (`inputs.http_listener_v2`)
  - HueBridge (`inputs.huebridge`)
  - Hugepages (`inputs.hugepages`)
  - Icinga2 (`inputs.icinga2`)
  - InfiniBand (`inputs.infiniband`)
  - InfluxDB (`inputs.influxdb`)
  - InfluxDB Listener (`inputs.influxdb_listener`)
  - InfluxDB V2 Listener (`inputs.influxdb_v2_listener`)
  - Intel Baseband Accelerator (`inputs.intel_baseband`)
  - Intel® Dynamic Load Balancer (`inputs.intel_dlb`)
  - Intel® Platform Monitoring Technology (`inputs.intel_pmt`)

### Bug fixes

- Fix default Heartbeat plugin configuration and environment variable exports.

---

## v0.0.4-alpha {date="2026-02-05"}

### Features

- Require InfluxData EULA acceptance before starting the server.
- Add plugin support to the Telegraf Builder UI and TOML parser:
  - ActiveMQ (`inputs.activemq`)
  - Vault (`secretstores.vault`)
  - All parsers
  - All serializers
- Add support for custom logs directory.
- Reduce binary size.

### Bug fixes

- Fix question mark position in deletion popup.

---

## v0.0.3-alpha {date="2026-01-14"}

### Features

- Add linux-arm64 binary support.
- Add build validation for missing plugins.
- Add local file handling for configurations.

---

## v0.0.2-alpha {date="2026-01-13"}

### Features

- Identify external configurations for Telegraf agents.
- Add SSL support for backend connections.
- Add health check status API endpoint.
- Add `Last-Modified` header to GET TOML API response and remove duplicate
  protocol handling.
- Compile native Rust NAPI server for heartbeat service.

### Bug fixes

- Fix default parsing unit to use seconds.
- Fix command line string generation.

---

## v0.0.1-alpha {date="2026-01-01"}

_Initial alpha build of Telegraf Controller._
