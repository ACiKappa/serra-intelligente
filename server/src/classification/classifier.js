const thresholds = require('../config/thresholds_default.json');

function classifySingleValue(value, parameterThresholds) {
  // parameterThresholds è qualcosa tipo:
  // { low: { max: 12 }, suboptimal: { min: 12, max: 18 }, ... }

  for (const [label, range] of Object.entries(parameterThresholds)) {
    const { min, max } = range;

    const minOk = (min === undefined) || (value >= min);
    const maxOk = (max === undefined) || (value < max);

    if (minOk && maxOk) {
      return label;
    }
  }

  return 'unknown';
}

function classifyMeasurements(measurements) {
  // measurements è qualcosa tipo:
  // { temperature: 27.3, humidity: 41 }

  const result = {};

  for (const [key, value] of Object.entries(measurements)) {
    if (thresholds[key]) {
      result[key] = classifySingleValue(value, thresholds[key]);
    }
  }

  return result;
}

module.exports = {
  classifySingleValue,
  classifyMeasurements
};

