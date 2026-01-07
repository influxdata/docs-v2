---
title: Response codes
description: >
  InfluxDB HTTP API endpoints use standard HTTP status codes for success and
  failure responses.

  The response body may include additional details.

  For details about a specific operation's response,

  see **Responses** and **Response Samples** for that operation.


  API operations may return the following HTTP status codes:


  | &nbsp;Code&nbsp; | Status                   | Description      |

  |:-----------:|:------------------------ |:--------------------- |

  | `200`       | Success                  |                       |

  | `201`       | Created                  | Successfully created a resource.
  The response body may contain details, for example
  [`/write`](#operation/PostLegacyWrite) and
  [`/api/v2/write`](#operation/PostWrite) response bodies contain details of
  partial write failures. |

  | `204`       | No content               | The request succeeded. |

  | `400`       | Bad request              | InfluxDB can't parse the request
  due to an incorrect parameter or bad syntax. For _writes_, the error may
  indicate one of the following problems: <ul><li>Line protocol is malformed.
  The response body contains the first malformed line in the data and indicates
  what was expected.</li><li>The batch contains a point with the same series as
  other points, but one of the field values has a different data
  type.<li>`Authorization` header is missing or malformed or the API token
  doesn't have permission for the operation.</li></ul> |

  | `401`       | Unauthorized             | May indicate one of the following:
  <ul><li>`Authorization: Token` header is missing or malformed</li><li>API
  token value is missing from the header</li><li>API token doesn't have
  permission. For more information about token types and permissions, see
  [Manage API tokens](/influxdb3/cloud-serverless/security/tokens/)</li></ul> |

  | `404`       | Not found                | Requested resource was not found.
  `message` in the response body provides details about the requested resource.
  |

  | `405`       | Method not allowed       | The API path doesn't support the
  HTTP method used in the request--for example, you send a `POST` request to an
  endpoint that only allows `GET`. |

  | `413`       | Request entity too large | Request payload exceeds the size
  limit. |

  | `422`       | Unprocessable entity     | Request data is invalid. `code` and
  `message` in the response body provide details about the problem. |

  | `429`       | Too many requests        | API token is temporarily over the
  request quota. The `Retry-After` header describes when to try the request
  again. |

  | `500`       | Internal server error    |                       |

  | `503`       | Service unavailable      | Server is temporarily unavailable
  to process the request. The `Retry-After` header describes when to try the
  request again. |
type: api
layout: single
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-response-codes.yaml
weight: 100
tag: Response codes
isConceptual: true
menuGroup: Concepts
tagDescription: >
  InfluxDB HTTP API endpoints use standard HTTP status codes for success and
  failure responses.

  The response body may include additional details.

  For details about a specific operation's response,

  see **Responses** and **Response Samples** for that operation.


  API operations may return the following HTTP status codes:


  | &nbsp;Code&nbsp; | Status                   | Description      |

  |:-----------:|:------------------------ |:--------------------- |

  | `200`       | Success                  |                       |

  | `201`       | Created                  | Successfully created a resource.
  The response body may contain details, for example
  [`/write`](#operation/PostLegacyWrite) and
  [`/api/v2/write`](#operation/PostWrite) response bodies contain details of
  partial write failures. |

  | `204`       | No content               | The request succeeded. |

  | `400`       | Bad request              | InfluxDB can't parse the request
  due to an incorrect parameter or bad syntax. For _writes_, the error may
  indicate one of the following problems: <ul><li>Line protocol is malformed.
  The response body contains the first malformed line in the data and indicates
  what was expected.</li><li>The batch contains a point with the same series as
  other points, but one of the field values has a different data
  type.<li>`Authorization` header is missing or malformed or the API token
  doesn't have permission for the operation.</li></ul> |

  | `401`       | Unauthorized             | May indicate one of the following:
  <ul><li>`Authorization: Token` header is missing or malformed</li><li>API
  token value is missing from the header</li><li>API token doesn't have
  permission. For more information about token types and permissions, see
  [Manage API tokens](/influxdb3/cloud-serverless/security/tokens/)</li></ul> |

  | `404`       | Not found                | Requested resource was not found.
  `message` in the response body provides details about the requested resource.
  |

  | `405`       | Method not allowed       | The API path doesn't support the
  HTTP method used in the request--for example, you send a `POST` request to an
  endpoint that only allows `GET`. |

  | `413`       | Request entity too large | Request payload exceeds the size
  limit. |

  | `422`       | Unprocessable entity     | Request data is invalid. `code` and
  `message` in the response body provide details about the problem. |

  | `429`       | Too many requests        | API token is temporarily over the
  request quota. The `Retry-After` header describes when to try the request
  again. |

  | `500`       | Internal server error    |                       |

  | `503`       | Service unavailable      | Server is temporarily unavailable
  to process the request. The `Retry-After` header describes when to try the
  request again. |
---
