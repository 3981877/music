const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const output = path.join(publicDir, 'music-list.json');
const exts = ['.mp3', '.flac', '.wav', '.ogg', '.aac', '.m4a'];

function scanMusicFiles(dir, base = '') {
  let result = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    const relPath = base ? base + '/' + entry.name : entry.name;
    if (entry.isDirectory()) {
      result = result.concat(scanMusicFiles(fullPath, relPath));
    } else if (exts.includes(path.extname(entry.name).toLowerCase())) {
      result.push({
        title: path.basename(entry.name, path.extname(entry.name)),
        src: '/' + encodeURIComponent(relPath)
      });
    }
  });
  return result;
}

const list = scanMusicFiles(publicDir);
fs.writeFileSync(output, JSON.stringify(list, null, 2), 'utf-8');
console.log('music-list.json 已生成，共', list.length, '首');