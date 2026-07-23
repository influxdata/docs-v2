---
title: Capture workload data
introduced: v3.10.0
description: >
  Capture a time-limited, anonymized profile of write and query requests in
  InfluxDB 3 Enterprise.
weight: 207
menu:
  influxdb3_enterprise:
    parent: Administer InfluxDB
    name: Capture workload data
related:
  - /influxdb3/enterprise/admin/tokens/admin/
  - /influxdb3/enterprise/api/
---

Use load capture to record a short, anonymized profile of requests handled by a query-capable InfluxDB 3 Enterprise node.
The profile preserves workload characteristics that can help you analyze or reproduce a workload.

> [!Important]
> Inspect a capture before sharing it.
> Anonymization does not remove all operational characteristics from a profile.

> [!Note]
> Load capture requires the [upgraded storage engine](/influxdb3/enterprise/performance-preview/)--the default for new clusters.
> On clusters that started on 3.10 or earlier, first run the [storage engine upgrade](/influxdb3/enterprise/reference/config-options/#upgrade-pacha-tree) (`--upgrade-pacha-tree`).
> Send requests to a node with an explicit `--mode` setting that includes `query`, for example, `--mode query` or `--mode ingest --mode query --mode compact`.
> Load capture isn't available on a node that uses the default `--mode all` configuration.

Load capture requires an [admin token](/influxdb3/enterprise/admin/tokens/admin/).
Only one capture can run on a node at a time.

## Start a capture

Send a `POST` request to `/api/v3/loadcap/start`.
Set `type` to `write`, `query`, or `both` and specify a duration with seconds, minutes, or hours.
The maximum duration is one hour.

```sh { placeholders="INFLUXDB3_HOST_URL|ADMIN_TOKEN" }
curl --request POST "$INFLUXDB3_HOST_URL/api/v3/loadcap/start" \
  --header "Authorization: Bearer ADMIN_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{"type":"both","duration":"5m"}'
```

The response contains the capture profile identifier:

```json
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

If another capture is running on the node, the endpoint returns `409 Conflict`.

## List capture profiles

Send a `GET` request to `/api/v3/loadcap/profiles` to list profiles stored by the query-capable node.

```sh { placeholders="INFLUXDB3_HOST_URL|ADMIN_TOKEN" }
curl --request GET "$INFLUXDB3_HOST_URL/api/v3/loadcap/profiles" \
  --header "Authorization: Bearer ADMIN_TOKEN"
```

Each profile includes its identifier, creation time, capture type, requested duration, owning node, and status.
The status is `running`, `complete`, or `aborted`.
