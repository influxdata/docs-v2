invoke() {
  SCRIPT_ID=085138a111448000

  curl -vv -X 'POST' \
    "${INFLUX_URL}/api/v2/functions/${SCRIPT_ID}/invoke" \
    --header "Authorization: Token ${INFLUX_TOKEN}" \
    --header 'Accept: application/csv' \
    --header 'Content-Type: application/json' \
    --data-binary '{ "params": { "mybucket": "air_sensor" } }'
}
invoke
