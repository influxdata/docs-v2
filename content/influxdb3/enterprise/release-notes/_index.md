---
title: InfluxDB 3 Enterprise release notes
description: >
  Changes and updates to InfluxDB 3 Enterprise
menu:
  influxdb3_enterprise:
    parent: Reference
    name: Release Notes
weight: 210
related:
  - /influxdb3/enterprise/get-started/
source: /shared/v3-core-enterprise-release-notes/_index.md
canonical: self
prepend: |
  > [!Important]
  > #### The upgraded storage engine is now the default (3.11+)
  >
  > New clusters default to the upgraded storage engine (no opt-in flag
  > required). Existing Parquet clusters stay on Parquet until you run the
  > storage engine upgrade with `--upgrade-pacha-tree` (environment variable
  > `INFLUXDB3_UPGRADE_PACHA_TREE`). The previous flag, `--use-pacha-tree`,
  > still works but is deprecated.
---

<!--
//SOURCE content/shared/v3-core-enterprise-release-notes/_index.md
-->