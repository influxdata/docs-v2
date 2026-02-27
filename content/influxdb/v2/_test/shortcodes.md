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
<span data-testid="latest-patch">{{< latest-patch >}}</span>
<span data-testid="latest-patch-cli">{{< latest-patch cli=true >}}</span>
<span data-testid="icon-check">{{< icon "check" >}}</span>
<div data-testid="api-endpoint">{{< api-endpoint method="get" endpoint="https://{{< influxdb/host >}}/api/v2/query" >}}</div>
<span data-testid="show-in-core">{{% show-in "core" %}}VISIBLE_IN_CORE{{% /show-in %}}</span>
<span data-testid="hide-in-core">{{% hide-in "core" %}}HIDDEN_IN_CORE{{% /hide-in %}}</span>
<div data-testid="influx-creds-note">{{< cli/influx-creds-note >}}</div>
<div data-testid="release-toc">{{< release-toc >}}</div>
<div data-testid="points-series-flux">{{< influxdb/points-series-flux >}}</div>
