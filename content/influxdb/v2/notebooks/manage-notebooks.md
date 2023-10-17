---
title: Manage notebooks
description: View, update, and delete notebooks.
weight: 103
influxdb/v2/tags: [notebooks]
menu:
  influxdb_v2:
    name: Manage notebooks
    parent: Notebooks
---

Manage your notebooks in the UI:

- [View or update a notebook](#view-or-update-notebooks)
- {{% cloud-only %}}[Share a notebook](#share-a-notebook){{% /cloud-only %}}
- {{% cloud-only %}}[Unshare a notebook](#unshare-a-notebook){{% /cloud-only %}}
- [Delete a notebook](#delete-a-notebook)

## View or update notebooks

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}

    A list of notebooks appears.
2. Click a notebook to open it.
3. To update, edit the notebook's cells and content. Changes are saved automatically.

{{% cloud-only %}}

## Share a notebook

1.  In the navigation menu on the left, click **Notebooks**.

{{< nav-icon "notebooks" >}}

2.  Click the notebook to open it, and then click the **{{< icon "share" >}}** icon.
3.  Select an API token with read-access to all resources in the notebook,
    and then click the **{{< icon "check" >}}** icon.
4.  Share the generated notebook URL as needed.

## Unshare a notebook

To stop sharing a notebook, select **{{< icon "trash" >}}** next to the shared notebook URL.

{{% /cloud-only %}}

## Delete a notebook

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}

2. Hover over a notebook in the list that appears.
3. Click **Delete Notebook**.
4. Click **Confirm**.
