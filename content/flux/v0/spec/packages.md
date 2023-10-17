---
title: Packages
description: >
  Flux source is organized into packages.
  A package consists of one or more source files.
  Each source file is parsed individually and composed into a single package.
aliases:
  - /influxdb/v2/reference/flux/language/programs
  - /influxdb/v2/reference/flux/language/packages/
  - /influxdb/cloud/reference/flux/language/packages/
menu:
  flux_v0_ref:
    parent: Flux specification
    name: Packages
weight: 111
---

Flux source code is organized into packages.
A package consists of one or more source files.
Each source file is parsed individually and composed into a single package.

```js
File = [ PackageClause ] [ ImportList ] StatementList .
ImportList = { ImportDeclaration } .
```

## Package clause

```js
PackageClause = [ Attributes ] "package" identifier .
```

A _package clause_ defines the name for the current package.
Package names must be valid Flux identifiers.
The package clause must be at the beginning of any Flux source file.
All files in the same package must declare the same package name.
When a file does not declare a package clause, all identifiers in that
file will belong to the special `main` package.

### Package main

The `main` package is special for a few reasons:

1. It defines the entry point of a Flux program.
2. It cannot be imported.
3. All statements are marked as producing side effects.

## Import declaration

```js
ImportDeclaration = [ Attributes ] "import" [identifier] string_lit
```

A package name and an import path is associated with every package.
The import statement takes a package's import path and brings all of the identifiers
defined in that package into the current scope under a namespace.
The import statement defines the namespace through which to access the imported identifiers.
By default the identifier of this namespace is the package name unless otherwise specified.
For example, given a variable `x` declared in package `foo`, importing `foo` and referencing `x` would look like this:

```js
import "import/path/to/package/foo"

foo.x
```

Or this:

```js
import bar "import/path/to/package/foo"

bar.x
```

A package's import path is always absolute.
A package may reassign a new value to an option identifier declared in one of its imported packages.
A package cannot access nor modify the identifiers belonging to the imported packages of its imported packages.
Every statement contained in an imported package is evaluated.

## Package initialization

Packages are initialized in the following order:

1. All imported packages are initialized and assigned to their package identifier.
2. All option declarations are evaluated and assigned regardless of order.
   An option cannot have a dependency on another option assigned in the same package block.
3. All variable declarations are evaluated and assigned regardless of order. A variable cannot have a direct or indirect dependency on itself.
4. Any package side effects are evaluated.

A package will only be initialized once across all file blocks and across all packages blocks regardless of how many times it is imported.

Initializing imported packages must be deterministic.
Specifically after all imported packages are initialized, each option must be assigned the same value.
Packages imported in the same file block are initialized in declaration order.
Packages imported across different file blocks have no known order.
When a set of imports modify the same option, they must be ordered by placing them in the same file block.

{{< page-nav prev="/flux/v0/spec/operators/" next="/flux/v0/spec/attributes/" >}}
