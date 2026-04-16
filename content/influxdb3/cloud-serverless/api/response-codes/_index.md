---
title: Response codes
description: >-
  InfluxDB Cloud Serverless API endpoints return standard HTTP status

  codes. The following table summarizes the most common response codes.


  | Status code |
  Meaning                                                                 |

  |:------------|:------------------------------------------------------------------------|

  | `200 OK`    |
  Success.                                                                |

  | `201 Created` | The resource was
  created.                                             |

  | `204 No Content` | Success with no response body (typically after write or
  delete).  |

  | `400 Bad Request` | Request parameters or body are malformed or
  invalid.              |

  | `401 Unauthorized` | Missing or invalid
  credentials.                                  |

  | `403 Forbidden` | Credentials lack permission for the requested
  resource.             |

  | `404 Not Found` | The requested resource does not
  exist.                              |

  | `413 Payload Too Large` | Request body exceeds the maximum allowed
  size.              |

  | `422 Unprocessable Entity` | Request body is well-formed but semantically
  invalid.    |

  | `429 Too Many Requests` | Rate limit
  exceeded.                                        |

  | `500 Internal Server Error` | Unexpected server
  error.                                |

  | `503 Service Unavailable` | Server is overloaded or under
  maintenance.                |
type: api
layout: single
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/api/tags/influxdb-cloud-serverless-api-response-codes.yaml
specDownloadPath: /openapi/influxdb-cloud-serverless-api.yml
weight: 100
tag: Response codes
isConceptual: true
tagDescription: >-
  InfluxDB Cloud Serverless API endpoints return standard HTTP status

  codes. The following table summarizes the most common response codes.


  | Status code |
  Meaning                                                                 |

  |:------------|:------------------------------------------------------------------------|

  | `200 OK`    |
  Success.                                                                |

  | `201 Created` | The resource was
  created.                                             |

  | `204 No Content` | Success with no response body (typically after write or
  delete).  |

  | `400 Bad Request` | Request parameters or body are malformed or
  invalid.              |

  | `401 Unauthorized` | Missing or invalid
  credentials.                                  |

  | `403 Forbidden` | Credentials lack permission for the requested
  resource.             |

  | `404 Not Found` | The requested resource does not
  exist.                              |

  | `413 Payload Too Large` | Request body exceeds the maximum allowed
  size.              |

  | `422 Unprocessable Entity` | Request body is well-formed but semantically
  invalid.    |

  | `429 Too Many Requests` | Rate limit
  exceeded.                                        |

  | `500 Internal Server Error` | Unexpected server
  error.                                |

  | `503 Service Unavailable` | Server is overloaded or under
  maintenance.                |
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
