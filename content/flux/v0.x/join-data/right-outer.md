---
title: Perform a right outer join
description: >
  ...
menu:
  flux_0_x:
    name: Right outer join
    parent: Join data
weight: 102
related:
  - /flux/v0.x/stdlib/join/
  - /flux/v0.x/stdlib/join/right/
---

{{< svg svg="static/svgs/join-diagram.svg" class="right" >}}

{{< expand-wrapper >}}
{{% expand "View table illustration of a right outer join" %}}
{{< flex >}}
{{% flex-content "third" %}}
#### left
|     |                                      |                                      |
| :-- | :----------------------------------- | :----------------------------------- |
| r1  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> |
| r2  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> |
{{% /flex-content %}}
{{% flex-content "third" %}}
#### right
|     |                                      |                                      |
| :-- | :----------------------------------- | :----------------------------------- |
| r1  | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r3  | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r4  | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
{{% /flex-content %}}
{{% flex-content "third" %}}
#### Right outer join result

|     |                                      |                                      |                                      |                                      |
| :-- | :----------------------------------- | :----------------------------------- | :----------------------------------- | :----------------------------------- |
| r1  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r3  |                                      |                                      | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r4  |                                      |                                      | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |

{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}