#######################################
# Use Basic authentication with a database token
# to query the InfluxDB v1 API
#######################################


curl --get "https://cloud2.influxdata.com/query" \
  --user "":"API_TOKEN" \
  --data-urlencode "db=BUCKET_NAME" \
  --data-urlencode "rp=RETENTION_POLICY" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
