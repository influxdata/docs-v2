const yaml = require('js-yaml');
const fs = require('fs');

function getName(item) {
  if(typeof(item) === 'string') {
    return item;
  }
  if(item.hasOwnProperty('name')) {
    return item.name;
  }
}

function sortName(a, b) {
  let nameA = getName(a)
  nameA = nameA.toUpperCase();
  let nameB = getName(b)
  nameB = nameB.toUpperCase();
  if(nameA < nameB) {
    return -1;
  }
  if(nameA > nameB) {
    return 1;
  }
  return 0;
}

/**
 * Returns true if item or item.name exists in collection
 */
function isPresent(collection, item) {
  const itemName = getName(item);
  return (
    collection.indexOf(itemName) > -1 
    || collection.filter(ci => ci.name && ci.name === itemName).length > 0
  );
}

/**
 * Merges items from Array items to Array collection and removes duplicates from collection.
 *
 */
function collect(collection, items) {
  if(Array.isArray(items)) {
    collection = collection
      .concat(items.filter(item => !isPresent(collection, item))); 
  }
  return collection;
}

function toJSON(yamlPath) {
  try {
    return yaml.load(fs.readFileSync(yamlPath, 'utf8'));
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  collect,
  getName,
  isPresent,
  sortName,
  toJSON,
}

