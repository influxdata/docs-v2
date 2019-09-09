---
title: Manage secrets
description: Manage secrets in InfluxDB with the API.
v2.0/tags: [secrets, security]
menu:
  v2_0:
    parent: Store secrets
weight: 201
---


The following API calls allow you to manage secrets:


### Add secrets to an organization

```sh
curl --request PATCH \
  --url http://localhost:9999/api/v2/orgs/<org-id>/secrets \
  --header 'authorization: Token YOURAUTHTOKEN' \
  --header 'content-type: application/json' \
  --data '{
	"foo": "bar",
	"hello": "world"
}'

# should return 204 no content
```
### Retrieve an organization's secrets

```sh
curl --request GET \
  --url http://localhost:9999/api/v2/orgs/<org-id>/secrets \
  --header 'authorization: Token YOURAUTHTOKEN'

# should return
#  {
#    "links": {
#      "org": "/api/v2/orgs/031c8cbefe101000",
#      "secrets": "/api/v2/orgs/031c8cbefe101000/secrets"
#    },
#    "secrets": []
#  }
```

### Retrieve the added secrets

```bash
curl --request GET \
  --url http://localhost:9999/api/v2/orgs/<org-id>/secrets \
  --header 'authorization: Token YOURAUTHTOKEN'

# should return
#  {
#    "links": {
#      "org": "/api/v2/orgs/031c8cbefe101000",
#      "secrets": "/api/v2/orgs/031c8cbefe101000/secrets"
#    },
#    "secrets": [
#      "foo",
#      "hello"
#    ]
#  }
```
