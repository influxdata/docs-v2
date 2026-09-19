---
title: Troubleshoot EDR
description: >
  Diagnose EDR problems with a symptom-to-tool quick index, common issue
  guides, and a log post-mortem playbook for a crashed or restarted agent.
menu:
  influxdb3_edr:
    name: Troubleshoot
weight: 9
---

<!-- ADAPTED_FROM: influxdata/influxdb3_edr@085be6c docs/external/troubleshooting.md -->

When something looks wrong, start with the
[symptom quick index](/influxdb3/edr/troubleshoot/common-issues/#quick-index).
It maps a symptom to the first tool to run and what that tool tells you.

| Your situation | Guide |
|---|---|
| Something looks wrong and you need a starting point | [Symptom quick index](/influxdb3/edr/troubleshoot/common-issues/#quick-index) |
| The agent won't start, data isn't flowing, or lag is climbing | [Troubleshoot common EDR issues](/influxdb3/edr/troubleshoot/common-issues/) |
| The agent crashed or restarted and you have its log | [EDR log post-mortem playbook](/influxdb3/edr/troubleshoot/log-postmortem-playbook/) |

Before you act on a live `metrics` or UI reading, cross-check it against
`edr-inspect state`. A `metrics` snapshot is point-in-time and resets each
run, so it can catch a transient at its worst instant. See
[Data not flowing](/influxdb3/edr/troubleshoot/common-issues/#data-not-flowing).

{{< children >}}
