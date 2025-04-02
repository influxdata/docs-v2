---
title: Troubleshoot notebooks
description: Common issues with the notebooks feature.
weight: 106
influxdb/v2/tags: [notebooks]
menu:
  influxdb_v2:
    name: Troubleshoot notebooks
    parent: Notebooks
aliases:
  - /influxdb/v2/notebooks/troubleshoot-notebooks/
---

### No measurements appear in my bucket even though there's data in it.

Try changing the time range. You might have measurements prior to the time range you  selected. For example, if the selected time range is `Past 1h` and the last write happened 16 hours ago, you'd need to change the time range to `Past 24h` (or more) to see your data.
