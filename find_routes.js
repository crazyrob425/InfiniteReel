const fs = require('fs');

try {
  const buf = fs.readFileSync('/app/control-plane-api/control-plane-api');
  let currentString = '';
  const found = [];
  for (let i = 0; i < buf.length; i++) {
    const char = buf[i];
    if (char >= 32 && char <= 126) {
      currentString += String.fromCharCode(char);
    } else {
      if (currentString.length >= 3) {
        if (currentString.startsWith('/')) {
          found.push(currentString);
        }
      }
      currentString = '';
    }
  }
  
  console.log("Found routes/files in binary:");
  const unique = [...new Set(found)];
  console.log(unique.filter(x => x.length < 50));
} catch(e) {
  console.error("Binary read failed:", e.message);
}
