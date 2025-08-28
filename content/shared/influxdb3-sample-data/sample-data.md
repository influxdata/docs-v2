
Sample datasets are used throughout the {{< product-name >}} documentation to
demonstrate functionality.
Use the following sample datasets to replicate provided examples.

- [Home sensor data](#home-sensor-data)
- [Home sensor actions data](#home-sensor-actions-data)
- [NOAA Bay Area weather data](#noaa-bay-area-weather-data)
- [Bitcoin price data](#bitcoin-price-data)
- [Random numbers sample data](#random-numbers-sample-data)

## Home sensor data

Includes simulated hourly home sensor data with anomalous sensor readings to
demonstrate processing and alerting on time series data.
To customize timestamps in the dataset, use the {{< icon "clock" >}} button in
the lower right corner of the page.

##### Time Range

**{{% influxdb/custom-timestamps-span %}}2022-01-01T08:00:00Z{{% /influxdb/custom-timestamps-span %}}**
to
**{{% influxdb/custom-timestamps-span %}}2022-01-01T20:00:00Z{{% /influxdb/custom-timestamps-span %}}**
<em style="opacity: .5">(Customizable)</em>

##### Schema

- home <em style="opacity: .5">(table)</em>
  - **tags**:
    - room
      - Kitchen
      - Living Room
  - **fields**:
    - co <em style="opacity: .5">(integer)</em>
    - temp <em style="opacity: .5">(float)</em>
    - hum <em style="opacity: .5">(float)</em>

{{< expand-wrapper >}}
{{% expand "Write home sensor data to InfluxDB" %}}

#### Write the home sensor data to InfluxDB

Use the `influxdb3` CLI, InfluxDB v3 API, InfluxDB v2 API, or InfluxDB v1 API to write the
home sensor sample data to {{< product-name >}}.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3](#)
[v3 API](#)
[v2 API](#)
[v1 API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% influxdb/custom-timestamps %}}

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME" }
influxdb3 write \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
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
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1641067200'
```
{{% /influxdb/custom-timestamps %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% influxdb/custom-timestamps %}}
```bash { placeholders="AUTH_TOKEN|DATABASE_NAME" }
curl -v "http://localhost:8181/api/v3/write_lp?db=sensors&precision=auto&accept_partial=true" \
  --data-raw "home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1735545600
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1735545600
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1735549200
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1735549200
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1735552800
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1735552800
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1735556400
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1735556400
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1735560000
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1735560000
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1735563600
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1735563600
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1735567200
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1735567200
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1735570800
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1735570800
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1735574400
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1735574400
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1735578000
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1735578000
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1735581600
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1735581600
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1735585200
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1735585200
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1735588800
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1735588800"
```
{{% /influxdb/custom-timestamps %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% influxdb/custom-timestamps %}}
```bash { placeholders="AUTH_TOKEN|DATABASE_NAME" }
curl --request POST \
  http://{{< influxdb/host >}}/api/v2/write?bucket=DATABASE_NAME&precision=s \
  --header "Authorization: Bearer AUTH_TOKEN" \
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
"
```
{{% /influxdb/custom-timestamps %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% influxdb/custom-timestamps %}}
```bash { placeholders="AUTH_TOKEN|DATABASE_NAME" }
curl --request POST \
  http://{{< influxdb/host >}}/write?db=DATABASE_NAME&precision=s \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-type: text/plain; charset=utf-8" \
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
"
```
{{% /influxdb/custom-timestamps %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following in the sample script:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of [database](/influxdb3/version/admin/databases/) to write to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}} 

{{% /expand %}}
{{< /expand-wrapper >}}

## Home sensor actions data

Includes hypothetical actions triggered by data in the [home sensor data](#home-sensor-data)
and is a companion dataset to that sample dataset.
To customize timestamps in the dataset, use the {{< icon "clock" >}} button in
the lower right corner of the page.
This lets you modify the sample dataset to stay within the retention period of
the database you write it to.

##### Time Range

**{{% influxdb/custom-timestamps-span %}}2022-01-01T08:00:00Z{{% /influxdb/custom-timestamps-span %}}**
to
**{{% influxdb/custom-timestamps-span %}}2022-01-01T20:00:00Z{{% /influxdb/custom-timestamps-span %}}**
<em style="opacity: .5">(Customizable)</em>

##### Schema

- home_actions <em style="opacity: .5">(table)</em>
  - **tags**:
    - room
      - Kitchen
      - Living Room
    - action
      - alert
      - cool
    - level
      - ok
      - warn
  - **fields**:
    - description <em style="opacity: .5">(string)</em>

{{< expand-wrapper >}}
{{% expand "Write home sensor actions data to InfluxDB" %}}

#### Write the home sensor actions data to InfluxDB

Use the `influxdb3` CLI, InfluxDB v3 API, InfluxDB v2 API, or InfluxDB v1 API to write the
home sensor actions sample data to {{< product-name >}}.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3](#)
[v3 API](#)
[v2 API](#)
[v1 API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
influxdb3 write \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  'home_actions,room=Kitchen,action=cool,level=ok description="Temperature at or above 23°C (23°C). Cooling to 22°C." 1641027600
home_actions,room=Kitchen,action=cool,level=ok description="Temperature at or above 23°C (23.3°C). Cooling to 22°C." 1641060000
home_actions,room=Kitchen,action=cool,level=ok description="Temperature at or above 23°C (23.1°C). Cooling to 22°C." 1641063600
home_actions,room=Kitchen,action=alert,level=warn description="Carbon monoxide level above normal: 18 ppm." 1641060000
home_actions,room=Kitchen,action=alert,level=warn description="Carbon monoxide level above normal: 22 ppm." 1641063600
home_actions,room=Kitchen,action=alert,level=warn description="Carbon monoxide level above normal: 26 ppm." 1641067200
home_actions,room=Living\ Room,action=alert,level=warn description="Carbon monoxide level above normal: 14 ppm." 1641063600
home_actions,room=Living\ Room,action=alert,level=warn description="Carbon monoxide level above normal: 17 ppm." 1641067200'
```
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
curl -v "http://localhost:8181/api/v3/write_lp?db=sensors&precision=auto&accept_partial=true" \
  --data-raw "home_actions,room=Kitchen,action=cool,level=ok description=\"Temperature at or above 23°C (23°C). Cooling to 22°C.\" 1739437200
home_actions,room=Kitchen,action=cool,level=ok description=\"Temperature at or above 23°C (23.3°C). Cooling to 22°C.\" 1739469600
home_actions,room=Kitchen,action=cool,level=ok description=\"Temperature at or above 23°C (23.1°C). Cooling to 22°C.\" 1739473200
home_actions,room=Kitchen,action=alert,level=warn description=\"Carbon monoxide level above normal: 18 ppm.\" 1739469600
home_actions,room=Kitchen,action=alert,level=warn description=\"Carbon monoxide level above normal: 22 ppm.\" 1739473200
home_actions,room=Kitchen,action=alert,level=warn description=\"Carbon monoxide level above normal: 26 ppm.\" 1739476800
home_actions,room=Living Room,action=alert,level=warn description=\"Carbon monoxide level above normal: 14 ppm.\" 1739473200
home_actions,room=Living Room,action=alert,level=warn description=\"Carbon monoxide level above normal: 17 ppm.\" 1739476800"
```
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
curl --request POST \
  http://{{< influxdb/host >}}/api/v2/write?bucket=DATABASE_NAME&precision=s \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --header "Accept: application/json" \
  --data-binary '
home_actions,room=Kitchen,action=cool,level=ok description="Temperature at or above 23°C (23°C). Cooling to 22°C." 1641027600
home_actions,room=Kitchen,action=cool,level=ok description="Temperature at or above 23°C (23.3°C). Cooling to 22°C." 1641060000
home_actions,room=Kitchen,action=cool,level=ok description="Temperature at or above 23°C (23.1°C). Cooling to 22°C." 1641063600
home_actions,room=Kitchen,action=alert,level=warn description="Carbon monoxide level above normal: 18 ppm." 1641060000
home_actions,room=Kitchen,action=alert,level=warn description="Carbon monoxide level above normal: 22 ppm." 1641063600
home_actions,room=Kitchen,action=alert,level=warn description="Carbon monoxide level above normal: 26 ppm." 1641067200
home_actions,room=Living\ Room,action=alert,level=warn description="Carbon monoxide level above normal: 14 ppm." 1641063600
home_actions,room=Living\ Room,action=alert,level=warn description="Carbon monoxide level above normal: 17 ppm." 1641067200
'
```
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% influxdb/custom-timestamps %}}
{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
curl --request POST \
  http://{{< influxdb/host >}}/write?db=DATABASE_NAME&precision=s \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-type: text/plain; charset=utf-8" \
  --data-binary '
home_actions,room=Kitchen,action=cool,level=ok description="Temperature at or above 23°C (23°C). Cooling to 22°C." 1641027600
home_actions,room=Kitchen,action=cool,level=ok description="Temperature at or above 23°C (23.3°C). Cooling to 22°C." 1641060000
home_actions,room=Kitchen,action=cool,level=ok description="Temperature at or above 23°C (23.1°C). Cooling to 22°C." 1641063600
home_actions,room=Kitchen,action=alert,level=warn description="Carbon monoxide level above normal: 18 ppm." 1641060000
home_actions,room=Kitchen,action=alert,level=warn description="Carbon monoxide level above normal: 22 ppm." 1641063600
home_actions,room=Kitchen,action=alert,level=warn description="Carbon monoxide level above normal: 26 ppm." 1641067200
home_actions,room=Living\ Room,action=alert,level=warn description="Carbon monoxide level above normal: 14 ppm." 1641063600
home_actions,room=Living\ Room,action=alert,level=warn description="Carbon monoxide level above normal: 17 ppm." 1641067200
'
```
{{% /code-placeholders %}}
{{% /influxdb/custom-timestamps %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following in the sample script:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of database to write to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## NOAA Bay Area weather data

Includes daily weather metrics from three San Francisco Bay Area airports from
**January 1, 2020 to December 31, 2022**.
This sample dataset includes seasonal trends and is good for exploring time
series use cases that involve seasonality.

##### Time Range

**2020-01-01T00:00:00Z** to **2022-12-31T00:00:00Z**

##### Schema

- weather <em style="opacity: .5">(table)</em>
  - **tags**:
    - location
      - Concord
      - Hayward
      - San Francisco
  - **fields**
    - precip <em style="opacity: .5">(float)</em>
    - temp_avg <em style="opacity: .5">(float)</em>
    - temp_max <em style="opacity: .5">(float)</em>
    - temp_min <em style="opacity: .5">(float)</em>
    - wind_avg <em style="opacity: .5">(float)</em>

{{< expand-wrapper >}}
{{% expand "Write the NOAA Bay Area weather data to InfluxDB" %}}

#### Write the NOAA Bay Area weather data to InfluxDB

Use the `influxdb3` CLI, InfluxDB v3 API, InfluxDB v2 API, or InfluxDB v1 API to write the
NOAA Bay Area weather sample data to {{< product-name >}}.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3](#)
[v3 API](#)
[v2 API](#)
[v1 API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
influxdb3 write \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  "$(curl --request GET https://docs.influxdata.com/downloads/bay-area-weather.lp)"
```
{{% /code-placeholders %}}

{{% /code-tabs %}}
{{% code-tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
curl -v "http://localhost:8181/api/v3/write_lp?db=sensors&precision=auto&accept_partial=false" \
  --data-binary "$(curl --request GET https://docs.influxdata.com/downloads/bay-area-weather.lp)"
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
curl --request POST \
  http://{{< influxdb/host >}}/api/v2/write?bucket=DATABASE_NAME \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --header "Accept: application/json" \
  --data-binary "$(curl --request GET https://docs.influxdata.com/downloads/bay-area-weather.lp)"
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
curl --request POST \
  http://{{< influxdb/host >}}/write?db=DATABASE_NAME \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-type: text/plain; charset=utf-8" \
  --data-binary "$(curl --request GET https://docs.influxdata.com/downloads/bay-area-weather.lp)"
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following in the sample script:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of database to write to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## Bitcoin price data

The Bitcoin price sample dataset provides Bitcoin prices from
**2023-05-01T00:00:00Z to 2023-05-15T00:00:00Z**—_[Powered by CoinDesk](https://www.coindesk.com/price/bitcoin)_.

##### Time Range

**2023-05-01T00:19:00Z** to **2023-05-14T23:48:00Z**

##### Schema

- bitcoin <em style="opacity: .5">(table)</em>
  - **tags**:
    - code
      - EUR
      - GBP
      - USD
    - crypto
      - bitcoin
    - description
      - Euro
      - British Pound Sterling
      - United States Dollar
    - symbol
      - \&euro; <em style="opacity: .5">(&euro;)</em>
      - \&pound; <em style="opacity: .5">(&pound;)</em>
      - \&#36; <em style="opacity: .5">(&#36;)</em>
  - **fields**
    - price <em style="opacity: .5">(float)</em>

{{< expand-wrapper >}}
{{% expand "Write the Bitcoin sample data to InfluxDB" %}}

#### Write the Bitcoin price sample data to InfluxDB

Use the `influxdb3` CLI, InfluxDB v3 API, InfluxDB v2 API, or InfluxDB v1 API to write the
Bitcoin price sample data to {{< product-name >}}.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3](#)
[v3 API](#)
[v2 API](#)
[v1 API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
influxdb3 write \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  "$(curl --request GET https://docs.influxdata.com/downloads/bitcoin.lp)"
```
{{% /code-placeholders %}}

{{% /code-tabs %}}
{{% code-tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
curl -v "http://localhost:8181/api/v3/write_lp?db=sensors&precision=auto&accept_partial=false" \
  --data-binary "$(curl --request GET https://docs.influxdata.com/downloads/bitcoin.lp)"
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
curl --request POST \
  http://{{< influxdb/host >}}/write?db=DATABASE_NAME \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-type: text/plain; charset=utf-8" \
  --data-binary "$(curl --request GET https://docs.influxdata.com/downloads/bitcoin.lp)"
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following in the sample script:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of database to write to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## Random numbers sample data

Includes two fields with randomly generated numbers reported every minute.
Each field has a specific range of randomly generated numbers.
This sample dataset is used to demonstrate mathematic operations and
transformation functions.

##### Time Range

**2023-01-01T00:00:00Z** to **2023-01-01T12:00:00Z**

##### Schema

- numbers <em style="opacity: .5">(table)</em>
  - **fields**
    - a <em style="opacity: .5">(float between -1 and 1)</em>
    - b <em style="opacity: .5">(float between -3 and 3)</em>

{{< expand-wrapper >}}
{{% expand "Write the random number sample data to InfluxDB" %}}

#### Write the random number sample data to InfluxDB

Use the `influxdb3` CLI, InfluxDB v3 API, InfluxDB v2 API, or InfluxDB v1 API to write the
random number sample data to {{< product-name >}}.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[influxdb3](#)
[v3 API](#)
[v2 API](#)
[v1 API](#)
{{% /code-tabs %}}
{{% code-tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
influxdb3 write \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  "$(curl --request GET https://docs.influxdata.com/downloads/random-numbers.lp)"
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
curl -v "http://localhost:8181/api/v3/write_lp?db=sensors&precision=auto&accept_partial=false" \
  --data-binary "$(curl --request GET https://docs.influxdata.com/downloads/bitcoin.lp)"
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
curl --request POST \
  http://{{< influxdb/host >}}/api/v2/write?bucket=DATABASE_NAME \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --header "Accept: application/json" \
  --data-binary "$(curl --request GET https://docs.influxdata.com/downloads/random-numbers.lp)"
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
{{% code-tab-content %}}

{{% code-placeholders "AUTH_TOKEN|DATABASE_NAME" %}}
```sh
curl --request POST \
  http://{{< influxdb/host >}}/write?db=DATABASE_NAME \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-type: text/plain; charset=utf-8" \
  --data-binary "$(curl --request GET https://docs.influxdata.com/downloads/random-numbers.lp)"
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following in the sample script:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of database to write to
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% token-link %}}

{{% /expand %}}
{{< /expand-wrapper >}}
