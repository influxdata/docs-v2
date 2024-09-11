const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');


function readFile(filepath, encoding, callback) {
  return yaml.load(fs.readFileSync(filepath, encoding));
}

function writeDataFile(data, outputTo, callback) {
  fs.writeFileSync(outputTo, yaml.dump(data));
}

const openapiUtils = {
  isPlaceholderFragment: function(str) {
    const placeholderRegex = new RegExp('^\{.*\}$');
    return placeholderRegex.test(str);
  }
}

function openapiPaths(openapi, prefix, outPath) {
  const pathGroups = {};
  Object.keys(openapi.paths).sort()
  .forEach((p) => {
    const delimiter = '/';
    let key = p.split(delimiter);
    let isItemPath = openapiUtils.isPlaceholderFragment(key[key.length - 1]);
    if(isItemPath) {
      key = key.slice(0, -1);
    }
    key = (key.slice(0, 4))
    isItemPath = openapiUtils.isPlaceholderFragment(key[key.length - 1]);
    if(isItemPath) {
      key = key.slice(0, -1);
    }
    const groupKey = key.join('/');
    pathGroups[groupKey] = pathGroups[groupKey] || {};
    pathGroups[groupKey][p] = openapi.paths[p];
  })

  Object.keys(pathGroups).forEach(pg => {
    // Deep copy openapi.
    let doc = JSON.stringify(openapi);
    doc = JSON.parse(doc);
    doc.paths = pathGroups[pg];
    doc.info.title = `${pg}\n${doc.info.title}`;
    doc['x-pathGroup'] = pg;
    try {
      if (!fs.existsSync(outPath)) {
        fs.mkdirSync(outPath, {recursive: true});
      }
      const realOutPath = path.resolve(outPath, `${prefix}${pg.replaceAll('/', '-').replace(/^-/, '')}.yaml`);
      writeDataFile(doc, realOutPath);
    } catch (err) {
      console.error(err);
    }
   })
}

function createArticleDataForPathGroup(openapi) {
  const article = {
    path: '',
    fields: {
      name: openapi['x-pathGroup'],
      describes: Object.keys(openapi.paths)
    }
  };
  const snakifyPath = (p) => {
    if(!path) {
      return;
    }
    return p.replace(/^\//, '')
            .replaceAll('/', '-');
  }
  article.path = snakifyPath(openapi['x-pathGroup']);
  article.fields.title = openapi.info && openapi.info.title;
  article.fields.description = openapi.description;
  const pathGroupFrags = path.parse(openapi['x-pathGroup']);
  console.log(pathGroupFrags)
  article.fields.tags = ([pathGroupFrags?.dir, pathGroupFrags?.name])
    .map( t => snakifyPath(t))
    .filter(t => t.length > 0);
  return article;
}

function openapiMetadata(sourcePath, targetPath, opts) {
  const isFile = filePath => {
    return fs.lstatSync(filePath).isFile();
  };

  const matchesPattern = filePath => {
    return opts.filePattern ? path.parse(filePath).name.startsWith(opts.filePattern) : true;
  };
  
  try {
    const articles = fs.readdirSync(sourcePath)
    .map(fileName => {
      return path.join(sourcePath, fileName);
    })
    .filter(matchesPattern)
    .filter(isFile)
    .map(filePath => {
      const openapi = readFile(filePath);
      const article = createArticleDataForPathGroup(openapi);
      article.fields.source = filePath;
      article.fields.staticFilePath = filePath.replace(/^static\//, '/'); // This might appear counterintuitive; Hugo omits "/static" from the URI when serving files stored in the "./static" directory.  
      return article;
    });
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, {recursive: true});
    }
    const articlePath = path.resolve(targetPath, 'articles.yml');
    writeDataFile({ articles }, articlePath);
  } catch(e) {
    console.log(e);
  }
}

function openapiToData(options) {
  const filenamePrefix = `${path.parse(options.specFile).name}-`;

  const sourceFile = readFile(options.specFile, 'utf8');
  console.log(`Generating OpenAPI path files in ${options.dataOutPath}....`);
  openapiPaths(sourceFile, filenamePrefix, options.dataOutPath);

  console.log(`Generating OpenAPI article data in ${options.articleOutPath}...`);
  openapiMetadata(options.dataOutPath, options.articleOutPath, {filePattern: filenamePrefix});
}

module.exports = {
  openapiToData,
  openapiPaths,
  openapiMetadata
};