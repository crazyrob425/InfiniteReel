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
      if (currentString.length >= 8) {
        // Look for things that look like URLs, emails, project IDs, or audience claims
        if (currentString.includes('ais-') || currentString.includes('google') || currentString.includes('aud') || currentString.includes('client') || currentString.includes('.com')) {
          found.push(currentString);
        }
      }
      currentString = '';
    }
  }
  
  console.log("Found matching strings in binary (showing unique top 100):");
  const unique = [...new Set(found)].slice(0, 100);
  console.log(unique);
} catch(e) {
  console.error("Binary read failed:", e.message);
}
