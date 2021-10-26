find_and_update() {
  script=$(curl -X 'GET' \
    "https://cloud2.influxdata.com/api/v2/scripts" \
    --header "Authorization: Token ${INFLUX_TOKEN}" \
    --header 'Accept: application/json' \
    --header 'Content-Type: application/json' \
    --data-urlencode "org=${INFLUX_ORG}&limit=10" \
    | jq '[.scripts[] | select(.script | test("start: -?\\d\\w"))]' \
    | jq '.[0]')
  new_script=$(jq '.script |= sub("start: .*d"; "start: params.myrangestart")' <<< "${script}")
  script_id=$(jq -r '.id' <<< "${new_script}")

  curl -X 'PATCH' \
    "${INFLUX_URL}/api/v2/scripts/${script_id}" \
    --header "Authorization: Token ${INFLUX_TOKEN}" \
    --header 'Accept: application/json' \
    --header 'Content-Type: application/json' \
    --data "${new_script}" | jq .
}

find_and_update
