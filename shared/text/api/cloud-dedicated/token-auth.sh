########################################################
# Use the Token authentication scheme to query InfluxDB.
########################################################

curl --get "http://localhost:8086" \
  --header "Authorization: Token DATABASE_TOKEN" \
  --header 'Content-type: application/json' \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
