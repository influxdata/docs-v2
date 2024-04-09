---
title: secrets.get() function
description: >
  `secrets.get()` retrieves a secret from the InfluxDB secret store.
menu:
  flux_v0_ref:
    name: secrets.get
    parent: influxdata/influxdb/secrets
    identifier: influxdata/influxdb/secrets/get
weight: 301
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/influxdata/influxdb/secrets/secrets.flux#L39-L39

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`secrets.get()` retrieves a secret from the InfluxDB secret store.



##### Function type signature

```js
(key: string) => string
```

{{% caption %}}
For more information, see [Function type signatures](/flux/v0/function-type-signatures/).
{{% /caption %}}

## Parameters

### key
({{< req >}})
Secret key to retrieve.




## Examples

- [Retrieve a key from the InfluxDB secret store](#retrieve-a-key-from-the-influxdb-secret-store)
- [Populate sensitive credentials with secrets//](#populate-sensitive-credentials-with-secrets)

### Retrieve a key from the InfluxDB secret store

```js
import "influxdata/influxdb/secrets"

secrets.get(key: "KEY_NAME")

```


### Populate sensitive credentials with secrets//

```js
import "sql"
import "influxdata/influxdb/secrets"

username = secrets.get(key: "POSTGRES_USERNAME")
password = secrets.get(key: "POSTGRES_PASSWORD")

sql.from(
    driverName: "postgres",
    dataSourceName: "postgresql://${username}:${password}@localhost",
    query: "SELECT * FROM example-table",
)

```

