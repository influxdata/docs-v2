---
title: Create and manage labels
list_title: Create and manage labels
description: >
  Create, edit, search, and delete labels on the Telegraf Controller
  Labels page or with the API.
menu:
  telegraf_controller:
    name: Create and manage
    parent: Manage labels
weight: 101
related:
  - /telegraf/controller/labels/assign/
---

Create, edit, search, and delete labels on the
**{{% lucide "tag" %}} Labels** page, or manage them with the API.

- [Create a label](#create-a-label)
- [Edit a label](#edit-a-label)
- [Delete labels](#delete-labels)
- [Search the label list](#search-the-label-list)
- [Manage labels with the API](#manage-labels-with-the-api)

{{< img-hd src="/img/telegraf/controller-labels-page.png" alt="Telegraf Controller Labels page" />}}

## Create a label

1.  Navigate to the **Labels** page.
2.  Click **{{% lucide "plus" %}} Add Label**.
3.  Enter a name and, optionally, a description and a color.
    Label names must be unique.
4.  Click **Save**.

## Edit a label

1.  On the **Labels** page, click the
    **{{% lucide "ellipsis-vertical" %}}** menu on the label's row.
2.  Click **{{% lucide "pencil" %}} Edit**.
3.  Update the name, description, or color, and save.
    Renaming a label to an existing label's name is rejected.

Edits apply everywhere the label is assigned.

## Delete labels

To delete a single label, click the
**{{% lucide "ellipsis-vertical" %}}** menu on the label's row, and then
click **{{% lucide "trash-2" %}} Delete**.

To delete multiple labels, select their rows with the checkboxes, and
then click **{{% lucide "trash-2" %}} Delete Labels**.

> [!Warning]
> Deleting a label removes it from every configuration, agent, and
> configuration group it is assigned to.

## Search the label list

Use the search box on the **Labels** page to find labels.
The search matches both label names and descriptions.
The list is sorted by name.

## Manage labels with the API

Label management requires an API token with permission on the
**Labels** API: **read** to list labels, **write** to create and edit
them, and **delete** to delete them.

| Method   | Path              | Action                          |
| :------- | :---------------- | :------------------------------ |
| `GET`    | `/api/labels`     | List labels                     |
| `GET`    | `/api/labels/:id` | Get one label                   |
| `POST`   | `/api/labels`     | Create a label                  |
| `PATCH`  | `/api/labels/:id` | Update a label                  |
| `DELETE` | `/api/labels/:id` | Delete a label                  |
| `DELETE` | `/api/labels`     | Delete multiple labels by ID    |

For example, to create a label:

<!--pytest.mark.skip-->
```bash { placeholders="API_TOKEN" }
curl -X POST "https://telegraf-controller.example.com/api/labels" \
  -H "Authorization: Bearer API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "production", "description": "Production fleet", "color": "#3b82f6"}'
```

For request and response details, see the API reference at `/api/docs`
on your {{% product-name %}} server.
