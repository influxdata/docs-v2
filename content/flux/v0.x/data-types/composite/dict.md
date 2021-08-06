---
title: Work with dictionaries
seotitle: Work with dictionaries in Flux
list_title: Dictionary
description: >
  Learn how to work with dictionaries in Flux.
menu:
  flux_0_x:
    name: Dictionary
    parent: Composite types
weight: 203
flux/v0.x/tags: ["composite types", "data types"]
related:
  - /flux/v0.x/stdlib/dict/
---

A **dictionary** type is a collection that associates keys to values (also known as an associative array).
Keys can be any type, but must all be the same type.
Values can by any type, but must all be the same type.

###### On this page:
- PLACEHOLDER

## Dictionary syntax
A **dictionary** literal contains a set of key-value pairs enclosed in square brackets (`[]`).
Properties are comma-delimitted.
**Property keys must be strings** and can optionally be enclosed in double quotes (`"`).
If a property key contains only numeric characters or any whitespace characters,
it must be enclosed in double quotes.
Property keys are associated to values by a colon (`:`).
**Values can be any type**.

## Reference dictionary values
- Dicts are key-indexed.
