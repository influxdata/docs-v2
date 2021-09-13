curl --request POST https://cloud2.influxdata.com/api/v2/write \
  --header "Authorization: Token YOURAUTHTOKEN" \
  --data-urlencode "org=myorg" \
  --data-urlencode "bucket=example-bucket"
