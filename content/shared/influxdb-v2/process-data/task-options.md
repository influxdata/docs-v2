
Task options define specific information about a task.
They are set in a Flux script {{% show-in "cloud,cloud-serverless" %}}, in the InfluxDB API, {{% /show-in %}} or in the InfluxDB user interface (UI).
The following task options are available:

- [name](#name)
- [every](#every)
- [cron](#cron)
- [offset](#offset)

{{% note %}}
`every` and `cron` are mutually exclusive, but at least one is required.
{{% /note %}}

## name

The name of the task. _**Required**_.

_**Data type:** String_

In Flux:

```js
option task = {
    name: "taskName",
    // ...
}
```

{{% show-in "cloud,cloud-serverless" %}}
In a `/api/v2/tasks` request body with `scriptID`:

```json
{
  "scriptID": "SCRIPT_ID",
  "name": "TASK_NAME"
  ...
}
```

Replace `SCRIPT_ID` with the ID of your InfluxDB invokable script.
{{% /show-in %}}

## every

The interval at which the task runs. This option also determines when the task first starts to run, depending on the specified time (in [duration literal](/flux/v0/spec/lexical-elements/#duration-literals)).

_**Data type:** Duration_

For example, if you save or schedule a task at 2:30 and run the task every hour (`1h`):

`option task = {name: "aggregation", every: 1h}`

The task first executes at 3:00pm, and subsequently every hour after that.

In Flux:

```js
option task = {
    // ...
    every: 1h,
}
```

{{% show-in "cloud,cloud-serverless" %}}
In a `/api/v2/tasks` request body with `scriptID`:

```json
{
  "scriptID": "SCRIPT_ID",
  "every": "1h"
  ...
}
```

{{% /show-in %}}

{{% note %}}
In the InfluxDB UI, use the **Interval** field to set this option.
{{% /note %}}

## cron

The [cron expression](https://en.wikipedia.org/wiki/Cron#Overview) that
defines the schedule on which the task runs.
Cron scheduling is based on system time.

_**Data type:** String_

In Flux:

```js
option task = {
    // ...
    cron: "0 * * * *",
}
```

{{% show-in "cloud,cloud-serverless" %}}
In a `/api/v2/tasks` request body with `scriptID`:

```json
{
  "scriptID": "SCRIPT_ID",
  "cron": "0 * * * *",
  ...
}
```

{{% /show-in %}}

## offset

Delays the execution of the task but preserves the original time range.
For example, if a task is to run on the hour, a `10m` offset will delay it to 10
minutes after the hour, but all time ranges defined in the task are relative to
the specified execution time.
A common use case is offsetting execution to account for data that may arrive late.

_**Data type:** Duration_

In Flux:

```js
option task = {
    // ...
    offset: 10m,
}
```

{{% show-in "cloud,cloud-serverless" %}}

In a `/api/v2/tasks` request body with `scriptID`:

```json
{
  "scriptID": "SCRIPT_ID",
  "offset": "10m",
  ...
}
```

{{% /show-in %}}