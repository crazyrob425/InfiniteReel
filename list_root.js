const fs = require('fs');

try {
  console.log("Files in /root:", fs.readdirSync('/root'));
  console.log("Files in /root/.npm:", fs.readdirSync('/root/.npm'));
} catch(e) {
  console.error(e.message);
}
