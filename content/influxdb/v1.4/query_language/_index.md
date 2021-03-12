---
title: Influx Query Language (InfluxQL)
menu:
  influxdb_1_4:
    weight: 70
    identifier: influxql
---

This section introduces InfluxQL, InfluxDB's SQL-like query language for
interacting with data in InfluxDB.

## InfluxQL tutorial
The first seven documents in this section provide a tutorial-style introduction
to InfluxQL.
Feel free to download the dataset provided in
[Sample Data](/influxdb/v1.4/query_language/data_download/) and follow along
with the documentation.

#### Data exploration

[Data exploration](/influxdb/v1.4/query_language/data_exploration/) covers the
query language basics for InfluxQL, including the
[`SELECT` statement](/influxdb/v1.4/query_language/data_exploration/#the-basic-select-statement),
[`GROUP BY` clauses](/influxdb/v1.4/query_language/data_exploration/#the-group-by-clause),
[`INTO` clauses](/influxdb/v1.4/query_language/data_exploration/#the-into-clause), and more.
See Data Exploration to learn about
[time syntax](/influxdb/v1.4/query_language/data_exploration/#time-syntax) and
[regular expressions](/influxdb/v1.4/query_language/data_exploration/#regular-expressions) in
queries.

#### Schema exploration

[Schema exploration](/influxdb/v1.4/query_language/schema_exploration/) covers queries that are useful for viewing and exploring your
[schema](/influxdb/v1.4/concepts/glossary/#schema).
See Schema Exploration for syntax explanations and examples of InfluxQL's `SHOW`
queries.

#### Database management

[Database management](/influxdb/v1.4/query_language/database_management/) covers InfluxQL for managing
[databases](/influxdb/v1.4/concepts/glossary/#database) and
[retention policies](/influxdb/v1.4/concepts/glossary/#retention-policy-rp) in
InfluxDB.
See Database Management for creating and dropping databases and retention
policies as well as deleting and dropping data.

#### InfluxQL functions

[InfluxQL functions](/influxdb/v1.4/query_language/functions/) covers all InfluxQL functions.

#### Continuous queries

[Continuous Queries](/influxdb/v1.4/query_language/continuous_queries/) covers the
[basic syntax](/influxdb/v1.4/query_language/continuous_queries/#basic-syntax)
,
[advanced syntax](/influxdb/v1.4/query_language/continuous_queries/#advanced-syntax)
,
and
[common use cases](/influxdb/v1.4/query_language/continuous_queries/#continuous-query-use-cases)
for
[Continuous Queries](/influxdb/v1.4/concepts/glossary/#continuous-query-cq).
This page also describes how to
[`SHOW`](/influxdb/v1.4/query_language/continuous_queries/#list-cqs) and
[`DROP`](/influxdb/v1.4/query_language/continuous_queries/#delete-cqs)
Continuous Queries.

#### Mathematical operators

[Mathematical operators](/influxdb/v1.4/query_language/math_operators/) covers the use of mathematical operators in InfluxQL.

#### Authentication and authorization

[Authentication and authorization](/influxdb/v1.4/query_language/authentication_and_authorization/) covers how to
[set up authentication](/influxdb/v1.4/query_language/authentication_and_authorization/#set-up-authentication)
and how to
[authenticate requests](/influxdb/v1.4/query_language/authentication_and_authorization/#authenticate-requests) in InfluxDB.
This page also describes the different
[user types](/influxdb/v1.4/query_language/authentication_and_authorization/#user-types-and-privileges) and the InfluxQL for
[managing database users](/influxdb/v1.4/query_language/authentication_and_authorization/#user-management-commands).

## InfluxQL reference

The [reference documentation for InfluxQL](/influxdb/v1.4/query_language/spec/).
