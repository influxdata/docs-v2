Use the `influxdb3` CLI to list tokens, including admin tokens.

## Use the CLI

```bash
influxdb3 show tokens
```

The command lists metadata for all tokens in your InfluxDB 3 instance, including
the `_admin` token.
The token metadata includes the hash of the token string.
InfluxDB 3 does not store the token string.

### Output formats

The `influxdb3 show tokens` command supports output formats:

- `pretty` _(default)_
- `json`
- `jsonl`
- `csv`
<!-- - `parquet` _(must [output to a file](#output-to-a-parquet-file))_ -->

Use the `--format` flag to specify the output format:

```sh
influxdb3 show tokens \
  --format json
```