---
title: naiveBayesClassifier.naiveBayes() function
description: >
  `naiveBayesClassifier.naiveBayes()` performs a naive Bayes classification.
menu:
  flux_v0_ref:
    name: naiveBayesClassifier.naiveBayes
    parent: contrib/RohanSreerama5/naiveBayesClassifier
    identifier: contrib/RohanSreerama5/naiveBayesClassifier/naiveBayes
weight: 301
flux/v0/tags: [transformations]
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the function comments above the
function definition in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/contrib/RohanSreerama5/naiveBayesClassifier/naiveBayesClassifier.flux#L30-L124

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

`naiveBayesClassifier.naiveBayes()` performs a naive Bayes classification.



##### Function type signature

```js
(
    <-tables: stream[{C with _time: time, _measurement: E, _field: D}],
    myClass: string,
    myField: A,
    myMeasurement: B,
) => stream[F] where A: Equatable, B: Equatable, D: Equatable, E: Equatable, F: Record
```

{{% caption %}}For more information, see [Function type signatures](/flux/v0/function-type-signatures/).{{% /caption %}}

## Parameters

### myMeasurement
({{< req >}})
Measurement to use as training data.



### myField
({{< req >}})
Field to use as training data.



### myClass
({{< req >}})
Class to classify against.



### tables

Input data. Default is piped-forward data (`<-`).



