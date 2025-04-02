Update this pattern:

```
{{% <block-level> %}}
<block-content>
{{% /<block-level> %}}
```

to:

```
> [!<block-level-title-case>]
> <block-content>
```

Where "warn" should be "Warning".
Use the indentation of the first line as the initial indentation of the rest of
the alert block.
Add an empty newline before restyled alert block.