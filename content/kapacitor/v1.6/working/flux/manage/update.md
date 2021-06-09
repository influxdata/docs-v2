---
title: Update Kapacitor Flux tasks
description: >
  Use the **`kapacitor` CLI** or the **Kapacitor HTTP API**  to update Kapacitor Flux tasks.
menu:
  kapacitor_1_6:
    name: Update Flux tasks
    parent: Manage Flux tasks
weight: 3
---

Use the **`kapacitor` CLI** or the **Kapacitor HTTP API** to update Kapacitor Flux tasks.

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#)
[API](#)
{{% /tabs %}}
<!----------------------------- BEGIN CLI content ----------------------------->
{{% tab-content %}}

Use the `kapacitor flux task update` command to update Kapacitor Flux task.
Provide the following flags:

{{< req type="key" >}}

- {{< req "\*" >}} `-i`, `--id`: Task ID
- `--status`: Updated tasks status (`active` or `inactive`)
- `-f`, `--file`: Path to updated Flux script file

## Examples

- [Update Flux task code](#update-flux-task-code)
- [Enable or disable a Flux task](#enable-or-disable-a-flux-task)

##### Update Flux task code
```sh
kapacitor flux task update \
  --id 000x00xX0xXXx00
  --file /path/to/updated-task.flux
```

##### Enable or disable a Flux task
```sh
kapacitor flux task update \
  --id 000x00xX0xXXx00
  --status inactive
```
{{% /tab-content %}}
<!------------------------------ END CLI content ------------------------------>

<!----------------------------- BEGIN API content ----------------------------->
{{% tab-content %}}

Use the following request method and endpoint to update a new Kapacitor Flux task.

{{< api-endpoint method="patch" endpoint="/kapacitor/v1/api/v2/tasks/{taskID}" >}}

Provide the following with your request ({{< req type="key" >}}):

#### Headers
- {{< req "\*" >}} **Content-type**: application/json

#### Path parameters
- {{< req "\*" >}} **taskID**: Task ID to update

#### Request body
JSON object with the following schema:

- **cron**: Override the `cron` Flux task option
- **description**: New task description
- **every**: Override the `every` Flux task option
- **flux**: New Flux task code
- **name**: Override the `name` Flux task option
- **offset**: Override the `offset` Flux task option
- **status**: New Flux task status (`active` or `inactive`)

## API Examples

_The following examples use the task ID `000x00xX0xXXx00`._

- [Update Flux task code](#update-flux-task-code-api)
- [Enable or disable a Flux task](#enable-or-disable-a-flux-task-api)
- [Override Flux task options](#override-flux-task-options-api)

##### Update Flux task code {id="update-flux-task-code-api"}
{{< keep-url >}}
```sh
curl --request PATCH 'http://localhost:9092/kapacitor/v1/api/v2/tasks/000x00xX0xXXx00' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "flux": "option task = {name: \"Updated task name\", every: 1h}\n\nhost = \"http://localhost:8086\"\ntoken = \"\"\n\nfrom(bucket: \"db/rp\", host:host, token:token)\n\t|> range(start: -1h)\n\t|> filter(fn: (r) =>\n\t\t(r._measurement == \"cpu\"))\n\t|> filter(fn: (r) =>\n\t\t(r._field == \"usage_system\"))\n\t|> filter(fn: (r) =>\n\t\t(r.cpu == \"cpu-total\"))\n\t|> aggregateWindow(every: 1h, fn: max)\n\t|> to(bucket: \"cpu_usage_user_total_1h\", host:host, token:token)"
}'
```

##### Enable or disable a Flux task {id="enable-or-disable-a-flux-task-api"}
```sh
curl --request PATCH 'http://localhost:9092/kapacitor/v1/api/v2/tasks/000x00xX0xXXx00' \
  --header 'Content-Type: application/json' \
  --data-raw '{"status": "inactive"}'
```

##### Override Flux task options {id="override-flux-task-options-api"}
```sh
curl --request PATCH 'http://localhost:9092/kapacitor/v1/api/v2/tasks/000x00xX0xXXx00' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "every": "1d",
    "name": "New task name",
    "offset": "15m"
}'
```

{{% /tab-content %}}
<!------------------------------ END API content ------------------------------>
{{< /tabs-wrapper >}}