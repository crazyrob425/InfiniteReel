const fs = require('fs');
const path = require('path');

function checkLogs(dir) {
  try {
    const list = fs.readdirSync(dir);
    console.log(`Logs in ${dir}:`, list);
    for (const f of list) {
      const full = path.join(dir, f);
      try {
        const stat = fs.statSync(full);
        if (stat.isFile()) {
          console.log(`Content of ${full} (first 300 chars):`);
          console.log(fs.readFileSync(full, 'utf8').slice(0, 300));
        }
      } catch(e) {}
    }
  } catch(e) {
    console.error(`Failed to read logs in ${dir}:`, e.message);
  }
}

checkLogs('/var/log');
try {
  const rootDir = '/root/.npm/_logs';
  const list = fs.readdirSync(rootDir);
  console.log(`npm logs:`, list);
} catch(e) {}
