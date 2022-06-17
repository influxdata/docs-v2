---
title: date package
description: >
  The `date` package provides date and time constants and functions.
menu:
  flux_0_x_ref:
    name: date 
    parent: stdlib
    identifier: date
weight: 11
cascade:
  flux/v0.x/tags: [date/time]
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
date.April = 4 // April is a constant that represents the month of April.
date.August = 8 // August is a constant that represents the month of August.
date.December = 12 // December is a constant that represents the month of December.
date.February = 2 // February is a constant that represents the month of February.
date.Friday = 5 // Friday is a constant that represents Friday as a day of the week.
date.January = 1 // January is a constant that represents the month of January.
date.July = 7 // July is a constant that represents the month of July.
date.June = 6 // June is a constant that represents the month of June.
date.March = 3 // March is a constant that represents the month of March.
date.May = 5 // May is a constant that represents the month of May.
date.Monday = 1 // Monday is a constant that represents Monday as a day of the week.
date.November = 11 // November is a constant that represents the month of November.
date.October = 10 // October is a constant that represents the month of October.
date.Saturday = 6 // Saturday is a constant that represents Saturday as a day of the week.
date.September = 9 // September is a constant that represents the month of September.
date.Sunday = 0 // Sunday is a constant that represents Sunday as a day of the week
date.Thursday = 4 // Thursday is a constant that represents Thursday as a day of the week.
date.Tuesday = 2 // Tuesday is a constant that represents Tuesday as a day of the week.
date.Wednesday = 3 // Wednesday is a constant that represents Wednesday as a day of the week.
```


## Functions

{{< children type="functions" show="pages" >}}
