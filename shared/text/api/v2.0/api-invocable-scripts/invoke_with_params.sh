new_script_id=$(
  curl -v -X 'POST' \
    "${INFLUX_URL}/api/v2/scripts" \
    --header "Authorization: Token ${INFLUX_API_TOKEN}" \
    --header 'Accept: application/json' \
    --header 'Content-Type: application/json' \
    --data-binary @- << EOF | jq -r '.id' 
    {
      "name": "filter-and-group",
      "description": "Filters and groups points in a bucket. Expects parameters bucket, filterField, filterField2, and groupColumn.",
      "orgID": "${INFLUX_ORG_ID}",
      "script": "from(bucket: params.bucket) \
                 |> range(start: -30d) \
                 |> filter(fn: (r) => r._field == params.filterField or r._field == params.filterField2) \
                 |> group(columns: [params.groupColumn])",
       "language": "flux"
    }
EOF
)

curl -vv -X 'POST' \
  "${INFLUX_URL}/api/v2/scripts/${new_script_id}/invoke" \
  --header "Authorization: Token ${INFLUX_API_TOKEN}" \
  --header 'Accept: application/csv' \
  --header 'Content-Type: application/json' \
  --data-binary @- << EOF
    { "params":
      {
        "bucket": "air_sensor",
        "filterField": "temperature",
        "filterField2": "humidity",
        "groupColumn": "_time"
      }
    }
EOF
