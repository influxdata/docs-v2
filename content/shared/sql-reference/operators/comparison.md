Comparison operators evaluate the relationship between the left and right
operands and returns `true` or `false`.


|        Operator        | Meaning                                                  |                                                         |
| :--------------------: | :------------------------------------------------------- | :------------------------------------------------------ |
|          `=`           | Equal to                                                 | [{{< icon "link" >}}](#equal-to)                        |
|          `<>`          | Not equal to                                             | [{{< icon "link" >}}](#not-equal-to)                    |
|          `!=`          | Not equal to                                             | [{{< icon "link" >}}](#not-equal-to)                    |
|          `>`           | Greater than                                             | [{{< icon "link" >}}](#greater-than)                    |
|          `>=`          | Greater than or equal to                                 | [{{< icon "link" >}}](#greater-than-or-equal)           |
|          `<`           | Less than                                                | [{{< icon "link" >}}](#less-than)                       |
|          `<=`          | Less than or equal to                                    | [{{< icon "link" >}}](#less-than-or-equal)              |
|   `IS DISTINCT FROM`   | Is distinct from                                         | [{{< icon "link" >}}](#is-distinct-from)                |
| `IS NOT DISTINCT FROM` | Is not distinct from                                     | [{{< icon "link" >}}](#is-not-distinct-from)            |
|          `~`           | Matches a regular expression                             | [{{< icon "link" >}}](#regexp-match)                    |
|          `~*`          | Matches a regular expression _(case-insensitive)_        | [{{< icon "link" >}}](#regexp-match-case-insensitive)   |
|          `!~`          | Does not match a regular expression                      | [{{< icon "link" >}}](#regexp-nomatch)                  |
|         `!~*`          | Does not match a regular expression _(case-insensitive)_ | [{{< icon "link" >}}](#regexp-nomatch-case-insensitive) |

<!-- |         `<=>`          | Three-way comparison _(alias of `IS NOT DISTINCT FROM`)_ | [{{< icon "link" >}}](#three-way-comparison)            | -->

## = {#equal-to .monospace}

The `=` operator compares the left and right operands and, if equal, returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 123 = 123
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(123) = Int64(123) |
| :---------------------- |
| true                    |

{{% /flex-content %}}
{{< /flex >}}

## !=, <> {#not-equal-to .monospace}

The `!=` and `<>` operators compare the left and right operands and, if not equal,
returns `true`. Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 123 != 456
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(123) != Int64(456) |
| :----------------------- |
| true                     |

{{% /flex-content %}}
{{< /flex >}}

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 123 <> 456
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(123) != Int64(456) |
| :----------------------- |
| true                     |

{{% /flex-content %}}
{{< /flex >}}

## > {#greater-than .monospace}

The `>` operator compares the left and right operands and, if the left operand
is greater than the right operand, returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 3 > 2
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(3) > Int64(2) |
| :------------------ |
| true                |

{{% /flex-content %}}
{{< /flex >}}

## >= {#greater-than-or-equal .monospace}

The `>=` operator compares the left and right operands and, if the left operand
is greater than or equal to the right operand, returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 3 >= 2
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(3) >= Int64(2) |
| :------------------- |
| true                 |

{{% /flex-content %}}
{{< /flex >}}

## < {#less-than .monospace}

The `<` operator compares the left and right operands and, if the left operand
is less than the right operand, returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 1 < 2
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int641(1) < Int64(2) |
| :------------------- |
| true                 |

{{% /flex-content %}}
{{< /flex >}}

## <= {#less-than-or-equal .monospace}

The `<=` operator compares the left and right operands and, if the left operand
is less than or equal to the right operand, returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 1 <= 2
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int641(1) <= Int64(2) |
| :-------------------- |
| true                  |

{{% /flex-content %}}
{{< /flex >}}

## IS DISTINCT FROM {.monospace}

The `IS DISTINCT FROM` operator is a _NULL_-safe operator that returns
`true` if both operands are not equal; otherwise, it returns `false`.
This operator guarantees the result of a comparison is `true` or `false` and not
an empty set.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 0 IS DISTINCT FROM NULL
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(0) IS DISTINCT FROM NULL |
| :----------------------------- |
| true                           |

{{% /flex-content %}}
{{< /flex >}}

## IS NOT DISTINCT FROM {.monospace}

The `IS NOT DISTINCT FROM` operator is a _NULL_-safe operator that returns
`true` if both operands are equal or _NULL_; otherwise, it returns `false`.
This operator negates [`IS DISTINCT FROM`](#is-distinct-from).

<!--
##### Aliases

- [`<=>`](#three-way-comparison)
-->

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT NULL IS NOT DISTINCT FROM NULL
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| NULL IS NOT DISTINCT FROM NULL |
| :----------------------------- |
| true                           |

{{% /flex-content %}}
{{< /flex >}}

<!-- IS NOT SUPPORTED YET
## <=> {#three-way-comparison .monospace}

The `<=>` operator is a _NULL_-safe operator that returns `true` if both
operands are equal or _NULL_; otherwise, it returns `false`.
This operator is an alias for [`IS NOT DISTINCT FROM`](#is-not-distinct-from).

{{< expand-wrapper >}}
{{% expand "View `<=>` operator examples" %}}

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT NULL <=> NULL
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| NULL IS NOT DISTINCT FROM NULL |
| :----------------------------- |
| true                           |

{{% /flex-content %}}
{{< /flex >}}

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 1 <=> NULL
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(1) IS NOT DISTINCT FROM NULL |
| :--------------------------------- |
| false                              |

{{% /flex-content %}}
{{< /flex >}}

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 1 <=> 2
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(1) IS NOT DISTINCT FROM Int64(2) |
| :------------------------------------- |
| false                                  |

{{% /flex-content %}}
{{< /flex >}}

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 1 <=> 1
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Int64(1) IS NOT DISTINCT FROM Int64(1) |
| :------------------------------------- |
| true                                   |

{{% /flex-content %}}
{{< /flex >}}

{{% /expand %}}
{{< /expand-wrapper >}}
-->

## ~ {#regexp-match .monospace}

The `~` operator compares the left string operand to the right regular expression
operand and, if it matches (case-sensitive), returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'abc' ~ 'a.*'
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Utf8("abc") ~ Utf8("a.*") |
| :------------------------ |
| true                      |

{{% /flex-content %}}
{{< /flex >}}

## ~* {#regexp-match-case-insensitive .monospace}

The `~*` operator compares the left string operand to the right regular expression
operand and, if it matches (case-insensitive), returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'Abc' ~* 'A.*'
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Utf8("Abc") ~* Utf8("A.*") |
| :------------------------- |
| true                       |

{{% /flex-content %}}
{{< /flex >}}

## !~ {#regexp-nomatch .monospace}

The `!~` operator compares the left string operand to the right regular expression
operand and, if it does not match (case-sensitive), returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'abc' !~ 'd.*'
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Utf8("abc") !~ Utf8("d.*") |
| :------------------------- |
| true                       |

{{% /flex-content %}}
{{< /flex >}}

## !~* {#regexp-nomatch-case-insensitive .monospace}

The `!~*` operator compares the left string operand to the right regular expression
operand and, if it does not match (case-insensitive), returns `true`.
Otherwise returns `false`.

{{< flex >}}
{{% flex-content "two-thirds operator-example" %}}

```sql
SELECT 'Abc' !~* 'a.*'
```

{{% /flex-content %}}
{{% flex-content "third operator-example" %}}

| Utf8("Abc") !~* Utf8("a.*") |
| :-------------------------- |
| false                       |

{{% /flex-content %}}
{{< /flex >}}
