  
# [core3,enterprise3]
# Bearer auth works with v1 /query
curl -v http://localhost:8181/query \
--header "Authorization: Bearer ${INFLUXDB3_ENTERPRISE_ADMIN_TOKEN}" \
--data-urlencode "db=sensors" \
--data-urlencode "q=SELECT * FROM home"

# Bearer auth works with v1 /write
curl -v "http://localhost:8181/write?db=sensors" \
  --header "Authorization: Bearer ${INFLUXDB3_ENTERPRISE_ADMIN_TOKEN}" \
  --data-raw "sensors,location=home temperature=23.5 1622547800"

# Basic auth works with v1 /write
curl -v "http://localhost:8181/write?db=sensors" \
--user "admin:${INFLUXDB3_ENTERPRISE_ADMIN_TOKEN}" \
--data-raw "sensors,location=home temperature=23.5 1622547800"

# URL auth works with v1 /write
curl -v "http://localhost:8181/write?db=sensors&u=admin&p=${INFLUXDB3_ENTERPRISE_ADMIN_TOKEN}" \
--data-raw "sensors,location=home temperature=23.5 1622547800"

# Token auth works with /api/v2/write
curl -v http://localhost:8181/write?db=sensors \
--header "Authorization: Token ${INFLUXDB3_ENTERPRISE_ADMIN_TOKEN}" \
--data-raw "sensors,location=home temperature=23.5 1622547800"