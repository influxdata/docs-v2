---
title: Manage Kapacitor Flux task runs
description: >
  Use the **`kapacitor` CLI** or the **Kapacitor HTTP API** to manage Kapacitor Flux task runs.
menu:
  kapacitor_1_6:
    name: Manage Flux task runs
    parent: Manage Flux tasks
weight: 4
related:
  - /kapacitor/v1.6/working/flux/manage/retry-failed/
  - /kapacitor/v1.6/working/flux/
---

Use the **`kapacitor` CLI** or the **Kapacitor HTTP API** to manage Kapacitor Flux task runs.
Each Flux task execution is considered a "run."

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#)
[API](#)
{{% /tabs %}}
<!----------------------------- BEGIN CLI content ----------------------------->
{{% tab-content %}}

Use the `kapacitor flux task run list` command and its sub commands to manage
Kapacitor Flux task runs.

- [List Kapacitor Flux tasks runs](#list-kapacitor-flux-tasks-runs)
- [Retry a Kapacitor Flux task run](#retry-a-kapacitor-flux-task-run)

## List Kapacitor Flux tasks runs
Use the `kapacitor flux task run list` command to output Kapacitor Flux task logs.
Provide the following flags:

{{< req type="key" >}}

- {{< req "\*" >}} `--task-id`: Task ID
- `--run-id`: Filter by run ID
- `--before`: Return task runs that occurred before this time (RFC3339 timestamp)
- `--after`: Return task runs that occurred after this time (RFC3339 timestamp)
- `--limit`: Limit the number of returned task runs (default is 100)

### CLI Examples

- [List runs for a Flux task](#list-runs-for-a-flux-task)
- [List Flux task runs that occurred in a time range](#list-flux-task-runs-that-occurred-in-a-time-range)
- [List a limited number of Flux task runs](#list-a-limited-number-of-flux-task-runs)

##### List runs for a Flux task
```sh
kapacitor flux task run list --task-id 000x00xX0xXXx00
```

##### List Flux task runs that occurred in a time range
```sh
kapacitor flux task run list \
  --task-id 000x00xX0xXXx00 \
  --after 2021-01-01T00:00:00Z \
  --before 2021-01-31T00:00:00Z
```

##### List a limited number of Flux task runs
```sh
kapacitor flux task run list \
  --task-id 000x00xX0xXXx00 \
  --limit 10
```

## Retry a Kapacitor Flux task run
Use the `kapacitor flux task run retry` command to retry a Kapacitor Flux task run.
Provide the following flags:

{{< req type="key" >}}

- {{< req "\*" >}} `--task-id`: Task ID
- {{< req "\*" >}} `--run-id`: Run ID

```sh
kapacitor flux task run retry \
  --task-id 000x00xX0xXXx00 \
  --run-id XXX0xx0xX00Xx0X 
```


{{% /tab-content %}}
<!------------------------------ END CLI content ------------------------------>

<!----------------------------- BEGIN API content ----------------------------->
{{% tab-content %}}

- [List Kapacitor Flux task runs](#list-kapacitor-flux-task-runs)
- [Retry a Kapacitor Flux task run](#retry-a-kapacitor-flux-task-run-api)

## List Kapacitor Flux task runs
Use the following request method and endpoint to list Kapacitor Flux task runs.

{{< api-endpoint method="get" endpoint="/kapacitor/v1/api/v2/tasks/{taskID}/runs" >}}

Provide the following with your request ({{< req type="key" >}}):

#### Headers
- {{< req "\*" >}} **Content-type:** application/json

#### Path parameters
- {{< req "\*" >}} **taskID**: Task ID

#### Query parameters
- **after**: List task runs after a specific run ID
- **afterTime**: Return task runs that occurred after this time (RFC3339 timestamp)
- **beforeTime**: Return task runs that occurred before this time (RFC3339 timestamp)
- **limit**: Limit the number of task runs returned (default is 100)

### API examples

_The following examples use the task ID `000x00xX0xXXx00`._

- [List all runs for a Flux task](#list-all-runs-for-a-flux-task)
- [List a limited number of runs for a Flux task](#list-a-limited-number-of-runs-for-a-flux-task)
- [List Flux task runs after a specific run ID](#list-flux-task-runs-after-a-specific-run-id)
- [List Flux task runs that occurred in a time range](#list-flux-task-runs-that-occurred-in-a-time-range-api)

##### List all runs for a Flux task
```sh
curl --GET 'http://localhost:9092/kapacitor/v1/api/v2/tasks/000x00xX0xXXx00/runs' \
  --header 'Content-Type: application/json'
```

##### List a limited number of runs for a Flux task
```sh
curl --GET 'http://localhost:9092/kapacitor/v1/api/v2/tasks/000x00xX0xXXx00/runs' \
  --header 'Content-Type: application/json' \
  --data-urlencode "limit=10"
```

##### List Flux task runs after a specific run ID
```sh
curl --GET 'http://localhost:9092/kapacitor/v1/api/v2/tasks/000x00xX0xXXx00/runs' \
  --header 'Content-Type: application/json' \
  --data-urlencode "after=XXX0xx0xX00Xx0X"
```

##### List Flux task runs that occurred in a time range {id="list-flux-task-runs-that-occurred-in-a-time-range-api"}
```sh
curl --GET 'http://localhost:9092/kapacitor/v1/api/v2/tasks/000x00xX0xXXx00/runs' \
  --header 'Content-Type: application/json' \
  --data-urlencode 'afterTime=2021-01-01T00:00:00Z' \
  --data-urlencode 'beforeTime=2021-01-31T00:00:00Z'
```

## Retry a Kapacitor Flux task run {#retry-a-kapacitor-flux-task-run-api}
Use the following request method and endpoint to retry a Kapacitor Flux task run.

{{< api-endpoint method="post" endpoint="/kapacitor/v1/api/v2/tasks/{taskID}/runs/{runID}/retry" >}}

Provide the following with your request ({{< req type="key" >}}):

#### Path parameters
- {{< req "\*" >}} **taskID**: Task ID
- {{< req "\*" >}} **runID**: Run ID to retry

```sh
# Retry run ID XXX0xx0xX00Xx0X for task ID 000x00xX0xXXx00
curl --request POST \
  'http://localhost:9092/kapacitor/v1/api/v2/tasks/000x00xX0xXXx00/runs/XXX0xx0xX00Xx0X'
```


{{% /tab-content %}}
<!------------------------------ END API content ------------------------------>
{{< /tabs-wrapper >}}

For an easy way to retry all failed task runs, see [Retry failed Kapacitor tasks](/kapacitor/v1.6/working/flux/manage/retry-failed/).
