---
title: date package
description: >
  The `date` package provides date and time constants and functions.
menu:
  flux_v0_ref:
    name: date 
    parent: stdlib
    identifier: date
weight: 11
cascade:
  flux/v0/tags: [date/time]
  introduced: 0.37.0
---

<!------------------------------------------------------------------------------

IMPORTANT: This page was generated from comments in the Flux source code. Any
edits made directly to this page will be overwritten the next time the
documentation is generated. 

To make updates to this documentation, update the comments above the package
declaration in the Flux source code:

https://github.com/influxdata/flux/blob/master/stdlib/date/date.flux

Contributing to Flux: https://github.com/influxdata/flux#contributing
Fluxdoc syntax: https://github.com/influxdata/flux/blob/master/docs/fluxdoc.md

------------------------------------------------------------------------------->

The `date` package provides date and time constants and functions.
Import the `date` package:

```js
import "date"
```

## Constants

```js
date.April = 4
date.August = 8
date.December = 12
date.February = 2
date.Friday = 5
date.January = 1
date.July = 7
date.June = 6
date.March = 3
date.May = 5
date.Monday = 1
date.November = 11
date.October = 10
date.Saturday = 6
date.September = 9
date.Sunday = 0
date.Thursday = 4
date.Tuesday = 2
date.Wednesday = 3
```

- **date.April** is a constant that represents the month of April.
- **date.August** is a constant that represents the month of August.
- **date.December** is a constant that represents the month of December.
- **date.February** is a constant that represents the month of February.
- **date.Friday** is a constant that represents Friday as a day of the week.
- **date.January** is a constant that represents the month of January.
- **date.July** is a constant that represents the month of July.
- **date.June** is a constant that represents the month of June.
- **date.March** is a constant that represents the month of March.
- **date.May** is a constant that represents the month of May.
- **date.Monday** is a constant that represents Monday as a day of the week.
- **date.November** is a constant that represents the month of November.
- **date.October** is a constant that represents the month of October.
- **date.Saturday** is a constant that represents Saturday as a day of the week.
- **date.September** is a constant that represents the month of September.
- **date.Sunday** is a constant that represents Sunday as a day of the week.
- **date.Thursday** is a constant that represents Thursday as a day of the week.
- **date.Tuesday** is a constant that represents Tuesday as a day of the week.
- **date.Wednesday** is a constant that represents Wednesday as a day of the week.


## Functions

{{< children type="functions" show="pages" >}}

## Packages

{{< children show="sections" >}}
