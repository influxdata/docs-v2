
Use the Flux REPL (Read–Eval–Print Loop) to execute Flux scripts and interact with InfluxDB and other data sources.
[Build the REPL](#build-the-repl) from the Flux source code.

{{% note %}}
Flux REPL supports running Flux scripts against InfluxDB 1.8+.
{{% /note %}}

## Build the REPL

To use the Flux REPL, build it from source using the [Flux repository](https://github.com/influxdata/flux/).
For instructions, see the [Flux repository README](https://github.com/influxdata/flux/#requirements).

## Use the REPL

- [Open a REPL session](#open-a-repl-session)
- [Query data from InfluxDB](#query-data-from-influxdb)
- [Multi-line entries](#multi-line-entries)
- [Exit the REPL](#exit-the-repl)

### Open a REPL session
To open a new REPL session, run:

```sh
./flux repl
```

### Query data from InfluxDB
To query data from InfluxDB (local or remote), provide the host, organization, and token parameters
to the [`from()` function](/flux/v0/stdlib/influxdata/influxdb/from/).

```js
from(
    bucket: "example-bucket",
    host: "http://localhost:8086",
    org: "example-org",
    token: "My5uP3rS3cRetT0k3n",
)
```

### Multi-line entries
Multi-line scripts like the example above work when pasted into the REPL.
Pasting newlines from the clipboard is allowed.
However, you cannot enter newline characters directly from the keyboard.

### Exit the REPL
Exit the REPL by pressing **Control + D**.
