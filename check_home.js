const fs = require('fs');
try {
  console.log('/home/node:', fs.readdirSync('/home/node'));
} catch(e) {
  console.error(e.message);
}
