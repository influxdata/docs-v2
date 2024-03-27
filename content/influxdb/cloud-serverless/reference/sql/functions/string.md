---
title: SQL string functions
list_title: String functions
description: >
  Use string functions to operate on string values in SQL queries.
menu:
  influxdb_cloud_serverless:
    name: String
    parent: sql-functions    
weight: 307
---

The InfluxDB SQL implementation supports the following string functions for
operating on string values:

- [ascii](#ascii)
- [bit_length](#bit_length)
- [btrim](#btrim)
- [char_length](#char_length)
- [character_length](#character_length)
- [concat](#concat)
- [concat_ws](#concat_ws)
- [chr](#chr)
- [ends_with](#ends_with)
- [find_in_set](#find_in_set)
- [initcap](#initcap)
- [instr](#instr)
- [left](#left)
- [length](#length)
- [levenshtein](#levenshtein)
- [lower](#lower)
- [lpad](#lpad)
- [ltrim](#ltrim)
- [md5](#md5)
- [octet_length](#octet_length)
- [overlay](#overlay)
- [position](#position)
- [repeat](#repeat)
- [replace](#replace)
- [reverse](#reverse)
- [right](#right)
- [rpad](#rpad)
- [rtrim](#rtrim)
- [split_part](#split_part)
- [starts_with](#starts_with)
- [strpos](#strpos)
- [substr](#substr)
- [substr_index](#substr_index)
- [to_hex](#to_hex)
- [translate](#translate)
- [trim](#trim)
- [upper](#upper)
- [uuid](#uuid)

## ascii

Returns the ASCII value of the first character in a string.

{{% note %}}
`ascii` returns a 32-bit integer.
To use with InfluxDB, [cast the return value to 64-bit integer](/influxdb/cloud-serverless/query-data/sql/cast-types/#cast-to-an-integer).
{{% /note %}}

```sql
ascii(str)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

##### Related functions

[chr](#chr)

{{< expand-wrapper >}}
{{% expand "View `ascii` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  ascii(room)::BIGINT AS ascii
FROM home
```

| room        | ascii |
| :---------- | ----: |
| Kitchen     |    75 |
| Living Room |    76 |

{{% /expand %}}
{{< /expand-wrapper >}}

## bit_length

Returns the bit length of a string.

{{% note %}}
`bit_length` returns a 32-bit integer.
To use with InfluxDB, [cast the return value to 64-bit integer](/influxdb/cloud-serverless/query-data/sql/cast-types/#cast-to-an-integer).
{{% /note %}}

```sql
bit_length(str)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

##### Related functions

[length](#length), [octet_length](#octet_length)

{{< expand-wrapper >}}
{{% expand "View `bit_length` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  bit_length(room)::BIGINT AS bit_length
FROM home
```

| room        | bit_length |
| :---------- | ---------: |
| Living Room |         88 |
| Kitchen     |         56 |

{{% /expand %}}
{{< /expand-wrapper >}}

## btrim

Trims the specified trim string from the start and end of a string.
If no trim string is provided, all whitespace is removed from the start and end
of the input string.

```sql
btrim(str[, trim_str])
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **trim_str**: String expression to trim from the beginning and end of the input string.
  Can be a constant, column, or function, and any combination of arithmetic operators.
  _Default is whitespace characters_.

##### Related functions

[ltrim](#ltrim),
[rtrim](#rtrim),
[trim](#trim)

{{< expand-wrapper >}}
{{% expand "View `btrim` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  btrim(room::STRING, ' Room') AS btrim
FROM home
```

| room        | btrim   |
| :---------- | :------ |
| Living Room | Living  |
| Kitchen     | Kitchen |

{{% /expand %}}
{{< /expand-wrapper >}}

## char_length

_Alias of [length](#length)._

## character_length

_Alias of [length](#length)._

## concat

Concatenates multiple strings together.

```sql
concat(str[, ..., str_n])
```

##### Arguments

- **str**: String expression to concatenate.
  Can be a constant, column, or function, and any combination of string operators.
- **str_n**: Subsequent string expression to concatenate.

##### Related functions

[contcat_ws](#contcat_ws)

{{< expand-wrapper >}}
{{% expand "View `concat` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT
  concat('At ', time::STRING, ', the ', room, ' was ', temp::STRING, '°C.') AS concat
FROM home
LIMIT 3
```

{{% influxdb/custom-timestamps %}}

| concat                                          |
| :---------------------------------------------- |
| At 2022-01-01T08:00:00, the Kitchen was 21.0°C. |
| At 2022-01-01T09:00:00, the Kitchen was 23.0°C. |
| At 2022-01-01T10:00:00, the Kitchen was 22.7°C. |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## concat_ws

Concatenates multiple strings together with a specified separator.

```sql
concat_ws(separator, str[, ..., str_n])
```

##### Arguments

- **separator**: Separator to insert between concatenated strings.
- **str**: String expression to concatenate.
  Can be a constant, column, or function, and any combination of string operators.
- **str_n**: Subsequent string expression to concatenate.
  Can be a constant, column, or function, and any combination of string operators.

##### Related functions

[concat](#concat)

{{< expand-wrapper >}}
{{% expand "View `concat_ws` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT
  concat_ws(' -- ', time::STRING, room, temp::STRING) AS concat_ws
FROM home
LIMIT 3
```

{{% influxdb/custom-timestamps %}}

| concat_ws                                  |
| :----------------------------------------- |
| 2022-01-01T08:00:00 \-\- Kitchen \-\- 21.0 |
| 2022-01-01T09:00:00 \-\- Kitchen \-\- 23.0 |
| 2022-01-01T10:00:00 \-\- Kitchen \-\- 22.7 |

{{% /influxdb/custom-timestamps %}}

{{% /expand %}}
{{< /expand-wrapper >}}

## chr

Returns the character with the specified ASCII or Unicode code value.

```
chr(expression)
```

#### Arguments

- **expression**: Expression containing the ASCII or Unicode code value to operate on.
  Can be a constant, column, or function, and any combination of arithmetic or
  string operators.

##### Related functions

[ascii](#ascii)

{{< expand-wrapper >}}
{{% expand "View `chr` query example" %}}

```sql
SELECT
  ascii,
  chr(ascii) AS chr
FROM
  (values (112),
          (75),
          (214)
  ) data(ascii)
```

| ascii | chr |
| :---- | :-: |
| 112   |  p  |
| 75    |  K  |
| 214   |  Ö  |

{{% /expand %}}
{{< /expand-wrapper >}}

## ends_with

Tests if a string ends with a substring.

```sql
ends_with(str, substr)
```

##### Arguments

- **str**: String expression to test.
  Can be a constant, column, or function, and any combination of string operators.
- **substr**: Substring to test for.

{{< expand-wrapper >}}
{{% expand "View `ends_with` query example" %}}

```sql
SELECT
  string,
  ends_with(string, 'USA') AS ends_with
FROM
  (values ('New York, USA'),
          ('London, UK'),
          ('San Francisco, USA')
  ) data(string)
```

| string             | ends_with |
| :----------------- | :-------- |
| New York, USA      | true      |
| London, UK         | false     |
| San Francisco, USA | true      |

{{% /expand %}}
{{< /expand-wrapper >}}

## find_in_set

Returns the position of a string in a comma-delimited list of substrings.
Returns 0 if the string is not in the list of substrings.

```sql
find_in_set(str, strlist)
```

##### Arguments

- **str**: String expression to find in `strlist`.
- **strlist**: A string containing a comma-delimited list of substrings.

{{< expand-wrapper >}}
{{% expand "View `find_in_set` query example" %}}

```sql
SELECT
  string,
  find_in_set(string, 'Isaac,John,Sara') AS find_in_set
FROM
  (values ('John'),
          ('Sarah'),
          ('Isaac')
  ) data(string)
```

| string | find_in_set |
| :----- | ----------: |
| John   | 2           |
| Sarah  | 0           |
| Isaac  | 1           |

{{% /expand %}}
{{< /expand-wrapper >}}

## initcap

Capitalizes the first character in each word in the input string.
Words are delimited by non-alphanumeric characters.

```sql
initcap(str)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

##### Related functions

[lower](#lower),
[upper](#upper)

{{< expand-wrapper >}}
{{% expand "View `initcap` query example" %}}

```sql
SELECT
  string,
  initcap(string) AS initcap
FROM
  (values ('hello world'),
          ('hello-world'),
          ('hello_world')
  ) data(string)
```

| string      | initcap     |
| :---------- | :---------- |
| hello world | Hello World |
| hello-world | Hello-World |
| hello_world | Hello_World |

{{% /expand %}}
{{< /expand-wrapper >}}

## instr

Returns the location where a substring first appears in a string (starting at 1).
If the substring is not in the string, the function returns 0.

```sql
instr(str, substr)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **substr**: Substring expression to search for.
  Can be a constant, column, or function, and any combination of string operators.

{{< expand-wrapper >}}
{{% expand "View `instr` query example" %}}

```sql
SELECT
  string,
  instr(string, 'neighbor') AS instr
FROM
  (values ('good neighbor'),
          ('bad neighbor'),
          ('next-door neighbor'),
          ('friend')
  ) data(string)
```

| string             | instr |
| :----------------- | ----: |
| good neighbor      | 6     |
| bad neighbor       | 5     |
| next-door neighbor | 11    |
| friend             | 0     |

{{% /expand %}}
{{< /expand-wrapper >}}

## left

Returns a specified number of characters from the left side of a string.

```sql
left(str, n)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **n**: Number of characters to return.

##### Related functions

[right](#right)

{{< expand-wrapper >}}
{{% expand "View `left` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  left(room::STRING, 3) AS left
FROM home
```

| room        | left |
| :---------- | :--- |
| Kitchen     | Kit  |
| Living Room | Liv  |

{{% /expand %}}
{{< /expand-wrapper >}}

## length

Returns the number of characters in a string.

{{% note %}}
`char_length` returns a 32-bit integer.
To use with InfluxDB, [cast the return value to 64-bit integer](/influxdb/cloud-serverless/query-data/sql/cast-types/#cast-to-an-integer).
{{% /note %}}

```sql
length(str)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

##### Aliases

- char\_length
- character\_length

##### Related functions

[bit_length](#bit_length),
[octet_length](#octet_length)

{{< expand-wrapper >}}
{{% expand "View `length` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  length(room)::BIGINT AS length
FROM home
```

| room        | length |
| :---------- | -----: |
| Kitchen     |      7 |
| Living Room |     11 |

{{% /expand %}}
{{< /expand-wrapper >}}

## levenshtein

Returns the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance)
between two strings.

```sql
levenshtein(str1, str2)
```

##### Arguments
- **str1**: First string expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **str2**: Second string expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

{{< expand-wrapper >}}
{{% expand "View `levenshtein` query example" %}}

```sql
SELECT
  string1,
  string2,
  levenshtein(string1, string2) AS levenshtein
FROM
  (values ('kitten', 'sitting'),
          ('puppy', 'jumping'),
          ('cow', 'lowing')
  ) data(string1, string2)
```

| string1 | string2 | levenshtein |
| :------ | :------ | ----------: |
| kitten  | sitting |           3 |
| puppy   | jumping |           5 |
| cow     | lowing  |           4 |

{{% /expand %}}
{{< /expand-wrapper >}}

## lower

Converts a string to lower-case.

```sql
lower(str)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

##### Related functions

[initcap](#initcap),
[upper](#upper)

{{< expand-wrapper >}}
{{% expand "View `lower` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  lower(room::STRING) AS lower
FROM home
```

| room        | lower       |
| :---------- | :---------- |
| Kitchen     | kitchen     |
| Living Room | living room |

{{% /expand %}}
{{< /expand-wrapper >}}

## lpad

Pads the left side of a string with another string to a specified string length.

```sql
lpad(str, n[, padding_str])
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **n**: String length to pad to.
- **padding_str**: String expression to pad with.
  Can be a constant, column, or function, and any combination of string operators.
  _Default is a space._

##### Related functions

[rpad](#rpad)

{{< expand-wrapper >}}
{{% expand "View `lpad` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  lpad(room::STRING, 14, '-') AS lpad
FROM home
```

| room        | lpad                  |
| :---------- | :-------------------- |
| Kitchen     | \-\-\-\-\-\-\-Kitchen |
| Living Room | \-\-\-Living Room     |

{{% /expand %}}
{{< /expand-wrapper >}}

## ltrim

Removes leading spaces from a string.

```sql
ltrim(str)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

##### Related functions

[btrim](#btrim),
[rtrim](#rtrim),
[trim](#trim)

{{< expand-wrapper >}}
{{% expand "View `ltrim` query example" %}}

```sql
SELECT
  string,
  ltrim(string) AS ltrim
FROM
  (values ('  Leading spaces'),
          ('Trailing spaces  '),
          ('  Leading and trailing spaces  ')
  ) data(string)
```

| string                                  | ltrim                                   |
| :-------------------------------------- | :-------------------------------------- |
| &nbsp;&nbsp;Leading spaces              | Leading spaces                          |
| Trailing spaces&nbsp;&nbsp;             | Trailing spaces&nbsp;&nbsp;             |
| Leading and trailing spaces&nbsp;&nbsp; | Leading and trailing spaces&nbsp;&nbsp; |

{{% /expand %}}
{{< /expand-wrapper >}}

## md5

Computes an MD5 128-bit checksum for a string expression.

```sql
md5(str)
```

##### Arguments

- **expression**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

{{< expand-wrapper >}}
{{% expand "View `md5` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  md5(room) AS md5
FROM home
```

| room        | md5                              |
| :---------- | :------------------------------- |
| Kitchen     | 33fa00a66f2edf0d1c5697a9f8693ba8 |
| Living Room | f45b0e6aec165544faccaf2cad820542 |

{{% /expand %}}
{{< /expand-wrapper >}}

## octet_length

Returns the length of a string in bytes.

{{% note %}}
`length` returns a 32-bit integer.
To use with InfluxDB, [cast the return value to 64-bit integer](/influxdb/cloud-serverless/query-data/sql/cast-types/#cast-to-an-integer).
{{% /note %}}

```sql
octet_length(str)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

##### Related functions

[bit_length](#bit_length),
[length](#length)

{{< expand-wrapper >}}
{{% expand "View `octet_length` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  octet_length(room)::BIGINT AS octet_length
FROM home
```

| room        | octet_length |
| :---------- | -----------: |
| Living Room |           11 |
| Kitchen     |            7 |

{{% /expand %}}
{{< /expand-wrapper >}}

## overlay

Replaces part of a string with another substring using a specified starting
position and number of characters to replace.

```sql
overlay(str PLACING substr FROM pos [FOR count])
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **substr**: Substring to use to replace part of the specified string (`str`).
  Can be a constant, column, or function, and any combination of string operators.
- **pos**: Start position of the substring replacement (`substr`).
- **count**: Number of characters in the string (`str`) to replace with the 
  substring (`substr`) beginning from the start position (`pos`).
  If not specified, the function uses the length of the substring.

{{< expand-wrapper >}}
{{% expand "View `overlay` query example" %}}

```sql
SELECT
  string,
  overlay(string PLACING '****' FROM 1 FOR 12) AS overlay
FROM
  (values ('2223000048410010'),
          ('2222420000001113'),
          ('4917484589897107')
  ) data(string)
```

| string           | overlay  |
| :--------------- | :------- |
| 2223000048410010 | ****0010 |
| 2222420000001113 | ****1113 |
| 4917484589897107 | ****7107 |

{{% /expand %}}
{{< /expand-wrapper >}}

## position

Returns the position of a substring in a string.

```sql
position(substr IN str)
```

##### Arguments

- **substr**: Substring expression to search for.
  Can be a constant, column, or function, and any combination of string operators.
- **str**: String expression to search.
  Can be a constant, column, or function, and any combination of string operators.

{{< expand-wrapper >}}
{{% expand "View `position` query example" %}}

```sql
SELECT
  string,
  position('oo' IN string) AS position
FROM
  (values ('cool'),
          ('scoop'),
          ('ice cream')
  ) data(string)
```

| string    | position |
| :-------- | -------: |
| cool      |        2 |
| scoop     |        3 |
| ice cream |        0 |

{{% /expand %}}
{{< /expand-wrapper >}}

## repeat

Returns a string with an input string repeated a specified number of times.

```sql
repeat(str, n)
```

##### Arguments

- **str**: String expression to repeat.
  Can be a constant, column, or function, and any combination of string operators.
- **n**: Number of times to repeat the input string.

{{< expand-wrapper >}}
{{% expand "View `repeat` query example" %}}

```sql
SELECT
  string,
  repeat(string, 3) AS repeat
FROM
  (values ('foo '),
          ('bar '),
          ('baz ')
  ) data(string)
```

| string    | repeat      |
| :-------- | :---------- |
| foo&nbsp; | foo foo foo |
| bar&nbsp; | bar bar bar |
| baz&nbsp; | baz baz baz |

{{% /expand %}}
{{< /expand-wrapper >}}

## replace

Replaces all occurrences of a specified substring in a string with a new substring.

```sql
replace(str, substr, replacement)
```

##### Arguments

- **str**: String expression to repeat.
  Can be a constant, column, or function, and any combination of string operators.
- **substr**: Substring expression to replace in the input string.
  Can be a constant, column, or function, and any combination of string operators.
- **replacement**: Replacement substring expression.
  Can be a constant, column, or function, and any combination of string operators.

{{< expand-wrapper >}}
{{% expand "View `replace` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  replace(room::STRING, ' ', '_') AS replace
FROM home
```

| room        | replace     |
| :---------- | :---------- |
| Kitchen     | Kitchen     |
| Living Room | Living_Room |

{{% /expand %}}
{{< /expand-wrapper >}}

## reverse

Reverses the character order of a string.

```sql
reverse(str)
```

##### Arguments

- **str**: String expression to repeat.
  Can be a constant, column, or function, and any combination of string operators.

{{< expand-wrapper >}}
{{% expand "View `reverse` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  reverse(room::STRING) AS reverse
FROM home
```

| room        | reverse     |
| :---------- | :---------- |
| Kitchen     | nehctiK     |
| Living Room | mooR gniviL |

{{% /expand %}}
{{< /expand-wrapper >}}

## right

Returns a specified number of characters from the right side of a string.

```sql
right(str, n)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **n**: Number of characters to return.

##### Related functions

[left](#left)

{{< expand-wrapper >}}
{{% expand "View `right` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  right(room::STRING, 3) AS right
FROM home
```

| room        | right |
| :---------- | :---- |
| Living Room | oom   |
| Kitchen     | hen   |

{{% /expand %}}
{{< /expand-wrapper >}}

## rpad

Pads the right side of a string with another string to a specified string length.

```sql
rpad(str, n[, padding_str])
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **n**: String length to pad to.
- **padding_str**: String expression to pad with.
  Can be a constant, column, or function, and any combination of string operators.
  _Default is a space._

##### Related functions

[lpad](#lpad)

{{< expand-wrapper >}}
{{% expand "View `rpad` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  rpad(room::STRING, 14, '-') AS rpad
FROM home
```

| room        | rpad                  |
| :---------- | :-------------------- |
| Kitchen     | Kitchen\-\-\-\-\-\-\- |
| Living Room | Living Room\-\-\-     |

{{% /expand %}}
{{< /expand-wrapper >}}

## rtrim

Removes trailing spaces from a string.

```sql
rtrim(str)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

##### Related functions

[btrim](#btrim),
[ltrim](#ltrim),
[trim](#trim)

{{< expand-wrapper >}}
{{% expand "View `rtrim` query example" %}}

```sql
SELECT
  string,
  rtrim(string) AS rtrim
FROM
  (values ('  Leading spaces'),
          ('Trailing spaces  '),
          ('  Leading and trailing spaces  ')
  ) data(string)
```

| string                                  | rtrim                                   |
| :-------------------------------------- | :-------------------------------------- |
| &nbsp;&nbsp;Leading spaces              | &nbsp;&nbsp;Leading spaces              |
| Trailing spaces&nbsp;&nbsp;             | Trailing spaces                         |
| Leading and trailing spaces&nbsp;&nbsp; | &nbsp;&nbsp;Leading and trailing spaces |

{{% /expand %}}
{{< /expand-wrapper >}}

## split_part

Splits a string based on a specified delimiter and returns the substring in the
specified position.

```sql
split_part(str, delimiter, pos)
```

##### Arguments

- **str**: String expression to spit.
  Can be a constant, column, or function, and any combination of string operators.
- **delimiter**: String or character to split on.
- **pos**: Position of the part to return.

{{< expand-wrapper >}}
{{% expand "View `split_part` query example" %}}

```sql
SELECT
  url,
  split_part(url, '.', 1) AS split_part
FROM
  (values ('www.influxdata.com'),
          ('docs.influxdata.com'),
          ('community.influxdata.com')
  ) data(url)
```

| url                      | split_part |
| :----------------------- | :--------- |
| www.influxdata.com       | www        |
| docs.influxdata.com      | docs       |
| community.influxdata.com | community  |

{{% /expand %}}
{{< /expand-wrapper >}}

## starts_with

Tests if a string starts with a substring.

```sql
starts_with(str, substr)
```

##### Arguments

- **str**: String expression to test.
  Can be a constant, column, or function, and any combination of string operators.
- **substr**: Substring to test for.

{{< expand-wrapper >}}
{{% expand "View `starts_with` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  starts_with(room::STRING, 'Kit') AS starts_with
FROM home
```

| room        | starts_with |
| :---------- | :---------- |
| Kitchen     | true        |
| Living Room | false       |

{{% /expand %}}
{{< /expand-wrapper >}}

## strpos

Returns the starting position of a specified substring in a string.
Positions begin at 1.
If the substring does not exist in the string, the function returns 0.

{{% note %}}
`strpos` returns a 32-bit integer.
To use with InfluxDB, [cast the return value to 64-bit integer](/influxdb/cloud-serverless/query-data/sql/cast-types/#cast-to-an-integer).
{{% /note %}}

```sql
strpos(str, substr)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **substr**: Substring expression to search for.
  Can be a constant, column, or function, and any combination of string operators.

{{< expand-wrapper >}}
{{% expand "View `strpos` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  strpos(room::STRING, 'Room')::BIGINT AS strpos
FROM home
```

| room        | strpos |
| :---------- | -----: |
| Kitchen     |      0 |
| Living Room |      8 |

{{% /expand %}}
{{< /expand-wrapper >}}

## substr

Extracts a substring of a specified number of characters from a specific
starting position in a string.

```sql
substr(str, start_pos[, length])
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **start_pos**: Character position to start the substring at.
  The first character in the string has a position of 1.
- **length**: Number of characters to extract.
  If not specified, returns the rest of the string after the start position.

{{< expand-wrapper >}}
{{% expand "View `substr` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  substr(room::STRING, 3, 5) AS substr
FROM home
```

| room        | substr     |
| :---------- | :--------- |
| Living Room | ving&nbsp; |
| Kitchen     | tchen      |

{{% /expand %}}
{{< /expand-wrapper >}}

## substr_index

Returns the substring that occurs before or after the specified number (`count`)
of delimiter (`delimiter`) occurrences in a string (`str`).
If the count is positive, the function returns everything to the left of the
final delimiter (counting from the left).
If the count is negative, the function returns everything to the right of the
final delimiter (counting from the right).

```sql
substr_index(str, delimiter, count)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **delimiter**: String expression to use to delimit substrings in the string (`str`).
  Can be a constant, column, or function, and any combination of string operators.
- **count**: The Nth occurrence of the delimiter (`delimiter`) to split on.
  Can be a constant, column, or function, and any combination of arithmetic operators.
  Supports positive and negative numbers.

{{< expand-wrapper >}}
{{% expand "View `substr_index` query example" %}}

```sql
SELECT
  url,
  substr_index(url, '.', 1) AS subdomain,
  substr_index(url, '.', -1) AS tld
FROM
  (values ('docs.influxdata.com'),
          ('community.influxdata.com'),
          ('cloud2.influxdata.com')
  ) data(url)
```

| url                      | subdomain | tld |
| :----------------------- | :-------- | :-- |
| docs.influxdata.com      | docs      | com |
| community.influxdata.com | community | com |
| arrow.apache.org         | arrow     | org |

{{% /expand %}}
{{< /expand-wrapper >}}

## translate

Translates characters in a string to specified translation characters.

```sql
translate(str, chars, translation)
```

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.
- **chars**: Characters to translate.
- **translation**: Translation characters. Translation characters replace only
  characters at the same position in the **chars** string.

{{< expand-wrapper >}}
{{% expand "View `translate` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  translate(room::STRING, 'Rom', 'sOn') AS translate
FROM home
```

| room        | translate   |
| :---------- | :---------- |
| Living Room | Living sOOn |
| Kitchen     | Kitchen     |

{{% /expand %}}
{{< /expand-wrapper >}}

## to_hex

Converts an integer to a hexadecimal string.

```sql
to_hex(int)
```

##### Arguments

- **int**: Integer expression to convert.
  Can be a constant, column, or function, and any combination of arithmetic operators.

{{< expand-wrapper >}}
{{% expand "View `to_hex` query example" %}}

```sql
SELECT
  int,
  to_hex(int) AS to_hex
FROM
  (values (123),
          (345),
          (678)
  ) data(int)
```

| int | to_hex |
| :-- | -----: |
| 123 |     7b |
| 345 |    159 |
| 678 |    2a6 |

{{% /expand %}}
{{< /expand-wrapper >}}

## trim

Removes leading and trailing spaces from a string.

```sql
trim(str)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

##### Related functions

[btrim](#btrim),
[ltrim](#ltrim),
[rtrim](#rtrim)

{{< expand-wrapper >}}
{{% expand "View `trim` query example" %}}

```sql
SELECT
  string,
  trim(string) AS trim
FROM
  (values ('  Leading spaces'),
          ('Trailing spaces  '),
          ('  Leading and trailing spaces  ')
  ) data(string)
```

| string                                  | trim                        |
| :-------------------------------------- | :-------------------------- |
| &nbsp;&nbsp;Leading spaces              | Leading spaces              |
| Trailing spaces&nbsp;&nbsp;             | Trailing spaces             |
| Leading and trailing spaces&nbsp;&nbsp; | Leading and trailing spaces |

{{% /expand %}}
{{< /expand-wrapper >}}

## upper

Converts a string to upper-case.

```sql
upper(str)
```

##### Arguments

- **str**: String expression to operate on.
  Can be a constant, column, or function, and any combination of string operators.

##### Related functions

[initcap](#initcap),
[lower](#lower)

{{< expand-wrapper >}}
{{% expand "View `upper` query example" %}}

_The following example uses the sample data set provided in
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT DISTINCT
  room,
  upper(room::STRING) AS upper
FROM home
```

| room        | upper       |
| :---------- | :---------- |
| Living Room | LIVING ROOM |
| Kitchen     | KITCHEN     |

{{% /expand %}}
{{< /expand-wrapper >}}

## uuid

Returns a UUID v4 string value that is unique per row.

```sql
uuid()
```

{{< expand-wrapper >}}
{{% expand "View `uuid` query example" %}}

_The following example uses the sample data set provided in the
[Get started with InfluxDB tutorial](/influxdb/cloud-serverless/get-started/write/#construct-line-protocol)._

```sql
SELECT
  room,
  uuid() AS uuid
FROM (SELECT DISTINCT room FROM home)
```

| room        |                 uuid                 |
| :---------- | :----------------------------------: |
| Kitchen     | f0b41da9-e334-4b7d-b925-a54ca6b082f3 |
| Living Room | c31be90e-c4ed-4304-b633-47b969ef3ab6 |

{{% /expand %}}
{{< /expand-wrapper >}}
