---
title: Side effects
description: A summary of side effects in the Flux functional data scripting language.
menu:
  v2_0_ref:
    parent: Flux language specification
    name: Side effects
    weight: 90
---

Side effects can occur in one of two ways.

1. By reassigning built-in options
2. By calling a function that produces side effects

A function produces side effects when it is explicitly declared to have side effects or when it calls a function that itself produces side effects.
