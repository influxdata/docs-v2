---
title: JSON v2 input data format
description: Use the JSON v2 input data format to parse [JSON][json] objects, or an array of objects, into Telegraf metric fields.
menu:
  telegraf_1_20:
    name: JSON v2 input
    weight: 70
    parent: Input data formats
draft: true
---

The JSON v2 input data format parses a [JSON][json] object or an array of objects into Telegraf metric fields.
This parser takes valid JSON input and turns it into metrics.

The query syntax supported is [GJSON Path Syntax](https://github.com/tidwall/gjson/blob/v1.7.5/SYNTAX.md),
Use to [this playground](https://gjson.dev/) to test out your GJSON path.

You can find multiple examples [here](https://github.com/influxdata/telegraf/tree/master/plugins/parsers/json_v2/testdata) in the Telegraf repository.

<!--
is this still true?
{{% note %}}
All JSON numbers are converted to float fields.  JSON String are
ignored unless specified in the `tag_key` or `json_string_fields` options.
{{% /note %}}
 -->

## Configuration

Configure this parser by describing the metric you want by defining the fields and tags from the input.
The configuration is divided into config sub-tables called `field`, `tag`, and `object`.
In the example below you can see all the possible configuration keys you can define for each config table.
In the sections that follow these configuration keys are defined in more detail.

```toml
 [[inputs.file]]
    urls = []
    data_format = "json_v2"

    [[inputs.file.json_v2]]
        measurement_name = "" # A string that will become the new measurement name
        measurement_name_path = "" # A string with valid GJSON path syntax, will override measurement_name
        timestamp_path = "" # A string with valid GJSON path syntax to a valid timestamp (single value)
        timestamp_format = "" # A string with a valid timestamp format (see below for possible values)
        timestamp_timezone = "" # A string with with a valid timezone (see below for possible values)

        [[inputs.file.json_v2.field]]
            path = "" # A string with valid GJSON path syntax
            rename = "new name" # A string with a new name for the tag key
            type = "int" # A string specifying the type (int,uint,float,string,bool)

        [[inputs.file.json_v2.tag]]
            path = "" # A string with valid GJSON path syntax
            rename = "new name" # A string with a new name for the tag key

        [[inputs.file.json_v2.object]]
            path = "" # A string with valid GJSON path syntax
            timestamp_key = "" # A JSON key (for a nested key, prepend the parent keys with underscores) to a valid timestamp
            timestamp_format = "" # A string with a valid timestamp format (see below for possible values)
            timestamp_timezone = "" # A string with with a valid timezone (see below for possible values)
            disable_prepend_keys = false (or true, just not both)
            included_keys = [] # List of JSON keys (for a nested key, prepend the parent keys with underscores) that should be only included in result
            excluded_keys = [] # List of JSON keys (for a nested key, prepend the parent keys with underscores) that shouldn't be included in result
            tags = [] # List of JSON keys (for a nested key, prepend the parent keys with underscores) to be a tag instead of a field
            [inputs.file.json_v2.object.renames] # A map of JSON keys (for a nested key, prepend the parent keys with underscores) with a new name for the tag key
                key = "new name"
            [inputs.file.json_v2.object.fields] # A map of JSON keys (for a nested key, prepend the parent keys with underscores) with a type (int,uint,float,string,bool)
                key = "int"
```

### Root configuration options

* **measurement_name (OPTIONAL)**:  Will set the measurement name to the provided string.
* **measurement_name_path (OPTIONAL)**: You can define a query with [GJSON Path Syntax](https://github.com/tidwall/gjson/blob/v1.7.5/SYNTAX.md) to set a measurement name from the JSON input.
  The query must return a single data value or it will use the default measurement name.
  This takes precedence over `measurement_name`.
* **timestamp_path (OPTIONAL)**: You can define a query with [GJSON Path Syntax](https://github.com/tidwall/gjson/blob/v1.7.5/SYNTAX.md) to set a timestamp from the JSON input.
  The query must return a single data value or it will default to the current time.
* **timestamp_format (OPTIONAL, but REQUIRED when timestamp_query is defined**: Must be set to `unix`, `unix_ms`, `unix_us`, `unix_ns`, or
  the Go "reference time" which is defined to be the specific time:
  `Mon Jan 2 15:04:05 MST 2006`
* **timestamp_timezone (OPTIONAL, but REQUIRES timestamp_query**: This option should be set to a
  [Unix TZ value](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones),
  such as `America/New_York`, to `Local` to utilize the system timezone, or to `UTC`.
  Defaults to `UTC`

## Arrays and Objects

The following describes the high-level approach when parsing arrays and objects:

- **Array**: Every element in an array is treated as a *separate* metric
- **Object**: Every key-value in a object is treated as a *single* metric

When handling nested arrays and objects, the rules above continue to apply as the parser creates metrics.
When an object has multiple arrays as values,
the arrays will become separate metrics containing only non-array values from the object.
Below you can see an example of this behavior,
with an input JSON containing an array of book objects that has a nested array of characters.

**Example JSON:**

```json
{
    "book": {
        "title": "The Lord Of The Rings",
        "chapters": [
            "A Long-expected Party",
            "The Shadow of the Past"
        ],
        "author": "Tolkien",
        "characters": [
            {
                "name": "Bilbo",
                "species": "hobbit"
            },
            {
                "name": "Frodo",
                "species": "hobbit"
            }
        ],
        "random": [
            1,
            2
        ]
    }
}

```

**Example configuration:**

```toml
[[inputs.file]]
    files = ["./testdata/multiple_arrays_in_object/input.json"]
    data_format = "json_v2"
    [[inputs.file.json_v2]]
        [[inputs.file.json_v2.object]]
            path = "book"
            tags = ["title"]
            disable_prepend_keys = true
```

**Expected metrics:**

```
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",chapters="A Long-expected Party"
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",chapters="The Shadow of the Past"
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",name="Bilbo",species="hobbit"
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",name="Frodo",species="hobbit"
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",random=1
file,title=The\ Lord\ Of\ The\ Rings author="Tolkien",random=2

```

You can find more complicated examples under the folder `testdata`.

## Types

For each field you have the option to define the types for each metric.
The following rules are in place for this configuration:

* If a type is explicitly defined, the parser will enforce this type and convert the data to the defined type if possible.
  If the type can't be converted then the parser will fail.
* If a type isn't defined, the parser will use the default type defined in the JSON (int, float, string)

The type values you can set:

* `int`, bool, floats or strings (with valid numbers) can be converted to a int.
* `uint`, bool, floats or strings (with valid numbers) can be converted to a uint.
* `string`, any data can be formatted as a string.
* `float`, string values (with valid numbers) or integers can be converted to a float.
* `bool`, the string values "true" or "false" (regardless of capitalization) or the integer values `0` or `1`  can be turned to a bool.

[json]:         https://www.json.org/
