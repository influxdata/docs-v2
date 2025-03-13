---
title: Get started writing data
seotitle: Write data | Get started with InfluxDB Cloud Serverless
list_title: Write data
description: >
  Get started writing data to InfluxDB by learning about line protocol and using
  tools like the InfluxDB UI, `influx` CLI, Telegraf, client libraries, and the InfluxDB API.
menu:
  influxdb3_cloud_serverless:
    name: Write data
    parent: Get started
    identifier: get-started-write-data
weight: 101
metadata: [2 / 3]
related:
  - /influxdb3/cloud-serverless/write-data/
  - /influxdb3/cloud-serverless/write-data/best-practices/
  - /influxdb3/cloud-serverless/reference/syntax/line-protocol/
  - /telegraf/v1/
---

This tutorial walks you through the fundamental of creating **line protocol**
data and writing it to InfluxDB.

InfluxDB provides many different options for ingesting or writing data,
including the following:

- Influx user interface (UI)
- InfluxDB HTTP API (v1 and v2)
- Telegraf
- `influx3` data CLI
- InfluxDB client libraries
- `influx` CLI

If using tools like Telegraf or InfluxDB client libraries, they can build the
line protocol for you, but it's good to understand how line protocol works.

## Line protocol

All data written to InfluxDB is written using **line protocol**, a text-based
format that lets you provide the necessary information to write a data point to
InfluxDB.
_This tutorial covers the basics of line protocol, but for detailed information,
see the
[Line protocol reference](/influxdb3/cloud-serverless/reference/syntax/line-protocol/)._

### Line protocol elements

Each line of line protocol contains the following elements:

{{< req type="key" >}}

- {{< req "\*" >}} **measurement**:  String that identifies the [measurement](/influxdb3/cloud-serverless/reference/glossary/#measurement) to store the data in.
- **tag set**: Comma-delimited list of key value pairs, each representing a tag.
  Tag keys and values are unquoted strings. _Spaces, commas, and equal characters must be escaped._
- {{< req "\*" >}} **field set**: Comma-delimited list of key value pairs, each representing a field.
  Field keys are unquoted strings. _Spaces and commas must be escaped._
  Field values can be [strings](/influxdb3/cloud-serverless/reference/syntax/line-protocol/#string) (quoted),
  [floats](/influxdb3/cloud-serverless/reference/syntax/line-protocol/#float),
  [integers](/influxdb3/cloud-serverless/reference/syntax/line-protocol/#integer),
  [unsigned integers](/influxdb3/cloud-serverless/reference/syntax/line-protocol/#uinteger),
  or [booleans](/influxdb3/cloud-serverless/reference/syntax/line-protocol/#boolean).
- **timestamp**: [Unix timestamp](/influxdb3/cloud-serverless/reference/syntax/line-protocol/#unix-timestamp)
  associated with the data. InfluxDB supports up to nanosecond precision.
  _If the precision of the timestamp is not in nanoseconds, you must specify the
  precision when writing the data to InfluxDB._

#### Line protocol element parsing

 <!-- vale InfluxDataDocs.v3Schema = NO -->
- **measurement**: Everything before the _first unescaped comma before the first
whitespace_.
- **tag set**: Key-value pairs between the _first unescaped comma_ and the _first
unescaped whitespace_.
- **field set**: Key-value pairs between the _first and second unescaped whitespaces_.
- **timestamp**: Integer value after the _second unescaped whitespace_.
- Lines are separated by the newline character (`\n`). Line protocol is
whitespace sensitive.
<!-- vale InfluxDataDocs.v3Schema = YES -->

---

{{< influxdb/line-protocol >}}

---

_For schema design recommendations, see
[InfluxDB schema design](/influxdb3/cloud-serverless/write-data/best-practices/schema-design/)._

## Construct line protocol

 <!-- vale InfluxDataDocs.v3Schema = NO -->
With a basic understanding of line protocol, you can now construct line protocol
and write data to InfluxDB.
Consider a use case where you collect data from sensors in your home.
Each sensor collects temperature, humidity, and carbon monoxide readings.
To collect this data, use the following schema:

- **measurement**: `home`
  - **tags**
    - `room`: Living Room or Kitchen
  - **fields**
    - `temp`: temperature in °C (float)
    - `hum`: percent humidity (float)
    - `co`: carbon monoxide in parts per million (integer)
  - **timestamp**: Unix timestamp in _second_ precision
  <!-- vale InfluxDataDocs.v3Schema = YES -->

The following line protocol sample represents data collected hourly beginning at
{{% influxdb/custom-timestamps-span %}}**2022-01-01T08:00:00Z (UTC)** until **2022-01-01T20:00:00Z (UTC)**{{% /influxdb/custom-timestamps-span %}}.

{{% influxdb/custom-timestamps %}}

##### Home sensor data line protocol

```text
home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1719924000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1719924000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1719927600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1719927600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1719931200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1719931200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1719934800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1719934800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1719938400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1719938400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1719942000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1719942000
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1719945600
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1719945600
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1719949200
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1719949200
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1719952800
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1719952800
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1719956400
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1719956400
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1719960000
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1719960000
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1719963600
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1719963600
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1719967200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1719967200
```

{{% /influxdb/custom-timestamps %}}

## Write line protocol to InfluxDB

The following examples show how to write the preceding
[sample data](#home-sensor-data-line-protocol), already in line protocol format,
to an {{% product-name %}} bucket.

To learn more about available tools and options, see [Write data](/influxdb3/cloud-serverless/write-data/).

> [!Note]
> Some examples in this getting started tutorial assume your InfluxDB
> credentials (**URL**, **organization**, and **token**) are provided by
> [environment variables](/influxdb3/cloud-serverless/get-started/setup/?t=InfluxDB+API#configure-authentication-credentials).

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxDB UI](#)
[influx CLI](#)
[Telegraf](#)
[v1 API](#)
[v2 API](#)
[Python](#)
[Go](#)
[Node.js](#)
[C#](#)
[Java](#)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

1.  Go to [cloud2.influxdata.com](https://cloud2.influxdata.com) in a browser to
    log in and access the InfluxDB UI.

2.  Navigate to **Load Data** > **Buckets** using the left navigation bar.

{{< nav-icon "load data" >}}

3.  Click **{{< icon "plus" >}} {{< caps >}}Add Data{{< /caps >}}** on the bucket
    you want to write the data to and select **Line Protocol**.
4.  Select **{{< caps >}}Enter Manually{{< /caps >}}**.
5.  {{< req "Important" >}} In the **Precision** drop-down menu above the line
    protocol text field, select **Seconds** (to match to precision of the
    timestamps in the line protocol).
6.  Copy the [line protocol above](#home-sensor-data-line-protocol) and paste it
    into the line protocol text field.
7.  Click **{{< caps >}}Write Data{{< /caps >}}**.

The UI confirms that the data has been written successfully.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!---------------------------- BEGIN CLI CONTENT ----------------------------->

1.  If you haven't already, [download, install, and configure the `influx` CLI](/influxdb3/cloud-serverless/get-started/setup/?t=influx+CLI#download-install-and-configure-the-influx-cli).
2.  Use the [`influx write` command](/influxdb3/cloud-serverless/reference/cli/influx/write/)
    to write the [preceding line protocol](#home-sensor-data-line-protocol) to InfluxDB.
    
    **Provide the following**:

    - `-b, --bucket` or `--bucket-id` flag with the bucket name or ID to write do.
    - `-p, --precision` flag with the [timestamp precision](/influxdb3/cloud-serverless/reference/glossary/#timestamp-precision) (`s`).
    - String-encoded line protocol.
    - [Connection and authentication credentials](/influxdb3/cloud-serverless/get-started/setup/?t=influx+CLI#configure-authentication-credentials)

{{< influxdb/custom-timestamps >}}

```sh
influx write \
  --bucket get-started \
  --precision s "
home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1719924000
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1719924000
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1719927600
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1719927600
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1719931200
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1719931200
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1719934800
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1719934800
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1719938400
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1719938400
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1719942000
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1719942000
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1719945600
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1719945600
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1719949200
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1719949200
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1719952800
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1719952800
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1719956400
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1719956400
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1719960000
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1719960000
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1719963600
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1719963600
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1719967200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1719967200
"
```

{{< /influxdb/custom-timestamps >}}
If successful, the output is the success message; otherwise, error details and
the failure message.

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------- BEGIN TELEGRAF CONTENT ------------------------------>

{{< influxdb/custom-timestamps >}}

Use [Telegraf](/telegraf/v1/) to consume line protocol, and then write it to
{{< product-name >}}.

11.  If you haven't already, follow the instructions to
    [download and install Telegraf](/telegraf/v1/install/).

2.  Copy and save the [home sensor data sample](#home-sensor-data-line-protocol)
    to a file on your local system--for example, `home.lp`.

    ```sh
    cat <<- EOF > home.lp
    home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1719924000
    home,room=Kitchen temp=21.0,hum=35.9,co=0i 1719924000
    home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1719927600
    home,room=Kitchen temp=23.0,hum=36.2,co=0i 1719927600
    home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1719931200
    home,room=Kitchen temp=22.7,hum=36.1,co=0i 1719931200
    home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1719934800
    home,room=Kitchen temp=22.4,hum=36.0,co=0i 1719934800
    home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1719938400
    home,room=Kitchen temp=22.5,hum=36.0,co=0i 1719938400
    home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1719942000
    home,room=Kitchen temp=22.8,hum=36.5,co=1i 1719942000
    home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1719945600
    home,room=Kitchen temp=22.8,hum=36.3,co=1i 1719945600
    home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1719949200
    home,room=Kitchen temp=22.7,hum=36.2,co=3i 1719949200
    home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1719952800
    home,room=Kitchen temp=22.4,hum=36.0,co=7i 1719952800
    home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1719956400
    home,room=Kitchen temp=22.7,hum=36.0,co=9i 1719956400
    home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1719960000
    home,room=Kitchen temp=23.3,hum=36.9,co=18i 1719960000
    home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1719963600
    home,room=Kitchen temp=23.1,hum=36.6,co=22i 1719963600
    home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1719967200
    home,room=Kitchen temp=22.7,hum=36.5,co=26i 1719967200
    EOF
    ```

3.  Run the following command to generate a Telegraf configuration file
    (`./telegraf.conf`) that enables the `inputs.file` and `outputs.influxdb_v2`
    plugins:

    ```sh
    telegraf --sample-config \
      --input-filter file \
      --output-filter influxdb_v2 \
      > telegraf.conf
    ```

4.  In your editor, open `./telegraf.conf` and configure the following:

    - **`file` input plugin**: In the `[[inputs.file]].files` list, replace
      `"/tmp/metrics.out"` with your sample data filename. If Telegraf can't
      find a file when started, it stops processing and exits.

      ```toml
      [[inputs.file]]
        ## Files to parse each interval.  Accept standard unix glob matching rules,
        ## as well as ** to match recursive files and directories.
        files = ["home.lp"]
      ```

      <!--test
      ```bash
      echo '[[inputs.file]]' > telegraf.conf
      echo '  files = ["home.lp"]' >> telegraf.conf
      ```
      -->

    - **`output-influxdb_v2` output plugin**: In the `[[outputs.influxdb_v2]]`
section, replace the default values with the following configuration for your
{{% product-name %}} bucket:

      ```toml
      [[outputs.influxdb_v2]]
        # InfluxDB Cloud Serverless URL
        urls = ["${INFLUX_HOST}"]

        # INFLUX_TOKEN is an environment variable you assigned to your API token
        token = "${INFLUX_TOKEN}"

        # An empty string (InfluxDB ignores this parameter)
        organization = ""

        # Bucket name
        bucket = "get-started"
      ```

      <!--test
      ```bash
      echo '[[outputs.influxdb_v2]]' >> telegraf.conf
      echo '  urls = ["${INFLUX_HOST}"]' >> telegraf.conf
      echo '' >> telegraf.conf
      echo '  token = "${INFLUX_TOKEN}"' >> telegraf.conf
      echo '' >> telegraf.conf
      echo '  organization = ""' >> telegraf.conf
      echo '' >> telegraf.conf
      echo '  bucket = "get-started"' >> telegraf.conf
      ```
      -->

      The example configuration uses the following InfluxDB credentials:

      - **`urls`**: an array containing your **`INFLUX_HOST`** environment variable
      - **`token`**: your **`INFLUX_TOKEN`** environment variable
      - **`organization`**: an empty string (InfluxDB ignores this parameter)
      - **`bucket`**: the name of the bucket to write to

5.  To write the data, start the `telegraf` daemon with the following options:

    - `--config`: Specifies the path of the configuration file.
    - `--once`: Runs a single Telegraf collection cycle for the configured
      inputs and outputs, and then exits.

    Enter the following command in your terminal:

    ```sh
    telegraf --once --config ./telegraf.conf
    ```

    If the write is successful, the output is similar to the following:

    ```plaintext
    2023-05-31T20:09:08Z D! [agent] Starting service inputs
    2023-05-31T20:09:19Z D! [outputs.influxdb_v2] Wrote batch of 52 metrics in 348.008167ms
    2023-05-31T20:09:19Z D! [outputs.influxdb_v2] Buffer fullness: 0 / 10000 metrics
    ```

Telegraf and its plugins provide many options for reading and writing data.
To learn more, see how to [use Telegraf to write data](/influxdb3/cloud-serverless/write-data/use-telegraf/).

{{< /influxdb/custom-timestamps >}}

<!------------------------------- END TELEGRAF CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN v1 API CONTENT ----------------------------->
{{% influxdb/custom-timestamps %}}

Write data with your existing workloads that already use the InfluxDB v1 `/write`
API endpoint.

> [!Note]
> If migrating data from InfluxDB 1.x, see the
> [Migrate data from InfluxDB 1.x to InfluxDB
> {{% product-name %}}](/influxdb3/cloud-serverless/guides/migrate-data/migrate-1x-to-serverless/)
> guide.

To write data to InfluxDB using the
[InfluxDB v1 HTTP API](/influxdb3/cloud-serverless/reference/api/), send a request
to the
[InfluxDB API `/write` endpoint](/influxdb3/cloud-serverless/api/#operation/PostLegacyWrite)
using the `POST` request method.

{{% api-endpoint endpoint="https://{{< influxdb/host >}}/write" method="post"
api-ref="/influxdb3/cloud-serverless/api/#operation/PostLegacyWrite"%}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token <INFLUX_TOKEN>
  - **Content-Type**: text/plain; charset=utf-8
  - **Accept**: application/json
- **Query parameters**:
  - **db**: InfluxDB bucket name
  - **precision**:[timestamp precision](/influxdb3/cloud-serverless/reference/glossary/#timestamp-precision) (default is `ns`)
  - **rp**: [retention policy](/influxdb3/cloud-serverless/reference/glossary/#retention-policy-rp) name (default is the default DBRP mapping, if it exists, for the namespace; otherwise, an [auto-generated DBRP mapping](/influxdb3/cloud-serverless/guides/api-compatibility/v1/#retention-policy-and-dbrp-mapping)).
- **Request body**: Line protocol as plain text

The following example uses cURL and the InfluxDB v1 API to write line protocol
to InfluxDB.
Given that `API_TOKEN` is an
[All-Access API token](/influxdb3/cloud-serverless/admin/tokens/#all-access-api-token),
InfluxDB creates a bucket named `get-started/autogen` and an
`autogen` DBRP mapping, and then writes the data to the bucket.

{{% code-placeholders "API_TOKEN " %}}

```sh
response=$(curl --silent --write-out "%{response_code}:-%{errormsg}" \
  "https://{{< influxdb/host >}}/write?db=get-started&precision=s" \
  --header "Authorization: Token API_TOKEN" \
  --header "Content-type: text/plain; charset=utf-8" \
  --header "Accept: application/json" \
  --data-binary "
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
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1641045600
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1641045600
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1641049200
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1641049200
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1641052800
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1641052800
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1641056400
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1641056400
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1641060000
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1641060000
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1641063600
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1641067200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200
")

# Format the response code and error message output.
response_code=${response%%:-*}
errormsg=${response#*:-}

# Remove leading and trailing whitespace from errormsg
errormsg=$(echo "${errormsg}" | tr -d '[:space:]')

echo "$response_code"
if [[ $errormsg ]]; then
  echo "$response"
fi
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}:
a [token](/influxdb3/cloud-serverless/admin/tokens/) with sufficient permissions
to the specified bucket.
_For InfluxDB to [auto-generate the DBRP mapping](/influxdb3/cloud-serverless/guides/api-compatibility/v1/#retention-policy-and-dbrp-mapping), you must use an
[All-Access API token](/influxdb3/cloud-serverless/admin/tokens/#all-access-api-token) 
in the write request_.

If successful, the output is an HTTP `204 No Content` status code; otherwise,
the error status code and failure message.

<!--pytest-codeblocks:expected-output-->

```
204
```

{{% /influxdb/custom-timestamps %}}

<!------------------------------ END v1 API CONTENT ------------------------------>

{{% /tab-content %}}
{{% tab-content %}}

<!----------------------------- BEGIN v2 API CONTENT ----------------------------->

{{% influxdb/custom-timestamps %}}

To write data to InfluxDB using the
[InfluxDB v2 HTTP API](/influxdb3/cloud-serverless/reference/api/), send a request
to the InfluxDB API `/api/v2/write` endpoint using the `POST` request method.

{{< api-endpoint endpoint="https://{{< influxdb/host >}}/api/v2/write"
method="post" api-ref="/influxdb3/cloud-serverless/api/#operation/PostWrite" >}}

Include the following with your request:

- **Headers**:
  - **Authorization**: Token <INFLUX_TOKEN>
  - **Content-Type**: text/plain; charset=utf-8
  - **Accept**: application/json
- **Query parameters**:
  - **bucket**: InfluxDB bucket name
  - **precision**: [timestamp precision](/influxdb3/cloud-serverless/reference/glossary/#timestamp-precision) (default is `ns`)
- **Request body**: Line protocol as plain text

The following example uses cURL and the InfluxDB v2 API to write line protocol
to InfluxDB:

{{% code-placeholders "API_TOKEN" %}}

```sh
response=$(curl --silent --write-out "%{response_code}:-%{errormsg}" \
  "https://{{< influxdb/host >}}/api/v2/write?bucket=get-started&precision=s" \
  --header "Authorization: Token DATABASE_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --header "Accept: application/json" \
  --data-binary "
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
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1641045600
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1641045600
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1641049200
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1641049200
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1641052800
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1641052800
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1641056400
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1641056400
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1641060000
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1641060000
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1641063600
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1641063600
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1641067200
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200
")

# Format the response code and error message output.
response_code=${response%%:-*}
errormsg=${response#*:-}

# Remove leading and trailing whitespace from errormsg
errormsg=$(echo "${errormsg}" | tr -d '[:space:]')

echo "$response_code"
if [[ $errormsg ]]; then
  echo "$errormsg"
fi
```

{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}:
  a [token](/influxdb3/cloud-serverless/admin/tokens/) with sufficient permissions
  to the specified bucket

If successful, the output is an HTTP `204 No Content` status code; otherwise,
the error status code and failure message.

<!--pytest-codeblocks:expected-output-->

```
204
```

{{% /influxdb/custom-timestamps %}}

<!------------------------------ END v2 API CONTENT ------------------------------>

{{% /tab-content %}}
{{% tab-content %}}

<!---------------------------- BEGIN PYTHON CONTENT --------------------------->

{{% influxdb/custom-timestamps %}}

To write data to {{% product-name %}} using Python, use the
[`influxdb_client_3` module](https://github.com/InfluxCommunity/influxdb3-python).
The following steps include setting up a Python virtual environment to scope
dependencies to your current project.

1.  Create a module directory and navigate into it--for example:

    <!--
      Using bash here is required when running with pytest.
      I don't know why, but sh evaluates $_ to /usr/bin/pytest.
    -->

    ```bash
    mkdir -p influxdb_py_client && cd influxdb_py_client
    ```

2.  Setup your Python virtual environment.
    Inside of your module directory:

    <!--pytest-codeblocks:cont-->

    ```bash
    python -m venv envs/virtual-env
    ```

3.  Activate the virtual environment.

    <!--pytest-codeblocks:cont-->

    ```bash
    source ./envs/virtual-env/bin/activate
    ```

4.  Install the client library package:

    <!--pytest-codeblocks:cont-->

    ```bash
    pip install influxdb3-python
    ```

   The `influxdb3-python` package provides the `influxdb_client_3` module and
   also installs the
   [`pyarrow` package](https://arrow.apache.org/docs/python/index.html) for
   working with Arrow data returned from queries.

5.  In your terminal or editor, create a new file for your code--for example: `write.py`.

    <!--pytest-codeblocks:cont-->

    ```bash
    touch write.py
    ```

6.  Inside of `write.py`, enter the following sample code:

    ```py
    from influxdb_client_3 import InfluxDBClient3
    import os

    # INFLUX_TOKEN is an environment variable you assigned to your
    # API WRITE token value.
    token = os.getenv('INFLUX_TOKEN')

    # host is the URL hostname without protocol or trailing slash
    client = InfluxDBClient3(
        host='{{< influxdb/host >}}',
        token=token,
        database='get-started'
    )

    lines = [
        "home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1719924000",
        "home,room=Kitchen temp=21.0,hum=35.9,co=0i 1719924000",
        "home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1719927600",
        "home,room=Kitchen temp=23.0,hum=36.2,co=0i 1719927600",
        "home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1719931200",
        "home,room=Kitchen temp=22.7,hum=36.1,co=0i 1719931200",
        "home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1719934800",
        "home,room=Kitchen temp=22.4,hum=36.0,co=0i 1719934800",
        "home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1719938400",
        "home,room=Kitchen temp=22.5,hum=36.0,co=0i 1719938400",
        "home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1719942000",
        "home,room=Kitchen temp=22.8,hum=36.5,co=1i 1719942000",
        "home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1719945600",
        "home,room=Kitchen temp=22.8,hum=36.3,co=1i 1719945600",
        "home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1719949200",
        "home,room=Kitchen temp=22.7,hum=36.2,co=3i 1719949200",
        "home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1719952800",
        "home,room=Kitchen temp=22.4,hum=36.0,co=7i 1719952800",
        "home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1719956400",
        "home,room=Kitchen temp=22.7,hum=36.0,co=9i 1719956400",
        "home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1719960000",
        "home,room=Kitchen temp=23.3,hum=36.9,co=18i 1719960000",
        "home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1719963600",
        "home,room=Kitchen temp=23.1,hum=36.6,co=22i 1719963600",
        "home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1719967200",
        "home,room=Kitchen temp=22.7,hum=36.5,co=26i 1719967200"
    ]

    client.write(lines,write_precision='s')
    ```

    The sample does the following:

    1.  Imports the `InfluxDBClient3` object from the `influxdb_client_3` module.
    2.  Calls the `InfluxDBClient3()` constructor to instantiate an InfluxDB client
        configured with the following credentials:

        - **`host`**: {{% product-name %}} region hostname (URL without protocol
          or trailing slash)
        - **`token`**: a [token](/influxdb3/cloud-serverless/admin/tokens/) with
          write access to the specified bucket.
          _Store this in a secret store or environment variable to avoid exposing
          the raw token string._
        - **`database`**: the name of the {{% product-name %}} bucket to write to

    3.  Defines a list of line protocol strings where each string represents a data record.
    4.  Calls the `client.write()` method with the line protocol record list and write options.

        **Because the timestamps in the sample line protocol are in second
        precision, the example passes the `write_precision='s'` option
        to set the
        [timestamp precision](/influxdb3/cloud-serverless/reference/glossary/#timestamp-precision)
        to seconds.**

7.  To execute the module and write line protocol to your {{% product-name %}}
    bucket, enter the following command in your terminal:

    <!--pytest.mark.skip-->

    ```bash
    python write.py
    ```

{{% /influxdb/custom-timestamps %}}
If successful, the output is the success message; otherwise, error details and
the failure message.

<!----------------------------- END PYTHON CONTENT ---------------------------->
{{% /tab-content %}}
{{% tab-content %}}
<!----------------------------- BEGIN GO CONTENT ------------------------------>
{{% influxdb/custom-timestamps %}}

To write data to {{% product-name %}} using Go, use the
InfluxDB 3 [influxdb3-go client library package](https://github.com/InfluxCommunity/influxdb3-go).

1.  Inside of your project directory, create a new module directory and navigate
    into it.

    <!--
      Using bash here is required when running with pytest.
      I don't know why, but sh evaluates $_ to /usr/bin/pytest.
    -->

    ```bash
    mkdir -p influxdb_go_client && cd influxdb_go_client
    ```

2.  Initialize a new Go module in the directory.

    <!--pytest-codeblocks:cont-->

    ```bash
    go mod init influxdb_go_client
    ```

3.  In your terminal or editor, create a new file for your code--for example:
    `write.go`.

    <!--pytest-codeblocks:cont-->

    ```bash
    touch write.go
    ```

4.  Inside of `write.go`, enter the following sample code:

    ```go
    package main

    import (
      "context"
      "os"
      "fmt"
      "log"

      "github.com/InfluxCommunity/influxdb3-go/v2/influxdb3"
    )

    // Write line protocol data to InfluxDB
    func WriteLineProtocol() error {
      // INFLUX_TOKEN is an environment variable you assigned to your
      // API WRITE token value.
      token := os.Getenv("INFLUX_TOKEN")
      database := os.Getenv("INFLUX_DATABASE")

      // Initialize a client with URL and token,
      // and set the timestamp precision for writes.
      client, err := influxdb3.New(influxdb3.ClientConfig{
        Host:     "https://{{< influxdb/host >}}",
        Token:    token,
        Database: database,
          WriteOptions: &influxdb3.WriteOptions{Precision: lineprotocol.Second},
      })

      // Close the client when the function returns.
      defer func(client *influxdb3.Client) {
        err := client.Close()
        if err != nil {
          panic(err)
        }
      }(client)

      // Define line protocol records to write.
      // Use a raw string literal (denoted by backticks)
      // to preserve backslashes and prevent interpretation
      // of escape sequences--for example, escaped spaces in tag values.
      lines := [...]string{
        `home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1719124000`,
        `home,room=Kitchen temp=21.0,hum=35.9,co=0i 1719124000`,
        `home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1719127600`,
        `home,room=Kitchen temp=23.0,hum=36.2,co=0i 1719127600`,
        `home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1719131200`,
        `home,room=Kitchen temp=22.7,hum=36.1,co=0i 1719131200`,
        `home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1719134800`,
        `home,room=Kitchen temp=22.4,hum=36.0,co=0i 1719134800`,
        `home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1719138400`,
        `home,room=Kitchen temp=22.5,hum=36.0,co=0i 1719138400`,
        `home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1719142000`,
        `home,room=Kitchen temp=22.8,hum=36.5,co=1i 1719142000`,
        `home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1719145600`,
        `home,room=Kitchen temp=22.8,hum=36.3,co=1i 1719145600`,
        `home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1719149200`,
        `home,room=Kitchen temp=22.7,hum=36.2,co=3i 1719149200`,
        `home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1719152800`,
        `home,room=Kitchen temp=22.4,hum=36.0,co=7i 1719152800`,
        `home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1719156400`,
        `home,room=Kitchen temp=22.7,hum=36.0,co=9i 1719156400`,
        `home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1719160000`,
        `home,room=Kitchen temp=23.3,hum=36.9,co=18i 1719160000`,
        `home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1719163600`,
        `home,room=Kitchen temp=23.1,hum=36.6,co=22i 1719163600`,
        `home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1719167200`,
        `home,room=Kitchen temp=22.7,hum=36.5,co=26i 1719167200`,
      }

      // Iterate over the lines array and write each line
      // separately to InfluxDB
      for _, record := range lines {
        err = client.Write(context.Background(), []byte(record))
        if err != nil {
          log.Fatalf("Error writing line protocol: %v", err)
        }
      }

      if err != nil {
        panic(err)
      }

      fmt.Println("Data has been written successfully.")
      return nil
    }
    ```

    The sample does the following:

    1.  Imports required packages.
    2.  Defines a `WriteLineProtocol()` function that does the following:

        1.  To instantiate the client, calls the
            `influxdb3.New(influxdb3.ClientConfig)` function and passes the following:
            - **`Host`**: your {{% product-name %}} region URL
            - **`Token`**: a [token](/influxdb3/cloud-serverless/admin/tokens/)
              with write access to the specified bucket. _Store this in a
              secret store or environment variable to avoid exposing the raw
              token string._
            - **`WriteOptions`**: `influxdb3.WriteOptions` options for writing
              to InfluxDB.

              **Because the timestamps in the sample line protocol are in second
              precision, the example passes the `Precision: lineprotocol.Second`
              option to set the
              [timestamp precision](/influxdb3/cloud-serverless/reference/glossary/#timestamp-precision)
              to seconds.**

        2.  Defines a deferred function that closes the client when the function
            returns.
        3.  Defines an array of line protocol strings where each string
            represents a data record.
        4.  Iterates through the array of line protocol and calls the write
            client's `Write()` method to write each line of line protocol
            separately to InfluxDB.

5.  In your editor, create a `main.go` file and enter the following sample code
    that calls the `WriteLineProtocol()` function:

    ```go
    package main

    // Module main function
    func main() {
      WriteLineProtocol()
    }
    ```

6.  To install dependencies and write the data to your {{% product-name %}} bucket,
    enter the following command into your terminal:

    <!--pytest.mark.skip-->

    ```sh
    go mod tidy && go run influxdb_go_client
    ```

If successful, the output is the success message; otherwise, error details and
the failure message.

{{% /influxdb/custom-timestamps %}}

<!------------------------------- END GO CONTENT ------------------------------>

{{% /tab-content %}}
{{% tab-content %}}
{{% influxdb/custom-timestamps %}}

<!---------------------------- BEGIN NODE.JS CONTENT --------------------------->

1.  If you haven't already, follow the instructions for
    [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
    for your system.
2.  In your terminal, enter the following command to create a
    `influxdb_js_client` directory for your project:

    ```bash
    mkdir influxdb_js_client && cd influxdb_js_client
    ```

3.  Inside of `influxdb_js_client`, enter the following command to initialize a
    package. This example configures the package to use
    [ECMAScript modules (ESM)](https://nodejs.org/api/packages.html#modules-loaders).

    <!--pytest-codeblocks:cont-->

    ```bash
    npm init -y; npm pkg set type="module"
    ```

4.  Install the `@influxdata/influxdb3-client` JavaScript client library as a
    dependency to your project.

    <!--pytest-codeblocks:cont-->

    ```bash
    npm install --save @influxdata/influxdb3-client
    ```

5.  In your terminal or editor, create a `write.js` file.

    <!--pytest-codeblocks:cont-->

    ```bash
    touch write.js
    ```

6.  Inside of `write.js`, enter the following sample code:

    ```js
    // write.js
    import { InfluxDBClient } from "@influxdata/influxdb3-client";

    /**
     * Set InfluxDB credentials.
     */
    const host = '{{< influxdb/host >}}';
    const database = 'get-started';
    /**
    * INFLUX_TOKEN is an environment variable you assigned to your
    * API WRITE token value.
    */
    const token = process.env.INFLUX_TOKEN;

    /**
    * Write line protocol to InfluxDB using the JavaScript client library.
    */
    export async function writeLineProtocol() {
      /**
      * Instantiate an InfluxDBClient
      */
      const client = new InfluxDBClient({ host, token });

      /**
      * Define line protocol records to write.
      */
      const records = [
        `home,room=Living\\ Room temp=21.1,hum=35.9,co=0i 1719124000`,
        `home,room=Kitchen temp=21.0,hum=35.9,co=0i 1719124000`,
        `home,room=Living\\ Room temp=21.4,hum=35.9,co=0i 1719127600`,
        `home,room=Kitchen temp=23.0,hum=36.2,co=0 1719127600`,
        `home,room=Living\\ Room temp=21.8,hum=36.0,co=0i 1719131200`,
        `home,room=Kitchen temp=22.7,hum=36.1,co=0i 1719131200`,
        `home,room=Living\\ Room temp=22.2,hum=36.0,co=0i 1719134800`,
        `home,room=Kitchen temp=22.4,hum=36.0,co=0i 1719134800`,
        `home,room=Living\\ Room temp=22.2,hum=35.9,co=0i 1719138400`,
        `home,room=Kitchen temp=22.5,hum=36.0,co=0i 1719138400`,
        `home,room=Living\\ Room temp=22.4,hum=36.0,co=0i 1719142000`,
        `home,room=Kitchen temp=22.8,hum=36.5,co=1i 1719142000`,
        `home,room=Living\\ Room temp=22.3,hum=36.1,co=0i 1719145600`,
        `home,room=Kitchen temp=22.8,hum=36.3,co=1i 1719145600`,
        `home,room=Living\\ Room temp=22.3,hum=36.1,co=1i 1719149200`,
        `home,room=Kitchen temp=22.7,hum=36.2,co=3i 1719149200`,
        `home,room=Living\\ Room temp=22.4,hum=36.0,co=4i 1719152800`,
        `home,room=Kitchen temp=22.4,hum=36.0,co=7i 1719152800`,
        `home,room=Living\\ Room temp=22.6,hum=35.9,co=5i 1719156400`,
        `home,room=Kitchen temp=22.7,hum=36.0,co=9i 1719156400`,
        `home,room=Living\\ Room temp=22.8,hum=36.2,co=9i 1719160000`,
        `home,room=Kitchen temp=23.3,hum=36.9,co=18i 1719160000`,
        `home,room=Living\\ Room temp=22.5,hum=36.3,co=14i 1719163600`,
        `home,room=Kitchen temp=23.1,hum=36.6,co=22i 1719163600`,
        `home,room=Living\\ Room temp=22.2,hum=36.4,co=17i 1719167200`,
        `home,room=Kitchen temp=22.7,hum=36.5,co=26i 1719167200`,
      ];

      /**
      * Creates an array that contains separate write request promises
      * for all the records.
      */
      const writePromises = records.map((record) => {
        return client.write(record, database, "", { precision: "s" })
        .then(() => `Data has been written successfully: ${record}`,
              () => `Failed writing data: ${record}`);
      });

      /**
      * Wait for all the write promises to settle, and then output the results.
      */  
      const writeResults = await Promise.allSettled(writePromises);
      writeResults.forEach(write => console.log(write.value));

      /** Close the client to release resources. */
      await client.close();
    }
    ```

    The sample code does the following:

    1.  Imports the `InfluxDBClient` class.
    2.  Calls the `new InfluxDBClient()` constructor and passes a
        `ClientOptions` object to instantiate a client configured with InfluxDB
        credentials.

        - **`host`**: your {{% product-name %}} region URL
        - **`token`**: a [token](/influxdb3/cloud-serverless/admin/tokens/)
          with write access to the specified bucket.
          _Store this in a secret store or environment variable to avoid exposing
          the raw token string._

    3.  Defines a list of line protocol strings where each string represents a
        data record.
    4.  Calls the client's `write()` method for each record, defines the success
        or failure message to return, and collects the pending promises into the
        `writePromises` array. Each call to `write()` passes the following
        arguments:

        - **`record`**: the line protocol record
        - **`database`**: the name of the {{% product-name %}} bucket to write to
        - **`{precision}`**: a `WriteOptions` object that sets the `precision` value.

        **Because the timestamps in the sample line protocol are in second
        precision, the example passes `s` as the `precision` value to set the
        write
        [timestamp precision](/influxdb3/cloud-serverless/reference/glossary/#timestamp-precision)
        to seconds.**

    5.  Calls `Promise.allSettled()` with the promises array to pause execution
        until the promises have completed, and then assigns the array containing
        success and failure messages to a `writeResults` constant.
    6.  Iterates over and prints the messages in `writeResults`.
    7.  Closes the client to release resources.

7.  In your terminal or editor, create an `index.js` file.
8.  Inside of `index.js`, enter the following sample code to import and call
    `writeLineProtocol()`:

    ```js
    // index.js
    import { writeLineProtocol } from "./write.js";

    /**
    * Execute the client functions.
    */
    async function main() {
      /** Write line protocol data to InfluxDB. */
      await writeLineProtocol();
    }

    main();
    ```

9.  In your terminal, execute `index.mjs` to write to {{% product-name %}}:

    <!--pytest-codeblocks:cont-->

    ```sh
    node index.js
    ```

{{% /influxdb/custom-timestamps %}}

If successful, the output is the success message; otherwise, error details and
the failure message.

<!---------------------------- END NODE.JS CONTENT --------------------------->

{{% /tab-content %}}
{{% tab-content %}}

<!---------------------------- BEGIN C# CONTENT --------------------------->

{{% influxdb/custom-timestamps %}}

1.  If you haven't already, follow the
    [Microsoft.com download instructions](https://dotnet.microsoft.com/en-us/download)
    to install .NET and the `dotnet` CLI.
2.  In your terminal, create an executable C# project using the .NET **console**
    template.

    <!--pytest.mark.skip-->

    ```sh
    dotnet new console --name influxdb_csharp_client
    ```

3. Change into the generated `influxdb_csharp_client` directory.

    <!--pytest.mark.skip-->

    ```sh
    cd influxdb_csharp_client
    ```

4. Run the following command to install the latest version of the InfluxDB 3 C#
   client library.

    <!--pytest.mark.skip-->

    ```sh
    dotnet add package InfluxDB3.Client
    ```

5.  In your editor, create a `Write.cs` file and enter the following sample code:

    ```c#
    // Write.cs

    using System;
    using System.Threading.Tasks;
    using InfluxDB3.Client;
    using InfluxDB3.Client.Query;

    namespace InfluxDBv3;

    public class Write
    {
      /**
        * Writes line protocol to InfluxDB using the C# .NET client
        * library.
        */
      public static async Task WriteLines()
      {
        // Set InfluxDB credentials
        const string host = "https://{{< influxdb/host >}}";
        string? database = "get-started";

        /**
          * INFLUX_TOKEN is an environment variable you assigned to your
          * WRITE token value.
          */
        string? token = System.Environment
            .GetEnvironmentVariable("INFLUX_TOKEN");

        // Instantiate the InfluxDB client with credentials.
        using var client = new InfluxDBClient(
            host, token: token, database: database);

        /** 
          * Define an array of line protocol strings to write.
          * Include an additional backslash to preserve backslashes
          * and prevent interpretation of escape sequences---for example,
          * escaped spaces in tag values.
          */
        string[] lines = new string[] {
              "home,room=Living\\ Room temp=21.1,hum=35.9,co=0i 1719924000",
              "home,room=Kitchen temp=21.0,hum=35.9,co=0i 1719924000",
              "home,room=Living\\ Room temp=21.4,hum=35.9,co=0i 1719927600",
              "home,room=Kitchen temp=23.0,hum=36.2,co=0i 1719927600",
              "home,room=Living\\ Room temp=21.8,hum=36.0,co=0i 1719931200",
              "home,room=Kitchen temp=22.7,hum=36.1,co=0i 1719931200",
              "home,room=Living\\ Room temp=22.2,hum=36.0,co=0i 1719934800",
              "home,room=Kitchen temp=22.4,hum=36.0,co=0i 1719934800",
              "home,room=Living\\ Room temp=22.2,hum=35.9,co=0i 1719938400",
              "home,room=Kitchen temp=22.5,hum=36.0,co=0i 1719938400",
              "home,room=Living\\ Room temp=22.4,hum=36.0,co=0i 1719942000",
              "home,room=Kitchen temp=22.8,hum=36.5,co=1i 1719942000",
              "home,room=Living\\ Room temp=22.3,hum=36.1,co=0i 1719945600",
              "home,room=Kitchen temp=22.8,hum=36.3,co=1i 1719945600",
              "home,room=Living\\ Room temp=22.3,hum=36.1,co=1i 1719949200",
              "home,room=Kitchen temp=22.7,hum=36.2,co=3i 1719949200",
              "home,room=Living\\ Room temp=22.4,hum=36.0,co=4i 1719952800",
              "home,room=Kitchen temp=22.4,hum=36.0,co=7i 1719952800",
              "home,room=Living\\ Room temp=22.6,hum=35.9,co=5i 1719956400",
              "home,room=Kitchen temp=22.7,hum=36.0,co=9i 1719956400",
              "home,room=Living\\ Room temp=22.8,hum=36.2,co=9i 1719960000",
              "home,room=Kitchen temp=23.3,hum=36.9,co=18i 1719960000",
              "home,room=Living\\ Room temp=22.5,hum=36.3,co=14i 1719963600",
              "home,room=Kitchen temp=23.1,hum=36.6,co=22i 1719963600",
              "home,room=Living\\ Room temp=22.2,hum=36.4,co=17i 1719967200",
              "home,room=Kitchen temp=22.7,hum=36.5,co=26i 1719967200"
        };

        // Write each record separately.
        foreach (string line in lines)
        {
          // Write the record to InfluxDB with timestamp precision in seconds.
          await client.WriteRecordAsync(
              record: line, precision: WritePrecision.S);
          Console.WriteLine(
              "Data has been written successfully: {0,-30}", line);
        }
      }
    }
    ```

    The sample does the following:

      1.  Calls the `new InfluxDBClient()` constructor to instantiate a client configured
           with InfluxDB credentials.

          - **host**: your {{% product-name %}} region URL
          - **database**: the name of the {{% product-name %}} bucket to write to
          - **token**: a [token](/influxdb3/cloud-serverless/admin/tokens/) with write access to the specified bucket.
            _Store this in a secret store or environment variable to avoid exposing the raw token string._

          _The `using` statement ensures that the program disposes of the
          client when it's no longer needed._

      2.  Defines an array of line protocol strings where each string represents a data record.
      3.  Calls the client's `WriteRecordAsync()` method to write each line protocol record to InfluxDB.

          **Because the timestamps in the sample line protocol are in second
          precision, the example passes the [`WritePrecision.S` enum value](https://github.com/InfluxCommunity/influxdb3-csharp/blob/main/Client/Write/WritePrecision.cs)
          to the `precision:` option to set the [timestamp precision](/influxdb3/cloud-serverless/reference/glossary/#timestamp-precision) to seconds.**

6.  In your editor, open the `Program.cs` file and replace its contents with the following:

    ```c#
    // Program.cs

    using System;
    using System.Threading.Tasks;

    namespace InfluxDBv3;

    public class Program
    {
      public static async Task Main()
      {
        await Write.WriteLineProtocol();
      }
    }
    ```

    The `Program` class shares the same `InfluxDBv3` namespace as the `Write`
    class you defined in the preceding step and defines a `Main()` function that
    calls `Write.WriteLineProtocol()`. The `dotnet` CLI recognizes
    `Program.Main()` as the entry point for your program.

7.  To build and execute the program and write the line protocol to your
    {{% product-name %}} bucket, enter the following command in your terminal:

    <!--pytest.mark.skip-->

    ```sh
    dotnet run
    ```

If successful, the output is the success message; otherwise, error details and
the failure message.

<!---------------------------- END C# CONTENT --------------------------->
{{% /influxdb/custom-timestamps %}}
{{% /tab-content %}}
{{% tab-content %}}
{{% influxdb/custom-timestamps %}}
<!---------------------------- BEGIN JAVA CONTENT --------------------------->

_The tutorial assumes using Maven version 3.9 and Java version >= 15._

1.  If you haven't already, follow the instructions to download and install the
    [Java JDK](https://www.oracle.com/java/technologies/downloads/) and
    [Maven](https://maven.apache.org/download.cgi) for your system.
2.  In your terminal or editor, use Maven to generate a project--for example:

    ```bash
    mvn org.apache.maven.plugins:maven-archetype-plugin:3.1.2:generate \
    -DarchetypeArtifactId="maven-archetype-quickstart" \
    -DarchetypeGroupId="org.apache.maven.archetypes" -DarchetypeVersion="1.4" \
    -DgroupId="com.influxdbv3" -DartifactId="influxdb_java_client"
    -Dversion="1.0"
    ```

    Maven creates the `<artifactId>` directory (`./influxdb_java_client`) that
    contains a `pom.xml` and scaffolding for your
    `com.influxdbv3.influxdb_java_client` Java application.

3.  In your terminal or editor, change into the `./influxdb_java_client`
    directory--for example:

    <!--pytest-codeblocks:cont-->

    ```bash
    cd ./influxdb_java_client
    ```

4.  In your editor, open the `pom.xml` Maven configuration file and add the
    `com.influxdb.influxdb3-java` client library into `dependencies`.

    ```pom
    ...
    <dependencies>
      ...
      <dependency>
      <groupId>com.influxdb</groupId>
      <artifactId>influxdb3-java</artifactId>
      <version>0.1.0</version>
      </dependency>
      ...
    </dependencies>
    ```

5.  To check your `pom.xml` for problems, run Maven's `validate` command--for example,
    enter the following in your terminal:

    <!--pytest.mark.skip-->

    ```bash
    mvn validate
    ```

6.  In your editor, navigate to the
    `./influxdb_java_client/src/main/java/com/influxdbv3` directory and create a
    `Write.java` file.
7.  In `Write.java`, enter the following sample code:

    ```java
    // Write.java
    package com.influxdbv3;

    import java.util.List;
    import com.influxdb.v3.client.InfluxDBClient;
    import com.influxdb.v3.client.write.WriteOptions;
    import com.influxdb.v3.client.write.WritePrecision;

    /**
      * Writes line protocol to InfluxDB using the Java client
      * library.
      */
    public final class Write {
        /**
        * Write data to InfluxDB 3.
        */
        private Write() {
            //not called
        }

        /**
          * @throws Exception
          */
        public static void writeLineProtocol() throws Exception {

            // Set InfluxDB credentials
            final String host = "https://{{< influxdb/host >}}";
            final String database = "get-started";

            /**
              * INFLUX_TOKEN is an environment variable you assigned to your
              * WRITE token value.
              */
            final char[] token = (System.getenv("INFLUX_TOKEN")).
            toCharArray();

            // Instantiate the InfluxDB client.
            try (InfluxDBClient client = InfluxDBClient.getInstance(host,
            token, database)) {
                // Create a list of line protocol records.
                final List<String> records = List.of(
                  "home,room=Living\\ Room temp=21.1,hum=35.9,co=0i 1719924000",
                  "home,room=Kitchen temp=21.0,hum=35.9,co=0i 1719924000",
                  "home,room=Living\\ Room temp=21.4,hum=35.9,co=0i 1719927600",
                  "home,room=Kitchen temp=23.0,hum=36.2,co=0i 1719927600",
                  "home,room=Living\\ Room temp=21.8,hum=36.0,co=0i 1719931200",
                  "home,room=Kitchen temp=22.7,hum=36.1,co=0i 1719931200",
                  "home,room=Living\\ Room temp=22.2,hum=36.0,co=0i 1719934800",
                  "home,room=Kitchen temp=22.4,hum=36.0,co=0i 1719934800",
                  "home,room=Living\\ Room temp=22.2,hum=35.9,co=0i 1719938400",
                  "home,room=Kitchen temp=22.5,hum=36.0,co=0i 1719938400",
                  "home,room=Living\\ Room temp=22.4,hum=36.0,co=0i 1719942000",
                  "home,room=Kitchen temp=22.8,hum=36.5,co=1i 1719942000",
                  "home,room=Living\\ Room temp=22.3,hum=36.1,co=0i 1719945600",
                  "home,room=Kitchen temp=22.8,hum=36.3,co=1i 1719945600",
                  "home,room=Living\\ Room temp=22.3,hum=36.1,co=1i 1719949200",
                  "home,room=Kitchen temp=22.7,hum=36.2,co=3i 1719949200",
                  "home,room=Living\\ Room temp=22.4,hum=36.0,co=4i 1719952800",
                  "home,room=Kitchen temp=22.4,hum=36.0,co=7i 1719952800",
                  "home,room=Living\\ Room temp=22.6,hum=35.9,co=5i 1719956400",
                  "home,room=Kitchen temp=22.7,hum=36.0,co=9i 1719956400",
                  "home,room=Living\\ Room temp=22.8,hum=36.2,co=9i 1719960000",
                  "home,room=Kitchen temp=23.3,hum=36.9,co=18i 1719960000",
                  "home,room=Living\\ Room temp=22.5,hum=36.3,co=14i 1719963600",
                  "home,room=Kitchen temp=23.1,hum=36.6,co=22i 1719963600",
                  "home,room=Living\\ Room temp=22.2,hum=36.4,co=17i 1719967200",
                  "home,room=Kitchen temp=22.7,hum=36.5,co=26i 1719967200"
                );

                /**
                 * Write each record separately to InfluxDB with timestamp
                 * precision in seconds.
                 * If no error occurs, print a success message.
                 * */
                for (String record : records) {
                    client.writeRecord(record, new WriteOptions(null, null,
                    WritePrecision.S));
                    System.out.printf("Data has been written successfully:
                    %s%n", record);
                }
            }
        }
    }
    ```

    The sample code does the following:

    1.  Imports the following classes:

        - `java.util.List`;
        - `com.influxdb.v3.client.InfluxDBClient`
        - `com.influxdb.v3.client.write.WriteParameters`
        - `com.influxdb.v3.client.write.WritePrecision`

    2.  Calls `InfluxDBClient.getInstance()` to instantiate a client configured
        with InfluxDB credentials.

        - **`host`**: your {{% product-name %}} region URL
        - **`database`**: the name of the {{% product-name %}} bucket to write to
        - **`token`**: a
          [token](/influxdb3/cloud-serverless/admin/tokens/) with write access
          to the specified bucket.
          _Store this in a secret store or environment variable to avoid exposing
          the raw token string._

    3.  Defines a list of line protocol strings where each string represents a
        data record.
    4.  Calls the client's `writeRecord()` method to write each record
        separately to InfluxDB.

        **Because the timestamps in the sample line protocol are in second
        precision, the example passes the
        [`WritePrecision.S` enum value](https://github.com/InfluxCommunity/influxdb3-java/blob/main/src/main/java/com/influxdb/v3/client/write/WritePrecision.java)
        as the `precision` argument to set the write
        [timestamp precision](/influxdb3/cloud-serverless/reference/glossary/#timestamp-precision)
        to seconds.**

8.  In your editor, open the `App.java` file (created by Maven) and replace its
    contents with the following sample code:

    ```java
    // App.java

    package com.influxdbv3;

    /**
    * Execute the client functions.
    *
    */
    public class App {

        /**
        * @param args
        * @throws Exception
        */
        public static void main(final String[] args) throws Exception {
            // Write data to InfluxDB 3.
            Write.writeLineProtocol();
        }
    }
    ```

    - The `App` class and `Write` class are part of the same `com.influxdbv3`
      package (your project **groupId**).
    - `App` defines a `main()` function that calls `Write.writeLineProtocol()`.

9.  In your terminal or editor, use Maven to install dependencies and compile
    the project code--for example:

    <!--pytest.mark.skip-->

    ```bash
    mvn compile
    ```

10. In your terminal or editor, execute `App.main()` to write to InfluxDB--for
    example, using Maven:

    <!--pytest.mark.skip-->

    ```sh
    mvn exec:java -Dexec.mainClass="com.influxdbv3.App"
    ```

If successful, the output is the success message; otherwise, error details and
the failure message.
<!---------------------------- END JAVA CONTENT --------------------------->

{{% /influxdb/custom-timestamps %}}
{{% /tab-content %}}
{{< /tabs-wrapper >}}

{{< expand-wrapper >}}
{{% expand "View the written data" %}}

{{% influxdb/custom-timestamps %}}
| time                 | room        |  co |  hum | temp |
| :------------------- | :---------- | --: | ---: | ---: |
| 2022-01-01T08:00:00Z | Kitchen     |   0 | 35.9 |   21 |
| 2022-01-01T09:00:00Z | Kitchen     |   0 | 36.2 |   23 |
| 2022-01-01T10:00:00Z | Kitchen     |   0 | 36.1 | 22.7 |
| 2022-01-01T11:00:00Z | Kitchen     |   0 |   36 | 22.4 |
| 2022-01-01T12:00:00Z | Kitchen     |   0 |   36 | 22.5 |
| 2022-01-01T13:00:00Z | Kitchen     |   1 | 36.5 | 22.8 |
| 2022-01-01T14:00:00Z | Kitchen     |   1 | 36.3 | 22.8 |
| 2022-01-01T15:00:00Z | Kitchen     |   3 | 36.2 | 22.7 |
| 2022-01-01T16:00:00Z | Kitchen     |   7 |   36 | 22.4 |
| 2022-01-01T17:00:00Z | Kitchen     |   9 |   36 | 22.7 |
| 2022-01-01T18:00:00Z | Kitchen     |  18 | 36.9 | 23.3 |
| 2022-01-01T19:00:00Z | Kitchen     |  22 | 36.6 | 23.1 |
| 2022-01-01T20:00:00Z | Kitchen     |  26 | 36.5 | 22.7 |
| 2022-01-01T08:00:00Z | Living Room |   0 | 35.9 | 21.1 |
| 2022-01-01T09:00:00Z | Living Room |   0 | 35.9 | 21.4 |
| 2022-01-01T10:00:00Z | Living Room |   0 |   36 | 21.8 |
| 2022-01-01T11:00:00Z | Living Room |   0 |   36 | 22.2 |
| 2022-01-01T12:00:00Z | Living Room |   0 | 35.9 | 22.2 |
| 2022-01-01T13:00:00Z | Living Room |   0 |   36 | 22.4 |
| 2022-01-01T14:00:00Z | Living Room |   0 | 36.1 | 22.3 |
| 2022-01-01T15:00:00Z | Living Room |   1 | 36.1 | 22.3 |
| 2022-01-01T16:00:00Z | Living Room |   4 |   36 | 22.4 |
| 2022-01-01T17:00:00Z | Living Room |   5 | 35.9 | 22.6 |
| 2022-01-01T18:00:00Z | Living Room |   9 | 36.2 | 22.8 |
| 2022-01-01T19:00:00Z | Living Room |  14 | 36.3 | 22.5 |
| 2022-01-01T20:00:00Z | Living Room |  17 | 36.4 | 22.2 |
{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

**Congratulations!** You have written data to InfluxDB.
With data now stored in InfluxDB, let's query it.

{{< page-nav prev="/influxdb3/cloud-serverless/get-started/setup/" next="/influxdb3/cloud-serverless/get-started/query/" keepTab=true >}}
