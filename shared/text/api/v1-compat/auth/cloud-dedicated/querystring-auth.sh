#######################################
# Use an InfluxDB 1.x compatible username and password
# to query the InfluxDB 1.x compatibility API
#######################################
# Use authentication query parameters:
#   ?p=DATABASE_TOKEN
#######################################

curl --get "http://localhost:8086/query" \
  --data-urlencode "u=[USERNAME]" \
  --data-urlencode "p=DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
