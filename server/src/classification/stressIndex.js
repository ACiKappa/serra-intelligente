const thresholds = require('../config/thresholds_default.json');
const config = require('../config/stressIndex_default.json');

let historicalStress = {
  temperature: 0,
  humidity: 0,
  total: 0
};

function computeDeviation(value, optimalRange) {
  const { min, max } = optimalRange;

  if (value < min) return min - value;
  if (value > max) return value - max;

  return 0;
}

function getOptimalRange(param) {
  if (config.parameters[param].optimalRange === "fromThresholds") {
    return thresholds[param].optimal;
  }
  return config.parameters[param].optimalRange;
}

function updateStressForParam(param, stats) {
  if (!config.parameters[param].enabled) return 0;

  const optimal = getOptimalRange(param);
  const deviation = computeDeviation(stats[param].avg, optimal);

  const prev = historicalStress[param];
  const memory = config.coefficients.historicalMemory;

  let newStress = prev * memory;

  if (deviation > 0) {
    newStress += deviation * config.coefficients.stressIncrease;
  } else {
    newStress -= config.coefficients.stressDecrease;
  }

  newStress = Math.max(config.limits.min, Math.min(config.limits.max, newStress));

  historicalStress[param] = newStress;
  return newStress;
}

function updateStressIndex(stats) {
  const stressTemp = updateStressForParam("temperature", stats);
  const stressHum = updateStressForParam("humidity", stats);

  const wT = config.parameters.temperature.weight;
  const wH = config.parameters.humidity.weight;

  const total = (stressTemp * wT) + (stressHum * wH);

  historicalStress.total = total;

  return {
    temperature: stressTemp,
    humidity: stressHum,
    total
  };
}

module.exports = {
  updateStressIndex,
  getStressIndex: () => historicalStress
};
