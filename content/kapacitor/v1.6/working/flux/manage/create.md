---
title: Create Kapacitor Flux tasks
description: >
  Use the **`kapacitor` CLI** or the **Kapacitor HTTP API** to create Kapacitor Flux tasks.
menu:
  kapacitor_1_6:
    name: Create Flux tasks
    parent: Manage Flux tasks
weight: 1
---

Use the **`kapacitor` CLI** or the **Kapacitor HTTP API** to create Kapacitor Flux tasks.

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#)
[API](#)
{{% /tabs %}}
<!----------------------------- BEGIN CLI content ----------------------------->
{{% tab-content %}}

Use the `kapacitor flux task create` command to create a new Kapacitor Flux task.
Provide the following flags:

{{< req type="key" >}}
-  {{< req "\*" >}} `-f`, `--file`: Filepath to the Flux task to add

```sh
kapacitor flux task create --file /path/to/task.flux
```

By default, new Flux tasks are set to `active` and will begin to run on their defined schedule.
To disable a Flux task, [update the task status](#).

{{% /tab-content %}}
<!------------------------------ END CLI content ------------------------------>

<!----------------------------- BEGIN API content ----------------------------->
{{% tab-content %}}

Use the following request method and endpoint to create a new Kapacitor Flux task.

{{< api-endpoint method="post" endpoint="/kapacitor/v1/api/v2/tasks" >}}

Provide the following with your request ({{< req type="key" >}}):

#### Headers
- {{< req "\*" >}} **Content-type:** application/json

#### Request body
JSON object with the following schema:
- {{< req "\*" >}} **flux**: Flux task code
- **status**: Flux tasks status (`active` or `inactive`, default is `active`)
- **description**: Flux task description

```sh
curl --request POST 'http://localhost:9092/kapacitor/v1/api/v2/tasks' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "flux": "option task = {name: \"CPU Total 1 Hour New\", every: 1h}\n\nhost = \"http://localhost:8086\"\ntoken = \"\"\n\nfrom(bucket: \"db/rp\", host:host, token:token)\n\t|> range(start: -1h)\n\t|> filter(fn: (r) =>\n\t\t(r._measurement == \"cpu\"))\n\t|> filter(fn: (r) =>\n\t\t(r._field == \"usage_system\"))\n\t|> filter(fn: (r) =>\n\t\t(r.cpu == \"cpu-total\"))\n\t|> aggregateWindow(every: 1h, fn: max)\n\t|> to(bucket: \"cpu_usage_user_total_1h\", host:host, token:token)",
    "status": "active",
    "description": "Downsample CPU data every hour"
}'
```

{{% /tab-content %}}
<!------------------------------ END API content ------------------------------>
{{< /tabs-wrapper >}}