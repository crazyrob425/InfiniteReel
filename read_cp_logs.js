const fs = require('fs');
try {
  console.log("=== STDOUT ===");
  console.log(fs.readFileSync('/app/applet/cp_stdout.log', 'utf8'));
} catch(e) {
  console.error(e.message);
}
try {
  console.log("=== STDERR ===");
  console.log(fs.readFileSync('/app/applet/cp_stderr.log', 'utf8'));
} catch(e) {
  console.error(e.message);
}
