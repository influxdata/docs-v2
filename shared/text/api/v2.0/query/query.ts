'use strict'
/** @module query 
 * Queries a data point in InfluxDB using the Javascript client library with Node.js.
**/

import { InfluxDB, Point } from '@influxdata/influxdb-client'

/** Environment variables **/
const url = process.env.INFLUX_URL
const token = process.env.INFLUX_API_TOKEN
const org = process.env.INFLUX_ORG
const bucket = process.env.INFLUX_BUCKET

/**
 * Instantiate the InfluxDB client
 * with a configuration object.
 **/
const influxDB = new InfluxDB({ url, token })

const fluxQuery = 'from(bucket:"air_sensor") |> range(start: 0) |> filter(fn: (r) => r._measurement == "temperature")'

const fluxObserver = {
  next(row: string[], tableMeta: FluxTableMetaData) {
    const o = tableMeta.toObject(row)
    console.log(
      '${o._time} ${o._measurement} in '${o.region}' (${o.sensor_id}): ${o._field}=${o._value}`
    )
  },
  error(error: Error) {
    console.error(error)
    console.log('\nFinished ERROR')
  },
  complete() {
    console.log('\nFinished SUCCESS')
  }
}

/** Execute a query and receive line table metadata and rows. */
queryApi.queryRows(query: fluxQuery, consumer: fluxObserver )
