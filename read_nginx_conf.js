const fs = require('fs');

function findConf(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      if (f.endsWith('.conf')) {
        console.log("FOUND CONFIG:", dir + '/' + f);
        console.log(fs.readFileSync(dir + '/' + f, 'utf8'));
      }
    }
  } catch(e) {
    console.error(`Failed to read config in ${dir}:`, e.message);
  }
}

findConf('/etc/nginx');
findConf('/etc/nginx/conf.d');
findConf('/etc/nginx/sites-enabled');
findConf('/etc/nginx/sites-available');
