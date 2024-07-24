#######################################
# Use Basic authentication with a database token
# to query the InfluxDB v1 API
#######################################


curl --get "https://cluster-id.a.influxdb.io/query" \
  --user "":"DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
