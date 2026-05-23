const fs = require('fs');
try {
  console.log("Root files:", fs.readdirSync('/'));
} catch(e) {
  console.error(e.message);
}
