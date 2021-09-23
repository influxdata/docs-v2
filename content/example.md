---
title: Example post
description: This is just an example post to show the format of new 2.0 posts
weight: 1
# draft: true
related:
  - /influxdb/v2.0/write-data/
  - /influxdb/v2.0/write-data/quick-start
  - https://influxdata.com, This is an external link
products: [cloud, oss, enterprise]
---

This is a paragraph. Lorem ipsum dolor ({{< icon "trash" >}}) sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.

[Ref link][foo]

[foo]: https://docs.influxadata.com

This is **bold** text. This is _italic_ text. This is _**bold and italic**_.

{{< nav-icon "account" >}}
{{< nav-icon "data" >}}
{{< nav-icon "explore" >}}
{{< nav-icon "org" >}}
{{< nav-icon "boards" >}}
{{< nav-icon "tasks" >}}
{{< nav-icon "alerts" >}}
{{< nav-icon "settings" >}}
{{< nav-icon "notebooks" >}}

{{< icon "add-cell" >}} add-cell  
{{< icon "add-label" >}} add-label  
{{< icon "alert" >}} alert  
{{< icon "calendar" >}} calendar  
{{< icon "chat" >}} chat  
{{< icon "checkmark" >}} checkmark  
{{< icon "clone" >}} clone  
{{< icon "cloud" >}} cloud  
{{< icon "cog" >}} cog  
{{< icon "config" >}} config  
{{< icon "copy" >}} copy  
{{< icon "crown" >}} crown  
{{< icon "dashboard" >}} dashboard  
{{< icon "dashboards" >}} dashboards  
{{< icon "data-explorer" >}} data-explorer  
{{< icon "delete" >}} delete  
{{< icon "download" >}} download  
{{< icon "duplicate" >}} duplicate  
{{< icon "edit" >}} edit  
{{< icon "expand" >}} expand  
{{< icon "export" >}} export  
{{< icon "eye" >}} eye  
{{< icon "eye-closed" >}} eye-closed  
{{< icon "eye-open" >}} eye-open  
{{< icon "feedback" >}} feedback  
{{< icon "fullscreen" >}} fullscreen  
{{< icon "gear" >}} gear  
{{< icon "graph" >}} graph  
{{< icon "hide" >}} hide  
{{< icon "influx" >}} influx  
{{< icon "influx-icon" >}} influx-icon  
{{< icon "nav-admin" >}} nav-admin  
{{< icon "nav-config" >}} nav-config  
{{< icon "nav-configuration" >}} nav-configuration  
{{< icon "nav-dashboards" >}} nav-dashboards  
{{< icon "nav-data-explorer" >}} nav-data-explorer  
{{< icon "nav-organizations" >}} nav-organizations  
{{< icon "nav-orgs" >}} nav-orgs  
{{< icon "nav-tasks" >}} nav-tasks  
{{< icon "note" >}} note  
{{< icon "notebook" >}} notebook  
{{< icon "notebooks" >}} notebooks  
{{< icon "org" >}} org  
{{< icon "orgs" >}} orgs  
{{< icon "pause" >}} pause  
{{< icon "pencil" >}} pencil  
{{< icon "play" >}} play  
{{< icon "plus" >}} plus  
{{< icon "refresh" >}} refresh  
{{< icon "remove" >}} remove  
{{< icon "replay" >}} replay  
{{< icon "save-as" >}} save-as  
{{< icon "search" >}} search  
{{< icon "settings" >}} settings  
{{< icon "tasks" >}} tasks  
{{< icon "toggle" >}} toggle  
{{< icon "trash" >}} trash  
{{< icon "trashcan" >}} trashcan  
{{< icon "triangle" >}} triangle  
{{< icon "view" >}} view  
{{< icon "wrench" >}} wrench  
{{< icon "x" >}} x  

## h2 This is a header2
This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.

This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.

#### Here's a title for this codeblock
{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Flux](#)
[InfluxQL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
data = from(bucket: "example-bucket")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT "used_percent"
FROM "telegraf"."autogen"."mem"
WHERE time > now() - 15m
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% enterprise %}}
### h3 This is a header3
This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.

![Test image](/img/chronograf/1-6-alerts-conditions.png)

{{< img-hd src="/img/test-image-2.png" alt="Test Image" />}}

This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.
{{% /enterprise %}}

#### h4 This is a header4
This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.

This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo. [Link to h2](#h2-this-is-a-header2)

##### h5 This is a header5
This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.

This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.

###### h6 This is a header6
This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.

This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.This is a paragraph

---

There is a horizontal rule above and below this line.

---

{{% cloud %}}
#### Inline Styles
This is an [inline link](#). This is `inline code`.
This is an [`inline code link`](#).
This is an [`inline code link` with text in the link](#).
This is **bold**. This is _italic_.

- Unordered list line-item 1
- Unordered list line-item 2
  - Unordered list line-item 2.1
  - Unordered list line-item 2.2
  - Unordered list line-item 2.3 _(this is just an li, no p tag)_
      1. Ordered list item nested 1
      2. Ordered list item nested 2
      3. Ordered list item nested 3
- Unordered list line-item 3
-   Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

-   Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

1.  Ordered list line-item 1
2.  Ordered list line-item 2
  1.  Ordered list line-item 2.1
  2.  Ordered list line-item 2.2
  3.  Ordered list line-item 2.3 _(this is just an li, no p tag)_
      - Unordered list item nested 1
      - Unordered list item nested 2
      - Unordered list item nested 3
  4.  Ordered list line-item 2.4 with hard return.

      - Unordered list item nested 1
      - Unordered list item nested 2
      - Unordered list item nested 3

        With Another paragraph.

3.  Ordered list line-item 3
4.  Ordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

5.  Ordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

```js
// This is a code block
cpu = from(bucket:"example-bucket")
  |> range(start:-30m)
  |> filter(fn:(r) => r._measurement == "cpu")
  |> filter(fn:(r) => r._measurement == "cpu") |> filter(fn:(r) => r._measurement == "cpu") |> filter(fn:(r) => r._measurement == "cpu")

avg_cpu = cpu |> window(every:5m) |> mean()

avg_cpu
  |> group(none:true)
  |> yield()
//
```

###### Here's a codeblock with a title
```js
// This is a code block
cpu = from(bucket:"example-bucket")
  |> range(start:-30m)
  |> filter(fn:(r) => r._measurement == "cpu")

avg_cpu = cpu |> window(every:5m) |> mean()

avg_cpu
  |> group(none:true)
  |> yield()
//
```
{{% /cloud %}}

{{% enterprise %}}
###### This is a table
| Column 1 | Column 2  | Column 3 | Column 4 | Column 1 | Column 2  | Column 3 | Column 4 |
| -------- | --------  | -------- | -------- | -------- | --------  | -------- | -------- |
| Row 1.1  | `Row 1.2` | Row 1.3  | Row 1.4  | Row 1.1  | `Row 1.2` | Row 1.3  | Row 1.4  |
| Row 2.1  | `Row 2.2` | Row 2.3  | Row 2.4  | Row 2.1  | `Row 2.2` | Row 2.3  | Row 2.4  |
| Row 3.1  | `Row 3.2` | Row 3.3  | Row 3.4  | Row 3.1  | `Row 3.2` | Row 3.3  | Row 3.4  |
| Row 4.1  | `Row 4.2` | Row 4.3  | Row 4.4  | Row 4.1  | `Row 4.2` | Row 4.3  | Row 4.4  |
| Row 5.1  | `Row 5.2` | Row 5.3  | Row 5.4  | Row 5.1  | `Row 5.2` | Row 5.3  | Row 5.4  |

###### This is a table with lots of stuff
| Column 1 | Column 2 | Column 3 | Column 4 |
| -------- | -------- | -------- | -------- |
| Row 1.1Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 1.2Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 1.3Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 1.4Lorem ipsum dolor sit amet, consectetur adipiscing elit. |
| Row 2.1Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 2.2Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 2.3Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 2.4Lorem ipsum dolor sit amet, consectetur adipiscing elit. |
| Row 3.1Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 3.2Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 3.3Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 3.4Lorem ipsum dolor sit amet, consectetur adipiscing elit. |
| Row 4.1Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 4.2Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 4.3Lorem ipsum dolor sit amet, consectetur adipiscing elit. | Row 4.4Lorem ipsum dolor sit amet, consectetur adipiscing elit. |

> This is a basic block quote

Paragraph after a blockquote. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

> This is a multiple paragraph blockquote with internal elements.
> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
>
> Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
> Etiam tristique nisi et tristique auctor.
> Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
> Etiam tristique nisi et tristique auctor.

{{% note %}}
This is a basic note.
{{% /note %}}
{{% /enterprise %}}

{{% note %}}
## h2 This is a header2
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

### h3 This is a header3
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

{{< img-hd src="/img/test-image-2.png" alt="Test Image" />}}

#### h4 This is a header4
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

##### h5 This is a header5
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

###### h6 This is a header6
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

> Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
> Etiam tristique nisi et tristique auctor.
> Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
> Etiam tristique nisi et tristique auctor.

#### Inline Styles
This is an [inline link](#). This is `inline code`.
This is an [`inline code link`](#) .
This is **bold**. This is _italic_.

- Unordered list line-item 1
- Unordered list line-item 2
  - Unordered list line-item 2.1
  - Unordered list line-item 2.2
  - Unordered list line-item 2.3
- Unordered list line-item 3
-   Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

-   Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

1.  Unordered list line-item 1
2.  Unordered list line-item 2
  1.  Unordered list line-item 2.1
  2.  Unordered list line-item 2.2
  3.  Unordered list line-item 2.3
3.  Unordered list line-item 3
4.  Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

5.  Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[tab1](#)
[tab2](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
// This is a code block inside of a blockquote
cpu = from(bucket:"example-bucket")
  |> range(start:-30m)
  |> filter(fn:(r) => r._measurement == "cpu" and r._field == "someReallyLongFieldName")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
// This is a code block inside of a blockquote
cpu = from(bucket:"my-bucket")
  |> range(start:-30m)
  |> filter(fn:(r) => r._measurement == "cpu")
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

###### This is a table in a blockquote
| Column 1 | Column 2  | Column 3 | Column 4 | Column 1 | Column 2  | Column 3 | Column 4 |
| -------- | --------  | -------- | -------- | -------- | --------  | -------- | -------- |
| Row 1.1  | `Row 1.2` | Row 1.3  | Row 1.4  | Row 1.1  | `Row 1.2` | Row 1.3  | Row 1.4  |
| Row 2.1  | `Row 2.2` | Row 2.3  | Row 2.4  | Row 2.1  | `Row 2.2` | Row 2.3  | Row 2.4  |
| Row 3.1  | `Row 3.2` | Row 3.3  | Row 3.4  | Row 3.1  | `Row 3.2` | Row 3.3  | Row 3.4  |
| Row 4.1  | `Row 4.2` | Row 4.3  | Row 4.4  | Row 4.1  | `Row 4.2` | Row 4.3  | Row 4.4  |

{{% /note %}}

{{% warn %}}
This is a basic warning.
{{% /warn %}}


{{% warn %}}
This is a multiple paragraph blockquote with internal elements.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

## h2 This is a header2
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

{{< img-hd src="/img/test-image-2.png" alt="Test Image" />}}

### h3 This is a header3
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

#### h4 This is a header4
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

##### h5 This is a header5
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

###### h6 This is a header6
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

> Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
> Etiam tristique nisi et tristique auctor.
> Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
> Etiam tristique nisi et tristique auctor.

#### Inline Styles
This is an [inline link](#). This is `inline code`.
This is an [`inline code link`](#) .
This is **bold**. This is _italic_.

- Unordered list line-item 1
- Unordered list line-item 2
  - Unordered list line-item 2.1
  - Unordered list line-item 2.2
  - Unordered list line-item 2.3
- Unordered list line-item 3
-   Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

-   Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

1.  Unordered list line-item 1
2.  Unordered list line-item 2
  1.  Unordered list line-item 2.1
  2.  Unordered list line-item 2.2
  3.  Unordered list line-item 2.3
3.  Unordered list line-item 3
4.  Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

5.  Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[tab1](#)
[tab2](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
// This is a code block inside of a blockquote
cpu = from(bucket:"example-bucket")
  |> range(start:-30m)
  |> filter(fn:(r) => r._measurement == "cpu" and r._field == "someReallyLongFieldName")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
// This is a code block inside of a blockquote
cpu = from(bucket:"my-bucket")
  |> range(start:-30m)
  |> filter(fn:(r) => r._measurement == "cpu")
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

###### This is a table in a blockquote
| Column 1 | Column 2  | Column 3 | Column 4 | Column 1 | Column 2  | Column 3 | Column 4 |
| -------- | --------  | -------- | -------- | -------- | --------  | -------- | -------- |
| Row 1.1  | `Row 1.2` | Row 1.3  | Row 1.4  | Row 1.1  | `Row 1.2` | Row 1.3  | Row 1.4  |
| Row 2.1  | `Row 2.2` | Row 2.3  | Row 2.4  | Row 2.1  | `Row 2.2` | Row 2.3  | Row 2.4  |
| Row 3.1  | `Row 3.2` | Row 3.3  | Row 3.4  | Row 3.1  | `Row 3.2` | Row 3.3  | Row 3.4  |
| Row 4.1  | `Row 4.2` | Row 4.3  | Row 4.4  | Row 4.1  | `Row 4.2` | Row 4.3  | Row 4.4  |

{{% /warn %}}

{{% cloud %}}
This is a multiple paragraph blockquote with internal elements.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

## h2 This is a header2
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

{{< img-hd src="/img/test-image-2.png" alt="Test Image" />}}

### h3 This is a header3
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

#### h4 This is a header4
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

##### h5 This is a header5
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

###### h6 This is a header6
Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
Etiam tristique nisi et tristique auctor.

> Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
> Etiam tristique nisi et tristique auctor.
> Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
> Etiam tristique nisi et tristique auctor.

#### Inline Styles
This is an [inline link](#). This is `inline code`.
This is an [`inline code link`](#) .
This is **bold**. This is _italic_.

- Unordered list line-item 1
- Unordered list line-item 2
  - Unordered list line-item 2.1
  - Unordered list line-item 2.2
  - Unordered list line-item 2.3
- Unordered list line-item 3
-   Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

-   Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

1.  Unordered list line-item 1
2.  Unordered list line-item 2
  1.  Unordered list line-item 2.1
  2.  Unordered list line-item 2.2
  3.  Unordered list line-item 2.3
3.  Unordered list line-item 3
4.  Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

5.  Unordered list line-item with multiple paragraphs.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nunc rutrum, metus id scelerisque euismod, erat ante, ac congue enim risus id est.
    Etiam tristique nisi et tristique auctor.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[tab1](#)
[tab2](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```js
// This is a code block inside of a blockquote
cpu = from(bucket:"example-bucket")
  |> range(start:-30m)
  |> filter(fn:(r) => r._measurement == "cpu" and r._field == "someReallyLongFieldName")
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```js
// This is a code block inside of a blockquote
cpu = from(bucket:"my-bucket")
  |> range(start:-30m)
  |> filter(fn:(r) => r._measurement == "cpu")
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

###### This is a table in a blockquote
| Column 1 | Column 2  | Column 3 | Column 4 | Column 1 | Column 2  | Column 3 | Column 4 |
| -------- | --------  | -------- | -------- | -------- | --------  | -------- | -------- |
| Row 1.1  | `Row 1.2` | Row 1.3  | Row 1.4  | Row 1.1  | `Row 1.2` | Row 1.3  | Row 1.4  |
| Row 2.1  | `Row 2.2` | Row 2.3  | Row 2.4  | Row 2.1  | `Row 2.2` | Row 2.3  | Row 2.4  |
| Row 3.1  | `Row 3.2` | Row 3.3  | Row 3.4  | Row 3.1  | `Row 3.2` | Row 3.3  | Row 3.4  |
| Row 4.1  | `Row 4.2` | Row 4.3  | Row 4.4  | Row 4.1  | `Row 4.2` | Row 4.3  | Row 4.4  |

{{% /cloud %}}

{{< tabs-wrapper >}}
{{% tabs %}}
[tab 1.1](#)
[tab 1.2](#)
[tab 1.3](#)
[tab 1.4](#)
{{% /tabs %}}

{{% tab-content %}}
This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.

## h2 This is a header2
This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.

This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum, metus id scelerisque euismod, erat ante suscipit nibh, ac congue enim risus id est. Etiam tristique nisi et tristique auctor. Morbi eu bibendum erat. Sed ullamcorper, dui id lobortis efficitur, mauris odio pharetra neque, vel tempor odio dolor blandit justo.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Flux](#)
[InfluxQL](#)
{{% /code-tabs %}}

{{% code-tab-content %}}
```js
data = from(bucket: "example-bucket")
  |> range(start: -15m)
  |> filter(fn: (r) =>
    r._measurement == "mem" and
    r._field == "used_percent"
  )
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sql
SELECT "used_percent"
FROM "telegraf"."autogen"."mem"
WHERE time > now() - 15m
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

{{% /tab-content %}}

{{% tab-content %}}
This is tab 1.2 content.
{{% /tab-content %}}

{{% tab-content %}}
This is tab 1.3 content.
{{% /tab-content %}}

{{% tab-content %}}
This is tab 1.4 content.
{{% /tab-content %}}

{{< /tabs-wrapper >}}

{{< tabs-wrapper >}}
{{% tabs %}}
[tab 2.1](#)
[tab 2.2](#)
[tab 2.3](#)
[tab 2.4](#)
{{% /tabs %}}

{{% tab-content %}}
This is tab 2.1 content.
{{% /tab-content %}}

{{% tab-content %}}
This is tab 2.2 content.
{{% /tab-content %}}

{{% tab-content %}}
This is tab 2.3 content.
{{% /tab-content %}}

{{% tab-content %}}
This is tab 2.4 content.
{{% /tab-content %}}

{{< /tabs-wrapper >}}

{{% truncate %}}
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
This is truncated content.  
{{% /truncate %}}
