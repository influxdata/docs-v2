import $ from 'jquery';
import { Datepicker } from 'vanillajs-datepicker';
import { toggleModal } from './modals.js';
import * as localStorage from './services/local-storage.js';
import {
  sampleDay,
  shiftTimestampText,
  timestampDays,
} from './custom-timestamp-values.js';

const dateFormat = 'yyyy-mm-dd';

// Formats a date as YYYY-MM-DD in local time.
function formatDate(dateObj) {
  return Datepicker.formatDate(dateObj, dateFormat);
}

// Returns yesterday's date.
function yesterday() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return formatDate(yesterday);
}

const prefID = 'sample_get_started_date';

function setStartDate(setDate) {
  localStorage.setPreference(prefID, setDate);
}

function getStartDate() {
  return localStorage.getPreference(prefID);
}

// Uses the saved date or defaults to yesterday.
var startDate = getStartDate() || yesterday();

function timestampNodes(root) {
  const nodes = [];
  function visit(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const days = timestampDays(node.textContent);
      if (days.length) nodes.push({ node, days });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (
        node !== root &&
        node.matches('.code-placeholder, [data-component], .custom-timestamps')
      ) {
        return;
      }
      Array.from(node.childNodes).forEach(visit);
    }
  }
  visit(root);
  return nodes;
}

function updateTimestamps(newStartDate) {
  const milliseconds = Date.parse(`${newStartDate}T00:00:00Z`);
  if (!Number.isFinite(milliseconds)) return;
  const selectedDay = BigInt(milliseconds) / 86400000n;
  document.querySelectorAll('.custom-timestamps').forEach((root) => {
    const nodes = timestampNodes(root);
    if (!nodes.length) return;
    const shift = selectedDay - sampleDay(nodes.flatMap(({ days }) => days));
    nodes.forEach(({ node }) => {
      node.textContent = shiftTimestampText(node.textContent, shift);
    });
  });
}

function CustomTimeTrigger({ component }) {
  const $component = $(component);
  $component
    .find('a[data-action="open"]:first')
    .on('click', () => toggleModal('#influxdb-gs-date-select'));

  var datePickerEl = $('#custom-date-selector');

  // Initializes the picker with the saved date.
  const elem = datePickerEl[0];
  const datepicker = new Datepicker(elem, {
    defaultViewDate: startDate,
    format: dateFormat,
    nextArrow: '>',
    prevArrow: '<',
  });
  datepicker.setDate(startDate);

  // Applies the sample date on page load.
  updateTimestamps(startDate);

  if (startDate === yesterday()) {
    setStartDate(startDate);
  }

  // Applies and saves the selected date.
  $('#submit-custom-date').click(function () {
    const newDate = datepicker.getDate(dateFormat);

    if (newDate != undefined) {
      updateTimestamps(newDate);
      setStartDate(newDate);
      toggleModal('#influxdb-gs-date-select');
    } else {
      toggleModal('#influxdb-gs-date-select');
    }
  });
}

export { CustomTimeTrigger };
