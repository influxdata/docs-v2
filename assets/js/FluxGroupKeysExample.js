import $ from 'jquery';

// Default group key
const groupKeyDefault = ["_measurement", "loc", "sensorID", "_field"];
const sampleData = [
  [
    { _time: "2021-01-01T00:00:00Z", _measurement: "example", loc: "rm1", sensorID: "A123", _field: "temp", _value: 110.3 },
    { _time: "2021-01-01T00:01:00Z", _measurement: "example", loc: "rm1", sensorID: "A123", _field: "temp", _value: 112.5 },
    { _time: "2021-01-01T00:02:00Z", _measurement: "example", loc: "rm1", sensorID: "A123", _field: "temp", _value: 111.9 }
  ],
  [
    { _time: "2021-01-01T00:00:00Z", _measurement: "example", loc: "rm1", sensorID: "A123", _field: "hum", _value: 73.4 },
    { _time: "2021-01-01T00:01:00Z", _measurement: "example", loc: "rm1", sensorID: "A123", _field: "hum", _value: 73.7 },
    { _time: "2021-01-01T00:02:00Z", _measurement: "example", loc: "rm1", sensorID: "A123", _field: "hum", _value: 75.1 }
  ],
  [
    { _time: "2021-01-01T00:00:00Z", _measurement: "example", loc: "rm2", sensorID: "B456", _field: "temp", _value: 108.2 },
    { _time: "2021-01-01T00:01:00Z", _measurement: "example", loc: "rm2", sensorID: "B456", _field: "temp", _value: 108.5 },
    { _time: "2021-01-01T00:02:00Z", _measurement: "example", loc: "rm2", sensorID: "B456", _field: "temp", _value: 109.6 }
  ],
  [
    { _time: "2021-01-01T00:00:00Z", _measurement: "example", loc: "rm2", sensorID: "B456", _field: "hum", _value: 71.8 },
    { _time: "2021-01-01T00:01:00Z", _measurement: "example", loc: "rm2", sensorID: "B456", _field: "hum", _value: 72.3 },
    { _time: "2021-01-01T00:02:00Z", _measurement: "example", loc: "rm2", sensorID: "B456", _field: "hum", _value: 72.1 }
  ]
]

// Build a table group (group key and table) using an array of objects
function buildTable(inputData, groupKey) {
  const stringColumns = ["_measurement", "loc", "sensorID", "_field"];
  // Build the group key string
  function wrapString(column, value) {
    if (stringColumns.includes(column)) {
      return '"' + value + '"'
    } else {
      return value
    }
  }
  
  let groupKeyArray = groupKey.map(column => column + ": " + wrapString(column, inputData[0][column]))
  var groupKeyString = `Group key instance = [${groupKeyArray.join(", ")}]`;
  var groupKeyLabel = document.createElement("p");
  groupKeyLabel.className = "table-group-key"
  groupKeyLabel.innerHTML = groupKeyString

  // Extract column headers
  var columns = [];
  for (var i = 0; i < inputData.length; i++) {
    for (var key in inputData[i]) {
      if (columns.indexOf(key) === -1) {
        columns.push(key);
      }
    }
  }
  
  // Create the table element
  var table = document.createElement("table");
  
  // Create the table header
  for (let i = 0; i < columns.length; i++) {
    var header = table.createTHead();
    var th = document.createElement("th");
    th.innerHTML = columns[i];
    if (groupKey.includes(columns[i])) {
      th.className = "grouped-by";
    }
    header.appendChild(th);
  }

  // Add inputData to the HTML table
  for (let i = 0; i < inputData.length; i++) {
    tr = table.insertRow(-1);
    for (let j = 0; j < columns.length; j++) {
      var td = tr.insertCell(-1);
      td.innerHTML = inputData[i][columns[j]];
      // Highlight the value if column is part of the group key
      if (groupKey.includes(columns[j])) {
        td.className = "grouped-by";
      }
    }
  }

  // Create a table group with group key and table
  var tableGroup = document.createElement("div");
  tableGroup.innerHTML += groupKeyLabel.outerHTML + table.outerHTML

  return tableGroup
}

// Clear and rebuild all HTML tables
function buildTables(tablesElement, data, groupKey) {
  while (tablesElement.firstElementChild) {
    tablesElement.firstElementChild.remove();
  }
  for (let i = 0; i < data.length; i++) {
    var table = buildTable(data[i], groupKey)
    tablesElement.append(table);
  }
}

// Helper function to group data based on the group key
function groupData(data, groupKey) {
  let groupedData = data.flat()

  function groupBy(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    })
  }

  return groupBy(groupedData, function (r) {
    return groupKey.map(v => r[v]);
  });
}

function getCheckedNames() {
  // Get selected column names
  return Array.from(document.querySelectorAll(`${checkboxSelector}:checked`))
    .map(el => el.name);
}

// Build example group function
function buildFluxCodeSample(columnNames) {
  var columnCollection = columnNames.map(i => '<span class=\"s2\">"' + i + '"</span>').join(", ")
  $("pre#group-by-example")[0].innerHTML = "data\n  <span class='nx'>|></span> group(columns<span class='nx'>:</span> [" + columnCollection + "])";
}

const checkboxSelector = ".column-list input[type=checkbox]";

export default function FluxGroupKeysExample() {
  // Group and render tables on load
  // Build group example on load
  const tablesElement = document.querySelector("#flux-group-keys-demo #grouped-tables");

  if (!tablesElement) {
    return;
  }

  tablesElement.addEventListener('load', buildTables(tablesElement, sampleData, groupKeyDefault));

  // Add event listener to checkboxes
  // Rebuild tables and group example on change
  // Use on('change') so the function is only called once (after the change is complete).
  document.querySelectorAll(checkboxSelector).forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      const checkedGroupKey = getCheckedNames();
      const groupedData = groupData(sampleData, checkedGroupKey);
      buildTables(tablesElement, groupedData, checkedGroupKey);
      buildFluxCodeSample(checkedGroupKey);
    });
  });
}