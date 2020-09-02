---
title: influxd generate help-schema
description: >
  The `influxd generate help-schema` command outputs an example TOML schema to stdout
  that includes documentation describing the available options.
influxdb/v2.0/tags: [sample-data]
menu:
  influxdb_2_0_ref:
    parent: influxd generate
weight: 301
products: [oss]
---

The `influxd generate help-schema` command outputs an example TOML schema to stdout that includes
descriptions of available options. _See [example output](#example-output) below_.
Use custom TOML schema files to generate sample data sets with
[`influxd generate`](/influxdb/v2.0/reference/cli/influxd/generate).

## Usage
```sh
influxd generate help-schema [flags]
```

## Flags
| Flag |                | Description                                                               | Input Type |
|:---- |:---            |:-----------                                                               |:----------:|
|      | `--print`      | Print data spec and exit                                                  |            |
|      | `--org`        | Organization name                                                         | string     |
|      | `--bucket`     | Bucket name                                                               | string     |
|      | `--start-time` | Start time (`YYYY-MM-DDT00:00:00Z`) (default is 00:00:00 of one week ago) | string     |
|      | `--end-time`   | End time (`YYYY-MM-DDT00:00:00Z`) (default is 00:00:00 of current day)    | string     |
|      | `--clean`      | Clean time series data files (`none`, `tsm` or `all`) (default `none`)    | string     |
|      | `--cpuprofile` | Collect a CPU profile                                                     | string     |
|      | `--memprofile` | Collect a memory profile                                                  | string     |
| `-h` | `--help`       | Help for the `help-schema` command                                        |            |

## Example output
{{% truncate %}}
```toml
title = "Documented schema"

# limit the maximum number of series generated across all measurements
#
# series-limit: integer, optional (default: unlimited)

[[measurements]]

# name of measurement
#
# NOTE:
# Multiple definitions of the same measurement name are allowed and
# will be merged together.
name = "cpu"

# sample: float; where 0 < sample ≤ 1.0 (default: 0.5)
#   sample a subset of the tag set
#
# sample 25% of the tags
#
sample = 0.25

# Keys for defining a tag
#
# name: string, required
#   Name of field
#
# source: array<string> or object
#
#   A literal array of string values defines the tag values.
#
#   An object defines more complex generators. The type key determines the
#   type of generator.
#
# source types:
#
# type: "sequence"
#   generate a sequence of tag values
#
#       format: string
#           a format string for the values (default: "value%s")
#       start: int (default: 0)
#           beginning value
#       count: int, required
#           ending value
#
# type: "file"
#   generate a sequence of tag values from a file source.
#   The data in the file is sorted, deduplicated and verified is valid UTF-8
#
#       path: string
#           absolute path or relative path to current toml file
tags = [
    # example sequence tag source. The range of values are automatically
    # prefixed with 0s
    # to ensure correct sort behavior.
    { name = "host", source = { type = "sequence", format = "host-%s", start = 0, count = 5 } },

    # tags can also be sourced from a file. The path is relative to the
    # schema.toml.
    # Each value must be on a new line. The file is also sorted, deduplicated
    # and UTF-8 validated.
    { name = "rack", source = { type = "file", path = "files/racks.txt" } },

    # Example string array source, which is also deduplicated and sorted
    { name = "region", source = ["us-west-01","us-west-02","us-east"] },
]

# Keys for defining a field
#
# name: string, required
#   Name of field
#
# count: int, required
#   The maximum number of values to generate. When multiple fields
#   have the same count and time-spec, they will share timestamps.
#
# A time-spec can be either time-precision or time-interval, which
# determines how timestamps are generated and may also influence
# the time range and number of values generated.
#
# time-precision: string [ns, us, ms, s, m, h] (default: ms)
#   Specifies the precision (rounding) for generated timestamps.
#
#   If the precision results in fewer than "count" intervals for the
#   given time range, the number of values will be reduced.
#
#   Example:
#      count = 1000, start = 0s, end = 100s, time-precison = s
#      100 values will be generated at [0s, 1s, 2s, ..., 99s]
#
#   If the precision results in greater than "count" intervals for the
#   given time range, the interval will be rounded to the nearest multiple of
#   time-precision.
#
#   Example:
#      count = 10, start = 0s, end = 100s, time-precison = s
#      100 values will be generated at [0s, 10s, 20s, ..., 90s]
#
# time-interval: Go duration string (eg 90s, 1h30m)
#   Specifies the delta between generated timestamps.
#
#   If the delta results in fewer than "count" intervals for the
#   given time range, the number of values will be reduced.
#
#   Example:
#      count = 100, start = 0s, end = 100s, time-interval = 10s
#      10 values will be generated at [0s, 10s, 20s, ..., 90s]
#
#   If the delta results in greater than "count" intervals for the
#   given time range, the start-time will be adjusted to ensure "count" values.
#
#   Example:
#      count = 20, start = 0s, end = 1000s, time-interval = 10s
#      20 values will be generated at [800s, 810s, ..., 900s, ..., 990s]
#
# source: int, float, boolean, string, array or object
#
#   A literal int, float, boolean or string will produce
#   a constant value of the same data type.
#
#   A literal array of homogeneous values will generate a repeating
#   sequence.
#
#   An object defines more complex generators. The type key determines the
#   type of generator.
#
# source types:
#
# type: "rand<float>"
#   generate random float values
#       seed: seed to random number generator (default: 0)
#       min:  minimum value (default: 0.0)
#       max:  maximum value (default: 1.0)
#
# type: "zipf<integer>"
#   generate random integer values using a Zipf distribution
#   The generator generates values k ∈ [0, imax] such that P(k)
#   is proportional to (v + k) ** (-s). Requirements: s > 1 and v ≥ 1.
#   See https://golang.org/pkg/math/rand/#NewZipf for more information.
#
#       seed: seed to random number generator (default: 0)
#       s:    float > 1 (required)
#       v:    float ≥ 1 (required)
#       imax: integer (required)
#
fields = [
    # Example constant float
    { name = "system", count = 5000, source = 2.5 },

    # Example random floats
    { name = "user",   count = 5000, source = { type = "rand<float>", seed = 10, min = 0.0, max = 1.0 } },
]

# Multiple measurements may be defined.
[[measurements]]
name = "mem"
tags = [
    { name = "host",   source = { type = "sequence", format = "host-%s", start = 0, count = 5 } },
    { name = "region", source = ["us-west-01","us-west-02","us-east"] },
]
fields = [
    # An example of a sequence of integer values
    { name = "free",    count = 100, source = [10,15,20,25,30,35,30], time-precision = "ms" },
    { name = "low_mem", count = 100, source = [false,true,true], time-precision = "ms" },
]
```
{{% /truncate %}}
