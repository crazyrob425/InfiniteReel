const fs = require('fs');
try {
  console.log("Files in /workspace:", fs.readdirSync('/workspace'));
} catch(e) {
  console.error(e.message);
}
