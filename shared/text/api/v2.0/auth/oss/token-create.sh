INFLUX_ORG_ID=48c88459ee424a04
INFLUX_API_TOKEN=YCiJXZPXSL

curl -v --request POST \
  http://localhost:8086/api/v2/authorizations \
  --header "Authorization: Token ${INFLUX_API_TOKEN}" \
  --header 'Content-type: application/json' \
  --data '{
  "status": "active",
  "description": "IOT Center device 1",
  "orgID": "'"${INFLUX_ORG_ID}"'",
  "permissions": [
    {
      "action": "read",
      "resource": {
        "type": "authorizations"
      }
    },
    {
      "action": "read",
      "resource": {
        "type": "buckets"
      }
    },
    {
      "action": "write",
      "resource": {
        "type": "buckets",
        "name": "iot-center" 
      }
    }
  ]
}'

