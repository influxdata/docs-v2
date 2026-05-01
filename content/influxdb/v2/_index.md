---
title: InfluxDB OSS v2 documentation
description: >
  InfluxDB OSS is an open source time series database designed to handle high write and query loads.
  Learn how to use and leverage InfluxDB in use cases such as monitoring metrics, IoT data, and events.
layout: landing-influxdb
menu:
  influxdb_v2:
    name: InfluxDB OSS v2
weight: 1
cascade:
  product: influxdb
  version: v2
  prepend: |
    > [!Important]
    > #### API token hashing is enabled by default in InfluxDB OSS 2.9.0
    >
    > Stronger token security: tokens are stored as hashes on disk, so a
    > copy of the database file doesn't expose usable tokens. Existing
    > tokens are hashed on first startup and the original strings can't
    > be recovered afterward — **capture any plaintext tokens you still
    > need before you upgrade**.
    >
    > For more information, see [Token hashing](/influxdb/v2/admin/tokens/#token-hashing).
---

#### Welcome

Welcome to the InfluxDB OSS v2 documentation.
InfluxDB is an open source time series database designed to handle high write and query workloads.

This documentation is meant to help you learn how to use and leverage InfluxDB to meet your needs.
Common use cases include infrastructure monitoring, IoT data collection, events handling, and more.
If your use case involves time series data, InfluxDB is purpose-built to handle it.
