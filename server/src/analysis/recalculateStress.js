const fs = require('fs');
const path = require('path');
const { updateStressIndex } = require('../classification/stressIndex');

function recalculateStressForFile(filePath) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const recalculated = content.map(entry => {
    const newStress = updateStressIndex(entry.stats);
    return {
      ...entry,
      stress: newStress
    };
  });

  fs.writeFileSync(filePath, JSON.stringify(recalculated, null, 2));
  return recalculated;
}

function recalculateAll() {
  const folder = path.join(__dirname, '../../data/windows');
  const files = fs.readdirSync(folder);

  files.forEach(file => {
    const fullPath = path.join(folder, file);
    recalculateStressForFile(fullPath);
  });
}

module.exports = {
  recalculateStressForFile,
  recalculateAll
};
