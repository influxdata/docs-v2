---
title: Headers
description: >
  InfluxDB HTTP API endpoints use standard HTTP request and response headers.

  The following table shows common headers used by many InfluxDB API endpoints.

  Some endpoints may use other headers that perform functions more specific to
  those endpoints--for example,

  the `POST /api/v2/write` endpoint accepts the `Content-Encoding` header to
  indicate the compression applied to line protocol in the request body.


  | Header                   | Value type            |
  Description                                |

  |:------------------------ |:---------------------
  |:-------------------------------------------|

  | `Accept`                 | string                | The content type that the
  client can understand. |

  | `Authorization`          | string                | The [authorization scheme
  and credential](/influxdb3/cloud-serverless/api/authentication/). |

  | `Content-Length`         | integer               | The size of the
  entity-body, in bytes. |

  | `Content-Type`           | string                | The format of the data in
  the request body. |
type: api
layout: single
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-headers.yaml
weight: 100
tag: Headers
isConceptual: true
menuGroup: Other
tagDescription: >
  InfluxDB HTTP API endpoints use standard HTTP request and response headers.

  The following table shows common headers used by many InfluxDB API endpoints.

  Some endpoints may use other headers that perform functions more specific to
  those endpoints--for example,

  the `POST /api/v2/write` endpoint accepts the `Content-Encoding` header to
  indicate the compression applied to line protocol in the request body.


  | Header                   | Value type            |
  Description                                |

  |:------------------------ |:---------------------
  |:-------------------------------------------|

  | `Accept`                 | string                | The content type that the
  client can understand. |

  | `Authorization`          | string                | The [authorization scheme
  and credential](/influxdb3/cloud-serverless/api/authentication/). |

  | `Content-Length`         | integer               | The size of the
  entity-body, in bytes. |

  | `Content-Type`           | string                | The format of the data in
  the request body. |
---
