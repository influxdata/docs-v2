---
title: Flux release notes
description: Important changes and and what's new in each version of Flux.
weight: 1
menu:
  flux_0_x_ref:
    name: Release notes
aliases:
  - /influxdb/v2.0/reference/release-notes/flux/
  - /influxdb/cloud/reference/release-notes/flux/
---

## v0.185.0 [2022-10-03]

### Features
- Add dynamic type.
- Add dynamic wrapper function.
- Enable codespan formatting for errors via feature flags.

### Bug fixes
- Pass context in the `Run` source helper.
- Handle null vector inputs for `_vecFloat`.
- Remove broken `contrib` packages:
  - contrib/jsternberg/aggregate
  - contrib/jsternberg/math

---

## v0.184.2 [2022-09-26]

### Bug fixes
- Remove the `stacker` dependency.
- Skip strict _null_ logical evaluator.

---

## v0.184.1 [2022-09-21]

- _Internal code cleanup._

---

## v0.184.0 [2022-09-21]

### Breaking changes
- Update logical _null_ handling and align all logical operator implementations
(vectorized, row-based, as well as "in the interpreter") to be consistent and
representative of the Flux SPEC.

### Features
- Add array type conversion functions to the
  [experimental `array` package](/flux/v0.x/stdlib/experimental/array/).

### Bug fixes
- Update SPEC and fix some inconsistencies.
- Update `sort limit` to skips chunks with no rows.
- Don't report an error about testcases in the LSP.
- Prevent the metadata map from being concurrently mutated.
- Don't stackoverflow on deeply nested expressions.

---

## v0.183.0 [2022-09-12]

### Features
- Add support for piped-forward arrays to [`array.from()`](/flux/v0.x/stdlib/array/from/).
- Add parameter to [`experimental.unpivot()`](/flux/v0.x/stdlib/experimental/unpivot/)
  for non-field and non-group-key columns.
- Add a syntax for describing label literals.
- Don't display nulls as 0 in the output of `experimental.diff()`.

### Bug fixes
- Fix duplicate definitions and update issue links in the Flux SPEC.
- Don't include opening parentheses in invalid call expressions.
- Improve error message when joining with an empty table.

---

## v0.182.0 [2022-09-06]

### Features
- Display yields in `fluxtest`.
- Allow [`experimental.unpivot()`](/flux/v0.x/stdlib/experimental/unpivot/) to
  work when the `_time` column is missing.
- Add utility to the `function` package to register a source or transformation.
- Add Rust binary to sit on top of "headless" REPL backend.

### Bug fixes
- Correct type for `fillValueTime`.
- Correct panic in vectorized division by zero.
- Correct inconsistent runtime typing for `logicalVectorEvaluator`.
- Don't treat errors in SQL syntax as internal.
- Improve error handling when missing a property on member expressions.
- Preserve values of non-string group keys in `experimental.diff()`.

---

## v0.181.0 [2022-08-29]

### Features
- Add "headless" JSON-RPC based REPL.
- Support vectorized unary operators.
- Add [`experimental/polyline` package](/flux/v0.x/stdlib/experimental/polyline)
  for downsampling data.
- Update function library to have its own arguments struct.

### Bug fixes
- Update import path for the `Spec` package in the "headless" REPL.
- Update conditional vectorization to handle bad values for `test`,
  `consequent`, or `alternate`.

---

## v0.180.1 [2022-08-22]

- _Internal code cleanup._

---

## v0.180.0 [2022-08-22]

### Features
- Rewrite calls to `float()` as `_vectorizedFloat()`.
- Reduce the Flux formatter default line length to 100 characters.

### Bug fixes
- Fix logic bug in planner helper method.
- Don't include null columns when unpivoting.
- Don't error when formatting boolean literals.
- Sort columns when printing group keys.

---

## v0.179.0 [2022-08-15]

### Features
- Add a `Stringify` utility function for `table.Chunk`.
- Add support for vectorized binary equality operations.
- Update `testing.diff()` to use `experimental.diff()` permanently.
- Add vectorized `float()` builtin function.
- Enhance `fluxtest` to use package name with `test` and `skip` flags.
- Allow any kind of AST fragment to be formatted.
- Accept Flux feature flags to the test command.

### Bug fixes
- Update `testing.shouldError()` to use regular expression matching instead of string matching.
- Temporarily remove duplicates test to avoid conflicts downstream.
- Update `buildinfo` documnentation comments to match latest `go fmt`.
- Fix aggregate window rules that left query plans in a bad state.
- Include filename when printing the AST location.

---

## v0.178.0 [2022-08-09]

### Features
- Support `apiKey` parameter in [`zenoss.event()`](/flux/v0.x/stdlib/contrib/bonitoo-io/zenoss/event/)
  and [`zenoss.endpoint()`](/flux/v0.x/stdlib/contrib/bonitoo-io/zenoss/endpoint/).
- Remove `vectorizedConst` feature flag.

### Bug fixes
- Deprecate `date/boundaries` package in favor of [`experimental/date/boundaries`](/flux/v0.x/stdlib/experimental/date/boundaries/).
- Update pattern matching to specify successor counts.
- Restore integer return value for [`pagerduty.sendEvent()`](/flux/v0.x/stdlib/pagerduty/sendevent/).

---

## v0.177.1 [2022-08-08]

### Bug fixes
- Update `strings.substring()` to check bounds using rune array instead of string length.

---

## v0.177.0 [2022-08-01]

### Features
- Support conditional expressions in vectorized `map()`.
- Compute minimum required dispatcher concurrency from the plan graph.
- Add a query planner rule to remove redundant sort nodes.

### Bug fixes
- Guard message processing with mutexes.
- Update Flux REPL to use unique planner node IDs.

---

## v0.176.0 [2022-07-25]

## Features
- Promote various feature-flagged features and optimizations to be used by default.

### Bug fixes
- Support the [`location` option](/flux/v0.x/stdlib/internal/location/#options)
  in the [`boundaries` package](/flux/v0.x/stdlib/date/boundaries/).
- Pass epsilon value from Go tests to the Flux test framework.
- Ignore unknown messages rather than erroring.

---

## v0.175.0 [2022-07-19]

### Features
- Update [`testing.diff()`](/flux/v0.x/stdlib/testing/diff/) to use
  [`experimental.diff()`](/flux/v0.x/stdlib/experimental/diff/) as its base.
- Add a new diff implementation to the [experimental package](/flux/v0.x/stdlib/experimental/).
- Generalize attributes in the query planner.
- Add support for constants and literals in vectorized `map()`.
- Optimize the Holt Winters implementation by using the
  [gonum Nelder-Mead optimization](https://github.com/gonum/gonum/blob/master/optimize/neldermead.go).

### Bug fixes
- When joining data, provide a default schema for unmatched group keys.
- Update the join package to be resilient to schema changes.

---

## v0.174.1 [2022-07-12]

### Bug fixes

- Update [`aggregateWindow()`](/flux/v0.x/stdlib/universe/aggregatewindow/) 
  to correctly handle null values when using `sum` or `mean`.
- Update [`to()`](/flux/v0.x/stdlib/influxdata/influxdb/to/) and
  [`wideTo()`](/flux/v0.x/stdlib/influxdata/influxdb/wideto/) to skip empty tag
  values.

---

## v0.174.0 [2022-07-05]

### Features

- Add coloring highlights to test outputs.
- Promote [`experimental.to()`](/flux/v0.x/stdlib/experimental/to/) to 
  [`influxdata.influxdb.wideTo()`](/flux/v0.x/stdlib/influxdata/influxdb/wideto/).
- Allow physical plan
  [`attributes`](https://github.com/influxdata/flux/blob/master/plan/attributes.go) 
  to contribute to 
  [`formatter`](https://github.com/influxdata/flux/blob/master/plan/format.go) 
  details.
- Add tagging support to Flux tests.
- Add new function [`experimental.catch()`](/flux/v0.x/stdlib/experimental/catch/).
- Add new function [`testing.shouldError()`](flux/v0.x/stdlib/testing/shoulderror/).

### Bug fixes

- Update `httpWriter` struct to skip invalid floats.
- Update [`join()`](/flux/v0.x/stdlib/join/) to validate group keys.
- Fix unit tests for [`covariance()`](/flux/v0.x/stdlib/universe/covariance/).
- Update all Flux packages to additionally live as Go packages. 

---

## v0.173.0 [2022-06-29]

### Breaking changes

- Format scripts with a trailing newline by default when running the formatter.

### Features

- Deprecate [`experimental.http.get`](/flux/v0.x/stdlib/experimental/http/get/).
- Deprecate [`experimental.csv.from()`](/flux/v0.x/stdlib/experimental/csv/from/).
- Promote the following functions from `experimental.array` into the 
  [`array`](/flux/v0.x/stdlib/array) package:
  - [`array.concat()`](/flux/v0.x/stdlib/array/concat/) 
  - [`array.filter()`](/flux/v0.x/stdlib/array/filter/)
  - [`array.map()`](/flux/v0.x/stdlib/array/map/)
- Promote the following functions from `experimental.http.requests` into the 
  [`http.requests`](/flux/v0.x/stdlib/http/requests/) package:
  - [`http.requests.do()`](/flux/v0.x/stdlib/http/requests/do/)
  - [`http.requests.get()`](/flux/v0.x/stdlib/http/requests/get/)
  - [`http.requests.peek()`](/flux/v0.x/stdlib/http/requests/peek/)
  - [`http.requests.post()`](/flux/v0.x/stdlib/http/requests/post/)
- Promote `experimental.bitwise` into the [`bitwise`](/flux/v0.x/stdlib/bitwise/) 
  package.
- Remove all `Test` statements. New statements are written with `TestCase`.
- Format scripts with a trailing newline by default when running the formatter.

### Bug fixes

- Return an error if the user modifies group key while using 
  [`join`](/flux/v0.x/stdlib/join/)

---

## v0.172.0 [2022-06-24]

### Features
- Add multiple new join functions to the [`join`](/flux/v0.x/stdlib/join/) 
  package such as [`join.full()`](/flux/v0.x/stdlib/join/full/).
- Add [`initialZero`](/flux/v0.x/stdlib/universe/derivative/#initialzero) 
  parameter to the derivative function. 
- Allow features to enable builtin statements. 
- Provide the comments for each `Symbol` from `PackageExports`.
- Suggestions now start off by default and added a new flag.
- Add builtin function [`time`](/flux/v0.x/stdlib/date/time/) to the `date` 
  package to convert any timeable into datetime. 
- Allow vector types to be specified in Flux source. 

### Bug fixes
- Replace extra boolean parameter for suggestions with Flux REPL options. 
- Remove [`testing.load()`](/flux/v0.x/stdlib/testing/load/) 
  from [`testutil.yield()`](/flux/v0.x/stdlib/internal/testutil/yield/). 
- Fix a bug in how sort nodes are created for a new join. 
- Removed extra indentation for test cases. 
- Retain the package for identifier referencing the prelude. 
- Only return an error in tests if an assertion fails. 
- Fix [`findColumn()`](/flux/v0.x/stdlib/universe/findcolumn/)
  to handle multi-buffer tables. 
- Point to the function being piped to on argument mismatches. 
- Visit successors before continuing DFS on node. 

---

## v0.171.0 [2022-06-14]

### Breaking changes
- Remove `testing.loadStorage()`.

### Features
- Add `FromStr` to allow the Flux LSP (language server protocol) CLI to run with
  optional Flux features.
- Add method to parallelize aggregate transformations.
- Report unused symbols.
- Add `From` implementations for `Node/NodeMut`.

### Bug fixes
- Pass a seed to the tables generator.
- Ensure buffers are retained when copying a buffered table.
- Return an error when using a label variable without the Label constraint.

---

## v0.170.1 [2022-06-06]

### Bug fixes
- Require an earlier minimum version of `lsp-types`.

---

## v0.170.0 [2022-06-02]

### Features
- Add a `pretty.rs`-based MonoType formatter.

### Bug fixes
- Update vectorized `map()` to properly handle shadowed columns.

---

## v0.169.0 [2022-05-31]

### Features
- Add a `_status` tag to PagerDuty records.
- Refactor the operator profile to be in the query statistics.

### Bug fixes
- Ensure that constraints are checked and propagated fully.
- Fix math for integral with a single value.
- Add `json` tags for the transport profiles in statistics.
- Initialize `Metadata` in Flux statistics.
- Return a more helpful error message when an HTTP response body exceeds 100MB.
- Correct several issues found during the implementation of polymorphic labels.

---

## v0.168.0 [2022-05-23]

### Features
- Enable [`movingAverage()`](/flux/v0.x/stdlib/universe/movingaverage/) and
  [`cumulativeSum()`](/flux/v0.x/stdlib/universe/cumulativesum/) optimizations
  by default.
- Vectorize logical operations in [`map()`](/flux/v0.x/stdlib/universe/map/).
- Add a planner rule that expands logical join nodes.
- Added timezone support to [`hourSelection()`](/flux/v0.x/stdlib/universe/hourselection/).

### Bug fixes
- Attach type when constructing logical expressions.
- Fix panic with half-diamond logical plan.

---

## v0.167.0 [2022-05-16]

### Features
- Allow default types to be specified for default arguments.
- Add [`date.scale()`](/flux/v0.x/stdlib/date/scale/) to allow for dynamic duration changes.
- Expose aggregate window spec fields for use by the query planner.
- Add [`experimental.preview()`](/flux/v0.x/stdlib/experimental/preview/).

### Bug fixes
- Update `date.add()` and `date.sub()` to work correctly with timezones enabled.
- Fix failing continuous integration tests.
- Update `hourSelection()` to support overnight time ranges.
- Fix logic error in aggregate window planner rule preserve the rule if
  `table.fill` is present.
- Use `MultiplicativeOperator` in `MultiplicativeExpression`.

---

## v0.166.0 [2022-05-09]

### Features
- Add InfluxData semantic commit and pull request title validator.
- Add an `Expr` node to the visitor API.
- Add label polymorphism.
- Vectorize remaining arithmetic operators.

### Bug fixes
- Remove `JoinOpSpec.TableNames` in favor of `JoinOpSpec.params` to stay
  consistent inside `tableFind()`.
- Fix `SortLimit` for empty input group.

---

## v0.165.0 [2022-04-25]

### Features
- Add support for options in the `testcase` extension.
- Vectorize addition operations in `map()`.
- Add location support to `date.truncate()`.
- Accept string literals in properties of a record type.
- Add trace option to the `flux` CLI.
- Add `EquiJoinPredicateRule`.

### Bug fixes
- Update `map()` test case to include a range.
- Don't set `BaseLocation.file` to `Some("")`.
- Fix `strings.joinStr` panic when it receives a null value.
- Remove 64bit misalignment.
- Fix memory releases and add checked allocator to the end of tests.

---

## v0.164.1 [2022-04-18]

### Bug fixes
- Remove an extraneous `go generate` statement.

---

## v0.164.0 [2022-04-13]

### Features
- Allow Go to pass compilation options to Rust.

### Bug fixes
- Do not assume integers are 64bit integers.
- Update `prometheus.scrape` type signature to correctly return a stream.

---

## v0.163.0 [2022-04-07]

### Features
- Report skipped tests.

### Bug fixes
- Update transformation transport adapter to always invoke `finish`.
- Add support for "soft paragraphs" (paragraphs that contain single newline
  characters) in inline Flux documentation.

---

## v0.162.0 [2022-04-05]

### Features
- Add [OpenTracing spans](https://opentracing.io/docs/overview/spans/) to the Flux runtime.
- Add the `cffi` feature to reduce WASM binary size.
- Replace the main `flux` CLI with a new `flux` CLI that starts a Flux REPL by
  default or executes a Flux script via stdin.
- Track freed memory with `SetFinalizer`.
- Move [`addDuration()`](/flux/v0.x/stdlib/date/addduration/) and
  [`subDuration()`](/flux/v0.x/stdlib/date/subduration/) from the `experimental`
  package to the `date` package.

### Bug fixes
- Improve error messages for column conflicts in pivot operations.
- Create OpenTracing spans for transformations using the proper context.
- Add errors to OpenTracing spans created for transformations.
- Restore required features hidden behind the `cffi` feature.

---

## v0.161.0 [2022-03-24]

### Features
- Re-enable the dialer pool and update dependency injection.

### Bug fixes
- Check length boundary for lower bound of [`strings.substring()`](/flux/v0.x/stdlib/strings/substring/).

---

## v0.160.0 [2022-03-22]

### Features
- Remove the `concurrencyLimit` feature flag and keep it in the dependencies.
- Add MQTT Docker integration test.
- Enable dialer pool.
- Add an IOx-specific unpivot function to the `internal` package.

### Bug fixes
- Update [`join()`](/flux/v0.x/stdlib/universe/join/) to properly handle divergent schemas.
- Fix line endings in the `testcase` format to prevent unnecessarily nesting the
  body of a test case.
- Make [`strings.substring()`](/flux/v0.x/stdlib/strings/substring/) check bounds correctly.
- Fix duration and integer literal scanning.
- Make `testcase` a semantic check instead of an error.
- Skip parallel merge when selecting the result name based on side effects.
- Add metadata headers to inline documentation.

---

## v0.159.0 [2022-03-14]

### Features
- Added a `finish` state to parallel-merge and always protect with a mutex lock.

### Bug fixes
- Use a fork of the `gosnowflake` library to prevent file transfers.
- When encoding Flux types as JSON, encode dictionary types as JSON objects.
- Upgrade Apache Arrow to v7.

---

## v0.158.0 [2022-03-09]

### Features
- Add inline documentation to the `universe` package.
- Factor parallel execution into the concurrency quota calculation.

### Bug fixes
- Add parallel merges with no successors to the results set.
- Correctly use range in an updated `map()` test.

---

## v0.157.0 [2022-03-03]

### Features
- Update `fill()` to use narrow transformation.
- Add an attribute-based instantiation of parallel execution nodes.
- Expose the `Record::fields` iterator.
- Allow the `estimate_tdigest` method in `quantile()` to process any numeric value.
- Optimize `aggregateWindow()` for specific aggregate transformations.

### Bug fixes
- Update vectorized `map()` to handle missing columns.
- Remove duplicate line in `Makefile`.
- Fix `cargo doc` build errors.
- Reclassify CSV-decoding errors as user errors.
- Update `iox.from()` and `generate.from()` to use proper stream annotation.

---

## v0.156.0 [2022-02-22]

### Features
- Add second pass to physical planner for parallelization rules.
- Separate streams from arrays in the type system.
- Add function to internal/debug to check feature flag values.
- Allow feature flags to record metrics if configured.
- Add extra verbose level to dump AST of test.
- Explain what `[A], [A:B]` etc means in errors.

### Bug fixes
- Make `buckets()` function return a stream.
- Remove unnecessary `TableObject` guards.
- Copy `TagColumns` in `to()` that may get modified into the transformation.
- Update tests to use explicit yields.

---

## v0.155.1 [2022-02-15]

### Bug fixes
- Update tests to use an explicit yield.

---

## v0.155.0 [2022-02-14]

### Features
- Add new [experimental array functions](/flux/v0.x/stdlib/experimental/array/)
  for operating on arrays.

### Bug fixes
- Add `stop` parameter to [InfluxDB schema functions](/flux/v0.x/stdlib/influxdata/influxdb/schema/).
- Remove `os.Exit` calls and allow `defer executor.Close` to run.
- Properly handle time zone transitions when there is no daylight savings time
  in the specified time zone.

---

## v0.154.0 [2022-02-09]

### Features
- Add [`requests.peek()`](/flux/v0.x/stdlib/experimental/http/requests/peek/) to
  return HTTP response data in a table.
- Add [`display()`](/flux/v0.x/stdlib/universe/display/) to represent any value as a string.
- Create a version of `map()` that is columnar and supports vectorization.
- Support vectorized functions.

### Bug fixes
- Add time vector to the `values` package.
- Set the correct type for vectorized functions.

---

## v0.153.0 [2022-02-07]

### Features
- Connect language server protocol (LSP) features through the Flux crate.
- Add conversion from `flux.Bounds` to `plan/execute.Bounds`.
- Re-index all bound variables to start from 0.

### Bug fixes
- Int feature flags work properly when returned as floats.

---

## v0.152.0 [2022-01-31]

### Features
- Add the [`experimental/http/requests` package](/flux/v0.x/stdlib/experimental/http/requests/)
  to support generic HTTP requests.
- Add [`experimental/iox` package](/flux/v0.x/stdlib/experimental/iox/) and a
  placeholder for the `iox.from()` function.
- Add dependency hooks to the dependency subsystem.
- Remove unneeded feature flags.

### Bug fixes
- Revert update to the dependencies package.
- Return false if contains gets invalid value.

---

## v0.151.1 [2022-01-24]

### Features
- Update to Rust 1.58.1.

---

## v0.151.0 [2022-01-20]

### Features
- Expose `MonoType::parameter` and `MonoType::field`.

### Bug fixes
- Support writing unsigned integers with the `http` provider.

---

## v0.150.1 [2022-01-19]

### Bug fixes
- Remove duplicate `die` builtin in the `universe` package.

---

## v0.150.0 [2022-01-19]

### Features
- Update inline documentation in the following packages:
  - date
  - experimental
  - testing
  - timezone
  - types

### Bug fixes
- Make iterating the hashmap deterministic.
- Quote SQL identifiers to mitigate the risk of SQL injection.

---

## v0.149.0 [2022-01-12]

### Features
- Add `Get` methods to `metadata`.
- Optimized `sort |> limit` operations.
- Add [`location` option](/flux/v0.x/stdlib/universe/#location) support to the `date` package.
- Use reference equality for `Symbol`.
- Add inline documentation to the following packages:
    - socket
    - sql
    - strings

### Bug fixes
- Do not attempt IP validation for BigQuery data source names (DSNs).

---

## v0.148.0 [2022-01-10]

### Features
- Report multiple errors from a single `unify` call.
- Update [`to`](/flux/v0.x/stdlib/influxdata/influxdb/to/) transformation to use
  narrow transformation.
- Provide specific error information on function calls.
- Allow errors to be formatted via `codespan`.
- Add an `internal/debug.opaque` function.
- Provide which package exported a symbol.
- Add timeable support to [`experimental.addDuration()`](/flux/v0.x/stdlib/experimental/addduration/)
  and [`experimental.subDuration()`](/flux/v0.x/stdlib/experimental/subduration/).
- Add inline documentation to the following packages:
  - interpolate
  - json
  - kafka
  - math
  - regexp
  - runtime
  - sampledata
  - slack
  - system
  - pagerduty
  - profiler
  - pushbullet

### Bug fixes
- Classify IP validation failures as `Invalid`.
- Relocate the mutex in the optimized union to avoid a data race.
- Split the entire pipe chain into multiple lines (if necessary).

---

## v0.147.0 [2021-12-14]

### Features
- Optimize [`union()` transformation](/flux/v0.x/stdlib/universe/union/).
- Optimize [`timeShift()` transformation](/flux/v0.x/stdlib/universe/timeshift/).
- Add inline documentation to the following packages:
  - experimental/prometheus
  - experimental/query
  - experimental/record
  - experimental/table
  - experimental/usage

### Bug fixes
- Add mutex to the optimized `union` transformation.
- Ensure arrays are not table streams before calling `Len()`.
- Disable flakey `geo.filterRows` tests.

---

## v0.146.0 [2021-12-13]

### Features
- Update `pkg-config` to support `aarch64-apple-darwin`.
- Add inline documentation to the following packages:
  - experimental/geo
  - experimental/http
  - experimental/influxdb
  - experimental/json
  - experimental/mqtt
  - experimental/oee

### Bug fixes
- Update the default `epsilon` parameter for `testing.diff` to `0.000001`.
- Fix unsigned integer conversion tests to correctly use an defined conversion.

---

## v0.145.0 [2021-12-08]

### Features
- Add inline documentation to the following packages:
  - experimental/aggregate
  - experimental/array
  - experimental/bigtable
  - experimental/bitwise
  - experimental/csv

### Bug fixes
- Return an error from join operations if a column is not found in the schema.

---

## v0.144.0 [2021-12-06]

### Features
- Add location and message methods to `semantic::Error`.
- Return multiple errors from conversions.
- Add a vectorized field to semantic graph, `FunctionExpr`.

### Bug fixes
- Set `GOPATH` in `Dockerfile_build`.

---

## v0.143.1 [2021-11-22]

### Bug fixes
- Add targets to `rust-toolchain`.

---

## v0.143.0 [2021-11-22]

### Breaking changes
- Add new parameters to [`difference()`](/flux/v0.x/stdlib/universe/difference/)
  to ensure [`increase()`](/flux/v0.x/stdlib/universe/increase/) returns more accurate results on counter reset.

### Features
- Don't introduce constraints for default arguments.
- Make error messages more consistent.
- Use new versions of `sort()` and `derivative()` by default.
- Add inline documentation to the following packages:
  - contrib/anaisdg/anomalydetection
  - contrib/anaisdg/statsmodels
  - contrib/bonitoo-io/victorops
  - contrib/bonitoo-io/zenoss
  - contrib/jsternberg/influxdb
  - contrib/rhajek/bigpanda
  - contrib/sranka/telegram
  - experimental

### Bug fixes
- Validate examples in inline documentation as part of CI linting process.
- Correctly handle trailing dollar signs in string expression.
- Improve `fluxdoc` error messages.
- Fix panic when `length()` is given a stream of tables.
- Fix panic when `json.encode()` is given a stream of tables.

---

## v0.142.0 [2021-11-22]

### Features
- Default to erroring dependencies

### Bug fixes
- Fix Queryd panic when using the `experimental/geo` package.

---

## v0.141.0 [2021-11-22]

### Features
- Add `is_type` to query the runtime type.
- Add ability to read options from the `Context`.
- Ignore documentation for values prefixed with an underscore (`_`).
- Add inline documentation to the following packages:
  - contrib/RohanSreerama5/naiveBayesClassifier
  - contrib/bonitoo-io/alerta
  - contrib/bonitoo-io/hex
  - contrib/bonitoo-io/servicenow
  - contrib/bonitoo-io/tickscript
  - contrib/chobbs/discord
  - contrib/jsternberg/rows/
  - contrib/sranka/opsgenie
  - contrib/sranka/sensu/
  - contrib/sranka/teams
  - contrib/sranka/webexteams
  - contrib/tomhollingworth/events
  - generate
  - http
  - influxdata/influxdb
  - influxdata/influxdb/monitor
  - influxdata/influxdb/sample
  - influxdata/influxdb/schema
  - influxdata/influxdb/secrets
  - influxdata/influxdb/tasks
  - influxdata/influxdb/v1

### Bug fixes
- Propagate the element type through array constructors.
- Catch unsupported input types in aggregate transformations.
- Support pipe parameters (`<-`) in `fluxdoc`.
- Fix documentation errors when running `cargo doc`.
- Reduce the amount of extra parse errors.

---

## v0.140.0 [2021-11-22]

### Features
- Support reporting unlimited diagnostics.
- Support type inference running on invalid ASTs.
- Add erroring versions for each dependency.
- Report multiple errors from type inference.
- Add `fluxdoc` formatting documentation.
- Add inline documentation to the following packages:
  - array
  - csv
  - dict

### Bug fixes
- Handle errors when executing inline examples.
- Convert fixed array to slice.
- Compare sorted join keys.
- Make multiline-formatting consistent.
- Fix invalid syntax formatting.
- Improve error checking for null and invalid types.

---

## v0.139.0 [2021-11-01]

### Features
- Continue type inference through errors at runtime.

### Bug fixes
- Revert `runtime.now()` and related updates.

---

## v0.138.0 [2021-11-01]

### Features
- Create a BigTable dependency to let Flux mimic or control BigTable API usage.
- Report multiple type inference errors.
- Add [bitwise operations](/flux/v0.x/stdlib/experimental/bitwise/).

### Bug fixes
- Update [`fill()`](/flux/v0.x/stdlib/universe/fill/) to return tables unchanged
  when using `usePrevious` to fill a non-existent column.
- Add `runtime.now()` to return the same time throughout a script execution.

---

## v0.137.0 [2021-10-28]

### Features
- Add support for [Vertica](https://www.vertica.com/) to the [`sql` package](/flux/v0.x/stdlib/sql/).

### Bug fixes
- Correctly handle HTTP errors from the InfluxDB writer.

---

## v0.136.0 [2021-10-25]

### Features
- Enable executable examples to documentation generated by `fluxdoc`.
- Enforces IP validation and timeouts when using `mqtt`.
- Add an alternate `flux` CLI that starts the REPL if no argument is given.
- Update lint formatting.
- Add [`contrib/bonitoo-io/servicenow` package](/flux/v0.x/stdlib/contrib/bonitoo-io/servicenow/)
  and support for [ServiceNow](https://servicenow.com/) events.
- Add `component` and `customDetails` parameters to [`pagerduty.sendEvent()`](/flux/v0.x/stdlib/pagerduty/sendevent/).
- Update the `fluxdoc` parser to capture more data.
- Create a formatter for semantic graph.

### Bug fixes
- Add `contrib/bonitoo-io/servicenow` to the list of `fluxdoc` exceptions.
- Disable write retries for the InfluxDB `http` provider.

---

## v0.135.1 [2021-10-18]

### Features
- Add a disposable interface for transformations.

### Bug fixes
- Improve error message when regrouping is required in `map()`.

---

## v0.134.0 [2021-10-15]

### Features
- Add short mode to `fluxdoc dump` command.
- Add Analyzer API to `libflux`.
- Add [`timezone` package](/flux/v0.x/stdlib/timezone/) with fixed offset location.
- Add [`record.get()` function](/flux/v0.x/stdlib/experimental/record/get/) to
  dynamically retrieve record properties.
- Embed the compiled standard library instead of compiling at runtime.

### Bug fixes
- Create new annotations when group key columns change.
- Update [`prometheus.histogramQuantile()`](/flux/v0.x/stdlib/experimental/prometheus/histogramquantile/)
  to support multiple histograms and metric format versions.

---

## v0.133.0 [2021-10-04]

### Features
- Expose location functionality to [`window()`](/flux/v0.x/stdlib/universe/window/),
  [`aggregateWindow()`](/flux/v0.x/stdlib/universe/aggregatewindow/), and
  [`experimental.window()`](/flux/v0.x/stdlib/experimental/window/).
- Add location functionality to the `interval` package.
- Add methods to convert time values to and from local clock time.
- Add [`mqtt.publish()` function](/flux/v0.x/stdlib/experimental/mqtt/publish/).
- Add [`retain` parameter](/flux/v0.x/stdlib/experimental/mqtt/to/#retain) to
  [`mqtt.to`](/flux/v0.x/stdlib/experimental/mqtt/to/).

### Bug fixes
- Add `range()` before `window()` to set query time bounds in tests.
- Use a new `Fresher` instance for each package.

---

## v0.132.0 [2021-09-28]

### Features
- Copy location-related code from the Go `time` package.
- Create a `Vector` monotype.
- Refactor and optimize [`derivative()` transformation](/flux/v0.x/stdlib/universe/derivative/).
- Add new [InfluxDB sample datasets](/flux/v0.x/stdlib/influxdata/influxdb/sample/data/#available-influxdb-sample-datasets)
  and [`sample.alignToNow()`](/flux/v0.x/stdlib/influxdata/influxdb/sample/aligntonow/).
- Allow query concurrency to be set to the number of nodes in the graph.

### Bug fixes
- Update null check with clear error message.
- Report errors from function parameters.
- Propagate all inferred properties to a function argument.
- Fix `Staticcheck` linter in `executetest`.
- Reformat non-formatted Flux files.
- Make builds reproducible by ordering package members in the `doc` package.
- Prevent the optimized `derivative()` from attempt to replicate a non-existent bug.
- Update [`events.duration()`](/flux/v0.x/stdlib/contrib/tomhollingworth/events/duration/)
  to properly handle multiple buffers.

---

## v0.131.0 [2021-09-20]

### Features
- Update `group` to use new `GroupTransformation` interface.
- Add [`experimental/record` package](/flux/v0.x/stdlib/experimental/record/).
- Embed compiled Flux standard library instead of compiling at runtime.
- Add [`contrib/bonitoo-io/hex` package](/flux/v0.x/stdlib/contrib/bonitoo-io/hex/)
  to work with hexadecimal string values.

### Bug fixes
- Disallow setting [`allowAllFiles` parameter](https://github.com/go-sql-driver/mysql#allowallfiles)
  in [MySQL DSNs](/flux/v0.x/query-data/sql/mysql/#mysql-data-source-name).
- Downgrade [Snowflake](/flux/v0.x/query-data/sql/snowflake/) version.
- Add _null_ support to optimized `repeat` function.

---

## v0.130.0 [2021-09-15]

### Features
- Add narrow state transformation transport.

---

## v0.129.0 [2021-09-14]

### Features
- Make `flux-dump-docs` use a nested documentation structure.

### Bug fixes
- Add `boolean` package to prelude.
- Delete obsolete Go formatter code.
- Fix `unknown type` panic when using `difference()`.

---

## v0.128.0 [2021-09-07]

### Features
- Add [`sampledata` package](/flux/v0.x/stdlib/sampledata/) with basic sample datasets.
- Add `GroupTransformation` transport.

---

## v0.127.3 [2021-09-01]

### Bug fixes
- Add `FormatDuration` method that can be exported in other repositories.

---

## v0.127.2 [2021-09-01]

### Bug fixes
- Remove `flux wasm` crate and moved it to `lsp`.
- Delete obsolete packages.
- Add `_time` to status sorting.
- Fix panic with `unknown type invalid` in `reduce()` function.

---

## v0.127.1 [2021-08-30]

### Bug fixes
- `limit()` correctly resets the offset after processing a partial buffer.

---

## v0.127.0 [2021-08-26]

### Features
- Create an executable to retrieve all `stdlib` documentation and updated WASM functions.
- Implement `transport` in aggregate transformations.
- Add documentation site links and fix `flux_types` issue.

### Bug fixes
- `fill()` function fails when the specified fill column doesn't exist.
- Add `link` parameter to function structs.

---

## v0.126.0 [2021-08-19]

### Features
- Update `filter()` to use narrow transformation.

### Bug fixes
- Return JSON for WASM.
- Check both dynamic types and static values in `strings` package.
- Check both dynamic types and static values in `regexp` package.
- Change `die` error code to invalid.

---

## v0.125.0 [2021-08-11]

### Features
- Add feature flag library as an internal package.
- Add narrow transformation transport.
- Add transport-aware dataset.
- Simplify the transport interface and add a transformation adapter.
- Add [`contrib/sranka/webexteams` package](/flux/v0.x/stdlib/contrib/sranka/webexteams/).
- Add optimized repeat function for arrow arrays.
- Add two additional internal message types.

### Bug fixes
- Update transformation adapter to return an error when receiving a flush key
  for a table that is not present.
- Fix pivot operations when no data is left to operate on.
- Update `join()` to produce columns of equivalent length when combining mismatched schemas.

## v0.124.0 [2021-08-03]

### Features
- Update the string array builder to support constant data.
- Expand message interface with message lifetime controls.
- Create internal Flux array package.

### Bug fixes
- Register `sortedPivot` and update `sortedPivot` kind.
- Derive `Copy` on `ast::Position`.
- Update `to()` function to properly close the writer on error.
- Update `libflux` include paths to use `pkg-config`.
- Properly copy record types with no `extends` parameter.

---

## v0.123.0 [2021-07-19]

### Breaking changes
- Remove the [`sleep()` function](/flux/v0.x/stdlib/universe/sleep/).

### Features
- Optimize [`pivot()` transformation](/flux/v0.x/stdlib/universe/pivot/).
- Add [InfluxDB sample data package](/flux/v0.x/stdlib/influxdata/influxdb/sample/).
- Use `table.fill()` when `aggregateWindow(createEmpty: true)` is used.

---

## v0.122.0 [2021-07-13]

### Features
- Add `--skip` flag to the `flux test` command to skip specific tests.

---

## v0.121.0 [2021-07-12]

### Features
- Update [`experimental.to()`](/flux/v0.x/stdlib/experimental/to/)
  to use the Flux `influxdb` provider.

---

## v0.120.1 [2021-07-06]
- _Add inline Flux function documentation._

---

## v0.120.0 [2021-07-06]

### Features
- Bootstrap documentation methods.

### Bug fixes
- Reverse [`math.atan2()`](/flux/v0.x/stdlib/math/atan2/) parameters.
- Fix documentation headers in `stdlib`.
- Distinct `testcase` should not use `testing.load()`.
- `movingAverage()` creates columns with the same length when `n` is the size of the input.
- Allow work queue to be resized when work exceeds queue length.
- `distinct()` appends null values without creating invalid tables.

---

## v0.119.1 [2021-06-29]
- _Add inline Flux function documentation._

---


## v0.118.1 [2021-06-15]
- _Internal code cleanup._

---

## v0.118.0 [2021-06-15]

###  Features
- Add `exclude` parameter to `pagerduty.dedupKey()`.

### Bug fixes
- Ensure PagerDuty tests include a `_value` column.
- Add length check to CSV annotation parsing.
- Change `FunctionLiteral` precedence to preserve parentheses.

---

## v0.117.3 [2021-06-07]
- _Internal code cleanup._

---

## v0.117.2 [2021-06-07]

### Bug fixes
- Remove `tabstop` processing from formatter.
- Support dividing IEEE float values by zero.
- Fix multiline collapse when formatting function parameters.
- Reclassify `map type` error as `user` error.
- Fix acceptance tests to catch different timestamps.

---

## v0.117.1 [2021-06-01]

### Bug fixes
- Update `group_no_agg_table` acceptance test to run in a consistent order.
- Remove `xcc.sh` release dependency.
- Fix `staticcheck` linter failures.
- Replace erroneous line deletions.

---

## v0.117.0 [2021-05-24]

### Features
- [`to()`](/flux/v0.x/stdlib/influxdata/influxdb/to/) function
  writes to a remote InfluxDB instance.

### Bug fixes
- Fix unexpected behavior caused by going over the Go/Rust boundary multiple times using JSON serialization.
- Update `Assert_eq!` output.
- Update `comrak` dependency.
- Set `CARGO_HOME` after removing privileges.
- Log uneven columns found when processing tables.
- Audit and clean up the Docker build image.
- Switch default InfluxDB port from `9999` to `8086`.
- Add tests for window offset behavior.
- Update formatting for conditional expressions.
- Fix string interpolation for basic types.

---

## v0.116.0 [2021-05-17]

## Features
- Add Jaeger tracing information to profile metadata.
- Add `flux fmt` step to the continuous integration pipeline.
- Update the `window` implementation to use `interval.Window`.
- Add [`today()` function](/flux/v0.x/stdlib/universe/today/).

## Bug fixes
- Remove deadlock when an error occurs while the dispatcher is stopping.
- Prevent errors caused by the the auto-formatter removing brackets around `if` expressions.
- Auto-format remaining Flux files.

---

## v0.115.0 [2021-05-11]

### Features
- Add [Alerta notifications support](/flux/v0.x/stdlib/contrib/bonitoo-io/alerta/).
- Add [`table.fill()` function](/flux/v0.x/stdlib/experimental/table/fill/)
  to fill empty tables with a single row.
- Add string formatting to `dict` type.

### Bug fixes
- Refactor semantic printing of types.
- Do not remove escape characters when auto-formatting.
- Add `0.0.0.0` to URL validator.
- Add new display API for values.
- Auto-format Flux files in `stdlib/testing`.

---

## v0.114.1 [2021-05-04]

### Bug fixes
- Upgrade `mssqldb` dependency for Go 1.16.
- Format Flux files in `stdlib`.

---

## v0.114.0 [2021-05-03]

### Features
- Add `debug.slurp()` and `debug.sink()`.
- Add [`experimental/influxdb`](/flux/v0.x/stdlib/experimental/influxdb/)
  and [`experimental/usage`](/flux/v0.x/stdlib/experimental/usage/) packages.
- Add `fmt` subcommand to the `flux` CLI to apply formatting to Flux files.

### Bug fixes
- Format Flux files in `stdlib` and `stdlib/testing`.
- Update the macOS SDK for Go 1.16.
- Revert check for uneven columns.
- Wait for the dispatcher to finish before finishing query.
- Remove `codecov` job.

## v0.113.0 [2021-04-21]

### Features
- Add ported table test.
- Create `astutil` package for AST utilities such as formatting.

### Bug fixes
- Update expected output for acceptance test `group_no_agg_table`.

---

## v0.112.1 [2021-04-12]

### Bug fixes
- Add `Comment` fields to Go AST structs to preserve comments in the AST.

----

## v0.112.0 [2021-04-06]

### Features
- Add [`testing.load`](/flux/v0.x/stdlib/testing/load/) for using raw tables in tests.
- Add remaining experimental built-in types without column parameters.
- Add [OEE (overall equipment effectiveness) package](/flux/v0.x/stdlib/experimental/oee/).

### Bug fixes
- Use new crate name in `buildinfo`.
- Add bounded time ranges to fix test cases.
- Move `derive` helper attribute after `derive` macro.

---

## v0.111.0 [2021-03-30]

### Features
- Use `FnvHasher` for hash maps.
- Add [`tickscript` package](/flux/v0.x/stdlib/contrib/bonitoo-io/tickscript/).

### Bug fixes
- When finding the parent directory's root, skip the current directory.
- Fix `if else` statement in `aggregate.window()`.

---

## v0.109.1 [2021-03-24]

### Bug fixes
- Perform testing checks as part of query `done`.
- Delimited multi-result encoder properly releases results before checking for errors.

---

## v0.109.0 [2021-03-23]

### Features
- Add support for null values in string interpolation.
- Add support for all basic datatypes in string interpolation.
- Add support for parsing CSV files without annotations.
- Support formatting the AST from `libflux`.

### Bug fixes
- Add error handling for wrong number of fields for raw CSV.
- Change Rust version to be updated manually.

---

## v0.108.1 [2021-03-15]
- _Internal code cleanup._

---

## v0.108.0 [2021-03-15]

### Features
- Add [BigPanda notification support](/flux/v0.x/stdlib/contrib/rhajek/bigpanda/).
- Add [Zenoss notifications support](/flux/v0.x/stdlib/contrib/bonitoo-io/zenoss/).
- Add [VictorOps notifications support](/flux/v0.x/stdlib/contrib/bonitoo-io/victorops/).

### Bug fixes
- Classify "Option not found error" as internal.
- Remove `as_user` parameter from `slack.message` payload.

## v0.107.0 [2021-03-09]

### Features
- Add new [`experimental.kaufmansAMA()` function](/flux/v0.x/stdlib/experimental/kaufmansama/) signature.
- Add new [experimental aggregate function](/flux/v0.x/stdlib/experimental/#experimental-functions) signatures.
- Add `extends` capability to `testcase` block to extend tests using a relative path to another file.

### Bug fixes
- Update CSV package to handle large files.
- Add tests and fix the `NoHeader` configuration for the `csv` decoder.
- Remove `interval` package and documentation.
- Disable line wrap linter.
- Fix typo in comment.

---

## v0.106.0 [2021-02-22]

### Features
- Add new [experimental `integral()` function](/flux/v0.x/stdlib/experimental/integral/) signature.
- Add new [experimental `window()` function](/flux/v0.x/stdlib/experimental/window/) signature.

# Bug fixes
- Switch from `HashMap` to `BTreeMap` in the conversion functions from AST to semantic.
- Track and reduce memory used by `tdigest`.
- Detect and break infinite loops while parsing arrays.

---

## v0.105.0 [2021-02-03]

### Features
- Add `interval` package to `window` transformation.

---

## v0.104.0 [2021-02-02]

### Features
- Reintroduce `IsZero` method on time windows.

### Bug fixes
- Break parse loop when invalid array item is found.

---

## v0.103.0 [2021-02-01]

### Features
- Add `testing/expect` package for test expectations.

### Bug fixes
- Change the default test discovery path from `./stdlib` to `.`.

---

## v0.102.0 [2021-01-25]

### Features
- Add `fluxdoc` command to generate JSON and HTML from Flux source code.
- Improve performance of random access group lookup by utilizing `xxhash`.
- Improve performance for accessing data within a `Value`.

### Bug fixes
- Clean up `interval` package.

---

## v0.101.0 [2021-01-19]

### Features
- Validate IP addresses from the dialer `Control` function.
- Expose `test` command to be used by external libraries.

---

## v0.100.0 [2021-01-07]

### Features
- Add ability to execute tests from `.tar` and `.zip` archives.

### Bug fixes
- Fix endpoint examples in source code.

---

## v0.99.0 [2020-12-14]

### Features
- Evaluate [dictionary literals](/flux/v0.x/spec/expressions/#dictionary-literals).
- Infer the type of dictionary literals.
- Parse and format dictionary literals.
- Add a pure Flux test runner.

### Bug fixes
- Ensure `csv.from()` only returns one result.
- Change `extern` parsing code to return a more descriptive error message.
- Do not allow containers within a record to be null.
- Retrieve `now` option before running a Flux script.
- Fix misspellings in the [Flux README](https://github.com/influxdata/flux/blob/master/README.md).

---

## v0.98.0 [2020-12-07]

### Features
- Transform `testcase` AST into pure flux.
- Added Rust scanner.

### Bug fixes
- Substring method now works on more indices.
- Fix typos in `Dockerfile_build`.

---

## v0.97.0 [2020-12-01]

### Features
- Add dict package for interacting with dictionaries.
- Added Ragel 7 to the Dockerfiles.
- Add support for `testcase` statement.
- Add Dictionary type syntax.
- Add Dictionary type unification rule.

---

## v0.96.0 [2020-11-23]

### Features
- Create a Dictionary type interface and implementation.
- Add Dictionary type (dict) to the semantic flatbuffers.

---

## v0.95.0 [2020-11-16]

### Features
- Use `tabwriter` to vertically align tab stops.

### Bug fixes
- Format types in error messages according to Flux grammar.

---

## v0.94.0 [2020-11-09]

### Features
- Add "everything" Rust benchmark.

### Bug fixes
- Add multiline support to the Flux formatter.
- Format types using letters instead of numbers.

---

## v0.93.0 [2020-11-02]

### Features
- Ensure query plan nodes have unique IDs.

---

## v0.92.0 [2020-10-30]

### Features
- Add `fluxinit` package as an alternative to importing `builtin`.
- Add [series `cardinality()` function](/flux/v0.x/stdlib/influxdata/influxdb/cardinality/) to InfluxDB package.

### Bug fixes
- Do not panic when the value column for `pivot()` does not exist.
- Properly truncate timestamps to beginning of window bounds.
- Updates operator precedence in formatter.
- Do not panic when a string expression evaluates to _null_.
- Add support for multiline conditional logic.

---

## v0.91.0 [2020-10-26]

### Features
- Aggregate results for `operator` profiler.
- Add contributed [`events` package](/flux/v0.x/stdlib/contrib/tomhollingworth/events/).
- Use `tableFind` and related functions with profiler results.
- Add duration support to [`orTime` parameter](/flux/v0.x/stdlib/influxdata/influxdb/tasks/lastsuccess/#ortime)
  of `lastSuccess()`.

### Bug fixes
- Configure the profiler even if `operator` profiler is not enabled.
- Update formatter to handle newline characters in `write_string`.
- Make formatter use spaces instead of tabs.
- Update formatter double spacing rules.
- Add support for multiline type expressions.
- Update `influxdata/influxdb/tasks` package with new location of `execute` dependencies.
- Improve multiline and parentheses support in formatter.

---

## v0.90.0 [2020-10-19]

### Features
- Add [Sensu package](/flux/v0.x/stdlib/contrib/sranka/sensu).

### Bug fixes
- Verify dependencies in `Dockerfile_build`.
- Fix panic in `experimental.join`.

---

## v0.89.0 [2020-10-12]

### Features
- Add support for SAP HANA databases.
- Add support for comments preceding `builtin` statements in code formatting.

---

## v0.88.0 [2020-10-05]

### Features
- Move functions from `v1` package to `schema` package.

### Bug fixes
- Fix field type error in test.
- Update buildinfo script to handle new and deleted files.
- Sets default quantile method when not specified.
- Improve security of Dockerfile for build scripts.

---

## v0.87.1 [2020-10-01]

### Bug fixes
- Fetch ragel dependency over HTTPS.
- Ensure `ast.TextPart` is properly escaped when formatting.
- Elapsed with multiple buffers per table.

---

## v0.87.0 [2020-09-28]

### Features
- Linear interpolation.
- Type signature for linear interpolate function.

### Bug fixes
- Fix compiler type inference with extended records.
- Colm Flux grammar updates: keywords, string interpolation, and UTF-8 IDs.
- Exponent operator have higher precedence.

---

## v0.86.0 [2020-09-21]

### Features
- Add operator profiler.
- Add duration conversion.
- Add naive bayes classification.

### Bug fixes
- Reset pointer after scanning invalid Unicode.
- Catch references to non-existent columns.
- Propagate span context to `source.Run`.

---

## v0.85.0 [2020-09-14]

### Features
- Add `Aggregate.window` for an alternative windowing aggregate.

### Bug fixes
- Remove months parameter.

---

## v0.84.0 [2020-09-09]

### Breaking changes
- Remove time-column parameters from `range()` function and update type signature.

### Features
- Add [Opsgenie package](/flux/v0.x/stdlib/contrib/sranka/opsgenie/).
- Implement [`lastSuccess()`](/flux/v0.x/stdlib/influxdata/influxdb/tasks/lastsuccess/) in the `tasks` package.
- Support duration values in `aggregateWindow`.
- Update Apache Arrow to 1.0.1.

### Bug fixes
- Ensure meta columns are never part of group key.

---

## v0.83.1 [2020-09-02]

### Bug fixes
- Single value integral interpolation.

---

## v0.83.0 [2020-09-01]

### Features
- Improve window errors.
- Add [BigQuery](https://cloud.google.com/bigquery) support to
  [`sql` package](/flux/v0.x/stdlib/sql/).
- Add `TypeExpression` to `BuiltinStmt` and fix tests.
- Add time-weighted average ([`timeWeightedAvg()` function](/flux/v0.x/stdlib/universe/timeweightedavg/)).
- Update [`integral()`](/flux/v0.x/stdlib/universe/integral/)
  with linear interpolation.
- Make experimental tracing an attribute of the context.

### Bug fixes
- Update builtin statement for `integral()`.
- Add Rust JSON tests.
- CSV no longer deadlocks when next transformation does not consume table.

---

## v0.82.2 [2020-08-25]

### Features
- Add [`tasks.lastSuccess` function](/flux/v0.x/stdlib/influxdata/influxdb/tasks/lastsuccess/)
  to retrieve the time of the last successful run of an InfluxDB task.

---

## v0.82.1 [2020-08-25]
- _Internal code cleanup._

---

## v0.82.0 [2020-08-24]

### Features
- Add the [`profiler` package](/flux/v0.x/stdlib/profiler/).
- Add a documentation URL field to Flux errors.
- Check InfluxDB schema compatibility.

### Bug fixes
- Panic when a map object property contains an invalid type.

---

## v0.81.0 [2020-08-17]

### Features
- Delete old parser.
- Add function to indicate duplicate option assignments.

### Bug fixes
- Calculate distinct key values.
- Handle pipe arguments inside of compiler.

---

## v0.80.0 [2020-08-12]

### Features
- Add `nulls` parameter to `gen.tables()`.

### Bug fixes
- Revert the timeable constraint for integer.
- Make socket/sql URL test robust.

---

## v0.79.0 [2020-08-11]

### Features
- Add `array.from()` function to convert Flux values into a table.

### Bug fixes
- Add bounds to Geo package end-to-end tests.

---

## v0.78.0 [2020-08-10]

### Breaking changes
- Removed `correlationKey` parameter from `geo.toRows` and `geo.shapeData`.

### Features
- Add functions to convert semantic monotype to AST type.
- Add BigQuery support.
- Rust flatbuffer serialization for `MonoType` and `TypeExpression`.
- Extend with Geo package with GIS functions and
  [unit support](/flux/v0.x/stdlib/experimental/geo/#distance-units).

### Bug fixes
- String interpolation in arrays.

---

## v0.77.1 [2020-08-03]

### Bug fixes
- Write tests and fix issues with `rows.map`.

---

## v0.77.0 [2020-08-03]

### Features
- Add a faster [`map()` function](/flux/v0.x/stdlib/contrib/jsternberg/rows/map/) _(user-contributed)_.
- Add an [`influxdb.select()` function](/flux/v0.x/stdlib/contrib/jsternberg/influxdb/select/) _(user-contributed)_.
- Flatbuffer deserialization for type expression AST nodes.
- Flatbuffer types for monotype and type expression AST nodes.
- Go AST nodes for type expression syntax.
- Get all options and properties.
- Add `parse_function` in `parser/mod.rs`.
- Add an alternative aggregate package to user-contributed packages.

### Bug fixes
- Fix string interpolation in arrays.

---

## v0.76.1 [2020-07-27]

### Bug fixes
- Fix data race in metadata.

---

## v0.76.0 [2020-07-27]

### Features
- Add query plan to query metadata.

---

## v0.75.0 [2020-07-27]

###  Features
- Update `parse_record` to return `MonoType` for consistent results from functions
  used by `parse_monotype`.
- Internal command utility for comparing CSV tables.
- Update `mod.rs` with `parse_record`.
- Add planner tests for window min and max.
- CRUD options and properties.
- Update `mod.rs` with `parse_constraints`.
- Update `mod.rs` with `ArrayType` and add `Array` to the `Monotype` enumeration.

### Bug fixes
- Statuses are always sorted by source timestamp.
- Multiple `do` calls will fail with an empty table.

---

## v0.74.0 [2020-07-21]

### Features
- Add `discord.endpoint()` function.
- Enhance the static table API.
- Update `mod.rs` with `parse_type_expression` and other supporting functions.
- Expose static table package and table diff functions.
- `Find_var_type()` API.
- Add `stringify` method for a table and a diff utility.
- Added range to end-to-end tests.
- Add types grammar to SPEC.

### Bug fixes
- Normalize Monotype.

---

## v0.73.0 [2020-07-13]

### Features
- Add parameter for applying substitution to top-level environment.
- Add MergeFilterRule to `universe.filter`

### Bug fixes
- Use query strings instead of AST for remote InfluxDB queries.
  This lets you query remote InfluxDB instances in the Flux REPL.

---

## v0.72.1 [2020-07-09]

### Bug fixes
- Correctly classify "duplicate yield" error.

---

## v0.72.0 [2020-07-09]

### Features
- Update `from()` to use `Timeable`.

### Bug fixes
- Fix appending an array of booleans with null values.
- Pass the context to the planner when using the table object compiler.
- Add `diff` output to release script on error.
- Appending empty tables to a buffered builder normalizes the schema.
- Remove `bad_sqlite_path1` test.
- Classify spec build errors as user errors.
- Verify index expression bounds in evaluation.
- Substitute array element types correctly.

---

## v0.71.1 [2020-07-03]

### Bug fixes
- Add a check to ensure `every` is non-negative.

---

## v0.71.0 [2020-06-30]

### Features
- Apply `Timeable` constraint to integer type to support integer values in
  time-related function parameters.
- Implement schema mutation functions without performing any copies.
- Add [`http.pathEscape()` function](/flux/v0.x/stdlib/http/pathescape/).

---

## v0.70.0 [2020-06-29]
### Features
- Update all `date` functions to accept time and duration types.
- Add [Microsoft Teams package](/flux/v0.x/stdlib/contrib/sranka/teams/).
- Evaluate and store `now` in execution dependencies for `tableFind()`.
- Add `Timeable` constraint for time and duration types.
- Add [SQL Server support](/flux/v0.x/stdlib/sql/from/#query-a-sql-server-database) to `sql` package.
- Add [Telegram package](/flux/v0.x/stdlib/contrib/sranka/telegram/).
- Add [Amazon Athena support](/flux/v0.x/stdlib/sql/from/#query-an-amazon-athena-database) to `sql` package.
- Add support for macOS builds.

### Bug fixes
- Move semantic analysis to the finalize step.
- Fix check for stream equality.
- Fix the compiler's return type when `with` operator is used.
- Include `stdlib` Flux dependencies from the Flux `build.rs`.
- Include a hash of the sources for `libflux`.
- Flux test for [experimental `json.parse()`](/flux/v0.x/stdlib/experimental/json/parse/).
- Reorder `go generate` call to `libflux` in `stdlib`.

---

## v0.69.2 [2020-06-10]

### Bug fixes
- Include a hash of sources for `libflux`.

---

## v0.69.1 [2020-06-09]

### Bug fixes
- Fix experimental `json.parse()` test.

---

## v0.69.0 [2020-06-08]

### Features
- Add [Discord package](/flux/v0.x/stdlib/contrib/chobbs/discord/)
  _(contributed by [@chobbs](https://github.com/chobbs))_.
- Add [`json.parse()` function](/flux/v0.x/stdlib/experimental/json/parse/).

### Bug fixes
- Adjust error handling in Flux `date` package.

---

## v0.68.0 [2020-05-28]
This version of Flux introduces an updated type inference system that improves
performance, error messaging, and usability of the
[Flux Language Server Protocol (LSP)](https://github.com/influxdata/flux-lsp).

### Breaking Changes
- Change signature of `group()` function.

### Features
- Add [`fieldKeys()`](/flux/v0.x/stdlib/influxdata/influxdb/v1/fieldkeys/) and
  [`measurementFieldKeys()`](/flux/v0.x/stdlib/influxdata/influxdb/v1/measurementfieldkeys/)
  to v1 package.
- Add a context to `plantest.RuleTestCase`.
- Add Snowflake support to SQL package.
- Add [`experimental.chain()`](/flux/v0.x/stdlib/experimental/chain/) function.
- Add semantic nodes for bad statement and bad expression.
- Add [`findColumn()`](/flux/v0.x/stdlib/universe/findcolumn/)
  and [`findRecord()`](/flux/v0.x/stdlib/universe/findrecord/) functions.
- Return `false` if `contains()` is called with an empty set.
- Various performance optimizations.
- Add a dynamically linked Valgrind test.
- Add location information to type error messages.
- Add all Linux cross-compilation tools to release Docker image.
- Support remote `buckets()` and `v1.databases()` calls.
- Add support for static linking.
- Add `influxdb` source.
- Add support for `pkg-config`.
- Transform semantic nodes back to AST nodes.
- Handle multi-file packages.
- Make `Eval()` and `EvalAST()` use libflux for parsing and analysis.
- Add `lookuptype` function for stdlib builtins.

### Bug Fixes
- Re-enable Clippy linter rule match single binding.
- Fix bug in object equal method.
- Add builtin formatting.
- Implement `TimeBounds` for `influxdb.fromRemote`.
- Inject the URL validator into `NewDefaultClient`.
- Fix race condition in the `filter()` function.
- Validate HTTP redirects against private IPs.
- Hide DNS information in HTTP.
- Fix concurrent map write in `filter()` transformation.
- Copy all fields of `WindowProcedureSpec` in `Copy()`.
- Run `go generate` on libflux when `go generate` is run on stdlib.
- Fix panic when `map()` overwrites group column.
- Support execution contexts in the REPL.
- Apply substitution fully when compiling lambda.
- Planner rewrite rules take a context.
- Fix panics when functions operate on null values.
- Fix logic for merging packages with no package clause.
- Compute function's return type after substitution.
- Resolve member expressions.
- Improve error message descriptions.
- Check types of parts when evaluating `StringExpression`.
- Bind appropriate interpreter when evaluating functions.
- Tweak Rust JSON serialization and add tests.
- Pivot sends update watermark and processing time exactly once.
- Calculate diff's watermark using both predecessors.
- Add length check to avoid allocs checking for JSON `null`.
- Make compilers robust to `null` keyword in `extern` field.
- Address issues in `RemoveTrivialFilterRule`.
- Bind appropriate interpreter when evaluating functions.
- Convert `HashMap` in semantic package to `BTreeMap`.
- Use static linking when creating the Valgrind test.
- Update `flatbuffers` dependency.
- Fix JSON serialization of Rust AST.
- Remove unused environment variables.
- Make `merge_packages` allow no package clauses.
- Do not call `CheckKind` when evaluating logical expressions.
- Force the Go libflux wrapper to rebuild using `go generate`.
- Adjust `test-bench` config for Circle CI.
- Fix Valgrind test code.
- Let Rust parser parse with file name.
- Remove Algorithm-W to-do list.
- `JoinStr` returns a string, not an empty record.
- Only add visible properties to output of `map()`.
- Serialize the correct sign duration literal.
- Remove code in semantic package that depends on Rust/Cgo code.
- Remove `component` field from API.
- Remove unused notification rule fields from Slack and PagerDuty APIs.
- Array builders accept array types as input.
- Enable `map()` tests with null values.
- Remove tests for marshalling semantic graph.
- Run `make generate` to generate stdlib.
- Fix type error in benchmark test.
- Update `TableObject` test.
- Do not call `LocalRange` on nil scope.
- Type assertion error in `length()` tests.
- Update type inference test case with test for `union()`.
- Make non-test CI steps pass.
- Fix semantic check for option reassignment.
- Type inference tests for binary comparison operators.
- Fix typo in builtins.
- Update `holtWinters()` to make `seasonality` optional.
- Fix type errors in tests.
- Remove default value from notify data.
- Allow options to be set in scope.
- Replace `ScopeComparer` with `ScopeTransformer`.
- Use `LocalRange` in compile tests.
- Add missing parameter to type of `to()`.
- Get `TableObject` test case to compile.
- Fix typo in test case.
- Update `TableObjects` to type `Array`.
- Use array type method correctly.
- Update schema mutators.
- Return proper types for type conversion functions.
- Enable complete package to compile and pass tests.
- Make stdlib compile.
- Expect monotypes for function values.
- Require successful lookup of stdlib builtins or panic.
- Optimize lookup function using hashmap.
- Include function type when deserializing function expressions.

---

## v0.67.0 [2020-04-28]

### Features
- Planner Pattern interface supplies a set of ProcedureKind as root.
- Initial prototype of a table-based Flux.
- Evaluate and store "now" in execution dependencies for `tableFind()` to use.
- Static analysis tool for listing entry points to Flux.
- Pass context to rewrite rules in the planner.

### Bug fixes
- Pivot sends update watermark and processing time exactly once.
- `system.time()` checks context for override.
- Add bounds to alignTime tests.

---

## v0.66.1 [2020-04-14]

### Bug fixes
- Add bounds to `alignTime()` tests.

---

## v0.66.0 [2020-04-13]

### Features
- Add [`epsilon` parameter](/flux/v0.x/stdlib/testing/diff/#epsilon) to `testing.diff()`.
- Add [`experimental.alignTime()` function](/flux/v0.x/stdlib/experimental/aligntime/).
- Add random access group lookup.
- Add [Pushbullet package](/flux/v0.x/stdlib/pushbullet/).
- Add a helper for testing `execute.Source`.

### Bug fixes
- Use RandomAccessGroupLookup in `testing.diff()`.
- Address deleted state `GroupLookup`.
- Add test case for errors when AST is bad.
- Reduce memory usage during CI testing.

---

## v0.65.0 [2020-03-27]

### Features
- Add [`experimental.join()`](/flux/v0.x/stdlib/experimental/join/) function.
- Store comments in the AST and preserve on format.
- Add [`shapeData()`](/flux/v0.x/stdlib/experimental/geo/shapedata/) function to Geo package.
- Expose format to Wasm users.

### Bug fixes
- Reimplement `stateChanges()` function.
- Remove the `set -x` in the xcc script.
- Publishes Flux as a public npm package.
- Pivot message passing.

---

## v0.64.0 [2020-03-11]

### Features
- Hand-transpile `elapsed()` aggregate.
- Hand-transpile `cumulative_sum()`.
- Experimental `csv` package.

### Bug fixes
- Add response reader as dependency to tune response size.
- Handle unfinished option statement without panic.
- Simplify libflux C API and resolve memory leaks.
- Don't construct a `compiler.compilerScope` with a nil `value.Scope` as base.
- Influxql-decode to handle the case without tag set.

---

## v0.63.0 [2020-03-03]

### Features
- Experimental `geo` package.
- Initial grammar for Flux and a partial grammar for InfluxQL.

---

## v0.62.0 [2020-02-28]

### Features
- InfluxQL decode and series aggregation tests.

### Bug fixes
- Properly categorize parse errors as "invalid".
- Fail gracefully when `tableFind` does not have an execution context.

---

## v0.61.0 [2020-02-21]

### Features
- Add experimental aggregate package with `rate()` function.

### Bug fixes
- Deserialize the default vector if array elements are null.
- Allow array and row types to be equatable.

---

## v0.60.0 [2020-02-19]

### Features
- Add experimental `query` package.
- Create a Docker environment for Flux releases.
- Validate there are no free type variables in prelude/stdlib build.
- Add formatter library.

### Bug fixes
- `derivative()` works properly across multiple buffers.
- Fix free type variable found in `tripleExponentialDerivative()`.
- Update type of `window()` function.
- Freshen row types using deterministic property order.
- Libflux JSON deserialization uses type properly.
- Expose the builtin polytypes when analyzing a `stdlib` package.
- Deserialize call expressions when arguments are missing.
- Handled malformed data as well as EOF.
- Allow unsigned integers to be subtractable.
- Link both `libflux` and `liblibstd` for flux-config.
- Link `libstd` into the `lib` directory instead of `libflux`.
- Flux-config correctly copies `stdlib` when using a module.
- Add 169.254/16 range to URL validator.
- Update `uuid` library to improve security.
- Handle invalid string literals.
- Remove 'tags' line from local tags.

---

## v0.59.6 [2020-02-13]

### Bug fixes
- `derivative()` works properly across multiple buffers.

---

## v0.59.5 [2020-01-24]

### Bug fixes
- Revert window optimizations to fix regression in output row sorting.

---

## v0.59.4 [2020-01-21]

### Bug fixes
- Remove `tags` line from local tags.
- Handle malformed data as well as EOF.

---

## v0.59.3 [2020-01-16]

### Bug fixes
- Link both `libflux` and `libstd` for flux-config.

---

## v0.59.2 [2020-01-16]

### Bug fixes
- Link `libstd` into the lib directory instead of `libflux`.

---

## v0.59.1 [2020-01-16]

### Bug fixes
- Flux-config correctly copies `stdlib` when using a module.
- UUID security.

---

## v0.59.0 [2020-01-14]

### Features
- Add Go/Rust API for getting semantic graph.
- Optimize `limit()` transformation.
- Optimize `group()` transformation.

### Bug fixes
- AST json serialization glitches.
- Better messaging for malformed CSV.
- Skip stdlib symlink was removed erroneously.
- Ensure stdlib directory is created.
- Correctly skip the stdlib symlink in libflux.
- Ensure that stdlib is present when building with flux-config.

---

## v0.58.4 [2020-01-07]

### Bug fixes
- Skip stdlib symlink was removed erroneously.

---

## v0.58.3 [2020-01-07]

### Bug fixes
- Ensure stdlib directory is created.

---

## v0.58.2 [2020-01-07]

### Bug fixes
- Correctly skip the stdlib symlink in libflux.

---

## v0.58.1 [2020-01-07]

### Bug fixes
- Ensure that stdlib is present when building with flux-config.

---

## v0.58.0 [2020-01-06]

### Features
- Serialize semantic graph flatbuffers.
- Implement `onEmpty` parameter for `filter()`.
- Serialize Flux standard library types as part of build process.
- Add type declarations for universe.
- Methods for type checking package dependencies.
- Add type declarations for strings.

### Bug fixes
- Expose tracing flag.
- Update `count` builtin type.
- Update `experimental.set` builtin type.
- Update the type of `influxdb.to` to be a passthrough.
- Update `fill` builtin type.
- Remove redundant clones found by a new version of Clippy.
- Fix durations in Rust semantic graph.
- Removes unnecessary rc clone in semantic serializer.
- Do not stall forever in flux-config when an error happens with verbose.
- Update function block return statements to produce a stmt and not an expression.
- Fix token location for `scan_with_regex`.
- Cache environment variable for performance.
- Fix a couple errors in builtin types.
- Annotate variable assignment with polytype (not monotype).

---

## v0.57.0 [2019-12-10]

### Features
- Categorize more Flux errors with codes.
- Teach flux-config how to download the sources when using vendor.
- Opentracing in query execution runtime.
- Reduce memory allocations for operations in values.
- Translate FlatBuffers semantic graph to Go.
- Add types for some universe builtins.
- Add type declarations for builtins.
- Add Numeric and Row kind constraints.

### Bug fixes
- Enable strict mode by default.

---

## v0.56.0 [2019-12-05]

### Features
- Crate for typing Flux standard library.
- Serialize type environment.
- Improve filter performance when filtering on values.
- Update usage duration test to exclude queue and requeue time.
- Add types for some built-ins.
- Add `timeout` parameter to experimental `http.get()`.

### Bug fixes
- Properly use a fake version with `flux-config` when no version is present.
- Address Clippy lints.
- Add bytes monotype to Rust semantic module.
- Allow underscores (`_`) in type expressions.

---

## v0.55.1 [2019-12-02]

### Bug fixes
- Fix e2e usage test so that their queries are properly pushed down.

---

## v0.55.0 [2019-12-02]

### Breaking changes
- Expand the interface for `BufferedTable`.

### Features
- Expose optimized `pivot()` function.
- Create utility program for building `libflux`.
- Create a tool that measures performance of calling Rust from Go.
- Inject types in the semantic graph.
- MonoType and PolyType flatbuffer encodings.
- MonoType and PolyType flatbuffer schemas.
- Update Rust flatbuffers to more closely match Rust semantic graph.
- Flatbuffers AST to Go AST.
- Port immutable walk and fix mutable walk.
- Define the flatbuffers schema for semantic graph.
- Infer imported package types.
- Unify and infer function types.
- Add support for safely converting bytes to strings.
- Add sqlite3 support.
- Add internal table utility for streaming tables.

### Bug fixes
- Update semantic graph FlatBuffers schema for identifiers.
- Ignore order when comparing record types.
- Operands for `<=` and `>=` are comparable AND equatable.
- Constrain unary expressions to be same type as operand.

---

## v0.54.0 [2019-11-11]

### Features
- Expose function to analyze from string.
- Added semantic expression constraints to libflux.
- Custom `PartialEq` for polytypes.
- Extensible record unification.
- `Semantic.Walk`.

### Bug fixes
- Do not constrain type variables with empty kinds.
- Update usage tests to filter on `_field`.
- Record labels are scoped and fields are ordered.
- Parse row variables.
- Update make release to confirm remote and local are in sync.
- Make `walk_rc` public.

---

## v0.53.0 [2019-11-05]

### Breaking changes
- Interpret months as part of the semantic duration.

### Features
- Macros for type inference tests.
- Let-polymorphism with test example.
- Generalization, instantiation, and constraint solving.
- Type environment.
- Convert Rust AST to FlatBuffers format.
- Allow lexing and parsing of string polytypes according to polytype grammar rules.
- Add month support when adding durations to a time value.
- Interpret months as part of the semantic duration.

### Bug fixes
- Type variable constraints.
- Apply sub to both sides of constraint before unifying.
- Instantiate quantified vars, not free vars.

---

## v0.52.0 [2019-10-30]

### Features
- `Visitor` uses `Rc` for nodes.
- Add `EvalOptions`.

### Bug fixes
- Correctly lex `µs`.

---

## v0.51.0 [2019-10-24]

### Breaking changes
- Update the Flux SPEC to remove duration addition and subtraction.
- Turn duration value into a vector.

### Features
- Implementations for type substitutions and constraints.
- Add semantic analysis.
- Updated the duration value to include months and negative flag.
- Create a flatbuffers schema for AST.
- Add initial C binding for parsing an AST.
- Create a tool for updating `.flux` tests in-place.
- Add walk implementation.
- Turn duration value into a vector.
- Define initial Flux data types.

### Bug fixes
- Update libflux parser to match the Go parser.
- Allow data collected by `prometheus.scrape()` to be used by `histogramQuantile()`.
- Remove mock allocator.
- Validate URL for `sql.from()`, `sql.to()`, and `socket.from()`.

---

## v0.50.2 [2019-10-24]

### Bug fixes
- Make `keep()` and `drop()` throw an error if merging tables with different schemas.

---

## v0.50.1 [2019-10-24]

### Bug fixes
- Add annotated errors to the execute package where it affects normal usage.
- Reorder variables in the allocator for atomic operations.

---

## v0.50.0 [2019-10-11]

### Features
- Add `experimental/prometheus` package.
- Add a memory manager to the memory allocator.
- Add an internal function for generating data.
- Switch to using discarding mode for transformations.
- Group key join on `_time`.

### Bug fixes
- Require `data` parameter in `monitor.check()`.
- Return the EOF error when reading metadata.
- Re-add missing import.
- Fix broken links in SPEC.
- Return error from cache.
- Update the `universe` package to use flux errors throughout.
- Parse escape characters in string interpolation expressions.
- Improve CSV error message for serialized Flux error.
- Have the interpreter return annotated Flux errors.

---

## v0.49.0 [2019-09-24]

### Features
- Optimize `filter()` to pass through tables when possible.
- Additional arrow builder utilities.
- Add a `benchmark()` function to the testing package.
- Add an arrow backed version of the table buffer.

### Bug fixes
- Fix `sql.from()` connection leak.
- Fix some of the memory leaks within the standard library.
- Fix `mqtt.to()` topic parameter.

---

## v0.48.0 [2019-09-20]

### Breaking changes
- Convert the Flux memory allocator into an arrow allocator.

### Features
- New dependency injection framework.
- Add planner options to Flux language.
- Make Flux `internal/promql/quantile` behavior match PromQL `quantile` aggregate.

### Bug fixes
- Passing context to WalkIR.
- Make `join()` reject input tables lacking `on` columns.

---

## v0.47.1 [2019-09-18]

### Bug fixes
- Pass dependencies to WalkIR

---

## v0.47.0 [2019-09-13]

### Bug fixes
- Introduce ParenExpression.
- Make fmt runs cargo fmt on Rust directories.
- Update `Hex.Dump` to `hex.EncodeToString`.
- Integrate the Promql transpiler into Flux.

---

## v0.46.2 [2019-09-12]

### Bug fixes
- Make `to` use URL validator.
- Add filesystem to default test dependencies.

---

## v0.46.1 [2019-09-11]

### Bug fixes
- Add a filesystem service.
- Do a pointer comparison for table objects instead of a deep compare.

---

## v0.46.0 [2019-09-10]

### Features
- Replace EnvironmentSecretService with EmptySecret….
- Source location for rust parser.

### Bug fixes
- Push error for bad string expression.
- Remove `token` parameter from `pagerduty.endpoint`.

---

## v0.45.2 [2019-09-10]

### Bug fixes
- Push the tag before running goreleaser.
- Additional opentracing spans for debugging query flow.

---

## v0.45.1 [2019-09-09]

### Bug fixes
- Ensure `http.post` respects the context.

---

## v0.45.0 [2019-09-06]

### Features
- Added Google Bigtable `from()`.

### Bug fixes
- Add `pagerduty.severityFromLevel()` helper function.
- Sleep function now gets canceled when the context is canceled.
- Categorize the undefined identifier as an invalid status code.
- Panic from `CheckKind` in `memberEvaluator`.

---

## v0.44.0 [2019-09-05]

### Features
- Add `http.basicAuth` function.
- Add measurement filters to `monitor.from` and `monitor.logs`.

### Bug fixes
- changed the default HTTP client to be more robust.

---

## v0.43.0 [2019-09-04]

### Features
- PagerDuty endpoint for alerts and notifications.

---

## v0.42.0 [2019-08-30]

### Features
- Add `stateChanges` function.

### Bug fixes
- Race condition in looking up types in `map`.
- Support bool equality expressions.
- Calculating a type variable's free type variables.
- Do not generate fresh type variables for member expressions.
- Array instantiation.

---

## v0.41.0 [2019-08-26]

### Features
- Add ability to validate URLs before making `http.post` requests.
- Evaluate string interpolation.
- Implement the `secrets.get` function.
- Added secret service interface.
- Add secrets package that will construct a secret object.
- Added a SecretService interface and a new dependencies package and a basic test of functionality.
- Add Slack endpoint.

### Bug fixes
- Make `reset()` check for non-nil data before calling `Release()`.
- Add test case for `notify` function.
- Add missing math import to test case.
- Make packages aware of options.
- Resolved `holtWinters` panic.
- Use non-pointer receiver for `interpreter.function`.

---

## v0.40.2 [2019-08-22]

### Bug fixes
- Resolved `holtWinters()` panic.

---

## v0.40.1 [2019-08-21]

### Bug fixes
- Use non-pointer receiver for `interpreter.function`.

---

## v0.40.0 [2019-08-20]

### Breaking changes
- Update compiler package to use true scope.
- Add `http` and `json` to prelude.

### Features
- Add `alerts.check()` function.
- Add `alerts.notify` function.
- Add `kaufmansER()` and `kaufmansAMA()` functions.
- Add `experimental.to()` function.
- Add `experimental.set()` function to update entire object.
- Add `experimental.objectKeys()` function.
- Add `tripleExponentialDerivative()` function.
- Add `json.encode()` function.
- Add `mqtt.to()` function.
- Add Bytes type.
- Update compiler package to use true scope.
- Add http endpoint.
- Add post method implementation.
- String interpolation.

### Bug fixes
- Avoid wrapping table errors in the CSV encoder.
- Remove irrelevant TODOs.
- `mode()` now properly considers nulls when calculating the mode.
- Add `http` and `json` to prelude.
- Rename all Flux test files to use `_test.flux`.

---

## v0.39.0 [2019-08-13]

{{% warn %}}
In Flux 0.39.0, `holtWinters()` can cause the query engine to panic.
**Flux 0.40.2 resolves this panic.**
{{% /warn %}}

### Breaking changes
- Implement the scanning components for string expressions.

### Features
- Add `tail()` function.
- Add framework for `http.post()` function.
- Implement `deadman()` function.
- Time arithmetic functions.
- Alerts package.
- Add an experimental `group()` function with mode `extend`.
- Implement the scanning components for string expressions.
- Add `chandeMomentumOscillator()` function.
- Add `hourSelection()` function.
- Add `date.year()` function

### Bug fixes
- Update object to use Invalid type instead of nil monotypes.
- Make it so the alerts package can be defined in pure Flux.
- Close connection after `sql.to()`.

---

## v0.38.0 [2019-08-06]

### Features
- Update selectors to operate on time columns.
- Add `relativeStrengthIndex()` transformation.
- Add double and triple exponential average transformations (`doubleEMA()` and `tripleEMA()`).
- Add `holtWinters()` transformation.
- Add `keepFirst` parameter to `difference()`.
- DatePart equivalent functions.
- Add runtime package.
- Add and subtract duration literal arithmetic.
- Allow `keep()` to run regardless of nonexistent columns.
  If all columns given are nonexistent, `keep()` returns an empty table.
- Scanner returns positioning.

### Bug fixes
- Function resolver now keeps track of local assignments that may be evaluated at runtime.
- Fixed InfluxDB test errors.
- Add range to tests to pass in InfluxDB.
- Allow converting a duration to a duration.
- Catch integer overflow and underflow for literals.

---

## v0.37.2 [2019-07-24]

- _General cleanup of internal code._

---

## v0.37.1 [2019-07-23]

### Bug fixes
- Fixed InfluxDB test errors.
- Add range to tests to pass in InfluxDB.

---

## v0.37.0 [2019-07-22]

### Features
- Add PromQL to Flux transpiler and Flux helper functions.
- Add mutable arrow array builders.
- Created date package.
- Return query and result errors in the multi result encoder.
- Add `exponentialMovingAverage()`.
- Add full draft of Rust parser.
- Implement more production rules.
- AST marshalling.
- Parse statements.
- Parse integer and float literals.
- Add initial Rust implementation of parser.

---

## v0.36.2 [2019-07-12]

### Bug fixes
- Add helper methods for comparing entire result sets.
- Map will not panic when a record is `null`.

---

## v0.36.1 [2019-07-10]

### Bug fixes
- Add `range` call to some end-to-end tests.
- Fix implementation of `strings.replaceAll`.

---

## v0.36.0 [2019-07-09]

### Features
- Updated `movingAverage()` and added `timedMovingAverage`.
- `elapsed()` function.
- `mode()` function.
- `sleep()` function.
- Modify error usage in places to use the new enriched errors.
- Enriched error interface.
- End-to-end tests that show how to mimic pandas functionality.
- End-to-end tests for string functions.

### Bug fixes
- Fix `difference()` so that it returns an error instead of panicking when given a `_time` column.
- Added end-to-end tests for type conversion functions.
- Make `map()` error if return type is not an object.
- Fixed miscounted allocations in the `ColListTableBuilder`.
- Support formatting `with`.

### Breaking changes
- Updated `movingAverage()` to `timedMovingAverage` and added new
  `movingAverage()` implementation.

---

## v0.35.1 [2019-07-03]

### Bug fixes
- Re-add `mergeKey` parameter to `map()` in deprecated state.

---

## v0.35.0 [2019-07-02]

### Breaking changes
- Remove `mergeKey` parameter from the `map()` function.

### Features
- Add `sql.to()` function.
- Add `movingAverage()` function.
- Add `strlen()` and `substring()` functions to the `strings` package.

### Bug fixes
- Remove `mergeKey` parameter from the `map()` function.
- Parse float types with PostgreSQL.

---

## v0.34.2 [2019-06-27]

### Bug fixes
- Parse float types with PostgreSQL.

---

## v0.34.1 [2019-06-26]

### Features
- Add custom PostgreSQL type support.
- Added MySQL type support.
- Nulls work in table and row functions.

### Bug fixes
- Fixed boolean literal type conversion problem and added tests.
- Diff should track memory allocations when it copies the table.
- Copy table will report if it is empty correctly.

---

## v0.33.2 [2019-06-25]

### Bug fixes
- Use `strings.Replace` instead of `strings.ReplaceAll` for compatibility.

---

## v0.33.1 [2019-06-20]

### Bug fixes
- Copy table will report if it is empty correctly.

---

## v0.33.0 [2019-06-18]

### Breaking changes
- Implement nulls in the compiler runtime.

### Features
- Add Go `regexp` functions to Flux.
- Add the exists operator to the compiler runtime.
- Implement nulls in the compiler runtime.
- Add nullable kind.
- Support "with" syntax for objects in row functions.
- Port several string functions from go `strings` library to Flux.
- Add exists unary operator.

### Bug fixes
- Add range to map_extension_with.flux.
- Row function resets records map with each call to prepare.
- Fix `joinStr`, including adding an EndToEnd Test.
- Fix `string_trimLeft` and `string_trimRight` so that they pass in InfluxDB.
- Add length check for empty tables in fill.

---

## v0.32.1 [2019-06-10]

### Bug fixes
- Identify memory limit exceeded errors in dispatcher.

---

## v0.32.0 [2019-06-05]

### Breaking changes
- Remove the control package.

### Bug fixes
- Changelog generator now handles merge commits better.
- Return count of errors when checking AST.

---

## v0.31.1 [2019-05-29]

### Bug fixes
- Do not call done after calling the function.

---

## v0.31.0 [2019-05-28]

### Breaking changes
- Copy the table when a table is used multiple times.

### Features
- Support for dynamic queries.

### Bug fixes
- Copy the table when a table is used multiple times.

---

## v0.30.0 [2019-05-16]

### Features
- Support for dynamic queries.

---

## v0.29.0 [2019-05-15]

### Breaking changes
- Make `on` a required parameter to `join()`.

### Features
- Add stream table index functions (
  [`tableFind()`](/flux/v0.x/stdlib/universe/tablefind/),
  [`getRecord()`](/flux/v0.x/stdlib/universe/getrecord/),
  [`getColumn()`](/flux/v0.x/stdlib/universe/getcolumn/)
  ).
- Construct invalid binary expressions when given multiple expressions.

### Bug fixes
- Properly use RefCount to reference count tables.
- Remove the race condition within the `(*Query).Done` method.
- Fix table functions test.
- Add `column` parameter to `median()`.
- Modify `median` to work with `aggregateWindow()`.
- `pivot()` now uses the correct column type when filling nulls.
- Add error handling for property list.
- Return the error from the context in the executor.

---

## v0.28.3 [2019-05-01]

### Bug fixes

- Fix request results labels to count runtime errors.
- An error when joining could result in two calls to finish.

---

## v0.28.2 [2019-04-26]

### Bug fixes
- Preallocate data when constructing a new string array.

---

## v0.28.1 [2019-04-25]

### Bug fixes
- Make executor respect memory limit from caller.

---

## v0.28.0 [2019-04-24]

### Features
- Allow choosing sample/population mode in `stddev()`.

### Bug fixes
- Fix `reduce()` so it resets the reduce value to the neutral element value for each new group key
  and reports an error when two reducers write to the same destination group key.

---

## v0.27.0 [2019-04-22]

### Features
- Add `trimSuffix` and `trimPrefix` functions to the strings package.
- Add support for conditional expressions to compiler.
- Add conditional expression handling to interpreter.

### Bug fixes
- Enforce memory and concurrency limits in controller.
- Format conditional expression.
- `tagKeys` should include a call to `distinct`.

---

## v0.26.0 [2019-04-18]

### Breaking changes
- Aggregates now accept only a `column` parameter. `columns` not used.

### Features
- Add handling for conditional expressions to type inference.
- Add `if`/`then`/`else` syntax to Flux parser.
- Added a WalkIR function that external programs can use to traverse an opSpec structure.
- Add planner options to compile options.
- Add example on how to use Flux as a library.
- `duplicate()` will now overwrite a column if the as label already exists.

#### Bug fixes
- Format right child with good parentheses.
- Make staticcheck pass.
- Rename `json` tag so go vet passes.
- The controller pump could reference a nil pointer.
- Create a DependenciesAwareProgram so controller can assign dependencies.
- Make `Program.Start` start execution synchronously.
- Read the metadata channel in a separate goroutine.
- Remove dead code in controller so `staticcheck` passes.
- Allow Flux unit tests to pass.
- Require a Github token to perform a release.
- Change example name to make go vet pass.
- Make `csv.from` return decode error.

---

## v0.25.0 [2019-04-08]

### Breaking changes
- Fix logical operators (`and`, `or`) precedence.

### Bug fixes
- Omit space between unary operator and operand.
- Format AST preserving operator precedence.

---

## v0.24.0 [2019-04-01]

### Breaking changes
- Rename `percentile()` function to `quantile()`.

### Bug fixes
- Handle when a non-call expression is parsed as the pipe destination.
- Add error message to Compile methods for empty Spec.

---

## v0.23.0 [2019-03-26]

### Breaking changes
- Remove unused statistics from the struct.

### Features
- Define comparison operators between time types.
- Parse signed duration.
- Added `reduce()` function and supporting go API for implementation.
- Fix for recognizing locally scoped objects and arrays in a row function.

### Bug fixes
- Columns in percentile signature and more strict param checking.
- Report the error received when parsing a bad regex literal.
- Remove unused statistics from the struct.

---

## v0.22.0 [2019-03-18]

### Features
- Added a math package and ported all 64 bit go math library functions.

### Bug fixes
- Make read-like access patterns for objects thread-safe.

---

## v0.21.4 [2019-03-06]

### Bug fixes
- Test union.flux correctly uses sort.
- Pivot orders rowKey and columnKey by the input parameters, rather than the table column order.
- Deterministic sorting of input tables in join.
- Group key comparison works regardless of column ordering.

---

## v0.21.3 [2019-03-05]

### Bug fixes
- Fix test to pass in InfluxDB.
- Write table and result name in each row of CSV output.
- Make time() function accept any format that parser accepts.
- Return errors when evaluating functions.
- Prevent a deadlock in the array expression parser.

---

## v0.21.2 [2019-03-01]

### Bug fixes
- Add AST compiler to mappings.

---

## v0.21.1 [2019-03-01]

### Bug fixes
- Make ASTCompiler marshalable.
- Fix a controller test to be less flaky.
- `from()` must send deep table copies to its downstream transformations.

---

## v0.21.0 [2019-02-25]

### Breaking changes
- Support attaching arbitrary query metadata from the executor.

### Features
- Support attaching arbitrary query metadata from the executor.
- Socket source.

### Bug fixes
- Add locks to make diff threadsafe.

---

## v0.20.0 [2019-02-20]

### Features
- AST match.
- Generate ASTs from Flux test files for external consumption.
- Add compile subcommand that compiles Flux to spec.

### Bug fixes
- Change loadStorage and loadMem to be options so that they are modifiable.
- Generate skipped tests; skip in test driver.

---

## v0.19.0 [2019-02-11]

### Breaking changes
- Make `window()` parameters match SPEC.
- Split FromProcedureSpec into logical and physical specs.

### Features
- Add `contains()` function to check for membership in lists.
- `test` keyword.

### Bug fixes
- Raw query test case.

---

## v0.18.0 [2019-02-07]

### Features
- Add strings package with functions to trim/change string case.
- Make duration conversion public.
- Add assertEmpty method and use it with testing.test.
- Expose literal parsers used within the parser.
- Add testing.diff function.
- Execute command.

### Bug fixes
- Refactor the controller to remove data races.
- Member expressions using a string literal use the incorrect end bracket.
- Skip lambda evaluation when referencing nulls.
- Options editor should use ast.Expression.
- Fix decoder bug where a default table ID is given when none is required.
- Add close to SourceIterator.

---

## v0.17.0 [2019-01-22]

### Features
- Checks for option dependencies.
- Add query success and error metrics.
- Track nested blocks in the parser.
- Update `aggregateWindow()` to include `createEmpty` as parameter to allow for null results.
- Add query function count metrics.

### Bug fixes
- Multiplicative operators are above additive operators in precedence.
- Fix panic when copying lambda.
- Only print a package's public exports.
- Cannot access imports of imports.
- Check for schema collision when appending columns to a table.
- Process test helper had bad logic to check for errors.
- Handle rune errors correctly when decoding an illegal token.

---

## v0.16.1 [2019-01-17]

### Bug fixes
- Copy packages for importer copy.

---

## v0.16.0 [2019-01-17]

### Features
- Adds various v1 meta queries helper functions

### Bug fixes
- Fixes various UX issues.
- Object polytype.
- Fix edge case panic in `assertEquals`.
- Check for equality in time columns correctly.
- Fix bug where `assertEquals` did not check tables without a match in both streams.
- Clear return for each REPL command.

---

## v0.15.0 [2019-01-16]

### Features
- Add rule to remove filter true nodes.
- Checks for variable reassignment and option declarations below package block.

### Bug fixes
- Move a test file into the testing/testdata folder.

---

## v0.14.0 [2019-01-14]

### Breaking changes
- Implement and require builtin statements.
- Fix keys to output group key.
- Organizes builtin code into Flux packages.
- Change flux command to be a REPL.

### Features
- Implement and require builtin statements.
- Added a new utility library for generating test data.
- `columns()` function.
- Add fill function to set a default value for null values in a column.
- Organizes built-in code into Flux packages.
- Change flux command to be a REPL.
- Refactored the table builder interfaces to support null value creation.
- Aggregates process empty/all-null tables by creating a null row.
- Show nulls in REPL as empty string.
- Add ability to define built-in packages.
- Treat omitted values with no defaults as nil in CSV.
- Build arrow columns with null values.
- Converting limit to use arrow arrays.
- TableBuilder interface and ColListTableBuilder implementation support creation of nil values.

### Bug fixes
- Count nulls in the count aggregate.
- Fix keys to output group key.
- Adding test for type mismatch in group.
- Nest extern blocks for each level in scope.
- Memory leak in limit when slicing.
- Prettier formatting for package.
- Change Package.Path to be json omitempty.

---

## v0.13.0 [2019-01-07]

### Breaking changes
- Add File and Package nodes to the AST.

### Features
- Embed errors into the ast from the parser.
- Add no-points optimization for `from() |> keys()`.
- Add File and Package nodes to the AST.
- Add a function for checking for errors within the AST.

### Bug fixes
- Remove unneeded use of memory allocator.
- Allow the memory allocator to be nil for arrow arrays.
- Fix several bugs in copy methods add tests.
- Fix a flaky test in the controller shutdown.

---

## v0.12.0 [2019-01-02]

### Features
- Slice utils.
- Parse string literal object keys.
- Add tests for multi-line and escaped strings.
- Arrow helper method.
- Converting all aggregates to use arrow arrays.

### Bug fixes
- Embed plan.DefaultCost in input and output functions.
- Side effect statements are now copied between related interpreter scopes.

---

## v0.11.0 [2018-12-18]

### Features
- Add utility methods for converting a slice into an arrow array buffer.

### Bug fixes
- Do not panic with unbalanced parenthesis.
- Respect positive timeout for toHTTP.

---

## v0.10.0 [2018-12-17]

### Breaking changes
- Change "label" to "column" for state tracking functions.

### Features
- Plan validation.
- Testing framework	no longer checks output.
- Integrate arrow arrays into the table builder.
- Support packages and imports.

### Bug fixes
- Cancel all queries after timeout elapses.
- `makefile` for generating the scanner after clean was incorrect.

---

## v0.9.0 [2018-12-11]

### Features
- Option Editor.

### Bug fixes
- Return the source attribute in the location correctly.

---

## v0.8.0 [2018-12-11]

### Features
- Rule to chain group operations.
- Add package and import support to the semantic graph.
- Add `assertEquals` function to transformations.
- Parse import and package statements
- Walk pattern for AST.
- AST formatting.
- Switch over to the new parser.

### Bug fixes
- Make controller return planner failures.
- Collision between external and fresh type vars.
- fmt for import and package.
- Add import/package nodes to ast.Walk.
- Improve panic message when the wrong column type is used.
- Check nil results when computing stats.
- Suppress group push down for \_time and \_value.
- Terminal output functions must produce results.
- Fix race in interpreter.doCall.
- Fix ast.Walk for Assignemnt rename.
- Improve error message for missing object properties.
- Add unary logical expression to the parser.
- Variable declarator node needs to duplicate the location information.

---

## v0.7.4 (2018-12-04)

### Bug Fixes
- Add missing comparison operators.

---

## v0.7.3 (2018-12-04)

### Bug Fixes
- Fix the ident statement to use expression suffix.