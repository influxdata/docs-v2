---
title: Inspect TSI indexes
description: >
  Use the `influxd inspect` command to inspect the InfluxDB TSI index.
menu:
  influxdb_2_7:
    parent: Manage TSI indexes
related:
  - /influxdb/v2.7/reference/internals/storage-engine/
  - /influxdb/v2.7/reference/internals/file-system-layout/
  - /influxdb/v2.7/reference/cli/influxd/inspect/dump-tsi/
  - /influxdb/v2.7/reference/cli/influxd/inspect/export-index/
  - /influxdb/v2.7/reference/cli/influxd/inspect/report-tsi/
---

Use the `influxd inspect` command to inspect the InfluxDB [time series index (TSI)](/influxdb/v2.7/reference/internals/storage-engine/#time-series-index-tsi).

- [Output information about TSI index files](#output-information-about-tsi-index-files)
  - [Output raw series data stored in the index](#output-raw-series-data-stored-in-the-index)
  - [Output measurement data stored in the index](#output-measurement-data-stored-in-the-index)
- [Export TSI index data as SQL](#export-tsi-index-data-as-sql)
- [Report the cardinality of TSI files](#report-the-cardinality-of-tsi-files)

## Output information about TSI index files

Use the [`influxd inspect dump-tsi` command](/influxdb/v2.7/reference/cli/influxd/inspect/dump-tsi/)
to output low-level details about TSI index (`tsi1`) files.

Provide the following:

- ({{< req >}}) `--series-file` flag with the path to bucket's
  [`_series` directory](/influxdb/v2.7/reference/internals/file-system-layout/#tsm-directories-and-files-layout).
- ({{< req >}}) Path to the shard's
  [`index` directory](/influxdb/v2.7/reference/internals/file-system-layout/#tsm-directories-and-files-layout)

```sh
influxd inspect dump-tsi \
  --series-file ~/.influxdbv2/engine/data/056d83f962a08461/_series \
  ~/.influxdbv2/engine/data/056d83f962a08461/autogen/1023/index
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}
```
[LOG FILE] L0-00000006.tsl
Series:		0
Measurements:	0
Tag Keys:	0
Tag Values:	0

[INDEX FILE] L3-00000008.tsi
Measurements:		3
  Series data size:	0 (0.0b)
  Bytes per series:	0.0b
Tag Keys:		15
Tag Values:		1025
  Series:		1700
  Series data size:	0 (0.0b)
  Bytes per series:	0.0b

[LOG FILE] L0-00000010.tsl
Series:		0
Measurements:	0
Tag Keys:	0
Tag Values:	0

[INDEX FILE] L2-00000011.tsi
Measurements:		1
  Series data size:	0 (0.0b)
  Bytes per series:	0.0b
Tag Keys:		5
Tag Values:		9
  Series:		10
  Series data size:	0 (0.0b)
  Bytes per series:	0.0b
```
{{% /expand %}}
{{< /expand-wrapper >}}

### Output raw series data stored in the index

To output raw series data stored in index files, include the `--series` flag with
the `influxd inspect dump-tsi` command:

```sh
influxd inspect dump-tsi \
  --series \
  --series-file ~/.influxdbv2/engine/data/056d83f962a08461/_series \
  ~/.influxdbv2/engine/data/056d83f962a08461/autogen/1023/index
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}
```
earthquake,code=6000iuad,id=us6000iuad,magType=mww,net=us,title=M\ 5.2\ -\ 101\ km\ SE\ of\ Palca\,\ Peru
earthquake,code=71377273,id=pr71377273,magType=md,net=pr,title=M\ 1.9\ -\ Puerto\ Rico\ region
earthquake,code=73794611,id=nc73794611,magType=md,net=nc,title=M\ 0.6\ -\ 13km\ ESE\ of\ Mammoth\ Lakes\,\ CA
earthquake,code=40361800,id=ci40361800,magType=ml,net=ci,title=M\ 1.3\ -\ 12km\ SE\ of\ Olancha\,\ CA
earthquake,code=6000itfk,id=us6000itfk,magType=mb,net=us,title=M\ 4.4\ -\ Mindanao\,\ Philippines
earthquake,code=2022ucrr,id=ok2022ucrr,magType=ml,net=ok,title=M\ 1.4\ -\ 4\ km\ SSE\ of\ Dover\,\ Oklahoma
earthquake,code=73792706,id=nc73792706,magType=md,net=nc,title=M\ 0.6\ -\ 7km\ W\ of\ Cobb\,\ CA
earthquake,code=6000isjn,id=us6000isjn,magType=mww,net=us,title=M\ 5.5\ -\ 69\ km\ E\ of\ Hualien\ City\,\ Taiwan
earthquake,code=022d8mp4dd,id=ak022d8mp4dd,magType=ml,net=ak,title=M\ 1.3\ -\ Southern\ Alaska
earthquake,code=022dbrb8vb,id=ak022dbrb8vb,magType=ml,net=ak,title=M\ 1.6\ -\ 37\ km\ NE\ of\ Paxson\,\ Alaska
earthquake,code=6000iu2e,id=us6000iu2e,magType=mb,net=us,title=M\ 4.1\ -\ 81\ km\ WSW\ of\ San\ Antonio\ de\ los\ Cobres\,\ Argentina
```
{{% /expand %}}
{{< /expand-wrapper >}}

### Output measurement data stored in the index

To output measurement information stored in index files, include the `--measurement`
flag with the `influxd inspect dump-tsi` command:

```sh
influxd inspect dump-tsi \
  --measurements \
  --series-file ~/.influxdbv2/engine/data/056d83f962a08461/_series \
  ~/.influxdbv2/engine/data/056d83f962a08461/autogen/1023/index
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}
```
Measurement
earthquake
explosion
quarry blast


Measurement
earthquake
explosion
ice quake
quarry blast


Measurement
earthquake
explosion
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Export TSI index data as SQL

Use the [`influxd inspect export-index` command](/influxdb/v2.7/reference/cli/influxd/inspect/export-index/)
to export an index in SQL format for easier inspection and debugging.
Provide the following:

- `--series-path` flag with the path to the bucket's
  [`_series` directory](/influxdb/v2.7/reference/internals/file-system-layout/#tsm-directories-and-files-layout).
- `--index-path` flag with the path to the shard's
  [`index` directory](/influxdb/v2.7/reference/internals/file-system-layout/#tsm-directories-and-files-layout).

```sh
influxd inspect export-index \
  --series-path ~/.influxdbv2/engine/data/056d83f962a08461/_series \
  --index-path ~/.influxdbv2/engine/data/056d83f962a08461/autogen/1023/index
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}
```sql
CREATE TABLE IF NOT EXISTS measurement_series (
	name      TEXT NOT NULL,
	series_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tag_value_series (
	name      TEXT NOT NULL,
	key       TEXT NOT NULL,
	value     TEXT NOT NULL,
	series_id INTEGER NOT NULL
);

BEGIN TRANSACTION;
INSERT INTO measurement_series (name, series_id) VALUES ('earthquake', 26920);
INSERT INTO measurement_series (name, series_id) VALUES ('earthquake', 26928);
INSERT INTO measurement_series (name, series_id) VALUES ('earthquake', 26936);
INSERT INTO measurement_series (name, series_id) VALUES ('earthquake', 26944);
INSERT INTO measurement_series (name, series_id) VALUES ('earthquake', 26952);
INSERT INTO measurement_series (name, series_id) VALUES ('earthquake', 26960);
INSERT INTO measurement_series (name, series_id) VALUES ('earthquake', 26968);
INSERT INTO measurement_series (name, series_id) VALUES ('earthquake', 26976);
INSERT INTO measurement_series (name, series_id) VALUES ('earthquake', 26984);
INSERT INTO measurement_series (name, series_id) VALUES ('earthquake', 26992);
COMMIT;
```
{{% /expand %}}
{{< /expand-wrapper >}}

## Report the cardinality of TSI files

Use the [`influxd inspect report-tsi` command](/influxdb/v2.7/reference/cli/influxd/inspect/report-tsi/)
to output information about the cardinality of data in a bucket's index.
Provide the following:

- `--bucket-id` with the ID of the bucket.

```sh
influxd inspect report-tsi --bucket-id 056d83f962a08461
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}
```
Summary
Database Path: /Users/scottanderson/.influxdbv2/engine/data/056d83f962a08461
Cardinality (exact): 101698

Measurement	Cardinality (exact)

"earthquake"		99876
"quarry blast"		1160
"explosion"		589
"ice quake"		58
"other event"		10
"chemical explosion"	2
"rock burst"		1
"sonic boom"		1
"volcanic eruption"	1


===============
Shard ID: 452
Path: /Users/scottanderson/.influxdbv2/engine/data/056d83f962a08461/autogen/452
Cardinality (exact): 1644

Measurement	Cardinality (exact)

"earthquake"	1607
"quarry blast"	29
"explosion"	7
"sonic boom"	1
===============

===============
Shard ID: 453
Path: /Users/scottanderson/.influxdbv2/engine/data/056d83f962a08461/autogen/453
Cardinality (exact): 2329

Measurement	Cardinality (exact)

"earthquake"	2298
"quarry blast"	24
"explosion"	7
===============
```
{{% /expand %}}
{{< /expand-wrapper >}}
