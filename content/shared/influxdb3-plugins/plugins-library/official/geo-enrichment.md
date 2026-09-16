<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
> **Note:** This plugin requires {{% product-name %}}.8.2 or later (uses the synchronous write API).


The Geo Enrichment Plugin turns coordinates carried by incoming points into
location attributes you can group by — a country and city, a zone or site you
defined yourself, or a cell of a global grid. By default they merge back into
the **same rows the coordinates came from**, so no join is needed to use them;
naming a target table or database collects them separately instead.

- **Four resolution strategies**: offline place lookup, point-in-polygon against
  your own zones, nearest site from your own list, and grid cells (H3, geohash
  or S2). Zones and sites come from GeoJSON or CSV, whichever you have
- **Reads coordinates in many shapes**: separate `lat`/`lon` columns as numbers
  or strings, integer-scaled tracker output, a single combined column
  (`"55.75,37.61"`, WKT, GeoJSON), or an existing geohash/H3 index
- **In-place or into a target table**: attributes written as fields merge into
  the existing row; written as tags they need a separate table
- **HTTP backfill**: apply enrichment to history, retry only the rows that
  failed, or re-resolve everything after correcting a reference file
- **Caches what it resolves**: a coordinate is resolved once and reused for
  every later point that rounds to the same key

## How enrichment lands on the row

A row's identity in {{% product-name %}} is its **full tag set plus its timestamp**. That
single fact decides where the plugin can write.

Attributes written as **fields** leave the tag set untouched, so the write has
the same identity as the original point and the columns merge into it:

```
gps,device=A lat=55.7558,lon=37.6173,speed=60   T     ← your client
gps,device=A geo_country="RU",geo_city="Moscow" T     ← the plugin

SELECT * FROM gps
→ device=A  lat=55.7558  lon=37.6173  speed=60  geo_country=RU  geo_city=Moscow
```
Attributes written as **tags** change the identity, producing a *second* row, so
`output_mode=tag` requires `target_measurement` and the plugin rejects a
configuration that would write tags back into the source table.

| `output_mode` | destination   | result                                     |
|---------------|---------------|--------------------------------------------|
| `field`       | source table  | merges into the existing row               |
| `field`       | other table   | full row copied, geo added as fields       |
| `tag`         | other table   | full row copied, geo added as tags         |
| `tag`         | source table  | rejected — would duplicate every row       |

Merging holds regardless of write order, survives compaction, and is not undone
if your client re-sends the raw point later: each column keeps its last non-null
value.

### The echo batch

In-place mode writes into the very table the trigger watches, so the plugin's
own write comes back as a second invocation. Rows that already carry every
configured output column are skipped, which ends the loop after that one extra
pass. Expect roughly **twice the trigger invocations and twice the write volume**
on an enriched table; where ingest headroom is tight, use `target_measurement`
instead.

## Configuration

### Plugin metadata

The plugin includes a JSON metadata schema in its docstring for
[InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/)
integration, defining `onwrite_args_config` and `http_body_config`.

### Core parameters

| Parameter             | Type   | Default      | Description                                                                              |
|-----------------------|--------|--------------|------------------------------------------------------------------------------------------|
| `source_measurements` | string | *required*   | Space-separated tables to enrich. Other tables in the batch are ignored.                 |
| `output_columns`      | string | *required*   | Space-separated `attribute:column` pairs, e.g. `country_code:geo_country city:geo_city`. |
| `output_mode`         | string | `field`      | `field` or `tag`. `tag` requires `target_measurement`.                                   |
| `target_measurement`  | string | *(empty)*    | Destination table. Empty enriches the source table in place.                             |
| `target_database`     | string | *(empty)*    | Destination database. Defaults to the trigger's database.                                |
| `unknown_value`       | string | `UNKNOWN`    | Written when a coordinate cannot be resolved.                                            |

In [TOML](#toml-configuration), `source_measurements` also takes a native array
and `output_columns` a native table.

Every configured column is always written; unresolved attributes get
`unknown_value`.

#### Column types

Attributes are written as **strings**, including numbers such as `population`
and any numeric GeoJSON property. Booleans are rendered as JSON, `true` /
`false`. The one exception is `distance_m`, at every rank a float, which reports
`-1` when nothing resolved.

A numeric attribute therefore cannot be compared or aggregated as a number:
`geo_pop > 1000000` compares text, and `'9' > '10381222'`. Cast it in the query,
excluding the unresolved rows:

```sql
SELECT * FROM gps WHERE CAST(geo_pop AS BIGINT) > 1000000
  AND geo_pop != 'UNKNOWN'
```
### Coordinate input

Configure exactly one input mode. Columns may be tags or fields.

| Parameter       | Type   | Default   | Description                                                          |
|-----------------|--------|-----------|----------------------------------------------------------------------|
| `lat_field`     | string | `lat`     | Latitude column, number or string.                                   |
| `lon_field`     | string | `lon`     | Longitude column, number or string.                                  |
| `coord_scale`   | number | `1`       | Positive divisor turning scaled integers back into degrees.          |
| `point_field`   | string | *(empty)* | Single column holding both coordinates, instead of the pair above.   |
| `point_format`  | string | `lat_lon` | `lat_lon`, `lon_lat`, `wkt` (`POINT(lon lat)`) or `geojson`.         |
| `geohash_field` | string | *(empty)* | Geohash column, decoded to the cell center.                          |
| `h3_field`      | string | *(empty)* | H3 index column, decoded to the cell center.                         |

Rows without usable coordinates are skipped. Coordinates outside
[-90, 90] / [-180, 180] are counted and written as `unknown_value`.

#### Scaled integer coordinates

Many trackers report degrees multiplied by a fixed power of ten to avoid
sending decimals, so `55.7558` arrives as `557558000`. `coord_scale` is the
number both coordinates are divided by:

| `lat`       | `lon`       | `coord_scale`  | Resolved as      |
|-------------|-------------|----------------|------------------|
| `557558000` | `376184000` | `1e7`          | 55.7558, 37.6184 |
| `55755800`  | `37618400`  | `1e6`          | 55.7558, 37.6184 |
| `55.7558`   | `37.6184`   | `1` (default)  | 55.7558, 37.6184 |

Pick the divisor that turns your raw number back into degrees: count the digits
the device shifted. Write it plainly (`10000000`) or in scientific notation
(`1e7`) — both are read as the same number. Any positive value is accepted,
including fractions; zero and negatives are rejected when the trigger loads.

The division happens after the coordinates are read, so it applies to every
input mode, including `point_field`, `geohash_field` and `h3_field`. Those
already decode to degrees, so scaling them is almost always a mistake — leave
`coord_scale` at `1` unless the column truly holds scaled integers.

### Caching

| Parameter           | Type | Default  | Description                                                                 |
|---------------------|------|----------|-----------------------------------------------------------------------------|
| `quantize_decimals` | int  | `4`      | Decimal places a coordinate is rounded to before it becomes a key. `0`–`9`. |
| `cache_size`        | int  | `100000` | Distinct rounded coordinates kept before LRU eviction. `1` or more.         |

Resolving a coordinate costs far more than a dictionary lookup, and most
coordinates repeat: a fixed sensor reports the same position thousands of times
a day. Raw floats never repeat exactly — GPS noise moves the last digits — so
the coordinate is rounded first and everything that rounds alike shares one
result.

| `quantize_decimals` | grid     | effect                                                    |
|---------------------|----------|-----------------------------------------------------------|
| 3                   | ≈ 111 m  | very high hit rate, unusable near zone boundaries         |
| **4**               | ≈ 11 m   | default — GPS-noise sized, a stationary asset always hits |
| 5                   | ≈ 1.1 m  | near-exact, few hits from a moving asset                  |
| 6                   | ≈ 0.11 m | effectively no rounding                                   |

The cost is a boundary error: a point within roughly that distance of a polygon
edge may take a neighbor's answer. At the default the window is smaller than
consumer GPS error. Raise it where exact edge behavior matters.

### HTTP body parameters

The endpoint takes its **entire configuration from the request body** and reads
no trigger arguments, so the same request behaves identically whichever trigger
serves it. Every parameter above may be given in the body under the same name,
plus the backfill-only fields here.

`source_measurements` keeps its name but backfills one table per call: give
several and the first is used, the rest are ignored with a warning. A field set
to `null` counts as absent. If the trigger was created with arguments, they are
ignored and a warning is logged.

| Parameter       | Type   | Default   | Description                                                                                         |
|-----------------|--------|-----------|-----------------------------------------------------------------------------------------------------|
| `start` / `end` | string | *(empty)* | RFC 3339 bounds, given together. `start` inclusive, `end` exclusive. Omit both for the whole table. |
| `batch_size`    | int    | `1000`    | Rows read per page. Values below `1` are raised to `1`.                                             |
| `retry_unknown` | bool   | `false`   | Re-resolve rows whose geo column equals `unknown_value`.                                            |
| `force`         | bool   | `false`   | Re-resolve every row regardless of its current values.                                              |

`start` and `end` keep nanosecond precision. `retry_unknown` and `force` take a
JSON boolean or any of `true`/`false`, `yes`/`no`, `on`/`off`, `1`/`0` as a
string; anything else is a 400. All five may also be set in a
[TOML file](#toml-configuration), where they act as defaults the body overrides.

Use `retry_unknown` after widening `max_radius_m`, and `force` after redrawing a
zone — those rows already hold a resolved value, so `retry_unknown` would pass
over them. The reference file is re-read on every HTTP call.

### TOML configuration

| Parameter          | Type   | Default   | Description                                         |
|--------------------|--------|-----------|-----------------------------------------------------|
| `config_file_path` | string | *(empty)* | `.toml` file, relative to `PLUGIN_DIR` or absolute. |

On a write trigger its values override the trigger arguments.

In an HTTP request body it goes further: the configuration is then read from
**that file alone**, and every body field naming a plugin parameter is ignored,
so a long setup is named once instead of repeated in every backfill request.

The five backfill fields are the exception. They may be set in the file too, but
the body always wins, so the file holds the defaults and each call overrides only
what it needs — usually the window:

```json
{
  "config_file_path": "geo_enrichment_config_data_writes.toml",
  "start": "2026-08-01T00:00:00Z",
  "end": "2026-08-29T00:00:00Z",
  "force": true
}
```
```bash
--trigger-arguments 'config_file_path=geo_enrichment_config_data_writes.toml'
```
## Resolution strategies

| Parameter  | Type   | Default   | Description                                     |
|------------|--------|-----------|-------------------------------------------------|
| `strategy` | string | `builtin` | `builtin`, `polygon`, `nearest` or `grid`.      |

One strategy is active per trigger. Each answers a different question and offers
its own attributes for `output_columns`; asking for an attribute the active
strategy cannot produce is a configuration error, reported at load time with the
list of what is available.

| Strategy  | Answers                       | Reference data       | Geometry it needs      |
|-----------|-------------------------------|----------------------|------------------------|
| `builtin` | what settlement is this near? | bundled, none to set | —                      |
| `polygon` | which of my zones is this in? | `reference_file`     | Polygon, MultiPolygon  |
| `nearest` | which of my sites is this at? | `reference_file`     | Point                  |
| `grid`    | which grid cell is this in?   | none                 | —                      |

Each strategy's own parameters are listed with it below. Parameters belonging to
an inactive strategy are ignored, and no package is imported for a strategy or a
file format you do not use.

### Reference file

`polygon` and `nearest` read their zones or sites from one file. The **format**
decides how it is read, the **strategy** decides how a point is matched against
it, and the two are independent: either strategy takes either format.

| Parameter                   | Type   | Default      | Description                                                          |
|-----------------------------|--------|--------------|----------------------------------------------------------------------|
| `reference_file`            | string | *required*   | `.geojson`, `.json` or `.csv`, relative to `PLUGIN_DIR` or absolute. |
| `reference_encoding`        | string | `utf-8-sig`  | Python codec name for a CSV file. GeoJSON is always UTF-8.           |
| `reference_lat_column`      | string | *(detected)* | Latitude column of a CSV file.                                       |
| `reference_lon_column`      | string | *(detected)* | Longitude column of a CSV file.                                      |
| `reference_geometry_column` | string | *(detected)* | WKT column of a CSV file.                                            |

#### Where the geometry comes from

**GeoJSON** — a `FeatureCollection`, or a single `Feature`. Each feature's
`geometry` is the shape and its `properties` are the attributes.

**CSV** — either a column of WKT, or a pair of coordinate columns:

```csv
zone,geometry
plant-A,"POLYGON((37.5 55.7, 37.8 55.7, 37.8 55.9, 37.5 55.9, 37.5 55.7))"
```
```csv
code,lat,lon,region
KONA-01,19.64,-155.99,HI-WEST
```
Detection runs in this order, and an explicit setting always wins:

1. `reference_geometry_column`, read as WKT;
2. `reference_lat_column` / `reference_lon_column`;
3. a column named `geometry` or `wkt`, read as WKT;
4. a latitude column (`lat`, `latitude`) and a longitude column (`lon`, `lng`,
   `long`, `longitude`).

Names are matched ignoring case. Setting a geometry column *and* a coordinate
column is a configuration error — they are alternatives. When nothing matches,
the error lists the columns actually parsed, along with the delimiter used to
parse them.

Every column that did not become geometry is an attribute.

#### Reading a CSV

The delimiter is detected from the header — comma, semicolon, tab and pipe are
recognized, and a comma inside a quoted value does not confuse it. When the
delimiter is *not* a comma, a comma inside a number is unambiguous and is read
as a decimal mark, so European exports work as they are:

```csv
code;lat;lon
center;"55,7512";"37,6184"
```
The default encoding accepts UTF-8 with or without a byte-order mark, which
covers files saved by Excel. Set `reference_encoding` for anything else, such as
`cp1251`. GeoJSON is always UTF-8 by RFC 7946, so the setting does not apply to
it.

#### How attributes are named

| Format  | An attribute in `output_columns` is   |
|---------|---------------------------------------|
| GeoJSON | a **JSONPath** into `properties`      |
| CSV     | a **column name**                     |

GeoJSON properties are arbitrary JSON, so a path reaches nested values;
a CSV row is flat, so the name is the column.

```
GeoJSON: output_columns='zone:geo_zone owner.name:geo_owner owner.contact.email:geo_email'
CSV:     output_columns='zone:geo_zone owner:geo_owner'
```
In a path, `codes[0]` indexes an array, and a property whose own name contains a
dot is reached by quoting it: `"odd.name"`.

A path missing from *some* features is normal — those get `unknown_value`:

```
zones: {"zone": "plant-A", "owner": {"name": "ACME"}}
       {"zone": "plant-B"}

output_columns='zone:geo_zone owner.name:geo_owner'
→ point in A:  geo_zone=plant-A  geo_owner=ACME
→ point in B:  geo_zone=plant-B  geo_owner=UNKNOWN
```
A path missing from *every* feature is a configuration error instead, because it
is almost always a typo, and writing `UNKNOWN` forever would hide it behind a
column that merely looks empty:

```
output_columns='zone:geo_zone owner.phone:geo_phone'
→ Configuration error: output_columns attribute 'owner.phone' matches no feature.
```
Paths are resolved once when the file is indexed, so they cost nothing per row
and every mistake surfaces there rather than in your data:

```
'owner'    → resolves to a dict; only single values can be written.
             Point the path at a leaf, e.g. 'owner.<name>'.
'codes[*]' → matches 2 values in one feature; a column holds a single value.
'owner['   → is not a valid JSONPath: Parse error near the end of string!
```
#### Geometry the strategy cannot use

`polygon` needs areal geometry, `nearest` needs points. An entry of the wrong
kind is skipped with a warning, so a stray label point among fifty zones does
not stop the trigger; a file with **nothing** usable fails at startup rather
than writing `UNKNOWN` into every row.

A point is never reduced to a polygon's centroid: the centroid of a region is
not where anything is.

Coordinates are read as WGS84 degrees, longitude first in WKT and GeoJSON. Data
in a projected system is rejected as out of range rather than misread.

### `builtin` — nearest populated place, offline

Answers "what settlement is this point in?" from the GeoNames snapshot bundled
with `reverse_geocode`. No reference file to prepare — this is the zero-setup
path. Attributes: `country_code`, `country`, `state`, `city`, `population`,
`distance_m`.

| Parameter        | Type   | Default    | Description                                                             |
|------------------|--------|------------|-------------------------------------------------------------------------|
| `min_population` | int    | `0`        | Consider only places at least this populous. `0` or more.               |
| `max_radius_m`   | number | *no limit* | Meters. Points farther than this from the place are unknown. Above `0`. |

`min_population` is a zoom control — the dataset goes down to hamlets, so a
point on a city's edge resolves to a suburb:

```
(55.5800, 37.5000) outskirts of Moscow
  min_population=0       → Kommunarka        4,684
  min_population=10000   → Yasenevo        180,000
  min_population=1000000 → Moscow       10,381,222
```
The match is the nearest **city center**, not a boundary the point falls inside,
so distances of a few kilometers are normal and mean nothing is wrong. There is
no radius by default — a 1 km limit would discard roughly 8 of every 10 points
in a city and virtually everything outside one.

Set `max_radius_m` when a plausible-looking wrong answer is worse than a blank:
a point in Antarctica resolves to South Africa, 5,000 km away, and a mid-ocean
point to French Polynesia. Map `distance_m` to a column first and query it —
that shows the real spread of your own data before you pick a number.

> Raising `min_population` moves the answer farther away, so pair the two:
> `(41.6, -93.9)` in rural Iowa resolves to Waukee at `min_population=0`, but to
> **Chicago, some 500 km away**, at `min_population=1000000`.

### `polygon` — point inside a zone you drew

Answers "which of my zones is this point in?" Attributes: whatever the
[reference file](#reference-file) supplies.

| Parameter            | Type   | Default    | Description                                                                                |
|----------------------|--------|------------|--------------------------------------------------------------------------------------------|
| `overlap_policy`     | string | `smallest` | `smallest`, `largest`, `first` or `priority`. Winner when a point is inside several zones. |
| `priority_attribute` | string | *(empty)*  | Attribute ranked when `overlap_policy=priority`. Read only by that policy.                 |

Zones usually overlap because they nest — a building inside a plant inside a
region — so a point matches all three:

- `smallest` — smallest area, the most specific zone. The default, because
  nesting is the common case.
- `largest` — largest area, the most general zone. The region rather than the
  building, for rolling a detailed file up to a coarse column.
- `first` — file order. Cheapest and fully predictable when zones never overlap.
- `priority` — highest value of `priority_attribute`.

One reference file can therefore feed two triggers at different levels of detail:

```bash
--trigger-arguments 'output_columns=zone:geo_building,overlap_policy=smallest'
--trigger-arguments 'output_columns=zone:geo_region,overlap_policy=largest'
```
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "facility": "KONA-01", "region": "HI-WEST" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-156.0,19.6],[-155.9,19.6],[-155.9,19.7],[-156.0,19.7],[-156.0,19.6]]]
      }
    }
  ]
}
```
A zone crossing the antimeridian must be **split at it**, as RFC 7946 requires.
An unsplit ring runs the wrong way around the globe: it stops matching its own
interior and starts matching the opposite side of the planet. The plugin warns
at startup about any geometry spanning more than 180° of longitude.

### `nearest` — closest site from a list

Answers "which of my sites is this point at?" for anyone who has site
coordinates but no drawn boundaries. Attributes: whatever the
[reference file](#reference-file) supplies, plus `distance_m`.

| Parameter       | Type   | Default | Description                                                              |
|-----------------|--------|---------|--------------------------------------------------------------------------|
| `nearest_count` | int    | `1`     | How many closest sites to describe. `1` or more.                         |
| `max_radius_m`  | number | `1000`  | Meters. Points farther than this from every site are unknown. Above `0`. |

Matching runs on the unit sphere, so the nearest site is the true great-circle
nearest, not an artifact of longitude compression.

`max_radius_m` is what keeps "nearest" meaningful — without it every point on
Earth belongs to some site. Map `distance_m` to see how good each match was: a
truck 40 m from the depot is *at* the depot, one 900 m away merely happens to be
closest. Because it is a float column it cannot hold `unknown_value`;
unresolved rows get **`-1`**.

Raise it well past the default for assets that spend most of their time in
transit. A fleet on the highway sits tens of kilometers from every depot, so at
`1000` every row reads `UNKNOWN` and `-1` until the vehicle pulls into a yard.
There is no "no limit" keyword: pass a value larger than half the Earth's
circumference, such as `max_radius_m=20000000`.

#### More than one site per point

`nearest_count` describes the closest *N* sites instead of just the closest one.
Ranks after the first repeat every output column with a `_2`, `_3` suffix:

```bash
--trigger-arguments 'output_columns=code:geo_site distance_m:geo_dist,nearest_count=3'
```
| geo_site  | geo_dist | geo_site_2 | geo_dist_2 | geo_site_3 | geo_dist_3 |
|-----------|----------|------------|------------|------------|------------|
| `KONA-01` | `189.7`  | `WAIM-03`  | `53731.9`  | `HILO-02`  | `95515.9`  |

A suffix group describes one site completely, so map the site's name alongside
its distance — `geo_dist_2` on its own does not say what it measured. Ranks are
filtered by `max_radius_m` individually: a second site outside the radius leaves
that group unresolved while the first stays populated. Asking for more sites
than the file holds is not an error; the surplus ranks are always unresolved and
the plugin warns once at startup.

Ranks come from distance alone, so mid-route the neighbors are simply whatever
the vehicle is driving past — read them as "what is nearby", not as the route.

With `output_mode=tag` every rank becomes a tag, and the plugin warns about it.
The series key then covers the whole combination of ranks, and two nearly
equidistant sites trade places as the point moves, opening a new series on each
swap. Distances are floats and stay fields either way.

### `grid` — cell of a global grid

Answers "which cell of a fixed worldwide grid is this point in?" No reference
data. All points in a cell collapse to one value you can `GROUP BY`, which is
what makes heatmaps possible when the query engine has no geo functions of its
own. Attribute: `cell`.

| Parameter        | Type   | Default         | Description                                         |
|------------------|--------|-----------------|-----------------------------------------------------|
| `grid_type`      | string | `h3`            | `h3`, `geohash` or `s2`.                            |
| `grid_precision` | int    | `7` / `6` / `9` | Cell size. Range depends on `grid_type`, see below. |

- **`h3`** — hexagons. Every neighbor is equidistant from the center, so
  neighborhood and distance analysis behaves well. Resolutions 0–15.
- **`geohash`** — lat/lon rectangles. The identifier's prefix is a coarser cell,
  so truncating it zooms out. Cells stretch away from the equator. Lengths 1–12.
- **`s2`** — spherical quadrilaterals with even areas worldwide. Levels 0–30.

| `grid_type` | `grid_precision` | cell size                |
|-------------|------------------|--------------------------|
| `h3`        | 6                | 36.1 km², edge 3 724 m   |
| `h3`        | **7**            | 5.16 km², edge 1 406 m   |
| `h3`        | 8                | 0.74 km², edge 531 m     |
| `h3`        | 9                | 0.11 km², edge 201 m     |
| `geohash`   | 5                | 4 892 × 4 892 m          |
| `geohash`   | **6**            | 611 × 1 223 m            |
| `geohash`   | 7                | 153 × 153 m              |
| `s2`        | **9**            | 324 km², side ≈ 18 km    |
| `s2`        | 11               | 20.3 km², side ≈ 4.5 km  |
| `s2`        | 13               | 1.27 km², side ≈ 1.1 km  |

> **Precision is a cardinality control.** Each finer step multiplies the distinct
> values the column can take — the very thing this plugin otherwise exists to
> contain. Stay at or above the defaults unless you have measured the effect.

## Software Requirements

- **{{% product-name %}}**: 3.8.2 or later, with the Processing Engine enabled
- **Python packages**: `influxdata-plugin-utils>=0.4.0`, plus the packages for
  the strategies you use

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled:

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. Install the packages:

   ```bash
   influxdb3 install package influxdata-plugin-utils
   influxdb3 install package reverse_geocode   # strategy=builtin
   influxdb3 install package shapely           # strategy=polygon
   influxdb3 install package scipy             # strategy=nearest
   influxdb3 install package jsonpath-ng       # a GeoJSON reference_file
   influxdb3 install package h3                # grid_type=h3, h3_field
   influxdb3 install package pygeohash         # grid_type=geohash, geohash_field
   influxdb3 install package s2sphere          # grid_type=s2
   ```
   Packages are imported lazily, so only install what your configuration uses.

## Trigger setup

### Write trigger (live enrichment)

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/geo_enrichment/geo_enrichment.py \
  --trigger-spec "table:gps" \
  --trigger-arguments 'source_measurements=gps,output_columns=country_code:geo_country city:geo_city,strategy=builtin' \
  geo_enrich_gps
influxdb3 enable trigger --database mydb geo_enrich_gps
```
### HTTP trigger (backfill)

The trigger needs no arguments — the request body carries the configuration.

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/geo_enrichment/geo_enrichment.py \
  --trigger-spec "request:geo_backfill" \
  geo_backfill
influxdb3 enable trigger --database mydb geo_backfill

curl -X POST "http://localhost:8181/api/v3/engine/geo_backfill" \
  -H "Authorization: Bearer $INFLUXDB3_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source_measurements": "gps",
    "output_columns": "country_code:geo_country city:geo_city",
    "strategy": "builtin",
    "start": "2026-08-01T00:00:00Z",
    "end": "2026-08-29T00:00:00Z",
    "retry_unknown": true
  }'
```
**Expected response:**

```json
{
  "status": "ok",
  "measurement": "gps",
  "stats": {
    "rows": 5730, "resolved": 5719, "unresolved": 11,
    "no_coordinates": 0, "invalid_coordinates": 0, "skipped_enriched": 0,
    "cache_hits": 5602, "cache_misses": 128, "errors": 0, "written": 5730
  }
}
```
## Example usage

### Example 1: Country and city on fleet positions (in place)

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/geo_enrichment/geo_enrichment.py \
  --trigger-spec "table:gps" \
  --trigger-arguments 'source_measurements=gps,output_columns=country_code:geo_country city:geo_city,strategy=builtin,min_population=10000' \
  geo_country
```
```bash
influxdb3 write --database mydb 'gps,device=truck7 lat=55.7558,lon=37.6173,speed=54'
influxdb3 query --database mydb "SELECT device, speed, geo_country, geo_city FROM gps"
```
```
device   speed  geo_country  geo_city
truck7   54     RU           Moscow
```
### Example 2: Your own plant zones, as real tags

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/geo_enrichment/geo_enrichment.py \
  --trigger-spec "table:gps" \
  --trigger-arguments 'source_measurements=gps,target_measurement=gps_zoned,output_mode=tag,output_columns=facility:facility region:region,strategy=polygon,reference_file=/plugins/data/zones.geojson,overlap_policy=smallest' \
  geo_zones
```
```bash
influxdb3 query --database mydb \
  "SELECT facility, avg(speed) FROM gps_zoned GROUP BY facility"
```
### Example 3: Nearest depot with match quality

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/geo_enrichment/geo_enrichment.py \
  --trigger-spec "table:gps" \
  --trigger-arguments 'source_measurements=gps,output_columns=code:geo_site distance_m:geo_distance,strategy=nearest,reference_file=/plugins/data/sites.csv,max_radius_m=500' \
  geo_sites
```
```bash
influxdb3 query --database mydb \
  "SELECT geo_site, count(*) FROM gps WHERE geo_distance >= 0 GROUP BY geo_site"
```
### Example 4: H3 cells for a heatmap

```bash
influxdb3 create trigger \
  --database mydb \
  --plugin-filename gh:influxdata/geo_enrichment/geo_enrichment.py \
  --trigger-spec "table:gps" \
  --trigger-arguments 'source_measurements=gps,output_columns=cell:geo_cell,strategy=grid,grid_type=h3,grid_precision=8' \
  geo_cells
```
```bash
influxdb3 query --database mydb \
  "SELECT geo_cell, count(*) AS hits FROM gps GROUP BY geo_cell ORDER BY hits DESC"
```
### Example 5: Integer-encoded tracker with a combined column

```bash
--trigger-arguments 'source_measurements=tracker,output_columns=country_code:geo_country,point_field=pos,point_format=lon_lat,coord_scale=1e7'
```
## Code overview

### Files

- `geo_enrichment.py` — the plugin
- `geo_enrichment_config_data_writes.toml` — annotated configuration template
- `manifest.toml` — plugin manifest
- `requirements.txt` — runtime dependencies
- `test_geo_enrichment.py` — pytest suite, runs without a live {{% product-name %}} server
- `README.md` — this documentation

### Logging

Logs go to the `system.processing_engine_logs` table. Each run logs a summary:

```
rows=1200 resolved=1180 unresolved=20 no_coordinates=0 invalid=0
already_enriched=600 cache_hits=1150 cache_misses=50 errors=0 written=1200
```
`already_enriched` counts echo-batch rows, so on a healthy in-place trigger it
is roughly equal to the rows written on the previous pass.

### Main functions

#### `process_writes(influxdb3_local, table_batches, args)`

Enriches each WAL flush. Skips rows that already carry the output columns, then
extracts, validates, resolves and writes. Writes do not retry — a WAL-flush
trigger runs inline with ingestion, so a backoff sleep would throttle it.

#### `process_request(influxdb3_local, query_parameters, request_headers, request_body, args)`

Pages through a time range with the same pipeline and retries failed writes.
Re-reads the reference data on every call.

#### `read_reference(cfg, requested_attributes)`

Reads the reference file by extension into geometry/attribute records, which both
`polygon` and `nearest` build their index from.

#### `resolve_attributes(cfg, resolver, memo, lat, lon)`

Rounds the coordinate, reuses a memoized result, otherwise calls the resolver.

#### `build_enrichment_line(row, table, values, cfg, schema)`

Builds the output line: in place only the source tags are reproduced, so the
write merges; to a target table the whole row is copied.

## Troubleshooting

### Issue: "output_mode='tag' needs 'target_measurement'"

A tag is part of a row's identity, so writing one into the source table creates a
second row and doubles every aggregate. Either set `target_measurement`, or use
`output_mode=field` to enrich in place.

### Issue: rows have `UNKNOWN` everywhere

- `strategy=nearest`: every site is farther than `max_radius_m`. Map
  `distance_m` to a column and query it to see the real distances. When only the
  `_2` and later groups are unresolved, either the radius excludes them or
  `nearest_count` exceeds the number of sites in the file.
- `strategy=polygon`: the point falls outside every zone. Check that the file
  uses `[longitude, latitude]` order, which both GeoJSON and WKT require and
  which is the reverse of how coordinates are usually spoken.

### Issue: no geo columns appear at all

- The trigger table must be listed in `source_measurements`.
- Rows without usable coordinates are skipped silently; check `no_coordinates`
  in the summary log.
- If coordinates arrive as scaled integers, set `coord_scale`.

### Issue: "'attribute' cannot be produced by strategy"

`output_columns` names an attribute the strategy does not have. The error lists
what is available; for `polygon` and `nearest` that comes from your own file, so
a typo in a CSV header shows up here. A typo in a GeoJSON path is reported
separately, as a path matching no feature.

### Issue: field type conflict on write

Geo attributes are written as strings and `distance_m` as a float. If a column
of that name already exists with another type, the whole write batch is
rejected. Choose different column names, or drop the old column.

### Issue: the trigger fires twice per write

Expected in place — see [The echo batch](#the-echo-batch). The second pass writes
nothing.

### Issue: a package is missing

The error names the package and what needs it — a strategy, a coordinate input,
or the reference file's format:

```
'strategy=polygon' needs the 'shapely' package. Install it with
'influxdb3 install package shapely'.
```

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
