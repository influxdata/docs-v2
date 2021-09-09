---
title: Flux pushbullet package
list_title: pushbullet package
description: >
  The Flux `pushbullet` package provides functions for sending data to
  [Pushbullet](https://www.pushbullet.com/).
  Import the `pushbullet` package.
aliases:
  - /influxdb/v2.0/reference/flux/stdlib/pushbullet/
  - /influxdb/cloud/reference/flux/stdlib/pushbullet/
menu:
  flux_0_x_ref:
    name: pushbullet
    parent: Standard library
weight: 11
flux/v0.x/tags: [functions, pushbullet, package]
---

The Flux `pushbullet` package provides functions for sending data to
[Pushbullet](https://www.pushbullet.com/).
Import the `pushbullet` package:

```js
import "pushbullet"
```

## Options
The `pushbullet` package includes the following options:

```js
import "pushbullet"

option pushbullet.defaultURL = "https://api.pushbullet.com/v2/pushes"
```

### defaultURL {data-type="string"}
Default Pushbullet API URL.
Default is `https://api.pushbullet.com/v2/pushes`.

## Functions
{{< children type="functions" show="pages" >}}
