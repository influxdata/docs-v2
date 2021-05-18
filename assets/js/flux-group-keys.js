var tablesElement = $("#flux-group-keys-demo #grouped-tables")

// Sample data
let data = [
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

// Default group key
let groupKey = ["_measurement", "loc", "sensorID", "_field"]

// Build a table group (group key and table) using an array of objects
function buildTable(inputData) {
  // Build the group key string
  var groupKeyString = "Group key = [" + (groupKey.map(column => column + ": " + (inputData[0])[column])).join(", ") + "]";
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
function buildTables(data) {
  existingTables = tablesElement[0]
  while (existingTables.firstChild) {
    existingTables.removeChild(existingTables.firstChild);
  }
  for (let i = 0; i < data.length; i++) {
    var table = buildTable(data[i])
    tablesElement.append(table);
  }
}

// Group data based on the group key and output new tables
function groupData() {
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

  groupedData = groupBy(groupedData, function (r) {
    return groupKey.map(v => r[v]);
  });

  buildTables(groupedData);
}

// Get selected column names
var checkboxes = $("input[type=checkbox]");

function getChecked() {
  var checked = [];
  for (var i = 0; i < checkboxes.length; i++) {
    var checkbox = checkboxes[i];
    if (checkbox.checked) checked.push(checkbox.name);
  }
  return checked;
}

function toggleCheckbox(element) {
  element.checked = !element.checked;
}

$(".column-list label").click(function () {
  toggleCheckbox($(this))
  groupKey = getChecked();
  groupData();
});

// Group and render tables on load
groupData()
