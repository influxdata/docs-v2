
Use struct functions to create Arrow structs in SQL queries.

- [named_struct](#named_struct)
- [row](#row)
- [struct](#struct)

## named_struct

Returns an _Arrow struct_ using the specified name and input expressions pairs.

```sql
named_struct(expression1_name, expression1_input[, ..., expression_n_name, expression_n_input])
```

### Arguments

- **expression_n_name**: Name of the column field. Must be a constant string.
- **expression_n_input**: Expression to include in the output struct.
  Can be a constant, column, or function, and any combination of arithmetic or
  string operators.

{{< expand-wrapper >}}
{{% expand "View `named_struct` query example" %}}

_The following example uses the
{{% influxdb3/home-sample-link %}}._

```sql
SELECT
  named_struct('time', time, 'temperature', temp, 'humidity', hum) AS named_struct
FROM
  home
WHERE
  room = 'Kitchen'
LIMIT 4
```

| named_struct                                                   |
| :------------------------------------------------------------- |
| {time: 2022-01-01T13:00:00, temperature: 22.8, humidity: 36.5} |
| {time: 2022-01-01T12:00:00, temperature: 22.5, humidity: 36.0} |
| {time: 2022-01-01T15:00:00, temperature: 22.7, humidity: 36.2} |
| {time: 2022-01-01T18:00:00, temperature: 23.3, humidity: 36.9} |

{{% /expand %}}
{{< /expand-wrapper >}}

## row

_Alias of [struct](#struct)._

## struct

Returns an _Arrow struct_ using the specified input expressions optionally named.
Fields in the returned struct use the optional name or the `cN` naming convention.
For example: `c0`, `c1`, `c2`, etc.

```sql
struct(expression1[, ..., expression_n])
```

### Arguments

- **expression1, expression_n**: Expression to include in the output struct.
  Can be a constant, column, or function, any combination of arithmetic or
  string operators.

### Aliases

- row

{{< expand-wrapper >}}
{{% expand "View `struct` query example" %}}

_The following example uses the
{{% influxdb3/home-sample-link %}}._

```sql
SELECT
  named_struct('time', time, 'temperature', temp, 'humidity', hum) AS named_struct
FROM
  home
WHERE
  room = 'Kitchen'
LIMIT 4
```

| named_struct                                  |
| :-------------------------------------------- |
| {c0: 2022-01-01T13:00:00, c1: 22.8, c2: 36.5} |
| {c0: 2022-01-01T12:00:00, c1: 22.5, c2: 36.0} |
| {c0: 2022-01-01T15:00:00, c1: 22.7, c2: 36.2} |
| {c0: 2022-01-01T18:00:00, c1: 23.3, c2: 36.9} |

{{% /expand %}}
{{% expand "View `struct` query example with named fields" %}}

Use the `AS` operator in a `struct` expression argument to assign a name to the
struct field.

_The following example uses the
{{% influxdb3/home-sample-link %}}._

```sql
SELECT
  named_struct(time AS 'time', temp AS 'temperature', hum) AS named_struct
FROM
  home
WHERE
  room = 'Kitchen'
LIMIT 4
```

| named_struct                                             |
| :------------------------------------------------------- |
| {time: 2022-01-01T13:00:00, temperature: 22.8, c2: 36.5} |
| {time: 2022-01-01T12:00:00, temperature: 22.5, c2: 36.0} |
| {time: 2022-01-01T15:00:00, temperature: 22.7, c2: 36.2} |
| {time: 2022-01-01T18:00:00, temperature: 23.3, c2: 36.9} |

{{% /expand %}}
{{< /expand-wrapper >}}
