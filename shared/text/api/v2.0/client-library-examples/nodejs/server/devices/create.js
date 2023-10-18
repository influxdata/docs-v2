import { getDevices } from './devices/_devices'

import influxdb from '../_influxdb'
import { AuthorizationsAPI, BucketsAPI } from '@influxdata/influxdb-client-apis'
import { Point } from '@influxdata/influxdb-client'

const INFLUX_ORG = process.env.INFLUX_ORG
const INFLUX_BUCKET_AUTH = process.env.INFLUX_BUCKET_AUTH
const INFLUX_BUCKET = process.env.INFLUX_BUCKET

export default async function handler(req, res) {
  try {
    const deviceId = JSON.parse(req.body)?.deviceId
    const devices = await createDevice(deviceId)
    res.status(200).json(
      Object.values(devices)
        .filter((x) => x.deviceId && x.key) // ignore deleted or unknown devices
        .sort((a, b) => a.deviceId.localeCompare(b.deviceId))
    )
  } catch(err) {
      res.status(500).json({ error: `failed to load data: ${err}` })
  }
}

/** Creates an authorization for a deviceId and writes it to a bucket */
async function createDevice(deviceId) {
  let device = (await getDevices(deviceId)) || {}
  let authorizationValid = !!Object.values(device)[0]?.key
  if(authorizationValid) {
    console.log(JSON.stringify(device))
    return Promise.reject('This device ID is already registered and has an authorization.')
  } else {
    console.log(`createDeviceAuthorization: deviceId=${deviceId}`)
    const authorization = await createAuthorization(deviceId)
    const writeApi = influxdb.getWriteApi(INFLUX_ORG, INFLUX_BUCKET_AUTH, 'ms', {
      batchSize: 2,
    })
    const point = new Point('deviceauth')
      .tag('deviceId', deviceId)
      .stringField('key', authorization.id)
      .stringField('token', authorization.token)
    writeApi.writePoint(point)
    await writeApi.close()
    return authorization
  }
}

 /**
 * Creates an authorization for a supplied deviceId
 * @param {string} deviceId client identifier
 * @returns {import('@influxdata/influxdb-client-apis').Authorization} promise with authorization or an error
 */
  async function createAuthorization(deviceId) {
    const authorizationsAPI = new AuthorizationsAPI(influxdb)
    const bucketsAPI = new BucketsAPI(influxdb)
    const DESC_PREFIX = 'IoTCenterDevice: '

    const buckets = await bucketsAPI.getBuckets({name: INFLUX_BUCKET, orgID: INFLUX_ORG})
    const bucketId = buckets.buckets[0]?.id

    return await authorizationsAPI.postAuthorizations({
      body: {
        orgID: INFLUX_ORG,
        description: DESC_PREFIX + deviceId,
        permissions: [
          {
            action: 'read',
            resource: {type: 'buckets', id: bucketId, orgID: INFLUX_ORG},
          },
          {
            action: 'write',
            resource: {type: 'buckets', id: bucketId, orgID: INFLUX_ORG},
          },
        ],
      },
    })
  }
  