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
      if (currentString.includes('__aistudio_internal_control_plane')) {
        found.push(currentString);
      }
      currentString = '';
    }
  }
  
  console.log("Matching __aistudio_internal_control_plane strings:");
  console.log([...new Set(found)]);
} catch(e) {
  console.error("Binary read failed:", e.message);
}
