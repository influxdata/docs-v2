---
title: List Kapacitor Flux tasks
description: >
  Use the **`kapacitor` CLI** or the **Kapacitor HTTP API**  to list Kapacitor Flux tasks.
menu:
  kapacitor_1_6:
    name: List Flux tasks
    parent: Manage Flux tasks
weight: 2
---

Use the **`kapacitor` CLI** or the **Kapacitor HTTP API** to list Kapacitor Flux tasks.

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#)
[API](#)
{{% /tabs %}}
<!----------------------------- BEGIN CLI content ----------------------------->
{{% tab-content %}}

Use the `kapacitor flux task list` command to list Kapacitor Flux tasks.
Provide the following flags:

- `-i`, `--id`: Filter by task ID
- `--limit`: Limit the number of returned tasks (default is 500)

## CLI examples 

- [List all Flux tasks](#list-all-flux-tasks)
- [List a limited number of Flux tasks](#list-a-limited-number-of-flux-tasks)
- [List a specific Flux task](#list-a-specific-flux-task)

##### List all Flux tasks
```sh
kapacitor flux task list
```

##### List a limited number of Flux tasks
```sh
kapacitor flux task list --limit 20
```

##### List a specific Flux task
```sh
kapacitor flux task list --id 000x00xX0xXXx00
```

{{% /tab-content %}}
<!------------------------------ END CLI content ------------------------------>

<!----------------------------- BEGIN API content ----------------------------->
{{% tab-content %}}

Use the following request method and endpoint to list Kapacitor Flux tasks.

{{< api-endpoint method="get" endpoint="/kapacitor/v1/api/v2/tasks" >}}

Provide the following with your request ({{< req type="key" >}}):

#### Headers
- {{< req "\*" >}} **Content-type:** application/json

#### Query parameters
- **after**: List tasks after a specific task ID
- **limit**: Limit the number of tasks returned (default is 500)
- **name**: Filter tasks by name
- **status**: Filter tasks by status (`active` or `inactive`)

## API examples

- [List all Flux tasks](#list-all-flux-tasks-api)
- [List a limited number of Flux tasks](#list-a-limited-number-of-flux-tasks-api)
- [List a specific Flux task by name](#list-a-specific-flux-task-by-name-api)
- [List Flux tasks after a specific task ID](#list-flux-tasks-after-a-specific-task-id)
- [List only active Flux tasks](#list-only-active-flux-tasks)

##### List all Flux tasks {id="list-all-flux-tasks-api"}
```sh
curl --GET 'http://localhost:9092/kapacitor/v1/api/v2/tasks' \
  --header 'Content-Type: application/json'
```

##### List a limited number of Flux tasks {id="list-a-limited-number-of-flux-tasks-api"}
```sh
curl --GET 'http://localhost:9092/kapacitor/v1/api/v2/tasks' \
  --header 'Content-Type: application/json' \
  --data-urlencode "limit=1"
```

##### List a specific Flux task by name {id="list-a-specific-flux-task-by-name-api"}
```sh
curl --GET 'http://localhost:9092/kapacitor/v1/api/v2/tasks' \
  --header 'Content-Type: application/json' \
  --data-urlencode "name=example-flux-task-name"
```

##### List Flux tasks after a specific task ID
```sh
curl --GET 'http://localhost:9092/kapacitor/v1/api/v2/tasks' \
  --header 'Content-Type: application/json' \
  --data-urlencode "after=000x00xX0xXXx00"
```

##### List only active Flux tasks
```sh
curl --GET 'http://localhost:9092/kapacitor/v1/api/v2/tasks' \
  --header 'Content-Type: application/json' \
  --data-urlencode "status=active"
```

{{% /tab-content %}}
<!------------------------------ END API content ------------------------------>
{{< /tabs-wrapper >}}