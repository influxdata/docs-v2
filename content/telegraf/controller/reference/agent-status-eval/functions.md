---
title: CEL functions and operators
description: >
  Reference for functions and operators available in CEL expressions used to
  evaluate Telegraf agent status.
menu:
  telegraf_controller:
    name: Functions
    parent: Agent status evaluation
weight: 202
---

CEL expressions for agent status evaluation support built-in CEL operators and
the following function libraries.

## Time functions

### `now()`

Returns the current time.
Use with `last_update` to calculate durations or detect stale data.

```js
// True if more than 10 minutes since last heartbeat
now() - last_update > duration('10m')
```

```js
// True if more than 5 minutes since last heartbeat
now() - last_update > duration('5m')
```

## Math functions

Math functions from the
[CEL math library](https://github.com/google/cel-go/blob/master/ext/README.md#math)
are available for numeric calculations.

### Commonly used functions

| Function | Description | Example |
|:---------|:------------|:--------|
| `math.greatest(a, b, ...)` | Returns the greatest value. | `math.greatest(log_errors, log_warnings)` |
| `math.least(a, b, ...)` | Returns the least value. | `math.least(agent.metrics_gathered, 1000)` |

### Example

```js
// Warn if either errors or warnings exceed a threshold
math.greatest(log_errors, log_warnings) > 5
```

## String functions

String functions from the
[CEL strings library](https://github.com/google/cel-go/blob/master/ext/README.md#strings)
are available for string operations.
These are useful when checking plugin `alias` or `id` fields.

### Example

```js
// Check if any input plugin has an alias containing "critical"
inputs.cpu.exists(i, has(i.alias) && i.alias.contains("critical"))
```

## Encoding functions

Encoding functions from the
[CEL encoder library](https://github.com/google/cel-go/blob/master/ext/README.md#encoders)
are available for encoding and decoding values.

## Operators

CEL supports standard operators for building expressions.

### Comparison operators

| Operator | Description | Example |
|:---------|:------------|:--------|
| `==` | Equal | `metrics == 0` |
| `!=` | Not equal | `log_errors != 0` |
| `<` | Less than | `agent.metrics_gathered < 100` |
| `<=` | Less than or equal | `buffer_fullness <= 0.5` |
| `>` | Greater than | `log_errors > 10` |
| `>=` | Greater than or equal | `metrics >= 1000` |

### Logical operators

| Operator | Description | Example |
|:---------|:------------|:--------|
| `&&` | Logical AND | `log_errors > 0 && metrics == 0` |
| `\|\|` | Logical OR | `log_errors > 10 \|\| log_warnings > 50` |
| `!` | Logical NOT | `!(metrics > 0)` |

### Arithmetic operators

| Operator | Description | Example |
|:---------|:------------|:--------|
| `+` | Addition | `log_errors + log_warnings` |
| `-` | Subtraction | `agent.metrics_gathered - agent.metrics_dropped` |
| `*` | Multiplication | `log_errors * 2` |
| `/` | Division | `agent.metrics_dropped / agent.metrics_gathered` |
| `%` | Modulo | `metrics % 100` |

### Ternary operator

```js
// Conditional expression
log_errors > 10 ? true : false
```

### List operations

| Function | Description | Example |
|:---------|:------------|:--------|
| `exists(var, condition)` | True if any element matches. | `inputs.cpu.exists(i, i.errors > 0)` |
| `all(var, condition)` | True if all elements match. | `outputs.influxdb_v2.all(o, o.errors == 0)` |
| `size()` | Number of elements. | `inputs.cpu.size() > 0` |
| `has()` | True if a field or key exists. | `has(inputs.cpu)` |
