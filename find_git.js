const fs = require('fs');
const path = require('path');

function findGit(dir, depth = 0) {
  if (depth > 6) return;
  try {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      if (f === 'node_modules' || f === '.next') continue;
      const full = path.join(dir, f);
      if (f === 'config' && dir.endsWith('.git')) {
        console.log("FOUND GIT CONFIG:", full);
        console.log(fs.readFileSync(full, 'utf8'));
      }
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          findGit(full, depth + 1);
        }
      } catch(e) {}
    }
  } catch(e) {}
}

findGit('/');
