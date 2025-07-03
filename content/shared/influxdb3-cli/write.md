
The `influxdb3 write` command writes data to your {{< product-name >}} server.

## Usage

<!--pytest.mark.skip-->

```bash
influxdb3 write [OPTIONS] --database <DATABASE_NAME> [LINE_PROTOCOL]...
```

##### Aliases

`write`, `w`

## Arguments

- **LINE_PROTOCOL**: The line protocol to write to {{< product-name >}}.
  Provide the line protocol in one of the following ways:

  - a string
  - a path to a file that contains the line protocol using the `--file` option
  - from stdin

## Options

| Option |                    | Description                                                                              |
| :----- | :----------------- | :--------------------------------------------------------------------------------------- |
| `-H`   | `--host`           | Host URL of the running {{< product-name >}} server (default is `http://127.0.0.1:8181`) |
| `-d`   | `--database`       | _({{< req >}})_ Name of the database to operate on                                       |
|        | `--token`          | _({{< req >}})_ Authentication token                                                     |
| `-f`   | `--file`           | A file that contains line protocol to write                                              |
|        | `--accept-partial` | Accept partial writes                                                                    |
|        | `--tls-ca`         | Path to a custom TLS certificate authority (for testing or self-signed certificates)     |
| `-h`   | `--help`           | Print help information                                                                   |
|        | `--help-all`       | Print detailed help information                                                          |

### Option environment variables

You can use the following environment variables to set command options:

| Environment Variable      | Option       |
| :------------------------ | :----------- |
| `INFLUXDB3_HOST_URL`      | `--host`     |
| `INFLUXDB3_DATABASE_NAME` | `--database` |
| `INFLUXDB3_AUTH_TOKEN`    | `--token`    |

## Examples

- [Write line protocol to your InfluxDB 3 server](#write-line-protocol-to-your-influxdb-3-server)
- [Write line protocol and accept partial writes](#write-line-protocol-and-accept-partial-writes)

In the examples below, replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to query
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: 
  Authentication token

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}

### Write line protocol to your InfluxDB 3 server

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% influxdb/custom-timestamps %}}
<!--pytest.mark.skip-->

```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  'home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000'
```
{{% /influxdb/custom-timestamps %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --file ./data.lp
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
cat ./data.lp | influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Write line protocol and accept partial writes

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
{{% influxdb/custom-timestamps %}}
<!--pytest.mark.skip-->

```bash
influxdb3 write \
  --accept-partial \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  'home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000'
```
{{% /influxdb/custom-timestamps %}}
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
influxdb3 write \
  --accept-partial \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --file ./data.lp
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->

```bash
cat ./data.lp | influxdb3 write \
  --accept-partial \
  --database DATABASE_NAME \
  --token AUTH_TOKEN
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /code-placeholders %}}
