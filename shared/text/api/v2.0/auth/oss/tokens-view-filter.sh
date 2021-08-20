# The example below uses the common `curl` and `jq` command-line tools
# with the InfluxDB API to do the following:
# 1. Find a user by username and extract the user ID.
# 2. Find the user's authorizations by user ID.
# 3. Filter for `active` authorizations that have `write` permission.

INFLUX_TOKEN=YCiJXZPXSL-3

function list_write_auths() {
  curl "http://localhost:8086/api/v2/users/?name=$1" \
    --header "Authorization: Token ${INFLUX_TOKEN}" \
    --header 'Content-type: application/json' | \
  
  jq --arg USER $1 '.users[] | select(.name == $USER) | .id' | \
  
  xargs -I '%' \
  curl "http://localhost:8086/api/v2/authorizations/?userID=%" \
    --header "Authorization: Token ${INFLUX_TOKEN}" \
    --header 'Content-type: application/json' | \
  
  jq '.authorizations[]
        | select(.permissions[] | select(.action=="write"))
        | select(.status=="active")'
}

list_write_auths 'iot_user_1'

