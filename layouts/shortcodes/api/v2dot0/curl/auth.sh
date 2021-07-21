curl --request POST http://localhost:8086/api/v2/api/v2/write \
  --header "Authorization: Token YOURAUTHTOKEN" \
  --data-urlencode "org=myorg" \
  --data-urlencode "bucket=example-bucket"
