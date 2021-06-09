---
title: View Kapacitor Flux task logs
description: >
  Use the **`kapacitor` CLI** or the **Kapacitor HTTP API**  to list Kapacitor Flux tasks.
menu:
  kapacitor_1_6:
    name: View Flux task logs
    parent: Manage Flux tasks
weight: 4
---

Use the **`kapacitor` CLI** or the **Kapacitor HTTP API** to view Kapacitor Flux task logs.

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#)
[API](#)
{{% /tabs %}}
<!----------------------------- BEGIN CLI content ----------------------------->
{{% tab-content %}}

Use the `kapacitor flux task log list` command to output Kapacitor Flux task logs.
Provide the following flags:

{{< req type="key" >}}

- {{< req "\*" >}} `--task-id`: Task ID
- `--run-id`: Task run ID _(see [Manage Flux task runs](/kapacitor/v1.6/working/flux/manage/task-runs/))_

## CLI examples 

- [Show all run logs for a Flux task](#show-all-run-logs-for-a-flux-task)
- [Show logs for a specific Flux task run](#show-logs-for-a-specific-flux-task-run)

##### Show all run logs for a Flux task
```sh
kapacitor flux task log list --task-id 000x00xX0xXXx00
```

##### Show logs for a specific Flux task run
```sh
kapacitor flux task log list \
  --task-id 000x00xX0xXXx00 \
  --run-id XXX0xx0xX00Xx0X
```

{{% /tab-content %}}
<!------------------------------ END CLI content ------------------------------>

<!----------------------------- BEGIN API content ----------------------------->
{{% tab-content %}}

- [Show all run logs for a task](#show-all-run-logs-for-a-task-api)
- [Show logs for a specific Flux task run](#show-logs-for-a-specific-flux-task-run-api)

## Show all run logs for a task {id="show-all-run-logs-for-a-task-api"}
Use the following request method and endpoint to show Kapacitor Flux task logs.

{{< api-endpoint method="get" endpoint="/kapacitor/v1/api/v2/tasks/{taskID}/log" >}}

Provide the following with your request ({{< req type="key" >}}):

#### Path parameters
- {{< req "\*" >}} **taskID**: Task ID

```sh
# Get logs for task ID 000x00xX0xXXx00
curl --request GET \
  'http://localhost:9092/kapacitor/v1/api/v2/tasks/000x00xX0xXXx00/logs'
```

## Show logs for a specific Flux task run {id="show-logs-for-a-specific-flux-task-run-api"}
Use the following request method and endpoint to show logs for a specific
Kapacitor Flux task run.

{{< api-endpoint method="get" endpoint="/kapacitor/v1//api/v2/tasks/{taskID}/runs/{runID}/logs" >}}

Provide the following with your request ({{< req type="key" >}}):

#### Path parameters
- {{< req "\*" >}} **taskID**: Task ID
- {{< req "\*" >}} **runID**: Task run ID _(see [Manage Flux task runs](/kapacitor/v1.6/working/flux/manage/task-runs/))_

```sh
# Get logs for task ID 000x00xX0xXXx00, run ID XXX0xx0xX00Xx0X
curl --request GET \
  'http://localhost:9092/kapacitor/v1/api/v2/tasks/000x00xX0xXXx00/runs/XXX0xx0xX00Xx0X/logs'
```

{{% /tab-content %}}
<!------------------------------ END API content ------------------------------>
{{< /tabs-wrapper >}}