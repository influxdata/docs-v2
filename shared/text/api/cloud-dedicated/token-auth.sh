########################################################
# Use Token authentication with a database token
# to query the InfluxDB v1 API
########################################################

curl --get "https://cloud2.influxdata.com/query" \
  --header "Authorization: Token DATABASE_TOKEN" \
  --header 'Content-type: application/json' \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
