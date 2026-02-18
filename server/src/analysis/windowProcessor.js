// server/src/analysis/windowProcessor.js

const analyzeWindow = require('./analyzeWindow');
const classifyWindow = require('./classifyWindow');
const { updateStressIndex } = require('../classification/stressIndex');

/**
 * Raggruppa i dati grezzi in finestre temporali di N ore.
 * @param {Array} data - array di misure grezze [{ timestamp, temperature, humidity, ... }]
 * @param {number} hours - dimensione della finestra in ore
 * @returns {Array} array di finestre, ognuna contenente un sotto-array di misure
 */
function groupByWindow(data, hours) {
  if (!data || data.length === 0) return [];

  const windowMs = hours * 60 * 60 * 1000;
  const sorted = [...data].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const windows = [];
  let currentWindow = [];
  let windowStart = new Date(sorted[0].timestamp).getTime();

  for (const entry of sorted) {
    const ts = new Date(entry.timestamp).getTime();

    if (ts - windowStart < windowMs) {
      currentWindow.push(entry);
    } else {
      windows.push(currentWindow);
      currentWindow = [entry];
      windowStart = ts;
    }
  }

  if (currentWindow.length > 0) {
    windows.push(currentWindow);
  }

  return windows;
}

/**
 * Processa i dati in finestre:
 * - analisi statistica
 * - classificazione
 * - stress index
 * @param {Array} rawData - dati grezzi
 * @param {number} hours - durata della finestra
 * @returns {Array} risultati per ogni finestra
 */
function processWindows(rawData, hours = 3) {
  const windows = groupByWindow(rawData, hours);
  const results = [];

  for (const windowData of windows) {
    const stats = analyzeWindow(windowData);          // media, deviazione, min/max
    const classification = classifyWindow(stats);     // optimal, warning, etc.
    const stress = updateStressIndex(stats);          // stress temperatura, umidità, totale

    results.push({
      timestampStart: windowData[0].timestamp,
      timestampEnd: windowData[windowData.length - 1].timestamp,
      stats,
      classification,
      stress
    });
  }

  return results;
}

module.exports = {
  groupByWindow,
  processWindows
};
