
Use binary string functions to encode and decode binary string values in
SQL queries.

- [decode](#decode)
- [encode](#encode)

## decode

Decode binary data from textual representation in string.

```sql
decode(expression, format)
```

### Arguments

- **expression**: Expression containing encoded string data.
  Can be a constant, column, or function, and any combination of string operators.
- **format**: Encoding format of the encoded string. Supported formats are:
  - base64
  - hex

##### Related functions

[encode](#encode)

## encode

Encode binary data into a textual representation.

```sql
encode(expression, format)
```

### Arguments

- **expression**: Expression containing string or binary data.
  Can be a constant, column, or function, and any combination of string operators.
- **format**: Encoding format to use. Supported formats are:
  - base64
  - hex

##### Related functions

[decode](#decode)

{{< expand-wrapper >}}
{{% expand "View `encode` query example" %}}

_The following example uses the
[NOAA Bay Area weather sample data](/influxdb3/version/reference/sample-data/#noaa-bay-area-weather-data)._

```sql
SELECT DISTINCT
  location,
  encode(location::string, 'hex') AS location_encoded
FROM weather
```

| location      | location_encoded           |
| :------------ | :------------------------- |
| Concord       | 436f6e636f7264             |
| Hayward       | 48617977617264             |
| San Francisco | 53616e204672616e636973636f |

{{% /expand %}}
{{< /expand-wrapper >}}
