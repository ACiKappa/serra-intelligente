const fs = require('fs');
const path = require('path');

function saveWindowResults(date, results) {
  const folder = path.join(__dirname, '../../data/windows');
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const filePath = path.join(folder, `${date}.json`);
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));

  return filePath;
}

module.exports = saveWindowResults;
