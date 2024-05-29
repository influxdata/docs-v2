---
title: The future of Flux
description: >
  Flux is in maintenance mode and is not supported in InfluxDB v3.
  This decision was based on the broad demand for native SQL and the continued
  growth and adoption of InfluxQL.
menu:
  flux_v0_ref:
    name: Future of Flux
weight: 15
---

Flux is in maintenance mode and is not supported in InfluxDB v3.
This decision was based on the broad demand for native SQL and the continued
growth and adoption of InfluxQL. 

InfluxData continues to support Flux for InfluxDB 1.x and 2.x, and you can
continue using it without any changes to your code.
If interested in transitioning to InfluxDB v3 and want to future-proof your
code, we suggest using InfluxQL.

As we developed InfluxDB v3, our top priority was improving performance at the
database layer: faster ingestion, better compression, enhanced querying,
and more scalability. However, this meant we couldn’t bring everything forward
from v2. As InfluxDB v3 is a ground-up rewrite of the database in a new language
(from Go to Rust), we couldn’t bring Flux forward to v3.

- [What do you mean by Flux is in maintenance mode?](#what-do-you-mean-by-flux-is-in-maintenance-mode)
- [Is Flux going to End-of-Life?](#is-flux-going-to-end-of-life)
- [What alternatives do you have for Flux Tasks?](#what-alternatives-do-you-have-for-flux-tasks)

## What do you mean by Flux is in maintenance mode?

We are still supporting Flux, but are not actively developing any new features.
We will continue to provide security patches and will address any critical
defects through the maintenance period.
Our focus now is on features related to our latest database engine, InfluxDB v3,
and its associated products.

## Is Flux going to End-of-Life?

No, we will continue to support Flux for the foreseeable future.
We will continue to be supportive of our customers who have invested in Flux and
have written applications that use it. You can continue using Flux as you are,
but if you want to future-proof your code, we recommend you use InfluxQL or SQL. 

## What alternatives do you have for Flux Tasks?

If you’re interested in moving to InfluxDB v3, you will not be able to bring
Flux tasks into InfluxDB v3 as it will not support Flux natively.
When you move to v3, you will need to rewrite your tasks using whatever
technologies your team prefers. However, if you’re using tasks for downsampling
specifically, the storage performance in v3 is much better so you may no longer
need tasks for this functionality. 
