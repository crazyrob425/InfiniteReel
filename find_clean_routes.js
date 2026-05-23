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
      if (currentString.length >= 4 && currentString.length <= 40) {
        if (currentString.startsWith('/') && /^\/[a-zA-Z0-9\/\-_]+$/.test(currentString)) {
          found.push(currentString);
        }
      }
      currentString = '';
    }
  }
  
  console.log("Matching clean routes in binary:");
  const unique = [...new Set(found)];
  console.log(unique);
} catch(e) {
  console.error("Binary read failed:", e.message);
}
