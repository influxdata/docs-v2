---
title: InfluxDB SQL reference
description: >
  InfluxDB SQL reference
menu:
  influxdb_cloud_iox:
    name: Query data with SQL
weight: 103
---


### Supported operators

| Operator | Meaning                  |
|:--------:|:--------                 |
| `=`      | equal to                 |
| `<>`     | not equal to             |
| `!=`     | not equal to             |
| `>`      | greater than             |
| `>=`     | greater than or equal to |
| `<`      | less than                |
| `<=`     | less than or equal to    |


### Quoting

Fields can be double quoted, while tag keys are single quoted. You may double quote measurements, but it's not a requirement. 

The following queries will both return results:

```sql
SELECT location, water_level 
  FROM h2o_feet

SELECT "location","water_level" 
  FROM "h2o_feet"
```



SELECT * FROM "h2o_feet" WHERE "location" = 'santa_monica' and "level description" = 'below 3 feet' 

SELECT * FROM "h2o_feet" WHERE location = 'santa_monica' and level description = 'below 3 feet' 


Duration Units

