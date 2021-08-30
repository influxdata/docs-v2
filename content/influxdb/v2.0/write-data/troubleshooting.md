---
title: Troubleshoot issues writing data
seotitle: Troubleshoot issues writing data
list_title: Troubleshoot issues writing data
weight: 106 >
  Troubleshoot issues writing data. Discover how writes fail, including rate limit failures, timeouts, size of write payload, not conforming to an explicit schema bucket, and partial writes. Find response codes for failed writes, and suggestions to fix. 
menu:
  influxdb_cloud:
    name: Troubleshoot issues
    parent: Write data
---

Discover potential causes for failed writes, find failed write response codes, and see ways to resolve.

Write failure scenarios include:

- Rate limit failures
- Timeouts
- Size of payload exceeding limit
- Payload not conforming to explicit bucket schema
- Size of HTTP headers
- Partially writes (circumstances writes rejected at a batch level vs. a partial success...and I believe this leads into this new content).

The following response codes may occur for failed writes:

- 204: Write data is correctly formatted and accepted for writing to the bucket
- 400: Line protocol poorly formed and no points were written. Response can be used to determine the first malformed line in the body line-protocol. All data in body was rejected and not written.
- 401: Token does not have sufficient permissions to write to this organization and bucket or the organization and bucket do not exist.
- 403: No token was sent and they are required.
- 413: Write has been rejected because the payload is too large. Error message returns max size supported. All data in body was rejected and not written.
- 429: Token is temporarily over quota. The Retry-After header describes when to try the write again.
- 503: Server is temporarily unavailable to accept writes. The Retry-After header describes when to try the write again.
- default: Internal server error.

If you notice data is missing in your bucket, check the following:
- Do the data types match? For example, are you writing `string` data to an `int` field?
- other things to check?

Note: You may receive a 202 HTTP code that indicates a write has been accepted, but data hasn't been written.

## Review _monitoring bucket for rejected points

Review the data log for your organization (`org_id`) for `rejected_points_` points in the `_monitoring` bucket for that org_id.

#### Rejected writes

`rejected_points,bucket=01234f6701e34dd7,field=somefield,gotType=Float,measurement=somemeasurement,reason=type\ conflict\ in\ batch\ write,wantType=Integer count=1i 1627906197091972750`
