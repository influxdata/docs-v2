---
title: Headers
description: >-
  InfluxDB Cloud Serverless API endpoints use standard HTTP request and

  response headers. The following table shows common headers used by many

  InfluxDB Cloud Serverless API endpoints. Some endpoints may use other

  headers for functions specific to those endpoints--for example, the

  write endpoints accept the `Content-Encoding` header to indicate that

  line protocol is compressed in the request body.


  | Header             | Value type |
  Description                                           |

  |:-------------------|:-----------|:------------------------------------------------------|

  | `Accept`           | string     | The content type that the client can
  understand.     |

  | `Authorization`    | string     | The authorization scheme and
  credential.             |

  | `Content-Encoding` | string     | Compression applied to the request body
  (e.g., gzip). |

  | `Content-Length`   | integer    | The size of the entity-body, in
  bytes.               |

  | `Content-Type`     | string     | The format of the data in the request
  body.         |
type: api
layout: single
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/api/tags/influxdb-cloud-serverless-api-headers.yaml
specDownloadPath: /openapi/influxdb-cloud-serverless-api.yml
weight: 100
tag: Headers
isConceptual: true
tagDescription: >-
  InfluxDB Cloud Serverless API endpoints use standard HTTP request and

  response headers. The following table shows common headers used by many

  InfluxDB Cloud Serverless API endpoints. Some endpoints may use other

  headers for functions specific to those endpoints--for example, the

  write endpoints accept the `Content-Encoding` header to indicate that

  line protocol is compressed in the request body.


  | Header             | Value type |
  Description                                           |

  |:-------------------|:-----------|:------------------------------------------------------|

  | `Accept`           | string     | The content type that the client can
  understand.     |

  | `Authorization`    | string     | The authorization scheme and
  credential.             |

  | `Content-Encoding` | string     | Compression applied to the request body
  (e.g., gzip). |

  | `Content-Length`   | integer    | The size of the entity-body, in
  bytes.               |

  | `Content-Type`     | string     | The format of the data in the request
  body.         |
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
  v1: /influxdb/v1/api/
  enterprise-v1: /enterprise_influxdb/v1/api/
---
