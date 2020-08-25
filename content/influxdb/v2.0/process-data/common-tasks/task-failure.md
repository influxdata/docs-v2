---
title: Notify on failed tasks
seotitle: Notify on failed tasks.
description: >
  How to create a task to send a notification if a specific task fails.
menu:
  influxdb_2_0:
    name: Notify on failed tasks
    parent: Common tasks
weight: 201
v2.0/tags: [tasks]
---

Use a task to monitor other tasks and receive alerts on failure.

## Example alert task script

```js
import "strings"
import "regexp"
import "influxdata/influxdb/monitor"
import "influxdata/influxdb/v1"

option task = {name: "Failed Tasks Check", every: 1h, offset: 4m}

task_data = from(bucket: "_tasks")
	|> range(start: -1h, stop: now())
	|> filter(fn: (r) =>
		(r["_measurement"] == "runs"))
	|> filter(fn: (r) =>
		(r["_field"] == "logs"))
	|> map(fn: (r) => ({ r with name: strings.split(v: regexp.findString(r: /option task = \{([^\}]+)/, v: r._value), t: "\\\\\\\"")[1] }))
	|> drop(columns: ["_value", "_start", "_stop"])
	|> group(columns: ["name", "taskID", "status", "_measurement"])
	|> map(fn: (r) =>
		({r with _value: if r.status == "failed" then 1 else 0}))
	|> last()
check = {
	_check_id: "0000000deadbeef1",
	_check_name: "Failed Tasks Check",
	_type: "threshold",
	tags: {},
}
ok = (r) =>
	(r["logs"] == 0)
crit = (r) =>
	(r["logs"] == 1)
messageFn = (r) =>
	("The task: ${r.taskID} - ${r.name} has a status of ${r.status}")

task_data
	|> v1["fieldsAsCols"]()
	|> monitor["check"](
		data: check,
		messageFn: messageFn,
		ok: ok,
		crit: crit,
	)
```

## Add your task
Once your task is ready, see [Create a task](/influxdb/v2.0/process-data/manage-tasks/create-task) for information about adding it to InfluxDB.
