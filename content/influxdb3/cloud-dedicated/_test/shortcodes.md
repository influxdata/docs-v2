---
title: Shortcode test page
test_only: true
---

<!-- vale off -->
<span data-testid="product-name">{{% product-name %}}</span>
<span data-testid="product-name-short">{{% product-name "short" %}}</span>
<span data-testid="product-key">{{< product-key >}}</span>
<span data-testid="current-version">{{< current-version >}}</span>
<span data-testid="host">{{< influxdb/host >}}</span>
<span data-testid="home-sample-link">{{< influxdb3/home-sample-link >}}</span>
<span data-testid="latest-patch">{{< latest-patch >}}</span>
<span data-testid="icon-check">{{< icon "check" >}}</span>
<div data-testid="api-endpoint">{{< api-endpoint method="get" endpoint="https://{{< influxdb/host >}}/api/v2/query" >}}</div>
<span data-testid="show-in-core">{{% show-in "core" %}}VISIBLE_IN_CORE{{% /show-in %}}</span>
<span data-testid="hide-in-core">{{% hide-in "core" %}}HIDDEN_IN_CORE{{% /hide-in %}}</span>
<span data-testid="cta-link">{{< cta-link >}}</span>

<div data-testid="sql-schema-intro">

{{% sql/sql-schema-intro %}}

</div>

<div data-testid="v1-v3-data-model-note">

{{% influxql/v1-v3-data-model-note %}}

</div>
