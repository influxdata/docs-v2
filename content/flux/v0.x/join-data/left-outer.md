---
title: Perform a left outer join
description: >
  ...
menu:
  flux_0_x:
    name: Left outer join
    parent: Join data
weight: 102
related:
  - /flux/v0.x/stdlib/join/
  - /flux/v0.x/stdlib/join/left/
---

{{< svg svg="static/svgs/join-diagram.svg" class="left" >}}

{{< expand-wrapper >}}
{{% expand "View table illustration of a left outer join" %}}
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
#### Left outer join result

|     |                                      |                                      |                                      |                                      |
| :-- | :----------------------------------- | :----------------------------------- | :----------------------------------- | :----------------------------------- |
| r1  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> | <span style="color:#d30971">▲</span> | <span style="color:#d30971">▲</span> |
| r2  | <span style="color:#9b2aff">●</span> | <span style="color:#9b2aff">●</span> |                                      |                                      |
{{% /flex-content %}}
{{< /flex >}}
{{% /expand %}}
{{< /expand-wrapper >}}
