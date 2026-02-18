function classifyWindow(data, thresholds, rules) {
  // Ordina le regole per priorità (1 = più importante)
  const sorted = rules.sort((a, b) => a.priority - b.priority);

  // Trova la prima regola che risulta vera
  for (const rule of sorted) {
    if (rule.conditions(data, thresholds)) {
      return rule.name;
    }
  }

  // Fallback di sicurezza
  return "Non classificato";
}

module.exports = classifyWindow;
