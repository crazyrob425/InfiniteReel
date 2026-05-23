const fs = require('fs');
const path = require('path');

function searchAll(dir, depth = 0) {
  if (depth > 6) return;
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const full = path.join(dir, file);
      if (file.toLowerCase().includes('generator') || file.toLowerCase().includes('package.json') || file.toLowerCase().includes('storyboard')) {
        console.log("MATCH:", full);
      }
      if (['node_modules', '.next', '.git_back', '.git', 'proc', 'sys', 'dev', 'lib', 'lib64', 'sbin', 'bin', 'usr', 'var', 'etc'].includes(file)) {
        continue;
      }
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          searchAll(full, depth + 1);
        }
      } catch(e) {}
    }
  } catch(e) {}
}

console.log("Searching everything starting from /...");
searchAll('/');
console.log("Done.");
