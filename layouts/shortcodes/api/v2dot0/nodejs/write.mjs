"use strict"
/** @module write
 * Writes a data point to InfluxDB using the Node.js client.
**/

import { InfluxDB, Point } from "@influxdata/influxdb-client"

/** Environment variables **/
const url = process.env.INFLUX_URL
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG
const bucket = process.env.INFLUX_BUCKET

/**
 * Instantiate the InfluxDB client
 * with a configuration object.
 **/
const influxDB = new InfluxDB({ url, token })
const writeApi = influxDB.getWriteApi(org, bucket)

/**
 * Setup default tags for all writes.
 **/
writeApi.useDefaultTags({ location: "browser" })
const point1 = new Point("temperature")
  .tag("example", "index.html")
  .floatField("value", 24)
console.log(` ${point1}`)

writeApi.writePoint(point1)

/**
 * Flush pending writes and close writeApi.
 **/
writeApi.close().then(() => {
  console.log("WRITE FINISHED")
})
