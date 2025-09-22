---
title: Telegraf release notes
description: Important features and changes in the latest version of Telegraf.
aliases:
  - /telegraf/v1/reference/release-notes/influxdb/
  - /telegraf/v1/about_the_project/release-notes-changelog/
  - /telegraf/v1/release-notes-changelog/
menu:
  telegraf_v1_ref:
    name: Release notes
    weight: 60
---

## v1.36.1 {date="2025-09-08"}

### Bugfixes

- [#17605](https://github.com/influxdata/telegraf/pull/17605) `outputs.influxdb` Fix crash on init

## v1.36.0 {date="2025-09-08"}

### Important Changes

- Pull request [#17355](https://github.com/influxdata/telegraf/pull/17355) updates `profiles` support in `inputs.opentelemetry` from v1 experimental to v1 development, following upstream changes to the experimental API. This update modifies metric output. For example, the `frame_type`, `stack_trace_id`, `build_id`, and `build_id_type` fields are no longer reported. The value format of other fields or tags might also have changed. For more information, see the [OpenTelemetry documentation](https://opentelemetry.io/docs/).

### New Plugins

- [#17368](https://github.com/influxdata/telegraf/pull/17368) `inputs.turbostat` Add plugin
- [#17078](https://github.com/influxdata/telegraf/pull/17078) `processors.round` Add plugin

### Features

- [#16705](https://github.com/influxdata/telegraf/pull/16705) `agent` Introduce labels and selectors to enable and disable plugins
- [#17547](https://github.com/influxdata/telegraf/pull/17547) `inputs.influxdb_v2_listener` Add `/health` route
- [#17312](https://github.com/influxdata/telegraf/pull/17312) `inputs.internal` Allow to collect statistics per plugin instance
- [#17024](https://github.com/influxdata/telegraf/pull/17024) `inputs.lvm` Add sync_percent for lvm_logical_vol
- [#17355](https://github.com/influxdata/telegraf/pull/17355) `inputs.opentelemetry` Upgrade otlp proto module
- [#17156](https://github.com/influxdata/telegraf/pull/17156) `inputs.syslog` Add support for RFC3164 over TCP
- [#17543](https://github.com/influxdata/telegraf/pull/17543) `inputs.syslog` Allow limiting message size in octet counting mode
- [#17539](https://github.com/influxdata/telegraf/pull/17539) `inputs.x509_cert` Add support for Windows certificate stores
- [#17244](https://github.com/influxdata/telegraf/pull/17244) `output.nats` Allow disabling stream creation for externally managed streams
- [#17474](https://github.com/influxdata/telegraf/pull/17474) `outputs.elasticsearch` Support array headers and preserve commas in values
- [#17548](https://github.com/influxdata/telegraf/pull/17548) `outputs.influxdb` Add internal statistics for written bytes
- [#17213](https://github.com/influxdata/telegraf/pull/17213) `outputs.nats` Allow providing a subject layout
- [#17346](https://github.com/influxdata/telegraf/pull/17346) `outputs.nats` Enable batch serialization with use_batch_format
- [#17249](https://github.com/influxdata/telegraf/pull/17249) `outputs.sql` Allow sending batches of metrics in transactions
- [#17510](https://github.com/influxdata/telegraf/pull/17510) `parsers.avro` Support record arrays at root level
- [#17365](https://github.com/influxdata/telegraf/pull/17365) `plugins.snmp` Allow debug logging in gosnmp
- [#17345](https://github.com/influxdata/telegraf/pull/17345) `selfstat` Implement collection of plugin-internal statistics

### Bugfixes

- [#17411](https://github.com/influxdata/telegraf/pull/17411) `inputs.diskio` Handle counter wrapping in io fields
- [#17551](https://github.com/influxdata/telegraf/pull/17551) `inputs.s7comm` Use correct value for string length with 'extra' parameter
- [#17579](https://github.com/influxdata/telegraf/pull/17579) `internal` Extract go version more robustly
- [#17566](https://github.com/influxdata/telegraf/pull/17566) `outputs` Retrigger batch-available-events only if at least one metric was written successfully
- [#17381](https://github.com/influxdata/telegraf/pull/17381) `packaging` Rename rpm from loong64 to loongarch64

### Dependency Updates

- [#17519](https://github.com/influxdata/telegraf/pull/17519) `deps` Bump cloud.google.com/go/storage from 1.56.0 to 1.56.1
- [#17532](https://github.com/influxdata/telegraf/pull/17532) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azcore from 1.18.2 to 1.19.0
- [#17494](https://github.com/influxdata/telegraf/pull/17494) `deps` Bump github.com/SAP/go-hdb from 1.13.12 to 1.14.0
- [#17488](https://github.com/influxdata/telegraf/pull/17488) `deps` Bump github.com/antchfx/xpath from 1.3.4 to 1.3.5
- [#17540](https://github.com/influxdata/telegraf/pull/17540) `deps` Bump github.com/aws/aws-sdk-go-v2/config from 1.31.0 to 1.31.2
- [#17538](https://github.com/influxdata/telegraf/pull/17538) `deps` Bump github.com/aws/aws-sdk-go-v2/credentials from 1.18.4 to 1.18.6
- [#17517](https://github.com/influxdata/telegraf/pull/17517) `deps` Bump github.com/aws/aws-sdk-go-v2/feature/ec2/imds from 1.18.3 to 1.18.4
- [#17528](https://github.com/influxdata/telegraf/pull/17528) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.48.0 to 1.48.2
- [#17536](https://github.com/influxdata/telegraf/pull/17536) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.56.0 to 1.57.0
- [#17524](https://github.com/influxdata/telegraf/pull/17524) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.46.0 to 1.49.1
- [#17493](https://github.com/influxdata/telegraf/pull/17493) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.242.0 to 1.244.0
- [#17527](https://github.com/influxdata/telegraf/pull/17527) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.244.0 to 1.246.0
- [#17530](https://github.com/influxdata/telegraf/pull/17530) `deps` Bump github.com/aws/aws-sdk-go-v2/service/kinesis from 1.38.0 to 1.39.1
- [#17534](https://github.com/influxdata/telegraf/pull/17534) `deps` Bump github.com/aws/aws-sdk-go-v2/service/sts from 1.37.0 to 1.38.0
- [#17513](https://github.com/influxdata/telegraf/pull/17513) `deps` Bump github.com/aws/aws-sdk-go-v2/service/timestreamwrite from 1.34.0 to 1.34.2
- [#17514](https://github.com/influxdata/telegraf/pull/17514) `deps` Bump github.com/coreos/go-systemd/v22 from 22.5.0 to 22.6.0
- [#17563](https://github.com/influxdata/telegraf/pull/17563) `deps` Bump github.com/facebook/time from 0.0.0-20240626113945-18207c5d8ddc to 0.0.0-20250903103710-a5911c32cdb9
- [#17526](https://github.com/influxdata/telegraf/pull/17526) `deps` Bump github.com/gophercloud/gophercloud/v2 from 2.7.0 to 2.8.0
- [#17537](https://github.com/influxdata/telegraf/pull/17537) `deps` Bump github.com/microsoft/go-mssqldb from 1.9.2 to 1.9.3
- [#17490](https://github.com/influxdata/telegraf/pull/17490) `deps` Bump github.com/nats-io/nats-server/v2 from 2.11.7 to 2.11.8
- [#17523](https://github.com/influxdata/telegraf/pull/17523) `deps` Bump github.com/nats-io/nats.go from 1.44.0 to 1.45.0
- [#17492](https://github.com/influxdata/telegraf/pull/17492) `deps` Bump github.com/safchain/ethtool from 0.5.10 to 0.6.2
- [#17486](https://github.com/influxdata/telegraf/pull/17486) `deps` Bump github.com/snowflakedb/gosnowflake from 1.15.0 to 1.16.0
- [#17541](https://github.com/influxdata/telegraf/pull/17541) `deps` Bump github.com/tidwall/wal from 1.1.8 to 1.2.0
- [#17529](https://github.com/influxdata/telegraf/pull/17529) `deps` Bump github.com/vmware/govmomi from 0.51.0 to 0.52.0
- [#17496](https://github.com/influxdata/telegraf/pull/17496) `deps` Bump go.opentelemetry.io/collector/pdata from 1.36.1 to 1.38.0
- [#17533](https://github.com/influxdata/telegraf/pull/17533) `deps` Bump go.opentelemetry.io/collector/pdata from 1.38.0 to 1.39.0
- [#17516](https://github.com/influxdata/telegraf/pull/17516) `deps` Bump go.step.sm/crypto from 0.69.0 to 0.70.0
- [#17499](https://github.com/influxdata/telegraf/pull/17499) `deps` Bump golang.org/x/mod from 0.26.0 to 0.27.0
- [#17497](https://github.com/influxdata/telegraf/pull/17497) `deps` Bump golang.org/x/net from 0.42.0 to 0.43.0
- [#17487](https://github.com/influxdata/telegraf/pull/17487) `deps` Bump google.golang.org/api from 0.246.0 to 0.247.0
- [#17531](https://github.com/influxdata/telegraf/pull/17531) `deps` Bump google.golang.org/api from 0.247.0 to 0.248.0
- [#17520](https://github.com/influxdata/telegraf/pull/17520) `deps` Bump google.golang.org/grpc from 1.74.2 to 1.75.0
- [#17518](https://github.com/influxdata/telegraf/pull/17518) `deps` Bump google.golang.org/protobuf from 1.36.7 to 1.36.8
- [#17498](https://github.com/influxdata/telegraf/pull/17498) `deps` Bump k8s.io/client-go from 0.33.3 to 0.33.4
- [#17515](https://github.com/influxdata/telegraf/pull/17515) `deps` Bump super-linter/super-linter from 8.0.0 to 8.1.0

## v1.35.4 {date="2025-08-18"}

### Bugfixes

- [#17451](https://github.com/influxdata/telegraf/pull/17451) `agent` Update help message for `--test` CLI flag
- [#17413](https://github.com/influxdata/telegraf/pull/17413) `inputs.gnmi` Handle empty updates in gnmi notification response
- [#17445](https://github.com/influxdata/telegraf/pull/17445) `inputs.redfish` Log correct address on HTTP error

### Dependency Updates

- [#17454](https://github.com/influxdata/telegraf/pull/17454) `deps` Bump actions/checkout from 4 to 5
- [#17404](https://github.com/influxdata/telegraf/pull/17404) `deps` Bump cloud.google.com/go/storage from 1.55.0 to 1.56.0
- [#17428](https://github.com/influxdata/telegraf/pull/17428) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azcore from 1.18.1 to 1.18.2
- [#17455](https://github.com/influxdata/telegraf/pull/17455) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azidentity from 1.10.1 to 1.11.0
- [#17383](https://github.com/influxdata/telegraf/pull/17383) `deps` Bump github.com/ClickHouse/clickhouse-go/v2 from 2.37.2 to 2.39.0
- [#17435](https://github.com/influxdata/telegraf/pull/17435) `deps` Bump github.com/ClickHouse/clickhouse-go/v2 from 2.39.0 to 2.40.1
- [#17393](https://github.com/influxdata/telegraf/pull/17393) `deps` Bump github.com/apache/arrow-go/v18 from 18.3.1 to 18.4.0
- [#17439](https://github.com/influxdata/telegraf/pull/17439) `deps` Bump github.com/apache/inlong/inlong-sdk/dataproxy-sdk-twins/dataproxy-sdk-golang from 1.0.3 to 1.0.5
- [#17437](https://github.com/influxdata/telegraf/pull/17437) `deps` Bump github.com/aws/aws-sdk-go-v2 from 1.37.0 to 1.37.2
- [#17402](https://github.com/influxdata/telegraf/pull/17402) `deps` Bump github.com/aws/aws-sdk-go-v2/config from 1.29.17 to 1.30.0
- [#17458](https://github.com/influxdata/telegraf/pull/17458) `deps` Bump github.com/aws/aws-sdk-go-v2/config from 1.30.1 to 1.31.0
- [#17391](https://github.com/influxdata/telegraf/pull/17391) `deps` Bump github.com/aws/aws-sdk-go-v2/credentials from 1.17.70 to 1.18.0
- [#17436](https://github.com/influxdata/telegraf/pull/17436) `deps` Bump github.com/aws/aws-sdk-go-v2/credentials from 1.18.1 to 1.18.3
- [#17434](https://github.com/influxdata/telegraf/pull/17434) `deps` Bump github.com/aws/aws-sdk-go-v2/feature/ec2/imds from 1.18.0 to 1.18.2
- [#17461](https://github.com/influxdata/telegraf/pull/17461) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.45.3 to 1.48.0
- [#17392](https://github.com/influxdata/telegraf/pull/17392) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.51.0 to 1.54.0
- [#17440](https://github.com/influxdata/telegraf/pull/17440) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.54.0 to 1.55.0
- [#17473](https://github.com/influxdata/telegraf/pull/17473) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.55.0 to 1.56.0
- [#17431](https://github.com/influxdata/telegraf/pull/17431) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.44.0 to 1.46.0
- [#17470](https://github.com/influxdata/telegraf/pull/17470) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.231.0 to 1.242.0
- [#17397](https://github.com/influxdata/telegraf/pull/17397) `deps` Bump github.com/aws/aws-sdk-go-v2/service/kinesis from 1.35.3 to 1.36.0
- [#17430](https://github.com/influxdata/telegraf/pull/17430) `deps` Bump github.com/aws/aws-sdk-go-v2/service/kinesis from 1.36.0 to 1.37.0
- [#17469](https://github.com/influxdata/telegraf/pull/17469) `deps` Bump github.com/aws/aws-sdk-go-v2/service/kinesis from 1.37.0 to 1.38.0
- [#17432](https://github.com/influxdata/telegraf/pull/17432) `deps` Bump github.com/aws/aws-sdk-go-v2/service/sts from 1.35.0 to 1.36.0
- [#17401](https://github.com/influxdata/telegraf/pull/17401) `deps` Bump github.com/aws/aws-sdk-go-v2/service/timestreamwrite from 1.31.2 to 1.32.0
- [#17421](https://github.com/influxdata/telegraf/pull/17421) `deps` Bump github.com/aws/aws-sdk-go-v2/service/timestreamwrite from 1.32.0 to 1.33.0
- [#17464](https://github.com/influxdata/telegraf/pull/17464) `deps` Bump github.com/aws/aws-sdk-go-v2/service/timestreamwrite from 1.33.0 to 1.34.0
- [#17457](https://github.com/influxdata/telegraf/pull/17457) `deps` Bump github.com/clarify/clarify-go from 0.4.0 to 0.4.1
- [#17407](https://github.com/influxdata/telegraf/pull/17407) `deps` Bump github.com/docker/docker from 28.3.2+incompatible to 28.3.3+incompatible
- [#17463](https://github.com/influxdata/telegraf/pull/17463) `deps` Bump github.com/docker/go-connections from 0.5.0 to 0.6.0
- [#17394](https://github.com/influxdata/telegraf/pull/17394) `deps` Bump github.com/golang-jwt/jwt/v5 from 5.2.2 to 5.2.3
- [#17423](https://github.com/influxdata/telegraf/pull/17423) `deps` Bump github.com/gopacket/gopacket from 1.3.1 to 1.4.0
- [#17399](https://github.com/influxdata/telegraf/pull/17399) `deps` Bump github.com/jedib0t/go-pretty/v6 from 6.6.7 to 6.6.8
- [#17422](https://github.com/influxdata/telegraf/pull/17422) `deps` Bump github.com/lxc/incus/v6 from 6.14.0 to 6.15.0
- [#17429](https://github.com/influxdata/telegraf/pull/17429) `deps` Bump github.com/miekg/dns from 1.1.67 to 1.1.68
- [#17433](https://github.com/influxdata/telegraf/pull/17433) `deps` Bump github.com/nats-io/nats-server/v2 from 2.11.6 to 2.11.7
- [#17426](https://github.com/influxdata/telegraf/pull/17426) `deps` Bump github.com/nats-io/nats.go from 1.43.0 to 1.44.0
- [#17456](https://github.com/influxdata/telegraf/pull/17456) `deps` Bump github.com/redis/go-redis/v9 from 9.11.0 to 9.12.1
- [#17420](https://github.com/influxdata/telegraf/pull/17420) `deps` Bump github.com/shirou/gopsutil/v4 from 4.25.6 to 4.25.7
- [#17388](https://github.com/influxdata/telegraf/pull/17388) `deps` Bump github.com/testcontainers/testcontainers-go/modules/azure from 0.37.0 to 0.38.0
- [#17382](https://github.com/influxdata/telegraf/pull/17382) `deps` Bump github.com/testcontainers/testcontainers-go/modules/kafka from 0.37.0 to 0.38.0
- [#17427](https://github.com/influxdata/telegraf/pull/17427) `deps` Bump github.com/yuin/goldmark from 1.7.12 to 1.7.13
- [#17386](https://github.com/influxdata/telegraf/pull/17386) `deps` Bump go.opentelemetry.io/collector/pdata from 1.36.0 to 1.36.1
- [#17425](https://github.com/influxdata/telegraf/pull/17425) `deps` Bump go.step.sm/crypto from 0.67.0 to 0.68.0
- [#17462](https://github.com/influxdata/telegraf/pull/17462) `deps` Bump go.step.sm/crypto from 0.68.0 to 0.69.0
- [#17460](https://github.com/influxdata/telegraf/pull/17460) `deps` Bump golang.org/x/crypto from 0.40.0 to 0.41.0
- [#17424](https://github.com/influxdata/telegraf/pull/17424) `deps` Bump google.golang.org/api from 0.243.0 to 0.244.0
- [#17459](https://github.com/influxdata/telegraf/pull/17459) `deps` Bump google.golang.org/api from 0.244.0 to 0.246.0
- [#17465](https://github.com/influxdata/telegraf/pull/17465) `deps` Bump google.golang.org/protobuf from 1.36.6 to 1.36.7
- [#17384](https://github.com/influxdata/telegraf/pull/17384) `deps` Bump k8s.io/apimachinery from 0.33.2 to 0.33.3
- [#17389](https://github.com/influxdata/telegraf/pull/17389) `deps` Bump k8s.io/client-go from 0.33.2 to 0.33.3
- [#17396](https://github.com/influxdata/telegraf/pull/17396) `deps` Bump modernc.org/sqlite from 1.38.0 to 1.38.1
- [#17385](https://github.com/influxdata/telegraf/pull/17385) `deps` Bump software.sslmate.com/src/go-pkcs12 from 0.5.0 to 0.6.0
- [#17390](https://github.com/influxdata/telegraf/pull/17390) `deps` Bump super-linter/super-linter from 7.4.0 to 8.0.0
- [#17448](https://github.com/influxdata/telegraf/pull/17448) `deps` Fix collectd dependency not resolving
- [#17410](https://github.com/influxdata/telegraf/pull/17410) `deps` Migrate from cloud.google.com/go/pubsub to v2

## v1.35.3 {date="2025-07-28"}

### Bug fixes

- [#17373](https://github.com/influxdata/telegraf/pull/17373) `agent` Handle nil timer on telegraf reload when no debounce is specified
- [#17340](https://github.com/influxdata/telegraf/pull/17340) `agent` Make Windows service install more robust
- [#17310](https://github.com/influxdata/telegraf/pull/17310) `outputs.sql` Add timestamp to derived datatypes
- [#17349](https://github.com/influxdata/telegraf/pull/17349) `outputs` Retrigger batch-available-events only for non-failing writes
- [#17293](https://github.com/influxdata/telegraf/pull/17293) `parsers.json_v2` Respect string type for objects and arrays
- [#17367](https://github.com/influxdata/telegraf/pull/17367) `plugins.snmp` Update gosnmp to prevent panic in snmp agents
- [#17292](https://github.com/influxdata/telegraf/pull/17292) `processors.snmp_lookup` Avoid re-enqueing updates after plugin stopped
- [#17369](https://github.com/influxdata/telegraf/pull/17369) `processors.snmp_lookup` Prevent deadlock during plugin shutdown

### Dependency updates

- [#17320](https://github.com/influxdata/telegraf/pull/17320) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azcore from 1.18.0 to 1.18.1
- [#17328](https://github.com/influxdata/telegraf/pull/17328) `deps` Bump github.com/SAP/go-hdb from 1.13.11 to 1.13.12
- [#17301](https://github.com/influxdata/telegraf/pull/17301) `deps` Bump github.com/SAP/go-hdb from 1.13.9 to 1.13.11
- [#17326](https://github.com/influxdata/telegraf/pull/17326) `deps` Bump github.com/alitto/pond/v2 from 2.4.0 to 2.5.0
- [#17295](https://github.com/influxdata/telegraf/pull/17295) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.227.0 to 1.230.0
- [#17332](https://github.com/influxdata/telegraf/pull/17332) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.230.0 to 1.231.0
- [#17300](https://github.com/influxdata/telegraf/pull/17300) `deps` Bump github.com/docker/docker from 28.3.0+incompatible to 28.3.1+incompatible
- [#17334](https://github.com/influxdata/telegraf/pull/17334) `deps` Bump github.com/docker/docker from 28.3.1+incompatible to 28.3.2+incompatible
- [#17327](https://github.com/influxdata/telegraf/pull/17327) `deps` Bump github.com/google/cel-go from 0.25.0 to 0.26.0
- [#17331](https://github.com/influxdata/telegraf/pull/17331) `deps` Bump github.com/miekg/dns from 1.1.66 to 1.1.67
- [#17297](https://github.com/influxdata/telegraf/pull/17297) `deps` Bump github.com/nats-io/nats-server/v2 from 2.11.5 to 2.11.6
- [#17321](https://github.com/influxdata/telegraf/pull/17321) `deps` Bump github.com/openconfig/goyang from 1.6.2 to 1.6.3
- [#17298](https://github.com/influxdata/telegraf/pull/17298) `deps` Bump github.com/prometheus/procfs from 0.16.1 to 0.17.0
- [#17296](https://github.com/influxdata/telegraf/pull/17296) `deps` Bump github.com/shirou/gopsutil/v4 from 4.25.5 to 4.25.6
- [#17299](https://github.com/influxdata/telegraf/pull/17299) `deps` Bump github.com/snowflakedb/gosnowflake from 1.14.1 to 1.15.0
- [#17323](https://github.com/influxdata/telegraf/pull/17323) `deps` Bump go.opentelemetry.io/collector/pdata from 1.35.0 to 1.36.0
- [#17091](https://github.com/influxdata/telegraf/pull/17091) `deps` Bump go.step.sm/crypto from 0.64.0 to 0.67.0
- [#17330](https://github.com/influxdata/telegraf/pull/17330) `deps` Bump golang.org/x/crypto from 0.39.0 to 0.40.0
- [#17322](https://github.com/influxdata/telegraf/pull/17322) `deps` Bump golang.org/x/mod from 0.25.0 to 0.26.0
- [#17336](https://github.com/influxdata/telegraf/pull/17336) `deps` Bump golang.org/x/net from 0.41.0 to 0.42.0
- [#17337](https://github.com/influxdata/telegraf/pull/17337) `deps` Bump golang.org/x/sys from 0.33.0 to 0.34.0
- [#17335](https://github.com/influxdata/telegraf/pull/17335) `deps` Bump golang.org/x/term from 0.32.0 to 0.33.0
- [#17294](https://github.com/influxdata/telegraf/pull/17294) `deps` Bump google.golang.org/api from 0.239.0 to 0.240.0
- [#17325](https://github.com/influxdata/telegraf/pull/17325) `deps` Bump google.golang.org/api from 0.240.0 to 0.241.0
- [#17138](https://github.com/influxdata/telegraf/pull/17138) `deps` Bump modernc.org/sqlite from 1.37.0 to 1.38.0

## v1.35.2 {date="2025-07-07"}

### Bug fixes

- [#17248](https://github.com/influxdata/telegraf/pull/17248) `agent` Add missing config flags for migrate command
- [#17240](https://github.com/influxdata/telegraf/pull/17240) `disk-buffer` Correctly reset the mask after adding to an empty buffer
- [#17284](https://github.com/influxdata/telegraf/pull/17284) `disk-buffer` Expire metric tracking information in the right place
- [#17257](https://github.com/influxdata/telegraf/pull/17257) `disk-buffer` Mask old tracking metrics on restart
- [#17247](https://github.com/influxdata/telegraf/pull/17247) `disk-buffer` Remove empty buffer on close
- [#17285](https://github.com/influxdata/telegraf/pull/17285) `inputs.gnmi` Avoid interpreting path elements with multiple colons as namespace
- [#17278](https://github.com/influxdata/telegraf/pull/17278) `inputs.gnmi` Handle base64 encoded IEEE-754 floats correctly
- [#17258](https://github.com/influxdata/telegraf/pull/17258) `inputs.kibana` Support Kibana 8.x status API format change
- [#17214](https://github.com/influxdata/telegraf/pull/17214) `inputs.ntpq` Fix ntpq field misalignment parsing errors
- [#17234](https://github.com/influxdata/telegraf/pull/17234) `outputs.microsoft_fabric` Correct app name
- [#17291](https://github.com/influxdata/telegraf/pull/17291) `outputs.nats` Avoid initializing Jetstream unconditionally
- [#17246](https://github.com/influxdata/telegraf/pull/17246) `outputs` Retrigger batch-available-events correctly

### Dependency updates

- [#17217](https://github.com/influxdata/telegraf/pull/17217) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs from 1.3.2 to 1.4.0
- [#17226](https://github.com/influxdata/telegraf/pull/17226) `deps` Bump github.com/ClickHouse/clickhouse-go/v2 from 2.37.0 to 2.37.1
- [#17265](https://github.com/influxdata/telegraf/pull/17265) `deps` Bump github.com/ClickHouse/clickhouse-go/v2 from 2.37.1 to 2.37.2
- [#17268](https://github.com/influxdata/telegraf/pull/17268) `deps` Bump github.com/Masterminds/semver/v3 from 3.3.1 to 3.4.0
- [#17271](https://github.com/influxdata/telegraf/pull/17271) `deps` Bump github.com/SAP/go-hdb from 1.13.7 to 1.13.9
- [#17232](https://github.com/influxdata/telegraf/pull/17232) `deps` Bump github.com/alitto/pond/v2 from 2.3.4 to 2.4.0
- [#17231](https://github.com/influxdata/telegraf/pull/17231) `deps` Bump github.com/apache/arrow-go/v18 from 18.3.0 to 18.3.1
- [#17223](https://github.com/influxdata/telegraf/pull/17223) `deps` Bump github.com/aws/aws-sdk-go-v2/config from 1.29.15 to 1.29.17
- [#17220](https://github.com/influxdata/telegraf/pull/17220) `deps` Bump github.com/aws/aws-sdk-go-v2/credentials from 1.17.69 to 1.17.70
- [#17227](https://github.com/influxdata/telegraf/pull/17227) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.50.3 to 1.51.0
- [#17262](https://github.com/influxdata/telegraf/pull/17262) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.43.4 to 1.44.0
- [#17224](https://github.com/influxdata/telegraf/pull/17224) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.225.1 to 1.225.2
- [#17260](https://github.com/influxdata/telegraf/pull/17260) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.226.0 to 1.227.0
- [#17264](https://github.com/influxdata/telegraf/pull/17264) `deps` Bump github.com/docker/docker from 28.2.2+incompatible to 28.3.0+incompatible
- [#17256](https://github.com/influxdata/telegraf/pull/17256) `deps` Bump github.com/lxc/incus/v6 from 6.13.0 to 6.14.0
- [#17272](https://github.com/influxdata/telegraf/pull/17272) `deps` Bump github.com/microsoft/go-mssqldb from 1.8.2 to 1.9.2
- [#17261](https://github.com/influxdata/telegraf/pull/17261) `deps` Bump github.com/nats-io/nats-server/v2 from 2.11.4 to 2.11.5
- [#17266](https://github.com/influxdata/telegraf/pull/17266) `deps` Bump github.com/peterbourgon/unixtransport from 0.0.5 to 0.0.6
- [#17229](https://github.com/influxdata/telegraf/pull/17229) `deps` Bump github.com/prometheus/common from 0.64.0 to 0.65.0
- [#17267](https://github.com/influxdata/telegraf/pull/17267) `deps` Bump github.com/redis/go-redis/v9 from 9.10.0 to 9.11.0
- [#17273](https://github.com/influxdata/telegraf/pull/17273) `deps` Bump go.opentelemetry.io/collector/pdata from 1.34.0 to 1.35.0
- [#17219](https://github.com/influxdata/telegraf/pull/17219) `deps` Bump google.golang.org/api from 0.237.0 to 0.238.0
- [#17263](https://github.com/influxdata/telegraf/pull/17263) `deps` Bump google.golang.org/api from 0.238.0 to 0.239.0
- [#17218](https://github.com/influxdata/telegraf/pull/17218) `deps` Bump k8s.io/api from 0.33.1 to 0.33.2
- [#17228](https://github.com/influxdata/telegraf/pull/17228) `deps` Bump k8s.io/client-go from 0.33.1 to 0.33.2

## v1.35.1 {date="2025-06-23"}

### Bug fixes

- [#17178](https://github.com/influxdata/telegraf/pull/17178) `inputs.procstat` Fix user filter conditional logic
- [#17210](https://github.com/influxdata/telegraf/pull/17210) `processors.strings` Add explicit TOML tags on struct fields

### Dependency updates

- [#17194](https://github.com/influxdata/telegraf/pull/17194) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azidentity from 1.10.0 to 1.10.1
- [#17189](https://github.com/influxdata/telegraf/pull/17189) `deps` Bump github.com/ClickHouse/clickhouse-go/v2 from 2.36.0 to 2.37.0
- [#17186](https://github.com/influxdata/telegraf/pull/17186) `deps` Bump github.com/SAP/go-hdb from 1.13.6 to 1.13.7
- [#17188](https://github.com/influxdata/telegraf/pull/17188) `deps` Bump github.com/alitto/pond/v2 from 2.3.2 to 2.3.4
- [#17180](https://github.com/influxdata/telegraf/pull/17180) `deps` Bump github.com/aws/aws-sdk-go-v2/credentials from 1.17.68 to 1.17.69
- [#17185](https://github.com/influxdata/telegraf/pull/17185) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.45.1 to 1.45.2
- [#17187](https://github.com/influxdata/telegraf/pull/17187) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.50.1 to 1.50.2
- [#17183](https://github.com/influxdata/telegraf/pull/17183) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.43.2 to 1.43.3
- [#17182](https://github.com/influxdata/telegraf/pull/17182) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.225.0 to 1.225.1
- [#17190](https://github.com/influxdata/telegraf/pull/17190) `deps` Bump github.com/aws/aws-sdk-go-v2/service/kinesis from 1.35.1 to 1.35.2
- [#17193](https://github.com/influxdata/telegraf/pull/17193) `deps` Bump github.com/aws/aws-sdk-go-v2/service/timestreamwrite from 1.31.0 to 1.31.1
- [#17195](https://github.com/influxdata/telegraf/pull/17195) `deps` Bump github.com/aws/smithy-go from 1.22.3 to 1.22.4
- [#17196](https://github.com/influxdata/telegraf/pull/17196) `deps` Bump github.com/cloudevents/sdk-go/v2 from 2.16.0 to 2.16.1
- [#17212](https://github.com/influxdata/telegraf/pull/17212) `deps` Bump github.com/go-chi/chi/v5 from 5.2.1 to 5.2.2
- [#17191](https://github.com/influxdata/telegraf/pull/17191) `deps` Bump github.com/go-sql-driver/mysql from 1.9.2 to 1.9.3
- [#17192](https://github.com/influxdata/telegraf/pull/17192) `deps` Bump github.com/peterbourgon/unixtransport from 0.0.4 to 0.0.5
- [#17181](https://github.com/influxdata/telegraf/pull/17181) `deps` Bump github.com/redis/go-redis/v9 from 9.9.0 to 9.10.0
- [#17197](https://github.com/influxdata/telegraf/pull/17197) `deps` Bump github.com/urfave/cli/v2 from 2.27.6 to 2.27.7
- [#17198](https://github.com/influxdata/telegraf/pull/17198) `deps` Bump go.opentelemetry.io/collector/pdata from 1.33.0 to 1.34.0
- [#17184](https://github.com/influxdata/telegraf/pull/17184) `deps` Bump google.golang.org/api from 0.236.0 to 0.237.0

## v1.35.0 {date="2025-06-16"}

### Deprecation Removals

This release removes the following deprecated plugin aliases:

- `inputs.cisco_telemetry_gnmi` in [#17101](https://github.com/influxdata/telegraf/pull/17101)
- `inputs.http_listener` in [#17102](https://github.com/influxdata/telegraf/pull/17102)
- `inputs.KNXListener` in [#17168](https://github.com/influxdata/telegraf/pull/17168)
- `inputs.logparser` in [#17170](https://github.com/influxdata/telegraf/pull/17170)

And removes the following deprecated plugin options:

- `ssl_ca`, `ssl_cert` and `ssl_key` of common TLS settings in [#17119](https://github.com/influxdata/telegraf/pull/17119)
- `url` of `inputs.amqp_consumer` in [#17149](https://github.com/influxdata/telegraf/pull/17149)
- `namespace` of `inputs.cloudwatch` in [#17123](https://github.com/influxdata/telegraf/pull/17123)
- `datacentre` of `inputs.consul` in [#17150](https://github.com/influxdata/telegraf/pull/17150)
- `container_names`, `perdevice` and `total` of `inputs.docker` in [#17148](https://github.com/influxdata/telegraf/pull/17148)
- `http_timeout` of `inputs.elasticsearch` in [#17124](https://github.com/influxdata/telegraf/pull/17124)
- `directory` of `inputs.filecount` in [#17152](https://github.com/influxdata/telegraf/pull/17152)
- `guess_path_tag` and `enable_tls` of `inputs.gnmi` in [#17151](https://github.com/influxdata/telegraf/pull/17151)
- `bearer_token` of `inputs.http` in [#17153](https://github.com/influxdata/telegraf/pull/17153)
- `path` and `port` of `inputs.http_listener_v2` in [#17158](https://github.com/influxdata/telegraf/pull/17158)
- `address` of `inputs.http_response` in [#17157](https://github.com/influxdata/telegraf/pull/17157)
- `object_type` of `inputs.icinga2` in [#17163](https://github.com/influxdata/telegraf/pull/17163)
- `max_line_size` of `inputs.influxdb_listener` in [#17162](https://github.com/influxdata/telegraf/pull/17162)
- `enable_file_download` of `inputs.internet_speed` in [#17165](https://github.com/influxdata/telegraf/pull/17165)
- `bearer_token_string` of `inputs.kube_inventory` in [#17110](https://github.com/influxdata/telegraf/pull/17110)
- `bearer_token_string` of `inputs.kubernetes` in [#17109](https://github.com/influxdata/telegraf/pull/17109)
- `server` of `inputs.nsq_consumer` in [#17166](https://github.com/influxdata/telegraf/pull/17166)
- `dns_lookup` of `inputs.ntpq` in [#17159](https://github.com/influxdata/telegraf/pull/17159)
- `ssl` of `inputs.openldap` in [#17103](https://github.com/influxdata/telegraf/pull/17103)
- `name` and `queues` of `inputs.rabbitmq` in [#17105](https://github.com/influxdata/telegraf/pull/17105)
- `path` of `inputs.smart` in [#17113](https://github.com/influxdata/telegraf/pull/17113)
- `azuredb` and `query_version` of `inputs.sqlserver` in [#17112](https://github.com/influxdata/telegraf/pull/17112)
- `parse_data_dog_tags` and `udp_packet_size` of `inputs.statsd` in [#17171](https://github.com/influxdata/telegraf/pull/17171)
- `force_discover_on_init` of `inputs.vsphere` in [#17169](https://github.com/influxdata/telegraf/pull/17169)
- `database`, `precision`, `retention_policy` and `url` of `outputs.amqp` in [#16950](https://github.com/influxdata/telegraf/pull/16950)
- `precision` of `outputs.influxdb` in [#17160](https://github.com/influxdata/telegraf/pull/17160)
- `partitionkey` and `use_random_partitionkey` of `outputs.kinesis` in [#17167](https://github.com/influxdata/telegraf/pull/17167)
- `source_tag` of `outputs.librato` in [#17174](https://github.com/influxdata/telegraf/pull/17174)
- `batch` and `topic_prefix` of `outputs.mqtt` in [#17176](https://github.com/influxdata/telegraf/pull/17176)
- `trace` of `outputs.remotefile` in [#17173](https://github.com/influxdata/telegraf/pull/17173)
- `host`, `port` and `string_to_number` of `outputs.wavefront` in [#17172](https://github.com/influxdata/telegraf/pull/17172)

If you're using deprecated Telegraf plugins or options, migrate your configuration to use the available replacements.
The `telegraf config migrate` command might be able to help with the migration.

### New Plugins

- [#16390](https://github.com/influxdata/telegraf/pull/16390) `inputs.fritzbox` Add plugin
- [#16780](https://github.com/influxdata/telegraf/pull/16780) `inputs.mavlink` Add plugin
- [#16509](https://github.com/influxdata/telegraf/pull/16509) `inputs.whois` Add plugin
- [#16211](https://github.com/influxdata/telegraf/pull/16211) `outputs.inlong` Add plugin
- [#16827](https://github.com/influxdata/telegraf/pull/16827) `outputs.microsoft_fabric` Add plugin
- [#16629](https://github.com/influxdata/telegraf/pull/16629) `processors.cumulative_sum` Add plugin

### Features

- [#17048](https://github.com/influxdata/telegraf/pull/17048) `agent` Add debounce for watch events
- [#16524](https://github.com/influxdata/telegraf/pull/16524) `common.kafka` Add AWS-MSK-IAM SASL authentication
- [#16867](https://github.com/influxdata/telegraf/pull/16867) `common.ratelimiter` Implement means to reserve memory for concurrent use
- [#16148](https://github.com/influxdata/telegraf/pull/16148) `common.shim` Add batch to shim
- [#17121](https://github.com/influxdata/telegraf/pull/17121) `inputs.amqp_consumer` Allow string values in queue arguments
- [#17051](https://github.com/influxdata/telegraf/pull/17051) `inputs.opcua` Allow forcing reconnection on every gather cycle
- [#16532](https://github.com/influxdata/telegraf/pull/16532) `inputs.opcua_listener` Allow to subscribe to OPCUA events
- [#16882](https://github.com/influxdata/telegraf/pull/16882) `inputs.prometheus` Add HTTP service discovery support
- [#16999](https://github.com/influxdata/telegraf/pull/16999) `inputs.s7comm` Add support for LREAL and LINT data types
- [#16452](https://github.com/influxdata/telegraf/pull/16452) `inputs.unbound` Collect histogram statistics
- [#16700](https://github.com/influxdata/telegraf/pull/16700) `inputs.whois` Support IDN domains
- [#17119](https://github.com/influxdata/telegraf/pull/17119) `migrations` Add migration for common.tls ssl options
- [#17101](https://github.com/influxdata/telegraf/pull/17101) `migrations` Add migration for inputs.cisco_telemetry_gnmi
- [#17123](https://github.com/influxdata/telegraf/pull/17123) `migrations` Add migration for inputs.cloudwatch
- [#17148](https://github.com/influxdata/telegraf/pull/17148) `migrations` Add migration for inputs.docker
- [#17124](https://github.com/influxdata/telegraf/pull/17124) `migrations` Add migration for inputs.elasticsearch
- [#17102](https://github.com/influxdata/telegraf/pull/17102) `migrations` Add migration for inputs.http_listener
- [#17162](https://github.com/influxdata/telegraf/pull/17162) `migrations` Add migration for inputs.influxdb_listener
- [#17110](https://github.com/influxdata/telegraf/pull/17110) `migrations` Add migration for inputs.kube_inventory
- [#17109](https://github.com/influxdata/telegraf/pull/17109) `migrations` Add migration for inputs.kubernetes
- [#17103](https://github.com/influxdata/telegraf/pull/17103) `migrations` Add migration for inputs.openldap
- [#17105](https://github.com/influxdata/telegraf/pull/17105) `migrations` Add migration for inputs.rabbitmq
- [#17113](https://github.com/influxdata/telegraf/pull/17113) `migrations` Add migration for inputs.smart
- [#17112](https://github.com/influxdata/telegraf/pull/17112) `migrations` Add migration for inputs.sqlserver
- [#16950](https://github.com/influxdata/telegraf/pull/16950) `migrations` Add migration for outputs.amqp
- [#17160](https://github.com/influxdata/telegraf/pull/17160) `migrations` Add migration for outputs.influxdb
- [#17149](https://github.com/influxdata/telegraf/pull/17149) `migrations` Add migration for inputs.amqp_consumer
- [#17150](https://github.com/influxdata/telegraf/pull/17150) `migrations` Add migration for inputs.consul
- [#17152](https://github.com/influxdata/telegraf/pull/17152) `migrations` Add migration for inputs.filecount
- [#17151](https://github.com/influxdata/telegraf/pull/17151) `migrations` Add migration for inputs.gnmi
- [#17153](https://github.com/influxdata/telegraf/pull/17153) `migrations` Add migration for inputs.http
- [#17158](https://github.com/influxdata/telegraf/pull/17158) `migrations` Add migration for inputs.http_listener_v2
- [#17157](https://github.com/influxdata/telegraf/pull/17157) `migrations` Add migration for inputs.http_response
- [#17163](https://github.com/influxdata/telegraf/pull/17163) `migrations` Add migration for inputs.icinga2
- [#17165](https://github.com/influxdata/telegraf/pull/17165) `migrations` Add migration for inputs.internet_speed
- [#17166](https://github.com/influxdata/telegraf/pull/17166) `migrations` Add migration for inputs.nsq_consumer
- [#17159](https://github.com/influxdata/telegraf/pull/17159) `migrations` Add migration for inputs.ntpq
- [#17171](https://github.com/influxdata/telegraf/pull/17171) `migrations` Add migration for inputs.statsd
- [#17169](https://github.com/influxdata/telegraf/pull/17169) `migrations` Add migration for inputs.vsphere
- [#17167](https://github.com/influxdata/telegraf/pull/17167) `migrations` Add migration for outputs.kinesis
- [#17174](https://github.com/influxdata/telegraf/pull/17174) `migrations` Add migration for outputs.librato
- [#17176](https://github.com/influxdata/telegraf/pull/17176) `migrations` Add migration for outputs.mqtt
- [#17173](https://github.com/influxdata/telegraf/pull/17173) `migrations` Add migration for outputs.remotefile
- [#17172](https://github.com/influxdata/telegraf/pull/17172) `migrations` Add migration for outputs.wavefront
- [#17168](https://github.com/influxdata/telegraf/pull/17168) `migrations` Add migration for inputs.KNXListener
- [#17170](https://github.com/influxdata/telegraf/pull/17170) `migrations` Add migration for inputs.logparser
- [#16646](https://github.com/influxdata/telegraf/pull/16646) `outputs.health` Add max time between metrics check
- [#16597](https://github.com/influxdata/telegraf/pull/16597) `outputs.http` Include body sample in non-retryable error logs
- [#16741](https://github.com/influxdata/telegraf/pull/16741) `outputs.influxdb_v2` Implement concurrent writes
- [#16746](https://github.com/influxdata/telegraf/pull/16746) `outputs.influxdb_v2` Support secrets in http_headers values
- [#16582](https://github.com/influxdata/telegraf/pull/16582) `outputs.nats` Allow asynchronous publishing for Jetstream
- [#16544](https://github.com/influxdata/telegraf/pull/16544) `outputs.sql` Add option to automate table schema updates
- [#16678](https://github.com/influxdata/telegraf/pull/16678) `outputs.sql` Support secret for dsn
- [#16583](https://github.com/influxdata/telegraf/pull/16583) `outputs.stackdriver` Ensure quota is charged to configured project
- [#16717](https://github.com/influxdata/telegraf/pull/16717) `processors.defaults` Add support for specifying default tags
- [#16701](https://github.com/influxdata/telegraf/pull/16701) `processors.enum` Add multiple tag mapping
- [#16030](https://github.com/influxdata/telegraf/pull/16030) `processors.enum` Allow mapping to be applied to multiple fields
- [#16494](https://github.com/influxdata/telegraf/pull/16494) `serializer.prometheusremotewrite` Allow sending native histograms

### Bug fixes

- [#17044](https://github.com/influxdata/telegraf/pull/17044) `inputs.opcua` Fix integration test
- [#16986](https://github.com/influxdata/telegraf/pull/16986) `inputs.procstat` Resolve remote usernames on Posix systems
- [#16699](https://github.com/influxdata/telegraf/pull/16699) `inputs.win_wmi` Free resources to avoid leaks
- [#17118](https://github.com/influxdata/telegraf/pull/17118) `migrations` Update table content for general plugin migrations

### Dependency updates

- [#17089](https://github.com/influxdata/telegraf/pull/17089) `deps` Bump cloud.google.com/go/bigquery from 1.68.0 to 1.69.0
- [#17026](https://github.com/influxdata/telegraf/pull/17026) `deps` Bump cloud.google.com/go/storage from 1.53.0 to 1.54.0
- [#17095](https://github.com/influxdata/telegraf/pull/17095) `deps` Bump cloud.google.com/go/storage from 1.54.0 to 1.55.0
- [#17034](https://github.com/influxdata/telegraf/pull/17034) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azidentity from 1.9.0 to 1.10.0
- [#17065](https://github.com/influxdata/telegraf/pull/17065) `deps` Bump github.com/ClickHouse/clickhouse-go/v2 from 2.34.0 to 2.35.0
- [#17145](https://github.com/influxdata/telegraf/pull/17145) `deps` Bump github.com/ClickHouse/clickhouse-go/v2 from 2.35.0 to 2.36.0
- [#17062](https://github.com/influxdata/telegraf/pull/17062) `deps` Bump github.com/IBM/nzgo/v12 from 12.0.9 to 12.0.10
- [#17083](https://github.com/influxdata/telegraf/pull/17083) `deps` Bump github.com/IBM/sarama from 1.45.1 to 1.45.2
- [#17040](https://github.com/influxdata/telegraf/pull/17040) `deps` Bump github.com/apache/inlong/inlong-sdk/dataproxy-sdk-twins/dataproxy-sdk-golang from 1.0.0 to 1.0.1
- [#17060](https://github.com/influxdata/telegraf/pull/17060) `deps` Bump github.com/apache/inlong/inlong-sdk/dataproxy-sdk-twins/dataproxy-sdk-golang from 1.0.1 to 1.0.2
- [#17127](https://github.com/influxdata/telegraf/pull/17127) `deps` Bump github.com/apache/inlong/inlong-sdk/dataproxy-sdk-twins/dataproxy-sdk-golang from 1.0.2 to 1.0.3
- [#17061](https://github.com/influxdata/telegraf/pull/17061) `deps` Bump github.com/apache/thrift from 0.21.0 to 0.22.0
- [#16954](https://github.com/influxdata/telegraf/pull/16954) `deps` Bump github.com/aws/aws-msk-iam-sasl-signer-go from 1.0.1 to 1.0.3
- [#17041](https://github.com/influxdata/telegraf/pull/17041) `deps` Bump github.com/aws/aws-msk-iam-sasl-signer-go from 1.0.3 to 1.0.4
- [#17128](https://github.com/influxdata/telegraf/pull/17128) `deps` Bump github.com/aws/aws-sdk-go-v2/config from 1.29.14 to 1.29.15
- [#17129](https://github.com/influxdata/telegraf/pull/17129) `deps` Bump github.com/aws/aws-sdk-go-v2/credentials from 1.17.67 to 1.17.68
- [#17057](https://github.com/influxdata/telegraf/pull/17057) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.44.3 to 1.45.0
- [#17132](https://github.com/influxdata/telegraf/pull/17132) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.45.0 to 1.45.1
- [#17029](https://github.com/influxdata/telegraf/pull/17029) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.49.0 to 1.50.0
- [#17131](https://github.com/influxdata/telegraf/pull/17131) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.50.0 to 1.50.1
- [#17143](https://github.com/influxdata/telegraf/pull/17143) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.43.1 to 1.43.2
- [#17037](https://github.com/influxdata/telegraf/pull/17037) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.218.0 to 1.219.0
- [#17067](https://github.com/influxdata/telegraf/pull/17067) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.220.0 to 1.222.0
- [#17093](https://github.com/influxdata/telegraf/pull/17093) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.222.0 to 1.224.0
- [#17136](https://github.com/influxdata/telegraf/pull/17136) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.224.0 to 1.225.0
- [#17139](https://github.com/influxdata/telegraf/pull/17139) `deps` Bump github.com/aws/aws-sdk-go-v2/service/kinesis from 1.35.0 to 1.35.1
- [#16996](https://github.com/influxdata/telegraf/pull/16996) `deps` Bump github.com/bluenviron/gomavlib/v3 from 3.1.0 to 3.2.1
- [#16987](https://github.com/influxdata/telegraf/pull/16987) `deps` Bump github.com/creack/goselect from 0.1.2 to 0.1.3
- [#17097](https://github.com/influxdata/telegraf/pull/17097) `deps` Bump github.com/docker/docker from 28.1.1+incompatible to 28.2.2+incompatible
- [#17133](https://github.com/influxdata/telegraf/pull/17133) `deps` Bump github.com/gosnmp/gosnmp from 1.40.0 to 1.41.0
- [#17126](https://github.com/influxdata/telegraf/pull/17126) `deps` Bump github.com/linkedin/goavro/v2 from 2.13.1 to 2.14.0
- [#17087](https://github.com/influxdata/telegraf/pull/17087) `deps` Bump github.com/lxc/incus/v6 from 6.12.0 to 6.13.0
- [#17085](https://github.com/influxdata/telegraf/pull/17085) `deps` Bump github.com/microsoft/go-mssqldb from 1.8.1 to 1.8.2
- [#17064](https://github.com/influxdata/telegraf/pull/17064) `deps` Bump github.com/nats-io/nats-server/v2 from 2.11.3 to 2.11.4
- [#17140](https://github.com/influxdata/telegraf/pull/17140) `deps` Bump github.com/nats-io/nats.go from 1.42.0 to 1.43.0
- [#17134](https://github.com/influxdata/telegraf/pull/17134) `deps` Bump github.com/netsampler/goflow2/v2 from 2.2.2 to 2.2.3
- [#17028](https://github.com/influxdata/telegraf/pull/17028) `deps` Bump github.com/prometheus/common from 0.63.0 to 0.64.0
- [#17066](https://github.com/influxdata/telegraf/pull/17066) `deps` Bump github.com/rclone/rclone from 1.69.2 to 1.69.3
- [#17096](https://github.com/influxdata/telegraf/pull/17096) `deps` Bump github.com/redis/go-redis/v9 from 9.8.0 to 9.9.0
- [#17088](https://github.com/influxdata/telegraf/pull/17088) `deps` Bump github.com/shirou/gopsutil/v4 from 4.25.4 to 4.25.5
- [#17135](https://github.com/influxdata/telegraf/pull/17135) `deps` Bump github.com/sijms/go-ora/v2 from 2.8.24 to 2.9.0
- [#17094](https://github.com/influxdata/telegraf/pull/17094) `deps` Bump github.com/snowflakedb/gosnowflake from 1.14.0 to 1.14.1
- [#17035](https://github.com/influxdata/telegraf/pull/17035) `deps` Bump github.com/tinylib/msgp from 1.2.5 to 1.3.0
- [#17054](https://github.com/influxdata/telegraf/pull/17054) `deps` Bump github.com/vmware/govmomi from 0.50.0 to 0.51.0
- [#17039](https://github.com/influxdata/telegraf/pull/17039) `deps` Bump github.com/yuin/goldmark from 1.7.11 to 1.7.12
- [#17130](https://github.com/influxdata/telegraf/pull/17130) `deps` Bump go.mongodb.org/mongo-driver from 1.17.3 to 1.17.4
- [#17056](https://github.com/influxdata/telegraf/pull/17056) `deps` Bump go.opentelemetry.io/collector/pdata from 1.31.0 to 1.33.0
- [#17058](https://github.com/influxdata/telegraf/pull/17058) `deps` Bump go.step.sm/crypto from 0.63.0 to 0.64.0
- [#17141](https://github.com/influxdata/telegraf/pull/17141) `deps` Bump golang.org/x/crypto from 0.38.0 to 0.39.0
- [#17144](https://github.com/influxdata/telegraf/pull/17144) `deps` Bump golang.org/x/mod from 0.24.0 to 0.25.0
- [#17033](https://github.com/influxdata/telegraf/pull/17033) `deps` Bump google.golang.org/api from 0.232.0 to 0.233.0
- [#17055](https://github.com/influxdata/telegraf/pull/17055) `deps` Bump google.golang.org/api from 0.233.0 to 0.234.0
- [#17086](https://github.com/influxdata/telegraf/pull/17086) `deps` Bump google.golang.org/api from 0.234.0 to 0.235.0
- [#17036](https://github.com/influxdata/telegraf/pull/17036) `deps` Bump google.golang.org/grpc from 1.72.0 to 1.72.1
- [#17059](https://github.com/influxdata/telegraf/pull/17059) `deps` Bump google.golang.org/grpc from 1.72.1 to 1.72.2
- [#17137](https://github.com/influxdata/telegraf/pull/17137) `deps` Bump google.golang.org/grpc from 1.72.2 to 1.73.0
- [#17031](https://github.com/influxdata/telegraf/pull/17031) `deps` Bump k8s.io/api from 0.33.0 to 0.33.1
- [#17038](https://github.com/influxdata/telegraf/pull/17038) `deps` Bump k8s.io/apimachinery from 0.33.0 to 0.33.1
- [#17030](https://github.com/influxdata/telegraf/pull/17030) `deps` Bump k8s.io/client-go from 0.33.0 to 0.33.1
- [#17025](https://github.com/influxdata/telegraf/pull/17025) `deps` Bump super-linter/super-linter from 7.3.0 to 7.4.0

## v1.34.4 {date="2025-05-19"}

### Bug fixes

- [#17009](https://github.com/influxdata/telegraf/pull/17009) `inputs.cloudwatch` Restore filtering to match all dimensions
- [#16978](https://github.com/influxdata/telegraf/pull/16978) `inputs.nfsclient` Handle errors during mountpoint filtering
- [#17021](https://github.com/influxdata/telegraf/pull/17021) `inputs.opcua` Fix type mismatch in unit test
- [#16854](https://github.com/influxdata/telegraf/pull/16854) `inputs.opcua` Handle session invalidation between gather cycles
- [#16879](https://github.com/influxdata/telegraf/pull/16879) `inputs.tail` Prevent leaking file descriptors
- [#16815](https://github.com/influxdata/telegraf/pull/16815) `inputs.win_eventlog` Handle large events to avoid they get dropped silently
- [#16878](https://github.com/influxdata/telegraf/pull/16878) `parsers.json_v2` Handle measurements with multiple objects correctly

### Dependency updates

- [#16991](https://github.com/influxdata/telegraf/pull/16991) `deps` Bump cloud.google.com/go/bigquery from 1.67.0 to 1.68.0
- [#16963](https://github.com/influxdata/telegraf/pull/16963) `deps` Bump cloud.google.com/go/storage from 1.52.0 to 1.53.0
- [#16955](https://github.com/influxdata/telegraf/pull/16955) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/storage/azqueue from 1.0.0 to 1.0.1
- [#16989](https://github.com/influxdata/telegraf/pull/16989) `deps` Bump github.com/SAP/go-hdb from 1.13.5 to 1.13.6
- [#16998](https://github.com/influxdata/telegraf/pull/16998) `deps` Bump github.com/apache/arrow-go/v18 from 18.2.0 to 18.3.0
- [#16952](https://github.com/influxdata/telegraf/pull/16952) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.47.3 to 1.48.0
- [#16995](https://github.com/influxdata/telegraf/pull/16995) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.48.0 to 1.49.0
- [#16974](https://github.com/influxdata/telegraf/pull/16974) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.212.0 to 1.214.0
- [#16993](https://github.com/influxdata/telegraf/pull/16993) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.215.0 to 1.218.0
- [#16968](https://github.com/influxdata/telegraf/pull/16968) `deps` Bump github.com/aws/aws-sdk-go-v2/service/kinesis from 1.33.3 to 1.35.0
- [#16988](https://github.com/influxdata/telegraf/pull/16988) `deps` Bump github.com/aws/aws-sdk-go-v2/service/timestreamwrite from 1.30.2 to 1.31.0
- [#17013](https://github.com/influxdata/telegraf/pull/17013) `deps` Bump github.com/ebitengine/purego from 0.8.2 to 0.8.3
- [#16972](https://github.com/influxdata/telegraf/pull/16972) `deps` Bump github.com/hashicorp/consul/api from 1.32.0 to 1.32.1
- [#16992](https://github.com/influxdata/telegraf/pull/16992) `deps` Bump github.com/microsoft/go-mssqldb from 1.8.0 to 1.8.1
- [#16990](https://github.com/influxdata/telegraf/pull/16990) `deps` Bump github.com/miekg/dns from 1.1.65 to 1.1.66
- [#16975](https://github.com/influxdata/telegraf/pull/16975) `deps` Bump github.com/nats-io/nats-server/v2 from 2.11.2 to 2.11.3
- [#16967](https://github.com/influxdata/telegraf/pull/16967) `deps` Bump github.com/nats-io/nats.go from 1.41.2 to 1.42.0
- [#16964](https://github.com/influxdata/telegraf/pull/16964) `deps` Bump github.com/rclone/rclone from 1.69.1 to 1.69.2
- [#16973](https://github.com/influxdata/telegraf/pull/16973) `deps` Bump github.com/redis/go-redis/v9 from 9.7.3 to 9.8.0
- [#16962](https://github.com/influxdata/telegraf/pull/16962) `deps` Bump github.com/shirou/gopsutil/v4 from 4.25.3 to 4.25.4
- [#16969](https://github.com/influxdata/telegraf/pull/16969) `deps` Bump github.com/snowflakedb/gosnowflake from 1.13.3 to 1.14.0
- [#16994](https://github.com/influxdata/telegraf/pull/16994) `deps` Bump github.com/vishvananda/netlink from 1.3.1-0.20250221194427-0af32151e72b to 1.3.1
- [#16958](https://github.com/influxdata/telegraf/pull/16958) `deps` Bump go.step.sm/crypto from 0.62.0 to 0.63.0
- [#16960](https://github.com/influxdata/telegraf/pull/16960) `deps` Bump golang.org/x/crypto from 0.37.0 to 0.38.0
- [#16966](https://github.com/influxdata/telegraf/pull/16966) `deps` Bump golang.org/x/net from 0.39.0 to 0.40.0
- [#16957](https://github.com/influxdata/telegraf/pull/16957) `deps` Bump google.golang.org/api from 0.230.0 to 0.231.0
- [#16853](https://github.com/influxdata/telegraf/pull/16853) `deps` Switch to maintained azure testcontainer module

## v1.34.3 {date="2025-05-05"}

### Bug fixes

- [#16697](https://github.com/influxdata/telegraf/pull/16697) `agent` Correctly truncate the disk buffer
- [#16868](https://github.com/influxdata/telegraf/pull/16868) `common.ratelimiter` Only grow the buffer but never shrink
- [#16812](https://github.com/influxdata/telegraf/pull/16812) `inputs.cloudwatch` Handle metric includes/excludes correctly to prevent panic
- [#16911](https://github.com/influxdata/telegraf/pull/16911) `inputs.lustre2` Skip empty files
- [#16594](https://github.com/influxdata/telegraf/pull/16594) `inputs.opcua` Handle node array values
- [#16782](https://github.com/influxdata/telegraf/pull/16782) `inputs.win_wmi` Replace hard-coded class-name with correct config setting
- [#16781](https://github.com/influxdata/telegraf/pull/16781) `inputs.win_wmi` Restrict threading model to APARTMENTTHREADED
- [#16857](https://github.com/influxdata/telegraf/pull/16857) `outputs.quix` Allow empty certificate for new cloud managed instances

### Dependency updates

- [#16804](https://github.com/influxdata/telegraf/pull/16804) `deps` Bump cloud.google.com/go/bigquery from 1.66.2 to 1.67.0
- [#16835](https://github.com/influxdata/telegraf/pull/16835) `deps` Bump cloud.google.com/go/monitoring from 1.24.0 to 1.24.2
- [#16785](https://github.com/influxdata/telegraf/pull/16785) `deps` Bump cloud.google.com/go/pubsub from 1.48.0 to 1.49.0
- [#16897](https://github.com/influxdata/telegraf/pull/16897) `deps` Bump cloud.google.com/go/storage from 1.51.0 to 1.52.0
- [#16840](https://github.com/influxdata/telegraf/pull/16840) `deps` Bump github.com/BurntSushi/toml from 1.4.0 to 1.5.0
- [#16838](https://github.com/influxdata/telegraf/pull/16838) `deps` Bump github.com/aliyun/alibaba-cloud-sdk-go from 1.63.104 to 1.63.106
- [#16908](https://github.com/influxdata/telegraf/pull/16908) `deps` Bump github.com/aliyun/alibaba-cloud-sdk-go from 1.63.106 to 1.63.107
- [#16789](https://github.com/influxdata/telegraf/pull/16789) `deps` Bump github.com/antchfx/xpath from 1.3.3 to 1.3.4
- [#16807](https://github.com/influxdata/telegraf/pull/16807) `deps` Bump github.com/apache/arrow-go/v18 from 18.1.0 to 18.2.0
- [#16844](https://github.com/influxdata/telegraf/pull/16844) `deps` Bump github.com/apache/iotdb-client-go from 1.3.3 to 1.3.4
- [#16839](https://github.com/influxdata/telegraf/pull/16839) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.44.1 to 1.44.3
- [#16836](https://github.com/influxdata/telegraf/pull/16836) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.45.3 to 1.47.3
- [#16846](https://github.com/influxdata/telegraf/pull/16846) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.42.2 to 1.42.4
- [#16905](https://github.com/influxdata/telegraf/pull/16905) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.42.4 to 1.43.1
- [#16842](https://github.com/influxdata/telegraf/pull/16842) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.210.1 to 1.211.3
- [#16900](https://github.com/influxdata/telegraf/pull/16900) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.211.3 to 1.212.0
- [#16903](https://github.com/influxdata/telegraf/pull/16903) `deps` Bump github.com/aws/aws-sdk-go-v2/service/kinesis from 1.33.2 to 1.33.3
- [#16793](https://github.com/influxdata/telegraf/pull/16793) `deps` Bump github.com/aws/aws-sdk-go-v2/service/timestreamwrite from 1.27.4 to 1.30.2
- [#16802](https://github.com/influxdata/telegraf/pull/16802) `deps` Bump github.com/clarify/clarify-go from 0.3.1 to 0.4.0
- [#16849](https://github.com/influxdata/telegraf/pull/16849) `deps` Bump github.com/docker/docker from 28.0.4+incompatible to 28.1.1+incompatible
- [#16830](https://github.com/influxdata/telegraf/pull/16830) `deps` Bump github.com/go-ldap/ldap/v3 from 3.4.10 to 3.4.11
- [#16801](https://github.com/influxdata/telegraf/pull/16801) `deps` Bump github.com/go-sql-driver/mysql from 1.8.1 to 1.9.2
- [#16806](https://github.com/influxdata/telegraf/pull/16806) `deps` Bump github.com/gofrs/uuid/v5 from 5.3.0 to 5.3.2
- [#16895](https://github.com/influxdata/telegraf/pull/16895) `deps` Bump github.com/google/cel-go from 0.24.1 to 0.25.0
- [#16797](https://github.com/influxdata/telegraf/pull/16797) `deps` Bump github.com/gopcua/opcua from 0.7.1 to 0.7.4
- [#16894](https://github.com/influxdata/telegraf/pull/16894) `deps` Bump github.com/gopcua/opcua from 0.7.4 to 0.8.0
- [#16660](https://github.com/influxdata/telegraf/pull/16660) `deps` Bump github.com/gosmnp/gosnmp from 1.39.0 to 1.40.0
- [#16902](https://github.com/influxdata/telegraf/pull/16902) `deps` Bump github.com/gosnmp/gosnmp from 1.39.0 to 1.40.0
- [#16841](https://github.com/influxdata/telegraf/pull/16841) `deps` Bump github.com/hashicorp/consul/api from 1.31.2 to 1.32.0
- [#16891](https://github.com/influxdata/telegraf/pull/16891) `deps` Bump github.com/jedib0t/go-pretty/v6 from 6.6.5 to 6.6.7
- [#16892](https://github.com/influxdata/telegraf/pull/16892) `deps` Bump github.com/lxc/incus/v6 from 6.11.0 to 6.12.0
- [#16786](https://github.com/influxdata/telegraf/pull/16786) `deps` Bump github.com/microsoft/go-mssqldb from 1.7.2 to 1.8.0
- [#16851](https://github.com/influxdata/telegraf/pull/16851) `deps` Bump github.com/miekg/dns from 1.1.64 to 1.1.65
- [#16808](https://github.com/influxdata/telegraf/pull/16808) `deps` Bump github.com/nats-io/nats-server/v2 from 2.10.25 to 2.10.27
- [#16888](https://github.com/influxdata/telegraf/pull/16888) `deps` Bump github.com/nats-io/nats-server/v2 from 2.10.27 to 2.11.2
- [#16909](https://github.com/influxdata/telegraf/pull/16909) `deps` Bump github.com/nats-io/nats.go from 1.41.1 to 1.41.2
- [#16790](https://github.com/influxdata/telegraf/pull/16790) `deps` Bump github.com/openconfig/gnmi from 0.11.0 to 0.14.1
- [#16799](https://github.com/influxdata/telegraf/pull/16799) `deps` Bump github.com/openconfig/goyang from 1.6.0 to 1.6.2
- [#16848](https://github.com/influxdata/telegraf/pull/16848) `deps` Bump github.com/prometheus-community/pro-bing from 0.4.1 to 0.7.0
- [#16795](https://github.com/influxdata/telegraf/pull/16795) `deps` Bump github.com/prometheus/client_golang from 1.21.1 to 1.22.0
- [#16845](https://github.com/influxdata/telegraf/pull/16845) `deps` Bump github.com/prometheus/client_model from 0.6.1 to 0.6.2
- [#16901](https://github.com/influxdata/telegraf/pull/16901) `deps` Bump github.com/prometheus/procfs from 0.16.0 to 0.16.1
- [#16792](https://github.com/influxdata/telegraf/pull/16792) `deps` Bump github.com/safchain/ethtool from 0.3.0 to 0.5.10
- [#16791](https://github.com/influxdata/telegraf/pull/16791) `deps` Bump github.com/seancfoley/ipaddress-go from 1.7.0 to 1.7.1
- [#16794](https://github.com/influxdata/telegraf/pull/16794) `deps` Bump github.com/shirou/gopsutil/v4 from 4.25.1 to 4.25.3
- [#16828](https://github.com/influxdata/telegraf/pull/16828) `deps` Bump github.com/snowflakedb/gosnowflake from 1.11.2 to 1.13.1
- [#16904](https://github.com/influxdata/telegraf/pull/16904) `deps` Bump github.com/snowflakedb/gosnowflake from 1.13.1 to 1.13.3
- [#16787](https://github.com/influxdata/telegraf/pull/16787) `deps` Bump github.com/srebhan/cborquery from 1.0.3 to 1.0.4
- [#16837](https://github.com/influxdata/telegraf/pull/16837) `deps` Bump github.com/srebhan/protobufquery from 1.0.1 to 1.0.4
- [#16893](https://github.com/influxdata/telegraf/pull/16893) `deps` Bump github.com/testcontainers/testcontainers-go from 0.36.0 to 0.37.0
- [#16803](https://github.com/influxdata/telegraf/pull/16803) `deps` Bump github.com/testcontainers/testcontainers-go/modules/kafka from 0.34.0 to 0.36.0
- [#16890](https://github.com/influxdata/telegraf/pull/16890) `deps` Bump github.com/testcontainers/testcontainers-go/modules/kafka from 0.36.0 to 0.37.0
- [#16850](https://github.com/influxdata/telegraf/pull/16850) `deps` Bump github.com/vmware/govmomi from 0.49.0 to 0.50.0
- [#16784](https://github.com/influxdata/telegraf/pull/16784) `deps` Bump github.com/yuin/goldmark from 1.7.8 to 1.7.9
- [#16896](https://github.com/influxdata/telegraf/pull/16896) `deps` Bump github.com/yuin/goldmark from 1.7.9 to 1.7.11
- [#16832](https://github.com/influxdata/telegraf/pull/16832) `deps` Bump go.mongodb.org/mongo-driver from 1.17.0 to 1.17.3
- [#16800](https://github.com/influxdata/telegraf/pull/16800) `deps` Bump go.opentelemetry.io/collector/pdata from 1.29.0 to 1.30.0
- [#16907](https://github.com/influxdata/telegraf/pull/16907) `deps` Bump go.opentelemetry.io/collector/pdata from 1.30.0 to 1.31.0
- [#16831](https://github.com/influxdata/telegraf/pull/16831) `deps` Bump go.step.sm/crypto from 0.60.0 to 0.61.0
- [#16886](https://github.com/influxdata/telegraf/pull/16886) `deps` Bump go.step.sm/crypto from 0.61.0 to 0.62.0
- [#16816](https://github.com/influxdata/telegraf/pull/16816) `deps` Bump golangci-lint from v2.0.2 to v2.1.2
- [#16852](https://github.com/influxdata/telegraf/pull/16852) `deps` Bump gonum.org/v1/gonum from 0.15.1 to 0.16.0
- [#16805](https://github.com/influxdata/telegraf/pull/16805) `deps` Bump google.golang.org/api from 0.228.0 to 0.229.0
- [#16898](https://github.com/influxdata/telegraf/pull/16898) `deps` Bump google.golang.org/api from 0.229.0 to 0.230.0
- [#16834](https://github.com/influxdata/telegraf/pull/16834) `deps` Bump google.golang.org/grpc from 1.71.1 to 1.72.0
- [#16889](https://github.com/influxdata/telegraf/pull/16889) `deps` Bump k8s.io/client-go from 0.32.3 to 0.33.0
- [#16843](https://github.com/influxdata/telegraf/pull/16843) `deps` Bump modernc.org/sqlite from 1.36.2 to 1.37.0

## v1.34.2 {date="2025-04-14"}

### Bug fixes

- [#16375](https://github.com/influxdata/telegraf/pull/16375) `aggregators` Handle time drift when calculating aggregation windows

### Dependency updates

- [#16689](https://github.com/influxdata/telegraf/pull/16689) `deps` Bump cloud.google.com/go/pubsub from 1.45.3 to 1.48.0
- [#16769](https://github.com/influxdata/telegraf/pull/16769) `deps` Bump cloud.google.com/go/storage from 1.50.0 to 1.51.0
- [#16771](https://github.com/influxdata/telegraf/pull/16771) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azcore from 1.17.0 to 1.18.0
- [#16708](https://github.com/influxdata/telegraf/pull/16708) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs from 1.2.3 to 1.3.1
- [#16764](https://github.com/influxdata/telegraf/pull/16764) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs from 1.3.1 to 1.3.2
- [#16777](https://github.com/influxdata/telegraf/pull/16777) `deps` Bump github.com/ClickHouse/clickhouse-go/v2 from 2.30.3 to 2.34.0
- [#16707](https://github.com/influxdata/telegraf/pull/16707) `deps` Bump github.com/IBM/sarama from v1.43.3 to v1.45.1
- [#16739](https://github.com/influxdata/telegraf/pull/16739) `deps` Bump github.com/SAP/go-hdb from 1.9.10 to 1.13.5
- [#16754](https://github.com/influxdata/telegraf/pull/16754) `deps` Bump github.com/aliyun/alibaba-cloud-sdk-go from 1.62.721 to 1.63.104
- [#16767](https://github.com/influxdata/telegraf/pull/16767) `deps` Bump github.com/antchfx/jsonquery from 1.3.3 to 1.3.6
- [#16758](https://github.com/influxdata/telegraf/pull/16758) `deps` Bump github.com/aws/aws-sdk-go-v2/config from 1.29.6 to 1.29.13
- [#16710](https://github.com/influxdata/telegraf/pull/16710) `deps` Bump github.com/aws/aws-sdk-go-v2/credentials from 1.17.59 to 1.17.65
- [#16685](https://github.com/influxdata/telegraf/pull/16685) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.43.14 to 1.44.1
- [#16773](https://github.com/influxdata/telegraf/pull/16773) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.40.0 to 1.42.2
- [#16688](https://github.com/influxdata/telegraf/pull/16688) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.203.1 to 1.210.1
- [#16772](https://github.com/influxdata/telegraf/pull/16772) `deps` Bump github.com/aws/aws-sdk-go-v2/service/kinesis from 1.32.6 to 1.33.2
- [#16711](https://github.com/influxdata/telegraf/pull/16711) `deps` Bump github.com/cloudevents/sdk-go/v2 from 2.15.2 to 2.16.0
- [#16687](https://github.com/influxdata/telegraf/pull/16687) `deps` Bump github.com/google/cel-go from 0.23.0 to 0.24.1
- [#16712](https://github.com/influxdata/telegraf/pull/16712) `deps` Bump github.com/gophercloud/gophercloud/v2 from 2.0.0-rc.3 to 2.6.0
- [#16738](https://github.com/influxdata/telegraf/pull/16738) `deps` Bump github.com/gorcon/rcon from 1.3.5 to 1.4.0
- [#16737](https://github.com/influxdata/telegraf/pull/16737) `deps` Bump github.com/gosnmp/gosnmp from 1.38.0 to 1.39.0
- [#16752](https://github.com/influxdata/telegraf/pull/16752) `deps` Bump github.com/lxc/incus/v6 from 6.9.0 to 6.11.0
- [#16761](https://github.com/influxdata/telegraf/pull/16761) `deps` Bump github.com/nats-io/nats.go from 1.39.1 to 1.41.1
- [#16753](https://github.com/influxdata/telegraf/pull/16753) `deps` Bump github.com/netsampler/goflow2/v2 from 2.2.1 to 2.2.2
- [#16760](https://github.com/influxdata/telegraf/pull/16760) `deps` Bump github.com/p4lang/p4runtime from 1.4.0 to 1.4.1
- [#16766](https://github.com/influxdata/telegraf/pull/16766) `deps` Bump github.com/prometheus/common from 0.62.0 to 0.63.0
- [#16686](https://github.com/influxdata/telegraf/pull/16686) `deps` Bump github.com/rclone/rclone from 1.68.2 to 1.69.1
- [#16770](https://github.com/influxdata/telegraf/pull/16770) `deps` Bump github.com/sijms/go-ora/v2 from 2.8.22 to 2.8.24
- [#16709](https://github.com/influxdata/telegraf/pull/16709) `deps` Bump github.com/testcontainers/testcontainers-go from 0.35.0 to 0.36.0
- [#16763](https://github.com/influxdata/telegraf/pull/16763) `deps` Bump github.com/tinylib/msgp from 1.2.0 to 1.2.5
- [#16757](https://github.com/influxdata/telegraf/pull/16757) `deps` Bump github.com/urfave/cli/v2 from 2.27.2 to 2.27.6
- [#16724](https://github.com/influxdata/telegraf/pull/16724) `deps` Bump github.com/vmware/govmomi from v0.45.1 to v0.49.0
- [#16768](https://github.com/influxdata/telegraf/pull/16768) `deps` Bump go.opentelemetry.io/collector/pdata from 1.25.0 to 1.29.0
- [#16765](https://github.com/influxdata/telegraf/pull/16765) `deps` Bump go.step.sm/crypto from 0.59.1 to 0.60.0
- [#16756](https://github.com/influxdata/telegraf/pull/16756) `deps` Bump golang.org/x/crypto from 0.36.0 to 0.37.0
- [#16683](https://github.com/influxdata/telegraf/pull/16683) `deps` Bump golangci-lint from v1.64.5 to v2.0.2
- [#16759](https://github.com/influxdata/telegraf/pull/16759) `deps` Bump google.golang.org/api from 0.224.0 to 0.228.0
- [#16755](https://github.com/influxdata/telegraf/pull/16755) `deps` Bump k8s.io/client-go from 0.32.1 to 0.32.3
- [#16684](https://github.com/influxdata/telegraf/pull/16684) `deps` Bump tj-actions/changed-files from 46.0.1 to 46.0.3
- [#16736](https://github.com/influxdata/telegraf/pull/16736) `deps` Bump tj-actions/changed-files from 46.0.3 to 46.0.4
- [#16751](https://github.com/influxdata/telegraf/pull/16751) `deps` Bump tj-actions/changed-files from 46.0.4 to 46.0.5

## v1.34.1 {date="2025-03-24"}

### Bug fixes

- [#16638](https://github.com/influxdata/telegraf/pull/16638) `agent` Condense plugin source information table when multiple plugins in same file
- [#16674](https://github.com/influxdata/telegraf/pull/16674) `inputs.tail` Do not seek on pipes
- [#16643](https://github.com/influxdata/telegraf/pull/16643) `inputs.tail` Use correct initial_read_offset persistent offset naming in the code
- [#16628](https://github.com/influxdata/telegraf/pull/16628) `outputs.influxdb_v2` Use dynamic token secret
- [#16625](https://github.com/influxdata/telegraf/pull/16625) `outputs.sql` Allow to disable timestamp column
- [#16682](https://github.com/influxdata/telegraf/pull/16682) `secrets` Make 'insufficient lockable memory' warning work on BSDs

### Dependency updates

- [#16612](https://github.com/influxdata/telegraf/pull/16612) `deps` Bump github.com/PaesslerAG/gval from 1.2.2 to 1.2.4
- [#16650](https://github.com/influxdata/telegraf/pull/16650) `deps` Bump github.com/aws/smithy-go from 1.22.2 to 1.22.3
- [#16680](https://github.com/influxdata/telegraf/pull/16680) `deps` Bump github.com/golang-jwt/jwt/v4 from 4.5.1 to 4.5.2
- [#16679](https://github.com/influxdata/telegraf/pull/16679) `deps` Bump github.com/golang-jwt/jwt/v5 from 5.2.1 to 5.2.2
- [#16610](https://github.com/influxdata/telegraf/pull/16610) `deps` Bump github.com/golang/snappy from 0.0.4 to 1.0.0
- [#16652](https://github.com/influxdata/telegraf/pull/16652) `deps` Bump github.com/hashicorp/consul/api from 1.29.2 to 1.31.2
- [#16651](https://github.com/influxdata/telegraf/pull/16651) `deps` Bump github.com/leodido/go-syslog/v4 from 4.1.0 to 4.2.0
- [#16613](https://github.com/influxdata/telegraf/pull/16613) `deps` Bump github.com/linkedin/goavro/v2 from 2.13.0 to 2.13.1
- [#16671](https://github.com/influxdata/telegraf/pull/16671) `deps` Bump github.com/redis/go-redis/v9 from 9.7.0 to 9.7.3
- [#16611](https://github.com/influxdata/telegraf/pull/16611) `deps` Bump go.step.sm/crypto from 0.54.0 to 0.59.1
- [#16640](https://github.com/influxdata/telegraf/pull/16640) `deps` Bump golang.org/x/crypto from 0.35.0 to 0.36.0
- [#16620](https://github.com/influxdata/telegraf/pull/16620) `deps` Bump golang.org/x/net from 0.35.0 to 0.36.0
- [#16639](https://github.com/influxdata/telegraf/pull/16639) `deps` Bump golang.org/x/oauth2 from 0.26.0 to 0.28.0
- [#16653](https://github.com/influxdata/telegraf/pull/16653) `deps` Bump k8s.io/api from 0.32.1 to 0.32.3
- [#16659](https://github.com/influxdata/telegraf/pull/16659) `deps` Bump tj-actions/changed-files from v45 to v46.0.1

## v1.34.0 {date="2025-03-10"}

### New Plugins

- [#15988](https://github.com/influxdata/telegraf/pull/15988) `inputs.firehose` Add new plugin
- [#16352](https://github.com/influxdata/telegraf/pull/16352) `inputs.huebridge` Add plugin
- [#16392](https://github.com/influxdata/telegraf/pull/16392) `inputs.nsdp` Add plugin

### Features

- [#16333](https://github.com/influxdata/telegraf/pull/16333) `agent` Add support for input probing
- [#16270](https://github.com/influxdata/telegraf/pull/16270) `agent` Print plugins source information
- [#16474](https://github.com/influxdata/telegraf/pull/16474) `inputs.cgroup` Support more cgroup v2 formats
- [#16337](https://github.com/influxdata/telegraf/pull/16337) `inputs.cloudwatch` Allow wildcards for namespaces
- [#16292](https://github.com/influxdata/telegraf/pull/16292) `inputs.docker` Support swarm jobs
- [#16501](https://github.com/influxdata/telegraf/pull/16501) `inputs.exec` Allow to get untruncated errors in debug mode
- [#16480](https://github.com/influxdata/telegraf/pull/16480) `inputs.gnmi` Add support for `depth` extension
- [#16336](https://github.com/influxdata/telegraf/pull/16336) `inputs.infiniband` Add support for RDMA counters
- [#16124](https://github.com/influxdata/telegraf/pull/16124) `inputs.ipset` Add metric for number of entries and individual IPs
- [#16579](https://github.com/influxdata/telegraf/pull/16579) `inputs.nvidia_smi` Add new power-draw fields for v12 scheme
- [#16305](https://github.com/influxdata/telegraf/pull/16305) `inputs.nvidia_smi` Implement probing
- [#16105](https://github.com/influxdata/telegraf/pull/16105) `inputs.procstat` Add child level tag
- [#16066](https://github.com/influxdata/telegraf/pull/16066) `inputs.proxmox` Allow to add VM-id and status as tag
- [#16287](https://github.com/influxdata/telegraf/pull/16287) `inputs.systemd_units` Add active_enter_timestamp_us field
- [#16342](https://github.com/influxdata/telegraf/pull/16342) `inputs.tail` Add `initial_read_offset` config for controlling read behavior
- [#16355](https://github.com/influxdata/telegraf/pull/16355) `inputs.webhooks` Add support for GitHub workflow events
- [#16508](https://github.com/influxdata/telegraf/pull/16508) `inputs.x509_cert` Add support for JKS and PKCS#12 keystores
- [#16491](https://github.com/influxdata/telegraf/pull/16491) `outputs.mqtt` Add sprig for topic name generator for homie layout
- [#16570](https://github.com/influxdata/telegraf/pull/16570) `outputs.nats` Use Jetstream publisher when using Jetstream
- [#16566](https://github.com/influxdata/telegraf/pull/16566) `outputs.prometheus_client` Allow adding custom headers
- [#16272](https://github.com/influxdata/telegraf/pull/16272) `parsers.avro` Allow union fields to be specified as tags
- [#16493](https://github.com/influxdata/telegraf/pull/16493) `parsers.prometheusremotewrite` Add dense metric version to better support histograms
- [#16214](https://github.com/influxdata/telegraf/pull/16214) `processors.converter` Add support for base64 encoded IEEE floats
- [#16497](https://github.com/influxdata/telegraf/pull/16497) `processors.template` Add sprig function for templates

### Bug fixes

- [#16542](https://github.com/influxdata/telegraf/pull/16542) `inputs.gnmi` Handle path elements without name but with keys correctly
- [#16606](https://github.com/influxdata/telegraf/pull/16606) `inputs.huebridge` Cleanup and fix linter issues
- [#16580](https://github.com/influxdata/telegraf/pull/16580) `inputs.net` Skip checks in containerized environments
- [#16555](https://github.com/influxdata/telegraf/pull/16555) `outputs.opensearch` Use correct pipeline name while creating bulk-indexers
- [#16557](https://github.com/influxdata/telegraf/pull/16557) `serializers.prometheus` Use legacy validation for metric name

### Dependency updates

- [#16576](https://github.com/influxdata/telegraf/pull/16576) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azidentity from 1.8.1 to 1.8.2
- [#16553](https://github.com/influxdata/telegraf/pull/16553) `deps` Bump github.com/Azure/go-autorest/autorest from 0.11.29 to 0.11.30
- [#16552](https://github.com/influxdata/telegraf/pull/16552) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.198.1 to 1.203.1
- [#16554](https://github.com/influxdata/telegraf/pull/16554) `deps` Bump github.com/go-jose/go-jose/v4 from 4.0.4 to 4.0.5
- [#16574](https://github.com/influxdata/telegraf/pull/16574) `deps` Bump github.com/gopcua/opcua from 0.5.3 to 0.7.1
- [#16551](https://github.com/influxdata/telegraf/pull/16551) `deps` Bump github.com/nats-io/nats.go from 1.39.0 to 1.39.1
- [#16575](https://github.com/influxdata/telegraf/pull/16575) `deps` Bump github.com/tidwall/wal from 1.1.7 to 1.1.8
- [#16578](https://github.com/influxdata/telegraf/pull/16578) `deps` Bump super-linter/super-linter from 7.2.1 to 7.3.0

## v1.33.3 {date="2025-02-25"}

### Important Changes

- PR [#16507](https://github.com/influxdata/telegraf/pull/16507) adds the
  `enforce_first_namespace_as_origin` to the GNMI input plugin. This option
  allows to disable mangling of the response `path` tag by _not_ using namespaces
  as origin. It is highly recommended to disable the option.
  However, disabling the behavior might change the `path` tag and
  thus might break existing queries. Furthermore, the tag modification might
  increase cardinality in your database.

### Bug fixes

- [#16546](https://github.com/influxdata/telegraf/pull/16546) `agent` Add authorization and user-agent when watching remote configs
- [#16507](https://github.com/influxdata/telegraf/pull/16507) `inputs.gnmi` Allow to disable using first namespace as origin
- [#16511](https://github.com/influxdata/telegraf/pull/16511) `inputs.proxmox` Allow search domain to be empty
- [#16530](https://github.com/influxdata/telegraf/pull/16530) `internal` Fix plural acronyms in SnakeCase function
- [#16539](https://github.com/influxdata/telegraf/pull/16539) `logging` Handle closing correctly and fix tests
- [#16535](https://github.com/influxdata/telegraf/pull/16535) `processors.execd` Detect line-protocol parser correctly

### Dependency updates

- [#16506](https://github.com/influxdata/telegraf/pull/16506) `deps` Bump github.com/ClickHouse/clickhouse-go/v2 from 2.30.1 to 2.30.3
- [#16502](https://github.com/influxdata/telegraf/pull/16502) `deps` Bump github.com/antchfx/xmlquery from 1.4.1 to 1.4.4
- [#16519](https://github.com/influxdata/telegraf/pull/16519) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.43.1 to 1.43.14
- [#16503](https://github.com/influxdata/telegraf/pull/16503) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.36.2 to 1.40.0
- [#16522](https://github.com/influxdata/telegraf/pull/16522) `deps` Bump github.com/nats-io/nats.go from 1.37.0 to 1.39.0
- [#16505](https://github.com/influxdata/telegraf/pull/16505) `deps` Bump github.com/srebhan/cborquery from 1.0.1 to 1.0.3
- [#16534](https://github.com/influxdata/telegraf/pull/16534) `deps` Bump github.com/vishvananda/netlink from 1.3.0 to 1.3.1-0.20250221194427-0af32151e72b
- [#16521](https://github.com/influxdata/telegraf/pull/16521) `deps` Bump go.opentelemetry.io/collector/pdata from 1.12.0 to 1.25.0
- [#16504](https://github.com/influxdata/telegraf/pull/16504) `deps` Bump golang.org/x/net from 0.34.0 to 0.35.0
- [#16512](https://github.com/influxdata/telegraf/pull/16512) `deps` Bump golangci-lint from v1.63.4 to v1.64.5

## v1.33.2 {date="2025-02-10"}

### Important Changes

- PR [#16423](https://github.com/influxdata/telegraf/pull/16423) converts the ClickHouse drivers to the v2 version.
  This new version also requires a
  [new format for the DSN](https://github.com/ClickHouse/clickhouse-go/tree/v2.30.2?tab=readme-ov-file#dsn). The plugin
  tries its best to convert the old DSN to the new format but might not be able to do so. Please check for warnings in
  your log file and convert to the new format as soon as possible.
- PR [#16403](https://github.com/influxdata/telegraf/pull/16403) ensures consistency of the NetFlow plugin's
  `ip_version` field type by enforcing "IPv4", "IPv6", or "unknown" string values. Previously the `ip_version` could
  become an (unsigned) integer when parsing raw-packets' headers especially with SFlow v5 input. Please watch
  out for type-conflicts on the output side!

### Bug fixes

- [#16477](https://github.com/influxdata/telegraf/pull/16477) `agent` Avoid panic by checking for skip_processors_after_aggregators
- [#16489](https://github.com/influxdata/telegraf/pull/16489) `agent` Set `godebug x509negativeserial=1` as a workaround
- [#16403](https://github.com/influxdata/telegraf/pull/16403) `inputs.netflow` Ensure type consistency for sFlow&#39;s IP version field
- [#16447](https://github.com/influxdata/telegraf/pull/16447) `inputs.x509_cert` Add config to left-pad serial number to 128-bits
- [#16448](https://github.com/influxdata/telegraf/pull/16448) `outputs.azure_monitor` Prevent infinite send loop for outdated metrics
- [#16472](https://github.com/influxdata/telegraf/pull/16472) `outputs.sql` Fix insert into ClickHouse
- [#16454](https://github.com/influxdata/telegraf/pull/16454) `service` Set address to prevent orphaned dbus-session processes

### Dependency updates

- [#16442](https://github.com/influxdata/telegraf/pull/16442) `deps` Bump cloud.google.com/go/storage from 1.47.0 to 1.50.0
- [#16414](https://github.com/influxdata/telegraf/pull/16414) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azidentity from 1.7.0 to 1.8.1
- [#16416](https://github.com/influxdata/telegraf/pull/16416) `deps` Bump github.com/apache/iotdb-client-go from 1.3.2 to 1.3.3
- [#16415](https://github.com/influxdata/telegraf/pull/16415) `deps` Bump github.com/aws/aws-sdk-go-v2 from 1.32.8 to 1.33.0
- [#16394](https://github.com/influxdata/telegraf/pull/16394) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.38.0 to 1.45.3
- [#16468](https://github.com/influxdata/telegraf/pull/16468) `deps` Bump github.com/aws/aws-sdk-go-v2/service/sts from 1.33.10 to 1.33.12
- [#16439](https://github.com/influxdata/telegraf/pull/16439) `deps` Bump github.com/aws/aws-sdk-go-v2/service/sts from 1.33.2 to 1.33.10
- [#16395](https://github.com/influxdata/telegraf/pull/16395) `deps` Bump github.com/eclipse/paho.golang from 0.21.0 to 0.22.0
- [#16470](https://github.com/influxdata/telegraf/pull/16470) `deps` Bump github.com/go-ldap/ldap/v3 from 3.4.8 to 3.4.10
- [#16440](https://github.com/influxdata/telegraf/pull/16440) `deps` Bump github.com/google/cel-go from 0.21.0 to 0.23.0
- [#16445](https://github.com/influxdata/telegraf/pull/16445) `deps` Bump github.com/lxc/incus/v6 from 6.6.0 to 6.9.0
- [#16466](https://github.com/influxdata/telegraf/pull/16466) `deps` Bump github.com/nats-io/nats-server/v2 from 2.10.17 to 2.10.25
- [#16453](https://github.com/influxdata/telegraf/pull/16453) `deps` Bump github.com/prometheus/common from 0.61.0 to 0.62.0
- [#16417](https://github.com/influxdata/telegraf/pull/16417) `deps` Bump github.com/shirou/gopsutil/v4 from 4.24.10 to 4.24.12
- [#16369](https://github.com/influxdata/telegraf/pull/16369) `deps` Bump github.com/shirou/gopsutil/v4 from v4.24.10 to v4.24.12
- [#16397](https://github.com/influxdata/telegraf/pull/16397) `deps` Bump github.com/showwin/speedtest-go from 1.7.9 to 1.7.10
- [#16467](https://github.com/influxdata/telegraf/pull/16467) `deps` Bump github.com/yuin/goldmark from 1.6.0 to 1.7.8
- [#16360](https://github.com/influxdata/telegraf/pull/16360) `deps` Bump golangci-lint from v1.62.2 to v1.63.4
- [#16469](https://github.com/influxdata/telegraf/pull/16469) `deps` Bump google.golang.org/api from 0.214.0 to 0.219.0
- [#16396](https://github.com/influxdata/telegraf/pull/16396) `deps` Bump k8s.io/api from 0.31.3 to 0.32.1
- [#16482](https://github.com/influxdata/telegraf/pull/16482) `deps` Update Apache arrow from 0.0-20240716144821-cf5d7c7ec3cf to 18.1.0
- [#16423](https://github.com/influxdata/telegraf/pull/16423) `deps` Update ClickHouse SQL driver from 1.5.4 to to 2.30.1

## v1.33.1 {date="2025-01-10"}

### Important Changes

- The default value of `skip_processors_after_aggregators` will change to `true`
  with Telegraf `v1.40.0`, skip running the processors again after aggregators!
  If you need the current default behavior, please explicitly set the option to
  `false`! To silence the warning and use the future default behavior, please
  explicitly set the option to `true`.

### Bug fixes

- [#16290](https://github.com/influxdata/telegraf/pull/16290) `agent` Skip initialization of second processor state if requested
- [#16377](https://github.com/influxdata/telegraf/pull/16377) `inputs.intel_powerstat` Fix option removal version
- [#16310](https://github.com/influxdata/telegraf/pull/16310) `inputs.mongodb` Do not dereference nil pointer if gathering database stats fails
- [#16383](https://github.com/influxdata/telegraf/pull/16383) `outputs.influxdb_v2` Allow overriding auth and agent headers
- [#16388](https://github.com/influxdata/telegraf/pull/16388) `outputs.influxdb_v2` Fix panic and API error handling
- [#16289](https://github.com/influxdata/telegraf/pull/16289) `outputs.remotefile` Handle tracking metrics correctly

### Dependency updates

- [#16344](https://github.com/influxdata/telegraf/pull/16344) `deps` Bump cloud.google.com/go/bigquery from 1.64.0 to 1.65.0
- [#16283](https://github.com/influxdata/telegraf/pull/16283) `deps` Bump cloud.google.com/go/monitoring from 1.21.1 to 1.22.0
- [#16315](https://github.com/influxdata/telegraf/pull/16315) `deps` Bump github.com/Azure/go-autorest/autorest/adal from 0.9.23 to 0.9.24
- [#16319](https://github.com/influxdata/telegraf/pull/16319) `deps` Bump github.com/IBM/nzgo/v12 from 12.0.9-0.20231115043259-49c27f2dfe48 to 12.0.9
- [#16346](https://github.com/influxdata/telegraf/pull/16346) `deps` Bump github.com/Masterminds/semver/v3 from 3.3.0 to 3.3.1
- [#16280](https://github.com/influxdata/telegraf/pull/16280) `deps` Bump github.com/aws/aws-sdk-go-v2/config from 1.27.39 to 1.28.6
- [#16343](https://github.com/influxdata/telegraf/pull/16343) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.162.1 to 1.198.1
- [#16317](https://github.com/influxdata/telegraf/pull/16317) `deps` Bump github.com/fatih/color from 1.17.0 to 1.18.0
- [#16345](https://github.com/influxdata/telegraf/pull/16345) `deps` Bump github.com/gopacket/gopacket from 1.3.0 to 1.3.1
- [#16282](https://github.com/influxdata/telegraf/pull/16282) `deps` Bump github.com/nats-io/nats.go from 1.36.0 to 1.37.0
- [#16318](https://github.com/influxdata/telegraf/pull/16318) `deps` Bump github.com/prometheus/common from 0.60.0 to 0.61.0
- [#16324](https://github.com/influxdata/telegraf/pull/16324) `deps` Bump github.com/vapourismo/knx-go from v0.0.0-20240217175130-922a0d50c241 to v0.0.0-20240915133544-a6ab43471c11
- [#16297](https://github.com/influxdata/telegraf/pull/16297) `deps` Bump golang.org/x/crypto from 0.29.0 to 0.31.0
- [#16281](https://github.com/influxdata/telegraf/pull/16281) `deps` Bump k8s.io/client-go from 0.30.1 to 0.31.3
- [#16313](https://github.com/influxdata/telegraf/pull/16313) `deps` Bump super-linter/super-linter from 7.2.0 to 7.2.1

## v1.33.0 {date="2024-12-09"}

### New Plugins

- [#15754](https://github.com/influxdata/telegraf/pull/15754) `inputs.neoom_beaam` Add new plugin
- [#15869](https://github.com/influxdata/telegraf/pull/15869) `processors.batch` Add batch processor
- [#16144](https://github.com/influxdata/telegraf/pull/16144) `outputs.quix` Add plugin

### Features

- [#16010](https://github.com/influxdata/telegraf/pull/16010) `agent` Add --watch-interval option for polling config changes
- [#15948](https://github.com/influxdata/telegraf/pull/15948) `aggregators.basicstats` Add first field
- [#15891](https://github.com/influxdata/telegraf/pull/15891) `common.socket` Allow parallel parsing with a pool of workers
- [#16141](https://github.com/influxdata/telegraf/pull/16141) `inputs.amqp_consumer` Allow specification of queue arguments
- [#15950](https://github.com/influxdata/telegraf/pull/15950) `inputs.diskio` Add field io await and util
- [#15919](https://github.com/influxdata/telegraf/pull/15919) `inputs.kafka_consumer` Implement startup error behavior options
- [#15910](https://github.com/influxdata/telegraf/pull/15910) `inputs.memcached` Add support for external-store metrics
- [#15990](https://github.com/influxdata/telegraf/pull/15990) `inputs.mock` Add sine phase
- [#16040](https://github.com/influxdata/telegraf/pull/16040) `inputs.modbus` Allow grouping across register types
- [#15865](https://github.com/influxdata/telegraf/pull/15865) `inputs.prometheus` Allow to use secrets for credentials
- [#16230](https://github.com/influxdata/telegraf/pull/16230) `inputs.smart` Add Power on Hours and Cycle Count
- [#15935](https://github.com/influxdata/telegraf/pull/15935) `inputs.snmp` Add displayhint conversion
- [#16027](https://github.com/influxdata/telegraf/pull/16027) `inputs.snmp` Convert uneven bytes to int
- [#15976](https://github.com/influxdata/telegraf/pull/15976) `inputs.socket_listener` Use reception time as timestamp
- [#15853](https://github.com/influxdata/telegraf/pull/15853) `inputs.statsd` Allow reporting sets and timings count as floats
- [#11591](https://github.com/influxdata/telegraf/pull/11591) `inputs.vsphere` Add VM memory configuration
- [#16109](https://github.com/influxdata/telegraf/pull/16109) `inputs.vsphere` Add cpu temperature field
- [#15917](https://github.com/influxdata/telegraf/pull/15917) `inputs` Add option to choose the metric time source
- [#16242](https://github.com/influxdata/telegraf/pull/16242) `logging` Allow overriding message key for structured logging
- [#15742](https://github.com/influxdata/telegraf/pull/15742) `outputs.influxdb_v2` Add rate limit implementation
- [#15943](https://github.com/influxdata/telegraf/pull/15943) `outputs.mqtt` Add sprig functions for topic name generator
- [#16041](https://github.com/influxdata/telegraf/pull/16041) `outputs.postgresql` Allow limiting of column name length
- [#16258](https://github.com/influxdata/telegraf/pull/16258) `outputs` Add rate-limiting infrastructure
- [#16146](https://github.com/influxdata/telegraf/pull/16146) `outputs` Implement partial write errors
- [#15883](https://github.com/influxdata/telegraf/pull/15883) `outputs` Only copy metric if its not filtered out
- [#15893](https://github.com/influxdata/telegraf/pull/15893) `serializers.prometheusremotewrite` Log metric conversion errors

### Bug fixes

- [#16248](https://github.com/influxdata/telegraf/pull/16248) `inputs.netflow` Decode flags in TCP and IP headers correctly
- [#16257](https://github.com/influxdata/telegraf/pull/16257) `inputs.procstat` Handle running processes correctly across multiple filters
- [#16219](https://github.com/influxdata/telegraf/pull/16219) `logging` Add `Close()` func for redirectLogger
- [#16255](https://github.com/influxdata/telegraf/pull/16255) `logging` Clean up extra empty spaces when redirectLogger is used
- [#16274](https://github.com/influxdata/telegraf/pull/16274) `logging` Fix duplicated prefix and attrMsg in log message when redirectLogger is used

### Dependency updates

- [#16232](https://github.com/influxdata/telegraf/pull/16232) `deps` Bump cloud.google.com/go/bigquery from 1.63.1 to 1.64.0
- [#16235](https://github.com/influxdata/telegraf/pull/16235) `deps` Bump cloud.google.com/go/storage from 1.43.0 to 1.47.0
- [#16198](https://github.com/influxdata/telegraf/pull/16198) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.42.2 to 1.43.1
- [#16234](https://github.com/influxdata/telegraf/pull/16234) `deps` Bump github.com/aws/aws-sdk-go-v2/service/kinesis from 1.29.3 to 1.32.6
- [#16201](https://github.com/influxdata/telegraf/pull/16201) `deps` Bump github.com/intel/powertelemetry from 1.0.1 to 1.0.2
- [#16200](https://github.com/influxdata/telegraf/pull/16200) `deps` Bump github.com/rclone/rclone from 1.68.1 to 1.68.2
- [#16199](https://github.com/influxdata/telegraf/pull/16199) `deps` Bump github.com/vishvananda/netns from 0.0.4 to 0.0.5
- [#16236](https://github.com/influxdata/telegraf/pull/16236) `deps` Bump golang.org/x/net from 0.30.0 to 0.31.0
- [#16250](https://github.com/influxdata/telegraf/pull/16250) `deps` Bump golangci-lint from v1.62.0 to v1.62.2
- [#16233](https://github.com/influxdata/telegraf/pull/16233) `deps` Bump google.golang.org/grpc from 1.67.1 to 1.68.0
- [#16202](https://github.com/influxdata/telegraf/pull/16202) `deps` Bump modernc.org/sqlite from 1.33.1 to 1.34.1
- [#16203](https://github.com/influxdata/telegraf/pull/16203) `deps` Bump super-linter/super-linter from 7.1.0 to 7.2.0

## v1.32.3 {date="2024-11-18"}

### Important Changes

- PR [#16015](https://github.com/influxdata/telegraf/pull/16015) changes the
  internal counters of the Bind plugin to unsigned integers (as in the server
  implementation). For backward compatibility,
  `report_counters_as_int` is `true` by default to avoid type conflicts on the
  output side. _However, you should set  `report_counters_as_int` to `false` as soon as
  possible to avoid invalid values and parsing errors with the v3 XML
  statistics._

### Bug fixes

- [#16123](https://github.com/influxdata/telegraf/pull/16123) `agent` Restore setup order of stateful plugins to `Init()` then `SetState()`
- [#16111](https://github.com/influxdata/telegraf/pull/16111) `common.socket` Make sure the scanner buffer matches the read-buffer size
- [#16156](https://github.com/influxdata/telegraf/pull/16156) `common.socket` Use read buffer size config setting as a datagram reader buffer size
- [#16015](https://github.com/influxdata/telegraf/pull/16015) `inputs.bind` Convert counters to uint64
- [#16171](https://github.com/influxdata/telegraf/pull/16171) `inputs.gnmi` Register connection statistics before creating client
- [#16197](https://github.com/influxdata/telegraf/pull/16197) `inputs.netflow` Cast TCP ports to uint16
- [#16110](https://github.com/influxdata/telegraf/pull/16110) `inputs.ntpq` Avoid panic on empty lines and make sure -p is present
- [#16155](https://github.com/influxdata/telegraf/pull/16155) `inputs.snmp` Fix crash when trying to format fields from unknown OIDs
- [#16145](https://github.com/influxdata/telegraf/pull/16145) `inputs.snmp_trap` Remove timeout deprecation
- [#16108](https://github.com/influxdata/telegraf/pull/16108) `logger` Avoid setting the log-format default too early

### Dependency updates

- [#16093](https://github.com/influxdata/telegraf/pull/16093) `deps` Bump cloud.google.com/go/pubsub from 1.42.0 to 1.45.1
- [#16175](https://github.com/influxdata/telegraf/pull/16175) `deps` Bump github.com/aws/aws-sdk-go-v2/credentials from 1.17.37 to 1.17.44
- [#16096](https://github.com/influxdata/telegraf/pull/16096) `deps` Bump github.com/gofrs/uuid/v5 from 5.2.0 to 5.3.0
- [#16136](https://github.com/influxdata/telegraf/pull/16136) `deps` Bump github.com/golang-jwt/jwt/v4 from 4.5.0 to 4.5.1
- [#16094](https://github.com/influxdata/telegraf/pull/16094) `deps` Bump github.com/gopacket/gopacket from 1.2.0 to 1.3.0
- [#16133](https://github.com/influxdata/telegraf/pull/16133) `deps` Bump github.com/jackc/pgtype from 1.14.3 to 1.14.4
- [#16131](https://github.com/influxdata/telegraf/pull/16131) `deps` Bump github.com/openconfig/gnmi from 0.10.0 to 0.11.0
- [#16092](https://github.com/influxdata/telegraf/pull/16092) `deps` Bump github.com/prometheus/client_golang from 1.20.4 to 1.20.5
- [#16178](https://github.com/influxdata/telegraf/pull/16178) `deps` Bump github.com/rclone/rclone from 1.67.0 to 1.68.1
- [#16132](https://github.com/influxdata/telegraf/pull/16132) `deps` Bump github.com/shirou/gopsutil/v4 from 4.24.9 to 4.24.10
- [#16176](https://github.com/influxdata/telegraf/pull/16176) `deps` Bump github.com/sijms/go-ora/v2 from 2.8.19 to 2.8.22
- [#16134](https://github.com/influxdata/telegraf/pull/16134) `deps` Bump github.com/testcontainers/testcontainers-go/modules/kafka from 0.33.0 to 0.34.0
- [#16174](https://github.com/influxdata/telegraf/pull/16174) `deps` Bump github.com/tidwall/gjson from 1.17.1 to 1.18.0
- [#16135](https://github.com/influxdata/telegraf/pull/16135) `deps` Bump github.com/vmware/govmomi from 0.39.0 to 0.45.1
- [#16095](https://github.com/influxdata/telegraf/pull/16095) `deps` Bump golang.org/x/sys from 0.25.0 to 0.26.0
- [#16177](https://github.com/influxdata/telegraf/pull/16177) `deps` Bump golang.org/x/text from 0.19.0 to 0.20.0
- [#16172](https://github.com/influxdata/telegraf/pull/16172) `deps` Bump golangci-lint from v1.61.0 to v1.62.0

## v1.32.2 {date="2024-10-28"}

### Bug fixes

- [#15966](https://github.com/influxdata/telegraf/pull/15966) `agent` Use a unique WAL file for plugin instances of the same type
- [#16074](https://github.com/influxdata/telegraf/pull/16074) `inputs.kafka_consumer` Fix deadlock
- [#16009](https://github.com/influxdata/telegraf/pull/16009) `inputs.netflow` Cast complex types to field compatible ones
- [#16026](https://github.com/influxdata/telegraf/pull/16026) `inputs.opcua` Allow to retry reads on invalid sessions
- [#16060](https://github.com/influxdata/telegraf/pull/16060) `inputs.procstat` Correctly use systemd-unit setting for finding them
- [#16008](https://github.com/influxdata/telegraf/pull/16008) `inputs.win_eventlog` Handle XML data fields' filtering the same way as event fields
- [#15968](https://github.com/influxdata/telegraf/pull/15968) `outputs.remotefile` Create a new serializer instance per output file
- [#16014](https://github.com/influxdata/telegraf/pull/16014) `outputs.syslog` Trim field-names belonging to explicit SDIDs correctly

### Dependency updates

- [#15992](https://github.com/influxdata/telegraf/pull/15992) `deps` Bump cloud.google.com/go/bigquery from 1.62.0 to 1.63.1
- [#16056](https://github.com/influxdata/telegraf/pull/16056) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azcore from 1.14.0 to 1.16.0
- [#16021](https://github.com/influxdata/telegraf/pull/16021) `deps` Bump github.com/IBM/sarama from 1.43.2 to 1.43.3
- [#16019](https://github.com/influxdata/telegraf/pull/16019) `deps` Bump github.com/alitto/pond from 1.9.0 to 1.9.2
- [#16018](https://github.com/influxdata/telegraf/pull/16018) `deps` Bump github.com/apache/thrift from 0.20.0 to 0.21.0
- [#16054](https://github.com/influxdata/telegraf/pull/16054) `deps` Bump github.com/aws/aws-sdk-go-v2 from 1.32.1 to 1.32.2
- [#15996](https://github.com/influxdata/telegraf/pull/15996) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.40.4 to 1.42.1
- [#16055](https://github.com/influxdata/telegraf/pull/16055) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.42.1 to 1.42.2
- [#16057](https://github.com/influxdata/telegraf/pull/16057) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.34.9 to 1.36.2
- [#16022](https://github.com/influxdata/telegraf/pull/16022) `deps` Bump github.com/docker/docker from 27.1.1+incompatible to 27.3.1+incompatible
- [#15993](https://github.com/influxdata/telegraf/pull/15993) `deps` Bump github.com/gosnmp/gosnmp from 1.37.0 to 1.38.0
- [#15947](https://github.com/influxdata/telegraf/pull/15947) `deps` Bump github.com/gwos/tcg/sdk from v8.7.2 to v8.8.0
- [#16053](https://github.com/influxdata/telegraf/pull/16053) `deps` Bump github.com/lxc/incus/v6 from 6.2.0 to 6.6.0
- [#15994](https://github.com/influxdata/telegraf/pull/15994) `deps` Bump github.com/signalfx/golib/v3 from 3.3.53 to 3.3.54
- [#15995](https://github.com/influxdata/telegraf/pull/15995) `deps` Bump github.com/snowflakedb/gosnowflake from 1.11.1 to 1.11.2
- [#16020](https://github.com/influxdata/telegraf/pull/16020) `deps` Bump go.step.sm/crypto from 0.51.1 to 0.54.0
- [#16023](https://github.com/influxdata/telegraf/pull/16023) `deps` Bump github.com/shirou/gopsutil from v3.24.4 to v4.24.9

## v1.32.1 {date="2024-10-07"}

### Important Changes

- PR [#15796](https://github.com/influxdata/telegraf/pull/15796) changes the
  delivery state update of un-parseable messages from `ACK` to `NACK` without
  requeueing. This way, those messages are not lost and can optionally be
  handled using a dead-letter exchange by other means.
- Removal of old-style serializer creation. This should not directly affect
  users as it is an API change; all serializers in Telegraf are already ported
  to the new framework. If you experience any issues creating serializers, [contact us](/telegraf/v1/#bug-reports-and-feedback).

### Bug fixes

- [#15969](https://github.com/influxdata/telegraf/pull/15969) `agent` Fix buffer not flushing if all metrics are written
- [#15937](https://github.com/influxdata/telegraf/pull/15937) `config` Correctly print removal version info
- [#15900](https://github.com/influxdata/telegraf/pull/15900) `common.http` Keep timeout after creating oauth client
- [#15796](https://github.com/influxdata/telegraf/pull/15796) `inputs.amqp_consumer` NACKing messages on non-delivery related errors
- [#15923](https://github.com/influxdata/telegraf/pull/15923) `inputs.cisco_telemetry_mdt` Handle NXOS DME subtree telemetry format
- [#15907](https://github.com/influxdata/telegraf/pull/15907) `inputs.consul` Move config checking to Init method
- [#15982](https://github.com/influxdata/telegraf/pull/15982) `inputs.influxdb_v2_listener` Fix concurrent read/write dict
- [#15960](https://github.com/influxdata/telegraf/pull/15960) `inputs.vsphere` Add tags to VSAN ESA disks
- [#15921](https://github.com/influxdata/telegraf/pull/15921) `parsers.avro` Add mutex to cache access
- [#15965](https://github.com/influxdata/telegraf/pull/15965) `processors.aws_ec2` Remove leading slash and cancel worker only if it exists

### Dependency updates

- [#15932](https://github.com/influxdata/telegraf/pull/15932) `deps` Bump cloud.google.com/go/monitoring from 1.20.2 to 1.21.1
- [#15863](https://github.com/influxdata/telegraf/pull/15863) `deps` Bump github.com/Azure/azure-kusto-go from 0.15.3 to 0.16.1
- [#15862](https://github.com/influxdata/telegraf/pull/15862) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azcore from 1.13.0 to 1.14.0
- [#15957](https://github.com/influxdata/telegraf/pull/15957) `deps` Bump github.com/aws/aws-sdk-go-v2/feature/ec2/imds from 1.16.12 to 1.16.14
- [#15859](https://github.com/influxdata/telegraf/pull/15859) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.34.4 to 1.34.9
- [#15931](https://github.com/influxdata/telegraf/pull/15931) `deps` Bump github.com/boschrexroth/ctrlx-datalayer-golang from 1.3.0 to 1.3.1
- [#15890](https://github.com/influxdata/telegraf/pull/15890) `deps` Bump github.com/harlow/kinesis-consumer from v0.3.6-0.20240606153816-553e2392fdf3 to v0.3.6-0.20240916192723-43900507c911
- [#15904](https://github.com/influxdata/telegraf/pull/15904) `deps` Bump github.com/netsampler/goflow2/v2 from 2.1.5 to 2.2.1
- [#15903](https://github.com/influxdata/telegraf/pull/15903) `deps` Bump github.com/p4lang/p4runtime from 1.3.0 to 1.4.0
- [#15905](https://github.com/influxdata/telegraf/pull/15905) `deps` Bump github.com/prometheus/client_golang from 1.20.2 to 1.20.3
- [#15930](https://github.com/influxdata/telegraf/pull/15930) `deps` Bump github.com/prometheus/client_golang from 1.20.3 to 1.20.4
- [#15962](https://github.com/influxdata/telegraf/pull/15962) `deps` Bump github.com/prometheus/common from 0.55.0 to 0.60.0
- [#15860](https://github.com/influxdata/telegraf/pull/15860) `deps` Bump github.com/snowflakedb/gosnowflake from 1.10.0 to 1.11.1
- [#15954](https://github.com/influxdata/telegraf/pull/15954) `deps` Bump github.com/srebhan/protobufquery from 0.0.0-20230803132024-ae4c0d878e55 to 1.0.1
- [#15929](https://github.com/influxdata/telegraf/pull/15929) `deps` Bump go.mongodb.org/mongo-driver from 1.16.0 to 1.17.0
- [#15902](https://github.com/influxdata/telegraf/pull/15902) `deps` Bump golang.org/x/mod from 0.19.0 to 0.21.0
- [#15955](https://github.com/influxdata/telegraf/pull/15955) `deps` Bump golang.org/x/oauth2 from 0.21.0 to 0.23.0
- [#15861](https://github.com/influxdata/telegraf/pull/15861) `deps` Bump golang.org/x/term from 0.23.0 to 0.24.0
- [#15856](https://github.com/influxdata/telegraf/pull/15856) `deps` Bump golangci-lint from v1.60.3 to v1.61.0
- [#15933](https://github.com/influxdata/telegraf/pull/15933) `deps` Bump k8s.io/apimachinery from 0.30.1 to 0.31.1
- [#15901](https://github.com/influxdata/telegraf/pull/15901) `deps` Bump modernc.org/sqlite from 1.32.0 to 1.33.1

## v1.32.0 {date="2024-09-09"}

### Important Changes

- This release contains a logging overhaul as well as some new features for
  logging (see PRs [#15556](https://github.com/influxdata/telegraf/pull/15556),
  [#15629](https://github.com/influxdata/telegraf/pull/15629),
  [#15677](https://github.com/influxdata/telegraf/pull/15677),
  [#15695](https://github.com/influxdata/telegraf/pull/15695) and
  [#15751](https://github.com/influxdata/telegraf/pull/15751)).
  As a consequence, the redundant `logtarget` setting is deprecated. `stderr` is
  used if no `logfile` is provided, otherwise messages are logged to the given
  file. To use Windows `eventlog`, set `logformat = "eventlog"`.
- This release contains a change in json_v2 parser config parsing: if the config is empty (doesn't define any rules), initialization will fail
  (see PR [#15844](https://github.com/influxdata/telegraf/pull/15844)).
- This release contains a feature for a disk-backed metric buffer under the
  `buffer_strategy` agent config (see
  PR [#15564](https://github.com/influxdata/telegraf/pull/15564)).
  _This feature is **experimental**. Please report any issues you encounter while using it._

### New Plugins

- [#15700](https://github.com/influxdata/telegraf/pull/15700) `inputs.slurm` SLURM workload manager
- [#15602](https://github.com/influxdata/telegraf/pull/15602) `outputs.parquet` Parquet file writer
- [#15569](https://github.com/influxdata/telegraf/pull/15569) `outputs.remotefile` Output to remote location like S3

### Features

- [#15732](https://github.com/influxdata/telegraf/pull/15732) `agent` Add config check sub-command
- [#15564](https://github.com/influxdata/telegraf/pull/15564) `agent` Add metric disk buffer
- [#15645](https://github.com/influxdata/telegraf/pull/15645) `agent` Enable watching for new configuration files
- [#15644](https://github.com/influxdata/telegraf/pull/15644) `agent` Watch for deleted files
- [#15695](https://github.com/influxdata/telegraf/pull/15695) `logging` Add 'trace' log-level
- [#15677](https://github.com/influxdata/telegraf/pull/15677) `logging` Allow to override log-level per plugin
- [#15751](https://github.com/influxdata/telegraf/pull/15751) `logging` Implement structured logging
- [#15640](https://github.com/influxdata/telegraf/pull/15640) `common.cookie` Allow usage of secrets in headers
- [#15636](https://github.com/influxdata/telegraf/pull/15636) `common.shim` Enable metric tracking within external plugins
- [#15570](https://github.com/influxdata/telegraf/pull/15570) `common.tls` Allow group aliases for cipher-suites
- [#15628](https://github.com/influxdata/telegraf/pull/15628) `inputs.amd_rocm_smi` Parse newer ROCm versions
- [#15519](https://github.com/influxdata/telegraf/pull/15519) `inputs.azure_monitor` Add client options parameter
- [#15544](https://github.com/influxdata/telegraf/pull/15544) `inputs.elasticsearch` Add support for custom headers
- [#15688](https://github.com/influxdata/telegraf/pull/15688) `inputs.elasticsearch` Gather enrich stats
- [#15834](https://github.com/influxdata/telegraf/pull/15834) `inputs.execd` Allow to provide logging prefixes on stderr
- [#15764](https://github.com/influxdata/telegraf/pull/15764) `inputs.http_listener_v2` Add unix socket mode
- [#15495](https://github.com/influxdata/telegraf/pull/15495) `inputs.ipmi_sensor` Collect additional commands
- [#15790](https://github.com/influxdata/telegraf/pull/15790) `inputs.kafka_consumer` Allow to select the metric time source
- [#15648](https://github.com/influxdata/telegraf/pull/15648) `inputs.modbus` Allow reading single bits of input and holding registers
- [#15528](https://github.com/influxdata/telegraf/pull/15528) `inputs.mqtt_consumer` Add variable length topic parsing
- [#15486](https://github.com/influxdata/telegraf/pull/15486) `inputs.mqtt_consumer` Implement startup error behaviors
- [#15749](https://github.com/influxdata/telegraf/pull/15749) `inputs.mysql` Add support for replica status
- [#15521](https://github.com/influxdata/telegraf/pull/15521) `inputs.netflow` Add more fields for sFlow extended gateway packets
- [#15396](https://github.com/influxdata/telegraf/pull/15396) `inputs.netflow` Add support for sFlow drop notification packets
- [#15468](https://github.com/influxdata/telegraf/pull/15468) `inputs.openstack` Allow collection without admin privileges
- [#15637](https://github.com/influxdata/telegraf/pull/15637) `inputs.opentelemetry` Add profiles support
- [#15423](https://github.com/influxdata/telegraf/pull/15423) `inputs.procstat` Add ability to collect per-process socket statistics
- [#15655](https://github.com/influxdata/telegraf/pull/15655) `inputs.s7comm` Implement startup-error behavior settings
- [#15600](https://github.com/influxdata/telegraf/pull/15600) `inputs.sql` Add SAP HANA SQL driver
- [#15424](https://github.com/influxdata/telegraf/pull/15424) `inputs.sqlserver` Introduce user specified ID parameter for ADD logins
- [#15687](https://github.com/influxdata/telegraf/pull/15687) `inputs.statsd` Expose allowed_pending_messages as internal stat
- [#15458](https://github.com/influxdata/telegraf/pull/15458) `inputs.systemd_units` Support user scoped units
- [#15702](https://github.com/influxdata/telegraf/pull/15702) `outputs.datadog` Add support for submitting alongside dd-agent
- [#15668](https://github.com/influxdata/telegraf/pull/15668) `outputs.dynatrace` Report metrics as a delta counter using regular expression
- [#15471](https://github.com/influxdata/telegraf/pull/15471) `outputs.elasticsearch` Allow custom template index settings
- [#15613](https://github.com/influxdata/telegraf/pull/15613) `outputs.elasticsearch` Support data streams
- [#15722](https://github.com/influxdata/telegraf/pull/15722) `outputs.kafka` Add option to add metric name as record header
- [#15689](https://github.com/influxdata/telegraf/pull/15689) `outputs.kafka` Add option to set producer message timestamp
- [#15787](https://github.com/influxdata/telegraf/pull/15787) `outputs.syslog` Implement startup error behavior options
- [#15697](https://github.com/influxdata/telegraf/pull/15697) `parsers.value` Add base64 datatype
- [#15795](https://github.com/influxdata/telegraf/pull/15795) `processors.aws_ec2` Allow to use instance metadata

### Bug fixes

- [#15661](https://github.com/influxdata/telegraf/pull/15661) `agent` Fix buffer directory config and document
- [#15788](https://github.com/influxdata/telegraf/pull/15788) `inputs.kinesis_consumer` Honor the configured endpoint
- [#15791](https://github.com/influxdata/telegraf/pull/15791) `inputs.mysql` Enforce float for all known floating-point information
- [#15743](https://github.com/influxdata/telegraf/pull/15743) `inputs.snmp` Avoid sending a nil to gosmi's GetEnumBitsFormatted
- [#15815](https://github.com/influxdata/telegraf/pull/15815) `logger` Handle trace level for standard log
- [#15781](https://github.com/influxdata/telegraf/pull/15781) `outputs.kinesis` Honor the configured endpoint
- [#15615](https://github.com/influxdata/telegraf/pull/15615) `outputs.remotefile` Resolve linter not checking error
- [#15740](https://github.com/influxdata/telegraf/pull/15740) `serializers.template` Unwrap metrics if required

### Dependency updates

- [#15829](https://github.com/influxdata/telegraf/pull/15829) `deps` Bump github.com/BurntSushi/toml from 1.3.2 to 1.4.0
- [#15775](https://github.com/influxdata/telegraf/pull/15775) `deps` Bump github.com/aws/aws-sdk-go-v2/feature/ec2/imds from 1.16.11 to 1.16.12
- [#15733](https://github.com/influxdata/telegraf/pull/15733) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.38.7 to 1.40.3
- [#15761](https://github.com/influxdata/telegraf/pull/15761) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.40.3 to 1.40.4
- [#15827](https://github.com/influxdata/telegraf/pull/15827) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.37.3 to 1.38.0
- [#15760](https://github.com/influxdata/telegraf/pull/15760) `deps` Bump github.com/aws/aws-sdk-go-v2/service/timestreamwrite from 1.25.5 to 1.27.4
- [#15737](https://github.com/influxdata/telegraf/pull/15737) `deps` Bump github.com/eclipse/paho.mqtt.golang from 1.4.3 to 1.5.0
- [#15734](https://github.com/influxdata/telegraf/pull/15734) `deps` Bump github.com/google/cel-go from 0.20.1 to 0.21.0
- [#15777](https://github.com/influxdata/telegraf/pull/15777) `deps` Bump github.com/miekg/dns from 1.1.59 to 1.1.62
- [#15828](https://github.com/influxdata/telegraf/pull/15828) `deps` Bump github.com/openconfig/goyang from 1.5.0 to 1.6.0
- [#15735](https://github.com/influxdata/telegraf/pull/15735) `deps` Bump github.com/pion/dtls/v2 from 2.2.11 to 2.2.12
- [#15779](https://github.com/influxdata/telegraf/pull/15779) `deps` Bump github.com/prometheus/client_golang from 1.19.1 to 1.20.2
- [#15831](https://github.com/influxdata/telegraf/pull/15831) `deps` Bump github.com/prometheus/prometheus from 0.53.1 to 0.54.1
- [#15736](https://github.com/influxdata/telegraf/pull/15736) `deps` Bump github.com/redis/go-redis/v9 from 9.5.1 to 9.6.1
- [#15830](https://github.com/influxdata/telegraf/pull/15830) `deps` Bump github.com/seancfoley/ipaddress-go from 1.6.0 to 1.7.0
- [#15842](https://github.com/influxdata/telegraf/pull/15842) `deps` Bump github.com/showwin/speedtest-go from 1.7.7 to 1.7.9
- [#15778](https://github.com/influxdata/telegraf/pull/15778) `deps` Bump go.step.sm/crypto from 0.50.0 to 0.51.1
- [#15776](https://github.com/influxdata/telegraf/pull/15776) `deps` Bump golang.org/x/net from 0.27.0 to 0.28.0
- [#15757](https://github.com/influxdata/telegraf/pull/15757) `deps` Bump golang.org/x/sync from 0.7.0 to 0.8.0
- [#15759](https://github.com/influxdata/telegraf/pull/15759) `deps` Bump gonum.org/v1/gonum from 0.15.0 to 0.15.1
- [#15758](https://github.com/influxdata/telegraf/pull/15758) `deps` Bump modernc.org/sqlite from 1.30.0 to 1.32.0
- [#15756](https://github.com/influxdata/telegraf/pull/15756) `deps` Bump super-linter/super-linter from 6.8.0 to 7.0.0
- [#15826](https://github.com/influxdata/telegraf/pull/15826) `deps` Bump super-linter/super-linter from 7.0.0 to 7.1.0
- [#15780](https://github.com/influxdata/telegraf/pull/15780) `deps` Bump tj-actions/changed-files from 44 to 45

## v1.31.3 {date="2024-08-12"}

### Bug fixes

- [#15552](https://github.com/influxdata/telegraf/pull/15552) `inputs.chrony` Use DGRAM for the unix socket
- [#15667](https://github.com/influxdata/telegraf/pull/15667) `inputs.diskio` Print warnings once, add details to messages
- [#15670](https://github.com/influxdata/telegraf/pull/15670) `inputs.mqtt_consumer` Restore trace logging option
- [#15696](https://github.com/influxdata/telegraf/pull/15696) `inputs.opcua` Reconnect if closed connection
- [#15724](https://github.com/influxdata/telegraf/pull/15724) `inputs.smartctl` Use --scan-open instead of --scan to provide correct device type info
- [#15649](https://github.com/influxdata/telegraf/pull/15649) `inputs.tail` Prevent deadlock when closing and max undelivered lines hit

### Dependency updates

- [#15720](https://github.com/influxdata/telegraf/pull/15720) `deps` Bump Go from v1.22.5 to v1.22.6
- [#15683](https://github.com/influxdata/telegraf/pull/15683) `deps` Bump cloud.google.com/go/bigquery from 1.61.0 to 1.62.0
- [#15654](https://github.com/influxdata/telegraf/pull/15654) `deps` Bump cloud.google.com/go/monitoring from 1.19.0 to 1.20.2
- [#15679](https://github.com/influxdata/telegraf/pull/15679) `deps` Bump cloud.google.com/go/monitoring from 1.20.2 to 1.20.3
- [#15626](https://github.com/influxdata/telegraf/pull/15626) `deps` Bump github.com/antchfx/xmlquery from 1.4.0 to 1.4.1
- [#15706](https://github.com/influxdata/telegraf/pull/15706) `deps` Bump github.com/apache/iotdb-client-go from 1.2.0-tsbs to 1.3.2
- [#15651](https://github.com/influxdata/telegraf/pull/15651) `deps` Bump github.com/aws/aws-sdk-go-v2/credentials from 1.17.17 to 1.17.27
- [#15703](https://github.com/influxdata/telegraf/pull/15703) `deps` Bump github.com/aws/aws-sdk-go-v2/service/kinesis from v1.27.4 to v1.29.3
- [#15681](https://github.com/influxdata/telegraf/pull/15681) `deps` Bump github.com/docker/docker from 25.0.5-incompatible to 27.1.1-incompatible
- [#15650](https://github.com/influxdata/telegraf/pull/15650) `deps` Bump github.com/gofrs/uuid/v5 from 5.0.0 to 5.2.0
- [#15705](https://github.com/influxdata/telegraf/pull/15705) `deps` Bump github.com/gorilla/websocket from 1.5.1 to 1.5.3
- [#15708](https://github.com/influxdata/telegraf/pull/15708) `deps` Bump github.com/multiplay/go-ts3 from 1.1.0 to 1.2.0
- [#15707](https://github.com/influxdata/telegraf/pull/15707) `deps` Bump github.com/prometheus-community/pro-bing from 0.4.0 to 0.4.1
- [#15709](https://github.com/influxdata/telegraf/pull/15709) `deps` Bump github.com/prometheus/prometheus from 0.48.1 to 0.53.1
- [#15680](https://github.com/influxdata/telegraf/pull/15680) `deps` Bump github.com/vmware/govmomi from 0.37.2 to 0.39.0
- [#15682](https://github.com/influxdata/telegraf/pull/15682) `deps` Bump go.mongodb.org/mongo-driver from 1.14.0 to 1.16.0
- [#15652](https://github.com/influxdata/telegraf/pull/15652) `deps` Bump go.step.sm/crypto from 0.47.1 to 0.50.0
- [#15653](https://github.com/influxdata/telegraf/pull/15653) `deps` Bump google.golang.org/grpc from 1.64.1 to 1.65.0
- [#15704](https://github.com/influxdata/telegraf/pull/15704) `deps` Bump super-linter/super-linter from 6.7.0 to 6.8.0

## v1.31.2 {date="2024-07-22"}

### Bug fixes

- [#15589](https://github.com/influxdata/telegraf/pull/15589) `common.socket` Switch to context to simplify closing
- [#15601](https://github.com/influxdata/telegraf/pull/15601) `inputs.ping` Check addr length to avoid crash
- [#15618](https://github.com/influxdata/telegraf/pull/15618) `inputs.snmp` Translate field correctly when not in table
- [#15586](https://github.com/influxdata/telegraf/pull/15586) `parsers.xpath` Allow resolving extensions
- [#15630](https://github.com/influxdata/telegraf/pull/15630) `tools.custom_builder` Handle multiple instances of the same plugin correctly

### Dependency updates

- [#15582](https://github.com/influxdata/telegraf/pull/15582) `deps` Bump cloud.google.com/go/storage from 1.41.0 to 1.42.0
- [#15623](https://github.com/influxdata/telegraf/pull/15623) `deps` Bump cloud.google.com/go/storage from 1.42.0 to 1.43.0
- [#15607](https://github.com/influxdata/telegraf/pull/15607) `deps` Bump github.com/alitto/pond from 1.8.3 to 1.9.0
- [#15625](https://github.com/influxdata/telegraf/pull/15625) `deps` Bump github.com/antchfx/xpath from 1.3.0 to 1.3.1
- [#15622](https://github.com/influxdata/telegraf/pull/15622) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs from 1.34.3 to 1.37.3
- [#15606](https://github.com/influxdata/telegraf/pull/15606) `deps` Bump github.com/hashicorp/consul/api from 1.26.1 to 1.29.1
- [#15604](https://github.com/influxdata/telegraf/pull/15604) `deps` Bump github.com/jackc/pgx/v4 from 4.18.2 to 4.18.3
- [#15581](https://github.com/influxdata/telegraf/pull/15581) `deps` Bump github.com/nats-io/nats-server/v2 from 2.10.16 to 2.10.17
- [#15603](https://github.com/influxdata/telegraf/pull/15603) `deps` Bump github.com/openconfig/goyang from 1.0.0 to 1.5.0
- [#15624](https://github.com/influxdata/telegraf/pull/15624) `deps` Bump github.com/sijms/go-ora/v2 from 2.8.4 to 2.8.19
- [#15585](https://github.com/influxdata/telegraf/pull/15585) `deps` Bump github.com/testcontainers/testcontainers-go/modules/kafka from 0.30.0 to 0.31.0
- [#15605](https://github.com/influxdata/telegraf/pull/15605) `deps` Bump github.com/tinylib/msgp from 1.1.9 to 1.2.0
- [#15584](https://github.com/influxdata/telegraf/pull/15584) `deps` Bump github.com/urfave/cli/v2 from 2.27.1 to 2.27.2
- [#15614](https://github.com/influxdata/telegraf/pull/15614) `deps` Bump google.golang.org/grpc from 1.64.0 to 1.64.1
- [#15608](https://github.com/influxdata/telegraf/pull/15608) `deps` Bump super-linter/super-linter from 6.6.0 to 6.7.0

For versions earlier than v1.13 and earlier see
[CHANGELOG-1.13.md](CHANGELOG-1.13.md).

## v1.31.1 {date="2024-07-01"}

### Bug fixes

- [#15488](https://github.com/influxdata/telegraf/pull/15488) `agent` Ignore startup-errors in test mode
- [#15568](https://github.com/influxdata/telegraf/pull/15568) `inputs.chrony` Handle ServerStats4 response
- [#15551](https://github.com/influxdata/telegraf/pull/15551) `inputs.chrony` Support local (reference) sources
- [#15565](https://github.com/influxdata/telegraf/pull/15565) `inputs.gnmi` Handle YANG namespaces in paths correctly
- [#15496](https://github.com/influxdata/telegraf/pull/15496) `inputs.http_response` Fix for IPv4 and IPv6 addresses when interface is set
- [#15493](https://github.com/influxdata/telegraf/pull/15493) `inputs.mysql` Handle custom TLS configs correctly
- [#15514](https://github.com/influxdata/telegraf/pull/15514) `logging` Add back constants for backward compatibility
- [#15531](https://github.com/influxdata/telegraf/pull/15531) `secretstores.oauth2` Ensure endpoint params is not nil

### Dependency updates

- [#15483](https://github.com/influxdata/telegraf/pull/15483) `deps` Bump cloud.google.com/go/monitoring from 1.18.1 to 1.19.0
- [#15559](https://github.com/influxdata/telegraf/pull/15559) `deps` Bump github.com/Azure/azure-kusto-go from 0.15.2 to 0.15.3
- [#15489](https://github.com/influxdata/telegraf/pull/15489) `deps` Bump github.com/Azure/azure-sdk-for-go/sdk/azidentity from 1.5.1 to 1.6.0
- [#15560](https://github.com/influxdata/telegraf/pull/15560) `deps` Bump github.com/Azure/go-autorest/autorest/azure/auth from 0.5.12 to 0.5.13
- [#15480](https://github.com/influxdata/telegraf/pull/15480) `deps` Bump github.com/IBM/sarama from 1.43.1 to 1.43.2
- [#15526](https://github.com/influxdata/telegraf/pull/15526) `deps` Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch from 1.37.0 to 1.38.7
- [#15527](https://github.com/influxdata/telegraf/pull/15527) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.30.2 to 1.32.9
- [#15558](https://github.com/influxdata/telegraf/pull/15558) `deps` Bump github.com/aws/aws-sdk-go-v2/service/dynamodb from 1.32.9 to 1.33.2
- [#15448](https://github.com/influxdata/telegraf/pull/15448) `deps` Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.161.1 to 1.162.1
- [#15557](https://github.com/influxdata/telegraf/pull/15557) `deps` Bump github.com/go-ldap/ldap/v3 from 3.4.6 to 3.4.8
- [#15523](https://github.com/influxdata/telegraf/pull/15523) `deps` Bump github.com/linkedin/goavro/v2 from 2.12.0 to 2.13.0
- [#15484](https://github.com/influxdata/telegraf/pull/15484) `deps` Bump github.com/microsoft/go-mssqldb from 1.7.0 to 1.7.2
- [#15561](https://github.com/influxdata/telegraf/pull/15561) `deps` Bump github.com/nats-io/nats-server/v2 from 2.10.14 to 2.10.16
- [#15524](https://github.com/influxdata/telegraf/pull/15524) `deps` Bump github.com/prometheus/common from 0.53.0 to 0.54.0
- [#15481](https://github.com/influxdata/telegraf/pull/15481) `deps` Bump github.com/prometheus/procfs from 0.15.0 to 0.15.1
- [#15482](https://github.com/influxdata/telegraf/pull/15482) `deps` Bump github.com/rabbitmq/amqp091-go from 1.9.0 to 1.10.0
- [#15525](https://github.com/influxdata/telegraf/pull/15525) `deps` Bump go.step.sm/crypto from 0.44.1 to 0.47.1
- [#15479](https://github.com/influxdata/telegraf/pull/15479) `deps` Bump super-linter/super-linter from 6.5.1 to 6.6.0

## v1.31.0 {date="2024-06-10"}

### Important Changes

- The fields `read_bytes` and `write_bytes` in `inputs.procstat` now contain all
  I/O operations for consistency with other operating systems. Previous values
  are output as `disk_read_bytes` and `disk_write_bytes` measuring only the I/O
  on the storage layer.

### New Plugins

#### Inputs

- [smartctl](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/smartctl) (`inputs.smartctl`)

#### Parsers

- [openmetrics](https://github.com/influxdata/telegraf/tree/master/plugins/parsers/openmetrics) (`parsers.openmetrics`)
- [parquet](https://github.com/influxdata/telegraf/tree/master/plugins/parsers/parquet) (`parsers.parquet`)

#### Processors

- [timestamp](https://github.com/influxdata/telegraf/tree/master/plugins/processors/timestamp) (`processors.timestamp`)

### Features

- Agent:
  - Add uint support in cli test output.
  - Introduce CLI option to set config URL retry attempts.
  - Introduce CLI option to reload remote URL configs on change.
- Azure Monitor (`input.azure_monitor`): Use default Azure credentials chain when no secret provided.
- Basicstats (aggregators.basicstats`): Add last field.
- Binary (`parsers.binary`): Allow base64-encoded input data.
- Ceph (`inputs.ceph`): Use perf schema to determine metric type.
- CLI: List available parsers and serializers.
- CrateDB (`outputs.cratedb`): Allow configuration of startup error handling.
- DNS Query (`inputs.dns_query`): Allow ignoring errors of specific types.
- ElasticSearch (`outputs.elasticsearch Allow settings extra headers for elasticsearch output.
- Exec (`inputs.exec`): Add option to ignore return code.
- Execd (`inputs.execd`): Add option to not restart program on error.
- File (`inputs.file`): Add tag with absolute path of file.
- Final (aggregators.final`): Add option to disable appending _final.
- GNMI (`inputs.gnmi`):
  - Add keepalive settings.
  - Add option to create more descriptive tags.
  - Add secret store support for username and password.
  - Add yang-model decoding of JSON IETF payloads.
  - Allow to pass accepted cipher suites.
- HTTP Listener (`inputs.http_listener`): Allow setting custom success return code.
- HTTP Response (`inputs.http_response`): Add cookie authentication.
- Influx (`serializers.influx`): Add option to omit timestamp.
- InfluxDB (`inputs.influxdb`): Add metrics for build, crypto and commandline.
- InfluxDB (`outputs.influxdb`): Add option to define local address.
- InfluxDB v2 (`outputs.influxdb_v2`)
  - Add option to set local address.
  - Preserve custom query parameters on write.
- InfluxDB v2 Listener (`inputs.influxdb_v2_listener`):
  - Add support for rate limiting.
  - Support secret store for token.
- Internet Speed (`inputs.internet_speed`): Introduce packet loss field.
- Inputs (`inputs`): Add framework to retry on startup errors.
- Kafka Consumer (`inputs.kafka_consumer`): Add resolve canonical bootstrap server option.
- KNX Listener (`inputs.knx_listener`):
  - Add support for string data type.
  - Allow usage of DPT string representation.
- Kubernetes (`inputs.kubernetes`): Add option to node metric name.
- Lustre2 (`inputs.lustre2`):
  - Add eviction_count field.
  - Add health-check metric.
  - Add support for bulk read/write stats.
  - Skip brw_stats in case of insufficient permissions.
- Merge (aggregators.merge`): Allow to round metric timestamps.
- MQTT (`outputs.mqtt`): Add client trace logging, resolve MQTT5 reconnect login.
- Mock (`inputs.mock`): Add baseline option to sine.
- Netflow (`inputs.netflow`):
  - Add support for IPFIX option packets.
  - Add support for netflow v9 option packets.
- Nvidia SMI (`inputs.nvidia_smi`): Add power-limit field for v12 scheme.
- OPCUA (`common.opcua`): Add session timeout as configuration option.
- OpenStack (`inputs.openstack`): Use service catalog from v3 authentication if available.
- OpenTelemetry (`inputs.opentelemetry`): Add option to set max receive message size
- Outputs (`outputs`): Add framework to retry on startup errors.
- Parser (`processors.parser`): Add base64 decode for fields.
- PostgreSQL (`outputs.postgresql`):
  - Add secret store support.
  - Allow configuration of startup error handling.
- Printer (`processors.printer`): Embed Influx serializer options.
- Procstat (`inputs.procstat`):
  - Add option to select properties to collect.
  - Allow multiple selection criteria.
  - Report consistent I/O on Linux.
- Prometheus Remote Write (`parser.prometheusremotewrite`): Parse and generate histogram buckets.
- Radius (`inputs.radius`): Provide setting to set request IP address.
- Redis (`inputs.redis`): Add latency percentiles metric.
- s7comm (`inputs.s7comm`): Add optional connection type setting.
- SNMP (`snmp`): Add secret support for auth_password and priv_password.
- SNMP (`inputs.snmp`): Convert octet string with invalid data to hex.
- SQLServer (`inputs.sqlserver`): Add persistent version store metrics.
- Starlark (`processors.starlark`): Allow persistence of global state.
- Statsd (`inputs.statsd`):
  - Add support for DogStatsD v1.2.
  - Allow counters to report as float.
- Windows EventLog (`inputs.win_eventlog`): Add option to define event batch-size.
- Windows WMI (`inputs.win_wmi`):
  - Add support for remote queries.
  - Allow to invoke methods.

### Bug fixes

- Agent: Warn on multiple agent configuration tables seen.
- CloudWatch (`inputs.cloudwatch`):
  - Add accounts when enabled.
  - Ensure account list is larger than index.
- ECS (`inputs.ecs`): Check for nil pointer before use.
- PostgreSQL Extensible (`inputs.postgresql_extensible`): Use same timestamp for each gather.
- procstat (`inputs.procstat`): Do not report dead processes as running for orphan PID files.
- smartctl (`inputs.smartctl`): Add additional fields.
- SNMP Lookup (`processors.snmp_lookup`): Return empty tag-map on error to avoid panic.

### Dependency updates

- Update `cloud.google.com/go/storage` from 1.40.0 to 1.41.0.
- Update `github.com/awnumar/memguard` from 0.22.4 to 0.22.5.
- Update `github.com/fatih/color` from 1.16.0 to 1.17.0.
- Update `github.com/jhump/protoreflect` from 1.15.6 to 1.16.0.
- Update `github.com/lxc/incus` v0.4.0 to v6.2.0.
- Update `github.com/miekg/dns` from 1.1.58 to 1.1.59.
- Update `github.com/openzipkin/zipkin-go` from 0.4.2 to 0.4.3.
- Update `github.com/prometheus/common` from 0.52.2 to 0.53.0.
- Update `github.com/showwin/speedtest-go` from 1.7.5 to 1.7.6.
- Update `github.com/showwin/speedtest-go` from 1.7.6 to 1.7.7.
- Update `github.com/snowflakedb/gosnowflake` from 1.7.2 to 1.10.0.
- Update `go` from v1.22.3 to v1.22.4.
- Update `golang.org/x/crypto` from 0.22.0 to 0.23.0.
- Update `golang.org/x/net` from 0.24.0 to 0.25.0.
- Update `k8s.io/*` from 0.29.3 to 0.30.1.
- Update `modernc.org/sqlite` from 1.29.10 to 1.30.0.
- Update `modernc.org/sqlite` from 1.29.5 to 1.29.10.
- Update `super-linter/super-linter` from 6.4.1 to 6.5.0.
- Update `super-linter/super-linter` from 6.5.0 to 6.5.1.
- Switch to `github.com/leodido/go-syslog`.
- Update all OpenTelemetry dependencies.

## v1.30.3 {date="2024-05-20"}

### Bug fixes

- Cloudwatch (`inputs.cloudwatch`): Option to produce dense metrics.
- GNMI (`inputs.gnmi`): Ensure path contains elements to avoid panic.
- Graphite (`outputs.graphite`): Handle local address without port correctly.
- HTTP (`http`): Stop plugins from leaking file descriptors on telegraf reload.
- HTTP Listener v2 (`inputs.http_listener_v2`): Wrap timestamp parsing error messages.
- Loki (`outputs.loki`): Option to sanitize label names.
- Makefile (`makefile`): Use go's dependency checker for per platform builds.
- Netflow (`inputs.netflow`): Log unknown fields only once.
- Redis (`input.redis`): Discard invalid errorstat lines.
- Sysstat (`inputs.sysstat`): Prevent default sadc_interval from increasing on reload.
- Windows (`windows`): Make sure to log the final error message on exit.

### Dependency updates

- Update `cloud.google.com/go/bigquery` from 1.59.1 to 1.61.0.
- Update `github.com/Azure/azure-kusto-go` from 0.15.0 to 0.15.2.
- Update `github.com/aliyun/alibaba-cloud-sdk-go` from 1.62.713 to 1.62.721.
- Update `github.com/antchfx/xmlquery` from 1.3.18 to 1.4.0.
- Update `github.com/antchfx/xpath` from 1.2.5 to 1.3.0.
- Update `github.com/aws/aws-sdk-go-v2/config` from 1.27.9 to 1.27.13.
- Update `github.com/aws/aws-sdk-go-v2/credentials` from 1.17.9 to 1.17.11.
- Update `github.com/aws/aws-sdk-go-v2/service/ec2` from 1.151.1 to 1.161.1.
- Update `github.com/coocood/freecache` from 1.2.3 to 1.2.4.
- Update `github.com/google/cel-go` from 0.18.1 to 0.20.1.
- Update `github.com/grid-x/modbus` from v0.0.0-20211113184042-7f2251c342c9 to v0.0.0-20240503115206-582f2ab60a18.
- Update `github.com/nats-io/nats-server/v2` from 2.10.9 to 2.10.14.
- Update `github.com/pion/dtls/v2` from 2.2.10 to 2.2.11.
- Update `github.com/prometheus/procfs` from 0.13.0 to 0.14.0.
- Update `github.com/shirou/gopsutil/v3` from v3.24.3 to v3.24.4.
- Update `github.com/testcontainers/testcontainers-go/modules/kafka` from 0.26.1-0.20231116140448-68d5f8983d09 to 0.30.0.
- Update `github.com/vmware/govmomi` from 0.37.0 to 0.37.2.
- Update `go` from v1.22.2 to v1.22.3.
- Update `golang.org/x/mod` from 0.16.0 to 0.17.0.
- Update `golang.org/x/sync` from 0.6.0 to 0.7.0.
- Update `golangci-lint` from v1.57.2 to v1.58.0.
- Update `google.golang.org/api` from 0.171.0 to 0.177.0.
- Update `super-linter/super-linter` from 6.3.1 to 6.4.1.
- Migrate to maintained gopacket library.

## v1.30.2 {date="2024-04-22"}

### Important Changes

- This release reverts the behavior of `inputs.systemd_units` back to
  pre-v1.30.0 to only collect units already loaded by systemd (i.e. not
  collecting disabled or static units). This was necessary because using
  unspecific filters will cause significant load on the system as systemd needs
  to read all unit-files matching the pattern in each gather cycle. If you use
  specific patterns and want to collect non-loaded units, please set the
  `collect_disabled_units` option to true.

### Bug fixes

- Agent (`agent`): Ensure import of required package for pprof support.
- Disk I/O (`inputs.diskio`): Update path from /sys/block to /sys/class/block.
- Modbus (`inputs.modbus`): Avoid overflow when calculating with uint16 addresses.
- Nvidia (`inputs.nvidia`): Include power limit field for v11.
- OPC UA (`inputs.opcua`): Make sure to always create a request.
- OpenSearch (`outputs.opensearch`): Correctly error during failures or disconnect.
- PHP FPM (`inputs.phpfpm`): Check for error before continue processing.
- Prometheus (`inputs.prometheus`):
  - Correctly handle host header.
  - Remove duplicate response_timeout option.
- SQL (`outputs.sql`): Enable the use of krb5 with mssql driver.
- SQL Server (`inputs.sqlserver`): Honor timezone on backup metrics.
- systemd (`systemd`): Remove 5 second timeout, use default (90 seconds).
- systemd Units (`inputs.systemd_units`):
  - Reconnect if connection is lost.
  - Revert to only gather loaded units by default.
- Windows Event Log (`inputs.win_eventlog`): Handle empty query correctly.

### Dependency updates

- Update `github.com/aliyun/alibaba-cloud-sdk-go` from 1.62.563 to 1.62.708.
- Update `github.com/aliyun/alibaba-cloud-sdk-go` from 1.62.708 to 1.62.713.
- Update `github.com/apache/iotdb-client-go` from 0.12.2-0.20220722111104-cd17da295b46 to 1.2.0-tsbs.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatch` from 1.36.1 to 1.37.0.
- Update `github.com/aws/aws-sdk-go-v2/service/kinesis` from 1.27.1 to 1.27.4.
- Update `github.com/aws/aws-sdk-go-v2/service/timestreamwrite` from 1.25.2 to 1.25.5.
- Update `github.com/go-sql-driver/mysql` from 1.7.1 to 1.8.1.
- Update `github.com/gophercloud/gophercloud` from 1.9.0 to 1.11.0.
- Update `github.com/jackc/pgtype` from 1.14.2 to 1.14.3.
- Update `github.com/prometheus/client_golang` from 1.18.0 to 1.19.0.
- Update `github.com/redis/go-redis/v9` from 9.2.1 to 9.5.1.
- Update `github.com/shirou/gopsutil` from v3.23.11 to v3.24.3.
- Update `github.com/testcontainers/testcontainers-go` from 0.27.0 to 0.29.1.
- Update `github.com/vmware/govmomi` from 0.33.1 to 0.37.0.
- Update `golang.org/x/net` from 0.22.0 to 0.23.0.
- Update `golang.org/x/oauth2` from 0.18.0 to 0.19.0.
- Update `k8s.io/client-go` from 0.29.2 to 0.29.3.
- Update `super-linter/super-linter` from 6.3.0 to 6.3.1.
- Update `tj-actions/changed-files` from 43 to 44

## v1.30.1 {date="2024-04-01"}

### Bug fixes

- Chrony (`inputs.chrony`): Remove chronyc dependency in documentation.
- DiskIO (`inputs.diskio`): Add missing udev properties.
- DNS Query (`inputs.dns_query`):
  - Fill out additional record fields.
  - Include the canonical CNAME target.
- KNX (`inputs.knx_listener`):
  - Ignore GroupValueRead requests.
  - Reconnect after connection loss.
- MySQL (`inputs.mysql`):
  - Parse boolean values in metric v1 correctly.
  - Use correct column-types for Percona 8 user stats.
- NVIDIA SMI (`inputs.nvidia_smi`): Add process info metrics.
- OpenStack(`inputs.openstack`): Resolve regression in block storage and server info.
- PHP-FPM (`inputs.phpfpm`): Add timeout for fcgi.
- Ping (`inputs.ping`): Add option to force ipv4.
- Prometheus (`inputs.prometheus`): Initialize logger of parser.
- S.M.A.R.T. (`inputs.smart`): Improve regexp to support flags with a plus.
- Systemd Units (`inputs.systemd_units`): Handle disabled multi-instance units correctly.
- BigQuery (`outputs.bigquery`): Add scope to bigquery and remove timeout context.
- Avoid count underflow by only counting initialized secrets.
- Ensure watch-config is passed to the Windows service.

### Dependency updates

- Update `github.com/IBM/sarama` from v1.42.2 to v1.43.1.
- Update `github.com/aws/aws-sdk-go-v2` from 1.25.3 to 1.26.0.
- Update `github.com/aws/aws-sdk-go-v2/config` from 1.27.5 to 1.27.9.
- Update `github.com/aws/aws-sdk-go-v2/feature/ec2/imds` from 1.15.2 to 1.16.0.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs` from 1.34.2 to 1.34.3.
- Update `github.com/aws/aws-sdk-go-v2/service/ec2` from 1.149.3 to 1.151.1.
- Update `github.com/aws/aws-sdk-go-v2/service/sts` from 1.28.2 to 1.28.4.
- Update `github.com/docker/docker` from 25.0.0+incompatible to 25.0.5+incompatible.
- Update `github.com/jackc/pgtype` from 1.14.0 to 1.14.2.
- Update `github.com/jackc/pgx/v4` from 4.18.1 to 4.18.2.
- Update `github.com/klauspost/compress` from 1.17.6 to 1.17.7.
- Update `github.com/pion/dtls/v2` from 2.2.8 to 2.2.10.
- Update `github.com/prometheus-community/pro-bing` from 0.3.0 to 0.4.0.
- Update `github.com/prometheus/procfs` from 0.12.0 to 0.13.0.
- Update `github.com/stretchr/testify` v1.8.4 to v1.9.0.
- Update `go.step.sm/crypto` from 0.43.0 to 0.44.1.
- Update `golang.org/x/crypto` from 0.20.0 to 0.21.0.
- Update `gonum.org/v1/gonum` from 0.14.0 to 0.15.0.
- Update `google.golang.org/api` from 0.165.0 to 0.171.0.
- Update `google.golang.org/protobuf` from 1.32.0 to 1.33.0.
- Update `tj-actions/changed-files` from 42 to 43.

## v1.30.0 {date="2024-03-11"}

### Deprecation removals

This release removes the following deprecated plugins:

- `inputs.cassandra`
- `inputs.httpjson`
- `inputs.io`
- `inputs.jolokia`
- `inputs.kafka_consumer_legacy`
- `inputs.snmp_legacy`
- `inputs.tcp_listener`
- `inputs.udp_listener`
- `outputs.riemann_legacy`

Furthermore, the following deprecated plugin options are removed:

- `mountpoints` of `inputs.disk`
- `metric_buffer` of `inputs.mqtt_consumer`
- `metric_buffer` of `inputs.nats_consumer`
- `url` of `outputs.influxdb`

Replacements do exist, so please migrate your configuration in case you are
still using one of these plugins. The [`telegraf config migrate` command](/telegraf/v1/commands/config/migrate/)
can help with migrating to newer plugins.

### Important Changes

- The default read-timeout of `inputs.syslog` of five seconds is not a sensible
  default as the plugin will close the connection if the time between
  consecutive messages exceeds the timeout. Telegraf 1.30.0+ sets the timeout
  to infinite (i.e zero) as this is the expected behavior.
- Telegraf 1.30.0+ correctly sanitize PostgreSQL addresses, which may change the
  server tag value for a URI-formatted address that contains spaces, backslashes
  or single-quotes in non-redacted parameters.

### New Plugins

#### Outputs

- [Zabbix](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/zabbix) (`outputs.zabbix`)

#### Serializers

- [Binary](https://github.com/influxdata/telegraf/tree/master/plugins/serializers/binary) (`serializers.binary`)

#### Processors

- [SNMP lookup](https://github.com/influxdata/telegraf/tree/master/plugins/processors/snmp_lookup) (`processors.snmp_lookup`)

### Features

- Add loongarch64 nightly and release builds.
- Add `skip_processors_after_aggregators` configuration option to skip
  re-running processors after aggregators.
- Allow secrets in headers
- OPCUA (`common.opcua`): Add debug info for nodes not in server namespace.
- Aerospike (`inputs.aerospike`): Deprecate plugin.
- AMD ROCm System Management Interface (`inputs.amd_rocm_smi`):
  Add `startup_error_behavior` configuration option.
- Chrony (`inputs.chrony`):
  - Allow the collection of additional metrics.
  - Remove `chronyc` dependency.
- Kafka Consumer (`inputs.kafka_consumer`): Mark messages that failed parsing.
- Kernel (`inputs.kernel`): Add pressure stall information.
- Modbus (`inputs.modbus`): Add a workaround for unusual string-byte locations.
- Net (`inputs.net`): Add speed metric.
- NVIDIA SMI (`inputs.nvidia_smi`): Add `startup_error_behavior` configuration option.
- Prometheus (`inputs.prometheus`):
  - Add internal metrics.
  - Add option to limit body length.
- Redfish (`inputs.redfish`): Allow secrets for username/password configuration.
- S.M.A.R.T. (`inputs.smart`): Add a `device_type` tag to differentiate disks
  behind a RAID controller.
- SQL Server (`inputs.sqlserver`): Add stolen target memory ratio.
- Systemd Units (`inputs.systemd_units`)
  - Support querying unloaded/disabled units.
  - Introduce show subcommand for additional data.
- Windows Services (`inputs.win_services`): Make service selection case-insensitive.
- Graphite (`outputs.graphite`): Set the local address to bind to.
- NATS (`outputs.nats`): Introduce NATS Jetstream option.
- Nebius Cloud Monitoring (`outputs.nebius_cloud_monitoring`): Add service
  configuration setting.
- Webscoket (`outputs.websocket`): Support secrets in headers.
- CSV (`serializers.csv`): Specify a fixed column order.

### Bug fixes

- Catch panics in input plugin goroutines.
- Reword error message about missing configuration options.
- Docker Log (`inputs.docker_log`): Use the correct name when matching container.
- GNMI (`inputs.gnmi`):
  - Add option to infer the path tag from the subscription.
  - Handle canonical field-name correctly
- Netflow (`inputs.netflow`): Fallback to IPFIX mappings for Netflow v9.
- PHP-FPM (`inputs.phpfpm`): Continue despite erroneous sockets.
- Prometheus (`inputs.prometheus`): List namespaces only when filtering by namespace.
- Prometheus (`parsers.prometheus`): Do not touch input data for protocol-buffers.
- Override (`processors.override`): Correct TOML tag name.
- Ensure valid statefile in package.

### Dependency updates

- Update all `github.com/aws/aws-sdk-go-v2` dependencies.
- Update `cloud.google.com/go/bigquery` from 1.58.0 to 1.59.1.
- Update `github.com/aws/aws-sdk-go-v2/service/dynamodb` from 1.27.0 to 1.30.2.
- Update `github.com/cloudevents/sdk-go/v2` from 2.15.0 to 2.15.2.
- Update `github.com/eclipse/paho.golang` from 0.20.0 to 0.21.0.
- Update `github.com/microsoft/go-mssqldb` from 1.6.0 to 1.7.0.
- Update `github.com/netsampler/goflow2` from v1.3.6 to v2.1.2.
- Update `github.com/peterbourgon/unixtransport` from 0.0.3 to 0.0.4.
- Update `github.com/prometheus/client_model` from 0.5.0 to 0.6.0.
- Update `github.com/srebhan/cborquery` from v0.0.0-20230626165538-38be85b82316 to v1.0.1.
- Update `github.com/vapourismo/knx-go` from v0.0.0-20240107135439-816b70397a00 to v0.0.0-20240217175130-922a0d50c241.
- Update `go.mongodb.org/mongo-driver` from 1.13.1 to 1.14.0.
- Update `golang.org/x/crypto` from 0.19.0 to 0.20.0.
- Update `modernc.org/sqlite` from 1.28.0 to 1.29.2.
- Update `super-linter/super-linter` from 6.1.1 to 6.3.0.

## v1.29.5 {date="2024-02-20"}

### Bug fixes

- execd (`processors.execd`): Accept tracking metrics instead of dropping them.
- Filecount (`inputs.filecount`): Respect symlink files with FollowSymLinks.
- GNMI (`inputs.gnmi`): Normalize path for inline origin handling.
- Kafka Consume (`inputs.kafka_consumer`): Fix typo of msg_headers_as_tags.
- MQTT (`outputs.mqtt`): Retry metrics for server timeout.
- Packaging (`rpm`): Ensure telegraf is installed after useradd.
- PostgreSQL Extensible (`inputs.postgresql_extensible`): Add support for bool tags.
- Redfish (`inputs.redfish`): Resolve iLO4 fan data.
- SNMP Trap (`inputs.snmp_trap`): Enable SHA ciphers.
- unpivot (`processors.unpivot`): Handle tracking metrics correctly.
- Vsphere (`inputs.vsphere`): Use guest.guestId value if set for guest name.

### Dependency updates

- Update `cloud.google.com/go/bigquery` from 1.57.1 to 1.58.0.
- Update `cloud.google.com/go/pubsub` from 1.33.0 to 1.36.1.
- Update `cloud.google.com/go/storage` from 1.36.0 to 1.38.0.
- Update `github.com/Azure/azure-event-hubs-go/v3` from 3.6.1 to 3.6.2.
- Update `github.com/DATA-DOG/go-sqlmock` from 1.5.0 to 1.5.2.
- Update `github.com/IBM/sarama` from 1.42.1 to 1.42.2.
- Update `github.com/awnumar/memguard` from 0.22.4-0.20231204102859-fce56aae03b8 to 0.22.4.
- Update `github.com/cloudevents/sdk-go/v2` from 2.14.0 to 2.15.0.
- Update `github.com/eclipse/paho.golang` from 0.11.0 to 0.20.0.
- Update `github.com/google/uuid` from 1.5.0 to 1.6.0.
- Update `github.com/gopcua/opcua` from 0.4.0 to 0.5.3.
- Update `github.com/gophercloud/gophercloud` from 1.7.0 to 1.9.0.
- Update `github.com/gwos/tcg/sdk` from v0.0.0-20220621192633-df0eac0a1a4c to v8.7.2.
- Update `github.com/jhump/protoreflect` from 1.15.4 to 1.15.6.
- Update `github.com/klauspost/compress` from 1.17.4 to 1.17.6.
- Update `github.com/miekg/dns` from 1.1.57 to 1.1.58.
- Update `github.com/showwin/speedtest-go` from 1.6.7 to 1.6.10.
- Update `github.com/urfave/cli/v2` from 2.25.7 to 2.27.1.
- Update `go.opentelemetry.io/collector/pdata` from 1.0.1 to 1.1.0.
- Update `golang.org/x/oauth2` from 0.16.0 to 0.17.0.
- Update `google.golang.org/api` from 0.162.0 to 0.165.0.
- Update `google.golang.org/grpc` from 1.61.0 to 1.61.1.
- Update `k8s.io/apimachinery` from 0.29.0 to 0.29.1.
- Update `k8s.io/client-go` from 0.29.0 to 0.29.1.
- Update `k8s.io/client-go` from 0.29.1 to 0.29.2.
- Update `super-linter/super-linter` from 6.0.0 to 6.1.1.
- Update `tj-actions/changed-files` from 41 to 42.
- Remove `golang.org/x/exp` and use stable versions instead.
- Use `github.com/coreos/go-systemd/v22` instead of git version.

## v1.29.4 {date="2024-01-31"}

### Bug fixes

- SNMP (`inputs.temp`): Fix regression in metric formats.
- SNMP Trap (`inputs.snmp_trap`): Handle octet strings.
- Parser (`processors.parser`): Drop tracking metrics when not carried forward.

### Dependency updates

- Update all AWS dependencies
- Update `github.com/compose-spec/compose-go` from 1.20.0 to 1.20.2.
- Update `github.com/gosnmp/gosnmp` from 1.36.1 to 1.37.0.
- Update `github.com/microsoft/go-mssqldb` from 1.5.0 to 1.6.0.
- Update `github.com/nats-io/nats-server/v2` from 2.10.6 to 2.10.9.
- Update `github.com/yuin/goldmark` from 1.5.6 to 1.6.0.

## v1.29.3 {date="2024-01-29"}

### Bug fixes

- Encoding (`common.encoding`): Remove locally-defined errors and use upstream ones.
- GNMI (`inputs.gnmi`): Refactor alias handling to prevent clipping.
- IOTDB (`outputs.iotdb`): Handle paths that contain illegal characters.
- Loki (`outputs.loki`): Do not close body before reading it.
- MQTT (`outputs.mqtt`): Preserve leading slash in topic.
- Temperature (`inputs.temp`): Recover pre-v1.22.4 temperature sensor readings.
- Windows Performance Counters (`inputs.win_perf_counters`):
  - Check errors post-collection for skip.
  - Ignore PdhCstatusNoInstance as well.

### Dependency updates

- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs` from 1.29.5 to 1.31.0.
- Update `github.com/aws/aws-sdk-go-v2/service/sts` from 1.26.5 to 1.26.7.
- Update `github.com/clarify/clarify-go` from 0.2.4 to 0.3.1.
- Update `github.com/docker/docker` from 24.0.7+incompatible to 25.0.0+incompatible.
- Update `github.com/docker/go-connections` from 0.4.0 to 0.5.0.
- Update `github.com/fatih/color` from 1.15.0 to 1.16.0.
- Update `github.com/gorilla/mux` from 1.8.0 to 1.8.1.
- Update `github.com/intel/powertelemetry` from 1.0.0 to 1.0.1.
- Update `github.com/nats-io/nats.go` from 1.31.0 to 1.32.0.
- Update `github.com/prometheus/common` from 0.44.0 to 0.45.0.
- Update `github.com/testcontainers/testcontainers-go` from 0.26.0 to 0.27.0.
- Update `github.com/vapourismo/knx-go` from v0.0.0-20220829185957-fb5458a5389d to 20240107135439-816b70397a00.
- Update `go.opentelemetry.io/collector/pdata` from 1.0.0-rcv0016 to 1.0.1.
- Update `go.starlark.net` from `go.starlark.net` v0.0.0-20220328144851-d1966c6b9fcd to v0.0.0-20231121155337-90ade8b19d09.
- Update `k8s.io/client-go` from 0.28.3 to 0.29.0.
- Update `modernc.org/sqlite` from 1.24.0 to 1.28.0.

## v1.29.2 {date="2024-01-08"}

### Bug fixes

- Bigquery (`outputs.bigquery`): Ignore fields containing NaN or infinity.
- Filter (`processors.filter`): Rename processors.Filter -> processors.filter.
- InfluxDB (`outputs.influxdb`): Support setting Host header.
- InfluxDB v2 (`outputs.influxdb_v2`): Support setting Host header.
- Kafka (`common.kafka`): Correctly set gssapi username/password.
  - Add pid field to differentiate metrics.
  - Use logger without causing panic.
- PHP FPM (`inputs.phpfpm`):
- procstat (`inputs.procstat`): Correctly set tags on procstat_lookup.
- Prometheus Client (`outputs.prometheus_client`): Always default to TCP.
- Starlark (`processors.starlark`): Use tracking ID to identify tracking metrics.
- systemd (`systemd`): Allow notify access from all.
- UPSD (`inputs.upsd`): Add additional fields to upsd from NUT.
- Vsphere (`inputs.vsphere`): Resolve occasional serverFault.

### Dependency updates

- Update `collectd.org` from v0.5.0 to v0.6.0.
- Update `github.com/Azure/azure-kusto-go` from 0.13.1 to 0.15.0.
- Update `github.com/containerd/containerd` from 1.7.7 to 1.7.11.
- Update `github.com/djherbis/times` from 1.5.0 to 1.6.0.
- Update `github.com/dvsekhvalnov/jose2go` from v1.5.0 to v1.5.1-0.20231206184617-48ba0b76bc88.
- Update `github.com/google/uuid` from 1.4.0 to 1.5.0.
- Update `github.com/jhump/protoreflect` from 1.15.3 to 1.15.4.
- Update `github.com/pion/dtls/v2` from 2.2.7 to 2.2.8.
- Update `github.com/prometheus/prometheus` from 0.48.0 to 0.48.1.
- Update `github.com/sijms/go-ora/v2` from 2.7.18 to 2.8.4.
- Update `go.mongodb.org/mongo-driver` from 1.12.1 to 1.13.1.
- Update `golang.org/x/crypto` from 0.16.0 to 0.17.0.
- Update `golang.org/x/net` from 0.17.0 to 0.19.0.
- Update `google.golang.org/protobuf` from 1.31.1-0.20231027082548-f4a6c1f6e5c1 to 1.32.0.

## v1.29.1 {date="2023-12-13"}

### Bug fixes

- Clickhouse (`inputs.clickhouse`): Omit zookeeper metrics on clickhouse cloud.
- PHP FPM (`inputs.php-fpm`): Parse JSON output.
- procstat (`inputs.procstat`): Revert unintended renaming of systemd_unit option.

### Dependency updates

- Update `github.com/go-ldap/ldap/v3` from 3.4.5 to 3.4.6.
- Update `github.com/klauspost/compress` from 1.17.3 to 1.17.4.
- Update `github.com/openzipkin/zipkin-go` from 0.4.1 to 0.4.2.
- Update `github.com/tidwall/gjson` from 1.14.4 to 1.17.0.
- Update all `github.com/aws/aws-sdk-go-v2` dependencies.

## v1.29.0 {date="2023-12-11"}

### New Plugins

#### Inputs

- [LDAP](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ldap) (`inputs.inputs.ldap`)

#### Outputs

- [OpenSearch](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/opensearch) (`outputs.opensearch`)

#### Processors

- [Filter](https://github.com/influxdata/telegraf/tree/master/plugins/processors/filter) (`processors.filter`)

#### Secret Stores

- [systemd](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/systemd) (`secretstores.systemd`)

### Features

- Agent (`agent`): Allow separators for namepass and namedrop filters
- Final (`aggregators.final`): Specify output strategy
- HTTP (`common.http`): Add support for connecting over unix-socket
- OPCUA (`common.opcua`): Add option to include OPC-UA DataType as a field
- Config (`config`): Deprecate `fieldpass` and `fielddrop` modifiers
- Intel PMT (`input.intel_pmt`): Add `pci_bdf` tag to uniquely identify GPUs and other peripherals
- AMQP Consumer (`inputs.amqp_consumer`): Add secretstore support for username and password
- Docker (`inputs.docker`): Add disk usage
- DPDK (`inputs.dpdk`): Add options to customize error-behavior and metric layout
- Elasticsearch (`inputs.elasticsearch`): Use HTTPClientConfig struct
- Elasticsearch Query (`inputs.elasticsearch_query`): Use HTTPClientConfig struct
- GNMI (`inputs.gnmi`): Rework plugin
- HTTP Response (`inputs.http_response`): Add body form configuration option
- Intel PowerStat (`inputs.intel_powerstat`): Extract business logic to external library
- Kafka Consumer (`inputs.kafka_consumer`):
  - Add message headers as metric tags
  - Add option to set metric name from message header
- Kibana (`inputs.kibana`): Use HTTPClientConfig struct
- Kube Inventory (`inputs.kube_inventory`)
  - Support filtering pods and nodes by node name
  - Support using kubelet to get pods data
- LDAP (`inputs.ldap`): Collect additional fields
- Logstash (`inputs.logstash`): Use HTTPClientConfig struct
- Modbus (`inputs.modbus`): Add support for string fields
- NATS Consumer (`inputs.nats_consumer`): Add nkey-seed-file authentication
- OPCUA Listener (`inputs.opcua_listener`): Add monitoring params
- Open Weather Map(`inputs.openweathermap`): Add per-city query scheme for current weather
- procstat (`inputs.procstat`): Obtain process information through supervisor
- RabbitMQ (`inputs.rabbitmq`): Add secretstore support for username and password
- Redfish (`inputs.redfish`): Allow specifying which metrics to collect
- SNMP (`inputs.snmp`): Hint to use source tag
- Socket Listener (`inputs.socket_listener`): Add vsock support to socket listener and writer
- SQL (`inputs.sql`):
  - Add Oracle driver
  - Add IBM Netezza driver
- Windows Service (`inputs.win_service`): Reduce required rights to `GENERIC_READ`
- Migrations (`migrations`):
  - Add migration for `fieldpass` and `fielddrop`
  - Add migration for `inputs.jolokia`
  - Add migration for `inputs.kafka_consumer_legacy`
  - Add migration for `inputs.snmp_legacy`
  - Add migration for `inputs.tcp_listener`
  - Add migration for `inputs.udp_listener`
  - Add migration for `outputs.riemann_legacy`
  - Add option migration for `inputs.disk`
  - Add option migration for `inputs.mqtt_consumer`
  - Add option migration for `inputs.nats_consumer`
  - Add option migration for `outputs.influxdb`
- Azure Data Explorer (`outputs.azure_data_explorer`): Set user agent string
- BigQuery (`outputs.bigquery`):
  - Add metrics in one compact table
  - Make `project` no longer a required field
- Exec (`outputs.exec`): Execute command once per metric
- Prometheus Client (`outputs.prometheus_client`): Support listening on vsock
- Socket Writer (`outputs.socket_writer`): Add vsock support to socket listener and writer
- Stackdriver (`outputs.stackdriver`):
  - Add metric type config options
  - Enable histogram support
- Wavefront (`outputs.wavefront`): Use common/http to configure http client
- Avro (`parsers.avro`):
  - Allow connection to https schema registry
  - Get metric name from the message field
  - Support multiple modes for union handling
- Dedup (`processors.dedup`): Add state persistence between runs
- Regex (`processors.regex`): Allow batch transforms using named groups
- Secrets (`secrets`): Add unprotected secret implementation

### Bug Fixes

- OAuth (`common.oauth`): Initialize EndpointParams to avoid panic with audience settings
- HTTP (`inputs.http`): Use correct token variable
- Intel PowerStat (`inputs.intel_powerstat`): Fix unit tests to work on every CPU/platform
- Modbus (`inputs.modbus`): Split large request correctly at field borders
- Netflow (`inputs.netflow`): Handle malformed inputs gracefully
- s7comm (`inputs.s7comm`): Reconnect if query fails
- tail (`inputs.tail`): Retry opening file after permission denied
- BigQuery (`outputs.bigquery`): Correct use of auto-detected project ID
- OpenSearch (`outputs.opensearch`):
  - Expose TLS setting correctly
  - Migrate to new secrets API
- Prometheus Client (`outputs.prometheus_client`): Ensure v1 collector data expires promptly
- Avro (`parsers.avro`):
  - Clean up Warnf error wrapping error
  - Attempt to read CA cert file only if filename is not empty string
- JSON v2 (`parsers.json v2`):
  - Correct wrong name of config option
  - Reset state before parsing
- Starlark (`processors.starlark`):
  - Avoid negative refcounts for tracking metrics
  - Maintain tracking information post-apply

### Dependency updates

- Update `cloud.google.com/go/bigquery` from 1.56.0 to 1.57.1
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs` from 1.26.0 to 1.27.2
- Update `github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/monitor/armmonitor` from 0.10.1 to 0.10.2
- Update `github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/monitor/armmonitor` from 0.10.2 to 0.11.0
- Update `github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources from` 1.1.1 to 1.2.0
- Update `github.com/golang-jwt/jwt/v5` from 5.0.0 to 5.2.0
- Update `github.com/IBM/sarama` from 1.41.3 to 1.42.1
- Update `github.com/influxdata/tail` from 1.0.1-0.20210707231403-b283181d1fa7 to 1.0.1-0.20221130111531-19b97bffd978
- Update `github.com/jackc/pgconn from` 1.14.0 to 1.14.1
- Update `github.com/nats-io/nats-server/v2` from 2.9.23 to 2.10.6
- Update `github.com/prometheus/prometheus` from 0.46.0 to 0.48.0
- Update `github.com/vmware/govmomi` from 0.32.0 to 0.33.1
- Update `golang.org/x/text` from 0.13.0 to 0.14.0
- Update `k8s.io/api` from 0.28.3 to 0.28.4
- Point kafka dependency to IBM organization

## v1.28.5 {date="2023-11-15"}

### Bug Fixes

- ECS (`inputs.ecs`): Correct v4 metadata URLs.
- Intel RDT (`inputs.intel_rdt`): Do not fail on missing PIDs.
- JSON v2 (`parsers.json_v2`): Log inner errors.
- s7comm (`inputs.s7comm`): Truncate strings to reported length.

### Dependency updates

- Update `github.com/gosnmp/gosnmp` from 1.35.1-0.20230602062452-f30602b8dad6 to 1.36.1.
- Update `github.com/Masterminds/semver/v3` from 3.2.0 to 3.2.1.
- Update `golang.org/x/sync` from 0.4.0 to 0.5.0.
- Update `golang.org/x/mod` from 0.13.0 to 0.14.0.
- Update `google.golang.org/api` from 0.149.0 to 0.150.0.

## v1.28.4 {date="2023-11-13"}

### Bug Fixes

- cGroup (`inputs.cgroup`): Escape backslashes in path.
- Config (`config`): Fix comment removal in TOML files.
- Disk (`inputs.disk`): Add inodes_used_percent field.
- ECS (`inputs.ecs`):
  - Fix cgroupv2 CPU metrics.
  - Test for v4 metadata endpoint.
- Elasticsearch (`outputs.elasticsearch`): Print error status value.
- IP Set (`inputs.ipset`): Parse lines with timeout.
- JSON v2 (`parsers.json_v2`): Prevent race condition in parse function.
- Prometheus (`inputs.prometheus`): Read bearer token from file every time.
- MQTT Consumer (`inputs.mqtt_consumer`): Resolve could not mark message delivered.
- Netflow (`inputs.netflow`): Fix sFlow metric timestamp.
- s7comm (`inputs.s7comm`): Fix bit queries.
- Timestream (`outputs.timestream`): Clip uint64 values.
- Windows Performance Counters (`inputs.win_perf_counter`): Do not rely on returned buffer size.
- ZFS (`inputs.zfs`):
  - Parse metrics correctly on FreeBSD 14.
  - Support gathering metrics on zfs 2.2.0 and later.

### Dependency updates

- Update `cloud.google.com/go/storage` from 1.30.1 to 1.34.1.
- Update `github.com/aws/aws-sdk-go-v2/config` from 1.18.42 to 1.19.1.
- Update `github.com/aws/aws-sdk-go-v2/credentials` from 1.13.40 to 1.13.43.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs` from 1.23.5 to 1.26.0.
- Update `github.com/antchfx/xmlquery` from 1.3.17 to 1.3.18.
- Update `github.com/antchfx/xpath` from 1.2.5-0.20230505064641-588960cceeac to 1.2.5.
- Update `github.com/benbjohnson/clock` from 1.3.3 to 1.3.5.
- Update `github.com/compose-spec/compose-go` from 1.16.0 to 1.20.0.
- Update `github.com/docker/docker` from 24.0.6 to 24.0.7.
- Update `github.com/hashicorp/consul/api` from 1.24.0 to 1.25.1.
- Update `github.com/hashicorp/consul/api` from 1.25.1 to 1.26.1.
- Update `github.com/nats-io/nkeys` from 0.4.5 to 0.4.6.
- Update `github.com/prometheus/client_golang` from 1.16.0 to 1.17.0.
- Update `github.com/rabbitmq/amqp091-go` from 1.8.1 to 1.9.0.
- Update `github.com/showwin/speedtest-go` from 1.6.6 to 1.6.7.
- Update `google.golang.org/grpc` from 1.58.2 to 1.58.3.
- Update `k8s.io/client-go` from 0.28.2 to 0.28.3.

## v1.28.3 {date="2023-10-23"}

### Bug Fixes

- Infiniband (`inputs.infiniband`): Handle devices without counters.
- Jenkins (`inputs.jenkins`): Filter after searching sub-folders.
- Jolokia2 Agent (`inputs.jolokia2_agent`): Trim quotes around tags.
- JSON (`serializers.json`): Append newline for batch-serialization.
- Kafka (`outputs.kafka`): Simplify send-error handling.
- MQTT (`inputs.mqtt`): Reference correct password variable.
- Nebius Cloud Monitoring (`outputs.nebius_cloud_monitoring`): Use correct endpoint.
- PostgreSQL Extensible (`inputs.postgresql_extensible`): Restore default db name.
- Redis Time Series (`outputs.redistimeseries`): Handle string fields correctly.
- s7comm (`inputs.s7comm`): Allow PDU-size to be set as config option.
- Vault (`inputs.vault`): Use http client to handle redirects correctly.

### Dependency updates

- Update `github.com/apache/arrow/go/v13` from 13.0.0-git to 13.0.0.
- Update `github.com/google/cel-go` from 0.14.1-git to 0.18.1.
- Update `github.com/google/go-cmp` from 0.5.9 to 0.6.0.
- Update `github.com/jhump/protoreflect` from 1.15.1 to 1.15.3.
- Update `github.com/klauspost/compress` from 1.16.7 to 1.17.0.
- Update `github.com/miekg/dns` from 1.1.55 to 1.1.56.
- Update `github.com/nats-io/nats.go` from 1.28.0 to 1.31.0.
- Update `github.com/nats-io/nats-server/v2` from 2.9.9 to 2.9.23.
- Update `github.com/netsampler/goflow2` from 1.3.3 to 1.3.6.
- Update `github.com/signalfx/golib/v3` from 3.3.50 to 3.3.53.
- Update `github.com/testcontainers/testcontainers-go` from 0.22.0 to 0.25.0.
- Update `github.com/yuin/goldmark` from 1.5.4 to 1.5.6.
- Update `golang.org/x/mod` from 0.12.0 to 0.13.0.
- Update `golang.org/x/net` from 0.15.0 to 0.17.0.
- Update `golang.org/x/oauth2` from 0.11.0 to 0.13.0.
- Update `gonum.org/v1/gonum` from 0.13.0 to 0.14.0.
- Update `google.golang.org/api` from 0.139.0 to 0.147.0.

## v1.28.2 {date="2023-10-02"}

### Bug Fixes

- Cisco Telemetry MDT (`inputs.cisco_telemetry_mdt`): Print string message on decode failure.
- Cloudwatch (`outputs.cloudwatch`): Increase number of metrics per write.
- exec (`inputs.exec`): Clean up grandchildren processes.
- Intel PMT (`inputs.intel_pmt`): Handle telem devices without numa_node attribute.
- JTI OpenConfig Telemetry (`inputs.jti_openconfig_telemetry`): Do not block gRPC dial.
- JSON v2 (`parsers.json_v2`): Handle optional fields properly.
- Mock (`inputs.mock`): Align plugin with documentation.
- NFS Client (`inputs.nfsclient`): Avoid panics, better error messages.
- Nvidia SMI (`inputs.nvidia_smi`): Add legacy power readings to v12 schema.
- OpenStack (`inputs.openstack`): Handle dependencies between enabled services and available endpoints.
- PostgreSQL Extensible (`inputs.postgresql_extensible`): Restore outputaddress behavior.
- SMART (`inputs.smart`): Remove parsing error message.
- Stackdriver (`outputs.stackdriver`):
  - Do not shallow copy map.
  - Drop metrics on InvalidArgument gRPC error.
- systemd Units `inputs.systemd_units`): Add missing upstream states.
- Template (`processors.template`): Handle tracking metrics correctly.

### Dependency updates

- Update `github.com/aliyun/alibaba-cloud-sdk-go` from 1.62.470 to 1.62.563.
- Update `github.com/aws/aws-sdk-go-v2/config` from 1.18.27 to 1.18.42.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs` from 1.20.9 to 1.23.5.
- Update `github.com/aws/aws-sdk-go-v2/service/ec2` from 1.80.1 to 1.120.0.
- Update `github.com/aws/aws-sdk-go-v2/feature/ec2/imds` from 1.13.8 to 1.13.11.
- Update `github.com/eclipse/paho.mqtt.golang` from 1.4.2 to 1.4.3.
- Update `github.com/google/uuid` from 1.3.0 to 1.3.1.
- Update `github.com/shirou/gopsutil/v3` from 3.23.6 to 3.23.8.
- Update `github.com/vmware/govmomi` from 0.28.0 to 0.32.0.
- Update `golang.org/x/net` from 0.14.0 to 0.15.0.
- Update `k8s.io/api` from 0.28.1 to 0.28.2.

## v1.28.1 {date="2023-09-12"}

### Bug fixes

- Packaging: Revert permission change on package configs
- Redis (`inputs.redis`): Fix password typo
- Vsphere (`inputs.vsphere`): Fix config name typo in example

## v1.28.0 {date="2023-09-11"}

### Important Changes

- **metricpass**: Removed the Python compatibility support for "not", "and", and
  "or" keywords. This support was incorrectly removing these keywords from
  actual data. Users should instead use the standard "!", "&&", and "||"
  operators.
- **Avro Processor**: The avro processor will no longer create a timestamp field
  by default unless explicitly provided in the parser config.

### New Plugins

#### Inputs

- [Intel PMT](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/intel_pmt) (`inputs.intel_pmt`)
- [S7comm](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/s7comm) (`inputs.s7comm`)
- [Tacacs](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/tacacs) (`inputs.tacacs`)

#### Processors

- [Split metrics](https://github.com/influxdata/telegraf/tree/master/plugins/processors/split) (`processors.split`)

#### Secret Stores

- [OAuth2 services](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/oauth2) (`secretstores.oauth2`)

#### Serializers

- [Template based](https://github.com/influxdata/telegraf/tree/master/plugins/serializers/template) (`serializers.template`)

### Features

- Agent:
  - Add option to avoid filtering of global tags
  - Watch default config files if none specified
- CLI: Add plugins subcommand to list available and deprecated
- AMQP Consumer (`inputs.amqp_consumer`): Add support to rabbitmq stream queue
- Cisco Telemetry MDT (`inputs.cisco_telemetry_mdt`): Add microbust support
- Couchbase (`inputs.couchbase`): Add failover metrics
- Fail2Ban (`inputs.fail2ban`): Allow specification of socket
- Fibaro (`inputs.fibaro`): Support HC3 device types
- HTTP (`inputs.http`): Rework token options
- InfluxDB Listener (`inputs.influxdb_listener`): Add token based authentication
- Internal (`inputs.internal`): Add Go metric collection option
- Jenkins (`inputs.jenkins`): Add option for node labels as tag
- JTI OpenConfig Telemetry (`inputs.jti_openconfig_telemetry`): Add keep-alive setting
- Kernel (`inputs.kernel`): Collect KSM metrics
- Modbus (`inputs.modbus`): Add per-metric configuration style
- Nvidia SMI (`inputs.nvidia_smi`):
  - Add Nvidia DCGM MIG usage values
  - Add additional fields
  - Support newer data schema versions
- OpenStack (`inputs.openstack`): Gather cinder services
- OpenTelemetry (`inputs.opentelemetry`): Add configurable log record dimensions
- PGBouncer (`inputs.pgbouncer`): Add show_commands to select the collected pgbouncer metrics
- PostgreSQL Extensible (`inputs.postgresql_extensible`): Introduce max_version for query
- Procstat (`inputs.procstat`): Add status field
- Prometheus (`inputs.prometheus`): Always apply kubernetes label and field selectors
- RavenDB (`inputs.ravendb`): Add new disk metrics fields
- Redfish (`inputs.redfish`): Add additional chassis tags
- Redis (`inputs.redis`):
  - Add additional commandstat fields
  - Support of redis 6.2 ERRORSTATS
- Redis Sentinel (`inputs.redis_sentinel`): Allow username and password
- Solr (`inputs.solr`): Support version 7.x to 9.3
- SQL Server (`inputs.sqlserver`): Add IsHadrEnabled server property
- Vsphere (`inputs.vsphere`):
  - Allow to set vSAN sampling interval
  - Support explicit proxy setting
- Internal (`internal`):
  - Add gather_timeouts metric
  - Add zstd to internal content_coding
- Kafka (`kafka`): Set and send SASL extensions
- Migrations:
  - Add migration for inputs.httpjson
  - Add migration for inputs.io
- execd (`outputs.execd`): Add option for batch format
- File (`outputs.file`): Add compression
- HTTP (`outputs.http`): Allow PATCH method
- Postgresql (`outputs.postgresql`):
  - Add option to create time column with timezone
  - Add option to rename time column
- Prometheus Client (`outputs.prometheus_client`): Add secretstore support for basic_password
- Wavefront (`outputs.wavefront`): Add more auth options and update SDK
- Avro (`parsers.avro`): Add support for JSON format
- Influx (`parsers.influx`): Allow a user to set the timestamp precision
- Value (`parsers.value`): Add support for automatic fallback for numeric types
- XPath (`parsers.xpath`):
  - Add Concise Binary Object Representation parser
  - Add option to store fields as base64
- Parser (`processors.parser`) Allow also non-string fields
- Template (`processors.template`): Unify template metric

### Bug fixes

- Packaging: Change the systemd KillMode from control-group to mixed
- AMQP Consumer (`inputs.amqp_consumer`): Print error on connection failure
- Kafka Consumer (`inputs.kafka_consumer`): Use per-message parser to avoid races
- OPCUA (`inputs.opcua`): Verify groups or root nodes included in config
- PostgreSQL (`inputs.postgresql`): Fix default database definition
- Procstat (`inputs.procstat`): Collect swap via /proc/$pid/smaps
- SQL Server (`inputs.sqlserver`): Cast max_size to bigint
- Sysstat (`inputs.sysstat`): Remove tmpfile to avoid file-descriptor leak
- Avro (`parsers.avro`):
  - Do not force addition of timestamp as a field
  - Handle timestamp format checking correctly
- SQL (`sql`):
  - Allow sqlite on Windows (amd64 and arm64)
  - Move conversion_style config option to the right place of sample config

### Dependency updates

- Update `github.com/aws/aws-sdk-go-v2/service/kinesis` from 1.18.2 to 1.18.5.
- Update `github.com/hashicorp/consul/api` from 1.20.0 to 1.24.0.
- Update `github.com/nats-io/nats.go` from 1.27.0 to 1.28.0.
- Update `github.com/prometheus/prometheus` from 0.42.0 to 0.46.0.
- Update `github.com/showwin/speedtest-go` from 1.6.2 to 1.6.6.
- Update `k8s.io/api` from 0.27.4 to 0.28.1.

## v1.27.4 {date="2023-08-21"}

### Bug fixes

- Cisco Telemetry MDT (`inputs.cisco_telemetry_mdt`): Fix MDT source field overwrite.
- NowMetric (`serializers.nowmetric`): Add option for JSONv2 format.
- OPCUA (`inputs.opcua`): Register node IDs again on reconnect.
- OPCUA Listener (`inputs.opcua_listener`): Avoid segfault when subscription was not successful.
- Stackdriver (`outputs.stackdriver`): Regenerate time interval for unknown metrics.
- Xpath (`parsers.xpath`): Handle protobuf maps correctly.

### Dependency updates

- Update `cloud.google.com/go/pubsub` from 1.32.0 to 1.33.0.
- Update `github.com/aws/aws-sdk-go-v2/credentials` from 1.13.26 to 1.13.32.
- Update `github.com/aws/aws-sdk-go-v2/feature/ec2/imds` from 1.13.4 to 1.13.7.
- Update `github.com/aws/aws-sdk-go-v2/service/kinesis` from 1.17.14 to 1.18.0.
- Update `github.com/aws/aws-sdk-go-v2/service/kinesis` from 1.18.0 to 1.18.2.
- Update `github.com/aws/aws-sdk-go-v2/service/sts` from 1.19.3 to 1.21.2.
- Update `github.com/gophercloud/gophercloud` from 1.2.0 to 1.5.0.
- Update `github.com/microsoft/go-mssqldb` from 1.3.1-0.20230630170514-78ad89164253 to 1.5.0.
- Update `github.com/miekg/dns` from 1.1.51 to 1.1.55.
- Update `github.com/openconfig/gnmi` from 0.9.1 to 0.10.0.
- Update `github.com/santhosh-tekuri/jsonschema/v5` from 5.3.0 to 5.3.1.
- Update `go.mongodb.org/mongo-driver` from 1.11.6 to 1.12.1.
- Update `golang.org/x/oauth2` from 0.10.0 to 0.11.0.
- Update `google.golang.org/api` from 0.129.0 to 0.134.0.

## v1.27.3 {date="2023-07-31"}

### Bug fixes

- Agent (`agent`): Respect processor order in file.
- Config (`config`):
  - Handle escaping and quotation correctly.
  - Setup logger for secret-stores.
- Custom Builder (`tools.custom_builder`): Ignore non-plugin sections during configuration.
- Docker (`inputs.docker`): Add restart count.
- JTI OpenConfig Telemetry (`inputs.jti_openconfig_telemetry`): Reauthenticate connection on reconnect.
- MQTT Consumer (`inputs.mqtt_consumer`): Add client trace logs via option.
- Nebius Cloud Monitoring (`outputs.nebius_cloud_monitoring`): Replace reserved label names.
- OpenTelemetry (`outputs.opentelemetry`): Group metrics by age and timestamp.
- Prometheus (`inputs.prometheus`):
  - Do not collect metrics from finished pods.
  - Fix missing metrics when multiple plugin instances specified.
- Stackdriver (`outputs.stackdriver`): Add tag as resource label option.
- Xpath (`parsers.xpath`):
  - Ensure precedence of explicitly defined tags and fields.
  - Fix field-names for arrays of simple types.
  - Improve handling of complex-type nodes.

### Dependency updates

- Update `github.com/aliyun/alibaba-cloud-sdk-go` 1.62.389 to 1.62.470.
- Update `github.com/antchfx/jsonquery` from 1.3.1 to 1.3.2.
- Update `github.com/antchfx/xmlquery` from 1.3.15 to 1.3.17.
- Update `github.com/antchfx/xpath` from v1.2.4 to latest master.
- Update `github.com/aws/aws-sdk-go-v2/service/dynamodb` from 1.17.3 to 1.20.0.
- Update `github.com/aws/aws-sdk-go-v2/service/sts` from 1.19.2 to 1.19.3.
- Update `github.com/eclipse/paho.golang` from 0.10.0 to 0.11.0.
- Update `github.com/go-ldap/ldap/v3` from 3.4.4 to 3.4.5.
- Update `github.com/jaegertracing/jaeger` from 1.38.0 to 1.47.0.
- Update `github.com/opensearch-project/opensearch-go/v2` from 2.2.0 to 2.3.0.
- Update `github.com/prometheus-community/pro-bing` from 0.2.0 to 0.3.0.
- Update `github.com/shirou/gopsutil/v3` from 3.23.5 to 3.23.6.
- Update `github.com/thomasklein94/packer-plugin-libvirt` from 0.3.4 to 0.5.0.
- Update `k8s.io/api` from 0.27.2 to 0.27.4.
- Update `k8s.io/apimachinery` from 0.27.2 to 0.27.3.
- Update `modernc.org/sqlite` from 1.23.1 to 1.24.0.

## v1.27.2 {date="2023-07-10"}

### Bug fixes

- Binary (`parsers.binary`): Fix binary parser example in README.md.
- Config (`config`): Replace environment variables if existing but empty.
- Cloud PubSub (`inputs.cloud_pubsub`): Properly lock for decompression.
- Custom Builder (`tools.custom_builder`): Error out for unknown plugins in configuration.
- GNMI (`inputs.gnmi`): Add option to explicitly trim field-names.
- Graphite (`outputs.graphite`): Rework connection handling.
- Grok (`parsers.grok`): Use UTC as the default timezone.
- InfluxDB v2 (`outputs.influxdb_v2`): Expose HTTP/2 client timeouts.
- Internet Speed (`inputs.internet_speed`): Add location as a field.
- Modbus (`inputs.modbus`):
  - Check number of register for datatype.
  - Fix optimization of overlapping requests and add warning.
- MQTT Consumer (`inputs.mqtt_consumer`):
  - Correctly handle semaphores on messages.
  - Print warning on no metrics generated.
- OPC UA (`inputs.opcua`): Ensure connection after reconnect.
- PHP FPM (`inputs.phpfpm`): Check address length to avoid crash.
- Printer (`processors.printer`): Convert output to string.
- SNMP Trap (`inputs.snmp_trap`): Copy GoSNMP global defaults to prevent side-effects.
- Secretstores (`secretstores`): Skip dbus connection with kwallet.
- Splunk Metric (`serializers.splunkmetric`): Fix TOML option name for multi-metric.
- Stackdriver (`outputs.stackdriver`): Options to use official path and types.
- Sumologic (`outputs.sumologic`): Unwrap serializer for type check.
- Vsphere (`inputs.vpshere`): Compare versions as a string.
- Xpath (`parsers.xpath`): Handle explicitly defined fields correctly.

### Dependency updates

- Replace `github.com/denisenkom/go-mssqldb` with `github.com/microsoft/go-mssqldb`.
- Update `cloud.google.com/go/bigquery` from 1.51.1 to 1.52.0.
- Update `github.com/aliyun/alibaba-cloud-sdk-go` from 1.62.337 to 1.62.389.
- Update `github.com/aws/aws-sdk-go-v2/config` from 1.18.8 to 1.18.27.
- Update `github.com/aws/aws-sdk-go-v2/service/kinesis` from 1.17.8 to 1.17.14.
- Update `github.com/gopcua/opcua` from 0.3.7 to 0.4.0.
- Update `github.com/prometheus/client_golang` from 1.15.1 to 1.16.0.
- Update `github.com/snowflakedb/gosnowflake` from 1.6.13 to 1.6.22.
- Update `github.com/urfave/cli/v2` from 2.25.5 to 2.25.7.
- Update `golang.org/x/text` from 0.9.0 to 0.10.0.
- Update `golang.org/x/text` from 0.10.0 to 0.11.0.
- Update `google.golang.org/api` from 0.126.0 to 0.129.0.

## v1.27.1 {date="2023-06-21"}

### Bug fixes

- Correctly handle serializers and parsers with custom builder.
- Handle compression level correctly for different algorithms.
- Restore old environment var behavior with option.

### Dependency updates

- Update `github.com/aws/aws-sdk-go-v2/credentials` from 1.13.20 to 1.13.26.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatch` from 1.25.9 to 1.26.2.
- Update `github.com/aws/aws-sdk-go-v2/service/timestreamwrite` from 1.16.0 to 1.17.2.
- Update `github.com/go-sql-driver/mysql` from 1.6.0 to 1.7.1.
- Update `github.com/jackc/pgx/v4` from 4.17.1 to 4.18.1.
- Update `github.com/nats-io/nats.go` from 1.24.0 to 1.27.0.
- Update `github.com/prometheus-community/pro-bing` from 0.1.0 to 0.2.0.
- Update `golang.org/x/crypto` from 0.8.0 to 0.9.0.
- Update `golang.org/x/term` from 0.8.0 to 0.9.0.
- Update `modernc.org/sqlite` from 1.21.0 to 1.23.1.

## v1.27.0 {date="2023-06-12"}

### Important Changes

- **Timezone Parsing**: Fix parsing of timezone abbreviations such as `MST`. Up
  to now, when parsing times with abbreviated timezones (i.e. the format ) the
  timezone information is ignored completely and the _timestamp_ is located in
  UTC. This is a golang issue (see
  [#9617](https://github.com/golang/go/issues/9617) or
  [#56528](https://github.com/golang/go/issues/56528)). If you worked around
  that issue, please remove the workaround before using v1.27+. In case you
  experience issues with abbreviated timezones please file an issue.
- **Internal Parser methods**: Removal of old-style parser creation. This
  should not directly affect users as it is an API change. All parsers in
  Telegraf are already ported to the new framework. If you experience any
  issues with not being able to create parsers let us know!

### New Plugins

#### Inputs

- [ctrlX Data Layer](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ctrlx_datalayer) (`inputs.ctrlx_datalayer`)
- [Intel Baseband Accelerator](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/intel_baseband) (`inputs.intel_baseband`)

#### Outputs

- [Clarify](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/clarify) (`outputs.clarify`)
- [Nebius Cloud Monitoring](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/nebius_cloud_monitoring) (`outputs.nebius_cloud_monitoring`)

#### Processors

- [Scale](https://github.com/influxdata/telegraf/tree/master/plugins/processors/scale) (`processors.scale`)

#### Secret Stores

- [Docker](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/docker) (`secretstores.docker`)
- [HTTP](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/http) (`secretstores.http`)

#### Serializers

- [Cloud Events](https://github.com/influxdata/telegraf/tree/master/plugins/serializers/cloudevents) (`serializers.cloudevents`)

### Features

- Agent (`agent`):
  - Add option to avoid filtering of explicit plugin tags
  - Add common expression language metric filtering
- BasicStats (`aggregators.basicstats`): Add percentage change
- Cloud PubSub (`cloud_pubsub`): Add support for gzip compression
- OPCUA (`common.opcua`): Add support for secret-store secrets
- TLS (`common.tls`): Add support for passphrase-protected private key
- Config (`config`):
  - Add framework for migrating deprecated plugins
  - Support shell like syntax for environment variable substitution
- Cloudwatch (`inputs.cloudwatch`): Add support for cross account observability
- Directory Monitor (`inputs.directory_monitor`): Improve internal stats
- Filecount (`inputs.filecount`): Add oldestFileTimestamp and newestFileTimestamp
- GNMI (`inputs.gnmi`):
  - Allow canonical field names
  - Support Juniper GNMI Extension Header
- Internet Speed (`inputs.internet_speed`): Support multi-server test
- Kafka Consumer (`inputs.kafka_consumer`): Add regular expression support for topics
- Kubernetes (`inputs.kubernetes`): Extend kube_inventory plugin to include and extend resource quota, secret, node, and pod measurement
- Nats Consumer (`inputs.nats_consumer`): Add receiver subject as tag
- Netflow (`inputs.netflow`):
  - Add sFlow decoder
  - Allow custom PEN field mappings
- Nvidia SMI (`inputs.nvidia_smi`): Add additional memory related fields
- Open Telemetry (`inputs.opentelemetry`): Add configurable span dimensions
- Prometheus (`inputs.prometheus`): Control which pod metadata is added as tags
- SQL (`inputs.sql`):
  - Add disconnected_servers_behavior field in the configuration
  - Add FlightSQL support
- SQL Server (`inputs.sqlserver`):
  - Add Azure Arc-enabled SQL MI support
  - Check SQL Server encryptionEnforce with xp_instance_regread
- StatsD (`inputs.statsd`): Add optional temporality and start_time tag for statsd metrics
- Suricata (`inputs.suricata`): Add ability to parse drop or rejected
- Vsphere (`inputs.vsphere`): Add vSAN extension
- Internal (`internal`): Add additional faster compression options
- Loki (`outputs.loki`): Add option for metric name label
- Wavefront (`outputs.wavefront`): Add TLS and HTTP Timeout configuration fields
- OpenTSDB (`parsers.opentsdb`): Add OpenTSDB data format parser
- AWS EC2 (`processors.aws_ec2`): Add caching of imds and ec2 tags
- Parser (`processors.parser`): Add merge with timestamp option
- Scale (`processors.scale`): Add scaling by factor and offset
- Template (`processors.template`): Allow tag to be a template
- Prometheus Remote (`serializer.prometheusremote`): Improve performance
- Test (`test`): Allow to capture all messages during test

### Bug fixes

- Cloud PubSub (`inputs.cloud_pubsub`): Fix gzip decompression.
- GNMI (`inputs.gnmi`):
  - Allow optional origin for update path.
  - Handle canonical field-name correctly for non-explicit subscriptions.
- MQTT (`inputs.mqtt`): ACK messages when persistence is enabled.
- MySQL (`inputs.mysql`): Update MariaDB Dialect regex version check.
- Netflow (`inputs.netflow`):
  - Fix field mappings.
  - Handle PEN messages correctly.
- Prometheus (`inputs.prometheus`): Avoid race when creating informer factory.
- Socket Listener (`inputs.socket_listener`): Avoid noisy logs on closed connection.
- Temp (`inputs.temp`): Ignore warnings and instead return only errors.
- UPSD (`inputs.upsd`): Handle float battery.runtime value.
- Internal (`internal`): Fix time parsing for abbreviated timezones.
- SQL (`outputs.sql`): Use config.duration to correctly to parse toml config.
- Wavefront (`outputs.wavefront`): Flush metric buffer before reaching overflow.
- Lookup (`processors.lookup`): Do not strip tracking info.
- Influx (`serializers.influx`): Restore disabled uint support by default.

### Dependency updates

- Update cloud.google.com/go/monitoring from 1.13.0 to 1.14.0.
- Update github.com/aliyun/alibaba-cloud-sdk-go from 1.62.193 to 1.62.337.
- Update github.com/aws/aws-sdk-go-v2/feature/ec2/imds from 1.13.2 to 1.13.3.
- Update github.com/aws/aws-sdk-go-v2/service/sts from 1.18.9 to 1.19.0.
- Update github.com/Azure/azure-event-hubs-go/v3 from 3.4.0 to 3.5.0.
- Update github.com/Azure/go-autorest/autorest from 0.11.28 to 0.11.29.
- Update github.com/influxdata/influxdb-observability libraries from 0.3.3 to 0.3.15.
- Update github.com/jackc/pgconn from 1.13.0 to 1.14.0.
- Update github.com/jackc/pgtype from 1.12.0 to 1.14.0.
- Update github.com/Mellanox/rdmamap to 1.1.0.
- Update github.com/pion/dtls/v2 from 2.2.6 to 2.2.7.
- Update github.com/prometheus/common from 0.43.0 to 0.44.0.
- Update github.com/rabbitmq/amqp091-go from 1.8.0 to 1.8.1.
- Update github.com/shirou/gopsutil from 3.23.4 to 3.23.5.
- Update github.com/showwin/speedtest-go from 1.5.2 to 1.6.2.
- Update github.com/urfave/cli/v2 from 2.23.5 to 2.25.5.
- Update k8s.io/client-go from 0.26.2 to 0.27.2.

## v1.26.3 {date="2023-05-22"}

### Bug fixes

- GNMI (`inputs.gnmi`): Create selfstat to track connection state.
- Graphite (`outputs.graphite`): Fix logic to reconnect with servers that were not up on agent startup.
- Intel PMU (`inputs.intel_pmu`): Fix handling of the json perfmon format.
- Prometheus Client (`outputs.prometheus_client`): Fix export_timestamp for v1 metric type.
- Socket Listener (`inputs.socket_listener`):
  - Fix loss of connection tracking.
  - Fix race in tests.
- Stackdriver (`outputs.stackdriver`):
  - Allow for custom metric type prefix.
  - Group batches by timestamp.
- Starlark (`processors.starlark`): Do not reject tracking metrics twice.
- Vsphere (`inputs.vsphere`): Specify the correct option for disconnected_servers_behavior.
- Warp10 (`outputs.warp10`): Support Infinity/-Infinity/NaN values.

### Dependency updates

- Update `cloud.google.com/go/pubsub` from 1.30.0 to 1.30.1.
- Update `github.com/aerospike/aerospike-client-go/v5` from 5.10.0 to 5.11.0.
- Update `github.com/antchfx/xpath` to latest master for string-join().
- Update `github.com/aws/aws-sdk-go-v2` from 1.17.8 to 1.18.0.
- Update `github.com/Azure/go-autorest/autorest/adal` from 0.9.22 to 0.9.23.
- Update `github.com/benbjohnson/clock` from 1.3.0 to 1.3.3.
- Update `github.com/docker/distribution` from 2.8.1 to 2.8.2.
- Update `github.com/fatih/color` from 1.13.0 to 1.15.0.
- Update `github.com/netsampler/goflow2` from 1.1.1 to 1.3.3.
- Update `github.com/yuin/goldmark` from 1.5.3 to 1.5.4.
- Update `go.opentelemetry.io/collector/pdata` from 1.0.0-rc7 to 1.0.0-rcv0011.
- Update `golang.org/x/net` from 0.8.0 to 0.9.0.
- Update `golang.org/x/net` from 0.9.0 to 0.10.0.
- Update `golang.org/x/oauth2` from 0.5.0 to 0.7.0.
- Update `google.golang.org/api` from 0.106.0 to 0.120.0.
- Update `govulncheck-action` from 0.10.0 to 0.10.1.
- Update `prometheus` from v1.8.2 to v2.42.0.
- Update `signalfx/golib` from 3.3.46 to 3.3.50.

## v1.26.2 {date="2023-04-24"}

### Bug fixes

- Agent (`agent`): Pass quiet flag earlier.
- Grok (`parsers.grok`): Fix nil metric for multiline inputs.
- Lookup (`processors.lookup`): Fix tracking metrics.
- Prometheus (`inputs.prometheus`): Add namespace option in k8s informer factory.
- Socket Listener (`inputs.socket_listener`): Fix tracking of unix sockets.

### Dependency updates

- Update `github.com/aws/aws-sdk-go-v2/credentials` from 1.13.15 to 1.13.20.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatch` from 1.21.6 to 1.25.9.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs` from 1.15.13 to 1.20.9.
- Update `github.com/aws/aws-sdk-go-v2/service/kinesis` from 1.15.19 to 1.17.8.
- Update `github.com/aws/aws-sdk-go-v2/service/sts` from 1.18.5 to 1.18.9.
- Update `github.com/docker/docker` from 23.0.0 to 23.0.4.
- Update `github.com/openconfig/gnmi` from 0.0.0-20220920173703-480bf53a74d2 to 0.9.1.
- Update `github.com/prometheus/common` from 0.41.0 to 0.42.0.
- Update `github.com/safchain/ethtool` from 0.2.0 to 0.3.0.
- Update `github.com/tinylib/msgp` from 1.1.6 to 1.1.8.
- Update `github.com/vishvananda/netns` from 0.0.2 to 0.0.4.
- Update `github.com/wavefronthq/wavefront-sdk-go` from 0.11.0 to 0.12.0.

## v1.26.1 {date="2023-04-03"}

### Bug fixes

- Config (`config`): Return error on order set as string.
- ethtool (`inputs.ethtool`): Check for nil.
- execd (`inputs.execd`): Add option to set buffer size.
- Graphite (`outputs.graphite`): Add custom regex to outputs.
- Graphite (`serializers.graphite`): Allow for specifying regex to sanitize.
- Internet Speed (`inputs.internet_speed`): Rename host tag to source.
- Kubernetes (`inputs.kubernetes`): Apply timeout for the whole HTTP request.
- Netflow (`inputs.netflow`): Use correct name in the build tag.
- Procstat (`inputs.procstat`): Return tags of pids if lookup_error.
- Prometheus (`inputs.prometheus`):
  - Correctly set timeout param.
  - Use set over add for custom headers.
- Secret Stores (`secrets`):
  - Add function to set a secret.
  - Minimize secret holding time.
  - Warn if OS limit for locked memory is too low.
  - Handle array of secrets correctly.
- systemd (`systemd`): Increase lock memory for service to 8192kb.
- UPSD (`inputs.upsd`): Include ups.real_power.

### Dependency updates

- Update `github.com/antchfx/xpath` from 1.2.3 to 1.2.4.
- Update `github.com/apache/thrift` from 0.16.0 to 0.18.1.
- Update `github.com/Azure/azure-event-hubs-go/v3` from 3.3.20 to 3.4.0.
- Update `github.com/Azure/go-autorest/autorest/azure/auth` from 0.5.11 to 0.5.12.
- Update `github.com/golang-jwt/jwt/v4` from 4.4.2 to 4.5.0.
- Update `github.com/jhump/protoreflect` from 1.8.3-0.20210616212123-6cc1efa697ca to 1.15.1.
- Update `github.com/nats-io/nats.go` from 1.19.0 to 1.24.0.
- Update `github.com/opencontainers/runc` from 1.1.4 to 1.1.5.
- Update `github.com/pion/dtls/v2` from 2.2.4 to 2.2.6.
- Update `github.com/rabbitmq/amqp091-go` from 1.7.0 to 1.8.0.
- Update `github.com/shirou/gopsutil` from 3.23.2 to 3.23.3.
- Update `github.com/Shopify/sarama` from 1.37.2 to 1.38.1.
- Update `github.com/sensu/sensu-go/api/core/v2` from 2.15.0 to 2.16.0.
- Update `github.com/tidwall/gjson` from 1.14.3 to 1.14.4.
- Update `golang.org/x/net` from 0.7.0 to 0.8.0.
- Update `modernc.org/sqlite` from 1.19.2 to 1.21.0.

## v1.26.0 {date="2023-03-13"}

### Important Changes

- **Static builds**: Linux builds are now statically built. Other operating systems
  were cross-built in the past and as a result, already static. Users should
  not notice any change in behavior. The `_static` specific Linux binary is no
  longer produced as a result.
- **telegraf.d behavior**: The default behavior of reading
  `/etc/telegraf/telegraf.conf` now includes any `.conf` files under
  `/etc/telegraf/telegraf.d/`. This change will apply to the official Telegraf
  Docker image as well. This will simplify Docker usage when using multiple
  configuration files.
- **Default configuration**: The `telegraf config` command and default config file
  provided by Telegraf now includes all plugins and produces the same output
  across all operating systems. Plugin comments specify what platforms are
  supported or not.
- **State persistence**: State persistence is now available in select plugins. This
  will allow plugins to start collecting data, where they left off. A
  configuration with state persistence cannot change or it will not be able to
  recover.

### New Plugins

#### Inputs

- [Opensearch Query](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/opensearch_query) (`inputs.opensearch_query`)
- [P4Runtime](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/p4runtime) (`inputs.p4runtime`)
- [Radius Auth Response Time](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/radius) (`inputs.radius`)
- [Windows Management Instrumentation (WMI)](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/win_wmi) (`inputs.win_wmi`)

#### Parsers

- [Apache Avro](https://github.com/influxdata/telegraf/tree/master/plugins/parsers/avro) (`parsers.avro`)

#### Processors

- [lookup](https://github.com/influxdata/telegraf/tree/master/plugins/processors/lookup) (`processors.lookup`)

### Features

- Always disable cgo support (static builds).
- Plugin state-persistence.
- Add `/etc/telegraf/telegraf.d` to default configuration file locations.
- Print loaded configurations.
- Accept durations given in days (e.g. 7d).
- OAuth (`common.oauth`): Add `audience` parameter.
- TLS (`common.tls`): Add `enable` flag.
- CGroups (`inputs.cgroup`): Add support for `cpu.stat`.
- Cisco Telemetry MDT (`inputs.cisco_telemetry_mdt`): Include `delete` field.
- Disk (`inputs.disk`): Add label as tag.
- DNS Query (`inputs.dns_query`): Add IP fields.
- Docker Log (`inputs.docker_log`): Add state-persistence capabilities.
- Ethtool (`inputs.ethtool`): Add support for link speed, duplex, etc.
- GNMI (`inputs.gnmi`): Set max gRPC message size.
- HA Proxy (`inputs.haproxy`): Add support for TCP endpoints in haproxy plugin.
- HTTP Listener v2 (`inputs.http_listener_v2`): Add custom server HTTP headers.
- Icinga2 (`inputs.icinga2`): Support collecting hosts, services, and endpoint metrics.
- InfluxDB (`inputs.influxdb`): Collect uptime statistics.
- Intel PowerStat (`inputs.intel_powerstat`): Add CPU base frequency metric and add support for new platforms.
- Internet Speed (`inputs.internet_speed`):
  - Add the best server selection via latency and jitter field.
  - Server ID include and exclude filter.
- JTI OpenConfig Telemtry (`inputs.jti_openconfig_telemetry`): Set timestamp from data.
- Modbus (`inputs.modbus`):
  - Add RS485 specific config options.
  - Add workaround to enforce reads from zero for coil registers.
  - Allow to convert coil and discrete registers to boolean.
- MySQL (`inputs.mysql`): Add secret-store support.
- Open Weather Map (`inputs.openweathermap`): Add `snow` parameter.
- Processes (`inputs.processes`): Add use_sudo option for BSD.
- Prometheus (`inputs.prometheus`): Use namespace annotations to filter pods to be scraped.
- Redfish (`inputs.redfish`): Add power control metric.
- SQL Server (`inputs.sqlserver`): Get database pages performance counter.
- Stackdriver (`inputs.stackdriver`): Allow filtering by resource metadata labels.
- Statsd (`inputs.statsd`): Add pending messages stat and allow to configure number of threads.
- Vsphere (`inputs.vsphere`): Flag for more lenient behavior when connect fails on startup.
- Windows Event Log (`inputs.win_eventlog`): Add state-persistence capabilities.
- Windows Performance Counters (`inputs.win_perf_counters`): Add remote system support.
- Wireguard (`inputs.wireguard`): Add allowed_peer_cidr field.
- x509 Certificates (`inputs.x509_cert`):
  - Add OCSP stapling information for leaf certificates.
  - Add tag for certificate type-classification.
- MQTT (`outputs.mqtt`):
  - Add option to specify topic layouts.
  - Add support for MQTT 5 publish properties.
  - Enhance routing capabilities.
- XPath Parser (`parsers.xpath`): Add timezone handling.
- Converter Processor (`processors.converter`): Convert tag or field as metric timestamp.
- Unpivot Processor (`processors.unpivot`): Add mode to create new metrics.
- Secret Stores:
  - Add command-line option to specify password.
  - Add support for additional input plugins.
  - Convert many output plugins.

### Bug fixes

- Allow graceful shutdown on interrupt (e.g. Ctrl-C).
- Only rotate log on SIGHUP if needed.
- AMQP Consumer (`inputs.amqp_consumer`):
  - Avoid deprecations when handling defaults.
  - Fix panic on Stop() if not connected successfully.
- ethtool (`inputs.ethtool`): Close namespace file to prevent crash.
- statsd (`inputs.statsd`): On close, verify listener is not nil.

### Dependency updates

- Update cloud.google.com/go/storage from 1.28.1 to 1.29.0.
- Update github.com/Azure/go-autorest/autorest/adal from 0.9.21 to 0.9.22.
- Update github.com/aliyun/alibaba-cloud-sdk-go from 1.62.77 to 1.62.193.
- Update github.com/aws/aws-sdk-go-v2/credentials from 1.13.2 to 1.13.15.
- Update github.com/aws/aws-sdk-go-v2/service/timestreamwrite from 1.14.5 to 1.16.0.
- Update github.com/coocood/freecache from 1.2.2 to 1.2.3.
- Update github.com/karrick/godirwalk from v1.17.0 to v1.16.2.
- Update github.com/opencontainers/runc from 1.1.3 to 1.1.4.
- Update github.com/opensearch-project/opensearch-go/v2 from 2.1.0 to 2.2.0.
- Update github.com/openzipkin-contrib/zipkin-go-opentracing from 0.4.5 to 0.5.0.
- Update github.com/rabbitmq/amqp091-go from 1.5.0 to 1.7.0.
- Update github.com/shirou/gopsutil from v3.22.12 to v3.23.2.
- Update github.com/stretchr/testify from 1.8.1 to 1.8.2.
- Update OpenTelemetry from 0.3.1 to 0.3.3.

## v1.25.3 {date="2023-02-27"}

### Bug fixes

- Fix reload config on config update/SIGHUP.
- Bond (`inputs.bond`): Reset slave stats for each interface.
- Cloudwatch (`inputs.cloudwatch`): Verify endpoint is not nil.
- LVM (`inputs.lvm`): Add options to specify path to binaries.
- XPath (`parsers.xpath`): Fix panic for JSON name expansion.
- JSON (`serializers.json`): Fix stateful transformations.

### Dependency updates

- Update cloud.google.com/go/pubsub from 1.27.1 to 1.28.0.
- Update github.com/containerd/containerd from 1.6.8 to 1.6.18.
- Update github.com/go-logfmt/logfmt from 0.5.1 to 0.6.0.
- Update github.com/gofrs/uuid from 4.3.1 to 5.0.0.
- Update github.com/gophercloud/gophercloud from 1.0.0 to 1.2.0.
- Update github.com/pion/dtls/v2 from 2.1.5 to 2.2.4.
- Update golang.org/x/net from 0.5.0 to 0.7.0.
- Update golang.org/x/sys from 0.4.0 to 0.5.0.
- Update google.golang.org/grpc from 1.52.3 to 1.53.0.
- Update k8s.io/apimachinery from 0.25.3 to 0.25.6.
- Update testcontainers from 0.14.0 to 0.18.0.

## v1.25.2 {date="2023-02-13"}

### Bug fixes
- Only read the config once.
- fix link to license for Google flatbuffers.
- Cisco Telemetry MDT (`inputs.cisco_telemetry_mdt`): Check subfield sizes to avoid panics.
- Cloudwatch (`inputs.cloudwatch`): Enable custom endpoint support.
- Conntrack (`inputs.conntrack`): Resolve segfault when setting collect field.
- GNMI (`inputs.gnmi`): Handle both new-style tag_subscription and old-style tag_only.
- MongoDB (`inputs.mongodb`):
  - Improve error logging.
  - SIGSEGV when restarting MongoDB node.
- MySQL (`inputs.mysql`): Avoid side-effects for TLS between plugin instances.
- Prometheus (`inputs.prometheus`): Deprecate and rename the timeout variable.
- Tail (`inputs.tail`): Fix typo in the README.
- UPSD (`inputs.upsd`): Add additional fields.
- x509 Cert (`inputs.x509_cert`): Fix Windows path handling.
- Prometheus Client (`outputs.prometheus_client`): Expire with ticker, not add/collect.
- Secret Stores: Check store id format and presence.

### Dependency updates
- Update cloud.google.com/go/bigquery from 1.44.0 to 1.45.0.
- Update github.com/99designs/keyring from 1.2.1 to 1.2.2.
- Update github.com/antchfx/xmlquery from 1.3.12 to 1.3.15.
- Update github.com/antchfx/xpath from 1.2.2 to 1.2.3.
- Update github.com/coreos/go-semver from 0.3.0 to 0.3.1.
- Update github.com/moby/ipvs from 1.0.2 to 1.1.0.
- Update github.com/multiplay/go-ts3 from 1.0.1 to 1.1.0.
- Update github.com/prometheus/client_golang from 1.13.1 to 1.14.0.
- Update github.com/shirou/gopsutil from 3.22.9 to 3.22.12.
- Update go.mongodb.org/mongo-driver from 1.11.0 to 1.11.1.
- Update golang/x dependencies.
- Update google.golang.org/grpc from 1.51.0 to 1.52.0.
- Update google.golang.org/grpc from 1.52.0 to 1.52.3.

## v1.25.1 {date="2023-01-30"}

### Bug fixes
- Catch non-existing commands and error out.
- Correctly reload configuration files.
- Handle float time with fractions of seconds correctly.
- Only set default snmp after reading all configs.
- Allow any 2xx status code.
- Kafka: Add keep-alive period setting for input and output.
- Cisco Telemetry MDT (`inputs.cisco_telemetry_mdt`): Add operation-metric and class-policy prefix.
- Exec (`inputs.exec`): Restore pre-v1.21 behavior for CSV data_format.
- GNMI (`inputs.gnmi`): Update configuration documentation.
- Logstash (`inputs.logstash`): Collect opensearch specific stats.
- MySQL (`inputs.mysql`): Revert slice declarations with non-zero initial length.
- OPC UA (`inputs.opcua`): Fix opcua and opcua-listener for servers using password-based auth.
- Prometheus (`inputs.prometheus`):
  - Correctly track deleted pods.
  - Set the timeout for slow running API endpoints correctly.
- SQL Server (`inputs.sqlserver`):
  - Add more precise version check.
  - Added own SPID filter.
  - SqlRequests include sleeping sessions with open transactions.
  - Suppress error on secondary replicas.
- UPSD (`inputs.upsd`):
  - Always convert to float.
  - Ensure firmware is always a string.
- Windows Event Log (`inputs.win_eventlog`): Handle remote events more robustly.
- x509 Cert (`inputs.x509_cert`): Fix off-by-one when adding intermediate certificates.
- Loki (`outputs.loki`): Return response body on error.
- JSON v2 parser (`parsers.json_v2`): In case of invalid json, log message to debug log.
- Secret Stores:
  - Cleanup duplicate printing.
  - Fix handling of "id" and print failing secret-store.
  - Fix handling of TOML strings.

### Dependency updates
- Update cloud.google.com/go/storage from 1.23.0 to 1.28.1.
- Update github.com/antchfx/jsonquery from 1.3.0 to 1.3.1.
- Update github.com/aws/aws-sdk-go-v2 from 1.17.1 to 1.17.3.
- Update github.com/aws/aws-sdk-go-v2/service/ec2 from 1.54.4 to 1.80.1.
- Update github.com/denisenkom/go-mssqldb from 0.12.0 to 0.12.3.
- Update github.com/eclipse/paho.mqtt.golang from 1.4.1 to 1.4.2.
- Update github.com/hashicorp/consul/api from 1.15.2 to 1.18.0.
- Update github.com/karrick/godirwalk from 1.16.1 to 1.17.0.
- Update github.com/kardianos/service from 1.2.1 to 1.2.2.
- Update github.com/nats-io/nats-server/v2 from 2.9.4 to 2.9.9.

## v1.25.0 {date="2022-12-12"}

### New Plugins

#### Inputs

- [Azure Monitor](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/azure_monitor) (`inputs.azure_monitor`)
- [Google Cloud Storage](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/google_cloud_storage) (`inputs.google_cloud_storage`)
- [Intel Dynamic Load Balancer (Intel DLB)](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/intel_dlb) (`inputs.intel_dlb`)
- [libvirt](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/libvirt) (`inputs.libvirt`)
- [Netflow](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/netflow) (`inputs.netflow`)
- [OPC UA Client Listener](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/opcua_listener) (`inputs.opcua_listener`)

#### Parsers
- [Binary](https://github.com/influxdata/telegraf/tree/master/plugins/parsers/binary) (`parsers.binary`)

### Features
- Add arm64 Windows builds to nightly and CI.
- Add method to inform of deprecated plugin option values.
- Add Secret-store implementation.
- Deprecate active usage of netsnmp translator.

#### Plugin updates
- Kafka (`common.kafka`): Add exponential backoff when connecting or
  reconnecting and allow plugin to start without making initial connection.
- AMQP Consumer (`inputs.amqp_consumer`): Determine content encoding automatically.
- APCUPSD (`inputs.apcupsd`): Add new fields:
  - status
  - cumulative_time_on_battery_ns
  - last_transfer
  - number_transfers
- CGroup (`inputs.cgroups`):
  - Do not abort on first error.
  - Print message once.
- Conntrack (`inputs.conntrack`): Parse conntrack stats.
- DiskIO (`inputs.diskio`): Allow selecting devices by ID.
- Ethtool (`inputs.ethtool`):
  - Gather statistics from namespaces.
  - Possibility to skip gathering metrics for downed interfaces
- HTTP Response (`inputs.http_response`):
  - Add setting for TLS renegotiation method.
  - Add User-Agent header.
- Kafka Consumer (`inputs.kafka_consumer`): Add Sarama debug logs.
- KNX (`inputs.knx_listener`): Add support for TCP as a transport protocol.
- Kubernetes (`inputs.kubernetes`): Allow fetching kublet metrics remotely.
- Modbus (`inputs.modbus`):
  - Add 8-bit integer types.
  - Add configuration option to pause after connect.
  - Add support for half-precision floats (float16).
  - Optimize grouped requests.
  - Optimize requests.
- OPC UA (`inputs.opcua`): Use regular reads instead of registered reads.
- PowerDNS Recursor (`inputs.powerdns_recursor`):
  Support for new PowerDNS recursor control protocol.
- Prometheus (`inputs.prometheus`):
  Add support for custom headers.
  - Allow explicit scrape configuration without annotations.
  - Use system wide proxy settings.
- S.M.A.R.T. (`inputs.smart`): Add additional SMART metrics that indicate/predict device failure.
- SNMP (`inputs.snmp`): Convert enum values.
- Socket Listener (`inputs.socket_listener`): Specify message separator for streams.
- SQL Server (`inputs.sqlserver `):
  - Add `@@SERVICENAME` and `SERVERPROPERTY(IsClustered)` in measurement `sqlserver_server_properties`.
  - Add data and log used space metrics for Azure SQL DB.
  - Add metric `available_physical_memory_kb` in `sqlserver_server_properties`.
  - Introduce timeout for query execution.
- System (`inputs.system`): Collect unique user count logged in.
- Tail (`inputs.tail`):
  - Add option to preserve newlines for multiline data
  - Allow handling of quoted strings spanning multiple lines
- Tomcat (`inputs.tomcat`): Add source tag.
- Azure Data Explorer (`outputs.azure_data_explorer`):
  Add support for streaming ingestion for ADX output plugin.
- Event Hubs (`outputs.event_hubs`): Expose max message size batch option.
- Graylog (`outputs.graylog`): Implement optional connection retries.
- Timestream (`outputs.timestream`): Support ingesting multi-measures.
- Binary parser (`parsers.binary`) Handle hex-encoded inputs.
- CSV parser (`parsers.csv`):
  - Add option for overwrite tags
  - Support null delimiters
- Grok parser (`parsers.grok`): Add option to allow multiline messages.
- XPath parser (`parsers.xpath`):
  - Add option to skip (header) bytes.
  - Allow to specify byte-array fields to encode in HEX.
- JSON serializer (`serializers.json`) Support serializing JSON nested in string fields.

### Bug fixes
- Run processors in configuration order.
- Watch for changes in configuration files in config directories.
- Conntrack (`inputs.conntrack`): Skip gather tests if conntrack kernel module is not loaded.
- Filecount (`inputs.filecount`): Revert library version.
- Kubernetes Inventory (`inputs.kube_inventory`):
  Change default token path, use in-cluster config by default.
- Modbus (`inputs.modbus`):
  - Add workaround to read field in separate requests.
  - Fix Windows COM-port path.
  - Fix default value of transmission mode.
- MongoDB (`inputs.mongodb`): Fix connection leak triggered by configuration reload.
- OPC UA (`inputs.opcua`):
  - Add support for OPC UA datetime values.
  - Parse full range of status codes with uint32.
- Prometheus (`inputs.prometheus`): Respect selectors when scraping pods.
- SQL (`inputs.sql`): Cast `measurement_column` to string.
- VSphere (`inputs.vsphere`): Eliminate duplicate samples.
- ZFS (`inputs.zfs`): Unbreak dataset stat gathering in case listsnaps is enabled on a zfs pool.
- Azure Data Explorer (`outputs.azure_data_explorer`): Update test call to `NewSerializer`.
- Parser processor (`processors.parser`): Handle empty metric names correctly.

### Dependency updates
- Update `github.com/aliyun/alibaba-cloud-sdk-go` from 1.61.1836 to 1.62.77
- Update `github.com/gosnmp/gosnmp` from 1.34.0 to 1.35.0
- Update `OpenTelemetry` from 0.2.30 to 0.2.33

## v1.24.4 {date="2022-11-29"}

### Bug fixes
- Amazon CloudWatch (`inputs.cloudwatch`): Correctly handle multiple namespaces.
- Directory Monitor (`inputs.directory_monitor`): Close input file before removal.
- GMNI (`inputs.gnmi`):
  - Handle decimal_val as per gnmi v0.8.0.
  - Do not provide empty prefix for subscription request.
  - Fix empty name for Sonic devices.
- Ping (`inputs.ping`): Avoid -x/-X on FreeBSD 13 and newer with ping6.
- Prometheus input (`inputs.prometheus`): Correctly default to port 9102.
- Redis Sentinel (`input.redis_sentinel`): Fix sentinel and replica stats gathering.
- Socket Listener (`inputs.socket_listener`): Ensure connections are closed.
- Datadog (`output.datadog`): Log response in case of non 2XX response from API
- Prometheus output (`outputs.prometheus`): Expire metrics correctly during adds.
- Yandex Cloud Monitoring (`outputs.yandex_cloud_monitoring`): Catch int64 values.

### Dependency updates
- Update `github.com/aliyun/alibaba-cloud-sdk-go` from 1.61.1818 to 1.61.1836
- Update `github.com/prometheus/client_golang` from 1.13.0 to 1.13.1
- Update `github.com/aws/aws-sdk-go-v2/service/timestreamwrite` from 1.13.12 to 1.14.5
- Update `github.com/aws/aws-sdk-go-v2/feature/ec2/imds` from 1.12.17 to 1.12.19
- Update `github.com/gofrs/uuid` from v4.3.0 to v4.3.1
- Update `github.com/aws/aws-sdk-go-v2/service/sts` from 1.16.19 to 1.17.2
- Update `github.com/urfave/cli/v2` from 2.16.3 to 2.23.5
- Update `github.com/Azure/azure-event-hubs-go/v3` from 3.3.18 to 3.3.20
- Update `github.com/showwin/speedtest-go` from 1.1.5 to 1.2.1
- Update `github.com/aws/aws-sdk-go-v2/credentials` from 1.12.21 to 1.13.2
- Update `github.com/yuin/goldmark` from 1.5.2 to 1.5.3
- Update `cloud.google.com/go/pubsub` from 1.25.1 to 1.26.0
- Update `go.mongodb.org/mongo-driver` from 1.10.2 to 1.11.0

## v1.24.3 {date="2022-11-02"}

### Bug fixes
- Restore warning on unused configuration options.
- Correct default value of `enable_tls`.
- Update systemd unit description.
- Fix panic due to tickers slice being off-by-one in size.
- Set default parser.
- Correctly setup processors
- Fix problem with metrics not exposed by plugins.
- Directory Monitor (`inputs.directory_monitor`): Allow cross filesystem directories.
- Kafka (`inputs.kafka`): Switch to Sarama's new consumer group rebalance strategy setting.
- Modbus (`inputs.modbus`):
  - Add slave ID to failing connection.
  - Handle field-measurement definitions correctly on duplicate field check
  - Improve duplicate field checks
- OPC UA (`inputs.opcua`): Add metric tags to node.
- Syslog (`inputs.syslog`): Print error when no error or message given.
- Zookeeper (`inputs.zookeeper`): Add the ability to parse floats as floats.
- JSON v2 parser (`parsers.json_v2`): Remove BOM before parsing.
- Parser processor (`processors.parser`): Keep name of original metric if parser doesn't return one.
- Splunk Metric serializer (`serializers.splunkmetric`): Provide option to remove event metric tag.

### Features
- Support sections in markdown.

### Dependency updates
- Update github.com/snowflakedb/gosnowflake from 1.6.2 to 1.6.13
- Update github.com/sensu/sensu-go/api/core/v2 from 2.14.0 to 2.15.0
- Update github.com/gofrs/uuid from 4.2.0& to 4.3.0
- Update github.com/hashicorp/consul/api from 1.14.0 to 1.15.2
- Update github.com/aws/aws-sdk-go-v2/credentials from 1.12.5 to 1.12.21
- Update github.com/aws/aws-sdk-go-v2/service/cloudwatch
- Update github.com/aws/aws-sdk-go-v2/config
- Update k8s.io/apimachinery from 0.25.1 to 0.25.2
- Update k8s.io/api from 0.25.0 to 0.25.2
- Update k8s.io/api from 0.25.2 to 0.25.3
- Update modernc.org/sqlite from 1.17.3 to 1.19.2
- Update github.com/signalfx/golib/v3 from 3.3.45 to 3.3.46
- Update github.com/yuin/goldmark from 1.4.13 to 1.5.2
- Update cloud.google.com/go/bigquery from 1.40.0 to 1.42.0
- Update github.com/aws/aws-sdk-go-v2/service/kinesis
- Update github.com/aliyun/alibaba-cloud-sdk-go
- Update github.com/Shopify/sarama from 1.36.0 to 1.37.2
- Update testcontainers-go from 0.13.0 to 0.14.0 and address breaking change
- Update modernc.org/libc from v1.20.3 to v1.21.2
- Update github.com/aws/aws-sdk-go-v2/service/dynamodb
- Update google.golang.org/api from 0.95.0 to 0.100.0
- Update github.com/gopcua/opcua from 0.3.3 to 0.3.7
- Update github.com/prometheus/client_model from 0.2.0 to 0.3.0
- Update cloud.google.com/go/monitoring from 1.5.0 to 1.7.0
- Update github.com/nats-io/nats-server/v2 from 2.8.4 to 2.9.4

## v1.24.2  {date="2022-10-03"}

### Bug fixes
- Support old style of filtering sample configurations in CLI.
- Enable TLS in Kafka plugins without custom configuration.
- Avoid Ethtool internal name conflict with AWS.

### Input plugin updates
- InfluxDB Listener (`influxdb_listener`): Error on invalid precision.
- Internet speed (`internet_speed`): Rename `enable_file_download` to match upstream intent.
- MongoDB (`mongodb`): Start plugin correctly.
- MQTT Consumer (`mqtt_consumer`): Rework connection and message tracking.

### Parser updates
- XPath (`xpath`): Handle floating-point times correctly.
- Allow specifying the Influx parser type.

### Dependency updates
- Update dependencies for OpenBSD support.
- Update `k8s.io/apimachinery` from 0.25.0 to 0.25.1.
- Update `github.com/aerospike/aerospike-client-go/v5` from 5.9.0 to 5.10.0.
- Update github.com/nats-io/nats.go from 1.16.0 to 1.17.0.
- Replace `go-ping` with `pro-bing`.
- Update `go.mongodb.org/mongo-driver` from 1.10.1 to 1.10.2.
- Update `github.com/aws/smithy-go` from 1.13.2 to 1.13.3.
- Update `github.com/rabbitmq/amqp091-go` from 1.4.0 to 1.5.0.
- Update `github.com/docker/distribution` from v2.7.1 to v2.8.1.

## v1.24.1 {date="2022-09-19"}

### Bug fixes
- Clear error message when provided configuration is not a text file.
- Enable global confirmation for installing `mingw`.

### Input plugin updates
- Ceph (`ceph`): Modernize metrics.
- Modbus (`modbus`): Do not fail if a single server reports errors.
- NTPQ (`ntpq`): Handle pools with `-`.


### Parser updates
- CSV (`csv`): Remove direct check.
- XPath (`xpath`): Add array index when expanding names.
- Fix memory leak for plugins using `ParserFunc`.
- Unwrap parsers and remove some special handling.
- `processors.parser`: Add option to parse tags

### Dependency updates
- Update `cloud.google.com/go/pubsub` from 1.24.0 to 1.25.1.
- Update `github.com/urfave/cli/v2` from 2.14.1 to 2.16.3.
- Update `github.com/aws/aws-sdk-go-v2/service/ec2`.
- Update `github.com/wavefronthq/wavefront-sdk-go`.
- Update `cloud.google.com/go/bigquery` from 1.33.0 to 1.40.0.

## v1.24.0 {date="2022-09-12"}

### Breaking change

-  Set default minimum TLS version to v1.2 for security reasons on both server and client connections.
This is a change from the previous defaults (TLS v1.0) on the server configuration and might break clients relying on older TLS versions.
Older versions can be manually reverted on a per-plugin basis using the `tls_min_version` option in the plugins required.

### Features

- Create custom builder to scan a Telegraf configuration file for the plugin files being defined and builds a new binary only including these plugins.
- Add license checking tool.
- Add metrics for member and replica-set average health of MongoDB.
- Allow collecting node-level metrics for Couchbase buckets.
- Make `config` subcommand.

### Bug fixes

- Add version number to MacOS packages.
- Backport sync `sample.conf` and `README.md` files.
- Fix to parsing errors in Datadog mode.
- Clean up after Redis merge.
- Refactor Telegraf version.
- Remove shell execution for `license-checker`.

### New plugins

#### Inputs
- [AWS CloudWatch Metric Streams](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/cloudwatch_metric_streams) (`cloudwatch_metric_streams`) - Contributed by [@mccabecillian](https://github.com/mccabecillian).
- [Linux CPU](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/linux_cpu)(`linux_cpu`) - Contributed by [@fabianishere](http://github.com/fabianishere).
- [NSDP](https://github.com/hdecarne-github/nsdp-telegraf-plugin) (`nsdp`) - Contributed by [@hdecarne](https://github.com/@hdecarne).
- [Supervisor](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/supervisor) (`supervisor`) - Contributed by [@niasar](http://github.com/niasar).
- [UPSD](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/upsd) (`upsd`) - Contributed by [@Malinskiy](http://github.com/Malinskiy).

#### Outputs
- [PostgreSQL](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/postgresql) (`postgresql`) - Contributed by [@phemmer](https://github.com/phemmer).
- [RedisTimeSeries](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/redistimeseries) (`redistimeseries`) - Contributed by [@gkorland](http://github.com/gkorland).
- [Stomp (Active MQ)](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/stomp) - Contributed by [@amus-sal](http://github.com/amus-sal).

#### Serializers
- [CSV](https://github.com/influxdata/telegraf/tree/master/plugins/serializers/csv) (`csv`) - Contributed by [@influxdata](http://github.com/influxdata).


### Input plugin updates

- Nats Consumer (`nats_consumer`): Add simple support for jetstream subjects.
- Cisco Telemetry MDT (`cisco_telemetry_mdt`): Add GRPC Keepalive/timeout configuration options.
- Directory Monitor (`directory_monitor`):
  - Support paths for `files_to_ignore` and `files_to_monitor`.
  - Traverse subdirectories.
- Kafka Consumer (`kafka_consumer`): Option to set default fetch message bytes.
- Linux CPU (`linux_cpu`): Add plugin to collect CPU metrics on Linux.
- Logstash (`logstash`): Record number of failures.
- Modbus (`modbus`): Error out on requests with no fields defined.
- MQTT Consumer (`mqtt_consumer`): Add incoming MQTT message size calculation.
- Nginx Plus API (`nginx_plus_api`) Gather `limit_reqs` metrics.
- NTPQ (`ntpq`):
  - Add option to specify command flags.
  - Add possibility to query remote servers.
  - Allow to specify `reach` output format.
- Openstack (`openstack`): Add `allow_reauth` configuration option.
- Smart (`smart`): Collect SSD endurance information where available in `smartctl`.
- SQL Server (`sqlserver`):
  - Add database name to IO stats for MI.
  - Improved filtering for active requests.
  - Fix filtering for `sqlAzureMIRequests` and s`qlAzureDBRequests`.
- StatsD (`statsd`): Add median timing calculation.
- Syslog (`syslog`): Log remote host as source tag.
- x509 Cert (`x509_cert`):
  - Add SMTP protocol.
  - Add proxy support.
  - Multiple sources with non-overlapping DNS entries.
- RabbitMQ (`rabbitmq`): Add support for `head_message_timestamp` metric.
- Redis (`redis`): Add Redis 6 ACL authorization support.
- Jolokia 2 (`jolokia2`): Add optional origin header.
- MongoDB (`mongodb`): Add an option to bypass connection errors on start.
- OPC UA (`opcua`): Assign node ID correctly.
- Prometheus (`prometheus`): Run outside Kubernetes cluster error.
- UPSD (`upsd`): Move to new `sample.conf` style.

### Output plugin updates

- Cloudwatch (`cloudwatch`): Add proxy support.
- MQTT (`mqtt`): Add support for MQTT protocol version 5.
- AMQP (`amqp`): Add proxy support.
- Graphite (`graphite`): Retry connecting to servers with failed send attempts.
- Groundwork (`groundwork`):
  - Improve metric parsing to extend output.
  - Add default appType as configuration option.
- Redis Time Series (`redistimeseries`): Add integration test
- SQL (`sql`): Add settings for Go `sql.DB` settings.
- ExecD (`execd`): Fix error when partially unserializable metrics are written.
- Wavefront (`wavefront`): Update Wavefront SDK and use non-deprecated APIs.


### Serializer updates
- JSON (`json`): Add new `json_transformation` option transform outputted JSON. This new option can be used to transform the JSON output using the JSONata language to accommodate for requirements on the receiver side. The setting can also filter and process JSON data points.
- Prometheus (`prometheus`):
  - Provide option to reduce payload size by removing HELP from payload
  - Sort labels in prometheusremotewrite serializer

### Parser updates
- Migrate parsers to new style.
- XPath (`xpath`): Add support for returning underlying data types.
- CSV (`csv`): Add `reset-mode` flag.

### Processor updates
- Starlark (`starlark`): Add  benchmark for tag concatenation.

### Dependency updates

- Update `github.com/jackc/pgx/v4` from 4.16.1 to 4.17.0.
- Update `github.com/Azure/go-autorest/autorest` from 0.11.24 to 0.11.28.
- Update `github.com/aws/aws-sdk-go-v2/service/ec2` from 1.51.2 to 1.52.1
- Update `github.com/urfave/cli/v2` from 2.3.0 to 2.11.2.
- Update `github.com/aws/aws-sdk-go-v2/service/timestreamwrite` from 1.13.6 to 1.13.12.
- Update `github.com/aliyun/alibaba-cloud-sdk-go` from 1.61.1695 to 1.61.1727.
- Update `go.mongodb.org/mongo-driver` from 1.9.1 to 1.10.1.
- Update `github.com/wavefronthq/wavefront-sdk-go` from 0.10.1 to 0.10.2.
- Update `github.com/aws/aws-sdk-go-v2/service/sts` from 1.16.7 to 1.16.13.
- Update `github.com/aerospike/aerospike-client-go/v5` from 5.7.0 to 5.9.0.
- Update `github.com/hashicorp/consul/api` from 1.13.1 to 1.14.0.
- Update `github.com/tidwall/gjson` from 1.14.1 to 1.14.3.
- Update `github.com/rabbitmq/amqp091-go` from 1.3.4 to 1.4.0.
- Update `github.com/aws/aws-sdk-go-v2/service/dynamodb` from 1.15.10 to 1.16.1.
- Update `github.com/gophercloud/gophercloud` from 0.25.0 to 1.0.0.
- Update `k8s.io/client-go` from 0.24.3 to 0.25.0.
- Update `github.com/aws/aws-sdk-go-v2/feature/ec2/imds` from 1.12.11 to 1.12.13.
- Update `github.com/urfave/cli/v2` from 2.11.2 to 2.14.1.
- Update `gonum.org/v1/gonum` from 0.11.0 to 0.12.0.
- Update `github.com/Azure/azure-kusto-go` from 0.7.0 to 0.8.0.
- Update `google.golang.org/grpc` from 1.48.0 to 1.49.0.



## v1.23.4 {date="2022-08-16"}

### Bug fixes

- Update `github.com/lxc/lxd` to be able to run tests.
- Sync sql output and input build constraints to handle loong64 in go1.19.
- Updating credentials file to not use `endpoint_url` parameter.
- Cloudwatch (`inputs.cloudwatch`): Customize batch size when querying
- Kubernetes Inventor (`inputs.kube_inventory`): Send file location to enable token auto-refresh.
- Kubernetes (`inputs.kubernetes`): Refresh token from file at each read.
- MongoDB (`inputs.mongodb`): Update version check for newer versions.
- OPC UA (`inputs.opcua`): Return an error with mismatched types.
- SQL Server (`inputs.sqlserver`): Set lower deadlock priority.
- Stackdriver Google Cloud Monitoring (`inputs.stackdriver`): Handle when no buckets are available.
- Fix Linter issues

### Features

- Add coralogix dialect to opentelemetry

### Dependency updates

- Update `github.com/testcontainers/testcontainers-go` from 0.12.0 to 0.13.0.
- Update `github.com/apache/thrift` from 0.15.0 to 0.16.0.
- Update `github.com/aws/aws-sdk-go-v2/service/ec2` from 1.46.0 to 1.51.0.
- Update all `go.opentelemetry.io` dependencies.
- Update `github.com/go-ldap/ldap/v3` from 3.4.1 to 3.4.4.
- Update `github.com/karrick/godirwalk` from 1.16.1 to 1.17.0.
- Update `github.com/vmware/govmomi` from 0.28.0 to 0.29.0.
- Update `github.com/eclipse/paho.mqtt.golang` from 1.3.5 to 1.4.1.
- Update `github.com/shirou/gopsutil/v3` from 3.22.4 to 3.22.7.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs`.
- Update `github.com/Azure/go-autorest/autorest/adal`.
- Update `github.com/pion/dtls/v2` from 2.0.13 to 2.1.5.
- Update `github.com/Azure/azure-event-hubs-go/v3`.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatch`.
- Update `github.com/aws/aws-sdk-go-v2/service/kinesis`.
- Update `github.com/aws/aws-sdk-go-v2/service/dynamodb`.
- Update `github.com/signalfx/golib/v3` from 3.3.43 to 3.3.45.
- Update `github.com/BurntSushi/toml` from 0.4.1 to 1.2.0.
- Update `cloud.google.com/go/pubsub` from 1.24.0 to 1.24.0.
- Update `k8s.io/apimachinery` from 0.24.2 to 0.24.3.
- Update `github.com/Shopify/sarama `from 1.34.1 to 1.35.0.
- Update `github.com/sirupsen/logrus` from 1.8.1 to 1.9.0.
- Update `github.com/emicklei/go-restful` from v2.9.5+incompatible to v3.8.0.
- Update `github.com/hashicorp/consul/api` from 1.12.0 to 1.13.1.
- Update `github.com/prometheus/client_golang` from 1.12.2 to 1.13.0.
- Update `google.golang.org/api` from 0.85.0 to 0.91.0.
- Update `github.com/antchfx/xmlquery` from 1.3.9 to 1.3.12.
- Update `github.com/aws/aws-sdk-go-v2/service/ec2`.
- Update `github.com/aws/aws-sdk-go-v2/feature/ec2/imds`.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs`.

## v1.23.4 {date="2022-08-16"}

- Update `github.com/lxc/lxd` to be able to run tests.
- Sync sql output and input build constraints to handle loong64 in go1.19.
- Update credentials file to not use `endpoint_url` parameter
- Fixes to linter issues
- Add Coralogix dialect to open telemetry.

### Input plugin updates

- Cloudwatch (`cloudwatch`): Customizable batch size when querying.
- Kube Inventory (`kube_inventory`): Send file location to enable token auto-refresh.
- Kubernetes (`kubernetes`): Refresh token from file at each read.
- MongoDB (`mongodb`): Update to most recent version.
- OPC UA (`opcua`): Return an error with mismatched types.
- SQL server (`sqlserver`): Set lower deadlock priority.
- Stackdriver (`stackdriver`) Handle when no buckets available.


### Dependency updates

- Bump github.com/testcontainers/testcontainers-go from 0.12.0 to 0.13.0.
- Bump github.com/apache/thrift from 0.15.0 to 0.16.0.
- Bump github.com/aws/aws-sdk-go-v2/service/ec2 from 1.46.0 to 1.51.0.
- Update all go.opentelemetry.io dependencies.
- Bump github.com/go-ldap/ldap/v3 from 3.4.1 to 3.4.4.
- Bump github.com/karrick/godirwalk from 1.16.1 to 1.17.0.
- Bump github.com/vmware/govmomi from 0.28.0 to 0.29.0.
- Bump github.com/eclipse/paho.mqtt.golang from 1.3.5 to 1.4.1.
- Bump github.com/shirou/gopsutil/v3 from 3.22.4 to 3.22.7.
- Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs.
- Bump github.com/Azure/go-autorest/autorest/adal.
- Bump github.com/pion/dtls/v2 from 2.0.13 to 2.1.5.
- Bump github.com/Azure/azure-event-hubs-go/v3.
- Bump github.com/aws/aws-sdk-go-v2/service/cloudwatch.
- Bump github.com/aws/aws-sdk-go-v2/service/kinesis.
- Bump github.com/aws/aws-sdk-go-v2/service/dynamodb.
- Bump github.com/signalfx/golib/v3 from 3.3.43 to 3.3.45.
- Update github.com/BurntSushi/toml from 0.4.1 to 1.2.0.
- Update cloud.google.com/go/pubsub from 1.24.0 to 1.24.0.
- Update k8s.io/apimachinery from 0.24.2 to 0.24.3.
- Update github.com/Shopify/sarama from 1.34.1 to 1.35.0.
- Bump github.com/sirupsen/logrus from 1.8.1 to 1.9.0.
- Bump github.com/emicklei/go-restful from v2.9.5+incompatible to v3.8.0.
- Bump github.com/hashicorp/consul/api from 1.12.0 to 1.13.1.
- Bump github.com/prometheus/client_golang from 1.12.2 to 1.13.0.
- Bump google.golang.org/api from 0.85.0 to 0.91.0.
- Bump github.com/antchfx/xmlquery from 1.3.9 to 1.3.12.
- Bump github.com/aws/aws-sdk-go-v2/service/ec2.
- Bump github.com/aws/aws-sdk-go-v2/feature/ec2/imds.
- Bump github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs.

## v1.23.3 {date="2022-07-25"}

### Bug fixes
- Openstack input plugin (`inputs.openstack`): Use v3 volume library.
- MQTT Consumer input plugin (`inputs.mqtt_consumer`): Topic parsing error when topic having prefix '/'.
- SNMP Trap input plugin (`inputs.snmp_trap`): Prevent map panic when using with `netsnmp` translator.
- SQL Server input plugin (`inputs.sqlserver`): Set lower deadlock priority on queries.
- `common.cookie`: Use reader over readcloser, regenerate `cookie-jar` at reauthorization.
- Prometheus parser (`parsers.prometheus`): Histogram infinity bucket is now always present.

### Dependency updates
- Bump `github.com/antchfx/jsonquery` from 1.1.5 to 1.2.0.

## v1.23.2 {date="2022-07-11"}

### Bug fixes

- Remove unexpected deprecation warnings for non-deprecated packages that occurred in 1.24.1.
- HTTP input plugin (`inputs.http`): Allow both 200 and 201 response codes when generating cookie authentication. Also update the cookie header docs to show a TOML map rather than a string.
- Microsoft SQL Server input plugin (`inputs.sqlserver`): Use `bigint` for `backupsize` in `sqlserver` queries.
- gNMI input plugin (`inputs.gnmi`): Refactor `tag_only` subscriptions for complex keys (such as `network-instances`) and to improve concurrrency. The subscription key is no longer hardcoded to the device name and the `name` tag. Adds ability to specify a subscription key on a per-tag basis.
- SNMP input plugin (`inputs.snmp`): Now sets gosnmp's `UseUnconnectedUDPSocket` to true when using UDP. Adds support to accept SNMP responses from any address (not just the requested address). Useful when gathering responses from redundant/failover systems.

### Dependency updates
- Bump `github.com/docker/docker` from 20.10.14 to 20.10.17.

## v1.23.1 {date="2022-07-05"}

### Bug fixes
- Jolokia2 input plugin (`jolikia2`): Resolve panic on null response.
- RabbitMQ input plugin (`rabbitmq`) Don't require listeners to be present in overview.
- Sync back `sample.confs` for Couchbuse input plugin (`couchbase`) and Groundwork output plugin (`groundwork`).
- Filter out views in MongoDB lookup.
- Fix race condition in configuration and prevent concurrent map writes to `c.UnusedFields`.
- Restore sample configurations broken during initial migration
- Sync back sample.confs for inputs.couchbase and outputs.groundwork.

### Dependency updates
- Bump `cloud.google.com/go/monitoring` from 1.2.0 to 1.5.0.
- Bump `github.com/aws/aws-sdk-go-v2/credentials` from 1.12.2 to 1.12.5.
- Bump `google.golang.org/grpc` from 1.46.2 to 1.47.0.
- Bump `k8s.io/client-go` from 0.23.3 to 0.24.1.
- Bump `github.com/go-logfmt/logfmt` from 0.5.0 to 0.5.1.
- Bump `github.com/aws/aws-sdk-go-v2/service/dynamodb` from 1.15.3 to 1.15.7.
- Bump `go.mongodb.org/mongo-driver` from 1.9.0 to 1.9.1.
- Bump `github.com/gophercloud/gophercloud` from 0.24.0 to 0.25.0.
- Bump `google.golang.org/api` from 0.74.0 to 0.84.0.
- Bump `github.com/fatih/color` from 1.10.0 to 1.13.0.
- Bump `github.com/aws/aws-sdk-go-v2/service/timestreamwrite` from 1.3.2 to 1.13.6.
- Bump `github.com/shopify/sarama` from 1.32.0 to 1.34.1.
- Bump `github.com/dynatrace-oss/dynatrace-metric-utils-go` from 0.3.0 to 0.5.0.
- Bump `github.com/nats-io/nats.go` from 1.15.0 to 1.16.0.
- Bump `cloud.google.com/go/pubsub` from 1.18.0 to 1.22.2.
- Bump `go.opentelemetry.io/collector/pdata` from 0.52.0 to 0.54.0.
- Bump `github.com/jackc/pgx/v4` from 4.15.0 to 4.16.1.
- Bump `cloud.google.com/go/bigquery` from 1.8.0 to 1.33.0.
- Bump `github.com/Azure/azure-kusto-go` from 0.6.0 to 0.7.0.
- Bump `cloud.google.com/go/pubsub` from 1.22.2 to 1.24.0.
- Bump `github.com/aws/aws-sdk-go-v2/service/kinesis` from 1.13.0 to 1.15.7.
- Bump `github.com/aws/aws-sdk-go-v2/service/ec2` from 1.1.0 to 1.46.0.
- Bump `github.com/golang-jwt/jwt/v4` from 4.4.1 to 4.4.2.
- Bump `github.com/vmware/govmomi` from 0.27.3 to 0.28.0.
- Bump `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs` from 1.15.4 to 1.15.8.
- Bump `github.com/influxdata/influxdb-observability/otel2influx` from 0.2.21 to 0.2.22.
- Bump `k8s.io/api` from 0.24.1 to 0.24.2.
- Bump `github.com/prometheus/client_golang` from 1.12.1 to 1.12.2.

## v1.23.0 {date="2022-06-13"}

- Sample configuration (`sample.conf`) files for the different plugins are now embedded into the Golang code by the Go compiler. You can now download the sample configuration from
Telegraf without having to paste in sample configurations from each plugin's README.md.
- Add missing build constraints for sqlite.
- Always build README-embedder for host-architecture.
- Avoid calling `sadc` with invalid 0 interval.
- Check `net.Listen()` error in tests.
- Add DataDog count metrics.
- Deprecate unused database configuration option.
- Document interval setting for internet speed plugin.
- Add Elasticsearch output float handling test.
- Log instance name in skip warnings.
- Output erroneous namespace and fix error.
- Remove any content type from Prometheus accept header.
- Remove full access permissions.
- Search services file in `/etc/services` and fall back to `/usr/etc/services`.
- Migrate XPath parser to new style.
- Add field key option to set event partition key
- Add semantic commits checker.
- Allow other `fluentd `metrics.
- Add Artifactory Webhook Receiver.
- Create and push nightly Docker images to quay.io.
- Fix error if no nodes found for current configuration with XPath parser.

### New plugins

- [Fritzbox](https://github.com/gridscale/linux-psi-telegraf-plugin/blob/main/README.md)(`fritzbox`) - Contributed by [@hdecarne](https://github.com/@hdecarne).
- [Huebridge](https://github.com/hdecarne-github/huebridge-telegraf-plugin/blob/main/README.md)(`huebridge`) - Contributed by [@hdecarne](https://github.com/@hdecarne).
- [Slab](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/slab/README.md) (`slab`) - Contributed by @bobuhiro11.

### Input plugin updates
- Burrow (`burrow`): Move Dialer to variable and run `make fmt`.
- CPU (`cpu`): Add core and physical ID tags that contain information about physical CPU or cores in cases of hyper-threading.
- HTTP (`http`): Use readers over closers.
- Lustre (`lustre`): Support collecting per-client stats.
- Mock (`mock`) Add constant algorithm.
- Tail (`tail`): Add ANSI color filter.
- Redis (`redis`): Fix to `goroutine` leak triggered by auto-reload configuration mechanism.

### Output plugin updates
- HTTP (`http`): Enable authentication against a Google API protected by the OAuth 2.0 protocol.
- HTTP (`elasticsearch`): Add healthcheck timeout.
- SQL (`sql`): Add table existence cache.

### Dependency updates
- Update `github.com/wavefronthq/wavefront-sdk-go` from 0.9.10 to 0.9.11.
- Update `github.com/aws/aws-sdk-go-v2/config` from 1.15.3 to 1.15.7.
- Update `github.com/sensu/sensu-go/api/core/v2` from 2.13.0 to 2.14.0.
- Update `go.opentelemetry.io/otel/metric` from 0.28.0 to 0.30.0.
- Update `github.com/nats-io/nats-server/v2` from 2.7.4 to 2.8.4.
- Update `golangci-lint` from v1.45.2 to v1.46.2.
- Update `gopsutil` from v3.22.3 to v3.22.4 to allow for HOST_PROC_MOUNTINFO.
- Update `moby/ipvs` dependency from v1.0.1 to v1.0.2.
- Update `modernc.org/sqlite `from v1.10.8 to v1.17.3.
- Update `github.com/containerd/containerd` from v1.5.11 to v1.5.13.
- Update `github.com/tidwall/gjson` from 1.10.2 to 1.14.1.

## v1.22.4 {date="2022-05-17"}

- Wait for network up in `systemd` packaging.

### Input plugin updates
- Couchbase (`couchbase`): Do not assume metrics will all be of the same length.
- StatsD (`statsd`): Fix error when closing network connection.
- Add mount option filtering to disk plugin.

### Output plugin updates
- Azure Monitor (`azure_monitor`): Reinitialize `http` client on context deadline error.
- Wavefront (`wavefront`): Do not add `telegraf.host` tag if no `host` tag is provided.

### Dependency updates
- Update `github.com/showwin/speedtest-go` from 1.1.4 to 1.1.5.
- Update OpenTelemetry plugins to v0.51.0.

## v1.22.3 {date="2022-04-28"}

- Update Go to 1.18.1.

### Input plugin updates
- InfluxDB Listener (`influxdb_listener`): Remove duplicate writes with upstream parser.
- GNMI (`gnmi`): Use external xpath parser.
- System (`system`): Reduce log level back to original level.

## v1.22.2 {date="2022-04-25"}

- Allow Makefile to work on Windows.
- Allow zero outputs when using `test-wait` parameter.

### Input plugin updates
- Aerospike (`aerospike`): Fix statistics query bug.
- Aliyun CMS (`aliyuncms`): Ensure metrics accept array.
- Cisco Telemetry MDT (`cisco_telemetry_mdt`):
  - Align the default value for message size.
  - Remove overly verbose info message.
- GNMI (`gnmi`):
  - Add mutex to lookup map.
  - Use sprint to cast to strings.
- Consul agent (`consul_agent`): Use correct auth token.
- MySQL (`mysql`): Add `mariadb_dialect` to address the MariaDB differences in `INNODB_METRICS`.
- SMART (`smart`): Correctly parse various numeric forms
- Prometheus (`prometheus`): Moved from watcher to informer.

### Output plugin updates
- InfluxDB v2 (`influxdb_v2`): Improve error message.

### Dependency updates
- Update `github.com/Azure/azure-kusto-go` from 0.5.0 to 0.60.
- Update `opentelemetry` from v0.2.10 to v0.2.17.
- Update `go.opentelemetry.io/collector/pdata` from v0.48.0 to v0.49.0.
- Update `github.com/aws/aws-sdk-go-v2/config` from 1.13.1 to 1.15.3
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs`.
- Update `github.com/aws/aws-sdk-go-v2/credentials` from 1.8.0 to 1.11.2.
- Update `github.com/containerd/containerd` from v1.5.9 to v1.5.11.
- Update `github.com/miekg/dns` from 1.1.46 to 1.1.48.
- Update `github.com/gopcua/opcua` from v0.3.1 to v0.3.3
- Update `github.com/aws/aws-sdk-go-v2/service/dynamodb`.
- Update `github.com/xdg/scram` from 1.0.3 to 1.0.5.
- Update `go.mongodb.org/mongo-driver` from 1.8.3 to 1.9.0.
- Update `starlark 7a1108eaa012->d1966c6b9fcd`.

## v1.22.1 {date="2022-04-06"}

- Update `gonum.org/v1/gonum` from 0.9.3 to 0.11.0.
- Update `github.com/golang-jwt/jwt/v4` from 4.2.0 to 4.4.1.
- Update `gopsutil` and associated dependencies for improved OpenBSD support.
- Fix default value for logfile rotation interval.

### Input plugin updates
- Intel PMU (`intel_pmu`): Fix slow running intel-pmu test.
- Cloud PubSub (`cloud_pubsub`): Skip longer integration tests on `-short` mode.
- Cloud PubSub Push (`cloud_pubsub_push`): Reduce timeouts and sleeps.
- SQL Server (`sqlserver`): Fix inconsistencies in `sql*Requests` queries.
- ZFS (`zfs`): Fix redundant pool tag.
- vSphere (`vsphere`): Update debug message information.

### Output plugin updates
- Azure Monitor (`azure_monitor`): Include body in error message.
- HTTP (`http`): Switch HTTP 100 test case values.

### Processor plugin updates
- TopK (`topk`) Clarify the `k` and `fields` parameters.

### New external plugins
- [PSI External Plugin](https://github.com/gridscale/linux-psi-telegraf-plugin/blob/main/README.md)(`external.psi`) - Contributed by [@ajfriesen](https://github.com/ajfriesen).

## v1.22.0 {date="2022-03-22"}

### Features

- Add `autorestart` and `restartdelay` flags to Windows service
- Add builds for `riscv64`.
- Add file version and icon to `win.exe`.
- Add `systemd` notify support.
- Check TLS configuration early to catch missing certificates.
- Implement collection offset.
- `common.auth`: HTTP basic auth.
- `common.cookie`: Support headers with cookie auth.
- `common.proxy`: Add `socks5` proxy support.
- Improve error logging on plugin initialization.

### Bug fixes

- Print loaded plugins and deprecations for once and test.
- Remove signed MacOS artifacts.
- Run `go mod tidy`.
- Fix `prometheusremotewrite` wrong timestamp unit.
- Fix sudden close caused by OPC UA input.
- Update `containerd` to 1.5.9.
- Update `go-sensu` to v2.12.0.
- Update `gosmi` from v0.4.3 to v0.4.4.
- Update parsing logic of `config.duration`.
- Update precision parameter default value.
- Use `sha256` for rpm digest.
- Warning output when running with `--test`.
- Graceful shutdown of Telegraf with Windows service.
- Add push-only updated values flag to histogram aggregator.
- `common.cookie`: Address flaky tests in cookie_test.go and graylog_test.go.
- `common.shim`: Linter fixes.
- Do not save cache on i386 builds.
- Add error msg for missing environment variables in configuration file.
- Fix panic in parsers due to missing log for all plugins using `setparserfunc`.
- Grab table columns more accurately.
- Improve parser tests by using `go-cmp/cmp`.
- Linter fixes for `config/config.go`.
- Log error when loading mibs.
- Fix Mac signing issue with arm64.

### New plugins

#### Inputs

- [Hashicorp Consul Agent Input Plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/consul_metrics)(`consul_agent`) - Contributed by [@efbar](https://github.com/efbar).
- [Hashicorp Nomad Input Plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/nomad)(`nomad`) - Contributed by [@efbar](https://github.com/efbar).
- [Hashicorp Vault Input Plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/vault)(`vault`) - Contributed by [@efbar](https://github.com/efbar).
- [Hugepages Input Plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/hugepages)(`hugepages`) - Contributed by [@zak-pawel](https://github.com/zak-pawel).
- [Mock Input Plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mock)(`mock`) - Contributed by [InfluxData](https://github.com/influxdata).
- [Redis Sentinel Input Plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/redis_sentinel)(`redis_sentinel`) - Contributed by [@spideyfusion](https://github.com/spideyfusion).
- [Socketstat Input Plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/socketstat)(`socketstat`) - Contributed by [@sajoupa](https://github.com/sajoupa).
- [XtremIO Input Plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/xtremio)(`xtremio`) - Contributed by [@cthiel42](https://github.com/cthiel42).

#### Processors

- [Noise Processor](https://github.com/influxdata/telegraf/tree/master/plugins/processors/noise) (`noise`) - Contributed by [@wizarq](https://github.com/wizarq).

### Input plugin updates

- Aerospike (`aerospike`): Update `github.com/aerospike/aerospike-client-go` from 1.27.0 to 5.7.0.
- Bond (`bond`): Add additional stats.
- Directory Monitor (`directory_monitor`):
  - Update `djherbis/times` and fix `dependabot`.
  - Plugin restructuring.
- Disk (`disk`): Fix missing storage in container.
- Docker (`docker`):
  - Keep field type of `tasks_desired` the same.
  - Update memory usage calculation.
  - Update client API version.
- ECS (`ecs`): Use current time as timestamp.
- Execd `execd`: Add newline for Prometheus parsing.
- File (`file`): Stateful parser handling.
- GNMI (`gnmi`): Add dynamic tagging.
- Graylog (`graylog`):
  - Add `toml` tags.
  - Add `timeout-setting`.
  - Update documentation to use current URLs.
- HTTP (`http`): Ensure http body is empty.
- HTTP Listener v2 (`http_listener_v2`): Revert deprecation.
- Internet speed (`internet_speed`): Add caching.
- IPset (`ipset`): Fix crash when command not found.
- JSON V2 (`json_v2`):
  - Allow multiple optional objects.
  - Use raw values for timestamps.
- Kibana (`kibana`): Add `heap_size_limit` field.
- Logparser (`logparser`):
  - Add comment.
  - Fix panic due to missing log.
- MDStat (`mdstat`): Fix when sync is less than 10%.
- Memcached (`memcached`): Gather additional stats.
- Modbus `modbus`:
    - Make Telegraf compile on Windows with golang 1.16.2.
    - Re-enable openbsd support.
    - Update documentation.
    - Add `per-request` tags.
    - Support multiple slaves (gateway feature).
- MQTT Consumer (`mqtt_consumer`): Topic extracting no longer requires all three fields.
- NFS Client (`nfsclient`): Add new field.
- NTPQ (`ntpq`): Correctly read long poll output.
- OPC UA (`opcua`):
  - Accept non-standard OK status by implementing a configurable workaround.
  - Add more data to error log.
  - Remove duplicate addition of fields.
- OpenLDAP (`openldap`): Update go-ldap to v3.4.1.
- OpenStack (`openstack`): Fix typo.
- OpenWeatherMap (`openweathermap`): Add `feels_like` field.
- PHPfpm (`phpfpm`): Ensure CI tests runs against i386.
- PostgreSQL (`postgresql`): Add option to disable prepared statements.
- SMART (`smart`): Add concurrency configuration option, support and lint fixes.
- SNMP `(snmp`):
  - Respect number of retries configured.
  - Use the correct path when evaluating symlink.
  - Add option to select translator.
  - Check index before assignment.
  - Do not require networking during tests.
  - Ensure folders do not get loaded more than once.
  - Fix panic due to no module.
  - Fix errors if mibs folder doesn't exist.
  - Optimize locking for mibs loading.
- SNMP Trap (`snmp_trap`):
  - Collapsed fields by calling more in-depth function.
  - Deprecate unused timeout configuration option.
- SQL (`sql`): Add Clickhouse driver.
- StatsD (`statsd`): Sanitize names.
- Syslog (`syslog`): Add rfc3164 to rfc5424 translation to docs.
- System (`system`): Remove verbose logging.
- Windows Performance Counter (`win_perf_counter`):
  - Allow errors to be ignored.
  - Implemented support for reading raw values, added tests, and  update documentation.
- X.509 Certificate (`x509_cert`):
  - Mark `testgatherudpcert` as an integration test.
  - Add `exclude_root_certs` option.
- ZFS (`zfs`): Pool detection and metrics gathering for ZFS 2.1.x.


### Output plugin updates

- AMQP (`amqp`): Check for nil client before closing.
- ElasticSearch (`elasticsearch`):
  - Implement `nan` and `inf` handling.
  - Add bearer token support.
- Graylog (`graylog`): Fix to field prefixes.
- Groundwork (`groundwork`):
  - Set `nextchecktime` to `lastchecktime`.
  - Update SDK and improve logging.
  - Process group tag.
- InfluxDB V2 (`influxdb_v2`): Include bucket name in error messages.
- SQL (`sql`): Fix unsigned settings.
- Stackdriver (`stackdriver`): Cumulative interval start times.
- Syslog (`syslog`): Correctly set trailer.
- Timestream (`timestream`): Fix batching logic with write record and introduce concurrent requests.
- Datadog (`datadog`): Add compression.
- HTTP (`http`):
  - Add optional list of non-retryable status codes.
  - Support AWS managed service for Prometheus.
- Websocket `websocket`: `socks5` proxy support.
- Wavefront (`wavefront`):
    - Flush sender on error to clean up broken connections.
    - Run `gofmt`.
    - Fix panic if no mibs folder is found.

### Parser plugin updates

- CSV (`csv`):
  - Empty import tzdata for Windows binaries.
  - Fix typo.
- Ifname (`ifname`):
  - Eliminate mib dependency.
  - Parallelism fix.
- JSON V2 (`parsers.json_v2`):
  - Allow optional paths and handle wrong paths correctly.
  - Check if gpath exists and support optional in fields/tags.
  - Fixes to timestamp setting.
- Nagios (`nagios`): Use real error for logging.
- XPath (`xpath`):
  - Handle duplicate registration of protocol-buffer files gracefully.
  - Fix typo.

### Dependency updates

- Update `github.com/azure/azure-kusto-go` from 0.5.0 to 0.5.2.
- Update `github.com/nats-io/nats-server/v2` from 2.7.3 to 2.7.4.
- Update `github.com/shopify/sarama` from 1.29.1 to 1.32.0.
- Update `github.com/shirou/gopsutil`/v3 from 3.21.12 to 3.22.2.
- Update `github.com/aws/aws-sdk-go-v2/feature/ec2/imds`.
- Update `github.com/miekg/dns` from 1.1.43 to 1.1.46.
- Update `github.com/aws/aws-sdk-go-v2/service/dynamodb`.
- Update `github.com/nats-io/nats-server/v2` from 2.7.2 to 2.7.3.
- Update `github.com/aws/aws-sdk-go-v2/config` from 1.8.3 to 1.13.1.
- Update `github.com/testcontainers/testcontainers-go`.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs`.
- Update `github.com/aws/aws-sdk-go-v2/feature/ec2/imds`.
- Update `github.com/wavefronthq/wavefront-sdk-go` from 0.9.9 to 0.9.10.
- Update `github.com/clickhouse/clickhouse-go` from 1.5.1 to 1.5.4.
- Update `k8s.io/api` from 0.23.3 to 0.23.4.
- Update `cloud.google.com/go/pubsub` from 1.17.1 to 1.18.0.
- Update `github.com/newrelic/newrelic-telemetry-sdk-go`.
- Update `github.com/aws/aws-sdk-go-v2/service/dynamodb` from 1.5.0 to 1.13.0.
- Update `github.com/sensu/sensu-go/api/core/v2` from 2.12.0 to 2.13.0.
- Update `github.com/gophercloud/gophercloud` from 0.16.0 to 0.24.0.
- Update `github.com/jackc/pgx/v4` from 4.14.1 to 4.15.0.
- Update `github.com/aws/aws-sdk-go-v2/service/sts` from 1.7.2 to 1.14.0.
- Update all `go.opentelemetry.io` dependencies.
- Update `github.com/signalfx/golib/v3` from 3.3.38 to 3.3.43.
- Update `github.com/aliyun/alibaba-cloud-sdk-go`.
- Update `github.com/denisenkom/go-mssqldb` from 0.10.0 to 0.12.0.
- Update `github.com/gopcua/opcua` from 0.2.3 to 0.3.1.
- Update `github.com/nats-io/nats-server/v2` from 2.6.5 to 2.7.2.
- Update `k8s.io/client-go` from 0.22.2 to 0.23.3.
- Update `github.com/aws/aws-sdk-go-v2/service/kinesis` from 1.6.0 to 1.13.0.
- Update `github.com/benbjohnson/clock` from 1.1.0 to 1.3.0.
- Update `github.com/vmware/govmomi` from 0.27.2 to 0.27.3.
- Update `github.com/prometheus/client_golang` from 1.11.0 to 1.12.1.
- Update `go.mongodb.org/mongo-driver` from 1.7.3 to 1.8.3.
- Update `github.com/google/go-cmp` from 0.5.6 to 0.5.7.
- Update `go.opentelemetry.io/collector/model` from 0.39.0 to 0.43.2.
- Update `github.com/multiplay/go-ts3` from 1.0.0 to 1.0.1.
- Update `cloud.google.com/go/monitoring` from 0.2.0 to 1.2.0.
- Update `github.com/vmware/govmomi` from 0.26.0 to 0.27.2.
- Update `google.golang.org/api` from 0.54.0 to 0.65.0.
- Update `github.com/antchfx/xmlquery` from 1.3.6 to 1.3.9.
- Update `github.com/nsqio/go-nsq` from 1.0.8 to 1.1.0.
- Update `github.com/prometheus/common` from 0.31.1 to 0.32.1.
- Update `cloud.google.com/go/pubsub` from 1.17.0 to 1.17.1.
- Update `github.com/influxdata/influxdb-observability/influx2otel` from 0.2.8 to 0.2.10.
- Update `github.com/shirou/gopsutil/v3` from 3.21.10 to 3.21.12.
- Update `github.com/jackc/pgx/v4` from 4.6.0 to 4.14.1.
- Update `github.com/azure/azure-event-hubs-go/v3` from 3.3.13 to 3.3.17.
- Update `github.com/gosnmp/gosnmp` from 1.33.0 to 1.34.0.
- Update `github.com/hashicorp/consul/api` from 1.9.1 to 1.12.0.
- Update `github.com/antchfx/xpath` from 1.1.11 to 1.2.0.
- Update `github.com/antchfx/jsonquery` from 1.1.4 to 1.1.5.
- Update `github.com/prometheus/procfs` from 0.6.0 to 0.7.3.
- Update `github.com/aws/aws-sdk-go-v2/service/cloudwatchlogs` from 1.5.2 to 1.12.0.
- Update `github.com/kardianos/service` from 1.0.0 to 1.2.1.
- Update `github.com/couchbase/go-couchbase` from 0.1.0 to 0.1.1.
- Update `github.com/pion/dtls/v2` from 2.0.9 to 2.0.13.
- Update `github.com/eclipse/paho.mqtt.golang` from 1.3.0 to 1.3.5.

## v1.21.4 {date="2022-02-16"}

- Update to Go 1.17.7 to address [three security issues](https://groups.google.com/g/golang-announce/c/SUsQn0aSgPQ/m/gx45t8JEAgAJ?pli=1) in the library.
- Update all `go.opentelemetry.io` from 0.24.0 to 0.27.0.
- Update `github.com/signalfx/golib/v3` from 3.3.38 to 3.3.43.
- Update `github.com/aliyun/alibaba-cloud-sdk-go` from 1.61.1004 to 1.61.1483.
- Update `github.com/denisenkom/go-mssqldb` from 0.10.0 to 0.12.0.
- Update `github.com/gopcua/opcua` from 0.2.3 to 0.3.1.
- Update `github.com/nats-io/nats-server/v2` from 2.6.5 to 2.7.2.
- Update `k8s.io/client-go` from 0.22.2 to 0.23.3.
- Update `github.com/aws/aws-sdk-go-v2/service/kinesis` from 1.6.0 to 1.13.0.
- Update `github.com/benbjohnson/clock` from 1.1.0 to 1.3.0.
- Update `github.com/Azure/azure-kusto-go` from 0.5.0 to 0.5.2.
- Update `github.com/vmware/govmomi` from 0.27.2 to 0.27.3.
- Update `github.com/prometheus/client_golang` from 1.11.0 to 1.12.1.
- Update `go.mongodb.org/mongo-driver` from 1.7.3 to 1.8.3.
- Update `github.com/google/go-cmp` from 0.5.6 to 0.5.7.
- Update `go.opentelemetry.io/collector/model` from 0.39.0 to 0.43.2.
- Update `github.com/multiplay/go-ts3` from 1.0.0 to 1.0.1.
- Update `cloud.google.com/go/monitoring` from 0.2.0 to 1.2.0.
- Update `github.com/vmware/govmomi` from 0.26.0 to 0.27.2.

### Input plugin updates
- Docker (`docker`): Update memory usage calculation.
- ECS (`ecs`): Use current time as timestamp.
- SNMP (`snmp`): Ensure folders do not get loaded more than once.
- Windows Performance Counters (`win_perf_counters`): Add deprecated warning and version.

### Output plugin updates
- AMQP (`amqp`): Check for nil client before closing.
- Azure Data Explorer (`azure_data_explorer`): Lower RAM usage.
- ElasticSearch (`elasticsearch`): Add scheme to fix error in sniffing option.

### Parser plugin updates
- JSON v2 (`json_v2`):
  - Fix timestamp change during execution.
  - Fix incorrect handling of `timestamp_path`.
  - Allow optional paths and handle wrong paths correctly.

### Serializer updates
- Prometheus serializer (`prometheusremotewrite`): Use correct timestamp unit.

### New External Plugins
- [apt](https://github.com/x70b1/telegraf-apt/blob/master/README.md)(`telegraf-apt`) - Contributed by [@x70b1](https://github.com/x70b1).
- [knot](https://github.com/x70b1/telegraf-knot/blob/master/README.md)(`telegraf-knot`) - Contributed by [@x70b1](https://github.com/x70b1).

## v1.21.3 {date="2022-01-27"}

- Update `grpc` module to v1.44.0.
- Update `google.golang.org/api` module from 0.54.0 to 0.65.0.
- Update `antchfx/xmlquery` module from 1.3.6 to 1.3.9.
- Update `nsqio/go-nsq` module from 1.0.8 to 1.1.0.
- Update `prometheus/common` module from 0.31.1 to 0.32.1.
- Update `cloud.google.com/go/pubsub` module from 1.17.0 to 1.17.1.
- Update `influxdata/influxdb-observability/influx2otel` module from 0.2.8 to 0.2.10.
- Update `shirou/gopsutil/v3` module from 3.21.10 to 3.21.12.
- Update `jackc/pgx/v4` module from 4.6.0 to 4.14.1.
- Update `Azure/azure-event-hubs-go/v3` module from 3.3.13 to 3.3.17.
- Update `gosnmp/gosnmp` module from 1.33.0 to 1.34.0.
- Update `hashicorp/consul/api` module from 1.9.1 to 1.12.0.
- Update `antchfx/xpath` module from 1.1.11 to 1.2.0.
- Update `antchfx/jsonquery` module from 1.1.4 to 1.1.5.
- Update `prometheus/procfs` module from 0.6.0 to 0.7.3.
- Update `aws/aws-sdk-go-v2/service/cloudwatchlogs` module from 1.5.2 to 1.12.0.
- Update `kardianos/service` module from 1.0.0 to 1.2.1.
- Update `couchbase/go-couchbase` module from 0.1.0 to 0.1.1.
- Update `pion/dtls/v2` module from 2.0.9 to 2.0.13.
- Update `containerd/containerd` module to 1.5.9.

### Input plugin updates
- Execd (`execd`): Resolve a Prometheus text format parsing error.
- IPset (`ipset`): Prevent panic from occurring after startup.
- OPC-UA (`opc_ua`): Fix issue where fields were being duplicated.
- HTTP (`http`): Prevent server side error message.
- SNMP (`snmp`): Fix error when a MIBs folder doesn't exist.
- SNMP Trap (`snmp_trap`): Fix translation of partially resolved OIDs.

### Output plugin updates
- AMQP (`amqp`): Update to avoid connection leaks.
- Timestream (`timestream`):
  - Fix an issue with batching logic of write records.
  - Introduce concurrent requests.
- Stackdriver (`stackdriver`): Send correct interval start times for all counter metrics.
- Syslog (`syslog`): Correctly set the ASCII trailer per [RFC 6587](https://datatracker.ietf.org/doc/html/rfc6587).

### Parser plugin updates
- Nagios (`nagios`): Log correct errors when executing commands to aid in debugging.
- JSON v2 (`json_v2`): Fix timestamp precision when using `unix_ns` timestamp format.
- Wavefront (`wavefront`): Add missing setting `wavefront_disable_prefix_conversion`.


## v1.21.2 {date="2022-01-05"}

- Add arm64 MacOS builds for M1 devices.
- Add RISC-V64 Linux builds.
- Complete numerous changes to CircleCI config to ensure more timely completion and more clear execution flow.
- Update `github.com/djherbis/times` module from v1.2.0 to v1.5.0.
- Update `github.com/go-ldap/ldap/v3` module from v3.1.0 to v3.4.1.
- Update `github.com/gwos/tcg/sdk` module to v0.0.0-20211223101342-35fbd1ae683c.


### Input plugin updates
- Disk (`disk`): Fix issue of missing disks when running Telegraf in a container.
- DPDK (`dpdk`): Add a note to documentation about socket availability.
- Logparser (`logparser`): Resolve  panic in the logparser plugins due to a missing `Log`.
- SNMP (`snmp`):
  - Resolve panic due to a missing `gosmi` module.
  - Resolve panic to check the index before assignment where a floating `::` exists.
  - Resolve a panic when no MIBs folder was found.
  - Ensure the module load order to avoid an SNMP marshal error.
  - Now more accurately grabs MIB table columns.
  - Networking no longer required during tests.
- SNMP Trap (`snmp_trap`): Documented deprecation of the `timeout` setting.


### Parser plugin updates
- CSV (`csv`): Use an empty import of `tzdata` to correctly set the time zone.


## v1.21.1 {date="2021-12-16"}

### Bug fixes
- Fix panic in parsers due to missing log.
- Update `go-sensu module` to v2.12.0
- Fix typo in OpenStack input plugin.

### Features
- Add SMART input plugin concurrency configuration option, `nvme-cli v1.14+` support, and lint fixes.

## v1.21 {date="2021-12-15"}

{{% note %}}
The signing for RPM digest has changed to use sha256 to improve security. Due to this change, RPM builds might not be compatible with RHEL6 and older releases. (Telegraf only supports releases in RHEL production.)
{{% /note %}}

- Restart Telegraf service if it's already running and upgraded via RPM.
- Print loaded plugins and deprecations for once and test flags.
- Update `eclipse/paho.mqtt.golang` module from 1.3.0 to 1.3.5.
- Shutdown Telegraf gracefully on Windows Service.
- Skip `knxlistener` when writing the sample configuration file.
- Update `nats-sever` to support `openbsd`.
- Revert unintended corruption of the Makefile.
- Filter client certificates by DNS names.
- Update `etc/telegraf.conf` and `etc/telegraf_windows.conf`.
- Add full metadata to configuration for `common.kafka`.
- Update `google.golang.org/grpc` module from 1.39.1 to 1.40.0.

### Input plugin updates
- Cloudwatch (`cloudwatch`): Fix metrics collection.
- CPU (`cpu`): Update `shirou/gopsutil` from v2 to v3.
- Directory Monitor (`directory_monitor`):
  - Fix to when when data format is CSV and `csv_skip_rows>0` and `csv_header_row_count>=1`.
  - Adds the ability to create and name a tag containing the filename.
- ElasticSearch (`elasticsearch_query`): Add debug query output.
- HTTP Listener v2: (`http_listener_v2`): Fix panic on close to check that Telegraf is closing.
- Kubernetes Inventory (`kube_inventory`): Set TLS server name configuration properly.
- Modbus (`modbus`): Update connection settings (serial).
- MQTT Consumer (`mqtt_consumer`):
  - Extracting no longer requires all three fields
  - Enable extracting tag values from MQTT topics
- OPC UA (`opc_ua`):
  - Fix sudden closing of Telegraf.
  - Allow user to select the source for the metric timestamp.
- Prometheus (`prometheus`):
  - Check error before defer.
  - Add `ignore_timestamp` option.
- Puppet (`puppetagent`): Add measurements from puppet 5.
- SNMP (`snmp`):
  - Update snmp plugin to respect number of retries configured.
  - Optimize locking for SNMP MIBs loading.
  - Update to use gosmi.
  - Remove `snmptranslate` from READme and fix default path.
  - Merge tables with different indexes.
- StatsD (`statsd`): Fix parse error.
- Sysstat (`sysstat`): Use unique temporary file.
- Windows Performance Counters (`win_perf_counters`): Add setting to ignore localization.
- Windows Services (`win_services`): Add exclude filter.
- ZFS (`zfs`): Pool detection and metrics gathering for ZFS >= 2.1.x

### Output plugin updates
- Register `bigquery` to all output plugins.
- Azure Data Explorer (`azure_data_explorer`):
  - Add option to skip table creation.
  - Add `json_timestamp_layout` option.
- ElasticSearch (`elasticsearch`): Implement NaN and inf handling.
- Graylog (`graylog`):
  - Ensure graylog spec fields not prefixed with `_`.
  - Failing test due to port already in use.
  - Mute UDP/TCP tests by marking them as integration.
  - TLS support and message format.
  - Add TCP support.
- HTTP (`http`): Add `use_batch_format`.
- InfluxDB V2 (`influxdb_v2`): Add retry to 413 errors with InfluxDB output.
- Wavefront (`wavefront`): Flush sender on error to clean up broken connections.


### Parser plugin updates
- XPath (`xpath`): Handle duplicate registration of protocol-buffer files gracefully
- JSON v2 (`json_v2`):
  - Parser timestamp setting order.
  - Remove dead code.
  - Support defining field/tag tables within an object table.

### Processor plugin updates
- IfName (`ifname`):
  - Eliminate MIB dependency.
  - Parallelism fix.
  - Add more details to log messages.
- Starlark (`starlark`): Example for processing `sparkplug_b` messages.
- RegEx (`regex`): Extend to allow renaming of measurements, tags, and fields.

### Aggregator plugin updates
- Implement deprecation infrastructure
- Add support of aggregator as Starlark script

### New plugins

#### Inputs

- [Intel PMU Input Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/intel_pmu/README.md)(`intel_pmu`) - Contributed by [@bkoltowski](https://github.com/bkotlowski).
- [Logical Volume Manager Input Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/lvm/README.md)(`lvm`) - Contributed by @InfluxData.
- [OpenStack Input Plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/openstack)(`openstack`) - Contributed by [@singamSrikar].(https://github.com/singamSrikar).

### Outputs
- [Azure Event Hubs Output Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/event_hubs/README.md)(`event_hubs`) - Contributed by [@tomconte](https://github.com/tomconte).
- [GroundWork Output Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/groundwork/README.md)(`groundwork`) - Contributed by [@VladislavSenkevich)(https://github.com/VladislavSenkevich).
- [MongoDB Output Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/mongodb/README.md)(`mongodb`) - Contributed by [@bustedware](https://github.com/bustedware).

#### Aggregator
- [Starlark Aggregator](https://github.com/influxdata/telegraf/blob/master/plugins/aggregators/starlark/README.md)(`starlark`) - Contributed by [@essobedo](https://github.com/essobedo).

## v1.20.4 {date="2021-11-17"}

- Update `BurntSushi/toml` from 0.3.1 to 0.4.1.
- Update `gosnmp` module from 1.32 to 1.33.
- Update `go.opentelemetry.io/otel` from v0.23.0 to v0.24.0.
- Fix plugin linters.

### Input plugin updates
- Cisco Model-Driven Telemetry (`cisco_telemetry_mdt`): Move to new protobuf library.
- InfluxDB (`influxdb`): Update input schema docs.
- Intel RDT (`intel_rdt`): Correct the timezone to use local timezone by default instead of UTC from metrics gathered from the `pqos` tool.
- IPMI Sensor (`ipmi`): Redact passwords in log files to maintain security.
- Modbus (`modbus`): Do not build on OpenBSD.
- MySQL (`mysql`):
  - Fix type conversion follow-up.
  - Correctly set the default paths.
- NVIDIA SMI (`nvidia_smi`): Correctly set the default paths.
- Proxmox (`proxmox`): Parse the column types of the server status.
- SQL Server (`sqlserver`): Add elastic pool in supported versions.

### Output plugin updates
- Loki (`loki`): Include the metric name as a label for improved query performance and metric filtering.

## v1.20.3 {date="2021-10-28"}

- Update Go to 1.17.2.
- Update `gjson` module to v1.10.2.
- Update Snowflake database driver module to 1.6.2.
- Update `github.com/apache/thrift` module from 0.14.2 to 0.15.0.
- Update `github.com/aws/aws-sdk-go-v2/config` module from 1.8.2 to 1.8.3.
- Update `github.com/Azure/azure-kusto-go` module from 0.3.2 to 0.4.0.
- Update `github.com/docker/docker` module from 20.10.7+incompatible to 20.10.9+incompatible.
- Update `github.com/golang-jwt/jwt/v4` module from 4.0.0 to 4.1.0.
- Update `github.com/jaegertracing/jaeger` module from 1.15.1 to 1.26.0.
- Update `github.com/prometheus/common` module from 0.26.0 to 0.31.1.

### Input plugin updates
- IPMI Sensor (`ipmi_sensor`): Redact IPMI password in logs.
- Kube Inventory (`kube_inventory`):
  - Do not skip resources with zero s/ns timestamps.
  - Fix segfault in ingress, persistentvolumeclaim, statefulset.
- Procstat (`procstat`): Revert and fix tag creation.
- SQL Server (`sqlserver`): Add integration tests.
- Amazon CloudWatch (`cloudwatch`): Use the AWS SDK v2 library.
- ZFS (`zfs`): Check return code of zfs command for FreeBSD.
- Ethtool (`ethtool`): Add normalization of tags.
- Internet Speed (`internet_speed`): Resolve missing latency field.
- Prometheus (`prometheus`):
  - Decode Prometheus scrape path from Kubernetes labels.
  -  Move err check to correct place.
- Procstat (`procstat`): Correct conversion of int with specific bit size.
- Webhooks (`webhooks`): Provide more fields.
- MongoDB (`mongodb`): Solve compatibility issue when using 5.x relicaset.
- Intel RDT (`intel_rdt`): Allow sudo usage.
- MySQL (`mysql`): Fix inconsistent metric types.

### Processor plugin updates
- Starlark (`starlark`): Pop operation for non-existing keys.

### New plugins

#### External
- [IBM DB2](https://github.com/bonitoo-io/telegraf-input-db2): Contributed by @sranka.
- [Oracle Database](https://github.com/bonitoo-io/telegraf-input-oracle): Contributed by @sranka.

## v1.20.2 {date="2021-10-07"}

- Fix makefile typo that prevented i386 tar and rpm packages from being built.

### Input plugin updates
- Cloudwatch (`cloudwatch`): Use new session API.
- Stackdriver (`stackdriver`): Migrate to `cloud.google.com/go/monitoring/apiv3/v2`.

### Parser plugin updates
- JSON V2 (`json_v2`): Duplicate line_protocol when using object and fields.
- Influx (`influx`): Fix memory leak.

## v1.20.1 {date="2021-10-06"}

- Fix output buffer never completely flushing.
- Update `k8s.io/apimachinery` module to 0.22.2.
- Update `consul` module to 1.11.0.
- Update `github.com/testcontainers/testcontainers-go` module to 0.11.1.
- Update `github.com/Azure/go-autorest/autorest/adal` module.
- Update `github.com/Azure/go-autorest/autorest/azure/auth module` to 0.5.8.
- Update `cloud.google.com/go/pubsub` module to 1.17.0.
- Update `github.com/aws/smithy-go` module to 1.8.0.

### Input plugin updates

- ElasticSearch (`elasticsearch_query`): Add custom time/date format field.
- OpenTelemetry (`opentelemetry`): Fix error returned to OpenTelemetry client.
- Couchbase (`couchbase`): Fix insecure certificate validation.
- MongoDB (`mongodb`): Fix panic due to nil dereference.
- Intel RDT (`intel_rdt`): Prevent timeout when logging.
- Procstat (`procstat`): Add missing tags.

### Output plugin updates

- Loki (`loki`): Update http_headers setting to match sample config.
- MQTT (`mqtt`): Add "keep alive" config option and documentation around issue with eclipse/mosquito version.

## v.1.20 {date="2021-09-16"}

- Update Go to 1.17.0
- Update runc module to v1.0.0-rc95.
- Migrate `dgrijalva/jwt-go` to `golang-jwt/jwt/v4`.
- Update `thrift` module to 0.14.2 and `zipkin-go-opentracing` 0.4.5.
- Update `cloud.google.com/go/pubsub` module to 1.15.0.
- Update `github.com/tinylib/msgp` module to 1.1.6.


### Input plugin updates

- MongoDB (`mongodb`): Change command based on server version.
- SQL (`sql`): Make timeout apply to single query.
- SystemD Units (`systemd_units`): Add pattern support.
- Cloudwatch (`cloudwatch`):
  - Pull metrics from multiple AWS CloudWatch namespaces.
  - Support AWS Web Identity Provider.
- Modbus (`modbus`): Add support for RTU over TCP.
- Procstat (`procstat`): Support cgroup globs and include `systemd` unit children.
- Suricata (`suricata`): Support alert event type.
- Prometheus (`prometheus`): Add ability to query Consul Service catalog.
- HTTP Listener V2 (`http_listener_v2`): Allow multiple paths and add path_tag.
- HTTP (`http`): Add cookie authentication.
- Syslog (`syslog`): Add RFC 3164 support for BSD-style syslog messages.
- Jenkins (`jenkins`): Add option to include nodes by name.
- SNMP Trap (`snmp_trap`): Improve MIB lookup performance.
- Smart (`smart`): Add power mode status.
- New Relic (`newrelic`): Add option to override `metric_url`.


### Output plugin updates

- Dynatrace (`dynatrace`): Remove hardcoded int value.
- InfluxDB v2 (`influxdb_v2`): Increase accepted retry-after header values.
- SQL (`sql`): Add bool datatype.
- Prometheus Client (`prometheus_client`): Add Landing page.
- HTTP (`http`): Add cookie authentication.

### Serializer plugin updates

- Prometheus (`prometheus`): Update timestamps and expiration time as new data arrives.

### Parser plugin updates

- XPath (`xpath`): Add JSON, MessagePack, and Protocol-buffers format support.

### New plugins

#### Input

- [Elasticsearch Query](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/elasticsearch_query) - Contributed by @lpic10
- [Internet Speed Monitor](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/internet_speed) - Contributed by @ersanyamarya
- [mdstat](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mdstat) - Contributed by @johnseekins
- [AMD ROCm System Management Interface (SMI)](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/amd_rocm_smi) - Contributed by @mconcas

#### Output
- [OpenTelemetry](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/opentelemetry) - Contributed by @jacobmarble
- [Azure Data Explorer](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/azure_data_explorer) - Contributed by @minwal

## v.1.19.3 {date="2021-08-19"}

- Update `sirupsen/logrus` module from 1.7.0 to 1.8.1.
- Update `testcontainers/testcontainers-go` module from 0.11.0 to 0.11.1.
- Update `golang/snappy` module from 0.0.3 to 0.0.4.
- Update `aws/aws-sdk-go-v2` module from 1.3.2 to 1.8.0.
- Update `sensu/go` module to v2.9.0.
- Update `hashicorp/consul/api` module to 1.9.1.

### Input plugin updates
- Prometheus (`prometheus`): Fix Kubernetes pod discovery.
- Redis (`redis`) Improve redis commands documentation.
- Clickhouse (`clickhouse`): Fix panic, improve handling empty result set.
- OPC UA: (`opcua`):
  - Avoid closing session on a closed connection.
  - Fix reconnection regression introduced in 1.19.1.
  - Don't skip good quality nodes after encountering bad quality node.
- Kubernetes Inventory (`kube_inventory`): Fix k8s nodes and pods parsing error.
- PostgreSQL (`postgresql`): Normalize unix socket path.
- vSphere (`vsphere`): Update `vmware/govmomi` module to v0.26.0 in order to support vSphere 7.0.

### Output plugin updates
- Loki (`loki`): Sort logs by timestamp before writing to Loki.
- CrateDB (`cratedb`): Replace dots in tag keys with underscores.

### Processor plugin updates
- AWS (`aws`): Refactor EC2 init.

## v.1.19.2 {date="2021-07-28"}

- Update Go to 1.16.6.
- Linter fixes.
- Update `dynatrace-metric-utils-go` module to v0.2.0.
- Detect changes to configuration and reload Telegraf.

### Input plugin updates
- CGroup (`couchbase`): Allow for multiple keys when parsing cgroups.
- Kubernetes (`kubernetes`): Update plugin to attach pod labels to the `kubernetes_pod_volume` and `kubernetes_pod_network` metrics.
- Kubernetes Inventory (`kube_inventory`): Fix a segmentation fault when selector labels were not present on a persistent volume claim.
- MongoDB (`mongodb`): Switch to official `mongo-go-driver` module to fix an SSL authentication failure.
- NSQ Consumer (`couchbase`): Fix a connection error when attempting to connect to an empty list of servers.
- Prometheus (`prometheus`): Fix Prometheus cAdvisor authentication.
- SQL (`sql`): Fix issue when handling a boolean column.
- SQL Server (`sqlserver`):
  - Add TempDB troubleshooting stats and missing v2 query metrics.
  - Update to provide more detailed error messaging.
- StatsD (`statsd`): Fix a regression that didn't allow integer percentiles.
- x509 Certificate (`x509_cert`): Fix an issue where plugin would hang indefinitely to a UDP connection.

### Output plugin updates
- Dynatrace Output (`dynatrace`):
  - Update plugin to allow optional default dimensions.
  - Fix a panic caused by uninitialized `loggedMetrics` map.
- InfluxDB (`influxdb`): Fix issue where metrics were reporting as written but not actually written.

### Processor plugin updates
- IfName (`ifname`): Fix issue with SNMP empty metric name.

### Parser plugin updates
- JSON v2 (`json_v2`):
    - Simplify how nesting is handled in parser.
    - Add support for large uint64 and int64 numbers.
    - Fix an issue to handle nested objects in arrays properly.


## v.1.19.1 {date="2021-07-07"}

- Update nat-server module to v2.2.6.
- Update apimachinary module to v0.21.1.
- Update jwt module to v1.2.2 and jwt-go module to v3.2.3.
- Update couchbase module to v0.1.0.
- Update signalfx module to v3.3.34.
- Update gjson module to v1.8.0.
- Linter fixes.

### Input plugin updates
- SQL Server (`sqlserver`): Require authentication method to be specified.
- Kube Inventory (`kube_inventory`): Fix segfault.
- Couchbase (`couchbase`): Fix panic.
- KNX (`knx_listener`): Fix nil pointer panic.
- Procstat (`procstat`): Update gopsutil module to fix panic.
- RabbitMQ (`rabbitmq`) Fix JSON unmarshall regression.
- Dovecot (`dovecot`): Exclude read-timeout from being an error.
- StatsD(`statsd`) Don't stop parsing after parsing error.
- SNMP (`snmp`): Add a check for oid and name to prevent empty metrics.
- (`x509_cert`):
  - Fix 'source' tag for https.
  - Fix SNI support.

### Output plugin updates
- (`http`): Fix toml error when parsing insecure_skip_verify.

### Parser plugin updates
- (`json_v2`): Don't require tags to be added to included_keys.

## v1.19.0 {date="2021-06-17"}

- Update Go to 1.16.5.

### Bug fixes
- Update pgx to v4. <!-- https://github.com/influxdata/telegraf/pull/9182 -->
- Fix reading configuration files starting with HTTP: <!-- https://github.com/influxdata/telegraf/pull/9275 -->
- `serializers.prometheusremotewrite`: Update dependency and remove tags with empty values. <!-- https://github.com/influxdata/telegraf/pull/9196 -->
- `outputs.kafka`: Don't prevent telegraf from starting when there's a connection error. <!-- https://github.com/influxdata/telegraf/pull/9051 -->
- `parsers.prometheusremotewrite`: Update prometheus dependency to v2.21.0. <!-- https://github.com/influxdata/telegraf/pull/8795 -->
- `outputs.dynatrace`: Use dynatrace-metric-utils. <!-- https://github.com/influxdata/telegraf/pull/9295 -->
- Many linter fixes. (Thanks @zak-pawel and all!)

### Features
- Configuration file environment variable can now be a URL. <!-- https://github.com/influxdata/telegraf/pull/8987 -->
- Add named timestamp formats. <!-- https://github.com/influxdata/telegraf/pull/9087 -->
- Allow multiple `--config` and `--config-directory` flags. <!-- https://github.com/influxdata/telegraf/pull/9007 -->

### Plugin updates

#### Input plugin updates
- (`aliyuncms`): Add configuration option list of regions to query. <!-- https://github.com/influxdata/telegraf/pull/9156 -->
- (`cisco_telemetry_mdt`): Add support for events and class based query. <!-- https://github.com/influxdata/telegraf/pull/8661 -->
- (`cloudwatch`): Add wildcard support in dimensions configuration. <!-- https://github.com/influxdata/telegraf/pull/9136 -->
- (`couchbase`): Add ~200 more Couchbase metrics via buckets endpoint. <!-- https://github.com/influxdata/telegraf/pull/9032 -->
- (`dovecot`): Add support for Unix domain sockets. <!-- https://github.com/influxdata/telegraf/pull/9223 -->
- (`http_listener_v2`): Add support for snappy compression <!-- https://github.com/influxdata/telegraf/pull/8966 -->
- (`http`): Add OAuth2 to HTTP input. <!-- https://github.com/influxdata/telegraf/pull/9138 -->
- (`kinesis_consumer`): Add `content_encoding` option with gzip and zlib support. <!-- https://github.com/influxdata/telegraf/pull/8891 -->
- (`logstash`): Add support for version 7 queue statistics. <!-- https://github.com/influxdata/telegraf/pull/9080 -->
- (`mongodb`): Optionally collect top statistics. <!-- https://github.com/influxdata/telegraf/pull/8861 -->
- (`mysql`): Gather all MySQL channels. <!-- https://github.com/influxdata/telegraf/pull/5517 -->
- (`ping`): Add an option to specify packet size. <!-- https://github.com/influxdata/telegraf/pull/9274 -->
- (`sqlserver`): Add an optional health metric. <!-- https://github.com/influxdata/telegraf/pull/8544 -->
- (`sqlserver`): Added `login_name`. <!-- https://github.com/influxdata/telegraf/pull/8351 -->
- (`sqlserver`): Enable Azure Active Directory (AAD) authentication. <!-- https://github.com/influxdata/telegraf/pull/8822 -->
- (`sqlserver`): input/sqlserver: Add service and save connection pools. <!-- https://github.com/influxdata/telegraf/pull/8596 -->
- (`vsphere`): Add configuration option for the historical interval duration. <!-- https://github.com/influxdata/telegraf/pull/9276 -->
- (`x509_)cert`: Wildcard support for certificate filenames. <!-- https://github.com/influxdata/telegraf/pull/6952 -->

#### Output plugin updates
- (`datadog`): Add HTTP proxy to DataDog output. <!-- https://github.com/influxdata/telegraf/pull/9297 -->
- (`graphite`): Allow more characters in graphite tags. <!-- https://github.com/influxdata/telegraf/pull/9249 -->

#### Parser plugin updates
- (`prometheusremotewrite`): Add Starlark script for renaming metrics. <!-- https://github.com/influxdata/telegraf/pull/9074 -->
- (`value`): Add custom field name configuration option. <!-- https://github.com/influxdata/telegraf/pull/8979 -->

#### Processor plugin updates
- (`enum`): Support `float64`. <!-- https://github.com/influxdata/telegraf/pull/8911 -->
- (`starlark`): Add an example showing how to obtain IOPS from `diskio` input. <!-- https://github.com/influxdata/telegraf/pull/8996 -->
- (`starlark`): Add `math` module. <!-- https://github.com/influxdata/telegraf/pull/9042 -->
- (`starlark`): Add `time` module. <!-- https://github.com/influxdata/telegraf/pull/9004 -->
- (`starlark`): Support nanosecond resolution timestamp. <!-- https://github.com/influxdata/telegraf/pull/9105 -->
- (`strings`): Add UTF-8 sanitizer. <!-- https://github.com/influxdata/telegraf/pull/9118 -->

### New plugins

#### Input
- [Alibaba CloudMonitor Service (Aliyun)](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/aliyuncms) - Contributed by @i-prudnikov
- [Intel Data Plane Development Kit (DPDK)](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/dpdk) - Contributed by @p-zak
- [KNX](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/knx_listener) - Contributed by @DocLambda
- [OpenTelemetry](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/opentelemetry) - Contributed by @jacobmarble
- [SQL](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/sql) - Contributed by @srebhan

#### Output
- [AWS Cloudwatch logs](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/cloudwatch_logs) - Contributed by @i-prudnikov
- [SQL](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/sql) - Contributed by @illuusio
- [Websocket](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/websocket) - Contributed by @FZambia

#### Parser
- [Prometheus Remote Write](https://github.com/influxdata/telegraf/tree/master/plugins/parsers/prometheusremotewrite) - Contributed by @influxdata
- [JSON V2](https://github.com/influxdata/telegraf/tree/master/plugins/parsers/json_v2) - Contributed by @influxdata

#### External
- [Big Blue Button](https://github.com/SLedunois/bigbluebutton-telegraf-plugin) - Contributed by @SLedunois
- [dnsmasq](https://github.com/machinly/dnsmasq-telegraf-plugin) - Contributed by @machinly
- [ldap_org and ds389](https://github.com/falon/CSI-telegraf-plugins) - Contributed by @falon
- [x509_crl](https://github.com/jcgonnard/telegraf-input-x590crl) - Contributed by @jcgonnard

## v1.18.3 {date="2021-05-21"}

- Add FreeBSD ARMv7 build.
- Dependencies:
  - Migrate from `soniah/gosnmp` to `gosnmp/gosnmp` v1.32.0.
  - Migrate from `docker/libnetwork/ipvs` to `moby/ipvs`.
  - Migrate from `ericchiang/k8s` to `kubernetes/client-go`.
  - Update `hashicorp/consul/api` module to v1.8.1.
  - Update `shirou/gopsutil` to v3.21.3.
  - Update `microsoft/ApplicationInsights-Go` to v0.4.4
  - Update `gogo/protobuf` to v1.3.2.
  - Update `Azure/go-autorest/autorest/azure/auth` to v0.5.6 and `Azure/go-autorest/autorest` to v0.11.17.
  - Update `collectd.org` to v0.5.0.
  - Update `nats-io/nats.go` to v1.10.0.
  - Update `golang/protobuf` to v1.5.1.


### Input plugin updates

- [Prometheus Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/prometheus): Add ability to set user agent when scraping Prometheus metrics.
- [Kinesis Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/kinesis_consumer): Fix repeating parser error.
- [SQL Server Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/sqlserver): Remove disallowed white space from `sqlServerRingBufferCPU` query.

### Output plugin updates

- [Elasticsearch Output](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/elasticsearch/README.md): Add ability to to enable gzip compression.



## v1.18.2 {date="2021-04-29"}

- Make JSON format compatible with nulls to ensure Telegraf successfully detects null values and returns an empty metric without error.
- Update `common.shim` by changing `NewStreamParser` to accept larger inputs from scanner.

### Input plugin updates

- [APCUPSD Input](https://github.com/influxdata/telegraf/blob/release-1.18/plugins/inputs/apcupsd/README.md) (`apcupsd`):
   Resolve an 'ALARMDEL' bug in a forked repository. This fix ensures the plugin works when `no alarm` delay duration is set.
- [NFS Client Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/nfsclient) (`nfsclient`): Update to successfully collect metrics other than read and write.
- [SNMP Input](https://github.com/influxdata/telegraf/blob/release-1.18/plugins/inputs/snmp/README.md) (`snmp`): Update to log snmpv3 auth failures.
- [VMware vSphere Input](https://github.com/influxdata/telegraf/blob/release-1.18/plugins/inputs/vsphere/README.md) (`vsphere`): Add `MetricLookback` setting to handle reporting delays in vCenter 6.7 and later.
- [OPC UA Client Input](https://github.com/influxdata/telegraf/blob/release-1.18/plugins/inputs/opcua/README.md) (`opcua`): Fix error handling.

### Output plugin updates

-  [Sumo Logic Output](https://github.com/influxdata/telegraf/blob/release-1.18/plugins/outputs/sumologic/README.md) (`sumologic`): Add support to [sanitize the metric name](https://github.com/influxdata/telegraf/tree/release-1.18/plugins/serializers/carbon2#metric-name-sanitization) in Carbon2 serializer.

### Processor plugin updates

- [Converter Processor](https://github.com/influxdata/telegraf/blob/release-1.18/plugins/processors/converter/README.md) (`converter`):
   Add support for `float64` to support converting longer hexadecimal string values to a numeric type without losing in precision. Note, if a string number exceeds the size limit for `float64`, precision may be lost.

## v1.18.1 {date="2021-04-07"}

- Agent: Closes running outputs when agent reloads on SIGHUP.

### Input plugin updates

- [Docker Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/docker) (`docker`):
  Fix panic when parsing container statistics.
- [Exec Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/exec) (`exec`):
  Fix truncated messages in debug mode; debug mode now shows full messages.
- [IPMI Sensor Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ipmi_sensor) (`ipmi_sensor`):
  Fix panic by implementing a length check to plugin.
- [MySQL Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/mysql) (`mysql`):
  Fix the ability to handle ‘binary logs’ query for MySQL version 8.0+.
- [NFS Client Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/nfsclient) (`nfsclient`):
  Fix integer overflow in fields received by mountstat.
- [Ping Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ping) (`ping`):
  Resolve error that prevented the agent from running when an unprivileged UDP ping was sent. Now, `SetPrivileged(true)` is always true in native mode to ensure a privileged ICMP ping is sent.
- [SNMP Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/snmp) (`snmp`):
  Fix `init()` when no MIBs are installed.
- [SQL Server Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/sqlserver) (`sqlserver`):
  Fix `sqlserver_process_cpu` calculation.
- [Tail Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/tail) (`tail`):
  Added configurable option to override `path` tag.

### Output plugin updates

- [Azure Monitor Output](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/azure_monitor) (`azure_monitor`):
  Fix an issue to handle error when initializing the authentication object.
- [Yandex Cloud Monitoring Output](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/yandex_cloud_monitoring) (`yandex_cloud_monitoring`):
  Fix an issue to use correct computed metadata URL to get `folder-id`.

### Processor plugin updates

- [ifName](https://github.com/influxdata/telegraf/tree/master/plugins/processors/ifname) (`ifname`):
  Retrieve interface name more efficiently.


## v1.18 {date="2021-03-17"}

### Features
- Update to Go 1.16.2.
- Add code signing for Windows and macOS.
- More SNMP v3 authentication protocols, including SHA-512.
- Add support for [DataDog distributions](https://docs.datadoghq.com/metrics/distributions/#counting-distribution-metrics) metric type.

### New plugins

#### Inputs
- [Beat](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/beat)(`beat`) - Contributed by [@nferch](https://github.com/nferch)
- [CS:GO](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/csgo)(`csgo`) - Contributed by [@oofdog](https://github.com/oofdog)
- [Directory Monitoring](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/directory_monitor)(`directory_monitor`) - Contributed by [@influxdata](https://github.com/influxdata)
- [NFS](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/nfsclient)(`nfsclient`) - Contributed by [@pmoranga](https://github.com/pmoranga)
- [RavenDB](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/ravendb)(`ravendb`) - Contributed by [@ml054](https://github.com/ml054) and [@bartoncasey](https://github.com/bartoncasey)

#### Outputs
- [Grafana Loki](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/loki)(`loki`) - Contributed by [@eraac](https://github.com/eraac)
- [Sensu](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/sensu)(`sensu`) - Contributed by [@calebhailey](https://github.com/calebhailey)
- [SignalFX](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/signalfx)(`signalfx`) - Contributed by [@keitwb](https://github.com/keitwb)

#### External
- [GeoIP](https://github.com/a-bali/telegraf-geoip)(`geoip`) - Contributed by [@a-bali](https://github.com/a-bali)
- [Plex Webhook](https://github.com/russorat/telegraf-webhooks-plex)(`plex`) - Contributed by [@russorat](https://github.com/russorat)
- [SMCIPMI](https://github.com/jhpope/smc_ipmi)(`smc_ipmi`) - Contributed by [@jhpope](https://github.com/jhpope)

#### Aggregators
- [Derivative](https://github.com/influxdata/telegraf/tree/master/plugins/aggregators/derivative)(`derivative`) - Contributed by [@KarstenSchnitter](https://github.com/karstenschnitter)
- [Quantile](https://github.com/influxdata/telegraf/tree/master/plugins/aggregators/quantile)(`quantile`) - Contributed by [@srebhan](https://github.com/srebhan)

#### Processors
- [AWS EC2 Metadata](https://github.com/influxdata/telegraf/tree/master/plugins/processors/aws/ec2)(`aws_ec2`) - Contributed by [@pmalek-sumo](https://github.com/pmalek-sumo)

#### Parsers
- [XML](https://github.com/influxdata/telegraf/tree/master/plugins/parsers/xml)(`xml`) - Contributed by [@srebhan](https://github.com/srebhan)

#### Serializers
- [MessagePack](https://github.com/influxdata/telegraf/tree/master/plugins/serializers/msgpack)(`msgpack`) - Contributed by [@dialogbox](https://github.com/dialogbox)


## v.1.17.3 {date="2021-02-17"}

- Update to Go 1.15.8.

### Input plugin updates

- Filestat (`filestat`): Skip missing files.
- MQTT Consumer (`mqtt_consumer`): Fix reconnection issues.
- Ping (`ping`):
  - Fix a timeout for `deadline` configuration.
  - Update README with correct cmd for native ping on Linux.
  - Fix percentile calculations.
- SNMP (`snmp`): Add support to expose IPv4/IPv6 as connection-schemes.
- x509 Certificate (`x509_cert`): Fix a timeout issue.
-
### Output plugin updates

- InfluxDB v1.x (`influxdb`): Validate InfluxDB response after creating a database to avoid JSON parsing errors.
- Warp10 (`warp10`): Add support for commas in tags to be URL encoded.

### Miscellaneous fixes and updates

- Telegraf configuration file (`telegraf.conf`): Resolve issue reading `flush_jitter` output.
- Library updates:
   - Update `github.com/gopcua/opcua` to 0.1.13.
   - Update `go-ping` to latest version.

## v.1.17.2 {date="2021-01-28"}

### Input plugin updates
- `ping`:
  - Added support to the interface in native mode using either the name or IP address.
  - Resolved regression from 1.17.1 by adding back missing function.

## v.1.17.1 {date="2021-01-27"}

### Features
- Add Event Log support for Windows platforms.
- Allow specifying SNI hostnames in `common.tls`.

### Input plugin updates
- `csv`:
  - Add  ability to define an array of string skip values.
  - Address issue of ignoring missing values.
- `gnmi`: Metric path no longer has leading character truncated.
- `http_listener_v2`: Fixed an issue with `stop()` when plugin fails to start.
- `ipmi_sensor`:
  - Add setting to enable caching.
  - Add `hex_key` parameter.
- `jenkins`: Add support for inclusive job list.
- `lustre2`: No longer crashes if the field name and value are not separated.
- `ping`: Use go-ping library when `method = "native"` in the configuration
- `prometheus`: Use mime-type to handle protocol-buffer responses.
- `procstat`:
  - Provide an option to include core count when reporting `cpu_usage`
  - Use the same timestamp for all metrics in the same `Gather()` cycle.
- `postgresql_extensible`: Add timestamp column option to postgres_extensible to handle log-like queries.
- `snmp`: Extended the internal SNMP wrapper to support AES-192, AES-192C, AES-256, and AES-256C.
- `webhooks`: Use the `measurement` json field from the Particle.io webhook as the measurement name.
- `x509_cert`: Fixed a timeout issue
- `zookeeper`: Improve `mntr` regex expression to match user-specific keys.

### Output plugin updates

- `http`: Add option to control idle connection timeout.
- `influxdb_v2`:
  - Log no longer flooded with errors when Elasticsearch receiver is in read-only state.
  - Add exponential backoff and respecting client error responses.

### Aggregator plugin updates
- `merge`: Performance optimization improvements.

## v1.17.0 {date="2020-12-17"}

### Features
- Update Go to 1.15.5.
- Added support for Linux/ppc64le.

### New plugins

#### Inputs

- [Intel Powerstat](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/intel_powerstat/README.md)(`intel_powerstat`)
- [Riemann Listener](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/riemann_listener/README.md)(`riemann`)

#### Outputs

- [Logz.io](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/logzio/README.md)(`logzio`)
- [Yandex Cloud Monitoring](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/yandex_cloud_monitoring/README.md)(`yandex_cloud_monitoring`)

#### Output data formats (serializers)

- [Prometheus Remote Write](https://github.com/influxdata/telegraf/blob/master/plugins/serializers/prometheusremotewrite/README.md)(`prometheusremotewrite`)

#### Parsers

- [Prometheus](https://github.com/influxdata/telegraf/blob/master/plugins/parsers/prometheus/README.md)(`prometheus`)

### Input plugin updates

- `aerospike`: Fix edge case where unexpected hex string was converted to integer if all digits.
- `bcache`: Fix tests for Windows.
- `bind`: Add configurable timeout.
- `carbon2`: Fix tests.
-  `ecs`: Remove duplicated field from `ecs_task`.
- `execd`: Add support for new lines in line protocol fields.
- `github`: Add query of pull request statistics.
- `graphite`: Parse tags.
- `http`: Add proxy support.
- `http_response`: Fix network test.
- `jenkins`: Add build number field to `jenkins_job` measurement.
- `kafka_consumer`: Enable `ztsd` compression and idempotent writes.
- `kube_inventory`:
    - Fix issue with missing metrics when pod has only pending containers.
    - Update string parsing of allocatable cpu cores.
- `modbus`: Add FLOAT64-IEEE support.
- `monit`: Add `response_time`.
- `mysql`: Add per user metrics.
- `mqtt_consumer`: Fix issue with concurrent map write.
- `opcua`Add node groups.
- `ping`:
  - Add percentiles.
  - Fix potential issue with race condition.
- `snmp`:
  - Add support for converting hex strings to integers.
  - Translate field values.
- `socket_listener`: Fix crash when receiving invalid data.
- `sqlserver`:
  - Add tags for monitoring readable secondaries for Azure SQL MI.
  - Add SQL Server HA/DR Availability Group queries.
  - Remove duplicate column (`session_db_name`).
  - Add column `measurement_db_type` to output of all queries if not empty.
- `statsd`: Add configurable Max TTL duration.
- `vsphere`: Fix spelling of datacenter check.
- `win_services`: Add Glob pattern matching.
- `zfs`: Add dataset metrics.

### Output plugin updates

- `kafka`: Enable `ztsd` compression and idempotent writes.
-  `nats`: Add `name` parameter.

### Processor plugin updates

- `starlark`: Can now store state between runs using a global state variable.

## v1.16.3 {date="2020-12-01"}

### Features
- Update `godirwalk` to 1.16.1 for Dragonfly BSD support.

### Input plugin updates
- APCUPSD (`apcupsd`): Add driver and CUDA version.
- CSV Parser (`csv`): Fix issue where CSV timestamp was being read as Unix instead of Go reference time.
- gNMI (`gnmi`): Add logging of `SubscribeResponse_Error` response types.

- NVIDIA SMI (`nvidia_smi`): Add driver and CUDA version.
- PHP-FPM (`phpfpm`): Fix issue with "index out of range" error.
- SQL Server (`sqlserver`): Fix typo in `database_name` column.

### Output plugin updates
- Wavefront (`wavefront`):
  - Distinguish between retryable and non-retryable errors .
  - Add debug-level logging for metric data that is not retryable.

### Parser plugin updates
- Starlark (`starlark`):
  - Allow the processor to manage errors that occur in the `apply` function.
  - Add support for logging.
  - Add capability to return multiple metrics.

## v1.16.2 {date="2020-11-13"}

### Input plugin updates

- CSV Parser (`csv`): Fix parsing multiple CSV files with different headers.
- DC/OS (`dcos`): Fix high-severity vulnerability in previous version of the `jwt-go` library.
- gNMI (`gnmi`): Add support for bytes encoding for gNMI messages.
- Proxmox ( `proxmox`):
  - Fix a few issues with error reporting.
  - Now ignores QEMU templates.
- RAS (`ras`): Fix tests failing on some systems.
- Redfish (`redfish`): Fix a parsing issue.
- SMART (`smart`): Fix an issue to recognize all devices from the configuration.
- SQL Server (`sqlserver`): Fix an issue with errors in on-premise instance queries.
- Systemd Units (`systemd_units`): Add `--plain` to the command invocation to fix an issue for reporting errors for units not found.
- vSphere (`vsphere`)
  - Fix to how metrics were counted.
  - Fix to metrics being skipped under in certain specific circumstances.

### Output plugin updates

- Dynatrace (`dynatrace`): Fix pushing metrics to separate Dynatrace environments.
- Wavefront (`wavefront`): Add `immediate_flush` tag.

## v1.16.1 {date="2020-10-28"}

### Input plugin updates

- Apache Kafka Consumer (`kafka_consumer`): Add Kafka SASL-mechanism authentication support for SCRAM-SHA-256, SCRAM-SHA-512, and GSSAPI.
- Microsoft SQL Server (`sqlserver`):
  - Fix a syntax error in Azure queries.
  - Remove synthetic performance counters that no longer exist from the `sqlserver_performance_counters` measurement.
  - Add a new tag (`sql_version_desc`) to identify the readable SQL Server version.
- RAS (`ras`):
  - Disable on specific Linux architectures (MIPS64, mips64le, ppc64le, riscv64).
  - Fix an issue to properly close file handlers.
- Processes (`processes`): Fix an issue with receiving `no such file or directory` stat error.
- Windows Performance Counters (`win_perf_counters`): Fix an issue with the counter where a negative denominator error would cause gathering operations to fail.

### Output plugin updates

- Apache Kafka (`kafka`): Add Kafka SASL-mechanism authentication support for SCRAM-SHA-256, SCRAM-SHA-512, GSSAPI.

## v1.16.0 {date="2020-10-21"}

### New plugins

#### Inputs

- [InfluxDB v2 Listener Input Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/influxdb_v2_listener/README.md)(`influxdb_v2_listener`) - Contributed by [@magichair](https://github.com/magichair)
- [Intel RDT Input Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/intel_rdt/README.md)(`intel_rdt`) - Contributed by [@p-zak](https://github.com/p-zak)
- [NSD Input Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/nsd/README.md)(`nsd`) - Contributed by [@gearnode](https://github.com/gearnode)
- [OPC UA Input Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/opcua/README.md)(`opcua`) - Contributed by [@influxdata](https://github.com/influxdata)
- [Proxmox Input Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/proxmox/README.md)(`proxmox`) - Contributed by [@effitient](https://github.com/effitient)
- [RAS Input Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/ras/README.md)(`ras`)- Contributed by [@p-zak](https://github.com/p-zak)
- [Windows Eventlog Input Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/win_eventlog/README.md)(`win_eventlog`) - Contributed by [@simnv](https://github.com/simnv)

#### Outputs

- [Dynatrace Output Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/dynatrace/README.md)(`dynatrace`) - Contributed by [@thschue](https://github.com/theschue)
- [Sumo Logic Output Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/sumologic/README.md) (`sumologic`) - Contributed by [@pmalek-sumo](https://github.com/pmalek-sumo)
- [Timestream Output Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/timestream) (`timestream`) - Contributed by [@piotrwest](https://github.com/piotrwest)


#### External

- [Amazon Cloudwatch Alarms Input Plugin](https://github.com/vipinvkmenon/awsalarms)(`awsalarms`) - Contributed by [@vipinvkmenon](https://github.com/vipinvkmenon)
- [YouTube Input Plugin](https://github.com/inabagumi/youtube-telegraf-plugin)(`youtube`) - Contrbuted by [@inabagumi](https://github.com/inabagumi)
- [Octoprint Input Plugin](https://github.com/sspaink/octoprint-telegraf-plugin)[`octoprint`] - Contributed by [@sspaink](https://github.com/sspaink/)
- [Systemd Timings Input Plugin](https://github.com/pdmorrow/telegraf-execd-systemd-timings)(`systemd-timings`) - Contributed by [@pdmorrow](https://github.com/pdmorrow)


### Input plugin updates

- `aerospike`: Add set and histogram reporting.
- `agent`:
  - Send metrics in FIFO order.
  - Fix issue with `execd restart_delay` being ignored.
  - Sort plugin name lists for output.
- `clickhouse`: Add additional metrics.
- `cloudwatch`: Implement AWS CloudWatch Input Plugin ListMetrics API calls to use Active Metric Filter.
- `consul`: Add `metric_version` flag.
- `docker`: Fix vulnerabilities found in BDBA scan.
- `execd`: Fix issue with `restart_delay` being ignored.
- `gnmi`: Next message after send returns EOF.
- `http_listener_v2`: Make header tags case-insensitive.
- `http_response`: Match on status code.
- `jenkins`: Multiple escaping occurs on at certain folder depth.
- `kubernetes`: Add missing error check for HTTP requirement failure.
- `modbus`: Extend support of fixed point values on input.
- `mongodb`: Add pages written from cache metric.
- `net`: Fix broken link to `proc.c`.
- `snmp` Add agent host tag configuration option.
- `smart`: Add missing NVMe attributes.
- `sqlserver`:
  - Database_type config to Split up sql queries by engine type
  - Fixed query mapping
  - New refactoring and formatting queries.
  - Add more performance counters.
- `tail`:
  - Close file to ensure it has been flushed.
  - Fix following on EOF.

### Output plugin updates

-  `elasticsearch`: Added `force_document_id` option to ES output enable resend data and avoid duplicated ES documents.
- `opentsdb`: Skips NaN and Inf JSON values.

### Processor plugin updates

- `execd`: Increased the maximum serialized metric size in line protocol
- `ifname`: Add `addTag` debugging.
- `starlark`: Add JSON parsing support.

### Bug fixes

- Fix `darwin` package build flags.
- `shim`:
  - Fix bug with loading plugins with no config.
  - Logger improvements.
  - Fix issue with loading processor config from `execd`.
- Initialize aggregation processors.
- Fix arch name in `deb/rpm` builds.
- Fix issue with `rpm /var/log/telegraf` permissions
- Fix `docker-image make` target.
- Remove Event field from `serializers.splunkmetric`.
- Fix panic on streaming processors using logging
- `ParseError.Error` panic in `parsers.influx`
- Fix `procstat` performance regression
- Fix serialization when using `carbon2`.
- Fix bugs found by LGTM analysis platform.
- Update to Go 1.15.2

## v.1.15.3 {date="2020-09-11"}

### Features
- `processors.starlark`:
  - Improve the quality of docs by executing them as tests.
  - Add pivot example.
- `outputs.application_insights`: Added ability to set endpoint url.
- `inputs.sqlserver`: Added new counter - Lock Timeouts (timeout > 0)/sec.

### Bug fixes

- `agent`: Fix minor error message race condition.
- `build`: Update dockerfiles to Go 1.14.
- `shim`:
  - Fix bug in logger affecting `AddError`.
  - Fix issue with `config.Duration`.
- `inputs.eventhub_consumer`: Fix string to int conversion.
- `inputs.http_listener_v2`: Make http header tags case-insensitive.
- `inputs.modbus`: Extend support of fixed point values.
- `inputs.ping`: Fix issue for FreeBSD's ping6.
- `inputs.vsphere`: Fixed missing cluster name.
- `outputs.opentsdb` Fix JSON handling of values `NaN` and `Inf`.

## v1.15.2 {date="2020-07-31"}

### Bug Fixes
- Fix RPM `/var/log/telegraf` permissions.
- Fix tail following on EOF.

## v1.15.1 {date="2020-07-22"}

### Bug fixes

- Fix architecture in non-amd64 deb and rpm packages.

## v1.15.0 {date="2020-07-22"}

{{% warn %}}
Critical bug that impacted non-amd64 packages was introduced in 1.15.0. **Do not install this release.** Instead, install 1.15.1, which includes the features, new plugins, and bug fixes below.
{{% /warn %}}

### Breaking changes

Breaking changes are updates that may cause Telegraf plugins to fail or function incorrectly. If you have one of the following plugins installed, make sure to update your plugin as needed:

- **Logparser** (`logparser`) input plugin: Deprecated. Use the `tail` input with `data_format = "grok"` as a replacement.
- **Cisco GNMI Telemetry** (`cisco_telemetry_gnmi`) input plugin: Renamed to `gnmi` to better reflect its general support for gNMI devices.
- **Splunkmetric** (`splunkmetric`) serializer: Several fields used primarily for debugging have been removed. If you are making use of these fields, they can be added back with the `tag` option.

### New plugins

#### Inputs

- [NGINX Stream STS Input Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/nginx_sts/README.md)(`nginx_sts`) - Contributed by [@zdmytriv](https://github.com/zdmytriv)
- [Redfish Input Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/redfish/README.md)(`redfish`) - Contributed by [@sarvanikonda](https://github.com/sarvanikonda)

#### Outputs

- [Execd Output Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/execd/README.md)(`execd`) - Contributed by [@influxdata](https://github.com/influxdata)
- [New Relic Output Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/newrelic/README.md)(`newrelic`) - Contributed by @hsingkalsi
#### Processors

- [Defaults Processor Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/processors/defaults/README.md)(`defaults`) - Contributed by [@jregistr](https://github.com/jregistr)
- [Execd Processor Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/processors/execd/README.md)(`execd`) - Contributed by [@influxdata](https://github.com/influxdata)
- [Filepath Processor Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/processors/filepath/README.md)(`filepath`) - Contributed by [@kir4h](https://github.com/kir4h)
- [Network Interface Name Processor Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/processors/ifname/README.md)(`ifname`) - Contributed by [@influxdata](https://github.com/influxdata)
- [Port Name Processor Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/processors/port_name/README.md)(`port_name`) - Contributed by [@influxdata](https://github.com/influxdata)
- [Reverse DNS Processor Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/processors/reverse_dns/README.md)(`reverse_dns`) - Contributed by [@influxdata](https://github.com/influxdata)
- [Starlark Processor Plugin](https://github.com/influxdata/telegraf/blob/master/plugins/processors/starlark/README.md)(`starlark`) - Contributed by [@influxdata](https://github.com/influxdata)

### Features

- Telegraf's `--test` mode runs processors and aggregators before printing metrics.
- Official packages built with Go 1.14.5.
- When updating the Debian package, you will no longer be prompted to merge the `telegraf.conf` file. Instead, the new version will be installed to `/etc/telegraf/telegraf.conf.sample`. The `tar` and `zip` packages now include the version in the top-level directory.
- Allow per input overriding of `collection_jitter` and `precision`.
- Deploy Telegraf configuration as `telegraf.conf.sample`.
- Use Docker log timestamp as metric time.
- Apply ping deadline to DNS lookup.
- Support multiple templates for graphite serializers.
- Add configurable separator graphite serializer and output.
- Add support for SIGUSR1 to trigger flush.
- Add support for once mode that writes to outputs and exits.
- Run processors and aggregators during test mode.
- Add timezone configuration to CSV parser.


#### Input plugin updates

- **Ceph Storage** (`ceph`): Add support for MDS and RGW sockets.
- **ECS** (`ecs`): Add v3 metadata support.
- **Fibaro** (`fibaro`): Add support for battery-level monitoring.
- **File** (`file`):
  - Support UTF-16.
  - Exclude `csv_timestamp_column` and `csv_measurement_column` from fields.
- **HTTP** (`http`): Add reading bearer token.
- **HTTP Listener v2** (`http_listener_v2`): Add ability to specify HTTP headers as tags.
- **HTTP Response** (`http_response`):
  - Add authentication support.
  - Allow collection of HTTP headers.
  - Add ability to collect response body as field.
- **Icinga 2** (`icinga2`):
  - Fix source field.
  - Add tag for server hostname.
- **InfluxDB Listener** (`influxdb_listener`): Add option to save retention policy as tag.
- **IPtables** (`iptables`): Extract target as a tag for each rule.
- **Kibana** (`kibana`): Fix `json unmarshal` error.
- **Kubernetes Inventory** (`kube_inventory`): Add ability to add selectors as tags.
- **Mem** (`mem`): Add laundry on FreeBSD.
- **Microsoft SQL Server** (`sqlserver`):
  - Add `VolumeSpace` query.
  - Add `cpu` query.
  - Add counter type to `perfmon` collector.
  - Improve compatibility with older server versions.
  - Fix typo in `total_elapsed_time_ms` field.
- **Modbus** (`modbus`):
  - Add support for 64-bit integer types.
  - Add retry when replica is busy.
  - Add ability to specify measurement per register.
- **MongoDB** (`monogdb`):
  - Add commands stats.
  - Add additional fields.
  - Add cluster state integer.
  - Add option to disable cluster status.
  - Add additional conccurrent transaction information.
- **NVIDIA SMI** (`nvidia_smi`): Add video codec stats.
- **Procstat** (`procstat`):
  - Improve performance.
  - Fix memory leak.
- **S.M.A.R.T.** (`smart`): Add missing `nvme` attributes.
- **SNMP Trap** (`snmp_trap`): Add SNMPv3 trap support.
- **System** (`system`): Fix incorrect uptime when clock is adjusted.
- **Tail** (`tail`): Support UTF-16.

#### Output plugin updates

- **Enum** (`enum`): Add integer mapping support.

#### Processor plugin updates

- **Date** (`date`):
  - Add field creation.
  - Add integer unix time support.
- **Wavefront** (`wavefront`): Add `truncate_tags` setting.


### Bug fixes
- Fix ability to write metrics to CloudWatch with IMDSv1 disabled.
- Fix vSphere 6.7 missing data issue.
- Fix gzip support in `socket_listener` with tcp sockets.
- Fix interval drift when `round_interval` is set in agent.
- Fix incorrect uptime when clock is adjusted.
- Remove trailing backslash from tag keys/values in `influx` serializer.
- Fix incorrect Azure SQL DB server properties.
- Send metrics in FIFO order.

## v1.14.5 {date="2020-06-30"}

### Bug fixes

- Improve the performance of the `procstat` input.
- Fix ping exit code handling on non-Linux operating systems.
- Fix errors in output of the `sensors` command.
- Prevent startup when tags have incorrect type in configuration file.
- Fix panic with GJSON multiselect query in JSON parser.
- Allow any key usage type on x509 certificate.
- Allow histograms and summary types without buckets or quantiles in `prometheus_client` output.

## v1.14.4 {date="2020-06-09"}

### Bug fixes

- Fix the `cannot insert the value NULL` error with the `PerformanceCounters` query in the `sqlServer` input plugin.
- Fix a typo in the naming of `the gc_cpu_fraction` field in the `influxdb` input plugin.
- Fix a numeric to bool conversion in the `converter` processor.
- Fix an issue with the `influx` stream parser blocking when the data is in buffer.

## v1.14.3 {date="2020-05-19"}

### Bug fixes

- Use same timestamp for all objects in arrays in the `json` parser.
- Handle multiple metrics with the same timestamp in `dedup` processor.
- Fix reconnection of timed out HTTP2 connections `influxdb` outputs.
- Fix negative value parsing in `impi_sensor` input.

## v1.14.2 {date="2020-04-28"}

### Bug fixes

- Trim white space from instance tag in `sqlserver` input .
- Use increased AWS Cloudwatch GetMetricData limit of 500 metrics per call.
- Fix limit on dimensions in `azure_monitor` output.
- Fix 64-bit integer to string conversion in `snmp` input.
- Fix shard indices reporting in `elasticsearch` input plugin.
- Ignore fields with Not a Number or Infinity floats in the JSON serializer.
- Fix typo in name of `gc_cpu_fraction` field of the `kapacitor` input.
- Don't retry create database when using database_tag if forbidden by the server in `influxdb` output.
- Allow CR and FF inside of string fields in InfluxDB line protocol parser.

## v1.14.1 {date="2020-04-14"}

### Bug fixes

- Fix `PerformanceCounter` query performance degradation in `sqlserver` input.
- Fix error when using the `Name` field in template processor.
- Fix export timestamp not working for Prometheus on v2.
- Fix exclude database and retention policy tags.
- Fix status path when using globs in `phpfpm`.

## v1.14 {date="2020-03-26"}

### Breaking changes

Breaking changes are updates that may cause Telegraf plugins to fail or function incorrectly. If you have one of the following plugins installed, make sure to update your plugin as needed:

- **Microsoft SQL Server** (`sqlserver`) input plugin: Renamed the `sqlserver_azurestats` measurement to `sqlserver_azure_db_resource_stats` to resolve an issue where numeric metrics were previously being reported incorrectly as strings.
- **Date** (`date`) processor plugin: Now uses the UTC timezone when creating its tag. Previously, the local time was used.

{{% note %}}
Support for SSL v3.0 is deprecated in this release.
Telegraf now uses the [Go TLS library](https://golang.org/pkg/crypto/tls/).
{{% /note %}}

### New plugins

#### Inputs

- [Arista LANZ Consumer](https://github.com/influxdata/telegraf/blob/release-1.14/plugins/inputs/lanz/README.md) - Contributed by [@timhughes](https://github.com/timhughes)
- [ClickHouse](https://github.com/influxdata/telegraf/blob/release-1.14/plugins/inputs/clickhouse/README.md)(`clickhouse`) - Contributed by [@kshvakov](https://github.com/kshvakov)
- [Execd](https://github.com/influxdata/telegraf/blob/release-1.14/plugins/inputs/execd/README.md)(`execd`) - Contributed by [@jgraichen](https://github.com/jgraichen)
- [Event Hub Consumer](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/eventhub_consumer/README.md)(`eventhub_consumer`) - Contributed by [@R290](https://github.com/R290)
- [InfiniBand](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/infiniband/README.md)(`infiniband`) - Contributed by [@willfurnell](https://github.com/willfurnell)
- [Modbus](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/modbus/README.md)(`modbus`) - Contributed by [@garciaolais](https://github.com/garciaolais)
- [Monit](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/monit/README.md)(`monit`) - Contributed by [@SirishaGopigiri](https://github.com/SirishaGopigiri)
- [SFlow](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/sflow/README.md)(`sflow`) - Contributed by [@influxdata](https://github.com/influxdata)
- [Wireguard](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/wireguard/README.md)(`wireguard`) - Contributed by [@LINKIWI](https://github.com/LINKIWI)

#### Processors

- [Dedup](https://github.com/influxdata/telegraf/blob/master/plugins/processors/dedup/README.md)(`dedup`) - Contributed by [@igomura](https://github.com/igomura)
- [S2 Geo](https://github.com/influxdata/telegraf/blob/master/plugins/processors/s2geo/README.md)(`s2geo`) - Contributed by [@alespour](https://github.com/alespour)
- [Template](https://github.com/influxdata/telegraf/blob/master/plugins/processors/template/README.md) (`template`) - Contributed by [@RobMalvern](https://github.com/RobMalvern)

#### Outputs

- [Warp10](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/warp10/README.md)(`warp10`) - Contributed by [@aurrelhebert](https://github.com/aurrelhebert)

### Features

#### Input plugin updates

- **Apache Kafka Consumer** (`kafka_consumer`): Add SASL version control to support Microsoft Azure Event Hub.
- **Apcupsd** (`apcupsd`): Add new tag `model` and new metrics: `battery_date`, `nominal_input_voltage`, `nominal_battery_voltage`, `nominal_power`, `firmware`.
- **Cisco Model-driven Telemetry (MDT)** (`cisco_telemetry_gnmi`) input plugin:
  - Add support for GNMI DecimalVal type.
  - Replace dash (`-`) with underscore (`_`) when handling embedded tags.
- **DiskIO** (`diskio`): Add counters for merged reads and writes.
- **IPMI Sensor** (`ipmi_sensor`): Add `use_sudo` option.
- **Jenkins** (`jenkins`):
  - Add `source` and `port` tags to `jenkins_job` metrics.
  - Add new fields `total_executors` and `busy_executors`.
- **Kubernetes** (`kubernetes`): Add ability to collect pod labels.
- **Microsoft SQL Server** (`sqlserver`):
  - Add RBPEX IO statistics to DatabaseIO query.
  - Add space on disk for each file to DatabaseIO query.
  - Calculate DB Name instead of GUID in `physical_db_name`.
  - Add `DatabaseIO` TempDB per Azure DB.
  - Add `query_include` option for explicitly including queries.
  - Add `volume_mount_point` to DatabaseIO query.
- **MongoDB** (`mongodb`):
  - Add `page_faults` for WiredTiger storage engine.
  - Add latency statistics.
  - Add replica set tag (`rs_name`).
- **NATS Consumer** (`nats_consumer`): Add support for credentials file.
- **NGINX Plus API** (`nginx_plus_api`): Add support for new endpoints.
- **OpenLDAP** (`openldap`): Add support for MDB database information.
- **PHP-FPM** (`phpfpm`): Allow globs in FPM unix socket paths (`unixsocket`).
- **Procstat** (`procstat`): Add process `created_at` time.
- **Prometheus** (`prometheus`) input plugin: Add `label` and `field` selectors for Kubernetes service discovery.
- **RabbitMQ** (`rabbitmq`): Add `slave_nodes` and `synchronized_slave_nodes` metrics.
- **StatsD** (`statsd`): Add UDP internal metrics.
- **Unbound** (`unbound`): Expose [`-c cfgfile` option of `unbound-control`](https://linux.die.net/man/8/unbound-control) and set the default unbound configuration (`config_file= "/etc/unbound/unbound.conf`) in the Telegraf configuration file.
- **VMware vSphere** (`vsphere`): Add option to exclude resources by inventory path, including `vm_exclude`, `host_exclude`, `cluster_exclude` (for both clusters and datastores), and `datacenter_exclude`.
- **X.509 Certificate** (`x509_cert`): Add `server_name` override.

#### Output plugin updates

- **Apache Kafka** (`kafka`): Add `topic_tag` and `exclude_topic_tag` options.
- **Graylog** (`graylog`): Allow a user defined field (`short_message_field`) to be used as the `GELF short_message`.
- **InfluxDB v1.x** (`influxdb`): Add support for setting the retention policy using a tag (`retention_policy_tag`).
- **NATS Output** (`nats`): Add support for credentials file.

#### Aggregator plugin updates

- **Histogram** (`histogram`): Add non-cumulative histogram.

#### Processor plugin updates

- **Converter** (`converter`): Add support for converting `tag` or `field` to `measurement`.
- **Date** (`date`): Add date offset and timezone options.
- **Strings** (`strings`): Add support for titlecase transformation.

### Bug fixes

- Fix Telegraf log rotation to use actual file size instead of bytes written.
- Fix internal Telegraf metrics to prevent output split into multiple lines.
- **Chrony** (`chrony`) input plugin: When plugin is enabled, search for `chronyc` only.
- **Microsoft SQL Server** (`sqlserver`) input plugin:
  - Fix conversion to floats in AzureDBResourceStats query.
  - Fix case sensitive collation.
  - Fix several issues with DatabaseIO query.
  - Fix schedulers query compatibility with pre SQL-2016.
- **InfluxDB Listener** (`influxdb_listener`):
  - Fix request failing with EOF.
  - Continue parsing after error.
  - Set headers on ping URL.

## v1.13.4 {date="2020-02-25"}

### Release Notes
Official packages now built with Go 1.13.8.

### Bug fixes
- Parse NaN values from summary types in Prometheus (`prometheus`) input plugin.
- Fix PgBouncer (`pgbouncer`) input plugin when used with newer PgBouncer versions.
- Support up to 8192 stats in the Ethtool (`ethtool`) input plugin.
- Fix performance counters collection on named instances in Microsoft SQL Server (`sqlserver`) input plugin.
- Use add time for Prometheus expiration calculation.
- Fix inconsistency with input error counting in Telegraf v1.x (`internal`) input plugin.
- Use the same timestamp per call if no time is provided in Prometheus (`prometheus`) input plugin.

## v1.13.3 {date="2020-02-04"}

### Bug fixes

- Update Kibana (`kibana`) input plugin to support Kibana 6.4 and later.
- Prevent duplicate `TrackingIDs` from being returned in the following queue consumer input plugins:
    - Amazon Kineses Consumer (`kinesis_consumer`)
    - AMQP Consumer (`amqp_consumer`)
    - Apache Consumer (`apache_consumer`)
    - MQTT Consumer (`mqtt_consumer`)
    - NATS Consumer (`nats_consumer`)
    - NSQ Consumer (`nsq_consumer`)
- Increase support for up to 4096 statistics in the Ethtool (`ethtool`) input plugin.
- Remove expired metrics from the Prometheus Client (`prometheus_client`) output plugin. Previously, expired metrics were only removed when new metrics were added.

## v1.13.2 {date="2020-01-21"}

### Bug fixes

- Warn without error when Processes (`processes`) input is started on Windows.
- Only parse certificate blocks in X.509 Certificate (`x509_cert`) input plugin.
- Add custom attributes for all resource types in VMware vSphere (`vsphere`) input plugin.
- Support URL agent address form with UDP in SNMP (`snmp`) input plugin.
- Record device fields in the SMART (`smart`) input plugin when attributes is `false`.
- Remove invalid timestamps from Kafka messages.
- Update `json` parser to fix `json_strict` option and set `default` to `true`.

## v1.13.1 {date="2020-01-08"}

### Bug fixes
- Fix ServerProperty query stops working on Azure after failover.
- Add leading period to OID in SNMP v1 generic traps.
- Fix missing config fields in prometheus serializer.
- Fix panic on connection loss with undelivered messages in MQTT Consumer
  (`mqtt_consumer`) input plugin.
- Encode query hash fields as hex strings in SQL Server (`sqlserver`) input plugin.
- Invalidate diskio cache if the metadata mtime has changed.
- Show platform not supported warning only on plugin creation.
- Fix rabbitmq cannot complete gather after request error.
- Fix `/sbin/init --version` executed on Telegraf startup.
- Use last path element as field key if path fully specified in Cisco GNMI Telemetry
  (`cisco_telemetry_gnmi`) input plugin.

## v1.13 {date="2019-12-12"}

### Release Notes
Official packages built with Go 1.13.5.
The Prometheus Format (`prometheus`) input plugin and Prometheus Client (`prometheus_client`)
output have a new mapping to and from Telegraf metrics, which can be enabled by setting `metric_version = 2`.
The original mapping is deprecated. When both plugins have the same setting,
passthrough metrics are unchanged.
Refer to the [Prometheus input plugin](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/prometheus/README.md)
for details about the mapping.

### New Inputs
- [Azure Storage Queue](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/azure_storage_queue/README.md)
  (`azure_storage_queue`) - Contributed by [@mjiderhamn](https://github.com/mjiderhamn)
- [Ethtool](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/ethtool/README.md)
  (`ethtool`) - Contributed by [@philippreston](https://github.com/philippreston)
- [SNMP Trap](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/snmp_trap/README.md)
  (`snmp_trap`) - Contributed by [@influxdata](https://github.com/influxdata)
- [Suricata](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/suricata/README.md)
  (`suricata`) - Contributed by [@satta](https://github.com/satta)
- [Synproxy](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/synproxy/README.md)
  (`synproxy`) - Contributed by [@rfrenayworldstream](https://github.com/rfrenayworldstream)
- [Systemd Units](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/inputs/systemd_units/README.md)
  (`systemd_units`) - Contributed by [@benschweizer](https://github.com/benschweizer)

### New Processors
- [Clone](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/processors/clone/README.md)
  (`clone`) - Contributed by [@adrianlzt](https://github.com/adrianlzt)

### New Aggregators
- [Merge](https://github.com/influxdata/telegraf/blob/release-1.13/plugins/aggregators/merge/README.md)
  (`merge`) - Contributed by [@influxdata](https://github.com/influxdata)

### Features
- Add per node memory stats to RabbitMQ (`rabbitmq`) input plugin.
- Add ability to read query from file to PostgreSQL (`postgresql_extensible`) input plugin.
- Add replication metrics to the Redis (`redis`) input plugin.
- Support NX-OS telemetry extensions in Cisco Model-driven Telemetry (`cisco_telemetry_mdt`)
  input plugin.
- Allow `graphite` parser to create `Inf` and `NaN` values.
- Use prefix base detection for ints in `grok` parser.
- Add more performance counter metrics to Microsoft SQL Server (`sqlserver`) input plugin.
- Add millisecond unix time support to `grok` parser.
- Add container ID as optional source tag to Docker (`docker`) and Docker Log
  (`docker_log`) input plugins.
- Add `lang` parameter to OpenWeatherMap (`openweathermap`) input plugin.
- Log file open errors at debug level in Tail (`tail`) input plugin.
- Add timeout option to Amazon CloudWatch (`cloudwatch`) input plugin.
- Support custom success codes in HTTP (`http`) input plugin.
- Improve IPVS (`ipvs`) input plugin error strings and logging.
- Add strict mode to JSON parser that can be disabled to ignore invalid items.
- Add support for Kubernetes 1.16 and remove deprecated API usage.
- Add gathering of RabbitMQ federation link metrics.
- Add bearer token defaults for Kubernetes plugins.
- Add support for SNMP over TCP.
- Add support for per output flush jitter.
- Add a nameable file tag to File (`file`) input plugin.
- Add Splunk MultiMetric support.
- Add support for sending HTTP Basic Auth in InfluxDB (`influxdb`) input plugin.
- Add ability to configure the url tag in the Prometheus Format (`prometheus`) input plugin.
- Add Prometheus `metric_version=2` mapping to internal metrics/line protocol.
- Add Prometheus `metric_version=2` support to Prometheus Client (`prometheus_client`) output plugin.
- Add content_encoding compression support to Socket Listener (`socket_listener`) input plugin.
- Add high resolution metrics support to Amazon CloudWatch (`cloudwatch`) output plugin.
- Add `SReclaimable` and `SUnreclaim ` to Memory (`mem`) input plugin.
- Allow multiple certificates per file in X.509 Certificate (`x509_cert`) input plugin.
- Add additional tags to the X.509 Certificate (`x509_cert`) input plugin.
- Add batch data format support to File (`file`) output plugin.
- Support partition assignment strategy configuration in Apache Kafka Consumer
  (`kafka_consumer`) input plugin.
- Add node type tag to MongoDB (`mongodb`) input plugin.
- Add `uptime_ns` field to MongoDB (`mongodb`) input plugin.
- Support resolution of symlinks in Filecount (`filecount`) input plugin.
- Set message timestamp to the metric time in Apache Kafka (`kafka`) output plugin.
- Add base64decode operation to String (`string`) processor.
- Add option to control collecting global variables to MySQL (`mysql`) input plugin.

### Bug fixes
- Show correct default settings in MySQL (`mysql`) sample configuration.
- Use `1h` or `3h` rain values as appropriate in OpenWeatherMap (`openweathermap`) input plugin.
- Fix `not a valid field` error in Windows with Nvidia SMI (`nvidia_smi`) input plugin.
- Fix InfluxDB (`influxdb`) output serialization on connection closed.
- Fix ping skips remaining hosts after DNS lookup error.
- Log MongoDB oplog auth errors at debug level.
- Remove trailing underscore trimming from json flattener.
- Revert change causing CPU usage to be capped at 100 percent.
- Accept any media type in the Prometheus Format (`prometheus`) input plugin.
- Fix unix socket dial arguments in uWSGI (`uwsgi`) input plugin.
- Replace colon characters in Prometheus (`prometheus_client`) output labels with `metric_version=1`.
- Set TrimLeadingSpace when TrimSpace is on in CSV (`csv`) parser.

## v1.12.6 {date="2019-11-19"}

### Bug fixes
- Fix many plugin errors logged at debug logging level.
- Use nanosecond precision in Docker Log (`docker_log`) input plugin.
- Fix interface option with `method = native` in Ping (`ping`) input plugin.
- Fix panic in MongoDB (`mongodb`) input plugin if shard connection pool stats are unreadable.

## v1.12.5 {date="2019-11-12"}

### Bug fixes
- Fix incorrect results in Ping (`ping`) input plugin.
- Add missing character replacement to `sql_instance` tag.
- Change `no metric` error message to `debug` level in CloudWatch (`cloudwatch`) input plugin.
- Add missing `ServerProperties` query to SQLServer (`sqlserver`) input plugin documentation.
- Fix MongoDB `connections_total_created` field loading.
- Fix metric creation when node is offline in Jenkins (`jenkins`) input plugin.
- Fix Docker `uptime_ns` calculation when container has been restarted.
- Fix MySQL field type conflict in conversion of `gtid_mode` to an integer.
- Fix MySQL field type conflict with `ssl_verify_depth` and `ssl_ctx_verify_depth`.

## v1.12.4 {date="2019-10-23"}

- Build official packages with Go 1.12.12.

### Bug fixes
- Fix metric generation with Ping (`ping`) input plugin `native` method.
- Exclude alias tag if unset from plugin internal stats.
- Fix `socket_mode` option in PowerDNS Recursor (`powerdns_recursor`) input plugin.

## v1.12.3 {date="2019-10-07"}

- Build official packages with Go 1.12.10.

### Bug fixes
- Use batch serialization format in Exec (`exec`) output plugin.
- Use case-insensitive serial number match in S.M.A.R.T. (`smart`) input plugin.
- Add authorization header only when environment variable is set.
- Fix issue when running multiple MySQL and SQL Server plugin instances.
- Fix database routing on retry with `exclude_database_tag`.
- Fix logging panic in Exec (`exec`) input plugin with Nagios data format.

## v1.12.2 {date="2019-09-24"}

### Bug fixes
- Fix timestamp format detection in `csv` and `json` parsers.
- Apcupsd input (`apcupsd`)
  - Fix parsing of `BATTDATE`.
- Keep boolean values listed in `json_string_fields`.
- Disable Go plugin support in official builds.
- Cisco GNMI Telemetry input (`cisco_telemetry_gnmi`)
  - Fix path handling issues.

## v1.12.1 {date="2019-09-10"}

### Bug fixes
- Fix dependenciess on GLIBC_2.14 symbol version.
- Filecount input (`filecount`)
  - Fix filecount for paths with trailing slash.
- Icinga2 input (`icinga2`)
  - Convert check state to an integer.
- Apache Kafka Consumer input (`kafka_consumer`)
  - Fix could not mark message delivered error.
- MongoDB input (`mongodb`)
  - Skip collection stats when disabled.
- HTTP Response input (`http_response`)
  - Fix error reading closed response body.
- Apcupsd input (`apcupsd`)
  - Fix documentation to reflect plugin.
- InfluxDB v2 output (`influxdb_v2`)
  - Display retry log message only when retry after is received.


## v1.12 {date="2019-09-03"}

### Release Notes
- The cluster health related fields in the Elasticsearch input have been split out
  from the `elasticsearch_indices` measurement into the new `elasticsearch_cluster_health_indices`
  measurement as they were originally combined by error.

### New Inputs
- [Apcupsd](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/apcupsd/README.md) (`apcupsd`) - Contributed by @jonaz
- [Docker Log](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/docker_log/README.md) (`docker_log`) - Contributed by @prashanthjbabu
- [Fireboard](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/fireboard/README.md) (`fireboard`) - Contributed by @ronnocol
- [Logstash](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/logstash/README.md) (`logstash`) - Contributed by @lkmcs @dmitryilyin @arkady-emelyanov
- [MarkLogic](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/marklogic/README.md) (`marklogic`) - Contributed by @influxdata
- [OpenNTPD](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/openntpd/README.md) (`openntpd`) - Contributed by @aromeyer
- [uWSGI](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/uwsgi) (`uwsgi`) - Contributed by @blaggacao

### New Parsers
- [From Urlencoded](https://github.com/influxdata/telegraf/blob/master/plugins/parsers/form_urlencoded) (`form_urlencoded`) - Contributed by @byonchev

### New Processors
- [Date](https://github.com/influxdata/telegraf/blob/master/plugins/processors/date/README.md) (`date`) - Contributed by @influxdata
- [Pivot](https://github.com/influxdata/telegraf/blob/master/plugins/processors/pivot/README.md) (`pivot`) - Contributed by @influxdata
- [Tag Limit](https://github.com/influxdata/telegraf/blob/master/plugins/processors/tag_limit/README.md) (`tag_limit`) - Contributed by @memory
- [Unpivot](https://github.com/influxdata/telegraf/blob/master/plugins/processors/unpivot/README.md) (`unpivot`) - Contributed by @influxdata

### New Outputs
- [Exec](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/exec/README.md) (`exec`) - Contributed by @Jaeyo

### Features
- Improve performance of `wavefront` serializer.
- Allow `regex` processor to append tag values.
- Add `starttime` field to `phpfpm` input.
- Add cluster name tag to elasticsearch indices.
- Add support for interface field in `http_response` input plugin.
- Add container uptime_ns in `docker` input plugin.
- Add better user-facing errors for API timeouts in docker input.
- Add TLS mutual auth support to `jti_openconfig_telemetry` input.
- Add support for ES 7.x to `elasticsearch` output.
- Add basic auth to `prometheus` input plugin.
- Add node roles tag to `elasticsearch` input.
- Support floats in `statsd` percentiles.
- Add native Go ping method to `ping` input plugin.
- Resume from last known offset in `tail` input when reloading Telegraf.
- Add improved support for Azure SQL Database to `sqlserver` input.
- Add extra attributes for NVMe devices to `smart` input.
- Add `docker_devicemapper` measurement to `docker` input plugin.
- Add basic auth support to `elasticsearch` input.
- Support string field glob matching in `json` parser.
- Update gjson to allow multipath syntax in `json` parser.
- Add support for collecting SQL Requests to identify waits and blocking to `sqlserver` input.
- Collect k8s endpoints, ingress, and services in `kube_inventory` plugin.
- Add support for field/tag keys to `strings` processor.
- Add certificate verification status to `x509_cert` input.
- Support percentage value parsing in `redis` input.
- Load external Go plugins from `--plugin-directory`.
- Add ability to exclude db/bucket tag from `influxdb` outputs.
- Gather per collections stats in `mongodb` input plugin.
- Add TLS & credentials configuration for `nats_consumer` input plugin.
- Add support for enterprise repos to `github` plugin.
- Add Indices stats to `elasticsearch` input.
- Add left function to `string` processor.
- Add grace period for metrics late for aggregation.
- Add `diff` and `non_negative_diff` to `basicstats` aggregator.
- Add device tags to `smart_attributes`.
- Collect `framework_offers` and `allocator` metrics in `mesos` input.
- Add Telegraf and Go version to the `internal` input plugin.
- Update the number of logical CPUs dynamically in `system` plugin.
- Add darwin (macOS) builds to the release.
- Add configurable timeout setting to `smart` input.
- Add `memory_usage` field to `procstat` input plugin.
- Add support for custom attributes to `vsphere` input.
- Add `cmdstat` metrics to `redis` input.
- Add `content_length` metric to `http_response` input plugin.
- Add `database_tag` option to `influxdb_listener` to add database from query string.
- Add capability to limit TLS versions and cipher suites.
- Add `topic_tag` option to `mqtt_consumer`.
- Add ability to label inputs for logging.
- Add TLS support to `nginx_plus`, `nginx_plus_api` and `nginx_vts`.

### Bug fixes
- Fix sensor read error stops reporting of all sensors in `temp` input.
- Fix double pct replacement in `sysstat` input.
- Fix race in master node detection in `elasticsearch` input.
- Fix SSPI authentication not working in `sqlserver` input.
- Fix memory error panic in `mqtt` input.
- Support Kafka 2.3.0 consumer groups.
- Fix persistent session in `mqtt_consumer`.
- Fix finder inconsistencies in `vsphere` input.
- Fix parsing multiple metrics on the first line of tailed file.
- Send TERM to `exec` processes before sending KILL signal.
- Query oplog only when connected to a replica set.
- Use environment variables to locate Program Files on Windows.

## v1.11.5 {date="2019-08-27"}

### Bug fixes
- Update `go-sql-driver/mysql` driver to 1.4.1 to address auth issues.
- Return error status from `--test` if input plugins produce an error.
- Fix with multiple instances only last configuration is used in smart input.
- Build official packages with Go 1.12.9.
- Split out `-w` argument in `iptables` input plugin.
- Add support for parked process state on Linux.
- Remove leading slash from rcon command.
- Allow jobs with dashes in the name in `lustre2` input plugin.

## v1.11.4 {date="2019-08-06"}

### Bug fixes

#### Plugins
- Kubernetes input (`kubernetes`)
  - Correct typo in `logsfs_available_bytes` field.
- Datadog output (`datadog`)
  - Skip floats that are `NaN` or `Inf`.
- Socket Listener input (`socket_listener`)
  - Fix reload panic.

## v1.11.3 {date="2019-07-23"}

### Bug fixes

#### Agent

- Treat empty array as successful parse in JSON parser.
- Fix template pattern partial wildcard matching.

#### Plugins

- Bind input (`bind`)
  - Add missing `rcode` and `zonestat`.
- GitHub input
  - - Fix panic.
- Lustre2 input (`lustre2`)
  - Fix config parse regression.
- NVIDIA-SMI output (`nvidia-smi`)
  - Handle unknown error.
- StatD input (`statd`)
  - Fix panic when processing Datadog events.
- VMware vSphere input (`vsphere`)
  - Fix unable to reconnect after vCenter reboot.

## v1.11.2 {date="2019-07-09"}

### Bug fixes

#### Plugins

- Bind input (`bind`)
  - Fix `value out of range` error on 32-bit systems.
- Burrow input (`burrow`)
  - Apply topic filter to partition metrics.
- Filecount input (`filecount`)
  - Fix path separator handling in Windows.
- Logparser input (`logparser`)
  - Fix stop working after reload.
- Ping input (`ping`)
  - Fix source address ping flag on BSD.
- StatsD input (`statsd`)
  - Fix panic with empty Datadog tag string.
- Tail input (`tail`)
  - Fix stop working after reload.

## v1.11.1 {date="2019-06-25"}

### Bug fixes

#### Agent

- Fix panic if `pool_mode` column does not exist.
- Add missing `container_id` field to `docker_container_status` metrics.
- Add `device`, `serial_no`, and `wwn` tags to synthetic attributes.

#### Plugins

- Cisco GNMI Telemetry input (`cisco_telemetry_gnmi`)
  - Omit keys when creating measurement names for GNMI telemetry.
- Disk input (`disk`)
  - Cannot set `mount_points` option.
- NGINX Plus API input (`nginx_plus_api`)
  - Skip 404 error reporting.
- Procstat input (`procstat`)
  - Don't consider `pid` of `0` when using systemd lookup.
- StatsD input (`statsd`)
  - Fix parsing of remote TCP address.
- System input (`system`)
  - Ignore error when `utmp` is missing.

## v1.11.0 {date="2019-06-11"}

- System (`system`) input plugin
  - The `uptime_format` field has been deprecated — use the `uptime` field instead.
- Amazon Cloudwatch Statistics (`cloudwatch`) input plugin
  - Updated to use a more efficient API and now requires `GetMetricData` permissions
   instead of `GetMetricStatistics`.  The `units` tag is not
   available from this API and is no longer collected.

### New input plugins

- [BIND 9 Nameserver Statistics (`bind`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/bind/README.md) - Contributed by @dswarbrick & @danielllek
- [Cisco GNMI Telemetry (`cisco_telemetry_gnmi`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/cisco_telemetry_gnmi/README.md) - Contributed by @sbyx
- [Cisco Model-driven Telemetry (`cisco_telemetry_mdt`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/cisco_telemetry_mdt/README.md) - Contributed by @sbyx
- [ECS (`ecs`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/ecs/README.md) - Contributed by @rbtr
- [GitHub (`github`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/github/README.md) - Contributed by @influxdata
- [OpenWeatherMap (`openweathermap`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/openweathermap/README.md) - Contributed by @regel
- [PowerDNS Recursor (`powerdns_recursor`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/inputs/powerdns_recursor/README.md) - Contributed by @dupondje

### New aggregator plugins

- [Final (`final`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/aggregators/final/README.md) - Contributed by @oplehto

### New output plugins

- [Syslog (`syslog`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/outputs/syslog/README.md) - Contributed by @javicrespo
- [Health (`health`)](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/outputs/health/README.md) - Contributed by @influxdata

### New output data formats (serializers)

- [wavefront](https://github.com/influxdata/telegraf/blob/release-1.11/plugins/serializers/wavefront/README.md) - Contributed by @puckpuck

### Features

#### Agent

- Add CLI support for outputting sections of the configuration.
- Add `service-display-name` option for use with Windows service.
- Add support for log rotation.
- Allow env vars `${}` expansion syntax in configuration file.
- Allow devices option to match against devlinks.

### Input data formats

- Nagios
  - Add support for multiple line text and perfdata.

#### Input plugins

- AMQP Consumer (`amqp_consumer`)
  - Support passive queue declaration.
  - Add support for gzip compression.
- Amazon Cloudwatch Statistics (`cloudwatch`)
  - Use more efficient GetMetricData API to collect Cloudwatch metrics.
  - Allow selection of collected statistic types in cloudwatch input.
- Apache Solr (`solr`)
  - Add support for HTTP basic auth.
- Hddtemp (`hddtemp`)
  - Add source tag.
- InfluxDB Listener (`influxdb_listener`)
  - Support verbose query parameter in ping endpoint.
- NVIDIA SMI (`nvidia-smi`)
  - Extend metrics collected from Nvidia GPUs.
- Net (`net`)
  - Speed up interface stat collection.
- PHP FM (`phpfm`)
  - Enhance HTTP connection options.
- Ping (`ping`)
  - Add TTL field.
- Procstat (`procstat`)
  - Add `cmdline` tag.
  - Add pagefault data.
- Prometheus (`prometheus`)
  - Add namespace restriction.
- SMART (`smart`)
  - Support more drive types.
- Socket Listener (`socket_listener`)
  - Add option to set permissions for UNIX domain sockets.
- StatsD (`statsd`)
  - Add support for Datadog events.

### Output plugins

- AMQP (`amqp`)
  - Add support for gzip compression.
- File (`file`)
  - Add file rotation support.
- Stackdriver (`stackdriver`)
  - Set user agent.
-- VMware Wavefront (`wavefront`)
  - Add option to use strict sanitization rules.

### Aggregator plugins

- Histogram aggregator
  - Add option to reset buckets on flush.

#### Processor plugins

- Converter (`converter`)
  - Add hexadecimal string to integer conversion.
- Enum (`enum`)
  - Support tags.

### Bug fixes

#### Agent

- Create Windows service only when specified or in service manager.
- Don't start Telegraf when stale pid file found.
- Fix inline table support in configuration file.
- Fix multi-line basic strings support in configuration file.
- Fix multiple SIGHUP causes Telegraf to shutdown.
- Fix batch fails when single metric is unserializable.
- Log a warning on write if the metric buffer has overflowed.

#### Plugins

- AMQP (`amqp`) output
  - Fix direct exchange routing key.
- Apex Neptune (`apex_neptune`) inpur
  - Skip invalid power times.
- Docker (`docker`) input
  - Fix docker input does not parse image name correctly.
- Fibaro (`fibaro`) input
  - Set default timeout of `5s`.
- InfluxDB v1.x (`influxdb`) output
  - Fix connection leak on reload.
- InfluxDB v2 output
  - Fix connection leak on reload.
- Lustre 2 (`lustre2`) input
  - Fix only one job per storage target reported.
- Microsoft Azure Monitor (`azure_monitor`) output
  - Fix scale set resource id.
- Microsoft SQL Server (`sqlserver`) input
   Fix connection closing on error.
- Minecraft (`minecraft`) input
  - Support Minecraft server 1.13 and newer.
- NGINX Upstream Check (`nginx_upstream_check`) input
  - Fix TOML option name.
- PgBounder (`pgbouncer`) input
  - Fix unsupported pkt type error.
- Procstat (`procstat`) input
  - Verify a process passed by `pid_file` exists.
- VMware vSphere (`vsphere`) input
  - Fixed datastore name mapping.

## v1.10.4 {date="2019-05-14"}

### Bug fixes

#### Agent

- Create telegraf user in pre-install RPM scriptlet.
- Fix parse of unix timestamp with more than ns precision.
- Fix race condition in the Wavefront parser.

#### Plugins

- HTTP output plugin (`http`)
  - Fix http output cannot set Host header.
- IPMI Sensor input (`ipmi_sensor`)
  - Add support for hex values.
- InfluxDB v2 output (`influxdb_v2`)
  - Don't discard metrics on forbidden error.
- Interrupts input (`interrupts`)
  - Restore field name case.
- NTPQ input (`ntpq`)
  - Skip lines with missing `refid`.
- VMware vSphere input (`vsphere`)
  - Fix interval estimation.

## v1.10.3 {date="2019-04-16"}

### Bug fixes

#### Agent

- Set log directory attributes in RPM specification.

#### Plugins

- Prometheus Client (`prometheus_client`) output plugin.
  - Allow colons in metric names.

## v1.10.2 {date="2019-04-02"}

### Breaking changes

 Grok input data format (parser): string fields no longer have leading and trailing quotation marks removed.
 If you are capturing quoted strings, the patterns might need to be updated.

### Bug fixes

#### Agent

- Fix deadlock when Telegraf is aligning aggregators.
- Add owned directories to RPM package specification.
- Fix drop tracking of metrics removed with aggregator `drop_original`.
- Fix aggregator window alignment.
- Fix panic during shutdown of multiple aggregators.
- Fix tags applied to wrong metric on parse error.

#### Plugins

- Ceph (`ceph`) input
  - Fix missing cluster stats.
- DiskIO (`diskio`) input
  - Fix reading major and minor block devices identifiers.
- File (`file`) output
  - Fix open file error handling.
- Filecount (`filecount`) input
  - Fix basedir check and parent dir extraction.
- Grok (`grok`) parser
  - Fix last character removed from string field.
- InfluxDB v2 (`influxdb_v2`) output
  - Fix plugin name in output logging.
- Prometheus (`prometheus`) input
  - Fix parsing of kube config `certificate-authority-data`.
- Prometheus (`prometheus`) output
  - Remove tags that would create invalid label names.
- StatsD (`statsd`) input
  - Listen before leaving start.

## v1.10.1 {date="2019-03-19"}

#### Bug fixes

- Show error when TLS configuration cannot be loaded.
- Add base64-encoding/decoding for Google Cloud PubSub (`pubsub`) plugins.
- Fix type compatibility in VMware vSphere (`vsphere`) input plugin with `use_int_samples` option.
- Fix VMware vSphere (`vsphere`) input plugin shows failed task in vCenter.
- Fix invalid measurement name and skip column in the CSV input data format parser.
- Fix System (`system`) input plugin causing high CPU usage on Raspbian.

## v1.10 {date="2019-03-05"}

#### New input plugins

- [Google Cloud PubSub (`cloud_pubsub`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/cloud_pubsub/README.md) - Contributed by @emilymye
- [Kubernetes Inventory (`kube_inventory`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/cloud_pubsub_push/README.md) - Contributed by @influxdata
- [Neptune Apex (`neptune_apex`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/neptune_apex/README.md) - Contributed by @MaxRenaud
- [NGINX Upstream Check (`nginx_upstream_check`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/nginx_upstream_check/README.md) - Contributed by @dmitryilyin
- [Multifile (`multifile`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/inputs/multifile/README.md) - Contributed by @martin2250

#### New output plugins

- [Google Cloud PubSub (`cloud_pubsub`)](https://github.com/influxdata/telegraf/blob/release-1.10/plugins/outputs/cloud_pubsub/README.md) - Contributed by @emilymye

#### New output data formats (serializers)

- [ServiceNow Metrics](/telegraf/v1/data_formats/output/nowmetric) - Contributed by @JefMuller
- [Carbon2](/telegraf/v1/data_formats/output/carbon2) - Contributed by @frankreno

#### Features

- **General**
  - Allow for force gathering ES cluster stats.
  - Add Linux `mipsle` packages.
- **Input plugins**
  - Ceph (`ceph`)
    - Add read and write op per second fields.
  - CouchDB (`couchdb`)
    - Add support for basic auth.
  - DNS Query (`dns_query`)
    - Add `rcode` tag and field.
  - DiskIO (`diskio`)
    - Include `DEVLINKS` in available `udev` properties.
  - HTTP (`http`)
    - Add support for sending a request body to `http` input.
  - InfluxDB Listener (`influxdb_listener`)
    - Add internal metric for line too long.
  - Interrupts (`interrupts`)
    - Add option to store `cpu` as a tag.
  - Kafka Consumer (`kafka_consumer`)
    - Add ability to tag metrics with topic.
  - Kubernetes (`k8s`)
  - Support passing bearer token directly.
  - Microsoft SQL Server (`sqlserver`)
    - Add log send and redo queue fields.
  - MongoDB (`mongodb`)
    - Add `flush_total_time_ns` and additional wired tiger fields.
  - Procstat (`procstat_lookup`)
    - Add running field.
  - Prometheus (`prometheus`)
    - Support passing bearer token directly.
    - Add option to report input timestamp.
  - VMware vSphere (`vsphere`)
    - Improve scalability.
    - Add resource path-based filtering.
  - Varnish (`varnish`)
    - Add configurable timeout.
- **Output plugins**
  - MQTT (`mqtt`)
    - Add option to set retain flag on messages.
  - Stackdriver (`stackdriver`)
    - Add resource type and resource label support
  - VMware Wavefront (`wavefront`)
    - Add support for the Wavefront Direct Ingestion API.
- **Aggregator plugins**
  - Value Counter (`valuecounter`)
    - Allow counting float values.
- **Data formats**
  - **Input data formats**
  - CSV
    - Support `unix_us` and `unix_ns` timestamp format.
    - Add support for `unix` and `unix_ms` timestamps.
  - Grok (`grok`)
    - Allow parser to produce metrics with no fields.
  - JSON
    - Add micro and nanosecond unix timestamp support.
  - **Output data formats**
    - ServiceNow Metrics

#### Bug fixes

- **General**
  - Use `systemd` in Amazon Linux 2 rpm.
  - Fix `initscript` removes `pidfile` of restarted Telegraf process.
- **Input plugins**
  - Consul (`consul`)
    - Use datacenter option spelling.
  - InfluxDB Listener (`influxdb_listener`)
    - Remove auth from `/ping` route.
  - Microsoft SQL Server (`sqlserver`)
    - Set deadlock priority.
  - Nstat (`nstat`)
    - Remove error log when `snmp6` directory does not exist.
  - Ping (`ping`)
    - Host not added when using custom arguments.
  - X.509 Certificate
    - Fix input stops checking certificates after first error.
- **Output plugins**
  - Prometheus (`prometheus`)
    - Sort metrics by timestamp.
  - Stackdriver (`stackdriver`)
    - Skip string fields when writing.
    - Send metrics in ascending time order.

## v1.9.5 {date="2019-02-26"}

### Bug fixes

* General
  * Use `systemd` in Amazon Linux 2 rpm.
* Ceph Storage (`ceph`) input plugin
  * Add backwards compatibility fields in usage and pool statistics.
* InfluxDB (`influxdb`) output plugin
  * Fix UDP line splitting.
* Microsoft SQL Server (`sqlserver`) input plugin
  * Set deadlock priority to low.
  * Disable results by row in AzureDB query.
* Nstat (`nstat`) input plugin
  * Remove error log when `snmp6` directory does not exist.
* Ping (`ping`) input plugin
  * Host not added when using custom arguments.
* Stackdriver (`stackdriver`) output plugin
  * Skip string fields when writing to stackdriver output.
  * Send metrics in ascending time order.

## v1.9.4 {date="2019-02-05"}

### Bug fixes

* General
  * Fix `skip_rows` and `skip_columns` options in csv parser.
  * Build official packages with Go 1.11.5.
* Jenkins input plugin
  * Always send basic auth in jenkins input.
* Syslog (`syslog`) input plugin
    * Fix definition of multiple syslog plugins.

## v1.9.3 {date="2019-01-22"}

#### Bug fixes

* General
  * Fix latest metrics not sent first when output fails.
  * Fix `internal_write buffer_size` not reset on timed writes.
* AMQP Consumer (`amqp_consumer`) input plugin
  - Fix `amqp_consumer` input stops consuming when it receives
    unparsable messages.
* Couchbase (`couchbase`) input plugin
  * Remove `userinfo` from cluster tag in `couchbase` input.
* Microsoft SQL Server (`sqlserver`) input plugin
  * Fix arithmetic overflow in `sqlserver`) input.
* Prometheus (`prometheus`) input plugin
  * Fix `prometheus` input not detecting added and removed pods.

## v1.9.2 {date="2019-01-08"}

### Bug fixes

- Increase `varnishstat` timeout.
- Remove storage calculation for non-Azure-managed instances and add server version.
- Fix error sending empty tag value in `azure_monitor` output.
- Fix panic with Prometheus input plugin on shutdown.
- Support non-transparent framing of syslog messages.
- Apply global- and plugin-level metric modifications before filtering.
- Fix `num_remapped_pgs` field in `ceph` plugin.
- Add `PDH_NO_DATA` to known counter error codes in `win_perf_counters`.
- Fix `amqp_consumer` stops consuming on empty message.
- Fix multiple replace tables not working in strings processor.
- Allow non-local UDP connections in `net_response`.
- Fix TOML option names in parser processor.
- Fix panic in Docker input with bad endpoint.
- Fix original metric modified by aggregator filters.

## v1.9.1 {date="2018-12-11"}

### Bug fixes

- Fix boolean handling in splunkmetric serializer.
- Set default config values in Jenkins input.
- Fix server connection and document stats in MongoDB input.
- Add X-Requested-By header to Graylog input.
- Fix metric memory not freed from the metric buffer on write.
- Add support for client TLS certificates in PostgreSQL inputs.
- Prevent panic when marking the offset in `kafka_consumer`.
- Add early metrics to aggregator and honor `drop_original` setting.
- Use `-W` flag on BSD variants in ping input.
- Allow delta metrics in Wavefront parser.

## v1.9.0 {date="2018-11-20"}

#### Release Notes

- The HTTP Listener (`http_listener`) input plugin has been renamed to
  InfluxDB Listener (`influxdb_listener`) input plugin and
  use of the original name is deprecated.  The new name better describes the
  intended use of the plugin as an InfluxDB relay.  For general purpose
  transfer of metrics in any format using HTTP, InfluxData recommends using
  HTTP Listener v2 (`http_listener_v2`) input plugin.

- Input plugins are no longer limited from adding metrics when the output is
  writing and new metrics will move into the metric buffer as needed.  This
  will provide more robust degradation and recovery when writing to a slow
  output at high throughput.

  To avoid overconsumption when reading from queue consumers, the following
  input plugins use the new option `max_undelivered_messages` to limit the number
  of outstanding unwritten metrics:

  * Apache Kafka Consumer (`kafka_consumer`)
  * AMQP Consumer (`amqp_consumer`)
  * MQTT Consumer (`mqtt_consumer`)
  * NATS Consumer (`nats_consumer`)
  * NSQ Consumer (`nsq_consumer`)

#### New input plugins

- [HTTP Listener v2 (`http_listener_v2`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/http_listener_v2/README.md) - Contributed by @jul1u5
- [IPVS (`ipvs`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/ipvs/README.md) - Contributed by @amoghe
- [Jenkins (`jenkins`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/jenkins/README.md) - Contributed by @influxdata & @lpic10
- [NGINX Plus API (`nginx_plus_api`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/nginx_plus_api/README.md) - Contributed by @Bugagazavr
- [NGINX VTS (`nginx_vts`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/nginx_vts/README.md) - Contributed by @monder
- [Wireless (`wireless`)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/inputs/wireless/README.md) - Contributed by @jamesmaidment

#### New output plugins

- [Stackdriver (stackdriver)](https://github.com/influxdata/telegraf/blob/release-1.9/plugins/outputs/stackdriver/README.md) - Contributed by @jamesmaidment

#### Features

- General
  - Add ability to define a custom service name when installing as a Windows service.
  - Add new configuration for CSV column explicit type conversion.
  - Add Telegraf version to `User-Agent` header.
  - Add ability to specify bytes options as strings with units.
  - Add per output `flush_interval`, `metric_buffer_limit`, and `metric_batch_size`.
- Amazon Kinesis (`kinesis`) output plugin
  - Use `DescribeStreamSummary` in place of `ListStreams`.
- DNS Query (`dns_query`) input plugin
  - Query servers in parallel.
- Datadog (`datadog`) output plugin
  - Add an option to specify a custom URL.
  - Use non-allocating field and tag accessors.
- Filecount (`filecount`) input plugin
  - Add per-directory file count.
- HTTP Output (`http output`) plugin
  - Add entity-body compression.
- Memcached (`memcached`) input plugin
  - Collect additional statistics.
- NSQ (`nsq`) input plugin
  - Add TLS configuration support.
- Ping (`ping`) input plugin
  - Add support for IPv6.
- Procstat (`procstat`) input plugin
  - Add Windows service name lookup.
- Prometheus (`prometheus`) input plugin
  - Add scraping for Prometheus annotation in Kubernetes.
  - Allow connecting to Prometheus using UNIX socket.
- Strings (`strings`) processor plugin
  - Add `replace` function.
- VMware vSphere (`vsphere`) input plugin
  - Add LUN to data source translation.

#### Bug fixes

- Remove `time_key` from the field values in JSON parser.
- Fix input time rounding when using a custom interval.
- Fix potential deadlock or leaked resources on restart or reload.
- Fix outputs block inputs when batch size is reached.
- Fix potential missing datastore metrics in VMware vSphere (`vsphere`) input plugin.

## v1.8.3 {date="2018-10-30"}

### Bug fixes

- Add DN attributes as tags in X.509 Certificate (`x509_cert`) input plugin to avoid series overwrite.
- Prevent connection leak by closing unused connections in AMQP (`amqp`) output plugin.
- Use default partition key when tag does not exist in Amazon Kinesis (`kinesis`) output plugin.
- Log the correct error in JTI OpenConfig Telemetry (`jti_openconfig_telemetry`) input plugin.
- Handle panic when IMPI Sensor (`ipmi_sensor`) input plugin gets bad input.
- Don't add unserializable fields to Jolokia2 (`jolokia2`) input plugin.
- Fix version check in PostgreSQL Exstensible (`postgresql_extensible`) plugin.

## v1.8.2 {date="2018-10-17"}

### Bug fixes

* Aerospike (`aerospike`) input plugin
  * Support uint fields.
* Docker (`docker`) input plugin
  * Use container name from list if no name in container stats.
* Filecount (`filecount`) input plugin
  * Prevent panic on error in file stat.
* InfluxDB v2 (`influxdb_v2`) input plugin
  * Update write path to match updated v2 API.
* Logparser (`logparser`) input plugin
  * Fix panic.
* MongoDB (`mongodb`) input plugin
  * Lower authorization errors to debug level.
* MQTT Consumer (`mqtt_consumer`) input plugin
  * Fix connect and reconnect.
* Ping (`ping`) input plugin
  * Return correct response code.
* VMware vSphere (`vsphere`) input plugin
  * Fix missing timeouts.
* X.509 Certificate (`x509_cert`) input plugin
  * Fix segfault.

## v1.8.1 {date="2018-10-03"}

### Bug fixes

- Fix `hardware_type` may be truncated in Microsoft SQL Server (`sqlserver`) input plugin.
- Improve performance in Basicstats (`basicstats`) aggregator plugin.
- Add `hostname` to TLS config for SNI support in X.509 Certificate (`x509_cert`) input plugin.
- Don't add tags with empty values to OpenTSDB (`opentsdb`) output plugin.
- Fix panic during network error in VMware vSphere (`vsphere`) input plugin.
- Unify error response in HTTP Listener (`http_listener`) input plugin with InfluxDB (`influxdb`) output plugin.
- Add `UUID` to VMs in VMware vSphere (`vsphere`) input plugin.
- Skip tags with empty values in Amazon Cloudwatch (`cloudwatch`) output plugin.
- Fix missing non-realtime samples in VMware vSphere (`vsphere`) input plugin.
- Fix case of `timezone`/`grok_timezone` options in grok parser and logparser input plugin.

## v1.8 {date="2018-09-21"}

### New input plugins

- [ActiveMQ (`activemq`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/activemq/README.md) - Contributed by @mlabouardy
- [Beanstalkd (`beanstalkd`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/beanstalkd/README.md) - Contributed by @44px
- [File (`file`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/file/README.md) - Contributed by @maxunt
- [Filecount (`filecount`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/filecount/README.md) - Contributed by @sometimesfood
- [Icinga2 (`icinga2`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/icinga2/README.md) - Contributed by @mlabouardy
- [Kibana (`kibana`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/kibana/README.md) - Contributed by @lpic10
- [PgBouncer (`pgbouncer`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/pgbouncer/README.md) - Contributed by @nerzhul
- [Temp (`temp`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/temp/README.md) - Contributed by @pytimer
- [Tengine (`tengine`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/tengine/README.md) - Contributed by @ertaoxu
- [VMware vSphere (`vsphere`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/vsphere/README.md) - Contributed by @prydin
- [X.509 Certificate (`x509_cert`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/x509_cert/README.md) - Contributed by @jtyr

### New processor plugins

- [Enum (`enum`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/processors/enum/README.md) - Contributed by @KarstenSchnitter
- [Parser (`parser`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/processors/parser/README.md) - Contributed by @Ayrdrie & @maxunt
- [Rename (`rename`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/processors/rename/README.md) - Contributed by @goldibex
- [Strings (`strings`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/processors/strings/README.md) - Contributed by @bsmaldon

### New aggregator plugins

- [ValueCounter (`valuecounter`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/aggregators/valuecounter/README.md) - Contributed by @piotr1212

### New output plugins

- [Azure Monitor (`azure_monitor`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/azure_monitor/README.md) - Contributed by @influxdata
- [InfluxDB v2 (`influxdb_v2`)](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/outputs/influxdb_v2/README.md) - Contributed by @influxdata

### New input data formats (parsers)

- [csv](https://docs.influxdata.com/telegraf/v1/data_formats/input/csv/) - Contributed by @maxunt
- [grok](https://docs.influxdata.com/telegraf/v1/data_formats/input/grok/) - Contributed by @maxunt
- [logfmt](https://docs.influxdata.com/telegraf/v1/data_formats/input/logfmt/) - Contributed by @Ayrdrie & @maxunt
- [wavefront](https://docs.influxdata.com/telegraf/v1/data_formats/input/wavefront/) - Contributed by @puckpuck

### New output data formats (serializers)

- [splunkmetric](https://docs.influxdata.com/telegraf/v1/data_formats/output/splunkmetric/) - Contributed by @ronnocol

### Features

- Add SSL/TLS support to Redis (`redis`) input plugin.
- Add tengine input plugin.
- Add power draw field to the NVIDIA SMI (`nvidia_smi`) input plugin.
- Add support for Solr 7 to the Solr (`solr`) input plugin.
- Add owner tag on partitions in Burrow (`burrow`) input plugin.
- Add container status tag to Docker (`docker`) input plugin.
- Add ValueCounter (`valuecounter`) aggregator plugin.
- Add new measurement with results of `pgrep` lookup to Procstat (`procstat`) input plugin.
- Add support for comma in logparser timestamp format.
- Add path tag to Tail (`tail`) input plugin.
- Add log message when tail is added or removed from a file.
- Add option to use of counter time in win perf counters.
- Add energy and power field and device id tag to Fibaro (`fibaro`) input plugin.
- Add HTTP path configuration for OpenTSDB output.
- Gather IPMI metrics concurrently.
- Add mongo document and connection metrics.
- Add enum processor plugin.
- Add user tag to procstat input.
- Add support for multivalue metrics to collectd parser.
- Add support for setting kafka client id.
- Add file input plugin and grok parser.
- Improve cloudwatch output performance.
- Add x509_cert input plugin.
- Add IPSIpAddress syntax to ipaddr conversion in snmp plugin.
- Add Filecount filecount input plugin.
- Add support for configuring an AWS `endpoint_url`.
- Send all messages before waiting for results in Kafka output plugin.
- Add support for lz4 compression to Kafka output plugin.
- Split multiple sensor keys in ipmi input.
- Support StatisticValues in cloudwatch output plugin.
- Add ip restriction for the prometheus_client output.
- Add PgBouncer (`pgbouncer`) input plugin.
- Add ActiveMQ input plugin.
- Add wavefront parser plugin.
- Add rename processor plugin.
- Add message 'max_bytes' configuration to kafka input.
- Add gopsutil meminfo fields to Mem (`mem`) input plugin.
- Document how to parse Telegraf logs.
- Use dep v0.5.0.
- Add ability to set measurement from matched text in grok parser.
- Drop message batches in Kafka (`kafka`) output plugin if too large.
- Add support for static and random routing keys in Kafka (`kafka`) output plugin.
- Add logfmt parser plugin.
- Add parser processor plugin.
- Add Icinga2 input plugin.
- Add name, time, path and string field options to JSON parser.
- Add forwarded records to sqlserver input.
- Add Kibana input plugin.
- Add csv parser plugin.
- Add read_buffer_size option to statsd input.
- Add azure_monitor output plugin.
- Add queue_durability parameter to amqp_consumer input.
- Add strings processor.
- Add OAuth 2.0 support to HTTP output plugin.
- Add Unix epoch timestamp support for JSON parser.
- Add options for basic auth to haproxy input.
- Add temp input plugin.
- Add Beanstalkd input plugin.
- Add means to specify server password for redis input.
- Add Splunk Metrics serializer.
- Add input plugin for VMware vSphere.
- Align metrics window to interval in cloudwatch input.
- Improve Azure Managed Instance support + more in sqlserver input.
- Allow alternate binaries for iptables input plugin.
- Add influxdb_v2 output plugin.

### Bug fixes

- Fix divide by zero in logparser input.
- Fix instance and object name in performance counters with backslashes.
- Reset/flush saved contents from bad metric.
- Document all supported cli arguments.
- Log access denied opening a service at debug level in win_services.
- Add support for Kafka 2.0.
- Fix nagios parser does not support ranges in performance data.
- Fix nagios parser does not strip quotes from performance data.
- Fix null value crash in postgresql_extensible input.
- Remove the startup authentication check from the cloudwatch output.
- Support tailing files created after startup in tail input.
- Fix CSV format configuration loading.


## v1.7.4 {date="2018-08-29"}

### Bug fixes

* Continue sending write batch in UDP if a metric is unserializable in InfluxDB (`influxdb`) output plugin.
* Fix PowerDNS (`powerdns`) input plugin tests.
* Fix `burrow_group` offset calculation for Burrow (`burrow`) input plugin.
* Add `result_code` value for errors running ping command.
* Remove timeout deadline for UDP in Syslog (`syslog`) input plugin.
* Ensure channel is closed if an error occurs in CGroup (`cgroup`) input plugin.
* Fix sending of basic authentication credentials in HTTP `(output)` output plugin.
* Use the correct `GOARM` value in the Linux armel package.

## v1.7.3 {date="2018-08-07"}

### Bug fixes

* Reduce required Docker API version.
* Keep leading whitespace for messages in syslog input.
* Skip bad entries on interrupt input.
* Preserve metric type when using filters in output plugins.
* Fix error message if URL is unparseable in InfluxDB output.
* Use explicit `zpool` properties to fix parse error on FreeBSD 11.2.
* Lock buffer when adding metrics.

## v1.7.2 {date="2018-07-18"}

### Bug fixes

* Use localhost as default server tag in Zookeeper (`zookeeper`) input plugin.
* Don't set values when pattern doesn't match in Regex (`regex`) processor plugin.
* Fix output format of Printer (`printer`) processor plugin.
* Fix metric can have duplicate field.
* Return error if NewRequest fails in HTTP (`http`) output plugin.
* Reset read deadline for Syslog (`syslog`) input plugin.
* Exclude cached memory on Docker (`docker`) input plugin.

## v1.7.1 {date="2018-07-03"}

### Bug fixes

* Treat `sigterm` as a clean shutdown signal.
* Fix selection of tags under nested objects in the JSON parser.
* Fix Postfix (`postfix`) input plugin handling of multilevel queues.
* Fix Syslog (`syslog` input plugin timestamp parsing with single digit day of month.
* Handle MySQL (`mysql`) input plugin variations in the `user_statistics` collecting.
* Fix Minmax (`minmax`) and Basicstats (`basicstats`) aggregator plugins to use `uint64`.
* Document Swap (`swap`) input plugin.
* Fix incorrect precision being applied to metric in HTTP Listener (`http_listener`) input plugin.

## v1.7 {date="2018-06-12"}

### Release notes

- The Cassandra (`cassandra`) input plugin has been deprecated in favor of the Jolokia2 (`jolokia2`)
  input plugin which is much more configurable and more performant.  There is
  an [example configuration](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/jolokia2/examples) to help you
  get started.

- For plugins supporting TLS, you can now specify the certificate and keys
  using `tls_ca`, `tls_cert`, `tls_key`.  These options behave the same as
  the, now deprecated, `ssl` forms.

### New input plugins

- [Aurora (`aurora`)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/aurora/README.md) - Contributed by @influxdata
- [Burrow (`burrow`) input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/burrow/README.md) - Contributed by @arkady-emelyanov
- [`fibaro`](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/fibaro/README.md) - Contributed by @dynek
- [`jti_openconfig_telemetry`](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/jti_openconfig_telemetry/README.md) - Contributed by @ajhai
- [`mcrouter`](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/mcrouter/README.md) - Contributed by @cthayer
- [NVIDIA SMI (`nvidia_smi`)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/nvidia_smi/README.md) - Contributed by @jackzampolin
- [Syslog (`syslog`)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/syslog/README.md) - Contributed by @influxdata

### New processor plugins

- [converter](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/processors/converter/README.md) - Contributed by @influxdata
- [regex](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/processors/regex/README.md) - Contributed by @44px
- [topk](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/processors/topk/README.md) - Contributed by @mirath

### New output plugins

- [HTTP (`http`)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/http/README.md) - Contributed by @Dark0096
- [Application Insights (`application_insights`) output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/application_insights/README.md): Contribute by @karolz-ms

### Features

- Add `repl_oplog_window_sec` metric to MongoDB (`mongodb`) input plugin.
- Add per-host shard metrics in MongoDB (`mongodb`) input plugin.
- Skip files with leading `..` in config directory.
- Add TLS support to `socket_writer` and `socket_listener` plugins.
- Add `snmp` input option to strip non-fixed length index suffixes.
- Add server version tag to the Docker (`docker`) input plugin.
- Add support for LeoFS 1.4 to `leofs` input.
- Add parameter to force the interval of gather for Sysstat (`sysstat`).
- Support BusyBox ping in the Ping (`ping`) input plugin.
- Add Mcrouter (`mcrouter`) input plugin.
- Add TopK (`topk`) processor plugin.
- Add cursor metrics to MongoDB (`mongodb`) input plugin.
- Add tag/integer pair for result to Network Response (`net_response`) input plugin.
- Add Application Insights (`application_insights`) output plugin.
- Added several important Elasticsearch cluster health metrics.
- Add batch mode to `mqtt` output.
- Add Aurora (`aurora`) input plugin.
- Add Regex (`regex`) processor plugin.
- Add support for Graphite 1.1 tags.
- Add timeout option to Sensors (`sensors)` input plugin.
- Add Burrow (`burrow`) input plugin.
- Add option to Unbound (`unbound`) input plugin to use threads as tags.
- Add support for TLS and username/password auth to Aerospike (`aerospike`) input plugin.
- Add special syslog timestamp parser to grok parser that uses current year.
- Add Syslog (`syslog`) input plugin.
- Print the enabled aggregator and processor plugins on startup.
- Add static `routing_key` option to `amqp` output.
- Add passive mode exchange declaration option to AMQP Consumer (`amqp_consumer`) input plugin.
- Add counter fields to PF (`pf`) input plugin.

### Bug fixes

- Write to working file outputs if any files are not writeable.
- Add all win_perf_counters fields for a series in a single metric.
- Report results of `dns_query` instead of `0ms` on timeout.
- Add consul service tags to metric.
- Fix wildcards and multi instance processes in win_perf_counters.
- Fix crash on 32-bit Windows in `win_perf_counters`.
- Fix `win_perf_counters` not collecting at every interval.
- Use same flags for all BSD family ping variants.


## v1.6.4 {date="2018-06-05"}

### Bug fixes

* Fix SNMP overriding of auto-configured table fields.
* Fix uint support in CloudWatch output.
* Fix documentation of `instance_name` option in Varnish input.
* Revert to previous Aerospike library version due to memory leak.

## v1.6.3 {date="2018-05-21"}

### Bug fixes

* Fix intermittent panic in Aerospike input plugin.
* Fix connection leak in the Jolokia agent (`Jolokia2_agent`) input plugin.
* Fix Jolokia agent (`Jolokia2_agent`) input plugin timeout parsing.
* Fix error parsing Dropwizard metrics.
* Fix Librato (`librato`) output plugin support for unsigned integer (`uint`) and Boolean (`bool`).
* Fix WaitGroup deadlock, if URL is incorrect, in Apache input plugin.

## v1.6.2 {date="2018-05-08"}

### Bug fixes

* Use same timestamp for fields in system input.
* Fix handling of uint64 in Datadog (`datadog`) output.
* Ignore UTF8 BOM in JSON parser.
* Fix case for slave metrics in MySQL (`mysql`) input.
* Fix uint support in CrateDB (`cratedb`) output.


## v1.6.1 {date="2018-04-23"}

### Bug fixes

* Report mem input fields as gauges instead of counters.
* Fix Graphite outputs unsigned integers in wrong format.
* Report available fields if `utmp` is unreadable.
* Fix potential `no fields` error writing to outputs.
* Fix uptime reporting in system input when ran inside docker.
* Fix mem input `cannot allocate memory` error on FreeBSD-based systems.
* Fix duplicate tags when overriding an existing tag.
* Add server argument as first argument in the Unbound (`unbound`) input plugin.
* Fix handling of floats with multiple leading zeroes.
* Return errors in SSL/TLS configuration of MongoDB (`mongodb`) input plugin.


## v1.6 {date="2018-04-16"}

### Release notes

- The MySQL (`mysql`) input plugin has been updated fix a number of type conversion
  issues.  This may cause a `field type error` when inserting into InfluxDB due
  the change of types.

  To address this, we have introduced a new `metric_version` option to control
  enabling the new format.
  For in depth recommendations on upgrading, see [Metric version](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/mysql#metric-version) in the MySQL input plugin documentation.

  You are encouraged to migrate to the new model when possible as the old version
  is deprecated and will be removed in a future version.

- The PostgreSQL (`postgresql`) input plugin now defaults to using a persistent connection to the database.
  In environments where TCP connections are terminated, the `max_lifetime`
  setting should be set less than the collection `interval` to prevent errors.

- The SQL Server (`sqlserver`) input plugin has a new query and data model that can be enabled
  by setting `query_version = 2`.
  Migrate to the new model, if possible, since the old version is deprecated and will be removed in a future version.

- The OpenLDAP (`openldap`) input plugin has a new option, `reverse_metric_names = true`, that reverses metric
  names to improve grouping.
  Enable this option, when possible, as the old ordering is deprecated.

- The new HTTP (`http`) input plugin, when configured with `data_format = "json"`, can perform the
  same task as the, now deprecated, HTTP JSON (`httpjson`) input plugin.


### New input plugins

- [HTTP (`http`) input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/http/README.md) - Thanks to @grange74
- [Ipset (`ipset`) input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/ipset/README.md) - Thanks to @sajoupa
- [NATS Server Monitoring (`nats`) input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/nats/README.md) - Thanks to @mjs and @levex

### New processor plugins

- [Override (`override`) processor plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/processors/override/README.md) - Thanks to @KarstenSchnitter

### New parsers

- [Dropwizard input data format](https://github.com/influxdata/telegraf/blob/release-1.8/docs/DATA_FORMATS_INPUT.md#dropwizard) - Thanks to @atzoum

### Features

* Add health status mapping from `string` to `int` in Elasticsearch (`elasticsearch`) input plugin.
* Add control over which stats to gather in BasicStats (`basicstats`) aggregator plugin.
* Add `messages_delivered_get` to RabbitMQ (`rabbitmq`) input plugin.
* Add `wired` field to mem input plugin.
* Add support for gathering exchange metrics to the RabbitMQ (`rabbitmq`) input plugin.
* Add support for additional metrics on Linux in Zfs (`zfs`) input plugin.
* Add `available_entropy` field to Kernel (`kernel`) input plugin.
* Add user privilege level setting to IPMI sensors.
* Use persistent connection to PostgreSQL database.
* Add support for dropwizard input data format.
* Add container health metrics to Docker (`docker`) input plugin.
* Add support for using globs in devices list of DiskIO (`diskio`) input plugin.
* Allow running as console application on Windows.
* Add listener counts and node running status to RabbitMQ (`rabbitmq`) input plugin.
* Add NATS Server Monitoring (`nats`) input plugin.
* Add ability to select which queues will be gathered in RabbitMQ (`rabbitmq`) input plugin.
* Add support for setting BSD source address to the ping (`ping`) input plugin.
* Add Ipset (`ipset`) input plugin.
* Add TLS and HTTP basic auth to Prometheus Client (`prometheus_client`) output plugin.
* Add new sqlserver output data model.
* Add native Go method for finding `pid` to the Procstat (`procstat`) input plugin.
* Add additional metrics and reverse metric names option to OpenLDAP (`openldap`) input plugin.
* Add TLS support to the Mesos (`mesos`) input plugin.
* Add HTTP (`http`) input plugin.
* Add keep alive support to the TCP mode of StatsD (`statsd`) input plugin .
* Support deadline in Ping (`ping`) input plugin.
* Add option to disable labels in the Prometheus Client (`prometheus`) output plugin for string fields.
* Add shard server stats to the MongoDB (`mongodb`) input plugin.
* Add server option to Unbound (`unbound`) input plugin.
* Convert boolean metric values to float in Datadog (`datadog`) output plugin.
* Add Solr 3 compatibility.
* Add sum stat to BasicStats (`basicstats`) aggregator plugin.
* Add ability to override proxy from environment in HTTP Response (`http_response`) input plugin.
* Add host to ping timeout log message.
* Add override processor plugin.
* Add `status_code` and result tags and `result_type` field to HTTP Response (`http_response`) input plugin.
* Added config flag to skip collection of network protocol metrics.
* Add TLS support to Kapacitor (`kapacitor`) input plugin.
* Add HTTP basic auth support to the HTTP Listener (`http_listener`) input plugin.
* Tags in output InfluxDB Line Protocol are now sorted.
* InfluxDB Line Protocol parser now accepts DOS line endings.
* An option has been added to skip database creation in the InfluxDB (`influxdb`) output plugin.
* Add support for connecting to InfluxDB over a UNIX domain socket.
* Add optional unsigned integer support to the influx data format.
* Add TLS support to Zookeeper (`zookeeper`) input plugin.
* Add filters for container state to Docker (`docker`) input plugin.

### Bug fixes

* Fix various MySQL data type conversions.
* Fix metric buffer limit in internal plugin after reload.
* Fix panic in HTTP Response (`http_response`) input plugin on invalid regex.
* Fix socket_listener setting ReadBufferSize on TCP sockets.
* Add tag for target URL to `phpfpm` input plugin.
* Fix cannot unmarshal object error in Mesosphere DC/OS (`dcos`) input plugin.
* Fix InfluxDB output not able to reconnect when server address changes.
* Fix parsing of DOS line endings in the SMART (`smart`) input plugin.
* Fix precision truncation when no timestamp included.
* Fix SNMPv3 connection with Cisco ASA 5515 in SNMP (`snmp`) input plugin.


## v1.5.3 {date="2018-03-14"}

### Bug fixes

* Set path to `/` if `HOST_MOUNT_PREFIX` matches full path.
* Remove `userinfo` from `url` tag in Prometheus input plugin.
* Fix Ping input plugin not reporting zero durations.
* Disable `keepalive` in MQTT output plugin to prevent deadlock.
* Fix collation difference in SQL Server (`sqlserver`) input plugin.
* Fix uptime metric in Passenger (`passenger`) input plugin.
* Add output of stderr in case of error to exec log message.

## v1.5.2 {date="2018-01-30"}

### Bug fixes

- Ignore empty lines in Graphite plaintext.
- Fix `index out of bounds` error in Solr input plugin.
- Reconnect before sending Graphite metrics if disconnected.
- Align aggregator period with internal ticker to avoid skipping metrics.
- Fix a potential deadlock when using aggregators.
- Limit wait time for writes in MQTT (`mqtt`) output plugin.
- Revert change in Graphite (`graphite`) output plugin where dot(`.`) in field key was replaced by underscore (`_`).
- Add `timeout` to Wavefront output write.
- Exclude `master_replid` fields from Redis input.

## v1.5.1 {date="2017-01-10"}

### Bug fixes

- Fix name error in jolokia2_agent sample config.
- Fix DC/OS input - login expiration time.
- Set Content-Type charset parameter in InfluxDB (`influxdb`) output plugin and allow it to be overridden.
- Document permissions setup for Postfix (`postfix`) input plugin.
- Fix `deliver_get` field in RabbitMQ (`rabbitmq`) input plugin.
- Escape environment variables during config TOML parsing.

## v1.5 {date="2017-12-14"}

### New plugins

#### Input plugins
- [Bond (bond)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/bond/README.md) - Thanks to @ildarsv
- [DC/OS (dcos)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/dcos/README.md) - Thanks to @influxdata
- [Jolokia2 (jolokia2)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/jolokia2/README.md) - Thanks to @dylanmei
- [NGINX Plus (nginx_plus)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/nginx_plus/README.md) - Thanks to @mplonka & @poblahblahblah
- [OpenSMTPD (opensmtpd)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/opensmtpd/README.md) - Thanks to @aromeyer
- [Particle.io Webhooks (particle)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/webhooks/particle/README.md) - Thanks to @davidgs
- [PF (pf)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/pf/README.md) - Thanks to @nferch
- [Postfix (postfix)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/postfix/README.md) - Thanks to @phemmer
- [SMART (smart)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/smart/README.md) - Thanks to @rickard-von-essen
- [Solr (solr)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/solr/README.md) - Thanks to @ljagiello
- [Teamspeak (teamspeak)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/teamspeak/README.md) - Thanks to @p4ddy1
- [Unbound (unbound)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/inputs/unbound/README.md) - Thanks to @aromeyer

#### Aggregator plugins
- [BasicStats (basicstats)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/aggregators/basicstats/README.md) - Thanks to @toni-moreno

#### Output plugins
- [CrateDB (cratedb)](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/cratedb) - Thanks to @felixge
- [Wavefront (wavefront)](https://github.com/influxdata/telegraf/tree/release-1.5/plugins/outputs/wavefront/README.md) - Thanks to @puckpuck


### Release notes

- In the Kinesis (`kinesis`) output plugin, use of the `partition_key` and
  `use_random_partitionkey` options has been deprecated in favor of the
  `partition` subtable.  This allows for more flexible methods to set the
  partition key such as by metric name or by tag.

- With the release of the new improved Jolokia2 (`jolokia2`) input plugin, the legacy `jolokia`
  plugin is deprecated and will be removed in a future release.  Users of this
  plugin are encouraged to update to the new `jolokia2` plugin.

### Features

- Add support for sharding based on metric name.
- Add Kafka output plugin `topic_suffix` option.
- Include mount mode option in disk metrics.
- TLS and MTLS enhancements to HTTP Listener input plugin.
- Add polling method to logparser and tail inputs.
- Add timeout option for Kubernetes (`kubernetes`) input plugin.
- Add support for timing sums in statsd input plugin.
- Add resource limit monitoring to Procstat (`procstat`) input plugin.
- Add support for k8s service DNS discovery to Prometheus Client (`prometheus`) input plugin.
- Add configurable metrics endpoint to (`prometheus`) output plugin.
- Add support for NSQLookupd to `nsq_consumer`.
- Add configurable separator for metrics and fields in OpenTSDB (`opentsdb`) output plugin.
- Add support for the rollbar occurrence webhook event.
- Add extra wired tiger cache metrics to `mongodb` input.
- Collect Docker Swarm service metrics in Docker (`docker`) input plugin.
- Add cluster health level configuration to Elasticsearch (`elasticsearch`) input plugin.
- Add ability to limit node stats in Elasticsearch (`elasticsearch`) input plugin.
- Add UDP IPv6 support to StatsD (`statsd`) input plugin.
- Use labels in Prometheus Client (`prometheus`) output plugin for string fields.
- Add support for decimal timestamps to ts-epoch modifier.
- Add histogram and summary types and use in Prometheus (`prometheus`) plugins.
- Gather concurrently from snmp agents.
- Perform DNS lookup before ping and report result.
- Add instance name option to Varnish (`varnish`) plugin.
- Add support for SSL settings to ElasticSearch (`elasticsearch`) output plugin.
- Add modification_time field to Filestat (`filestat`) input plugin.
- Add systemd unit pid and cgroup matching to Procstat (`procstat`) .
- Use MAX() instead of SUM() for latency measurements in SQL Server (`sqlserver`) input plugin.
- Add index by week number to Elasticsearch (`elasticsearch`) output plugin.
- Add support for tags in the index name in Elasticsearch (`elasticsearch`) output plugin.
- Add slab to mem plugin.
- Add support for glob patterns in net input plugin.
- Add option to AMQP (`amqp`) output plugin to publish persistent messages.
- Support I (idle) process state on procfs+Linux.

### Bug fixes

- Fix webhooks input address in use during reload.
- Unlock Statsd when stopping to prevent deadlock.
- Fix cloudwatch output requires unneeded permissions.
- Fix prometheus passthrough for existing value types.
- Always ignore autofs filesystems in disk input.
- Fail metrics parsing on unescaped quotes.
- Whitelist allowed char classes for graphite output.
- Use hexadecimal ids and lowercase names in zipkin input.
- Fix snmp-tools output parsing with Windows EOLs.
- Add shadow-utils dependency to rpm package.
- Use deb-systemd-invoke to restart service.
- Fix kafka_consumer outside range of offsets error.
- Fix separation of multiple prometheus_client outputs.
- Don't add system input uptime_format as a counter.

## v1.4.5 {date="2017-12-01"}

### Bug fixes

- Fix global variable collection when using interval_slow option in MySQL input.
- Fix error getting net connections info in netstat input.
- Fix HOST_MOUNT_PREFIX in Docker with disk input.

## v1.4.4 {date="2017-11-08"}

### Bug fixes
- Use schema specified in mqtt_consumer input.
- Redact Datadog API key in log output.
- Fix error getting PIDs in netstat input.
- Support HOST_VAR envvar to locate /var in system input.
- Use current time if Docker container read time is zero value.

## v1.4.3 {date="2017-10-25"}

### Bug fixes

- Fix container name filters in Docker input.
- Fix snmpwalk address format in leofs input.
- Fix case sensitivity issue in SQL Server query.
- Fix CPU input plugin stuck after suspend on Linux.
- Fix MongoDB input panic when restarting MongoDB.
- Preserve URL path prefix in InfluxDB output.
- Fix TELEGRAF_OPTS expansion in systemd service unit.
- Remove warning when JSON contains null value.
- Fix ACL token usage in consul input plugin.
- Fix unquoting error with Tomcat 6.
- Fix syscall panic in diskio on some Linux systems.

## v1.4.2 {date="2017-10-10"}

### Bug fixes

- Fix error if int larger than 32-bit in `/proc/vmstat`.
- Fix parsing of JSON with a UTF8 BOM in `httpjson`.
- Allow JSON data format to contain zero metrics.
- Fix format of connection_timeout in `mqtt_consumer`.
- Fix case sensitivity error in SQL Server input.
- Add support for proxy environment variables to `http_response`.
- Add support for standard proxy env vars in outputs.
- Fix panic in CPU input if number of CPUs changes.
- Use chunked transfer encoding in InfluxDB output.

## v1.4.1 {date="2017-09-26"}

### Bug fixes

- Fix MQTT input exits if Broker is not available on startup.
- Fix optional field value conversions in fluentd input.
- Whitelist allowed char classes for opentsdb output.
- Fix counter and gauge metric types.
- Fix skipped line with empty target in iptables.
- Fix duplicate keys in perf counters sqlserver query.
- Fix panic in statsd p100 calculation.
- Fix arm64 packages contain 32-bit executable.

## v1.4.0 {date="2017-09-05"}

### Release Notes

- The `kafka_consumer` input has been updated to support Kafka 0.9 and
  above style consumer offset handling.  The previous version of this plugin
  supporting Kafka 0.8 and below is available as the `kafka_consumer_legacy`
  plugin.
- In the `aerospike` input the `node_name` field has been changed to be a tag
  for both the `aerospike_node` and `aerospike_namespace` measurements.
- The default prometheus_client port has been changed to 9273.

### New plugins

- fail2ban
- fluentd
- histogram
- minecraft
- openldap
- salesforce
- tomcat
- win_services
- zipkin

### Features

- Add Kafka 0.9+ consumer support.
- Add support for self-signed certs to InfluxDB input plugin.
- Add TCP listener for statsd input.
- Add Docker container environment variables as tags. Only whitelisted.
- Add timeout option to IPMI sensor plugin.
- Add support for an optional SSL/TLS configuration to Nginx input plugin.
- Add timezone support for logparser timestamps.
- Add result_type field for http_response input.
- Add include/exclude filters for docker containers.
- Add secure connection support to graphite output.
- Add min/max response time on linux/darwin to ping.
- Add HTTP Proxy support to influxdb output.
- Add standard SSL options to mysql input.
- Add input plugin for fail2ban.
- Support HOST_PROC in processes and linux_sysctl_fs inputs.
- Add Minecraft input plugin.
- Add support for RethinkDB 1.0 handshake protocol.
- Add optional usage_active and time_active CPU metrics.
- Change default prometheus_client port.
- Add fluentd input plugin.
- Add result_type field to net_response input plugin.
- Add read timeout to socket_listener.
- Add input plugin for OpenLDAP.
- Add network option to dns_query.
- Add redis_version field to redis input.
- Add tls options to docker input.
- Add histogram aggregator plugin.
- Add Zipkin input plugin.
- Add Windows Services input plugin.
- Add path tag to logparser containing path of logfile.
- Add Salesforce input plugin.
- Add option to run varnish under sudo.
- Add weighted_io_time to diskio input.
- Add gzip content-encoding support to influxdb output.
- Allow using system plugin in Windows.
- Add Tomcat input plugin.
- HTTP headers can be added to InfluxDB output.

### Bug fixes

- Improve logging of errors in Cassandra input.
- [enh] set db_version at 0 if query version fails.
- Fixed SQL Server input to work with case sensitive server collation.
- Systemd does not see all shutdowns as failures.
- Reuse transports in input plugins.
- Inputs processes fails with "no such process".
- Fix multiple plugin loading in win_perf_counters.
- MySQL input: log and continue on field parse error.
- Fix timeout option in Windows ping input sample configuration.
- Fix Kinesis output plugin in govcloud.
- Fix Aerospike input adds all nodes to a single series.
- Improve Prometheus Client output documentation.
- Display error message if prometheus output fails to listen.
- Fix elasticsearch output content type detection warning.
- Prevent possible deadlock when using aggregators.
- Fix combined tagdrop/tagpass filtering.
- Fix filtering when both pass and drop match an item.
- Only report cpu usage for online cpus in docker input.
- Start first aggregator period at startup time.
- Fix panic in logparser if file cannot be opened.
- Default to localhost if zookeeper has no servers set.
- Fix docker memory and cpu reporting in Windows.
- Allow iptable entries with trailing text.
- Sanitize password from couchbase metric.
- Converge to typed value in prometheus output.
- Skip compilation of logparser and tail on solaris.
- Discard logging from tail library.
- Remove log message on ping timeout.
- Don't retry points beyond retention policy.
- Don't start Telegraf on install in Amazon Linux.
- Enable hddtemp input on all platforms.
- Escape backslash within string fields.
- Fix parsing of SHM remotes in ntpq input
- Don't fail parsing zpool stats if pool health is UNAVAIL on FreeBSD.
- Fix NSQ input plugin when used with version 1.0.0-compat.
- Added CloudWatch metric constraint validation.
- Skip non-numerical values in graphite format.
- Fix panic when handling string fields with escapes.

## v1.3.5 {date="2017-07-26"}

### Bug fixes

- Fix prometheus output cannot be reloaded.
- Fix filestat reporting exists when cannot list directory.
- Fix ntpq parse issue when using dns_lookup.
- Fix panic when agent.interval = "0s".

## v1.3.4 {date="2017-07-12"}

### Bug fixes

- Fix handling of escape characters within fields.
- Fix chrony plugin does not track system time offset.
- Do not allow metrics with trailing slashes.
- Prevent Write from being called concurrently.

## v1.3.3 {date="2017-06-28"}

### Bug fixes

- Allow dos line endings in tail and logparser.
- Remove label value sanitization in prometheus output.
- Fix bug parsing default timestamps with modified precision.
- Fix panic in elasticsearch input if cannot determine master.

## v1.3.2 {date="2017-06-14"}

### Bug fixes

- Fix InfluxDB UDP metric splitting.
- Fix mongodb/leofs urls without scheme.
- Fix inconsistent label dimensions in prometheus output.

## v1.3.1 {date="2017-05-31"}

### Bug fixes

- Fixed sqlserver input to work with case-sensitive server collation.
- Reuse transports in input plugins.
- Process input fails with `no such process`.
- Fix InfluxDB output database quoting.
- Fix net input on older Linux kernels.
- Fix panic in mongo input.
- Fix length calculation of split metric buffer.

## v1.3.0 {date="2017-05-09"}

#### Changes to the Windows ping plugin

Users of the windows [ping plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/ping) will need to drop or migrate their measurements to continue using the plugin.
The reason for this is that the windows plugin was outputting a different type than the linux plugin.
This made it impossible to use the `ping` plugin for both windows and linux machines.

#### Changes to the Ceph plugin

For the [Ceph plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/ceph), the `ceph_pgmap_state` metric content has been modified to use a unique field `count`, with each state expressed as a `state` tag.

Telegraf < 1.3:

```
# field_name             value
active+clean             123
active+clean+scrubbing   3
```

Telegraf >= 1.3:

```
# field_name    value       tag
count           123         state=active+clean
count           3           state=active+clean+scrubbing
```

#### Rewritten Riemann plugin

The [Riemann output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/riemann) has been rewritten
and the [previous riemann plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/riemann_legacy) is _incompatible_ with the new one.
The reasons for this are outlined in issue [#1878](https://github.com/influxdata/telegraf/issues/1878).
The previous Riemann output will still be available using `outputs.riemann_legacy` if needed, but that will eventually be deprecated.
It is highly recommended that all users migrate to the new Riemann output plugin.

#### New Socket Listener and Socket Writer plugins

Generic [Socket Listener](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/socket_listener) and [Socket Writer](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/socket_writer) plugins have been implemented for receiving and sending UDP, TCP, unix, & unix-datagram data.
These plugins will replace [udp_listener](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/udp_listener) and [tcp_listener](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/tcp_listener), which are still available but will be deprecated eventually.

### Features

- Add SASL options for the [Kafka output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/kafka).
- Add SSL configuration for [HAproxy input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/haproxy).
- Add the [Interrupts input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/interrupts).
- Add generic [Socket Listener input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/socket_listener) and [socket writer output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/socket_writer).
- Extend the [HTTP Response input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/http_response) to support searching for a substring in response. Return 1 if found, else 0.
- Add userstats to the [MySQL input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/mysql).
- Add more InnoDB metric to the [MySQL input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/mysql).
- For the [Ceph input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/ceph), `ceph_pgmap_state` metric now uses a single field `count`, with PG state published as `state` tag.
- Use own client for improved through-put and less allocations in the [InfluxDB output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/influxdb).
- Keep -config-directory when running as Windows service.
- Rewrite the [Riemann output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/riemann).
- Add support for name templates and udev tags to the [DiskIO input plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/diskio/README.md).
- Add integer metrics for [Consul](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/consul) check health state.
- Add lock option to the [IPtables input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/iptables).
- Support [ipmi_sensor input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/ipmi_sensor) querying local ipmi sensors.
- Increment gather_errors for all errors emitted by inputs.
- Use the official docker SDK.
- Add [AMQP consumer input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/amqp_consumer).
- Add pprof tool.
- Support DEAD(X) state in the [system input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/system).
- Add support for [MongoDB](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/mongodb) client certificates.
- Support adding [SNMP](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/snmp) table indexes as tags.
- Add [Elasticsearch 5.x output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/elasticsearch).
- Add json timestamp units configurability.
- Add support for Linux sysctl-fs metrics.
- Support to include/exclude docker container labels as tags.
- Add [DMCache input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/dmcache).
- Add support for precision in [HTTP Listener input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/http_listener).
- Add `message_len_max` option to the [Kafka consumer input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/kafka_consumer).
- Add [collectd parser](https://docs.influxdata.com/telegraf/v1/data_formats/input/collectd/).
- Simplify plugin testing without outputs.
- Check signature in the [GitHub webhook input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/webhooks/github).
- Add [papertrail](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/webhooks/papertrail) support to webhooks.
- Change [jolokia input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/jolokia) to use bulk requests.
- Add [DiskIO input plugin](https://github.com/influxdata/telegraf/blob/release-1.8/plugins/inputs/diskio/README.md) for Darwin.
- Add use_random_partitionkey option to the [Kinesis output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/kinesis).
- Add tcp keep-alive to [Socket Listener input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/socket_listener) and [Socket Writer output plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/outputs/socket_writer).
- Add [Kapacitor input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/kapacitor).
- Use Go (golang) 1.8.1.
- Add documentation for the [RabbitMQ input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/rabbitmq).
- Make the [Logparser input plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/logparser) check for newly-created files.

### Bug fixes

- Allow `@` symbol in password for the ipmi_sensor plugin.
- Fix arithmetic overflow error converting numeric to data type int in SQL Server input.
- Flush jitter can inhibit metric collection.
- Add missing fields for HAproxy input.
- Handle null startTime for stopped pods for the Kubernetes input.
- Fix cpu input panic when /proc/stat is empty.
- Fix telegraf swallowing panics in --test mode.
- Create pidfile with 644 permissions & defer file deletion.
- Fix install/remove of telegraf on non-systemd Debian/Ubuntu systems.
- Fix for reloading telegraf freezes prometheus output.
- Fix when empty tag value causes error on InfluxDB output.
- buffer_size field value is negative number from "internal" plugin.
- Missing error handling in the MySQL plugin leads to segmentation violation.
- Fix type conflict in windows ping plugin.
- logparser: regexp with lookahead.
- Telegraf can crash in LoadDirectory on 0600 files.
- Iptables input: document better that rules without a comment are ignored.
- Fix win_perf_counters capping values at 100.
- Exporting Ipmi.Path to be set by config.
- Remove warning if parse empty content.
- Update default value for Cloudwatch rate limit.
- create /etc/telegraf/telegraf.d directory in tarball.
- Return error on unsupported serializer data format.
- Fix Windows Performance Counters multi instance identifier.
- Add write timeout to Riemann output.
- fix timestamp parsing on prometheus plugin.
- Fix deadlock when output cannot write.
- Fix connection leak in postgresql.
- Set default measurement name for snmp input.
- Improve performance of diskio with many disks.
- The internal input plugin uses the wrong units for `heap_objects`.
- Fix ipmi_sensor config is shared between all plugin instances.
- Network statistics not collected when system has alias interfaces.
- Sysstat plugin needs LANG=C or similar locale.
- File output closes standard streams on reload.
- AMQP output disconnect blocks all outputs.
- Improve documentation for redis input plugin.

## v1.2.1 {date="2017-02-01"}

### Bug fixes

- Fix segfault on nil metrics with InfluxDB output.
- Fix negative number handling.

### Features

- Go (golang) version update 1.7.4 -> 1.7.5

## v1.2 {date="2017-01-24"}

### Release Notes

- The StatsD plugin will now default all "delete_" config options to "true". This
will change te default behavior for users who were not specifying these parameters
in their config file.

- The StatsD plugin will also no longer save it's state on a service reload.
Essentially we have reverted PR [#887](https://github.com/influxdata/telegraf/pull/887).
The reason for this is that saving the state in a global variable is not
thread-safe (see [#1975](https://github.com/influxdata/telegraf/issues/1975) & [#2102](https://github.com/influxdata/telegraf/issues/2102)),
and this creates issues if users want to define multiple instances
of the statsd plugin. Saving state on reload may be considered in the future,
but this would need to be implemented at a higher level and applied to all
plugins, not just statsd.

### Features

- Fix improper calculation of CPU percentages
- Use RFC3339 timestamps in log output.
- Non-default HTTP timeouts for RabbitMQ plugin.
- "Discard" output plugin added, primarily for testing purposes.
- The JSON parser can now parse an array of objects using the same configuration.
- Option to use device name rather than path for reporting disk stats.
- Telegraf "internal" plugin for collecting stats on itself.
- Update GoLang version to 1.7.4.
- Support a metric.Split function.
- Elasticsearch "shield" (basic auth) support doc.
- Fix over-querying of cloudwatch metrics
- OpenTSDB basic auth support.
- RabbitMQ Connection metrics.
- HAProxy session limit metric.
- Accept strings for StatsD sets.
- Change StatsD default "reset" behavior.
- Enable setting ClientID in MQTT output.
- MongoDB input plugin: Improve state data.
- Ping input: add standard deviation field.
- Add GC pause metric to InfluxDB input plugin.
- Added response_timeout property to prometheus input plugin.
- Pulling github.com/lxn/win's pdh wrapper into Telegraf.
- Support negative statsd counters.
- Elasticsearch cluster stats support.
- Change Amazon Kinesis output plugin to use the built-in serializer plugins.
- Hide username/password from elasticsearch error log messages.
- Configurable HTTP timeouts in Jolokia plugin.
- Allow changing jolokia attribute delimiter.

### Bug fixes

- Fix the Value data format not trimming null characters from input.
- Fix windows `.net` plugin.
- Cache & expire metrics for delivery to prometheus
- Fix potential panic in aggregator plugin metric maker.
- Add optional ability to define PID as a tag.
- Fix win_perf_counters not gathering non-English counters.
- Fix panic when file stat info cannot be collected due to permissions or other issue(s).
- Graylog output should set short_message field.
- Hddtemp always put the value in the field temperature.
- Properly collect nested jolokia struct data.
- Fix puppetagent inputs plugin to support string for config variable.
- Fix docker input plugin tags when registry has port.
- Fix tail input when reading from a pipe.
- MongoDB plugin always shows 0 replication lag.
- Consul plugin: add check_id as a tag in metrics to avoid overwrites.
- Partial fix: logparser CLF pattern with IPv6 addresses.
- Fix thread-safety when using multiple instances of the statsd input plugin.
- Docker input: interface conversion panic fix.
- SNMP: ensure proper context is present on error messages.
- OpenTSDB: add tcp:// prefix if no scheme provided.
- Influx parser: parse line-protocol without newlines.
- InfluxDB output: fix field type conflict blocking output buffer.

## v1.1.2 {date="2016-12-12"}

### Bug fixes

- Make snmptranslate not required when using numeric OID.
- Add a global snmp translation cache.

## v1.1.1 {date="2016-11-14"}

### Bug fixes

- Fix issue parsing toml durations with single quotes.

## v1.1.0 {date="2016-11-07"}

### Release Notes

- Telegraf now supports two new types of plugins: processors & aggregators.

- On systemd Telegraf will no longer redirect it's stdout to /var/log/telegraf/telegraf.log.
On most systems, the logs will be directed to the systemd journal and can be
accessed by `journalctl -u telegraf.service`. Consult the systemd journal
documentation for configuring journald. There is also a [`logfile` config option](https://github.com/influxdata/telegraf/blob/release-1.8/etc/telegraf.conf#L70)
available in 1.1, which will allow users to easily configure telegraf to
continue sending logs to /var/log/telegraf/telegraf.log.

### Features

- Processor & Aggregator plugin support.
- Adding the tags in the graylog output plugin.
- Telegraf systemd service, log to journal.
- Allow numeric and non-string values for tag_keys.
- Adding Gauge and Counter metric types.
- Remove carraige returns from exec plugin output on Windows
- Elasticsearch input: configurable timeout.
- Massage metric names in Instrumental output plugin
- Apache Mesos improvements.
- Add Ceph Cluster Performance Statistics
- Ability to configure response_timeout in httpjson input.
- Add additional redis metrics.
- Added capability to send metrics through HTTP API for OpenTSDB.
- iptables input plugin.
- Add filestack webhook plugin.
- Add server hostname for each Docker measurements.
- Add NATS output plugin.
- HTTP service listener input plugin.
- Add database blacklist option for Postgresql
- Add Docker container state metrics to Docker input plugin output
- Add support to SNMP for IP & MAC address conversion.
- Add support to SNMP for OID index suffixes.
- Change default arguments for SNMP plugin.
- Apache Mesos input plugin: very high-cardinality mesos-task metrics removed.
- Logging overhaul to centralize the logger & log levels, & provide a logfile config option.
- HAProxy plugin socket glob matching.
- Add Kubernetes plugin for retrieving pod metrics.

### Bug fixes

- Fix NATS plug-ins reconnection logic.
- Set required default values in udp_listener & tcp_listener.
- Fix toml unmarshal panic in Duration objects.
- Fix handling of non-string values for JSON keys listed in tag_keys.
- Fix mongodb input panic on version 2.2.
- Fix statsd scientific notation parsing.
- Sensors plugin strconv.ParseFloat: parsing "": invalid syntax.
- Fix prometheus_client reload panic.
- Fix Apache Kafka consumer panic when nil error is returned down errs channel.
- Speed up statsd parsing.
- Fix powerdns integer parse error handling.
- Fix varnish plugin defaults not being used.
- Fix Windows glob paths.
- Fix issue loading config directory on Windows.
- Windows remote management interactive service fix.
- SQLServer, fix issue when case sensitive collation is activated.
- Fix huge allocations in http_listener when dealing with huge payloads.
- Fix translating SNMP fields not in MIB.
- Fix SNMP emitting empty fields.
- SQL Server waitstats truncation bug.
- Fix logparser common log format: numbers in ident.
- Fix JSON Serialization in OpenTSDB output.
- Fix Graphite template ordering, use most specific.
- Fix snmp table field initialization for non-automatic table.
- cgroups path being parsed as metric.
- Fix phpfpm fcgi client panic when URL does not exist.
- Fix config file parse error logging.
- Delete nil fields in the metric maker.
- Fix MySQL special characters in DSN parsing.
- Ping input odd timeout behavior.
- Switch to github.com/kballard/go-shellquote.

## v1.0.1 {date="2016-09-26"}

### Bug fixes

- Prometheus output: Fix bug with multi-batch writes.
- Fix unmarshal of influxdb metrics with null tags.
- Add configurable timeout to influxdb input plugin.
- Fix statsd no default value panic.

## v1.0 {date="2016-09-08"}

### Release Notes

**Breaking Change** The SNMP plugin is being deprecated in it's current form.
There is a [new SNMP plugin](https://github.com/influxdata/telegraf/tree/release-1.8/plugins/inputs/snmp)
which fixes many of the issues and confusions
of its predecessor. For users wanting to continue to use the deprecated SNMP
plugin, you will need to change your config file from `[[inputs.snmp]]` to
`[[inputs.snmp_legacy]]`. The configuration of the new SNMP plugin is _not_
backwards-compatible.

**Breaking Change**: Aerospike main server node measurements have been renamed
aerospike_node. Aerospike namespace measurements have been renamed to
aerospike_namespace. They will also now be tagged with the node_name
that they correspond to. This has been done to differentiate measurements
that pertain to node vs. namespace statistics.

**Breaking Change**: users of github_webhooks must change to the new
`[[inputs.webhooks]]` plugin.

This means that the default github_webhooks config:

```
# A Github Webhook Event collector
[[inputs.github_webhooks]]
  ## Address and port to host Webhook listener on
  service_address = ":1618"
```

should now look like:

```
# A Webhooks Event collector
[[inputs.webhooks]]
  ## Address and port to host Webhook listener on
  service_address = ":1618"

  [inputs.webhooks.github]
    path = "/"
```

- Telegraf now supports being installed as an official windows service,
which can be installed via
`> C:\Program Files\Telegraf\telegraf.exe --service install`

- `flush_jitter` behavior has been changed. The random jitter will now be
evaluated at every flush interval, rather than once at startup. This makes it
consistent with the behavior of `collection_jitter`.

- PostgreSQL plugins now handle oid and name typed columns seamlessly, previously they were ignored/skipped.

### Features

- postgresql_extensible now handles name and oid types correctly.
- Separate container_version from container_image tag.
- Support setting per-device and total metrics for Docker network and blockio.
- MongoDB input plugin: adding per DB stats from db.stats()
- Add tls support for certs to RabbitMQ input plugin.
- Webhooks input plugin.
- Rollbar webhook plugin.
- Mandrill webhook plugin.
- docker-machine/boot2docker no longer required for unit tests.
- cgroup input plugin.
- Add input plugin for consuming metrics from NSQD.
- Add ability to read Redis from a socket.
- **Breaking Change** - Redis `role` tag renamed to `replication_role` to avoid global_tags override.
- Fetching Galera status metrics in MySQL
- Aerospike plugin refactored to use official client library.
- Add measurement name arg to logparser plugin.
- logparser: change resp_code from a field to a tag.
- Implement support for fetching hddtemp data
- statsd: do not log every dropped metric.
- Add precision rounding to all metrics on collection.
- Add support for Tengine.
- Logparser input plugin for parsing grok-style log patterns.
- ElasticSearch: now supports connecting to ElasticSearch via SSL.
- Add graylog input plugin.
- Consul input plugin.
- conntrack input plugin.
- vmstat input plugin.
- Standardized AWS credentials evaluation & wildcard CloudWatch dimensions.
- Add SSL config options to http_response plugin.
- Graphite parser: add ability to specify multiple tag keys, for consistency with influxdb parser.
- Make DNS lookups for chrony configurable.
- Allow wildcard filtering of varnish stats.
- Support for glob patterns in exec plugin commands configuration.
- RabbitMQ input: made url parameter optional by using DefaultURL (`http://localhost:15672`) if not specified.
- Limit AWS GetMetricStatistics requests to 10 per second.
- RabbitMQ/Apache/InfluxDB inputs: made url(s) parameter optional by using reasonable input defaults if not specified.
- Refactor of flush_jitter argument.
- Add inactive & active memory to mem plugin.
- Official Windows service.
- Forking sensors command to remove C package dependency.
- Add a new SNMP plugin.

### Bug fixes

- Fix `make windows` build target.
- Fix error race conditions and partial failures.
- nstat: fix inaccurate config panic.
- jolokia: fix handling multiple multi-dimensional attributes.
- Fix prometheus character sanitizing. Sanitize more win_perf_counters characters.
- Add diskio io_time to FreeBSD & report timing metrics as ms (as linux does).
- Fix covering Amazon Linux for post remove flow.
- procstat missing fields: read/write bytes & count.
- diskio input plugin: set 'skip_serial_number = true' by default to avoid high cardinality.
- nil metrics panic fix.
- Fix datarace in apache input plugin.
- Add `read_repairs` statistics to riak plugin.
- Fix memory/connection leak in Prometheus input plugin.
- Trim BOM from config file for Windows support.
- Prometheus client output panic on service reload.
- Prometheus parser, protobuf format header fix.
- Prometheus output, metric refresh and caching fixes.
- Panic fix for multiple graphite outputs under very high load.
- Instrumental output has better reconnect behavior.
- Remove PID from procstat plugin to fix cardinality issues.
- Cassandra input: version 2.x "column family" fix.
- Shared WaitGroup in Exec plugin.
- logparser: honor modifiers in "pattern" config.
- logparser: error and exit on file permissions/missing errors.
- Make the user able to specify full path for HAproxy stats.
- Fix Redis url, an extra "tcp://" was added.
- Fix exec plugin panic when using single binary.
- Fixed incorrect prometheus metrics source selection.
- Set default Zookeeper chroot to empty string.
- Fix overall ping timeout to be calculated based on per-ping timeout.
- Change "default" retention policy to "".
- Graphite output mangling '%' character.
- Prometheus input plugin now supports x509 certs authentication.
- Fix systemd service.
- Fix influxdb n_shards counter.
- Fix potential kernel plugin integer parse error.
- Fix potential influxdb input type assertion panic.
- Still send processes metrics if a process exited during metric collection.
- disk plugin panic when usage grab fails.
- Removed leaked "database" tag on redis metrics.
- Processes plugin: fix potential error with /proc/net/stat directory.
- Fix rare RHEL 5.2 panic in gopsutil diskio gathering function.
- Remove IF NOT EXISTS from influxdb output database creation.
- Fix quoting with text values in postgresql_extensible plugin.
- Fix win_perf_counter "index out of range" panic.
- Fix ntpq panic when field is missing.
- Sanitize graphite output field names.
- Fix MySQL plugin not sending 0 value fields.
