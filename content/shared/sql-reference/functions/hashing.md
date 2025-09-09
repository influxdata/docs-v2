
Use hashing functions to hash string values in SQL queries using established
hashing algorithms.

- [digest](#digest)
- [md5](#md5)
- [sha224](#sha224)
- [sha256](#sha256)
- [sha384](#sha384)
- [sha512](#sha512)

## digest

Computes the binary hash of an expression using the specified algorithm.

```sql
digest(expression, algorithm)
```

### Arguments

- **expression**: String expression to operate on.
  Can be a constant, column, or function, and any combination of operators.
- **algorithm**: String expression specifying algorithm to use.
  Must be one of the following:
  
  - md5
  - sha224
  - sha256
  - sha384
  - sha512
  - blake2s
  - blake2b
  - blake3

{{< expand-wrapper >}}
{{% expand "View `digest` query example" %}}

_The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT DISTINCT
  location,
  digest(location, 'sha256') AS location_digest
FROM weather
```

| location      | location_digest                                                  |
| :------------ | :--------------------------------------------------------------- |
| Concord       | 21e60acfb20fca2e38c5e51191d44235949de045912dca77e978333c1ec965a2 |
| Hayward       | 5d5b651a71084f3117cca3381ff7102efbc318c2026e1d09d5d4707354883102 |
| San Francisco | 5aa34886f7f3741de8460690b636f4c8b7c2044df88e2e8adbb4f7e6f8534931 |

{{% /expand %}}
{{< /expand-wrapper >}}

## md5

Computes an MD5 128-bit checksum for a string expression.

```sql
md5(expression)
```

### Arguments

- **expression**: String expression to operate on.
  Can be a constant, column, or function, and any combination of operators.

{{< expand-wrapper >}}
{{% expand "View `md5` query example" %}}

_The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT DISTINCT
  location,
  md5(location) AS location_md5
FROM weather
```

| location      | location_md5                     |
| :------------ | :------------------------------- |
| Concord       | 7c6a8e5769c20331e6a1b93a44021dbc |
| Hayward       | 5823ccc25b256955c4e97cb4a23865ee |
| San Francisco | f4334fdfa1c728eae375fe781e2e2d9d |

{{% /expand %}}
{{< /expand-wrapper >}}

## sha224

Computes the SHA-224 hash of a binary string.

```sql
sha224(expression)
```

### Arguments

- **expression**: String expression to operate on.
  Can be a constant, column, or function, and any combination of operators.

{{< expand-wrapper >}}
{{% expand "View `sha224` query example" %}}

_The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT DISTINCT
  location,
  sha224(location) AS location_sha224
FROM weather
```

| location      | location_sha224                                          |
| :------------ | :------------------------------------------------------- |
| Concord       | 3f6c0456de97d3d752672161db8e6f0df115979460a2276d64386114 |
| Hayward       | 767cfab6a1562e54f6906c8b5c9ee64583caa3f4b6c37a4298a7639f |
| San Francisco | f723898f95bd53cdaf9c057b6f2cf0537b29e0bff077dabb39059b76 |

{{% /expand %}}
{{< /expand-wrapper >}}

## sha256

Computes the SHA-256 hash of a binary string.

```sql
sha256(expression)
```

### Arguments

- **expression**: String expression to operate on.
  Can be a constant, column, or function, and any combination of operators.

{{< expand-wrapper >}}
{{% expand "View `sha256` query example" %}}

_The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT DISTINCT
  location,
  sha256(location) AS location_sha256
FROM weather
```

| location      | location_sha256                                                  |
| :------------ | :--------------------------------------------------------------- |
| Concord       | 21e60acfb20fca2e38c5e51191d44235949de045912dca77e978333c1ec965a2 |
| Hayward       | 5d5b651a71084f3117cca3381ff7102efbc318c2026e1d09d5d4707354883102 |
| San Francisco | 5aa34886f7f3741de8460690b636f4c8b7c2044df88e2e8adbb4f7e6f8534931 |

{{% /expand %}}
{{< /expand-wrapper >}}

## sha384

Computes the SHA-384 hash of a binary string.

```sql
sha384(expression)
```

### Arguments

- **expression**: String expression to operate on.
  Can be a constant, column, or function, and any combination of operators.

{{< expand-wrapper >}}
{{% expand "View `sha384` query example" %}}

_The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT DISTINCT
  location,
  sha384(location) AS location_sha384
FROM weather
```

| location      | location_sha384                                                                                  |
| :------------ | :----------------------------------------------------------------------------------------------- |
| Concord       | 19bf5ba95a6c4a28d2a997fa4e03e542d24b111593395b587a3b357af50cc687364f27b4e96935c234e2ae69236c7883 |
| Hayward       | 8b034ee0f7c8d191e145002722bf296a7f310f455458b9ffdbafcb2da2e2300d0f1e7868c6b1d512c81ae0c055979abd |
| San Francisco | 15c0c4a0e80f198e922235ee30a5c2b1e288c88f61bfc55ef9723903a0e948a7de04b65aa35b4ba46251b90460bab625 |

{{% /expand %}}
{{< /expand-wrapper >}}

## sha512

Computes the SHA-512 hash of a binary string.

```sql
sha512(expression)
```

### Arguments

- **expression**: String expression to operate on.
  Can be a constant, column, or function, and any combination of operators.

{{< expand-wrapper >}}
{{% expand "View `sha512` query example" %}}

_The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT DISTINCT
  location,
  sha512(location) AS location_sha512
FROM weather
```

| location      | location_sha512                                                                                                                  |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------- |
| Concord       | 227e28fd661eebb39b10f49728d17b03e3a1f0cc2d2a413a9f124292d77249a2c0d7cf99941fd3d2eabea1b2894698bbd12c2cf3a7137ec67fca221ee57e0ca7 |
| Hayward       | 2db79fba2fc2888f9826d95ce6bb2605d95b841da61f049e8a92467de0d6ec3161f3919275208a3c385f6412d7848bfc957e81cde550f4f28cd834a332381142 |
| San Francisco | 4c84f24d166978fb59d77779bf9a54ac112cba8e5f826c50440b2d3063fa0cbb0e2ccd30c93261a0f96805f71d15c3e726c9e00426161880e6a5dad267b2d883 |

{{% /expand %}}
{{< /expand-wrapper >}}
