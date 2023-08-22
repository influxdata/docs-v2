########################################################
# Use the Token authorization scheme with v1 /write
# to write data.
########################################################

curl -i "https://cloud2.influxdata.com/write?db=BUCKET_NAME&rp=RETENTION_POLICY&precision=ms" \
    --header "Authorization: Token API_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1682358973500'