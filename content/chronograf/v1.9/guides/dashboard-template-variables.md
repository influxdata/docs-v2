---
title: Use dashboard template variables
description: >
  Chronograf dashboard template variables let you update cell queries without editing queries,
  making it easy to interact with your dashboard cells and explore your data.
aliases:
  - /chronograf/v1.9/introduction/templating/
  - /chronograf/v1.9/templating/
menu:
  chronograf_1_9:
    weight: 90
    parent: Guides
---

Chronograf dashboard template variables let you update cell queries without editing queries,
making it easy to interact with your dashboard cells and explore your data.

- [Use template variables](#use-template-variables)
- [Predefined template variables](#predefined-template-variables)
- [Create custom template variables](#create-custom-template-variables)
- [Template variable types](#template-variable-types)
- [Reserved variable names](#reserved-variable-names)
- [Advanced template variable usage](#advanced-template-variable-usage)

## Use template variables

When creating Chronograf dashboards, use either [predefined template variables](#predefined-template-variables)
or [custom template variables](#create-custom-template-variables) in your cell queries and titles.
After you set up variables, variables are available to select in your dashboard user interface (UI).

- [Use template variables in cell queries](#use-template-variables-in-cell-queries)
  - [InfluxQL](#influxql)
  - [Flux](#flux)
- [Use template variables in cell titles](#use-template-variables-in-cell-titles)

![Use template variables](/img/chronograf/1-6-template-vars-use.gif)

### Use template variables in cell queries
Both InfluxQL and Flux support template variables.

#### InfluxQL
In an InfluxQL query, surround template variables names with colons (`:`) as follows:

```sql
SELECT :variable_name: FROM "telegraf"."autogen".:measurement: WHERE time < :dashboardTime:
```

##### Quoting template variables in InfluxQL

For **predefined meta queries** such as "Field Keys" and "Tag Values", **do not add quotes** (single or double) to your queries. Chronograf will add quotes as follows:

```sql
SELECT :variable_name: FROM "telegraf"."autogen".:measurement: WHERE time < :dashboardTime:
```

For **custom queries**, **CSV**, or **map queries**, quote the values in the query following standard [InfluxQL](/{{< latest "influxdb" "v1" >}}/query_language/) syntax:

- For numerical values, **do not quote**.
- For string values, choose to quote the values in the variable definition (or not).  See [String examples](#string-examples) below.

{{% note %}}
**Tips for quoting strings:**
- When using custom meta queries that return strings, typically, you quote the variable values when using them in a dashboard query, given InfluxQL results are returned without quotes.
- If you are using template variable strings in regular expression syntax (when using quotes may cause query syntax errors), the flexibility in query quoting methods is particularly useful.
{{% /note %}}

##### String examples

Add single quotes when you define template variables, or in your queries, but not both.

###### Add single quotes in variable definition

If you define a custom CSV variable named `host` using single quotes:

```sh
'host1','host2','host3'
```

Do not include quotes in your query:

```sql
SELECT mean("usage_user") AS "mean_usage_user" FROM "telegraf"."autogen"."cpu" 
WHERE "host" = :host: and time > :dashboardTime
```

###### Add single quotes in query

If you define a custom CSV variable named `host` without quotes:

```sh
host1,host2,host3
```

Add single quotes in your query:

```sql
SELECT mean("usage_user") AS "mean_usage_user" FROM "telegraf"."autogen"."cpu" 
WHERE "host" = ':host:' and time > :dashboardTime
```

#### Flux
In Flux, template variables are stored in a `v` record.
Use dot or bracket notation to reference the variable key inside of the `v` record:

```js
from(bucket: v.bucket)
  |> range(start: v.timeRangeStart, stop: v.timeRangeStart)
  |> filter(fn: (r) => r._field == v["Field key"])
  |> aggregateWindow(every: v.windowPeriod, fn: v.aggregateFunction)
```

### Use template variables in cell titles
To dynamically change the title of a dashboard cell,
use the `:variable-name:` syntax.

For example, a variable named `field` with a value of `temp` and a variable
named `location` with a value of `San Antonio`, use the following syntax:

```
:temp: data for :location:
```

Displays as:

{{< img-hd src= "/img/chronograf/1-9-template-var-title.png" alt="Use template variables in cell titles" />}}

## Predefined template variables

Chronograf includes predefined template variables controlled by elements in the Chronograf UI.
Use predefined template variables in your cell queries.

InfluxQL and Flux include their own sets of predefined template variables:

{{< tabs-wrapper >}}
{{% tabs %}}
[InfluxQL](#)
[Flux](#)
{{% /tabs %}}
{{% tab-content %}}
- [`:dashboardTime:`](#dashboardtime)
- [`:upperDashboardTime:`](#upperdashboardtime)
- [`:interval:`](#interval)

### dashboardTime
The `:dashboardTime:` template variable is controlled by the "time" dropdown in your Chronograf dashboard.

<img src="/img/chronograf/1-6-template-vars-time-dropdown.png" style="width:100%;max-width:549px;" alt="Dashboard time selector"/>

If using relative times, it represents the time offset specified in the dropdown (-5m, -15m, -30m, etc.) and assumes time is relative to "now".
If using absolute times defined by the date picker, `:dashboardTime:` is populated with lower threshold.

```sql
SELECT "usage_system" AS "System CPU Usage"
FROM "telegraf".."cpu"
WHERE time > :dashboardTime:
```

{{% note %}}
To use the date picker to specify a past time range, construct the query using `:dashboardTime:`
as the start time and [`:upperDashboardTime:`](#upperdashboardtime) as the stop time.
{{% /note %}}

### upperDashboardTime
The `:upperDashboardTime:` template variable is defined by the upper time limit specified using the date picker.

<img src="/img/chronograf/1-6-template-vars-date-picker.png" style="width:100%;max-width:762px;" alt="Dashboard date picker"/>

It will inherit `now()` when using relative time frames or the upper time limit when using absolute timeframes.

```sql
SELECT "usage_system" AS "System CPU Usage"
FROM "telegraf".."cpu"
WHERE time > :dashboardTime: AND time < :upperDashboardTime:
```

### interval

The `:interval:` template variable is defined by the interval dropdown in the Chronograf dashboard.

<img src="/img/chronograf/1-6-template-vars-interval-dropdown.png" style="width:100%;max-width:549px;" alt="Dashboard interval selector"/>

In cell queries, it should be used in the `GROUP BY time()` clause that accompanies aggregate functions:

```sql
SELECT mean("usage_system") AS "Average System CPU Usage"
FROM "telegraf".."cpu"
WHERE time > :dashboardtime:
GROUP BY time(:interval:)
```
{{% /tab-content %}}
{{% tab-content %}}
- [`v.timeRangeStart`](#vtimerangestart)
- [`v.timeRangeStop`](#vtimerangestop)
- [`v.windowPeriod`](#vwindowperiod)

{{% note %}}
#### Backward compatible Flux template variables
**Chronograf 1.9+** supports the InfluxDB 2.0 variable pattern of storing
[predefined template variables](#predefined-template-variables) and [custom template variables](#create-custom-template-variables)
in a `v` record and using dot or bracket notation to reference variables.
For backward compatibility, Chronograf 1.9+ still supports the following predefined
variables that do not use the `v.` syntax:

- [`dashboardTime`](/chronograf/v1.8/guides/dashboard-template-variables/#dashboardtime-flux)
- [`upperDashboardTime`](/chronograf/v1.8/guides/dashboard-template-variables/#upperdashboardtime-flux)
- [`autoInterval`](/chronograf/v1.8/guides/dashboard-template-variables/#autointerval) 
{{% /note %}}

### v.timeRangeStart

The `v.timeRangeStart` template variable is controlled by the "time" dropdown in your Chronograf dashboard.

<img src="/img/chronograf/1-6-template-vars-time-dropdown.png" style="width:100%;max-width:549px;" alt="Dashboard time selector"/>

If using relative time, this variable represents the time offset specified in the dropdown (-5m, -15m, -30m, etc.) and assumes time is relative to "now".
If using absolute time defined by the date picker, `v.timeRangeStart` is populated with the start time.

```js
from(bucket: "telegraf/autogen")
  |> range(start: v.timeRangeStart)
  |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_system")
```

{{% note %}}
To use the date picker to specify a time range in the past without "now", use
`v.timeRangeStart` as the start time and [`v.timeRangeStop`](#vtimerangestop)
as the stop time.
{{% /note %}}

### v.timeRangeStop
The `v.timeRangeStop` template variable is defined by the upper time limit specified using the date picker.

<img src="/img/chronograf/1-6-template-vars-date-picker.png" style="width:100%;max-width:762px;" alt="Dashboard date picker"/>

For relative time frames, this variable inherits `now()`. For absolute time frames, this variable inherits the upper time limit.

```js
from(bucket: "telegraf/autogen")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_system")
```

### v.windowPeriod
The `v.windowPeriod` template variable is controlled by the display width of the
dashboard cell and is calculated by the duration of time that each pixel covers.
Use the `v.windowPeriod` variable to limit downsample data to display a maximum of one point per pixel.

```js
from(bucket: "telegraf/autogen")
  |> range(start: v.timeRangeStart)
  |> filter(fn: (r) => r._measurement == "cpu" and r._field == "usage_system")
  |> aggregateWindow(every: v.windowPeriod, fn: mean)
```
{{% /tab-content %}}
{{< /tabs-wrapper >}}

## Create custom template variables

Chronograf lets you create custom template variables powered by meta queries or CSV uploads that return an array of possible values.

To create a template variable:

1. Click on **Template Variables** at the top of your dashboard, then **+ Add Variable**.
2. Select a data source from the **Data Source** dropdown menu.
3. Provide a name for the variable.
4. Select the [variable type](#template-variable-types).
   The type defines the method for retrieving the array of possible values.
5. View the list of potential values and select a default.
   If using the CSV or Map types, upload or input the CSV with the desired values in the appropriate format then select a default value.
6. Click **Create**.

Once created, the template variable can be used in any of your cell's queries or titles
and a dropdown for the variable will be included at the top of your dashboard.

## Template Variable Types
Chronograf supports the following template variable types:

- [Databases](#databases)
- [Measurements](#measurements)
- [Field Keys](#field-keys)
- [Tag Keys](#tag-keys)
- [Tag Values](#tag-values)
- [CSV](#csv)
- [Map](#map)
- [InfluxQL Meta Query](#influxql-meta-query)
- [Flux Query](#flux-query)
- [Text](#text)

### Databases
Database template variables allow you to select from multiple target [databases](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#database).

_**Database meta query**_  
Database template variables use the following meta query to return an array of all databases in your InfluxDB instance.

```sql
SHOW DATABASES
```

_**Example database variable in a cell query**_
```sql
SELECT "purchases" FROM :databaseVar:."autogen"."customers"
```

#### Database variable use cases
Use database template variables when visualizing multiple databases with similar or identical data structures.
Variables let you quickly switch between visualizations for each of your databases.

### Measurements
Vary the target [measurement](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#measurement).

_**Measurement meta query**_  
Measurement template variables use the following meta query to return an array of all measurements in a given database.

```sql
SHOW MEASUREMENTS ON database_name
```

_**Example measurement variable in a cell query**_
```sql
SELECT * FROM "animals"."autogen".:measurementVar:
```

#### Measurement variable use cases
Measurement template variables allow you to quickly switch between measurements in a single cell or multiple cells in your dashboard.


### Field Keys
Vary the target [field key](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#field-key).

_**Field key meta query**_  
Field key template variables use the following meta query to return an array of all field keys in a given measurement from a given database.

```sql
SHOW FIELD KEYS ON database_name FROM measurement_name
```

_**Example field key var in a cell query**_
```sql
SELECT :fieldKeyVar: FROM "animals"."autogen"."customers"
```

#### Field key variable use cases
Field key template variables are great if you want to quickly switch between field key visualizations in a given measurement.


### Tag Keys
Vary the target [tag key](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#tag-key).

_**Tag key meta query**_  
Tag key template variables use the following meta query to return an array of all tag keys in a given measurement from a given database.

```sql
SHOW TAG KEYS ON database_name FROM measurement_name
```

_**Example tag key variable in a cell query**_
```sql
SELECT "purchases" FROM "animals"."autogen"."customers" GROUP BY :tagKeyVar:
```

#### Tag key variable use cases
Tag key template variables are great if you want to quickly switch between tag key visualizations in a given measurement.


### Tag Values
Vary the target [tag value](/{{< latest "influxdb" "v1" >}}/concepts/glossary/#tag-value).

_**Tag value meta query**_  
Tag value template variables use the following meta query to return an array of all values associated with a given tag key in a specified measurement and database.

```sql
SHOW TAG VALUES ON database_name FROM measurement_name WITH KEY tag_key
```

_**Example tag value variable in a cell query**_
```sql
SELECT "purchases" FROM "animals"."autogen"."customers" WHERE "species" = :tagValueVar:
```

#### Tag value variable use cases
Tag value template variables are great if you want to quickly switch between tag value visualizations in a given measurement.


### CSV
Vary part of a query with a customized list of comma-separated values (CSV).

_**Example CSVs:**_
```csv
value1, value2, value3, value4
```
```csv
value1
value2
value3
value4
```

{{% note %}}
String field values [require single quotes in InfluxQL](/{{< latest "influxdb" "v1" >}}/troubleshooting/frequently-asked-questions/#when-should-i-single-quote-and-when-should-i-double-quote-in-queries).

```csv
'string1','string2','string3','string4'
```
{{% /note %}}

_**Example CSV variable in a cell query**_
```sql
SELECT "purchases" FROM "animals"."autogen"."customers" WHERE "petname" = :csvVar:
```

#### CSV variable use cases
CSV template variables are great when the array of values necessary for your variable can't be pulled from InfluxDB using a meta query.
They allow you to use custom variable values.

### Map
Vary part of a query with a customized list of key-value pairs in CSV format.
They key of each key-value pair is used to populate the template variable dropdown in your dashboard.
The value is used when processing cells' queries.

_**Example CSV:**_
```csv
key1,value1
key2,value2
key3,value3
key4,value4
```

<img src="/img/chronograf/1-6-template-vars-map-dropdown.png" style="width:100%;max-width:140px;" alt="Map variable dropdown"/>

{{% note %}}
Wrap string field values in single quotes ([required by InfluxQL](/{{< latest "influxdb" "v1" >}}/troubleshooting/frequently-asked-questions/#when-should-i-single-quote-and-when-should-i-double-quote-in-queries)).
Variable keys do not require quotes.

```csv
key1,'value1'
key2,'value2'
key3,'value3'
key4,'value4'
```
{{% /note %}}

_**Example Map variable in a cell query**_
```sql
SELECT "purchases" FROM "animals"."autogen"."customers" WHERE "customer" = :mapVar:
```

#### Map variable use cases
Map template variables are good when you need to map or alias simple names or keys to longer or more complex values.
For example, you may want to create a `:customer:` variable that populates your cell queries with a long, numeric customer ID (`11394850823894034209`).
With a map variable, you can alias simple names to complex values, so your list of customers would look something like:

```
Apple,11394850823894034209
Amazon,11394850823894034210
Google,11394850823894034211
Microsoft,11394850823894034212
```

The customer names would populate your template variable dropdown rather than the customer IDs.

### InfluxQL Meta Query
Vary part of a query with a customized meta query that pulls a specific array of values from InfluxDB.
InfluxQL meta query variables let you pull a highly customized array of potential
values and offer advanced functionality such as [filtering values based on other template variables](#filter-template-variables-with-other-template-variables).

<img src="/img/chronograf/1-6-template-vars-custom-meta-query.png" style="width:100%;max-width:667px;" alt="Custom meta query"/>

_**Example custom meta query variable in a cell query**_
```sql
SELECT "purchases" FROM "animals"."autogen"."customers" WHERE "customer" = :customMetaVar:
```

#### InfluxQL meta query variable use cases
Use custom InfluxQL meta query template variables when predefined template variable types aren't able to return the values you want.

### Flux Query
Flux query template variables let you define variable values using Flux queries.
**Variable values are extracted from the `_value` column returned by your Flux query.**

#### Flux query variable use cases
Flux query template variables are great when the values necessary for your
variable can't be queried with InfluxQL or if you need the flexibility of Flux
to return your desired list of variable values.

### Text
Vary a part of a query with a single string of text.
There is only one value per text variable, but this value is easily altered.

#### Text variable use cases
Text template variables allow you to dynamically alter queries, such as adding or altering `WHERE` clauses, for multiple cells at once.
You could also use a text template variable to alter a regular expression used in multiple queries.
They are great when troubleshooting incidents that affect multiple visualized metrics.

## Reserved variable names
The following variable names are reserved and cannot be used when creating template variables.
Chronograf accepts [template variables as URL query parameters](#define-template-variables-in-the-url)
as well as many other parameters that control the display of graphs in your dashboard.
These names are either [predefined variables](#predefined-template-variables) or would
conflict with existing URL query parameters.

- `:database:`
- `:measurement:`
- `:dashboardTime:`
- `:upperDashboardTime:`
- `:interval:`
- `:upper:`
- `:lower:`
- `:zoomedUpper:`
- `:zoomedLower:`
- `:refreshRate:`

## Advanced template variable usage

### Filter template variables with other template variables
[Custom InfluxQL meta query template variables](#influxQL-meta-query) let you filter the array of potential variable values using other existing template variables.

For example, let's say you want to list all the field keys associated with a measurement, but want to be able to change the measurement:

1. Create a template variable named `:measurementVar:` _(the name "measurement" is [reserved]( #reserved-variable-names))_ that uses the [Measurements](#measurements) variable type to pull in all measurements from the `telegraf` database.

    <img src="/img/chronograf/1-6-template-vars-measurement-var.png" style="width:100%;max-width:667px;" alt="measurementVar"/>

2. Create a template variable named `:fieldKey:` that uses the [InfluxQL meta query](#influxql-meta-query) variable type.
The following meta query pulls a list of field keys based on the existing `:measurementVar:` template variable.
  
    ```sql
    SHOW FIELD KEYS ON telegraf FROM :measurementVar:
    ```

    <img src="/img/chronograf/1-6-template-vars-fieldkey.png" style="width:100%;max-width:667px;" alt="fieldKey"/>

3. Create a new dashboard cell that uses the `fieldKey` and `measurementVar` template variables in its query.

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[InfluxQL](#)
[Flux](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sql
SELECT :fieldKey: FROM "telegraf"..:measurementVar: WHERE time > :dashboardTime:
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
from(bucket: "telegraf/")
  |> range(start: v.timeRangeStart)
  |> filter(fn: (r) =>
    r._measurement == v.measurementVar and
    r._field == v.fieldKey
  )
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

The resulting dashboard will work like this:

![Custom meta query filtering](/img/chronograf/1-6-custom-meta-query-filtering.gif)

### Define template variables in the URL
Chronograf uses URL query parameters (also known as query string parameters) to set both display options and template variables in the URL.
This makes it easy to share links to dashboards so they load in a specific state with specific template variable values selected.

URL query parameters are appended to the end of the URL with a question mark (`?`)
indicating the beginning of query parameters.
Chain multiple query parameters together using an ampersand (`&`).

To declare a template variable or a date range as a URL query parameter, it must follow the following pattern:

#### Pattern for template variable query parameters
```bash
# Spaces for clarity only
& tempVars %5B variableName %5D = variableValue
```

`&`  
Indicates the beginning of a new query parameter in a series of multiple query parameters.

`tempVars`  
Informs Chronograf that the query parameter being passed is a template variable.
_**Required for all template variable query parameters.**_

`%5B`, `%5D`  
URL-encoded `[` and `]` respectively that enclose the template variable name.

`variableName`  
Name of the template variable.

`variableValue`  
Value of the template variable.

{{% note %}}
When template variables are modified in the dashboard, the corresponding
URL query parameters are automatically updated.
{{% /note %}}

#### Example template variable query parameter
```
.../?&tempVars%5BmeasurementVar%5D=cpu
```

#### Including multiple template variables in the URL
To chain multiple template variables as URL query parameters, include the full [pattern](#pattern-for-template-variable-query-parameters) for _**each**_ template variable.

```bash
# Spaces for clarity only
.../?  &tempVars%5BmeasurementVar%5D=cpu  &tempVars%5BfieldKey%5D=usage_system
```
