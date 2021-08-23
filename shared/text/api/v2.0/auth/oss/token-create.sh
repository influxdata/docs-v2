INFLUX_ORG_ID=YOUR_ORG_ID
INFLUX_API_TOKEN=YOUR_API_TOKEN

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

