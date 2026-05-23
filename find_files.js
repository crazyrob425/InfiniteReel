const fs = require('fs');
const path = require('path');

function findTSX(dir, depth = 0) {
  if (depth > 6) return;
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (['node_modules', '.next', '.git_back', '.git', 'proc', 'sys', 'dev', 'lib', 'lib64', 'sbin', 'bin', 'usr', 'var', 'etc'].includes(file)) {
        continue;
      }
      const full = path.join(dir, file);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          findTSX(full, depth + 1);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.json')) {
          console.log("FOUND FILE:", full);
        }
      } catch(e) {}
    }
  } catch(e) {}
}

console.log("Searching current working directory for source files...");
findTSX(process.cwd());
console.log("Search finished.");
