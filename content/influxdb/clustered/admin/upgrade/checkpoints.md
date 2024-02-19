---
title: Checkpoint Releases
description: >
    It is crucial to upgrade to a checkpoint releases before proceeding to subsequent releases.
menu:
  influxdb_clustered:
    parent: Upgrade Clustered
---

A "checkpoint release" of Clustered is a specific release where a breaking change has been made to one of the contained components, such as the IOx storage engine.
These are clearly labelled on `oci.influxdata.com`.

Care must be taken with checkpoint releases to ensure that you do not upgrade **past** a checkpoint, you must first upgrade **to** the checkpoint.

If you attempt to upgrade past a checkpoint release without first upgrading to it, you risk **corrupt or lost data**.
We aim to make checkpoint releases only when absolutely necessary.

What this means is best demonstrated through a short example:

```
20240215-433509
20240214-863513 checkpoint
20240111-824437
20231213-791734
20231117-750011
20231115-746129
20231024-711448
20231004-666907 checkpoint
20230922-650371 <-- For this example, you are here.
```

If your current release is `20230922-650371` you **must** upgrade to `20231004-666907` first before attempting to upgrade to proceeding releases, such as `20231213-791734`. The same also occurs for the later checkpoint release of `20240214-863513`.

You are free to upgrade versions between checkpoint releases, but it is crucial to always upgrade to a checkpoint before going beyond it.
