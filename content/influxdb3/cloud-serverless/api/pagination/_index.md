---
title: Pagination
description: >-
  List endpoints in the InfluxDB Cloud Serverless API support pagination via

  query parameters. Use these parameters to page through large result sets.


  | Query parameter | Value type |
  Description                                         |

  |:----------------|:-----------|:----------------------------------------------------|

  | `limit`         | integer    | Maximum number of records to return (default:
  20). |

  | `offset`        | integer    | Number of records to skip before returning
  results. |

  | `after`         | string     | Return records created after the specified
  record ID. |

  | `descending`    | boolean    | Sort results in descending
  order.                   |


  List responses include pagination metadata (such as total count or links

  to the next page) to help navigate through result pages.
type: api
layout: single
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/api/tags/influxdb-cloud-serverless-api-pagination.yaml
specDownloadPath: /openapi/influxdb-cloud-serverless-api.yml
weight: 100
tag: Pagination
isConceptual: true
tagDescription: >-
  List endpoints in the InfluxDB Cloud Serverless API support pagination via

  query parameters. Use these parameters to page through large result sets.


  | Query parameter | Value type |
  Description                                         |

  |:----------------|:-----------|:----------------------------------------------------|

  | `limit`         | integer    | Maximum number of records to return (default:
  20). |

  | `offset`        | integer    | Number of records to skip before returning
  results. |

  | `after`         | string     | Return records created after the specified
  record ID. |

  | `descending`    | boolean    | Sort results in descending
  order.                   |


  List responses include pagination metadata (such as total count or links

  to the next page) to help navigate through result pages.
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
