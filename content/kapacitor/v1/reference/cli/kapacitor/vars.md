---
title: kapacitor vars
description: >
  The `kapacitor vars` command returns variables associated with the Kapacitor
  server in JSON format.
menu:
  kapacitor_v1:
    name: kapacitor vars
    parent: kapacitor
weight: 301
---

The `kapacitor vars` command returns variables associated with the Kapacitor
server in JSON format.

## Usage

```sh
kapacitor vars
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

{{% note %}}
Some fields in the following output have been truncated for brevity.
{{% /note %}}

```json
{
    "cluster_id": "4210702c-bd32-487d-9a08-f6d782cebb41",
    "cmdline": [
        "./kapacitord"
    ],
    "host": "localhost",
    "kapacitor": {
        "33f8dea0-0989-4643-ab77-041a03510c32": {
            "name": "ingress",
            "tags": {
                "database": "_internal",
                "retention_policy": "monitor",
                "measurement": "database",
                "task_master": "main",
                "cluster_id": "4210702c-bd32-487d-9a08-f6d782cebb41",
                "server_id": "b37b6336-659c-41c6-8985-9e077e87507a",
                "host": "localhost"
            },
            "values": {
                "points_received": 42
            }
        },
        "f85ada29-506e-4e49-a7b7-b85eabc69cb1": {
            "values": {
                "points_received": 1561
            },
            "name": "ingress",
            "tags": {
                "database": "_internal",
                "retention_policy": "monitor",
                "measurement": "tsm1_filestore",
                "cluster_id": "4210702c-bd32-487d-9a08-f6d782cebb41",
                "server_id": "b37b6336-659c-41c6-8985-9e077e87507a",
                "host": "localhost",
                "task_master": "main"
            }
        },
        ...
    },
    "memstats": {
        "Alloc": 37329312,
        "TotalAlloc": 82967992,
        "Sys": 80999688,
        "Lookups": 0,
        "Mallocs": 506924,
        "Frees": 362253,
        "HeapAlloc": 37329312,
        "HeapSys": 66027520,
        "HeapIdle": 24068096,
        "HeapInuse": 41959424,
        "HeapReleased": 5537792,
        "HeapObjects": 144671,
        "StackInuse": 1081344,
        "StackSys": 1081344,
        "MSpanInuse": 520000,
        "MSpanSys": 701760,
        "MCacheInuse": 19200,
        "MCacheSys": 31200,
        "BuckHashSys": 1474509,
        "GCSys": 9466824,
        "OtherSys": 2216531,
        "NextGC": 55888456,
        "LastGC": 1696341811994713000,
        "PauseTotalNs": 498619,
        "PauseNs": [
            32555,
            194389,
            88467,
            88318,
            94890,
            0,
            ...
        ],
        "PauseEnd": [
            1696341734917436000,
            1696341735037835000,
            1696341735207253000,
            1696341771998312000,
            1696341811994713000,
            0,
            ...
        ],
        "NumGC": 5,
        "NumForcedGC": 0,
        "GCCPUFraction": 0.000037085629051112796,
        "EnableGC": true,
        "DebugGC": false,
        "BySize": [
            {
                "Size": 0,
                "Mallocs": 0,
                "Frees": 0
            },
            {
                "Size": 8,
                "Mallocs": 3645,
                "Frees": 1540
            },
            {
                "Size": 16,
                "Mallocs": 122649,
                "Frees": 81676
            },
            {
                "Size": 24,
                "Mallocs": 60766,
                "Frees": 40835
            },
            ...
        ]
    },
    "num_enabled_tasks": 0,
    "num_subscriptions": 8,
    "num_tasks": 2,
    "platform": "OSS",
    "product": "kapacitor",
    "server_id": "b37b6336-659c-41c6-8985-9e077e87507a",
    "version": "{{< latest-patch >}}"
}
```
{{% /expand %}}
{{< /expand-wrapper >}}
