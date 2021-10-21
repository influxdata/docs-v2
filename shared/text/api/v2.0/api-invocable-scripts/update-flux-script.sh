find_and_update() {
  script=$(curl -X 'GET' \
    "http://cloud2.influxdata.com/api/v2/functions" \
    --header "Authorization: Token ${INFLUX_API_TOKEN}" \
    --header 'Accept: application/json' \
    --header 'Content-Type: application/json' \
    --data-urlencode 'org=jstirnamaninflux&limit=10' \
    | jq '[.functions[] | select(.script | test("start: -?\\d\\w"))]' \
    | jq '.[0]')
  new_script=$(jq '.script |= sub("start: .*d"; "start: params.myrangestart")' <<< "${script}")
  script_id=$(jq -r '.id' <<< "${new_script}")

  curl -X 'PATCH' \
    "${INFLUX_URL}/api/v2/functions/${script_id}" \
    --header "Authorization: Token ${INFLUX_API_TOKEN}" \
    --header 'Accept: application/json' \
    --header 'Content-Type: application/json' \
    --data "${new_script}" | jq .
}

find_and_update
