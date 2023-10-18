echo "mem,host=host1 used_percent=23.43234543 1641024000
mem,host=host2 used_percent=26.81522361 1641027600
mem,host=host1 used_percent=22.52984738 1641031200
mem,host=host2 used_percent=27.18294630 1641034800" | gzip > system.gzip \

curl --request POST "https://cloud2.influxdata.com/api/v2/write?org=ORG_NAME&bucket=BUCKET_NAME&precision=s" \
  --header "Authorization: Token API_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --header "Content-Encoding: gzip" \
  --data-binary @system.gzip
