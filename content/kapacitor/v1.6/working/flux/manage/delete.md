---
title: Delete Kapacitor Flux tasks
description: >
  Use the **`kapacitor` CLI** or the **Kapacitor HTTP API** to delete Kapacitor Flux tasks.
menu:
  kapacitor_1_6:
    name: Delete Flux tasks
    parent: Manage Flux tasks
weight: 6
---

Use the **`kapacitor` CLI** or the **Kapacitor HTTP API** to delete Kapacitor Flux tasks.
Provide the **task ID** to delete.
_Task IDs are provided in [task list](/kapacitor/v1.6/working/flux/manage/list/) output._

{{< tabs-wrapper >}}
{{% tabs %}}
[CLI](#)
[API](#)
{{% /tabs %}}
<!----------------------------- BEGIN CLI content ----------------------------->
{{% tab-content %}}

Use the `kapacitor flux task delete` command to delete a Kapacitor Flux task.
Provide the following flag:

{{< req type="key" >}}
-  {{< req "\*" >}}`-i`, `--id`: Task ID to delete

```sh
kapacitor flux task delete --id 000x00xX0xXXx00
```

{{% /tab-content %}}
<!------------------------------ END CLI content ------------------------------>

<!----------------------------- BEGIN API content ----------------------------->
{{% tab-content %}}

Use the following request method and endpoint to delete a Kapacitor Flux task.

{{< api-endpoint method="delete" endpoint="/kapacitor/v1/api/v2/tasks/{taskID}" >}}

Provide the following with your request ({{< req type="key" >}}):

#### Path parameters
- {{< req "\*" >}} **taskID**: Task ID to delete

```sh
# Delete task ID 000x00xX0xXXx00
curl --request DELETE 'http://localhost:9092/kapacitor/v1/api/v2/tasks/000x00xX0xXXx00'
```

{{% /tab-content %}}
<!------------------------------ END API content ------------------------------>
{{< /tabs-wrapper >}}