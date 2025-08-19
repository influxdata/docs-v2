---
title: SQL logical operators
list_title: Logical operators
description: >
  Logical operators combine or manipulate conditions in a SQL query.
menu:
  influxdb3_core:
    name: Logical operators
    parent: Operators
weight: 303
related:
  - /influxdb3/core/reference/sql/where/
  - /influxdb3/core/reference/sql/subqueries/#subquery-operators, Subquery operators
list_code_example: |
  | Operator  | Meaning                                                                    |
  | :-------: | :------------------------------------------------------------------------- |
  |   `AND`   | Returns true if both operands are true. Otherwise, returns false.          |
  | `BETWEEN` | Returns true if the left operand is within the range of the right operand. |
  | `EXISTS`  | Returns true if the results of a subquery are not empty.                   |
  |   `IN`    | Returns true if the left operand is in the right operand list.             |
  |  `LIKE`   | Returns true if the left operand matches the right operand pattern string. |
  |   `NOT`   | Negates the subsequent expression.                                         |
  |   `OR`    | Returns true if any operand is true. Otherwise, returns false.             |

source: /shared/sql-reference/operators/logical.md
---

<!-- 
The content of this page is at /content/shared/sql-reference/operators/logical.md
-->
