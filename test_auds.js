const http = require('http');

function getMetadata(path) {
  return new Promise((resolve) => {
    const req = http.get({
      host: 'metadata.google.internal',
      path: path,
      headers: { 'Metadata-Flavor': 'Google' },
      timeout: 1000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

function callControlPlane(path, authHeader) {
  return new Promise((resolve) => {
    const req = http.get({
      host: '127.0.0.1',
      port: 8000,
      path: path,
      headers: { 'Authorization': authHeader },
      timeout: 2000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

async function run() {
  const audiences = [
    'cd14ae38-342a-4466-accb-8b30662ce9e6',
    process.env.APPLET_ID,
    'https://ais-dev-w5tmoehhu7epa7hjmygm3y-3816129130.us-east5.run.app',
    'control-plane-api'
  ];

  for (const aud of audiences) {
    if (!aud) continue;
    console.log(`\nTesting audience: ${aud}`);
    const idTokenRes = await getMetadata(`/computeMetadata/v1/instance/service-accounts/default/identity?audience=${encodeURIComponent(aud)}`);
    console.log(`- Fetch ID Token status:`, idTokenRes.status);
    const idToken = idTokenRes.data ? idTokenRes.data.trim() : '';
    if (idToken) {
      const resSync = await callControlPlane('/sync', `Bearer ${idToken}`);
      console.log(`- /sync Response:`, resSync.status, resSync.data);
      const resFiles = await callControlPlane('/files', `Bearer ${idToken}`);
      console.log(`- /files Response:`, resFiles.status, resFiles.data.slice(0, 200));
    }
  }
}

run();
