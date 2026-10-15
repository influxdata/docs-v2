The `influxdb3 install package` command installs Python packages within the plugin environment for use in [{{< product-name >}} processing engine plugins](/influxdb3/version/process/).
Use this command to add external dependencies that your plugins require, such as data processing libraries, notification tools, or forecasting packages.

## Usage

```bash
# Syntax
influxdb3 install package [OPTIONS] [PACKAGES]...
```

## Arguments

- **`[PACKAGES]...`**: One or more package names to install (space-separated)

## Options

<!--docs:exclude
--packages: internal variable, use positional [PACKAGES]...
-->

| Option                                          | Description                                                         | Default                 | Environment Variable        |
| :---------------------------------------------- | :------------------------------------------------------------------ | :---------------------- | :-------------------------- |
| `-H`, `--host <HOST_URL>`                       | The host URL of the running {{< product-name >}} server             | `http://127.0.0.1:8181` | `INFLUXDB3_HOST_URL`        |
| `--token <AUTH_TOKEN>`                          | The token for authentication with the {{< product-name >}} server   |                         | `INFLUXDB3_AUTH_TOKEN`      |
| `--plugin-dir <PLUGIN_DIR>`                     | Location of the plugins directory                                   | `/plugins`              | `INFLUXDB3_PLUGIN_DIR`      |
| `--virtual-env-location <VIRTUAL_ENV_LOCATION>` | Custom virtual environment location                                 |                         | `VIRTUAL_ENV`               |
| `--package-manager <PACKAGE_MANAGER>`           | _Deprecated._ Has no effect; `pip` is always used                   |                         | `INFLUXDB3_PACKAGE_MANAGER` |
| `--plugin-repo <PLUGIN_REPO>`                   | Plugin repository URL                                               |                         | `INFLUXDB3_PLUGIN_REPO`     |
| `-r`, `--requirements <REQUIREMENTS>`           | Path to a `requirements.txt` file                                   |                         |                             |
| `--tls-ca <CA_CERT>`                            | Path to a custom TLS certificate authority (for self-signed or internal certificates) |                         | `INFLUXDB3_TLS_CA`          |
| `--tls-no-verify`                               | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates) |                         | `INFLUXDB3_TLS_NO_VERIFY`   |
| `-h`, `--help`                                  | Print help information                                              |                         |                             |
| `--help-all`                                    | Print detailed help information                                     |                         |                             |

## Examples

### Install a single package

```bash
influxdb3 install package pandas
```

### Install multiple packages

```bash
influxdb3 install package pint pandas requests
```

### Install packages from a requirements file

```bash
influxdb3 install package -r requirements.txt
```

### Install packages with custom host and authentication

```bash { placeholders="AUTH_TOKEN" }
influxdb3 install package \
  --host http://localhost:8181 \
  --token AUTH_TOKEN \
  pint pandas
```

Replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}} with your {{% token-link "admin" %}} for your {{< product-name >}} instance.

### Install packages with a custom CA certificate

```bash
influxdb3 install package \
  --tls-ca /path/to/ca-cert.pem \
  requests
```

## Package management

### Package manager

{{< product-name >}} bundles Python and `pip`, and always uses `pip` to install plugin packages.

### Virtual environment

The CLI manages a virtual environment for plugin packages to avoid conflicts with system Python packages.
You can customize the virtual environment location with `--virtual-env-location` or the `VIRTUAL_ENV` environment variable.

### Security mode

If your {{< product-name >}} server was started with [`--disable-package-management`](/influxdb3/version/reference/config-options/#disable-package-management), the `influxdb3 install package` command is blocked for security and compliance requirements.

When attempting to install packages with this command while the server has package installation disabled, the command fails with a `403 Forbidden` error:

```
Package installation has been disabled. Contact your administrator for more information.
```

The server's `--disable-package-management` option is designed for:

- **Enterprise security requirements**: Prevent arbitrary package installation
- **Compliance environments**: Control exactly which packages are available
- **Air-gapped deployments**: Pre-install all dependencies before deployment
- **Multi-tenant scenarios**: Prevent tenants from installing potentially malicious packages

In these environments, administrators must pre-install all required Python packages into the server's virtual environment before starting {{< product-name >}}.

For more information, see the [`disable-package-management`](/influxdb3/version/reference/config-options/#disable-package-management) configuration option.

### Troubleshooting

If package installation fails:

- **Check if package installation is disabled**: If you receive a `403 Forbidden` error, contact your administrator. Package installation may be disabled on your {{< product-name >}} instance.
- **Verify network connectivity**: Ensure your {{< product-name >}} instance can reach PyPI or your custom package repository
- **Check package names**: Verify package names are correct and available in the package repository
- **Review logs**: Check {{< product-name >}} server logs for detailed error messages
- **Test with pip**: Try installing the package directly with `pip` to verify it's available
- **Use requirements file**: For complex dependencies, use a `requirements.txt` file with version pinning
- **Check Docker disk space** (Docker environments only): If running {{< product-name >}} in Docker and seeing "No space left on device" errors, free up disk space:

  ```bash
  # Check Docker disk usage
  docker system df

  # Remove unused images and build cache
  docker image prune -af
  docker buildx prune -af
  ```

{{% show-in "core" %}}
In {{< product-name >}} 3.12, a failed install, for example a package that doesn't exist, can still return HTTP status `200`.
Confirm that the package imports, for example, by testing a plugin that uses it, before you rely on it.
{{% /show-in %}}
{{% show-in "enterprise" %}}
When an install fails, for example for a package that doesn't exist, {{< product-name >}} returns HTTP status `500` with pip's error message.
{{% /show-in %}}
<!-- VERIFIED against live 3.12.0-0.rc.2 (2026-09-30): installing a package that doesn't exist returned 200 on Core and 500 with pip's message on Enterprise. If the fix reaches Core before GA, remove the Core note. -->
