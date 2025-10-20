The `influxdb3 install package` command installs Python packages for use in [InfluxDB 3 processing engine plugins](/influxdb3/version/process/).

## Usage

```bash { placeholders="PACKAGE_NAME" }
influxdb3 install package --packages PACKAGE_NAME
```

Replace the following:

- {{% code-placeholder-key %}}`PACKAGE_NAME`{{% /code-placeholder-key %}}: the name of the Python package to install

## Options

| Option | Description | Default | Environment | Required |
|--------|-------------|---------|-------------|----------|
| `--packages` | Python package names to install (comma-separated) |  |  |  |
| `-r`, `--requirements` | Path to requirements.txt file |  |  |  |
| `-H`, `--host` | Host URL of the running {{< product-name >}} server | `http://127.0.0.1:8181` | `INFLUXDB3_HOST_URL` |  |
| `--token` | The token for authentication with the InfluxDB 3 server |  | `INFLUXDB3_AUTH_TOKEN` |  |
| `--tls-ca` | Path to a custom TLS certificate authority for testing with self-signed certificates |  | `INFLUXDB3_TLS_CA` |  |
| `--plugin-dir` | Location of the plugins directory |  | `INFLUXDB3_PLUGIN_DIR` |  |
| `--virtual-env-location` | Location of the Python virtual environment |  | `VIRTUAL_ENV` |  |
| `--package-manager` | Package manager to use for installing packages | `discover` |  |  |

## Examples

### Install a single package

```bash { placeholders="pandas" }
influxdb3 install package --packages pandas
```

### Install multiple packages

```bash
influxdb3 install package --packages pandas,numpy,scipy
```

### Install packages from requirements file

```bash
influxdb3 install package -r requirements.txt
```

### Install with authentication

```bash { placeholders="AUTH_TOKEN|pandas" }
influxdb3 install package --token AUTH_TOKEN --packages pandas
```

Replace the following:

- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}} for your {{< product-name >}} instance
