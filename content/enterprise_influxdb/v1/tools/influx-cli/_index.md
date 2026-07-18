---
title: influx - InfluxDB command line interface
menu:
  enterprise_influxdb_v1:
    name: influx
    weight: 10
    parent: Tools
---

The `influx` command line interface (CLI) provides an interactive shell for the HTTP API associated with `influxd`.
It includes commands for writing and querying data, and managing many aspects of InfluxDB, including databases, organizations, and users.

## Usage

```
influx [flags]
```

## Flags {.no-shorthand}

| Flag              | Description                                                                                           |
|-------------------|-------------------------------------------------------------------------------------------------------|
| `-version`        | Display the version and exit                                                                          |
| `-url-prefix`     | Path to add to the URL after the host and port. Specifies a custom endpoint to connect to.            |
| `-host`           | HTTP address of InfluxDB (default: `http://localhost:8086`)                                           |
| `-port`           | Port to connect to                                                                                    |
| `-socket`         | Unix socket to connect to                                                                             |
| `-database`       | Database to connect to the server                                                                     |
| `-password`       | Password to connect to the server. Leaving blank will prompt for password (`--password ''`).          |
| `-username`       | Username to connect to the server                                                                     |
| `-ssl`            | Use https for requests                                                                                |
| `-unsafessl`      | Set this when connecting to the cluster using https                                                   |
| `-cert`           | Path to the client certificate file (PEM) presented for mutual TLS (mTLS). Also settable via `INFLUX_CERT`. _v1.13.0+_ |
| `-key`            | Path to the client private key file (PEM) for mutual TLS (mTLS). Also settable via `INFLUX_KEY`. _v1.13.0+_ |
| `-root-ca`        | Path to the CA bundle (PEM) used to verify the server certificate. Also settable via `INFLUX_ROOT_CA`. _v1.13.0+_ |
| `-insecure-certificate` | Ignore file permission checks when loading the client certificate and key. Also settable via `INFLUX_INSECURE_CERTIFICATE`. _v1.13.0+_ |
| `-ignore-cert-sanity-checks` | Load the client certificate even if it fails client-authentication sanity checks. Also settable via `INFLUX_IGNORE_CERT_SANITY_CHECKS`. _v1.13.0+_ |
| `-execute`        | Execute command and quit                                                                              |
| `-format`         | Specify the format of the server responses: json, csv, or column                                      |
| `-precision`      | Specify the format of the timestamp: rfc3339, h, m, s, ms, u or ns                                    |
| `-consistency`    | Set write consistency level: any, one, quorum, or all                                                 |
| `-pretty`         | Turns on pretty print for JSON format                                                                 |
| `-import`         | Import a previous database export from file                                                           |
| `-pps`            | Points per second the import will allow. The default is `0` and will not throttle importing.          |
| `-path`           | Path to file to import                                                                                |
| `-compressed`     | Set to true if the import file is compressed                                                          |

{{< children >}}
