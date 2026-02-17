module.exports = {
  temperature: {
    low: { max: 12 },                 // troppo freddo
    suboptimal: { min: 12, max: 18 }, // freddo ma non critico
    optimal: { min: 18, max: 26 },    // zona ideale
    warning: { min: 26, max: 32 },    // caldo
    critical: { min: 32 }             // troppo caldo
  },

  humidity: {
    low: { max: 40 },                 // aria troppo secca
    suboptimal: { min: 40, max: 50 },
    optimal: { min: 50, max: 70 },
    warning: { min: 70, max: 85 },
    critical: { min: 85 }
  }
};

