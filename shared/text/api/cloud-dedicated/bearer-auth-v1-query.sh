########################################################
# Use the Bearer authorization scheme with a database token
# to query the InfluxDB v1 API
########################################################

curl --get "https://cluster-id.a.influxdb.io/query" \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --header 'Content-type: application/json' \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SHOW MEASUREMENTS"
