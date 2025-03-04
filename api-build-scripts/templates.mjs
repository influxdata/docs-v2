export function getPageTemplate(pageType) {
  switch (pageType) {
    case 'index':
      return {
        params: {
          layout: 'api-reference',
          title: 'InfluxDB HTTP API',
          description:
            'The InfluxDB HTTP API provides predictable endpoint paths and supports standard HTTP methods, status codes, and authorization schemes. Resource management endpoints support JSON in requests and responses.',
          menu: {
            parent: 'Reference',
            name: 'InfluxDB HTTP API',
            weight: 0,
          },
        },
      };
    case 'path':
      return {
        params: {
          layout: 'api-reference',
          menu: {
            parent: 'INFLUXDB HTTP API',
            weight: 0,
          },
        },
      };
    case 'overview':
      return {
        params: {
          layout: 'api-reference',
          title: 'Overview',
          description:
            'The API provides predictable endpoint paths and supports standard HTTP methods, status codes, and authorization schemes. Resource management endpoints support JSON in requests and responses.',
          menu: {
            parent: 'INFLUXDB HTTP API',
            weight: 10,
          },
        },
      };
    default:
      return null;
  }
}

/** From generate-api-docs.sh
 * 
 *  if [[ $apiName == "v1-compatibility" ]]; then
    frontmatter="---
title: $title
description: $description
layout: api
menu:
  $menu:
    parent: InfluxDB HTTP API
    name: $menuTitle
    identifier: api-reference-$apiName
weight: 304
aliases:
  - /influxdb/$product/api/v1/
---
"
  elif [[ $version == "0" ]]; then
  echo $productName $apiName
    frontmatter="---
title: $title
description: $description
layout: api
weight: 102
menu:
  $menu:
    parent: InfluxDB HTTP API
    name: $menuTitle
    identifier: api-reference-$apiName
---
"
  elif [[ $isDefault == true ]]; then
    frontmatter="---
title: $title
description: $description
layout: api
menu:
  $menu:
    parent: InfluxDB HTTP API
    name: $menuTitle
    identifier: api-reference-$apiName
weight: 102
aliases:
  - /influxdb/$product/api/
---
"
  else
    frontmatter="---
title: $title
description: $description
layout: api
menu:
  $menu:
    parent: InfluxDB HTTP API
    name: $menuTitle
    identifier: api-reference-$apiName
weight: 102
---
"
  fi 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
