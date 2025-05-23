/*
This script appends frontmatter to Flux standard library documentation that
can't be generated in the Flux auto-gen process.
The script iterates through file paths defined in data/flux_stdlib_frontmatter.yml
and appends the associated frontmatter.
*/

const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

// Check to see if frontmatter has already been injected
hasFrontmatter = () => {
  var sampleFile = fs.readFileSync(path.resolve(__dirname, "../content/flux/v0/stdlib/array/_index.md")).toString();

  return sampleFile.includes("aliases:");
}

// Exit with success
exitWithSuccess = (message) => {
  console.log(message);
  process.exit(0);
}

injectFrontmatter = () => {
  const frontmatter = yaml.load(fs.readFileSync(path.resolve(__dirname, '../data/flux_stdlib_frontmatter.yml'), 'utf8'))

  for (const [key, value] of Object.entries(frontmatter)) {

    let pageText = fs.readFileSync(path.resolve(__dirname, `../content${key}`)).toString()
    let i = 0
    
    pageText = pageText.replace(/^---/gm, (match) => ++i === 2 ? `${value}---` : match);
  
    fs.writeFile(path.resolve(__dirname, `../content${key}`), pageText, (err) => {
      if (err) throw err;
    });
  }

  console.log("Flux standard library frontmatter injected!");
}

if ( hasFrontmatter() ) {
  exitWithSuccess("Flux standard library frontmatter has already been injected. Skipping...");
} else {
  injectFrontmatter();
}
