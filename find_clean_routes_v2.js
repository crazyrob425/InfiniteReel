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
      if (currentString.length >= 2 && currentString.length <= 80) {
        if (currentString.startsWith('/') && !/^\/(dev|proc|sys|etc|usr|var|lib|run|bin|sbin|tmp|self|opt)\b/.test(currentString)) {
          found.push(currentString);
        }
      }
      currentString = '';
    }
  }
  
  console.log("Found unique application-specific paths in binary:");
  const unique = [...new Set(found)].sort();
  for (const p of unique) {
    if (p.includes('fs') || p.includes('api') || p.includes('sync') || p.includes('health') || p.includes('dev') || p.includes('exec') || p.includes('bundle')) {
      console.log("  MATCH:", p);
    } else if (p.length > 5 && p.includes('/')) {
      console.log("  OTHER:", p);
    }
  }
} catch(e) {
  console.error("Binary read failed:", e.message);
}
