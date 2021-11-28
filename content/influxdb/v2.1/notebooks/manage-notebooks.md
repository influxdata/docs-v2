---
title: Manage notebooks
description: View, update, and delete notebooks.
weight: 103
influxdb/v2.1/tags: [notebooks]
menu:
  influxdb_2_1:
    name: Manage notebooks
    parent: Notebooks
---

Manage your notebooks in the UI:

- [Share a notebook](#share-a-notebook)
- [Unshare a notebook](#unshare-a-notebook)
- [View or update a notebook](#view-or-update-notebooks)
- [Delete a notebook](#delete-a-notebook)

## Share a notebook

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. Click the notebook to open it, and then click **Share Notebook** icon:

    {{< img-hd src="/img/influxdb/share-notebook.png" alt="Share Notebook" />}}
4. Select an API token with read-access to all resources in the notebook, and then click the **Set Token** icon:

    {{< img-hd src="/img/influxdb/set-token.png" alt="Set Token" />}}

5. Share the generated notebook URL as needed.

## Unshare a notebook

To stop sharing a notebook, select **Delete** next to the shared notebook URL:

{{< img-hd src="/img/influxdb/delete.png" alt="Delete" />}}

## View or update notebooks

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}

    A list of notebooks appears.
2. Click a notebook to open it.
3. To update, edit the notebook's cells and content. Changes are saved automatically.

## Delete a notebook

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}
2. Hover over a notebook in the list that appears.
3. Click **Delete Notebook**.
4. Click **Confirm**.
