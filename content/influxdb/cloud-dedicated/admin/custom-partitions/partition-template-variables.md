---
title: Partition templates
description: >
  ...
menu:
  influxdb_cloud_dedicated:
    parent: Manage data partitioning
weight: 202
---

Use partition template variables to determine the time intervals used to partition
data stored in a given database.

<!-- NOTES FROM SOURCE CODE -->
- The number of parts in a partition template is limited to 8 and is validated at creation time.
- `time` is a reserved keyword and cannot be used in partition templates
- Each template part is limited to 200 bytes in length. Anything longer will be
  truncated at 200 bytes and appeneded with `#`.

### Reserved Characters

Reserved characters that are percent encoded (in addition to non-ASCII
characters), and their meaning:

- `|` - partition key part delimiter
- `!` - NULL/missing partition key part
- `^` - empty string partition key part
- `#` - key part truncation marker
- `%` - required for unambiguous reversal of percent encoding
<!-- END NOTES -->

## Time part templates

The InfluxDB time variables are based on
[Rust strftime date and time formatting syntax.](https://docs.rs/chrono/latest/chrono/format/strftime/index.html).

{{% note %}}
The content in this document is adapted from the
[Rust strftime source code](https://docs.rs/chrono/latest/src/chrono/format/strftime.rs.html).
{{% /note %}}

- [Date specifiers](#date-specifiers)
- [Time specifiers](#time-specifiers)
- [Time zone specifiers](#time-zone-specifiers)
- [Date and time specifiers](#date-and-time-specifiers)
- [Special specifiers](#special-specifiers)

## Date specifiers

| Variable | Example                            | Description                                                                                                                                                                         |
| :------: | :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `%Y`   | `2001`                             | The full proleptic Gregorian year, zero-padded to 4 digits. chrono supports years from -262144 to 262143. Note: years before 1 BCE or after 9999 CE, require an initial sign (+/-). |
|   `%C`   | `20`                               | The proleptic Gregorian year divided by 100, zero-padded to 2 digits. [^1]                                                                                                          |
|   `%y`   | `01`                               | The proleptic Gregorian year modulo 100, zero-padded to 2 digits. [^1]                                                                                                              |
|   `%m`   | `07`                               | Month number (01--12), zero-padded to 2 digits.                                                                                                                                     |
|   `%b`   | `Jul`                              | Abbreviated month name. Always 3 letters.                                                                                                                                           |
|   `%B`   | `July`                             | Full month name. Also accepts corresponding abbreviation in parsing.                                                                                                                |
|   `%h`   | `Jul`                              | Same as `%b`.                                                                                                                                                                       |
|   `%d`   | `08`                               | Day number (01--31), zero-padded to 2 digits.                                                                                                                                       |
|   `%e`   | ` 8`                               | Same as `%d` but space-padded. Same as `%_d`.                                                                                                                                       |
|   `%a`   | `Sun`                              | Abbreviated weekday name. Always 3 letters.                                                                                                                                         |
|   `%A`   | `Sunday`                           | Full weekday name. Also accepts corresponding abbreviation in parsing.                                                                                                              |
|   `%w`   | `0`                                | Sunday = 0, Monday = 1, ..., Saturday = 6.                                                                                                                                          |
|   `%u`   | `7`                                | Monday = 1, Tuesday = 2, ..., Sunday = 7. (ISO 8601)                                                                                                                                |
|   `%U`   | `28`                               | Week number starting with Sunday (00--53), zero-padded to 2 digits. [^2]                                                                                                            |
|   `%W`   | `27`                               | Same as `%U`, but week 1 starts with the first Monday in that year instead.                                                                                                         |
|   `%G`   | `2001`                             | Same as `%Y` but uses the year number in ISO 8601 week date. [^3]                                                                                                                   |
|   `%g`   | `01`                               | Same as `%y` but uses the year number in ISO 8601 week date. [^3]                                                                                                                   |
|   `%V`   | `27`                               | Same as `%U` but uses the week number in ISO 8601 week date (01--53). [^3]                                                                                                          |
|   `%j`   | `189`                              | Day of the year (001--366), zero-padded to 3 digits.                                                                                                                                |
|   `%D`   | `07/08/01`                         | Month-day-year format. Same as `%m/%d/%y`.                                                                                                                                          |
|   `%x`   | `07/08/01`                         | Locale's date representation (e.g., 12/31/99).                                                                                                                                      |
|   `%F`   | `2001-07-08`                       | Year-month-day format (ISO 8601). Same as `%Y-%m-%d`.                                                                                                                               |
|   `%v`   | ` 8-Jul-2001`                      | Day-month-year format. Same as `%e-%b-%Y`.                                                                                                                                          |

## Time specifiers

| Variable | Example                            | Description                                                                                                              |
| :------: | :--------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
|   `%H`   | `00`                               | Hour number (00--23), zero-padded to 2 digits.                                                                           |
|   `%k`   | ` 0`                               | Same as `%H` but space-padded. Same as `%_H`.                                                                            |
|   `%I`   | `12`                               | Hour number in 12-hour clocks (01--12), zero-padded to 2 digits.                                                         |
|   `%l`   | `12`                               | Same as `%I` but space-padded. Same as `%_I`.                                                                            |
|   `%P`   | `am`                               | `am` or `pm` in 12-hour clocks.                                                                                          |
|   `%p`   | `AM`                               | `AM` or `PM` in 12-hour clocks.                                                                                          |
|   `%M`   | `34`                               | Minute number (00--59), zero-padded to 2 digits.                                                                         |
|   `%S`   | `60`                               | Second number (00--60), zero-padded to 2 digits. [^4]                                                                    |
|   `%f`   | `26490000`                         | Number of nanoseconds since last whole second. [^7]                                                                      |
|  `%.f`   | `.026490`                          | Decimal fraction of a second. Consumes the leading dot. [^7]                                                             |
|  `%.3f`  | `.026`                             | Decimal fraction of a second with a fixed length of 3.                                                                   |
|  `%.6f`  | `.026490`                          | Decimal fraction of a second with a fixed length of 6.                                                                   |
|  `%.9f`  | `.026490000`                       | Decimal fraction of a second with a fixed length of 9.                                                                   |
|  `%3f`   | `026`                              | Decimal fraction of a second like `%.3f` but without the leading dot.                                                    |
|  `%6f`   | `026490`                           | Decimal fraction of a second like `%.6f` but without the leading dot.                                                    |
|  `%9f`   | `026490000`                        | Decimal fraction of a second like `%.9f` but without the leading dot.                                                    |
|   `%R`   | `00:34`                            | Hour-minute format. Same as `%H:%M`.                                                                                     |
|   `%T`   | `00:34:60`                         | Hour-minute-second format. Same as `%H:%M:%S`.                                                                           |
|   `%X`   | `00:34:60`                         | Locale's time representation (e.g., 23:13:48).                                                                           |
|   `%r`   | `12:34:60 AM`                      | Locale's 12 hour clock time. (e.g., 11:11:04 PM). Falls back to `%X` if the locale does not have a 12 hour clock format. |

## Time zone specifiers

| Variable | Example                            | Description                                                                                                        |
| :------: | :--------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
|   `%Z`   | `ACST`                             | Local time zone name. Skips all non-whitespace characters during parsing. Identical to `%:z` when formatting. [^8] |
|   `%z`   | `+0930`                            | Offset from the local time to UTC (with UTC being `+0000`).                                                        |
|  `%:z`   | `+09:30`                           | Same as `%z` but with a colon.                                                                                     |
|  `%::z`  | `+09:30:00`                        | Offset from the local time to UTC with seconds.                                                                    |
| `%:::z`  | `+09`                              | Offset from the local time to UTC without minutes.                                                                 |
|  `%#z`   | `+09`                              | *Parsing only:* Same as `%z` but allows minutes to be missing or present.                                          |

## Date and time specifiers

| Variable | Example                            | Description                                                            |
| :------: | :--------------------------------- | :--------------------------------------------------------------------- |
|   `%c`   | `Sun Jul  8 00:34:60 2001`         | Locale's date and time (e.g., Thu Mar  3 23:05:25 2005).               |
|   `%+`   | `2001-07-08T00:34:60.026490+09:30` | ISO 8601 / RFC 3339 date & time format. [^5]                           |
|   `%s`   | `994518299`                        | UNIX timestamp, the number of seconds since 1970-01-01 00:00 UTC. [^6] |

## Special specifiers

| Variable | Example | Description             |
| :------: | :------ | :---------------------- |
|   `%t`   |         | Literal tab (`\t`).     |
|   `%n`   |         | Literal newline (`\n`). |
|   `%%`   |         | Literal percent sign.   |

It is possible to override the default padding behavior of numeric specifiers `%?`.
This is not allowed for other specifiers and will result in the `BAD_FORMAT` error.

Modifier | Description
-------- | -----------
`%-?`    | Suppresses any padding including spaces and zeroes. (e.g. `%j` = `012`, `%-j` = `12`)
`%_?`    | Uses spaces as a padding. (e.g. `%j` = `012`, `%_j` = ` 12`)
`%0?`    | Uses zeroes as a padding. (e.g. `%e` = ` 9`, `%0e` = `09`)

Notes:

[^1]: `%C`, `%y`:
   This is floor division, so 100 BCE (year number -99) will print `-1` and `99` respectively.
[^2]: `%U`:
   Week 1 starts with the first Sunday in that year.
   It is possible to have week 0 for days before the first Sunday.

[^3]: `%G`, `%g`, `%V`:
   Week 1 is the first week with at least 4 days in that year.
   Week 0 does not exist, so this should be used with `%G` or `%g`.

[^4]: `%S`:
   It accounts for leap seconds, so `60` is possible.

[^5]: `%+`: Same as `%Y-%m-%dT%H:%M:%S%.f%:z`, i.e. 0, 3, 6 or 9 fractional
   digits for seconds and colons in the time zone offset.
   <br>
   <br>
   This format also supports having a `Z` or `UTC` in place of `%:z`. They
   are equivalent to `+00:00`.
   <br>
   <br>
   Note that all `T`, `Z`, and `UTC` are parsed case-insensitively.
   <br>
   <br>
   The typical `strftime` implementations have different (and locale-dependent)
   formats for this specifier. While Chrono's format for `%+` is far more
   stable, it is best to avoid this specifier if you want to control the exact
   output.

[^6]: `%s`:
   This is not padded and can be negative.
   For the purpose of Chrono, it only accounts for non-leap seconds
   so it slightly differs from ISO C `strftime` behavior.

[^7]: `%f`, `%.f`:
   <br>
   `%f` and `%.f` are notably different formatting specifiers.<br>
   `%f` counts the number of nanoseconds since the last whole second, while `%.f` is a fraction of a
   second.<br>
   Example: 7μs is formatted as `7000` with `%f`, and formatted as `.000007` with `%.f`.

[^8]: `%Z`:
   Since `chrono` is not aware of timezones beyond their offsets, this specifier
   **only prints the offset** when used for formatting. The timezone abbreviation
   will NOT be printed. See [this issue](https://github.com/chronotope/chrono/issues/960)
   for more information.
   <br>
   <br>
   Offset will not be populated from the parsed data, nor will it be validated.
   Timezone is completely ignored. Similar to the glibc `strptime` treatment of
   this format code.
   <br>
   <br>
   It is not possible to reliably convert from an abbreviation to an offset,
   for example CDT can mean either Central Daylight Time (North America) or
   China Daylight Time.
*/