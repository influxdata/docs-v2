from datetime import datetime

import os
import urllib3
from
from influxdb_client import Authorization, InfluxDBClient, Permission, PermissionResource, Point, WriteOptions
from influxdb_client.client.query_api import QueryOptions
from influxdb_client.client.authorizations_api import AuthorizationsApi
from influxdb_client.client.bucket_api import BucketsApi
from influxdb_client.client.query_api import QueryApi

# Set up configuration file needed to reach influxdb
config = {
    "id": os.getenv("VIRTUAL_DEVICE_NAME"),
    "influx_url": os.getenv("INFLUX_URL"),
    "influx_token": os.getenv("INFLUX_TOKEN"),
    "influx_org": os.getenv("INFLUX_ORG"),
    "influx_bucket": os.getenv("INFLUX_BUCKET"),
    "influx_bucket_auth": os.getenv("INFLUX_BUCKET_AUTH")
}


# this checks if the device is already in the auth bucket
# Should probably return a device

#  Gets devices or a particular device when deviceId is specified. Tokens
#  are not returned unless deviceId is specified. It can also return devices
#  with empty/unknown key, such devices can be ignored (InfluxDB authorization is not associated).
#  @param deviceId optional deviceId
#  @returns promise with an Record<deviceId, {deviceId, createdAt, updatedAt, key, token}>.

def get_device(device_id) -> {}:
    influxdb_client = InfluxDBClient(url=config['influx_url'],
                                     token=config['influx_token'],
                                     org=config['influx_org'])

    query_api = QueryApi(influxdb_client)

    device_filter = ''
    flux_query = f"from(bucket: {config['influx_bucket_auth']}) " \
                 f"|> range(start: 0) " \
                 f"|> filter(fn: (r) => r._measurement == 'deviceauth'{device_filter}) " \
                 f"|> last()"
    devices = {}
    print(f"*** QUERY *** \n {flux_query}")
    # TODO FIX
    query_api.query(flux_query)
    return {}


# Creates an authorization for a deviceId and writes it to a bucket
def create_device(device_id) -> Authorization:
    device = get_device(device_id)
    # TODO actually need to set up and run this
    authorization_valid = device["key"]
    if authorization_valid:
        print(f"{device} \n This device ID is already registered and has an authorization.")
    else:
        print(f"createDeviceAuthorization: deviceId ={device_id}")
        authorization = create_authorization(device_id)
        influxdb_client = InfluxDBClient(url=config['influx_url'],
                                         token=config['influx_token'],
                                         org=config['influx_org'])

        write_api = influxdb_client.write_api(write_options=WriteOptions(batch_size=1))
        point = Point("deviceauth") \
            .tag("deviceId", device_id) \
            .field("key", authorization.id) \
            .field("token", authorization.token)
        write_api.write(bucket=config["influx_bucket_auth"], record=point)
        write_api.close()
        return authorization




# TODO
# Function should return a response code
# Creates an authorization for a supplied deviceId
def create_authorization(device_id) -> Authorization:
    influxdb_client = InfluxDBClient(url=config['influx_url'],
                                     token=config['influx_token'],
                                     org=config['influx_org'])
    authorization_api = AuthorizationsApi(influxdb_client)

    buckets_api = BucketsApi(influxdb_client)
    bucket = buckets_api.find_bucket_by_name(config['influx_bucket']) # function returns only 1 bucket
    desc_prefix = 'IoTCenterDevice: '
    # get bucket_id from bucket
    org_resource = PermissionResource(org_id=config['influx_org'], type="orgs")
    read = Permission(action="read", resource=org_resource)
    write = Permission(action="write", resource=org_resource)
    permissions = [read, write]
    authorization = Authorization(org_id=config['influx_org'],
                                  permissions=permissions,
                                  description=desc_prefix + device_id)
    request = authorization_api.create_authorization(authorization)

    return request





