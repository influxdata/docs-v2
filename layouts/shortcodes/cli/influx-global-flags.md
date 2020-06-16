{{ $currentVersion := (index (findRE "[^/]+.*?" .Page.RelPermalink) 0) }}
{{ $link := print "/" $currentVersion "/reference/cli/influx/#mapped-environment-variables"}}

## Global Flags

| Flag |                 | Description                                                                                 | Input type | Maps to <a class ="q-link" href ="{{ $link }}">?</a> |
|:---- |:---             |:-----------                                                                                 |:----------:|:---------------------------------------------------- |
|      | `--host`        | HTTP address of InfluxDB (default `http://localhost:9999`)                                  | string     | `INFLUX_HOST`                                        |
|      | `--local`       | Run commands against the local filesystem                                                   |            |                                                      |
|      | `--skip-verify` | Skip certificate verification (use when connecting over TLS with a self-signed certificate) |            |                                                      |
| `-t` | `--token`       | API token to use in client calls                                                            | string     | `INFLUX_TOKEN`                                       |
