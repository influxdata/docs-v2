---
title: Other SQL operators
list_title: Other operators
description: >
  SQL supports other miscellaneous operators that perform various operations.
menu:
  influxdb_cloud_dedicated:
    name: Other operators
    parent: Operators
weight: 305
list_code_example: |
  | Operator | Meaning              | Example                 | Result        |
  | :------: | :------------------- | :---------------------- | :------------ |
  |  `\|\|`  | Concatenate strings  | `'Hello' \|\| ' world'` | `Hello world` |
---

SQL supports miscellaneous operators that perform various operations.

| Operator | Meaning             |                                             |
| :------: | :------------------ | :------------------------------------------ |
|  `\|\|`  | Concatenate strings | [{{< icon "link" >}}](#concatenate-strings) |

## || {#concatenate-strings}

The `||` operator concatenates two string operands into a single string.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'Hello' || ' world' AS "Concatenated"
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Concatenated |
| :----------- |
| Hello world  |

{{% /flex-content %}}
{{< /flex >}}
