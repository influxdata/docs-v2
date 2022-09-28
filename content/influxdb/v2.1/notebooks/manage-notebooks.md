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

- [View or update a notebook](#view-or-update-notebooks)
- {{% cloud-only %}}[Save a notebook version](#save-a-notebook){{% /cloud-only %}}
- {{% cloud-only %}}[Manage notebook version history](#manage-notebook-version-history){{% /cloud-only %}}
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

## Save a notebook version

1.  In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}

2. Click the notebook to open it.
3. Click the **{{< icon "..." >}}** icon, then select **Save to version history**.

## Manage notebook version history

1. In the navigation menu on the left, click **Notebooks**.

    {{< nav-icon "notebooks" >}}

2. Click the notebook to open it.
3. Click the **{{< icon "..." >}}** icon, then select **Version History**.
4. A timestamped list of all saved versions appears in the right panel.
  - To preview a previous version, click the version and then click **Run** in the upper left.
  - To restore a previous version, click the version and then click **Restore This Version** in the upper right. Alternatively, click the **{{< icon "..." >}}** icon next to the version and select **Restore this version**.
  - To clone a previous version to a new notebook, click the **{{< icon "..." >}}** icon next to the version and select **Clone version to new notebook**.

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
