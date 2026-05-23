const fs = require('fs');
const path = require('path');

function showAllFiles(dir, depth = 0) {
  if (depth > 5) return;
  try {
    const list = fs.readdirSync(dir);
    console.log(`${' '.repeat(depth * 3)}[DIR] ${dir}`);
    for (const file of list) {
      if (file === 'node_modules' || file === '.next') continue;
      const full = path.join(dir, file);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          showAllFiles(full, depth + 1);
        } else {
          console.log(`${' '.repeat((depth + 1) * 3)}[FILE] ${file} (${stat.size} bytes)`);
        }
      } catch(e) {
        console.log(`${' '.repeat((depth + 1) * 3)}[ERROR] ${file}: ${e.message}`);
      }
    }
  } catch(e) {
    console.log(`${' '.repeat(depth * 3)}[FAILED] ${dir}: ${e.message}`);
  }
}

showAllFiles('/app/applet');
