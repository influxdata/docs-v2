/*
This script appends frontmatter to Flux standard library documentation that
can't be generated in the Flux auto-gen process.
The script iterates through file paths defined in data/flux_stdlib_frontmatter.yml
and appends the associated frontmatter.
*/

const yaml = require('js-yaml')
const fs = require('fs')

const frontmatter = yaml.load(fs.readFileSync('./data/flux_stdlib_frontmatter.yml', 'utf8'))

for (const [key, value] of Object.entries(frontmatter)) {

  let pageText = fs.readFileSync(`./content${key}`).toString()
  let i = 0
  
  pageText = pageText.replace(/^---/gm, (match) => ++i === 2 ? `${value}---` : match);

  fs.writeFile(`./content${key}`, pageText, (err) => {
    if (err) throw err;
  })
}
