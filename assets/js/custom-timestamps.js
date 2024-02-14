// Placeholder start date used in InfluxDB custom timestamps
const defaultStartDate = '2022-01-01';

// Return yyyy-mm-dd formatted string from a Date object
function formatDate (dateObj) {
  return dateObj.toISOString().replace(/T.*$/, '');
}

// Return yesterday's date
function yesterday () {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return formatDate(yesterday);
}

// Split a date string into year, month, and day
function datePart (date) {
  datePartRegex = /(\d{4})-(\d{2})-(\d{2})/;
  year = date.replace(datePartRegex, '$1');
  month = date.replace(datePartRegex, '$2');
  day = date.replace(datePartRegex, '$3');

  return { year: year, month: month, day: day };
}

///////////////////////// PREFERENCE COOKIE MANAGEMENT /////////////////////////

prefID = 'sample_get_started_date';

function setStartDate (setDate) {
  setPreference(prefID, setDate);
}

function getStartDate () {
  return getPreference(prefID);
}

////////////////////////////////////////////////////////////////////////////////

// If the user has not set the startDate cookie, default the startDate to yesterday
var startDate = getStartDate() || yesterday();

// Convert a time value to a Unix timestamp (seconds)
function timeToUnixSeconds (time) {
  unixSeconds = new Date(time).getTime() / 1000;

  return unixSeconds;
}

// Default time values in getting started sample data
let times = [
  {
    rfc3339: `${defaultStartDate}T08:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T08:00:00Z`),
  }, // 1641024000
  {
    rfc3339: `${defaultStartDate}T09:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T09:00:00Z`),
  }, // 1641027600
  {
    rfc3339: `${defaultStartDate}T10:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T10:00:00Z`),
  }, // 1641031200
  {
    rfc3339: `${defaultStartDate}T11:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T11:00:00Z`),
  }, // 1641034800
  {
    rfc3339: `${defaultStartDate}T12:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T12:00:00Z`),
  }, // 1641038400
  {
    rfc3339: `${defaultStartDate}T13:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T13:00:00Z`),
  }, // 1641042000
  {
    rfc3339: `${defaultStartDate}T14:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T14:00:00Z`),
  }, // 1641045600
  {
    rfc3339: `${defaultStartDate}T15:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T15:00:00Z`),
  }, // 1641049200
  {
    rfc3339: `${defaultStartDate}T16:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T16:00:00Z`),
  }, // 1641052800
  {
    rfc3339: `${defaultStartDate}T17:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T17:00:00Z`),
  }, // 1641056400
  {
    rfc3339: `${defaultStartDate}T18:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T18:00:00Z`),
  }, // 1641060000
  {
    rfc3339: `${defaultStartDate}T19:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T19:00:00Z`),
  }, // 1641063600
  {
    rfc3339: `${defaultStartDate}T20:00:00Z`,
    unix: timeToUnixSeconds(`${defaultStartDate}T20:00:00Z`),
  }, // 1641067200
];

function updateTimestamps (newStartDate) {
  // Update the times array with replacement times
  times = times.map(x => {
    var newStartTimestamp = x.rfc3339.replace(/^.*T/, newStartDate + 'T');

    return {
      rfc3339: x.rfc3339,
      unix: x.unix,
      rfc3339_new: newStartTimestamp,
      unix_new: timeToUnixSeconds(newStartTimestamp),
    };
  });

  var updateBlockElWhitelist = [
    '.custom-timestamps pre',
    '.custom-timestamps li',
    '.custom-timestamps p',
    '.custom-timestamps table',
  ];

  $(updateBlockElWhitelist.join()).each(function () {
    var wrapper = $(this)[0];

    times.forEach(function (x) {
      oldDatePart = datePart(x.rfc3339.replace(/T.*$/, ''));
      newDatePart = datePart(x.rfc3339_new.replace(/T.*$/, ''));
      rfc3339Regex = new RegExp(
        `${oldDatePart.year}(.*)${oldDatePart.month}(.*)${oldDatePart.day}`,
        'g'
      );
      rfc3339Repl = `${newDatePart.year}$1${newDatePart.month}$2${newDatePart.day}`;

      wrapper.innerHTML = wrapper.innerHTML
        .replaceAll(x.unix, x.unix_new)
        .replaceAll(rfc3339Regex, rfc3339Repl);
    });
  });

  $('span.custom-timestamps').each(function () {
    var wrapper = $(this)[0];

    times.forEach(function (x) {
      oldDatePart = datePart(x.rfc3339.replace(/T.*$/, ''));
      newDatePart = datePart(x.rfc3339_new.replace(/T.*$/, ''));
      rfc3339Regex = new RegExp(
        `${oldDatePart.year}-${oldDatePart.month}-${oldDatePart.day}`,
        'g'
      );
      rfc3339Repl = `${newDatePart.year}-${newDatePart.month}-${newDatePart.day}`;

      wrapper.innerHTML = wrapper.innerHTML
        .replaceAll(x.unix, x.unix_new)
        .replaceAll(rfc3339Regex, rfc3339Repl);
    });
  });

  // Create a new seed times array with new start time for next change
  times = times.map(x => {
    var newStartTimestamp = x.rfc3339.replace(/^.*T/, newStartDate + 'T');

    return {
      rfc3339: newStartTimestamp,
      unix: timeToUnixSeconds(newStartTimestamp),
    };
  });
}

/////////////////////// MODAL INTERACTIONS / DATE PICKER ///////////////////////

// Date picker form element
var datePickerEl = $('#custom-date-selector');

// Initialize the date picker with the current startDate
const elem = datePickerEl[0];
const datepicker = new Datepicker(elem, {
  defaultViewDate: startDate,
  format: 'yyyy-mm-dd',
  nextArrow: '>',
  prevArrow: '<',
});

//////////////////////////////////// ACTIONS ///////////////////////////////////

// Initial update to yesterdays date ON PAGE LOAD
// Conditionally set the start date cookie it startDate is equal to the default value
updateTimestamps(startDate);
if (startDate === yesterday()) {
  setStartDate(startDate);
}

// Sumbit new date
$('#submit-custom-date').click(function () {
  let newDate = datepicker.getDate();

  if (newDate != undefined) {
    newDate = formatDate(newDate);

    updateTimestamps(newDate);
    setStartDate(newDate);
    toggleModal('#influxdb-gs-date-select');
  } else {
    toggleModal('#influxdb-gs-date-select');
  }
});
