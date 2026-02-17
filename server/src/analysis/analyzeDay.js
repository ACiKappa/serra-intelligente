const loadThresholds = require("../config/loadThresholds");
const rules = require("../config/classifyRules_default");
const classifyDay = require("./classifyDay");

// Calcolo media
function avg(values) {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

// Calcolo deviazione semplice (stabilità)
function stability(values) {
  if (!values.length) return null;
  const m = avg(values);
  const diffs = values.map(v => Math.abs(v - m));
  return avg(diffs);
}

// Correlazione Pearson semplificata
function correlation(x, y) {
  if (x.length !== y.length || x.length === 0) return null;

  const avgX = avg(x);
  const avgY = avg(y);

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < x.length; i++) {
    const dx = x[i] - avgX;
    const dy = y[i] - avgY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const den = Math.sqrt(denX * denY);
  return den === 0 ? null : num / den;
}

// Funzione principale
function analyzeDay(measures) {
  if (!measures || measures.length === 0) {
    return { error: "Nessun dato disponibile per questo giorno" };
  }

  const temps = measures.map(m => m.temperature);
  const hums = measures.map(m => m.humidity);

  const data = {
    minTemp: Math.min(...temps),
    maxTemp: Math.max(...temps),
    avgTemp: avg(temps),
    stabilityTemp: stability(temps),

    minHumidity: Math.min(...hums),
    maxHumidity: Math.max(...hums),
    avgHumidity: avg(hums),
    stabilityHumidity: stability(hums),

    correlationTRH: correlation(temps, hums),

    count: measures.length
  };

  // Carica soglie finali (default + user)
  const thresholds = loadThresholds();

  // Classificazione finale
  const className = classifyDay(data, thresholds, rules);

  return {
    ...data,
    className,
    thresholdsUsed: thresholds
  };
}

module.exports = analyzeDay;
