---
title: SQL comparison operators
list_title: Comparison operators
description: >
  Comparison operators evaluate the relationship between the left and right
  operands and return `true` or `false`.
menu:
  influxdb3_enterprise:
    name: Comparison operators
    parent: Operators
weight: 302
list_code_example: |
  |        Operator        | Meaning                                                  | Example                    |
  | :--------------------: | :------------------------------------------------------- | :------------------------- |
  |          `=`           | Equal to                                                 | `123 = 123`                |
  |          `<>`          | Not equal to                                             | `123 <> 456`               |
  |          `!=`          | Not equal to                                             | `123 != 456`               |
  |          `>`           | Greater than                                             | `3 > 2`                    |
  |          `>=`          | Greater than or equal to                                 | `3 >= 2`                   |
  |          `<`           | Less than                                                | `1 < 2`                    |
  |          `<=`          | Less than or equal to                                    | `1 <= 2`                   |
  |   `IS DISTINCT FROM`   | Is distinct from                                         | `0 IS DISTINCT FROM 1`     |
  | `IS NOT DISTINCT FROM` | Is not distinct from                                     | `0 IS NOT DISTINCT FROM 1` |
  |          `~`           | Matches a regular expression                             | `'abc' ~ 'a.*'`            |
  |          `~*`          | Matches a regular expression _(case-insensitive)_        | `'Abc' ~* 'A.*'`           |
  |          `!~`          | Does not match a regular expression                      | `'abc' !~ 'd.*'`           |
  |         `!~*`          | Does not match a regular expression _(case-insensitive)_ | `'Abc' !~* 'a.*'`          |

source: /shared/sql-reference/operators/comparison.md
---

<!-- 
The content of this page is at /content/shared/sql-reference/operators/comparison.md
-->
