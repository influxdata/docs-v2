---
title: Send alerts using data in InfluxDB
description: >
  Query, analyze, and send alerts using time series data stored in InfluxDB.
menu:
  influxdb3_cloud_dedicated:
    name: Send alerts
    parent: Process & visualize data
weight: 104
---

Query, analyze, and send alerts using time series data stored in InfluxDB.

This guide uses [Python](https://www.python.org/), the
[InfluxDB 3 Python client library](https://github.com/InfluxCommunity/influxdb3-python),
and the [Python Slack SDK](https://slack.dev/python-slack-sdk/) to demonstrate
how to query data from InfluxDB and send alerts to Slack, but you can use your
runtime and alerting platform of choice with any of the available
[InfluxDB 3 client libraries](/influxdb3/cloud-dedicated/reference/client-libraries/v3/).
Whatever clients and platforms you choose the use, the process is the same:

#### Alerting process

1.  Use an external runtime and InfluxDB client to query data from InfluxDB.
2.  Use the queried data and tools available in your runtime to send alerts.

---

- [Create a Slack app](#create-a-slack-app)
- [Install dependencies](#install-dependencies)
- [Create an InfluxDB client](#create-an-influxdb-client)
- [Create a Slack client](#create-a-slack-client)
- [Query InfluxDB](#query-influxdb)
  - [Execute the query](#execute-the-query)
- [Send alerts](#send-alerts)
- [Full alerting script](#full-alerting-script)

## Create a Slack app

To send alerts to Slack, first create a Slack app and gather the required
connection credentials to interact with your app.
More information is provided in the
[Slack basic app setup documentation](https://api.slack.com/authentication/basics).

## Install dependencies

> [!Note]
> This guide assumes you have already
> [setup your Python project and virtual environment](/influxdb3/cloud-dedicated/query-data/execute-queries/client-libraries/python/#create-a-python-virtual-environment).

Use `pip` to install the following dependencies:

- `influxdb_client_3`
- `pandas`
- `slack_sdk`

```sh
pip install influxdb3-python pandas slack_sdk
```

## Create an InfluxDB client

Use the `InfluxDBClient3` function in the `influxdb_client_3` module to 
instantiate an InfluxDB client.
Provide the following credentials:

- **host**: {{< product-name omit="Clustered" >}} cluster URL _(without the protocol)_
- **org**: InfluxDB organization name
- **token**: [InfluxDB database token](/influxdb3/cloud-dedicated/admin/tokens/#database-tokens)
  read permissions on the database you want to query
- **database**: InfluxDB database name

{{% code-placeholders "DATABASE_(NAME|TOKEN)" %}}
```py
from influxdb_client_3 import InfluxDBClient3
import pandas

# Instantiate an InfluxDBClient3 client configured for your database
influxdb = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='DATABASE_TOKEN',
    database='DATABASE_NAME'
)
```
{{% /code-placeholders %}}

## Create a Slack client

1.  Import the `WebClient` function from the `slack.sdk` module and the `SlackApiError`
    function from the `slack_sdk.errors` module.
2.  Use the `WebClient` function to instantiate a Slack client.
    Provide the following credentials:

    - **token**: [Slack bot token](https://api.slack.com/authentication/basics#getting-your-authentication-token)

{{% code-placeholders "SLACK_BOT_TOKEN" %}}
```py
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

slack = WebClient(token='SLACK_BOT_TOKEN')
```
{{% /code-placeholders %}}

## Query InfluxDB

Define either a SQL or InfluxQL query to retrieve data to alert on.
Depending on what data you want to alert on, you can:

- Include logic in the query so it only returns results that should be alerted on.
- Query data necessary for further processing and then send alerts based on 
  processing performed in your runtime.

The example query below only returns values above a threshold that should trigger alerts.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}

<!--------------------------------- BEGIN SQL --------------------------------->
{{% code-tab-content %}}
```sql
SELECT
  selector_last(co, time)['time'] AS time,
  selector_last(co, time)['value'] AS co,
  room
FROM home
WHERE co > 10
GROUP BY room
```
{{% /code-tab-content %}}
<!---------------------------------- END SQL ---------------------------------->

<!------------------------------- BEGIN INFLUXQL ------------------------------>
{{% code-tab-content %}}
```sql
SELECT
  LAST(co) AS co,
  room
FROM home
WHERE co > 10
GROUP BY room
```
{{% /code-tab-content %}}
<!-------------------------------- END INFLUXQL ------------------------------->
{{< /code-tabs-wrapper >}}

### Execute the query

1.  Assign the query string to a variable.
2.  Use the `query` method of your [instantiated client](#create-an-influxdb-client)
    to query raw data from InfluxDB. Provide the following arguments.

    - **query**: Query string to execute
    - **language**: `sql` or `influxql`

3.  Use the `to_pandas` method to convert the returned Arrow table to a Pandas DataFrame.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}

<!--------------------------------- BEGIN SQL --------------------------------->
{{% code-tab-content %}}
```py
# ...

query = '''
SELECT
  selector_last(co, time)['time'] AS time,
  selector_last(co, time)['value'] AS co,
  room
FROM home
WHERE co > 10
GROUP BY room
'''

table = influxdb_raw.query(query=query, language="sql")
data_frame = table.to_pandas()
```
{{% /code-tab-content %}}
<!---------------------------------- END SQL ---------------------------------->

<!------------------------------- BEGIN INFLUXQL ------------------------------>
{{% code-tab-content %}}
```py
# ...

query = '''
SELECT
  LAST(co) AS co,
  room
FROM home
WHERE co > 10
GROUP BY room
'''

table = influxdb_raw.query(query=query, language="influxql")
data_frame = table.to_pandas()
```
{{% /code-tab-content %}}
<!-------------------------------- END INFLUXQL ------------------------------->
{{< /code-tabs-wrapper >}}

## Send alerts

Iterate through the DataFrame and send an alert to Slack for each row.

1.  Use the `reset_index` function on the data frame to ensure indexes align
    with the number of rows in the DataFrame.
2.  Iterate through each row and use the `chat_postMessage` method of your
    [Slack client](#create-a-slack-client) to send a message (per row) to Slack.
    Provide the following arguments:

    - **channel**: Slack channel to send the alert to.
    - **text**: Message text to send. Use string interpolation to insert column
      values from each row into the message text.


{{% code-placeholders "SLACK_CHANNEL" %}}
```py
# ...

data_frame = data_frame.reset_index()

for index, row in data_frame.iterrows():
    slack.chat_postMessage(
        channel="#SLACK_CHANNEL",
        text=f'Carbon monoxide (co) high in {row.room}: {row.co} ppm at {row.time}'
    )
```
{{% /code-placeholders %}}

## Full alerting script

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[SQL](#)
[InfluxQL](#)
{{% /code-tabs %}}

<!--------------------------------- BEGIN SQL --------------------------------->
{{% code-tab-content %}}

{{% code-placeholders "(DATABASE|SLACK(_BOT)*)_(NAME|TOKEN|CHANNEL)" %}}
```py
from influxdb_client_3 import InfluxDBClient3
import pandas
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

influxdb = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='DATABASE_TOKEN',
    database='DATABASE_NAME'
)

slack = WebClient(token='SLACK_BOT_TOKEN')

query = '''
SELECT
  selector_last(co, time)['time'] AS time,
  selector_last(co, time)['value'] AS co,
  room
FROM home
WHERE co > 10
GROUP BY room
'''

table = influxdb_raw.query(query=query, language="sql")
data_frame = table.to_pandas()
data_frame = data_frame.reset_index()

for index, row in data_frame.iterrows():
    slack.chat_postMessage(
        channel="#SLACK_CHANNEL",
        text=f'Carbon monoxide (co) high in {row.room}: {row.co} ppm at {row.time}'
    )
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
<!---------------------------------- END SQL ---------------------------------->

<!------------------------------- BEGIN INFLUXQL ------------------------------>
{{% code-tab-content %}}

{{% code-placeholders "(DATABASE|SLACK(_BOT)*)_(NAME|TOKEN|CHANNEL)" %}}
```py
from influxdb_client_3 import InfluxDBClient3
import pandas
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

influxdb = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='DATABASE_TOKEN',
    database='DATABASE_NAME'
)

slack = WebClient(token='SLACK_BOT_TOKEN')

query = '''
SELECT
  LAST(co) AS co,
  room
FROM home
WHERE co > 10
GROUP BY room
'''

table = influxdb_raw.query(query=query, language="influxql")
data_frame = table.to_pandas()
data_frame = data_frame.reset_index()

for index, row in data_frame.iterrows():
    slack.chat_postMessage(
        channel="#SLACK_CHANNEL",
        text=f'Carbon monoxide (co) high in {row.room}: {row.co} ppm at {row.time}'
    )
```
{{% /code-placeholders %}}

{{% /code-tab-content %}}
<!-------------------------------- END INFLUXQL ------------------------------->
{{< /code-tabs-wrapper >}}
