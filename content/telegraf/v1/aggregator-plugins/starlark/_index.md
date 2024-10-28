---
description: "Telegraf plugin for aggregating metrics using Starlark"
menu:
  telegraf_v1_ref:
    parent: aggregator_plugins_reference
    name: Starlark
    identifier: aggregator-starlark
tags: [Starlark, "aggregator-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

# Starlark Aggregator Plugin

The `starlark` aggregator allows to implement a custom aggregator plugin with a
Starlark script. The Starlark script needs to be composed of the three methods
defined in the Aggregator plugin interface which are `add`, `push` and `reset`.

The Starlark Aggregator plugin calls the Starlark function `add` to add the
metrics to the aggregator, then calls the Starlark function `push` to push the
resulting metrics into the accumulator and finally calls the Starlark function
`reset` to reset the entire state of the plugin.

The Starlark functions can use the global function `state` to keep temporary the
metrics to aggregate.

The Starlark language is a dialect of Python, and will be familiar to those who
have experience with the Python language. However, there are major
differences.  Existing
Python code is unlikely to work unmodified.  The execution environment is
sandboxed, and it is not possible to do I/O operations such as reading from
files or sockets.

The **[Starlark specification](https://github.com/google/starlark-go/blob/d1966c6b9fcd/doc/spec.md)** has details about the syntax and available
functions.

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Aggregate metrics using a Starlark script
[[aggregators.starlark]]
  ## The Starlark source can be set as a string in this configuration file, or
  ## by referencing a file containing the script.  Only one source or script
  ## should be set at once.
  ##
  ## Source of the Starlark script.
  source = '''
state = {}

def add(metric):
  state["last"] = metric

def push():
  return state.get("last")

def reset():
  state.clear()
'''

  ## File containing a Starlark script.
  # script = "/usr/local/bin/myscript.star"

  ## The constants of the Starlark script.
  # [aggregators.starlark.constants]
  #   max_size = 10
  #   threshold = 0.75
  #   default_name = "Julia"
  #   debug_mode = true
```

## Usage

The Starlark code should contain a function called `add` that takes a metric as
argument.  The function will be called with each metric to add, and doesn't
return anything.

```python
def add(metric):
  state["last"] = metric
```

The Starlark code should also contain a function called `push` that doesn't take
any argument.  The function will be called to compute the aggregation, and
returns the metrics to push to the accumulator.

```python
def push():
  return state.get("last")
```

The Starlark code should also contain a function called `reset` that doesn't
take any argument.  The function will be called to reset the plugin, and doesn't
return anything.

```python
def reset():
  state.clear()
```

For a list of available types and functions that can be used in the code, see
the [Starlark specification](https://github.com/google/starlark-go/blob/d1966c6b9fcd/doc/spec.md).

## Python Differences

Refer to the section Python
Differences of the
documentation about the Starlark processor.

## Libraries available

Refer to the section Libraries
available of the
documentation about the Starlark processor.

## Common Questions

Refer to the section Common
Questions of the
documentation about the Starlark processor.

## Examples

- minmax - A minmax aggregator implemented with a Starlark script.
- merge - A merge aggregator implemented with a Starlark script.

All examples are in the testdata folder.

Open a Pull Request to add any other useful Starlark examples.

[Starlark specification]: https://github.com/google/starlark-go/blob/d1966c6b9fcd/doc/spec.md
