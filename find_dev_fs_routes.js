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
      if (currentString.length >= 3 && currentString.startsWith('/')) {
        if (currentString.startsWith('/dev/') || currentString.startsWith('/fs/') || currentString.startsWith('/api/') || currentString.startsWith('/log/')) {
          found.push(currentString);
        }
      }
      currentString = '';
    }
  }
  
  console.log("Found routes matching /dev/, /fs/, /api/, /log/:");
  const unique = [...new Set(found)].sort();
  for (const p of unique) {
    if (p.length < 100) {
      console.log("  ", p);
    }
  }
} catch(e) {
  console.error("Binary read failed:", e.message);
}
