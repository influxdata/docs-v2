import $ from 'jquery';
import { Datepicker } from 'vanillajs-datepicker';
import { toggleModal } from './modals.js';
import * as localStorage from './services/local-storage.js';
import {
  sampleAnchorDay,
  shiftTimestampText,
  timestampDays,
} from './custom-timestamp-values.js';

const dateFormat = 'yyyy-mm-dd';

function formatLocalDate(date) {
  return Datepicker.formatDate(date, dateFormat);
}

function yesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatLocalDate(date);
}

const samplePreference = 'sample_get_started_date';

function saveSampleDate(date) {
  localStorage.setPreference(samplePreference, date);
}

const savedSampleDate = localStorage.getPreference(samplePreference);
const sampleDate = savedSampleDate || yesterday();

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

function shiftTimestampsTo(date, sampleStartDays) {
  const milliseconds = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(milliseconds)) return;
  const selectedDay = BigInt(milliseconds) / 86400000n;
  document.querySelectorAll('.custom-timestamps').forEach((root) => {
    const nodes = timestampNodes(root);
    if (!nodes.length) return;
    const days = nodes.flatMap(({ days }) => days);
    const shift = selectedDay - sampleAnchorDay(days, sampleStartDays);
    nodes.forEach(({ node }) => {
      node.textContent = shiftTimestampText(node.textContent, shift);
    });
  });
}

function createDatePicker(element, date) {
  const datepicker = new Datepicker(element, {
    defaultViewDate: date,
    format: dateFormat,
    nextArrow: '>',
    prevArrow: '<',
  });
  datepicker.setDate(date);
  return datepicker;
}

function toggleDateModal() {
  toggleModal('#influxdb-gs-date-select');
}

function configuredSampleStartDays(component) {
  const startDates = JSON.parse(component.dataset.sampleStartDates || '[]');
  return startDates.flatMap((startDate) => timestampDays(startDate));
}

function CustomTimeTrigger({ component }) {
  $(component).find('a[data-action="open"]:first').on('click', toggleDateModal);
  const sampleStartDays = configuredSampleStartDays(component);

  const datepicker = createDatePicker(
    document.getElementById('custom-date-selector'),
    sampleDate
  );

  shiftTimestampsTo(sampleDate, sampleStartDays);
  if (!savedSampleDate) saveSampleDate(sampleDate);

  $('#submit-custom-date').click(function applySelectedDate() {
    const selectedDate = datepicker.getDate(dateFormat);
    if (selectedDate) {
      shiftTimestampsTo(selectedDate, sampleStartDays);
      saveSampleDate(selectedDate);
    }
    toggleDateModal();
  });
}

export { CustomTimeTrigger };
