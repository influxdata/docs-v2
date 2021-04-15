---
title: Influx Query Language (InfluxQL)
description: >
  Influx Query Language (InfluxQL) is Influx DB's SQL-like query language.
menu:
  enterprise_influxdb_1_9:
    weight: 70
    identifier: InfluxQL
---

This section introduces InfluxQL, the InfluxDB SQL-like query language for
working with data in InfluxDB databases.

## InfluxQL tutorial
The first seven documents in this section provide a tutorial-style introduction
to InfluxQL.
Feel free to download the dataset provided in
[Sample Data](/enterprise_influxdb/v1.9/query_language/data_download/) and follow along
with the documentation.

#### Data exploration

[Data exploration](/enterprise_influxdb/v1.9/query_language/explore-data/) covers the
query language basics for InfluxQL, including the
[`SELECT` statement](/enterprise_influxdb/v1.9/query_language/explore-data/#the-basic-select-statement),
[`GROUP BY` clauses](/enterprise_influxdb/v1.9/query_language/explore-data/#the-group-by-clause),
[`INTO` clauses](/enterprise_influxdb/v1.9/query_language/explore-data/#the-into-clause), and more.
See Data Exploration to learn about
[time syntax](/enterprise_influxdb/v1.9/query_language/explore-data/#time-syntax) and
[regular expressions](/enterprise_influxdb/v1.9/query_language/explore-data/#regular-expressions) in
queries.

#### Schema exploration

[Schema exploration](/enterprise_influxdb/v1.9/query_language/explore-schema/) covers
queries that are useful for viewing and exploring your
[schema](/enterprise_influxdb/v1.9/concepts/glossary/#schema).
See Schema Exploration for syntax explanations and examples of InfluxQL's `SHOW`
queries.

#### Database management

[Database management](/enterprise_influxdb/v1.9/query_language/manage-database/) covers InfluxQL for managing
[databases](/enterprise_influxdb/v1.9/concepts/glossary/#database) and
[retention policies](/enterprise_influxdb/v1.9/concepts/glossary/#retention-policy-rp) in
InfluxDB.
See Database Management for creating and dropping databases and retention
policies as well as deleting and dropping data.

#### InfluxQL functions

Covers all [InfluxQL functions](/enterprise_influxdb/v1.9/query_language/functions/).

#### InfluxQL Continuous Queries

[InfluxQL Continuous Queries](/enterprise_influxdb/v1.9/query_language/continuous_queries/) covers the
[basic syntax](/enterprise_influxdb/v1.9/query_language/continuous_queries/#basic-syntax)
,
[advanced syntax](/enterprise_influxdb/v1.9/query_language/continuous_queries/#advanced-syntax)
,
and
[common use cases](/enterprise_influxdb/v1.9/query_language/continuous_queries/#continuous-query-use-cases)
for
[Continuous Queries](/enterprise_influxdb/v1.9/concepts/glossary/#continuous-query-cq).
This page also describes how to
[`SHOW`](/enterprise_influxdb/v1.9/query_language/continuous_queries/#listing-continuous-queries) and
[`DROP`](/enterprise_influxdb/v1.9/query_language/continuous_queries/#deleting-continuous-queries)
Continuous Queries.

#### InfluxQL mathematical operators

[InfluxQL mathematical operators](/enterprise_influxdb/v1.9/query_language/math_operators/)
covers the use of mathematical operators in InfluxQL.

#### Authentication and authorization

[Authentication and authorization](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/) covers how to
[set up authentication](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/#set-up-authentication)
and how to
[authenticate requests](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/#authenticate-requests) in InfluxDB.
This page also describes the different
[user types](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/#user-types-and-privileges) and the InfluxQL for
[managing database users](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/#user-management-commands).

## InfluxQL reference

The [reference documentation for InfluxQL](/enterprise_influxdb/v1.9/query_language/spec/).
