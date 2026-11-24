---
title: influxdb3 uninstall package
description: >
  The `influxdb3 uninstall package` command removes Python packages from the
  InfluxDB 3 Enterprise Processing Engine environment.
influxdb3/enterprise/tags: [cli, processing engine, plugins]
menu:
  influxdb3_enterprise:
    name: influxdb3 uninstall package
    parent: influxdb3 uninstall
weight: 201
related:
  - /influxdb3/enterprise/reference/cli/influxdb3/install/package/
  - /influxdb3/enterprise/reference/config-options/#plugin-package-allowlist, plugin-package-allowlist option
---

The `influxdb3 uninstall package` command removes Python packages from the
[Processing Engine](/influxdb3/enterprise/plugins/) virtual environment on the
node that receives the request.
This command is available in v3.12.3 and later.

- If you include a version specifier, the command removes the installed package by name.
- If a package is already absent, the command skips it.
- Uninstalling a package leaves its dependencies installed.
- If the request names `pip`, `setuptools`, or `wheel`, the server returns
  `403 Forbidden` and uninstalls nothing.
- If the request names a URL or a path, the server returns `400 Bad Request`.
- If package management is disabled (`--disable-package-management` or
  `--package-manager disabled`), the server returns `403 Forbidden`.
- A [package allowlist](/influxdb3/enterprise/reference/config-options/#plugin-package-allowlist)
  doesn't limit uninstalls.

The command requires an admin token and prints nothing when it succeeds.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 uninstall package [OPTIONS] <PACKAGES>...
```

## Arguments

- **`<PACKAGES>...`** _({{< req >}})_ One or more package names separated by spaces.

## Options

| Option                    | Description                                                                                                   | Default                 | Environment variable      |
| :------------------------ | :------------------------------------------------------------------------------------------------------------ | :---------------------- | :------------------------ |
| `-H`, `--host <HOST_URL>` | The host URL of the running {{< product-name >}} server                                                       | `http://127.0.0.1:8181` | `INFLUXDB3_HOST_URL`      |
| `--token <AUTH_TOKEN>`    | The token for authentication with the {{< product-name >}} server                                             |                         | `INFLUXDB3_AUTH_TOKEN`    |
| `--tls-ca <CA_CERT>`      | Path to a custom TLS certificate authority (for self-signed or internal certificates)                         |                         | `INFLUXDB3_TLS_CA`        |
| `--tls-no-verify`         | Disable TLS certificate verification (**Not recommended in production**, useful for self-signed certificates) |                         | `INFLUXDB3_TLS_NO_VERIFY` |
| `-h`, `--help`            | Print help information                                                                                        |                         |                           |
| `--help-all`              | Print detailed help information                                                                               |                         |                           |

## Examples

In the following examples, replace
{{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}
with your {{% token-link "admin" %}}.

### Uninstall a package

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN" }
influxdb3 uninstall package \
  --token AUTH_TOKEN \
  pandas
```

### Uninstall packages with the HTTP API

Send a `POST` request to `/api/v3/configure/plugin_environment/uninstall_packages`
with the package names in a JSON body.

<!--pytest.mark.skip-->

```bash { placeholders="AUTH_TOKEN" }
curl --request POST \
  "http://localhost:8181/api/v3/configure/plugin_environment/uninstall_packages" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{"packages": ["pandas", "requests"]}'
```
