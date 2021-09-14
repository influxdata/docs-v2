INFLUX_TOKEN=YOUR_API_TOKEN
INFLUX_ORG_ID=YOUR_ORG_ID

curl --request POST \
	"http://localhost:8086/api/v2/buckets" \
	--header "Authorization: Token ${INFLUX_TOKEN}" \
  --header "Content-type: application/json" \
  --data '{
    "orgID": "'"${INFLUX_ORG_ID}"'",
    "name": "iot-center",
    "retentionRules": [
      {
        "type": "expire",
        "everySeconds": 86400,
        "shardGroupDurationSeconds": 0
      }
    ],
  }'
