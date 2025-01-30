
Use the [`influxdb3` CLI](/influxdb3/version/reference/cli/influxdb3/)
to write line protocol data to {{< product-name >}}.

- [Construct line protocol](#construct-line-protocol)
- [Write the line protocol to InfluxDB](#write-the-line-protocol-to-influxdb)

## Construct line protocol

With a [basic understanding of line protocol](/influxdb3/version/write-data/#line-protocol),
you can now construct line protocol and write data to {{< product-name >}}.
Consider a use case where you collect data from sensors in your home.
Each sensor collects temperature, humidity, and carbon monoxide readings.
To collect this data, use the following schema:

- **table**: `home`
  - **tags**
    - `room`: Living Room or Kitchen
  - **fields**
    - `temp`: temperature in °C (float)
    - `hum`: percent humidity (float)
    - `co`: carbon monoxide in parts per million (integer)
  - **timestamp**: Unix timestamp in _second_ precision

The following line protocol represent the schema described above:

{{% influxdb/custom-timestamps %}}

```text
home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000
```

{{% /influxdb/custom-timestamps %}}

For this tutorial, you can either pass this line protocol directly to the
`influxdb3 write` command as a string, via `stdin`, or you can save it to and
read it from a file.

## Write the line protocol to InfluxDB

Use the [`influxdb3 write` command](/influxdb3/version/reference/cli/influxdb3/write/)
to write the home sensor sample data to {{< product-name >}}.
Provide the following:

- The [database](/influxdb3/version/admin/databases/) name using the
  `--database` option
- Your {{< product-name >}} authorization token using the `-t`, `--token` option
- [Line protocol](#construct-line-protocol).
  Provide the line protocol in one of the following ways:

  - a string
  - a path to a file that contains the line protocol using the `--file` option
  - from stdin

> [!Note]
> {{< product-name >}} auto-detects the timestamp precision by identifying which
> precision results in timestamps relatively close to "now."

<!--
ADD THIS BACK WHEN THE precision FLAG IS ADDED

- The timestamp precision as seconds (`s`) using the `--precision` option

  > [!Note]
  > If no precision is provided, {{< product-name >}} attempts to auto-detect
  > the timestamp precision by identifying which precision results in timestamps
  > relatively close to "now."
-->

{{< tabs-wrapper >}}
{{% tabs %}}
[string](#)
[file](#)
[stdin](#)
{{% /tabs %}}
{{% tab-content %}}

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "(DATABASE|AUTH)_(NAME|TOKEN)|(LINE_PROTOCOL_FILEPATH)" %}}

```sh
influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  'home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000'
```

{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

{{% /tab-content %}}
{{% tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}

1.  In your terminal, enter the following command to create the sample data file:

    ```sh
    echo 'home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
    home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
    home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
    home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
    home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
    home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
    home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
    home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
    home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
    home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
    home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
    home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000' > ./home.lp
    ```

    <!--pytest-codeblocks:cont-->

2.  Enter the following CLI command to write the data from the sample file:

    ```sh
    influxdb3 write \
      --database DATABASE_NAME \
      --token AUTH_TOKEN \
      ./home.lp
    ```

{{% /code-placeholders %}}

{{% /tab-content %}}
{{% tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}

1.  In your terminal, enter the following command to create the sample data file:

    ```sh
    echo 'home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1641024000
    home,room=Kitchen temp=21.0,hum=35.9,co=0i 1641024000
    home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1641027600
    home,room=Kitchen temp=23.0,hum=36.2,co=0i 1641027600
    home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1641031200
    home,room=Kitchen temp=22.7,hum=36.1,co=0i 1641031200
    home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1641034800
    home,room=Kitchen temp=22.4,hum=36.0,co=0i 1641034800
    home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1641038400
    home,room=Kitchen temp=22.5,hum=36.0,co=0i 1641038400
    home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1641042000
    home,room=Kitchen temp=22.8,hum=36.5,co=1i 1641042000' > ./home.lp
    ```

    <!--pytest-codeblocks:cont-->

2.  Enter the following CLI command to write the data from the sample file:

    ```sh
    cat ./home.lp | influxdb3 write \
      --database DATABASE_NAME \
      --token AUTH_TOKEN
    ```

{{% /code-placeholders %}}

{{% /tab-content %}}
{{< /tabs-wrapper >}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to write to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} authorization token

  > [!Note]
  > While in alpha, {{< product-name >}} does not require an authorization token.
