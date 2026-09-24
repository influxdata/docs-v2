# Content checks

Run `yarn lint-codeblocks <files>`. Build rendered pages before link validation:
`link-checker map <files> | xargs link-checker check`. For shared sources include
every product stub that references the source.
