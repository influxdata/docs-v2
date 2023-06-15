#######################################
# Use an InfluxDB 1.x compatible username and password
# to query the InfluxDB v1 API
#######################################
# Use authentication query parameters:
#   ?p=DATABASE_TOKEN
#######################################

curl --get "https://cloud2.influxdata.com/query" \
  --data-urlencode "p=API_TOKEN" \
  --data-urlencode "db=BUCKET_NAME" \
  --data-urlencode "rp=RETENTION_POLICY" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
