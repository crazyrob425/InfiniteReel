const { spawn, execSync } = require('child_process');
const fs = require('fs');

try {
  console.log("Killing existing control plane at PID 6...");
  try {
    process.kill(6, 'SIGKILL');
    console.log("Killed PID 6.");
  } catch(e) {
    console.log("Kill PID 6 failed or already dead:", e.message);
  }

  // Double check if there is any other process listening on 8000
  try {
    const list = execSync('lsof -i :8000 || ss -lptn', { encoding: 'utf8' });
    console.log("Port 8000 status:", list);
  } catch(e) {
    console.log("lsof failed (likely port is free now).");
  }

  console.log("Starting control plane with LOCAL_DEV_SKIP_AUTH=true...");
  const out = fs.openSync('/app/applet/cp_stdout.log', 'a');
  const err = fs.openSync('/app/applet/cp_stderr.log', 'a');

  const cp = spawn('/app/control-plane-api/control-plane-api', [
    '--listen-addr=:8000',
    '--app-dir=/app/applet',
    '--default-app-port=3000'
  ], {
    env: {
      ...process.env,
      LOCAL_DEV_SKIP_AUTH: 'true'
    },
    detached: true,
    stdio: ['ignore', out, err]
  });

  cp.unref();
  console.log("Control plane spawned with PID:", cp.pid);

  // Wait 1.5 seconds and check logs
  setTimeout(() => {
    try {
      console.log("Stdout log contents:");
      console.log(fs.readFileSync('/app/applet/cp_stdout.log', 'utf8'));
      console.log("Stderr log contents:");
      console.log(fs.readFileSync('/app/applet/cp_stderr.log', 'utf8'));
    } catch(e) {
      console.error(e.message);
    }
  }, 1500);

} catch(e) {
  console.error("Failed to restart control plane:", e);
}
