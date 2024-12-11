---
description: "Telegraf plugin for transforming metrics using Starlark"
menu:
  telegraf_v1_ref:
    parent: processor_plugins_reference
    name: Starlark
    identifier: processor-starlark
tags: [Starlark, "processor-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

# Starlark Processor Plugin

The `starlark` processor calls a Starlark function for each matched metric,
allowing for custom programmatic metric processing.

The Starlark language is a dialect of Python, and will be familiar to those who
have experience with the Python language. However, there are major
differences.  Existing Python code is unlikely to work
unmodified.  The execution environment is sandboxed, and it is not possible to
do I/O operations such as reading from files or sockets.

The **[Starlark specification](https://github.com/google/starlark-go/blob/d1966c6b9fcd/doc/spec.md)** has details about the syntax and available
functions.

Telegraf minimum version: Telegraf 1.15.0

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Process metrics using a Starlark script
[[processors.starlark]]
  ## The Starlark source can be set as a string in this configuration file, or
  ## by referencing a file containing the script.  Only one source or script
  ## should be set at once.

  ## Source of the Starlark script.
  source = '''
def apply(metric):
  return metric
'''

  ## File containing a Starlark script.
  # script = "/usr/local/bin/myscript.star"

  ## The constants of the Starlark script.
  # [processors.starlark.constants]
  #   max_size = 10
  #   threshold = 0.75
  #   default_name = "Julia"
  #   debug_mode = true
```

## Usage

The Starlark code should contain a function called `apply` that takes a metric
as its single argument.  The function will be called with each metric, and can
return `None`, a single metric, or a list of metrics.

```python
def apply(metric):
    return metric
```

For a list of available types and functions that can be used in the code, see
the [Starlark specification](https://github.com/google/starlark-go/blob/d1966c6b9fcd/doc/spec.md).

In addition to these, the following InfluxDB-specific
types and functions are exposed to the script.

- **Metric(*name*)**:
Create a new metric with the given measurement name.  The metric will have no
tags or fields and defaults to the current time.

- **name**:
The name is a [string](https://github.com/google/starlark-go/blob/d1966c6b9fcd/doc/spec.md#strings) containing the metric measurement name.

- **tags**:
A [dict-like](https://github.com/google/starlark-go/blob/d1966c6b9fcd/doc/spec.md#dictionaries) object containing the metric's tags.

- **fields**:
A [dict-like](https://github.com/google/starlark-go/blob/d1966c6b9fcd/doc/spec.md#dictionaries) object containing the metric's fields.  The values may be
of type int, float, string, or bool.

- **time**:
The timestamp of the metric as an integer in nanoseconds since the Unix
epoch.

- **deepcopy(*metric*, *track=false*)**:
Copy an existing metric with or without tracking information. If `track` is set
to `true`, the tracking information is copied.
**Caution:** Make sure to always return *all* metrics with tracking information!
Otherwise, the corresponding inputs will never receive the delivery information
and potentially overrun!

### Python Differences

While Starlark is similar to Python, there are important differences to note:

- Starlark has limited support for error handling and no exceptions.  If an
  error occurs the script will immediately end and Telegraf will drop the
  metric.  Check the Telegraf logfile for details about the error.

- It is not possible to import other packages and the Python standard library
  is not available.

- It is not possible to open files or sockets.

- These common keywords are **not supported** in the Starlark grammar:

  ```text
  as             finally        nonlocal
  assert         from           raise
  class          global         try
  del            import         with
  except         is             yield
  ```

### Libraries available

The ability to load external scripts other than your own is pretty limited. The
following libraries are available for loading:

- json: `load("json.star", "json")` provides the following functions: `json.encode()`, `json.decode()`, `json.indent()`. See json.star for an example. For more details about the functions, please refer to [the documentation of this library](https://pkg.go.dev/go.starlark.net/lib/json).
- log: `load("logging.star", "log")` provides the following functions: `log.debug()`, `log.info()`, `log.warn()`, `log.error()`. See logging.star` provides [the following functions and constants](https://pkg.go.dev/go.starlark.net/lib/math). See math.star`. See time_date.star, time_duration.star and/or time_timestamp.star for an example. For more details about the functions, please refer to [the documentation of this library](https://pkg.go.dev/go.starlark.net/lib/time).

If you would like to see support for something else here, please open an issue.

### Common Questions

**What's the performance cost to using Starlark?**

In local tests, it takes about 1µs (1 microsecond) to run a modest script to
process one metric. This is going to vary with the size of your script, but the
total impact is minimal.  At this pace, it's likely not going to be the
bottleneck in your Telegraf setup.

**How can I drop/delete a metric?**

If you don't return the metric it will be deleted.  Usually this means the
function should `return None`.

**How should I make a copy of a metric?**

Use `deepcopy(metric)` to create a copy of the metric.

**How can I return multiple metrics?**

You can return a list of metrics:

```python
def apply(metric):
    m2 = deepcopy(metric)
    return [metric, m2]
```

**What happens to a tracking metric if an error occurs in the script?**

The metric is marked as undelivered.

**How do I create a new metric?**

Use the `Metric(name)` function and set at least one field.

**What is the fastest way to iterate over tags/fields?**

The fastest way to iterate is to use a for-loop on the tags or fields attribute:

```python
def apply(metric):
    for k in metric.tags:
        pass
    return metric
```

When you use this form, it is not possible to modify the tags inside the loop,
if this is needed you should use one of the `.keys()`, `.values()`, or
`.items()` methods:

```python
def apply(metric):
    for k, v in metric.tags.items():
        pass
    return metric
```

**How can I save values across multiple calls to the script?**

Telegraf freezes the global scope, which prevents it from being modified, except
for a special shared global dictionary named `state`, this can be used by the
`apply` function.  See an example of this in compare with previous
metric
    if error != None:
        # Some code to execute in case of an error
        metric.fields["error"] = error
    return metric

def failing(metric):
    json.decode("non-json-content")
```

**How to reuse the same script but with different parameters?**

In case you have a generic script that you would like to reuse for different
instances of the plugin, you can use constants as input parameters of your
script.

So for example, assuming that you have the next configuration:

```toml
[[processors.starlark]]
  script = "/usr/local/bin/myscript.star"

  [processors.starlark.constants]
    somecustomnum = 10
    somecustomstr = "mycustomfield"
```

Your script could then use the constants defined in the configuration as
follows:

```python
def apply(metric):
    if metric.fields[somecustomstr] >= somecustomnum:
        metric.fields.clear()
    return metric
```

**What does `cannot represent integer ...` mean?**

The error occurs if an integer value in starlark exceeds the signed 64 bit
integer limit. This can occur if you are summing up large values in a starlark
integer value or convert an unsigned 64 bit integer to starlark and then create
a new metric field from it.

This is due to the fact that integer values in starlark are *always* signed and
can grow beyond the 64-bit size. Therefore converting the value back fails in
the cases mentioned above.

As a workaround you can either clip the field value at the signed 64-bit limit
or return the value as a floating-point number.

### Examples

- drop string fields - Drop fields containing string values.
- drop fields with unexpected type - Drop fields containing unexpected value types.
- iops
- json - an example of processing JSON from a field in a metric
- math - Use a math function to compute the value of a field. [The list of the supported math functions and constants](https://pkg.go.dev/go.starlark.net/lib/math).
- number logic - transform a numerical value to another numerical value
- pivot - Pivots a key's value to be the key for another key.
- ratio - Compute the ratio of two integer fields
- rename - Rename tags or fields using a name mapping.
- scale - Multiply any field by a number
- time date - Parse a date and extract the year, month and day from it.
- time duration - Parse a duration and convert it into a total amount of seconds.
- time timestamp - Filter metrics based on the timestamp in seconds.
- time timestamp nanoseconds - Filter metrics based on the timestamp with nanoseconds.
- time timestamp current - Setting the metric timestamp to the current/local time.
- value filter - Remove a metric based on a field value.
- logging - Log messages with the logger of Telegraf
- multiple metrics - Return multiple metrics by using [a list](https://docs.bazel.build/versions/master/skylark/lib/list.html) of metrics.
- multiple metrics from json array - Builds a new metric from each element of a json array then returns all the created metrics.
- custom error - Return a custom error with [fail](https://docs.bazel.build/versions/master/skylark/lib/globals.html#fail).
- compare with previous metric - Compare the current metric with the previous one using the shared state.
- rename prometheus remote write - Rename prometheus remote write measurement name with fieldname and rename fieldname to value.

All examples are in the testdata folder.

Open a Pull Request to add any other useful Starlark examples.

[Starlark specification]: https://github.com/google/starlark-go/blob/d1966c6b9fcd/doc/spec.md
[string]: https://github.com/google/starlark-go/blob/d1966c6b9fcd/doc/spec.md#strings
[dict]: https://github.com/google/starlark-go/blob/d1966c6b9fcd/doc/spec.md#dictionaries
