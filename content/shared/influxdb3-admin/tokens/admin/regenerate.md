
## Use the CLI to regenerate an admin token

To regenerate an admin token, you can use the `--regenerate` flag with the `influxdb3 create token --admin` subcommand. This revokes the existing admin token.

```bash
influxdb3 create token --admin \
  --token ADMIN_TOKEN
  --host {{< influxdb/host >}}
  --regenerate
```

In your command, replace `ADMIN_TOKEN` with the current token string.

By default, `influxdb3` asks for confirmation before regenerating the token.