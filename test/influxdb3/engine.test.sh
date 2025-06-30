# Create a processing engine request trigger 
# // SECTION - influxdb3-core
curl -v -X POST "http://localhost:8181/api/v3/configure/processingengine/trigger" \
 --header "Authorization: Bearer ${INFLUXDB3_ENTERPRISE_ADMIN_TOKEN}" \
 --json '{
  "db": "sensors",
  "plugin_filename": "request.py",
  "trigger_name": "Process request trigger",
  "trigger_specification": "request:process-request"
}'

# // SECTION - influxdb3-enterprise
curl -v -X POST "http://localhost:8181/api/v3/configure/processingengine/trigger" \
 --header "Authorization: Bearer ${INFLUXDB3_ENTERPRISE_ADMIN_TOKEN}" \
 --json '{
  "db": "sensors",
  "plugin_filename": "request.py",
  "trigger_name": "Process request trigger",
  "trigger_specification": {"request_path": {"path": "process-request"}}
}'