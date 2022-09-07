import { flux } from '@influxdata/influxdb-client'
import influxdb from '../_influxdb'

const INFLUX_ORG = process.env.INFLUX_ORG
const INFLUX_BUCKET_AUTH = process.env.INFLUX_BUCKET_AUTH

/**
 * Gets devices or a particular device when deviceId is specified. Tokens
 * are not returned unless deviceId is specified. It can also return devices
 * with empty/unknown key, such devices can be ignored (InfluxDB authorization is not associated).
 * @param deviceId optional deviceId
 * @returns promise with an Record<deviceId, {deviceId, createdAt, updatedAt, key, token}>.
 */
 export async function getDevices(deviceId) {
    const queryApi = influxdb.getQueryApi(INFLUX_ORG)
    const deviceFilter =
      deviceId !== undefined
        ? flux` and r.deviceId == "${deviceId}"`
        : flux` and r._field != "token"`
    const fluxQuery = flux`from(bucket:${INFLUX_BUCKET_AUTH})
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "deviceauth"${deviceFilter})
      |> last()`
    const devices = {}
    console.log(`*** QUERY *** \n ${fluxQuery}`)
    return await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row)
          const deviceId = o.deviceId
          if (!deviceId) {
            return
          }
          const device = devices[deviceId] || (devices[deviceId] = {deviceId})
          device[o._field] = o._value
          if (!device.updatedAt || device.updatedAt < o._time) {
            device.updatedAt = o._time
          }
        },
        error: reject,
        complete() {
          console.log(JSON.stringify(devices))
          resolve(devices)
        },
      })
    })
  }

 