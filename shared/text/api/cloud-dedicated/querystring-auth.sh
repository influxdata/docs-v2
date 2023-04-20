#######################################
# Use an InfluxDB 1.x compatible username and password
# to query the InfluxDB v1 API
#######################################
# Use authentication query parameters:
#   ?p=DATABASE_TOKEN
#######################################

curl --get "cloud2.influxdata.com/query" \
  --data-urlencode "p=DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
