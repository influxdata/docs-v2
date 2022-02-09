---
title: Flux experimental http requests package
list_title: requests package
description: >
  The Flux experimental HTTP requests package provides functions for transferring data
  using HTTP protocol.
  Import the `experimental/http/requests` package.
menu:
  flux_0_x_ref:
    name: requests
    parent: http-exp
weight: 301
flux/v0.x/tags: [functions, http, package]
introduced: 0.152.0
---

The Flux experimental HTTP requests package provides functions for transferring data
using HTTP protocol.
Import the `experimental/http/requests` package:

```js
import "experimental/http/requests"
```

## Options
The `experimental/http/requests` package includes the following options:

```js
import "experimental/http/requests"

option requests.defaultConfig = {
    insecureSkipVerify: false,
    timeout: 0ns,
}
```

### defaultConfig
Global default for all HTTP requests using the `experimental/http/requests` package.
Changing this option affects all other packages using the `experimental/http/requests` package.
To change configuration options for a single request, pass a new configuration
record directly into the corresponding function.

The `requests.defaultConfig` record contains the following properties:

- **insecureSkipVerify**: Skip TLS verification _(boolean)_. Default is `false`.
- **timeout**: HTTP request timeout _(duration)_. Default is `0ns` (no timeout).

_See examples [below](#examples)._

## Functions

{{< children type="functions" show="pages" >}}

## Examples

### Change HTTP configuration options globally
Modify the `requests.defaultConfig` option to change all consumers of the
`experimental/http/requests` package.

```js
import "experimental/http/requests"

option requests.defaultConfig = {
    // Set a default timeout of 5s for all requests
    timeout: 0ns,
    insecureSkipVerify: true,
}
```

### Change configuration for a single request
To change the configuration for a single request, extending the default
configuration with only the configuration values you need to customize.

```js
import "experimental/http/requests"

// NOTE: Flux syntax does not yet let you specify anything but an identifier as
// the record to extend. As a workaround, this example rebinds the default
// configuration to a new name, "config".
// See https://github.com/influxdata/flux/issues/3655
defaultConfig = requests.defaultConfig
config = {defaultConfig with
     // Change the timeout to 60s for this request
     // NOTE: We don't have to specify any other properites of the config because we're
     // extending the default.
     timeout: 60s,
}

requests.get(url:"http://example.com", config: config)
```