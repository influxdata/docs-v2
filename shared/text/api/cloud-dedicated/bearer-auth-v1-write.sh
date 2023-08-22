########################################################
# Use the Bearer authorization scheme with v1 /write
# to write data.
########################################################

curl -i "https://cluster-id.influxdb.io/write?db=DATABASE_NAME&precision=ms" \
    --header "Authorization: Bearer DATABASE_TOKEN" \
    --header "Content-type: text/plain; charset=utf-8" \
    --data-binary 'home,room=kitchen temp=72 1682358973500'