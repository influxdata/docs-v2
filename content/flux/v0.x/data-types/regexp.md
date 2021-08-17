---
title: Work with regular expression types
seotitle: Work with Flux regular expression types
list_title: Regular expression types
description: >
  Learn how to work with Flux regular expression types.
menu:
  flux_0_x:
    name: Regular expression types
    parent: Work with data types
weight: 101
flux/v0.x/tags: ["regexp types", "data types"]
related:
  - /flux/v0.x/stdlib/regexp/
---

A **regular expression** type represents a regular expression pattern.

**Type name**: `regexp`

###### On this page
- [Regular expression syntax](#regular-expression-syntax)
- [Use regular expression flags](#use-regular-expression-flags)
- [Use regular expressions in predicate expressions](#use-regular-expressions-in-predicate-expressions)
- [Convert a string to a regular expression](#convert-a-string-to-a-regular-expression)
- [Examples](#examples)

## Regular expression syntax
Flux uses the [Go regexp implementation and syntax](https://pkg.go.dev/regexp).
This syntax is similar to regular expressions in Perl, Python, and other languages.
Regular expression literals are enclosed in forward slash characters (`/`).

```js
/^[a-z0-9]{1,}$/
```

## Use regular expression flags
Flux supports the following regular expression flags:

| Flag | Description                                                                     |
| :--- | :------------------------------------------------------------------------------ |
| i    | case-insensitive                                                                |
| m    | multi-line mode: `^` and `$` match begin/end line in addition to begin/end text |
| s    | let `.` match `\n`                                                              |
| U    | ungreedy: swap meaning of `x*` and `x*?`, `x+` and `x+?`, etc                   |

Include regular expression flags at the beginning of your regular expression pattern
enclosed in parentheses (`()`) and preceded by a question mark (`?`).

```js
/(?iU)foo*/
```

## Use regular expressions in predicate expressions
To use regular expressions in [predicate expressions](/flux/v0.x/get-started/query-basics/#predicate-expressions),
use the [`=~` and `!~` comparison operators](/flux/v0.x/spec/operators/#comparison-operators).
The right operand must be a string.
The left operand must be a regular expression.

```js
"abc" =~ /\w/
// Returns true

"z09se89" =~ /^[a-z0-9]{7}$/
// Returns true

"foo" !~ /^f/
// Returns false

"FOO" =~ /(?i)foo/
// Returns true
```

## Convert a string to a regular expression
1. Import the [`regexp` package](/flux/v0.x/stdlib/regexp/).
2. Use [`regexp.compile()`](/flux/v0.x/stdlib/regexp/compile) to compile a
    string into a regular expression type.

```js
import "regexp"

regexp.compile(v: "^- [a-z0-9]{7}")
// Returns ^- [a-z0-9]{7} (regexp type)
```

## Examples

- [Replace all substrings that match a regular expression](#replace-all-substrings-that-match-a-regular-expression)
- [Return the first regular expression match in a string](#return-the-first-regular-expression-match-in-a-string)
- [Escape regular expression metacharacters in a string](#escape-regular-expression-metacharacters-in-a-string)

### Replace all substrings that match a regular expression
1. Import the [`regexp` package](/flux/v0.x/stdlib/regexp).
2. Use [`regexp.replaceAllString()`](/flux/v0.x/stdlib/regexp/replaceallstring/)
   and provide the following parameters:

    - **r**: regular expression
    - **v**: string to search
    - **t**: replacement for matches to **r**.

```js
import "regexp"

regexp.replaceAllString(
  r: /a(x*)b/,
  v: "-ab-axxb-",
  t: "T"
)
// Returns "-T-T-"
```

### Return the first regular expression match in a string
1. Import the [`regexp` package](/flux/v0.x/stdlib/regexp).
2. Use [`regexp.findString()`](/flux/v0.x/stdlib/regexp/findstring/) to return
   the first regular expression match in a string.
   Provide the following parameters:

    - **r**: regular expression
    - **v**: string to search  

```js
import "regexp"

regexp.findString(
  r: /foo.?/,
  v: "seafood fool"
)
// Returns "food"
```

### Escape regular expression metacharacters in a string
If a string contains regular expression metacharacters that should be evaluated
as literal characters, escape the metacharacters before converting the string
to a regular expression:

1. Import the [`regexp` package](/flux/v0.x/stdlib/regexp).
2. Use [`regexp.quoteMeta()`](/flux/v0.x/stdlib/regexp/quotemeta/)
   and provide the string to escape regular expression metacharacters in:

```js
import "regexp"

regexp.quoteMeta(v: ".+*?()|[]{}^$")
// Returns "\.\+\*\?\(\)\|\[\]\{\}\^\$"
```
