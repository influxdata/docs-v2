The `influxdb3 show tokens` command lists authentication tokens in your
{{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 show tokens [OPTIONS]
```

## Options

| Option |                  | Description                                                                              |
| :----- | :--------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`         | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
|        | `--token`        | _({{< req >}})_ Authentication token                                                     |
|        | `--format`       | Output format (`pretty` _(default)_, `json`, `jsonl`, `csv`, or `parquet`)               |
|        | `--output`       | Path where to save output when using the `parquet` format                                |
|        | `--tls-ca`       | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
|        | `--tls-no-verify` | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates) |
| `-h`   | `--help`         | Print help information                                                                   |
|        | `--help-all`     | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable   | Option    |
| :-------------------- | :-------- |
| `INFLUXDB3_HOST_URL`  | `--host`  |
| `INFLUXDB3_AUTH_TOKEN`| `--token` |
| `INFLUXDB3_TLS_NO_VERIFY` | `--tls-no-verify` |

## Examples

- [List all tokens](#list-all-tokens)
- [List tokens in different output formats](#list-tokens-in-different-output-formats)
- [Output tokens to a Parquet file](#output-tokens-to-a-parquet-file)

### List all tokens

<!--pytest.mark.skip-->

```bash
influxdb3 show tokens
```

### List tokens in different output formats

You can specify the output format using the `--format` option:

<!--pytest.mark.skip-->

```bash
# JSON format
influxdb3 show tokens --format json

# JSON Lines format
influxdb3 show tokens --format jsonl

# CSV format
influxdb3 show tokens --format csv
```

### Output tokens to a Parquet file

[Parquet](https://parquet.apache.org/) is a binary format.
Use the `--output` option to specify the file where you want to save the Parquet data.

<!--pytest.mark.skip-->
```bash
influxdb3 show tokens \
  --format parquet \
  --output /Users/me/tokens.parquet
```