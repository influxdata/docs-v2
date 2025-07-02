# [core3,enterprise3]
# Delete a database with hard delete at date 
curl -v -X DELETE "http://localhost:8181/api/v3/configure/database?hard_delete_at=20250701&db=sensors" \
 --header "Authorization: Bearer ${INFLUXDB3_ENTERPRISE_ADMIN_TOKEN}"